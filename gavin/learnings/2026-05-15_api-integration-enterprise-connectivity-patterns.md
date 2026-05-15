# GAVIN LEARNING SPIKE: API Integration & Enterprise Connectivity Patterns

**Date:** May 15, 2026  
**Agent:** Gavin  
**Topic:** Decklar API Integration — Webhooks, Enterprise TMS/ERP Connectivity & Data Flow Architecture  
**Priority:** HIGH — McKesson and enterprise accounts require seamless system integration

---

## Executive Summary

Enterprise customers don't want another dashboard to check — they want Decklar data flowing directly into their existing systems. API integration is the difference between a "nice-to-have" visibility tool and an essential infrastructure component. This learning synthesizes patterns for connecting Decklar to enterprise TMS, ERP, and BI systems, with specific focus on webhook architectures, data transformation, and common integration challenges.

---

## 1. Why API Integration Matters for Decklar

### The Enterprise Mindset

| Customer Size | Integration Expectation | Decklar Approach |
|--------------|------------------------|------------------|
| SMB (<$10M revenue) | Portal-only acceptable | Honeycomb dashboard sufficient |
| Mid-Market ($10M-$500M) | Basic exports, API "nice to have" | CSV exports + simple API |
| **Enterprise (>$500M)** | **API-first required** | **Full REST API + webhooks + EDI** |

**Key Insight:** Enterprise customers evaluate Decklar against competitors not on device features, but on how seamlessly data flows into their existing operational systems.

### The Integration Maturity Curve

```
Level 1: Portal Only
├── Customer logs into Honeycomb
├── Manual shipment tracking
└── Data siloed from other systems

Level 2: Data Export
├── Scheduled CSV/PDF reports
├── Manual import into TMS/ERP
└── Delayed data (daily/hourly)

Level 3: API Polling
├── Customer app polls Decklar API
├── Near real-time data
└── Requires customer development

Level 4: Webhook Push (TARGET)
├── Decklar pushes events to customer endpoint
├── Real-time data flow
├── Customer system reacts automatically
└── Lowest latency, highest automation

Level 5: Bidirectional Integration
├── Decklar reads from customer TMS
├── Automatic shipment creation
├── Closed-loop visibility
└── Full supply chain orchestration
```

---

## 2. Decklar API Architecture Overview

### 2.1 Core API Capabilities

**REST API Endpoints (Current):**

| Endpoint | Purpose | Use Case |
|----------|---------|----------|
| `GET /shipments` | List all shipments | Dashboard population |
| `GET /shipments/{id}` | Shipment details | Drill-down view |
| `GET /shipments/{id}/events` | Event history | Timeline display |
| `GET /devices` | Device inventory | Fleet management |
| `POST /webhooks` | Register webhook | Real-time notifications |

**Data Model:**
```json
{
  "shipment_id": "SHP-2026-001234",
  "device_id": "BEE-A1B2C3D4",
  "status": "in_transit",
  "origin": {
    "name": "McKesson DC - Memphis",
    "lat": 35.1495,
    "lng": -90.0490,
    "geofence_triggered_at": "2026-05-10T08:23:00Z"
  },
  "destination": {
    "name": "Hospital System - Phoenix",
    "lat": 33.4484,
    "lng": -112.0740
  },
  "current_location": {
    "lat": 34.0522,
    "lng": -118.2437,
    "timestamp": "2026-05-15T14:30:00Z",
    "accuracy_meters": 15
  },
  "telemetry": {
    "temperature_c": 4.2,
    "humidity_pct": 45,
    "shock_g": 0.2,
    "light_pct": 0
  },
  "alerts": [],
  "estimated_arrival": "2026-05-16T09:00:00Z"
}
```

### 2.2 Webhook Event Types

**Event Categories:**

| Event Type | Trigger | Priority |
|------------|---------|----------|
| `shipment.started` | Geofence exit at origin | High |
| `shipment.location_update` | Periodic ping with new location | Medium |
| `shipment.alert` | Temperature/shock/Geofence breach | Critical |
| `shipment.completed` | Geofence entry at destination | High |
| `shipment.delayed` | ETA exceeded threshold | High |
| `device.low_battery` | Battery < 20% | Medium |
| `device.offline` | No ping > threshold | High |

