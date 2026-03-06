import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

type Props = {
  children: React.ReactNode
  style?: ViewStyle
}

export function Card({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
})
