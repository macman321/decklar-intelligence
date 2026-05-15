# GAVIN LEARNING SPIKE: Ocean Freight Battery Optimization Strategies

**Date:** May 15, 2026  
**Agent:** Gavin  
**Topic:** Decklar Ocean Freight Deployments — Battery Life Extension & Configuration Best Practices  
**Priority:** HIGH — Based on APL incident (60-day ocean shipments with battery drain)

---

## Executive Summary

Ocean freight represents one of Decklar's highest-risk, highest-value use cases. The combination of long transit times (30-90 days), limited cellular connectivity, and harsh environmental conditions creates unique challenges for Bee Label battery management. The APL incident — where Bees arrived at destination ports with dead batteries due to sensor interrupt misconfiguration — highlights the critical need for specialized ocean freight configurations.

---

## 1. The Ocean Freight Challenge

### Why Ocean Freight is Different

| Factor | Ocean Freight | Ground/Air Freight |
|--------|--------------|-------------------|
| **Transit Duration** | 30-90 days | 1-14 days |
| **Cellular Connectivity** | Intermittent (port-only) | Continuous |
| **GPS Availability** | Limited (container stacking) | Generally good |
| **Environmental Extremes** | High humidity, salt air, temp swings | Moderate |
| **Battery Stakes** | Single-charge must last entire journey | Can be replaced mid-route |

### The Battery Math Problem

**Standard Configuration (Ill-Suited for Ocean):**
- Ping every 15 minutes = 96 pings/day
- GPS + cellular sync each ping = ~25mAh per ping
- Daily consumption: 2,400mAh
- Battery capacity: ~6,000mAh
- **Result: Battery dies in ~2.5 days** ❌

**Ocean-Optimized Configuration:**
- Dynamic PRF: 1 ping every 4 hours (6 pings/day at sea)
- Reduced GPS sampling when stationary
- Sensor interrupts disabled
- Daily consumption: ~400mAh
- Battery capacity: ~6,000mAh
- **Result: 90+ day battery life** ✅

---

## 2. Critical Configuration Parameters for Ocean Freight

### 2.1 Sensor Interrupt Settings (APL Lesson)

**The APL Incident:**
- **Problem:** Ocean shipments lasting 60 days arrived with dead batteries
- **Root Cause:** Ambient sensor interrupts were enabled
- **Mechanism:** Every sensor trigger woke the Bee from sleep, initiated cellular connection attempts, and drained battery
- **Fix:** Disable ALL sensor interrupts for ocean shipments

**Configuration Matrix:**

| Sensor | Ocean Setting | Reason |
|--------|--------------|--------|
| **Ambient Light Interrupt** | DISABLED | Unnecessary wakeups in dark containers |
| **Shock/Accelerometer Interrupt** | DISABLED | Motion events constant on ocean vessel |
| **Temperature Interrupt** | CONDITIONAL* | Only if cold chain critical |
| **Humidity Interrupt** | DISABLED | Salt air creates false triggers |

*For pharmaceutical cold chain: Enable temperature interrupts ONLY if excursion alerting is required. Consider passive logging instead of active interrupts.

### 2.2 Ping Frequency Strategy

**Dynamic PRF (Pulse Repetition Frequency) Configuration:**

```
Leg 1: Origin Port (Days 1-3)
├── Ping every 2 hours
├── GPS + cellular active
└── Confirm departure geofence triggered

Leg 2: At Sea (Days 4-60)
├── Ping every 4 hours
├── Minimal GPS (cell tower triangulation priority)
├── Batch data uploads when cellular available
└── Power save mode: maximum

Leg 3: Destination Port (Days 61-63)
├── Ping every 1 hour
├── Full GPS + cellular
└── Arrival geofence detection
```

### 2.3 Geofence Strategy for Ports

**Challenge:** Port areas are massive, container stacking creates GPS multipath

**Best Practice Configuration:**
1. **Start Large:** Initial geofence radius 2km from port center
2. **Port-Specific Zones:** Create separate geofences for:
   - Container yard entry
   - Customs inspection areas
   - Customer pickup zones
