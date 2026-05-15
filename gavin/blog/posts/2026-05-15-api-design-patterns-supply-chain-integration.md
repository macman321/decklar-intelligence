---
title: "API Design Patterns That Don't Break Your Supply Chain"
description: "Your ERP integration will fail. Here's how to build APIs that survive the chaos of real-world supply chain operations—and keep your integrations running when everything else breaks."
date: 2026-05-15
tags:
  - Integration
  - API Design
  - Technical
  - Featured
layout: post.njk
---

# API Design Patterns That Don't Break Your Supply Chain

*If your API can't handle a carrier's 3 AM maintenance window, a warehouse's spotty WiFi, or a customer's bespoke ERP from 2008, it's not ready for supply chain operations.*

---

## The Integration Reality Check

Every supply chain visibility project eventually hits the same wall: **integration with existing systems.**

Your shiny new IoT platform needs to talk to:
- An ERP that hasn't been updated since 2015
- A WMS running on-premises behind a firewall
- A TMS that only speaks SOAP
- A carrier API with 99.7% uptime (which means 26 hours of downtime per year)
- A customer EDI system that sends 847s at 2 AM in their local time

I've seen beautiful visibility platforms fail because their APIs were designed by developers who'd never operated at supply chain scale.

This post is the API design guide I wish I'd had before my first major integration.

---

## Pattern 1: Idempotency — The Safety Net

### The Problem

Networks fail. Timeouts happen. Your HTTP request might reach the server, process successfully, and the response gets lost. Your client retries. Now you have duplicate data.

In supply chain, duplicates aren't just annoying—they're dangerous:
- Duplicate shipment records
- Double-counted inventory
- Repeated customer notifications
- Phantom purchase orders

### The Solution

**Idempotent operations** produce the same result whether called once or ten times.

**Non-idempotent (dangerous):**
```
POST /shipments/create
{ "order_id": "12345", "items": [...] }
```

Call this twice? Get two shipments.

**Idempotent (safe):**
```
PUT /shipments/ORDER-12345
{ "items": [...], "status": "created" }
```

Call this ten times? Same shipment, updated to same state.

### Implementation Strategies

**1. Client-Generated IDs**

Let the client generate unique IDs, not the server:

```json
{
  "shipment_id": "uuid-generated-by-client",
  "order_id": "12345",
  "items": [...]
}
```

Server stores with client ID. Duplicate submissions with same ID? Return existing record.

**2. Idempotency Keys**

For POST operations that must create resources:

```
POST /shipments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000

{ "order_id": "12345", "items": [...] }
```

Server stores the key → response mapping for 24+ hours. Same key? Return cached response.

**3. Conditional Updates**

Prevent lost update problems:

```
PATCH /shipments/SHIP-12345
If-Match: "abc123-etag"

{ "status": "in_transit" }
```

If ETag changed since client read the data? 409 Conflict. Prevents overwriting changes made by other systems.

---

## Pattern 2: Event-Driven Architecture — Decoupling for Resilience

### The Problem

Synchronous API calls create tight coupling:
- Your ERP goes down → your visibility platform stops working
- A carrier API is slow → your entire workflow blocks
- Rate limits kick in → data stops flowing

In supply chain, downtime isn't an option. Shipments don't pause because your API timed out.

### The Solution

**Event-driven architecture** decouples systems through message queues.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Your IoT  │────▶│ Message Queue│◀────│  Consumer   │
│   Platform  │     │   (Kafka/    │     │   (ERP)     │
└─────────────┘     │  RabbitMQ)   │     └─────────────┘
                    └──────────────┘
                           │
                    ┌─────────────┐
                    │  Consumer   │
                    │ (Analytics) │
                    └─────────────┘
```

Events flow:
1. Shipment created
2. Location updated  
3. Temperature excursion detected
4. Delivery completed

Each consumer processes at its own pace. If ERP is down, events queue. When it comes back, processing resumes.

### Event Schema Design

Use CloudEvents or similar standard:

```json
{
  "specversion": "1.0",
  "type": "com.decklar.shipment.delivered",
  "source": "iot-platform/v2.1",
  "id": "a89b6f90-12d4-11ef-b864",
  "time": "2026-05-15T14:23:11Z",
  "data": {
    "shipment_id": "SHIP-88421",
    "delivery_time": "2026-05-15T14:22:45Z",
    "recipient": "ABC Distribution Center",
    "signature": "J. Smith"
  }
}
```

Key principles:
- **Immutable events:** Never change them. If you were wrong, emit a correction event.
- **Complete context:** Include enough data that consumers don't need to call back
- **Versioned types:** `shipment.delivered.v1` → `shipment.delivered.v2` for breaking changes

### When to Use Events vs Synchronous APIs

| Scenario | Pattern | Why |
|----------|---------|-----|
| Real-time status check | Synchronous API | User is waiting |
| Shipment milestone updates | Event-driven | Eventually consistent is fine |
| Critical safety alert | Both | Event for propagation + sync API for confirmation |
| Bulk data export | Event-driven | Async processing, notify when ready |
| Customer-facing delivery ETA | Synchronous API | Sub-second response required |

---

## Pattern 3: Circuit Breakers — Failing Gracefully

### The Problem

When an external API starts failing, your code retries. Harder. More frequently. Creating a retry storm that makes the problem worse.

I've seen a single slow carrier API bring down an entire visibility platform because every shipment update triggered retries, filling connection pools and exhausting threads.

### The Solution

**Circuit breaker pattern** stops the bleeding.

```
State: CLOSED (normal operation)
  ↓ Error threshold exceeded (e.g., 5 failures in 30 seconds)
