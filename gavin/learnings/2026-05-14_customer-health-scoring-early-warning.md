# Customer Health Scoring & Early Warning Indicators

**Research Date:** May 14, 2026  
**Agent:** Gavin  
**Topic:** Proactive Customer Health Monitoring & At-Risk Account Detection

---

## Executive Summary

Customer health scoring at Decklar is built on a **RAG (Red/Amber/Green) system** that identifies at-risk accounts before they churn. The system tracks deployment velocity, open item resolution, and engagement patterns. This document outlines the framework, indicators, and proactive interventions.

---

## RAG Status Framework

### 🔴 Red Status — Critical Risk

**Triggers:**
- Not gone live and **>60 days since kickoff**
- **>3 critical open items** unresolved
- Primary contact has **gone dark** (>30 days no response)
- Go-live date pushed **>2 times**
- No device activation 30 days after label delivery

**What This Means:**
Account is at immediate risk of churning. The customer has either stalled out, lost internal champion support, or encountered a blocking issue that wasn't escalated properly.

**Intervention Protocol:**
1. Schedule executive-level call within 48 hours
2. Identify root cause: technical blocker, resource constraint, or priority shift
3. Offer white-glove onboarding support or temporary pause with restart plan
4. If no response after 2 attempts, flag for Account Manager review

---

### 🟡 Amber Status — Moderate Risk

**Triggers:**
- Not gone live, **30–60 days since kickoff**
- **1–2 high-priority open items** unresolved for >14 days
- First deployment attempted but **paused due to issue**
- Missing key data: origin facilities list, user access structure, or geofence config

**What This Means:**
Account is experiencing friction. These are solvable problems, but they compound if left unaddressed. The customer may be testing patience or exploring alternatives.

**Intervention Protocol:**
1. Weekly check-in calls until resolved
2. Prioritize open items by impact and assign owners
3. Provide templates, documentation, or training gaps identified
4. Update deployment plan with revised timeline

---

### 🟢 Green Status — Healthy

**Triggers:**
- **Live and operating** with active shipments
- Open items are routine (minor config adjustments, new user additions)
- Regular communication with primary contact
- Value proof documented (claims reduced, incidents detected)

**What This Means:**
Account is on track. Focus should shift to expansion, advocacy, and value realization.

**Action Items:**
1. Prepare QBR content and success stories
2. Identify expansion opportunities (more lanes, new use cases)
3. Request case study or testimonial
4. Schedule quarterly business reviews

---

## Early Warning Indicators (Pre-RAG Signals)

These signals appear **before** a customer hits Red status:

### 1. Deployment Velocity Decline

| Healthy Velocity | Warning Sign |
|-----------------|--------------|
| Kickoff → Go-live in 30-45 days | Kickoff → Go-live stretching toward 60+ days |
| Open items resolved within 1 week | Open items aging 2+ weeks |
| Weekly progress on config | No progress updates for 10+ days |

### 2. Engagement Pattern Shifts

| Healthy Engagement | Warning Sign |
|-------------------|--------------|
| Primary contact responds within 24-48 hours | Response time >5 days or no response |
| Multiple stakeholders joining calls | Only one person attending, or no-shows increasing |
| Proactive questions about features | Radio silence after onboarding |

### 3. Technical Blockers

Common technical indicators that predict Amber/Red status:

- **Connectivity mode mismatch:** BLE enabled but customer sites prohibit Bluetooth (learned from Schneider Electric kickoff)
- **Geofence misconfiguration:** Radius too small/large causing missed triggers
- **User access structure undefined:** No clear escalation contact or roles
- **Device expiry not checked:** Labels within 30 days of expiration
- **Origin facility list incomplete:** Can't activate because addresses TBD

### 4. Success Criteria Ambiguity

If `successCriteria` in memory.json is vague or missing, the account is at risk. Customers without clear success metrics often become "ghost" accounts—they never fully adopt because they never defined what adoption means.

---

## Health Scoring Formula (Proposed)

A quantitative approach to complement RAG status:

