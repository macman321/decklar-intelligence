export interface Customer {
  id: number;
  name: string;
  account_type: 'enterprise' | 'mid_market' | 'smb';
  status: 'active' | 'at_risk' | 'churned' | 'prospect';
  health_rag: 'green' | 'amber' | 'red';
  industry?: string;
  region?: string;
  annual_spend?: number;
  last_contact?: string;
  next_contact?: string;
  go_live_date?: string;
  contract_renewal?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  customer_id: number;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  role: 'primary' | 'technical' | 'finance' | 'operations';
  is_primary: boolean;
  linkedin_url?: string;
  notes?: string;
}

export interface DeploymentConfig {
  id: number;
  customer_id: number;
  shipment_mode?: string;
  num_lanes?: number;
  lane_duration?: string;
  trip_type?: string;
  cold_chain: boolean;
  temp_thresholds?: string;
  shock_monitoring: boolean;
  humidity_monitoring: boolean;
  connectivity?: string;
  device_type?: string;
  go_live_date?: string;
  num_users?: number;
  public_tracking: boolean;
  e_proof_departure: boolean;
  e_proof_delivery: boolean;
  waypoint_alerts: boolean;
  detention_demurrage: boolean;
  vehicle_tracking: boolean;
  asset_flow: boolean;
  pharma_mode: boolean;
}

export interface OpenItem {
  id: number;
  customer_id: number;
  item: string;
  owner?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
  completed_at?: string;
  notes?: string;
}

export interface Insight {
  id: number;
  customer_id: number;
  insight_type: 'opportunity' | 'warning' | 'risk' | 'tip';
  text: string;
  source?: string;
  confidence?: number;
  date?: string;
  is_proactive: boolean;
  acknowledged_at?: string;
}

export interface CallHistory {
  id: number;
  customer_id: number;
  call_date: string;
  call_type?: 'kickoff' | 'qbr' | 'check_in' | 'escalation' | 'training' | 'other';
  participants?: string;
  summary?: string;
  key_decisions?: string;
}

export interface ValueProof {
  id: number;
  customer_id: number;
  claims_reduced?: number;
  shipments_monitored?: number;
  incidents_detected?: number;
  cost_savings?: number;
  efficiency_gain?: string;
  notable_wins?: string;
  expansion_opportunities?: string;
}

export interface ActivityLog {
  id: number;
  customer_id?: number;
  action: string;
  details?: string;
  actor?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: number;
  customer_id?: number;
  role: 'user' | 'assistant';
  content: string;
  has_audio: boolean;
  timestamp: string;
}

export interface CustomerWithDetails extends Customer {
  contacts: Contact[];
  deployment?: DeploymentConfig;
  open_items: OpenItem[];
  insights: Insight[];
  recent_calls: CallHistory[];
  value_proof?: ValueProof;
}

export interface DashboardStats {
  totalCustomers: number;
  activeDeployments: number;
  atRiskCount: number;
  avgHealthScore: number;
  openItemsCount: number;
  proactiveInsights: number;
}
