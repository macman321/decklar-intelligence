Decklar Best Practices Guide
# Purpose
Define optimal deployment strategies to maximize performance and customer satisfaction (Pipe-Clean). Think, “Customer has launched, we started to collect data, how do we optimize and provide best experience”
# Battery & Bee Config
Match ping frequency to lane duration
Disable unnecessary sensors and communication (Wi-Fi/BLE)
Find where to utilize Dynamic PRF at waypoints to save battery
# Lane Strategy
Be proactive to help with a customer’s lane health.
Build a “Risky Shipment” automated report to identify lanes which might need adjustments (i.e. not auto competing, battery is very low at completion)
Work with customer to adjust locations and templates.
Find key waypoints that can be used for Dynamic PRF to save battery which will enable customers to have longer lanes.
Optimize location Geofences. A lot of times at the start of a customer launch, we don’t know the accuracy of the area. So, we will pick larger Geofence. After a few of the lane’s shipments complete, we now have data to make the proper size geofence.
After a few bees have gone through the lane, we now have Wi-Fi mapping data (sniffed MAC addresses). Doing this is snap the geo-location of the bee to the location’s address (if a bee sniffed the WiFi’s mapped MAC address again).
# Accuracy
Configure Wi-Fi location mapping
Best practice for pharma shipments: disable non-temperature events (e.g., shock/ambient light) to avoid self-heating and fluctuations.
# Activation
Setup Ready-to-Ship to ensure a device communicating with good battery
Activate in light and let sit in light for min of 10 seconds
# Testing
Use our Simulator (https://smartbee-staging.decklar.com) tool to run through the customer’s scenarios and test all alerts, reports, and API integrations are setup to the customer’s expectations.
Test configs before deployment. Lean about the environment where the customer will be using the Bees. If needed go on-site or have the customer activate a bee in the exact location of the building, they will be activating.
Verify data flow. If customers are using API or Webhook integration, be sure all test scenarios have been run. Be sure API limits are substantial for scale.
# Customer Communication
Set expectations early
Be sure to tell customer there is an initial ‘pipe-cleaning’ phase at the beginning. During this phase, we make any bee config, lane config, or location tweaks is needed. Usually this is done after a few runs of a new lane. Now remember ‘pipe-cleaning’ phase is for adjusting where needed. The Bee config and lanes should already be 99% before this phase.