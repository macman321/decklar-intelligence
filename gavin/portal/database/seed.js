const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'decklar.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    account_type TEXT DEFAULT 'Standard',
    status TEXT DEFAULT 'active',
    health_rag TEXT DEFAULT 'green',
    last_contact TEXT,
    created_at TEXT NOT NULL,
    account_manager TEXT DEFAULT 'Jeffrey Calabro',
    success_criteria TEXT,
    memory_json TEXT
  );
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    name TEXT NOT NULL,
    title TEXT,
    email TEXT,
    phone TEXT,
    role TEXT DEFAULT 'primary'
  );
  CREATE TABLE IF NOT EXISTS open_items (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    item TEXT NOT NULL,
    owner TEXT,
    status TEXT DEFAULT 'Pending',
    due_date TEXT,
    priority TEXT DEFAULT 'medium',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS call_history (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT,
    participants TEXT,
    summary TEXT,
    key_decisions TEXT,
    transcript_path TEXT
  );
  CREATE TABLE IF NOT EXISTS insights (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    type TEXT,
    text TEXT NOT NULL,
    source TEXT,
    date TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_customers_health ON customers(health_rag);
  CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
`);

// Seed customers
const customers = [
  { id: "cust-1", name: "Schneider Electric", account_type: "Enterprise", health_rag: "green", status: "active" },
  { id: "cust-2", name: "Acme Supply Chain Co", account_type: "Standard", health_rag: "amber", status: "active" },
  { id: "cust-3", name: "MedPharma Logistics", account_type: "Premium", health_rag: "green", status: "active" },
  { id: "cust-4", name: "Global Freight Partners", account_type: "Standard", health_rag: "red", status: "active" },
  { id: "cust-5", name: "Fresh Foods Distribution", account_type: "Standard", health_rag: "green", status: "active" },
];

for (const c of customers) {
  db.prepare(`INSERT OR IGNORE INTO customers (id, name, account_type, status, health_rag, last_contact, created_at, account_manager)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    c.id, c.name, c.account_type, c.status, c.health_rag,
    new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
    "Jeffrey Calabro"
  );
}

// Seed contacts
const contacts = [
  { id: "con-1", customer_id: "cust-1", name: "Sarah Johnson", title: "VP Supply Chain", email: "sarah.j@schneider.com", phone: "+1-555-0101", role: "primary" },
  { id: "con-2", customer_id: "cust-1", name: "Mike Chen", title: "Operations Manager", email: "mike.c@schneider.com", role: "secondary" },
  { id: "con-3", customer_id: "cust-2", name: "David Miller", title: "Director Logistics", email: "dmiller@acme.com", role: "primary" },
  { id: "con-4", customer_id: "cust-3", name: "Dr. Lisa Park", title: "Quality Assurance", email: "l.park@medpharma.com", role: "primary" },
  { id: "con-5", customer_id: "cust-4", name: "James Wilson", title: "CTO", email: "jwilson@globalfreight.com", role: "primary" },
];

for (const c of contacts) {
  db.prepare(`INSERT OR IGNORE INTO contacts (id, customer_id, name, title, email, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(c.id, c.customer_id, c.name, c.title, c.email, c.phone || null, c.role);
}

// Seed open items
const items = [
  { id: "item-1", customer_id: "cust-1", item: "Finalize Q3 device deployment plan", owner: "Jeffrey Calabro", status: "Pending", priority: "high", due_date: new Date(Date.now() + 7 * 86400000).toISOString() },
  { id: "item-2", customer_id: "cust-1", item: "Schedule executive demo", owner: "Jeffrey Calabro", status: "Pending", priority: "medium" },
  { id: "item-3", customer_id: "cust-2", item: "Review cold chain requirements", owner: "David Miller", status: "Pending", priority: "critical" },
  { id: "item-4", customer_id: "cust-4", item: "Address connectivity issues in APAC region", owner: "James Wilson", status: "Pending", priority: "high" },
  { id: "item-5", customer_id: "cust-3", item: "Submit FDA validation documentation", owner: "Dr. Lisa Park", status: "Done", priority: "high" },
];

for (const i of items) {
  db.prepare(`INSERT OR IGNORE INTO open_items (id, customer_id, item, owner, status, due_date, priority, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(i.id, i.customer_id, i.item, i.owner, i.status, i.due_date || null, i.priority, new Date().toISOString());
}

// Seed calls
const calls = [
  { id: "call-1", customer_id: "cust-1", date: new Date(Date.now() - 3 * 86400000).toISOString(), type: "QBR", participants: "Sarah Johnson, Mike Chen", summary: "Reviewed Q2 performance. Customer very satisfied with visibility improvements.", key_decisions: "Expand to 50 more lanes by August" },
  { id: "call-2", customer_id: "cust-1", date: new Date(Date.now() - 18 * 86400000).toISOString(), type: "Check-in", participants: "Sarah Johnson", summary: "Routine check-in. No issues raised." },
  { id: "call-3", customer_id: "cust-2", date: new Date(Date.now() - 5 * 86400000).toISOString(), type: "Issue Resolution", participants: "David Miller", summary: "Discussed temperature threshold alerts. Adjusted thresholds per customer request." },
  { id: "call-4", customer_id: "cust-4", date: new Date(Date.now() - 2 * 86400000).toISOString(), type: "Escalation", participants: "James Wilson", summary: "Escalated connectivity drops in Singapore hub. Engineering team engaged.", key_decisions: "Emergency firmware patch scheduled" },
];

for (const c of calls) {
  db.prepare(`INSERT OR IGNORE INTO call_history (id, customer_id, date, type, participants, summary, key_decisions, transcript_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(c.id, c.customer_id, c.date, c.type, c.participants, c.summary, c.key_decisions || null, null);
}

// Seed insights
const insights = [
  { id: "ins-1", customer_id: "cust-1", type: "tip", text: "Schneider is ready for enterprise upsell — mention advanced analytics module", source: "QBR transcript" },
  { id: "ins-2", customer_id: "cust-2", type: "warning", text: "Acme has had 3 missed check-ins. Recommend proactive outreach.", source: "Activity analysis" },
  { id: "ins-3", customer_id: "cust-4", type: "risk", text: "Global Freight experiencing repeated connectivity failures. Risk of churn if not resolved in 2 weeks.", source: "Support tickets" },
  { id: "ins-4", customer_id: "cust-3", type: "opportunity", text: "MedPharma expanding to EU market — potential for 200+ new labels", source: "Customer email" },
];

for (const i of insights) {
  db.prepare(`INSERT OR IGNORE INTO insights (id, customer_id, type, text, source, date) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(i.id, i.customer_id, i.type, i.text, i.source, new Date().toISOString());
}

console.log('✅ Database seeded successfully');
db.close();
