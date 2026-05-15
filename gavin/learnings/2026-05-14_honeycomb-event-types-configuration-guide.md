# Learning Spike: Honeycomb Event Types & Configuration Strategy
**Date:** May 14, 2026  
**Agent:** Gavin  
**Topic:** Honeycomb Platform Event Type Configuration for Enterprise Deployments

---

## Executive Summary

Honeycomb event types are the backbone of Decklar's real-time supply chain visibility. Proper configuration ensures customers receive actionable alerts at the right moments—without alert fatigue. This guide synthesizes configuration patterns, field-tested best practices, and lessons from enterprise deployments including McKesson Corporation's internal configuration task (9 event types, due May 21, 2026).

---

## 1. Understanding Honeycomb Event Types

### 1.1 What Are Event Types?

Event types define **when** and **why** the Honeycomb platform generates notifications to users. Each event type represents a specific supply chain milestone or anomaly that requires customer attention.

### 1.2 Core Event Categories

| Category | Purpose | Example Events |
|----------|---------|----------------|
| **Shipment Lifecycle** | Track shipment progression | Departure, Arrival, Completion |
| **Geofence** | Location-based triggers | Enter/Exit Origin, Enter/Exit Destination, Waypoint alerts |
| **Sensor** | Device-generated events | Temperature excursion, Shock detected, Light trigger |
| **Device** | Bee/hardware status | Low battery, Offline alert, Activation confirmed |
| **Custom** | Customer-specific needs | Detention threshold, Delay alert, ETA change |

---

## 2. The 9 Essential Event Types for Enterprise Deployments

Based on field deployments and McKesson's requirements, here are the standard 9 event types that should be configured for a comprehensive enterprise setup:

### 2.1 Shipment Departure (Origin Geofence Exit)

```
Trigger: GPS coordinates exit Origin geofence
Notification Timing: Real-time (within 5 minutes)
Recipients: Shipper, Carrier, Consignee
Escalation: None
```

**Configuration Notes:**
- Geofence size: Start with 500m radius, optimize to 200-300m after pipe-cleaning
- Coordinate with customer's actual dock door locations
- Consider activation delay buffer (30-60 min post-activation)

### 2.2 Shipment Arrival (Destination Geofence Enter)

```
Trigger: GPS coordinates enter Destination geofence  
Notification Timing: Real-time
Recipients: Consignee, Carrier, Shipper
Escalation: None
```

**Configuration Notes:**
- Often paired with ambient light detection for confirmation
- Critical for cold chain: arrival + temperature check in one alert
- Geofence may need to be larger for ports/rail yards (1km+)

### 2.3 Temperature Excursion Alert

```
Trigger: Temperature reading outside configured thresholds
Notification Timing: Real-time (immediate)
Recipients: Quality team, Consignee, Shipper
Escalation: Critical priority for pharma/cold chain
```

**Configuration Best Practices:**
- **Pharma Mode:** Disable non-temperature interrupts (shock, light) to prevent self-heating
- Thresholds must align with product specs (see Bee Sensor Data Patterns learning)
- Include duration in alert (e.g., "Temperature exceeded threshold for 15 minutes")
- Distinguish between excursion start and excursion end (recovery)

### 2.4 Shock Event Detection

```
Trigger: Accelerometer detects G-force above threshold
Notification Timing: Real-time
Recipients: Operations, Quality (if fragile cargo)
Escalation: Based on G-force severity
```

**Configuration Notes:**
- Threshold guidance: 3G for general cargo, 1.5G for fragile, 6G+ for damage alert
- Filter out expected handling (loading/unloading) via time-based rules
- Consider suppressing during known high-vibration periods (air travel, rail)

### 2.5 Device Offline / No Communication

```
Trigger: No data received from Bee for > threshold
Notification Timing: After grace period
Recipients: Operations, Customer Success
Escalation: If remains offline > 6 hours
```

**Configuration Notes:**
- Standard threshold: 4 hours for in-transit, 24 hours for warehouse
- Account for known dead zones (ocean crossings, rural routes)
- Differentiate between "expected" (sleep mode) and "unexpected" offline

