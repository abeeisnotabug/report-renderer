"""State of a `claude -p --output-format stream-json` run, read from its log.

Usage: python3 -I logstate.py LOG STDERR [MIN_IDLE_SECONDS]

Prints one line:
  nologin        the account is not logged in
  noconv         --resume found no conversation with that id
  inuse          the session id is already in use / exists
  limit EPOCH    a usage limit stopped the run and nothing has happened since; EPOCH = reset time
  ok             anything else

Only result lines, error assistant lines, rate_limit_event lines and the stderr file are
searched, never the transcript text: an agent that reads run.sh would otherwise put the
searched phrases into its own log. "limit" also requires the log to be unchanged for
MIN_IDLE_SECONDS (default 0).
"""
import json
import os
import sys
import time

log, err = sys.argv[1], sys.argv[2]
min_idle = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0

texts = []  # error and result texts only
try:
    texts.append(open(err, errors="replace").read())
except OSError:
    pass

last_real = -1      # index of the last assistant line that is not an error
last_rejected = -1  # index of the last rejected rate-limit event
last_allowed = -1
reset_at = None
lines = []
try:
    lines = open(log, errors="replace").read().splitlines()
except OSError:
    pass
for i, line in enumerate(lines):
    try:
        d = json.loads(line)
    except ValueError:
        continue
    t = d.get("type")
    if t == "result":
        texts.append(str(d.get("result", "")))
        texts.extend(str(e) for e in (d.get("errors") or []))
    elif t == "assistant":
        if d.get("error"):
            msg = d.get("message") or {}
            for c in msg.get("content") or []:
                if isinstance(c, dict) and c.get("type") == "text":
                    texts.append(c.get("text", ""))
        else:
            last_real = i
    elif t == "rate_limit_event":
        info = d.get("rate_limit_info") or {}
        if info.get("status") == "rejected":
            last_rejected = i
            reset_at = info.get("resetsAt", reset_at)
        else:
            last_allowed = i

blob = "\n".join(texts)
idle = time.time() - os.path.getmtime(log) if os.path.exists(log) else 0.0
if "Not logged in" in blob:
    print("nologin")
elif "No conversation found" in blob:
    print("noconv")
elif "already in use" in blob or "already exists" in blob:
    print("inuse")
elif last_rejected > max(last_real, last_allowed) and idle >= min_idle:
    print(f"limit {int(reset_at or 0)}")
else:
    print("ok")
