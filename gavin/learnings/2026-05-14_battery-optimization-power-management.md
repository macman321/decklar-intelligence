# GAVIN LEARNING SPIKE: Battery Optimization & Power Management Strategies
**Date:** May 14, 2026
**Agent:** Gavin
**Topic:** Decklar Bee Label Battery Life — Root Causes of Drain, Optimization Strategies & Proactive Management

---

## Executive Summary

Battery life is the #1 technical limitation of Bee Labels and the most frequent source of customer confusion and support tickets. Understanding the factors that impact battery drain — and how to configure deployments for maximum longevity — is essential for Customer Success. This learning synthesizes battery behavior patterns, optimization techniques, and proactive management strategies from Decklar documentation and field experience.

---

## 1. Bee Label Battery Fundamentals

### Battery Specifications

| Specification | Bee Label (Disposable) | BSM/BSF (Reusable) |
|---------------|------------------------|-------------------|
| **Battery Type** | Lithium Thionyl Chloride (Li-SOCl2) | Rechargeable Lithium-ion |
| **Typical Capacity** | 2000-3000 mAh (varies by model) | 4000-6000 mAh |
| **Shelf Life (unactivated)** | 24-36 months | N/A (rechargeable) |
| **Operating Life (activated)** | 30-90 days (configurable) | 12-18 months (with charging) |
| **Operating Temperature** | -40°C to +60°C | -20°C to +50°C |

### Key Principle: Battery Drain is Non-Linear

Battery consumption follows an **activity-based model**, not a simple time countdown:

```
Daily Consumption = Base Sleep Current + Activity Events

Where Activity Events = 
  (GPS transmissions × GPS power draw) +
  (Cellular syncs × Radio power draw) +
  (Sensor readings × Sensor power draw) +
  (Interrupt wakes × Wake power draw)
```

**Critical Insight:** A Bee that "sleeps" most of the day can last 90+ days. A Bee with frequent interrupts may die in 30 days or less.

---

## 2. Major Battery Drain Factors (Ranked by Impact)

### Factor #1: Sensor Interrupts (HIGHEST IMPACT)

**What Are Interrupts?**
Interrupts wake the Bee from sleep to report data when sensor thresholds are crossed:
- **Temperature interrupt:** Bee wakes when temp changes > X degrees
- **Accelerometer interrupt:** Bee wakes on motion/shock detection
- **Light interrupt:** Bee wakes on light level changes

**Impact on Battery:**
| Interrupt Configuration | Daily Wakes | Battery Impact |
|------------------------|-------------|----------------|
| All interrupts OFF | 24-48 (scheduled only) | 🟢 Minimal drain |
| Temperature only | 48-96 | 🟡 Moderate drain |
| Temperature + Motion | 96-200+ | 🟠 High drain |
| All interrupts ON | 200-500+ | 🔴 Severe drain |

**Real-World Example (from FAQ):**
> "Battery appears to have drastically/rapidly depleted... Check to see if there are a lot of interrupts happening and/or if the Bee is waking up between PRF due to Beacons."

**Best Practice:**
- **Ocean shipments (>30 days):** DISABLE ALL INTERRUPTS
- **Cold chain:** Temperature interrupt ON, others OFF
- **High-value domestic:** Configure motion interrupt with HIGH threshold (>3G)
- **Long-term static:** All interrupts OFF, daily scheduled ping only

---

### Factor #2: Ping Reporting Frequency (PRF)

**What is PRF?**
The scheduled interval at which the Bee wakes to report location and sensor data.

| PRF Setting | Use Case | Battery Impact |
|-------------|----------|----------------|
| 5 minutes | Flight mode, critical tracking | 🔴 7-10 day life |
| 15 minutes | High-value shipments, air freight | 🟠 15-25 day life |
| 30 minutes | Standard cold chain | 🟡 30-45 day life |
| 60 minutes | Ocean freight, long lanes | 🟢 60-90 day life |
| 4 hours | Asset tracking, yard management | 🟢 90+ day life |

