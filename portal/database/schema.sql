CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  account_type TEXT DEFAULT 'enterprise',
  status TEXT DEFAULT 'active',
  health_rag TEXT DEFAULT 'green',
  industry TEXT,
  region TEXT,
  annual_spend REAL,
  last_contact TEXT,
  next_contact TEXT,
  go_live_date TEXT,
  contract_renewal TEXT,
  memory_json TEXT,
  supermemory_tag TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'primary',
  is_primary INTEGER DEFAULT 0,
  linkedin_url TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deployment_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  shipment_mode TEXT,
  num_lanes INTEGER,
  lane_duration TEXT,
  trip_type TEXT,
  cold_chain INTEGER DEFAULT 0,
  temp_thresholds TEXT,
  shock_monitoring INTEGER DEFAULT 0,
  humidity_monitoring INTEGER DEFAULT 0,
  connectivity TEXT,
  device_type TEXT,
  go_live_date TEXT,
  num_users INTEGER,
  public_tracking INTEGER DEFAULT 0,
  e_proof_departure INTEGER DEFAULT 0,
  e_proof_delivery INTEGER DEFAULT 0,
  waypoint_alerts INTEGER DEFAULT 0,
  detention_demurrage INTEGER DEFAULT 0,
  vehicle_tracking INTEGER DEFAULT 0,
  asset_flow INTEGER DEFAULT 1,
  pharma_mode INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS open_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  item TEXT NOT NULL,
  owner TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date TEXT,
  completed_at TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS call_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  call_date TEXT NOT NULL,
  call_type TEXT,
  participants TEXT,
  summary TEXT,
  key_decisions TEXT,
  transcript_path TEXT,
  summary_path TEXT,
  new_open_items INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS insights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  insight_type TEXT NOT NULL,
  text TEXT NOT NULL,
  source TEXT,
  confidence REAL,
  date TEXT,
  is_proactive INTEGER DEFAULT 0,
  acknowledged_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS value_proof (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  claims_reduced INTEGER,
  shipments_monitored INTEGER,
  incidents_detected INTEGER,
  cost_savings REAL,
  efficiency_gain TEXT,
  notable_wins TEXT,
  expansion_opportunities TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  action TEXT NOT NULL,
  details TEXT,
  actor TEXT,
  metadata TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  session_id TEXT,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  has_audio INTEGER DEFAULT 0,
  audio_path TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX idx_customers_health ON customers(health_rag);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_contacts_customer ON contacts(customer_id);
CREATE INDEX idx_open_items_customer ON open_items(customer_id);
CREATE INDEX idx_insights_customer ON insights(customer_id);
CREATE INDEX idx_activity_customer ON activity_logs(customer_id);
CREATE INDEX idx_chat_customer ON chat_history(customer_id);
