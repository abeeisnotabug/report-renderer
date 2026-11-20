#!/bin/zsh
# Template: runs the stages of a topic introduction headless in a work folder
# (SKILL.md, "Making a topic introduction"). Copy it into the work folder and set the accounts
# (big-tasks/accounts.md); then
#   ./run-stage.sh outline      reads brief-outline.md, writes outline.md and plan.md
#   ./run-stage.sh writers 3    writers 1..3 one after another (brief-writer.md + brief-writer-N.md)
#   ./run-stage.sh assembler    reads brief-assembler.md
# Each stage logs to <stage>.log.jsonl and prints its cost. The writers stop at the first writer
# that leaves no notes-N.md or ends with an error (e.g. a usage limit), because notes-N.md is
# written last.
cd "${0:A:h}" || exit 1
D="$PWD"
OUTLINE_CFG="$HOME/.claude-second"     # account per stage: set before running
WRITER_CFG="$HOME/.claude-second"
ASSEMBLER_CFG="$HOME/.claude"
run() {  # run <config dir> <log name>; the brief comes on standard input
  env CLAUDE_CONFIG_DIR="$1" caffeinate -di claude -p --model claude-opus-5-5 --effort high \
    --setting-sources "" --strict-mcp-config --disable-slash-commands \
    --tools "Read,Write,Edit,Glob,Grep,Bash" --permission-mode auto \
    --add-dir "$D" --add-dir "$HOME/Documents/Works/report-renderer" \
    --output-format stream-json --verbose > "$2.log.jsonl" 2> "$2.log.stderr"
  local rc=$?
  python3 ~/.agent-skills-shared/big-tasks/scripts/usage.py claude "$2.log.jsonl"
  return $rc
}
failed() {  # failed <log name>: true if the run ended with an error
  local err=$(grep '"type":"result"' "$1.log.jsonl" | tail -1 \
    | python3 -c 'import json,sys; print(json.loads(sys.stdin.read()).get("is_error", True))' 2>/dev/null)
  [[ "$err" != "False" ]]
}
case "$1" in
  outline)
    run "$OUTLINE_CFG" outline < brief-outline.md; ls -la outline.md plan.md ;;
  writers)
    for n in $(seq 1 "${2:?number of writers}"); do
      cat brief-writer.md brief-writer-$n.md | run "$WRITER_CFG" writer-$n; rc=$?
      echo "writer $n exit $rc"; ls -la part-$n.Rmd notes-$n.md
      [[ $rc -eq 0 && -s notes-$n.md ]] && ! failed writer-$n || { echo "stopping after writer $n"; exit 1; }
    done ;;
  assembler)
    run "$ASSEMBLER_CFG" assembler < brief-assembler.md; ls -la *.Rmd assembly-report.md ;;
  *) echo "usage: $0 outline | writers <n> | assembler"; exit 1 ;;
esac
