#!/bin/zsh
# Template: runs a lecture or paper companion headless in a work folder, all stages in one go
# (SKILL.md, "Making a companion"). Copy it, run.conf, runlib.sh and logstate.py from this
# folder into the work folder, fill run.conf and the briefs (companion-*.md -> brief-*.md), run
# the waste check, then start it detached:
#   nohup caffeinate -dims ./run-companion.sh all > run-all.out 2>&1 &
#
# Stages, chained without the conductor (every stage writes its done file last):
#   1 transcribe  one session per chunk, in parallel     brief-transcribe.md + brief-transcribe-<t>.md
#                 -> sources/transcripts/*.md, done-transcribe-<t>.md   (skipped when TRANSCRIBE=())
#   2 contracts   one session per page, in PAGES order   brief-contract.md + brief-contract-<p>.md
#                 -> contract-<p>.md, header-<p>.Rmd, done-contract-<p>.md
#   3 per page (pages side by side when PARALLEL_PAGES=1):
#     writers     one after another                       brief-writer.md (<PAGE>, <K>, <N> filled in)
#                 each gets contract-<p>-<k>.md (the contract's shared part and its own part, cut by
#                 this script) -> part-<p>-<k>.Rmd, notes-<p>-<k>.md
#     then two stages side by side, both reading page-<p>.Rmd (header + parts), then their scripts:
#     figures     the contract's list figs-<p>.md, cut by tools/figures-splice.py into
#                 figs-<p>/list-<k>.md (FIGS_PER_WORKER each); one session per list, side by side
#                 brief-figures.md (<PAGE>, <K>) -> figs-<p>/frag-<id>.Rmd, live-<id>.js, notes-<k>.md;
#                 then tools/figures-splice.py puts each fragment at its marker `<!-- live: <id> -->`
#                 in the parts and copies the scripts to live/ -> figures-<p>.md
#     punches     tools/punches.py items -> punch-items-<p>.md; brief-punch.md + punch-examples.md
#                 to Codex (CODEX_PUNCH_MODEL, punches) and Claude (MODEL_NEED, need lines), side by
#                 side -> punch-astra-<p>.md, punch-opus-<p>.md; then tools/punches.py insert puts
#                 astra's punches and Opus's need lines into the parts -> punches-<p>.md (if Codex
#                 wrote nothing: Opus's punches, noted in punch-fallback-<p>.txt)
#     build       script: header + parts -> page-<p>.Rmd, knit, render, phone check -> build-<p>.out
#     reader      brief-reader.md (<PAGE>) -> open-<p>.md (questions for RMB), review-<p>.md
#     fixer       brief-fixer.md (<PAGE>): applies every finding of review-<p>.md -> fixed-<p>.md
#     build       script again -> page-<p>.html, build-<p>-final.out
#   optional, on finished pages: ./run-companion.sh mathcheck
#     mathcheck   one session per part, all parts side by side   brief-mathcheck.md (<PAGE>, <K>)
#                 + brief-mathcheck-<p>-<k>.md (that part's sources only)
#                 corrects part-<p>-<k>.Rmd in place -> mathcheck-<p>-<k>.md; then build per page
#                 -> build-<p>-mathcheck.out. Needs the parts, header-<p>.Rmd and sources/.
#   4 summary     script: run-done.md (what each page has, open questions, usage per stage), and a
#                 desktop notification. The conductor waits for run-done.md or limit-*.txt
#                 (accounts.md Ac1g).
#   rework mode (REWORK=1 in run.conf; SKILL.md Mc9): a finished page brought up to newer rules.
#     No transcription, contract or writers. The conductor cuts each page into header-<p>.Rmd and
#     one part part-<p>-1.Rmd (WRITERS=(1 ...)) and keeps before-<p>.Rmd. Per page a planner
#     (brief-rework.md + brief-rework-<p>.md, MODEL_REWORK) edits the part -> rework-<p>.md; then
#     figures, punches, build, reader, fixer as above; the reader gets diff-<p>.txt (before -> now).
# Nothing in the run waits for the conductor except a usage limit by day (runlib.sh).
# Rerunnable: a stage whose done file exists is skipped. Single steps, for repairs:
#   ./run-companion.sh transcribe | contracts | chain <page> | figures <page> | punches <page> | summary
#   (figures and punches alone: the parts must exist; their scripts run at the end of each)
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
CODEX_WAIT="$HOME/.agent-skills-shared/big-tasks/scripts/codex_turn_wait.sh"

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

