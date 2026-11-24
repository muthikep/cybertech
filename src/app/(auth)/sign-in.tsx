import { useSignIn, useSignUp } from '@clerk/expo';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, FontSize, Radius, Spacing } from '@/theme';

type Mode = 'sign-in' | 'sign-up';
type Step = 'form' | 'verify';

const GENERIC_ERROR = 'Something went wrong. Please check your details and try again.';

function describeError(error: { longMessage?: string; message?: string } | null | undefined) {
  if (__DEV__ && error) {
    console.error('Auth error:', error);
  }
  return error?.longMessage ?? error?.message ?? GENERIC_ERROR;
}

export default function SignInScreen() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const [mode, setMode] = useState<Mode>('sign-in');
  const [step, setStep] = useState<Step>('form');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setStep('form');
    setError(null);
    setPassword('');
    setCode('');
  }

  async function handleSignIn() {
    const { error: signInError } = await signIn.password({ emailAddress, password });
    if (signInError) {
      setError(describeError(signInError));
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize();
      return;
    }

    setError("This account needs extra verification that isn't supported here yet.");
  }

  async function handleSignUp() {
    const { error: signUpError } = await signUp.password({ emailAddress, password });
    if (signUpError) {
      setError(describeError(signUpError));
      return;
    }

    if (signUp.status === 'complete') {
      await signUp.finalize();
      return;
    }

    const { error: codeError } = await signUp.verifications.sendEmailCode();
    if (codeError) {
      setError(describeError(codeError));
      return;
    }
    setStep('verify');
  }

  async function handleVerify() {
    const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
    if (verifyError) {
      setError(describeError(verifyError));
      return;
    }

    if (signUp.status === 'complete') {
      await signUp.finalize();
      return;
    }

    setError("We couldn't finish creating your account. Please try again.");
  }

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      if (step === 'verify') {
        await handleVerify();
      } else if (mode === 'sign-in') {
        await handleSignIn();
      } else {
        await handleSignUp();
      }
    } catch (err) {
      if (__DEV__) {
        console.error('Auth error:', err);
      }
      setError(GENERIC_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    step === 'verify'
      ? code.trim().length > 0
      : emailAddress.trim().length > 0 && password.length > 0;

  const submitLabel =
    step === 'verify' ? 'Verify' : mode === 'sign-in' ? 'Sign in' : 'Create account';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          {step === 'verify'
            ? 'Enter the code we emailed you to finish creating your account.'
            : mode === 'sign-in'
              ? 'Sign in to get started.'
              : 'Create an account to get started.'}
        </Text>

        {step === 'verify' ? (
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Verification code"
            placeholderTextColor={Colors.textMuted}
            keyboardType="number-pad"
            style={styles.input}
            accessibilityLabel="Verification code"
          />
        ) : (
          <>
            <TextInput
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeholder="Email"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              style={styles.input}
              accessibilityLabel="Email address"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              style={styles.input}
              accessibilityLabel="Password"
            />
          </>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          style={[styles.button, (!canSubmit || isSubmitting) && styles.buttonDisabled]}
          accessibilityRole="button"
          accessibilityLabel={submitLabel}>
          <Text style={styles.buttonText}>{isSubmitting ? 'Please wait…' : submitLabel}</Text>
        </Pressable>

        {error && <Text style={styles.error}>{error}</Text>}

        {step === 'form' && (
          <Pressable
            onPress={() => switchMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
            style={styles.switchButton}
            accessibilityRole="button"
            accessibilityLabel={
              mode === 'sign-in' ? 'Switch to create an account' : 'Switch to sign in'
            }>
            <Text style={styles.switchText}>
              {mode === 'sign-in'
                ? 'New here? Create an account'
                : 'Already have an account? Sign in'}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  input: {
    width: '100%',
    minHeight: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    color: Colors.text,
    fontSize: FontSize.md,
  },
  button: {
    minHeight: 44,
    minWidth: 44,
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  switchButton: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  error: {
    fontSize: FontSize.sm,
    color: Colors.text,
    textAlign: 'center',
  },
});
