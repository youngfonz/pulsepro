# Pulse Pro QA/QC Testing Checklist

**Date created:** 2026-02-22
**Test against:** Production (pulsepro.work)
**Goal:** Physically verify every feature before official launch

---

## How to Use This Checklist

Test as three distinct personas in order:
1. **New User** — fresh sign-up, free plan, zero data
2. **Admin (Pro User)** — upgraded plan, real data, full feature access
3. **Super Admin** — admin panel, system-level checks

Mark each item: PASS / FAIL / SKIP (with reason)

---

## PERSONA 1: COMPLETE NEW USER (Free Plan)

### 1.1 Marketing Page (Logged Out)

- [ ] Visit pulsepro.work — marketing page loads, no errors
- [ ] Hero section: headline, subheadline, CTA buttons render correctly
- [ ] StatsImpact section: numbers/metrics display
- [ ] Features section: dashboard mock + 4 feature cards render
- [ ] "Capture tasks from anywhere" section: all 5 tabs work
  - [ ] AI Insights tab — mock displays correctly
  - [ ] Email to Task tab — email mock displays
  - [ ] Siri & Voice tab — Siri orb + shortcuts card displays
  - [ ] Keyboard tab — N key + Cmd+K mocks display
  - [ ] Telegram tab — bot conversation mock displays
  - [ ] Auto-cycling works (tabs rotate automatically)
  - [ ] Manual tab switching works
- [ ] Testimonials section renders
- [ ] Why Switch section: all competitor cards (Asana, Monday, Trello, ClickUp, Apple Notes)
- [ ] Pricing section: Free vs Pro comparison table
  - [ ] Free tier shows correct limits (3 projects, 50 tasks, 1 client)
  - [ ] Pro tier shows correct features (unlimited, integrations, AI)
  - [ ] CTA buttons work
- [ ] FAQ section: all questions expand/collapse
  - [ ] "Do I need to set up projects first?" FAQ exists
  - [ ] "Who is Pulse Pro for?" includes personal/solo use
- [ ] Final CTA section renders with button
- [ ] Navigation: all nav links work (Features, Pricing, FAQ anchors)
- [ ] Footer: all footer links work
- [ ] Mobile responsive: test on phone-sized viewport
  - [ ] Nav collapses properly
  - [ ] All sections stack correctly
  - [ ] Tab bar wraps on mobile

### 1.2 Legal & Info Pages

- [ ] /about — page loads
- [ ] /privacy — page loads
- [ ] /terms — page loads
- [ ] /contact — page loads

### 1.3 Sign Up Flow

- [ ] /sign-up — Clerk sign-up form renders (no horizontal scroll)
- [ ] Sign up with email — account created
- [ ] Sign up with Google OAuth — works
- [ ] After sign-up, redirected to /dashboard
- [ ] /sign-in — Clerk sign-in form renders (no horizontal scroll)

### 1.4 Onboarding (First-Time User)

- [ ] Onboarding overlay appears on first dashboard visit
- [ ] Step 1: "Add your first task" — N key visual displays
- [ ] Step 2: "Organize when ready" — projects explanation
- [ ] Step 3: "Shortcuts" — Cmd+K, N, Enter keys shown
- [ ] Step 4: "You're all set" — dashboard preview
- [ ] Next/Back buttons work through all steps
- [ ] Close button (X) dismisses overlay
- [ ] Overlay does NOT reappear after dismissal
- [ ] No AI gradient backgrounds (should be clean, professional)

### 1.5 Dashboard (Empty State)

- [ ] Dashboard loads with zero data
- [ ] Stats show 0/0 across the board
- [ ] No errors or broken UI with empty data
- [ ] "Good morning/afternoon/evening" greeting displays

### 1.6 Quick Task Creation (Zero Setup)

- [ ] Press N key — quick-add modal opens
- [ ] Type a task title, press Enter — task created (no project required)
- [ ] Task appears in /tasks page
- [ ] Press Cmd+K — command bar opens
- [ ] Type "add task Buy groceries" — creation preview shows
- [ ] Press Enter — task created
- [ ] Type "add task Fix bug high priority due tomorrow" — priority + date parsed
- [ ] Task created with correct priority and due date

### 1.7 Tasks Page (Free Plan)

