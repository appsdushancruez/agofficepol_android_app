import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

// Import Lottie animation - using relative path from app/loading.tsx to assets/images/chatbot.json
const chatbotAnimation = require('../assets/images/chatbot.json');

const LOADING_DURATION = 5000; // 5 seconds minimum

export default function LoadingScreen() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADING_DURATION,
      useNativeDriver: false,
    }).start(() => {
      setAnimationFinished(true);
    });
  }, [progress]);

  useEffect(() => {
    if (animationFinished) {
      // Navigate to welcome screen after loading completes
      setTimeout(() => {
        router.replace('/welcome');
      }, 300);
    }
  }, [animationFinished, router]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient
      colors={['#E8F5E9', '#C8E6C9', '#A5D6A7', '#F1F8F4', '#FFFFFF']}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      style={styles.gradientContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <LottieView
          source={chatbotAnimation}
          autoPlay
          loop
          style={styles.lottie}
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.mainTitle}>
            පොල්ගහවෙල ප්‍රාදේශීය ලේඛම් කාර්යාලය
          </Text>
          <Text style={styles.subTitle}>
            බොට් පරිපාලන පද්ධතිය
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Designed by NEMTECH Software Solutions
          </Text>
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneText}>070 644 2024</Text>
            <Text style={styles.phoneText}>070 644 2025</Text>
            <Text style={styles.phoneText}>070 644 2026</Text>
            <Text style={styles.phoneText}>070 644 2027</Text>
            <Text style={styles.phoneText}>070 644 2028</Text>
          </View>
        </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 40,
    flex: 1,
  },
  lottie: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.whatsappGreenDark,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 26,
  },
  progressBarContainer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#C8E6C9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.whatsappGreen,
    borderRadius: 3,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  phoneContainer: {
    alignItems: 'center',
    gap: 4,
  },
  phoneText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '400',
    textAlign: 'center',
  },
});

