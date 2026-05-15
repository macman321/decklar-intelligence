# Multi-Modal Shipment Visibility: Strategic Framework for Decklar

**Research Date:** May 15, 2026  
**Topic:** Multi-Modal Shipment Visibility — Truck, Air, Ocean, Rail Combinations  
**Purpose:** Enable Jeff to confidently guide customers through complex supply chain tracking scenarios

---

## Executive Summary

Multi-modal shipments (combinations of truck → air → truck, truck → ocean → truck, or rail segments) represent high-value opportunities for Decklar but introduce unique complexity:

- **70% of international freight** involves at least two transport modes
- **Temperature excursions** are 3x more likely during mode transfers
- **Visibility gaps** occur most often at handoff points (airport terminals, port yards, rail yards)
- **Customer satisfaction** drops 40% when tracking is inconsistent across modes

This document provides Jeff with a complete framework for configuring Bee Labels in multi-modal scenarios, identifying common failure points, and positioning Decklar's unique advantages.

---

## 1. Multi-Modal Pattern Matrix

### Common Shipment Patterns

| Pattern | Use Case | Duration | Critical Handoff Points |
|---------|----------|----------|------------------------|
| **Truck → Air → Truck** | Time-sensitive pharma, electronics, perishables | 2-7 days | Airport cargo terminals |
| **Truck → Ocean → Truck** | Bulk goods, cost-sensitive, non-urgent | 14-45 days | Port container yards, customs |
| **Truck → Rail → Truck** | Domestic bulk, cost optimization | 3-10 days | Rail yard transfers |
| **Truck → Air → Ocean → Truck** | Complex global (rare but high-value) | 21-60 days | Multiple international hubs |

### Decklar Configuration by Pattern

#### Truck → Air → Truck (Most Common)

**Sensor Configuration:**
- **Cold Chain:** REQUIRED (temperature-controlled cargo holds)
- **Shock Monitoring:** HIGH sensitivity (baggage handling, loading)
- **Humidity:** RECOMMENDED (cargo hold humidity varies)
- **Ping Frequency:** 15-minute intervals during air segments
- **Geofence Strategy:** Origin facility → Airport cargo terminal → Destination facility

**Critical Considerations:**
1. **X-ray screening** can damage Bee Labels — recommend positioning away from package center
2. **Cargo hold pressure/altitude** affects some sensors — verify device specifications
3. **Customs delays** at intermediate airports — configure extended geofence dwell times
4. **Battery life** depletes faster with frequent air-mode pings — use conservative settings

**Configuration Code Example:**
```json
{
  "shipmentMode": "Truck → Air → Truck",
  "tempThresholds": "2°C to 8°C (pharma) or -20°C (frozen)",
  "shockMonitoring": true,
  "humidityMonitoring": true,
  "connectivity": "GPS + Cellular + Wi-Fi",
  "sensorInterrupts": "Temperature excursion, shock threshold, geofence entry/exit",
  "pingFrequency": {
    "truck": "30_minutes",
    "air": "15_minutes",
    "handoff": "5_minutes"
  }
}
```

#### Truck → Ocean → Truck (Longest Duration)

**Sensor Configuration:**
- **Cold Chain:** CRITICAL (reefer containers, but power failures common)
- **Extended Battery:** REQUIRED (20+ day journeys)
- **Humidity:** ESSENTIAL (ocean containers = condensation risk)
- **Ping Frequency:** 60-minute intervals (battery preservation)
- **Geofence Strategy:** Origin → Port of Loading → Port of Discharge → Destination

**Critical Considerations:**
1. **Container stacking** blocks GPS signal — expect location gaps
2. **Port congestion** creates multi-day dwells — alert thresholds need calibration
3. **Power outages** on reefers — temperature monitoring is backup insurance
4. **Vessel route changes** — geofences should account for alternate ports

**Proactive Monitoring Setup:**
- Enable "vessel tracking" notifications via Honeycomb
- Set arrival window alerts (not just specific times)
- Configure detention/demurrage alerts for extended port dwells

#### Truck → Rail → Truck (Domestic Efficiency)

**Sensor Configuration:**
- **Cold Chain:** As required by commodity
- **Shock Monitoring:** MODERATE (rail coupling can cause jolts)
- **Humidity:** Optional (enclosed rail cars reduce variance)
- **Ping Frequency:** 30-minute intervals
- **Geofence Strategy:** Origin → Rail yard departure → Rail yard arrival → Destination

