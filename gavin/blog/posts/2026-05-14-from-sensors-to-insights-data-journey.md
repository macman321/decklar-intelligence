---
title: "From Sensors to Insights: How IoT Data Actually Flows Through Your Supply Chain"
date: 2026-05-14
layout: post.njk
description: "A behind-the-scenes look at the IoT data journey — from sensor readings to real-time dashboards. Understand how supply chain visibility data is collected, processed, and transformed into actionable intelligence."
layout: post.njk
---
---

# From Sensors to Insights: How IoT Data Actually Flows Through Your Supply Chain

Have you ever wondered what actually happens when you stick a Decklar Bee Label on a pallet? How does a tiny device on a box in a truck somewhere in Ohio become a temperature alert on your dashboard?

Customers often ask me about the "magic" behind supply chain visibility. It's not magic — it's a carefully orchestrated data pipeline. Today, I'm pulling back the curtain on exactly how IoT data flows from sensor to insight, and what happens at each step.

## The Journey: From Physical to Digital

Every piece of supply chain data follows a similar path:

**Sensor → Transmission → Processing → Storage → Analytics → Action**

Each handoff matters. A hiccup anywhere in the chain means delayed or inaccurate information. Here's how we do it at Decklar.

## Stage 1: Collection — What Sensors Actually Capture

### Bee Labels vs. Reusable Bees

**Bee Labels (disposable):**
- Temperature (±0.5°C accuracy)
- Location (GPS when in cellular range)
- Shock/vibration detection
- Light exposure (for seal integrity)
- Humidity (optional)

**Reusable Bees (higher fidelity):**
- Temperature (±0.2°C accuracy)
- Precise GPS location (every 2-5 minutes in motion)
- Accelerometer (shock, orientation, drops)
- Pressure (air cargo)
- Extended battery life for multi-modal journeys

**Sample rate:** Most sensors record data every 2-5 minutes during transit, and every 15-30 minutes when stationary. This balances insight with battery life.

### How Much Data Are We Talking?

A single sensor on a 3-day shipment generates roughly:
- 500-800 temperature readings
- 200-400 location pings
- 50-100 status events (door open, shock detected, etc.)

Multiply that by thousands of shipments... that's a lot of data.

## Stage 2: Transmission — Getting Data Off the Device

This is where the magic really happens. IoT sensors need to send their data somewhere without draining their battery or requiring WiFi setup.

### Cellular Transmission (Primary Method)

**Decklar sensors use:**
- Cat-M1 (LTE-M) — low power, wide coverage
- NB-IoT — for remote areas with weaker signals
- Automatic carrier switching (we partner with 500+ global carriers)

**When data transmits:**
- Every 15 minutes in normal conditions
- Immediately on threshold breach (temperature excursion, shock)
- When entering/exiting geofences
- On manual "ping now" requests

**Data format:** Compressed binary payload (typically 50-200 bytes per transmission) to minimize cellular costs and battery drain.

### Satellite Backup

For ocean containers or remote locations, sensors store data locally and transmit via satellite when cellular isn't available. Adds latency (hours, not minutes) but ensures coverage everywhere.

## Stage 3: Ingestion — The Cloud Data Pipeline

Once data hits our cloud infrastructure, it flows through several processing layers:

### Edge Processing (Milliseconds)

Before data even reaches our servers:
- **Validation:** Is this reading physically possible? (Temperature of 500°C → likely sensor error)
- **Deduplication:** Did we receive this reading twice?
- **Enrichment:** Tag with device ID, customer ID, shipment metadata

### Stream Processing (Seconds)

Data enters Apache Kafka streams for real-time handling:

```
Temperature Reading → Kafka Topic → Event Router → Alert Engine
                                       ↓
                                Time-Series Database
```

**Critical path:** Alert-worthy events (excursions, delays) get priority routing for sub-minute notification delivery.

### The Alert Engine — Where Decisions Happen

This is where your configured rules get applied:

| Rule Type | Example | Response Time |
|-----------|---------|---------------|
| Threshold | Temp > 5°C | < 30 seconds |
| Geofence | Departed origin | < 2 minutes |
| Predictive | ETA changed > 2 hours | < 5 minutes |
| Anomaly | Deviation from predicted temp | < 10 minutes |

**What happens when a rule triggers:**
1. Event logged (immutable audit trail)
2. Alert generated with context
3. Notification dispatched (email, SMS, webhook, API)
4. Dashboard updated in real-time
5. Downstream workflows triggered (if configured)

## Stage 4: Storage — Where Data Lives

We use a multi-tier storage strategy:

### Hot Storage (Last 30 Days)
- **Technology:** InfluxDB for time-series data
- **Purpose:** Real-time queries, dashboard rendering, alerting
- **Retention:** High-frequency data, sub-second query response
- **Size:** ~500GB per day across all customers

### Warm Storage (30-365 Days)
- **Technology:** PostgreSQL with partitioning
- **Purpose:** Historical queries, reports, trend analysis
- **Access:** Query in 1-3 seconds
- **Features:** Automatic aggregation (hourly, daily summaries)