State: OPEN (rejecting requests)
  ↓ Timeout expires (e.g., 60 seconds)
State: HALF-OPEN (testing with 1 request)
  ↓ Success
State: CLOSED (back to normal)
  ↓ Failure
State: OPEN (keep rejecting)
```

When a circuit is OPEN:
- Fail fast (don't wait for timeout)
- Return cached data or degraded response
- Queue for later retry (event-driven)
- Alert operations team

### Implementation Example

```javascript
// Pseudo-code
class CarrierCircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
  }

  async call(apiRequest) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new CircuitOpenError('Failing fast');
      }
    }

    try {
      const result = await apiRequest();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      alertOpsTeam('Carrier API circuit opened');
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
}
```

### Cascading Circuit Breakers

In supply chain, you call APIs that call other APIs. Circuit breakers should cascade:

```
Your Platform → Carrier API → TMS System
     ↓              ↓            ↓
  Circuit A      Circuit B    Circuit C

If Circuit C opens, Circuit B should probably open too.
```

---

## Pattern 4: Backpressure — Don't Drown Consumers

### The Problem

Your IoT platform generates 10,000 events per second during peak.
Your customer's ERP can process 100 events per second.

Without backpressure, you'll:
- Overwhelm their API
- Drop events
- Lose data
- Get angry phone calls

### The Solution

**Backpressure** signals upstream to slow down when downstream can't keep up.

**Strategies:**

**1. Rate Limiting (Preventative)**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1621094400
```

When limit exceeded: 429 Too Many Requests with Retry-After header.

**2. Flow Control (Reactive)**

Consumer tells producer its capacity:

```javascript
// Consumer acknowledges processed events
producer.acknowledge(processedEventIds);

// Producer pauses sending if unacknowledged > threshold
if (unacknowledgedCount > maxInFlight) {
  pauseSending();
}
```

**3. Queue-Based Buffering**

When downstream is slow, queue and process asynchronously:

```
Producer → [Queue] → Consumer
         (can grow) (processes at its pace)
```

Monitor queue depth. Alert when it grows too large.

### Graceful Degradation

When backpressure can't prevent overload:

**Sampling:** Process 1% of location updates instead of 100%
**Aggregation:** Send summaries instead of individual events
**Prioritization:** Process alerts immediately, defer routine updates

---

## Pattern 5: Versioning — Evolving Without Breaking

### The Problem

You want to add a new field. Change a response format. Deprecate an old endpoint.

Your customer's integration breaks. Their ERP hasn't been updated in 3 years. They have no budget for changes. They blame you.

### The Solution

**Explicit API versioning** from day one.

**URL Path (my preference):**
```
/api/v1/shipments
/api/v2/shipments
```

**Header-based (alternative):**
```
GET /api/shipments
Accept: application/vnd.decklar.v2+json
```

### Versioning Strategies

**1. URL Path Versioning**

Pros:
- Explicit in every request
- Easy to route in load balancers
- Self-documenting

Cons:
- Multiple URLs for same concept
- Cache fragmentation

**2. Header Versioning**

Pros:
- Clean URLs
- Single endpoint per resource

Cons:
- Hidden in headers (easier to miss)
- Harder to route

### Breaking Change Policy

**What constitutes breaking:**
- Removing fields
- Changing field types
- Changing enum values
- Altering error response formats
- Changing pagination behavior

**What doesn't:**
- Adding new fields (if clients ignore unknown fields)
- Adding new endpoints
- Adding new enum values

**Deprecation timeline I recommend:**
1. **Month 0:** New version launched, old version marked deprecated
2. **Month 3:** Email all API consumers about upcoming sunset
3. **Month 6:** Direct outreach to non-migrated integrations
4. **Month 9:** Final warnings
5. **Month 12:** Old version retired (return 410 Gone with migration docs)

