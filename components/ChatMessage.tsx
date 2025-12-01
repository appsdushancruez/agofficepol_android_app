import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <View
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.botMessage,
      ]}>
      <Text
        style={[
          styles.messageText,
          message.isUser ? styles.userMessageText : styles.botMessageText,
        ]}>
        {message.text}
      </Text>
      <Text
        style={[
          styles.timestamp,
          message.isUser ? styles.userTimestamp : styles.botTimestamp,
        ]}>
        {message.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50', // Light green
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5E5', // Light gray
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  botTimestamp: {
    color: '#666666',
  },
});

