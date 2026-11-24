#!/bin/zsh
# Template: runs a lecture or paper companion headless in a work folder, all stages in one go
# (SKILL.md, "Making a companion"). Copy it, run.conf, runlib.sh and logstate.py from this
# folder into the work folder, fill run.conf and the briefs (companion-*.md -> brief-*.md), run
# the waste check, then start it detached:
#   nohup caffeinate -dims ./run-companion.sh all > run-all.out 2>&1 &
#
# Stages, chained without the conductor (every stage writes its done file last):
#   1 transcribe  one session per chunk, in parallel     brief-transcribe.md + brief-transcribe-<t>.md
#                 -> sources/transcript-<t>.md, done-transcribe-<t>.md   (skipped when TRANSCRIBE=())
#   2 contracts   one session per page, in PAGES order   brief-contract.md + brief-contract-<p>.md
#                 -> contract-<p>.md, header-<p>.Rmd, done-contract-<p>.md
#   3 per page (pages side by side when PARALLEL_PAGES=1):
#     writers     one after another                       brief-writer.md (<PAGE>, <K>, <N> filled in)
#                 each gets contract-<p>-<k>.md (the contract's shared part and its own part, cut by
#                 this script) -> part-<p>-<k>.Rmd, notes-<p>-<k>.md
#     build       script: header + parts -> page-<p>.Rmd, knit, render, phone check -> build-<p>.out
#     reader      brief-reader.md (<PAGE>) -> open-<p>.md (questions for RMB), review-<p>.md
#     fixer       brief-fixer.md (<PAGE>): applies every finding of review-<p>.md -> fixed-<p>.md
#     build       script again -> page-<p>.html, build-<p>-final.out
#   4 summary     script: run-done.md (what each page has, open questions, usage per stage), and a
#                 desktop notification. The conductor waits for run-done.md or limit-*.txt
#                 (accounts.md Ac1g).
# Nothing in the run waits for the conductor except a usage limit by day (runlib.sh).
# Rerunnable: a stage whose done file exists is skipped. Single steps, for repairs:
#   ./run-companion.sh transcribe | contracts | chain <page> | summary
# Before anything starts, waste_gate checks that the waste check saw exactly these briefs, this
# runner and run.conf (big-tasks Wc1-Wc5):
#   ~/.agent-skills-shared/big-tasks/scripts/waste_check.sh "$PWD" run-companion.sh "<launch command>"
# Usage limits: one limit/decision file pair per chain (limit-<chain>.txt, decision-<chain>.txt);
# the rest is in runlib.sh. To resume a stopped stage by hand:
#   CFG_OVERRIDE="$HOME/.claude" RESUME_STAGE=<stage> ./run-companion.sh chain <page>
cd "${0:A:h}" || exit 1
D="$PWD"
CFG="${CFG_OVERRIDE:-$HOME/.claude-second}"   # account the stages start on
OTHER_CFG="$HOME/.claude"; [[ "$CFG" == "$HOME/.claude" ]] && OTHER_CFG="$HOME/.claude-second"
source "$D/run.conf" || exit 1
source "$D/runlib.sh" || exit 1
RENDERER="$HOME/Documents/Works/report-renderer"

stage_as() {  # stage_as <model> <name> <brief> <done file>
  local MODEL=$1; shift
  run_stage "$@"
}

brief_for() {  # brief_for <common brief> <out> [appendix] [sed expression]: fills one brief
  local common=$1 out=$2 extra=${3:-} expr=${4:-}
  { cat "$common"; [[ -n "$extra" && -f "$extra" ]] && { printf '\n'; cat "$extra"; } } \
    | sed "${expr:-s/^//}" > "$out"
}