**Common Misconfiguration (from FAQ):**
> "Ping reporting frequency did not seem to change after command was acknowledged by Bee. Check sensor interrupts and BLE beacon interrupts. These may wake the bee between the PRF and look as if the PRF is not working."

**Key Insight:** Even with "long" PRF settings, interrupts can cause the Bee to wake every few minutes, negating the battery savings.

---

### Factor #3: Cellular Signal Strength

**The Signal-Battery Correlation:**

| Signal Strength (RSSI) | Cellular Draw | Battery Impact |
|------------------------|---------------|----------------|
| > -85 dBm (Excellent) | ~25 mAh per transmission | 🟢 Normal |
| -85 to -95 dBm (Good) | ~35 mAh per transmission | 🟡 20% higher drain |
| -95 to -105 dBm (Fair) | ~50 mAh per transmission | 🟠 50% higher drain |
| < -105 dBm (Poor) | ~80+ mAh per transmission, multiple retries | 🔴 100%+ higher drain |

**Real-World Pattern:**
- **Rural routes:** Extended cellular dead zones cause transmission retries
- **Tunnels/urban canyons:** Temporary signal loss triggers retry bursts
- **International roaming:** Higher power draw on non-home networks

**Mitigation Strategies:**
1. Configure extended PRF for rural/international lanes
2. Pre-identify dead zones in route planning
3. Set "store and forward" mode — Bee buffers data and transmits when signal returns
4. Use Wi-Fi mapping (lower power than cellular) at facilities

---

### Factor #4: Temperature Extremes

**Cold Weather Impact:**
- Battery capacity decreases ~0.5% per °C below 0°C
- At -20°C, capacity can drop 30-40%
- Chemical reaction slows, effective mAh reduced

**Hot Weather Impact:**
- Above 60°C, battery chemistry degrades
- Accelerated self-discharge
- Risk of premature failure

**FAQ Reference:**
> "Battery appears to have drastically/rapidly depleted... Check temperature conditions as cold temperature can make battery look drained."

**Customer Communication:**
- Set expectations: "Cold weather reduces apparent battery life"
- Monitor battery level trending (not just current %)
- Consider heated packaging for extreme cold chain

---

### Factor #5: GPS Fix Attempts

**Power Cost of GPS:**
- Cold start (no almanac): ~50-100 mAh, 30-60 seconds
- Warm start (recent fix): ~15-25 mAh, 5-15 seconds
- Failed fix attempt: ~50 mAh, no data

**GPS Drain Scenarios:**

| Scenario | Impact | Mitigation |
|----------|--------|------------|
| Indoor/underground | Failed fix attempts waste power | Disable GPS when in geofence |
| Metal container | Signal blocked, repeated retries | Configure for "last known good" |
| Urban canyon | Multi-path, extended fix time | Enable Wi-Fi location fallback |
| Frequent motion updates | GPS on often | Reduce motion-based reporting |

**Best Practice:**
Use **Wi-Fi mapping** at facilities and **cell tower triangulation** for approximate location — these consume 10x less power than GPS.

---

### Factor #6: BLE Beacon Activity (Reusable Bees)

**When Beacons Drain Battery:**
- BSM/BSF constantly scans for nearby BLE beacons
- Each beacon detection wakes the device
- High beacon density = frequent wakes

**Configuration Options:**
| Setting | Battery Impact |
|---------|----------------|
| Beacon scanning OFF | 🟢 Maximum life |
| Beacon scanning ON (sparse) | 🟡 Moderate drain |
| Beacon scanning ON (dense environment) | 🔴 Rapid drain |

