# Decklar Customer Management Portal — API Specification

Complete RESTful API specification for all portal endpoints.

---

## Base URL & Authentication

```
Base URL: /api/v1
Authentication: Bearer Token (JWT)
Content-Type: application/json
```

### Authentication Endpoints
```
POST   /auth/login              # Login with email/password
POST   /auth/logout             # Logout
POST   /auth/refresh            # Refresh JWT token
GET    /auth/me                 # Get current user
```

---

## Customers API

### List Customers
```
GET /customers
```

**Query Parameters:**
```typescript
{
  search?: string;              // Full-text search
  status?: string[];            // Filter by status
  healthRAG?: string[];         // Filter by health
  accountType?: string[];       // Filter by type
  industry?: string[];           // Filter by industry
  region?: string[];           // Filter by region
  page?: number;               // Default: 1
  limit?: number;              // Default: 20, Max: 100
  sortBy?: string;             // name, health, lastContact, created
  sortOrder?: 'asc' | 'desc';   // Default: desc
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customers": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "meta": {
    "timestamp": "2026-05-15T10:00:00Z"
  }
}
```

### Get Customer
```
GET /customers/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": { ... },
    "stats": {
      "openItemsCount": 5,
      "callsCount": 12,
      "daysSinceLastContact": 3
    }
  }
}
```

### Create Customer
```
POST /customers
```

**Request Body:**
```json
{
  "customerName": "Acme Corp",
  "accountManager": "Jeff Calabro",
  "accountType": "enterprise",
  "status": "prospect",
  "healthRAG": "green",
  "industry": "Manufacturing",
  "region": "North America",
  "contacts": [],
  "deployment": { ... },
  "capabilities": { ... },
  "openItems": [],
  "callHistory": [],
  "insights": [],
  "valueProof": { ... },
  "extraFields": {}
}
```

### Update Customer
```
PUT /customers/:id
PATCH /customers/:id    // Partial update
```

### Delete Customer
```
DELETE /customers/:id
```

### Get Customer Stats
```
GET /customers/:id/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalShipments": 1247,
    "activeDevices": 156,
    "alertsThisMonth": 23,
    "avgTransitTime": 14.2,
    "onTimeDelivery": 94.5,
    "healthScore": 87
  }
}
```

---

## Contacts API

### List Contacts
```
GET /customers/:customerId/contacts
```

### Create Contact
```
POST /customers/:customerId/contacts
```

**Request Body:**
```json
{
  "name": "John Smith",
  "title": "VP Operations",
  "email": "john.smith@acme.com",
  "phone": "+1-555-123-4567",
  "role": "champion",
  "isPrimary": true,
  "preferredContactMethod": "email",
  "notes": "Former colleague from previous company"
}
```

### Update Contact
```
PUT /customers/:customerId/contacts/:contactId
PATCH /customers/:customerId/contacts/:contactId
```

### Delete Contact
```
DELETE /customers/:customerId/contacts/:contactId
```

### Set Primary Contact
```
POST /customers/:customerId/contacts/:contactId/primary
```

---

## Open Items API

### List Open Items
```
GET /customers/:customerId/open-items
GET /open-items          // All open items across customers
```

**Query Parameters:**
```typescript
{
  status?: 'open' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
  priority?: 'critical' | 'high' | 'medium' | 'low';
  category?: string[];
  assignedTo?: string;
  overdue?: boolean;
  targetBefore?: Date;
}
```

### Create Open Item
```
POST /customers/:customerId/open-items
```

**Request Body:**
```json
{
  "title": "Complete facility list",
  "description": "Need list of all origin and destination facilities",
  "category": "deployment",
  "priority": "high",
  "status": "open",
  "assignedTo": "Jeff Calabro",
  "targetDate": "2026-05-20T00:00:00Z",
  "source": "call",
  "relatedCallId": "uuid",
  "tags": ["deployment", "facilities"]
}
```

### Update Open Item
```
PUT /customers/:customerId/open-items/:itemId
PATCH /customers/:customerId/open-items/:itemId
```

### Complete Open Item
```
POST /customers/:customerId/open-items/:itemId/complete
```

**Request Body:**
```json
{
  "notes": "Received complete list from Nick on 5/15"
}
```

### Add Note to Open Item
```
POST /customers/:customerId/open-items/:itemId/notes
```

**Request Body:**
```json
{
  "content": "Followed up via email, awaiting response",
  "author": "Jeff Calabro"
}
```

---

## Call Records API

### List Call Records
```
GET /customers/:customerId/calls
GET /calls               // All calls across customers
```

**Query Parameters:**
```typescript
{
  callType?: string[];
  startDate?: Date;
  endDate?: Date;
  participants?: string[];  // Contact IDs
  sentiment?: 'positive' | 'neutral' | 'negative';
}
```

### Get Call Record
```
GET /customers/:customerId/calls/:callId
```

