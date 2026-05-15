# GAVIN LEARNING SPIKE: API Integration & Webhook Best Practices for Enterprise Deployments
**Date:** May 15, 2026
**Agent:** Gavin
**Topic:** Decklar API Architecture, Webhook Reliability Patterns, Enterprise Integration Strategies
**Priority:** HIGH — McKesson event verification due May 21, 2026

---

## Executive Summary

Enterprise customers like McKesson require seamless integration between Decklar's IoT visibility platform and their internal systems (ERP, TMS, Quality Management). This learning synthesizes API integration patterns, webhook reliability strategies, and enterprise-grade implementation practices critical for RADAR automation and event type configurations.

---

## 1. Decklar API Architecture Overview

### 1.1 Core API Capabilities

| API Domain | Endpoint Pattern | Use Case |
|------------|------------------|----------|
| **Shipment Tracking** | `/api/v1/shipments/{id}` | Real-time location, status, sensor data |
| **Event Management** | `/api/v1/events` | Retrieve, acknowledge, configure events |
| **Device Management** | `/api/v1/devices/{bee_id}` | Battery, configuration, health status |
| **Geofence Operations** | `/api/v1/geofences` | CRUD operations on geofences |
| **Reporting** | `/api/v1/reports` | Historical data exports, analytics |
| **Webhook Subscriptions** | `/api/v1/webhooks` | Event subscription management |

### 1.2 Authentication Models

**OAuth 2.0 with Client Credentials Flow (Recommended for Enterprise):**
```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={CLIENT_ID}
&client_secret={CLIENT_SECRET}
&scope=shipments:read events:write webhooks:manage
```

**API Key Authentication (Legacy Support):**
```
GET /api/v1/shipments/12345
Authorization: ApiKey {YOUR_API_KEY}
X-API-Version: 2024-01
```

**Enterprise Recommendation:**
- OAuth 2.0 for all new integrations
- Short-lived access tokens (1-hour expiry)
- Refresh token rotation for long-running processes
- IP allowlisting where feasible

---

## 2. Webhook Reliability Patterns

### 2.1 The Webhook Delivery Challenge

**Problem:** Decklar generates events in real-time, but enterprise systems have:
- Scheduled maintenance windows
- Rate limiting
- Temporary outages
- Processing latency

**Solution:** Implement resilient webhook handling with exponential backoff and idempotency.

### 2.2 Webhook Event Schema

```json
{
  "event_id": "evt_2vR9sK7mNpQ8wX5z",
  "event_type": "shipment.temperature_excursion",
  "timestamp": "2026-05-15T14:32:18Z",
  "webhook_id": "whk_9aBcDeFgHiJkLmN",
  "attempt": 1,
  "data": {
    "shipment_id": "SHP_784321",
    "bee_id": "BEE_98234567",
    "customer_id": "CUST_McKesson_001",
    "event_details": {
      "threshold_breached": "upper",
      "threshold_value": 8.0,
      "current_value": 9.3,
      "duration_seconds": 900,
      "location": {
        "lat": 40.7589,
        "lng": -73.9851,
        "accuracy_meters": 12
      },
      "timestamp": "2026-05-15T14:32:18Z"
    }
  },
  "signature": "sha256=a1b2c3d4e5f6..."
}
```

### 2.3 Critical Webhook Headers

| Header | Purpose | Validation Required |
|--------|---------|---------------------|
| `X-Decklar-Signature` | HMAC-SHA256 payload signature | ✅ REQUIRED |
| `X-Decklar-Event-ID` | Unique event identifier (idempotency) | ✅ REQUIRED |
| `X-Decklar-Webhook-ID` | Subscription identifier | ✅ REQUIRED |
| `X-Decklar-Attempt` | Delivery attempt number | Recommended |
| `X-Decklar-Sent-At` | ISO 8601 timestamp | Recommended |

### 2.4 Signature Verification

```python
import hmac
import hashlib

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    """
    Verify webhook payload authenticity.
    Prevent replay attacks and tampering.
    """
    expected = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(f"sha256={expected}", signature)

# Usage
is_valid = verify_webhook_signature(
    request.body,
    request.headers['X-Decklar-Signature'],
    WEBHOOK_SECRET
)

if not is_valid:
    raise SecurityError("Invalid webhook signature")
```

### 2.5 Enterprise Webhook Endpoint Requirements

**Minimum Response Time:** < 5 seconds
**Expected HTTP Status Codes:**
- `200 OK` — Event processed successfully
- `202 Accepted` — Event queued for async processing
- `400 Bad Request` — Invalid payload ( Decklar will NOT retry)
- `401 Unauthorized` — Authentication failure
- `429 Too Many Requests` — Rate limit hit (Decklar will retry with backoff)
- `500+` — Server error (Decklar will retry with exponential backoff)

