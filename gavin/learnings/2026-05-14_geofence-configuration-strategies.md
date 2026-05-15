# Learning Spike: Geofence Configuration Strategies & Best Practices
**Date:** May 14, 2026  
**Agent:** Gavin  
**Topic:** Advanced Geofence Design for Optimal Shipment Tracking

---

## Executive Summary

Geofences are the invisible boundaries that trigger shipment starts and completions in Decklar's Honeycomb platform. Properly configured geofences are the difference between seamless automatic tracking and frustrating manual interventions. This learning spike distills configuration patterns from successful deployments and common failure modes.

---

## 1. Geofence Fundamentals

### What Geofences Do
- **Origin Geofence**: Triggers shipment start when Bee exits
- **Destination Geofence**: Triggers shipment completion when Bee enters
- **Waypoint Geofences**: Intermediate points for multi-modal tracking
- **Alert Geofences**: Notification triggers for critical locations (ports, customs)

### Geofence Trigger Types

| Trigger Type | Use Case | Decklar Setting |
|--------------|----------|-----------------|
| **Exit Only** | Origin - shipment starts when leaving | `trigger: exit` |
| **Enter Only** | Destination - shipment ends when arriving | `trigger: enter` |
| **Enter + Exit** | Waypoints - track dwell time at handoffs | `trigger: both` |
| **Dwell** | Extended stops - detention/demurrage alerts | `trigger: dwell, min_time: 4h` |

---

## 2. Radius Sizing Strategy

### The Goldilocks Problem
- **Too Small (< 100m)**: Missed triggers due to GPS inaccuracy, especially in urban/indoor environments
- **Too Large (> 1000m)**: False triggers from nearby traffic, shared facilities
- **Just Right**: Account for GPS accuracy while avoiding false positives

### Recommended Radius by Environment

| Environment | Recommended Radius | Rationale |
|-------------|---------------------|-----------|
| Rural/Highway | 300-500m | Good GPS accuracy, minimal nearby facilities |
| Urban Warehouse | 200-400m | GPS interference from buildings |
| Port/Terminal | 400-600m | Large facilities, shared yards |
| Airport/Air Cargo | 500-800m | Multi-tenant facilities, GPS challenges |
| Indoor/Underground | N/A - use Wi-Fi mapping | GPS unreliable; rely on MAC address sniffing |

### The "Shrinking Geofence" Pattern

**Best Practice**: Start larger, then shrink based on actual data.

```
Phase 1 (Week 1-2): 500m radius at destination
↓ Review actual GPS tracks
Phase 2 (Week 3-4): Shrink to 300m based on data
↓ Continue monitoring
Phase 3 (Ongoing): Final 200m after pattern validation
```

**Why This Works**:
- Prevents missed completions during pipe-cleaning phase
- Uses real data to identify actual arrival patterns
- Avoids false triggers while ensuring coverage

---

## 3. Common Geofence Failure Patterns

### Pattern 1: The "Drive-By" Miss
**Symptom**: Shipment doesn't auto-complete despite arrival
**Root Cause**: Driver parks outside geofence radius (street vs. dock)
**Solution**: 
- Review actual GPS tracks for where trucks typically stop
- Expand radius to include street parking areas
- Or: Add secondary "street-side" geofence

### Pattern 2: The "Early Trigger"
**Symptom**: Shipment completes while still in transit nearby
**Root Cause**: Geofence overlaps highway or adjacent facility
**Solution**:
- Shrink radius to avoid highways
- Use polygon geofences (not circular) to follow facility boundaries
- Add "approach direction" logic if platform supports it

### Pattern 3: The "Urban Bounce"
**Symptom**: Multiple false exit/enter events in city center
**Root Cause**: GPS multi-path reflection in urban canyons
**Solution**:
- Increase dwell time requirements (5-10 min before trigger)
- Lower radius in dense urban areas (counter-intuitive but effective)
- Enable Wi-Fi mapping for indoor location confirmation

### Pattern 4: The "Port Confusion"
**Symptom**: Ocean shipments complete at wrong port or not at all
**Root Cause**: Multiple adjacent terminals; GPS inaccurate near water
**Solution**:
- Use larger radius (800m+) for ocean terminals
- Configure waypoint geofences at port entry
- Set expectations: ocean shipments often require manual completion

