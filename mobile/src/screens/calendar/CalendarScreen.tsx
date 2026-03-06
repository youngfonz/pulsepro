import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export function CalendarScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Calendar view coming soon</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  placeholder: { fontSize: 17, color: colors.textSecondary },
})