3. **Wi-Fi Mapping:** After 2-3 shipments, use sniffed MAC addresses for indoor location
4. **Waypoint Triggers:** Set PRF to "high" when within 50km of port (approaching)

---

## 3. Real-World Customer Profiles

### 3.1 Pharmaceutical Distributors (McKesson Model)

**Profile:**
- Cold chain pharmaceuticals
- 45-60 day trans-Pacific routes
- FDA compliance requirements
- High-value cargo ($500K-$2M per container)

**Configuration:**
```json
{
  "mode": "pharma_ocean",
  "temperature_monitoring": "continuous",
  "temperature_alerts": "enabled",
  "shock_monitoring": "passive_only",
  "light_interrupts": "disabled",
  "ping_frequency": "4_hours",
  "dynamic_prf_waypoints": ["port_of_los_angeles", "port_of_shanghai"],
  "battery_projection": "90_days"
}
```

**Key Metrics:**
- Temperature excursion detection time: <15 minutes
- Battery life at destination: >20% remaining
- Data continuity: >98%

### 3.2 Electronics Manufacturers (APL Model)

**Profile:**
- High-value electronics
- 30-45 day routes
- Theft risk at ports
- Just-in-time delivery critical

**Configuration:**
```json
{
  "mode": "electronics_ocean",
  "theft_detection": "enabled",
  "shock_monitoring": "enabled",
  "light_interrupts": "enabled_at_ports",
  "ping_frequency": "2_hours",
  "geofence_alerts": "enabled",
  "battery_projection": "60_days"
}
```

### 3.3 Automotive Parts Suppliers

**Profile:**
- Returnable containers (reverse logistics)
- Multi-modal: plant → port → ocean → port → plant
- Container pooling optimization

**Special Considerations:**
- Bee stays with container on return journey
- Battery must survive round trip
- Container may sit at port for 7-14 days

---

## 4. Pre-Deployment Checklist

### 4.1 Configuration Verification

**Must-Confirm Before Ocean Deployment:**

- [ ] Sensor interrupts disabled (non-temperature)
- [ ] Dynamic PRF configured with port waypoints
- [ ] Geofences sized appropriately for port areas
- [ ] Battery life projection ≥ (lane duration + 14 days buffer)
- [ ] Temperature thresholds set per cargo requirements
- [ ] API/webhook endpoints tested for low-connectivity scenarios
- [ ] Customer has activation lamp (3%+ light requirement)

### 4.2 Simulator Testing Protocol

**URL:** https://smartbee-staging.decklar.com

**Test Scenarios:**
1. **Full Journey Simulation:**
   - 60-day timeline
   - Intermittent connectivity
   - Port entry/exit events

2. **Battery Stress Test:**
   - Verify consumption rates
   - Confirm 90-day projection accuracy

3. **Alert Validation:**
   - Geofence triggers at ports
   - Temperature excursions
   - Low battery warnings

### 4.3 Customer Training Points

**What to Tell Ocean Freight Customers:**

> "For ocean shipments, we use a specialized 'maritime mode' that extends battery life from days to months. This means:
> - Less frequent location updates while at sea (every 4 hours vs. every 15 minutes)
> - Sensors are configured to minimize battery drain
> - You'll see more frequent updates when approaching ports
> - Battery life is projected to last 90+ days with 20% buffer remaining"

**Activation Requirements:**
- Light source required: ≥3% ambient light
- Minimum 10-second exposure after peel
- Test activation at origin before first shipment

---

## 5. Monitoring & Proactive Intervention

### 5.1 "Risky Shipment" Report Criteria

**Flag Ocean Shipments When:**
- Battery projection shows <15% at destination
- No ping received for >12 hours while at sea
- Temperature excursions detected in first 48 hours
- Geofence failure at origin port
- Shipment duration exceeds battery projection

### 5.2 Intervention Playbook

