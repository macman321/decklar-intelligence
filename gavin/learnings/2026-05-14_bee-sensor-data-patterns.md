# GAVIN LEARNING SPIKE: Bee Sensor Data Patterns
**Date:** May 14, 2026
**Topic:** Decklar Bee Labels — Sensor Data Patterns & Supply Chain Insights
**Source:** Research Synthesis from Decklar Product Knowledge

---

## Executive Summary

Understanding Bee sensor data patterns is critical for Customer Success. The Bee Label is more than a tracker—it's a data-rich IoT device capturing location, temperature, humidity, light, and shock events. Recognizing patterns in this data enables proactive issue detection, faster customer support, and value demonstration during QBRs.

---

## 1. Bee Label Sensor Capabilities

### Sensor Suite
| Sensor | Purpose | Data Pattern | Alert Triggers |
|--------|---------|--------------|----------------|
| **GPS** | Location tracking | Lat/long at configurable intervals (1-60 min) | Geofence entry/exit |
| **Temperature** | Cold chain monitoring | Continuous °C/°F readings | Temp threshold breach |
| **Humidity** | Moisture detection | Relative humidity % | Humidity spike |
| **Light** | Tamper/open detection | Binary + ambient light level | Sudden light increase |
| **Accelerometer** | Shock/vibration | G-force events | Impact threshold |
| **Cellular** | Connectivity | Signal strength, network type | Connection loss |

### Data Transmission Modes
1. **Real-Time Streaming** — GPS + Cellular active, continuous updates
2. **Interval Mode** — Configurable ping frequency (15 min standard, 1-60 min range)
3. **Event-Driven** — Immediate transmission on threshold breach
4. **Batch Mode** — Stores data locally, uploads on cellular availability

---

## 2. Common Data Patterns by Use Case

### Pattern A: Healthy Cold Chain Shipment
**Visual:** Smooth temperature line, minor fluctuations
```
Temp:    ████████░░░░░░░░████████
          [Origin]        [Destination]
          Cool           Cool
```

**Characteristics:**
- Temperature stays within ±2°C of setpoint
- GPS pings every 15-30 minutes
- No shock events >3G
- Humidity stable unless product-expected
- Clean geofence entry/exit events

**Customer Success Action:** Use as positive reinforcement in QBRs. Export this data for customer training.

---

### Pattern B: Temperature Excursion (Critical Alert)
**Visual:** Sharp spike outside threshold
```
Temp:    ██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
          Cool   COLD SPIKE    Cool
          [Door left open?] [Refrigeration failure?]
```

**Data Signatures:**
- Sudden temp rise >5°C in <10 minutes
- Duration matters: <15 min = likely door open; >30 min = equipment issue
- Correlates with: light sensor spike (door open), GPS stopped (loading dock)

**Root Causes:**
1. Refrigeration unit failure
2. Door left open during loading/unloading
3. Pre-cooling failure before loading
4. Transfer delay at hub

**Customer Success Action:** 
- Immediate escalation to shipper/receiver
- Provide exact timestamp + GPS location
- Recommend pre-cooling SOP review

---

### Pattern C: Moisture Intrusion (Humidity Spike)
**Visual:** Humidity climbs, temp may stabilize
```
Humidity: ████████████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
          Dry          WET
          [Rain?]       [Condensation?]
```

**Data Signatures:**
- Humidity jumps >20% relative in short window
- Temperature may stay stable (rain exposure) or drop (wet cargo)
- Often correlates with: shock events (rough handling in wet conditions), GPS stationary (parked in rain)

**Common in:** 
- Pharmaceutical shipments (high-value, moisture-sensitive)
- Electronics (corrosion risk)
- Agriculture (spoilage)

**Customer Success Action:** Flag for claims documentation. Correlate with weather data at GPS location.

---

### Pattern D: Shock Event / Rough Handling
**Visual:** Sharp G-force spike, single or series
```
Shock:   ░░░░▓░░░░░▓▓▓░░░░░░░░░░
         Calm   DROP  Calm
```

**Data Signatures:**
- Accelerometer reading >5G (configurable threshold)
- May correlate with: temperature spike (product damage), GPS jitter (vehicle movement), multiple shocks in sequence (rough road/loading)

**Root Causes:**
1. Forklift drop during loading
2. Improper securing in vehicle
3. Rough terrain / potholes
4. Mishandling at transfer hub

**Customer Success Action:** 
- Alert customer within 15 minutes if real-time
- Document for claims if damage suspected
- Recommend: stricter handling protocols, better packaging

---

