# GAVIN LEARNING SPIKE: Customer Risk Scoring & Early Warning System
**Date:** May 14, 2026  
**Agent:** Gavin  
**Topic:** Proactive Customer Health Monitoring & Churn Prevention Framework

---

## Executive Summary

This learning document establishes a **predictive risk scoring model** for Decklar customers, enabling proactive intervention before accounts churn. While the standard RAG (Red/Amber/Green) health status provides a snapshot, this framework adds **leading indicators** that predict problems 30-60 days before they materialize.

---

## 1. The Decklar Customer Risk Model

### Risk Score Formula
```
Risk Score = (Engagement Risk × 0.35) + (Technical Risk × 0.30) + (Business Risk × 0.25) + (Sentiment Risk × 0.10)
```

**Score Interpretation:**
| Score | Risk Level | Action Required |
|-------|------------|-----------------|
| 0-25 | 🟢 Low | Monitor; standard check-ins |
| 26-50 | 🟡 Medium | Increased touchpoints; address friction |
| 51-75 | 🟠 High | Executive engagement; recovery plan |
| 76-100 | 🔴 Critical | Immediate intervention; save-the-customer mode |

---

## 2. Engagement Risk Indicators (35% Weight)

### 2.1 Platform Usage Metrics

**Dashboard Access Patterns:**
| Indicator | Warning Threshold | Critical Threshold |
|-----------|-------------------|-------------------|
| No user logins | 14 days | 30 days |
| Declining login frequency | 50% drop MoM | 75% drop MoM |
| App adoption (mobile) | < 20% of users | < 10% of users |
| Alert acknowledgment rate | < 60% | < 40% |

**Honeycomb Portal Metrics:**
```
Engagement Score = (Daily Active Users / Total Licensed Users) × 100

Risk Flags:
- < 30% active users = MEDIUM risk
- < 15% active users = HIGH risk
- < 5% active users = CRITICAL risk
```

### 2.2 Support Interaction Patterns

| Pattern | Risk Indication | Score Impact |
|---------|-----------------|--------------|
| Repeated tickets (same issue >3x) | Configuration/training gap | +15 points |
| No tickets for 90+ days | "Silent dissatisfaction" or disengagement | +10 points |
| Escalated tickets >25% of total | Service quality concern | +20 points |
| Support ticket volume spike (>200% MoM) | Operational crisis | +25 points |

### 2.3 Training & Enablement Gaps

**Red Flags:**
- [ ] Users never completed onboarding training
- [ ] No power users identified or certified
- [ ] New user onboarding not requested (growth without enablement)
- [ ] Training attendance < 50% for scheduled sessions

---

## 3. Technical Risk Indicators (30% Weight)

### 3.1 Data Quality Issues

**Shipment Data Completeness:**
```
Data Quality Score = (Actual Pings / Expected Pings) × 100

Expected Pings = (Shipment Duration Hours) / (Configured Ping Interval)
```

| Quality Score | Risk Level | Intervention |
|---------------|------------|--------------|
| > 95% | 🟢 Low | None |
| 85-95% | 🟡 Medium | Configuration review |
| 70-85% | 🟠 High | Technical audit required |
| < 70% | 🔴 Critical | Device/hardware review |

**Common Data Quality Failure Patterns:**

| Pattern | Root Cause | Customer Impact |
|---------|------------|-----------------|
| Consistent 15-20% gaps | Cellular dead zones on route | Blind spots in tracking |
| Sudden drop from >95% to <70% | Device batch issue | Loss of confidence |
| Intermittent gaps (random) | Bee placement/conservation mode | Perceived unreliability |
| Zero data after activation | Activation failure | Complete visibility loss |

### 3.2 Alert Fatigue Indicators

**Alert Configuration Analysis:**
| Metric | Healthy | At Risk |
|--------|---------|---------|
| Alerts per shipment | 0.5-2 | > 5 |
| False positive rate | < 20% | > 50% |
| Alert acknowledgment time | < 4 hours | > 24 hours |
| Custom alert rules created | > 3 per customer | 0 |

**Alert Fatigue Warning Signs:**
- Customer requests "alert pause" or blanket disable
- Repeated "ignore" patterns on specific alert types
- Comments in tickets: "too many alerts," "alert noise"
- Alert thresholds repeatedly widened (desensitization)

