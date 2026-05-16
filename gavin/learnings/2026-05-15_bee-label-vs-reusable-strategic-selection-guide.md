# Bee Label vs Reusable Bee: Strategic Selection Guide

**Research Date:** May 15, 2026  
**Author:** Gavin (Decklar Intelligence)  
**Purpose:** Provide Jeff with a decision framework for guiding customers to the right device type

---

## Executive Summary

Decklar offers two primary device types: **Bee Labels** (one-time use, disposable) and **Reusable Bees** (returnable, multi-use). Choosing the wrong type is a leading cause of customer friction, contract disputes, and operational inefficiencies. This guide provides a structured framework to match device type to customer use case, reducing misalignment and maximizing value realization.

---

## Device Comparison

| Dimension | Bee Labels | Reusable Bees |
|-----------|------------|---------------|
| **Form Factor** | Thin label/sticker format | Compact standalone device |
| **Attachment** | Adhesive backing — sticks to boxes, pallets, crates | Clips, mounts, or adhesive — attaches to assets, vehicles, containers |
| **Battery Life** | 6-12 months (single shipment) | 2-5 years (hundreds of shipments) |
| **Cost Model** | Per-label consumable | Higher upfront, lower per-shipment over time |
| **Activation** | Light-activated (peel sticker) | Light-activated or motion-activated |
| **Sensors** | GPS, temperature, humidity, shock, light | Same + often more granular configuration |
| **Reverse Logistics** | None — customer discards after use | Required — customer returns to Decklar or designated facility |
| **Best For** | One-way shipments, no return infrastructure | Closed-loop supply chains, circular logistics |

---

## Decision Framework: Which Device for Which Customer?

### Use Bee Labels When:

1. **Shipment is one-way** (no return logistics)
   - Customer → End consumer (e-commerce)
   - Supplier → Distribution center (one-way replenishment)
   - Any lane where retrieving the device is impractical

2. **Customer lacks reverse logistics capability**
   - No consolidation points
   - No return shipping contracts
   - End destination is consumer household or remote location

3. **Shipment duration is predictable and short**
   - Less than 60 days (ocean freight may exceed label battery life)
   - Domestic or regional lanes

4. **Customer prefers operational simplicity**
   - No device tracking/inventory management required
   - No collection coordination
   - Lower administrative overhead

5. **Cold chain compliance is needed on outbound only**
   - Pharma shipments to pharmacies
   - Food deliveries to restaurants
   - Perishables with no return requirement

### Use Reusable Bees When:

1. **Shipment is round-trip or circular**
   - Reusable packaging programs (totes, pallets)
   - Closed-loop supply chains
   - Returnable transport items (RTIs)

2. **Customer has reverse logistics infrastructure**
   - Consolidation centers
   - Return shipping contracts
   - Asset management systems

3. **High shipment volume on same lanes**
   - Daily/weekly shuttles between facilities
   - Frequent supplier → DC → store rotations
   - Pooling systems with predictable cycles

4. **Shipment duration is long or variable**
   - Ocean freight (30-90 days)
   - Multi-modal with extended transit times
   - Unpredictable delivery schedules

5. **Environmental/ESG commitments**
   - Customer sustainability goals
   - Waste reduction mandates
   - Circular economy initiatives

---

## Critical Configuration Differences

### Bee Label Configuration Notes:

- **No reverse logistics tracking** — Labels are "fire and forget"
- **Contract must NOT include max device limits** — Labels are consumed
- **Expiry check is CRITICAL** — Labels expire; verify <9 months at shipment
- **No geofence return events** — Labels don't trigger completion on return
- **Battery is not replaceable** — Single-use only

### Reusable Bee Configuration Notes:

- **Contract MUST include device max limits** — Finance tracks pool size
- **Reverse logistics process required** — Who returns? To where? How?
- **Expiry still matters** — Check on each outbound shipment
- **Geofence return events** — Configure completion at return location
- **Battery optimization critical** — Longer shipments need careful PRF config
- **Activation location matters** — Some customers activate in dark areas

---

## Red Flags: When Selection Goes Wrong

