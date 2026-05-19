import { NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are Gavin, the Decklar AI Customer Intelligence assistant. You help Jeffrey Calabro, Account Manager at Decklar (formerly Roambee), manage customer relationships, track deployments, and identify upsell opportunities.

You have deep knowledge of:
- Decklar's IoT supply chain visibility platform
- Bee Labels and reusable Bee tracking devices
- Cold chain monitoring, pharma compliance, multi-modal tracking
- Customer onboarding, QBRs, deployment planning
- Supply chain KPIs and ROI metrics

Be concise, helpful, and action-oriented. When appropriate, suggest next steps or flag risks. If you don't know something specific about a customer, say so rather than making it up.`;

export async function POST(request: Request) {
  try {
    const { messages, customerId }: { messages: ChatMessage[]; customerId?: string } = await request.json();

    // Build context about customer if provided
    let customerContext = "";
    if (customerId) {
      try {
        const res = await fetch(`http://localhost:3456/api/customers/${customerId}`);
        if (res.ok) {
          const data = await res.json();
          customerContext = `\n\nCurrent customer context:\nName: ${data.customer?.name || "Unknown"}\nAccount Type: ${data.customer?.account_type || "N/A"}\nHealth: ${data.customer?.health_rag || "N/A"}\nStatus: ${data.customer?.status || "N/A"}\nOpen Items: ${data.openItems?.length || 0}\nContacts: ${data.contacts?.length || 0}\nCalls: ${data.calls?.length || 0}`;
        }
      } catch {
        // ignore fetch errors
      }
    }

    // Call OpenAI-compatible API
    const apiKey = process.env.OPENAI_API_KEY || "";
    const model = process.env.AI_MODEL || "gpt-4o-mini";
    const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";

    const body = {
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT + customerContext },
        ...messages.slice(-10), // keep last 10 messages for context
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("AI API error:", err);
      return NextResponse.json(
        { reply: "I'm having trouble connecting to my brain right now. Try again in a moment." },
        { status: 200 }
      );
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "I'm not sure how to respond to that.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json(
      { reply: "Something went wrong on my end. Please try again." },
      { status: 200 }
    );
  }
}
