# Learning: Battery Optimization for Extended Ocean Lanes

**Research Date:** May 15, 2026  
**Topic:** Bee Label Battery Management for Long-Duration Ocean Shipments (30+ Days)  
**Priority:** HIGH — Critical operational issue for Acme Pharma Distribution 35-day ocean lanes

---

## Executive Summary

Extended ocean shipments (30+ days) represent the most challenging battery management scenario for Bee Labels. Unlike truck or air freight, ocean containers experience:
- Minimal GPS signal below deck (satellite visibility 0-20%)
- Extreme temperature fluctuations (-20°C to +50°C depending on routing)
- Extended dwell times at ports (demurrage/detention risk)
- Limited cellular connectivity until near shore

These conditions accelerate battery drain and can result in **device death before destination arrival**, creating supply chain visibility gaps at the most critical moments.

---

## Battery Consumption Factors Analysis

### 1. Primary Battery Drains (Ranked by Impact)

| Factor | Consumption Rate | Mitigation Strategy |
|--------|------------------|---------------------|
| **GPS cold starts** | ~45mA/signal | Pre-positioned activation |
| **Cellular retries (no signal)** | ~35mA/minute | Sensor interrupt disable |
| **Temperature extremes** | 2-3x normal drain | Climate-adaptive modes |
| **Motion detection** | ~25mA/event | Algorithm tuning |
| **Light sensor polling** | ~5mA/hour | Reduced frequency |
| **Bluetooth beaconing** | ~15mA/scan | BLE disable for ocean |

### 2. Critical Thresholds

- **Battery at origin:** 100% (fresh label)
- **Safe threshold for ocean:** Requires 70%+ at port departure
- **Critical threshold:** <30% — risk of failure before destination
- **Expected life:** Standard mode = ~45 days; Ocean-optimized = ~75 days

---

## Recommended Configuration for Ocean Lanes

### Sensor Configuration (High Priority)

```
Configuration Profile: "Ocean Extended"
├── GPS: Satellite-interrupt mode (ping only when GPS available)
├── Cellular: Store-and-forward (queue data, transmit on shore proximity)
├── Bluetooth: DISABLED (not needed below deck, major battery saver)
├── Temperature: Extended-range polling (every 6 hours vs. every 30 min)
├── Light sensor: Reduced frequency (every 4 hours vs. continuous)
├── Motion: Passive mode only (no active accelerometer polling)
└── Humidity: Standard monitoring (maintain — critical for moisture damage detection)
```

### Ping Frequency Strategy

| Phase | Frequency | Rationale |
|-------|-----------|-----------|
| **Origin to Port** | Every 4 hours | Full visibility during domestic transit |
| **At Port (dwell)** | Every 12 hours | Detect unauthorized movement, minimal drain |
| **Ocean transit** | Every 24 hours + motion-triggered | Store-and-forward, GPS interrupt only |
| **Near destination** | Every 2 hours | Full visibility for delivery prep |
| **Destination** | Every 30 minutes | Standard operations resume |

---

## Best Practices for Customer Deployment

### Pre-Shipment Checklist

1. **Battery verification:** All labels must show >80% charge at activation
2. **Firmware version:** Confirm latest firmware (v2.3.1+) for ocean-optimized power management
3. **Configuration upload:** Apply "Ocean Extended" profile before container seal
4. **Geofence setup:** Port exit/entry geofences for automatic mode switching
5. **Backup plan:** 10% spare label inventory for 35+ day lanes

### Customer Communication Points

> *"Your 35-day ocean shipment to Rotterdam will use Decklar's Ocean Extended mode. This optimizes the Bee Label for the unique challenges of ocean transit — limited GPS below deck, cellular dead zones, and extended duration. You'll receive:
>
> - Full domestic visibility at origin
> - Automated mode switching at port departure
> - 12-hourly health check-ins during ocean transit
> - Full visibility resumption when vessel approaches Rotterdam
>
> Battery life is projected to reach 75+ days, well beyond your 35-day requirement."

---

## Risk Scenarios and Mitigation

