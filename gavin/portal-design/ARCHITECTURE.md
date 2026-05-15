# Decklar Customer Management Portal — Architecture Document

## Overview

A production-grade Next.js application for managing Decklar's IoT supply chain visibility customers. The portal provides real-time customer intelligence, AI-powered assistance via Gavin, and comprehensive account management capabilities.

---

## Tech Stack

### Frontend
| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14+ (App Router) | SSR, routing, API routes |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first styling |
| UI Components | shadcn/ui | Accessible component primitives |
| State Management | Zustand | Global state (lightweight) |
| Data Fetching | TanStack Query | Server state management |
| Real-time | Server-Sent Events / WebSocket | Live updates |

### Backend
| Layer | Technology | Purpose |
|-------|------------|---------|
| API | Next.js API Routes | RESTful endpoints |
| AI | OpenAI API + ElevenLabs | Gavin intelligence + voice |
| Memory | SuperMemory API | Per-customer context |
| Search | In-memory + Fuse.js | Client-side search |
| Export | jsPDF + docx.js | Document generation |

### Infrastructure
| Layer | Technology | Purpose |
|-------|------------|---------|
| Hosting | Vercel / Self-hosted | Deployment |
| Database | SQLite (local) / PostgreSQL (prod) | Customer data |
| Storage | Local filesystem / S3 | Documents, transcripts |
| CDN | Vercel Edge / CloudFront | Static assets |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Browser    │  │   Discord    │  │  Mobile App  │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
└─────────┼─────────────────┼─────────────────┼─────────────────┘
          │                 │                 │
          ▼                 │                 │
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS APPLICATION                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     App Router                           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │ Dashboard│ │ Customer │ │  Reports │ │ Settings │   │  │
│  │  │   Page   │ │  Detail  │ │   Page   │ │   Page   │   │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │  │
│  │       └─────────────┴─────────────┴─────────────┘        │  │
│  │                      │                                   │  │
│  │                      ▼                                   │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │              Component Layer                         │ │  │
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │ │  │
│  │  │  │Customer│ │ Health │ │  Open  │ │  Call  │      │ │  │
│  │  │  │  List  │ │  Card  │ │ Items  │ │ History│      │ │  │
│  │  │  └────────┘ └────────┘ └────────┘ └────────┘      │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    API Routes (/api)                     │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │  │
│  │  │/customers│ │/customer │ │ /reports│ │ /gavin  │        │  │
│  │  │   /GET  │ │ /[id]/* │ │   /*    │ │   /*    │        │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Gavin AI   │  │   Document   │  │    Search    │           │
│  │   Service    │  │   Generator  │  │    Engine    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  SQLite/     │  │ SuperMemory  │  │    File      │           │
│  │  PostgreSQL   │  │    API       │  │   System     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL INTEGRATIONS                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │    OpenAI    │  │  ElevenLabs  │  │   Discord    │           │
│  │    API       │  │    API       │  │    Bot       │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Customer Data Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Portal UI  │────▶│  API Route  │────▶│   Service   │────▶│   SQLite    │
│             │◀────│  (/api/*)   │◀────│    Layer    │◀────│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                                              │             │
       │                                              │             │
       ▼                                              ▼             ▼
┌─────────────┐                              ┌─────────────┐ ┌─────────────┐
│ SuperMemory │◀─────────────────────────────│   Gavin AI  │ │ File System │
│     API     │                              │   Service   │ │(docs/trans) │
└─────────────┘                              └─────────────┘ └─────────────┘
```

### 2. Gavin AI Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│  /api/gavin │────▶│   OpenAI    │────▶│  LLM        │
│   Query     │     │   /chat     │     │    API      │     │ Response    │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                     ┌────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ SuperMemory │◀────│   Context   │◀────│  Response   │◀────│  Process    │
│   Context   │     │   Builder   │     │  Formatter  │     │   Response  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│ ElevenLabs  │ (Optional voice synthesis)
│    TTS      │
└─────────────┘
```

### 3. Document Generation Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Generate  │────▶│  /api/docs  │────▶│  Template   │────▶│   jsPDF/    │
│   Request   │     │  /generate  │     │   Engine    │     │   docx.js   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                     ┌────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   File      │◀────│   Export    │◀────│  Document   │
│   System    │     │   Handler   │     │   Buffer    │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## API Endpoints

### Customer Endpoints
```
GET    /api/customers              # List all customers (with filters)
POST   /api/customers              # Create new customer
GET    /api/customers/[id]          # Get customer details
PUT    /api/customers/[id]          # Update customer
DELETE /api/customers/[id]          # Delete customer
GET    /api/customers/[id]/history  # Get call history
GET    /api/customers/[id]/items    # Get open items
```

### Gavin AI Endpoints
```
POST   /api/gavin/chat              # Send message to Gavin
POST   /api/gavin/voice             # Voice query to Gavin
GET    /api/gavin/suggestions       # Get proactive suggestions
POST   /api/gavin/research          # Trigger background research
```

### Report Endpoints
```
POST   /api/reports/deployment      # Generate deployment plan
POST   /api/reports/qbr             # Generate QBR
POST   /api/reports/health          # Generate health snapshot
POST   /api/reports/value           # Generate value prop
GET    /api/reports/[id]/download    # Download generated report
```

### Search Endpoints
```
GET    /api/search?q=query          # Global search
GET    /api/search/customers        # Customer search
GET    /api/search/transcripts      # Transcript search
```

---

## Security Model

### Authentication
- JWT-based authentication
- Session persistence in httpOnly cookies
- Token refresh mechanism

### Authorization
| Role | Permissions |
|------|-------------|
| Admin | Full CRUD on all customers, system settings |
| Manager | CRUD on assigned customers, read-only others |
| Viewer | Read-only access to all customers |

### Data Isolation
- Customer data scoped to authenticated user
- No cross-tenant data access
- Audit logging on all mutations

---

## Performance Considerations

### Caching Strategy
```
┌─────────────────────────────────────────────────────────────────┐
│  L1: React Query Cache (Client)                                │
│     - Customer lists: 5 minutes                                │
│     - Individual customers: 2 minutes                          │
│     - Search results: 1 minute                                 │
│                                                                  │
│  L2: Next.js Cache (Server)                                     │
│     - Static data: 1 hour                                       │
│     - API responses: 5 minutes                                  │
│                                                                  │
│  L3: Database Query Cache                                       │
│     - Frequently accessed customers                             │
│     - Aggregated statistics                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Optimization Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- API Response Time: < 200ms (p95)
- Search Response: < 100ms

---

## Deployment Architecture

### Vercel (Recommended)
```
┌─────────────────────────────────────────────────────────────────┐
│                     VERCEL PLATFORM                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Edge       │  │   Serverless │  │   Static     │           │
│  │   Network    │  │   Functions  │  │   Assets     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Serverless Functions                        │  │
│  │  - API Routes                                             │  │
│  │  - Server Components                                      │  │
│  │  - Edge Middleware                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Supabase   │  │ SuperMemory  │  │   OpenAI     │           │
│  │  (PostgreSQL)│  │     API      │  │     API      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Self-Hosted Option
```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Next.js    │  │   Nginx      │  │   Postgres   │           │
│  │    App       │  │   (Proxy)    │  │   (DB)       │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Volume Mounts                                 │  │
│  │  - /app/uploads (documents)                               │  │
│  │  - /app/data (SQLite fallback)                            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Monitoring & Observability

### Metrics to Track
- API response times by endpoint
- Error rates (5xx, 4xx)
- AI response latency
- Document generation duration
- Search query performance

### Logging Strategy
```typescript
// Structured logging
{
  level: 'info' | 'warn' | 'error',
  service: 'gavin-portal',
  endpoint: '/api/customers',
  customerId?: 'uuid',
  userId: 'uuid',
  duration: 123,
  timestamp: 'ISO8601'
}
```

---

## Future Roadmap

### Phase 1: MVP (Current)
- [x] Customer CRUD operations
- [x] Basic Gavin chat
- [x] Document generation
- [x] Health status tracking

### Phase 2: Intelligence (Next)
- [ ] Predictive health scoring
- [ ] Automated transcript analysis
- [ ] Proactive alert system
- [ ] Advanced search with AI

### Phase 3: Automation (Future)
- [ ] Automated QBR scheduling
- [ ] Email draft generation
- [ ] Integration with Salesforce
- [ ] Integration with Honeycomb

---

*Document Version: 1.0*
*Last Updated: 2026-05-15*
*Author: Gavin (Decklar AI)*