### Create Call Record
```
POST /customers/:customerId/calls
```

**Request Body:**
```json
{
  "callDate": "2026-05-15T14:00:00Z",
  "duration": 45,
  "participants": ["contact-uuid-1", "contact-uuid-2"],
  "callType": "check-in",
  "transcriptRaw": "...",
  "summary": "Discussed deployment timeline",
  "keyTakeaways": ["Timeline moved to June", "Need facility list"],
  "sentiment": "positive",
  "commitments": [...],
  "decisions": [...]
}
```

### Update Call Record
```
PUT /customers/:customerId/calls/:callId
PATCH /customers/:customerId/calls/:callId
```

### Delete Call Record
```
DELETE /customers/:customerId/calls/:callId
```

### Upload Call Recording
```
POST /customers/:customerId/calls/:callId/recording
Content-Type: multipart/form-data
```

**Form Fields:**
```
recording: File (audio/mpeg, audio/wav, audio/mp4)
```

### Process Transcript
```
POST /customers/:customerId/calls/:callId/process
```

**Request Body:**
```json
{
  "transcriptText": "...",
  "extractEntities": true,
  "generateSummary": true,
  "identifyActionItems": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "...",
    "sentiment": "positive",
    "keyTakeaways": [...],
    "openItemsCreated": [...],
    "entities": {
      "people": [...],
      "dates": [...],
      "commitments": [...]
    }
  }
}
```

---

## Insights API

### List Insights
```
GET /customers/:customerId/insights
GET /insights            // All insights across customers
```

**Query Parameters:**
```typescript
{
  type?: 'risk' | 'opportunity' | 'trend' | 'recommendation' | 'alert';
  category?: string[];
  status?: 'new' | 'acknowledged' | 'actioned' | 'dismissed';
  confidence?: number;      // Minimum confidence threshold
}
```

### Get Insight
```
GET /customers/:customerId/insights/:insightId
```

### Acknowledge Insight
```
POST /customers/:customerId/insights/:insightId/acknowledge
```

### Action Insight
```
POST /customers/:customerId/insights/:insightId/action
```

**Request Body:**
```json
{
  "actionTaken": "Created outreach task",
  "result": "Customer responded positively"
}
```

### Dismiss Insight
```
POST /customers/:customerId/insights/:insightId/dismiss
```

---

## Gavin AI API

### Send Message
```
POST /gavin/chat
```

**Request Body:**
```json
{
  "message": "What's the latest on Schneider?",
  "sessionId": "uuid",           // Optional - for continuing conversation
  "customerId": "uuid",          // Optional - scope to customer
  "context": {
    "currentView": "customer_detail",
    "selectedCustomerId": "uuid"
  },
  "options": {
    "includeVoice": false,
    "voiceSpeed": 1.0
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "uuid",
    "response": "Schneider Electric is currently Amber status. Last call was May 13...",
    "suggestions": [
      "View Schneider's deployment plan",
      "Generate QBR for Schneider",
      "Check open items"
    ],
    "voiceUrl": null,
    "tokensUsed": 245,
    "latency": 1200
  }
}
```

### Voice Query
```
POST /gavin/voice
Content-Type: multipart/form-data
```

**Form Fields:**
```
audio: File (audio/mpeg, audio/wav)
customerId?: string
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transcript": "What's the latest on Schneider?",
    "response": "...",
    "voiceResponse": "...",
    "voiceUrl": "/api/v1/gavin/voice/response/uuid.mp3"
  }
}
```

### Get Suggestions
```
GET /gavin/suggestions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "uuid",
        "type": "proactive",
        "category": "outreach",
        "title": "Schneider check-in due",
        "description": "14 days since last contact",
        "priority": "medium",
        "customerId": "uuid",
        "suggestedAction": "Schedule QBR call"
      }
    ]
  }
}
```

### Get Chat History
```
GET /gavin/sessions
GET /gavin/sessions/:sessionId
```

### Research Request
```
POST /gavin/research
```

**Request Body:**
```json
{
  "topic": "industry trends cold chain logistics",
  "customerId": "uuid",          // Optional - customer-specific research
  "depth": "brief" | "comprehensive",
  "sources": ["web", "news", "internal"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "researchId": "uuid",
    "status": "pending",
    "estimatedCompletion": "2026-05-15T10:05:00Z"
  }
}
```

### Get Research Result
```
GET /gavin/research/:researchId
```

---

## Reports API

### Generate Report
```
POST /reports/generate
```

**Request Body:**
```json
{
  "type": "deployment_plan" | "qbr" | "health_snapshot" | "value_prop",
  "customerId": "uuid",
  "title": "Schneider Q2 QBR",
  "options": {
    "includeCharts": true,
    "includeMetrics": true,
    "dateRange": {
      "start": "2026-04-01",
      "end": "2026-06-30"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "status": "generating",
    "estimatedCompletion": "2026-05-15T10:02:00Z"
  }
}
```

