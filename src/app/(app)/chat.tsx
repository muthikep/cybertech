import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReducedMotion } from 'react-native-reanimated';

import { ChatError } from '@/components/chat/ChatError';
import { ChatInputBar } from '@/components/chat/ChatInputBar';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { containsSafetyKeyword, SAFETY_RESPONSE } from '@/components/chat/safety';
import { parseSelfCheckResult } from '@/components/chat/selfCheckResult';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import type { ChatMessage } from '@/components/chat/types';
import { apiUrl } from '@/lib/api';
import { Colors, Spacing } from '@/theme';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'assistant-0',
    role: 'assistant',
    text: "Hi, I'm here to help you think this through. Was it repeated, or did it happen just once?",
  },
];

function toApiMessages(messages: ChatMessage[]) {
  const firstUserIndex = messages.findIndex((message) => message.role === 'user');
  if (firstUserIndex === -1) {
    return [];
  }
  return messages
    .slice(firstUserIndex)
    .map((message) => ({ role: message.role, text: message.text }));
}

export default function ChatScreen() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const pendingMessages = useRef<ChatMessage[] | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: !reduceMotion });
  }, [messages, isTyping, failed, reduceMotion]);

  async function sendToAssistant(allMessages: ChatMessage[]) {
    pendingMessages.current = allMessages;
    setFailed(false);
    setIsTyping(true);

    try {
      const token = await getToken();
      const response = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: toApiMessages(allMessages) }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      const reply = typeof data?.reply === 'string' ? data.reply : null;
      if (!reply) {
        throw new Error('Invalid response');
      }

      const result = parseSelfCheckResult(reply);
      if (result) {
        pendingMessages.current = null;
        router.push({
          pathname: '/result',
          params: { summary: result.summary, nextStep: result.nextStep },
        });
        return;
      }

      pendingMessages.current = null;
      setMessages((previous) => [
        ...previous,
        { id: `assistant-${Date.now()}`, role: 'assistant', text: reply },
      ]);
    } catch {
      setFailed(true);
    } finally {
      setIsTyping(false);
    }
  }

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
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft('');

    if (containsSafetyKeyword(text)) {
      setMessages((previous) => [
        ...previous,
        { id: `assistant-${Date.now()}`, role: 'assistant', text: SAFETY_RESPONSE },
      ]);
      return;
    }

    sendToAssistant(nextMessages);
  }

  function handleRetry() {
    if (pendingMessages.current) {
      sendToAssistant(pendingMessages.current);
    }
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
          {failed && <ChatError onRetry={handleRetry} />}
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
