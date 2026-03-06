import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { getStatusColor, getPriorityColor, getStatusLabel } from '../../utils/status'
import type { Project } from '../../types/api'

type Props = {
  project: Project
  onPress: () => void
}

export function ProjectCard({ project, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{project.name}</Text>
        <View style={[styles.badge, { backgroundColor: getPriorityColor(project.priority) + '20' }]}>
          <Text style={[styles.badgeText, { color: getPriorityColor(project.priority) }]}>{project.priority}</Text>
        </View>
      </View>
      <Text style={styles.client}>{project.client.name}</Text>
      <View style={styles.footer}>
        <View style={[styles.dot, { backgroundColor: getStatusColor(project.status) }]} />
        <Text style={styles.status}>{getStatusLabel(project.status)}</Text>
        {project._count && <Text style={styles.tasks}>{project._count.tasks} tasks</Text>}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  client: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.sm },
  status: { fontSize: 13, color: colors.textSecondary },
  tasks: { fontSize: 13, color: colors.textSecondary, marginLeft: 'auto' },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
})
