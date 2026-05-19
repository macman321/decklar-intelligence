import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const items = db
      .prepare("SELECT * FROM open_items WHERE customer_id = ? ORDER BY due_date")
      .all(id);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET open-items error:", error);
    return NextResponse.json(
      { error: "Failed to fetch open items" },
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
    const itemId = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO open_items (id, customer_id, item, owner, status, due_date, priority, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      itemId,
      id,
      body.item,
      body.owner || null,
      body.status || "Pending",
      body.due_date || null,
      body.priority || "medium",
      now
    );

    const item = db
      .prepare("SELECT * FROM open_items WHERE id = ?")
      .get(itemId);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("POST open-item error:", error);
    return NextResponse.json(
      { error: "Failed to create open item" },
      { status: 500 }
    );
  }
}
