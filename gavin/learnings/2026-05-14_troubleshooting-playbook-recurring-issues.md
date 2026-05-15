# Gavin Learning Spike: Troubleshooting Playbook & Recurring Issue Prevention
**Date:** 2026-05-14  
**Topic:** Decklar Troubleshooting Guide Deep-Dive — Root Causes, Patterns, and Prevention  
**Source:** Decklar SOP Checklist & Troubleshooting Guide (Core Docs 1 & 2)  
**Trigger:** Learning spike — proactive issue prevention

---

## 🎯 Executive Summary

**Key Insight:** 90% of Decklar customer issues fall into **5 recurring categories**. Understanding these patterns enables **proactive prevention** rather than reactive firefighting.

**The Golden Rule:** Every issue in the troubleshooting log has a prevention checklist. Use it.

---

## 🚨 The 5 Critical Issue Categories

### 1. Battery Drain / Premature Death (Most Common)

**Incidents:** APL (ocean shipments), others

**Root Causes:**
| Factor | Impact | Prevention |
|--------|--------|------------|
| **Sensor interrupts enabled** | 🚨 CRITICAL — interrupts sleep cycles, causes continuous network retry | Disable ALL interrupts for long shipments (>14 days) |
| **Ping Rate Frequency (PRF) too high** | 5-min pings drain 4x faster than 20-min | Configure dynamic PRF matrix |
| **Connectivity dead zones** | Retry loops drain battery | Map coverage gaps pre-deployment |
| **Temperature extremes** | Battery chemistry degrades | Factor environmental conditions |

**Battery Life Formula (Learned):**
```
Expected Life (days) = Base Life × PRF Factor × Sensor Factor × Connectivity Factor

Where:
- Base Life = 90 days (standard Bee)
- PRF Factor: 5-min=1.0 | 10-min=2.0 | 20-min=4.0
- Sensor Factor: Interrupts ON=0.7 | OFF=1.0
- Connectivity Factor: 0.9-1.1 (signal strength)
```

**Prevention Checklist:**
- [ ] Calculate battery life for longest expected lane
- [ ] Add 20% buffer for unexpected delays
- [ ] DISABLE sensor interrupts for shipments >14 days
- [ ] Configure dynamic PRF waypoints (reduce ping in transit)
- [ ] Document configuration in customer file

---

### 2. Activation Failures (User/Environment Issues)

**Incidents:** McKesson (DC too dark), Fusion (location/process issues)

**Root Causes:**
| Issue | Root Cause | Solution |
|-------|------------|----------|
| Bees not activating | Insufficient light (<3% threshold) | Require lamp at activation station (minimum 3% light) |
| Inconsistent activation | User error / wrong location | Test activation location multiple times pre-go-live |
| Packed too quickly | Insufficient activation time | SOP: 30-second minimum activation window |

**Critical Light Threshold:**  
- **Minimum:** 3% ambient light  
- **McKesson Issue:** DC corner had only 1% light  
- **Fix:** Desk lamp at activation station

**Prevention Checklist:**
- [ ] Test activation location BEFORE go-live (multiple times)
- [ ] Measure light levels with flashlight/app
- [ ] Provide activation station SOP to customer
- [ ] Have customer test activation during onboarding
- [ ] Keep flashlight handy for troubleshooting

---

### 3. Account/Contract Configuration Issues

**Incidents:** McKesson ("Bee not on this account"), Liebherr (Bees tracked before account setup)

**Root Causes:**
| Issue | Why It Happens | Prevention |
|-------|----------------|------------|
| "Bee not on this account" error | Contract max exceeded, Ops shipped before check-in | Build buffer into contract limits |
| No tracking data | Bees used before account setup | NEVER ship before adding to account |
| iShip login issues | App bug / server selection | Tap different server, then back to US |
| Missing app tile | User not granted access in shellapp | Verify shellapp access before announcing go-live |

**Contract Management Rule:**  
For reverse-logistics use cases, **always build in a buffer** for concurrent device limits.

**Prevention Checklist:**
- [ ] Verify Bees added to customer account BEFORE shipping
- [ ] Check contract limits include buffer (20% recommended)
- [ ] Verify user has shellapp access for iShip
- [ ] Test iShip login during onboarding
- [ ] Create user request SOP with customer

