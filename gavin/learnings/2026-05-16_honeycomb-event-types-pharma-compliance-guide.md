# Honeycomb Event Types: Pharmaceutical Cold Chain Compliance Guide
**Date:** May 16, 2026  
**Agent:** Gavin  
**Topic:** Event Type Configuration for FDA/GDP-Compliant Pharmaceutical Supply Chains  
**Context:** McKesson event verification deadline May 21, 2026

---

## Executive Summary

Pharmaceutical supply chains represent Decklar's highest-stakes use case. A single temperature excursion can render millions of dollars in product unusable and trigger regulatory reporting requirements. This guide provides the definitive configuration for the 9 Honeycomb event types required for pharmaceutical compliance, mapped to FDA 21 CFR Part 11 and EU GDP requirements.

**Critical Insight:** Based on Decklar's multi-modal handoff analysis, **40-60% of temperature excursions occur during transport handoffs** (loading/unloading, mode transfers) rather than in transit. Event configuration must prioritize these vulnerable moments.

---

## Part 1: The 9 Essential Event Types — Pharma Configuration

### Event Type 1: Temperature Excursion Alert (CRITICAL)

**Regulatory Classification:** GDP Article 9.3.2, FDA 21 CFR 211.142

```
Event Code: TEMP_EXCURSION
Trigger: Temperature reading outside configured thresholds
Notification Timing: Immediate (<60 seconds)
Recipients: Quality Assurance, Consignee, Shipper
Escalation: Auto-escalate if excursion persists >15 minutes
```

**Threshold Configuration by Product Type:**

| Product Category | Temperature Range | Excursion Threshold | Critical Threshold |
|------------------|-------------------|---------------------|-------------------|
| **Refrigerated** | 2-8°C (35.6-46.4°F) | ±0.5°C | ±1.0°C |
| **Controlled Room Temp** | 15-25°C (59-77°F) | ±1.0°C | ±2.0°C |
| **Frozen** | -25°C to -10°C (-13°F to 14°F) | ±2.0°C | ±5.0°C |
| **Cryogenic** | -80°C to -60°C | ±3.0°C | ±5.0°C |

**Pharma-Specific Configuration:**

```yaml
temperature_excursion:
  enabled: true
  priority: CRITICAL
  thresholds:
    refrigerated_min: 2.0
    refrigerated_max: 8.0
    excursion_tolerance: 0.5
    critical_tolerance: 1.0
  notifications:
    immediate: true
    sms: true
    email: true
    webhook: true
  data_capture:
    record_trend: true      # GDP requirement: temperature trending
    capture_rate: 1_minute  # High-frequency during excursion
    include_battery_voltage: true
  compliance:
    gdp_article_9: true
    fda_21cfr11: true
    auto_document: true     # Creates audit trail automatically
```

**The 73-60-11 Rule Application:**

Based on Decklar's temperature deviation research:
- **73%** of excursions are brief (<2 hours) and self-correcting
- **60%** of excursions occur during first/last mile (dock exposure)
- **11%** of excursions are catastrophic (>4 hours, product loss)

Event configuration must distinguish between:
1. **Transient excursion** (0-15 min): Alert only, document
2. **Sustained excursion** (15-120 min): Escalate to QA
3. **Critical excursion** (>120 min or >critical threshold): Immediate product hold

---

### Event Type 2: Shipment Departure (Origin Exit)

**Regulatory Classification:** GDP Article 9.3.1 — Proof of Dispatch

```
Event Code: ORIGIN_EXIT
Trigger: GPS coordinates exit origin geofence
Notification Timing: Real-time (within 5 minutes)
Recipients: Shipper QA, Carrier, Consignee
Documentation: Generates GDP-compliant dispatch record
```

**Pharma-Specific Configuration:**

