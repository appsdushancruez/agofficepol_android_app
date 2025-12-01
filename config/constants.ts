// For testing with Expo Go:
// - Android Emulator: use 'http://10.0.2.2:3000'
// - Physical Device: use your computer's local IP (e.g., 'http://192.168.1.100:3000')
// - Production API: use 'https://agofficepol.vercel.app'
// To find your local IP: Windows (ipconfig), Mac/Linux (ifconfig)

// Set USE_PRODUCTION_API to true to test against production API even in dev mode
const USE_PRODUCTION_API = true;

export const CONFIG = {
  API_BASE_URL: USE_PRODUCTION_API
    ? 'https://agofficepol.vercel.app'
    : __DEV__
      ? 'http://10.0.2.2:3000' // Android emulator localhost
      : 'https://agofficepol.vercel.app',
};