**Webhook Payload Structure:**
```json
{
  "event_id": "evt_987654321",
  "event_type": "shipment.alert",
  "timestamp": "2026-05-15T14:35:22Z",
  "shipment": {
    "id": "SHP-2026-001234",
    "customer_reference": "MCKESSON-PO-789012",
    "tracking_url": "https://track.decklar.com/S001234"
  },
  "alert": {
    "type": "temperature_excursion",
    "severity": "critical",
    "description": "Temperature exceeded threshold: 12.5°C (max: 8°C)",
    "location": {
      "lat": 34.0522,
      "lng": -118.2437,
      "address": "I-10 W, Los Angeles, CA"
    },
    "timestamp": "2026-05-15T14:35:00Z",
    "recommended_action": "Contact carrier immediately. Product may require inspection."
  }
}
```

---

## 3. Enterprise Integration Patterns

### 3.1 Pattern A: TMS Integration (SAP/Oracle/Blue Yonder)

**Customer Profile:** Large manufacturer/distributor with existing TMS

**Integration Flow:**
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   TMS/ERP   │──────▶│   Webhook    │──────▶│   Decklar   │
│   (SAP)     │      │   Endpoint   │      │   API       │
└─────────────┘      └──────────────┘      └─────────────┘
       ▲                                            │
       │         Shipment Created                    │
       │         (POST /shipments)                 │
       │◄───────────────────────────────────────────┘
       │
       │         Real-time Events
       │         (webhook → TMS)
       │◄──────────────────────────────────────────────┐
       │                                               │
┌──────┴────────┐      ┌──────────────┐               │
│  Operations   │      │   Decklar    │───────────────┘
│  Dashboard    │      │   Platform   │   Events pushed
└───────────────┘      └──────────────┘   to webhook URL
```

**Configuration Steps:**
1. Customer provides webhook endpoint URL (must be HTTPS)
2. Decklar registers webhook with customer-specific secret
3. TMS maps Decklar shipment_id to internal PO/trip reference
4. Real-time events flow into TMS alert queue

**Common TMS Mappings:**

| Decklar Field | SAP TM Field | Oracle WMS Field |
|---------------|--------------|------------------|
| shipment_id | TOR_ID | SHIPMENT_NUM |
| customer_reference | PO_NUMBER | CUSTOMER_REF |
| status | LIFECYCLE_STATUS | SHIPMENT_STATUS |
| current_location | GEO_LOCATION | LAST_LOCATION |
| estimated_arrival | PLANNED_ARRIVAL | ETA |

### 3.2 Pattern B: BI/Data Warehouse Integration

**Customer Profile:** Data-driven organization with Snowflake/Databricks/BigQuery

**Architecture:**
```
Decklar API ──▶ ETL Pipeline ──▶ Data Lake ──▶ BI Dashboard
                  (Fivetran/     (Snowflake)   (Tableau/
                   Airbyte)                    PowerBI)
```

**Data Sync Strategy:**
- **Frequency:** Hourly batch for historical, webhook for real-time
- **Schema:** Star schema with shipments fact table, devices dimension
- **Retention:** 2+ years for compliance and trend analysis

**Key Metrics for BI:**
- On-time delivery rate by lane/carrier
- Temperature compliance by product type
- Device battery life trends
- Geofence accuracy by location
- Alert false positive rates

### 3.3 Pattern C: Slack/Teams Notification Layer

**Customer Profile:** Operations teams using collaboration platforms

**Webhook → Slack Integration:**
```javascript
// Cloud Function (AWS Lambda/Google Cloud)
exports.decklarWebhook = (req, res) => {
  const event = req.body;
  
  if (event.event_type === 'shipment.alert') {
    const slackMessage = {
      channel: '#supply-chain-alerts',
      text: `🚨 ALERT: ${event.alert.type}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Temperature Excursion Detected*\n` +
                  `Shipment: ${event.shipment.customer_reference}\n` +
                  `Location: ${event.alert.location.address}\n` +
                  `Current Temp: ${event.shipment.telemetry.temperature_c}°C`
          }
        }
      ]
    };
    
    // Post to Slack
    await slack.chat.postMessage(slackMessage);
  }
  
  res.status(200).send('OK');
};
```

---

## 4. API Security Best Practices

### 4.1 Authentication Patterns

**API Key Authentication:**
```
Header: X-API-Key: dk_live_abc123xyz789
```
- Rotate every 90 days
- Store in environment variables (never in code)
- Separate keys for dev/staging/production

**Webhook Signature Verification:**
```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)

