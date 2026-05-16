# Incident Response & Escalation Workflows for Decklar Customers

**Research Date:** May 15, 2026  
**Topic:** Critical Alert Management & Customer Escalation Protocols  
**Researcher:** Gavin (Decklar Intelligence Agent)

---

## Executive Summary

This learning document establishes standardized protocols for handling critical IoT alert events (temperature excursions, geofence breaches, device failures) in Decklar customer deployments. Based on analysis of existing customer patterns from McKesson (active) and Acme Pharma Distribution (deploying), this framework provides Jeff with actionable escalation playbooks.

---

## 1. Critical Alert Taxonomy

### 1.1 Alert Severity Matrix

| Severity | Alert Types | Response SLA | Customer Notification |
|----------|-------------|--------------|----------------------|
| **P0 - Critical** | Temperature excursion beyond threshold, Complete device failure during active shipment, Unauthorized route deviation | Immediate (< 15 min) | Phone + Email + Portal notification |
| **P1 - High** | Geofence breach (non-route), Humidity threshold breach, Delayed ping (30+ min silence) | Within 1 hour | Email + Portal notification |
| **P2 - Medium** | Battery below 20%, Connectivity degradation, Minor threshold approach | Within 4 hours | Portal notification + daily digest |
| **P3 - Low** | Routine battery warnings, Scheduled maintenance reminders | Next business day | Weekly summary |

### 1.2 Customer-Specific Thresholds

**Cold Chain Pharmaceutical (McKesson pattern):**
- Temperature range: 2°C to 8°C (standard refrigerated pharma)
- Critical breach: >8°C or <2°C for >5 consecutive minutes
- Humidity: N/A for current deployment (dry cargo)
- Geofence radius: 500m from route corridor