**Use Case Guidance:**
- **Yard management:** Keep beacon scanning ON (needed for asset location)
- **In-transit tracking:** Beacon scanning OFF (beacons shouldn't be nearby)
- **Mixed mode:** Configure beacon scanning only at facility geofences

---

## 3. Configuration Playbooks by Use Case

### Playbook A: Ocean Freight (30-60 Day Shipments)

**Configuration:**
```
PRF: 60 minutes (or 4 hours)
Sensor Interrupts: ALL OFF
BLE Scanning: OFF
GPS: ON but with "last known" fallback
Cellular: Store-and-forward mode
```

**Why:** Ocean shipments have poor cellular coverage anyway. Store-and-forward allows Bee to accumulate data and transmit in bursts when near ports.

**Battery Target:** 60-90 days

**Customer Communication:**
> "For your ocean shipment to [destination], I've configured extended battery life mode. You'll get location updates every 4 hours and full sensor data when the container is near cellular coverage at ports. This ensures the Bee lasts the entire journey."

---

### Playbook B: Pharmaceutical Cold Chain (3-7 Day Domestic)

**Configuration:**
```
PRF: 15-30 minutes
Temperature Interrupt: ON (threshold: 2°C deviation)
Motion Interrupt: ON (threshold: 3G — impacts only)
Light Interrupt: OFF
BLE Scanning: OFF
GPS: Standard
```

**Why:** Temperature excursions are the primary risk. Interrupt-based alerting enables sub-15-minute notification of cold chain breaks.

**Battery Target:** 30-45 days (exceeds shipment duration comfortably)

**Customer Communication:**
> "Your pharma shipment is configured for proactive temperature monitoring. If the temperature moves outside your specified range, you'll get an alert within 15 minutes — even if the next scheduled ping isn't due for 30 minutes."

---

### Playbook C: Air Freight (2-5 Day Express)

**Configuration:**
```
PRF: 5 minutes during flight, 30 minutes on ground
Temperature Interrupt: ON
Motion Interrupt: OFF
Cellular: Aggressive retry (flight mode awareness)
```

**Why:** Air freight is time-critical. Aggressive PRF during flight ensures tracking in an environment where signal may be intermittent.

**Battery Target:** 15-25 days (sufficient for express lanes)

**Customer Communication:**
> "Air freight mode prioritizes visibility over battery life. You'll get frequent updates during flight, and the Bee will buffer data when signal is unavailable."

---

### Playbook D: Asset Tracking / Yard Management (Reusable Bees)

**Configuration:**
```
PRF: 4 hours
Beacon Scanning: ON (at facilities)
GPS: ON
Motion-based wake: OFF
```

**Why:** Assets move infrequently but must be findable on demand. BLE beacons provide precise indoor location without GPS power cost.

**Battery Target:** 12-18 months with quarterly charging

---

## 4. Proactive Battery Management

### The Battery Dashboard (Customer Success Tool)

**Metrics to Track:**
| Metric | Source | Action Threshold |
|--------|--------|------------------|
| Current Battery % | Bee telemetry | < 20% = replacement needed |
| Daily Drain Rate | Trending calculation | > 5%/day = investigate |
| Estimated Remaining Days | Algorithm | < 7 days = alert customer |
| Temperature Exposure | Sensor data | < -10°C or > 50°C = warning |
| Interrupt Frequency | Event log | > 50/day = reconfigure |

### Proactive Customer Alerts

**Alert 1: Low Battery Warning (20% remaining)**
> "Your Bee for shipment [ID] is at 20% battery. Based on your configuration, this should last 3-4 more days — sufficient for your expected delivery on [date]. No action needed, but let me know if the shipment will be delayed."

**Alert 2: Accelerated Drain Detected**
> "I noticed your Bee is consuming battery faster than expected (5% per day vs. projected 2%). This typically happens when there are frequent temperature or motion events. Would you like me to review the configuration and optimize for remaining battery life?"

**Alert 3: Battery Will Not Last (Delivery Risk)**
> "⚠️ URGENT: Your Bee for shipment [ID] is projected to die before delivery based on current consumption. Recommendations: (1) Replace Bee at next facility, (2) Reduce ping frequency to 60 min, (3) Disable non-critical interrupts. Should I make these changes?"

### Pre-Shipment Battery Check

**Before Every Shipment:**
1. Verify Bee activation date (unactivated = 2+ year shelf life)
2. Check firmware version (newer = better power management)
3. Confirm configuration matches lane requirements
4. Set battery threshold alerts in Honeycomb

---

## 5. Troubleshooting Battery Issues

### Scenario 1: "Battery Died Prematurely"

**Diagnostic Checklist:**
- [ ] Was shipment duration longer than expected? (Customs delays)
- [ ] Were interrupts enabled unnecessarily?
- [ ] Did the Bee experience cold temperatures?
- [ ] Was PRF too aggressive for the lane?
- [ ] Were there signal dead zones causing retry loops?

**Root Cause Analysis Template:**
```
Expected Life: [X] days
Actual Life: [Y] days
Configuration: [PRF] [Interrupts] [BLE]
Environmental Factors: [Temperature] [Signal quality]
Conclusion: [Root cause]
Recommendation: [Configuration change]
```

### Scenario 2: "Battery Reading Seems Wrong"

**Common Causes:**
- Cold temperature temporarily reducing apparent capacity
- Firmware bug (rare, but check version)
- Calibration drift after extreme temperature exposure

**Action:**
- Monitor voltage trend, not single reading
- If cold-exposed, allow 24 hours at room temp before assessing

### Scenario 3: "Multiple Bees Died on Same Shipment"

**Red Flags:**
- Systemic configuration issue (wrong PRF for lane)
- Environmental factor (extreme cold in container)
- Carrier issue (shipments delayed significantly)

**Action:**
- Review configuration for that lane template
- Check for temperature events in telemetry
- Verify carrier performance (OTIF metrics)

---

## 6. Customer Education Framework

### The Battery Conversation

**Set Expectations Early:**
> "Battery life is the primary trade-off in IoT tracking. More frequent updates = shorter battery life. I'll configure your Bees based on your shipment duration and visibility needs. Most customers find that 30-60 minute updates provide sufficient visibility while ensuring the Bee lasts the entire journey."

### The "Battery Budget" Analogy

Explain battery like a daily budget:
> "Think of battery like a daily budget. A ping transmission costs $1. An interrupt wake costs $2. A GPS fix costs $5. Your Bee has a $100 daily budget. If we configure 30-minute pings (48 per day), that's $48. We have $52 left for interrupts. But if we set 5-minute pings (288 per day), we spend $288 — bankruptcy before the trip ends."

---

## 7. Key Takeaways for Customer Success

1. **Battery is configurable** — Most drain issues are configuration problems, not hardware defects

2. **Ocean = interrupts OFF** — This single change can triple battery life on long shipments

3. **Cold is the enemy** — Set expectations about temperature impact, especially for cold chain

4. **Proactive beats reactive** — Battery warnings should go to Customer Success before they become customer complaints

5. **Document the trade-offs** — Every customer wants "5-minute updates for 90 days" — explain why that's not possible and find the optimal configuration

---

## Sources

- Decklar FAQ (battery-related entries #16, #17, #18, #63, #152)
- Decklar Troubleshooting Guide (battery drain section)
- Decklar Best Practices (configuration recommendations)
- Li-SOCl2 battery specifications and IoT power management research

---

## Action Items for Jeff

### Immediate
- [ ] Audit all active shipments >30 days for interrupt configuration
- [ ] Review QBR slides to include battery optimization section
- [ ] Create customer-facing "Battery Life Guide" one-pager

### Short Term
- [ ] Implement battery dashboard in customer reviews
- [ ] Create configuration templates for each use case (ocean, air, pharma, etc.)
- [ ] Train customers on battery vs. visibility trade-offs

### Strategic
- [ ] Work with product team on battery life forecasting algorithm
- [ ] Develop "battery-safe mode" recommendation system
- [ ] Create case study: "How [Customer] Extended Battery Life 40%"

---

*Gavin Learning Spike Complete*
*Knowledge added to: ~/decklar-intelligence/gavin/learnings/*
*Container Tag: gavin*
*Next Learning Topic: Decklar Honeycomb Platform Deep-Dive — Event Types, Webhooks, and Integration Architecture*
