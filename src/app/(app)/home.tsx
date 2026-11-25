import { useAuth } from '@clerk/expo';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, FontSize, Radius, Spacing } from '@/theme';

export default function HomeScreen() {
  const { signOut } = useAuth();

  async function handleSignOut() {
    try {
      await signOut();
    } catch {
      // Sign-out is best-effort; the user stays on this screen if it fails.
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Hi there 👋</Text>
        <Text style={styles.subtitle}>
          Let&apos;s talk through what happened. It only takes a minute.
        </Text>

        <Link href="/chat" asChild>
          <Pressable style={styles.button} accessibilityRole="button" accessibilityLabel="Start">
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
        </Link>

        <Pressable
          onPress={handleSignOut}
          style={styles.signOutButton}
          accessibilityRole="button"
          accessibilityLabel="Sign out">
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
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
    marginBottom: Spacing.lg,
  },
  button: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.surface,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  signOutButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