- [ ] /tasks — page loads, shows created tasks
- [ ] Standalone tasks display with "Quick task" label (no project)
- [ ] Click a task — task detail page loads
- [ ] Edit task title — saves
- [ ] Edit task description — saves
- [ ] Edit task notes — saves
- [ ] Set priority (low/medium/high) — saves
- [ ] Set due date — saves
- [ ] Set start date — saves
- [ ] Mark task complete (checkbox) — toggles
- [ ] Mark task incomplete — toggles back
- [ ] Delete task — removed
- [ ] Add comment to task — saves
- [ ] Delete comment — removed
- [ ] Add image to task — uploads and displays
- [ ] Remove image — removed
- [ ] Add file to task — uploads and displays
- [ ] Remove file — removed
- [ ] Filter by status (pending/completed) — filters correctly
- [ ] Filter by priority (high/medium/low) — filters correctly
- [ ] Sort by due date — sorts correctly
- [ ] Sort by priority — sorts correctly
- [ ] Sort by newest/oldest — sorts correctly
- [ ] "Add Task" button opens dialog
- [ ] AddTaskDialog: create task with project = none — works
- [ ] Natural language in task title field — parses priority + date

### 1.8 Client Management (Free Plan)

- [ ] /clients — page loads (empty state)
- [ ] Create first client (name, email, phone, company)
- [ ] Client appears in list
- [ ] Click client — detail page loads with projects
- [ ] Edit client — saves
- [ ] Voice input on client form — mic icon visible
  - [ ] Click mic, speak client details — fields auto-populate
  - [ ] "email john@test.com" → email field fills
  - [ ] "company Acme" → company field fills
  - [ ] "phone 555-1234" → phone field fills
- [ ] Search clients — works
- [ ] Filter by status (active/inactive) — works
- [ ] Sort clients — all sort options work

### 1.9 Project Management (Free Plan)

- [ ] /projects — page loads (empty state)
- [ ] /projects/new — create project form loads
- [ ] Client dropdown shows created client
- [ ] "+ New client" option in dropdown — inline creation works
  - [ ] Type new client name, submit project — both client and project created
  - [ ] Cancel inline creation — returns to dropdown
- [ ] Voice input on project form — parses name, description, priority, date, budget
- [ ] Create project (name, description, status, priority, due date, budget)
- [ ] Project appears in list
- [ ] Click project — detail page loads
- [ ] Kanban board: todo / in_progress / done columns display
- [ ] Drag task between columns — status updates
- [ ] Add task to project from project detail page
- [ ] Project health score displays
- [ ] Add time entry (hours, description, date) — saves
- [ ] Delete time entry — removed
- [ ] Add project image — uploads
- [ ] Remove project image — removed
- [ ] Edit project details — saves
- [ ] Delete project — removed (confirm dialog)
- [ ] Filter projects by status — works
- [ ] Filter projects by priority — works
- [ ] Filter projects by client — works
- [ ] Sort projects — all options work
- [ ] Search projects — works

### 1.10 Bookmarks (Free Plan)

- [ ] /bookmarks — page loads (empty state)
- [ ] Create bookmark with URL — metadata extracted (thumbnail, title)
- [ ] YouTube URL — thumbnail and type detected
- [ ] Twitter/X URL — type detected
- [ ] Regular website URL — OG metadata extracted
- [ ] Add tags to bookmark — saves
- [ ] Filter bookmarks by project — works
- [ ] Filter by type (youtube/twitter/website) — works
- [ ] Search bookmarks — works
- [ ] Sort bookmarks — works

### 1.11 Calendar (Free Plan)

- [ ] /calendar — month view loads
- [ ] Tasks with due dates appear on correct dates
- [ ] Standalone tasks (no project) show as "Quick task"
- [ ] Navigate to next month — updates
- [ ] Navigate to previous month — updates
- [ ] Click a date — shows tasks due that day

### 1.12 Search & Navigation

- [ ] Cmd+K — command bar opens
- [ ] Search for a task by name — result appears
- [ ] Search for a project — result appears
- [ ] Search for a client — result appears
- [ ] Search for a bookmark — result appears
- [ ] Click result — navigates to correct page
- [ ] Arrow keys navigate results
- [ ] Enter opens selected result
- [ ] Esc closes command bar
- [ ] Quick actions section: Dashboard, Projects, Tasks, Calendar, Bookmarks, Clients, Settings
- [ ] Each quick action navigates correctly
- [ ] Placeholder text: 'Search or type "add task..." to create'

