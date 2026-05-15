# Decklar Customer Management Portal — UI Specification

Complete visual design system and component specifications.

---

## Design System

### Color Palette

#### Primary Colors
```css
--color-primary: #2563EB;           /* Decklar Blue - primary actions */
--color-primary-dark: #1D4ED8;      /* Hover states */
--color-primary-light: #60A5FA;     /* Accents, highlights */
--color-primary-bg: #EFF6FF;        /* Light backgrounds */

--color-secondary: #10B981;         /* Success Green */
--color-secondary-dark: #059669;
--color-secondary-light: #6EE7B7;
--color-secondary-bg: #ECFDF5;
```

#### Status Colors
```css
--color-success: #10B981;           /* Green - healthy */
--color-warning: #F59E0B;           /* Amber - attention needed */
--color-danger: #EF4444;            /* Red - at risk */
--color-info: #3B82F6;              /* Blue - neutral status */

/* Health RAG specific */
--color-health-green: #22C55E;
--color-health-amber: #F59E0B;
--color-health-red: #EF4444;
```

#### Neutral Colors
```css
--color-gray-900: #111827;          /* Primary text */
--color-gray-800: #1F2937;          /* Secondary text */
--color-gray-700: #374151;          /* Tertiary text */
--color-gray-600: #4B5563;          /* Muted text */
--color-gray-500: #6B7280;          /* Placeholder text */
--color-gray-400: #9CA3AF;          /* Borders light */
--color-gray-300: #D1D5DB;          /* Borders */
--color-gray-200: #E5E7EB;          /* Dividers */
--color-gray-100: #F3F4F6;          /* Light backgrounds */
--color-gray-50: #F9FAFB;           /* Page backgrounds */
--color-white: #FFFFFF;             /* Cards, inputs */
```

### Typography

#### Font Stack
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Type Scale
```css
/* Display */
--text-display: 3rem;      /* 48px - Hero headlines */
--text-display-sm: 2.25rem; /* 36px */

/* Headings */
--text-h1: 2rem;           /* 32px */
--text-h2: 1.5rem;         /* 24px */
--text-h3: 1.25rem;        /* 20px */
--text-h4: 1.125rem;       /* 18px */

/* Body */
--text-body-lg: 1.125rem;  /* 18px */
--text-body: 1rem;         /* 16px - Base */
--text-body-sm: 0.875rem;  /* 14px */
--text-caption: 0.75rem;   /* 12px */

/* Font weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Spacing Scale
```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Border Radius
```css
--radius-none: 0;
--radius-sm: 0.125rem;  /* 2px */
--radius: 0.25rem;      /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;  /* Pills, avatars */
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Focus rings */
--ring-primary: 0 0 0 2px var(--color-primary-bg), 0 0 0 4px var(--color-primary);
--ring-danger: 0 0 0 2px #FEF2F2, 0 0 0 4px var(--color-danger);
```

---

## Layout

