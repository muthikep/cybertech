import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, FontSize, Radius, Spacing } from '@/theme';

export default function ResultScreen() {
  const router = useRouter();
  const { summary, nextStep } = useLocalSearchParams<{ summary?: string; nextStep?: string }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Here&apos;s what I heard</Text>
        <Text style={styles.body}>
          {summary ?? "Thanks for sharing - I wasn't able to put together a summary this time."}
        </Text>

        <Text style={styles.label}>Suggested next step</Text>
        <Text style={styles.body}>
          {nextStep ?? 'Talk to a trusted adult, teacher, parent, or school counselor.'}
        </Text>

        <Text style={styles.note}>
          This is just a supportive check-in, not a diagnosis or a legal judgment.
        </Text>

        <Pressable
          onPress={() => router.replace('/chat')}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel="Start over">
          <Text style={styles.buttonText}>Start over</Text>
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginTop: Spacing.md,
  },
  body: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 22,
  },
  note: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
    fontStyle: 'italic',
  },
  button: {
    minHeight: 44,
    minWidth: 44,
    marginTop: Spacing.xl,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
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
});
