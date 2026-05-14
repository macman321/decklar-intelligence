# GAVIN LEARNING SPIKE: Decklar Supply Chain Use Case Analysis
**Date:** May 14, 2026
**Topic:** Decklar IoT Visibility Platform — Supply Chain Use Cases, Customer Profiles & Value Propositions
**Source:** Synthesis from Decklar Core Documentation (SOP, Troubleshooting, Best Practices, FAQ)

---

## Executive Summary

Decklar (formerly Roambee) provides IoT-powered supply chain visibility through **Bee Labels** (disposable trackers) and **reusable Bees**. The platform serves customers managing high-value, high-risk shipments across multiple transportation modes. This learning document maps the supply chain use cases, customer profiles, deployment patterns, and value propositions critical for Customer Success.

---

## 1. The Core Supply Chain Problem Decklar Solves

### The Visibility Gap
Traditional supply chain tracking relies on:
- **Carrier scans** — Infrequent, at major hubs only
- **EDI/API data** — Limited to carrier systems, not product-level
- **Manual check calls** — Reactive, not real-time

**The Result:** "Blind spots" between origin and destination where:
- Temperature excursions go undetected until delivery
- Damage occurs with no documentation of when/where
- Delays are discovered after the fact
- Claims have no supporting data

### Decklar's Solution
- **Product-level tracking** — One Bee per shipment/container
- **Real-time sensor data** — GPS, temperature, humidity, light, shock
- **Automated alerts** — Immediate notification on threshold breach
- **Historical data** — Complete shipment history for analysis and claims

---

## 2. Primary Use Cases by Industry

### Use Case A: Pharmaceutical / Cold Chain (Highest Priority)

**Customer Profile:**
- Ship temperature-sensitive pharmaceuticals (vaccines, biologics, insulin)
- Regulatory compliance requirements (GDP, FDA)
- High claim values ($10K-$500K+ per shipment)
- Zero tolerance for temperature excursions

**Decklar Value Proposition:**
- Continuous temperature monitoring with alerts
- Compliance documentation for regulatory audits
- Proof of custody throughout the supply chain
- Data-driven claims support

**Typical Deployment:**
- **Mode:** Truck → Air → Truck (multi-modal)
- **Sensors:** Temperature (critical), humidity, shock, light
- **Ping frequency:** 15-30 minutes (standard), 5 minutes during flight
- **Geofences:** Origin/destination facilities, airports, customs hubs
- **Alerts:** Temperature threshold breach, delayed arrival

**Success Metrics:**
- % of shipments within temperature spec
- Time to detect excursion (should be <15 minutes)
- Claim reduction vs. previous year

---

### Use Case B: Electronics / High-Value Manufacturing

**Customer Profile:**
- Ship sensitive electronics (semiconductors, servers, components)
- Moisture and shock sensitivity
- Just-in-time manufacturing schedules
- International shipping (Asia ↔ US/Europe)

**Decklar Value Proposition:**
- Shock detection during handling
- Humidity monitoring for corrosion prevention
- Real-time ETA updates for production planning
- Multi-party visibility (manufacturer, freight forwarder, consignee)

**Typical Deployment:**
- **Mode:** Truck → Ocean → Truck or Truck → Air → Truck
- **Sensors:** Shock (critical), humidity, temperature
- **Ping frequency:** 30-60 minutes (battery conservation for long lanes)
- **Geofences:** Manufacturing facilities, ports, airports
- **Alerts:** Shock events >5G, humidity spikes, arrival/departure

**Success Metrics:**
- Damage rate reduction
- OTIF (On-Time In-Full) improvement
- Supply chain planning accuracy

---

### Use Case C: Food & Beverage / Perishables

**Customer Profile:**
- Ship perishable foods requiring cold chain
- Seasonal volume spikes
- Multi-stop distribution
- Retail compliance requirements

**Decklar Value Proposition:**
- Cold chain integrity verification
- Dwell time monitoring at distribution centers
- Freshness/quality assurance documentation
- Rapid response to excursions (reroute, reject)

**Typical Deployment:**
- **Mode:** Truck (regional), sometimes with rail
- **Sensors:** Temperature, humidity
- **Ping frequency:** 15-30 minutes
- **Geofences:** Farms/processors, distribution centers, retail locations
- **Alerts:** Temperature breach, extended dwell time

**Success Metrics:**
- Spoilage reduction
- Retail compliance scores
- Customer satisfaction (retailer)

---

### Use Case D: Reverse Logistics / Reusable Bee Model

**Customer Profile:**
- High shipment volume (100+ per month)
- Closed-loop supply chains (recall, repair, returns)
- Asset tracking needs (pallets, containers, totes)

