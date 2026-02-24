import Link from 'next/link'
import { getAdminUsers } from '@/actions/admin'
import { Badge } from '@/components/ui/Badge'

export default async function AdminUsersPage() {
  const { users, totalCount } = await getAdminUsers()

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Admin
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">{totalCount} registered</p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plan</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Projects</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Tasks</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Clients</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt=""
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs font-medium text-muted-foreground">
                          {(user.firstName?.[0] || user.email[0] || '?').toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'No name'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={user.plan === 'team'
                      ? 'bg-violet-500/10 text-violet-500 border-violet-500/30'
                      : user.plan === 'pro'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      : 'bg-muted text-muted-foreground'
                    }>
                      {user.plan === 'team' ? 'Team' : user.plan === 'pro' ? 'Pro' : 'Free'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">{user.projectCount}</td>
                  <td className="px-4 py-3 text-right text-foreground">{user.taskCount}</td>
                  <td className="px-4 py-3 text-right text-foreground">{user.clientCount}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground text-xs">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
