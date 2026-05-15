# Gavin Learning Spike: Pharma/Cold Chain QBR Metrics & Acme Pharma Playbook
**Date:** 2026-05-14  
**Topic:** Cold Chain QBR Metrics, Pharma Compliance, Actionable Framework for Overdue Reviews  
**Context:** Acme Pharma Distribution QBR overdue — battery risks in Lane 7, incomplete sensor deployment

---

## 🎯 Executive Summary

**Acme Pharma Situation:**
- QBR overdue (critical customer touchpoint missed)
- Lane 7: Incomplete sensor deployment + battery risks flagged
- **Opportunity:** Turn this QBR into a value demonstration and expansion conversation

**Key Learning:** Pharma QBRs must emphasize **compliance, risk mitigation, and audit trails** — not just operational metrics. The stakes are higher (regulatory), but so is the ROI story.

---

## 📊 Pharma/Cold Chain QBR: Critical Metrics

### 1. Compliance & Risk Metrics (Lead With These)

| Metric | Why It Matters for Pharma | Target |
|--------|--------------------------|--------|
| **Temperature Excursion Rate** | GDP compliance, product integrity | <1% (vs. <2% benchmark) |
| **Cold Chain Compliance %** | Regulatory audit evidence | >98% |
| **Excursion Response Time** | Minimize product loss | <15 min (alert to action) |
| **Sensor Calibration Status** | Data integrity for audits | 100% within spec |
| **Documentation Completeness** | Regulatory submission ready | 100% |
| **Mean Kinetic Temperature (MKT)** | Stability budget management | Within spec |

### 2. Operational Excellence Metrics

| Metric | Pharma Context | Acme Pharma Specific |
|--------|---------------|---------------------|
| **Shipment Visibility Rate** | Full chain of custody | Check Lane 7 coverage |
| **Auto-Completion Rate** | Reduces manual errors | Target: >95% |
| **Geofence Accuracy** | Proof of delivery verification | Lane 7 trigger issues? |
| **Battery Health at Completion** | Data continuity assurance | **🔴 CRITICAL: Lane 7 battery risk** |
| **Data Latency** | Real-time excursion alerts | <5 min for temperature alerts |

### 3. Financial Impact Metrics (The ROI Story)

**Quantify These for Acme Pharma:**
- **Product Loss Avoided:** $X in temperature excursions caught
- **Expedited Freight Avoided:** $X in emergency shipments prevented
- **Audit Cost Savings:** Reduced manual documentation effort
- **Insurance Impact:** Cold chain coverage validation
- **Customer Confidence:** On-time delivery with full documentation

---

## 🔋 Battery Risk Deep-Dive: Lane 7 Specific

### Immediate Diagnostics for Acme Pharma Lane 7

**Battery Risk Factors (Check These):**
1. **Lane Duration vs. Battery Life**
   - Current PRF (ping rate frequency) setting?
   - Expected battery life at current config vs. actual lane duration?
   - Any ocean/air segments with extended transit times?

2. **Configuration Issues**
   - Are sensor interrupts enabled? (Should be DISABLED for long shipments)
   - Dynamic PRF configured at waypoints?
   - Wi-Fi location mapping active?

3. **Environmental Factors**
   - Temperature extremes affecting battery?
   - Connectivity dead zones causing retry drain?

### Battery Life Calculation Formula

```
Expected Battery Life (days) = Base Life × PRF Factor × Sensor Factor × Connectivity Factor

Where:
- Base Life = 90 days (standard Bee)
- PRF Factor = 1.0 (5-min) to 2.0 (10-min) to 4.0 (20-min)
- Sensor Factor = 0.7 if interrupts enabled, 1.0 if disabled
- Connectivity Factor = 0.9-1.1 depending on signal strength
```

**Example:** 30-day ocean shipment
- Standard (5-min PRF + interrupts): ~45 days (RISKY)
- Optimized (20-min PRF + no interrupts + dynamic): ~90+ days (SAFE)

---

## 📋 Acme Pharma QBR Action Plan

### Immediate Actions (Before QBR)

**1. Fix Lane 7 Battery Risk (CRITICAL)**
- [ ] Pull Lane 7 shipment history — identify battery drain patterns
- [ ] Verify PRF settings match actual lane duration
- [ ] Confirm sensor interrupts are DISABLED for long shipments
- [ ] Check if dynamic PRF waypoints configured
- [ ] Test battery life projection with current config

**2. Complete Sensor Deployment**
- [ ] Inventory: How many sensors still need deployment?
- [ ] Lane 7: What's incomplete? Hardware or configuration?
- [ ] Timeline: When can 100% coverage be achieved?

**3. Pull QBR Metrics (Last 90 Days)**
- [ ] Temperature excursion rate
- [ ] Cold chain compliance percentage
- [ ] Shipment visibility coverage by lane
- [ ] Auto-completion rate
- [ ] Battery incidents (if any)
- [ ] Cost impact: Product loss avoided, expedited freight avoided

