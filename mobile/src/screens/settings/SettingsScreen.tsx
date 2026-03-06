import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@clerk/expo'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export function SettingsScreen() {
  const { signOut } = useAuth()

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.signOutButton} onPress={() => signOut()}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg, justifyContent: 'flex-end', paddingBottom: spacing.xxxl },
  signOutButton: {
    backgroundColor: colors.destructive, borderRadius: 10, padding: spacing.lg, alignItems: 'center',
  },
  signOutText: { color: '#fff', fontSize: 17, fontWeight: '600' },
})
