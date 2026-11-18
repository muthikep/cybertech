import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReducedMotion } from 'react-native-reanimated';

import { ChatInputBar } from '@/components/chat/ChatInputBar';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import type { ChatMessage } from '@/components/chat/types';
import { Colors, Spacing } from '@/theme';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'assistant-0',
    role: 'assistant',
    text: "Hi, I'm here to help you think this through. Was it repeated, or did it happen just once?",
  },
];

const FAKE_REPLIES = [
  'Thanks for telling me. Did it make you feel hurt or unsafe?',
  'I hear you. Was it public, or did other people see it happen?',
  'That matters. Thank you for sharing all of this with me.',
];

const REPLY_DELAY_MS = 1500;

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const reduceMotion = useReducedMotion();

  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const replyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const replyIndex = useRef(0);

  useEffect(() => {
    return () => {
      if (replyTimeout.current) {
        clearTimeout(replyTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: !reduceMotion });
  }, [messages, isTyping, reduceMotion]);

  function handleSend() {
    const text = draft.trim();
    if (!text) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    };
    setMessages((previous) => [...previous, userMessage]);
    setDraft('');
    setIsTyping(true);

    replyTimeout.current = setTimeout(() => {
      const reply = FAKE_REPLIES[replyIndex.current % FAKE_REPLIES.length];
      replyIndex.current += 1;
      setMessages((previous) => [
        ...previous,
        { id: `assistant-${Date.now()}`, role: 'assistant', text: reply },
      ]);
      setIsTyping(false);
    }, REPLY_DELAY_MS);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}>
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        <ChatInputBar value={draft} onChangeText={setDraft} onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  messageList: {
    padding: Spacing.md,
  },
});