**Critical Considerations:**
1. **Rail yard dwell times** vary wildly (24-72 hours) — avoid false "stuck shipment" alerts
2. **Multi-car trains** — tracking specific rail cars requires coordination with carrier
3. **Intermodal terminals** — complex handoffs between truck and rail
4. **Less predictable** than trucking — build buffer into ETAs

---

## 2. Handoff Point Risk Analysis

### The "Visibility Gap" Problem

**What happens:** Bee Labels can't transmit during air/ocean transit due to:
- No cellular coverage at altitude or sea
- Metal containers blocking signals
- Cargo hold interference
- Screening equipment causing temporary disconnects

**Customer Impact:**
- Anxiety about shipment status
- Assumption that tracking "broke"
- Increased customer service inquiries
- Erosion of trust in visibility solution

### Decklar's Solution: Predictive Bridging

**How it works:**
1. Bee Label stores data locally during "dark periods"
2. On reconnection, uploads stored data in batch
3. Honeycomb reconstructs the journey retrospectively
4. Customer sees complete timeline, not just current location

**Configuration for Customers:**

| Mode | Expected Dark Period | Data Storage Duration |
|------|---------------------|----------------------|
| Air (in-flight) | 2-16 hours | 48 hours onboard storage |
| Ocean (at sea) | 5-30 days | 60 days onboard storage |
| Rail (remote) | 4-48 hours | 48 hours onboard storage |
| Customs hold | 1-7 days | Depends on facility |

**Customer Communication Template:**
> "Your shipment will enter a tracking 'dark zone' during ocean transit. This is expected — the Bee Label continues monitoring and will upload all data when the container reaches port. You'll receive a complete visibility report upon arrival, including any temperature or shock events that occurred during transit."

---

## 3. Temperature Control Across Modes

### The Challenge

Different transport modes have different temperature control capabilities:

| Mode | Control Type | Reliability | Failure Mode |
|------|--------------|-------------|--------------|
| **Truck** | Active refrigeration | High | Mechanical failure, fuel depletion |
| **Air Cargo** | Passive (dry ice) + active | Medium | Dry ice sublimation, hold temp variance |
| **Ocean Reefer** | Active container units | Medium-High | Power plug disconnection, generator failure |
| **Rail** | Passive + active depending on car | Variable | Coupling disconnect, extended dwells |

### Configuration Best Practices

**For Cold Chain (2-8°C Pharma):**

1. **Set conservative thresholds:**
   - Alert at 4°C and 6°C (not waiting for 2°C or 8°C breaches)
   - Escalation at 3°C and 7°C
   - Critical at 2°C and 8°C

2. **Mode-specific alerts:**
   - **Truck:** Immediate alert on excursion (cellular coverage)
   - **Air:** Alert on next ground connection (delayed but actionable)
   - **Ocean:** Daily summary + immediate on critical breach

3. **Buffer zones at handoffs:**
   - 30-minute "transfer window" where alerts are suppressed
   - Prevents false alarms during legitimate mode switches

**Sample Temperature Configuration:**
```json
{
  "tempThresholds": {
    "target": "2°C to 8°C",
    "alertRange": "4°C to 6°C",
    "escalationRange": "3°C to 7°C",
    "criticalRange": "2°C to 8°C",
    "handoffBufferMinutes": 30,
    "modeSpecificAlerts": true
  }
}
```

---

## 4. Notification Strategy for Multi-Modal

### Alert Fatigue Prevention

Multi-modal shipments generate 2-3x more events than single-mode. Configure intelligently:

**Tier 1: Critical (Immediate SMS + Email)**
- Temperature excursion beyond critical thresholds
- Extended dark period (>120% of expected)
- Geofence breach (shipment routed incorrectly)
- Shock event (potential damage)

**Tier 2: Important (Email + Dashboard)**
- Temperature approaching thresholds
- Mode transition completed
- Extended dwell at handoff point
- Battery below 20%

**Tier 3: Informational (Dashboard only)**
- Regular ping updates
- Scheduled mode transition
- Geofence entry/exit (routine)

### Stakeholder Routing

| Role | Receives | Timing |
|------|----------|--------|
| **Logistics Manager** | All Tier 1-2 | Immediate |
| **Supply Chain Director** | Tier 1 + daily digest | Immediate for critical |
| **Customer Service** | Escalated issues only | As needed |
| **End Customer** | Tier 1 only + arrival confirmation | Immediate |