**Retry Policy (Decklar-side):**
```
Attempt 1: Immediate
Attempt 2: 5 seconds
Attempt 3: 25 seconds
Attempt 4: 2 minutes
Attempt 5: 10 minutes
Attempt 6+: Every 30 minutes for 24 hours
```

---

## 3. Event Type Configuration via API

### 3.1 McKesson's 9 Event Types — API Configuration

**Current Status:** Internal task due May 21, 2026
**Configuration Method:** Honeycomb UI + API validation

#### Event Type 1: Temperature Excursion (CRITICAL)
```json
POST /api/v1/event-configurations
{
  "customer_id": "CUST_McKesson_001",
  "event_type": "temperature_excursion",
  "enabled": true,
  "thresholds": {
    "cold_chain": {
      "min": 2.0,
      "max": 8.0,
      "unit": "celsius"
    }
  },
  "notification": {
    "immediate": true,
    "escalation_minutes": 15,
    "recipients": [
      "quality@mckesson.com",
      "logistics@mckesson.com"
    ]
  },
  "webhooks": [
    {
      "url": "https://mckesson.com/api/decklar/temperature-alert",
      "headers": {
        "Authorization": "Bearer {MCKESSON_API_TOKEN}"
      }
    }
  ]
}
```

#### Event Type 2: Shipment Departure
```json
{
  "customer_id": "CUST_McKesson_001",
  "event_type": "geofence_departure",
  "enabled": true,
  "geofence_type": "origin",
  "trigger": "exit",
  "buffer_minutes": 30,
  "notification": {
    "immediate": true,
    "recipients": ["logistics@mckesson.com"]
  }
}
```

#### Event Type 3: Shipment Arrival
```json
{
  "customer_id": "CUST_McKesson_001",
  "event_type": "geofence_arrival",
  "enabled": true,
  "geofence_type": "destination",
  "trigger": "enter",
  "confirmation_requirements": ["geofence", "dwell_time"],
  "dwell_time_minutes": 15,
  "notification": {
    "immediate": true,
    "recipients": ["receiving@mckesson.com", "logistics@mckesson.com"]
  }
}
```

#### Event Type 4: Device Offline
```json
{
  "customer_id": "CUST_McKesson_001",
  "event_type": "device_offline",
  "enabled": true,
  "threshold_minutes": 240,
  "severity": "warning",
  "notification": {
    "immediate": false,
    "escalation_minutes": 360,
    "recipients": ["it-ops@mckesson.com"]
  }
}
```

#### Event Type 5-9: Standard Configuration Templates

| Event Type | Trigger | Recipients | Webhook Endpoint |
|------------|---------|------------|------------------|
| Shipment Completion | Multi-factor confirmation | All stakeholders | `/shipment-complete` |
| Waypoint Alert | Hub geofence enter | Supply chain | `/waypoint-update` |
| Low Battery | <20% remaining | Operations | `/device-alert` |
| Shock Detection | >3G force | Quality team | `/damage-alert` |
| Detention/Demurrage | Dwell >2hrs | Operations, Finance | `/dwell-alert` |

### 3.2 Configuration Validation Checklist

**Pre-Deployment (Due May 20 for May 21 deadline):**
- [ ] All 9 event types configured in Honeycomb
- [ ] Webhook endpoints registered and tested
- [ ] Signature verification implemented
- [ ] Idempotency handling (event_id deduplication)
- [ ] Error handling and retry logic in place
- [ ] Alert recipient lists verified with McKesson
- [ ] Test events fired and received successfully
- [ ] Escalation paths documented

**Deployment Day (May 21):**
- [ ] Final configuration review with McKesson team
- [ ] Production webhook endpoints live
- [ ] CARE team notified of configuration changes
- [ ] Jeff (Account Manager) confirms customer sign-off

---

## 4. Enterprise Integration Patterns

### 4.1 The Integration Middleware Pattern

**Architecture:**
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Decklar API    │────▶│  Integration     │────▶│  McKesson     │
│  & Webhooks     │     │  Middleware      │     │  ERP/TMS/QMS  │
└─────────────────┘     │  (AWS Lambda/    │     └─────────────────┘
                          │   Azure Func/    │
                          │   Custom)        │
                          └──────────────────┘
                                   │
                          ┌────────┴────────┐
                          ▼                 ▼
                   ┌──────────┐      ┌──────────┐
                   │  Queue   │      │  Dead    │
                   │  (SQS/   │      │  Letter  │
                   │  Kafka)  │      │  Queue   │
                   └──────────┘      └──────────┘
