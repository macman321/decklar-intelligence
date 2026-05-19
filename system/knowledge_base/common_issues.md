# Decklar Common Issues — Knowledge Base

> Maintained by the Decklar AI Intelligence System. Updated from real customer calls and support tickets.

## Connectivity Issues

### Device Not Reporting
- **Symptom:** Device shows as "inactive" in Honeycomb, no location updates
- **Common Causes:**
  1. Device not activated before shipment (most common)
  2. Cellular coverage gap — especially in rural areas or international transit
  3. BLE interference if customer site prohibits Bluetooth
  4. Device battery expired (check device_expiry)
- **Resolution:** Verify activation location, check device health dashboard, confirm cellular carrier coverage map

### GPS Drift / Inaccurate Location
- **Symptom:** Device showing location miles from actual position
- **Common Causes:** Indoor parking, dense urban canyons, multi-story facilities
- **Resolution:** Enable Wi-Fi scanning if available; BLE anchors for indoor tracking

## Cold Chain Monitoring

### Temperature Threshold Alerts Not Firing
- **Symptom:** Temperature excursions not triggering alerts
- **Common Causes:**
  1. Thresholds set too wide (e.g., -40°C to +70°C)
  2. Alert rules not configured in Honeycomb
  3. Sensor calibration drift
- **Resolution:** Set tighter thresholds (typically 2-8°C for pharma), verify alert routing, schedule sensor recalibration

### Humidity Sensor Saturated
- **Symptom:** Humidity readings stuck at 100% or erratic
- **Common Causes:** Direct water exposure, condensation inside device enclosure
- **Resolution:** Check device seal integrity; consider IP rating upgrade for wet environments

## Device-Specific Issues

### Bee Label (One-Time Use)
- **Battery Life:** 12-18 months from manufacture. Always check expiry before deployment.
- **Activation:** Must be scanned or manually activated at origin. Unactivated labels don't report.
- **Shock Sensor:** Disabled by default. Enable only if customer explicitly needs impact detection.

### Reusable Bees
- **Charging:** Require dock at origin facility. Confirm charging infrastructure before deployment.
- **Return Logistics:** Plan for reverse logistics. Customers often forget to return devices.
- **Pairing:** BLE pairing required at activation. Not viable if BLE is prohibited.

## Platform / Portal Issues

### User Access Problems
- **Symptom:** Customer users can't log in or see shipments
- **Common Causes:**
  1. Users not added to account before device activation
  2. Incorrect role assignment (viewer vs. admin)
  3. SSO misconfiguration
- **Resolution:** Pre-provision users during onboarding; verify role matrix; check SSO certificate validity

### Alert Fatigue
- **Symptom:** Customer disables alerts due to too many false positives
- **Resolution:** Tune geofence radius, set business-hours-only alerts, create alert severity tiers

## Deployment Gotchas

### Geofence Trigger Timing
- If geofence radius is too small, trucks may trigger "departure" while still loading
- If too large, "departure" fires before actual departure
- **Recommended:** 500m-1km radius for industrial facilities; 200m for tight urban sites

### Device Count Mismatch
- Always add devices to the account in Honeycomb BEFORE attaching to shipments
- Unregistered devices report but don't show in customer portal
- **Best Practice:** Do a device inventory reconciliation before go-live

### Multi-Modal Handoffs
- Ocean → Truck handoffs are the most common failure point
- Device may be out of cellular range during ocean transit
- **Mitigation:** Configure waypoint alerts at ports; use container tracking as backup

## Patterns from Real Calls

| Pattern | Frequency | Mitigation |
|---------|-----------|------------|
| BLE prohibited | ~30% of enterprise accounts | Default to cellular-only devices |
| Battery concern for long dwell | ~20% of industrial | Confirm dwell time; use extended-life labels |
| Public tracking needed | ~40% of logistics | Enable public tracking links from day 1 |
| Device expiry surprise | ~15% of first deployments | Check expiry 2 weeks before go-live |
| Alert fatigue after week 1 | ~25% of new accounts | Set up alert tuning call at week 1 |
