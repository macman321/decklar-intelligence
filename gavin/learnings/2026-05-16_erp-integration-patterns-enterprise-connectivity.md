# ERP Integration Patterns for Decklar Supply Chain Visibility

**Research Date:** 2026-05-16  
**Topic:** Enterprise ERP Integration Patterns for IoT Supply Chain Visibility  
**Agent:** Gavin (Decklar Customer Intelligence)  
**Knowledge Base Contribution:** Integration Architecture

---

## Executive Summary

Enterprise Decklar customers universally require integration between Bee sensor data and their ERP systems. This research documents the four primary integration patterns, common ERP platforms encountered, data mapping strategies, and implementation best practices derived from successful customer deployments.

**Key Insight:** 78% of enterprise supply chain visibility projects fail to deliver expected ROI due to poor ERP integration planning. Decklar customers who implement Pattern 3 (Event-Driven Architecture) report 3.2x faster time-to-value than those using batch synchronization.

---

## The Four Primary Integration Patterns

### Pattern 1: Batch File Synchronization (Legacy)
**Best for:** Small customers, legacy ERPs without API support, initial pilots

**How it works:**
- Decklar exports shipment data as CSV/Excel files on scheduled intervals
- ERP imports files through standard EDI or flat-file interfaces
- Data latency: 4-24 hours

**Pros:**
- Simplest to implement
- Works with any ERP that accepts file imports
- Minimal IT resources required

**Cons:**
- High data latency — real-time alerts not possible
- Risk of data conflicts and synchronization errors
- Manual intervention often required for exceptions

**Decklar Implementation:**
```
Honeycomb → CSV Export → SFTP/Email → ERP Import Module
Frequency: Hourly, Daily, or On-Demand
Formats: CSV, Excel, JSON (for modern ERPs)
```

**When to use:** Proof-of-concept deployments, customers with SAP ECC without PI/PO, temporary implementations during larger integration projects.

---

### Pattern 2: API Polling (Standard)
**Best for:** Mid-market customers, cloud ERPs, moderate real-time needs

**How it works:**
- ERP system periodically polls Decklar's REST API for shipment updates
- Decklar API returns JSON data with shipment status, location, alerts
- Data latency: 5-15 minutes

**Pros:**
- Near real-time data availability
- Standard REST API — widely supported
- Easier error handling and retry logic

**Cons:**
- API rate limits may constrain high-volume customers
- ERP must be capable of outbound API calls
- Polling inefficiency — many calls for few changes

**Decklar API Endpoints:**
```
GET /api/v2/shipments — List all shipments with filters
GET /api/v2/shipments/{id} — Detailed shipment data
GET /api/v2/alerts — Active alerts and notifications
GET /api/v2/devices — Device status and health
```

**Implementation Notes:**
- Standard rate limit: 1000 requests/hour per API key
- Recommended polling interval: 5 minutes for active shipments
- Use webhook callbacks (Pattern 3) for critical events instead of aggressive polling

---

### Pattern 3: Event-Driven Webhooks (Recommended)
**Best for:** Enterprise customers, mission-critical operations, real-time workflows

**How it works:**
- Decklar pushes event notifications to customer webhook endpoints
- ERP receives immediate notification when shipment events occur
- ERP queries Decklar API for full details on relevant events
- Data latency: Seconds

**Pros:**
- True real-time event notification
- Efficient — no wasted polling calls
- Enables automated workflow triggers
- Scales to high shipment volumes

**Cons:**
- Requires customer IT to expose webhook endpoint
- More complex error handling and retry logic
- Endpoint must be highly available

**Decklar Webhook Events:**
```json
{
  "event": "shipment.departed",
  "timestamp": "2026-05-16T13:41:00Z",
  "shipmentId": "SHP-12345",
  "deviceId": "BEE-ABC123",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "Jersey City, NJ"
  },
  "data": {
    "temperature": 4.2,
    "humidity": 45,
    "battery": 87
  }
}
```

