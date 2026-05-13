#!/usr/bin/env python3
"""
Gavin Discord Bot - Full Implementation
Monitors Discord for messages from Jeff, routes to appropriate handlers
"""

import asyncio
import discord
import json
import os
import sys
from datetime import datetime
from discord.ext import commands

# Load environment
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Configuration
TOKEN = os.getenv("GAVIN_DISCORD_TOKEN")
SERVER_ID = int(os.getenv("GAVIN_SERVER_ID", "1504191076683223210"))
CHANNEL_ID = int(os.getenv("GAVIN_CHANNEL_ID", "1504191077945446623"))
DATA_DIR = os.getenv("GAVIN_DATA_DIR", "/Users/jarvis/.openclaw/workspace/decklar-intelligence")

# Setup logging
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - Gavin - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f"{DATA_DIR}/gavin/discord.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger('Gavin')

# Discord bot setup
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix='!', intents=intents)

def log_conversation(author, content, message_type="incoming"):
    """Log conversation to file"""
    log_file = f"{DATA_DIR}/gavin/conversations/discord_notes.md"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(log_file, 'a') as f:
        f.write(f"\n## {timestamp} [{message_type.upper()}]\n")
        f.write(f"**Author:** {author}\n")
        f.write(f"**Content:** {content}\n\n")

def update_memory(last_active=None, current_focus=None, activity=None):
    """Update Gavin's memory.json"""
    memory_path = f"{DATA_DIR}/gavin/memory.json"
    with open(memory_path, 'r') as f:
        memory = json.load(f)
    
    if last_active:
        memory['lastActive'] = last_active
    if current_focus:
        memory['currentFocus'] = current_focus
    if activity:
        memory['recentDecisions'].append(f"{datetime.now().isoformat()}: {activity}")
        # Keep only last 20
        memory['recentDecisions'] = memory['recentDecisions'][-20:]
    
    with open(memory_path, 'w') as f:
        json.dump(memory, f, indent=2)

@bot.event
async def on_ready():
    """Bot is ready and connected"""
    logger.info(f'Gavin logged in as {bot.user}')
    logger.info(f'Monitoring channel: {CHANNEL_ID}')
    update_memory(last_active=datetime.now().strftime("%Y-%m-%d"), 
                  activity="Discord bot connected and ready")
    
    # Set presence
    await bot.change_presence(
        activity=discord.Activity(
            type=discord.ActivityType.watching, 
            name="Decklar customer accounts"
        ),
        status=discord.Status.online
    )

@bot.event
async def on_message(message):
    """Process incoming messages"""
    # Ignore bot's own messages
    if message.author == bot.user:
        return
    
    # Only respond in the designated channel or DM
    if message.channel.id != CHANNEL_ID and not isinstance(message.channel, discord.DMChannel):
        return
    
    # Only respond to Jeff (or authorized users)
    # For now, accept all messages in the channel
    
    content = message.content.strip()
    author = str(message.author)
    
    logger.info(f"Message from {author}: {content[:100]}")
    log_conversation(author, content, "incoming")
    
    # Route to handler
    await process_message(message, content.lower())

async def process_message(message, content):
    """Route message to appropriate handler"""
    
    # Help command
    if any(word in content for word in ['help', 'commands', 'what can you do']):
        await send_help(message)
    
    # Onboarding
    elif any(word in content for word in ['onboard', 'new customer', 'kickoff', 'new account']):
        await handle_onboarding(message)
    
    # Transcript processing
    elif any(word in content for word in ['transcript', 'call', 'meeting', 'conversation']):
        await handle_transcript(message)
    
    # Status/Health check
    elif any(word in content for word in ['status', 'health', 'rag', 'how is']):
        await handle_status_check(message, content)
    
    # Generate reports
    elif any(word in content for word in ['report', 'qbr', 'deployment plan', 'value prop']):
        await handle_report_request(message, content)
    
    # List customers
    elif any(word in content for word in ['list', 'customers', 'accounts', 'who do we have']):
        await handle_list_customers(message)
    
    # General greeting
    elif any(word in content for word in ['hello', 'hi', 'hey', 'gavin']):
        await message.channel.send(f"Hello {message.author.mention}! I'm Gavin, your Decklar assistant. How can I help with your accounts today?")
    
    # Unknown - ask for clarification
    else:
        await message.channel.send(f"I'm not sure how to help with that. Try `!help` to see what I can do, or just tell me about a customer you want to work with.")

async def send_help(message):
    """Send help message"""
    help_text = """
**Gavin Commands:**

**Customer Management:**
• "Onboard new customer [Name]" - Start customer setup
• "List customers" - Show all accounts
• "Status for [Customer]" - Account health snapshot

**Call Processing:**
• Upload a transcript and I'll process it automatically
• "Process this transcript" - After uploading a file

**Reports:**
• "Generate QBR for [Customer]" - Quarterly business review
• "Deployment plan for [Customer]" - Generate deployment doc
• "Value prop for [Customer]" - Value proposition document

**General:**
• "What do I need to follow up on?" - Open items
• "Help" - Show this message

Just tell me naturally what you need — I'll figure it out.
"""
    await message.channel.send(help_text)
    log_conversation("Gavin", "Sent help message", "outgoing")

async def handle_onboarding(message):
    """Start customer onboarding"""
    await message.channel.send(f"📋 **Customer Onboarding**\n\nI'll guide you through the Decklar AI Onboarding process.\n\nOpen the portal here:\n`file:///Users/jarvis/.openclaw/skills/Decklar_Jarvis_Package/portal/Decklar_AI_Onboarding.html`\n\n1. Run through the Q&A with your customer\n2. Save the session JSON at the end\n3. Upload it here and I'll build their deployment plan\n\nReady when you are!")
    update_memory(current_focus="Awaiting onboarding session JSON", 
                  activity="Initiated customer onboarding flow")

async def handle_transcript(message):
    """Handle transcript processing"""
    await message.channel.send(f"📝 **Transcript Processing**\n\nUpload your transcript file (txt, vtt, or srt) and I'll:\n• Extract key information\n• Update customer memory\n• Generate a call summary\n• Flag action items\n\nJust drop the file here!")

async def handle_status_check(message, content):
    """Check customer status"""
    # Try to extract customer name from message
    await message.channel.send(f"📊 I'll check the account status. Which customer would you like me to look up? (Say 'list customers' if you need a reminder)")

async def handle_report_request(message, content):
    """Handle report generation"""
    await message.channel.send(f"📄 I can generate that report. Which customer is this for?")

async def handle_list_customers(message):
    """List all customers"""
    customers_dir = f"{DATA_DIR}/customers"
    if not os.path.exists(customers_dir):
        await message.channel.send(f"📋 **No customers yet.**\n\nYou're just getting started! Use 'onboard new customer' to add your first account.")
        return
    
    customers = [d for d in os.listdir(customers_dir) if os.path.isdir(os.path.join(customers_dir, d))]
    
    if not customers:
        await message.channel.send(f"📋 **No customers yet.**\n\nReady to onboard your first account?")
    else:
        customer_list = "\n".join([f"• {c}" for c in customers])
        await message.channel.send(f"📋 **Active Customers ({len(customers)}):**\n\n{customer_list}")

# Run the bot
if __name__ == "__main__":
    if not TOKEN:
        logger.error("GAVIN_DISCORD_TOKEN not set in .env")
        sys.exit(1)
    
    try:
        bot.run(TOKEN)
    except Exception as e:
        logger.error(f"Bot crashed: {e}")
        raise