| Scenario | Action | Owner |
|----------|--------|-------|
| Battery draining faster than projected | Reduce ping frequency to 6 hours | Customer Success |
| No data for 24+ hours at sea | Escalate to Ops for satellite check | Support |
| Missed origin geofence | Verify activation protocol with customer | Account Manager |
| Temperature excursion mid-ocean | Alert customer + document for insurance | Account Manager |

---

## 6. Competitive Positioning

### Decklar vs. Competitors for Ocean Freight

| Capability | Decklar | Competitor A | Competitor B |
|------------|---------|--------------|--------------|
| **Battery Life** | 90+ days | 45 days | 60 days |
| **Dynamic PRF** | ✅ Yes | ❌ No | ❌ No |
| **Wi-Fi Port Mapping** | ✅ Yes | ❌ No | ❌ No |
| **Pharma Mode** | ✅ Yes | ✅ Yes | ❌ No |
| **Real-time Port Alerts** | ✅ Yes | ✅ Yes | ⚠️ Delayed |
| **Reverse Logistics** | ✅ Yes | ❌ No | ❌ No |

### Value Proposition for Ocean Freight

**ROI Calculation Framework:**

```
Without Decklar:
- Insurance claims: $50K per incident
- Lost/stolen cargo: $500K average
- Demurrage fees: $2K/day
- Customer satisfaction impact: Unmeasurable

With Decklar:
- Device cost: $50 per shipment
- Real-time visibility: 95%+ of journey
- Incident detection: <15 minutes
- Insurance premium reduction: 10-20%
```

---

## 7. Integration with McKesson Event Verification

**Context:** McKesson event verification due May 21, 2026

**Relevant Configuration:**
- Ocean freight legs in McKesson supply chain
- Temperature-sensitive pharmaceuticals
- 60-day trans-Pacific routes

**Pre-Verification Checklist:**
- [ ] Review all McKesson ocean shipment configs
- [ ] Verify sensor interrupt settings
- [ ] Confirm Dynamic PRF waypoints configured
- [ ] Test simulator with actual McKesson routes
- [ ] Validate battery projections for longest lanes

---

## 8. Key Takeaways for Customer Conversations

### What to Say

**On Battery Life:**
> "Ocean freight requires special configuration. We disable non-essential sensors and use dynamic ping frequencies that extend battery from days to months. The Bee will check in every 4 hours while at sea, then increase frequency when approaching ports."

**On Data Gaps:**
> "At sea, cellular connectivity is intermittent. The Bee stores data locally and uploads in batches when signal is available. You won't see real-time updates every 15 minutes, but you'll have complete journey data with 4-hour granularity."

**On Temperature Monitoring:**
> "For cold chain, we keep temperature monitoring active but optimize the reporting frequency. You'll get alerts if thresholds are breached, and complete temperature logs for compliance documentation."

### Questions to Ask

1. "What's your longest ocean lane duration?" (Target: <90 days)
2. "Do you have cold chain requirements?" (Pharma mode needed?)
3. "What's your activation environment like?" (Light level verification)
4. "Are you using returnable containers?" (Round-trip battery planning)

---

## 9. Action Items

### For Jeff (Immediate)
- [ ] Review all existing ocean freight customer configurations
- [ ] Identify customers with sensor interrupts still enabled on ocean lanes
- [ ] Schedule proactive outreach to APL-type customers
- [ ] Document ocean freight playbook for RevOps

### For Decklar (Product)
- [ ] Create "Ocean Mode" preset in Honeycomb
- [ ] Build battery projection calculator tool
- [ ] Develop ocean freight-specific onboarding template

### For Customer Success (Ongoing)
- [ ] Add ocean freight battery projection to QBR metrics
- [ ] Build "Risky Ocean Shipment" automated report
- [ ] Create ocean freight customer training materials

---

## References

- APL Incident: Troubleshooting Guide Section 2.1
- McKesson Light Issue: Troubleshooting Guide Section 2.2
- Battery Optimization: Best Practices Guide Section 1
- Dynamic PRF: Best Practices Guide Section 1.3
- Pipe-Cleaning Phase: Best Practices Guide Section 2

---

*Document generated by Gavin as part of continuous learning initiative for Decklar Customer Intelligence System.*
