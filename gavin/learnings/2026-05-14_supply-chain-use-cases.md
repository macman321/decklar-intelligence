# GAVIN LEARNING: Decklar Supply Chain Use Cases & Value Propositions

**Research Date:** 2026-05-14  
**Topic:** Decklar Supply Chain Use Cases — Comprehensive Analysis  
**Researcher:** Gavin (Decklar AI Customer Intelligence)

---

## Executive Summary

Decklar's IoT supply chain visibility platform serves multiple verticals with distinct pain points and value propositions. This document categorizes the primary use cases, identifies customer profiles, and maps Bee sensor capabilities to real business outcomes.

---

## 1. Core Use Case Categories

### A. High-Value Cargo Monitoring
**Customer Profile:** Electronics manufacturers, pharmaceutical companies, luxury goods

**Pain Points:**
- Theft of high-value shipments (>$50K per container)
- Temperature excursions destroying product integrity
- Shock/damage during transit causing warranty claims
- Lack of real-time visibility creates insurance nightmares

**Decklar Solution:**
- GPS + temperature + shock monitoring via Bee Labels
- Real-time geofence alerts at origin/destination/waypoints
- Historical route data for insurance claims and process improvement
- e-Proof of delivery with sensor data audit trail

**Key Metrics to Track:**
- Incidents detected vs. incidents reported by carrier
- Percentage of shipments with real-time visibility
- Claims reduction (target: 40-60% reduction)
- Recovery rate for stolen/delayed shipments

---

### B. Cold Chain & Temperature-Sensitive Logistics
**Customer Profile:** Food/beverage distributors, pharmaceutical companies, vaccine distributors, biologics manufacturers

**Pain Points:**
- Temperature excursions = product spoilage
- Regulatory compliance (FDA, GDP) requires continuous monitoring
- Lack of audit trails for compliance documentation
- "Blind spots" in multi-modal shipments (truck → air → truck)

**Decklar Solution:**
- Continuous temperature monitoring with configurable thresholds
- Humidity monitoring for moisture-sensitive products
- Automated alerts when temperature goes out of range
- Sensor interrupts to flag door openings/delays
- Complete data log for regulatory compliance

**Key Metrics to Track:**
- Temperature excursion events per 1000 shipments
- Time-to-alert (target: <5 minutes from threshold breach)
- Compliance audit pass rate
- Spoilage cost reduction

**Industry-Specific Notes:**
- **Pharma:** Requires CFR 21 Part 11 compliance consideration
- **Vaccines:** Ultra-cold chain (-80°C) monitoring capability needed
- **Fresh Produce:** Ethylene-sensitive shipments need combined temp + humidity tracking

---

### C. Multi-Modal International Shipments
**Customer Profile:** Global manufacturers, automotive suppliers, aerospace components

**Pain Points:**
- Handoffs between carriers create visibility gaps
- Customs delays cause detention/demurrage fees
- Air freight has strict weight/size limits on trackers
- Ocean freight = 30-60 day black holes

**Decklar Solution:**
- Small, lightweight Bee Labels (compliant with air freight)
- Battery life up to 90 days for ocean freight
- Continuous cellular connectivity across international borders
- Geofence alerts at customs checkpoints
- Multi-leg trip tracking with waypoints

**Key Metrics to Track:**
- Average dwell time at ports/customs
- Demurrage fee reduction
- Shipment visibility % across entire journey
- Exception resolution time (how fast issues are caught and fixed)

---

### D. Reverse Logistics & Returnable Asset Tracking
**Customer Profile:** Automotive OEMs, appliance manufacturers, rental equipment companies

**Pain Points:**
- Returnable containers/pallets disappear (30-40% annual loss typical)
- No visibility into return journey
- Asset pools become unbalanced geographically
- Customer billing disputes over "lost" assets

**Decklar Solution:**
- Reusable Bees (not labels) for multi-trip use
- Asset flow tracking (location + utilization)
- Automatic return shipment detection
- Billing audit trail with location history

**Key Metrics to Track:**
- Asset recovery rate (target: >95%)
- Average asset turn time
- Asset pool utilization by geography
- Customer billing dispute reduction

---

### E. Last-Mile Delivery & Consumer-Facing Tracking
**Customer Profile:** E-commerce retailers, 3PLs, final-mile carriers

**Pain Points:**
- Customer service overwhelmed with "where's my order" calls
- Failed deliveries cost $15-25 per attempt
- Proof of delivery disputes
- Unauthorized delivery locations (porch piracy)

**Decklar Solution:**
- Public tracking links for end customers
- e-Proof of delivery with timestamp + location
- Photo documentation of delivery location
- Real-time ETAs for customer communication

**Key Metrics to Track:**
- Customer service call volume reduction
- First-attempt delivery success rate
- Proof-of-delivery dispute resolution rate
- Customer satisfaction scores

---

## 2. Bee Sensor Data Patterns

### Temperature Patterns by Industry
| Industry | Typical Range | Critical Events |
|----------|---------------|-----------------|
| Pharma/Vaccines | 2-8°C, -20°C, -80°C | Excursion >15 min = product loss |
| Fresh Produce | 0-4°C | Ethylene spikes indicate ripening |
| Electronics | Ambient | Extreme heat (>60°C) = component damage |
| Chemicals | Varies by class | Freeze/thaw cycles trigger degradation |

### Humidity Patterns
- **Normal range:** 30-70% RH
- **High-risk industries:** Electronics (corrosion), Pharmaceuticals (moisture ingress), Paper goods (mold)
- **Correlation patterns:** High humidity + temperature swings = condensation events

