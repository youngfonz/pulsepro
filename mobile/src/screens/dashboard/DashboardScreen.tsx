import React from 'react'
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDashboard } from '../../hooks/useDashboard'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { getHealthColor } from '../../utils/status'

export function DashboardScreen() {
  const { data, isLoading, error, refetch } = useDashboard()

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={[styles.content, (!data && !isLoading) && styles.contentCenter]}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
      >
        {isLoading && !data && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading dashboard...</Text>
          </View>
        )}

        {error && !data && (
          <View style={styles.centered}>
            <Text style={styles.errorTitle}>Couldn't load dashboard</Text>
            <Text style={styles.errorMessage}>{error.message}</Text>
            <Text style={styles.errorHint}>Pull down to retry</Text>
          </View>
        )}

        {data?.stats && (
          <View style={styles.statsGrid}>
            <StatCard label="Projects" value={data.stats.activeProjects} subtitle={`${data.stats.totalProjects} total`} />
            <StatCard label="Tasks" value={data.stats.pendingTasks} subtitle={`${data.stats.totalTasks} total`} />
            <StatCard label="Clients" value={data.stats.activeClients} subtitle={`${data.stats.totalClients} total`} />
          </View>
        )}

        {data?.overdueTasks && data.overdueTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overdue Tasks</Text>
            {data.overdueTasks.map(task => (
              <View key={task.id} style={styles.overdueRow}>
                <Text style={styles.overdueTitle} numberOfLines={1}>{task.title}</Text>
                <Text style={styles.overdueProject}>{task.project?.name ?? 'Quick task'}</Text>
              </View>
            ))}
          </View>
        )}

        {data?.projectHealth && data.projectHealth.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Health</Text>
            {data.projectHealth.map(p => (
              <View key={p.projectId} style={styles.healthRow}>
                <View style={[styles.healthDot, { backgroundColor: getHealthColor(p.label) }]} />
                <View style={styles.healthInfo}>
                  <Text style={styles.healthName} numberOfLines={1}>{p.projectName}</Text>
                  <Text style={styles.healthMeta}>{p.completedTasks}/{p.totalTasks} tasks</Text>
                </View>
                <Text style={[styles.healthScore, { color: getHealthColor(p.label) }]}>{p.score}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

function StatCard({ label, value, subtitle }: { label: string; value: number; subtitle: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  statsGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  statCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  statValue: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs },
  statSubtitle: { fontSize: 11, color: colors.textSecondary },
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  overdueRow: {
    backgroundColor: colors.surface, borderRadius: 10, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm,
  },
  overdueTitle: { fontSize: 15, color: colors.textPrimary, marginBottom: spacing.xs },
  overdueProject: { fontSize: 13, color: colors.textSecondary },
  healthRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 10, padding: spacing.md, borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  healthDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.md },
  healthInfo: { flex: 1 },
  healthName: { fontSize: 15, color: colors.textPrimary },
  healthMeta: { fontSize: 13, color: colors.textSecondary },
  healthScore: { fontSize: 17, fontWeight: '600' },
  contentCenter: { flexGrow: 1, justifyContent: 'center' },
  centered: { alignItems: 'center', paddingVertical: spacing.xxxl },
  loadingText: { color: colors.textSecondary, fontSize: 15, marginTop: spacing.md },
  errorTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '600', marginBottom: spacing.sm },
  errorMessage: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginBottom: spacing.md },
  errorHint: { color: colors.primary, fontSize: 13 },
})
