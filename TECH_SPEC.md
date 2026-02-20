# Pulse Pro — Technical Specification

**Version:** 1.0 (Calgary)
**Last Updated:** February 20, 2026

---

## Overview

Pulse Pro is a project and task management SaaS for freelancers, agencies, and small teams. Built with Next.js 16 (App Router), it provides client management, project tracking, task boards, time logging, bookmarks, team sharing, and a Telegram bot — all with a freemium billing model via Polar.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router, Server Actions, Turbopack) |
| Language | TypeScript 5.9 (strict mode) |
| UI | React 19, Tailwind CSS 4, Lucide icons |
| Database | PostgreSQL via Prisma 5.22 |
| Auth | Clerk (with Organizations support) |
| Payments | Polar (checkout, webhooks, customer portal) |
| File Storage | Vercel Blob |
| Email | Resend |
| Bot | Telegram Bot API |
| Analytics | Vercel Analytics + Speed Insights |
| Drag & Drop | @dnd-kit |
| Deployment | Vercel |

---

## Database Schema

### Client
| Field | Type | Notes |
|-------|------|-------|
| id | String | CUID primary key |
| userId | String | Owner (Clerk user ID) |
| orgId | String? | Organization scope (future) |
| name | String | Required |
| email | String? | |
| phone | String? | |
| company | String? | |
| logo | String? | URL to uploaded image |
| status | String | `active` / `inactive` |
| notes | String? | |

### Project
| Field | Type | Notes |
|-------|------|-------|
| id | String | CUID primary key |
| userId | String | Owner |
| orgId | String? | Organization scope |
| name | String | Required |
| description | String? | |
| notes | String? | |
| status | String | `not_started` / `in_progress` / `on_hold` / `completed` |
| priority | String | `low` / `medium` / `high` |
| dueDate | DateTime? | |
| budget | Float? | |
| clientId | String | FK to Client |

**Relations:** tasks, images, timeEntries, access (ProjectAccess)

### Task
| Field | Type | Notes |
|-------|------|-------|
| id | String | CUID primary key |
| userId | String | Owner |
| orgId | String? | Organization scope |
| title | String | Required |
| description | String? | |
| notes | String? | |
| completed | Boolean | Default false |
| status | String | `todo` / `in_progress` / `done` |
| sortOrder | Int | For board ordering |
| priority | String | `low` / `medium` / `high` |
| startDate | DateTime? | |
| dueDate | DateTime? | |
| projectId | String | FK to Project |
| url | String? | If set, task is a bookmark |
| bookmarkType | String? | `youtube` / `twitter` / null |
| thumbnailUrl | String? | Auto-fetched from URL |
| tags | String[] | Array of tag strings |

**Relations:** images (TaskImage), files (TaskFile), comments (TaskComment)

### TaskImage / TaskFile / TaskComment
- **TaskImage:** id, path (URL), name, taskId
- **TaskFile:** id, path (URL), name, type (mime), size (bytes), taskId
- **TaskComment:** id, content, taskId, createdAt, updatedAt

### ProjectImage
- id, path (URL), name, projectId

### TimeEntry
- id, hours (Float), description, date, projectId

### ProjectAccess (Team Sharing)
| Field | Type | Notes |
|-------|------|-------|
| id | String | CUID primary key |
| projectId | String | FK to Project |
| userId | String | Clerk user ID of team member |
| role | String | `viewer` / `editor` / `manager` |
| grantedBy | String | Who granted access |

**Unique constraint:** projectId + userId

### Subscription
| Field | Type | Notes |
|-------|------|-------|
| id | String | CUID primary key |
| userId | String | Unique, Clerk user ID |
| orgId | String? | Organization scope |
| polarCustomerId | String? | Polar customer reference |
| polarSubscriptionId | String? | Polar subscription reference |
| plan | String | `free` / `pro` |
| status | String | `active` / `canceled` / `past_due` / `trialing` |
| currentPeriodEnd | DateTime? | |
| cancelAtPeriodEnd | Boolean | Default false |
| telegramChatId | String? | Unique, for bot messaging |
| telegramVerifyCode | String? | 10-minute link code |
| telegramVerifyExpires | DateTime? | |
| telegramRemindersEnabled | Boolean | Default false |

---

## Routes