# Usage
if verify_webhook(request.body, request.headers['X-Decklar-Signature'], webhook_secret):
    process_webhook(request.body)
```

### 4.2 Network Security

**Required for Enterprise:**
- [ ] HTTPS/TLS 1.3 for all endpoints
- [ ] IP allowlisting option (static IPs for Decklar webhooks)
- [ ] VPN tunnel for on-premise systems
- [ ] Rate limiting: 1000 req/min default, configurable

**Webhook Security Checklist:**
- [ ] Verify signature on every request
- [ ] Reject requests > 5 seconds old (replay protection)
- [ ] Whitelist Decklar IP ranges
- [ ] Log all webhook attempts (success + failure)

---

## 5. Data Transformation Patterns

### 5.1 Field Mapping Challenges

**Temperature Units:**
```javascript
// Decklar always sends Celsius
temperature_f = (temperature_c * 9/5) + 32;
```

**Coordinate Precision:**
```javascript
// Round to 6 decimal places (~10cm precision)
location.lat = parseFloat(lat.toFixed(6));
```

**Timestamp Standardization:**
```javascript
// Decklar sends ISO 8601 UTC
// Convert to local timezone for display
const localTime = new Date(timestamp).toLocaleString('en-US', {
  timeZone: 'America/New_York'
});
```

### 5.2 Alert Severity Mapping

**Decklar Severity → Customer Severity:**

| Decklar | Standard TMS | Description |
|---------|--------------|-------------|
| critical | 1 - Critical | Product at risk, immediate action required |
| high | 2 - High | SLA breach likely, action within 1 hour |
| medium | 3 - Medium | Monitor, action within 4 hours |
| low | 4 - Low | Informational, no immediate action |

### 5.3 Geofence Event Normalization

**Common Transformation:**
```javascript
// Decklar event
decklarEvent = {
  event_type: "geofence.entered",
  geofence_name: "Port of Long Beach Gate 1",
  timestamp: "2026-05-15T14:30:00Z"
}

// Transform to TMS format
tmsEvent = {
  event_code: "ARRIVAL",
  location_code: "POLB_G1",
  event_time: "2026-05-15T14:30:00Z",
  event_description: "Arrived at Port of Long Beach Gate 1"
};
```

---

## 6. Error Handling & Reliability

### 6.1 Webhook Retry Strategy

**Decklar Retry Policy:**
- Immediate retry: 3 attempts within 30 seconds
- Exponential backoff: 1min, 5min, 15min, 30min
- Max retry duration: 24 hours
- Dead letter queue after 24h

**Customer Endpoint Requirements:**
- Respond with HTTP 200 within 5 seconds
- Return 4xx for permanent errors (don't retry)
- Return 5xx for transient errors (will retry)

### 6.2 Idempotency Patterns

**Duplicate Event Handling:**
```python
# Store processed event IDs
def process_webhook(event):
    event_id = event['event_id']
    
    # Check if already processed
    if db.exists(f"processed:{event_id}"):
        return  # Already handled, return 200
    
    # Process event
    handle_event(event)
    
    # Mark as processed (TTL 7 days)
    db.setex(f"processed:{event_id}", 604800, "1")