### 1.13 Free Plan Limits

- [ ] Create projects up to limit (3) — works
- [ ] Create 4th project — upgrade prompt appears
- [ ] Create tasks up to limit (50) — works
- [ ] Create 51st task — upgrade prompt appears
- [ ] Create clients up to limit (1) — works
- [ ] Create 2nd client — upgrade prompt appears
- [ ] Upgrade prompt has link to checkout

### 1.14 Settings (Free Plan)

- [ ] /settings — page loads
- [ ] Billing card: shows "Free" plan
- [ ] Telegram card: shows "Upgrade to Pro" button
- [ ] Email to Task card: shows "Upgrade to Pro" button
- [ ] Siri & Shortcuts card: shows "Upgrade to Pro" button
- [ ] Appearance: dark mode toggle works
- [ ] Appearance: light mode toggle works
- [ ] About: version and tech stack display

### 1.15 Dark Mode

- [ ] Toggle dark mode in settings
- [ ] Dashboard renders correctly in dark mode
- [ ] Tasks page renders correctly
- [ ] Project detail renders correctly
- [ ] Marketing page respects dark mode (if applicable)
- [ ] All text is readable, no contrast issues
- [ ] Toggle back to light mode — works

### 1.16 Mobile Responsiveness

- [ ] Dashboard: stats and sections stack on mobile
- [ ] Tasks page: table/list adapts to mobile
- [ ] Project detail: tabs and Kanban work on mobile
- [ ] Command bar: usable on mobile
- [ ] Quick-add (N key): works on mobile (if applicable)
- [ ] Settings: all cards stack properly
- [ ] Navigation: sidebar collapses or adapts

---

## PERSONA 2: ADMIN (Pro User)

### 2.1 Upgrade to Pro

- [ ] Click upgrade button/link — Polar checkout loads
- [ ] Complete checkout — subscription activated
- [ ] Redirected back to app
- [ ] Settings > Billing: shows "Pro" plan
- [ ] Settings > Billing: "Manage subscription" link to Polar portal works
- [ ] Free plan limits removed (can create unlimited projects/tasks/clients)

### 2.2 Telegram Bot Integration

- [ ] Settings > Telegram: "Link Telegram" button appears (not upgrade prompt)
- [ ] Click "Link Telegram" — verification code generated (LINK-XXXXXX format)
- [ ] Code displayed with copy button
- [ ] "Code expires in 10 minutes" message shown
- [ ] Open Telegram, find bot, send /start — welcome message received
- [ ] Send verification code — "Account linked!" confirmation
- [ ] Settings: green dot "Telegram linked" status shows
- [ ] Toggle daily reminders ON — saves
- [ ] Toggle daily reminders OFF — saves
- [ ] Telegram: send `tasks` — task list returned
- [ ] Telegram: send `today` — today's tasks returned
- [ ] Telegram: send `overdue` — overdue tasks returned
- [ ] Telegram: send `bookmarks` — bookmarks returned
- [ ] Telegram: send `add Buy milk` — standalone task created
- [ ] Telegram: send `add ProjectName: Fix logo` — task assigned to project
- [ ] Telegram: send `done 1` — task marked complete
- [ ] Telegram: send `help` — command list returned
- [ ] Unlink Telegram — confirms, status clears
- [ ] After unlinking, Telegram commands show "not linked" message

### 2.3 Email-to-Task Integration

- [ ] Settings > Email to Task: "Generate Email Address" button appears
- [ ] Click generate — email address displayed ({token}@in.pulsepro.work)
- [ ] Copy button works — address copied to clipboard
- [ ] "How it works" instructions display
- [ ] Forward a real email to the address — task created
  - [ ] Task title = email subject (stripped of Re:/Fwd: prefixes)
  - [ ] Task description = email body + sender info
- [ ] Send email with `[ProjectName]` in subject — task assigned to matching project
- [ ] Send email without project tag — standalone task created
- [ ] Regenerate address — new address generated
  - [ ] Old address stops working
  - [ ] New address works

### 2.4 Siri & Shortcuts API

- [ ] Settings > Siri & Shortcuts: "Generate API Token" button appears
- [ ] Click generate — token displayed (pp_... format)
- [ ] Token masked by default (pp_xxx***)
- [ ] Show/hide toggle works
- [ ] Copy button works
- [ ] Apple Shortcuts setup instructions display
- [ ] curl example displays
- [ ] Test POST endpoint:
  ```
  curl -X POST https://pulsepro.work/api/v1/tasks \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title": "Test from API"}'
  ```
  - [ ] Returns 201 with task object