### Public
| Route | Description |
|-------|------------|
| `/` | Marketing landing page (Hero, Features, Pricing, FAQ, Testimonials) |
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Protected (Auth Required)
| Route | Description |
|-------|------------|
| `/dashboard` | Stats cards, project health, smart insights, recent activity, calendar |
| `/projects` | Project list with search, filter by status/priority/client, sort |
| `/projects/new` | Create project form |
| `/projects/[id]` | Project detail — tabs: Tasks, Bookmarks, Time Tracking, Files, Team |
| `/clients` | Client list with search, filter by status, sort |
| `/clients/new` | Create client form |
| `/clients/[id]` | Client detail with related projects |
| `/tasks` | All tasks with date/status/priority/project filtering |
| `/tasks/[id]` | Task detail page |
| `/bookmarks` | Saved bookmarks (tasks with URLs) |
| `/calendar` | Calendar view of tasks and projects |
| `/settings` | Theme, billing management, Telegram bot linking |

### Admin (Requires ADMIN_USER_IDS)
| Route | Description |
|-------|------------|
| `/admin` | Platform stats: total users, Pro subscribers, projects, tasks, clients |
| `/admin/users` | Paginated user table with plan badges and usage counts |

---

## API Routes

| Method | Route | Description |
|--------|-------|------------|
| POST | `/api/upload` | File upload to Vercel Blob (images, PDFs, markdown; 10MB max) |
| GET | `/api/checkout` | Redirects to Polar hosted checkout with userId metadata |
| POST | `/api/webhook/polar` | Polar subscription lifecycle webhooks |
| POST | `/api/webhook/telegram` | Telegram bot webhook (commands, link verification) |
| GET | `/api/cron/daily-reminder` | Vercel Cron — email + Telegram daily task reminders |
| GET | `/api/calendar` | Calendar data for a given month |
| POST | `/api/bookmark-metadata` | Fetch title/thumbnail from URL (YouTube, Twitter, generic) |
| GET | `/api/portal` | Redirect to Polar customer billing portal |
| GET | `/api/og` | OG image endpoint |

---

## Server Actions

### Projects (`src/actions/projects.ts`)
| Action | Description |
|--------|------------|
| `getProjects(filters)` | List projects with search, status, priority, client filtering and custom sort |
| `getProject(id)` | Single project with tasks, images, time entries |
| `createProject(formData)` | Create project (enforces plan limits) |
| `updateProject(id, formData)` | Update project (owner or manager) |
| `deleteProject(id)` | Delete project (owner only) |
| `getProjectsForGantt()` | Projects with tasks for timeline view |
| `getClientsForSelect()` | Active clients for dropdowns |
| `addProjectImage(projectId, path, name)` | Attach image (owner or editor+) |
| `removeProjectImage(imageId)` | Remove image (owner or editor+) |
| `addTimeEntry(projectId, formData)` | Log hours (owner or editor+) |
| `deleteTimeEntry(id)` | Remove time entry (owner or editor+) |

### Tasks (`src/actions/tasks.ts`)
| Action | Description |
|--------|------------|
| `getTask(id)` | Single task with images, files, comments |
| `createTask(projectId, formData)` | Create task (enforces plan limits, team access) |
| `updateTask(id, formData)` | Update task or bookmark tags |
| `toggleTask(id)` | Mark complete/incomplete |
| `deleteTask(id)` | Delete task |
| `addTaskImage/removeTaskImage` | Manage task images |
| `addTaskFile/removeTaskFile` | Manage task file attachments |
| `addTaskComment/deleteTaskComment` | Manage task comments |
| `getAllTasks(filters)` | All tasks (owned + shared) with filtering |
| `getProjectsForTaskFilter()` | Projects for filter dropdown |

### Clients (`src/actions/clients.ts`)
| Action | Description |
|--------|------------|
| `getClients(search, status, sort)` | List clients with filtering and sort |
| `getClient(id)` | Single client with projects |
| `createClient(formData)` | Create client (enforces plan limits) |
| `updateClient(id, formData)` | Update client |
| `deleteClient(id)` | Delete client |

### Dashboard (`src/actions/dashboard.ts`)
| Action | Description |
|--------|------------|
| `getDashboardStats()` | Totals: clients, projects, tasks (includes shared) |
| `getProjectsDueThisWeek()` | Projects due in next 7 days |
| `getTasksDueToday()` | Incomplete tasks due today |
| `getOverdueTasks()` | Overdue incomplete tasks |
| `getTasksDueThisWeek()` | Count of tasks due this week |
| `getRecentlyViewed()` | Recent projects, tasks, bookmarks |
| `getRecentProjects()` | 5 most recent projects |
| `getProjectHealth()` | Health scores (healthy / at_risk / critical) |
| `getSmartInsights()` | Actionable insights (high priority, stale projects) |

### Board (`src/actions/board.ts`)
| Action | Description |
|--------|------------|
| `updateTaskStatus(taskId, status, sortOrder)` | Kanban drag-drop status update (requires editor+) |

