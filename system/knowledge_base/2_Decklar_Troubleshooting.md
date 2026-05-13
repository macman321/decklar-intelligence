# 2 Decklar Troubleshooting

Decklar Troubleshooting Guide

Purpose

Capture recurring issues, root causes, and resolutions to enable faster troubleshooting and prevent repeat issues.

Incident Log

Customer: APL

Issue: Customer had ocean shipments that could last 60 days. By the time the container reached the destination port, the Bee’s battery was either dead or almost dead.

Root Cause: Bee’s config had ambient sensor interrupts enabled. This was interrupting the ‘sleep’ times of the Bee and caused the Bee to keep trying to connect the network. Hence draining the battery.

Resolution: Change the config of the Bee to disable the sensor interrupts.

Prevention: Follow check list when determining the Bee’s default configuration for the use-case of the customer.

Customer: McKesson

Issue: Customer complained that devices are not activating, and they are not seeing the green LED flashing. They said this is in a DC that has normal light.

Root Cause: After going on-site I noticed that although there was technically ‘light’ in the DC, the corner that they were peeling the Bees was too dark to activate the Bees.

Resolution: After looking at Bee data, we could see the light in that area was about 1%. We want at least 3%. So, I asked them to put a lamp over there and that worked right away.

Prevention: Ask customers to have a light source like a lamp at the activation area. Also, ask them to have a flashlight to help do testing if they say ‘there is a enough light’

Customer: McKesson

Issue: Customer reported when they were scanning Bees into their shipments (via the App) they were getting a “Bee not on this account” error

Root Cause: Customer’s contract (in Honeycomb system) had a limit as to how many bees can be in customer account at the same time. So Ops was shipping Bees and not putting them on the customer account, in hopes that by the time the Bees were delivered to the customer, Ops would have received more bees to checkout then check-in the bees they shipped to customer already.

Resolution: Have Finance expand the contract max and do not ever ship a bee to a customer if it has not been added to customer account.

Prevention: When setting up customer contracts for reverse-logistics use-case make sure there is a buffer built in. Or for one-time user devices make sure to remove old/used bees from customer’s account.



Customer: Vertex

Issue: Customer received Bees from Roambee, while CX on-boarded the customer we noticed the Bees were expired (over a year old)

Root Cause: Ops did not check the date of the Bees before shipping to the customer.

Resolution: Ops sent a new batch of bees and a return shipping label to the customer. Ops removed old bees from customer account and added the new Bees to the customer account. CX worked with the customer to have the old Bees returned to Ops.

Prevention: Before sending Bees to customer the expiration date should be checked to be sure the Bees in proper distribution time (under 9 months).



Customer: Fusion

Issue: Bees are not activating at the Origin hence data is not being logged in transit and no real-time visibility.

Root Cause: We believe there might be an environmental or user error issue

Resolution: Have customer change their process for activating the bee. Have them change locations in the building or extend the amount of time the bee has before being packed into a shipment.

Prevention: Test the location and environment multiple times where the customer will be activating the bees. If the customer or you ever notice a bee did not activate, do not brush it off, dig in and investigate.

Customer McKesson:

Issue: iShip app cannot login because user/password fields do not display.

Root Cause: There is some bug in the App.

Resolution: To fix have user tap into a different server, then tap back into US again.

Customer McKesson:

Issue: iShip customer does not see the McKesson app (tile) after logging in.

Root Cause: Account manager never gave access to the user.

Resolution: Fix make sure the user has access to the McKesson iShip app from https://shellapp.decklar.com 

Prevention: Work with customer to build a user request SOP and have them follow it. Have them submit new requests to you or support.decklar.com so the user can be added to shellapp. Note: the user needs to have an account on Decklar (under the customer’s account).

Customer McKesson:

Issue: Customer reports they are not seeing some shipments in the iShip app.

Root Cause: Customer either used the shipment on the wrong day. Or the shipment did not get created.

Resolution: Need to check Honeycomb to see if shipment was created. If yes, then check if it was completed. A lot of times customer uses the wrong shipment on the wrong day, which gives the impression the shipment was not created.

Prevention: Have the customer use very clear shipment names so they are not confused day to day.

Customer Fusion:

Issue: Shipments were supposed to stop on ambient light detection and in geofence of destination. We kept seeing temperature excursions at the end of the shipment

Root Cause: This was because the Bee config did not have ambient light interrupt turned on. 

Resolution: To fix this find all non-used Bees on the customer’s account and send Bee command enabling ambient light interrupts.

Prevention: Make sure the Bee config is defined and documented. Work with RevOps to make sure the Bees are being configured the right way before they are sent to the customer.



Customer Liebherr:

Issue: Bees did not track during the shipment.

Root Cause: Bees were sent to customer before being added to their account. And the customer used the bees before the date which was told to them.

Resolution: Added bees ASAP to the customer account. Which enabled tracking of the 2nd half of the shipments.

Prevention: Make sure all bees are in the customer account before sending to customers.