---

## 4. Multi-Modal Geofence Chains

### Truck → Air → Truck Pattern

```
Origin Warehouse [Exit Trigger]
    ↓
Departing Airport [Waypoint - Exit Trigger]
    ↓
Arriving Airport [Waypoint - Enter Trigger]
    ↓
Destination Warehouse [Enter Trigger - Completion]
```

**Key Configuration**:
- Enable **Dynamic PRF** at airports (increased ping frequency)
- Set waypoint geofences at cargo terminals, not passenger terminals
- Account for customs delays - don't auto-complete at arrival airport

### Truck → Ocean → Truck Pattern

```
Origin Facility [Exit Trigger]
    ↓
Departing Port [Waypoint - Exit Trigger]
    ↓
Ocean Transit [Low-frequency mode, no geofences]
    ↓
Arriving Port [Waypoint - Enter Trigger]
    ↓
Customs Hold [Alert Geofence - notification only]
    ↓
Destination Facility [Enter Trigger - Completion]
```

**Critical Considerations**:
- Disable sensor interrupts during ocean transit (battery preservation)
- Ocean shipments rarely auto-complete due to port complexity
- Set customer expectations: port arrivals often need manual completion

---

## 5. Advanced Configuration Patterns

### Pattern: The "Buffer Zone"

For high-value or time-sensitive shipments, use nested geofences:

```
Outer Geofence (500m): Alert "Approaching destination"
Inner Geofence (200m): Trigger shipment completion
```

**Benefits**:
- Proactive notifications to receiving teams
- Reduces dwell time at destination (faster unloading)
- Provides early warning for SLA compliance

### Pattern: "Shift-Aware" Geofences

For facilities with dock scheduling:

```
If arrival_time between 06:00-18:00:
    Use standard geofence
Else:
    Alert "After-hours arrival" + hold completion
```

**Implementation**: Requires API integration or webhook processing

### Pattern: "Shared Facility" Disambiguation

When multiple customers share a distribution center:

```
Option 1: Separate geofences per customer door
Option 2: Single geofence + Bee Label serial validation
Option 3: Completion at facility exit (reverse logic)
```

**Recommendation**: Option 1 when possible; Option 3 for high-volume shared facilities

---

## 6. Wi-Fi Mapping Integration

### When GPS Fails, Wi-Fi Saves