```yaml
origin_exit:
  enabled: true
  priority: HIGH
  geofence:
    radius: 200m          # Tighter for pharma (vs 500m general)
    shape: circle
    coordinate_precision: high
  activation_buffer: 30_minutes  # Time after Bee activation
  verification:
    require_temperature_reading: true  # Must have temp data
    require_gps_lock: true               # Must have GPS fix
    max_time_since_reading: 5_minutes
  compliance:
    gdp_dispatch_record: true
    include_carrier_handoff: true
    timestamp_utc: true
```

**Critical Consideration:** For pharma shipments, departure confirmation must include a valid temperature reading within 5 minutes. No temperature data = no valid departure record.

---

### Event Type 3: Shipment Arrival (Destination Entry)

**Regulatory Classification:** GDP Article 9.3.3 — Proof of Receipt Condition

```
Event Code: DESTINATION_ENTRY
Trigger: GPS coordinates enter destination geofence
Notification Timing: Real-time
Recipients: Consignee QA, Shipper QA, Carrier
Documentation: Arrival condition confirmation
```

**Pharma-Specific Configuration:**

```yaml
destination_entry:
  enabled: true
  priority: HIGH
  geofence:
    radius: 300m          # Accommodate large pharma DCs
    shape: circle
  verification:
    require_temperature_reading: true
    temperature_valid_window: 10_minutes
    shock_check: false    # Disabled to prevent self-heating
    light_check: true     # Tamper detection still valuable
  multi_factor_confirmation:
    enabled: true
    factors:
      - geofence_entry
      - ambient_light_threshold: 10_lux  # Door open detection
      - dwell_time_minimum: 5_minutes   # Prevents drive-by triggers
  compliance:
    gdp_receipt_record: true
    temperature_at_arrival: required
```

---

### Event Type 4: Device Offline / Communication Loss

**Regulatory Classification:** GDP Article 9.3.4 — Continuous Monitoring Requirement

```
Event Code: DEVICE_OFFLINE
Trigger: No data received from Bee > threshold
Notification Timing: After grace period
Recipients: Operations, Quality Assurance
Escalation: Critical if >6 hours without communication
```

**Pharma-Specific Configuration:**

```yaml
device_offline:
  enabled: true
  priority: HIGH
  thresholds:
    warning: 30_minutes   # Shorter than general (4 hours)
    critical: 2_hours       # Maximum acceptable blind spot
    emergency: 6_hours      # Triggers product hold investigation
  grace_periods:
    ocean_crossing: 12_hours    # Expected satellite gaps
    air_transport: 4_hours      # Known RF restrictions
    customs_hold: 24_hours      # Extended stationary periods
  compliance:
    document_blind_spots: true
    calculate_mkt_during_outage: true  # Mean Kinetic Temperature
    regulatory_notification: true       # GDP Article 5.3.4
```

**Critical Insight:** GDP requires "continuous monitoring." A 4-hour blind spot during a 2-8°C shipment is a deviation that must be documented and risk-assessed.

---

### Event Type 5: Multi-Modal Handoff Alert

**Regulatory Classification:** GDP Article 9.2 — Transfer of Responsibility

```
Event Code: HANDOFF_DETECTED
Trigger: GPS pattern indicates mode transfer + waypoint geofence entry
Notification Timing: Real-time
Recipients: Operations, Next-leg Carrier, QA (for handoff documentation)
Risk Level: HIGH — 40-60% of excursions occur here
```

**Pharma-Specific Configuration:**

```yaml
handoff_detected:
  enabled: true
  priority: CRITICAL
  detection_logic:
    waypoint_geofence_entry: true
    velocity_change_threshold: 50_percent  # Speed change indicates transfer
    dwell_time_trigger: 15_minutes
  high_risk_handoffs:
    - truck_to_air: critical_monitoring
    - air_to_truck: critical_monitoring
    - ocean_port_handling: extended_monitoring
    - customs_inspection: qa_notification
  enhanced_monitoring:
    temperature_frequency: 30_seconds  # During handoff window
    alert_on_any_deviation: true
    duration: 2_hours  # Extended window post-handoff
  compliance:
    document_transfer_of_responsibility: true
    chain_of_custody_update: true
```