- [ ] Test with priority: `{"title": "Urgent", "priority": "high"}` — correct priority
- [ ] Test with due date: `{"title": "Soon", "dueDate": "2026-03-01"}` — correct date
- [ ] Test with project: `{"title": "Logo", "project": "ProjectName"}` — assigned correctly
- [ ] Test with description: `{"title": "Test", "description": "Details here"}` — saved
- [ ] Test GET endpoint:
  ```
  curl https://pulsepro.work/api/v1/tasks \
    -H "Authorization: Bearer YOUR_TOKEN"
  ```
  - [ ] Returns task list
- [ ] GET with status filter: `?status=todo` — filters correctly
- [ ] GET with limit: `?limit=5` — returns max 5
- [ ] Test invalid token — returns 401
- [ ] Test missing title — returns 400
- [ ] Test missing Authorization header — returns 401
- [ ] Regenerate token — old token stops working, new token works
- [ ] Revoke token — all API access disabled
- [ ] After revoke, "Generate API Token" button reappears

### 2.5 AI Insights (Pro)

- [ ] Dashboard: Smart Insights panel displays
- [ ] Insights are relevant to current data (overdue tasks, stale projects, etc.)
- [ ] "Generate" button triggers AI analysis (if available)
- [ ] Cached insights load quickly on subsequent visits
- [ ] Rule-based fallback works when AI unavailable

### 2.6 Project Collaboration (Pro)

- [ ] Open a project — Team tab visible
- [ ] Share project with another user (by user ID or email)
  - [ ] Set role: Viewer — shared user can view only
  - [ ] Set role: Editor — shared user can edit tasks
  - [ ] Set role: Manager — shared user can manage project
- [ ] Revoke access — user removed from project
- [ ] Collaborator limit: can add up to 3 (Pro plan)
- [ ] Adding 4th collaborator — shows limit message
- [ ] Shared user sees project in their project list
- [ ] Shared user permissions match their role

### 2.7 Dashboard (With Data)

- [ ] Stats: all counts accurate (clients, projects, tasks)
- [ ] Overdue tasks section: grouped by project, correct count
- [ ] Standalone overdue tasks display correctly (no project group)
- [ ] Tasks due this week: correct tasks shown
- [ ] Projects due this week: correct projects shown
- [ ] Recently viewed: shows last 8 accessed items
- [ ] Project health cards: scores match expectations
  - [ ] Healthy projects (>70 score) show green
  - [ ] At-risk projects (40-70) show yellow/amber
  - [ ] Critical projects (<40) show red
  - [ ] Completed projects labeled correctly
- [ ] Dashboard section drag-to-reorder works
- [ ] Reorder persists on refresh

### 2.8 Daily Reminder Email

- [ ] With Telegram reminders ON: receive Telegram summary
- [ ] Email reminder: overdue tasks listed with days-overdue count
- [ ] Email reminder: due-today tasks listed
- [ ] Email reminder: color-coded by priority (red=high, orange=medium, gray=low)
- [ ] Email reminder: links to tasks work
- [ ] Standalone tasks display as "Quick task" in email

### 2.9 Voice Input (All Forms)

- [ ] Task form: voice input parses title + priority + due date
  - [ ] "Review wireframes high priority due Friday" → all fields populated
- [ ] Client form: voice input parses name + email + phone + company
  - [ ] "John Smith email john@test.com company Acme phone 555-1234" → all fields populated
- [ ] Project form: voice input parses name + description + priority + date + budget
- [ ] Mic permission request appears on first use
- [ ] Permission denied: graceful fallback, no crash

### 2.10 Comprehensive Task Workflow

- [ ] Create task via N key (standalone)
- [ ] Create task via Cmd+K inline
- [ ] Create task via AddTaskDialog (with project)
- [ ] Create task via Telegram bot
- [ ] Create task via email forward
- [ ] Create task via API (curl/Siri)
- [ ] All 6 creation methods produce valid tasks
- [ ] All tasks visible in /tasks page
- [ ] All tasks searchable in Cmd+K
- [ ] Tasks with due dates appear in calendar

### 2.11 Bulk Operations & Edge Cases