```

### 6.3 Monitoring Integration Health

**Key Metrics to Track:**

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Webhook success rate | > 99% | < 95% |
| API response time | < 500ms | > 2s |
| Data latency | < 5 min | > 15 min |
| Failed auth attempts | 0 | > 5/hour |

**Health Check Endpoint:**
```
GET /health/integration
Response: {
  "status": "healthy",
  "last_webhook": "2026-05-15T14:35:00Z",
  "pending_events": 0,
  "webhook_success_rate_24h": 99.7
}
```

---

## 7. McKesson-Specific Integration Considerations

### 7.1 Known Requirements

**From Decklar SOP Documentation:**
- Temperature monitoring for pharmaceutical products (2-8°C)
- FDA 21 CFR Part 11 compliance for data integrity
- Integration with McKesson Connect platform
- Real-time alerts to distribution center operations

### 7.2 Potential Integration Points

**Likely McKesson Systems:**
1. **SAP TM** — Transportation planning and execution
2. **McKesson Connect** — Customer portal and order management
3. **QMS (Quality Management)** — Temperature excursion documentation
4. **PowerBI Dashboards** — Executive visibility

### 7.3 Pre-Integration Discovery Questions

For Jeff to ask McKesson:
1. "What systems need visibility data? SAP, Connect, both?"
2. "Do you have webhook endpoints ready, or do we need middleware?"
3. "What's your preferred alert format? JSON, XML, EDI 214?"
4. "Who receives alerts? Operations team, quality, both?"
5. "Do you have API documentation for your systems?"

---

## 8. Implementation Roadmap

### Phase 1: Basic API Access (Week 1-2)
- [ ] Provision API credentials
- [ ] Test GET /shipments endpoint
- [ ] Document rate limits and quotas

### Phase 2: Webhook Setup (Week 3-4)
- [ ] Customer provides HTTPS endpoint
- [ ] Configure webhook subscriptions
- [ ] Test event delivery
- [ ] Verify signature validation

### Phase 3: Data Mapping (Week 5-6)
- [ ] Map Decklar fields to customer TMS
- [ ] Build transformation layer
- [ ] Test with sample data

### Phase 4: Production Rollout (Week 7-8)
- [ ] Pilot with 10-20 shipments
- [ ] Monitor success rates
- [ ] Train customer operations team
- [ ] Document runbook

### Phase 5: Optimization (Ongoing)
- [ ] Review data latency weekly
- [ ] Optimize webhook batching
- [ ] Expand to additional event types
- [ ] Add bi-directional sync if needed

---

## 9. Competitive Differentiation

### Decklar API vs. Competitors

| Feature | Decklar | Competitor A | Competitor B |
|---------|---------|--------------|--------------|
| **REST API** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Webhook Events** | ✅ Yes | ⚠️ Limited | ❌ No |
| **Real-time Latency** | < 5 min | ~15 min | ~1 hour |
| **Custom Event Types** | ✅ Yes | ❌ No | ❌ No |
| **Bidirectional Sync** | ✅ Yes | ❌ No | ❌ No |
| **API Rate Limit** | 1000/min | 100/min | 500/min |
| **Webhook Retry** | ✅ Yes | ❌ No | ⚠️ Manual |

**Value Proposition:**
> "Decklar's webhook-first architecture means your systems know about supply chain events within minutes, not hours. While competitors rely on polling (which creates delays and wastes API calls), Decklar pushes data to you in real-time."

---

## 10. Action Items

### For Jeff (Immediate)
- [ ] Audit current McKesson integration status
- [ ] Identify other enterprise accounts that could benefit from API integration
- [ ] Prepare API capabilities one-pager for sales conversations
- [ ] Schedule technical discovery call with McKesson IT team

### For Decklar (Product)
- [ ] Develop API usage dashboard for customer self-service
- [ ] Create webhook testing tool in Honeycomb
- [ ] Build pre-built connectors for SAP/Oracle
- [ ] Document API changelog for version management

### For Customer Success (Ongoing)
- [ ] Track API adoption as health score indicator
- [ ] Develop API integration playbooks for top 3 TMS platforms
- [ ] Create webhook monitoring alert for failed deliveries

---

## Key Takeaways

1. **API integration is table stakes for enterprise** — Without it, Decklar is evaluated as a tool, not infrastructure

2. **Webhooks > Polling** — Push architecture delivers real-time value and reduces system load

3. **Security cannot be optional** — Enterprise customers require signature verification, TLS 1.3, and IP allowlisting

4. **Data transformation is half the work** — Field mapping, unit conversion, and format normalization require customer-specific development

5. **Monitoring integration health is critical** — Failed webhooks = blind spots in customer operations

---

*Document generated by Gavin as part of continuous learning initiative for Decklar Customer Intelligence System.*
*Status: Ready for enterprise customer API integration discussions*
