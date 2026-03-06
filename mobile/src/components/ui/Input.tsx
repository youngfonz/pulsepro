import React from 'react'
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

type Props = TextInputProps & {
  label?: string
}

export function Input({ label, style, ...props }: Props) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: spacing.lg,
    color: colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
})
