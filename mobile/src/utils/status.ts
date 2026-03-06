import { colors } from '../theme/colors'

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': case 'done': return colors.success
    case 'in_progress': return colors.primary
    case 'on_hold': return colors.warning
    case 'overdue': return colors.destructive
    case 'not_started': case 'todo': return colors.textSecondary
    default: return colors.textSecondary
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return colors.destructive
    case 'medium': return colors.warning
    case 'low': return colors.success
    default: return colors.textSecondary
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'not_started': return 'Not Started'
    case 'in_progress': return 'In Progress'
    case 'on_hold': return 'On Hold'
    case 'completed': return 'Completed'
    case 'todo': return 'To Do'
    case 'done': return 'Done'
    case 'active': return 'Active'
    case 'inactive': return 'Inactive'
    case 'draft': return 'Draft'
    case 'sent': return 'Sent'
    case 'paid': return 'Paid'
    case 'overdue': return 'Overdue'
    default: return status
  }
}

export function getHealthColor(label: string): string {
  switch (label) {
    case 'healthy': return colors.success
    case 'at_risk': return colors.warning
    case 'critical': return colors.destructive
    default: return colors.textSecondary
  }
}