**Use Cases for Wi-Fi Location Mapping**:
- Indoor warehouses (GPS unreliable)
- Underground loading docks
- Urban facilities with poor satellite visibility
- Multi-story buildings (GPS can't distinguish floors)

### Wi-Fi Mapping Best Practices

1. **Enable MAC Address Sniffing**
   - Bees capture nearby Wi-Fi beacon MAC addresses
   - Honeycomb matches to known location database
   - Accuracy: 10-50m vs. 100-500m for GPS

2. **Build the Map Gradually**
   - First 5-10 shipments: "Learning mode" - collect MAC addresses
   - Week 2+: Map enables location snapping
   - Month 2+: High accuracy for indoor positioning

3. **Maintain the Map**
   - Wi-Fi routers change (retail locations especially)
   - Plan quarterly MAC database updates
   - Monitor for location accuracy degradation

---

## 7. Configuration Checklist by Deployment Type

### Standard Domestic Trucking

- [ ] Origin geofence: 300m radius, exit trigger
- [ ] Destination geofence: 300m radius, enter trigger
- [ ] No waypoints (unless > 500 mile lane)
- [ ] Completion expectation: > 95% auto-complete

### Cross-Border (US-Canada-Mexico)

- [ ] Origin geofence: 300m radius
- [ ] Border crossing waypoint: 500m radius, enter+exit
- [ ] Customs facility waypoint: 400m radius, dwell trigger (2h)
- [ ] Destination geofence: 300m radius
- [ ] Completion expectation: 70-80% auto-complete (customs delays common)

### Ocean Freight

- [ ] Origin facility: 300m radius, exit trigger
- [ ] Departure port: 600m radius, waypoint exit
- [ ] Arrival port: 800m radius, waypoint enter (no completion)
- [ ] Destination facility: 300m radius, enter trigger
- [ ] Completion expectation: 40-60% auto-complete (manual completion normal)

### Air Freight

- [ ] Origin facility: 300m radius
- [ ] Departing airport cargo terminal: 500m radius, waypoint
- [ ] Arriving airport cargo terminal: 500m radius, waypoint
- [ ] Destination facility: 300m radius
- [ ] Enable Dynamic PRF at airports
- [ ] Completion expectation: 80-90% auto-complete

### High-Security/High-Value

- [ ] Enable "Buffer Zone" pattern (alert + completion geofences)
- [ ] Add checkpoint waypoints every 200 miles
- [ ] Configure unauthorized stop alerts
- [ ] Enable real-time webhook notifications
- [ ] Set 15-minute dwell time before completion (prevents theft)

---

## 8. Metrics to Track

### Geofence Performance KPIs

| Metric | Target | Action if Below Target |
|--------|--------|------------------------|
| Auto-Completion Rate | > 95% | Review geofence sizing |
| False Trigger Rate | < 2% | Shrink overlapping geofences |
| Missed Completion Rate | < 3% | Expand or relocate geofences |
| Average Time to Complete | < 15 min | Optimize radius and location |
| GPS Accuracy at Trigger | < 100m HDOP | Review for interference patterns |

### Monthly Review Questions

1. Which lanes have < 90% auto-completion?
2. Are there geographic patterns to failures (specific facilities, regions)?
3. Have any facilities changed layout (new construction, parking reconfiguration)?
4. Are seasonal patterns affecting GPS accuracy (tree canopy, weather)?
5. Which customers need geofence adjustments based on recent data?

---

## 9. Customer Communication Templates

### Setting Expectations on Geofences

**For New Deployments:**
> "We'll configure geofences at 500m initially, then optimize to 300m after your first few shipments. This ensures we catch all completions while we learn your facilities' actual GPS patterns. Expect 100% auto-completion after the pipe-cleaning phase."

**When Manual Completion is Normal:**
> "Ocean shipments often require manual completion because port facilities are large and GPS can be unreliable near water. Your shipment is still being tracked - you'll see all the location data - but you may need to click 'Complete' when it arrives at the destination facility."

**Explaining Wi-Fi Mapping:**
> "GPS gets us to the building, but Wi-Fi mapping gets us to your specific dock. After 5-10 shipments, we'll have mapped the Wi-Fi beacons in your facility, and accuracy improves dramatically for indoor locations."

---

## 10. Action Items for Jeff

### Immediate (This Week)
- [ ] Audit current customer geofence radii - any > 1000m or < 100m?
- [ ] Identify ocean freight customers - verify completion expectations set
- [ ] Check for "shared facility" conflicts in recent deployments

### Short-Term (Next 30 Days)
- [ ] Create geofence sizing calculator (input: facility type, output: recommended radius)
- [ ] Build "geofence health" dashboard for QBRs
- [ ] Document 3 "shrinking geofence" case studies from successful deployments

### Strategic (Next Quarter)
- [ ] Propose polygon geofence feature (vs. circular) to product team
- [ ] Develop "Smart Geofence" auto-sizing based on historical GPS data
- [ ] Create industry-specific geofence templates (pharma, retail, automotive)

---

## Key Takeaways

1. **Start large, shrink based on data** - The "shrinking geofence" pattern prevents early missed completions

2. **Environment drives sizing** - Urban/indoor needs different approach than rural/highway

3. **Multi-modal needs waypoints** - Air and ocean shipments require intermediate geofences

4. **Wi-Fi fills GPS gaps** - Indoor accuracy comes from MAC address mapping, not satellites

5. **Set realistic expectations** - Ocean and cross-border shipments will never achieve 95% auto-completion

6. **Geofences require maintenance** - Facilities change, accuracy degrades, review quarterly

---

*Learning captured by Gavin | Decklar Customer Intelligence System*  
*Next topic recommendation: "Webhook Integration Patterns for Real-Time Visibility"*
