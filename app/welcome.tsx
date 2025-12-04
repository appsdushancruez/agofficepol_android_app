import { Language } from '@/constants/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Import Lottie animation
const chatbotAnimation = require('../assets/images/chatbot.json');

export default function WelcomeScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleChatPress = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.replace('/chat');
    }, 200);
  };

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
  };

  return (
    <LinearGradient
      colors={['#E8F0F5', '#F0F5F8', '#FFFFFF', '#F8FAFB']}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.gradientContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{t.welcome.badge}</Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          <Text style={styles.titleDark}>{t.welcome.titlePart1} </Text>
          <Text style={styles.titleGreen}>{t.welcome.titlePart2} </Text>
          <Text style={styles.titleDark}>{t.welcome.titlePart3} </Text>
          <Text style={styles.titleGreen}>{t.welcome.titlePart4}</Text>
        </Text>
      </View>

      <View style={styles.animationContainer}>
        <LottieView
          source={chatbotAnimation}
          autoPlay
          loop
          style={styles.lottie}
          onAnimationFailure={(error) => {
            console.error('Lottie animation error:', error);
            // Don't crash if animation fails
          }}
        />
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{t.welcome.description}</Text>
      </View>

      <View style={styles.languageSelectorContainer}>
        <Text style={styles.languageLabel}>{t.welcome.selectLanguage}</Text>
        <View style={styles.languageButtons}>
          <Pressable
            style={[
              styles.languageButton,
              language === 'si' && styles.languageButtonActive,
            ]}
            onPress={() => handleLanguageChange('si')}>
            <Text
              style={[
                styles.languageButtonText,
                language === 'si' && styles.languageButtonTextActive,
              ]}>
              සිංහල
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.languageButton,
              language === 'en' && styles.languageButtonActive,
            ]}
            onPress={() => handleLanguageChange('en')}>
            <Text
              style={[
                styles.languageButtonText,
                language === 'en' && styles.languageButtonTextActive,
              ]}>
              English
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.chatButton, isNavigating && styles.chatButtonDisabled]}
          onPress={handleChatPress}
          disabled={isNavigating}>
          {isNavigating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.chatButtonText}>{t.welcome.chatButton}</Text>
              <Text style={styles.chatButtonArrow}>→</Text>
            </>
          )}
        </Pressable>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusIndicator} />
        <Text style={styles.statusText}>{t.welcome.liveStatus}</Text>
      </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  badgeContainer: {
    marginBottom: 28,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(232, 240, 245, 0.95)',
    borderWidth: 1.5,
    borderColor: '#6B9BB8',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#11486b',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  badgeText: {
    fontSize: 13,
    color: '#11486b',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 44,
    textAlign: 'center',
  },
  titleDark: {
    color: '#1A1A1A',
  },
  titleGreen: {
    color: '#11486b', // Dark teal - primary color
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginBottom: 24,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  descriptionContainer: {
    marginBottom: 36,
    paddingHorizontal: 8,
  },
  description: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 23,
    textAlign: 'center',
    fontWeight: '400',
  },
  languageSelectorContainer: {
    marginBottom: 36,
  },
  languageLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 14,
    textAlign: 'center',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 14,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  languageButtonActive: {
    borderColor: '#11486b',
    backgroundColor: 'rgba(232, 240, 245, 0.8)',
    shadowColor: '#11486b',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    transform: [{ scale: 1.02 }],
  },
  languageButtonText: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  languageButtonTextActive: {
    color: '#11486b',
    fontWeight: '700',
  },
  buttonContainer: {
    marginBottom: 28,
  },
  chatButton: {
    backgroundColor: '#ffa425', // Bright orange - CTA color
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#ffa425',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  chatButtonDisabled: {
    opacity: 0.7,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chatButtonArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#478356', // Earthy green - secondary color
    shadowColor: '#478356',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: 14,
    color: '#616161',
    fontWeight: '500',
  },
});