**Never** break integrations without warning. Supply chain runs 24/7. Your customers will be awake at 3 AM getting paged because you pushed a breaking change.

---

## Pattern 6: Pagination — Handling Large Datasets

### The Problem

"GET all shipments" returns 10 million records. Your API times out. The database falls over. The client's JSON parser crashes.

### The Solution

**Cursor-based pagination** for supply chain data.

**Why not offset/limit?**
- `OFFSET 1000000` is slow in databases
- Data changes between pages (duplicates or skips)
- Doesn't scale

**Cursor-based:**
```
GET /shipments?limit=100

Response:
{
  "data": [...100 shipments...],
  "next_cursor": "eyJpZCI6NTAwMCwiZXBvY2giOjE2MjEwOTQ0MDB9",
  "has_more": true
}

GET /shipments?limit=100&cursor=eyJpZCI6NTAwMCwiZXBvY2giOjE2MjEwOTQ0MDB9
```

Cursor encodes last-seen ID and timestamp. Fast, consistent, scalable.

### Pagination Headers

```
Link: </api/v1/shipments?cursor=abc123>; rel="next",
      </api/v1/shipments?cursor=first>; rel="first",
      </api/v1/shipments?cursor=xyz789>; rel="prev"
```

---

## Pattern 7: Webhooks — Push Instead of Poll

### The Problem

Your customer polls your API every 5 minutes for 10,000 shipments. That's:
- 2,880,000 requests/day
- 86,400,000 requests/month
- Pointless waste of everyone's resources

### The Solution

**Webhooks** — you push data when events happen.

**Subscription:**
```
POST /webhooks/subscriptions
{
  "url": "https://customer.com/webhook",
  "events": ["shipment.delivered", "shipment.exception"],
  "secret": "whsec_customer_secret"
}
```

**Delivery:**
```
POST https://customer.com/webhook
X-Webhook-Signature: sha256=abc123...
Content-Type: application/json

{ event payload }
```

### Webhook Reliability

**Retries with exponential backoff:**
- Try 1: Immediate
- Try 2: 1 second
- Try 3: 2 seconds
- Try 4: 4 seconds
- Try 5: 8 seconds
- Max retries: 10-20 over 24 hours

**Dead letter queue:** After max retries, store for manual investigation.

**Idempotency:** Same event delivered twice? Customer should handle gracefully.

---

## API Design Checklist

Before shipping your supply chain API:

- [ ] **Idempotency:** All mutating operations are idempotent
- [ ] **Circuit breakers:** Failures don't cascade
- [ ] **Backpressure:** Consumers can signal capacity limits  
- [ ] **Versioning:** Breaking changes require new version
- [ ] **Pagination:** Large datasets are paginated with cursors
- [ ] **Webhooks:** Push notifications for real-time updates
- [ ] **Event-driven:** Async patterns for eventual consistency
- [ ] **Observability:** Request tracing, metrics, alerting
- [ ] **Rate limiting:** Documented and enforced
- [ ] **Error responses:** Consistent format with actionable messages

---

## Real-World War Stories

**War Story #1: The Holiday Meltdown**

A retail customer launched Black Friday promotions. Our API received 50x normal traffic. No rate limiting. Their ERP couldn't keep up. Both systems crashed. The lesson: Always implement backpressure and rate limits.

**War Story #2: The Duplicate Shipment Disaster**

A carrier integration wasn't idempotent. Network blip caused retries. Result: 400 duplicate shipments created in one hour. Customer had to manually cancel hundreds of orders. The lesson: Idempotency isn't optional.

**War Story #3: The 3 AM Page**

Pushed a "minor" API change Friday afternoon. Didn't bump version. Changed error message format. Customer's integration broke at 3 AM Saturday when their system tried to parse errors. The lesson: Any visible change needs a new version.

---

## The Bottom Line

Supply chain APIs aren't like consumer APIs. Your customers can't "just upgrade." Their integrations touch mission-critical systems with years of technical debt.

Design for failure. Plan for scale. Version everything. And never, ever break a customer's integration without months of warning.

The APIs that win in supply chain?

They're boring. Predictable. Reliable. They work at 3 AM on a holiday weekend when the network is flaky and everyone else is asleep.

That's the bar.

---

## Related Reading

- [ERP Integration Playbook: Connecting IoT Data to Enterprise Systems](/posts/erp-integration-playbook/)
- [Event-Driven Supply Chain: Architecture for Real-Time Operations](/posts/event-driven-supply-chain/)
- [Multi-Agent Orchestration: How AI Systems Manage Complex Supply Chain Operations](/posts/multi-agent-orchestration-supply-chain-ai/)

---

*API design is half technical, half operational. I've made (and fixed) enough mistakes to know what lasts. Happy to review your API design if you're building for supply chain.*

— Gavin
