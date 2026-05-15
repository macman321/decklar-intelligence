---
title: "The ERP Integration Playbook: Connecting IoT Supply Chain Data to Your Business Systems"
date: 2026-05-14T16:45:00Z
author: "Gavin"
tags: ["erp", "integration", "api", "data-pipeline", "supply-chain"]
image: /assets/images/erp-integration-header.png
layout: post.njk
---

# The ERP Integration Playbook: Connecting IoT Supply Chain Data to Your Business Systems

*You've got real-time visibility into your shipments. Now what? Here's how to turn sensor data into actionable business intelligence by connecting Decklar to your ERP, WMS, and TMS systems.*

---

## The Integration Gap

Most supply chain teams face the same frustrating reality: they've invested in IoT tracking, they have beautiful real-time dashboards showing where every shipment is... but their ERP still thinks that $2M pharmaceutical shipment is "in transit" with no ETA.

**The problem isn't visibility. It's integration.**

Your procurement team creates purchase orders in the ERP. Your warehouse manages inventory in the WMS. Your logistics team tracks shipments in the TMS. And your IoT platform sits in yet another silo, disconnected from the systems that actually run your business.

This playbook closes that gap.

---

## Why ERP Integration Matters

### The Cost of Disconnected Data

| Impact Area | Without Integration | With Integration |
|-------------|---------------------|------------------|
| **Inventory Planning** | Overstock safety buffer "just in case" | Just-in-time based on actual arrival times |
| **Customer Service** | "Let me check with logistics and get back to you" | Real-time status from unified system |
| **Financial Close** | Month-end accrual estimates | Actual receipt-triggered AP posting |
| **Exception Management** | Reactive firefighting | Predictive alerts before problems hit |
| **Reporting** | Weekly batch reconciliation | Continuous synchronized data |

**Real-world impact:** A mid-size pharmaceutical distributor we work with reduced safety stock by $1.2M in the first quarter after integration—simply because procurement could trust the actual arrival data instead of padding for uncertainty.

---

## Integration Architecture Overview

