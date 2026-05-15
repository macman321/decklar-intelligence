-- Decklar Customer Intelligence Portal Database Schema
-- SQLite with better-sqlite3

-- Customers table - primary customer data
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

-- Contacts table - people at each customer
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    name TEXT NOT NULL,
    title TEXT,
    email TEXT,
    phone TEXT,
    role TEXT DEFAULT 'primary',
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Deployment configurations
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
    pharma_mode BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Open items / action items
CREATE TABLE IF NOT EXISTS open_items (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    item TEXT NOT NULL,
    owner TEXT,
    status TEXT DEFAULT 'Pending',
    due_date TEXT,
    priority TEXT DEFAULT 'medium',
    created_at TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Call history
CREATE TABLE IF NOT EXISTS call_history (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT,
    participants TEXT,
    summary TEXT,
    key_decisions TEXT,
    transcript_path TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Insights and learnings
CREATE TABLE IF NOT EXISTS insights (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    type TEXT,
    text TEXT NOT NULL,
    source TEXT,
    date TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Activity log
CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_health ON customers(health_rag);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_contacts_customer ON contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_open_items_customer ON open_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_call_history_customer ON call_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_insights_customer ON insights(customer_id);
CREATE INDEX IF NOT EXISTS idx_activity_customer ON activity_logs(customer_id);