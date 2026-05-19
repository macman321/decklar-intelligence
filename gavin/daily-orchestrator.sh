#!/bin/bash
# Gavin Daily Orchestrator — Runs every morning at 7 AM ET
# This script wakes Gavin up, gives him tasks, and lets him work autonomously.

# Load API key from secure credential store
export ANTHROPIC_API_KEY=$(cat /Users/jarvis/.openclaw/credentials/anthropic 2>/dev/null | grep '=' | cut -d'=' -f2 | tr -d '\n')
export DECKLAR_DATA_DIR=/Users/jarvis/decklar-intelligence

LOGFILE="$DECKLAR_DATA_DIR/gavin/daily-runs/$(date +%Y-%m-%d).log"
mkdir -p "$(dirname "$LOGFILE")"

echo "=== Gavin Daily Run — $(date) ===" >> "$LOGFILE"

# 1. Read current memory
echo "[1/5] Loading memory..." >> "$LOGFILE"
cat $DECKLAR_DATA_DIR/gavin/memory.json >> "$LOGFILE" 2>&1 || echo "No memory.json found" >> "$LOGFILE"

# 2. Check for new transcripts to process
echo "[2/5] Checking for new transcripts..." >> "$LOGFILE"
find $DECKLAR_DATA_DIR -name "*.txt" -newer $DECKLAR_DATA_DIR/gavin/memory.json 2>/dev/null | head -5 >> "$LOGFILE"

# 3. Check customer health scores
echo "[3/5] Checking customer health..." >> "$LOGFILE"
if [ -f $DECKLAR_DATA_DIR/gavin/portal/database/decklar.db ]; then
    sqlite3 $DECKLAR_DATA_DIR/gavin/portal/database/decklar.db \
        "SELECT name, health_rag, status FROM customers;" >> "$LOGFILE" 2>&1 || echo "DB query failed"
fi

# 4. Generate morning brief
echo "[4/5] Generating morning brief..." >> "$LOGFILE"
python3 $DECKLAR_DATA_DIR/tools/generate_morning_brief.py >> "$LOGFILE" 2>&1 || echo "Brief generator not ready"

# 5. Auto-commit any changes
echo "[5/5] Committing changes..." >> "$LOGFILE"
cd $DECKLAR_DATA_DIR && git add -A && git commit -m "Gavin daily run: $(date +%Y-%m-%d)" >> "$LOGFILE" 2>&1 || true

echo "=== Done — $(date) ===" >> "$LOGFILE"