### Access (`src/actions/access.ts`)
| Action | Description |
|--------|------------|
| `grantProjectAccess(projectId, userId, role)` | Share project with team member |
| `revokeProjectAccess(projectId, userId)` | Remove team member access |
| `getProjectMembers(projectId)` | List owner + shared members with roles |
| `getOrgMembers()` | List Clerk organization members |

### Search (`src/actions/search.ts`)
| Action | Description |
|--------|------------|
| `globalSearch(query)` | Search across projects, tasks, clients, bookmarks |

### Subscription (`src/actions/subscription.ts`)
| Action | Description |
|--------|------------|
| `getSubscriptionStatus()` | Current plan, status, billing period |
| `getUsageLimits()` | Usage counts vs plan limits |

### Telegram (`src/actions/telegram.ts`)
| Action | Description |
|--------|------------|
| `generateTelegramLink()` | Generate 10-minute link code (Pro only) |
| `unlinkTelegram()` | Disconnect Telegram account |
| `toggleTelegramReminders(enabled)` | Enable/disable daily reminders |
| `getTelegramSettings()` | Connection status and preferences |

### Admin (`src/actions/admin.ts`)
| Action | Description |
|--------|------------|
| `getAdminStats()` | Platform totals (users, Pro subs, projects, tasks, clients) |
| `getAdminUsers(page, limit)` | Paginated user list with usage data |

---

## Authentication & Authorization

### Clerk Integration
- Middleware enforces auth on all routes except public paths
- `requireUserId()` returns authenticated user ID (fallback: `local-dev-user` for dev)
- `getAuthContext()` returns `{ userId, orgId, orgRole, scopeId }`
- Organizations support for team workspaces

### Access Control (`src/lib/access.ts`)
- **Role hierarchy:** viewer < editor < manager < owner
- `getProjectRole(projectId)` — determines user's role (validates against known set)
- `requireProjectAccess(projectId, minRole)` — enforces minimum role, throws on failure
- `getProjectWhereWithAccess()` — builds Prisma WHERE for owned + shared projects
- Data scoping: owner queries (`WHERE userId = ?`) never removed; shared access added via OR

### Admin Access
- `ADMIN_USER_IDS` env var (comma-separated Clerk user IDs)
- `requireAdmin()` redirects non-admins to `/dashboard`
- Admin link in sidebar only visible to admin users

---

## Subscription & Billing

### Plans
| Feature | Free | Pro |
|---------|------|-----|
| Projects | 3 | Unlimited |
| Tasks | 50 | Unlimited |
| Clients | 1 | Unlimited |
| Telegram Bot | No | Yes |

### Polar Integration
- **Checkout:** `/api/checkout` redirects to Polar hosted checkout
- **Webhooks:** `/api/webhook/polar` handles subscription lifecycle events
- **Portal:** `/api/portal` redirects to Polar customer billing portal
- **Events:** subscription.active, subscription.canceled, subscription.revoked, subscription.updated
- `checkLimit(resource)` enforces plan limits before create operations

---

## Team Sharing

### How It Works
Projects are shared via the `ProjectAccess` table. The owner's `userId` scoping is never removed — shared access is additive via an OR clause.

### Roles
| Role | Can View | Can Edit Tasks | Can Edit Project | Can Manage Team | Can Delete Project |
|------|----------|---------------|-----------------|----------------|-------------------|
| Viewer | Yes | No | No | No | No |
| Editor | Yes | Yes | No | No | No |
| Manager | Yes | Yes | Yes | Yes (except grant manager) | No |
| Owner | Yes | Yes | Yes | Yes | Yes |

### UI Gating
- `canEdit` prop threaded from `ProjectTabs` to `TaskList`, `TaskBoard`, `TimeTracker`, `ProjectImages`
- Viewers see read-only UI: no toggle, edit, delete, or upload controls
- `ProjectHeader` hides edit/delete based on role

### Safety Guarantees
- No org created: behavior identical to solo user
- Org created, no shares: `getAccessibleProjectIds()` returns `[]`, no OR clause added
- Owner's `WHERE userId = ?` never removed from any query

---

## Telegram Bot

### Setup
1. User generates a link code in Settings (Pro only)
2. User sends code to the bot in Telegram
3. Bot verifies code and links the Telegram chat ID to the user's subscription

### Commands
| Command | Description |
|---------|------------|
| `/tasks` | List top 10 pending tasks |
| `/today` | Tasks due today |
| `/overdue` | Overdue tasks with days count |
| `/bookmarks` | Saved bookmarks |
| `/done N` | Mark task #N as complete (from last `/tasks` list) |
| `/add projectName taskTitle` | Create a new task |
| `/help` | Show available commands |

