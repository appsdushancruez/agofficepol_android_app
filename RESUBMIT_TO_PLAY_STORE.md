# Guide: Resubmit Updated AAB to Google Play Store

This guide will help you build a new AAB with the updated code (without government references) and resubmit it to Google Play Store.

---

## Step 1: Update App Version (Already Done)

✅ The app version has been updated from `1.0.0` to `1.0.1` in `app.json`

**Note:** EAS will automatically increment the `versionCode` (build number) when you build, so you don't need to worry about that.

---

## Step 2: Build New AAB with EAS Expo

### 2.1 Make sure you're logged in to EAS

```bash
eas login
```

If you're already logged in, you can skip this step.

### 2.2 Build the new Android App Bundle

From your project root directory, run:

```bash
eas build -p android --profile production
```

**What happens:**
- EAS will upload your code to their servers
- It will automatically increment the `versionCode` (e.g., from 2 to 3)
- The build will take about 15-20 minutes
- You'll see a build URL in the terminal

**During the build:**
- You'll see progress updates in the terminal
- You can also monitor it at: https://expo.dev (go to your project → Builds)

### 2.3 Wait for build to complete

- The terminal will show "Build finished!"
- Or check the Expo dashboard: https://expo.dev

---

## Step 3: Download the New AAB

### Option A: From Terminal
After the build completes, EAS will show you a download link in the terminal.

### Option B: From Expo Dashboard
1. Go to https://expo.dev
2. Navigate to your project
3. Click on **"Builds"** tab
4. Find your latest build (should show version 1.0.1)
5. Click the **"Download"** button next to the Android build
6. Save the `.aab` file (e.g., `chat_bot-release-v1.0.1.aab`)

---

## Step 4: Update Google Play Console Store Listing

**IMPORTANT:** Before uploading the new AAB, update your app name in Play Console to remove government references.

1. Go to **Google Play Console**: https://play.google.com/console
2. Select your app
3. Go to **Grow → Store presence → Main store listing**
4. Update the **App name**:
   - Change from: "Chat Bot DS Office Polgahawela"
   - Change to: "Chat Bot" (or "AI Chat Bot", "Smart Chat Assistant", etc.)
5. **Review your descriptions:**
   - Check **Short description** - remove any government references
   - Check **Full description** - remove any government references
6. Click **"Save"**

---

## Step 5: Upload New AAB to Internal Testing

1. Go to **Testing → Internal testing** in Play Console
2. Find your existing release (version 2 / 1.0.0)
3. Click **"Create new release"** (or **"Edit release"** if you want to replace the existing one)

### Option A: Replace Existing Release
1. Click **"Edit release"** on your current release
2. Under **"App bundles and APKs"**, click **"Remove"** on the old AAB
3. Click **"Upload"** and select your new `.aab` file
4. Wait for processing (1-2 minutes)

### Option B: Create New Release
1. Click **"Create new release"**
2. Under **"App bundles and APKs"**, click **"Upload"**
3. Select your new `.aab` file (version 1.0.1)
4. Wait for processing

5. **Add Release Notes:**
   ```
   Fixed app branding to comply with Google Play policies.
   Updated app name and removed government references.
   ```

6. Click **"Save"** (don't roll out yet)

---

## Step 6: Verify Release Details

Before submitting, check:

- ✅ New AAB is uploaded (should show version 1.0.1 or higher versionCode)
- ✅ Release notes are added
- ✅ No errors or warnings shown
- ✅ Store listing has been updated (no government references)

---

## Step 7: Submit for Review

1. In the **Internal testing** section, find your release
2. Click **"Review release"** (or **"Edit release"** → **"Review release"**)
3. Review all the information
4. If everything looks good, click **"Start rollout to Internal testing"**

**OR** if you want to go directly to Production:

1. Go to **Production → Releases**
2. Click **"Create new release"**
3. Under **"App bundles and APKs"**, click **"Add from library"**
4. Select your new AAB (version 1.0.1)
5. Add release notes
6. Click **"Review release"**
7. Click **"Start rollout to Production"**

---

## Step 8: Wait for Review

- **Status:** Will change to "In review"
- **Review time:** Usually a few hours to 1-2 days
- **Email notification:** You'll receive an email when review is complete

---

## Troubleshooting

### Issue: "Version code already used"
**Solution:** EAS automatically increments versionCode, so this shouldn't happen. If it does, make sure you're using the latest build from EAS.

### Issue: "App name still shows old name"
**Solution:** Make sure you updated the store listing AND saved it before uploading the new AAB.

### Issue: "Can't find the new build"
**Solution:** 
- Check Expo dashboard: https://expo.dev → Your project → Builds
- Make sure the build status is "Finished"
- Download directly from the Expo dashboard

### Issue: "Build failed"
**Solution:**
- Check the build logs in Expo dashboard
- Make sure all dependencies are installed: `npm install`
- Try building again: `eas build -p android --profile production`

---

## Quick Command Reference

```bash
# Login to EAS (if needed)
eas login

# Build new AAB
eas build -p android --profile production

# Check build status
eas build:list

# View build details
eas build:view [BUILD_ID]
```

---

## Checklist

Before resubmitting:

- [ ] App version updated to 1.0.1 in app.json ✅
- [ ] All government references removed from code ✅
- [ ] New AAB built with EAS
- [ ] New AAB downloaded
- [ ] Store listing updated (app name changed)
- [ ] New AAB uploaded to Play Console
- [ ] Release notes added
- [ ] Release submitted for review

---

## What Changed in This Update

✅ **Removed government references:**
- App badge text (Sinhala & English)
- Loading screen title
- Description text
- Privacy policy app name

✅ **Updated to generic branding:**
- "AI Chat Bot Service" / "AI චැට්බොට් සේවාව"
- Generic service descriptions

✅ **Functionality preserved:**
- All chat features work the same
- UI/UX unchanged
- Only text labels updated

---

**Good luck with your resubmission! 🚀**