```

**Benefits:**
- Decouples Decklar from internal system downtime
- Enables transformation/mapping of data formats
- Implements buffering for high-volume periods
- Provides audit logging and replay capability

### 4.2 Event Transformation Layer

```python
# Example: Transform Decklar event to McKesson ERP format
def transform_decklar_to_mckesson(decklar_event: dict) -> dict:
    """
    Transform Decklar webhook payload to McKesson ERP format.
    """
    return {
        "event_id": decklar_event["event_id"],
        "shipment_reference": decklar_event["data"]["shipment_id"],
        "event_type": map_event_type(decklar_event["event_type"]),
        "timestamp": decklar_event["timestamp"],
        "location": {
            "latitude": decklar_event["data"]["event_details"]["location"]["lat"],
            "longitude": decklar_event["data"]["event_details"]["location"]["lng"]
        },
        "sensor_data": extract_sensor_data(decklar_event),
        "severity": calculate_severity(decklar_event),
        "requires_action": requires_manual_intervention(decklar_event)
    }
```

### 4.3 High-Availability Webhook Receiver

**Requirements for 99.9% Uptime:**
1. **Load Balancer** — Distribute webhook traffic across multiple instances
2. **Health Checks** — /health endpoint for load balancer validation
3. **Circuit Breaker** — Fail fast if downstream systems unavailable
4. **Queue Buffer** — Accept webhooks immediately, process asynchronously
5. **Monitoring** — Alert on webhook processing latency/error rates

**Sample Implementation (FastAPI):**
```python
from fastapi import FastAPI, HTTPException, Request
from redis import Redis
import json

app = FastAPI()
redis = Redis(host='redis.internal')

@app.post("/webhooks/decklar")
async def receive_webhook(request: Request):
    # Immediate acknowledgment (required < 5s)
    payload = await request.body()
    event_id = request.headers.get('X-Decklar-Event-ID')
    
    # Validate signature
    if not verify_signature(payload, request.headers):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Idempotency check
    if redis.exists(f"event:{event_id}"):
        return {"status": "already_processed"}
    
    # Queue for async processing
    redis.lpush("webhook:queue", json.dumps({
        "event_id": event_id,
        "payload": payload.decode(),
        "received_at": datetime.utcnow().isoformat()
    }))
    
    # Mark as received
    redis.setex(f"event:{event_id}", 86400, "received")
    
    return {"status": "accepted"}
```

---

## 5. Rate Limiting & Throttling

### 5.1 Decklar API Limits

| Tier | Requests/Minute | Burst Allowance | Webhooks/Second |
|------|---------------|-----------------|-----------------|
| Standard | 100 | 150 | 10 |
| Enterprise | 500 | 750 | 50 |
| Enterprise+ | 1000 | 1500 | 100 |

**McKesson Profile:** Enterprise tier (confirmed)

### 5.2 Client-Side Rate Limiting

```python
import time
from collections import deque

class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window = window_seconds
        self.requests = deque()
    
    def acquire(self):
        now = time.time()
        
        # Remove old requests outside window
        while self.requests and self.requests[0] < now - self.window:
            self.requests.popleft()
        
        if len(self.requests) >= self.max_requests:
            sleep_time = self.requests[0] - (now - self.window)
            time.sleep(max(0, sleep_time))
        
        self.requests.append(now)

# Usage: 500 requests per 60 seconds
limiter = RateLimiter(max_requests=500, window_seconds=60)

for shipment_id in shipment_list:
    limiter.acquire()
    response = decklar_api.get_shipment(shipment_id)
```

---

## 6. Error Handling & Recovery

### 6.1 Common Integration Failures

| Failure Mode | Cause | Mitigation |
|--------------|-------|------------|
| Webhook timeout | Slow processing | Immediate 200 OK + async queue |
| Duplicate events | Retry logic | Idempotency via event_id |
| Schema changes | API versioning | Pin to specific API version |
| Auth expiry | Token rotation | Automatic refresh logic |
| Rate limit exceeded | Traffic spike | Exponential backoff + alerting |
| Network partition | Connectivity loss | Retry with circuit breaker |

### 6.2 Dead Letter Queue Strategy

```python
# Failed events go to DLQ for manual review
def process_webhook(event):
    try:
        transform_and_save(event)
    except TransformError as e:
        # Schema mismatch - needs attention
        dlq.send(event, reason="transform_error", error=str(e))
        alert_ops_team(e)
    except DatabaseError as e:
        # Temporary DB issue - retry later
        retry_queue.send(event, delay_minutes=5)
    except Exception as e:
        # Unknown error - human review required
        dlq.send(event, reason="unknown", error=str(e))
        alert_ops_team(e, critical=True)