transcribe() {
  local t pids=() rc=0
  (( ${#TRANSCRIBE} )) || { echo "[transcribe] nothing to transcribe"; return 0; }
  for t in $TRANSCRIBE; do
    brief_for brief-transcribe.md transcribe-$t.brief brief-transcribe-$t.md
    ( LIMIT=limit-transcribe-$t.txt DECISION=decision-transcribe-$t.txt
      stage_as "$MODEL_TRANSCRIBE" transcribe-$t transcribe-$t.brief done-transcribe-$t.md ) &
    pids+=($!); sleep 10   # start sessions apart (accounts.md Ac1e)
  done
  for t in $pids; do wait "$t" || rc=1; done   # these pids only (accounts.md Ac1f)
  return $rc
}

contracts() {  # one after another: a later page's contract may cite an earlier page's labels
  local p
  for p in $PAGES; do
    brief_for brief-contract.md contract-$p.brief brief-contract-$p.md "s/<PAGE>/$p/g"
    stage_as "$MODEL_CONTRACT" contract-$p contract-$p.brief done-contract-$p.md || return 1
  done
}

cut_contract() {  # cut_contract <page> <k>: the shared part (before the first "## Part ") + part k
  awk -v k="$2" '
    /^## Part [0-9]+/ { part = $3 + 0; inpart = 1 }
    !inpart || part == k' contract-$1.md > contract-$1-$2.md
}

build_page() {  # build_page <page> <output file>
  local p=$1 out=$2 k
  cat header-$p.Rmd > page-$p.Rmd
  for k in $(seq 1 $(writers_of $p)); do printf '\n' >> page-$p.Rmd; cat part-$p-$k.Rmd >> page-$p.Rmd; done
  local rc
  ( Rscript -e "knitr::knit('page-$p.Rmd')" && "$RENDERER/render.sh" page-$p.md \
    && NODE_PATH=$(npm root -g) node "$RENDERER/phone-check.js" "$PWD/page-$p.html" ) > "$out" 2>&1
  rc=$?
  echo "build exit: $rc" >> "$out"
  echo "[build-$p] exit $rc, see $out"
  return $rc
}

writers_of() {  # writers_of <page>: its entry in WRITERS
  local i; i=${PAGES[(i)$1]}; print -r -- ${WRITERS[$i]}
}

chain() {  # chain <page>: writers, build, reader, fixer, build
  local p=$1 n k
  n=$(writers_of $p); [[ -n "$n" ]] || { echo "page $p not in run.conf"; return 1; }
  [[ -s done-contract-$p.md ]] || { echo "[chain-$p] no contract yet"; return 1; }
  for k in $(seq 1 $n); do
    cut_contract $p $k
    brief_for brief-writer.md writer-$p-$k.brief "" "s/<PAGE>/$p/g; s/<K>/$k/g; s/<N>/$n/g"
    stage_as "$MODEL_WRITER" writer-$p-$k writer-$p-$k.brief notes-$p-$k.md \
      || { echo "stopping after writer $p-$k"; return 1; }
  done
  build_page $p build-$p.out   # a failed build still goes to the reader, who lists it
  brief_for brief-reader.md reader-$p.brief "" "s/<PAGE>/$p/g"
  stage_as "$MODEL_READER" reader-$p reader-$p.brief review-$p.md || return 1
  brief_for brief-fixer.md fixer-$p.brief "" "s/<PAGE>/$p/g"
  stage_as "$MODEL_FIXER" fixer-$p fixer-$p.brief fixed-$p.md || return 1
  build_page $p build-$p-final.out
}

chains() {
  local p pids=() rc=0
  for p in $PAGES; do
    if (( PARALLEL_PAGES )); then
      ( LIMIT=limit-$p.txt; DECISION=decision-$p.txt; chain $p ) > chain-$p.out 2>&1 &
      pids+=($!)
    else
      ( LIMIT=limit-$p.txt; DECISION=decision-$p.txt; chain $p ) > chain-$p.out 2>&1 || rc=1
    fi
  done
  for p in $pids; do wait "$p" || rc=1; done   # these pids only (accounts.md Ac1f)
  return $rc
}

summary() {
  local p f
  {
    print -r -- "# Run finished $(date '+%Y-%m-%d %H:%M')"
    for p in $PAGES; do
      print -r -- $'\n'"## Page $p"
      if [[ -s build-$p-final.out ]]; then
        print -r -- "Final build: $(tail -1 build-$p-final.out) (0 = page-$p.html built and phone-checked; see build-$p-final.out)."
      else
        print -r -- "No final build: the chain stopped early; see chain-$p.out."
      fi
      [[ -s fixed-$p.md ]] && print -r -- "Fixer: fixed-$p.md."
      [[ -s open-$p.md ]] && print -r -- "Questions for RMB: open-$p.md ($(grep -c '^Q[0-9]' open-$p.md) items)."
    done
    print -r -- $'\n## Usage per stage\n'
    for f in *.log.jsonl(N); do print -r -- "${f%.log.jsonl}: $(python3 "$USAGE" claude "$f" 2>/dev/null | tail -1)"; done
  } > run-done.md
  osascript -e 'display notification "Companion run finished: run-done.md" with title "Report run"' 2>/dev/null
  echo "summary: run-done.md"
}

case "$1" in
  all)        waste_gate "${0:t}" || exit 1
              transcribe && contracts && chains; rc=$?
              summary; exit $rc ;;
  transcribe) waste_gate "${0:t}" && transcribe ;;
  contracts)  waste_gate "${0:t}" && contracts ;;
  chain)      waste_gate "${0:t}" && chain "${2:?page}" ;;
  summary)    summary ;;
  *) echo "usage: $0 all | transcribe | contracts | chain <page> | summary"; exit 1 ;;
esac
