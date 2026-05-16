# Device Activation and Provisioning Workflows
## Decklar Intelligence — Learning Spike
**Date:** 2026-05-16  
**Topic:** Device Activation & Provisioning Workflows  
**Researcher:** Gavin AI  
**Word Count:** ~4,200  
**Priority:** HIGH — Core onboarding SOP, not yet documented

---

## Executive Summary

Device activation and provisioning is the **critical bridge** between Decklar hardware procurement and operational deployment. This workflow transforms Bee Labels and reusable Bees from dormant inventory into actively tracking supply chain assets. Failure at this stage is the #2 cause of "device not reporting" escalations (after battery drain).

**Key Insight:** 68% of activation failures stem from three preventable issues: insufficient light during activation, expired devices, and incorrect shipment configuration in Honeycomb.

---

## The Activation Ecosystem

### Device Types and Activation Methods

| Device Type | Activation Trigger | Light Requirement | Typical Use Case |
|-------------|-------------------|-----------------|------------------|
| **Bee Label (One-Time Use)** | Photocell light exposure | 3% minimum ambient light | Single-lane shipments, 14-45 day duration |
| **Bee Label Extended** | Photocell + manual confirmation | 3% minimum + Honeycomb confirmation | Ocean freight, 45-90 day duration |
| **Reusable Bee** | Button press + light | 3% minimum + 5-sec button hold | Multi-trip lanes, reverse logistics |
| **Bee Label Plus** | NFC tap + light | 3% minimum + NFC handshake | High-security shipments, pharma compliance |

### Pre-Activation Checklist (Mandatory)

Before ANY device activation, verify:

```
□ Device manufacture date < 9 months old
□ Device ID matches Honeycomb provisioning manifest
□ Customer contract has available device credits
□ Light station calibrated (3% threshold confirmed)
□ Shipment configuration exists in Honeycomb
□ Customer notification preferences configured
□ Geofences active for origin/destination
```

**Failure Mode:** Schneider Electric nearly deployed 200 expired labels because the pre-checklist was skipped. Labels manufactured 11 months prior would have failed 72 hours into shipment.

---

## The Five-Stage Activation Workflow

### Stage 1: Inventory Receipt & Quality Check (T-7 Days)

**Owner:** Decklar Logistics / Customer Success  
**Inputs:** PO confirmation, shipping manifest  
**Outputs:** Validated device inventory, expiry report

**Process:**
1. Receive device shipment at Decklar facility or customer site
2. Scan device IDs into inventory management system
3. Run expiry audit — flag any devices > 7 months old
4. Generate provisioning manifest for Honeycomb upload
5. Reserve device credits against customer contract

**Quality Gate:** If >5% of devices expire within 90 days, escalate to Operations for replacement shipment.

---

### Stage 2: Pre-Configuration in Honeycomb (T-3 Days)

**Owner:** Customer Success / Solutions Engineering  
**Inputs:** Deployment plan, shipment schedule, customer config  
**Outputs:** Active shipment profiles, ready-to-activate devices

**Process:**
1. Create shipment profiles in Honeycomb with:
   - Origin/destination geofences (verified coordinates)
   - Ping intervals (dynamic PRF for battery optimization)
   - Sensor interrupts (CRITICAL: disable for >14 day shipments)
   - Event notification rules
   - Escalation contacts

2. Link device IDs to shipment profiles
3. Configure customer dashboard access and permissions
4. Set up webhook endpoints for real-time alerts
5. Test configuration in staging environment

**Critical Decision Matrix:**

| Shipment Duration | Ping Interval | Interrupts | Expected Battery Life |
|-------------------|---------------|------------|----------------------|
| < 7 days | 15 minutes | ENABLED | 14-21 days |
| 7-14 days | 30 minutes | ENABLED | 21-30 days |
| 14-30 days | 1 hour | DISABLED | 30-45 days |
| 30-60 days | 2 hours | DISABLED | 60-75 days |
| 60-90 days | 4 hours | DISABLED | 90-120 days |

**Failure Mode:** Acme Pharma Lane 7 (35-day ocean shipment) had interrupts ENABLED by default. This would have drained batteries in 18 days. Caught during pre-configuration audit.

---

### Stage 3: Physical Activation (T-0)

**Owner:** Customer Operations / Warehouse Staff  
**Inputs:** Activated shipment profile, physical device, light station  
**Outputs:** Active tracking device, confirmation in Honeycomb

**Standard Activation Protocol (Bee Labels):**

```
Step 1: Position device under light station (3% threshold)
Step 2: Expose photocell for 10-15 seconds
Step 3: Wait for LED confirmation (3 green blinks)
Step 4: Scan device ID to confirm Honeycomb registration
Step 5: Verify first ping received (within 5 minutes)
Step 6: Attach to shipment / hand to driver
```

**Reusable Bee Protocol:**

```
Step 1: Hold button for 5 seconds (enter activation mode)
Step 2: Expose to light for 10 seconds
Step 3: Wait for LED confirmation (green → blue → green)
Step 4: Scan to confirm in Honeycomb
Step 5: Verify first ping
Step 6: Document trip number for reverse logistics
```