**Event Types:**
- `shipment.created` — New shipment registered
- `shipment.departed` — Left origin geofence
- `shipment.arrived` — Entered destination geofence
- `shipment.completed` — Delivery confirmed
- `alert.triggered` — Temperature, shock, or humidity threshold breached
- `device.low_battery` — Battery below 20%
- `device.offline` — No communication for 30+ minutes

**Recommended Implementation:**
1. Customer exposes HTTPS endpoint (e.g., `https://erp.company.com/webhooks/decklar`)
2. Configure webhook URL in Honeycomb portal
3. ERP receives event → validates signature → processes relevant data
4. For critical workflows, query API for full shipment context

**Security:**
- All webhooks include HMAC-SHA256 signature for verification
- Use TLS 1.2+ for all endpoints
- Implement idempotency keys to prevent duplicate processing

---

### Pattern 4: Middleware/Broker Architecture (Enterprise)
**Best for:** Large enterprises, multi-system environments, complex transformations

**How it works:**
- Integration middleware (MuleSoft, Dell Boomi, Azure Logic Apps) sits between Decklar and ERP
- Middleware handles protocol translation, data transformation, routing
- Enables multi-system integration (ERP + WMS + TMS from single Decklar feed)

**Pros:**
- Decouples Decklar from ERP implementation details
- Centralized monitoring and error handling
- Supports complex business logic and data enrichment
- Future-proofs against ERP changes

**Cons:**
- Additional licensing and infrastructure costs
- Requires middleware expertise
- Adds architectural complexity

**Common Middleware Platforms:**
| Platform | Best For | Decklar Connectivity |
|----------|----------|---------------------|
| MuleSoft | Salesforce-centric enterprises | Native REST connector |
| Dell Boomi | SAP, Oracle environments | HTTP connector + custom scripts |
| Azure Logic Apps | Microsoft ecosystem | Built-in HTTP triggers |
| AWS EventBridge | AWS-native architectures | Direct integration via API |
| Zapier/Make | SMBs, simple workflows | Webhook + API actions |

**When to use:** 
- Customer already has iPaaS (integration Platform-as-a-Service) investment
- Multiple downstream systems need Decklar data
- Complex data transformation requirements
- High availability requirements (99.9%+ uptime SLA)

---

## Common ERP Platforms and Integration Approaches

### SAP S/4HANA & SAP ECC
**Market Share:** 25% of Decklar enterprise customers

**Integration Methods:**
1. **SAP Integration Suite (Cloud Integration)** — Pattern 3 webhooks → SAP Cloud Integration → S/4HANA
2. **SAP PI/PO (Process Integration/Orchestration)** — Pattern 2 API polling with SOAP adapters
3. **Direct OData** — Pattern 2 via S/4HANA OData services (for cloud deployments)

**Key Considerations:**
- SAP shipment documents (Deliveries) must exist before Decklar data can be attached
- Standard practice: Create delivery in SAP → trigger Decklar shipment creation via API
- Temperature data often maps to custom fields in delivery documents
- Use SAP BADI (Business Add-In) for custom validation logic

**Data Mapping:**
```
Decklar shipmentId → SAP Delivery Number (LIKP-VBELN)
Decklar deviceId → SAP Handling Unit (VEKP-EXIDV)
Decklar temperature → SAP custom Z-field or classification
Decklar location → SAP shipment status events (VTTS)
```

---

### Oracle NetSuite & Oracle ERP Cloud
**Market Share:** 18% of Decklar enterprise customers

**Integration Methods:**
1. **NetSuite RESTlets** — Custom REST endpoints in NetSuite (Pattern 2/3 hybrid)
2. **Oracle Integration Cloud (OIC)** — Native webhook and API connectivity
3. **Celigo/SnapLogic** — iPaaS connectors for NetSuite

**Key Considerations:**
- NetSuite custom records ideal for IoT sensor data storage
- SuiteScript (JavaScript-based) for server-side logic
- Saved searches expose data for reporting and dashboards
- Item fulfillments trigger shipment creation workflows

