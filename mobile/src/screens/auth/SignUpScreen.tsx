import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useSignUp } from '@clerk/expo/legacy'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import type { AuthStackParamList } from '../../types/navigation'

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>
}

export function SignUpScreen({ navigation }: Props) {
  const { signUp, setActive, isLoaded } = useSignUp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')

  const handleSignUp = async () => {
    console.log('handleSignUp called, isLoaded:', isLoaded, 'signUp:', !!signUp)
    if (!isLoaded) {
      setError('Clerk not loaded yet. Please wait.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signUp.create({ emailAddress: email, password })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err: any) {
      const message = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message || 'Sign up failed'
      setError(message)
      console.error('Sign up error:', JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!isLoaded) return
    setError('')
    setLoading(true)
    try {
      const result = await signUp.attemptEmailAddressVerification({ code })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message || 'Verification failed'
      setError(message)
      console.error('Verify error:', JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.title}>Pulse Pro</Text>
        <Text style={styles.subtitle}>
          {pendingVerification ? 'Check your email for a verification code' : 'Create your account'}
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {pendingVerification ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Verification code"
              placeholderTextColor={colors.textSecondary}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify Email'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl },
  title: { fontSize: 32, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xxxl },
  input: {
    backgroundColor: colors.surfaceAlt, borderRadius: 10, padding: spacing.lg,
    color: colors.textPrimary, fontSize: 15, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary, borderRadius: 10, padding: spacing.lg,
    alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.xl,
  },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  error: { color: colors.destructive, textAlign: 'center', marginBottom: spacing.lg, fontSize: 13 },
  link: { color: colors.primary, textAlign: 'center', fontSize: 15 },
})
