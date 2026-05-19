import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const contacts = db
      .prepare("SELECT * FROM contacts WHERE customer_id = ? ORDER BY role")
      .all(id);
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("GET contacts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
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
    const contactId = crypto.randomUUID();

    db.prepare(
      `INSERT INTO contacts (id, customer_id, name, title, email, phone, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      contactId,
      id,
      body.name,
      body.title || null,
      body.email || null,
      body.phone || null,
      body.role || "primary"
    );

    const contact = db
      .prepare("SELECT * FROM contacts WHERE id = ?")
      .get(contactId);
    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("POST contact error:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
