import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const contacts = db.prepare("SELECT * FROM contacts WHERE customer_id = ? ORDER BY role").all(id);
    const openItems = db.prepare("SELECT * FROM open_items WHERE customer_id = ? ORDER BY due_date").all(id);
    const calls = db.prepare("SELECT * FROM call_history WHERE customer_id = ? ORDER BY date DESC").all(id);
    const insights = db.prepare("SELECT * FROM insights WHERE customer_id = ? ORDER BY date DESC").all(id);
    const activities = db.prepare("SELECT * FROM activity_logs WHERE customer_id = ? ORDER BY timestamp DESC LIMIT 20").all(id);

    return NextResponse.json({ customer, contacts, openItems, calls, insights, activities });
  } catch (error) {
    console.error("GET /api/customers/:id error:", error);
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const body = await request.json();

    const fields = Object.keys(body).filter((k) => k !== "id");
    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => (body as Record<string, unknown>)[f]);
    db.prepare(`UPDATE customers SET ${setClause} WHERE id = ?`).run(...values, id);

    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
    return NextResponse.json({ customer });
  } catch (error) {
    console.error("PUT /api/customers/:id error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    db.prepare("DELETE FROM customers WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/customers/:id error:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