**Ocean Freight Pharma (Acme pattern):**
- Temperature range: 2°C to 25°C (controlled ambient)
- Critical breach: >25°C or <2°C
- **Key learning:** Sensor interrupts MUST be disabled for 14+ day transits (customer noted this as critical requirement)
- Humidity monitoring: Enabled (moisture intrusion is #1 claim driver)
- Lane duration: 35 days average

---

## 2. Incident Response Workflow

### 2.1 Immediate Response (0-15 minutes)

```
DETECT → VALIDATE → NOTIFY → ASSIGN
```

**Step 1: Automated Detection**
- Honeycomb platform triggers alert based on configured thresholds
- Alert routed to Decklar operations dashboard
- Customer portal shows real-time alert banner

**Step 2: Validation (Gavin's role)**
- Check device ping history (last 10 data points)
- Verify it's not a false positive (GPS drift, temporary environmental spike)
- Cross-reference with shipment schedule (is this an active shipment?)

**Step 3: Customer Notification**
- P0: Phone call to primary contact + backup contact
- P1: Email with alert details + portal link
- Include: Device ID, shipment reference, current location, recommended action

**Step 4: Assignment**
- Create ticket in customer tracking system
- Assign to on-call support engineer
- Set escalation timer (P0: 30 min, P1: 2 hours)

### 2.2 Investigation Phase (15-60 minutes)

**Data to Collect:**
1. Full device telemetry history (temperature/humidity/GPS trail)
2. Shipment context (origin, destination, carrier, expected arrival)
3. Environmental conditions (weather at location, port delays)
4. Customer impact assessment (product value, regulatory requirements)

**Decision Tree:**

```
Is device still transmitting?
├── NO → Device failure protocol
│       └── Dispatch replacement device via expedited shipping
│       └── Activate backup monitoring if available
│
└── YES → Continue investigation
        └── Is excursion ongoing?
            ├── YES → Live monitoring protocol
            │       └── Contact carrier/warehouse immediately
            │       └── Coordinate intervention if possible
            │
            └── NO → Post-event analysis
                    └── Document root cause
                    └── Update customer incident log
```

### 2.3 Resolution & Documentation

**For Each Incident, Document:**
- Incident ID and timestamp
- Alert severity and type
- Root cause determination
- Customer communication log
- Resolution actions taken
- Time to resolution
- Follow-up recommendations

---

## 3. Escalation Playbooks by Customer Type

### 3.1 Enterprise Customers (McKesson Model)

**Primary Contact Structure:**
- Tier 1: Operations Manager (day-to-day)
- Tier 2: Supply Chain Director (escalations)
- Tier 3: VP Operations (business impact)

**Escalation Triggers:**
- P0 incident not acknowledged within 30 minutes
- Product loss > $10,000
- Regulatory compliance risk (FDA, etc.)
- Recurring incidents (3+ same issue in 30 days)

**Communication Style:**
- Formal, data-driven
- Include business impact quantification
- Provide recommendations, not just status updates
- Weekly executive summary during active incidents

### 3.2 Mid-Market Customers

**Primary Contact Structure:**
- Single primary contact (often wears multiple hats)
- Backup contact for after-hours

**Escalation Triggers:**
- Any P0 incident
- Customer expresses dissatisfaction
- Go-live delays > 30 days

**Communication Style:**
- Direct, actionable
- Focus on "what this means for you"
- Offer proactive support calls

---

## 4. Proactive Incident Prevention

### 4.1 Pre-Shipment Checklist (From Decklar SOP)

Before each monitored shipment:

1. **Device Health Check**
   - Battery > 50% for short haul, > 80% for long haul
   - Firmware current
   - Activation location confirmed

2. **Configuration Validation**
   - Thresholds match cargo requirements
   - Geofences configured for origin/destination
   - Alerts routed to correct contacts

3. **Customer Communication**
   - Confirm shipment schedule
   - Verify primary contact availability
   - Provide device activation instructions

### 4.2 Pattern Recognition

**Early Warning Indicators (Gavin monitors these):**
- Device battery degradation pattern (indicates aging device)
- Repeated GPS drift at specific locations (indicates coverage gaps)
- Temperature spikes at specific facilities (indicates handling issues)
- Delayed ping patterns (indicates connectivity issues)

**When to Flag for Jeff:**
- Any pattern suggesting systemic issue
- Customer showing signs of alert fatigue (ignoring notifications)
- Recurring incidents at same location/facility

---

## 5. Post-Incident Value Recovery

### 5.1 Turning Incidents into Wins

Every incident is an opportunity to demonstrate value:

**Immediate Actions:**
- Provide detailed incident report within 24 hours
- Quantify potential loss prevented (if intervention succeeded)
- Recommend process improvements

**Long-term Actions:**
- Update deployment configuration to prevent recurrence
- Schedule QBR to review incident trends
- Identify expansion opportunities ("We've seen this issue — consider adding humidity monitoring")

### 5.2 Incident Metrics for QBRs

| Metric | Target | How to Calculate |
|--------|--------|------------------|
| Mean Time to Alert (MTTA) | < 5 minutes | Time from excursion to alert generation |
| Mean Time to Response (MTTR) | < 30 minutes (P0) | Time from alert to first customer contact |
| Incident Resolution Rate | > 95% | Resolved vs. escalated to claim |
| False Positive Rate | < 5% | Invalid alerts / total alerts |
| Customer Satisfaction Score | > 4.5/5 | Post-incident survey |

---

## 6. Specific Scenarios & Responses

### 6.1 Temperature Excursion in Transit

**Scenario:** Cold chain shipment exceeds 8°C threshold

**Immediate Actions:**
1. Verify alert validity (check sensor calibration, GPS location)
2. Contact carrier dispatch with device location
3. Notify customer primary contact
4. Determine if intervention possible (nearest cold storage facility)

**Documentation Required:**
- Temperature graph showing excursion duration and magnitude
- GPS location at time of excursion
- Product impact assessment
- Carrier response/actions taken

**Follow-up:**
- Determine if product can be salvaged (QA hold)
- Update SOP if carrier-related
- Consider route/geofence adjustments

### 6.2 Device Goes Dark (No Pings)

**Scenario:** Device stops transmitting during active shipment

**Immediate Actions:**
1. Check last known location and timestamp
2. Attempt remote device wake (if supported)
3. Contact carrier to verify shipment status
4. Check for known dead zones on route

**Escalation if:**
- Last known location > 6 hours old
- High-value shipment
- Suspected theft/loss

**Recovery Options:**
- Activate backup device if available
- Coordinate with carrier for manual check
- Initiate insurance/claim process if loss confirmed

### 6.3 Humidity Alert (Ocean Freight)

**Scenario:** Moisture intrusion detected during ocean transit

**Critical Context:**
- #1 claim driver for ocean freight customers
- Often indicates container seal failure or condensation
- Product may be salvageable if caught early

**Immediate Actions:**
1. Alert customer to potential moisture damage
2. Coordinate with destination facility for inspection
3. Document humidity trend (sudden spike vs. gradual)

**Follow-up:**
- Recommend container inspection at origin
- Consider enhanced packaging recommendations

---

## 7. Tools & Resources

### 7.1 Decklar Platform Capabilities

**Honeycomb Alert Configuration:**
- Threshold-based alerts (temperature, humidity, shock)
- Geofence entry/exit alerts
- Device health alerts (battery, connectivity)
- Custom alert rules per customer/shipment type

**Customer Portal:**
- Real-time device tracking
- Alert history and acknowledgment
- Shipment documentation access
- Reporting dashboard

### 7.2 External Resources

**Carrier Communication:**
- Maintain updated contacts for major carriers
- Know carrier escalation paths
- Understand carrier liability policies

**Regulatory Context:**
- FDA guidance on temperature excursions (pharma)
- Good Distribution Practice (GDP) requirements
- Insurance claim documentation standards

---

## 8. Actionable Takeaways for Jeff

### Immediate Actions:
1. **Create customer-specific escalation matrices** for McKesson and Acme with current contact info
2. **Review alert thresholds** for both customers — ensure they're aligned with actual cargo requirements
3. **Schedule incident response drill** with Decklar support team to test workflows

### Ongoing Practices:
1. **Weekly incident review** — review all P0/P1 incidents from past week for patterns
2. **Monthly threshold audit** — verify thresholds still match customer needs
3. **Quarterly playbook update** — incorporate lessons learned into standard workflows

### Conversation Starters for Customers:
- "Have you experienced any alert fatigue? Are you getting notifications that aren't actionable?"
- "When we detect a critical excursion, who should we call first? Do you have an after-hours escalation process?"
- "Would you find value in a weekly digest of all non-critical alerts instead of individual notifications?"

---

## 9. Knowledge Base Updates

**New Pattern Identified:**
- Ocean freight requires sensor interrupt disabled to prevent false alerts during long transits
- Humidity monitoring is critical value-add for ocean freight (moisture intrusion = #1 claim driver)
- Enterprise customers prefer consolidated weekly reports over individual alert streams

**Recommended Additions to Standard Onboarding:**
- Incident response contact worksheet (who to call, when, how)
- Alert threshold validation checklist
- Post-go-live 30-day incident review meeting

---

## References

- Decklar SOP Checklist (core_docs/)
- Decklar Troubleshooting Guide (core_docs/)
- Customer memory files: McKesson, Acme Pharma Distribution
- Previous learning: Customer Health Scoring, QBR Metrics

---

**Document Status:** Active Learning  
**Next Review:** After next critical incident to validate playbook effectiveness
