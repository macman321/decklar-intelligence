# Learning Spike: Bee Sensor Data Patterns
**Date:** May 14, 2026  
**Agent:** Gavin  
**Topic:** Bee Label Telemetry & Data Pattern Analysis

---

## Executive Summary

Bee Labels (Decklar's multi-sensor IoT devices) generate rich telemetry streams that reveal supply chain visibility insights. Understanding the data patterns is essential for proactive monitoring, troubleshooting, and optimizing customer deployments.

---

## 1. Bee Hardware Sensor Suite

Each Bee Label contains:

| Sensor | Purpose | Data Frequency |
|--------|---------|------------------|
| **GPS/GNSS** | Location tracking | Every 5-15 min (moving) / 1-4 hrs (stationary) |
| **Accelerometer** | Shock detection, motion state | Real-time events + periodic samples |
| **Temperature** | Ambient conditions, cold chain | Every 10-30 min |
| **Humidity** | Moisture exposure | Every 10-30 min |
| **Light** | Door open/close, tamper detection | Event-triggered |
| **Pressure** (some models) | Altitude, sealed environment | Every 30 min |

---

## 2. Normal Data Patterns by Use Case

### 2.1 In-Transit Shipments

**Expected Pattern:**
```
Location: Regular updates every 5-15 minutes when in motion
Temperature: Stable within acceptable range (per product requirements)
Accelerometer: Occasional spikes (handling, bumps) but no sustained high-G events
Light: Minimal readings (enclosed container/trailer)
Humidity: Stable baseline
```

**Good Signal Indicators:**
- Regular GPS updates showing forward progress
- Temperature variance < 5°F/hour
- No shock events > 3G (handling threshold)
- Light events only during known stops

### 2.2 Warehouse/Dwell Time

**Expected Pattern:**
```
Location: Static or minimal movement (GPS drift only)
Temperature: Warehouse ambient (consistent with HVAC)
Accelerometer: Low activity
Light: Periodic spikes (door openings, inspections)
Humidity: Stable
```

**Good Signal Indicators:**
- GPS confidence radius tightening (static position known)
- Temperature correlating with warehouse HVAC cycles
- Light events during business hours only

### 2.3 Cold Chain Monitoring

**Critical Temperature Bands:**

| Product Type | Acceptable Range | Critical Alert Threshold |
|--------------|------------------|--------------------------|
| Frozen (-20°C) | -25°C to -15°C | > -10°C or < -30°C |
| Refrigerated (2-8°C) | 0°C to 10°C | > 12°C or < -2°C |
| Controlled Room Temp | 15°C to 25°C | > 30°C or < 10°C |

**Pattern Red Flags:**
- Temperature rising during transit (refrigeration failure)
- Gradual temperature drift in warehouse (HVAC issue)
- Sudden spikes at handoffs (dock door exposure)

---

## 3. Abnormal Data Patterns & Root Causes

### 3.1 GPS Anomalies

| Pattern | Likely Cause | Customer Impact |
|---------|--------------|-----------------|
| No GPS for > 4 hours | Dead zone, metal enclosure, hardware failure | Location blind spot |
| Erratic jumps (> 50km) | Multi-path reflection, GPS spoofing, bad fix | False geofence alerts |
| Static in moving shipment | Deep inside container, battery conservation mode | Real-time tracking loss |
| Low accuracy (HDOP > 5) | Urban canyon, weather, antenna obstruction | Imprecise location |

**Diagnostic Steps:**
1. Check cellular signal strength at last known position
2. Review shipment route for known dead zones
3. Verify Bee placement (exterior vs. interior of container)

### 3.2 Temperature Anomalies

| Pattern | Likely Cause | Customer Impact |
|---------|--------------|-----------------|
| Gradual rise over hours | Reefer failure, door seal issue | Product spoilage risk |
| Sudden spike then recovery | Door opening at handoff | Expected, document only |
| Sensor stuck at constant value | Hardware malfunction | False security |
| Cyclical swings | Reefer cycling on/off | Normal if within range |

**Root Cause Analysis:**
- Correlate with GPS stops (loading/unloading events)
- Compare ambient vs. product temperature (lag time)
- Check for direct sun exposure on sensor

### 3.3 Accelerometer/Shock Events

| G-Force Range | Interpretation |
|---------------|----------------|
| < 1G | Normal handling, vibration |
| 1-3G | Standard loading/unloading |
| 3-6G | Rough handling, drop risk |
| > 6G | Severe impact, probable damage |

**Pattern Analysis:**
- Single high-G spike: Isolated incident (document)
- Multiple spikes in sequence: Rough handling pattern
- Sustained vibration: Transportation mode (truck vs. rail vs. air)

### 3.4 Battery & Power Patterns

**Battery Drain Signatures:**

| Pattern | Indication | Action Required |
|---------|------------|-----------------|
| Linear decline | Normal consumption | Schedule replacement |
| Sudden drop | Cold temperature effect or hardware fault | Investigate immediately |
| Accelerated drain | High reporting frequency, poor signal | Adjust configuration |
| Premature death (< 6 months) | Defective unit or extreme environment | Warranty review |

**Battery Life Formula (simplified):**
```
Estimated Days = (Battery Capacity mAh) / (Daily Consumption mAh)

Daily Consumption = (GPS transmissions × 15mAh) + 
                   (Sensor readings × 0.5mAh) + 
                   (Cellular syncs × 25mAh) + 
                   (Sleep current × 24hrs)
```

---

## 4. Data Quality Indicators

### 4.1 Signal Strength (RSSI)

| RSSI Level | Interpretation |
|------------|----------------|
| > -85 dBm | Excellent |
| -85 to -95 dBm | Good |
| -95 to -105 dBm | Fair |
| < -105 dBm | Poor (expect delays/drops) |

### 4.2 Data Completeness

**Healthy Bee Metrics:**
- > 95% of expected check-ins received
- < 5% of readings flagged as suspicious
- GPS fix success rate > 90%

**Degraded Bee Indicators:**
- Intermittent check-ins (< 80% completion)
- Repeated failed transmissions
- Timestamp gaps with no explanatory geofence events

---

## 5. Proactive Monitoring Playbook

### Daily Review Checklist

1. **Alert Triage**
   - Temperature excursions outside thresholds
   - Geofence violations (early/late arrivals, unexpected stops)
   - Shock events > 3G
   - Battery levels < 20%

2. **Pattern Spotting**
   - Multiple Bees in same shipment showing similar anomalies (systemic issue)
   - Route-specific dead zones (planning opportunity)
   - Time-of-day patterns (operational insight)

3. **Customer Communication Triggers**
   - Temperature breach in active cold chain shipment
   - No GPS > 6 hours on high-value shipment
   - Multiple shock events on fragile goods

### Weekly Analysis

- Aggregate data completeness by customer/route
- Battery life projections and replacement scheduling
- Temperature compliance rates by lane/customer
- Shock event heat maps by handling locations

---

## 6. Key Takeaways

1. **Context matters** — Always correlate sensor data with shipment context (product type, route, carrier)

2. **Pattern recognition over single events** — One anomalous reading may be noise; patterns indicate real issues

3. **Battery is the limiting factor** — Most data gaps stem from power conservation or hardware failures

4. **Temperature is the #1 customer concern** — Cold chain visibility is the highest-value use case

5. **GPS confidence varies** — Indoor/urban environments will have reduced accuracy; set expectations accordingly

---

## Sources

- Decklar Bee Label Technical Specifications
- Field deployment experience from customer support tickets
- Cold chain industry standards (WHO, FDA guidelines)
- Cellular IoT best practices

**Next Learning Topic:** QBR Metrics & Customer Health Scoring Methodology
