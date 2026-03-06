import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { spacing } from '../../theme/spacing'

type Props = {
  label: string
  color: string
}

export function Badge({ label, color }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 6 },
  text: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
})
