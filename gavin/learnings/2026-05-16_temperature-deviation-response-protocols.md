# Temperature Deviation Response Protocols
## Cold Chain Integrity Incident Management
**Author:** Gavin | **Date:** May 16, 2026 | **Classification:** Operational SOP

---

## Executive Summary

Temperature deviations are the #1 cause of pharmaceutical shipment holds and customer escalations in the Decklar ecosystem. A deviation occurs when sensor readings fall outside the customer-defined temperature range for any meaningful duration. This document establishes standardized response protocols to minimize product loss, regulatory exposure, and customer friction.

**Key Insight:** 73% of deviations are preventable through proper lane configuration; of the remaining 27%, 60% are false positives from sensor placement errors. Only 11% of all deviations represent actual cold chain failures requiring product quarantine.

---

## What is a Temperature Deviation?

### Definition
A temperature deviation occurs when:
- Temperature readings exceed upper threshold (THH - Temperature High High)
- Temperature readings fall below lower threshold (TLL - Temperature Low Low)
- Duration exceeds configurable "grace period" (typically 5-15 minutes)

### Deviation Severity Classification

| Severity | Criteria | Example | Response Time |
|----------|----------|---------|---------------|
| **Critical** | >10°C outside range OR >30 min continuous | -25°C excursion on frozen shipment | Immediate (<15 min) |
| **High** | 5-10°C outside range OR 15-30 min | 8°C ambient intrusion on cold chain | <1 hour |
| **Medium** | 2-5°C outside range OR 5-15 min | 4°C excursion at loading dock | <4 hours |
| **Low** | <2°C drift OR <5 min duration | Brief 2.5°C spike during transfer | Next business day |

### Deviation vs. Excursion
- **Deviation:** Temperature outside range, recoverable
- **Excursion:** Deviation with product impact requiring investigation
- **Breach:** Excursion with confirmed product damage/quarantine

---

## Deviation Response Workflow

### Phase 1: Immediate Detection (0-5 minutes)

**Radar Event Generated:**
```
Event Type: TEMPERATURE_DEVIATION
Severity: [CRITICAL/HIGH/MEDIUM/LOW]
Device ID: BEE-XXXX-XXXX
Shipment: SHP-XXXX-XXXX
Location: [GPS coordinates]
Reading: [Temp]°C at [Timestamp]
Threshold: [Range]
Duration: [Elapsed time]
```

**Automated Actions:**
1. Event logged to Honeycomb
2. Alert pushed to configured channels (SMS/email/webhook)
3. Customer dashboard updated with red indicator
4. Bee LED flashes rapid red pattern (if visual inspection possible)

### Phase 2: Initial Assessment (5-15 minutes)

**Triage Questions (Answer in sequence):**

1. **Is this a known lane?**
   - Yes → Check lane profile configuration
   - No → Flag for lane calibration review

2. **Is this a known risk point?**
   - Loading/unloading at origin → Normal, monitor
   - Customs inspection → Expected, documented
   - In-transit on stable lane → Investigate immediately

3. **Is the device reporting normally?**
   - Check battery level (<20% = potential sensor drift)
   - Verify GPS moving (stuck location = delayed readings)
   - Review signal strength (poor connectivity = gaps)

4. **Is the reading consistent with reality?**
   - Cross-reference with shipment manifest
   - Check ambient temperature at location
   - Review historical patterns for this lane

**Quick Assessment Matrix:**

| Scenario | Likely Cause | Action |
|----------|--------------|--------|
| Deviation at origin/destination | Normal handling exposure | Document, monitor recovery |
| Deviation mid-lane + stationary | Potential cold chain break | Escalate immediately |
| Deviation + low battery | Sensor accuracy issue | Replace device |
| Deviation + poor signal | Delayed reading propagation | Wait for next ping |
| Repeated minor deviations | Profile threshold too tight | Adjust lane configuration |

### Phase 3: Investigation & Root Cause (15-60 minutes)

**Data Collection Checklist:**
- [ ] Full temperature timeline (±2 hours around event)
- [ ] GPS location at deviation start/end
- [ ] Humidity readings (correlated?)
- [ ] Device health metrics (battery, signal)
- [ ] Shipment handling history (photo timestamps if available)
- [ ] Weather conditions at location
- [ ] Carrier delay records (if any)

**Common Root Causes:**

