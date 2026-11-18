import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Radius, Spacing } from '@/theme';

const BOUNCE_HEIGHT = 5;
const DOT_DELAYS = [0, 120, 240];

function Dot({ delay, reduceMotion }: { delay: number; reduceMotion: boolean }) {
  const offset = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    offset.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-BOUNCE_HEIGHT, { duration: 250 }),
          withTiming(0, { duration: 250 })
        ),
        -1
      )
    );
  }, [delay, offset, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function TypingIndicator() {
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View
      entering={FadeInUp.duration(220)}
      accessibilityLabel="Assistant is typing"
      style={styles.container}>
      {DOT_DELAYS.map((delay) => (
        <Dot key={delay} delay={delay} reduceMotion={reduceMotion} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  dot: {
    width: Spacing.sm,
    height: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.textMuted,
  },
});
