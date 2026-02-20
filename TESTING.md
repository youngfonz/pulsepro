# Testing: Admin Panel, Organizations & Team Sharing

## Prerequisites

- Two email accounts (for testing team sharing)
- Access to [Clerk Dashboard](https://dashboard.clerk.com)
- Access to Vercel project settings

---

## 1. Admin Panel

### Setup

1. Go to Clerk Dashboard > **Users** > click your user
2. Copy your **User ID** (starts with `user_`)
3. Go to Vercel > Project > **Settings** > **Environment Variables**
4. Add a new variable:
   - Key: `ADMIN_USER_IDS`
   - Value: `user_your_id_here`
5. Redeploy (Settings > Deployments > redeploy latest, or it picks up on next push)

### Test

| Step | Expected Result |
|------|----------------|
| Log in to PulsePro | "Admin" link appears in sidebar (bottom section, above Settings) |
| Click Admin link | `/admin` page shows summary stat cards: Total Users, Pro Users, Projects, Tasks, Clients |
| Click "View all users" | `/admin/users` shows a table with avatar, name, email, plan badge, project/task/client counts, join date |
| Log in as a **different** user | Admin link should NOT appear in sidebar |
| Navigate directly to `/admin` as non-admin | Should redirect to `/dashboard` |

---

## 2. Organizations

### Setup

1. In Clerk Dashboard, go to **Organizations** and make sure they're enabled
2. Log in to PulsePro

### Test

| Step | Expected Result |
|------|----------------|
| Look at sidebar (above user button) | **Organization Switcher** should be visible |
| Click switcher > **Create Organization** | Give it a name (e.g. "My Agency") |
| After creating the org | You're now in an org context |
| Check dashboard, projects, tasks | **ALL your data should still be visible. Nothing disappears.** This is the critical test. |
| In the org switcher > **Manage Organization** | Invite a team member using a second email address |

> **STOP HERE if your data disappears after creating an org.** That's the regression bug from before. Log it and we'll fix it.

---

## 3. Team Project Sharing

You need two browser sessions: your main account (owner) and a second account (team member).

### Setup the second account

1. Open an incognito/private window
2. Sign up or log in with the second email
3. Accept the org invitation (check email or Clerk dashboard)
4. In the org switcher, switch to the shared org

### Test as Owner (main account)

| Step | Expected Result |
|------|----------------|
| Go to any project detail page | A **Team** tab should appear (only when you're in an org) |
| Click Team tab | Shows you as **Owner** |
| Click **Add team member** | Dropdown lists org members |
| Select the second user, choose **Viewer** role, click Add | Member appears in the list with "Viewer" badge |

### Test as Viewer (second account)

| Step | Expected Result |
|------|----------------|
| Go to `/projects` | The shared project appears in your project list |
| Click into the project | You can view all tabs and content |
| Look for Add Task button | **Should NOT be visible** (viewers can't add) |
| Look for Add Bookmark button | **Should NOT be visible** |
| Look for project Delete button | **Should NOT be visible** |
| Check your dashboard | Shared project should count in your stats |

### Test role upgrade

| Step | Expected Result |
|------|----------------|
| **As owner**: Go to Team tab, change member role to **Editor** | Badge updates to "Editor" |
| **As member**: Refresh the project page | Add Task form should now appear |
| **As member**: Add a task | Task is created successfully |
| **As member**: Try to delete the project | Delete button should still NOT be visible (editor can't delete) |

### Test access revocation

| Step | Expected Result |
|------|----------------|
| **As owner**: Go to Team tab, click X to remove the member | Member disappears from list |
| **As member**: Refresh `/projects` | The shared project is gone from the list |
| **As member**: Navigate directly to the project URL | Should show 404 |

---

## Bug Log

Use this section to note any issues you find:

```
Bug #   | Where          | What happened                    | Expected
--------|----------------|----------------------------------|------------------
        |                |                                  |
        |                |                                  |
        |                |                                  |
```

### Things to watch for

- [ ] Data disappears after creating an org
- [ ] Admin link visible to non-admin users
- [ ] Org switcher not appearing in sidebar
- [ ] Team tab not showing on project page when in an org
- [ ] Shared project not appearing in member's project list
- [ ] Viewer able to add/edit tasks
- [ ] Editor able to delete project
- [ ] Revoked member still seeing the project
- [ ] Dashboard stats not including shared projects
- [ ] Search not finding shared project tasks
- [ ] Org switcher breaks layout when sidebar is collapsed
