import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const DB_PATH = process.env.DB_PATH || './database/decklar.db';
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    
    // Initialize schema if tables don't exist
    initSchema();
  }
  return db;
}

function initSchema() {
  if (!db) return;
  
  // Create tables
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

    CREATE TABLE IF NOT EXISTS deployment_configs (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      shipment_mode TEXT,
      num_lanes INTEGER,
      lane_duration TEXT,
      trip_type TEXT,
      shipment_start TEXT,
      shipment_complete TEXT,
      cold_chain BOOLEAN DEFAULT FALSE,
      temp_thresholds TEXT,
      shock_monitoring BOOLEAN DEFAULT FALSE,
      humidity_monitoring BOOLEAN DEFAULT FALSE,
      connectivity TEXT,
      sensor_interrupts TEXT,
      device_type TEXT,
      activation_location TEXT,
      light_confirmed TEXT,
      device_expiry TEXT,
      go_live_date TEXT,
      num_users INTEGER,
      access_controls TEXT,
      public_tracking BOOLEAN DEFAULT FALSE,
      eproof_departure BOOLEAN DEFAULT FALSE,
      eproof_delivery BOOLEAN DEFAULT FALSE,
      waypoint_alerts BOOLEAN DEFAULT FALSE,
      detention_demurrage BOOLEAN DEFAULT FALSE,
      vehicle_tracking BOOLEAN DEFAULT FALSE,
      asset_flow BOOLEAN DEFAULT TRUE,
      pharma_mode BOOLEAN DEFAULT FALSE
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
}

export function generateId(): string {
  return randomUUID();
}

// Customer CRUD
export const customersDb = {
  getAll: () => {
    const database = getDb();
    return database.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
  },
  
  getById: (id: string) => {
    const database = getDb();
    return database.prepare('SELECT * FROM customers WHERE id = ?').get(id) as Customer | undefined;
  },
  
  create: (data: Omit<Customer, 'id'>) => {
    const database = getDb();
    const id = generateId();
    database.prepare(`
      INSERT INTO customers (id, name, account_type, status, health_rag, last_contact, created_at, account_manager, success_criteria, memory_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.name, data.account_type || 'Standard', data.status || 'active', 
      data.health_rag || 'green', data.last_contact, data.created_at,
      data.account_manager || 'Jeffrey Calabro', data.success_criteria, data.memory_json
    );
    return { id, ...data };
  },
  
  update: (id: string, data: Partial<Customer>) => {
    const database = getDb();
    const fields = Object.keys(data).filter(k => k !== 'id');
    if (fields.length === 0) return;
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => (data as any)[f]);
    
    database.prepare(`UPDATE customers SET ${setClause} WHERE id = ?`).run(...values, id);
  },
  
  delete: (id: string) => {
    const database = getDb();
    database.prepare('DELETE FROM customers WHERE id = ?').run(id);
  },
  
  getStats: () => {
    const database = getDb();
    const total = database.prepare('SELECT COUNT(*) as count FROM customers').get() as { count: number };
    const active = database.prepare('SELECT COUNT(*) as count FROM customers WHERE status = ?').get('active') as { count: number };
    const red = database.prepare('SELECT COUNT(*) as count FROM customers WHERE health_rag = ?').get('red') as { count: number };
    const amber = database.prepare('SELECT COUNT(*) as count FROM customers WHERE health_rag = ?').get('amber') as { count: number };
    
    return { 
      total: total?.count || 0, 
      active: active?.count || 0, 
      atRisk: (red?.count || 0) + (amber?.count || 0),
      red: red?.count || 0,
      amber: amber?.count || 0,
      green: database.prepare('SELECT COUNT(*) as count FROM customers WHERE health_rag = ?').get('green') as { count: number }
    };
  }
};

// Contacts
export const contactsDb = {
  getByCustomer: (customerId: string) => {
    const database = getDb();
    return database.prepare('SELECT * FROM contacts WHERE customer_id = ? ORDER BY role').all(customerId);
  },
  
  create: (data: Omit<Contact, 'id'>) => {
    const database = getDb();
    const id = generateId();
    database.prepare(`
      INSERT INTO contacts (id, customer_id, name, title, email, phone, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.customer_id, data.name, data.title, data.email, data.phone, data.role || 'primary');
    return { id, ...data };
  },
  
  update: (id: string, data: Partial<Contact>) => {
    const database = getDb();
    const fields = Object.keys(data).filter(k => k !== 'id');
    if (fields.length === 0) return;
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => (data as any)[f]);
    
    database.prepare(`UPDATE contacts SET ${setClause} WHERE id = ?`).run(...values, id);
  },
  
  delete: (id: string) => {
    const database = getDb();
    database.prepare('DELETE FROM contacts WHERE id = ?').run(id);
  }
};

// Open Items
export const openItemsDb = {
  getByCustomer: (customerId: string) => {
    const database = getDb();
    return database.prepare('SELECT * FROM open_items WHERE customer_id = ? ORDER BY due_date').all(customerId);
  },
  
  getAll: () => {
    const database = getDb();
    return database.prepare('SELECT * FROM open_items ORDER BY due_date').all();
  },
  
  getPendingCount: (customerId: string) => {
    const database = getDb();
    const result = database.prepare('SELECT COUNT(*) as count FROM open_items WHERE customer_id = ? AND status = ?').get(customerId, 'Pending') as { count: number };
    return result?.count || 0;
  },
  
  create: (data: Omit<OpenItem, 'id'>) => {
    const database = getDb();
    const id = generateId();
    database.prepare(`
      INSERT INTO open_items (id, customer_id, item, owner, status, due_date, priority, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.customer_id, data.item, data.owner, data.status || 'Pending', data.due_date, data.priority || 'medium', data.created_at || new Date().toISOString());
    return { id, ...data };
  },
  
  update: (id: string, data: Partial<OpenItem>) => {
    const database = getDb();
    const fields = Object.keys(data).filter(k => k !== 'id');
    if (fields.length === 0) return;
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => (data as any)[f]);
    
    database.prepare(`UPDATE open_items SET ${setClause} WHERE id = ?`).run(...values, id);
  },
  
  delete: (id: string) => {
    const database = getDb();
    database.prepare('DELETE FROM open_items WHERE id = ?').run(id);
  }
};

// Call History
export const callHistoryDb = {
  getByCustomer: (customerId: string) => {
    const database = getDb();
    return database.prepare('SELECT * FROM call_history WHERE customer_id = ? ORDER BY date DESC').all(customerId);
  },
  
  create: (data: Omit<CallHistory, 'id'>) => {
    const database = getDb();
    const id = generateId();
    database.prepare(`
      INSERT INTO call_history (id, customer_id, date, type, participants, summary, key_decisions, transcript_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.customer_id, data.date, data.type, data.participants, data.summary, data.key_decisions, data.transcript_path);
    return { id, ...data };
  }
};

// Insights
export const insightsDb = {
  getByCustomer: (customerId: string) => {
    const database = getDb();
    return database.prepare('SELECT * FROM insights WHERE customer_id = ? ORDER BY date DESC').all(customerId);
  },
  
  create: (data: Omit<Insight, 'id'>) => {
    const database = getDb();
    const id = generateId();
    database.prepare(`
      INSERT INTO insights (id, customer_id, type, text, source, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, data.customer_id, data.type, data.text, data.source, data.date);
    return { id, ...data };
  }
};

// Activity Logs
export const activityLogsDb = {
  getByCustomer: (customerId: string, limit = 20) => {
    const database = getDb();
    return database.prepare('SELECT * FROM activity_logs WHERE customer_id = ? ORDER BY timestamp DESC LIMIT ?').all(customerId, limit);
  },
  
  create: (data: Omit<ActivityLog, 'id'>) => {
    const database = getDb();
    const id = generateId();
    database.prepare(`
      INSERT INTO activity_logs (id, customer_id, action, details, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, data.customer_id, data.action, data.details, data.timestamp);
    return { id, ...data };
  }
};

// Types
export interface Customer {
  id: string;
  name: string;
  account_type: string;
  status: string;
  health_rag: 'green' | 'amber' | 'red';
  last_contact: string | null;
  created_at: string;
  account_manager: string;
  success_criteria: string | null;
  memory_json: string | null;
}

export interface Contact {
  id: string;
  customer_id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  role: string;
}

export interface OpenItem {
  id: string;
  customer_id: string;
  item: string;
  owner: string | null;
  status: string;
  due_date: string | null;
  priority: string;
  created_at: string;
}

export interface CallHistory {
  id: string;
  customer_id: string;
  date: string;
  type: string | null;
  participants: string | null;
  summary: string | null;
  key_decisions: string | null;
  transcript_path: string | null;
}

export interface Insight {
  id: string;
  customer_id: string;
  type: string | null;
  text: string;
  source: string | null;
  date: string;
}

export interface ActivityLog {
  id: string;
  customer_id: string;
  action: string;
  details: string | null;
  timestamp: string;
}

export interface DeploymentConfig {
  id: string;
  customer_id: string;
  shipment_mode: string | null;
  num_lanes: number | null;
  lane_duration: string | null;
  trip_type: string | null;
  shipment_start: string | null;
  shipment_complete: string | null;
  cold_chain: boolean;
  temp_thresholds: string | null;
  shock_monitoring: boolean;
  humidity_monitoring: boolean;
  connectivity: string | null;
  sensor_interrupts: string | null;
  device_type: string | null;
  activation_location: string | null;
  light_confirmed: string | null;
  device_expiry: string | null;
  go_live_date: string | null;
  num_users: number | null;
  access_controls: string | null;
  public_tracking: boolean;
  eproof_departure: boolean;
  eproof_delivery: boolean;
  waypoint_alerts: boolean;
  detention_demurrage: boolean;
  vehicle_tracking: boolean;
  asset_flow: boolean;
  pharma_mode: boolean;
}