**Decklar Value Proposition:**
- Reusable Bees for cost efficiency
- Asset tracking throughout reverse journey
- Automated return confirmation
- Bee return logistics management

**Typical Deployment:**
- **Mode:** Truck (round-trip)
- **Sensors:** GPS, temperature (if applicable)
- **Ping frequency:** 60 minutes (battery conservation)
- **Geofences:** Customer DCs, repair centers
- **Alerts:** Arrival/departure, delayed return

**Success Metrics:**
- Bee recovery rate (target: >95%)
- Cost per shipment (vs. disposable)
- Asset utilization improvement

---

## 3. Multi-Modal Shipping Patterns

### Pattern 1: Truck Only (Domestic/Regional)
**Typical Duration:** 1-5 days
**Configuration:**
- Standard ping frequency (15-30 min)
- Full sensor suite enabled
- Facility geofences at origin/destination
- Low battery risk

**Best For:** Regional distribution, last-mile, short cold chain

---

### Pattern 2: Truck → Air → Truck (International Express)
**Typical Duration:** 3-7 days
**Configuration:**
- Dynamic ping rate: Accelerate during flight (5 min), standard on ground
- Airline-specific tracking (flight numbers, AWB integration)
- Airport geofences (origin, hub, destination)
- Customs hold monitoring

**Best For:** High-value international shipments, pharma, urgent deliveries

**Critical Considerations:**
- Verify airline approval for tracking devices
- Configure for x-ray/security screening events
- Account for time zone changes in alerts

---

### Pattern 3: Truck → Ocean → Truck (International Standard)
**Typical Duration:** 20-60 days
**Configuration:**
- Extended ping frequency (60 min) for battery conservation
- Container tracking integration
- Port geofences (origin, transshipment, destination)
- DISABLE sensor interrupts (critical for battery life)

**Best For:** High-volume international freight, cost-sensitive shipments

**Critical Considerations:**
- Battery life is the #1 risk — disable all unnecessary sensors
- Customs delays can extend dwell time unexpectedly
- Container seals and tamper detection

---

### Pattern 4: Rail (Domestic Bulk)
**Typical Duration:** 5-14 days
**Configuration:**
- Medium ping frequency (30-60 min)
- Dwell time tracking at rail yards
- Signal gap management (rural coverage)

**Best For:** Bulk commodities, non-urgent freight

**Critical Considerations:**
- Rail yards often have poor cellular coverage
- Longer signal gaps expected — set customer expectations
- Dwell time can be excessive — track and alert

---

## 4. Customer Deployment Lifecycle

### Phase 1: Onboarding (Week 1-2)
**Activities:**
- Portal Q&A session (28 questions)
- Device configuration definition
- User account setup
- Training on activation process

**Key Decisions:**
- Shipment modes and lanes
- Sensor requirements
- Alert thresholds
- Integration needs (API, webhook, iShip app)

**Deliverable:** Deployment Plan document

---

### Phase 2: Pipe-Clean (Week 3-6)
**Activities:**
- First 3-5 shipments tracked
- Configuration tuning based on real data
- Geofence optimization
- Alert validation
- User feedback incorporation

**Key Metrics:**
- Data completeness (% of expected pings received)
- Alert accuracy (false positive rate)
- Battery consumption vs. projection
- User adoption (login frequency, app usage)

---

### Phase 3: Go-Live (Week 6-8)
**Activities:**
- Full production deployment
- 24/7 monitoring active
- Issue escalation process operational
- Weekly check-ins with customer

**Success Criteria:**
- 3 consecutive successful shipments
- Alert delivery confirmed
- Customer confidence established
- No critical open items

---

### Phase 4: Optimization (Month 3+)
**Activities:**
- Lane performance analysis
- Battery life optimization
- Expansion opportunity identification
- QBR preparation

**Key Metrics:**
- Exception rate trending down
- Customer satisfaction scores
- Expansion metrics (new lanes, new use cases)

---

## 5. Value Proposition Framework

### Quantifiable Value

| Metric | How Decklar Delivers |
|--------|---------------------|
| **Claim Reduction** | Data-driven evidence of custody and conditions |
| **Insurance Savings** | Proactive risk management, lower premiums |
| **Spoilage Reduction** | Early warning on temperature excursions |
| **OTIF Improvement** | Real-time visibility enables intervention |
| **Labor Efficiency** | Automated tracking reduces check calls |

### Qualitative Value

