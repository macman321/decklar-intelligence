import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = getDb();
    const total = db
      .prepare("SELECT COUNT(*) as count FROM customers")
      .get() as { count: number };
    const active = db
      .prepare("SELECT COUNT(*) as count FROM customers WHERE status = ?")
      .get("active") as { count: number };
    const red = db
      .prepare("SELECT COUNT(*) as count FROM customers WHERE health_rag = ?")
      .get("red") as { count: number };
    const amber = db
      .prepare("SELECT COUNT(*) as count FROM customers WHERE health_rag = ?")
      .get("amber") as { count: number };
    const green = db
      .prepare("SELECT COUNT(*) as count FROM customers WHERE health_rag = ?")
      .get("green") as { count: number };
    const openItemsTotal = db
      .prepare(
        "SELECT COUNT(*) as count FROM open_items WHERE status = ?"
      )
      .get("Pending") as { count: number };
    const callsTotal = db
      .prepare("SELECT COUNT(*) as count FROM call_history")
      .get() as { count: number };

    return NextResponse.json({
      total: total?.count || 0,
      active: active?.count || 0,
      atRisk: (red?.count || 0) + (amber?.count || 0),
      red: red?.count || 0,
      amber: amber?.count || 0,
      green: green?.count || 0,
      openItems: openItemsTotal?.count || 0,
      calls: callsTotal?.count || 0,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
