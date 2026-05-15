# Decklar Customer Management Portal — Data Models

Complete TypeScript interface definitions for all domain entities in the portal.

---

## Core Customer Types

### Customer (Primary Entity)
```typescript
interface Customer {
  id: string;                          // UUID v4
  customerName: string;                // Company name
  accountManager: string;              // Assigned AM (Jeff Calabro)
  accountType: 'enterprise' | 'midmarket' | 'smb' | 'trial';
  status: 'prospect' | 'active' | 'renewal' | 'at-risk' | 'churned';
  healthRAG: 'green' | 'amber' | 'red';
  healthReason?: string;               // Why amber/red
  
  // Core metadata
  industry: string;
  region: string;
  employeeCount?: number;
  annualRevenue?: number;
  
  // Relationships
  contacts: Contact[];
  deployment: DeploymentConfig;
  capabilities: Capabilities;
  openItems: OpenItem[];
  callHistory: CallRecord[];
  insights: Insight[];
  valueProof: ValueProof;
  
  // Activity tracking
  lastContactDate: Date;
  nextScheduledActivity?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Extra fields for flexibility
  extraFields: Record<string, any>;
}
```

### Contact
```typescript
interface Contact {
  id: string;
  customerId: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  role: 'executive' | 'champion' | 'economic_buyer' | 'technical' | 'end_user' | 'influencer';
  isPrimary: boolean;
  notes: string;
  lastContactDate?: Date;
  preferredContactMethod: 'email' | 'phone' | 'slack' | 'teams';
  timezone?: string;
  linkedInUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Deployment Configuration
```typescript
interface DeploymentConfig {
  id: string;
  customerId: string;
  
  // Shipment details
  shipmentModes: ('ocean' | 'air' | 'ground' | 'rail' | 'multimodal')[];
  numLanes: number;
  monthlyShipmentVolume?: number;
  
  // Facilities
  originFacilities: Facility[];
  destinationFacilities: Facility[];
  
  // Go-live
  goLiveTargetDate?: Date;
  actualGoLiveDate?: Date;
  currentPhase: 'planning' | 'pilot' | 'rollout' | 'live' | 'optimization';
  
  // Hardware
  hardwareType: 'bee_labels' | 'reusable_bees' | 'mixed';
  estimatedDeviceCount: number;
  devicesDeployed: number;
  
  // Integrations
  integrations: Integration[];
  
