#!/bin/zsh
# Template: runs the stages of a topic introduction headless in a work folder
# (SKILL.md, "Making a topic introduction"). Copy it, runlib.sh and logstate.py from this folder, into the
# work folder; set the accounts below (big-tasks/accounts.md); then
#   ./run-stage.sh outline      brief-outline.md   -> outline.md, plan.md
#   ./run-stage.sh writers 3    writers 1..3 one after another (brief-writer.md + brief-writer-N.md)
#   ./run-stage.sh assembler    brief-assembler.md -> assembly-report.md (last file it writes)
#   ./run-stage.sh all 3        writers, then assembler
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

writers() {
  local n
  for n in $(seq 1 "${1:?number of writers}"); do
    cat brief-writer.md brief-writer-$n.md > writer-$n.brief
    run_stage writer-$n writer-$n.brief notes-$n.md || { echo "stopping after writer $n"; return 1; }
    ls -la part-$n.Rmd notes-$n.md 2>/dev/null || true   # a listing only: never a failure
  done
}

case "$1" in
  outline)   run_stage outline brief-outline.md plan.md ;;
  writers)   writers "$2" ;;
  assembler) run_stage assembler brief-assembler.md assembly-report.md ;;
  all)       writers "${2:?number of writers}" && run_stage assembler brief-assembler.md assembly-report.md ;;
  *) echo "usage: $0 outline | writers <n> | assembler | all <n>"; exit 1 ;;
esac