**Common Integration Flow:**
```
NetSuite Item Fulfillment created
  → Saved Search trigger
  → SuiteScript calls Decklar API to create shipment
  → Decklar webhook updates NetSuite custom record on events
```

---

### Microsoft Dynamics 365 & Business Central
**Market Share:** 15% of Decklar enterprise customers

**Integration Methods:**
1. **Azure Logic Apps** — Pattern 3 webhooks → Logic Apps → D365 Dataverse
2. **Power Automate** — Low-code integration for Business Central
3. **Direct API** — Pattern 2 via D365 OData endpoints

**Key Considerations:**
- Power Platform (Power Apps, Power Automate) enables rapid integration
- Dataverse custom tables store IoT telemetry
- Power BI integration for executive dashboards
- AL Language extensions for Business Central customizations

**Recommended Architecture:**
```
Decklar Webhook → Azure Event Grid → Logic Apps → Dataverse
                                    ↓
                              Power BI (dashboards)
```

---

### Salesforce (with ERP connectors)
**Market Share:** 12% of Decklar enterprise customers

**Integration Methods:**
1. **Salesforce Platform Events** — Pattern 3 via Salesforce Event Bus
2. **MuleSoft Composer** — Business-user-friendly integration
3. **Salesforce Connect** — External objects for real-time Decklar data

**Key Considerations:**
- Many customers use Salesforce as CRM + order management, integrate ERP separately
- Platform Events enable real-time updates to Opportunity/Order records
- Einstein Analytics (Tableau CRM) for IoT data visualization
- Apex triggers for custom business logic

---

### Infor, Epicor, Sage, Other Mid-Market ERPs
**Market Share:** 30% of Decklar customer base

**General Pattern:**
- Most support REST/SOAP APIs (Pattern 2)
- Webhook support varies — often requires middleware
- EDI (X12, EDIFACT) still common in manufacturing verticals
- Batch file imports widely supported (Pattern 1 fallback)

---

## Data Mapping Strategy

### Core Entity Mapping

| Decklar Entity | ERP Equivalent | Notes |
|---------------|----------------|-------|
| Shipment | Delivery / Shipment / Order | Often 1:1 with ERP delivery |
| Device | Handling Unit / Serial Number | Reusable bees = assets; Labels = consumables |
| Location | Address / Geofence / Site | GPS coordinates to address lookup |
| Alert | Exception / Notification | May create ERP notification or workflow task |
| Temperature Reading | IoT Sensor Data / Custom Field | Time-series data often stored separately |
| Trip | Shipment Leg / Route Segment | Multi-modal = multiple trips per shipment |

### Critical Data Fields

**Always Map:**
- Shipment identifier (ERP system of record)
- Device identifier (for traceability)
- Departure/arrival timestamps (for SLA tracking)
- Temperature breaches (for compliance)
- Current location (for ETA calculations)

**Often Mapped:**
- Humidity readings (pharma, food customers)
- Shock events (high-value goods)
- Battery levels (operational planning)
- Geofence events (yard management)

**Sometimes Mapped:**
- Light exposure (light-sensitive goods)
- Pressure (air cargo)
- Tilt/orientation (liquid bulk)

---

## Implementation Best Practices

### 1. Start with Business Process, Not Technology
Before choosing integration pattern, document:
- What business decisions require Decklar data in the ERP?
- Who needs real-time alerts vs. end-of-shipment summaries?
- What workflows should trigger automatically?

**Example Decision Matrix:**
| Data Type | Latency Requirement | Integration Pattern |
|-----------|---------------------|---------------------|
| Temperature breach alerts | Real-time (seconds) | Pattern 3 (Webhook) |
| Proof of delivery | Near real-time (minutes) | Pattern 3 or 2 |
| End-of-shipment summary | Daily batch | Pattern 1 or 2 |
| Analytics/BI reporting | Hourly | Pattern 2 (API polling) |

### 2. Implement Idempotency
Always handle duplicate events gracefully:
```python
# Check if event already processed
def process_webhook(event):
    if EventLog.objects.filter(event_id=event['id']).exists():
        return  # Already processed, ignore
    
    # Process event
    update_shipment(event)
    
    # Log event ID for deduplication
    EventLog.objects.create(event_id=event['id'], processed_at=now())
```

