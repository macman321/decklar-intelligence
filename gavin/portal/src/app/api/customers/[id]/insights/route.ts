import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const insights = db
      .prepare("SELECT * FROM insights WHERE customer_id = ? ORDER BY date DESC")
      .all(id);
    return NextResponse.json({ insights });
  } catch (error) {
    console.error("GET insights error:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
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
    const insightId = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO insights (id, customer_id, type, text, source, date)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      insightId,
      id,
      body.type || null,
      body.text,
      body.source || null,
      now
    );

    const insight = db
      .prepare("SELECT * FROM insights WHERE id = ?")
      .get(insightId);
    return NextResponse.json({ insight }, { status: 201 });
  } catch (error) {
    console.error("POST insight error:", error);
    return NextResponse.json(
      { error: "Failed to create insight" },
      { status: 500 }
    );
  }
}
