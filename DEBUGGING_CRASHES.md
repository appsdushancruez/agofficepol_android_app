# Debugging Production Crashes Guide

## Issue: App crashes on production build but works in Expo Go

### Root Causes Found & Fixed:

1. ✅ **Missing Android Permissions** - Added INTERNET permission
2. ✅ **LanguageContext returning null** - Fixed to always render
3. ✅ **ErrorBoundary added** - Catches React errors gracefully
4. ✅ **Lottie error handlers** - Prevents crashes on animation failure

---

## How to Get Crash Logs (Windows)

### Method 1: Using ADB Logcat (Recommended)

**Prerequisites:**
- Enable Developer Options on your Android device
- Enable USB Debugging
- Connect device via USB
- Install ADB (comes with Android Studio or download separately)

**Commands:**

```powershell
# Connect device and check if detected
adb devices

# Filter logs for your app only
adb logcat | findstr /C:"com.dmccruez.chat_bot"

# OR get all Android logs and save to file
adb logcat > crash_log.txt

# Filter for errors only
adb logcat *:E | findstr /C:"com.dmccruez.chat_bot"

# Clear log buffer first, then capture fresh logs
adb logcat -c
adb logcat > crash_log.txt
```

**Why `findstr` might not work:**
- Make sure ADB is in your PATH
- Try: `adb logcat | Select-String "chat_bot"`
- Or use: `adb logcat > log.txt` then search the file

### Method 2: Using Expo Dev Client (Best for Debugging)

1. **Build a development build:**
   ```bash
   eas build -p android --profile development
   ```

2. **Install the dev client APK** on your device

3. **Start dev server:**
   ```bash
   npx expo start --dev-client
   ```

4. **Open app in dev client** - You'll see red error screens with full stack traces

### Method 3: Check Play Console Crash Reports

1. Go to **Google Play Console**
2. Navigate to **Quality → Android vitals → Crashes**
3. View crash reports and stack traces

---

## Common Production Crash Causes

### 1. Missing Permissions
**Fixed:** Added INTERNET permission to `app.json`

### 2. React Component Returning Null
**Fixed:** LanguageContext now always renders children

### 3. Unhandled Promise Rejections
**Check:** All async operations have try-catch blocks

### 4. Missing Assets
**Check:** All images, fonts, and JSON files are properly imported

### 5. Environment Variables
**Check:** `__DEV__` might not work in production - use explicit checks

### 6. Native Module Issues
**Check:** All native dependencies are compatible with React Native 0.81.5

---

## Testing Checklist

Before building for production:

- [ ] Test with `npx expo start` (development)
- [ ] Test with `eas build --profile development` (dev client)
- [ ] Test with `eas build --profile production` (production build)
- [ ] Check all imports are correct
- [ ] Verify all assets exist
- [ ] Test on real device, not just emulator
- [ ] Check network requests work
- [ ] Verify AsyncStorage works
- [ ] Test error scenarios (no internet, invalid API responses)

---

## Quick Fixes Applied

1. **Added Android permissions** in `app.json`
2. **Fixed LanguageContext** to never return null
3. **Added ErrorBoundary** to catch React errors
4. **Added Lottie error handlers** to prevent animation crashes

---

## Next Steps

1. **Rebuild the app:**
   ```bash
   eas build -p android --profile production
   ```

2. **Test the new build** on your device

3. **If still crashing:**
   - Use dev client build to see exact error
   - Check ADB logs for native crashes
   - Review Play Console crash reports

---

## ADB Troubleshooting

**If `adb logcat | findstr` doesn't work:**

```powershell
# Check if ADB is installed
adb version

# Check if device is connected
adb devices

# If device not found:
# 1. Enable USB debugging on device
# 2. Allow USB debugging prompt on device
# 3. Try different USB cable/port

# Alternative PowerShell command:
adb logcat | Select-String "chat_bot"

# Or save to file and search:
adb logcat > log.txt
# Then open log.txt and search for "chat_bot" or "FATAL"
```

---

## React 19 Compatibility Note

You're using React 19.1.0 with React Native 0.81.5. This is a very new React version. If crashes persist, consider:

1. Downgrading React to 18.x (more stable with RN 0.81.5)
2. Or upgrading React Native to a version that officially supports React 19

Check compatibility: https://react-native-community.github.io/upgrade-helper/

