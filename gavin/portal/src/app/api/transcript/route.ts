import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

// Transcript processing API — extracts portal answer keys from call transcripts
export async function POST(request: Request) {
  try {
    const { customerId, transcript, callType = "kickoff", callDate }: 
      { customerId: string; transcript: string; callType?: string; callDate?: string } = await request.json();

    if (!transcript || !customerId) {
      return NextResponse.json({ error: "customerId and transcript required" }, { status: 400 });
    }

    const db = getDb();
    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(customerId) as Record<string, unknown> | undefined;
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Extract key information using simple heuristics
    const extracted = extractFromTranscript(transcript);

    // Save transcript
    const transcriptId = crypto.randomUUID();
    const now = callDate || new Date().toISOString();
    db.prepare(`INSERT INTO call_history (id, customer_id, date, type, participants, summary, key_decisions, transcript_path) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(transcriptId, customerId, now, callType, extracted.participants || null, extracted.summary || null, extracted.keyDecisions || null, null);

    // Save raw transcript text to file system
    const customerName = (customer.name as string).replace(/[^a-zA-Z0-9]/g, "_");
    const transcriptFileName = `${customerName}_${now.split("T")[0]}_${callType}.txt`;

    return NextResponse.json({
      extracted,
      transcriptId,
      transcriptFileName,
      message: "Transcript processed. Review extracted values before updating customer memory."
    });
  } catch (error) {
    console.error("POST /api/transcript error:", error);
    return NextResponse.json({ error: "Failed to process transcript" }, { status: 500 });
  }
}

function extractFromTranscript(transcript: string) {
  const text = transcript.toLowerCase();
  
  // Simple extraction heuristics — in production this would call an LLM
  const extracted: Record<string, unknown> = {};
  
  // Shipment mode
  if (text.includes("truck only") || text.includes("just truck")) extracted.shipmentMode = "Truck Only";
  else if (text.includes("ocean") || text.includes("sea")) extracted.shipmentMode = "Truck → Ocean → Truck";
  else if (text.includes("air ") || text.includes("air freight")) extracted.shipmentMode = "Truck → Air → Truck";
  else if (text.includes("rail")) extracted.shipmentMode = "Rail";

  // Device type
  if (text.includes("b label") || text.includes("bee label") || text.includes("one-time") || text.includes("disposable")) {
    extracted.deviceType = "One-Time Use";
  } else if (text.includes("reusable") || text.includes("reverse logistics")) {
    extracted.deviceType = "Reusable — Reverse Logistics";
  }

  // Cold chain
  if (text.includes("cold chain") || text.includes("temperature") || text.includes("2-8") || text.includes("2°c")) {
    extracted.coldChain = true;
    const tempMatch = transcript.match(/(\d+)[°\s]*C?\s*(?:to|[-–])\s*(\d+)[°\s]*C?/i);
    if (tempMatch) extracted.tempThresholds = `${tempMatch[1]}°C to ${tempMatch[2]}°C`;
  }

  // Humidity
  if (text.includes("humidity") || text.includes("moisture")) extracted.humidityMonitoring = true;

  // Shock
  if (text.includes("shock") || text.includes("impact")) extracted.shockMonitoring = true;

  // BLE
  if (text.includes("bluetooth") || text.includes(" ble ")) {
    extracted.bleMentioned = true;
    if (text.includes("prohibit") || text.includes("restrict") || text.includes("not allowed") || text.includes("no ble")) {
      extracted.bleRestricted = true;
    }
  }

  // Lanes
  const laneMatch = transcript.match(/(\d+)\s*(?:lane|route)/i);
  if (laneMatch) extracted.numLanes = parseInt(laneMatch[1]);

  // Participants (simple heuristic — names with titles)
  const nameMatches = transcript.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s*[-–]\s*([^\n,]+))?/g);
  extracted.participants = nameMatches ? nameMatches.slice(0, 3).join(", ") : null;

  // Key decisions — look for "agreed", "decided", "confirm"
  const decisionLines = transcript.split("\n").filter((line) => 
    /agreed|decided|confirm|settled|will|going to/i.test(line) && line.length > 20
  );
  extracted.keyDecisions = decisionLines.length > 0 ? decisionLines.slice(0, 5).join("; ") : null;

  // Summary — first paragraph or first 200 chars
  extracted.summary = transcript.substring(0, 300).replace(/\n+/g, " ") + "...";

  return extracted;
}