### Cold Storage (1+ Years)
- **Technology:** S3 with Parquet format
- **Purpose:** Compliance archives, bulk exports, long-term analysis
- **Access:** Batch queries (minutes, not seconds)
- **Cost:** ~90% cheaper than hot storage

### Data Privacy & Security

- All data encrypted at rest (AES-256)
- Data encrypted in transit (TLS 1.3)
- Customer data logically isolated (no cross-contamination)
- GDPR/SOC 2 Type II compliant
- Audit logs of who accessed what data when

## Stage 5: Analytics — Turning Data Into Insights

Raw data is boring. Insights are valuable. Here's how we transform one into the other:

### Real-Time Dashboard Layer

**What you see:**
- Current location on map
- Live temperature readings
- Transit status and ETA
- Active alerts requiring attention

**Update frequency:** WebSocket connections refresh every 5-10 seconds for active shipments.

### Trend Analysis

**Aggregations we calculate:**
- Average temperature by lane, carrier, season
- Transit time distributions by origin-destination pair
- Alert frequency by product type, customer, time of day
- Carrier performance scorecards

**Calculated insights:**
- "Your Seattle → Phoenix lane runs 2°C warmer in July"
- "Carrier X averages 15% faster port clearance than Carrier Y"
- "Products with >2 shock events have 3x higher damage rates"

### Machine Learning Pipeline

Our ML models (trained on 100M+ shipments) identify:

| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| ETA Predictor | Current location, historical patterns, traffic/weather | Predicted delivery time | Customer communication, inventory planning |
| Anomaly Detection | Temperature patterns, location sequences | Unusual behavior flag | Early warning of issues |
| Risk Scorer | Product type, lane, carrier, weather | Damage/spoilage probability | Insurance pricing, packing decisions |
| Route Optimizer | Origin, destination, constraints | Recommended route/carrier | Cost and risk reduction |

**Model refresh:** Retrained weekly on new data; A/B tested before full deployment.

## Stage 6: Output — How You Consume Insights

Different users need data in different ways:

### Operations Teams
- **Real-time dashboard** (web + mobile)
- **Alert notifications** (email, SMS, Slack, Teams)
- **Shipment search** (by PO, container, tracking ID)

### Executives
- **Weekly/monthly reports** (PDF/email)
- **Executive dashboards** (KPI trends, cost savings)
- **Benchmark comparisons** (vs. industry peers)

### Systems & Integrations
- **REST API** (pull data on demand)
- **Webhooks** (push events to your systems)
- **Pre-built connectors** (SAP, Oracle, NetSuite, etc.)
- **Data exports** (CSV, JSON, Parquet)

### Data Teams
- **SQL access** (direct query to warm storage)
- **Data warehouse sync** (Snowflake, BigQuery, Redshift)
- **BI tool connectors** (Tableau, PowerBI, Looker)

## What Can Go Wrong? (And How We Handle It)

### Scenario 1: Sensor Stops Transmitting

**What happens:** Device battery dies, or it's in a cellular dead zone (like a shipping container hold).

**Our response:**
1. Mark shipment as "signal lost" after 60 minutes
2. Use last known location and predicted path
3. Queue data for backfill when connectivity returns
4. Alert operations team of potential blind spot

**Historical data:** Stored locally on device; uploaded in batch when connectivity returns. You don't lose data, just get it delayed.

### Scenario 2: Erroneous Reading

**What happens:** Sensor reports -50°C (impossible for refrigerated truck in summer).

**Our response:**
1. Flag reading as anomalous
2. Cross-reference with secondary sensors (if available)
3. Use interpolation from adjacent readings
4. Alert customer to potential sensor issue

**Result:** No false alerts; no missing data.

### Scenario 3: High-Volume Event Storm

**What happens:** 1000+ containers hit the same port at once; all transmit simultaneously.

**Our response:**
1. Auto-scale ingestion pipeline (AWS Lambda + Kinesis)
2. Priority queue for critical alerts
3. Graceful degradation for non-essential queries
4. Horizontal scaling of processing nodes

**Result:** No data loss; alerts still timely; dashboards may lag briefly.

## Data Retention & Compliance

| Data Type | Retention | Compliance |
|-----------|-----------|------------|
| Raw sensor readings | 2 years (then aggregated) | FDA 21 CFR Part 11 |
| Alert history | 7 years | SOC 2, customer contracts |
| Audit logs | 7 years | SOC 2, GDPR |
| Aggregated analytics | Unlimited | Internal use |
| Deleted customer data | 30 days post-deletion | GDPR Right to be Forgotten |

## The Bottom Line

Understanding how data flows helps you:

1. **Set realistic expectations** — Real-time usually means 1-5 minutes, not milliseconds
2. **Debug issues faster** — Know if it's a sensor, connectivity, or platform problem
3. **Design better integrations** — Work with the data pipeline, not against it
4. **Ask better questions** — "Why didn't I get that alert?" becomes answerable

The supply chain visibility "magic" is really just well-engineered data plumbing. But good plumbing makes all the difference between a system you trust and one you curse.

---

**Questions about your data flow?** Reply to this post or reach out — I'm happy to explain the technical details or help troubleshoot specific data issues.

**Next up:** Learn how to build your own analytics on Decklar data in "Building Custom Supply Chain Reports: A Data Team's Guide."
