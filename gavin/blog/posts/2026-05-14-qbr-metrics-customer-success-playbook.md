---
title: "The Customer Success Playbook: QBR Metrics That Actually Matter"
date: 2026-05-14
author: Gavin
excerpt: "Stop reading vanity metrics. Here's the 5-question framework Decklar uses to turn quarterly business reviews into actionable roadmaps."
tags: ["customer-success", "qbr", "metrics", "playbook"]
layout: post.njk
---
---
layout: post.njk

# The Customer Success Playbook: QBR Metrics That Actually Matter

*Your supply chain visibility platform is collecting data. But are you using it to drive decisions?*

I've sat through enough QBRs to know the difference between a report and a roadmap. Most teams spend 45 minutes reviewing dashboards that tell them what they already know. The best teams? They use five questions to uncover the invisible friction that's costing them money.

Here's the framework we use with Decklar customers.

---

## The Five Questions That Cut Through Noise

### 1. "Where are your alerts clustering?"

**Why it matters:** An alert in isolation is noise. Fifteen alerts from the same facility in two weeks? That's a pattern. 

**What to look for:**
- Geofence violations at specific origin points (often indicates address/database errors)
- Temperature excursions on recurring lanes (cold chain calibration issues)
- Device "went dark" events in specific regions (connectivity dead zones)

**The pivot:** Turn location-based alert clusters into operational tickets. One fix at the facility level prevents 20 future alerts.

---

### 2. "What percentage of shipments had zero incidents?"

**Why it matters:** Everyone tracks when things go wrong. But "boring shipments" — the ones that went from A to B with no drama — tell you if your baseline configuration is actually working.

**The benchmark:**
- **>90% clean shipments:** Your thresholds are calibrated correctly
- **70-90%:** Review your geofence radii and alert sensitivity
- **<70%:** You have a configuration problem, not a supply chain problem

**The pivot:** Don't optimize for the exceptions. Optimize the baseline so exceptions are actually exceptional.

---

### 3. "How many alerts converted into action?"

**Why it matters:** An alert that's ignored is worse than no alert at all. It trains your team to ignore the system.

**What to measure:**
- Alerts acknowledged within 15 minutes
- Alerts that triggered a workflow (driver called, customer notified, inspection scheduled)
- Alerts that led to a claim filed or damage prevented

**The pivot:** If your alert-to-action ratio is low, you have an integration problem, not a visibility problem. Connect Decklar to your TMS or operational dashboards.

---

### 4. "Where are your customers checking tracking?"

**Why it matters:** Your external tracking links aren't just for transparency — they're a heat map of customer anxiety.

**What to look for:**
- High tracking volume on specific lanes = visibility gaps customers are manually filling
- Multiple checks on the same shipment = delivery expectation misalignment
- External shares to new email addresses = stakeholder expansion opportunities

**The pivot:** High tracking activity is a signal. Either automate the update frequency on those lanes, or add proactive notifications before customers need to check.

---

### 5. "What's your time-to-resolution on exceptions?"

**Why it matters:** The cost of an incident is directly proportional to how long it takes to resolve.

**The tiers:**
- **<2 hours:** Real-time rerouting, driver contact, customer notification
- **2-6 hours:** Standard exception workflow, next-day mitigation
- **>6 hours:** You're managing damage, not preventing it

**The pivot:** If your time-to-resolution is creeping up, audit your escalation chains. The right person needs to know at the right time.

---

## The "Pipe-Cleaning" Phase: Month 2-3 Post-Go-Live

Here's something most vendors won't tell you: **Your first 30 days of data will be noisy.** Geofences will be too tight or too loose. Ping frequencies will need tuning. Waypoint triggers will fire at the wrong times.

We call this the "pipe-cleaning" phase, and it's critical.

**Month 1:** Collect data. Don't optimize yet. Let the system show you where the friction is.

**Month 2-3:** Review the five questions above. Adjust geofence radii based on actual facility layouts. Tune alert thresholds based on real temperature and shock readings. Consolidate waypoint alerts that fire too frequently.

**Month 4+:** Your baseline is clean. Now you're optimizing for speed, cost, and expansion — not debugging configuration.

---

## The Red Flags We Watch For

- **"We're getting too many alerts."** Usually means thresholds are too sensitive, not that your supply chain is broken.
- **"The data doesn't match our TMS."** Check your shipment start/stop logic. A one-minute difference in when a shipment "starts" creates mismatches.
- **"Our customers aren't using the tracking links."** Either they don't know about them (training gap) or they don't trust them (data quality issue).

---

## The One Metric That Rules Them All

**Incidents detected before the customer knew about them.**

That's it. That's the scoreboard. If Decklar is flagging temperature excursions, delays, or damage risks before your customer calls you — you're winning. If customers are calling you first, visibility isn't the problem. Reaction time is.

---

## A QBR Template You Can Steal

| Section | Time | Owner | Output |
|---------|------|-------|--------|
| Alert Cluster Analysis | 10 min | Ops Lead | 2-3 facility-specific tickets |
| Clean Shipment % Review | 5 min | Account Manager | Threshold adjustment plan |
| Alert-to-Action Ratio | 5 min | Systems Lead | Integration roadmap |
| Tracking Heat Map | 10 min | Customer Success | Proactive notification updates |
| Time-to-Resolution Trend | 10 min | Ops Lead | Escalation chain audit |
| Pipe-Cleaning Status | 10 min | Account Manager | Configuration update list |

---

## Bottom Line

QBRs aren't reports. They're working sessions. The best Decklar customers treat quarterly reviews as configuration checkpoints, not status updates. Every alert is a signal. Every signal is an opportunity to tighten the system.

The goal isn't perfect data. It's actionable data.

---

*Want this framework customized for your account? Book a session with your Decklar account manager. We bring the data. You bring the operational context. Together, we build the playbook.*

---

**Gavin**  
*Director of Customer Accounts & Customer Success, Decklar*

*P.S. — If your QBRs are still just slide decks with screenshots of dashboards, you're leaving money on the table. The customers who operationalize these five questions? They see 40-60% faster resolution times in quarter two. That's not a coincidence. That's pipe-cleaning.*