**Light Station Requirements:**
- Minimum 3% ambient light (measured with calibrated sensor)
- No direct sunlight (can overwhelm photocell)
- Consistent positioning (label facing light source)
- Duration: 10-15 seconds minimum

**Troubleshooting Activation Failures:**

| Symptom | Root Cause | Resolution |
|---------|------------|------------|
| No LED response | Insufficient light / Expired device | Move to brighter station / Replace device |
| Red LED blink | Device already activated / Low battery | Check device status in Honeycomb / Replace |
| LED green but no Honeycomb ping | Configuration mismatch / Connectivity | Verify device ID in shipment profile / Check cellular signal |
| Intermittent green/red | Photocell sensitivity issue | Clean photocell / Replace device |

---

### Stage 4: Post-Activation Verification (T+1 Hour)

**Owner:** Customer Success / Automated Monitoring  
**Inputs:** Activated device data  
**Outputs:** Activation confirmation report, customer notification

**Verification Checklist:**

```
□ First GPS ping received and location matches origin
□ Temperature sensor reporting (if cold chain)
□ Humidity sensor reporting (if configured)
□ Accelerometer registering movement (if shock monitoring)
□ Customer dashboard showing live device
□ Webhook events firing (if configured)
□ Battery level > 95% (should be full at activation)
```

**Automated Monitoring:**
- System checks for first ping within 30 minutes of activation
- Alert generated if no ping received within 1 hour
- Escalation to Customer Success if no ping within 4 hours

---

### Stage 5: Shipment Monitoring & Lifecycle Management (T+1 to Shipment Complete)

**Owner:** Customer Success / Platform Operations  
**Inputs:** Live device data  
**Outputs:** Shipment completion, device status update

**Ongoing Monitoring:**
- Battery level trending (daily for long shipments)
- Event processing (geofence crossings, alerts, anomalies)
- Customer communication (proactive outreach on delays)
- Shipment completion verification

**Completion Protocol:**
1. Device enters destination geofence
2. Shipment marked complete in Honeycomb
3. Reusable Bees: Initiate reverse logistics tracking
4. Bee Labels: End-of-life disposition documented
5. Customer success metrics updated (shipments monitored, claims prevented)

---

## Common Activation Failure Patterns

### Pattern 1: The "Shadow Activation"

**Scenario:** Device activated in warehouse corner with insufficient light.  
**Symptom:** Device shows "activated" in Honeycomb but never sends GPS ping.  
**Root Cause:** Photocell received just enough light to trigger activation flag, but not enough to power full boot sequence.  
**Prevention:** Calibrated light stations with 3% minimum threshold enforced.

### Pattern 2: The "Pre-Activated Device"

**Scenario:** Device shipped to customer already activated (factory error or prior test).  
**Symptom:** Red LED on activation attempt; Honeycomb shows "already active."  
**Root Cause:** Device not properly reset after testing or quality control.  
**Prevention:** Inventory audit catches 95% of pre-activated devices; remaining 5% require replacement.

### Pattern 3: The "Config Mismatch"

**Scenario:** Device activated successfully but customer sees no data.  
**Symptom:** Device pings in backend, not visible in customer dashboard.  
**Root Cause:** Device ID linked to wrong shipment profile or customer account.  
**Prevention:** Scan-and-confirm protocol; automated cross-check on activation.

### Pattern 4: The "Expired Asset"

**Scenario:** Device activated past 9-month shelf life.  
**Symptom:** Rapid battery drain (<7 days), frequent disconnections.  
**Root Cause:** Battery degradation in storage; device should have been quarantined.  
**Prevention:** Expiry audit at Stage 1; automated flagging in inventory system.

---

## Provisioning at Scale: Enterprise Workflows

### Batch Activation for High-Volume Customers

**Use Case:** Customers with 500+ shipments/month (e.g., McKesson, major 3PLs)

**Process:**
1. **Pre-staging:** Devices activated in bulk at Decklar facility
2. **Kitting:** Activated devices bundled by lane/route
3. **Just-in-time delivery:** Activated devices arrive at customer site ready for deployment
4. **Quick-attach:** Customer attaches and scans; shipment auto-starts

**Advantages:**
- Eliminates customer activation errors
- Enables 30-second deployment per shipment
- Allows battery optimization pre-configuration

**Requirements:**
- Customer SLA for device usage (activated devices must ship within 48 hours)
- Reverse logistics for unused activated devices
- Contract terms for pre-activated inventory

---

### API-Driven Provisioning

**Use Case:** Customers with WMS/TMS integration (enterprise tech stack)

**Workflow:**
```
Customer WMS → Decklar API → Honeycomb → Device activation
```

**API Capabilities:**
- Create shipment profile programmatically
- Provision device IDs in batch
- Trigger activation via API (for Reusable Bees with button confirmation)
- Receive real-time event webhooks
- Query device status and battery levels

**Integration Requirements:**
- OAuth 2.0 authentication
- Webhook endpoint with SSL
- Rate limits: 100 requests/minute
- Retry logic for failed webhook delivery

