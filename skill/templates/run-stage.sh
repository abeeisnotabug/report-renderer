#!/bin/zsh
# Template: runs the stages of a topic introduction headless in a work folder
# (SKILL.md, "Making a topic introduction"). Copy it, and logstate.py from this folder, into the
# work folder; set the accounts below (big-tasks/accounts.md); then
#   ./run-stage.sh outline      brief-outline.md   -> outline.md, plan.md
#   ./run-stage.sh writers 3    writers 1..3 one after another (brief-writer.md + brief-writer-N.md)
#   ./run-stage.sh assembler    brief-assembler.md -> assembly-report.md (last file it writes)
#   ./run-stage.sh all 3        writers, then assembler
# Start it detached: nohup caffeinate -dims ./run-stage.sh all 3 > run-all.out 2>&1 &
# Rerunnable: a stage whose done-file exists is skipped. Each attempt logs to
# <stage>[.rN].log.jsonl and prints its cost.
#
# Usage limit (big-tasks Co5a-Co5c, accounts.md Ac3, Ac3a): a watchdog stops a claude -p that
# hangs on the limit. The script then writes limit.txt (stage, session, account, reset time) and
# a desktop notification; the conductor chat watches for limit.txt and asks RMB. The answer goes
# into decision.txt, one word:
#   wait      wait for the reset, resume the same session on the same account
#   move      copy the session to OTHER_CFG and resume it there (later stages stay there)
#   restart   start the stage fresh on OTHER_CFG (later stages stay there)
# By day (DAY_START to DAY_END) the script waits for decision.txt; at night it waits for the reset
# and resumes, unless decision.txt arrives first. It never restarts a stage on the same account.
# To resume a stopped stage by hand (for example after the runner gave up):
#   CFG_OVERRIDE="$HOME/.claude" RESUME_STAGE=<stage> ./run-stage.sh ...   (stages before it are skipped)
# Tested 2026-11-20 on the normal path; 2026-11-21 the limit path with "move" (CCFA example
# rework): the move itself worked (the resumed session had its full context), but the first
# resume failed with "Not logged in" because CLAUDE_CONFIG_DIR was set to ~/.claude; fixed above.
cd "${0:A:h}" || exit 1
D="$PWD"
CFG="${CFG_OVERRIDE:-$HOME/.claude-second}"   # account the stages start on
OTHER_CFG="$HOME/.claude"         # account offered at a usage limit
DAY_START=8 DAY_END=22            # daytime hours: pause for RMB's decision
STATE="$D/logstate.py"
USAGE="$HOME/.agent-skills-shared/big-tasks/scripts/usage.py"
MAX_ATTEMPTS=12
RESUME_MSG='You were interrupted (a usage limit). Continue the task of your brief from where you stopped: look at what is already in this folder and do not redo finished work.'

claude_run() {  # claude_run <log name> <session args...>; the message comes on standard input
  local log=$1; shift
  # The first account works only with CLAUDE_CONFIG_DIR unset: set explicitly to ~/.claude,
  # claude reports "Not logged in" (seen 2026-11-21).
  local envset=(CLAUDE_CONFIG_DIR="$CFG"); [[ "$CFG" == "$HOME/.claude" ]] && envset=(-u CLAUDE_CONFIG_DIR)
  env "${envset[@]}" claude -p --model claude-opus-5-5 --effort high \
    --setting-sources "" --strict-mcp-config --disable-slash-commands \
    --tools "Read,Write,Edit,Glob,Grep,Bash" --permission-mode auto \
    --add-dir "$D" --add-dir "$HOME/Documents/Works/report-renderer" \
    "$@" --output-format stream-json --verbose > "$log.log.jsonl" 2> "$log.log.stderr"
}

failed() {  # failed <log name>: true if the run's last result is an error or missing
  local err=$(grep '"type":"result"' "$1.log.jsonl" 2>/dev/null | tail -1 \
    | python3 -c 'import json,sys; print(json.loads(sys.stdin.read()).get("is_error", True))' 2>/dev/null)
  [[ "$err" != "False" ]]
}

move_session() {  # move_session <session id> <from config> <to config> (accounts.md Ac3b)
  local key; key=$(print -r -- "$D" | sed 's/[^A-Za-z0-9]/-/g')
  mkdir -p "$3/projects/$key" || return 1
  cp "$2/projects/$key/$1.jsonl" "$3/projects/$key/" || return 1
  [[ -d "$2/projects/$key/$1" ]] && cp -R "$2/projects/$key/$1" "$3/projects/$key/"
  return 0
}

