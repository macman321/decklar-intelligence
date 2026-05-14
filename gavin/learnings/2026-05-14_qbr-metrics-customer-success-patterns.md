# Gavin Learning Spike: QBR Metrics & Customer Success Patterns
**Date:** 2026-05-14  
**Topic:** Decklar QBR Metrics, Customer Success Playbooks & Best Practices  
**Source:** Decklar Best Practices Guide (core_docs/3_Decklar_Best_Practices.docx)

---

## Executive Summary

This learning spike focuses on the **Quarterly Business Review (QBR) framework** and **customer success patterns** for Decklar IoT supply chain visibility deployments. Key insight: Decklar's success is measured not just by device activation, but by continuous optimization through a "pipe-cleaning" phase followed by data-driven refinement.

---

## 1. QBR Metrics Framework

### Primary KPI Categories

#### Battery & Device Health Metrics
- **Ping frequency alignment** — Is the Bee configured to match actual lane duration?
- **Sensor interrupt status** — Are unnecessary sensors disabled? (Critical for battery life)
- **Dynamic PRF utilization** — Are waypoints being used to optimize battery consumption?
- **Battery depletion rate** — Track actual vs. expected battery life per lane

#### Lane Performance Metrics
- **Auto-completion rate** — Percentage of shipments that auto-complete vs. require manual intervention
- **Geofence trigger accuracy** — Are shipments starting/completing at the right locations?
- **Wi-Fi location mapping coverage** — MAC address sniffing success rate
- **Risky shipment identification** — Automated reports flagging lanes needing attention

#### Data Quality Metrics
- **Signal connectivity rate** — GPS + Cellular connectivity success
- **Data continuity** — Gaps in sensor data logging
- **API/Webhook integration uptime** — For customers with system integrations
- **Simulator test pass rate** — Pre-deployment validation success

---

## 2. Customer Success Playbook: The "Pipe-Cleaning" Phase

### Definition
The "pipe-cleaning" phase is Decklar's structured post-launch optimization period where initial real-world data reveals configuration adjustments needed for optimal performance.

### Key Playbook Steps

1. **Set Expectations Early**
   - Inform customers BEFORE go-live that this phase exists
   - Frame it as optimization, not fixing mistakes
   - Emphasize that configs should be "99% correct" before launch

2. **Monitor Initial Shipments Closely**
   - Track first 5-10 shipments per lane
   - Identify patterns in geofence accuracy
   - Document sensor behavior in actual conditions

3. **Data-Driven Adjustments**
   - **Geofence optimization:** Start large, then shrink based on actual GPS patterns
   - **Ping frequency tuning:** Match to real lane duration, not estimates
   - **Dynamic PRF setup:** Identify key waypoints (distribution centers, ports, handoffs)

4. **Wi-Fi Mapping Buildout**
   - After a few Bees traverse a lane, sniffed MAC addresses enable location snapping
   - This improves indoor/urban accuracy significantly

### Success Criteria for Pipe-Cleaning Completion
- [ ] Auto-completion rate >95% for standard lanes
- [ ] No critical battery failures mid-shipment
- [ ] Customer can self-serve basic troubleshooting
- [ ] All "risky shipment" alerts have been investigated and resolved

---

## 3. Risk Patterns: At-Risk Account Indicators

### Early Warning Signals (Red Flags)

| Indicator | Risk Level | Action |
|-----------|-----------|--------|
| Lane duration > battery life at current PRF | 🔴 Critical | Immediate config review |
| Sensor interrupts enabled on long ocean shipments | 🔴 Critical | Disable interrupts per APL incident |
| Activation in <3% light conditions | 🟡 High | Require lamp/flashlight protocol |
| Geofence triggers <80% accuracy | 🟡 High | Resize/reposition geofences |
| Bees not on account before shipping | 🔴 Critical | Contract limit/finance review |
| Expired Bees (>9 months) shipped to customer | 🔴 Critical | Ops process failure |
| Customer hasn't activated test Bee before go-live | 🟡 High | Delay launch until tested |