| Warning Sign | Root Cause | Prevention |
|-------------|------------|------------|
| Customer complains about "throwing away expensive devices" | Reusable Bee sold where Label was appropriate | Use decision framework in sales cycle |
| Battery dead before shipment completes | Label used on ocean freight (60+ days) | Lane duration analysis during onboarding |
| "Bee not on this account" errors | Reusable Bee shipped without check-in | Ops process + contract max limits |
| Customer refuses to pay for "lost" devices | Misunderstanding of ownership model | Clear terms: Labels = owned; Reusable = leased |
| Reusable Bees piling up at destination | No reverse logistics process defined | Map full lifecycle before deployment |
| Expired devices arriving at customer | Date check skipped in fulfillment | Mandatory expiry verification in SOP |

---

## Customer Conversation Script

**Jeff:** "Let me walk through a few questions to recommend the right device type for your operation."

1. **"Do your shipments typically return to origin, or are they one-way?"**
   - Round-trip → Reusable
   - One-way → Labels

2. **"What's your typical shipment duration?"**
   - <30 days domestic → Either works
   - 30-60 days → Labels with optimized config OR Reusable
   - 60+ days (ocean) → Reusable strongly recommended

3. **"Do you have a way to collect devices at destination and return them?"**
   - Yes → Reusable
   - No → Labels

4. **"How do you feel about managing device inventory vs. receiving ready-to-use units per shipment?"**
   - Prefer zero management → Labels
   - OK with asset tracking → Reusable

5. **"Are there any sustainability or waste-reduction goals we should factor in?"**
   - Yes → Reusable
   - Neutral → Cost/operational factors decide

---

## Hybrid Scenarios

Some customers benefit from **both device types** across different lanes:

| Scenario | Label Use Case | Reusable Use Case |
|----------|---------------|-------------------|
| Pharma distributor | Outbound to pharmacies (one-way) | Returns from hospitals (reverse logistics) |
| Beverage company | Samples to retailers (one-way) | Reusable kegs to bars (returnable) |
| Electronics OEM | Warranty returns to repair center | Inter-facility component shuttles |
| Food service | Perishables to restaurants | Reusable food containers |

**Key:** Segment by lane, not by customer. A single customer may use Labels for outbound and Reusable for return lanes.

---

## Contract Implications

| Element | Bee Labels | Reusable Bees |
|---------|------------|---------------|
| **Pricing** | Per-label fee (consumable) | Per-shipment fee + device lease |
| **Min/Max Commitment** | Usually minimum order quantities | Maximum device count (pool size) |
| **Lost Device Policy** | N/A (consumed) | Replacement fee per lost device |
| **Return SLA** | N/A | Days allowed before late fees |
| **Battery Guarantee** | Single-use (no guarantee) | Multi-year operational guarantee |
| **Data Retention** | 1-2 years post-shipment | Ongoing while in service |

**Finance must configure correctly in Honeycomb** — Wrong device type in contract creates operational chaos.

---

## Summary Checklist for Jeff

Before recommending a device type:

- [ ] Understand shipment direction (one-way vs. round-trip)
- [ ] Confirm lane duration (domestic vs. ocean vs. air)
- [ ] Assess reverse logistics capability
- [ ] Align with customer operational preferences
- [ ] Verify contract configuration matches device type
- [ ] Check sustainability goals if relevant
- [ ] Confirm expiry dates on any shipped devices
- [ ] Document decision rationale in customer memory

---

## Key Takeaways

1. **Labels = Simplicity, Reusable = Sustainability** — Lead with the value proposition that matches customer priorities

2. **Ocean freight almost always needs Reusable Bees** — Battery life and variable transit times make Labels risky

3. **Reverse logistics is a capability, not a preference** — If customer can't execute returns, don't sell Reusable

4. **Contract configuration errors are expensive** — Finance and Ops must align on device type before first shipment

5. **Hybrids are common** — Don't force a single device type if customer's operation naturally segments

---

**Next Learning Topics:**
- Return logistics process design for Reusable Bees
- Battery optimization for long-lane Reusable deployments
- Contract structure comparison: Labels vs. Reusable economics

**File Location:** `~/decklar-intelligence/gavin/learnings/2026-05-15_bee-label-vs-reusable-strategic-selection-guide.md`
