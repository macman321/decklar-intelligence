#!/usr/bin/env python3
"""
Gavin Morning Brief Generator
Reads customer data, open items, and recent activity to generate a daily briefing.
Called by daily-orchestrator.sh every morning.
"""

import json, sqlite3, os
from datetime import datetime, timedelta
from pathlib import Path

DATA_DIR = Path(os.environ.get("DECKLAR_DATA_DIR", "~/decklar-intelligence")).expanduser()
DB_PATH = DATA_DIR / "gavin/portal/database/decklar.db"
GAVIN_DIR = DATA_DIR / "gavin"

def load_memory():
    try:
        with open(GAVIN_DIR / "memory.json") as f:
            return json.load(f)
    except:
        return {}

def get_customers():
    if not DB_PATH.exists():
        return []
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.execute("SELECT * FROM customers ORDER BY health_rag DESC, name")
    return [dict(r) for r in cursor.fetchall()]

def get_open_items():
    if not DB_PATH.exists():
        return []
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.execute("""
        SELECT o.*, c.name as customer_name 
        FROM open_items o 
        JOIN customers c ON o.customer_id = c.id 
        WHERE o.status = 'Pending'
        ORDER BY o.due_date ASC
    """)
    return [dict(r) for r in cursor.fetchall()]

def get_recent_calls():
    if not DB_PATH.exists():
        return []
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.execute("""
        SELECT ch.*, c.name as customer_name 
        FROM call_history ch 
        JOIN customers c ON ch.customer_id = c.id 
        ORDER BY ch.date DESC LIMIT 5
    """)
    return [dict(r) for r in cursor.fetchall()]

def health_emoji(rag):
    return {"green": "🟢", "amber": "🟡", "red": "🔴"}.get(rag, "⚪")

def generate_brief():
    memory = load_memory()
    customers = get_customers()
    open_items = get_open_items()
    recent_calls = get_recent_calls()
    
    today = datetime.now().strftime("%A, %B %d, %Y")
    
    lines = []
    lines.append(f"# Gavin Morning Brief — {today}")
    lines.append("")
    lines.append(f"Good morning, Jeff. It's {datetime.now().strftime('%I:%M %p')}. Here's where we are.")
    lines.append("")
    
    # Health summary
    red = [c for c in customers if c.get("health_rag") == "red"]
    amber = [c for c in customers if c.get("health_rag") == "amber"]
    green = [c for c in customers if c.get("health_rag") == "green"]
    
    lines.append("## Account Health")
    lines.append(f"- 🟢 Green: {len(green)} accounts")
    lines.append(f"- 🟡 Amber: {len(amber)} accounts")
    lines.append(f"- 🔴 Red: {len(red)} accounts")
    
    if red:
        lines.append("")
        lines.append("### 🔴 Critical Attention Required")
        for c in red:
            lines.append(f"- **{c['name']}** — {c.get('status', 'Unknown status')}")
    
    if amber:
        lines.append("")
        lines.append("### 🟡 At Risk")
        for c in amber[:3]:
            lines.append(f"- **{c['name']}** — {c.get('status', 'Unknown status')}")
    
    lines.append("")
    
    # Open items
    overdue = [i for i in open_items if i.get("due_date") and i["due_date"] < datetime.now().isoformat().split("T")[0]]
    due_today = [i for i in open_items if i.get("due_date") and i["due_date"] == datetime.now().isoformat().split("T")[0]]
    
    if overdue or due_today:
        lines.append("## Open Items Needing Action")
        if overdue:
            lines.append(f"### 🔴 Overdue ({len(overdue)} items)")
            for i in overdue[:5]:
                lines.append(f"- **{i['customer_name']}**: {i['item']} (Owner: {i.get('owner', 'TBD')})")
        if due_today:
            lines.append(f"### ⏰ Due Today ({len(due_today)} items)")
            for i in due_today[:5]:
                lines.append(f"- **{i['customer_name']}**: {i['item']} (Owner: {i.get('owner', 'TBD')})")
        lines.append("")
    
    # Recent activity
    if recent_calls:
        lines.append("## Recent Activity")
        for call in recent_calls[:3]:
            date_str = call.get("date", "Unknown date")
            if date_str and "T" in date_str:
                date_str = date_str.split("T")[0]
            lines.append(f"- **{call['customer_name']}** — {call.get('type', 'Call')} on {date_str}")
            if call.get("summary"):
                lines.append(f"  {call['summary'][:100]}...")
        lines.append("")
    
    # Today's priorities
    lines.append("## Today's Priorities")
    if memory.get("pendingTasks"):
        for task in memory["pendingTasks"][:5]:
            lines.append(f"{task.get('priority', '🟡')} {task['text']} (Due: {task.get('due', 'TBD')})")
    else:
        lines.append("No pending tasks in memory. Consider:")
        lines.append("1. Reviewing customer accounts for upcoming renewals")
        lines.append("2. Processing any new call transcripts")
        lines.append("3. Generating QBR decks for next week's meetings")
    
    lines.append("")
    lines.append("---")
    lines.append("*Gavin is standing by. Send me a task, a transcript, or a question anytime.*")
    
    return "\n".join(lines)

def main():
    brief = generate_brief()
    
    # Save to daily runs
    today = datetime.now().strftime("%Y-%m-%d")
    brief_dir = GAVIN_DIR / "daily-runs"
    brief_dir.mkdir(parents=True, exist_ok=True)
    
    brief_path = brief_dir / f"morning-brief-{today}.md"
    with open(brief_path, "w") as f:
        f.write(brief)
    
    print(brief)
    print(f"\n\nSaved to: {brief_path}")

if __name__ == "__main__":
    main()
