Decklar FAQ
# Purpose
Provide consistent answers to common customer and internal questions.
# Device
How to activate? Peel activating tape in a lighted area
What if no signal? After activated, a device will store sensor data locally and update it once it get signal.
Does it store data? Yeah, Bees store data locally.
# Battery
How long does it last?
What impacts battery?
# App
Login issues
Permissions issues
# Data
Accuracy?
Delays?



| --- | --- | --- |
| Number | Question | Quick Answer (Short one line) |
| 1 | Devices disptached without contract |  |
| 2 | Devices shipped from Manufacturing to customer without letting customer know |  |
| 3 | Devices got stuck in customs and Carrier is asking customer to be the importer  of records |  |
| 4 | Devices arrived to customer but they are not reporting |  |
| 5 | Devices arrived to customer but there is not a  contract in the system |  |
| 6 | Contract created in HC portal with wrong device type |  |
| 7 | Device's green status LED does not turn on after peeling activation tape | Be sure the Bee is in good ambient light. Ask customer to shine a light over the bottom area of the Bee. If this does not work have customer use a different Bee. |
| 8 | User does not notice the green status LED after peeling activation tape | Be sure the Bee is in good ambient light. Ask customer to shine a light over the bottom area of the Bee. If this does not work have customer use a different Bee. |
| 9 | User attaches the wrong Bee device to a shipment/load | Have customer identify the correct Bee ID. Then Edit the shipment, under ‘tracking details’ add the correct bee, then remove the wrong bee. Be sure to save the shipment after. |
| 10 | User forgets to associate the Bee to a shipment/load | Have customer identify the correct Bee ID. Then Edit the shipment, under ‘tracking details’ add the correct bee. Be sure to save the shipment after. |
| 11 | What to do if the Bee stops reporting location, but keeps reporting other data | Check if the Bee is just sending the same location point over and over. Sometimes we see a Wi-Fi mapping/hopping issue where out system take Wi-Fi location over other technologies. |
| 12 | Active shipment data does not display on the HC portal | Replay the shipment because sometimes the data is being collected, but not being plotted on HC. |
| 13 | There is a large gap in sensor data (like temperture) but location data is being shown | If the shipment was in a no signal zone for a long time, sensor data may have been logged and stored on the device. Once the device is communicating again, it may take a couple pings for the Bee to upload all the stored data. |
| 14 | Completed shipments no longer show data on HC portal | Shipment might be too old. Try to replay the shipment. Look at Bee data instead. Make a ticket to support. |
| 15 | Customer creates shipment via API, but the shipment does not start when leaving geofence | Make sure the Scheduled departure time is accurate. Make sure they do not have Time Based Shipment Start turned on. If the shipment left Geo early, have Flex Geofence Start enabled (account level and shipment level). |
| 16 | Battery appears to have drastically/rapidly depleted | Check temperature conditions as cold temperature can make battery look drained. Check to see if there are a lot of interrupts happening and/or if the Bee is waking up between PRF due to Beacons. |
| 17 | Shipments are starting earliy due to geo drifting | Make geofence larger if possible. Adjust the time for Flex Geofence (try 1 hour). Use Wi-Fi mapping for the location to have the Bee’s location snap to the location. |
| 18 | Ping reporting frequency did not seem to change after comand was acknowledged by Bee | Check sensor interrupts and BLE beacon interrupts. These make wake the bee between the PRF and look as if the PRF is not working. |
| 19 | Webhook payload is not including shipment data | Check/Enable the box (Send information only for duration when device is attached to a shipment). |
| 20 | How can shipment attachments be sent to email or API, based on an event | Enable “EPODEPARTURE_COMPLETED” Event in webhooks to get a URL (downloadable link) for attachments. |
| 21 | When user peels the red activation tape off of Bee, the bee's actual label also peels off |  |
| 22 | Geo location seems to be all over the place when the device is not moving | Try to use Wi-Fi Mapping for the location. |
| 23 | Portal Log-In [incl. First Time Use]​ |  |
| 24 | Landing Page & Navigation Bar​ |  |
| 25 | View and Monitor a Shipment​ |  |
| 26 | Navigate the Dashboard​ |  |
| 27 | Locate My Bees / Beacons​ |  |
| 28 | How to Create, change or delete a shipment |  |
| 29 | I need to make an adjustment to my shipment. How do I modify it? | Find your shipment in HC, click the 3 vertical dots on the left then click edit. |
| 30 | How do I add a proximity alert to my shipment? and, when will I receive the notification? |  |
| 31 | How do I create a container-tracking shipment? | First enable container tracking at the account level via Capabilities. Then create a Custom Field and select ‘container’ as the field type. Now when a shipment is created Container ID needs to be filled in to start tracking. |
| 32 | Do I have to enter the ports I think the ship will stop in? | No |
| 33 | What if the ship changes its port stops? Do I need to edit the shipment? | No |
| 34 | What happens if I input the container/vessel info afterwards? Do I get back dated info? | No |
| 35 | I forgot to create a shipment in the portal and the truck left already. What happens now? | You can still create the shipment and use the time of departure so the data will be back filled. |
| 36 | If I make changes to the geofence for a location in an active shipment, will it be acknowledged in the current shipment or for the future? | No not for current shipments. Just for future shipments. |
| 37 | How does route deviation work? Can I draw my own route with a buffer? How? | Uses google best route, but you can drag the black line to change the route. You an also add a second route as well. Then you can adjust the radius of the routes. |
| 38 | Can geofences overlap? |  |
| 39 | I want alerts sent to me to vary by shipment? How can I set this up? |  |
| 40 | What happens to old/active shipments if I edit a geofence? Would they be automatically updated? And templates? | No they will not be chaged |
| 41 | Why would I use a shipment template? | This makes creating shipments that use the same lane way easier. All custom settings and OD pair will be auto filled in. |
| 42 | How do I Create / Edit a Shipment Template? | Under the shipment menu on the left tool bar, select Shipment then select template. You can click create new template or you can find a current template and click the 3 vertical dots, then click edit. |
| 43 | Can a route for a shipment be saved as part of a template? How does it work? |  |
| 44 | Device Overview |  |
| 45 | Oops. I pulled the tab off the BeeLabel. Can I just put it back on to turn it off? |  |
| 46 | Deployment |  |
| 47 | Customs Declarations & Documents - do you have a list of the countries you can ship devices to? |  |
| 48 | What if I need specific country certificates? |  |
| 49 | What program do you have for eWaste if our destination country cannot easily dispose of the single use devices? |  |
| 50 | How to declare devices on air/ocean freight? |  |
| 51 | Log In |  |
| 52 | SSO |  |
| 53 | View Dashboard |  |
| 54 | enable access to other users? |  |
| 55 | what setup do I need on HC to use Resolve? |  |
| 56 | The HC contract has not been set up? |  |
| 57 | The account is in renewal process but the HC contract has expired? What do I do? |  |
| 58 | Know the status of my order? |  |
| 59 | I seem to have locked myself out of my Roambee account? What do I do? |  |
| 60 | We would like to see some reports. What is available? How soon can I expect to start seeing them? |  |
| 61 | Can reports be emailed to me rather than downloaded from the Roambee portal ? Can I get them via API? |  |
| 62 | How to format my custom JSON variables for Webhooks |  |
| 63 | How do I change the ping frequency of my Bee |  |
| 64 | Why is there missing sensor data (temperature data), but there is location data |  |
| 65 | How do I set up Mapped Wi-Fi at my location to reduce drift |  |
| 66 | How do I resend a Webhook |  |
| 67 | Why is the shipment dashboard not showing all my shipments? |  |
| 68 | Is the alert report (from Alert page under Shipments) showing alerts of active AND completed shipments?? |  |
| 69 | How can I easlity identified non-compliance shipments? (f/e idle longer than expected, TEMP excursions, deviated from route) |  |
| 70 | How to enable and create public tracking links? |  |
| 71 | What does Hub mean when creating a location |  |
| 72 | What does Port mean when creating a location |  |
| 73 | What does Dynamic Waypoint mean when creating a location |  |
| 74 | How can I bulk-download  shipments reports? |  |
| 75 | How do I edit a geofence |  |
| 76 | When creating a shipment, what does Sensorless mean |  |
| 77 | When creating a shipment, what does Pharma mean |  |
| 78 | How do I create custom fields |  |
| 79 | What does Per Alert mean under Sensor Thresholds |  |
| 80 | What does Ambient mean under Sesnor Thresholds |  |
| 81 | How do I change temperature units to display in Fahrenheit |  |
| 82 | How do I change distance units to display in Miles? |  |
| 83 | What is the difference between Set Reporting Interval and Reset Reporting Interval |  |
| 84 | What is Send to Bee Now vs When Shipment Starts |  |
| 85 | What does Time Based Shipment do under Custom Properties |  |
| 86 | What does Set OM Mode do under Custom Properties |  |
| 87 | What does Dynamic Waypoint Tracking mean under custome properties |  |
| 88 | What does Shipment Duration do under custom properties |  |
| 89 | What does Stop Duration do under custom properies |  |
| 90 | What does Delay Shipment Completion do under custom properties |  |
| 91 | What does Delay Offset do under custom properties |  |
| 92 | Why are there no Rules in the drop down under custom properties |  |
| 93 | What is Flexible Geo-fence based start? |  |
| 94 | What is Geofence tuning? |  |
| 95 | How can we decrease the location drifting caused between GPS/GSM/WiFi? |  |
| 96 | What is Multimodal and when do I use it |  |
| 97 | How do I track a container over the ocean |  |
| 98 | I added people to Alert Subscriptions but they are not getting alerts |  |
| 99 | How do I recharge the battery on my Bee |  |
| 100 | Why are no Waypoints showing up in the dropdown when creating a shipment |  |
| 101 | After selecting a Waypoint from the dropdown, what does Exp. Arrival Mins mean |  |
| 102 | Can I create more than two routes under Route Deviations |  |
| 103 | How do I view the status of my Bee Order |  |
| 104 | How do I add users to an account |  |
| 105 | How can I group users under the same account |  |
| 106 | What is Waypoint Dwell Time and how/when do I use it |  |
| 107 | What is External Shipment Feed and how/when do I use it |  |
| 108 | What is Capture Reason for Edit Shipment and how/when do I use it |  |
| 109 | What is ePOD Delivery and how/when do I use it |  |
| 110 | What is ePOD Departure and how/when do I use it |  |
| 111 | What is Pharma Shipment and how/when do I use it |  |
| 112 | What is Shipment Tracking and how/when do I use it |  |
| 113 | What is Vehicle Tracking and how/when do I use it |  |
| 114 | What is Container Tracking and how/when do I use it |  |
| 115 | What is Restric Application Visibility and how/when do I use it |  |
| 116 | How do I create Custom Email Templates |  |
| 117 | What are account System Fields |  |
| 118 | How do I edit a Customer's Shipment Custom Fields |  |
| 119 | How do I customize Honeycomb to show my Customer's Logo |  |
| 120 | Where do I get my Customer's API Key |  |
| 121 | How do I setup Reverse Bee Pickup |  |
| 122 | How do I setup SSO for my customer |  |
| 123 | How do I enable Audit for a Customer |  |
| 124 | What is Geo Snapping and how/when do I use it |  |
| 125 | How do I change the config of a Bee and what commands need to be send in which order |  |
| 126 | On HC Shipment grid table, where does Departure and Arrival date and time come from |  |
| 127 | On HC Shipment grid table, how does Google ETA work |  |
| 128 | Does Google ETA with ocean and air |  |
| 129 | How offten does HC get updated with Ocean or Flight data from 3rd party |  |
| 130 | What does the Anchor icon mean on the shipment details page |  |
| 131 | How is predicted arrival, and predicted departure calculated |  |
| 132 | How do I pair a Beacon to a BSM or BSF (What Bee configs need to be set before shipment) |  |
| 133 | How to I confirm the Beacon is talking to the BSM/BSF |  |
| 134 | How can we limit Customer's customers to only see their shipments, but not as re-seller |  |
| 135 | How do we setup 'door dash' on the way alerts for a shipment |  |
| 136 | I am getting too many email alerts from Roambee. Why is this happening |  |
| 137 | What is the propper way to dispose of the BeeLabels? Or BSM |  |
| 138 | How many BeeLabels can be put onto oe airplane? |  |
| 139 | I am not getting email alerts, what I need to check? |  |
| 140 | How to create, change or delete  an alert |  |
| 141 | How to attach a sensor |  |
| 142 | Does Roambee uses 4G / 5G for data transmission |  |
| 143 | Confirm the provider used by Roambee for data transmission |  |
| 144 | Verify if Roambee applies any extra safeguards to the data packets transmitted over the cellular network |  |
| 145 | What to do if messages seem to be stuck? My router is solid green, but it does not seem to be reading any beacons. |  |
| 146 | How to set up properly within zones? |  |
| 147 | If I don't have a location set for the router, what could happen? |  |
| 148 | How do I edit my zones? |  |
| 149 | Why is the asset count not showing on the Facilities map? |  |
| 150 | The router has lost connection and I cannot remember the password for the router. What do I do? |  |
| 151 | I have assets in a zone that all have an old date and the date is the same on all of them, yet I see that the beacons have moved zones since then. |  |
| 152 | How to identify the battery life. |  |
| 153 | What is the maximum number of assets that can be read by a gateway? |  |
| 154 | How can I get dwell time reports? |  |
| 155 | I'm having trouble editing my zone boundaries. Can you provide instructions? |  |
| 156 | How do I use the Roambee Asset Finder app? |  |
| 157 | Is it available on both Android and iOS? |  |
| 158 | Does the Asset Finder app read every beacon I have? |  |
| 159 | What if I have a specific asset I want to find in my facility? |  |
| 160 | We would like to see some reports. What is available? |  |
| 161 | How to create assets in bulk? |  |
| 162 | What's the difference between clasifications, custom fields, labels? |  |
| 163 | How does user subscription works? how to configure it? |  |
