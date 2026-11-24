import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Markdown from 'react-native-markdown-display';

import { Colors, FontSize, Radius, Spacing } from '@/theme';

import type { ChatMessage } from './types';

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={FadeInUp.duration(220)}
      style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      <View
        accessibilityLabel={`${isUser ? 'You' : 'Assistant'} said: ${message.text}`}
        style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        {isUser ? (
          <Text style={[styles.text, styles.textUser]}>{message.text}</Text>
        ) : (
          <Markdown style={markdownStyles}>{message.text}</Markdown>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
  },
  bubbleUser: {
    backgroundColor: Colors.accent,
    borderBottomRightRadius: Radius.sm,
  },
  bubbleAssistant: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: FontSize.md,
  },
  textUser: {
    color: Colors.surface,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    color: Colors.text,
    fontSize: FontSize.md,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
  },
  strong: {
    fontWeight: '700',
  },
  link: {
    color: Colors.accent,
  },
  bullet_list: {
    marginBottom: 0,
  },
  ordered_list: {
    marginBottom: 0,
  },
  list_item: {
    marginBottom: Spacing.xs,
  },
  code_inline: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xs,
  },
  code_block: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  fence: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
});