assemble_page() {  # assemble_page <page>: header + parts -> page-<p>.Rmd
  local p=$1 k
  cat header-$p.Rmd > page-$p.Rmd
  for k in $(seq 1 $(writers_of $p)); do printf '\n' >> page-$p.Rmd; cat part-$p-$k.Rmd >> page-$p.Rmd; done
}

build_page() {  # build_page <page> <output file>
  local p=$1 out=$2 rc
  assemble_page $p
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

figure_sessions() {  # figure_sessions <page>: the figure workers side by side (no edits to the parts)
  local p=$1 n k pids=() rc=0
  n=$(python3 -I "$RENDERER/tools/figures-splice.py" split "$D" $p "${FIGS_PER_WORKER:-3}") || return 1
  (( n )) || { echo "[figures-$p] no figure list (figs-$p.md)"; return 0; }
  for k in $(seq 1 $n); do
    brief_for brief-figures.md figs-$p-$k.brief figs-$p/list-$k.md "s/<PAGE>/$p/g; s/<K>/$k/g"
    ( LIMIT=limit-figs-$p-$k.txt DECISION=decision-figs-$p-$k.txt
      stage_as "$MODEL_FIGURES" figs-$p-$k figs-$p-$k.brief figs-$p/notes-$k.md ) > chain-figs-$p-$k.out 2>&1 &
    pids+=($!); sleep 10   # start sessions apart (accounts.md Ac1e)
  done
  for k in $pids; do wait "$k" || rc=1; done   # these pids only (accounts.md Ac1f)
  return $rc
}

punch_sessions() {  # punch_sessions <page>: Codex (punches) and Claude (need lines) side by side
  local p=$1 pid1 pid2="" rc=0 f
  python3 -I "$RENDERER/tools/punches.py" items page-$p.Rmd punch-items-$p.md || return 1
  brief_for brief-punch.md punch-$p.base punch-examples.md "s/<PAGE>/$p/g"
  { cat punch-$p.base; printf '\nOutput file: `punch-astra-%s.md` in this folder (write it with your file tools).\n' $p; } > punch-astra-$p.brief
  { cat punch-$p.base; printf '\nOutput file: `punch-opus-%s.md` in this folder.\n' $p; } > punch-opus-$p.brief
  ( LIMIT=limit-punch-$p.txt DECISION=decision-punch-$p.txt
    stage_as "$MODEL_NEED" punch-opus-$p punch-opus-$p.brief punch-opus-$p.md ) > chain-punch-opus-$p.out 2>&1 &
  pid1=$!; sleep 10
  if [[ ! -s punch-astra-$p.md ]]; then
    ( "$CODEX_WAIT" "$D" astra-$p "$D/punch-astra-$p.brief" -m "$CODEX_PUNCH_MODEL" \
        -c 'model_reasoning_effort="high"' > chain-punch-astra-$p.out 2>&1
      # Codex sometimes answers in its reply instead of the file (seen 2026-11-25): take the reply
      [[ -s punch-astra-$p.md ]] || { f=$(ls -t astra-$p-turn-*.md 2>/dev/null | head -1); [[ -n "$f" ]] && cp "$f" punch-astra-$p.md; } ) &
    pid2=$!
  fi
  wait "$pid1" || rc=1; [[ -n "$pid2" ]] && wait "$pid2"   # these pids only (accounts.md Ac1f)
  python3 "$USAGE" codex > usage-codex-$p.txt 2>&1
  return $rc
}

figures() {  # figures <page>: figure sessions, then the splice into the parts
  figure_sessions $1; local rc=$?
  [[ -s figs-$1.md ]] && { python3 -I "$RENDERER/tools/figures-splice.py" "$D" $1 || rc=1; }
  return $rc
}

punch_insert() {  # punch_insert <page>: astra's punches and Opus's need lines into the parts
  local p=$1 pf=punch-astra-$1.md
  [[ -s punch-opus-$p.md ]] || { echo "[punches-$p] no need lines: see chain-punch-opus-$p.out"; return 1; }
  if grep -q '^Punch:' $pf 2>/dev/null; then rm -f punch-fallback-$p.txt
  else
    pf=punch-opus-$p.md
    echo "Codex wrote no punches (see chain-punch-astra-$p.out): Opus's punches used" | tee punch-fallback-$p.txt
  fi
  python3 -I "$RENDERER/tools/punches.py" insert "$D" $p $pf punch-opus-$p.md
}

punches() {  # punches <page>: punch sessions, then the need lines and punches into the parts
  assemble_page $1
  punch_sessions $1; punch_insert $1
}

chain() {  # chain <page>: writers (or the rework planner), figures and punches, build, reader, fixer, build
  local p=$1 n k
  n=$(writers_of $p); [[ -n "$n" ]] || { echo "page $p not in run.conf"; return 1; }
  if (( ${REWORK:-0} )); then
    [[ -s header-$p.Rmd && -s part-$p-1.Rmd && -s before-$p.Rmd ]] \
      || { echo "[chain-$p] rework needs header-$p.Rmd, part-$p-1.Rmd and before-$p.Rmd"; return 1; }
    brief_for brief-rework.md rework-$p.brief brief-rework-$p.md "s/<PAGE>/$p/g"
    stage_as "$MODEL_REWORK" rework-$p rework-$p.brief rework-$p.md || { echo "stopping after the planner of $p"; return 1; }
    n=0   # no writers
  else
    [[ -s done-contract-$p.md ]] || { echo "[chain-$p] no contract yet"; return 1; }
  fi
  for (( k = 1; k <= n; k++ )); do   # not seq: on macOS `seq 1 0` counts down
    cut_contract $p $k
    brief_for brief-writer.md writer-$p-$k.brief "" "s/<PAGE>/$p/g; s/<K>/$k/g; s/<N>/$n/g"
    stage_as "$MODEL_WRITER" writer-$p-$k writer-$p-$k.brief notes-$p-$k.md \
      || { echo "stopping after writer $p-$k"; return 1; }
  done
  # figures and punches: the sessions side by side, then the two scripts one after the other
  # (both edit the parts). A failure here is reported in run-done.md; the chain goes on.
  assemble_page $p
  local pf pp
  ( figure_sessions $p ) > chain-figures-$p.out 2>&1 & pf=$!
  ( punch_sessions $p ) > chain-punches-$p.out 2>&1 & pp=$!
  wait "$pf" || echo "[chain-$p] a figure session failed: see chain-figures-$p.out"
  wait "$pp" || echo "[chain-$p] a punch session failed: see chain-punches-$p.out"
  [[ -s figs-$p.md ]] && { python3 -I "$RENDERER/tools/figures-splice.py" "$D" $p \
    || echo "[chain-$p] figures not all placed: see figures-$p.md"; }
  punch_insert $p || echo "[chain-$p] no punches or need lines inserted"
  build_page $p build-$p.out   # a failed build still goes to the reader, who lists it
  (( ${REWORK:-0} )) && { diff -u before-$p.Rmd page-$p.Rmd > diff-$p.txt; true; }
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

mathcheck() {  # every part of every page side by side, then a build per page
  # ENGINE_MATHCHECK=codex runs each part as one Codex turn (big-tasks accounts.md Co1) with
  # CODEX_MODEL at high effort; the reply goes to codex-mathcheck-<p>-<k>/, the done file is the
  # same. Codex's sandbox cannot run WebKit, so the builds stay here, after the turns.
  local p k n pids=() rc=0
  for p in $PAGES; do
    n=$(writers_of $p)
    for k in $(seq 1 $n); do
      brief_for brief-mathcheck.md mathcheck-$p-$k.brief brief-mathcheck-$p-$k.md "s/<PAGE>/$p/g; s/<K>/$k/g"
      if [[ "${ENGINE_MATHCHECK:-claude}" == codex ]]; then
        [[ -f brief-codex.md ]] && { printf '\n'; cat brief-codex.md; } >> mathcheck-$p-$k.brief
        [[ -s mathcheck-$p-$k.md ]] && { echo "[mathcheck-$p-$k] already done"; continue; }
        "$HOME/.agent-skills-shared/big-tasks/scripts/codex_turn_wait.sh" "$D" mathcheck-$p-$k \
          mathcheck-$p-$k.brief -m "$CODEX_MODEL" -c 'model_reasoning_effort="high"' \
          > chain-mathcheck-$p-$k.out 2>&1 &
      else
        ( LIMIT=limit-mathcheck-$p-$k.txt DECISION=decision-mathcheck-$p-$k.txt
          stage_as "$MODEL_MATHCHECK" mathcheck-$p-$k mathcheck-$p-$k.brief mathcheck-$p-$k.md ) \
          > chain-mathcheck-$p-$k.out 2>&1 &
      fi
      pids+=($!); sleep 10   # start sessions apart (accounts.md Ac1e)
    done
  done
  for k in $pids; do wait "$k" || rc=1; done   # these pids only (accounts.md Ac1f)
  for p in $PAGES; do   # build a page only when every part of it finished its check
    n=$(writers_of $p); local missing=()
    for k in $(seq 1 $n); do [[ -s mathcheck-$p-$k.md ]] || missing+=($p-$k); done
    if (( ${#missing} )); then
      print -r -- "math check unfinished: ${missing[*]} (see chain-mathcheck-*.out); rerun ./run-companion.sh mathcheck to resume" \
        | tee -a limit-mathcheck.txt
      osascript -e "display notification \"Math check stopped: ${missing[*]}\" with title \"Report run\"" 2>/dev/null
      rc=1; continue
    fi
    build_page $p build-$p-mathcheck.out || rc=1
  done
  [[ "${ENGINE_MATHCHECK:-claude}" == codex ]] && python3 "$USAGE" codex > usage-codex.txt 2>&1
  return $rc
}

summary() {
  local p f
  {
    print -r -- "# Run finished $(date '+%Y-%m-%d %H:%M')"
    for p in $PAGES; do
      print -r -- $'\n'"## Page $p"
      if [[ -s build-$p-mathcheck.out && ! -s build-$p-final.out ]]; then
        : # a math-check run on finished pages: its build is reported below
      elif [[ -s build-$p-final.out ]]; then
        print -r -- "Final build: $(tail -1 build-$p-final.out) (0 = page-$p.html built and phone-checked; see build-$p-final.out)."
      else
        print -r -- "No final build: the chain stopped early; see chain-$p.out."
      fi
      if [[ -s figures-$p.md ]]; then print -r -- "Figures: $(sed -n 3p figures-$p.md) $(sed -n 5,6p figures-$p.md | tr '\n' ' ')"
      else print -r -- "Figures: none (no list figs-$p.md from the contract, or the stage did not run)."; fi
      [[ -s punches-$p.md ]] && print -r -- "Punches: $(sed -n 3p punches-$p.md)"
      [[ -s punch-fallback-$p.txt ]] && print -r -- "Punches: $(cat punch-fallback-$p.txt)"
      [[ -s fixed-$p.md ]] && print -r -- "Fixer: fixed-$p.md."
      for f in mathcheck-$p-<->.md(N); do print -r -- "Math check: $f ($(head -1 $f))"; done
      [[ -s build-$p-mathcheck.out ]] && print -r -- "Build after math check: $(tail -1 build-$p-mathcheck.out)."
      [[ -s open-$p.md ]] && print -r -- "Questions for RMB: open-$p.md ($(grep -cE '^(\*\*)?Q[0-9]' open-$p.md) items)."   # labels may be bold
    done
    print -r -- $'\n## Usage per stage\n'
    for f in *.log.jsonl(N); do print -r -- "${f%.log.jsonl}: $(python3 "$USAGE" claude "$f" 2>/dev/null | tail -1)"; done
    for f in usage-codex*.txt(N); do print -r -- "Codex (${f:r}): $(tail -1 $f)"; done
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
  figures)    waste_gate "${0:t}" && assemble_page "${2:?page}" && figures "$2" ;;
  punches)    waste_gate "${0:t}" && punches "${2:?page}" ;;
  mathcheck)  waste_gate "${0:t}" || exit 1
              mathcheck; rc=$?; summary; exit $rc ;;
  summary)    summary ;;
  *) echo "usage: $0 all | transcribe | contracts | chain <page> | figures <page> | punches <page> | mathcheck | summary"; exit 1 ;;
esac
