import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

type Variant = 'primary' | 'secondary' | 'destructive'

type Props = {
  title: string
  onPress: () => void
  variant?: Variant
  loading?: boolean
  disabled?: boolean
}

export function Button({ title, onPress, variant = 'primary', loading, disabled }: Props) {
  const bgColor = variant === 'destructive' ? colors.destructive
    : variant === 'secondary' ? colors.surfaceAlt
    : colors.primary

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: { borderRadius: 10, padding: spacing.lg, alignItems: 'center' },
  text: { color: '#fff', fontSize: 17, fontWeight: '600' },
  secondaryText: { color: colors.textPrimary },
  disabled: { opacity: 0.5 },
})