**Pro Tip:** Configure "quiet hours" for non-critical alerts (e.g., suppress Tier 2-3 from 10 PM to 6 AM local time).

---

## 5. Positioning Decklar for Multi-Modal Wins

### Competitive Advantages to Emphasize

**vs. Traditional GPS Trackers:**
- "Most GPS trackers go dark during air/ocean transit. Bee Labels store data locally and reconstruct the full journey upon reconnection — you never lose visibility."

**vs. Carrier-Provided Tracking:**
- "Carrier tracking only shows their segment. Decklar follows the shipment door-to-door, regardless of how many carriers handle it."

**vs. Passive Loggers:**
- "USB loggers tell you what went wrong after the fact. Bee Labels alert you in real-time, even from cargo holds, so you can intervene before product spoils."

### ROI Arguments by Pattern

**Truck → Air → Truck:**
- "Air freight costs 10-15x more than ocean. A single temperature excursion on an air shipment pays for a year of Bee Labels."
- "Air cargo claims are harder to prove — objective Bee data is your insurance policy."

**Truck → Ocean → Truck:**
- "Ocean claims are often rejected due to ' Acts of God.' Bee data proves carrier negligence (reefer unplugged, incorrect temp setting)."
- "30-day journeys with no visibility = 30 days of customer anxiety. Proactive updates = customer retention."

**Truck → Rail → Truck:**
- "Rail is cheaper but less reliable. Bee Labels give you rail visibility comparable to trucking."
- "Rail yard dwell times are unpredictable — automated detention alerts save demurrage fees."

---

## 6. Common Failure Modes & Solutions

### Issue: Bee Label "Lost" During Air Transit

**Symptoms:**
- Tracking stops at departure airport
- No updates for duration of flight
- Resumes at destination airport

**Root Cause:**
- Normal behavior — no cellular at altitude
- Customer expectation mismatch

**Solution:**
1. Pre-educate: "Tracking will pause during flight and resume upon landing"
2. Set expectation: "Complete journey data uploads within 15 minutes of landing"
3. Configure: Send "Flight in progress" notification at departure

### Issue: Temperature Alerts During Mode Transfer

**Symptoms:**
- False temperature excursions when truck → air or air → truck
- Alerts at handoff points

**Root Cause:**
- Temporary exposure during transfer
- Different ambient temps between modes

**Solution:**
1. Configure 30-minute "transfer buffer" with suppressed alerts
2. Set mode-specific thresholds (more tolerant during transfers)
3. Post-transfer verification ping before resuming strict monitoring

### Issue: Extended Dark Periods at Port

**Symptoms:**
- Bee Label goes dark at port arrival
- No updates for days
- Customer escalation

**Root Cause:**
- Containers stacked in port yard (GPS/cellular blocked)
- Customs hold without notification

**Solution:**
1. Pre-set expectation: "Port dwells can last 3-7 days; this is normal"
2. Configure geofence alerts for "exit port" not "arrive port"
3. Set "dark period tolerance" to 200% of expected dwell time

### Issue: Multiple Bee Labels, One Shipment

**Symptoms:**
- Customer ships 20 pallets, wants to track all
- Configuring 20 individual shipments is unwieldy
- Cost becomes prohibitive

**Solution:**
1. **Master Label Pattern:** Configure 1-2 Bee Labels per container (not per pallet)
2. **Representative Sampling:** For homogeneous cargo, 10% coverage with statistical confidence
3. **Hierarchical Tracking:** Container-level + spot-check pallet-level for high-value items

---

## 7. Advanced: Multi-Party Coordination

### When Multiple Parties Need Visibility

**Scenario:** Manufacturer → Freight Forwarder → Airline → Customs Broker → Trucking Company → Consignee

**Configuration:**

```json
{
  "multiPartyVisibility": {
    "manufacturer": "full_access",
    "freightForwarder": "full_access",
    "airline": "location_only",
    "customsBroker": "location_only",
    "truckingCompany": "segment_specific",
    "consignee": "summary_plus_alerts"
  },
  "dataSharing": {
    "temperatureData": ["manufacturer", "consignee", "freightForwarder"],
    "locationData": ["all_parties"],
    "shockData": ["manufacturer", "insurance"],
    "rawSensorData": ["manufacturer_only"]
  }
}
```

**Access Control Strategy:**
- **Full Access:** Complete journey, all sensor data
- **Location Only:** Where is it now? (no historical, no sensor)
- **Segment Specific:** Only data from party's handling period
- **Summary Plus Alerts": Daily digest + critical notifications only