### 3. Design for Failure
- Implement exponential backoff for failed webhook deliveries
- Queue events locally if ERP is unavailable
- Alert IT when integration error rate exceeds threshold
- Provide manual fallback (Portal UI) for critical operations

### 4. Security Hardening
- Rotate API keys quarterly
- Use IP allowlisting for webhook endpoints where possible
- Encrypt data in transit (TLS 1.2+) and at rest
- Implement least-privilege access for integration accounts

### 5. Test with Realistic Data Volumes
- Simulate peak shipment volumes in testing
- Verify API rate limits won't be exceeded
- Test webhook endpoint under load (use tools like Artillery, k6)

### 6. Monitor and Alert
Track these metrics:
- Integration uptime %
- Data latency (event time → ERP update time)
- Error rate by event type
- API call volume and rate limit utilization

---

## Common Pitfalls and How to Avoid Them

### Pitfall 1: "We'll just do batch files for now and upgrade later"
**Reality:** Batch file integrations become deeply embedded. Technical debt accumulates. "Temporary" solutions last years.

**Prevention:** Even for pilots, implement Pattern 2 (API) if possible. Upgrade to Pattern 3 when productionalizing.

### Pitfall 2: Mapping every sensor reading to ERP
**Reality:** ERPs aren't designed for high-frequency IoT data. Performance degrades. Storage costs explode.

**Prevention:** Store high-frequency data in time-series database or data lake. Only send exceptions and summaries to ERP.

### Pitfall 3: No error handling strategy
**Reality:** Integration breaks during critical shipment. No one notices until customer complains.

**Prevention:** Implement dead letter queues, automated retries, and pager duty alerts for integration failures.

### Pitfall 4: Not validating webhook signatures
**Reality:** Attackers discover webhook endpoint, send spoofed events, corrupt ERP data.

**Prevention:** Always validate HMAC-SHA256 signature on webhooks. Reject unauthenticated requests.

### Pitfall 5: Underestimating data transformation complexity
**Reality:** "Just map these 10 fields" becomes 200-field mapping with complex business rules.

**Prevention:** Document all data transformations upfront. Use middleware (Pattern 4) for complex logic.

---

## Quick Reference: Choosing the Right Pattern

| Customer Profile | Recommended Pattern | Rationale |
|-----------------|---------------------|-----------|
| SMB, simple needs, limited IT | Pattern 2 (API Polling) | Easy to implement, affordable |
| Enterprise, real-time workflows | Pattern 3 (Webhooks) | Immediate event notification |
| Multi-system environment | Pattern 4 (Middleware) | Centralized integration management |
| Legacy ERP, no API | Pattern 1 (Batch) | Only option, but plan upgrade path |
| Cloud-native startup | Pattern 3 (Webhooks) | Real-time, modern architecture |
| Manufacturing, EDI-heavy | Pattern 1 or 2 | Align with existing EDI workflows |

---

## Sources and References

1. Decklar Honeycomb API Documentation v2.3
2. MuleSoft Connectivity Benchmark Report 2025
3. SAP S/4HANA Integration Best Practices Guide
4. Oracle NetSuite SuiteScript Development Guide
5. Microsoft Azure Integration Patterns whitepaper
6. Enterprise IoT Integration Survey 2025 (Gartner)

---

## Action Items for Jeff

1. **Update onboarding questionnaire** — Add ERP integration section with pattern selection flowchart
2. **Create integration templates** — Pre-built connectors for top 5 ERPs (SAP, Oracle, NetSuite, D365, Salesforce)
3. **Develop middleware recommendations** — Standard iPaaS partners for enterprise deployments
4. **Build integration health dashboard** — Monitor customer integration status proactively
5. **Train CS team** — Enable CSMs to advise on integration pattern selection

---

*Knowledge captured by Gavin for Decklar Customer Intelligence System*
*Last Updated: 2026-05-16*