```
Health Score = (Deployment Progress × 0.4) + (Engagement Score × 0.3) + (Issue Velocity × 0.3)

Where:
- Deployment Progress: % of onboarding checklist complete (0-100)
- Engagement Score: 100 - (days since last contact × 2) [min 0]
- Issue Velocity: 100 - (days oldest open item has been open × 5) [min 0]

Grade:
- 80-100: Green
- 50-79: Amber
- <50: Red
```

---

## Proactive Monitoring Checklist

### Weekly (Gavin Auto-Scan)

- [ ] List all customers not yet live >30 days from kickoff
- [ ] Flag any open items >14 days old
- [ ] Check for "ghost" contacts (no response >30 days)
- [ ] Verify device expiry dates (warn if <60 days)
- [ ] Review last contact date for all accounts

### Monthly (Account Manager Review)

- [ ] Review all Amber/Red accounts for intervention
- [ ] Update deployment timelines for slipped dates
- [ ] Document value proof for Green accounts
- [ ] Identify expansion opportunities from call transcripts

---

## Case Study: Schneider Electric Pattern Recognition

**Initial State:** Green at kickoff, then shifted to Amber after 45 days

**Warning Signs Missed:**
1. Bluetooth restriction not asked during onboarding (now a learned question)
2. Go-live date initially TBD, then pushed once
3. Origin facility list partially complete for 3 weeks

**Intervention:**
- Added "Bluetooth restrictions" as mandatory onboarding question
- Created escalation protocol for partial facility lists
- Weekly cadence established with Nick Dorsey

**Current Status:** 🟡 Amber — go-live scheduled for June, open items tracked

---

## Learned Questions Added to Onboarding

Based on health scoring insights:

```json
{
  "id": "q_bluetooth_restrictions",
  "question": "Does the customer have Bluetooth restrictions at any of their facilities?",
  "why": "Schneider Electric kickoff revealed BLE is prohibited at customer sites. This was a near-miss.",
  "source": "Schneider Electric / kickoff_2026-05-05",
  "dateAdded": "2026-05-13",
  "status": "pending_jeff_review",
  "recommendedPortalPosition": "after connectivity question"
}
```

---

## Intervention Templates

### Amber Account Check-In Email

```
Subject: [Customer] — Quick Check-In + Timeline Update

Hi [Name],

Hope you're doing well! I noticed we have a couple of open items from our last call that I'd love to help move forward:

- [Open Item 1] — [Specific action needed]
- [Open Item 2] — [Specific action needed]

Are there any blockers I can help clear? Happy to jump on a quick 15-min call this week.

Best,
Jeff
```

### Red Account Escalation

```
Subject: [Customer] — Let's Get You Back on Track

Hi [Name],

I want to make sure we haven't hit a blocker that's preventing you from getting value from Decklar. We haven't had movement on the deployment in [X days/weeks], and I want to help.

Can we schedule 30 minutes this week? I'll bring [relevant resource] to clear any technical hurdles.

If priorities have shifted, that's okay too — just let me know how I can best support you.

Best,
Jeff
```

---

## Action Items for Jeff

1. **Review Amber accounts weekly** — Add to calendar as recurring 30-min block
2. **Add "health score" field** to customer memory.json for tracking
3. **Create "At-Risk Accounts" dashboard** in Mission Control portal
4. **Establish response time SLA** — 24 hours for Amber, 48 hours for Green
5. **Document expansion criteria** — When does a Green account become a growth opportunity?

---

## Key Takeaways

1. **RAG status is reactive** — Early warning indicators let you act before Red
2. **Open item velocity matters more than count** — One 30-day item is worse than five 2-day items
3. **Engagement decay precedes churn** — Watch for communication drop-offs
4. **Success criteria = retention insurance** — Every customer needs clear, documented success metrics
5. **Learn from every stall** — Each Amber/Red account teaches a pattern for prevention

---

*Learning documented by Gavin for Decklar Intelligence System*  
*Next review: Weekly health scans + monthly pattern analysis*