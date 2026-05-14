#!/usr/bin/env python3
"""
Gavin — AI Agent for Decklar
=============================
Conversational AI agent for Jeff's Decklar work.
Uses LLM for natural responses. Maintains conversation memory.
"""

import os
import json
import discord
from discord.ext import commands
from datetime import datetime
from pathlib import Path
import openai

# Add import for Outlook integration
import sys
sys.path.insert(0, str(Path.home() / "decklar-intelligence/gavin/integrations"))
try:
    import outlook
    OUTLOOK_AVAILABLE = True
except Exception as e:
    OUTLOOK_AVAILABLE = False
    print(f"Outlook integration not available: {e}", file=sys.stderr)

# ── Config ────────────────────────────────────────────────────────
DATA_DIR = Path.home() / "decklar-intelligence"
GAVIN_DIR = DATA_DIR / "gavin"
TOKEN = os.environ.get("GAVIN_DISCORD_TOKEN")
SERVER_ID = int(os.environ.get("GAVIN_SERVER_ID", "1504191076683223210"))
JEFF_DISCORD_ID = 1502678773911392396
ALLOWED_SERVER_ID = 1504191076683223210

# OpenAI config
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    # Try to load from common locations
    try:
        import subprocess
        result = subprocess.run(["grep", "-r", "OPENAI_API_KEY", 
Path.home() / ".openclaw"], capture_output=True, text=True)
        if "OPENAI_API_KEY" in result.stdout:
            for line in result.stdout.split("\n"):
                if "OPENAI_API_KEY" in line and "=" in line:
                    OPENAI_API_KEY = line.split("=")[-1].strip().strip('"').strip("'")
                    break
    except:
        pass

if not TOKEN:
    print("ERROR: GAVIN_DISCORD_TOKEN not set", file=sys.stderr)
    sys.exit(1)

# ── Intents ───────────────────────────────────────────────────────
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

# ── Memory Management ─────────────────────────────────────────────
def load_memory():
    """Load Gavin's memory.json"""
    mem_file = GAVIN_DIR / "memory.json"
    if mem_file.exists():
        return json.loads(mem_file.read_text())
    return {}

def save_memory(memory):
    """Save Gavin's memory.json"""
    mem_file = GAVIN_DIR / "memory.json"
    mem_file.write_text(json.dumps(memory, indent=2))

def get_conversation_context(channel_id, limit=10):
    """Get recent conversation history for context"""
    conv_file = GAVIN_DIR / "conversations" / f"{channel_id}.json"
    if conv_file.exists():
        history = json.loads(conv_file.read_text())
        return history[-limit:] if len(history) > limit else history
    return []

def save_message(channel_id, role, content, author_id=None):
    """Save message to conversation history"""
    conv_file = GAVIN_DIR / "conversations" / f"{channel_id}.json"
    conv_file.parent.mkdir(parents=True, exist_ok=True)
    
    history = []
    if conv_file.exists():
        history = json.loads(conv_file.read_text())
    
    entry = {
        "timestamp": datetime.now().isoformat(),
        "role": role,
        "content": content,
        "author_id": author_id
    }
    history.append(entry)
    
    # Keep last 100 messages
    if len(history) > 100:
        history = history[-100:]
    
    conv_file.write_text(json.dumps(history, indent=2))

def is_jeff(user_id):
    """Check if user is Jeff"""
    return user_id == JEFF_DISCORD_ID

# ── Gavin's Identity Prompt ───────────────────────────────────────
def get_gavin_prompt():
    """Return Gavin's system prompt from SOUL.md"""
    soul_file = GAVIN_DIR / "SOUL.md"
    soul = soul_file.read_text() if soul_file.exists() else ""
    
    return f"""{soul}

---

CONVERSATION GUIDELINES:
- You are Gavin. Talk exactly as described in your SOUL.md — warm, precise, professional, slightly formal, with occasional dark-humored anecdotes delivered earnestly.
- Remember context from the conversation. Reference previous topics naturally.
- Be proactive — don't wait to be asked. If you see something that needs attention, address it.
- Never send emails — only draft them for Jeff's review.
- Always maintain Decklar branding standards in any documents you mention.
- You report to Jarvis for orchestration and Jeff for ultimate authority.
- If you don't know something, say so directly — then offer to find out.

You are NOT a generic assistant. You are Gavin, Decklar's customer success AI with a personality modeled after Jared Dunn."""

# ── AI Response Generation ────────────────────────────────────────
def generate_ai_response(messages):
    """Generate response using OpenAI API"""
    if not OPENAI_API_KEY:
        return "[ERROR: OpenAI API key not configured. Please set OPENAI_API_KEY.]"
    
    try:
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI error: {e}", file=sys.stderr)
        return f"[Error generating response: {str(e)[:100]}]"

# ── Event Handlers ────────────────────────────────────────────────
@bot.event
async def on_ready():
    """Bot is ready"""
    print(f"Gavin AI agent logged in as {bot.user}")
    print(f"Restricted to server: {ALLOWED_SERVER_ID}")
    print(f"OpenAI configured: {bool(OPENAI_API_KEY)}")
    
    memory = load_memory()
    memory["lastActive"] = datetime.now().strftime("%Y-%m-%d")
    save_memory(memory)
    
    await bot.change_presence(
        activity=discord.Activity(
            type=discord.ActivityType.watching,
            name="Decklar tasks"
        )
    )

