import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = getDb();
    const customers = db.prepare("SELECT * FROM customers ORDER BY created_at DESC").all();
    return NextResponse.json({ customers });
  } catch (error) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO customers (id, name, account_type, status, health_rag, last_contact, created_at, account_manager, success_criteria, memory_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      body.name,
      body.account_type || "Standard",
      body.status || "active",
      body.health_rag || "green",
      body.last_contact || null,
      now,
      body.account_manager || "Jeffrey Calabro",
      body.success_criteria || null,
      body.memory_json || null
    );

    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
