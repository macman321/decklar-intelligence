import { NextRequest, NextResponse } from 'next/server';
import { getDb, seedDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    seedDatabase();
    
    const customers = db.prepare(`
      SELECT c.*,
        (SELECT COUNT(*) FROM open_items WHERE customer_id = c.id AND status != 'completed') as open_items_count,
        (SELECT COUNT(*) FROM insights WHERE customer_id = c.id AND is_proactive = 1 AND acknowledged_at IS NULL) as new_insights
      FROM customers c
      ORDER BY 
        CASE c.health_rag 
          WHEN 'red' THEN 1 
          WHEN 'amber' THEN 2 
          ELSE 3 
        END,
        c.last_contact DESC
    `).all();
    
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, account_type, industry, region } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
    }
    
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO customers (name, account_type, industry, region, health_rag, status)
      VALUES (?, ?, ?, ?, 'green', 'active')
    `).run(name, account_type || 'enterprise', industry, region);
    
    db.prepare(`
      INSERT INTO activity_logs (customer_id, action, details, actor)
      VALUES (?, 'CUSTOMER_CREATED', 'New customer created', 'User')
    `).run(result.lastInsertRowid);
    
    return NextResponse.json({ id: result.lastInsertRowid, name }, { status: 201 });
  } catch (error) {
    console.error('Failed to create customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
