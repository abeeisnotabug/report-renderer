#!/bin/zsh
# Template: runs the stages of a topic introduction headless in a work folder
# (SKILL.md, "Making a topic introduction"). Copy it, runlib.sh and logstate.py from this folder, into the
# work folder; set the accounts below (big-tasks/accounts.md); then
#   ./run-stage.sh outline      brief-outline.md   -> outline.md, plan.md
#   ./run-stage.sh writers 3    writers 1..3 one after another (brief-writer.md + brief-writer-N.md),
#                               then the figures of those parts
#   ./run-stage.sh figures 2 3  the interactive figures of parts 2 and 3 (figs-page.md, entries with
#                               `Part: <n>`): Opus workers side by side (brief-figures.md, <PAGE> =
#                               page), FIGS_PER_WORKER each -> figs-page/; then tools/figures-splice.py
#                               puts each at its marker `<!-- live: <id> -->` in part-N.Rmd, scripts
#                               to live/ -> figures-page.md. Figures already placed are not made again.
#   ./run-stage.sh assembler    brief-assembler.md -> assembly-report.md (last file it writes)
#   ./run-stage.sh all 3        writers and their figures, then assembler
# Order of a run (SKILL.md Ti4): outline; then writers 1 (the sample part, with its figures); RMB
# looks at the rendered page and approves or corrects it (corrections go into outline.md, plan.md, part-1.Rmd);
# then all <n>. `all` does not redo writer 1: writers() calls run_stage writer-1, which returns at
# once because its done-file notes-1.md exists (runlib.sh, run_stage: "already done"). To have
# writer 1 write again after corrections, delete notes-1.md and part-1.Rmd first.
# Start it detached: nohup caffeinate -dims ./run-stage.sh all 3 > run-all.out 2>&1 &
# Rerunnable: a stage whose done-file exists is skipped. Each attempt logs to
# <stage>[.rN].log.jsonl and prints its cost.
#
# Before it starts it checks that the waste check saw exactly these briefs and this runner
# (big-tasks Wc1-Wc5; runlib.sh waste_gate). Run the check after writing the briefs:
#   ~/.agent-skills-shared/big-tasks/scripts/waste_check.sh "$PWD" run-stage.sh "<launch command>"
# Usage limits: the comments at the top of runlib.sh (copy it and logstate.py into the work
# folder too). The conductor chat watches for limit.txt; the answer goes into decision.txt.
# To resume a stopped stage by hand (for example after the runner gave up):
#   CFG_OVERRIDE="$HOME/.claude" RESUME_STAGE=<stage> ./run-stage.sh ...   (stages before it are skipped)
cd "${0:A:h}" || exit 1
D="$PWD"
CFG="${CFG_OVERRIDE:-$HOME/.claude-second}"   # account the stages start on
OTHER_CFG="$HOME/.claude"         # account offered at a usage limit
source "$D/runlib.sh" || exit 1
waste_gate "${0:t}" || exit 1
RENDERER="$HOME/Documents/Works/report-renderer"
SPLICE="$RENDERER/tools/figures-splice.py"
: ${FIGS_PER_WORKER:=3}
: ${MODEL_FIGURES:=claude-opus-5-5}   # interactive figures (big-tasks measured facts, 2026-11-25)

figures() {  # figures <part numbers...>: workers side by side for those parts' figures, then the splice
  local parts=${(j:,:)@} tag="p${(j:-:)@}-" n k pids=() rc=0
  [[ -s figs-page.md ]] || { echo "[figures] no figure list figs-page.md"; return 0; }
  n=$(python3 -I "$SPLICE" split "$D" page "$FIGS_PER_WORKER" --tag "$tag" --only-parts "$parts" --parts 'part-*.Rmd') || return 1
  (( n )) || { echo "[figures] nothing to make for parts $parts"; return 0; }
  for k in $(seq 1 $n); do
    sed "s/<PAGE>/page/g; s/<K>/$tag$k/g" brief-figures.md > figs-$tag$k.brief
    { printf '\n'; cat figs-page/list-$tag$k.md; } >> figs-$tag$k.brief
    ( MODEL=$MODEL_FIGURES LIMIT=limit-figs-$tag$k.txt DECISION=decision-figs-$tag$k.txt
      run_stage figs-$tag$k figs-$tag$k.brief figs-page/notes-$tag$k.md ) > figs-$tag$k.out 2>&1 &
    pids+=($!); sleep 10   # start sessions apart (accounts.md Ac1e)
  done
  for k in $pids; do wait "$k" || rc=1; done   # these pids only (accounts.md Ac1f)
  python3 -I "$SPLICE" "$D" page --parts 'part-*.Rmd' || rc=1
  return $rc
}

writers() {
  local n
  for n in $(seq 1 "${1:?number of writers}"); do
    cat brief-writer.md brief-writer-$n.md > writer-$n.brief
    run_stage writer-$n writer-$n.brief notes-$n.md || { echo "stopping after writer $n"; return 1; }
    ls -la part-$n.Rmd notes-$n.md 2>/dev/null || true   # a listing only: never a failure
  done
  figures $(seq 1 "$1") || echo "[figures] not all figures made or placed: see figures-page.md"
}

case "$1" in
  outline)   run_stage outline brief-outline.md plan.md ;;
  writers)   writers "$2" ;;
  figures)   shift; figures "$@" ;;
  assembler) run_stage assembler brief-assembler.md assembly-report.md ;;
  all)       writers "${2:?number of writers}" && run_stage assembler brief-assembler.md assembly-report.md ;;
  *) echo "usage: $0 outline | writers <n> | figures <part...> | assembler | all <n>"; exit 1 ;;
esac