### The Four Integration Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                    DECKLAR IoT PLATFORM                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  GPS     │  │ Sensors  │  │ Alerts   │  │  APIs      │  │
│  │  Data    │  │ (Temp,   │  │ & Events │  │  Webhooks  │  │
│  │          │  │ Humidity)│  │          │  │            │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       └──────────────┴─────────────┴──────────────┘         │
│                         │                                   │
│                    API GATEWAY                              │
│              (REST, Webhooks, Events)                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
┌────────────────┐ ┌──────────────┐ ┌──────────────┐
│      ERP        │ │     WMS      │ │     TMS      │
│  (SAP/Oracle/   │ │ (Manhattan/  │ │ (BluJay/    │
│   NetSuite)     │ │  Blue Yonder)│ │  MercuryGate)│
└────────────────┘ └──────────────┘ └──────────────┘
```

### Pattern 1: Event-Driven Webhooks (Real-Time)

**Best for:** Critical alerts, shipment status updates, exception handling

**How it works:**
1. Decklar detects an event (geofence entry, temperature excursion, delivery confirmation)
2. Webhook fires immediately to your endpoint
3. Your middleware validates, transforms, and posts to ERP
4. ERP updates shipment status, triggers workflows

**Example payload:**
```json
{
  "event_type": "geofence_entry",
  "shipment_id": "SH-2026-0514-001",
  "device_id": "BEE-7A3F-9921",
  "timestamp": "2026-05-14T14:23:17Z",
  "location": {
    "lat": 40.7589,
    "lng": -73.9851,
    "accuracy_meters": 8
  },
  "geofence": {
    "name": "NYC Distribution Center",
    "type": "destination"
  },
  "shipment_context": {
    "po_number": "PO-2026-4459",
    "customer_id": "CUST-7721",
    "expected_arrival": "2026-05-14T15:00:00Z"
  },
  "sensor_data": {
    "temperature_c": 4.2,
    "humidity_pct": 45,
    "battery_pct": 78
  }
}
```

**Typical latency:** <5 seconds from event to ERP update

---

### Pattern 2: Scheduled API Polling (Batch)

**Best for:** Non-urgent updates, historical data sync, backup reconciliation

**How it works:**
1. Your integration runs on a schedule (every 15 min, hourly, etc.)
2. Queries Decklar API for shipments updated since last run
3. Transforms and batches updates
4. Posts to ERP in bulk

**When to use:**
- Cost optimization (fewer API calls than webhooks)
- Legacy ERPs that can't handle real-time feeds
- Compliance audit trails requiring periodic snapshots

**Typical frequency:** Every 15 minutes for active shipments, hourly for completed

---

### Pattern 3: File-Based Integration (Legacy)

**Best for:** Older ERPs, air-gapped environments, compliance archives

**How it works:**
1. Decklar exports CSV/XML at scheduled intervals
2. File lands in SFTP/SharePoint/secure drop location
3. ERP import job picks up and processes

**Format example (CSV):**
```csv
shipment_id,device_id,event_type,timestamp,location_lat,location_lng,temperature_c,status
SH-2026-0514-001,BEE-7A3F-9921,departure,2026-05-14T08:15:00Z,34.0522,-118.2437,4.1,in_transit
SH-2026-0514-001,BEE-7A3F-9921,waypoint,2026-05-14T12:30:00Z,36.1699,-115.1398,4.3,in_transit
SH-2026-0514-001,BEE-7A3F-9921,arrival,2026-05-14T14:23:17Z,40.7589,-73.9851,4.2,delivered
```

**When to use:** Your ERP was installed before smartphones existed

---

### Pattern 4: Direct Database Sync (Advanced)

**Best for:** Data warehouse projects, BI/analytics platforms, ML pipelines

**How it works:**
1. Decklar data streams to cloud data warehouse (Snowflake, BigQuery, Redshift)
2. ETL/ELT processes transform and normalize
3. ERP queries data warehouse for enriched shipment data

**Use cases:**
- Predictive ETA models using ML
- Multi-source shipment consolidation (carrier EDI + IoT + GPS)
- Executive dashboards requiring joined data

---

## Field Mapping: Decklar to ERP

### Core Shipment Data

| Decklar Field | SAP Mapping | Oracle SCM | NetSuite |
|---------------|-------------|------------|----------|
| `shipment_id` | VBELN (Delivery) | WSH_DELIVERIES.DELIVERY_ID | Transaction ID |
| `po_number` | BSTNR (PO Reference) | PO_HEADERS.SEGMENT1 | Created From |
| `device_id` | ZZ_DEVICE_ID (Custom) | WSH_SERIAL_NUMBERS | Custom Field |
| `status` | LFSTA (Delivery Status) | WSH_DELIVERY_LEGS | Status |
| `location_lat/lng` | ZZ_GPS_COORD | WSH_TRIPS | Custom Field |

### Sensor Data Mapping

| Sensor Type | SAP Extension | Meaning |
|-------------|---------------|---------|
| Temperature | ZZ_TEMP_C | Current temperature in Celsius |
| Humidity | ZZ_HUMIDITY_PCT | Relative humidity percentage |
| Shock Events | ZZ_SHOCK_COUNT | Cumulative impact events |
| Battery | ZZ_BATTERY_PCT | Device battery remaining |

**Pro tip:** Most ERPs have user-defined fields or extension frameworks. Don't try to shoehorn IoT data into standard fields that don't fit—use the extension mechanism properly.

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Deliverables:**
- [ ] Map business events to Decklar webhook events
- [ ] Document field mappings for your ERP
- [ ] Set up development/sandbox environment
- [ ] Create test shipments in Decklar

**Key questions to answer:**
- What ERP events should trigger on geofence entry vs. exit?
- Do you need real-time or is 15-minute polling sufficient?
- Which sensor data fields matter for your use case?

### Phase 2: Connectivity (Week 3-4)

**Deliverables:**
- [ ] Decklar API credentials configured
- [ ] Webhook endpoints secured (HTTPS + auth tokens)
- [ ] Middleware/API gateway set up
- [ ] Initial handshake: Test shipment flows end-to-end

**Security checklist:**
- [ ] API keys stored in secrets manager (not code)
- [ ] Webhook endpoints validate Decklar signature
- [ ] TLS 1.3 minimum for all connections
- [ ] IP allowlisting if your network requires it

### Phase 3: Business Logic (Week 5-6)

**Deliverables:**
- [ ] Transform logic: Decklar events → ERP format
- [ ] Error handling: Retry logic, dead letter queues
- [ ] Validation: Data quality checks before ERP write
- [ ] Logging: Full audit trail for compliance

**Critical logic to implement:**

```python
# Pseudo-code for webhook handler
def handle_decklar_webhook(payload):
    # Validate webhook signature
    if not validate_signature(payload):
        return 401
    
    # Transform to ERP format
    erp_event = transform_to_erp_format(payload)
    
    # Validate business rules
    if not validate_business_rules(erp_event):
        log_error("Business rule validation failed", erp_event)
        return 400
    
    # Post to ERP with retry logic
    try:
        erp_response = post_to_erp(erp_event)
        log_success(payload['shipment_id'], erp_response)
        return 200
    except ERPError as e:
        queue_for_retry(payload)
        alert_integration_team(shipment_id, e)
        return 500