### Get Report Status
```
GET /reports/:reportId
```

### Download Report
```
GET /reports/:reportId/download
```

**Query Parameters:**
```typescript
{
  format: 'pdf' | 'docx' | 'pptx';  // Default: pdf
}
```

**Response:** File stream

### List Reports
```
GET /reports
GET /customers/:customerId/reports
```

**Query Parameters:**
```typescript
{
  type?: string[];
  status?: 'generating' | 'ready' | 'error';
  startDate?: Date;
  endDate?: Date;
}
```

### Preview Report
```
GET /reports/:reportId/preview
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sections": [...],
    "summary": "...",
    "pages": 12
  }
}
```

---

## Search API

### Global Search
```
GET /search?q={query}
```

**Query Parameters:**
```typescript
{
  q: string;                    // Required - search query
  entityTypes?: ('customer' | 'contact' | 'open_item' | 'call' | 'transcript')[];
  limit?: number;              // Default: 20
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "customer",
        "score": 0.95,
        "entity": { ... },
        "highlights": [...]
      },
      {
        "type": "transcript",
        "score": 0.87,
        "entity": { ... },
        "highlights": ["...Schneider mentioned..."]
      }
    ],
    "total": 45,
    "facets": {
      "byType": { "customer": 12, "contact": 8, "transcript": 25 }
    }
  }
}
```

### Customer Search
```
GET /search/customers?q={query}
```

### Transcript Search
```
GET /search/transcripts?q={query}
```

**Query Parameters:**
```typescript
{
  q: string;
  customerId?: string;          // Scope to customer
  startDate?: Date;
  endDate?: Date;
  callType?: string[];
}
```

---

## Dashboard API

### Get Dashboard Stats
```
GET /dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 156,
    "activeCustomers": 89,
    "atRiskCustomers": 12,
    "healthDistribution": { "green": 67, "amber": 45, "red": 12 },
    "callsThisWeek": 23,
    "callsThisMonth": 87,
    "avgCallDuration": 42,
    "totalOpenItems": 234,
    "criticalOpenItems": 18,
    "overdueOpenItems": 23,
    "totalARR": 4250000,
    "atRiskARR": 680000,
    "recentActivity": [...]
  }
}
```

### Get Activity Feed
```
GET /dashboard/activity
```

**Query Parameters:**
```typescript
{
  limit?: number;              // Default: 20
  before?: Date;                // Pagination cursor
}
```

### Get Health Trends
```
GET /dashboard/health-trends
```

**Query Parameters:**
```typescript
{
  period: '7d' | '30d' | '90d' | '1y';  // Default: 30d
}
```

---

## Export API

### Export Customers
```
POST /export/customers
```

**Request Body:**
```json
{
  "format": "csv" | "xlsx" | "json",
  "filters": { ... },
  "fields": ["customerName", "status", "healthRAG", "lastContactDate"]
}
```

### Export Call History
```
POST /export/calls
```

**Request Body:**
```json
{
  "customerId": "uuid",
  "format": "csv",
  "dateRange": { "start": "...", "end": "..." }
}
```

---

## WebSocket Events

Real-time updates via WebSocket connection at `/ws`

### Events

#### Customer Updated
```json
{
  "type": "customer.updated",
  "data": {
    "customerId": "uuid",
    "changes": { ... },
    "timestamp": "2026-05-15T10:00:00Z"
  }
}
```

#### New Open Item
```json
{
  "type": "open_item.created",
  "data": {
    "openItemId": "uuid",
    "customerId": "uuid",
    "title": "...",
    "timestamp": "2026-05-15T10:00:00Z"
  }
}
```

#### Gavin Suggestion
```json
{
  "type": "gavin.suggestion",
  "data": {
    "suggestionId": "uuid",
    "title": "...",
    "priority": "high",
    "timestamp": "2026-05-15T10:00:00Z"
  }
}
```

#### Report Ready
```json
{
  "type": "report.ready",
  "data": {
    "reportId": "uuid",
    "customerId": "uuid",
    "downloadUrl": "...",
    "timestamp": "2026-05-15T10:00:00Z"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `AI_TIMEOUT` | 504 | AI service timeout |

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid customer data",
    "details": {
      "customerName": ["Required field"],
      "email": ["Invalid format"]
    }
  },
  "meta": {
    "timestamp": "2026-05-15T10:00:00Z",
    "requestId": "uuid"
  }
}
```

---

## Rate Limiting

| Endpoint Group | Limit | Window |
|----------------|-------|--------|
| Auth | 10 | 1 minute |
| General API | 100 | 1 minute |
| Gavin Chat | 30 | 1 minute |
| Report Generation | 5 | 1 minute |
| Search | 60 | 1 minute |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1715772000
```

---

*Document Version: 1.0*
*Last Updated: 2026-05-15*
*Author: Gavin (Decklar AI)*