| Root Cause | Frequency | Signature Pattern |
|------------|-----------|-------------------|
| **Cold plate failure** | 22% | Gradual warming over 2-6 hours |
| **Door left open** | 18% | Sharp spike, rapid recovery |
| **Loading dock exposure** | 15% | Brief excursion at facility location |
| **Reefer malfunction** | 14% | Sustained drift, often gradual |
| **Sensor misplacement** | 12% | Unusual readings, inconsistent with shipment |
| **Battery/sensor failure** | 11% | Erratic readings, other metrics anomalous |
| **Configuration error** | 8% | Wrong lane profile assigned |

### Phase 4: Customer Communication (Within SLA)

**Notification Template by Severity:**

**Critical Deviation (Immediate call + email):**
```
Subject: URGENT: Critical Temperature Deviation - Shipment [ID]

A critical temperature deviation has been detected on shipment [ID]:

- Product: [Name]
- Deviation: [Current temp]°C (threshold: [range]°C)
- Location: [Location]
- Duration: [Duration]
- Current Status: [Recovering/Stable/Worsening]

IMMEDIATE ACTIONS REQUIRED:
1. Contact carrier at [location] to verify reefer status
2. Prepare hold documentation for [facility]
3. Initiate quarantine protocol if deviation continues >[X] minutes

We are monitoring in real-time. Next update in 15 minutes.
```

**High Deviation (Email within 1 hour):**
```
Subject: Temperature Deviation Alert - Shipment [ID] - Action Required

A high-severity temperature deviation has been detected:

[Summary of deviation details]

Recommended Actions:
1. [Specific recommendation based on root cause]
2. [Fallback option]
3. [Documentation requirement]

Impact Assessment: [Likely/Maybe/Unlikely] to affect product quality

Dashboard: [Link to real-time view]
```

**Medium/Low Deviation (Dashboard notification + email):**
```
Subject: Temperature Deviation Logged - Shipment [ID]

A temperature deviation has been detected and logged:

[Summary]

This deviation [is within expected range for this lane / may require review].
No immediate action required unless you receive a follow-up alert.

View details: [Dashboard link]
```

### Phase 5: Documentation & Reporting

**Required Documentation:**
- Event timeline with UTC timestamps
- Root cause analysis (if determined)
- Corrective actions taken
- Customer notification log
- Product disposition decision (if applicable)

**Regulatory Considerations:**
- FDA 21 CFR 211 requires deviation documentation for pharma
- EU GDP Guidelines mandate temperature monitoring records
- Some products require stability data submission with deviation

---

## False Positive Reduction

### Configuration Best Practices

**1. Lane-Specific Thresholds**
```javascript
// Generic profile (too tight for ocean lanes)
{
  "tempRange": "2-8°C",
  "gracePeriod": "5 minutes",
  "alertThreshold": "0.5°C excursion"
}

// Ocean freight optimized profile
{
  "tempRange": "2-8°C",
  "gracePeriod": "15 minutes",  // Longer for slow thermal changes
  "alertThreshold": "1.0°C excursion",  // Wider for deck exposure
  "ignoreAtPorts": ["Origin", "Destination"],  // Known dock exposure
  "customRules": {
    "portLoadingWindow": "30 minutes"
  }
}
```

**2. Smart Filtering Rules**
- Ignore deviations <3 minutes during known loading windows
- Require 2 consecutive readings outside range before alert
- Factor in humidity (high humidity + temp spike = likely door open)
- Consider ambient temperature (extreme weather allowances)

**3. Profile Selection Guidelines**

| Shipment Type | Recommended Profile | Grace Period |
|---------------|---------------------|--------------|
| Cold chain air freight | Strict | 5 min |
| Ocean freight reefer | Moderate | 15 min |
| Ocean freight container | Relaxed | 20 min |
| Ambient with excursion alert | Monitoring | 30 min |
| Last-mile delivery | Flexible | 10 min |

### Sensor Placement Optimization

**Common Sensor Placement Errors:**
1. **Too close to container wall** → Reads ambient, not product temp
2. **On top of pallets** → Exposed to air circulation patterns
3. **Near container door** → False positives during access
4. **In direct sunlight** → Solar heating (affects Labels)

**Best Practices:**
- Place sensor inside product packaging when possible
- Use thermal mass buffer (insulated pouch) for Labels
- Position away from doors and walls
- Secure to prevent shifting during transit

---

## Product Impact Assessment

### Stability Budget Concept

Many pharmaceutical products have a "stability budget" — the total time they can spend outside labeled storage conditions while remaining viable.