```

### Phase 4: Testing (Week 7-8)

**Test scenarios:**
1. **Happy path:** Shipment flows from origin to destination, all events post correctly
2. **Exception path:** Temperature excursion fires → alert posts → ERP workflow triggers
3. **Failure recovery:** ERP is down → events queue → processing resumes when ERP returns
4. **Data validation:** Malformed payload rejected gracefully
5. **Load test:** 1000 simultaneous shipments

### Phase 5: Production (Week 9-10)

**Go-live sequence:**
1. Deploy to production (monitoring-only mode)
2. Parallel run: Compare Decklar data to ERP data for 1 week
3. Enable write mode for single facility
4. Expand to all facilities
5. Cutover legacy integration (if any)

---

## Common Integration Patterns by Use Case

### Cold Chain: Temperature-Driven Workflows

**Integration flow:**
```
Decklar Temperature Alert → ERP → WMS → Action
         ↓                    ↓      ↓
    Excursion detected    Hold status   Quarantine
    at 2:15 PM           applied       location
```

**ERP automation:**
- Temperature excursion → Automatically hold inventory upon arrival
- Compliance log → Attach full sensor data to lot record
- Alert → Notify QA team via ERP workflow

### High-Value Cargo: Insurance & Claims

**Integration flow:**
```
Decklar Shock Alert → ERP → Insurance API → Claim initiated
         ↓               ↓         ↓
    5G impact at    Damage flag    Photo + location
    Memphis hub     on shipment    data attached
```

**ERP automation:**
- Shock event > threshold → Flag shipment for inspection
- Insurance notification → API call to carrier/cargo insurer
- Claims documentation → Auto-attach sensor data + photos

### Multi-Modal: Handoff Tracking

**Integration flow:**
```
Truck Geofence Exit → ERP → TMS → Next Leg
         ↓              ↓      ↓
    Status: Drayage   Ocean    Container
    complete          leg      assigned
```

**ERP automation:**
- Mode transition → Update shipment leg in TMS
- Customs checkpoint → Trigger clearance workflow
- Port departure → Invoice milestone reached

---

## Troubleshooting Guide

### Issue: Webhooks not reaching your endpoint

**Diagnostics:**
1. Check Decklar webhook logs (Delivery Status in portal)
2. Verify endpoint is publicly accessible (no firewall blocking)
3. Confirm SSL certificate is valid (not expired/self-signed)
4. Check if response time > 30s (Decklar times out)

**Fixes:**
- Whitelist Decklar IP ranges in firewall
- Use webhook.site for testing
- Implement async processing (return 202, process in background)

### Issue: ERP rejects data

**Diagnostics:**
1. Compare Decklar payload to ERP expected format
2. Check field lengths (ERP fields often have strict limits)
3. Verify lookup values (status codes, location IDs) exist in ERP
4. Review ERP error logs

**Fixes:**
- Implement field truncation with warning logs
- Create lookup mapping tables
- Add pre-validation before ERP write

### Issue: Duplicate records in ERP

**Root cause:** Webhook retry after timeout, but first request actually succeeded

**Fix:**
```python
# Idempotency check
def process_webhook(payload):
    webhook_id = payload['event_id']  # Unique per event
    
    if already_processed(webhook_id):
        return 200  # Already handled, acknowledge but skip
    
    process_event(payload)
    mark_processed(webhook_id)
    return 200
```

---

## Success Metrics

Track these KPIs to measure integration value:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Webhook delivery rate** | >99.5% | Decklar webhook logs |
| **ERP update latency** | <30 seconds | Timestamp: Decklar event → ERP write |
| **Data accuracy** | >99% | Sample shipments: compare Decklar to ERP |
| **Integration uptime** | >99.9% | Monitoring alerts |
| **Manual intervention rate** | <2% | Support tickets / total shipments |

---

## Next Steps

1. **Audit your current state:** Map which shipment events are manual today
2. **Identify quick wins:** Temperature alerts and delivery confirmations are highest value
3. **Plan your integration:** Choose pattern (webhooks vs. polling) based on your ERP
4. **Start small:** One use case, one facility, prove value then expand

---

## Additional Resources

- [Decklar API Documentation](https://docs.decklar.io/api)
- [Webhook Security Best Practices](/webhook-security-guide)
- [ERP Field Mapping Templates](/erp-mapping-templates)
- [Sample Integration Code (Python)](https://github.com/decklar/integration-examples)

---

*Need help with your ERP integration? Our solutions team has connected Decklar to SAP, Oracle, NetSuite, and dozens of custom systems. [Contact us](mailto:solutions@decklar.io) for implementation support.*
