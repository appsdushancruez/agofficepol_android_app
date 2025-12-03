import { ChatMessage } from '@/components/ChatMessage';
import { MenuButtons } from '@/components/MenuButtons';
import { MessageInput } from '@/components/MessageInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { chatAPI } from '@/services/api';
import { ChatMessage as ChatMessageType, MenuItem } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [previousMenuItems, setPreviousMenuItems] = useState<MenuItem[] | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Check if message is a greeting - reset context when greeting is detected
  const isGreeting = (message: string): boolean => {
    return /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)[\s!]*$/i.test(
      message.trim()
    );
  };

  const handleSendMessage = async (text: string) => {
    const userMessageText = text.trim();
    
    // Check if it's a greeting - reset context
    if (isGreeting(userMessageText)) {
      console.log('Greeting detected, resetting context');
      setCurrentParentId(null);
      setPreviousMenuItems(null);
    }

    // Add user message immediately
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Get bot response
    setIsLoading(true);
    
    // Log context state before API call
    console.log('Context before API call:', {
      currentParentId,
      previousMenuItemsCount: previousMenuItems?.length || 0,
    });
    
    try {
      const response = await chatAPI.processMessage(
        userMessageText,
        currentParentId,
        previousMenuItems
      );

      console.log('API Response received:', JSON.stringify(response, null, 2));
      console.log('Response type:', typeof response);
      console.log('Response.response:', response?.response);
      console.log('Response.success:', response?.success);

      // Check if response is valid
      if (!response) {
        throw new Error('Empty response from server');
      }

      // Handle response - check for success field or response field
      if (response.success === false) {
        throw new Error(response.error || 'Failed to process message');
      }

      // Update context from response (only on successful responses)
      if (response.parentMenuId !== undefined) {
        setCurrentParentId(response.parentMenuId || null);
        console.log('Updated currentParentId:', response.parentMenuId);
      }
      
      // Update previousMenuItems if menuItems are returned
      if (response.menuItems && Array.isArray(response.menuItems)) {
        setPreviousMenuItems(response.menuItems);
        console.log('Updated previousMenuItems:', response.menuItems.length, 'items');
      } else {
        // If no menuItems, keep previous ones for context inference
        // (Don't clear them immediately)
        console.log('No menuItems in response, keeping previous context');
      }

      // Get the response text
      const responseText = response.response || '';
      
      if (!responseText || typeof responseText !== 'string') {
        console.error('Invalid response - no text field found:', response);
        throw new Error('Invalid response format: no response text found');
      }

      // Create bot message
      const botMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        menuItems: response.menuItems || [],
      };
      
      console.log('Creating bot message:', botMessage);
      console.log('Context after successful response:', {
        currentParentId: response.parentMenuId,
        menuItemsCount: response.menuItems?.length || 0,
      });
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      
      // Log error for debugging
      console.error('Chat error:', error);
      console.error('Error details:', {
        message: errorMessage,
        error: error,
      });
      console.log('Context preserved after error:', {
        currentParentId,
        previousMenuItemsCount: previousMenuItems?.length || 0,
      });
      
      // Note: We preserve existing context on error (don't clear it)
      // This allows users to retry without losing their place in the menu hierarchy
      
      const errorBotMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessageType }) => {
    return (
      <View>
        <ChatMessage message={item} />
        {item.menuItems && item.menuItems.length > 0 && (
          <MenuButtons items={item.menuItems} onSelect={handleSendMessage} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.chat.headerTitle}</Text>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {t.chat.emptyMessage}
              </Text>
            </View>
          }
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />
        {isLoading && <TypingIndicator />}
        <MessageInput onSend={handleSendMessage} isLoading={isLoading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.light.whatsappGreen,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  messagesList: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
