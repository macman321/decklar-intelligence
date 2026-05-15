import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const customerId = parseInt(params.id);
    
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    const contacts = db.prepare('SELECT * FROM contacts WHERE customer_id = ?').all(customerId);
    const deployment = db.prepare('SELECT * FROM deployment_configs WHERE customer_id = ?').get(customerId);
    const openItems = db.prepare('SELECT * FROM open_items WHERE customer_id = ? ORDER BY priority DESC, due_date ASC').all(customerId);
    const insights = db.prepare('SELECT * FROM insights WHERE customer_id = ? ORDER BY date DESC').all(customerId);
    const recentCalls = db.prepare('SELECT * FROM call_history WHERE customer_id = ? ORDER BY call_date DESC LIMIT 5').all(customerId);
    const valueProof = db.prepare('SELECT * FROM value_proof WHERE customer_id = ?').get(customerId);
    const recentActivity = db.prepare('SELECT * FROM activity_logs WHERE customer_id = ? ORDER BY timestamp DESC LIMIT 10').all(customerId);
    
    return NextResponse.json({
      ...customer,
      contacts,
      deployment,
      open_items: openItems,
      insights,
      recent_calls: recentCalls,
      value_proof: valueProof,
      recent_activity: recentActivity
    });
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const customerId = parseInt(params.id);
    const body = await request.json();
    
    const allowedFields = ['name', 'account_type', 'status', 'health_rag', 'industry', 'region', 'annual_spend', 'last_contact', 'next_contact', 'go_live_date', 'contract_renewal'];
    const updates: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    
    values.push(customerId);
    db.prepare(`UPDATE customers SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values);
    
    db.prepare(`
      INSERT INTO activity_logs (customer_id, action, details, actor)
      VALUES (?, 'CUSTOMER_UPDATED', 'Customer record updated', 'User')
    `).run(customerId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
