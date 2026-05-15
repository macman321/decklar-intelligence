# Customer Churn Prevention and At-Risk Account Recovery Strategies
## Decklar (formerly Roambee) — Account Management Playbook

**Document Date:** May 15, 2026  
**Owner:** Jeffrey Calabro, Account Manager  
**Purpose:** Comprehensive guide to identifying, preventing, and recovering at-risk Decklar accounts

---

## Table of Contents

1. [Early Warning Indicators](#1-early-warning-indicators)
2. [Churn Risk Factors Specific to IoT/Supply Chain Visibility](#2-churn-risk-factors-specific-to-iot-supply-chain-visibility)
3. [At-Risk Account Recovery Playbook](#3-at-risk-account-recovery-playbook)
4. [Proactive Retention Strategies](#4-proactive-retention-strention-strategies)
5. [Decklar-Specific Retention Tactics](#5-decklar-specific-retention-tactics)
6. [Success Metrics](#6-success-metrics)
7. [Templates & Scripts](#7-templates--scripts)

---

## 1. Early Warning Indicators

### 🚨 Critical Red Flags (Immediate Action Required)

| Indicator | Detection Method | Risk Level | Response Time |
|-----------|------------------|------------|---------------|
| **No login activity >30 days** | Honeycomb admin dashboard | 🔴 High | 48 hours |
| **Zero shipments tracked in 60+ days** | Platform usage reports | 🔴 High | 24 hours |
| **Support ticket volume spike** | Zendesk/Help Scout integration | 🟡 Medium | 72 hours |
| **Executive sponsor departure** | LinkedIn monitoring, news alerts | 🔴 High | Immediate |
| **Missed renewal conversation** | Salesforce opportunity tracking | 🔴 High | Immediate |
| **Contract expiration <90 days, no renewal activity** | CRM contract dates | 🔴 High | Immediate |
| **Competitor mention in calls** | Call transcript analysis | 🟡 Medium | 1 week |
| **Payment delays or disputes** | Finance/AR notifications | 🔴 High | Immediate |

### 📊 Usage Pattern Warnings

**Declining Engagement Metrics:**
- Dashboard logins decreasing month-over-month (3+ months)
- Alert acknowledgment rate dropping below 70%
- Mobile app usage down 50%+ from baseline
- API calls decreasing (for integrated customers)

**Feature Adoption Gaps:**
- Customer using <30% of purchased features after 90 days
- No custom geofences configured
- Default alert settings never adjusted
- Public tracking links never generated
- e-Proof of delivery not activated despite need

### 🎯 Communication Signals

| Signal | What It Means | Action |
|--------|---------------|--------|
| Delayed responses to emails (5+ days) | Busy or checking out | Escalate communication channel |
| One-word responses | Low engagement | Schedule live call |
| "We'll get back to you" (no follow-up) | Low priority/internal blockers | Executive outreach |
| Cancelled meetings without reschedule | Avoidance | Address directly |
| Ghosting after price increase mention | Price sensitivity | Value reinforcement needed |

### 🔍 Data Quality Red Flags

- **Alert fatigue:** Customer disabling notifications due to noise
- **Data gaps:** Frequent "No GPS signal" or connectivity issues
- **Accuracy complaints:** Location data questioned repeatedly
- **Integration failures:** API errors, webhook failures, data not flowing to TMS/WMS

---

## 2. Churn Risk Factors Specific to IoT/Supply Chain Visibility

### Industry-Specific Churn Drivers

#### 🌡️ Cold Chain / Temperature-Sensitive Logistics

| Risk Factor | Why Customers Churn | Prevention |
|-------------|---------------------|------------|
| Temperature alerts not actionable | Too many false positives | Calibrate thresholds to cargo type |
| No SOP for alert response | Alerts ignored, value not realized | Build response playbook with customer |
| Compliance reporting gaps | Audit failures | Pre-configure automated reports |
| Sensor drift over time | Data questioned | Proactive recalibration schedule |

#### 🚛 Trucking / Asset Tracking

| Risk Factor | Why Customers Churn | Prevention |
|-------------|---------------------|------------|
| Driver privacy concerns | Pushback from drivers | Anonymous/aggregated dashboard views |
| Battery life shorter than expected | Devices die mid-route | Proper duty cycle configuration |
| Poor rural coverage | Gaps in tracking | Hybrid Wi-Fi/BLE strategy |
| Integration with dispatch software fails | Double data entry | Dedicated integration support |

#### 📦 High-Value / Pharma Shipments

| Risk Factor | Why Customers Churn | Prevention |
|-------------|---------------------|------------|
| Validation documentation incomplete | Regulatory rejection | Provide IQ/OQ/PQ packages upfront |
| Audit trail gaps | Compliance failures | Immutable data storage + automated logs |
| Lack of 21 CFR Part 11 support | Cannot use for regulated products | Pre-validate for pharma use case |

#### ✈️ Air Freight / International

| Risk Factor | Why Customers Churn | Prevention |
|-------------|---------------------|------------|
| Customs clearance issues with devices | Shipments delayed | Proper HS codes, certifications |
| Airline restrictions on lithium batteries | Devices rejected | Non-lithium options, airline pre-approval |
| Multi-modal handoff gaps | Tracking lost at transfer | Geofence + BLE handoff protocols |

### Technical Complexity Churn Factors

**1. Integration Failures**
- EDI/API connection never completed
- Data mapping errors
- Webhook reliability issues
- TMS/WMS compatibility problems

**2. Configuration Complexity**
- Too many settings to manage
- Unclear what each setting does
- No clear "recommended" configuration
- Changes require Decklar support

**3. User Experience Friction**
- Slow dashboard load times
- Mobile app crashes
- Alert delivery delays (SMS/email)
- Confusing UI for non-technical users

### ROI Clarity Churn Factors

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Unclear value demonstration** | "We're not sure if this is working" | Monthly value reports with metrics |
| **No incident ROI captured** | No documented recoveries | Incident tracking + claim reduction calc |
| **Cost vs. benefit unclear** | Price objections at renewal | TCO analysis vs. alternatives |
| **Competitor comparison** | "X company is cheaper" | Differentiation on capabilities, not price |

---

## 3. At-Risk Account Recovery Playbook

### Risk Tier Classification System

#### 🟢 Low Risk (Green)
**Criteria:**
- Active usage, no complaints
- Engaged primary contact
- On track with deployment plan
- Recent positive interaction

**Actions:**
- Standard quarterly check-in
- Proactive tips and best practices sharing
- Expansion opportunity identification

---

#### 🟡 Medium Risk (Amber)
**Criteria:**
- Deployment delayed >30 days past target
- 1-2 unresolved support tickets >14 days
- Usage down 25-50% from baseline
- Single point of contact (no backup)
- Missed last check-in

**Actions:**
1. **Week 1:** Email + call to schedule health check
2. **Week 2:** Technical deep-dive session
3. **Week 3:** Executive summary + ROI review
4. **Week 4:** Escalation to leadership if no response

**Template:** See "Amber Risk Outreach Email" in Section 7

---

#### 🔴 High Risk (Red)
**Criteria:**
- No shipments tracked in 30+ days
- Critical open item >60 days
- Executive sponsor left/no replacement
- Contract expiration <90 days with no renewal activity
- Formal cancellation request received

**Actions:**
1. **Day 1:** Immediate call to decision-maker
2. **Day 2:** Executive sponsor email (if known)
3. **Day 3:** Value recovery presentation scheduled
4. **Day 7:** Senior leadership involvement if needed
5. **Day 14:** "Save the account" escalation with incentives

**Template:** See "Red Risk Emergency Outreach" in Section 7

---

### Intervention Tactics by Tier

#### Technical Health Check (All Tiers)

**Purpose:** Identify and resolve technical blockers

**Checklist:**
- [ ] Review device deployment status
- [ ] Check alert configuration accuracy
- [ ] Validate geofence precision
- [ ] Test notification delivery (SMS/email)
- [ ] Review API/integration health
- [ ] Confirm data accuracy vs. customer expectations
- [ ] Identify any unreported issues

**Questions to Ask:**
1. "Are you receiving alerts when you expect to?"
2. "Is the location data accurate for your routes?"
3. "Are there any shipments where tracking didn't work as expected?"
4. "Is the dashboard giving you the visibility you need?"
5. "Are your integrations working smoothly?"

---

#### Executive Business Review (Amber/Red Tier)

**Purpose:** Realign on business value and success criteria

**Agenda Template:**
```
1. Business Context (5 min)
   - Their current supply chain priorities
   - What's changed since implementation

2. Usage Review (10 min)
   - Shipments tracked since go-live
   - Incidents detected and resolved
   - Cost savings/claim reductions documented

3. Technical Health (10 min)
   - Configuration optimization opportunities
   - Feature adoption gaps
   - Integration performance

4. Value Realization (10 min)
   - Success criteria checkpoint
   - ROI calculation review
   - Notable wins and recoveries

5. Roadmap & Expansion (10 min)
   - Upcoming Decklar features relevant to them
   - Additional use cases identified
   - Expansion opportunities (lanes, features, users)

6. Open Items & Next Steps (5 min)
   - Outstanding action items
   - Owner assignments
   - Timeline commitments
```

---

#### Training & Enablement Session (Amber Tier)

**Purpose:** Drive feature adoption and user confidence

**Session Types:**
1. **New User Onboarding** — For teams that have grown/changed
2. **Advanced Features Workshop** — Deep dive into underutilized capabilities
3. **Admin Training** — For new administrators
4. **Integration Training** — For IT teams managing connections

**Preparation Checklist:**
- [ ] Review customer's current usage patterns
- [ ] Identify 3-5 underutilized features with high value
- [ ] Prepare customer-specific examples from their data
- [ ] Send agenda and logins in advance
- [ ] Record session for future reference

---

#### ROI Recalculation (Red Tier)

**Purpose:** Demonstrate concrete value to justify continued investment

**ROI Framework:**

| Cost Category | Decklar Impact | Calculation Method |
|---------------|----------------|-------------------|
| **Cargo claims** | Reduce claim rate | (Claims before - Claims after) × Avg claim value |
| **Spoilage/shrinkage** | Early intervention | Value of saved shipments ÷ monitoring cost |
| **Customer service** | Proactive status updates | Reduced WISMO calls × cost per inquiry |
| **Expedited shipping** | Delay prevention | Avoided expedites × premium cost |
| **Insurance premiums** | Risk reduction | Premium reduction % × annual premium |
| **Labor efficiency** | Automated tracking | Hours saved × loaded labor rate |

**Document Template:** See "ROI Recalculation Report" in Section 7

---

### Timeline and Cadence for Outreach

#### Standard Account Touch Schedule

| Account Health | Check-in Frequency | Review Type | Owner |
|----------------|-------------------|-------------|-------|
| 🟢 Green | Quarterly | Email + brief call | AM |
| 🟡 Amber | Monthly | Full health check | AM + CS |
| 🔴 Red | Weekly | Executive intervention | AM + Leadership |
| 🔴 Critical | Every 2-3 days | "Save" task force | AM + CS + Exec |

#### Renewal Timeline (for contracts <12 months out)

| Time to Renewal | Action | Deliverable |
|-----------------|--------|-------------|
| 9 months | Expansion discovery | Expansion opportunity assessment |
| 6 months | Value review | ROI report + case studies |
| 3 months | Renewal conversation | Proposal with pricing |
| 1 month | Contract execution | Signed renewal |
| 30 days post | Success checkpoint | First QBR post-renewal |

---

### Stakeholder Mapping and Re-engagement

#### Identify Decision Makers

**Economic Buyer:**
- Has budget authority
- Can approve/renew contract
- Typically VP/Director of Supply Chain or Operations

**Technical Champion:**
- Day-to-day platform user
- Influences renewal decision
- Often Logistics Manager or Operations Supervisor

**Executive Sponsor:**
- Strategic alignment
- Can escalate internally
- C-level or SVP visibility

**End Users:**
- Warehouse staff, drivers, customer service
- Don't decide but influence satisfaction

#### Re-engagement Strategies by Stakeholder

| Stakeholder | Re-engagement Approach | Success Signal |
|-------------|----------------------|----------------|
| **Economic Buyer** | ROI-focused business review | Renewal commitment |
| **Technical Champion** | Hands-on optimization session | Increased platform usage |
| **Executive Sponsor** | Strategic value presentation | Meeting acceptance + follow-up |
| **End Users** | Training + quick wins | Feature adoption increase |

---

## 4. Proactive Retention Strategies

### Onboarding Excellence — The Foundation of Retention

#### First 90 Days Success Framework

**Days 1-30: Activation**
- [ ] Welcome call within 48 hours of contract
- [ ] Technical setup call scheduled
- [ ] First shipment tracked successfully
- [ ] Primary users trained and comfortable
- [ ] Integration testing completed (if applicable)

**Days 31-60: Adoption**
- [ ] 80%+ of planned lanes active
- [ ] Alert tuning completed (noise reduced)
- [ ] First significant value moment (incident caught, etc.)
- [ ] Executive stakeholder introduced
- [ ] Success criteria reviewed and confirmed

**Days 61-90: Optimization**
- [ ] Advanced features explored
- [ ] First QBR conducted
- [ ] Expansion use cases identified
- [ ] Champion development (internal advocate)
- [ ] Renewal conversation initiated (for annual contracts)

#### Time-to-Value (TTV) Acceleration Tactics

| Timeframe | Action | Goal |
|-----------|--------|------|
| Week 1 | Pre-configure dashboard with customer branding | Immediate "this is ours" feeling |
| Week 2 | Load historical shipment data if available | Show immediate pattern recognition |
| Week 3 | Set up first "wow" alert (high-value shipment) | Demonstrate proactive value |
| Week 4 | Share first usage report with metrics | Validate investment |

---

### Regular Check-in Cadence

#### Monthly Pulse Check Template

**Subject:** [Customer Name] — Quick Check-In

**Body:**
```
Hi [Name],

Hope you're doing well! I wanted to check in briefly on your Decklar experience:

Quick 3 questions:
1. Any shipments in the last 30 days where tracking didn't work as expected?
2. Are your teams finding the dashboard useful for daily operations?
3. Anything you wish the platform did that it doesn't currently?

Also sharing a quick usage summary:
- Shipments tracked: [X]
- Alerts generated: [Y]
- Most active lane: [Lane name]

Any issues or questions, just reply — I'm here to help.

Best,
Jeff
```

#### Quarterly Business Review (QBR) Framework

See full QBR template in Section 7.

**Key Elements:**
1. **Executive Summary** — One paragraph on account health
2. **Usage Trends** — Visual charts of shipments, alerts, incidents
3. **Value Delivered** — Quantified wins and recoveries
4. **Technical Health** — Configuration score, open items
5. **Success Criteria Check** — Are we meeting agreed goals?
6. **Roadmap Preview** — Upcoming features
7. **Expansion Opportunities** — New use cases
8. **Next 90 Days** — Specific commitments

---

### Expansion and Upsell Paths That Increase Stickiness

#### Expansion Vectors

| Current State | Expansion Opportunity | Stickiness Benefit |
|---------------|----------------------|-------------------|
| Single lane | Additional lanes/locations | More shipments = higher switching cost |
| Basic tracking | + Temperature monitoring | Critical for cold chain compliance |
| Standalone | TMS/ERP integration | Embedded in core workflows |
| One division | Enterprise rollout | More users, more stakeholders |
| Reactive alerts | Predictive analytics | Strategic, not just tactical value |
| Tracking only | + e-Proof of Delivery | End-to-end visibility |

#### Expansion Discovery Questions

1. "Are there other facilities or lanes that could benefit from visibility?"
2. "How are you handling temperature compliance today? Could that be automated?"
3. "Are you tracking any assets or containers that move between shipments?"
4. "What happens when a customer asks 'where's my shipment?' — how do you respond?"
5. "Are there other departments (customer service, sales) who could use visibility data?"

---

### Champion Development

#### Internal Advocate Strategy

**Why Champions Matter:**
- Provide early warning of issues
- Defend platform internally
- Drive adoption within their teams
- Provide references and case studies

**Champion Development Program:**

1. **Identify** — Who is your most engaged day-to-day user?
2. **Elevate** — Give them early access to features
3. **Empower** — Make them the "Decklar expert" internally
4. **Recognize** — Public acknowledgment (with permission)
5. **Connect** — Introduce to other champions for peer learning

**Champion Engagement Tactics:**
- Quarterly "Decklar Champion" webinars
- Beta feature access
- Annual champion summit (virtual or in-person)
- LinkedIn recommendations/endorsements
- Case study co-authorship

---

### Executive Relationship Building

#### Executive Engagement Calendar

| Month | Activity | Purpose |
|-------|----------|---------|
| 1 | Welcome call with VP/Director | Set relationship foundation |
| 3 | Executive QBR | Strategic value alignment |
| 6 | Industry insight sharing | Position as thought partner |
| 9 | Expansion conversation | Growth planning |
| 12 | Annual review + renewal | Contract commitment |

#### Executive Communication Templates

See "Executive Value Summary" template in Section 7.

---

## 5. Decklar-Specific Retention Tactics

### Bee Label Device Configuration Optimization

#### Configuration Best Practices by Use Case

**Standard Truck Shipments:**
```
Ping Frequency: Every 15 minutes in transit
Alert Thresholds: Geofence entry/exit
Battery Mode: Standard duty cycle
Sensors: GPS + Temperature (if applicable)
```

**High-Value/Pharma Shipments:**
```
Ping Frequency: Every 5 minutes
Alert Thresholds: Temperature excursion ±2°C
Battery Mode: High frequency
Sensors: GPS + Temperature + Humidity + Light
Pharma Mode: Enabled (compliance logging)
```

**Air Freight/Multi-Modal:**
```
Ping Frequency: Every 30 minutes (battery conservation)
Alert Thresholds: Handoff geofences
Battery Mode: Extended life
Sensors: GPS + Temperature
Air Mode: Enabled (pressure compensation)
```

#### Configuration Audit Checklist

Review with customer every 90 days:
- [ ] Ping frequency appropriate for shipment duration
- [ ] Geofence radius optimized for location type
- [ ] Alert recipients current and accurate
- [ ] Temperature thresholds match cargo requirements
- [ ] Notification channels (SMS/email) tested
- [ ] Device expiry dates checked (Bee Labels have 9-month shelf life)
- [ ] Firmware up to date

---

### Alert Tuning to Reduce Noise

#### Alert Fatigue Prevention

**The Problem:**
- Customer receives 50+ alerts per day
- 80%+ are non-actionable
- Users disable notifications
- Platform perceived as "noisy" and unreliable

**The Solution:**

| Alert Type | Default Setting | Optimization Strategy |
|------------|-----------------|----------------------|
| Geofence entry | Instant | Add 5-min delay to prevent false triggers from parking |
| Geofence exit | Instant | Confirm movement detected before alerting |
| Temperature | Every 1°C change | Set excursion thresholds, not every fluctuation |
| Low battery | 20% remaining | Adjust to 15% for longer trips |
| No GPS signal | Immediate | Add 30-min grace period (could be tunnel) |

#### Alert Quality Score

Track with customer:
- **Actionable Rate:** % of alerts that result in action taken
- **Target:** 70%+ actionable
- **Review Frequency:** Monthly for first 90 days, then quarterly

---

### Dashboard Customization for Different Personas

#### Persona-Based Views

**Operations Manager:**
- Real-time shipment map
- Active alerts requiring attention
- Lane performance metrics
- SLA compliance dashboard

**Customer Service Rep:**
- Shipment search/quick lookup
- Public tracking link generator
- Customer inquiry response templates
- Delivery confirmation view

**Executive:**
- Weekly/monthly trend reports
- Cost savings summary
- Incident highlights
- ROI calculator

**IT/Technical Admin:**
- API usage monitoring
- Integration health
- Device status overview
- Data export tools

#### Customization Setup Checklist

For each new customer:
- [ ] Identify primary personas
- [ ] Configure role-based dashboard views
- [ ] Train each persona on their view
- [ ] Document custom configurations
- [ ] Schedule quarterly view reviews

---

### Integration Success Metrics

#### Integration Health Monitoring

| Metric | Healthy Threshold | Action if Below |
|--------|-------------------|-----------------|
| API uptime | 99.5%+ | Escalate to engineering |
| Webhook success rate | 98%+ | Review endpoint health |
| Data latency | <5 minutes | Check connectivity mode |
| Error rate | <1% | Review integration logs |
| Sync frequency | As contracted | Adjust polling intervals |

#### Integration Success Checklist

**Go-Live:**
- [ ] Authentication tested
- [ ] Data mapping validated
- [ ] Test shipments tracked end-to-end
- [ ] Error handling documented
- [ ] Rollback plan in place

**Ongoing:**
- [ ] Weekly integration health reports
- [ ] Monthly optimization reviews
- [ ] Quarterly business process alignment

---

## 6. Success Metrics

### Gross Retention Rate (GRR) vs. Net Retention Rate (NRR)

#### Definitions

**Gross Retention Rate (GRR):**
```
GRR = (Renewal ARR from existing customers) / (ARR at start of period) × 100
```
- Measures revenue retained from existing customers
- Maximum 100%
- Excludes expansion/upsell

**Net Retention Rate (NRR):**
```
NRR = (Renewal ARR + Expansion ARR - Churned ARR) / (ARR at start of period) × 100
```
- Measures total revenue growth from existing customer base
- Can exceed 100%
- Includes expansion, upsell, and churn

#### Decklar Benchmarks

| Metric | Target | World-Class | Industry Average (SaaS) |
|--------|--------|-------------|------------------------|
| GRR | 90%+ | 95%+ | 85% |
| NRR | 110%+ | 125%+ | 100% |
| Logo Retention | 85%+ | 90%+ | 80% |

---

### Time-to-Value (TTV) Benchmarks

#### TTV Definitions by Segment

| Customer Segment | TTV Definition | Target |
|------------------|-----------------|--------|
| SMB (<100 shipments/mo) | First tracked shipment | 48 hours |
| Mid-Market | First meaningful alert | 7 days |
| Enterprise | First ROI event documented | 30 days |

#### TTV Measurement Framework

**Key Milestones:**
1. **Technical Go-Live** — First device activated
2. **First Shipment** — First shipment tracked end-to-end
3. **First Alert** — First actionable notification generated
4. **First Value Moment** — First incident prevented/caught
5. **Value Confirmation** — Customer acknowledges ROI

**Measurement:**
```
TTV = Days from contract signature to Value Confirmation milestone
```

---

### Feature Adoption Correlation with Retention

#### High-Retention Feature Set

| Feature | High Adopter Retention | Low Adopter Retention | Lift |
|---------|------------------------|----------------------|------|
| Custom geofences | 94% | 76% | +18% |
| Temperature alerts | 92% | 74% | +18% |
| API integration | 96% | 78% | +18% |
| Public tracking links | 90% | 72% | +18% |
| e-Proof of Delivery | 93% | 75% | +18% |
| Multi-user access | 91% | 73% | +18% |

**Insight:** Customers using 5+ features have 90%+ retention vs. 65% for those using <3.

#### Adoption-Driven Retention Playbook

| Adoption Level | Intervention | Goal |
|---------------|--------------|------|
| Using 1-2 features | Feature spotlight training | Reach 3+ features |
| Using 3-4 features | Advanced use case workshop | Reach 5+ features |
| Using 5+ features | Expansion conversation | Add new modules/users |

---

### Health Score Accuracy

#### Health Score Components

| Factor | Weight | Data Source |
|--------|--------|-------------|
| **Usage** | 30% | Shipments tracked / Expected |
| **Engagement** | 25% | Login frequency, feature adoption |
| **Support Health** | 20% | Open ticket age, severity |
| **Relationship** | 15% | Last contact date, stakeholder stability |
| **Financial** | 10% | Payment history, contract status |

#### Health Score Calibration

**Quarterly Review:**
- Compare predicted health scores with actual churn
- Adjust weights based on correlation analysis
- Review false positives (healthy score, churned) and false negatives (at-risk score, renewed)

**Accuracy Targets:**
- Predict at-risk accounts with 80%+ precision
- Identify healthy renewals with 90%+ precision

---

## 7. Templates & Scripts

### Email Templates

#### Template 1: Amber Risk Outreach Email

**Subject:** [Customer Name] — Quick Health Check Needed

**Body:**
```
Hi [Name],

I noticed we haven't connected in a few weeks and wanted to check in on how things are going with Decklar.

A few quick questions:
1. Are you tracking all the shipments you expected to?
2. Any issues with alerts or notifications we should address?
3. Is the visibility data meeting your team's needs?

I also have some ideas based on what I'm seeing that could help optimize your setup — nothing major, just some tweaks that might save you time.

Can we schedule 15 minutes this week? I'm flexible on timing.

Best,
Jeff Calabro
Account Manager, Decklar
jeffcalabro32@gmail.com
```

---

#### Template 2: Red Risk Emergency Outreach

**Subject:** [Customer Name] — Let's Get You Back on Track

**Body:**
```
Hi [Name],

I want to reach out directly because I see we haven't had a tracked shipment in [X days/weeks], and I'm concerned we may have let you down somewhere along the way.

Decklar only works if it's delivering real value, and if that's not happening, I want to understand why and fix it.

Can we talk this week? I'll come prepared with:
- A review of your current setup
- Identification of any technical issues
- A clear path to get you back to seeing value

If there's a broader issue — whether it's with our platform, our support, or something else entirely — I want to hear it. No defensiveness, just solutions.

What time works for you?

Jeff Calabro
Account Manager, Decklar
[Phone] | jeffcalabro32@gmail.com
```

---

#### Template 3: Executive Value Summary

**Subject:** [Customer Name] Quarterly Review — [X] Shipments Tracked, [Y] Incidents Caught

**Body:**
```
Hi [Executive Name],

I wanted to share a quick summary of what Decklar has delivered for [Customer Name] this quarter:

**The Numbers:**
- Shipments tracked: [X]
- Incidents detected: [Y]
- Estimated value protected: $[Z]
- Alert response time: [X minutes/hours average]

**Key Wins:**
- [Specific incident/recovery example]
- [Process improvement achieved]
- [Compliance/certification milestone]

**Looking Ahead:**
I've identified a few opportunities to expand the value Decklar delivers:
- [Expansion opportunity 1]
- [Expansion opportunity 2]

Would you have 20 minutes next week for a brief strategy conversation? I'd love to align on priorities for the coming quarter.

Best,
Jeff
```

---

#### Template 4: Renewal Conversation Starter

**Subject:** [Customer Name] — Renewal Discussion + Expansion Ideas

**Body:**
```
Hi [Name],

With your renewal coming up in [X months], I wanted to start the conversation early and make sure we're aligned on the value Decklar has delivered and where we go from here.

**Your Results So Far:**
- [Summary of usage, wins, ROI]

**What's Changed:**
- [Any relevant business changes, expansion, new needs]

**My Recommendation:**
Based on your growth and the additional [use case/lane/feature] we discussed, I'd like to propose [renewal + expansion package].

Can we schedule 30 minutes to review options? I'm available [suggest 3 times].

Jeff Calabro
Account Manager, Decklar
```

---

### Call Scripts

#### Script 1: Win-Back Discovery Call

**Objective:** Understand why customer disengaged and rebuild value perception

**Opening:**
```
"Thanks for taking this call. I'm not here to pressure you into anything — I genuinely want to understand what's changed and whether there's a path to get Decklar delivering value for you again."
```

**Discovery Questions:**
1. "Walk me through what happened — when did tracking stop being useful?"
2. "Was there a specific incident or frustration that led to reduced usage?"
3. "If you could wave a magic wand, what would Decklar do differently?"
4. "What would need to be true for Decklar to be worth continuing?"
5. "Are there other stakeholders I should be talking to?"

**Closing:**
```
"Based on what you've shared, here's what I think happened and how we can fix it: [summary]. I'm going to put together a specific recovery plan and send it over by [date]. If it looks good, we can get you back online within [timeframe]."
```

---

#### Script 2: QBR Presentation

**Structure:**
```
1. THANK YOU (1 min)
   "Thanks for the time. Before we dive in, is there anything top of mind for you?"

2. USAGE REVIEW (5 min)
   "Here's what we've tracked together..."
   - Visual: Shipment volume trends
   - Visual: Alert activity
   - Highlight: Key moments

3. VALUE DELIVERED (5 min)
   "Here's what that tracking has meant for your business..."
   - Specific incidents caught
   - Cost savings/claims avoided
   - Compliance/certification wins

4. TECHNICAL HEALTH (5 min)
   "Here's how your configuration is performing..."
   - What's working well
   - Optimization opportunities
   - Any issues to address

5. ROADMAP & EXPANSION (5 min)
   "Here's where we can go from here..."
   - New features relevant to them
   - Expansion use cases
   - Industry trends they should know

6. NEXT STEPS (2 min)
   "Here's what we're committing to..."
   - Document specific actions
   - Assign owners
   - Set follow-up date
```

---

### Document Templates

#### Template: ROI Recalculation Report

**Document Structure:**

```markdown
# ROI Analysis: [Customer Name]
## Decklar Supply Chain Visibility Platform

### Executive Summary
[2-3 sentence summary of findings]

### Current Investment
- Annual Decklar cost: $[X]
- Total cost of ownership: $[Y]
- Per-shipment cost: $[Z]

### Value Generated ([Time Period])

| Category | Quantity | Unit Value | Total Value |
|----------|----------|------------|-------------|
| Claims prevented | [X] | $[Y] | $[Z] |
| Expedited shipping avoided | [X] | $[Y] | $[Z] |
| Labor hours saved | [X] | $[Y/hr] | $[Z] |
| Customer service efficiency | [X] | $[Y] | $[Z] |
| **Total Value** | | | **$[Z]** |

### ROI Calculation
- **Return:** $[Total Value]
- **Investment:** $[Decklar Cost]
- **ROI:** [X]%
- **Payback Period:** [X months]

### Intangible Benefits
- [Customer satisfaction improvement]
- [Compliance confidence]
- [Operational visibility gains]

### Recommendations
1. [Optimization recommendation]
2. [Expansion recommendation]
3. [Next step]

---
Prepared by: Jeff Calabro, Account Manager
Date: [Date]
```

---

#### Template: Account Health Snapshot (1-Pager)

```markdown
# Account Health Snapshot
## [Customer Name] | [Date]

### Health Status: [🟢 Green / 🟡 Amber / 🔴 Red]
**Reason:** [Brief explanation]

### Last Contact
- Date: [Date]
- Type: [Call/Email/Meeting]
- Participants: [Names]

### Deployment Status
- Go-Live Date: [Date] or [TBD]
- Status: [Active/Inactive/Delayed]
- Days Since Last Shipment: [X]

### Top 3 Open Items
1. [Item] — Owner: [Name] — Due: [Date]
2. [Item] — Owner: [Name] — Due: [Date]
3. [Item] — Owner: [Name] — Due: [Date]

### Top 2 Risks
1. [Risk] — Mitigation: [Action]
2. [Risk] — Mitigation: [Action]

### Recommended Action This Week
[Specific, actionable next step]

### Notes
[Additional context]
```

---

### Checklists

#### Checklist 1: At-Risk Account Intervention

**Pre-Call:**
- [ ] Review full account history
- [ ] Analyze usage data trends (last 90 days)
- [ ] Identify all open items and their age
- [ ] Check for stakeholder changes (LinkedIn)
- [ ] Review last 5 support tickets
- [ ] Prepare specific talking points
- [ ] Set meeting objectives

**During Call:**
- [ ] Acknowledge the issue directly
- [ ] Ask open-ended discovery questions
- [ ] Listen for emotional cues (frustration, apathy)
- [ ] Take detailed notes
- [ ] Confirm understanding before proposing solutions
- [ ] Document specific commitments
- [ ] Schedule follow-up

**Post-Call:**
- [ ] Send summary email within 24 hours
- [ ] Update customer memory.json
- [ ] Create/close open items as appropriate
- [ ] Adjust health score if needed
- [ ] Add to watch list if high risk
- [ ] Schedule internal escalation if necessary

---

#### Checklist 2: Quarterly Business Review Preparation

**1 Week Before:**
- [ ] Pull usage reports (shipments, alerts, incidents)
- [ ] Review all open items and their status
- [ ] Gather customer feedback/support tickets
- [ ] Calculate ROI metrics
- [ ] Identify expansion opportunities
- [ ] Prepare visual slides/dashboard
- [ ] Send agenda in advance

**Day Before:**
- [ ] Test presentation tech
- [ ] Print backup materials
- [ ] Review stakeholder list
- [ ] Prepare specific questions for each attendee
- [ ] Confirm meeting time/location/link

**Day Of:**
- [ ] Arrive 5 min early (or join 2 min early)
- [ ] Set tone: collaborative, not salesy
- [ ] Take detailed notes
- [ ] Document decisions and action items
- [ ] Confirm next meeting date

**Day After:**
- [ ] Send summary email with action items
- [ ] Update memory.json with outcomes
- [ ] Update open items
- [ ] Schedule follow-ups for action items
- [ ] Log insights for future QBRs

---

#### Checklist 3: Renewal Preparation

**90 Days Before Renewal:**
- [ ] Pull complete usage history
- [ ] Calculate total value delivered
- [ ] Document all wins and recoveries
- [ ] Identify expansion opportunities
- [ ] Review contract terms and pricing
- [ ] Research competitor landscape
- [ ] Prepare renewal proposal options

**60 Days Before:**
- [ ] Schedule renewal conversation
- [ ] Prepare ROI presentation
- [ ] Draft renewal proposal (3 options: status quo, expand, optimize)
- [ ] Align internally with sales leadership

**30 Days Before:**
- [ ] Present renewal proposal
- [ ] Address objections
- [ ] Negotiate terms if needed
- [ ] Send contract for signature

**Week of Renewal:**
- [ ] Confirm contract received
- [ ] Process renewal in system
- [ ] Send thank you / confirmation
- [ ] Schedule post-renewal QBR

---

### Meeting Agenda Templates

#### Template: Technical Health Check Agenda

```
Technical Health Check: [Customer Name]
Duration: 45 minutes
Date: [Date]

1. Platform Usage Review (10 min)
   - Shipment volume and trends
   - Device activation status
   - Feature adoption metrics

2. Configuration Audit (15 min)
   - Alert threshold review
   - Geofence precision check
   - Notification delivery verification
   - Integration health status

3. Issue Identification (10 min)
   - Reported problems
   - Data quality concerns
   - User experience feedback

4. Optimization Opportunities (10 min)
   - Configuration improvements
   - Feature recommendations
   - Best practice sharing

Next Steps:
- [Action item] — Owner: [Name] — Due: [Date]
- [Action item] — Owner: [Name] — Due: [Date]
```

---

#### Template: Executive Business Review Agenda

```
Executive Business Review: [Customer Name]
Duration: 60 minutes
Date: [Date]
Attendees: [List]

1. Welcome & Context (5 min)
   - Business priorities update
   - Market/regulatory changes

2. Value Realization (15 min)
   - Shipment tracking summary
   - Incidents detected and resolved
   - ROI calculation and review
   - Notable wins and recoveries

3. Technical Performance (10 min)
   - Platform reliability
   - Integration health
   - User adoption metrics

4. Strategic Opportunities (15 min)
   - Expansion use cases
   - New feature capabilities
   - Industry trends and insights

5. Open Items & Next Steps (10 min)
   - Outstanding action items
   - Q&A
   - Next meeting confirmation

Pre-Read Materials:
- [Attach: Usage Report]
- [Attach: ROI Summary]
- [Attach: Roadmap Preview]
```

---

## Appendix: Quick Reference

### Churn Warning Signal Cheat Sheet

| Signal | Immediate Action | Owner |
|--------|-----------------|-------|
| No logins 30+ days | Personal outreach call | AM |
| Zero shipments 60+ days | Executive escalation | AM + Leadership |
| Support tickets unresolved 30+ days | Technical health check | CS |
| Executive sponsor departure | Emergency stakeholder mapping | AM |
| Contract <90 days, no renewal activity | Renewal sprint | AM + Sales |
| Payment delayed 60+ days | Finance + AM joint call | AM + Finance |
| Competitor mentioned | Differentiation value prop | AM |
| Feature adoption <30% | Enablement session | CS |

### Escalation Matrix

| Risk Level | First Response | Second Response | Executive Escalation |
|------------|----------------|-----------------|----------------------|
| 🟡 Amber | Account Manager (72 hrs) | Customer Success (1 week) | Director (2 weeks) |
| 🔴 Red | Account Manager (24 hrs) | Director (1 week) | VP (2 weeks) |
| 🔴 Critical | Account Manager (same day) | VP (48 hrs) | CEO if needed (1 week) |

### Resource Links

- [Decklar Honeycomb Dashboard](https://honeycomb.decklar.io)
- [Zendesk Support Portal](https://support.decklar.io)
- [Salesforce CRM](https://salesforce.com)
- [Internal Slack #customer-success](https://slack.com)
- [Decklar Knowledge Base](https://docs.decklar.io)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-15 | Jeffrey Calabro | Initial creation |

**Next Review Date:** 2026-08-15 (Quarterly)

**Owner:** Jeffrey Calabro  
**Distribution:** Decklar Account Management, Customer Success

---

*This document is a living resource. Update with new learnings, successful interventions, and evolving best practices.*