  // Settings
  alertThresholds: AlertThresholds;
  geofenceConfig: GeofenceConfig;
  
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Facility {
  id: string;
  name: string;
  type: 'origin' | 'destination' | 'both';
  address: Address;
  contactPerson?: string;
  contactPhone?: string;
  timezone: string;
  operatingHours?: string;
  specialInstructions?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

interface Integration {
  id: string;
  type: 'erp' | 'wms' | 'tms' | 'crm' | 'custom';
  name: string;
  status: 'planned' | 'in_progress' | 'complete' | 'blocked';
  vendor?: string;
  apiEndpoint?: string;
  lastSyncDate?: Date;
  notes?: string;
}

interface AlertThresholds {
  temperature?: { min: number; max: number };
  humidity?: { min: number; max: number };
  shock?: { threshold: number; duration: number };
  light?: boolean;
  geofenceExit?: boolean;
  dwellTime?: { threshold: number; unit: 'minutes' | 'hours' };
}

interface GeofenceConfig {
  defaultRadius: number;  // meters
  arrivalRadius: number;  // meters
  departureRadius: number; // meters
  customGeofences?: CustomGeofence[];
}

interface CustomGeofence {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  coordinates: { lat: number; lng: number }[];
  radius?: number; // For circle type
}
```

### Capabilities
```typescript
interface Capabilities {
  id: string;
  customerId: string;
  
  // Tracking capabilities
  temperatureTracking: boolean;
  humidityTracking: boolean;
  shockDetection: boolean;
  lightExposure: boolean;
  doorOpenDetection: boolean;
  dwellTimeAlerts: boolean;
  
  // Intelligence features
  predictiveETA: boolean;
  routeOptimization: boolean;
  conditionBasedAlerts: boolean;
  automatedReporting: boolean;
  
  // Analytics
  dashboardAccess: boolean;
  apiAccess: boolean;
  customReports: boolean;
  dataExport: boolean;
  
  // Support
  24x7Support: boolean;
  dedicatedCSM: boolean;
  quarterlyBusinessReviews: boolean;
  
  // Advanced
  aiInsights: boolean;
  customIntegrations: boolean;
  whiteLabelOptions: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Open Item
```typescript
interface OpenItem {
  id: string;
  customerId: string;
  
  title: string;
  description: string;
  category: 'deployment' | 'integration' | 'training' | 'support' | 'billing' | 'expansion' | 'other';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
  
  // Ownership
  assignedTo: string;
  requestedBy?: string;
  
  // Timeline
  createdAt: Date;
  targetDate?: Date;
  completedAt?: Date;
  
  // Tracking
  source: 'call' | 'email' | 'transcript' | 'internal' | 'customer';
  relatedCallId?: string;
  
  // Updates
  notes: Note[];
  tags: string[];
}

interface Note {
  id: string;
  openItemId: string;
  author: string;
  content: string;
  timestamp: Date;
}
```

### Call Record
```typescript
interface CallRecord {
  id: string;
  customerId: string;
  
  // Call metadata
  callDate: Date;
  duration: number; // minutes
  participants: string[]; // Contact IDs
  callType: 'kickoff' | 'check-in' | 'qbr' | 'support' | 'escalation' | 'expansion' | 'other';
  
  // Content
  transcriptRaw?: string;
  transcriptProcessed?: string;
  summary?: string;
  keyTakeaways?: string[];
  
  // AI-generated
  sentiment: 'positive' | 'neutral' | 'negative';
  healthIndicators?: string[];
  riskFlags?: string[];
  expansionOpportunities?: string[];
  
  // Extracted data
  commitments: Commitment[];
  decisions: Decision[];
  openItemsCreated: string[]; // OpenItem IDs
  
  // Recording
  recordingUrl?: string;
  recordingDuration?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

interface Commitment {
  id: string;
  callId: string;
  description: string;
  madeBy: string;
  dueDate?: Date;
  status: 'pending' | 'completed' | 'overdue';
}

interface Decision {
  id: string;
  callId: string;
  description: string;
  decidedBy: string;
  impact: string;
}
```

### Insight (AI-Generated)
```typescript
interface Insight {
  id: string;
  customerId: string;
  
  // Content
  type: 'risk' | 'opportunity' | 'trend' | 'recommendation' | 'alert';
  category: 'usage' | 'adoption' | 'expansion' | 'churn' | 'engagement' | 'technical';
  title: string;
  description: string;
  confidence: number; // 0-1
  
  // Evidence
  evidence: string[];
  dataPoints?: Record<string, any>;
  
  // Actionability
  actionable: boolean;
  suggestedAction?: string;
  expectedImpact?: string;
  
  // Status
  status: 'new' | 'acknowledged' | 'actioned' | 'dismissed';
  acknowledgedAt?: Date;
  actionedAt?: Date;
  
  // Source
  source: 'ai_analysis' | 'transcript' | 'usage_data' | 'manual' | 'gavin';
  relatedCallId?: string;
  
  createdAt: Date;
  expiresAt?: Date;
}
```

### Value Proof (ROI Tracking)
```typescript
interface ValueProof {
  id: string;
  customerId: string;
  
  // Metrics
  metrics: ValueMetric[];
  
  // ROI calculation
  annualContractValue: number;
  estimatedAnnualSavings: number;
  estimatedAnnualRevenue: number;
  roi: number; // percentage
  paybackPeriod: number; // months
  
  // Qualitative
  testimonials: Testimonial[];
  caseStudyUrl?: string;
  
  // Usage
  lastReportDate?: Date;
  nextReportDate?: Date;
  
  updatedAt: Date;
}

interface ValueMetric {
  id: string;
  valueProofId: string;
  name: string;
  category: 'cost_savings' | 'risk_reduction' | 'efficiency' | 'revenue' | 'compliance';
  baselineValue: number;
  currentValue: number;
  targetValue?: number;
  unit: string;
  trend: 'up' | 'down' | 'flat';
  trendPercentage?: number;
  lastUpdated: Date;
}

interface Testimonial {
  id: string;
  valueProofId: string;
  contactId: string;
  quote: string;
  context?: string;
  usageRights: boolean;
  canSharePublicly: boolean;
  recordedAt: Date;
}
```

---

## Supporting Types

### User (Portal User)
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  avatarUrl?: string;
  preferences: UserPreferences;
  lastLoginAt?: Date;
  createdAt: Date;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'dashboard' | 'customers' | 'pipeline';
  notifications: NotificationPreferences;
  timezone: string;
  dateFormat: string;
}

interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  dailyDigest: boolean;
  customerAlerts: boolean;
  gavinSuggestions: boolean;
}
```

### Activity Log
```typescript
interface ActivityLog {
  id: string;
  userId: string;
  customerId?: string;
  action: string;
  entityType: 'customer' | 'contact' | 'open_item' | 'call' | 'report';
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: Date;
}
```

### Report
```typescript
interface Report {
  id: string;
  customerId: string;
  generatedBy: string;
  
  type: 'deployment_plan' | 'qbr' | 'health_snapshot' | 'value_prop' | 'custom';
  title: string;
  
  // Content
  content: ReportSection[];
  summary?: string;
  
  // Data snapshot
  dataSnapshot: {
    customer: Customer;
    metrics: Record<string, any>;
    generatedAt: Date;
  };
  
  // File
  fileUrl?: string;
  fileFormat: 'pdf' | 'docx' | 'pptx';
  fileSize?: number;
  
  // Status
  status: 'generating' | 'ready' | 'error';
  errorMessage?: string;
  