### 3.3 Integration Failures

**API/Webhook Health:**
| Status | Risk Score Addition |
|--------|---------------------|
| No API integration attempted | 0 (assess need) |
| Integration attempted but incomplete | +15 |
| Integration failing > 10% of time | +25 |
| Integration abandoned/migrated away | +30 |

### 3.4 Device Performance Issues

**Battery Failure Patterns:**
| Pattern | Risk Indication | Score Impact |
|---------|-----------------|--------------|
| > 20% of Bees dying before estimated life | Configuration error or defective batch | +15 |
| Battery drain accelerating (>25% faster than projected) | Environment or settings issue | +10 |
| Customer complaints about battery life | Expectation mismatch | +10 |

---

## 4. Business Risk Indicators (25% Weight)

### 4.1 Go-Live & Deployment Velocity

**Deployment Timeline Risk Model:**
```
Kickoff to Go-Live Target: Typically 6-8 weeks

Risk Multipliers:
- > 10 weeks: +15 points (project fatigue)
- > 12 weeks: +25 points (likely to abandon)
- > 16 weeks: +40 points (critical risk)
- No go-live date set after 4 weeks: +20 points
```

**Pipe-Clean Phase Indicators:**
| Indicator | Risk Addition |
|-----------|---------------|
| Pipe-clean shipments < 3 | +10 (insufficient validation) |
| Pipe-clean issues unresolved > 2 weeks | +15 (blocking deployment) |
| Customer declined pipe-clean | +20 (skipped validation) |

### 4.2 Commercial Health

**Contract & Renewal Signals:**
| Signal | Risk Score |
|--------|------------|
| Month-to-month after initial term | +10 |
| Downgrade request (volume reduction) | +20 |
| Pricing pressure / competitor quotes mentioned | +25 |
| Late payments / procurement delays | +15 |
| Renewal conversation avoided | +20 |

### 4.3 Organizational Changes

**High-Risk Events:**
| Event | Risk Score | Rationale |
|-------|------------|-----------|
| Champion/primary contact departs | +30 | Relationship reset required |
| Acquisition/merger announced | +25 | Redundancy evaluation likely |
| Budget freeze / hiring freeze | +20 | Discretionary spend cut |
| New CIO/VP Supply Chain | +15 | Vendor re-evaluation typical |
| Reorganization (supply chain team) | +10 | Priorities shift |

**Mitigation Playbook by Event:**
- **Champion Departure:** Immediate exec-to-exec outreach; identify new champion
- **Acquisition:** Position Decklar as combined entity solution; expansion opportunity
- **Budget Freeze:** ROI case study; payment terms flexibility; prove value
- **New Leadership:** Executive briefing; peer reference calls; benchmark data

### 4.4 Shipment Volume Trends

**Volume Risk Analysis:**
```
Volume Risk = (Current Month Volume / 3-Month Average) × Risk Multiplier

Interpretation:
- > 90%: No risk
- 70-90%: MEDIUM (+15) — investigate cause
- 50-70%: HIGH (+25) — possible competitive displacement
- < 50%: CRITICAL (+40) — likely churn imminent
```

---

## 5. Sentiment Risk Indicators (10% Weight)

### 5.1 Call & Communication Analysis

**Transcript Sentiment Markers:**
| Phrase/Pattern | Sentiment Score |
|----------------|-----------------|
| "Looking at alternatives," "evaluating options" | -10 |
| "Not meeting expectations," "disappointed" | -8 |
| "Too expensive," "can't justify cost" | -7 |
| "Problems with [specific feature]" | -5 |
| "Need to prove ROI" | -5 |
| "Competitor [X] offers..." | -8 |
| "Our contract is up soon" | -6 |
| "Executive leadership asking questions" | -7 |

**Positive Markers (reduce risk):**
| Phrase/Pattern | Sentiment Score |
|----------------|-----------------|
| "Expansion," "additional lanes" | +5 |
| "Love the visibility," "game changer" | +5 |
| "Recommended to colleague" | +8 |
| "Renewal conversation positive" | +5 |

### 5.2 Net Promoter Score (NPS) Proxy

