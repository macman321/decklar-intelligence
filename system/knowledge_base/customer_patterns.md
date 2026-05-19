# Decklar Customer Patterns — Knowledge Base

> Patterns learned from real customer accounts. What healthy vs. struggling accounts look like.

## Healthy Account Signals (Green)

### Deployment Phase
- ✅ Device inventory confirmed 2+ weeks before go-live
- ✅ All users provisioned and trained before first shipment
- ✅ Success criteria documented and agreed upon
- ✅ Primary contact is responsive (<24h reply time)
- ✅ Alert thresholds configured and tested before first shipment
- ✅ Geofence locations verified with on-site visit or satellite imagery

### Active Phase
- ✅ Device activation rate > 95% (most devices are activated and reporting)
- ✅ Average response time to alerts < 4 hours
- ✅ Monthly shipment volume stable or growing
- ✅ Customer uses platform for business decisions (not just compliance)
- ✅ Regular check-in calls scheduled (QBRs, monthly reviews)
- ✅ Zero critical open items overdue by > 1 week

### Expansion Phase
- ✅ Customer requests new features or additional lanes
- ✅ Success criteria demonstrably met with data
- ✅ Customer refers Decklar to colleagues or partners
- ✅ Renewal conversation starts 3+ months before contract expiry

## At-Risk Account Signals (Amber)

### Early Warning Signs
- ⚠️ Primary contact goes dark (> 3 days without response)
- ⚠️ Device activation rate < 80% (devices sitting unused)
- ⚠️ Go-live date slips more than once
- ⚠️ Open items accumulating without resolution
- ⚠️ Customer only uses platform for compliance (no business-value engagement)
- ⚠️ Alert response time > 48 hours consistently

### Deployment Risks
- ⚠️ BLE restriction discovered late in deployment
- ⚠️ Device expiry issue found < 1 week before go-live
- ⚠️ No success criteria defined — unclear what problem we're solving
- ⚠️ Multiple stakeholders with conflicting requirements
- ⚠️ Customer expects "set and forget" — no ongoing engagement plan

### Active Risks
- ⚠️ Shipment volume declining month-over-month
- ⚠️ Customer reports "too many false alerts" but won't tune thresholds
- ⚠️ Platform access issues — users can't log in or don't know how
- ⚠️ No QBR scheduled for 2+ quarters
- ⚠️ Contract renewal date approaching with no conversation started

## Critical Risk Signals (Red)

- 🔴 Customer explicitly mentions evaluating competitors
- 🔴 Critical open item overdue by > 2 weeks with no response
- 🔴 Go-live date pushed > 60 days from original target
- 🔴 Device activation rate < 50% after 30 days of availability
- 🔴 Customer escalated to Decklar leadership
- 🔴 Contract renewal window (< 3 months) with no engagement
- 🔴 Data quality issues — devices reporting but data is clearly wrong
- 🔴 Customer has "champion" who is leaving the company

## Industry-Specific Patterns

### Pharma / Regulated
- **Healthy:** Full audit trail maintained; alert thresholds tight and monitored; compliance documentation complete
- **At-Risk:** Validation documentation incomplete; temp excursions un-investigated; FDA readiness unclear
- **Watch-Out:** Pharma accounts need extra documentation for audits — always ask about validation requirements

### Logistics / 3PL
- **Healthy:** Public tracking links actively used; multi-party visibility working; detention/demurrage tracking enabled
- **At-Risk:** Only internal team uses portal; carriers still calling for status updates
- **Watch-Out:** 3PLs have thin margins — prove ROI fast or they churn

### Industrial / Manufacturing
- **Healthy:** Equipment visibility tied to production schedules; predictive maintenance using humidity data
- **At-Risk:** Data sits unused; no integration with ERP/MES systems
- **Watch-Out:** Long equipment dwell times (20+ weeks) — battery life is critical

### Retail / Consumer Goods
- **Healthy:** Seasonal surge readiness; omnichannel visibility (warehouse → store → customer)
- **At-Risk:** Peak season arrives with untested scaling
- **Watch-Out:** Black Friday / holiday season — test everything 2 months before

## Account Health Scoring Model

| Factor | Weight | Green | Amber | Red |
|--------|--------|-------|-------|-----|
| Last Contact | 20% | < 7 days | 7-14 days | > 14 days |
| Open Items Overdue | 20% | 0 | 1-2 | > 2 |
| Device Activation Rate | 15% | > 95% | 80-95% | < 80% |
| Alert Response Time | 15% | < 4h | 4-48h | > 48h |
| Platform Usage | 15% | Active daily | Weekly | < Weekly |
| Renewal Window | 15% | > 6 months | 3-6 months | < 3 months |

**Health Score Calculation:**
- Average weighted score across all factors
- > 80% = Green, 50-80% = Amber, < 50% = Red

## Proven Account Recovery Playbook (Amber → Green)

1. **Immediate:** Schedule call within 48 hours. Acknowledge the gap directly.
2. **Diagnose:** Ask what's blocking them. Often it's not technical — it's organizational.
3. **Quick Win:** Identify one thing that can be fixed in < 1 week and fix it.
4. **Re-Engagement:** Set up recurring touchpoint (weekly for 4 weeks, then monthly).
5. **Value Proof:** Show data that proves ROI. Pull a report they haven't seen.
6. **Success Criteria Re-Alignment:** Revisit original goals. Are they still relevant?
7. **Escalation Path:** If 2 weeks of effort yields no response, flag for Jeff's manager.