  // Sharing
  sharedWith: string[];
  downloadCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

interface ReportSection {
  id: string;
  reportId: string;
  title: string;
  content: string;
  type: 'text' | 'chart' | 'table' | 'image';
  order: number;
}
```

---

## Gavin AI Types

### Chat Message
```typescript
interface ChatMessage {
  id: string;
  userId: string;
  customerId?: string; // Optional - if scoped to customer
  
  role: 'user' | 'assistant' | 'system';
  content: string;
  
  // Voice
  voiceUrl?: string;
  voiceDuration?: number;
  
  // Context
  context?: {
    customerId?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
  };
  
  // AI metadata
  model?: string;
  tokensUsed?: number;
  latency?: number; // ms
  
  timestamp: Date;
}

interface ChatSession {
  id: string;
  userId: string;
  customerId?: string;
  title?: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Gavin Suggestion
```typescript
interface GavinSuggestion {
  id: string;
  userId: string;
  customerId?: string;
  
  type: 'proactive' | 'reactive' | 'scheduled';
  category: 'outreach' | 'research' | 'report' | 'alert' | 'insight';
  
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  
  // Action
  suggestedAction?: string;
  actionType?: 'call' | 'email' | 'generate_report' | 'research' | 'review';
  
  // Status
  status: 'pending' | 'accepted' | 'dismissed' | 'completed';
  dismissedAt?: Date;
  completedAt?: Date;
  
  // Evidence
  evidence?: string[];
  relatedData?: Record<string, any>;
  
  createdAt: Date;
  expiresAt?: Date;
}
```

---

## Dashboard Types

### Dashboard Stats
```typescript
interface DashboardStats {
  // Customer counts
  totalCustomers: number;
  activeCustomers: number;
  atRiskCustomers: number;
  churnedCustomers: number;
  prospects: number;
  
  // Health distribution
  healthDistribution: {
    green: number;
    amber: number;
    red: number;
  };
  
  // Activity
  callsThisWeek: number;
  callsThisMonth: number;
  avgCallDuration: number;
  
  // Open items
  totalOpenItems: number;
  criticalOpenItems: number;
  overdueOpenItems: number;
  
  // Revenue
  totalARR: number;
  atRiskARR: number;
  expansionOpportunities: number;
  
  // Recent activity
  recentCalls: CallRecord[];
  recentInsights: Insight[];
  recentOpenItems: OpenItem[];
}
```

### Filter Options
```typescript
interface CustomerFilters {
  search?: string;
  status?: Customer['status'][];
  healthRAG?: Customer['healthRAG'][];
  accountType?: Customer['accountType'][];
  industry?: string[];
  region?: string[];
  accountManager?: string[];
  lastContactDays?: number; // Days since last contact
  hasOpenItems?: boolean;
  hasOverdueItems?: boolean;
  
  // Sorting
  sortBy: 'name' | 'health' | 'lastContact' | 'created';
  sortOrder: 'asc' | 'desc';
  
  // Pagination
  page: number;
  limit: number;
}

interface FilterOptions {
  industries: string[];
  regions: string[];
  accountManagers: string[];
  accountTypes: Customer['accountType'][];
  statuses: Customer['status'][];
}
```

---

## API Request/Response Types

### API Response Wrapper
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  stack?: string; // Only in development
}

// Pagination
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Create/Update DTOs
```typescript
// Partial types for updates
interface CreateCustomerDto extends Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> {}
interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

interface CreateContactDto extends Omit<Contact, 'id' | 'customerId' | 'createdAt' | 'updatedAt'> {}
interface UpdateContactDto extends Partial<CreateContactDto> {}

interface CreateOpenItemDto extends Omit<OpenItem, 'id' | 'customerId' | 'createdAt' | 'completedAt'> {}
interface UpdateOpenItemDto extends Partial<CreateOpenItemDto> {}

interface CreateCallRecordDto extends Omit<CallRecord, 'id' | 'customerId' | 'createdAt' | 'updatedAt'> {}
interface UpdateCallRecordDto extends Partial<CreateCallRecordDto> {}
```

---

## Validation Rules

```typescript
// Validation constants
const VALIDATION = {
  CUSTOMER: {
    NAME_MIN: 2,
    NAME_MAX: 200,
    INDUSTRY_REQUIRED: true,
    REGION_REQUIRED: true,
  },
  CONTACT: {
    NAME_MIN: 2,
    NAME_MAX: 100,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_PATTERN: /^\+?[\d\s-().]{10,}$/,
  },
  OPEN_ITEM: {
    TITLE_MIN: 5,
    TITLE_MAX: 200,
    DESCRIPTION_MAX: 5000,
  },
  CALL: {
    MAX_DURATION: 480, // 8 hours
    PARTICIPANTS_MIN: 1,
  },
};

// Type guards
function isValidCustomer(customer: unknown): customer is Customer {
  // Implementation
  return true;
}

function isValidContact(contact: unknown): contact is Contact {
  // Implementation
  return true;
}
```

---

*Document Version: 1.0*
*Last Updated: 2026-05-15*
*Author: Gavin (Decklar AI)*