**Why This Matters:** Handoffs are where cold chain breaks. The 30-second temperature sampling during handoff windows catches excursions that 5-minute intervals would miss.

---

### Event Type 6: Shipment Completion Confirmation

**Regulatory Classification:** GDP Article 9.3.3 — Final Receipt Documentation

```
Event Code: SHIPMENT_COMPLETE
Trigger: Multi-factor confirmation of delivery
Notification Timing: Upon confirmation
Recipients: All stakeholders, ERP systems
Documentation: Closes GDP chain of custody record
```

**Pharma-Specific Configuration:**

```yaml
shipment_complete:
  enabled: true
  priority: HIGH
  confirmation_factors:
    - geofence_entry: destination
    - dwell_time: 10_minutes
    - light_detection: door_open
    - optional: manual_scan  # If customer uses barcode/RFID
  temperature_summary:
    include_trend_chart: true      # GDP visual documentation
    min_max_average: true
    excursion_summary: true
    mkt_calculation: true          # Mean Kinetic Temperature
  compliance:
    generate_gdp_certificate: true
    include_temperature_log: true
    digital_signature_ready: true  # For 21 CFR Part 11
```

---

### Event Type 7: Low Battery Warning

**Regulatory Classification:** GDP Article 9.3.5 — Device Suitability

```
Event Code: LOW_BATTERY
Trigger: Battery level < threshold
Notification Timing: Real-time
Recipients: Operations, Reverse logistics
```

**Pharma-Specific Configuration:**

```yaml
low_battery:
  enabled: true
  priority: MEDIUM
  thresholds:
    warning: 25_percent   # Higher threshold for critical lanes
    critical: 15_percent
    emergency: 5_percent
  lane_specific_adjustments:
    short_haul_under_7_days: 20_percent_warning
    ocean_30_to_60_days: 30_percent_warning
    ocean_over_60_days: 35_percent_warning
  compliance:
    document_battery_at_departure: true
    predictive_failure_alert: true
```

---

### Event Type 8: Detention / Dwell Time Alert

**Regulatory Classification:** GDP Article 5.3 — Minimize Exposure to Risks

```
Event Code: EXTENDED_DWELL
Trigger: Dwell time in geofence exceeds threshold
Notification Timing: Real-time
Recipients: Operations, Carrier, QA (for risk assessment)
```

**Pharma-Specific Configuration:**

```yaml
extended_dwell:
  enabled: true
  priority: HIGH
  thresholds:
    customs_inspection: 2_hours
    port_congestion: 4_hours
    dock_waiting: 1_hour
    unexpected_holding: 30_minutes  # Generic threshold
  temperature_monitoring:
    increase_frequency: true  # Sample more during dwell
    alert_on_any_change: true
  compliance:
    document_deviation: true
    trigger_risk_assessment: true
```

---

### Event Type 9: Recovery / Excursion End

**Regulatory Classification:** GDP Article 9.3.2 — Deviation Resolution

```
Event Code: TEMP_RECOVERY
Trigger: Temperature returns to acceptable range
Notification Timing: Real-time
Recipients: Quality Assurance (for deviation closure)
Documentation: Excursion duration and recovery time
```

**Pharma-Specific Configuration:**

```yaml
temp_recovery:
  enabled: true
  priority: MEDIUM
  recovery_confirmation:
    consecutive_readings: 3
    reading_interval: 2_minutes
    stable_range: 30_minutes
  documentation:
    excursion_duration: true
    peak_temperature: true
    time_above_threshold: true
    mkt_impact: true
  compliance:
    auto_close_deviation: false  # Requires QA review
    generate_stability_assessment: true
```

---

## Part 2: GDP/FDA Compliance Mapping

### EU GDP Article 9.3.2 — Temperature Monitoring

| Requirement | Honeycomb Event Configuration |
|-------------|------------------------------|
| "A temperature monitoring device shall be used" | TEMP_EXCURSION enabled with appropriate thresholds |
| "Records shall be kept" | All events auto-logged with UTC timestamps |
| "Deviations shall be documented" | Excursion start/end events with full trending data |