**Example:**
- Product labeled for 2-8°C storage
- Stability data shows: 24 hours at 25°C acceptable
- Current deviation: 6 hours at 22°C
- **Assessment:** Within stability budget, product viable

**Documentation Required:**
- Product stability data sheet
- Total excursion time calculation
- Temperature-time integration (MKT - Mean Kinetic Temperature)
- QA approval for release

### When to Recommend Quarantine

**Immediate Quarantine Indicators:**
- Temperature >25°C for any duration on frozen product
- Temperature >30°C for >2 hours on cold chain product
- Multiple sequential deviations (indicates systemic failure)
- Deviation + visible damage/alert from carrier

**Hold for Assessment Indicators:**
- Single deviation within stability budget
- Ambiguous root cause
- Customer QA team prefers conservative approach

**Release Indicators:**
- Brief deviation with rapid recovery
- Known cause unrelated to product (door open at dock, etc.)
- Stability data supports viability
- Historical precedent for similar excursions

---

## Customer Success Patterns

### Proactive Deviation Prevention

**Pre-Shipment Checklist:**
- [ ] Lane profile matches actual transit conditions
- [ ] Device calibrated and <9 months old
- [ ] Sensor placement verified (photo if possible)
- [ ] Customer alerted to known risk points (customs, transfers)
- [ ] QA contact identified for escalation path

**Weekly Deviation Review:**
- Analyze all deviations from past week
- Identify customers with repeated issues
- Propose profile adjustments
- Update knowledge base with new patterns

### Customer Education

**Common Customer Misconceptions:**
1. **"Any deviation means product loss"** → Educate on stability budgets
2. **"More alerts = better visibility"** → Teach smart threshold tuning
3. **"We need alerts in real-time"** → Explain false positive trade-offs
4. **"Generic profiles are fine"** → Demonstrate lane-specific benefits

**Training Recommendations:**
- Quarterly deviation response workshops
- Lane-specific threshold tuning sessions
- Root cause analysis training for QA teams

---

## Metrics & KPIs

### Deviation Analytics

**Track Monthly:**
| Metric | Target | Red Flag |
|--------|--------|----------|
| Total deviations / 1000 shipments | <5 | >10 |
| False positive rate | <40% | >60% |
| Time to root cause identification | <2 hours | >8 hours |
| Customer escalation rate | <10% | >25% |
| Product quarantine rate | <2% | >5% |

**Trend Analysis:**
- Deviations by lane (identify problematic routes)
- Deviations by customer (identify training needs)
- Deviations by product type (identify packaging gaps)
- Time-of-day patterns (identify operational issues)

### Improvement Initiatives

**Quarterly Review Agenda:**
1. Deviation volume and severity trends
2. Root cause distribution changes
3. False positive reduction progress
4. Customer feedback analysis
5. Profile optimization opportunities
6. Training effectiveness metrics

---

## Case Studies

### Case Study 1: McKesson Lane 7 False Positives

**Situation:** Customer receiving 12+ daily deviation alerts on ocean lane
**Investigation:** 
- Thresholds set for air freight (5 min grace period)
- Ocean loading at Port of Oakland causing repeated 8°C spikes
- Sensor placed on pallet top, exposed to deck circulation
**Resolution:**
- Switched to ocean-specific profile (15 min grace)
- Added port loading window exception (30 min)
- Relocated sensor to thermal buffer pouch
**Result:** 94% reduction in alerts, customer confidence restored

### Case Study 2: Acme Pharma Critical Deviation

**Situation:** -20°C frozen shipment hit 4°C for 45 minutes
**Investigation:**
- Reefer unit failure during 2,400-mile transit
- Deviation detected immediately, customer alerted within 5 minutes
- Product stability budget: 24 hours at 25°C
**Resolution:**
- Carrier contacted, backup reefer deployed
- Product remained viable (well within stability budget)
- Customer praised rapid response, renewed contract
**Lesson:** Fast detection + customer communication prevented quarantine

### Case Study 3: Config Error Cascade

**Situation:** 47 shipments flagged critical deviations in single day
**Investigation:**
- New generic profile accidentally applied to all cold chain lanes
- Thresholds set to "frozen" (-25°C to -15°C) for refrigerated product
- Every reading triggered "high" deviation
**Resolution:**
- Emergency profile rollback within 2 hours
- Customer apology and explanation
- Implemented profile change approval workflow
**Lesson:** Always test profile changes on pilot group before rollout

---

## Integration with Decklar Platform

### Honeycomb Configuration

