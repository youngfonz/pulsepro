import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { Search } from 'lucide-react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

type Props = {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChangeText, placeholder = 'Search...' }: Props) {
  return (
    <View style={styles.container}>
      <Search size={18} color={colors.textSecondary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceAlt,
    borderRadius: 10, paddingHorizontal: spacing.md, gap: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  input: { flex: 1, color: colors.textPrimary, fontSize: 15, paddingVertical: spacing.md },
})