| Benefit | Customer Impact |
|---------|-----------------|
| **Compliance** | Audit-ready documentation |
| **Customer Confidence** | Proactive communication on shipment status |
| **Supply Chain Intelligence** | Historical data for optimization |
| **Competitive Advantage** | Differentiated service offering |

---

## 6. Common Deployment Risks & Mitigations

### Risk 1: Battery Depletion (Ocean Shipments)
**Root Cause:** Sensor interrupts drain battery on long lanes
**Mitigation:** Disable all interrupts for >30 day shipments
**Monitoring:** Battery level dashboard, proactive replacement alerts

---

### Risk 2: Activation Failures
**Root Cause:** Insufficient light at activation point
**Mitigation:** Require light source (lamp), 10+ second exposure
**Prevention:** On-site activation testing before go-live

---

### Risk 3: Geofence Misses
**Root Cause:** GPS accuracy issues, small geofence radius
**Mitigation:** Start with 500m radius, optimize after data collection
**Monitoring:** Shipment completion confirmation, manual backup procedures

---

### Risk 4: Connectivity Gaps
**Root Cause:** Cellular dead zones (tunnels, rural, international roaming)
**Mitigation:** Configure batch mode, set customer expectations
**Monitoring:** Gap detection alerts, data backfill confirmation

---

### Risk 5: User Adoption Issues
**Root Cause:** Poor training, app access issues, unclear SOPs
**Mitigation:** Comprehensive training, user request SOP, support access
**Monitoring:** Login frequency, app usage metrics

---

## 7. Competitive Positioning

### Decklar Differentiators

| Feature | Decklar | Traditional Tracking |
|---------|---------|---------------------|
| **Sensor Coverage** | Product-level (Bee attached to shipment) | Pallet/container-level only |
| **Real-Time** | 15-60 min pings, immediate alerts | Scan-based (hours/days delay) |
| **Environmental Data** | Temperature, humidity, shock, light | None |
| **Ease of Deployment** | Peel-and-stick activation | Complex installation |
| **Cost Model** | Per-shipment (disposable) or subscription (reusable) | Hardware purchase + integration |

### When Decklar Wins
- High-value shipments requiring environmental monitoring
- Multi-modal international shipments
- Customers needing product-level visibility
- Rapid deployment requirements
- Compliance documentation needs

### When to Consider Alternatives
- Low-value commodity shipments
- Simple point-to-point domestic trucking
- Customers with existing IoT infrastructure
- Extreme budget constraints

---

## 8. Action Items for Customer Success

### Immediate Actions
- [ ] Review existing customer deployments against these use case patterns
- [ ] Identify which customers fit each profile (pharma, electronics, food, reverse logistics)
- [ ] Audit long-lane configurations for battery optimization
- [ ] Verify activation lighting at customer facilities

### QBR Preparation
- [ ] Map customer success metrics to the quantifiable value framework
- [ ] Prepare industry-specific benchmarking data
- [ ] Identify expansion opportunities by use case

### Knowledge Base Updates
- [ ] Document any customer-specific deviations from standard patterns
- [ ] Update `customer_patterns.md` with observed use case trends
- [ ] Add learned questions for onboarding based on use case type

---

## 9. Key Learnings for Future Onboarding

### Must-Ask Questions by Use Case

**Pharma/Cold Chain:**
- "What are your temperature requirements and tolerance ranges?"
- "Do you need GDP compliance documentation?"
- "What's your current claim rate and root cause?"

**Electronics:**
- "What's the shock sensitivity of your products?"
- "Are there moisture/corrosion concerns?"
- "Do you operate on just-in-time schedules?"

**Multi-Modal International:**
- "Which airlines/carriers do you use?"
- "Have you shipped with tracking devices before?"
- "What's your typical customs clearance time?"

**Reverse Logistics:**
- "What's your monthly shipment volume?"
- "Do you have a closed-loop or open-loop return process?"
- "What percentage of assets are currently recovered?"

---

## Source Documentation

This learning synthesized from:
- `1_Decklar_SOP_Checklist.docx` — Deployment procedures and scenarios
- `2_Decklar_Troubleshooting.docx` — Real incident patterns and root causes
- `3_Decklar_Best_Practices.docx` — Optimization strategies
- `4_Decklar_FAQ.docx` — Common questions and baseline answers

---

## Next Learning Topics

1. **Customer Success Playbooks** — QBR structure and value demonstration
2. **QBR Metrics Framework** — What to measure and how to present
3. **Decklar Honeycomb Integration** — Platform capabilities and data access

---

*Gavin Learning Spike Complete*
*Knowledge added to: ~/decklar-intelligence/gavin/learnings/*
*Status: Ready for Customer Success application*
*Container Tag: gavin*
