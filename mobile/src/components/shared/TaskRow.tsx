import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { CheckSquare, Square } from 'lucide-react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { getPriorityColor } from '../../utils/status'
import { formatDate, isOverdue } from '../../utils/dates'
import type { Task } from '../../types/api'

type Props = {
  task: Task
  onPress: () => void
  onToggle: () => void
}

export function TaskRow({ task, onPress, onToggle }: Props) {
  const overdue = isOverdue(task.dueDate, task.status)

  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <TouchableOpacity onPress={onToggle} hitSlop={8}>
        {task.status === 'done'
          ? <CheckSquare size={22} color={colors.success} />
          : <Square size={22} color={colors.textSecondary} />
        }
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={[styles.title, task.status === 'done' && styles.done]} numberOfLines={1}>
          {task.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.project}>{task.project?.name ?? 'Quick task'}</Text>
          {task.dueDate && (
            <Text style={[styles.due, overdue && styles.overdueDue]}>{formatDate(task.dueDate)}</Text>
          )}
        </View>
      </View>
      <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 10, padding: spacing.md, borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.sm, gap: spacing.md,
  },
  content: { flex: 1 },
  title: { fontSize: 15, color: colors.textPrimary },
  done: { textDecorationLine: 'line-through', color: colors.textSecondary },
  meta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  project: { fontSize: 13, color: colors.textSecondary },
  due: { fontSize: 13, color: colors.textSecondary },
  overdueDue: { color: colors.destructive },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
})
