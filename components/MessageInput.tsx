import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
  Text,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { isJobNumberPattern, convertJobNumberToUppercase } from '@/utils/jobNumberDetection';

interface MessageInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export function MessageInput({ onSend, isLoading }: MessageInputProps) {
  const [text, setText] = useState('');
  const [isJobNumberDetected, setIsJobNumberDetected] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animate hint indicator
  useEffect(() => {
    if (isJobNumberDetected) {
      setShowHint(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Hide after animation completes
        setShowHint(false);
      });
    }
  }, [isJobNumberDetected, fadeAnim]);

  const handleTextChange = (inputText: string) => {
    // Detect job number pattern
    const detected = isJobNumberPattern(inputText);
    setIsJobNumberDetected(detected);

    // Auto-convert to uppercase if job number pattern detected
    if (detected) {
      const convertedText = convertJobNumberToUppercase(inputText);
      setText(convertedText);
    } else {
      setText(inputText);
    }
  };

  const handleSend = () => {
    const trimmedText = text.trim();
    if (trimmedText && !isLoading) {
      onSend(trimmedText);
      setText('');
      setIsJobNumberDetected(false);
      Keyboard.dismiss();
    }
  };

  const containerStyle = [
    styles.container,
    {
      paddingBottom: Platform.OS === 'ios' ? 20 : Math.max(insets.bottom + 8, 24),
    },
  ];

  return (
    <View style={containerStyle}>
      {/* Job Number Hint Indicator */}
      {showHint && (
        <Animated.View
          style={[
            styles.hintContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none">
          <Ionicons name="briefcase-outline" size={16} color="#11486b" />
          <Text style={styles.hintText}>{t.chat.jobNumberHint}</Text>
        </Animated.View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleTextChange}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          editable={!isLoading}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!text.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!text.trim() || isLoading}
          activeOpacity={0.7}>
          <Ionicons
            name="send"
            size={20}
            color={!text.trim() || isLoading ? '#999' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    overflow: 'hidden',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 4,
    gap: 8,
    backgroundColor: 'rgba(232, 240, 245, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    overflow: 'hidden',
  },
  hintText: {
    fontSize: 13,
    color: '#11486b',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    backgroundColor: '#F5F5F5',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffa425', // Bright orange - CTA color
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
});