### Proactive Risk Mitigation

1. **"Risky Shipment" Automated Report**
   - Build dashboard flagging shipments likely to have issues
   - Criteria: Low battery at completion, auto-complete failures, repeated lanes with problems

2. **Battery Health Projection**
   - Calculate expected battery drain BEFORE deployment
   - Account for: lane duration, ping frequency, sensor interrupts, connectivity mode

3. **Environmental Pre-Check**
   - Verify activation location has adequate lighting (>3%)
   - Confirm Wi-Fi/BLE policies at customer facilities (Schneider case — BLE prohibited)

---

## 4. Expansion Opportunities Identified

### Upsell Vectors from Best Practices

1. **Dynamic PRF Configuration**
   - Customers with multi-modal shipments (truck→air→truck) benefit most
   - Requires waypoint identification and configuration

2. **Wi-Fi Location Mapping**
   - Premium accuracy feature for indoor/urban environments
   - Builds over time as Bees traverse lanes

3. **Risky Shipment Reports**
   - Can be productized as "Decklar Insights" premium tier
   - Automated proactive monitoring vs. reactive troubleshooting

4. **Simulator-Based Testing Service**
   - Pre-deployment validation as a professional service
   - Reduces pipe-cleaning time significantly

5. **Pharma Mode Compliance**
   - Disable non-temperature events to avoid self-heating
   - Required for regulated industries — compliance upsell

---

## 5. Key Lessons for Customer Conversations

### What to Say

**On Pipe-Cleaning:**
> "After we go live, there's a 2-4 week optimization phase we call 'pipe-cleaning.' This isn't fixing mistakes — it's using real data to fine-tune geofences, ping frequencies, and waypoint triggers. We expect 99% of the configuration to be right from day one. This phase catches that last 1%."

**On Battery Life:**
> "Battery life depends on three factors: how often we ping, what sensors are active, and the connectivity environment. For a 30-day ocean shipment, we'll disable sensor interrupts and use dynamic PRF at ports. That extends battery from 60 days to 90+ days."

**On Accuracy:**
> "GPS gets you to the building. Wi-Fi mapping gets you to the dock. We build that Wi-Fi map over your first few shipments, then location accuracy improves significantly for indoor areas."

### Questions to Ask Customers

1. "What percentage of your shipments are completed automatically vs. require manual check-out?" (Target: >95%)
2. "Are there any locations where activating the Bees might be in low light?" (Target: >3% light)
3. "Do any of your facilities have Bluetooth or Wi-Fi restrictions we should know about?" (Critical for connectivity mode)
4. "What's your longest lane duration, and do you have any ocean shipments?" (Battery/config implications)

---

## 6. Action Items for Jeff

### Immediate (This Week)
- [ ] Review current customer base for pipe-cleaning phase status
- [ ] Identify any accounts with ocean shipments >30 days — verify sensor interrupt config
- [ ] Check activation location light levels for recent deployments

### Short-Term (Next 30 Days)
- [ ] Build "Risky Shipment" report template for QBRs
- [ ] Create battery life calculator tool for pre-sales
- [ ] Document Wi-Fi mapping enablement process for customers

### Strategic (Next Quarter)
- [ ] Propose "Decklar Insights" premium tier with automated risky shipment alerts
- [ ] Develop pharma mode compliance checklist for regulated customers
- [ ] Create case study from pipe-cleaning success story

---

## Source References

- Document: `core_docs/3_Decklar_Best_Practices.docx`
- Related: `core_docs/2_Decklar_Troubleshooting.docx` (incident patterns)
- Portal: `https://smartbee-staging.decklar.com` (Simulator tool)

---

*Learning captured by Gavin | Decklar Customer Intelligence System*  
*Next review: Incorporate actual QBR data from customer accounts when available*