**NPS Calculation from Interactions:**
```
If formal NPS unavailable:

Promoters (9-10): Identify "Would recommend," "Excellent," "Love it"
Passives (7-8): Neutral language, specific requests but positive
Detractors (0-6): "Problems," "Issues," "Regret," "Cancel"

NPS = % Promoters - % Detractors

Risk Mapping:
- NPS > 50: LOW sentiment risk
- NPS 30-50: MEDIUM sentiment risk
- NPS 0-30: HIGH sentiment risk
- NPS < 0: CRITICAL sentiment risk
```

### 5.3 Competitive Mention Tracking

| Competitor Mentioned | Risk Addition | Notes |
|---------------------|---------------|-------|
| Any competitor named | +5 | Evaluation in progress |
| Specific competitor features praised | +10 | Feature gap concern |
| "Moving to [competitor]" | +30 | Churn in progress |
| ROI comparison requested | +8 | Price pressure |

---

## 6. Risk Scoring by Customer Segment

### 6.1 Pharma/Cold Chain (High-Value, High-Retention)

**Unique Risk Factors:**
- Regulatory compliance issues: +30 points
- Temperature excursion not detected: +25 points
- Audit documentation gaps: +20 points
- Competitor with FDA pedigree: +15 points

**Mitigation Priority:** Technical excellence over price

### 6.2 Electronics/High-Value Manufacturing

**Unique Risk Factors:**
- Damage claims increasing: +25 points
- JIT schedule impacts from delays: +20 points
- Integration with ERP/WMS failing: +20 points
- International shipping complexity: +15 points

**Mitigation Priority:** Reliability and integration depth

### 6.3 Food & Beverage/Perishables

**Unique Risk Factors:**
- Spoilage incidents: +30 points
- Retail compliance score drops: +25 points
- Seasonal volume volatility: +15 points
- Margin pressure (commodity): +20 points

**Mitigation Priority:** Cost efficiency and compliance documentation

### 6.4 Reverse Logistics (Reusable Bee Model)

**Unique Risk Factors:**
- Bee recovery rate < 90%: +25 points
- Asset tracking failures: +20 points
- Process friction (activation/return): +20 points
- Volume doesn't justify subscription: +25 points

**Mitigation Priority:** Operational efficiency and ROI proof

---

## 7. Early Warning Dashboard Design

### 7.1 Weekly Risk Report Structure

**Top Section: Critical Risk Customers (Score 75+)**
```
┌─────────────────────────────────────────────────────────┐
│ 🔴 CRITICAL RISK — Immediate Action Required           │
├─────────────────────────────────────────────────────────┤
│ Customer: [Name] | Score: 87 | Trend: ↑ 12 pts this week │
│ Primary Driver: Technical (data gaps 45%)               │
│ Last Contact: 8 days ago | Next Action: Exec call      │
│ Churn Probability: 70% | Days to Intervention: 2        │
└─────────────────────────────────────────────────────────┘
```

**Middle Section: High Risk (Score 51-75)**
```
┌─────────────────────────────────────────────────────────┐
│ 🟠 HIGH RISK — Escalation Recommended                  │
├─────────────────────────────────────────────────────────┤
│ 5 accounts | Average score: 62 | Trend: ↑ 3 pts        │
│ Common drivers: Engagement (3), Technical (2)        │
└─────────────────────────────────────────────────────────┘
```

