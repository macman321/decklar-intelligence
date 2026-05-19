# Best Practices Updates

*This is a living document. Add new best practices as they are validated.*

## Battery & Bee Config
- Match ping frequency to lane duration.
- Disable unnecessary sensors and communication (Wi-Fi/BLE).
- Utilize Dynamic PRF at waypoints to save battery.

## Lane Strategy
- Build a "Risky Shipment" automated report to identify lanes needing adjustments.
- Optimize geofences after initial data collection (start with larger geofences, then tighten).
- Use Wi-Fi mapping data to snap geo-location to known addresses.

## Accuracy
- Configure Wi-Fi location mapping.
- For pharma shipments: disable non-temperature events (shock/ambient light) to avoid self-heating fluctuations.

## Activation
- Set up Ready-to-Ship to ensure good battery before activation.
- Activate in light and let sit for minimum 10 seconds.

## Testing
- Use the Simulator tool (https://smartbee-staging.decklar.com) to run through customer scenarios.
- Test configs before deployment; verify data flow for API/webhook integrations.
- Confirm API limits are substantial for expected scale.

## Customer Communication
- Set expectations early about the initial "pipe-cleaning" phase.
- Ensure Bee config and lanes are 99% correct before go-live; pipe-cleaning is for minor adjustments.

## General
- Always confirm with customer during onboarding: "Do any of your facilities have Bluetooth restrictions?"
- Verify expiration dates are <9 months before shipping.
- Build 20% buffer into customer contracts for reverse-logistics use cases.