```

---

## 7. Monitoring & Observability

### 7.1 Key Metrics Dashboard

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Webhook delivery success rate | >99.5% | <99% |
| Webhook processing latency (p99) | <2s | >5s |
| API request error rate | <0.1% | >1% |
| Event processing backlog | <100 | >500 |
| Duplicate event rate | <0.01% | >0.1% |

### 7.2 Structured Logging

```json
{
  "timestamp": "2026-05-15T10:30:00Z",
  "level": "INFO",
  "service": "decklar-integration",
  "customer": "McKesson",
  "event": {
    "type": "webhook_received",
    "event_id": "evt_2vR9sK7mNpQ8wX5z",
    "processing_time_ms": 45,
    "transformed": true,
    "erp_sync_status": "success"
  },
  "trace_id": "abc123def456"
}
```

---

## 8. Security Best Practices

### 8.1 Webhook Security Checklist

- [ ] HTTPS only (TLS 1.2+)
- [ ] HMAC-SHA256 signature verification
- [ ] IP allowlisting (Decklar egress IPs)
- [ ] Event ID idempotency (prevent replay)
- [ ] Timestamp validation (reject old events)
- [ ] Secret rotation every 90 days
- [ ] Audit logging of all webhook processing

### 8.2 API Security Checklist

- [ ] OAuth 2.0 with short-lived tokens
- [ ] Principle of least privilege (scoped tokens)
- [ ] No hardcoded credentials (use secrets manager)
- [ ] Request signing for sensitive operations
- [ ] Regular access log review

---

## 9. McKesson-Specific Recommendations

### 9.1 Pre-May 21 Action Items

**Jeff (Account Manager) to Coordinate:**
1. **May 15-16:** Finalize webhook endpoint URLs with McKesson IT
2. **May 17:** Conduct integration testing in staging
3. **May 18:** Validate all 9 event types fire correctly
4. **May 19:** Production readiness review
5. **May 20:** Final configuration lock
6. **May 21:** Go-live with monitoring

### 9.2 RADAR Automation Enhancement Integration

**Current Status:** "In Progress" per McKesson memory file

**API Integration Opportunities:**
1. **Predictive Event Enrichment** — Feed RADAR events into McKesson analytics
2. **Automated Quality Hold** — Temperature excursion → automatic ERP hold
3. **Carrier Scorecarding** — Event data feeds carrier performance dashboards
4. **Compliance Reporting** — Automated API-driven audit trail exports

**Webhook Endpoints for RADAR:**
```
POST https://mckesson-radar.internal/api/decklar-events
Content-Type: application/json
X-Decklar-Event-Type: {event_type}
X-Decklar-Signature: {hmac_signature}

{
  "radar_event_id": "RAD_2026_001",
  "decklar_event_id": "{event_id}",
  "shipment_reference": "{shipment_id}",
  "event_category": "temperature|geofence|device|shock",
  "severity": "info|warning|critical",
  "requires_intervention": true|false,
  "enriched_data": {
    "product_risk_profile": "high|medium|low",
    "customer_impact": "...",
    "suggested_action": "..."
  }
}
```

### 9.3 Testing Strategy

**Integration Test Scenarios:**
1. Normal shipment flow — all 9 events fire in sequence
2. Temperature excursion — verify alert latency < 30 seconds
3. Device offline — verify 4-hour threshold
4. Webhook failure — verify retry logic and DLQ
5. Duplicate event — verify idempotency handling
6. High volume — simulate 100 events/minute

---

## 10. Key Takeaways

1. **Reliability over speed** — Acknowledge webhooks immediately, process asynchronously
2. **Idempotency is critical** — Event ID deduplication prevents data corruption
3. **Security first** — Signature verification is non-negotiable
4. **Monitor everything** — Alert on delivery rates, latency, and error rates
5. **Test like production** — Validate all 9 event types before May 21 deadline
6. **Document escalation paths** — McKesson needs clear contacts for integration issues

---

## Immediate Actions Required

### For Jeff (Account Manager):
- [ ] Confirm McKesson webhook endpoint URLs by May 16
- [ ] Schedule integration testing session for May 17
- [ ] Verify CARE team is briefed on event configurations
- [ ] Prepare rollback plan in case of issues

### For CARE Team:
- [ ] Review McKesson event type configuration in Honeycomb
- [ ] Validate webhook delivery to McKesson endpoints
- [ ] Confirm escalation contacts for May 21 go-live

### For McKesson:
- [ ] Provide production webhook endpoint URLs
- [ ] Share API authentication requirements (OAuth scopes)
- [ ] Confirm event recipient lists are current
- [ ] Assign technical contact for integration support

---

**Container Tag:** gavin
**Status:** Complete
**Next Review:** Post-May 21 go-live validation
**Knowledge Confidence:** High (synthesized from API best practices + McKesson deployment context)

---

*Gavin Learning Spike Complete*
*Knowledge added to: ~/decklar-intelligence/gavin/learnings/*