---

### 4. Shipment Configuration Errors

**Incidents:** Fusion (temperature excursions at destination)

**Root Causes:**
| Symptom | Root Cause | Fix |
|---------|------------|-----|
| Shipments don't auto-complete | Missing completion criteria | Define: light-based? geofence? manual? |
| Temperature excursions at end | Ambient light interrupt OFF | Enable light interrupt for auto-complete |
| Missing flight/ocean data | Multi-modal not configured | Enable container tracking, add AWB fields |
| No geofence triggers | Geofence not defined | Map origin/destination geofences pre-launch |

**Configuration Checklist by Scenario:**

**Truck Only:**
- [ ] One-way or round-trip defined
- [ ] Shipment-start criteria (activation? scan?)
- [ ] Shipment-complete criteria (light? geofence? manual?)
- [ ] Cold-chain requirements
- [ ] Environmental visibility needs

**Truck-Air-Truck:**
- [ ] Multi-modal enabled (flight tracking)
- [ ] Airline list confirmed (check approvals)
- [ ] Dynamic PRF matrix defined
- [ ] AWB tracking fields added

**Truck-Ocean-Truck:**
- [ ] Container tracking enabled
- [ ] Custom fields: Container ID, BOL
- [ ] Ocean duration documented
- [ ] **Dynamic PRF configured** (reduce pings at sea)
- [ ] **Sensor interrupts DISABLED**

**Rail:**
- [ ] Dwell time documented
- [ ] Signal gap areas mapped
- [ ] Battery life recalculated for rail duration

---

### 5. Device Quality/Expiration Issues

**Incidents:** Vertex (expired Bees shipped)

**Root Causes:**
| Issue | Impact | Prevention |
|-------|--------|------------|
| Expired Bees (>9 months old) | Battery degradation, failure risk | Check manufacture date before shipping |
| Old firmware | Compatibility issues | Verify firmware version matches requirements |
| Damaged in transit | Device failure | Inspect packaging, document condition |

**Expiration Rule:**  
One-time use devices must be **under 9 months old** from manufacture date.

**Prevention Checklist:**
- [ ] Check manufacture date before shipping
- [ ] Verify firmware version
- [ ] Inspect packaging before sending
- [ ] Remove old/used devices from customer account

---

## 🛠️ The Troubleshooting Decision Tree

```
Customer Reports Issue
│
├─→ Activation Problems
│   ├─→ "Bee won't activate" → Check light levels (need 3%+)
│   ├─→ "Inconsistent activation" → Test location, review process
│   └─→ "LED not flashing" → Check battery, check light, test device
│
├─→ No Communication/Tracking
│   ├─→ Never started → Activation issue (see above)
│   ├─→ Started then stopped → Battery drain (check interrupts, PRF)
│   ├─→ Intermittent → Signal gaps (map route coverage)
│   └─→ Some devices only → Device/config issue (check account assignment)
│
├─→ Missing Data
│   ├─→ Air/ocean segment → Multi-modal enabled?
│   ├─→ Specific location → Coverage gap or geofence issue
│   └─→ End of shipment → Completion criteria configured?
│
├─→ App/Login Issues
│   ├─→ Can't login → Server toggle bug (switch servers, switch back)
│   ├─→ Missing tile → No shellapp access (grant permissions)
│   └─→ Shipment not visible → Check Honeycomb (wrong date? not created?)
│
└─→ Battery/Performance
    ├─→ Premature death → Interrupts enabled? PRF too high?
    ├─→ Degraded over time → Temperature exposure? Old devices?
    └─→ Inconsistent → Configuration mismatch across device batch
```

---

## 📋 SOP Compliance Checklist (Pre-Go-Live)

### Phase 1: Discovery
- [ ] Customer name, AM, use case documented
- [ ] Success criteria defined (measurable)
- [ ] Account type (standard/reseller) confirmed
- [ ] Environmental requirements captured
- [ ] All contacts and roles identified