- [ ] Create 100+ tasks — performance acceptable
- [ ] Create 20+ projects — list loads quickly
- [ ] Long task title (200+ chars) — truncates properly in lists
- [ ] Long description — displays with scroll/truncation
- [ ] Special characters in titles (quotes, brackets, emoji) — no errors
- [ ] HTML in task description — sanitized, no XSS
- [ ] Empty search query — shows quick actions, no error
- [ ] Search with special characters — no crash

---

## PERSONA 3: SUPER ADMIN

### 3.1 Admin Panel

- [ ] /admin — admin page loads (verify access control)
- [ ] /admin/users — user list displays
- [ ] User data visible: names, plans, status
- [ ] Non-admin users cannot access /admin pages (redirected or 403)

### 3.2 API Security

- [ ] /api/v1/tasks without auth header — returns 401
- [ ] /api/v1/tasks with invalid token — returns 401
- [ ] /api/webhook/email without valid token in address — returns 400/404
- [ ] /api/webhook/telegram without secret header — returns 401
- [ ] /api/cron/daily-reminder without CRON_SECRET — returns 401
- [ ] All authenticated routes reject unauthenticated requests
- [ ] All Pro-only features return 403 for free users via API

### 3.3 Middleware & Routing

- [ ] Public routes accessible without auth:
  - [ ] / (marketing)
  - [ ] /about, /privacy, /terms, /contact
  - [ ] /sign-in, /sign-up
  - [ ] /api/webhook/polar
  - [ ] /api/webhook/telegram
  - [ ] /api/webhook/email
  - [ ] /api/v1/* (uses own auth)
  - [ ] /api/cron/daily-reminder
  - [ ] /api/og
- [ ] Protected routes redirect to sign-in when not authenticated:
  - [ ] /dashboard
  - [ ] /tasks
  - [ ] /projects
  - [ ] /clients
  - [ ] /calendar
  - [ ] /bookmarks
  - [ ] /settings
  - [ ] /admin

### 3.4 Data Integrity

- [ ] Delete a client — cascades to projects
- [ ] Delete a project — cascades to tasks, images, time entries, access records
- [ ] Delete a task — cascades to images, files, comments
- [ ] Standalone tasks (no project) survive project deletion
- [ ] User data isolation: User A cannot see User B's data
- [ ] Shared project data: shared user sees only their shared projects

### 3.5 Subscription Enforcement

- [ ] Free user hits project limit — blocked with upgrade prompt
- [ ] Free user hits task limit — blocked with upgrade prompt
- [ ] Free user hits client limit — blocked with upgrade prompt
- [ ] Free user tries Telegram integration — shows upgrade
- [ ] Free user tries email-to-task — shows upgrade
- [ ] Free user tries API access — shows upgrade
- [ ] Pro user: all limits removed
- [ ] Subscription expiry: verify behavior when plan lapses

### 3.6 Performance

- [ ] Marketing page: loads under 3 seconds
- [ ] Dashboard: loads under 2 seconds (with data)
- [ ] Tasks page with 100+ tasks: loads under 3 seconds
- [ ] Search: results appear within 500ms
- [ ] Command bar: opens instantly
- [ ] Quick-add (N key): opens instantly
- [ ] Calendar: month renders under 1 second

### 3.7 SEO & Meta

- [ ] /sitemap.xml — accessible
- [ ] /robots.txt — accessible
- [ ] Marketing page: proper meta title and description
- [ ] OG image (/api/og) — generates correctly
- [ ] Social sharing preview works

### 3.8 Error Handling

- [ ] 404 page: visit /nonexistent — proper error page
- [ ] Invalid task ID: /tasks/invalid — handles gracefully
- [ ] Invalid project ID: /projects/invalid — handles gracefully
- [ ] Network error during form submit — user sees error, no data loss
- [ ] Server action failure — error message displayed, not a crash

### 3.9 Cross-Browser

- [ ] Chrome (desktop) — full test pass
- [ ] Safari (desktop) — full test pass
- [ ] Firefox (desktop) — full test pass
- [ ] Safari (iOS) — core flows work
- [ ] Chrome (Android) — core flows work

---

## SIGN-OFF

| Persona | Tester | Date | Status |
|---------|--------|------|--------|
| New User (Free) | | | |
| Admin (Pro) | | | |
| Super Admin | | | |

**Notes:**


**Final Approval:**

- [ ] All PASS — approved for production launch
- [ ] Known issues documented with severity and timeline
