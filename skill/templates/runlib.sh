# Shared functions of the report runners (run-stage.sh, run-companion.sh). Sourced, not run.
# Copy it into the work folder with the runner and logstate.py.
#
# The runner sets before sourcing (defaults below): D (work folder), CFG (account the stages
# start on), OTHER_CFG (account offered at a usage limit), MODEL, EFFORT, LIMIT and DECISION
# (file names; one pair per chain when chains run in parallel).
#
# Usage limit (big-tasks Co5a-Co5c, accounts.md Ac3, Ac3a): a watchdog stops a claude -p that
# hangs on the limit. run_stage then writes $LIMIT (stage, session, account, reset time) and a
# desktop notification; the conductor chat watches for limit*.txt and asks RMB. The answer goes
# into $DECISION, one word:
#   wait      wait for the reset, resume the same session on the same account
#   move      copy the session to OTHER_CFG and resume it there (later stages stay there)
#   restart   start the stage fresh on OTHER_CFG (later stages stay there)
# By day (DAY_START to DAY_END) it waits for $DECISION; at night it waits for the reset and
# resumes, unless $DECISION arrives first. It never restarts a stage on the same account.
# Tested 2026-11-20 on the normal path; 2026-11-21 the limit path with "move"; 2026-11-24 the
# night path (wait for the reset, resume the same session) unattended.

: ${D:=$PWD}
: ${CFG:=$HOME/.claude-second}
: ${OTHER_CFG:=$HOME/.claude}
: ${MODEL:=claude-opus-5-5}
: ${EFFORT:=high}
: ${LIMIT:=limit.txt}
: ${DECISION:=decision.txt}
DAY_START=8 DAY_END=22            # daytime hours: pause for RMB's decision
STATE="$D/logstate.py"
USAGE="$HOME/.agent-skills-shared/big-tasks/scripts/usage.py"
WASTE="$HOME/.agent-skills-shared/big-tasks/scripts/waste_check.sh"
MAX_ATTEMPTS=12
RESUME_MSG='You were interrupted (a usage limit). Continue the task of your brief from where you stopped: look at what is already in this folder and do not redo finished work.'

waste_gate() {  # waste_gate <runner file>: no start unless the waste check saw this run's shape
  # (big-tasks Wc1-Wc5): runner, run.conf, brief names, sources. Rewording a brief keeps the shape;
  # the free script check runs again here, so a reworded brief cannot slip past it.
  if [[ ! -s "$D/waste-check.sha" ]] || ! diff -q <("$WASTE" --hashes "$D" "$1") "$D/waste-check.sha" >/dev/null; then
    echo "No current waste check: the run's shape (runner, run.conf, briefs, sources) changed, or it never ran."
    echo "Run: $WASTE \"$D\" ${1:t} \"<launch command>\", fix what it finds, then start again."
    return 1
  fi
  local lint; lint=$(python3 -I "${WASTE:h}/waste_lint.py" "$D" "${1:t}") || {
    print -r -- "$lint" | grep '(error)'; echo "Script check failed: fix the briefs, then start again."; return 1; }
  echo "waste check: $(head -1 "$D/waste-check.md")"
}

claude_run() {  # claude_run <log name> <session args...>; the message comes on standard input
  local log=$1; shift
  # The first account works only with CLAUDE_CONFIG_DIR unset: set explicitly to ~/.claude,
  # claude reports "Not logged in" (seen 2026-11-21).
  local envset=(CLAUDE_CONFIG_DIR="$CFG"); [[ "$CFG" == "$HOME/.claude" ]] && envset=(-u CLAUDE_CONFIG_DIR)
  env "${envset[@]}" claude -p --model "$MODEL" --effort "$EFFORT" \
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
  local name=$1 resume_at=$(( $2 + 300 )) h d=""
  (( resume_at > $(date +%s) )) || resume_at=$(( $(date +%s) + 600 ))
  rm -f "$DECISION"
  printf 'stage: %s\nsession: %s\naccount: %s\nresume possible: %s\nanswer in: %s\n' \
    "$name" "$sid" "$CFG" "$(date -r $resume_at)" "$DECISION" > "$LIMIT"
  osascript -e "display notification \"$name: usage limit, reset $(date -r $resume_at +%H:%M). Answer in $DECISION\" with title \"Report run\"" 2>/dev/null
  h=$(( 10#$(date +%H) ))
  if (( h >= DAY_START && h < DAY_END )); then
    echo "[$name] usage limit (day): waiting for $DECISION (wait | move | restart): $(date)"
    until [[ -s "$DECISION" ]]; do sleep 60; done
  else
    echo "[$name] usage limit (night): waiting until $(date -r $resume_at) unless $DECISION arrives"
    while (( $(date +%s) < resume_at )) && [[ ! -s "$DECISION" ]]; do sleep 60; done
  fi
  [[ -s "$DECISION" ]] && d=$(tr -d ' \n' < "$DECISION")
  [[ -z "$d" ]] && d=wait
  rm -f "$LIMIT" "$DECISION"
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
    echo "[$name] attempt $attempt on $CFG ($MODEL): $(date)"
    if (( fresh )); then
      claude_run "$log" --session-id "$sid" < "$brief" &
    else
      print -r -- "$RESUME_MSG" | claude_run "$log" --resume "$sid" &
    fi
    pid=$!
    # Watchdog: after a usage limit claude -p can hang instead of exiting (seen 2026-11-19).
    while kill -0 "$pid" 2>/dev/null; do
      sleep ${WATCH_SECONDS:-60}
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
