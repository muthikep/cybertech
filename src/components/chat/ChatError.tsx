import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Colors, FontSize, Radius, Spacing } from '@/theme';

type ChatErrorProps = {
  onRetry: () => void;
};

export function ChatError({ onRetry }: ChatErrorProps) {
  return (
    <Animated.View entering={FadeInUp.duration(220)} style={styles.row}>
      <View style={styles.bubble}>
        <Text style={styles.text}>I couldn&apos;t reply just now.</Text>
        <Pressable
          onPress={onRetry}
          style={styles.retryButton}
          accessibilityRole="button"
          accessibilityLabel="Retry sending your message">
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: Spacing.sm,
  },
  bubble: {
    maxWidth: '80%',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  retryButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: Colors.surface,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