### Pattern E: GPS Signal Loss / Connectivity Gap
**Visual:** Pings stop, then resume
```
GPS:     ●─●─●───[GAP]───●─●─●
         Active    Dead    Active
```

**Data Signatures:**
- No location updates for >2x expected interval
- May resume with: timestamp jump, location jump, batch of stored readings

**Root Causes:**
1. Cellular dead zone (remote area, tunnel, basement)
2. Device malfunction (rare with Bee Labels)
3. Battery depletion (near end of 9-month shelf life)
4. International roaming issues (if crossing borders)

**Customer Success Action:** 
- Check if gap is expected (tunnel, rural route)
- If unexpected: check device age, verify cellular coverage on route
- Reassure customer: data is stored, will upload when reconnected

---

### Pattern F: Geofence Miss / Delayed Entry
**Visual:** Shipment arrives but no geofence trigger
```
Expected:  [=====>] Enter Geofence → Alert
Actual:    [======>     ] GPS shows arrival, no trigger
           [Manual Check Required]
```

**Root Causes:**
1. GPS accuracy issue (urban canyon, indoor facility)
2. Geofence radius too small for facility
3. Device ping interval longer than dwell time
4. Facility boundary incorrectly mapped

**Customer Success Action:** 
- Customer Success: Adjust geofence radius (recommend 500m default, larger for rural)
- Suggest: manual check procedures for critical shipments
- Document: facility-specific geofence requirements

---

## 3. Data Pattern Analysis for Customer Success

### Red Flags in Data Review
| Pattern | Risk Level | Customer Impact |
|---------|------------|-----------------|
| Repeated temp excursions | 🔴 High | Product loss, compliance issues |
| Multiple shock events | 🔴 High | Damage claims, packaging review needed |
| Frequent connectivity gaps | 🟡 Medium | Visibility loss, customer anxiety |
| Humidity spikes | 🟡 Medium | Moisture damage (pharma, electronics) |
| Late geofence triggers | 🟢 Low | Notification delays, process friction |
| Battery <20% | 🟡 Medium | Device failure risk, replacement needed |

### QBR Gold: Proactive Insights
During Quarterly Business Reviews, present:

1. **Exception Rate Trending** — "Your temp excursions decreased 40% this quarter"
2. **Compliance Score** — "98.7% of shipments stayed within temperature spec"
3. **Incident Correlation** — "3 of 4 damage claims correlated with shock events we detected"
4. **Route Optimization** — "Shipments via Route A have 2x fewer connectivity gaps than Route B"
5. **Cost Avoidance** — "Early moisture detection prevented $X in potential claims"

---

## 4. Best Practices for Data Interpretation

### For New Customers
- Establish baseline: "What does normal look like for your lanes?"
- Set conservative thresholds initially, tighten after 30 days
- Review first 10 shipments manually to calibrate expectations

### For At-Risk Accounts
- Daily data review until 3 consecutive clean shipments
- Escalate immediately on: 2+ temp excursions, any shock >10G, connectivity gaps >4 hours
- Proactive outreach: "I noticed Pattern X, here's what it means..."

### For Mature Accounts
- Monthly exception reports only
- Focus on optimization: "Your average ping interval could be extended to save battery"
- Expansion opportunities: "You're tracking trucks—have you considered asset flow?"

---

## 5. Knowledge Base Additions

### New Entry: `common_issues.md`
**Issue:** Customer reports "no tracking data" but device is active

**Diagnosis Steps:**
1. Check last GPS ping timestamp
2. Verify cellular coverage at last known location
3. Check if in expected dead zone (tunnel, rural)
4. Review device expiry date
5. Confirm customer is checking correct dashboard

**Resolution:** Usually connectivity gap, not device failure. Reassure customer, set expectation for data upload on reconnection.

---

## 6. Action Items for Jeff

- [ ] **Review existing customers** — Do any show Pattern B, C, or D frequently?
- [ ] **Update onboarding** — Add "What does a healthy shipment look like?" visual
- [ ] **QBR prep** — Pull exception rate data for next quarterly reviews
- [ ] **Documentation** — Share this learning with team for consistent analysis

---

## Source Notes

This learning synthesized from:
- Decklar product documentation (Bee Label technical specs)
- IoT supply chain visibility best practices
- Customer Success playbook patterns for sensor data interpretation

**Next Learning Topic:** Customer Success Playbooks — QBR Structure and Value Demonstration

---

*Gavin Learning Spike Complete*
*Knowledge added to: ~/decklar-intelligence/gavin/learnings/*
*Status: Ready for Customer Success application*