on_limit() {  # on_limit <stage> <reset epoch>; changes sid, fresh, CFG of run_stage (zsh scoping)
  local name=$1 resume_at=$(( $2 + 300 )) h d
  (( resume_at > $(date +%s) )) || resume_at=$(( $(date +%s) + 600 ))
  rm -f decision.txt
  printf 'stage: %s\nsession: %s\naccount: %s\nresume possible: %s\n' \
    "$name" "$sid" "$CFG" "$(date -r $resume_at)" > limit.txt
  osascript -e "display notification \"$name: usage limit, reset $(date -r $resume_at +%H:%M). Answer in decision.txt\" with title \"Report run\"" 2>/dev/null
  h=$(( 10#$(date +%H) ))
  if (( h >= DAY_START && h < DAY_END )); then
    echo "[$name] usage limit (day): waiting for decision.txt (wait | move | restart): $(date)"
    until [[ -s decision.txt ]]; do sleep 60; done
  else
    echo "[$name] usage limit (night): waiting until $(date -r $resume_at) unless decision.txt arrives"
    while (( $(date +%s) < resume_at )) && [[ ! -s decision.txt ]]; do sleep 60; done
  fi
  d=$(tr -d ' \n' < decision.txt 2>/dev/null); [[ -z "$d" ]] && d=wait
  rm -f limit.txt decision.txt
  echo "[$name] decision: $d ($(date))"
  case "$d" in
    wait) while (( $(date +%s) < resume_at )); do sleep 60; done ;;
    move) move_session "$sid" "$CFG" "$OTHER_CFG" || { echo "[$name] move failed"; return 1; }
      CFG="$OTHER_CFG" ;;
    restart) CFG="$OTHER_CFG"; sid=$(uuidgen | tr 'A-Z' 'a-z'); echo "$sid" > "$name.session-id"
      fresh=1 ;;
    *) echo "[$name] unknown decision '$d'; stopping"; return 1 ;;
  esac
}

run_stage() {  # run_stage <name> <brief file> <done file>
  local name=$1 brief=$2 donefile=$3
  if [[ -s "$donefile" ]]; then echo "[$name] already done ($donefile exists)"; return 0; fi
  local sid; sid=$(uuidgen | tr 'A-Z' 'a-z')
  local attempt=1 fresh=1 log pid st
  if [[ "$name" == "${RESUME_STAGE:-}" && -s "$name.session-id" ]]; then
    sid=$(cat "$name.session-id"); fresh=0; attempt=3   # resume the stopped session
  fi
  echo "$sid" > "$name.session-id"
  while (( attempt <= MAX_ATTEMPTS )); do
    log="$name"; (( attempt > 1 )) && log="$name.r$attempt"
    echo "[$name] attempt $attempt on $CFG: $(date)"
    if (( fresh )); then
      claude_run "$log" --session-id "$sid" < "$brief" &
    else
      print -r -- "$RESUME_MSG" | claude_run "$log" --resume "$sid" &
    fi
    pid=$!
    # Watchdog: after a usage limit claude -p can hang instead of exiting (seen 2026-11-19).
    while kill -0 "$pid" 2>/dev/null; do
      sleep 60
      case "$(python3 -I "$STATE" "$log.log.jsonl" "$log.log.stderr" 300)" in
        limit*|nologin) echo "[$name] stopping a stalled process: $(date)"
          pkill -TERM -P "$pid" 2>/dev/null; kill -TERM "$pid" 2>/dev/null ;;
      esac
    done
    wait "$pid" 2>/dev/null   # this pid only; never a bare wait (accounts.md Ac1f)
    python3 "$USAGE" claude "$log.log.jsonl"
    grep -q '"type":"assistant"' "$log.log.jsonl" && fresh=0
    if [[ -s "$donefile" ]] && ! failed "$log"; then echo "[$name] done: $(date)"; return 0; fi
    st=$(python3 -I "$STATE" "$log.log.jsonl" "$log.log.stderr" 0)
    case "$st" in
      limit*) on_limit "$name" "${st#limit }" || return 1 ;;
      noconv) fresh=1 ;;           # the session was never created: start it again
      inuse) fresh=0 ;;
      nologin) echo "[$name] not logged in on $CFG: CLAUDE_CONFIG_DIR=\"$CFG\" claude, then /login; rerun"
        return 1 ;;
      *) echo "[$name] ended without $donefile and without a usage limit; stopping (see $log.log.jsonl)"
        return 1 ;;
    esac
    (( attempt++ ))
  done
  echo "[$name] gave up after $MAX_ATTEMPTS attempts"; return 1
}

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
