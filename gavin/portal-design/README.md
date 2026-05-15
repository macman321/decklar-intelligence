# Decklar Customer Management Portal — Design Documentation

> **Complete specification for the AI-driven customer management portal for Decklar (IoT supply chain visibility company)**

---

## 📋 Documentation Index

| Document | Purpose | Size |
|----------|---------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, data flows, deployment options | 14KB |
| [DATA_MODELS.md](./DATA_MODELS.md) | Complete TypeScript interfaces for all entities | 15KB |
| [API_SPEC.md](./API_SPEC.md) | RESTful API endpoints, request/response schemas | 15KB |
| [UI_SPEC.md](./UI_SPEC.md) | Design system, component specs, page layouts | 26KB |
| [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) | Phased task breakdown with timeline | 15KB |

**Total: 85KB of comprehensive design documentation**

---

## 🎯 Project Summary

### Vision
Build a production-grade customer management portal that transforms how Decklar manages IoT supply chain visibility customers. The portal features real-time AI assistance via Gavin, comprehensive account intelligence, and automated document generation.

### Core Features

#### 1. **Dashboard**
- Customer health overview with RAG status (Green/Amber/Red)
- Quick stats and KPIs
- Searchable customer list with grid/table views
- Activity feed and recent insights

#### 2. **Customer Detail View**
- 8-tab comprehensive view:
  - Overview - Key metrics and recent activity
  - Contacts - Stakeholder management
  - Deployment - Configuration and go-live tracking
  - Capabilities - Feature flags and settings
  - Open Items - Task tracking with priority
  - Call History - Transcripts and recordings
  - Insights - AI-generated intelligence
  - Value Proof - ROI and success metrics

#### 3. **AI Assistant (Gavin)**
- Fixed right sidebar chat interface
- Voice-enabled queries (ElevenLabs TTS/STT)
- Proactive suggestions based on customer data
- Real-time intelligence about selected account
- Document generation via natural language

#### 4. **Document Generation**
- Deployment plans
- QBR reports
- Health snapshots
- Value propositions
- PDF and Word export

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **State:** Zustand + TanStack Query
- **Real-time:** WebSocket / Server-Sent Events

### Backend
- **API:** Next.js API Routes
- **AI:** OpenAI GPT-4 + ElevenLabs Voice
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **ORM:** Prisma
- **Memory:** SuperMemory API

### Infrastructure
- **Hosting:** Vercel (recommended)
- **Database:** Supabase / PlanetScale
- **Storage:** S3-compatible
- **Monitoring:** Sentry
- **CI/CD:** GitHub Actions

---

## 🎨 Design System

### Brand Colors
```css
--color-primary: #2563EB      /* Decklar Blue */
--color-secondary: #10B981    /* Success Green */
--color-accent: #F59E0B       /* Amber alerts */
--color-danger: #EF4444       /* Red at-risk */
```

### Health Status
- **🟢 Green:** Healthy, on track, meeting goals
- **🟡 Amber:** Attention needed, minor issues
- **🔴 Red:** At risk, immediate action required

### Typography
- **Font:** Inter (system fallback)
- **Scale:** 12px → 48px
- **Weights:** 400, 500, 600, 700

---

## 📊 Data Model Highlights

### Customer Entity
- `customerName`, `accountManager`, `accountType`
- `healthRAG` with `healthReason`
- `industry`, `region`, `employeeCount`
- Relationships: contacts[], deployment, capabilities, openItems[], callHistory[], insights[], valueProof

### Key Relationships
- **Contacts:** Primary stakeholders with roles (executive, champion, technical)
- **Deployment:** Facilities, shipment modes, go-live tracking, hardware
- **Open Items:** Task tracking with priority, status, notes
- **Call Records:** Transcripts, sentiment, commitments, decisions
- **Insights:** AI-generated risk/opportunity detection
- **Value Proof:** ROI metrics and testimonials

---

## 🔌 API Highlights