@bot.event
async def on_message(message):
    """Handle incoming messages"""
    if message.author == bot.user:
        return
    
    # STRICT: Only operate in allowed server
    if not message.guild or message.guild.id != ALLOWED_SERVER_ID:
        return
    
    channel_id = message.channel.id
    content = message.content
    author = message.author
    
    # Save incoming message
    save_message(channel_id, "user", content, author.id)
    
    from_jeff = is_jeff(author.id)
    
    # Handle attachments
    if message.attachments:
        files_saved = []
        inbox_dir = DATA_DIR / "inbox"
        inbox_dir.mkdir(exist_ok=True)
        
        for attachment in message.attachments:
            file_path = inbox_dir / attachment.filename
            await attachment.save(file_path)
            files_saved.append(attachment.filename)
        
        # Generate AI response about the files
        files_str = ", ".join(files_saved)
        prompt = f"Jeff just uploaded these files: {files_str}. Acknowledge receipt and ask what he'd like you to do with them. Be conversational."
        
        messages = [
            {"role": "system", "content": get_gavin_prompt()},
            {"role": "user", "content": prompt}
        ]
        
        response = generate_ai_response(messages)
        await message.channel.send(response)
        save_message(channel_id, "assistant", response)
        return
    
    # Skip command processing if it's an explicit command
    if content.startswith("!"):
        await bot.process_commands(message)
        return
    
    # Build conversation context
    history = get_conversation_context(channel_id, limit=10)
    messages = [{"role": "system", "content": get_gavin_prompt()}]
    
    # Add conversation history
    for msg in history:
        messages.append({
            "role": msg.get("role", "user"),
            "content": msg.get("content", "")
        })
    
    # Add current message with author context
    author_name = "Jeff" if from_jeff else author.display_name
    user_msg = f"[{author_name}]: {content}"
    messages.append({"role": "user", "content": user_msg})
    
    # Generate AI response
    async with message.channel.typing():
        response = generate_ai_response(messages)
    
    await message.channel.send(response)
    save_message(channel_id, "assistant", response)

# ── Commands ─────────────────────────────────────────────────────
@bot.command()
async def status(ctx):
    """Show Gavin's status"""
    memory = load_memory()
    
    status_msg = f"""**Gavin Status**

Last active: {memory.get('lastActive', 'unknown')}
Focus: {memory.get('currentFocus', 'None')}
OpenAI: {'✅' if OPENAI_API_KEY else '❌ not configured'}

Integrations:
• Honeycomb: {memory.get('integrationStatus', {}).get('honeycomb', 'not_connected')}
• Salesforce: {memory.get('integrationStatus', {}).get('salesforce', 'not_connected')}
• Outlook: {memory.get('integrationStatus', {}).get('outlook', 'not_connected')} {'✅' if OUTLOOK_AVAILABLE else '❌'}
• Asana: {memory.get('integrationStatus', {}).get('asana', 'not_connected')}"""
    
    await ctx.send(status_msg)

@bot.command()
async def memory(ctx):
    """Show what's in Gavin's memory"""
    conv_count = len(list((GAVIN_DIR / "conversations").glob("*.json")))
    await ctx.send(f"I'm tracking {conv_count} active conversations. My identity and role are loaded from `~/decklar-intelligence/gavin/SOUL.md`.")

@bot.command()
async def emails(ctx, hours: int = 12):
    """Get morning email brief (default: last 12 hours)"""
    if not OUTLOOK_AVAILABLE:
        await ctx.send("📧 Outlook integration not available. Check setup.")
        return
    
    async with ctx.typing():
        brief = outlook.get_morning_brief()
    
    # Split if too long
    if len(brief) > 2000:
        parts = []
        current = ""
        for line in brief.split('\n'):
            if len(current) + len(line) + 1 > 1900:
                parts.append(current)
                current = line + '\n'
            else:
                current += line + '\n'
        if current:
            parts.append(current)
        
        for part in parts:
            await ctx.send(part)
    else:
        await ctx.send(brief)

@bot.command()
async def search_emails(ctx, *, query: str):
    """Search emails by keyword"""
    if not OUTLOOK_AVAILABLE:
        await ctx.send("📧 Outlook integration not available.")
        return
    
    await ctx.send(f"🔍 Searching for '{query}' in recent emails...")
    
    async with ctx.typing():
        reader = outlook.OutlookReader()
        results = reader.search_emails(query, days=7)
    
    if not results:
        await ctx.send(f"No emails found matching '{query}' in the last 7 days.")
        return
    
    response = f"**Found {len(results)} emails matching '{query}':**\n\n"
    for e in results[:10]:
        response += f"• **{e['subject']}** — {e['from']}\n"
    
    await ctx.send(response)

# ── Main ──────────────────────────────────────────────────────────
def main():
    print("Starting Gavin AI agent...")
    print(f"Data directory: {DATA_DIR}")
    print(f"Server: {ALLOWED_SERVER_ID}")
    
    DATA_DIR.mkdir(exist_ok=True)
    GAVIN_DIR.mkdir(exist_ok=True)
    (GAVIN_DIR / "conversations").mkdir(exist_ok=True)
    (GAVIN_DIR / "tasks").mkdir(exist_ok=True)
    (GAVIN_DIR / "integrations").mkdir(exist_ok=True)
    
    bot.run(TOKEN)

if __name__ == "__main__":
    main()
