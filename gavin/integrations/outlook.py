#!/usr/bin/env python3
"""
Gavin's Outlook Integration
============================
Read-only access to Jeff's Outlook via Apple Mail local storage.
Gavin can read emails, analyze them, draft responses — but NEVER sends.
"""

import os
import sqlite3
import email
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Dict, Optional

# Apple Mail stores data here
MAIL_PATH = Path.home() / "Library/Mail"

class OutlookReader:
    """Read-only Outlook access for Gavin"""
    
    def __init__(self):
        self.mail_path = MAIL_PATH
        
    def get_recent_emails(self, hours: int = 24) -> List[Dict]:
        """Get emails from last N hours"""
        emails = []
        cutoff = datetime.now() - timedelta(hours=hours)
        
        # Walk through Mail directories looking for .emlx files
        for account_dir in self.mail_path.glob("*"):
            if account_dir.is_dir():
                for emlx_file in account_dir.rglob("*.emlx"):
                    try:
                        stat = emlx_file.stat()
                        modified = datetime.fromtimestamp(stat.st_mtime)
                        if modified > cutoff:
                            email_data = self._parse_emlx(emlx_file)
                            if email_data:
                                emails.append(email_data)
                    except Exception as e:
                        continue
        
        # Sort by date, newest first
        emails.sort(key=lambda x: x.get("date", ""), reverse=True)
        return emails[:50]  # Limit to 50 recent
    
    def _parse_emlx(self, filepath: Path) -> Optional[Dict]:
        """Parse an .emlx file"""
        try:
            with open(filepath, 'rb') as f:
                content = f.read()
            
            # .emlx files have a header with the message length, then the email
            lines = content.split(b'\n', 1)
            if len(lines) < 2:
                return None
            
            msg = email.message_from_bytes(lines[1])
            
            return {
                "subject": self._decode_header(msg.get("Subject", "")),
                "from": self._decode_header(msg.get("From", "")),
                "to": self._decode_header(msg.get("To", "")),
                "date": msg.get("Date", ""),
                "body": self._get_body(msg),
                "filepath": str(filepath)
            }
        except Exception as e:
            return None
    
    def _decode_header(self, header: str) -> str:
        """Decode email header"""
        try:
            decoded = email.header.decode_header(header)
            result = ""
            for part, charset in decoded:
                if isinstance(part, bytes):
                    result += part.decode(charset or 'utf-8', errors='replace')
                else:
                    result += part
            return result
        except:
            return str(header)
    
    def _get_body(self, msg) -> str:
        """Extract email body"""
        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                if content_type == "text/plain":
                    try:
                        return part.get_payload(decode=True).decode('utf-8', errors='replace')
                    except:
                        continue
                elif content_type == "text/html":
                    # Skip HTML for now, get plain text if available
                    continue
        else:
            try:
                return msg.get_payload(decode=True).decode('utf-8', errors='replace')
            except:
                pass
        return "[No text body available]"
    
    def search_emails(self, query: str, days: int = 7) -> List[Dict]:
        """Search emails for keywords"""
        results = []
        emails = self.get_recent_emails(hours=days*24)
        
        query_lower = query.lower()
        for e in emails:
            if (query_lower in e.get("subject", "").lower() or 
                query_lower in e.get("body", "").lower() or
                query_lower in e.get("from", "").lower()):
                results.append(e)
        
        return results
    
    def get_emails_from_sender(self, sender_email: str, days: int = 7) -> List[Dict]:
        """Get all emails from a specific sender"""
        results = []
        emails = self.get_recent_emails(hours=days*24)
        
        for e in emails:
            if sender_email.lower() in e.get("from", "").lower():
                results.append(e)
        
        return results

# Convenience functions for Gavin
def get_morning_brief() -> str:
    """Generate morning email briefing"""
    reader = OutlookReader()
    emails = reader.get_recent_emails(hours=12)
    
    if not emails:
        return "No new emails in the last 12 hours."
    
    urgent = []
    regular = []
    
    for e in emails:
        subject = e.get("subject", "")
        # Simple urgency detection
        urgent_words = ["urgent", "asap", "deadline", "action required", "meeting", "escalation"]
        if any(word in subject.lower() for word in urgent_words):
            urgent.append(e)
        else:
            regular.append(e)
    
    brief = f"📧 **Morning Email Brief**\n\n"
    brief += f"**{len(emails)} emails** in last 12 hours\n\n"
    
    if urgent:
        brief += "**🚨 Requires Attention:**\n"
        for e in urgent[:5]:
            brief += f"• **{e['subject']}** — {e['from']}\n"
        brief += "\n"
    
    if regular:
        brief += "**Other emails:**\n"
        for e in regular[:10]:
            brief += f"• {e['subject']} — {e['from']}\n"
    
    return brief

def draft_reply(original_email: Dict, response_points: List[str]) -> str:
    """Draft a reply to an email"""
    draft = f"Subject: Re: {original_email.get('subject', '')}\n\n"
    draft += f"Hi {original_email.get('from', '').split('<')[0].strip()},\n\n"
    
    for point in response_points:
        draft += f"{point}\n\n"
    
    draft += "Best,\nJeff\n"
    
    return draft

if __name__ == "__main__":
    # Test
    print(get_morning_brief())
