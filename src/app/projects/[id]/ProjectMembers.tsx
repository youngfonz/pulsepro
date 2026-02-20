'use client'

import { useState, useTransition } from 'react'
import { grantProjectAccess, revokeProjectAccess } from '@/actions/access'
import { Badge } from '@/components/ui/Badge'

interface MemberUser {
  id: string
  name: string
  email: string
  imageUrl: string
}

interface Member {
  userId: string
  role: string
  user: MemberUser
}

interface OrgMember {
  userId: string
  name: string
  email: string
  imageUrl: string
}

interface ProjectMembersProps {
  projectId: string
  isOwnerOrManager: boolean
  hasOrg: boolean
  owner: MemberUser | null
  members: Member[]
  orgMembers: OrgMember[]
}

export function ProjectMembers({
  projectId,
  isOwnerOrManager,
  hasOrg,
  owner,
  members,
  orgMembers,
}: ProjectMembersProps) {
  const [isPending, startTransition] = useTransition()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState<'viewer' | 'editor' | 'manager'>('viewer')

  // Filter out users who already have access
  const existingIds = new Set([owner?.id, ...members.map(m => m.userId)].filter(Boolean))
  const availableMembers = orgMembers.filter(m => !existingIds.has(m.userId))

  const handleGrant = () => {
    if (!selectedUserId) return
    startTransition(async () => {
      try {
        await grantProjectAccess(projectId, selectedUserId, selectedRole)
        setShowAddForm(false)
        setSelectedUserId('')
        setSelectedRole('viewer')
      } catch (error) {
        console.error('Failed to grant access:', error)
      }
    })
  }

  const handleRevoke = (targetUserId: string) => {
    startTransition(async () => {
      try {
        await revokeProjectAccess(projectId, targetUserId)
      } catch (error) {
        console.error('Failed to revoke access:', error)
      }
    })
  }

  const roleLabels: Record<string, string> = {
    viewer: 'Viewer',
    editor: 'Editor',
    manager: 'Manager',
  }

  const roleBadgeColors: Record<string, string> = {
    viewer: 'bg-muted text-muted-foreground',
    editor: 'bg-blue-500/10 text-blue-500',
    manager: 'bg-emerald-500/10 text-emerald-500',
  }

  return (
    <div className="space-y-4">
      {/* Owner */}
      {owner && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border">
          {owner.imageUrl ? (
            <img src={owner.imageUrl} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs font-medium text-muted-foreground">
              {(owner.name[0] || '?').toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{owner.name}</p>
            <p className="text-xs text-muted-foreground truncate">{owner.email}</p>
          </div>
          <Badge className="bg-primary/10 text-primary">Owner</Badge>
        </div>
      )}

      {/* Members */}
      {members.length > 0 && (
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.userId} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border">
              {member.user.imageUrl ? (
                <img src={member.user.imageUrl} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs font-medium text-muted-foreground">
                  {(member.user.name[0] || '?').toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{member.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
              </div>
              <Badge className={roleBadgeColors[member.role] || 'bg-muted text-muted-foreground'}>
                {roleLabels[member.role] || member.role}
              </Badge>
              {isOwnerOrManager && (
                <button
                  onClick={() => handleRevoke(member.userId)}
                  disabled={isPending}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  title="Remove access"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {members.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">
          {hasOrg ? 'No team members have access to this project yet.' : 'Create a team to share this project with others.'}
        </p>
      )}

      {/* Add member */}
      {isOwnerOrManager && hasOrg && availableMembers.length > 0 && (
        <div>
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add team member
            </button>
          ) : (
            <div className="space-y-3 rounded-lg border border-border p-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Team Member</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a member...</option>
                  {availableMembers.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as 'viewer' | 'editor' | 'manager')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="viewer">Viewer — can see project and tasks</option>
                  <option value="editor">Editor — can add and edit tasks</option>
                  <option value="manager">Manager — can manage team access</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGrant}
                  disabled={!selectedUserId || isPending}
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Adding...' : 'Add'}
                </button>
                <button
                  onClick={() => { setShowAddForm(false); setSelectedUserId(''); }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
