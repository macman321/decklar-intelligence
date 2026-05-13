#!/bin/bash
# Gavin Discord Listener — Persistent Bot Service
# Runs continuously, monitors Discord for messages from Jeff

# Configuration - Source from .env file
if [ -f "$SCRIPT_DIR/.env" ]; then
  source "$SCRIPT_DIR/.env"
else
  echo "Error: .env file not found at $SCRIPT_DIR/.env"
  echo "Create it with:"
  echo '  GAVIN_DISCORD_TOKEN="your-token-here"'
  exit 1
fi

case "$1" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "Gavin already running (PID: $(cat $PID_FILE))"
      exit 0
    fi
    echo "Starting Gavin Discord listener..."
    nohup python3 /Users/jarvis/.openclaw/workspace/decklar-intelligence/gavin/discord_listener.py > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "Gavin started (PID: $!)"
    ;;
  stop)
    if [ -f "$PID_FILE" ]; then
      kill $(cat "$PID_FILE") 2>/dev/null && echo "Gavin stopped" || echo "Gavin not running"
      rm -f "$PID_FILE"
    else
      echo "Gavin not running"
    fi
    ;;
  status)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "Gavin is running (PID: $(cat $PID_FILE))"
      tail -5 "$LOG_FILE"
    else
      echo "Gavin is not running"
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    exit 1
    ;;
esac