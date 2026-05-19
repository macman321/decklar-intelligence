Decklar SOP Checklist
# Purpose
This document provides a structured, scenario-based approach to onboarding and deploying customer solutions. It ensures consistency, reduces errors, and captures best practices across all teams.
# How to Use
Follow each section in order
Do not skip steps
Use the correct shipment scenario
Capture outputs during onboarding
Update documents after deployment
# General Customer Setup/Getting-Started
Customer Name:
Account Manager:
Primary Use Case:
Required Environmental Data:
Success Criteria:
Account Type (Standard or Reseller):
Contacts & Roles:

Account Capabilities:
# Shipment Scenarios
Truck Only:
Number of Lanes:
Average Lane Duration:
Track one-way or round-trip:
Cold-chain:
Shipment-Start criteria:
Shipment-Complete criteria:
Environmental Visibility:

Communication Type:

Truck-Air-Truck:
Note: follow the ‘Truck’ checklist above as well
Use multi-model (i.e. track flight data/flight numbers/AWB):
Which airlines (check for approval):
Define Dynamic-Ping-Rate matrix:

Truck-Ocean-Truck:
Note: follow the ‘Truck’ checklist above as well
Enable Container Tracking:
Add required Custom Fields: Container / BOL
Duration of Ocean:
Define Dynamic-Ping-Rate matrix:
Turn off sensor interrupts:

Rail:
Dwell time
Signal gaps

Reusable Devices:
Charging:
Reset process:
Reverse logistics:

# Device Configuration
Device Type:
Firmware Version:
Interrupts:
Ping Reporting Frequency (PRF):
Sampling:
BLE/WiFi:
Activation Test (Ready-to-Ship):
Battery Check:
Device expiration (for one-time use):
Device account transfer:
# Pre-Go-Live
Activation instructions sent:
Device tested:
User roles defined:
User notifications defined:
Escalation path set:
# Post-Launch
Validate first 3 shipments:
Confirm alerts:
Confirm visibility:
Log issues:
# Decision Trees
Activation issues → check lighting
No communication → check battery/config
Missing data → check backfill/reset
# Continuous Improvement
Log issues
Update checklist
Improve best practices
Update FAQ

| --- | --- | --- |
| Contact | Role | Email |
|  |  |  |
|  |  |  |
|  |  |  |


| --- | --- | --- |
| Capabilities | Enable | Notes |
| Shipments |  |  |
| Waypoint Dwell Time |  | Check this to enable waypoint dwell time |
| Public Shipping Tracking |  | Public tracking enables shipments progress sharing via URL. Check this if you want to enable public tracking. |
| Public Waypoint Tracking |  | Public waypoint tracking enables sharing a link to track a specific waypoint. Check this if you want to enable waypoint-specific public tracking links. |
| Waypoint Readiness Alert on Shipment Start |  | When enabled, an email is automatically sent at shipment start to the users mapped to each waypoint, informing them that the shipment has started so they can prepare accordingly. Waypoint-level users are configured during shipment creation or edit. |
| External Shipment Feed |  | Check this to enable Depletion Graph button on shipment details page for external shipment feed |
| Capture reason for edit Shipment |  | Check this box to enable capture 'reason for change' for any shipment modification. |
| e-Proof of Delivery |  | Check this box to enable 'e-Proof of Delivery'. The minimum value for token expiry is 12 hours. |
| e-Proof of Departure |  | Check this box to enable 'e-Proof of Departure'. The minimum value for token expiry is 12 hours. |
| Security check |  | Check this box to enable Security check for shipment locations |
| Pharma Shipment |  | Not sure if we still use this??? |
| Shipment Completion Trigger |  | Check this to mark a shipment as completed upon scanning the LocationBeacon at destination |
| Shipment Tracking |  | Shipment tracking enables the creation of sensor-based, sensorless, or both types of shipments. By default, the creation of sensor-based shipments is allowed. |
| Detention and Demurrage |  | Check this to enable Detention and Demurrag |
|  |  |  |
| Inventory |  |  |
| Access Control |  | Check this to enable access control/visibility access |
| Asset Flow |  | Check this to enable asset flow access |
| Inventory Report Params |  | To get dwell timezone formatted value |
|  |  |  |
| Other Features |  |  |
| Vehicle Tracking |  | Check this to enable vehicle tracking features |
| Container tracking |  | Check this to enable container tracking features |
| Restrict Application Visibility |  | Use this option to decide the visibility of apps/application for different roles |
|  |  |  |
| Custom Email Alerts |  |  |
| Email Templates |  | Check this to enable custom email templates access |


| --- | --- | --- | --- |
| Sensor | Enabled | Threshold | Interrupt |
| Temperature |  |  |  |
| Humidity |  |  |  |
| Ambient light |  |  |  |
| Shock |  |  |  |


| --- | --- |
| Comm. Type | Enable |
| GPS |  |
| Wi-Fi |  |
| BLE |  |