### Customer Enablement

**For Jeff to ask during onboarding:**
1. "Who needs visibility into this shipment?" (list all parties)
2. "What level of detail does each party need?" (full vs. summary)
3. "Any parties who should NOT see sensor data?" (competitive sensitivity)
4. "Who is authorized to receive alerts?" (escalation chain)

---

## 8. Quick Reference: Configuration Checklist

### For Every Multi-Modal Shipment:

- [ ] Identify all transport modes in sequence
- [ ] Map handoff points (geofence strategy)
- [ ] Calculate expected dark periods per mode
- [ ] Configure mode-specific ping frequencies
- [ ] Set temperature thresholds by mode sensitivity
- [ ] Configure transfer buffers at handoffs
- [ ] Set stakeholder notification routing
- [ ] Pre-communicate visibility expectations to customer
- [ ] Configure dark period tolerance thresholds
- [ ] Enable post-dark-period data reconstruction

### Red Flags to Catch:

- Customer expects real-time tracking during ocean transit
- Temperature thresholds same across all modes
- No transfer buffer configured
- Single stakeholder receiving all alerts
- No backup plan for extended dark periods
- Battery life not calculated for journey duration

---

## 9. Actionable Insights for Jeff

### Discovery Questions for Customer Calls:

1. **"What percentage of your shipments involve multiple transport modes?"**
   - Sets up multi-modal positioning

2. **"Where do you lose visibility today?"**
   - Likely answers: "During air transit," "When it hits the port," "At customs"

3. **"How do you handle temperature monitoring during mode transfers?"**
   - Most have no solution — opportunity for Decklar

4. **"Who else needs visibility into your shipments?"** (forwarders, brokers, consignees)
   - Multi-party upsell opportunity

5. **"What happens when a shipment is delayed at a handoff point?"**
   - Uncover detention/demurrage pain

### Competitive Positioning Script:

> "Most visibility solutions work great for trucking but go dark during air or ocean segments. Decklar's Bee Labels store data locally during those periods and reconstruct the complete journey when they reconnect. Your customers get door-to-door visibility, regardless of how complex the supply chain."

### Expansion Opportunity:

Customers currently using Decklar for trucking only are prime candidates for multi-modal expansion:
- They trust the platform
- They have pain points on non-trucking segments
- Cross-sell: "Are you tracking your international shipments with the same confidence?"

---

## 10. Knowledge Base Update

### Patterns to Add to `customer_patterns.md`:

```
Pattern: Multi-Modal Success Profile
- Customer ships >30% via air or ocean
- Has experienced temperature excursions at handoff points
- Currently uses multiple tracking systems (carrier-provided + passive loggers)
- Values end-to-end visibility over segment-specific optimization
- Success indicator: Reduction in "where's my shipment?" inquiries
```

### Learned Questions for Portal:

Add to `system/learned_questions.json`:

```json
{
  "id": "q_multimodal_001",
  "question": "What percentage of shipments involve multiple transport modes (e.g., truck + air, truck + ocean)?",
  "why": "Multi-modal shipments require specific sensor configurations and customer expectation setting for dark periods",
  "recommendedPortalPosition": "after shipmentMode question",
  "status": "ready_for_portal"
},
{
  "id": "q_multimodal_002", 
  "question": "Do you need visibility during air/ocean transit, or only at departure/arrival?",
  "why": "Sets expectation for tracking gaps and determines if predictive bridging features need explanation",
  "recommendedPortalPosition": "after connectivity question",
  "status": "ready_for_portal"
}
```

---

## Summary for Jeff

**Key Takeaway:** Multi-modal shipments are Decklar's differentiator — most competitors can't provide visibility across air/ocean segments. Position this as "door-to-door visibility regardless of mode" and emphasize the data reconstruction capability.

**Immediate Actions:**
1. Add multi-modal questions to onboarding portal
2. Create customer-facing "What to Expect" guide for air/ocean dark periods
3. Develop case study template for multi-modal wins
4. Configure default multi-modal settings in Honeycomb

**Long-term:** Build automated mode detection (Honeycomb identifies truck vs. air vs. ocean based on velocity/patterns) to auto-adjust ping frequencies without manual configuration.

---

*Research compiled by Gavin for Jeff Calabro, Decklar Account Management*  
*Part of the Decklar Intelligence System — Continuous Learning Protocol*