### 2.6 Low Battery Warning

```
Trigger: Battery level < 20%
Notification Timing: Real-time
Recipients: Operations, Reverse logistics team
Escalation: Critical if < 10%
```

**Configuration Notes:**
- Set threshold based on lane duration (longer lanes need earlier warning)
- For 60+ day ocean shipments: warn at 30%
- Include estimated remaining life if trending data available

### 2.7 Waypoint Alert (Readiness/Delay)

```
Trigger: GPS enters defined waypoint geofence
Notification Timing: Real-time
Recipients: Operations, Supply chain planners
Escalation: If dwell time exceeds threshold
```

**Configuration Notes:**
- Use for customs, transfers, transloads
- Critical for multi-modal: truck→air→truck visibility
- Can trigger Dynamic PRF (see Battery optimization section)

### 2.8 Detention/Demurrage Threshold

```
Trigger: Dwell time in geofence exceeds configured threshold
Notification Timing: Real-time
Recipients: Operations, Finance, Carrier
Escalation: After 2 hours past threshold
```

**Configuration Notes:**
- Requires accurate geofence boundaries
- Different thresholds for different location types (port vs. warehouse)
- Include accumulated dwell time in alert

### 2.9 Shipment Completion Confirmation

```
Trigger: Multiple signals (geofence + light + time-based)
Notification Timing: Upon confirmation
Recipients: All stakeholders
Escalation: None
```

**Configuration Notes:**
- Most reliable when combining geofence entry + ambient light + dwell time
- Prevents false completions from drive-by GPS pings
- Triggers post-shipment workflows (invoicing, Bee return for reusable)

---

## 3. Configuration Patterns by Industry

### 3.1 Pharmaceutical/Cold Chain

**Priority Events:**
1. Temperature excursion (CRITICAL)
2. Shipment departure/arrival
3. Device offline
4. Shipment completion

