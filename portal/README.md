# Decklar Customer Intelligence Portal

AI-powered customer management for Decklar IoT supply chain visibility.

## Features

- **Customer Dashboard**: Health RAG indicators, quick stats, search
- **Customer Detail**: Contacts, deployment config, open items, call history, AI insights
- **Voice Chat with Gavin**: Continuous, hands-free voice conversation

## Voice Chat

The Gavin sidebar supports **continuous voice conversation**:

1. Click the phone button to start
2. Speak naturally — no push-to-talk needed
3. Gavin listens, thinks, and responds by voice
4. After Gavin speaks, he automatically listens again
5. Keep the conversation flowing like a phone call

**Use cases:**
- "What's the health status of Schneider Electric?"
- "Brainstorm retention strategies for our at-risk customers"
- "Summarize the last call with ACME Logistics"
- "Who should I call this week?"

## Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- SQLite (better-sqlite3)
- OpenAI Whisper + GPT-4
- ElevenLabs Voice (Eric)

## Environment Variables

```bash
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Pushes to GitHub Pages automatically via GitHub Actions.