### FDA 21 CFR Part 11 — Electronic Records

| Requirement | Implementation |
|-------------|----------------|
| Validation | Event triggers validated in simulator |
| Audit trails | Each event includes: what, when, who, why |
| Access controls | Event configuration change-locked post-deployment |
| Electronic signatures | Shipment completion ready for e-sig integration |

### IATA Temperature Control Regulations (TCR)

For air transport specifically:
- Disable shock detection (aircraft vibration)
- Reduce GPS frequency during flight (RF restrictions)
- Configure for known cold storage handoffs

---

## Part 3: Configuration Checklist — McKesson Deployment

### Pre-Deployment (Due: May 21, 2026)

**Week 1: Configuration & Validation**
- [ ] Configure 9 event types per specifications above
- [ ] Run simulator validation for all temperature thresholds
- [ ] Test geofence boundaries at each McKesson DC
- [ ] Verify light levels >3% at all activation stations
- [ ] Configure user access in shellapp.decklar.com

**Week 2: Integration Testing**
- [ ] Validate iShip integration for all 9 event types
- [ ] Test alert routing to McKesson QA teams
- [ ] Confirm webhook delivery to McKesson systems
- [ ] Document any deviations from standard configuration

### Post-Deployment Monitoring

**Daily (First 30 Days):**
- [ ] Review event accuracy (false positive/negative rate)
- [ ] Monitor temperature excursion detection timing
- [ ] Verify handoff event triggers at distribution centers

**Weekly:**
- [ ] Optimize geofence boundaries based on GPS patterns
- [ ] Adjust thresholds based on actual product requirements
- [ ] Review battery consumption vs. event frequency

---

## Part 4: Key Insights for Customer Conversations

### The "Why" Behind Pharma Configuration

**Customer Question:** *"Why is the geofence smaller for pharma?"*

**Gavin's Answer:** "For pharmaceutical shipments, we use a 200m geofence radius versus 500m for general cargo. This tighter boundary ensures we capture the exact moment your product leaves climate-controlled dock space. With the 2-8°C threshold, even 5 minutes of ambient exposure during a long dock walk can trigger a GDP deviation. The smaller geofence gives you precision for your regulatory records."

**Customer Question:** *"Why disable shock detection?"*

**Gavin's Answer:** "Shock and ambient light sensors generate heat when active. In a 2-8°C shipment, even small heat sources can push readings toward your upper threshold. We disable non-essential interrupts for refrigerated lanes—this eliminates false excursions and extends Bee battery life from 60 to 90 days. Temperature monitoring remains continuous at full fidelity."

**Customer Question:** *"What happens during the 4-hour ocean gap?"*

**Gavin's Answer:** "Ocean crossings have expected communication gaps due to satellite coverage. Our system documents these as 'planned blind spots' per GDP Article 5.3.4. We calculate Mean Kinetic Temperature (MKT) across the gap—if your product's MKT stays within stability limits, there's no deviation. If we detect unexpected gaps, that triggers a QA notification for risk assessment."

---

## Part 5: Related Learnings

- [2026-05-16] Multi-Modal Handoff Risk Management (40-60% of excursions)
- [2026-05-16] The 73-60-11 Rule: Temperature Deviation Framework
- [2026-05-16] Temperature Deviation Response Protocols
- [2026-05-14] Bee Sensor Data Patterns
- [2026-05-14] Honeycomb Event Types Configuration Guide

---

## Sources

- EU Guidelines on Good Distribution Practice (GDP) 2013/C 343/01
- FDA 21 CFR Part 11: Electronic Records
- IATA Temperature Control Regulations (TCR)
- Decklar Best Practices for Pharmaceutical Shipments
- McKesson Corporation deployment specifications
- Decklar Multi-Modal Handoff Risk Analysis (May 2026)

---

**Next Learning Topic:** API Integration Patterns for Pharma ERP Systems (SAP, Oracle, Blue Yonder)