### Daily Reminders
- Vercel Cron job at `/api/cron/daily-reminder`
- Sends to users with `telegramRemindersEnabled = true`
- Includes overdue and due-today task summaries

---

## File Upload

- **Endpoint:** `POST /api/upload`
- **Storage:** Vercel Blob (public URLs)
- **Accepted:** JPEG, PNG, GIF, WebP, PDF, Markdown
- **Max Size:** 10MB
- **Path Pattern:** `{type}/{timestamp}-{sanitized-name}`
- **Types:** `projects/`, `tasks/`, `general/`

---

## Key Features

### Dashboard
- Stat cards with circular progress rings (Completed, Due This Week, Active Projects)
- Project health scoring (0–100, labels: healthy/at_risk/critical/completed)
- Smart insights (high priority tasks, stale projects — only when actionable)
- Recent activity, calendar widget, task lists

### Kanban Board
- Drag-and-drop task status changes (todo → in_progress → done)
- Sort order maintained per column
- Role-gated: viewers cannot drag

### Bookmarks
- Tasks with URLs become bookmarks
- Auto-fetches metadata (title, thumbnail) via `/api/bookmark-metadata`
- Supports YouTube (oEmbed), Twitter/X, and generic websites
- Tag support for organization

### Search
- Global command palette (Cmd+K)
- Searches projects, tasks, clients, bookmarks
- Includes shared project results

### Voice Input
- Web Speech API integration for task creation
- Browser-native speech-to-text

### Dark/Light Theme
- localStorage-persisted preference
- System preference detection
- Tailwind dark class

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk public key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `POLAR_ACCESS_TOKEN` | Yes | Polar API token |
| `POLAR_WEBHOOK_SECRET` | Yes | Polar webhook validation |
| `POLAR_ENVIRONMENT` | Yes | `sandbox` or `production` |
| `NEXT_PUBLIC_APP_URL` | Yes | App URL for redirects and canonical URLs |
| `RESEND_API_KEY` | For email | Resend email API key |
| `RESEND_FROM_EMAIL` | For email | Sender email address |
| `REMINDER_EMAIL` | For cron | Recipient for daily digest email |
| `CRON_SECRET` | For cron | Bearer token for cron endpoint |
| `TELEGRAM_BOT_TOKEN` | For bot | Telegram Bot API token |
| `TELEGRAM_BOT_USERNAME` | For bot | Bot username (without @) |
| `TELEGRAM_WEBHOOK_SECRET` | For bot | Webhook validation secret |
| `ADMIN_USER_IDS` | For admin | Comma-separated Clerk user IDs |

---

## File Structure

```
src/
├── actions/          # Server actions by domain
│   ├── access.ts     # Team sharing
│   ├── admin.ts      # Admin panel
│   ├── board.ts      # Kanban board
│   ├── clients.ts    # Client CRUD
│   ├── dashboard.ts  # Dashboard data
│   ├── projects.ts   # Project CRUD + images + time
│   ├── search.ts     # Global search
│   ├── subscription.ts # Billing & usage
│   ├── tasks.ts      # Task CRUD + images + files + comments
│   └── telegram.ts   # Telegram bot settings
├── app/
│   ├── admin/        # Admin panel pages
│   ├── api/          # API routes
│   ├── bookmarks/    # Bookmarks page
│   ├── calendar/     # Calendar page
│   ├── clients/      # Client pages
│   ├── dashboard/    # Dashboard page
│   ├── projects/     # Project pages
│   ├── settings/     # Settings page
│   ├── tasks/        # Task pages
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Marketing landing page
├── components/
│   ├── forms/        # ProjectForm, ClientForm
│   ├── marketing/    # Landing page sections
│   ├── ui/           # Design system primitives
│   ├── CommandBar.tsx
│   ├── DashboardCalendar.tsx
│   ├── DashboardGreeting.tsx
│   ├── DashboardLayout.tsx
│   ├── InsightsPanel.tsx
│   ├── LayoutWrapper.tsx
│   ├── OnboardingOverlay.tsx
│   ├── Sidebar.tsx
│   ├── SidebarAuth.tsx
│   └── ThemeProvider.tsx
├── lib/
│   ├── access.ts     # Role-based access control
│   ├── auth.ts       # Auth helpers
│   ├── prisma.ts     # Prisma client singleton
│   ├── subscription.ts # Plan limit checks
│   ├── telegram-commands.ts  # Bot command parser
│   ├── telegram-executor.ts  # Bot command execution
│   └── utils.ts      # Shared utilities
└── proxy.ts          # Middleware (auth enforcement)
```
