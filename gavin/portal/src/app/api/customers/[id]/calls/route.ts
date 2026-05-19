import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const calls = db
      .prepare("SELECT * FROM call_history WHERE customer_id = ? ORDER BY date DESC")
      .all(id);
    return NextResponse.json({ calls });
  } catch (error) {
    console.error("GET calls error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const body = await request.json();
    const callId = crypto.randomUUID();

    db.prepare(
      `INSERT INTO call_history (id, customer_id, date, type, participants, summary, key_decisions, transcript_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      callId,
      id,
      body.date,
      body.type || null,
      body.participants || null,
      body.summary || null,
      body.key_decisions || null,
      body.transcript_path || null
    );

    const call = db
      .prepare("SELECT * FROM call_history WHERE id = ?")
      .get(callId);
    return NextResponse.json({ call }, { status: 201 });
  } catch (error) {
    console.error("POST call error:", error);
    return NextResponse.json(
      { error: "Failed to create call record" },
      { status: 500 }
    );
  }
}