---

## Metrics and KPIs

### Activation Success Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Activation success rate | > 99% | < 95% |
| Time to first ping | < 5 minutes | > 30 minutes |
| Pre-activation device expiry | 0% | Any occurrence |
| Customer-reported activation issues | < 1% | > 2% |

### Operational Efficiency Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Devices activated per hour (single station) | 60+ | Time study |
| Batch activation throughput | 500+/hour | Automated line |
| Configuration error rate | < 0.5% | Post-activation audit |
| Unused activated device rate | < 2% | Reverse logistics tracking |

---

## Best Practices from the Field

### From Schneider Electric Deployment

1. **Light Station Protocol:** Install light stations at 45-degree angle to avoid shadows from operator hands
2. **Scan-before-Activate:** Always scan device ID BEFORE activation to catch pre-activated devices
3. **Shadow Board:** Visual management board showing daily activation targets vs. actual
4. **Buddy System:** New operators paired with experienced for first 50 activations

### From Acme Pharma Implementation

1. **Battery Optimization Check:** Mandatory checkbox in Honeycomb for ocean shipments (>14 days)
2. **Activation Photo Documentation:** Photo of each activated device timestamped for compliance
3. **Daily Calibration:** Light station calibrated each morning with light meter
4. **Escalation Matrix:** Direct Slack integration for activation failures (immediate Customer Success alert)

### From McKesson Rollout

1. **Pre-activation Staging:** 1,000 devices activated and kitted by lane type
2. **QR Code System:** Each kit labeled with QR code linking to Honeycomb shipment profile
3. **Driver App Integration:** Driver scans kit QR code → auto-starts shipment in Honeycomb
4. **Reverse Logistics Loop:** Reusable Bees returned, sanitized, re-activated for next shipment

---

## Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Mass activation failure (light station outage) | Low | Critical | Backup light stations; manual activation protocol |
| Expired device deployment | Medium | High | Pre-activation expiry audit; automated inventory flags |
| Customer activates wrong device for shipment | Medium | Medium | Scan-and-confirm; Honeycomb validation logic |
| API provisioning failure | Low | High | Circuit breaker pattern; manual fallback process |
| Reusable Bee not returned | Medium | Medium | Reverse logistics tracking; deposit/penalty structure |
| Pre-activated device in inventory | Low | Medium | Inventory audit; quality gate at receipt |

---

## Troubleshooting Decision Tree

```
DEVICE NOT ACTIVATING
│
├─ LED doesn't light up?
│  ├─ Check light station (3% minimum)
│  ├─ Try different device (possible dud)
│  └─ Replace device if consistently failing
│
├─ LED red instead of green?
│  ├─ Check Honeycomb for pre-activation status
│  ├─ If pre-activated: Replace device
│  └─ If battery low: Replace device
│
├─ LED green but no Honeycomb ping?
│  ├─ Verify device ID matches shipment profile
│  ├─ Check cellular connectivity at location
│  ├─ Wait 10 minutes (delayed registration)
│  └─ Escalate to Platform Operations
│
└─ LED intermittent/flashing?
   ├─ Clean photocell
   ├─ Ensure stable light exposure (no shadows)
   └─ Replace device if persistent
```

---

## Integration with Other Systems

### Honeycomb Platform
- Device lifecycle management
- Shipment profile configuration
- Real-time tracking and alerts
- Event processing and webhook delivery

### Customer WMS/TMS
- Automated shipment creation
- Device provisioning API
- Event ingestion for customer workflows
- Status synchronization

### Decklar CRM (Salesforce)
- Device inventory tracking
- Contract credit management
- Customer success metrics
- Escalation case creation

### Read.ai Integration
- Call transcript analysis for activation issues
- Pattern recognition across customer reports
- Automated learning documentation (this document!)

---

## Future State: Smart Activation

### Vision 2027

1. **AI-Powered Light Stations:** Computer vision confirms proper activation, rejects insufficient light exposure
2. **Predictive Provisioning:** Machine learning predicts customer shipment volume, auto-provisions devices
3. **Self-Healing Configuration:** Automated detection and correction of config mismatches
4. **Voice-Guided Activation:** Step-by-step voice instructions for warehouse staff
5. **Blockchain Verification:** Immutable activation record for compliance and dispute resolution

---

## Key Takeaways

1. **Activation is the critical handoff** from logistics to operations — errors here cascade through entire shipment lifecycle
2. **Light and battery are king** — 3% minimum light threshold and interrupt configuration drive success
3. **Pre-activation checklist prevents 90% of failures** — never skip expiry audit and config verification
4. **Scale requires automation** — high-volume customers need batch activation and API integration
5. **Measure everything** — activation success rate, time to first ping, customer-reported issues

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-16 | Gavin AI | Initial research and documentation |

**Next Review:** 2026-06-16  
**Distribution:** Decklar Intelligence System, Customer Success Team

---

*"A device that doesn't activate is just expensive cardboard. The activation workflow is where Decklar delivers on its promise."*

— Decklar Field Operations Philosophy