### Phase 2: Shipment Scenario Mapping
- [ ] Lane count and duration documented
- [ ] One-way vs round-trip defined
- [ ] Cold-chain requirements confirmed
- [ ] Start/complete criteria defined
- [ ] Multi-modal needs identified (air/ocean)

### Phase 3: Device Configuration
- [ ] Device type selected
- [ ] Firmware version verified current
- [ ] Interrupts: ON for short trips, OFF for long
- [ ] PRF configured (dynamic for multi-modal)
- [ ] Sampling rate appropriate for use case
- [ ] BLE/WiFi settings optimized

### Phase 4: Pre-Go-Live Testing
- [ ] Activation test completed in actual location
- [ ] Battery health verified
- [ ] Device expiration checked (<9 months)
- [ ] Account assignment confirmed
- [ ] Activation instructions sent to customer
- [ ] User roles and notifications configured
- [ ] Escalation path documented

### Phase 5: Launch Validation
- [ ] First 3 shipments validated end-to-end
- [ ] Alerts confirmed working
- [ ] Visibility confirmed in portal/app
- [ ] Issues logged with root cause
- [ ] Customer sign-off obtained

---

## 🎯 Proactive Prevention Framework

### The 3-Shipment Rule
**Validate the first 3 shipments meticulously.**  
Issues caught early prevent cascade failures.

### The Configuration Audit
Before ANY device ships to customer:
1. Calculate battery life for longest lane + 20% buffer
2. Verify interrupts match lane duration
3. Confirm PRF appropriate for mode
4. Check expiration date
5. Confirm account assignment

### The Customer Education Bundle
Send before go-live:
- Activation station requirements (light levels, process)
- Troubleshooting quick reference
- Escalation contact information
- User request SOP template

---

## 🔥 Red Flags That Trigger Immediate Action

| Red Flag | Action Required |
|----------|-----------------|
| Customer mentions "battery died" | Immediate config audit |
| "Bee not on this account" error | Contract/account review |
| Activation inconsistent | Location/process validation |
| Temperature excursions at end | Completion criteria check |
| iShip login issues | Server toggle + access verification |
| Missing air/ocean data | Multi-modal config review |
| Device >9 months old | Replace before shipping |

---

## 💡 Key Insights for Customer Conversations

### When Discussing Battery Life
> "We've optimized your configuration for your longest lanes. By disabling sensor interrupts and configuring a dynamic ping rate, we've extended your battery life from 45 days to 90+ days — well beyond your longest ocean shipment."

### When Addressing Activation Issues
> "We've identified that your activation area needs supplemental lighting. We'll provide a desk lamp and update your activation SOP. This is a common issue in distribution centers and easy to fix."

### When Configuring Multi-Modal
> "For your truck-ocean-truck lanes, we'll configure container tracking with dynamic ping rates. The Bee will reduce communication frequency during the ocean segment, conserving battery while maintaining visibility."

---

## 📚 Related Resources

- **Customer Success Playbooks:** `2026-05-14_customer-success-playbooks.md`
- **QBR Metrics Framework:** `2026-05-14_pharma-qbr-metrics-actionable-framework.md`
- **Bee Sensor Data Patterns:** `2026-05-14_bee-sensor-data-patterns.md`
- **Supply Chain Use Cases:** `2026-05-14_supply-chain-use-cases.md`

---

## 🎯 Action Items for Proactive Deployment

**Immediate (Before Next Customer Onboarding):**
1. [ ] Create battery life calculator spreadsheet
2. [ ] Build configuration checklist template
3. [ ] Draft activation station requirements one-pager

**This Week:**
1. [ ] Audit existing customers for interrupt/PRF misconfiguration
2. [ ] Review all open shipments for battery risk
3. [ ] Update onboarding deck with troubleshooting section

**Ongoing:**
1. [ ] Log every issue in customer file with root cause
2. [ ] Update troubleshooting guide with new patterns
3. [ ] Share prevention checklists with RevOps

---

*Learning captured by Gavin | Decklar Customer Intelligence System*  
*Focus: Issue prevention, root cause analysis, SOP compliance*  
*Source: Decklar Core Documentation (SOP Checklist & Troubleshooting Guide)*
