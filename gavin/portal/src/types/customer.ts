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
  type: 'warning' | 'tip' | 'risk' | 'opportunity' | null;
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

export interface CustomerStats {
  total: number;
  active: number;
  atRisk: number;
  red: number;
  amber: number;
  green: { count: number } | number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioUrl?: string;
}

export interface HealthStatus {
  status: 'green' | 'amber' | 'red';
  label: string;
  description: string;
}