### App Shell
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER (fixed, 64px)                                                       │
│  ┌──────────┬────────────────────────────────────────┬─────────────┐        │
│  │  Logo    │  Search Bar         │ Actions | User   │            │        │
│  └──────────┴────────────────────────────────────────┴─────────────┘        │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │                                                                  │
│ SIDEBAR  │                        MAIN CONTENT                            │
│ (240px)  │                        (flex: 1)                                 │
│          │                                                                  │
│ ┌──────┐ │ ┌─────────────────────────────────────────────────────────────┐  │
│ │ Nav  │ │ │                                                             │  │
│ │ Item │ │ │                        [Page Content]                       │  │
│ │ Item │ │ │                                                             │  │
│ │ Item │ │ └─────────────────────────────────────────────────────────────┘  │
│ └──────┘ │                                                                  │
│          │                                                                  │
├──────────┼──────────────────────────────────────────────────────────────────┤
│          │                         │                                      │
│          │    GAVIN PANEL          │   QUICK ACTIONS                      │
│          │    (320px, optional)    │   (floating)                         │
│          │                         │                                      │
└──────────┴─────────────────────────┴────────────────────────────────────────┘
```

### Breakpoints
```css
--breakpoint-sm: 640px;    /* Mobile landscape */
--breakpoint-md: 768px;    /* Tablet */
--breakpoint-lg: 1024px;   /* Desktop */
--breakpoint-xl: 1280px;   /* Large desktop */
--breakpoint-2xl: 1536px;  /* Extra large */
```

### Grid System
- Base: 12-column grid
- Gutter: 24px (--space-6)
- Max content width: 1440px
- Page padding: 24px (--space-6)

---

## Components

### 1. Navigation

#### Sidebar Navigation
```typescript
interface SidebarProps {
  items: NavItem[];
  activeItem: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  href: string;
  badge?: number;
  children?: NavItem[];
}
```

**States:**
- Default: text-gray-600
- Hover: bg-gray-50, text-gray-900
- Active: bg-primary-bg, text-primary, border-r-2 border-primary
- Collapsed: Show icons only

#### Top Bar
```typescript
interface TopBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  notifications: Notification[];
  user: User;
}
```

### 2. Customer Components

#### Customer Card (Dashboard)
```typescript
interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
  compact?: boolean;
}
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ ┌──────┐ Customer Name             [▶]│
│ │ 🖼️   │ Industry • Region            │
│ │Health│                                 │
│ │Badge │ Last contact: 3 days ago      │
│ └──────┘                                 │
│ ─────────────────────────────────────── │
│ [Open: 3] [Calls: 12] [Devices: 156]    │
└─────────────────────────────────────────┘
```

**Specs:**
- Width: 320px (flexible)
- Padding: 16px
- Border: 1px solid gray-200
- Border-radius: 8px
- Shadow: shadow-sm (default), shadow-md (hover)

#### Customer List Item
```typescript
interface CustomerListItemProps {
  customer: Customer;
  selected: boolean;
  onSelect: () => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ 🟢 │ Customer Name      │ Industry    │
│    │ Last: May 15       │ Status: 🟢  │
└─────────────────────────────────────────┘
```

#### Health Badge
```typescript
interface HealthBadgeProps {
  status: 'green' | 'amber' | 'red';
  size: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}
```

**Variants:**
```css
/* Green */
.health-badge-green {
  background: #ECFDF5;
  color: #059669;
  border: 1px solid #6EE7B7;
}

/* Amber */
.health-badge-amber {
  background: #FFFBEB;
  color: #B45309;
  border: 1px solid #FCD34D;
}

/* Red */
.health-badge-red {
  background: #FEF2F2;
  color: #B91C1C;
  border: 1px solid #FECACA;
}
```

### 3. Detail View Components

#### Tab Navigation
```typescript
interface DetailTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

interface TabItem {
  id: string;
  label: string;
  icon?: IconName;
  badge?: number;
}
```

**Tabs:**
- Overview
- Contacts
- Deployment
- Capabilities
- Open Items
- Call History
- Insights
- Value Proof

#### Contact Card
```typescript
interface ContactCardProps {
  contact: Contact;
  isPrimary?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ ┌────┐ Name              [⭐ Primary]   │
│ │👤  │ Title                          │
│ └────┘ 📧 email@example.com           │
│      📱 +1-555-123-4567                │
│      Last contact: 2 weeks ago          │
└─────────────────────────────────────────┘
```

#### Open Item Row
```typescript
interface OpenItemRowProps {
  item: OpenItem;
  onClick?: () => void;
  onComplete?: () => void;
}
```

**Priority Indicators:**
```css
/* Critical - red left border */
.open-item-critical {
  border-left: 4px solid var(--color-danger);
}

/* High - amber left border */
.open-item-high {
  border-left: 4px solid var(--color-warning);
}

/* Medium - yellow left border */
.open-item-medium {
  border-left: 4px solid #FCD34D;
}

/* Low - gray left border */
.open-item-low {
  border-left: 4px solid var(--color-gray-300);
}
```

#### Call Record Card
```typescript
interface CallRecordCardProps {
  call: CallRecord;
  expanded?: boolean;
  onToggle?: () => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ 📅 May 15, 2024                    45m │
│ 👤 John Smith, Jane Doe                │
│ 📝 QBR - Q2 Review                      │
│ ───────────────────────────────────────│
│ Sentiment: 😊 Positive                  │
│ Key takeaways:                          │
│ • Timeline moved to June                │
│ • Need facility list                    │
│ [View transcript] [Download recording] │
└─────────────────────────────────────────┘
```

### 4. Dashboard Components

#### Stat Card
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: IconName;
  color: 'blue' | 'green' | 'amber' | 'red';
}
```

**Layout:**
```
┌─────────────────────────────────────────┐
│                                     🏢 │
│ Total Customers                         │
│ 156                                 +12%│
└─────────────────────────────────────────┘
```

#### Activity Feed
```typescript
interface ActivityFeedProps {
  activities: Activity[];
  limit?: number;
}
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ Recent Activity                         │
│ ───────────────────────────────────────│
│ 🟢 Call completed - Schneider          │
│    2 hours ago                           │
│ ───────────────────────────────────────│
│ 📝 Open item created - Acme Corp        │
│    4 hours ago                          │
│ ───────────────────────────────────────│
│ 🎉 Customer went live - XYZ Inc         │
│    Yesterday                            │
└─────────────────────────────────────────┘
```

#### Health Distribution Chart
```typescript
interface HealthDistributionProps {
  data: {
    green: number;
    amber: number;
    red: number;
  };
}
```

**Visual:** Donut chart with:
- Center: Total count
- Segments: Green, Amber, Red
- Legend below
- Hover: Show segment values

### 5. Search Components

#### Global Search
```typescript
interface GlobalSearchProps {
  query: string;
  results: SearchResult[];
  loading: boolean;
  onQueryChange: (query: string) => void;
  onResultSelect: (result: SearchResult) => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ 🔍 Search customers, calls, insights... │
├─────────────────────────────────────────┤
│ Results                                 │
│ ───────────────────────────────────────│
│ 👥 Customers (12)                       │
│    Schneider Electric                   │
│    Acme Corp                           │
│ ───────────────────────────────────────│
│ 📞 Calls (8)                            │
│    QBR with Schneider - May 15         │
│ ───────────────────────────────────────│
│ 💡 Insights (25)                        │
│    Schneider: Risk flagged              │
└─────────────────────────────────────────┘
```

### 6. Gavin AI Components

#### Gavin Chat Widget
```typescript
interface GavinChatProps {
  customerId?: string;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onVoiceQuery?: () => void;
  isTyping?: boolean;
}
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ 🤖 Gavin                               │
│ ───────────────────────────────────────│
│ > How can I help you today?            │
│                                        │
│ [Message list with avatars]            │
│                                        │
│ ┌───────────────────────────────────┐ │
│ │ Type a message...          [🎤] │ │
│ └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Gavin Suggestion Pill
```typescript
interface GavinSuggestionProps {
  suggestion: GavinSuggestion;
  onAccept?: () => void;
  onDismiss?: () => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ 💡 Suggestion: Schneider check-in due                   │
│    14 days since last contact                          │
│    [Schedule call] [Dismiss]                            │
└─────────────────────────────────────────────────────────┘
```

#### Voice Waveform
```typescript
interface VoiceWaveformProps {
  isRecording: boolean;
  audioLevel: number; // 0-1
}
```

**Visual:** Animated waveform bars during voice input

### 7. Form Components

#### Input Field
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'number';
}
```

**States:**
```css
/* Default */
.input {
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  padding: 8px 12px;
}

/* Focus */
.input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--ring-primary);
}

/* Error */
.input.error {
  border-color: var(--color-danger);
}

/* Disabled */
.input:disabled {
  background: var(--color-gray-100);
  color: var(--color-gray-500);
}
```

#### Select Dropdown
```typescript
interface SelectProps<T> {
  label?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
}
```

#### Date Picker
```typescript
interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}
```

#### Text Area
```typescript
interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
}
```

### 8. Button Components

#### Button
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
}
```

**Variants:**
```css
/* Primary */
.btn-primary {
  background: var(--color-primary);
  color: white;
}
.btn-primary:hover {
  background: var(--color-primary-dark);
}

/* Secondary */
.btn-secondary {
  background: var(--color-gray-100);
  color: var(--color-gray-900);
  border: 1px solid var(--color-gray-300);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--color-gray-700);
}

/* Danger */
.btn-danger {
  background: var(--color-danger);
  color: white;
}
```

**Sizes:**
- sm: 28px height, 8px 12px padding, 12px text
- md: 36px height, 10px 16px padding, 14px text
- lg: 44px height, 12px 24px padding, 16px text

#### Icon Button
```typescript
interface IconButtonProps {
  icon: IconName;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'ghost' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}
```

### 9. Modal Components

#### Base Modal
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

**Sizes:**
- sm: 400px max-width
- md: 500px max-width
- lg: 600px max-width
- xl: 800px max-width

**Specs:**
- Background overlay: rgba(0, 0, 0, 0.5)
- Modal background: white
- Border-radius: 12px
- Shadow: shadow-xl
- Padding: 24px

#### Confirmation Dialog
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'default';
}
```

### 10. Feedback Components

#### Toast Notification
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}
```

**Position:** Top-right corner, stacked vertically
**Duration:** 5 seconds default, auto-dismiss

#### Loading Spinner
```typescript
interface SpinnerProps {
  size: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
}
```

#### Skeleton Loading
```typescript
interface SkeletonProps {
  variant: 'text' | 'card' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  lines?: number;
}
```

### 11. Data Display Components

#### Badge
```typescript
interface BadgeProps {
  variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}
```

#### Avatar
```typescript
interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'offline';
}
```

**Sizes:**
- xs: 20px
- sm: 24px
- md: 32px
- lg: 40px
- xl: 48px

#### Progress Bar
```typescript
interface ProgressBarProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
}
```

#### Empty State
```typescript
interface EmptyStateProps {
  icon: IconName;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

## Page Layouts

### 1. Dashboard Page
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Dashboard                                              [+ Add Customer]    │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │ Customers│ │ At Risk  │ │ Open     │ │ Calls    │ │ Revenue  │         │
│ │   156    │ │    12    │ │   234    │ │   87     │ │  $4.25M  │         │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                             │
│ ┌───────────────────────────────────┐ ┌─────────────────────────────────┐   │
│ │ Health Distribution               │ │ Recent Activity                 │   │
│ │ [Donut Chart]                     │ │ • Call completed...           │   │
│ │ Green: 67                         │ │ • Open item created...        │   │
│ │ Amber: 45                         │ │ • Customer went live...       │   │
│ │ Red: 12                           │ │                                 │   │
│ └───────────────────────────────────┘ └─────────────────────────────────┘   │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐│
│ │ Customers                                                               ││
│ │ [Search] [Filters ▼]                                    [Grid ▦] [List ▩]││
│ │ ─────────────────────────────────────────────────────────────────────── ││
│ │ [Customer Card] [Customer Card] [Customer Card] [Customer Card]        ││
│ │ [Customer Card] [Customer Card] [Customer Card] [Customer Card]        ││
│ └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2. Customer Detail Page
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┬───────────────────────────────────────────────────────────────┤
│ │          │ Schneider Electric                                    [🟡]    │
│ │ CUSTOMER │ Manufacturing • North America                             │
│ │  LIST    │ Last contact: May 15, 2024                             │
│ │          │ ─────────────────────────────────────────────────────────     │
│ │ [Search] │ [Overview] [Contacts] [Deployment] [Open Items] ...           │
│ │          │ ─────────────────────────────────────────────────────────     │
│ │ ┌──────┐ │                                                               │
│ │ │Schne │ │ Current Tab Content:                                         │
│ │ │Acme  │ │ • Customer overview                                          │
│ │ │XYZ   │ │ • Key metrics                                                │
│ │ │...   │ │ • Recent activity                                            │
│ │ └──────┘ │ • Quick actions                                              │
│ │          │                                                               │
│ └──────────┴───────────────────────────────────────────────────────────────┤
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┤
│ │ 🤖 Gavin Chat                                                        │
│ │ ──────────────────────────────────────────────────────────────────── │
│ │ > How can I help you with Schneider?                                 │
│ │                                                                      │
│ │ [Message history...]                                                 │
│ │                                                                      │
│ │ ┌────────────────────────────────────────┐                           │
│ │ │ Ask Gavin anything...          [🎤]  │                           │
│ │ └────────────────────────────────────────┘                           │
│ └────────────────────────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Animation Specifications

### Transitions
```css
/* Standard transitions */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Easing functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Animation Guidelines

**Micro-interactions:**
- Button hover: 150ms ease
- Focus ring: 200ms ease-out
- Loading spinner: 800ms linear infinite
- Toast entrance: 300ms ease-out
- Toast exit: 200ms ease-in

**Page Transitions:**
- Fade in: 300ms ease-out
- Slide up: 300ms ease-out, translateY(10px) → translateY(0)
- Modal entrance: 200ms ease-out, scale(0.95) → scale(1)

**Loading States:**
- Skeleton pulse: 2s ease-in-out infinite
- Progress bar: 300ms ease

---

## Responsive Behavior

### Breakpoint Adaptations

**Mobile (< 768px):**
- Sidebar becomes bottom navigation
- Customer grid → single column
- Detail view: full-screen with back button
- Gavin panel: bottom sheet
- Tables → cards

**Tablet (768px - 1024px):**
- Sidebar collapses to icons
- Customer grid: 2 columns
- Detail view: full width

**Desktop (> 1024px):**
- Full sidebar
- Customer grid: 3-4 columns
- Detail view: 2-column layout
- Gavin panel: visible sidebar

### Touch Targets
- Minimum: 44x44px
- Buttons: 36px height minimum
- List items: 48px height
- Spacing between touch targets: 8px minimum

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

**Focus Management:**
- Visible focus indicators
- Focus trap in modals
- Skip links for keyboard navigation

**Screen Readers:**
- Semantic HTML5 elements
- ARIA labels for icons
- Descriptive alt text
- Live regions for dynamic content

**Keyboard Navigation:**
- Tab order follows visual order
- Escape closes modals/dropdowns
- Enter/Space activates buttons
- Arrow keys navigate lists

### ARIA Patterns

```html
<!-- Button with icon -->
<button aria-label="Download report">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Loading state -->
<button aria-busy="true" aria-label="Loading, please wait">
  <span class="sr-only">Loading...</span>
  <span aria-hidden="true">Spinner</span>
</button>

<!-- Alert -->
<div role="alert" aria-live="polite">
  Customer updated successfully
</div>

<!-- Modal -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Add Customer</h2>
  ...
</div>
```

---

*Document Version: 1.0*
*Last Updated: 2026-05-15*
*Author: Gavin (Decklar AI)*