**Bottom Section: Watch List (Score 26-50)**
```
┌─────────────────────────────────────────────────────────┐
│ 🟡 MEDIUM RISK — Proactive Outreach Recommended        │
├─────────────────────────────────────────────────────────┤
│ 12 accounts | Focus: Usage training, config tuning     │
│ Open items: 8 unresolved > 14 days                     │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Automated Alert Triggers

**Daily Alerts (Slack/Email to Jeff):**
- Any customer crosses 75+ threshold
- 3+ consecutive data quality failures
- Champion contact change detected (LinkedIn/CRM)
- No platform usage 7+ days for active accounts

**Weekly Digest (Every Monday):**
- Risk score changes by customer
- New alerts added to watch list
- At-risk account summary
- Recommended actions prioritized

---

## 8. Intervention Playbook by Risk Level

### 8.1 LOW Risk (0-25): Maintain & Optimize

**Actions:**
- Standard check-in cadence (monthly)
- Expansion opportunity identification
- Reference request for new prospects
- Best practice sharing

### 8.2 MEDIUM Risk (26-50): Increase Touch

**Actions:**
- Bi-weekly check-ins
- Usage training offer
- Configuration review
- Open item acceleration
- Executive sponsor introduction

### 8.3 HIGH Risk (51-75): Executive Engagement

**Actions:**
- Weekly executive calls
- Technical resource allocation
- Success plan development
- Escalation to Decklar leadership
- ROI case study preparation
- Reference calls with satisfied peers

### 8.4 CRITICAL Risk (76-100): Save-the-Customer

**Actions:**
- Daily executive touchpoints
- Decklar exec + Jeff joint engagement
- Emergency technical review
- Commercial flexibility (terms, pricing)
- Executive sponsor from Decklar C-suite
- "What would it take to keep you?" conversation
- Competitor displacement strategy

---

## 9. Risk Scoring Implementation

### 9.1 Data Sources Required

| Metric | Source | Collection Frequency |
|--------|--------|---------------------|
| Login activity | Honeycomb analytics | Daily |
| Support tickets | Zendesk/Salesforce | Real-time |
| Data completeness | Bee telemetry | Daily |
| Alert patterns | Honeycomb events | Daily |
| Shipment volume | Honeycomb shipments | Weekly |
| Contract data | Salesforce | Weekly |
| Sentiment | Call transcripts | Per-call |

### 9.2 Scoring Automation

**Phase 1: Manual Scoring (Weeks 1-4)**
- Jeff manually scores top 10 accounts weekly
- Validates scoring accuracy
- Refines thresholds

**Phase 2: Semi-Automated (Weeks 5-8)**
- Data pulls from sources into spreadsheet
- Jeff reviews and adjusts
- Builds intervention playbook

**Phase 3: Automated Dashboard (Month 3+)**
- Real-time risk scores in Honeycomb/custom dashboard
- Automated alerts
- Trend analysis and forecasting

### 9.3 Success Metrics

**Effectiveness Indicators:**
| Metric | Target |
|--------|--------|
| Churn rate | < 5% annually |
| Risk score accuracy | 80% of HIGH risk flagged 30+ days before churn |
| Intervention success | 60% of HIGH risk retained |
| Time to resolution | < 14 days for open items |
| Customer satisfaction | NPS > 50 |

---

## 10. Integration with Existing Processes

### 10.1 QBR Enhancement

**Add to QBR Template:**
- Risk score trend (last 3 months)
- Top 3 risk factors identified
- Mitigation actions completed
- Proactive recommendations

### 10.2 Call Summary Integration

**Update transcript processing to capture:**
- Sentiment markers (positive/negative phrases)
- Competitive mentions
- Organizational change indicators
- ROI/value discussions

### 10.3 Customer Memory Schema Update

**Add to customer memory JSON:**
```json
{
  "riskProfile": {
    "currentScore": 42,
    "scoreTrend": "increasing",
    "primaryRiskFactors": ["engagement", "technical"],
    "lastRiskAssessment": "2026-05-14",
    "interventionStatus": "monitoring",
    "churnProbability": 25
  }
}
```

---

## 11. Key Learnings Summary

### Immediate Actions for Jeff

1. **Score Top 10 Accounts This Week**
   - Use the risk formula above
   - Identify 3-5 at-risk accounts
   - Schedule intervention calls

2. **Set Up Data Monitoring**
   - Request Honeycomb usage reports weekly
   - Track support ticket patterns
   - Monitor shipment volume trends

3. **Build Intervention Templates**
   - Email templates for each risk level
   - Call scripts for escalation
   - ROI proof points by industry

4. **Integrate with Weekly Rhythm**
   - Monday: Review risk dashboard
   - Tuesday-Thursday: Execute interventions
   - Friday: Log outcomes, adjust scores

### Long-Term Capabilities

- Predict churn 60+ days in advance
- Automate risk scoring via Honeycomb API
- Build intervention playbooks by industry
- Reduce churn rate to < 5%

---

## Sources & References

- Decklar Customer Health Scoring Framework (existing)
- QBR Metrics and Customer Success Playbooks
- Honeycomb Platform Analytics Capabilities
- Industry Customer Success Benchmarks (Gainsight, ChurnZero)
- Churn prediction research (SaaS customer success literature)

---

**Container Tag:** gavin  
**Next Recommended Learning:** Decklar Honeycomb API Integration for Automated Risk Scoring  
**Status:** Ready for implementation