**Special Configurations:**
- Disable shock/light interrupts (prevents self-heating)
- Tighter temperature thresholds
- Shorter offline thresholds (can't risk blind spots)
- Include temperature trend in alerts (rising, stable, recovered)

### 3.2 High-Value Electronics

**Priority Events:**
1. Shock detection (CRITICAL)
2. Geofence deviations
3. Light-based tamper detection
4. Detention/demurrage

**Special Configurations:**
- Lower shock thresholds (fragile cargo)
- Enable ambient light triggers (security)
- Waypoint alerts for high-risk regions

### 3.3 General Supply Chain (Truck/Rail)

**Priority Events:**
1. Departure/arrival geofences
2. Waypoint alerts (major hubs)
3. Delay alerts
4. Completion

**Special Configurations:**
- Larger geofences for rail yards
- Dynamic PRF at waypoints to save battery
- Reduced sensor frequency for long-haul

---

## 4. Field-Learned Configuration Wisdom

### 4.1 The Pipe-Cleaning Phase

Every new lane requires a **2-4 week pipe-cleaning period** where event thresholds are tuned based on actual data.

**During Pipe-Cleaning:**
- Monitor all events but suppress customer notifications initially
- Identify false positives (e.g., trucks driving near destination geofence)
- Optimize geofence sizes based on GPS accuracy patterns
- Adjust sensor interrupt sensitivity
- Document final configuration as "production-ready"

### 4.2 Battery vs. Visibility Trade-offs

Every event trigger consumes battery. Strategic configuration extends Bee life:

| Lane Duration | GPS Frequency | Sensor Interrupts | Event Sensitivity |
|---------------|---------------|-------------------|-------------------|
| < 7 days | 5-10 min | Full | High |
| 7-30 days | 15-30 min | Reduced | Medium |
| 30-60 days | 30-60 min | Minimal | Critical only |
| > 60 days | 60-120 min | Temperature only | Emergency only |

**Dynamic PRF (Periodic Reporting Frequency):**
- Normal transit: Low frequency (saves battery)
- Near waypoint: High frequency (visibility when it matters)
- Post-arrival: Low frequency (shipment complete)

### 4.3 Wi-Fi Mapping Accuracy

After 3-5 Bees traverse a lane:
- Review Wi-Fi MAC address captures at each facility
- Update Honeycomb location mapping for improved indoor accuracy
- GPS + Wi-Fi fusion reduces false geofence triggers

### 4.4 Common Configuration Mistakes

| Mistake | Impact | Prevention |
|---------|--------|------------|
| Sensor interrupts on long lanes | Battery death before arrival | Disable non-critical interrupts |
| Too-small geofences | False "arrivals" from GPS drift | Start 500m, optimize down |
| Missing light trigger | Delayed completion alerts | Always pair with geofence |
| Alert fatigue | Customers ignore notifications | Tier alerts (info/warning/critical) |
| Wrong temp thresholds | False excursions or missed breaches | Match to product specs exactly |

---

## 5. McKesson Configuration Context

### 5.1 Current State (May 14, 2026)

- **Health Score:** 85 (Operational)
- **Status:** Active deployment with internal configuration task
- **Due Date:** May 21, 2026 (7 days)
- **Task:** Configure 9 event types

### 5.2 Recommended Priority Order

Based on McKesson's pharmaceutical distribution focus:

1. **Temperature Excursion** (Critical - pharma compliance)
2. **Shipment Departure** (Origin geofence exit)
3. **Shipment Arrival** (Destination geofence entry)
4. **Device Offline** (No communication > 4 hours)
5. **Shipment Completion** (Multi-factor confirmation)
6. **Waypoint Alerts** (Major distribution hubs)
7. **Low Battery** (20% threshold)
8. **Shock Detection** (3G threshold)
9. **Detention/Demurrage** (2-hour threshold at destination)

### 5.3 Special Considerations for McKesson

- **DC Light Activation Issue:** Documented need for 3%+ light at activation stations
- **User Access Management:** shellapp.decklar.com requires explicit provisioning
- **iShip Integration:** Test all event flows through customer-facing app
- **Account Bee Limits:** Contract expansion needed for reverse logistics buffer

---

## 6. Configuration Validation Checklist

Before marking any event type configuration as "production":

### 6.1 Pre-Deployment Testing

- [ ] Run all scenarios in Decklar Simulator (smartbee-staging.decklar.com)
- [ ] Verify alert routing to correct recipients
- [ ] Test escalation paths
- [ ] Confirm API/Webhook integration (if used)
- [ ] Validate geofence boundaries with customer on-site visit
- [ ] Test activation location light levels (minimum 3%)

### 6.2 Post-Deployment Monitoring

- [ ] Review first 10 shipment events for accuracy
- [ ] Adjust geofence sizes based on actual GPS patterns
- [ ] Check for false positive/negative rates
- [ ] Validate customer receipt of notifications
- [ ] Document any deviations from expected behavior

### 6.3 Ongoing Maintenance

- [ ] Weekly review of event accuracy metrics
- [ ] Monthly optimization of geofence boundaries
- [ ] Quarterly review of threshold effectiveness
- [ ] Annual audit of all configured event types

---

## 7. Key Takeaways

1. **Start broad, then narrow** — Large geofences and suppressed notifications during pipe-cleaning prevent false starts

2. **Battery is the constraint** — Every event trigger costs power; configure for lane duration

3. **Temperature is king in pharma** — Cold chain excursions are the highest-stakes events

4. **Combine signals for reliability** — Single triggers fail; geofence + light + time = confidence

5. **Document everything** — Configuration drift kills visibility; version control your Honeycomb setups

6. **Test like it's production** — Simulator validation prevents customer-facing failures

---

## 8. Related Learnings

- [2026-05-14] Bee Sensor Data Patterns
- [2026-05-14] Customer Health Scoring & Early Warning Systems
- [2026-05-14] QBR Metrics & Customer Success Patterns

---

## Sources

- Decklar Best Practices Guide (core_docs/)
- Decklar Troubleshooting Guide (core_docs/)
- McKesson deployment history and field notes
- Enterprise pharmaceutical customer configurations
- Honeycomb platform documentation

**Next Learning Topic:** API Integration Patterns & Webhook Best Practices for Enterprise Customers