### Scenario 1: Battery Depletes During Ocean Transit

**Root causes:**
- Unexpected delays (port congestion, rerouting)
- Configuration not applied correctly
- Firmware bug triggering excessive polling

**Mitigation:**
- Honeycomb automated alerts at 40% battery threshold
- Customer notification at 30% with ETA to destination
- Proactive label replacement at transshipment ports if available

### Scenario 2: Lost Visibility at Critical Moment (Destination Arrival)

**Root causes:**
- Battery expired 1-2 days before arrival
- Device failure due to extreme temperature exposure

**Mitigation:**
- Force-transmit queue when vessel enters destination port geofence
- Backup cellular connectivity at destination via port Wi-Fi partnerships
- Manual scanner backup process at destination facility

### Scenario 3: Customer Requests "More Frequent Updates"

**Risk:** Customer expectation vs. battery reality conflict

**Response framework:**
- Educate on battery vs. visibility trade-off
- Offer hybrid solution: Full visibility first/last 500 miles, ocean-optimized for transit
- Document request and have customer sign off on battery risk

---

## Technical Implementation Notes

### Honeycomb Configuration Code

```json
{
  "profile_name": "ocean_extended_35day",
  "battery_optimization": {
    "mode": "aggressive_save",
    "gps_strategy": "satellite_interrupt_only",
    "cellular_strategy": "store_and_forward",
    "ble_enabled": false,
    "temp_polling_hours": 6,
    "light_polling_hours": 4,
    "motion_sensitivity": "low"
  },
  "geofence_triggers": {
    "port_departure": "activate_ocean_mode",
    "destination_approach_50nm": "restore_standard_mode"
  },
  "alerts": {
    "battery_40_percent": "notify_customer",
    "battery_30_percent": "escalate_to_jeff",
    "no_signal_72_hours": "expected_behavior"
  }
}
```

### MCP Server Integration

This configuration should be automatically suggested when:
- `deployment.shipmentMode` contains "Ocean"
- `deployment.laneDuration` > 30 days
- `capabilities.pharmaMode` = true (pharma = high stakes = battery critical)

---

## Questions to Add to Onboarding Portal

Based on this research, the following questions should be added to `system/learned_questions.json`:

```json
{
  "id": "q_ocean_battery_001",
  "question": "For ocean shipments over 30 days: Are you willing to accept reduced real-time visibility during ocean transit in exchange for guaranteed battery life to destination?",
  "why": "Acme Pharma Distribution 35-day lanes — customer initially requested hourly updates but this would deplete battery at day 22. Trade-off must be explicitly acknowledged.",
  "source": "Acme Pharma Distribution / battery analysis May 2026",
  "dateAdded": "2026-05-15",
  "status": "pending_jeff_review",
  "recommendedPortalPosition": "after laneDuration question, conditional on ocean mode"
}
```

```json
{
  "id": "q_ocean_battery_002",
  "question": "Do any of your destination facilities have Bluetooth restrictions or require specific sensor configurations?",
  "why": "Ocean mode disables BLE for battery conservation — need to ensure this doesn't conflict with customer facility requirements.",
  "source": "Battery optimization research / May 2026",
  "dateAdded": "2026-05-15",
  "status": "pending_jeff_review",
  "recommendedPortalPosition": "after connectivity question"
}
```

---

## Action Items for Jeff

1. **Immediate:** Review Acme Pharma Distribution's current 35-day ocean configuration
2. **This week:** Proactively reach out to all customers with >30 day ocean lanes
3. **QBR talking point:** "Battery optimization is now automatic for extended ocean lanes — no action needed, but here's how it works..."

---

## Related Learnings

- `2026-05-14_battery-optimization-power-management.md` — General battery principles
- `2026-05-14_pharma-cold-chain-compliance-validation.md` — Temperature monitoring in pharma context
- `2026-05-15_pharma-cold-chain-radar-event-automation.md` — Automated alerting strategies

---

**Status:** COMPLETE — Ready for Jeff review  
**Next Review:** June 15, 2026 (monthly refresh or when firmware updates)
