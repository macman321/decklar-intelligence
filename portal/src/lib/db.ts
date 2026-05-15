import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = process.env.DB_PATH || join(process.cwd(), 'database', 'decklar.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    
    const schema = readFileSync(join(process.cwd(), 'database', 'schema.sql'), 'utf-8');
    db.exec(schema);
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function seedDatabase(): void {
  const database = getDb();
  
  const count = database.prepare('SELECT COUNT(*) as count FROM customers').get() as { count: number };
  if (count.count > 0) return;

  const customers = [
    {
      name: 'Schneider Electric',
      account_type: 'enterprise',
      status: 'active',
      health_rag: 'green',
      industry: 'Electrical Equipment',
      region: 'North America',
      annual_spend: 500000,
      last_contact: '2026-05-10',
      next_contact: '2026-05-24',
      go_live_date: '2025-11-15',
      contract_renewal: '2027-11-15'
    },
    {
      name: 'ACME Logistics',
      account_type: 'smb',
      status: 'active',
      health_rag: 'amber',
      industry: '3PL Logistics',
      region: 'Europe',
      annual_spend: 75000,
      last_contact: '2026-05-05',
      next_contact: '2026-05-19',
      go_live_date: '2026-06-01',
      contract_renewal: '2026-12-01'
    },
    {
      name: 'Global Pharma Inc',
      account_type: 'enterprise',
      status: 'at_risk',
      health_rag: 'red',
      industry: 'Pharmaceutical',
      region: 'Asia Pacific',
      annual_spend: 800000,
      last_contact: '2026-04-15',
      next_contact: '2026-05-20',
      go_live_date: null,
      contract_renewal: '2026-08-01'
    },
    {
      name: 'Fresh Foods Distribution',
      account_type: 'mid_market',
      status: 'active',
      health_rag: 'green',
      industry: 'Food & Beverage',
      region: 'North America',
      annual_spend: 200000,
      last_contact: '2026-05-12',
      next_contact: '2026-05-26',
      go_live_date: '2026-01-20',
      contract_renewal: '2027-01-20'
    },
    {
      name: 'Titanium Manufacturing',
      account_type: 'enterprise',
      status: 'active',
      health_rag: 'amber',
      industry: 'Industrial Manufacturing',
      region: 'Europe',
      annual_spend: 350000,
      last_contact: '2026-05-08',
      next_contact: '2026-05-22',
      go_live_date: '2026-03-10',
      contract_renewal: '2027-03-10'
    }
  ];

  const insertCustomer = database.prepare(`
    INSERT INTO customers (name, account_type, status, health_rag, industry, region, annual_spend, last_contact, next_contact, go_live_date, contract_renewal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertContact = database.prepare(`
    INSERT INTO contacts (customer_id, name, title, email, phone, role, is_primary)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertDeployment = database.prepare(`
    INSERT INTO deployment_configs (customer_id, shipment_mode, num_lanes, cold_chain, device_type, connectivity, go_live_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOpenItem = database.prepare(`
    INSERT INTO open_items (customer_id, item, owner, status, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertInsight = database.prepare(`
    INSERT INTO insights (customer_id, insight_type, text, source, confidence, date, is_proactive)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const contacts = [
    { customer: 'Schneider Electric', name: 'Marie Dubois', title: 'VP Supply Chain', email: 'marie.dubois@schneider.com', phone: '+1-555-0101', role: 'primary' },
    { customer: 'Schneider Electric', name: 'James Chen', title: 'Logistics Director', email: 'james.chen@schneider.com', phone: '+1-555-0102', role: 'technical' },
    { customer: 'ACME Logistics', name: 'Hans Mueller', title: 'Operations Manager', email: 'hans.mueller@acmelogistics.eu', phone: '+49-555-0103', role: 'primary' },
    { customer: 'Global Pharma Inc', name: 'Dr. Sarah Kim', title: 'Chief Compliance Officer', email: 'sarah.kim@globalpharma.com', phone: '+65-555-0104', role: 'primary' },
    { customer: 'Global Pharma Inc', name: 'Raj Patel', title: 'IT Director', email: 'raj.patel@globalpharma.com', phone: '+65-555-0105', role: 'technical' },
    { customer: 'Fresh Foods Distribution', name: 'Mike Johnson', title: 'VP Operations', email: 'mike.j@freshfoods.com', phone: '+1-555-0106', role: 'primary' },
    { customer: 'Titanium Manufacturing', name: 'Isabella Rossi', title: 'Supply Chain Director', email: 'isabella.rossi@titanium.eu', phone: '+39-555-0107', role: 'primary' }
  ];

  const deployments = [
    { customer: 'Schneider Electric', mode: 'international', lanes: 250, cold: 0, device: 'Bee Label Pro', connectivity: 'cellular', live: '2025-11-15' },
    { customer: 'ACME Logistics', mode: 'regional', lanes: 45, cold: 1, device: 'Bee Label Cold', connectivity: 'cellular', live: '2026-06-01' },
    { customer: 'Global Pharma Inc', mode: 'global', lanes: 500, cold: 1, device: 'Bee Label Pharma', connectivity: 'cellular', live: null },
    { customer: 'Fresh Foods Distribution', mode: 'national', lanes: 120, cold: 1, device: 'Bee Label Cold', connectivity: 'cellular', live: '2026-01-20' },
    { customer: 'Titanium Manufacturing', mode: 'international', lanes: 80, cold: 0, device: 'Reusable Bee', connectivity: 'cellular', live: '2026-03-10' }
  ];

  const openItems = [
    { customer: 'ACME Logistics', item: 'Complete API integration testing', owner: 'Dinesh', status: 'in_progress', priority: 'high', due: '2026-05-18' },
    { customer: 'ACME Logistics', item: 'Train operations team on dashboard', owner: 'Jeff', status: 'pending', priority: 'medium', due: '2026-05-25' },
    { customer: 'Global Pharma Inc', item: 'Schedule compliance review call', owner: 'Jeff', status: 'overdue', priority: 'high', due: '2026-05-10' },
    { customer: 'Global Pharma Inc', item: 'Provide temperature validation docs', owner: 'Gavin', status: 'pending', priority: 'high', due: '2026-05-20' },
    { customer: 'Titanium Manufacturing', item: 'Review expansion proposal', owner: 'Jeff', status: 'pending', priority: 'medium', due: '2026-05-30' }
  ];

  const insights = [
    { customer: 'Schneider Electric', type: 'opportunity', text: 'Customer mentioned potential expansion to South American lanes in Q3', source: 'Call transcript 2026-05-10', confidence: 0.85, date: '2026-05-10', proactive: 1 },
    { customer: 'Schneider Electric', type: 'tip', text: 'Dashboard adoption is 94% - excellent engagement', source: 'Usage analytics', confidence: 0.95, date: '2026-05-12', proactive: 0 },
    { customer: 'ACME Logistics', type: 'warning', text: 'Integration timeline slipping - may impact go-live', source: 'Status check', confidence: 0.75, date: '2026-05-08', proactive: 1 },
    { customer: 'Global Pharma Inc', type: 'risk', text: 'No response in 30 days - stakeholder engagement concerns', source: 'Activity tracking', confidence: 0.9, date: '2026-05-14', proactive: 1 },
    { customer: 'Global Pharma Inc', type: 'opportunity', text: 'LinkedIn shows new CTO starting June 1 - potential champion', source: 'News monitoring', confidence: 0.7, date: '2026-05-13', proactive: 1 },
    { customer: 'Fresh Foods Distribution', type: 'tip', text: 'Claim reduction of 34% since deployment - great ROI story', source: 'Metrics review', confidence: 0.92, date: '2026-05-12', proactive: 0 },
    { customer: 'Titanium Manufacturing', type: 'opportunity', text: 'Discussed adding shock monitoring for high-value cargo', source: 'Call transcript 2026-05-08', confidence: 0.8, date: '2026-05-08', proactive: 1 }
  ];

  for (const c of customers) {
    const result = insertCustomer.run(c.name, c.account_type, c.status, c.health_rag, c.industry, c.region, c.annual_spend, c.last_contact, c.next_contact, c.go_live_date, c.contract_renewal);
    const customerId = result.lastInsertRowid;

    const customerContacts = contacts.filter(ct => ct.customer === c.name);
    for (const ct of customerContacts) {
      insertContact.run(customerId, ct.name, ct.title, ct.email, ct.phone, ct.role, ct.role === 'primary' ? 1 : 0);
    }

    const customerDeployment = deployments.find(d => d.customer === c.name);
    if (customerDeployment) {
      insertDeployment.run(customerId, customerDeployment.mode, customerDeployment.lanes, customerDeployment.cold, customerDeployment.device, customerDeployment.connectivity, customerDeployment.live);
    }

    const customerOpenItems = openItems.filter(oi => oi.customer === c.name);
    for (const oi of customerOpenItems) {
      insertOpenItem.run(customerId, oi.item, oi.owner, oi.status, oi.priority, oi.due);
    }

    const customerInsights = insights.filter(i => i.customer === c.name);
    for (const i of customerInsights) {
      insertInsight.run(customerId, i.type, i.text, i.source, i.confidence, i.date, i.proactive);
    }
  }

  database.prepare(`
    INSERT INTO activity_logs (customer_id, action, details, actor)
    VALUES (NULL, 'SYSTEM_INIT', 'Database seeded with sample customers', 'System')
  `).run();
}