### QBR Agenda for Acme Pharma

| Time | Section | Content |
|------|---------|---------|
| 0-5 min | **Executive Summary** | Health status: Lane 7 risks identified and mitigated |
| 5-15 min | **Compliance Review** | Temperature excursion rates, GDP compliance scores, audit readiness |
| 15-25 min | **Lane 7 Deep-Dive** | Battery optimization deployed, sensor completion plan, coverage targets |
| 25-35 min | **Value Realization** | $X in losses prevented, Y incidents caught, Z% compliance improvement |
| 35-45 min | **Expansion Opportunities** | Additional lanes, higher sensor density, integration options |
| 45-50 min | **Next Quarter Roadmap** | 100% deployment, optimization phase, compliance enhancements |

---

## 🗣️ Pharma QBR Talking Points

### Opening (Set the Tone)
> "Acme Pharma's cold chain compliance is now at X%, exceeding industry benchmarks. This QBR, we're going to show you exactly how Decklar is protecting your product integrity and reducing your risk exposure."

### On Lane 7 Battery Risk (Address Head-On)
> "We identified a battery optimization opportunity in Lane 7. This isn't a failure — it's the 'pipe-cleaning' phase working as designed. We've adjusted the ping frequency and disabled sensor interrupts for your longer lanes. This extends battery life from 45 days to 90+ days."

### On Compliance (The Win)
> "Your temperature excursion rate is now X%, down from Y% last quarter. That translates to $Z in product loss avoided and positions you favorably for your next FDA audit."

### Expansion Hook
> "With Lane 7 optimized, we see an opportunity to expand coverage to your new distribution facility in [Location]. We can replicate this configuration and have you live within 2 weeks."

---

## 🚨 Red Flags to Watch for in Pharma QBRs

| Red Flag | What It Means | Action |
|----------|--------------|--------|
| Temperature excursions >2% | Compliance risk | Immediate config review |
| Customer mentions "audit prep" | High stakes, documentation critical | Offer audit support package |
| New quality/regulatory contacts | Org change, need re-education | Schedule training session |
| "Evaluating other providers" | Churn risk, likely compliance-driven | Executive escalation |
| Questions about data export | Portability concern, potential churn | Lock in integration value |
| Delayed QBR scheduling (like this one) | Disengagement or satisfaction issue | Address immediately |

---

## 💡 Expansion Opportunities for Acme Pharma

**Natural Expansion Vectors:**
1. **Lane Coverage:** New lanes from recent distribution expansion
2. **Sensor Density:** More granular tracking in high-risk lanes
3. **Integration:** ERP/WMS integration for automated compliance reporting
4. **Bee Labels:** Pharma-mode compliance (disable non-temp events, reduce self-heating)
5. **Risky Shipment Reports:** Proactive monitoring for high-value shipments

**Questions to Ask:**
- "Are you tracking all lanes, or just the high-risk ones?"
- "How are you preparing for your next regulatory audit?"
- "What's your current process for temperature excursion documentation?"
- "Are there any new facilities or lanes launching this quarter?"

---

## 📈 Success Metrics for This QBR

**Define Success Before Walking In:**
- [ ] Lane 7 battery risk mitigated with customer acknowledgment
- [ ] Sensor deployment completion timeline agreed
- [ ] One expansion opportunity identified and discussed
- [ ] Next QBR scheduled (never leave without the next meeting)
- [ ] Customer health score improved from Amber to Green

---

## 🔗 Related Resources

- **Pipe-Cleaning Phase:** `2026-05-14_qbr-metrics-customer-success-patterns.md`
- **Customer Success Playbooks:** `2026-05-14_customer-success-playbooks.md`
- **Bee Sensor Data Patterns:** `2026-05-14_bee-sensor-data-patterns.md`
- **Supply Chain Use Cases:** `2026-05-14_supply-chain-use-cases.md`

---

## 🎯 Next Steps for Jeff

**Today:**
1. Pull Lane 7 telemetry data — identify specific battery drain cause
2. Contact Acme Pharma to schedule overdue QBR (suggest next Tuesday/Wednesday)
3. Prepare battery optimization recommendation with before/after projections

**This Week:**
1. Complete sensor deployment in Lane 7
2. Generate QBR deck with compliance metrics highlighted
3. Practice the "pipe-cleaning" narrative for Lane 7

**Post-QBR:**
1. Document customer feedback in memory system
2. Schedule follow-up for sensor completion
3. Create expansion proposal for new lanes

---

*Learning captured by Gavin | Decklar Customer Intelligence System*  
*Trigger: Acme Pharma overdue QBR + Lane 7 battery risks*  
*Focus: Pharma-specific metrics, actionable frameworks, immediate playbooks*
