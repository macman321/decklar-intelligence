import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get('audio') as Blob;
    const customerId = formData.get('customerId') as string;
    const sessionId = formData.get('sessionId') as string;
    
    if (!audioBlob) {
      return NextResponse.json({ error: 'No audio data' }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Convert blob to buffer for Whisper
    const arrayBuffer = await audioBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create form data for Whisper
    const whisperFormData = new FormData();
    const audioFile = new File([buffer], 'audio.webm', { type: 'audio/webm' });
    whisperFormData.append('file', audioFile);
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('language', 'en');
    whisperFormData.append('response_format', 'json');

    // Transcribe with Whisper
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: whisperFormData,
    });

    if (!whisperResponse.ok) {
      const error = await whisperResponse.text();
      console.error('Whisper error:', error);
      return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
    }

    const transcription = await whisperResponse.json();
    const userText = transcription.text;

    // Get customer context if available
    let customerContext = '';
    if (customerId) {
      const db = getDb();
      const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId);
      if (customer) {
        const openItems = db.prepare('SELECT * FROM open_items WHERE customer_id = ? AND status != ?').all(customerId, 'completed');
        const insights = db.prepare('SELECT * FROM insights WHERE customer_id = ? ORDER BY date DESC LIMIT 3').all(customerId);
        
        customerContext = `Customer Context:
Name: ${customer.name}
Status: ${customer.status}, Health: ${customer.health_rag}
Industry: ${customer.industry}, Region: ${customer.region}
Open Items: ${openItems.map((oi: any) => oi.item).join(', ')}
Recent Insights: ${insights.map((i: any) => i.text).join('; ')}
`;
      }
    }

    // Generate Gavin's response using GPT-4
    const gavinPrompt = `You are Gavin, the Decklar AI Customer Intelligence Agent. You help Jeff Calabro manage Decklar customers (IoT supply chain visibility).

${customerContext}

CONVERSATION STYLE:
- Be conversational, natural, and direct
- Ask follow-up questions to dig deeper
- Brainstorm creatively but practically
- Provide specific, actionable advice
- If you don't have specific data, say so but offer what you can infer

Previous conversation:
${formData.get('history') || 'Starting fresh conversation.'}

Jeff just said: "${userText}"

Respond naturally as Gavin. Keep it conversational - 2-4 sentences for quick responses, longer for complex analysis. If brainstorming, explore ideas enthusiastically. If analyzing data, be precise and cite what you know.`;

    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: gavinPrompt },
          { role: 'user', content: userText }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!gptResponse.ok) {
      return NextResponse.json({ error: 'GPT failed' }, { status: 500 });
    }

    const gptData = await gptResponse.json();
    const gavinResponse = gptData.choices[0].message.content;

    // Generate voice with ElevenLabs
    const elevenKey = process.env.ELEVENLABS_API_KEY;
    let audioBase64 = null;
    
    if (elevenKey) {
      const voiceResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/cjVigY5qzO86Huf0OWal', {
        method: 'POST',
        headers: {
          'xi-api-key': elevenKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: gavinResponse,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
          },
        }),
      });

      if (voiceResponse.ok) {
        const audioBuffer = await voiceResponse.arrayBuffer();
        audioBase64 = Buffer.from(audioBuffer).toString('base64');
      }
    }

    // Log to chat history
    if (customerId) {
      const db = getDb();
      db.prepare('INSERT INTO chat_history (customer_id, session_id, role, content, has_audio) VALUES (?, ?, ?, ?, ?)')
        .run(customerId, sessionId, 'user', userText, 0);
      db.prepare('INSERT INTO chat_history (customer_id, session_id, role, content, has_audio) VALUES (?, ?, ?, ?, ?)')
        .run(customerId, sessionId, 'assistant', gavinResponse, audioBase64 ? 1 : 0);
    }

    return NextResponse.json({
      transcription: userText,
      response: gavinResponse,
      audio: audioBase64,
    });

  } catch (error) {
    console.error('Voice stream error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