### Customer Endpoints
```
GET    /api/customers              # List with filters
POST   /api/customers              # Create
GET    /api/customers/:id           # Get details
PUT    /api/customers/:id           # Update
DELETE /api/customers/:id           # Delete
GET    /api/customers/:id/stats    # Get stats
```

### Gavin AI Endpoints
```
POST   /api/gavin/chat              # Send message
POST   /api/gavin/voice             # Voice query
GET    /api/gavin/suggestions       # Get proactive suggestions
POST   /api/gavin/research          # Background research
```

### Report Endpoints
```
POST   /api/reports/generate        # Generate report
GET    /api/reports/:id             # Get status
GET    /api/reports/:id/download     # Download
```

---

## 🚀 Implementation Phases

| Phase | Duration | Focus |
|-------|----------|-------|
| 1 | Days 1-3 | Foundation (setup, design system, layout) |
| 2 | Days 4-6 | Data layer (database, API, hooks) |
| 3 | Days 7-9 | Dashboard (stats, customer list, filters) |
| 4 | Days 10-14 | Customer detail (8 tabs, all features) |
| 5 | Days 15-18 | Gavin AI (chat, voice, suggestions) |
| 6 | Days 19-22 | Reports (templates, PDF/Word export) |
| 7 | Days 23-25 | Search (global, transcript, filters) |
| 8 | Days 26-28 | Real-time (WebSocket, notifications) |
| 9 | Days 29-32 | Polish (testing, accessibility, docs) |
| 10 | Days 33-35 | Deployment (Vercel, monitoring, CI/CD) |

**Total: 35 days**

---

## 📁 File Structure

```
decklar-intelligence/gavin/portal-design/
├── README.md                          # This file
├── ARCHITECTURE.md                    # System architecture
├── DATA_MODELS.md                     # TypeScript interfaces
├── API_SPEC.md                        # API endpoints
├── UI_SPEC.md                         # Design system
├── IMPLEMENTATION_CHECKLIST.md        # Task breakdown
└── assets/                            # Screenshots, diagrams
    ├── dashboard-mockup.png
    ├── detail-view-mockup.png
    └── component-library.png
```

---

## ✅ Next Steps for Dinesh

1. **Review all 5 specification documents**
2. **Prioritize Phase 1 (Foundation) tasks**
3. **Set up Next.js project with TypeScript**
4. **Install shadcn/ui and configure Tailwind**
5. **Begin component development following UI_SPEC.md**

---

## 📝 Design Principles

1. **Customer-First:** Every feature serves the account manager's workflow
2. **AI-Augmented:** Gavin enhances productivity without replacing judgment
3. **Fast & Responsive:** Sub-second interactions, optimistic updates
4. **Accessible:** WCAG 2.1 AA compliant, keyboard navigable
5. **Beautiful:** Professional SaaS aesthetic that reflects Decklar brand

---

## 🔐 Security Considerations

- JWT-based authentication
- Row-level security for customer data
- API rate limiting
- Input validation (Zod schemas)
- XSS and CSRF protection
- No secrets in client-side code

---

## 📈 Success Metrics

- **Performance:** 
  - First Contentful Paint < 1.5s
  - API response time < 200ms (p95)
  
- **Adoption:**
  - Daily active users
  - Feature usage rates
  - Time-to-task completion

- **AI Effectiveness:**
  - Gavin query success rate
  - Document generation quality
  - Proactive suggestion accuracy

---

## 🎓 For Developers

This is a **comprehensive specification**, not a tutorial. Dinesh should:

1. Read ARCHITECTURE.md for system understanding
2. Reference DATA_MODELS.md for all TypeScript types
3. Follow UI_SPEC.md for component implementation
4. Use API_SPEC.md when building backend endpoints
5. Track progress with IMPLEMENTATION_CHECKLIST.md

---

*Document Version: 1.0*
*Last Updated: 2026-05-15*
*Author: Gavin (Decklar AI)*
*Status: Complete - Ready for Implementation*