### Shock/Vibration Patterns
- **Threshold:** Typically 3-5G impact triggers alert
- **False positive reduction:** Multi-axis accelerometer distinguishes drops from road vibration
- **Pattern recognition:** Clustered shocks indicate rough handling at specific facilities

### GPS + Geofence Patterns
- **Standard geofence radius:** 500m-2km depending on facility size
- **False exit alerts:** Cellular dead zones near facility boundaries
- **Pattern:** Repeated near-boundary alerts suggest geofence misconfiguration

---

## 3. Customer Success Indicators by Use Case

### Early Warning Signs (Amber Flags)

| Use Case | Warning Signs |
|----------|---------------|
| High-Value Cargo | <80% of shipments tracked, >5% alert fatigue |
| Cold Chain | >3 temperature excursions per week, delayed alert response |
| Multi-Modal | >50% of ocean shipments lose signal, customs delays not flagged |
| Reverse Logistics | Asset recovery rate <90%, billing disputes increasing |
| Last-Mile | <70% first-attempt success, tracking link errors |

### Success Milestones (Green Flags)

| Use Case | Success Indicators |
|----------|-------------------|
| High-Value Cargo | >95% visibility, claims reduced 40%+, theft recovery rate >60% |
| Cold Chain | Zero excursions >15 min, 100% compliance audit pass, <2 min alert time |
| Multi-Modal | 100% visibility across all modes, demurrage fees reduced 50%+ |
| Reverse Logistics | >95% asset recovery, turn time reduced 30%+ |
| Last-Mile | CS calls reduced 30%+, first-attempt success >85% |

---

## 4. Expansion Opportunities by Use Case

### From Single Use Case to Multi-Use
1. **Start:** High-value cargo monitoring (customer tests with highest-value shipments)
2. **Expand:** Add temperature monitoring for same customer (pharma/electronics hybrids)
3. **Next:** Reverse logistics tracking for returnable packaging
4. **Advanced:** End-to-end supply chain visibility (suppliers → factory → distribution → retail)

### Cross-Sell Patterns
- Cold chain customers often need **humidity monitoring** (moisture-sensitive goods)
- High-value cargo customers often expand to **detention/demurrage** tracking
- Reverse logistics customers often need **vehicle tracking** for their own fleet
- Last-mile customers often expand to **warehouse asset flow** inside distribution centers

---

## 5. Competitive Positioning by Use Case

### Decklar Differentiators vs. Traditional Trackers

| Feature | Traditional GPS | Decklar Bees |
|---------|---------------|--------------|
| Sensor depth | Location only | Location + temp + humidity + shock + light |
| Connectivity | GPS only | GPS + Cellular + Wi-Fi + BLE options |
| Size/weight | Bulky | Compact, air-freight compliant |
| Battery life | 7-30 days | Up to 90 days |
| Data granularity | Hourly pings | Configurable (5 min to 24 hr) |
| Cost model | CapEx hardware | Per-shipment/lease model |

---

## 6. Questions to Ask During Discovery

### High-Value Cargo
1. "What's the average value of a single shipment?"
2. "How many shipments per year experience theft or significant delay?"
3. "What's your current insurance claim process like?"
4. "Do you have visibility into carrier handoffs?"

### Cold Chain
1. "What temperature ranges are critical for your products?"
2. "Have you had any temperature excursions in the past year? What was the cost?"
3. "What regulatory requirements do you need to satisfy?"
4. "How do you currently handle documentation for audits?"

### Multi-Modal
1. "What percentage of your shipments involve multiple carriers?"
2. "What's your average dwell time at ports/customs?"
3. "How do you track shipments once they leave your origin facility?"
4. "What's been your biggest customs/customs delay cost?"

### Reverse Logistics
1. "How many returnable assets do you have in circulation?"
2. "What's your annual asset loss rate?"
3. "How do you currently bill customers for unreturned assets?"
4. "What's the average time for assets to return to your pool?"

### Last-Mile
1. "What percentage of deliveries require multiple attempts?"
2. "How many 'where's my order' calls does customer service handle daily?"
3. "What proof of delivery do you currently provide?"
4. "Do you offer customer-facing tracking today?"

---

## 7. Success Metrics Dashboard Template

### Monthly Account Review Metrics
```
Account: [Customer Name]
Period: [Month]

SHIPMENTS MONITORED: ___
ALERTS TRIGGERED: ___
INCIDENTS DETECTED: ___
FALSE POSITIVES: ___

COST IMPACT:
- Claims avoided: $___
- Spoilage prevented: $___
- Theft recovered: $___

OPERATIONAL METRICS:
- Visibility %: ___%
- Alert response time: ___ min
- Compliance audit status: ✅ / ⚠️ / ❌

OPEN ITEMS:
1. _____________
2. _____________
```

---

## 8. References & Documentation

- Source: JARVIS_PROMPT.md — Decklar AI Customer Intelligence Platform
- Source: Decklar SOP Checklist (1_Decklar_SOP_Checklist.docx)
- Source: Decklar Best Practices (3_Decklar_Best_Practices.docx)
- Source: Decklar FAQ (4_Decklar_FAQ.docx)

---

## Next Steps / Action Items

1. **Create customer profile templates** for each use case category
2. **Develop use case-specific onboarding questions** in the portal
3. **Build success metric calculators** for QBR presentations
4. **Create competitive battle cards** for each vertical
5. **Research industry-specific compliance requirements** (pharma GxP, food safety, etc.)

---

**Document Status:** Learning complete — ready for Jeff review  
**Gavin Tag:** `#supply-chain-use-cases` `#bee-patterns` `#value-proposition`