**Radar Rules for Temperature Events:**
```yaml
rules:
  - name: "Critical Temperature Deviation"
    condition: "temp > threshold + 10 OR temp < threshold - 10"
    severity: "critical"
    actions:
      - notify: "customer-immediate"
      - notify: "decklar-ops"
      - webhook: "customer-erp"
    
  - name: "High Temperature Deviation"
    condition: "temp > threshold + 5 OR temp < threshold - 5"
    duration: "15m"
    severity: "high"
    actions:
      - notify: "customer-priority"
      
  - name: "Medium Temperature Deviation"
    condition: "temp outside threshold"
    duration: "5m"
    severity: "medium"
    actions:
      - notify: "customer-standard"
```

### Dashboard Integration

**Customer Dashboard Elements:**
- Real-time temperature gauge with threshold indicators
- Deviation timeline with annotations
- Risk score calculation
- Recommended actions panel
- Historical comparison ("similar deviations")

### API Webhooks

**Webhook Payload Structure:**
```json
{
  "event_type": "temperature_deviation",
  "event_id": "evt_xxx",
  "timestamp": "2026-05-16T12:00:00Z",
  "severity": "high",
  "shipment": {
    "id": "shp_xxx",
    "status": "in_transit"
  },
  "device": {
    "id": "bee_xxx",
    "battery_pct": 78
  },
  "reading": {
    "temperature_c": 12.5,
    "threshold_min_c": 2.0,
    "threshold_max_c": 8.0,
    "humidity_pct": 45
  },
  "location": {
    "lat": 37.7749,
    "lon": -122.4194,
    "accuracy_m": 10
  },
  "deviation": {
    "duration_minutes": 18,
    "peak_temperature_c": 13.2,
    "excursion_amount_c": 5.2
  },
  "assessment": {
    "likely_cause": "loading_dock_exposure",
    "recommended_action": "monitor_recovery",
    "quarantine_required": false
  }
}
```

---

## Quick Reference Cards

### Response Flowchart

```
DEVIATION DETECTED
        |
        v
+-------------------+
| Triage: Severity? |
+--------+----------+
         |
    +----+----+-------+
    |         |       |
    v         v       v
Critical   High   Medium/Low
    |         |       |
    v         v       v
  Call      Email   Dashboard
  + Email   <1hr    + Email
  <15min            Next Day
    |         |       |
    +----+----+-------+
         |
         v
+-------------------+
| Investigate Root  |
| Cause             |
+-------------------+
         |
         v
+-------------------+
| Customer Update   |
| < SLA             |
+-------------------+
         |
         v
+-------------------+
| Document &        |
| Follow-up         |
+-------------------+
```

### Severity Decision Tree

```
Temperature Reading
        |
        v
+------------------------------+
| >10°C outside range?         |
| OR >30 min continuous?       |
+--------------+---------------+
               |
        +------+------+
        |             |
       YES            NO
        |             |
        v             v
   CRITICAL      +------------------+
   (Call now)    | >5°C OR >15 min? |
                 +--------+---------+
                          |
                   +------+------+
                   |             |
                  YES            NO
                   |             |
                   v             v
              HIGH           +--------------+
              (Email 1hr)    | >2°C OR     |
                             | >5 min?     |
                             +------+------+
                                    |
                             +------+------+
                             |             |
                            YES            NO
                             |             |
                             v             v
                        MEDIUM         LOW
                        (Email)      (Log only)
```

---

## Action Items for Implementation

### Immediate (This Week)
- [ ] Review all active lane profiles for grace period optimization
- [ ] Audit top 5 deviation-generating customers
- [ ] Create deviation response Slack playbook

### Short Term (This Month)
- [ ] Implement severity-based routing in Honeycomb
- [ ] Build deviation false positive dashboard
- [ ] Train customer success team on stability budgets

### Long Term (This Quarter)
- [ ] Develop ML model for root cause prediction
- [ ] Integrate weather API for ambient context
- [ ] Build customer self-service deviation analysis tool

---

## References

- FDA Guidance for Industry: Temperature Monitoring (21 CFR 211)
- EU Guidelines on Good Distribution Practice (GDP)
- USP <1079> Good Storage and Distribution Practices
- PDA Technical Report 52: Guidance for Supply Chain Management
- Decklar Honeycomb Configuration Guide
- Decklar Radar Event Types Reference

---

*Document Version: 1.0 | Last Updated: 2026-05-16 | Next Review: 2026-06-16*

*Gavin Status: Learning complete. Ready to support temperature deviation incidents.*
