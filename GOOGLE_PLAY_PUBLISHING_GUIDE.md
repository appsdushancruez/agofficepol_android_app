# Google Play Store Publishing Guide

Complete step-by-step guide for publishing your Android app to Google Play Store and managing updates.

## Prerequisites

- ✅ AAB file built using EAS Expo
- ✅ Android keystore file (`.jks`)
- ✅ Google Play Console developer account
- ✅ App name, description, and graphics ready

---

## Step 1: Download Your AAB File

1. Go to your Expo dashboard (https://expo.dev)
2. Navigate to your project → **Builds**
3. Find your completed Android build
4. Click the **"Download"** button next to the "Build artifact" card
5. Save the `.aab` file (e.g., `chat_bot-release.aab`)

**Note:** Keep this file safe. You'll upload it to Google Play Console.

---

## Step 2: Access Google Play Console

1. Go to: https://play.google.com/console
2. Sign in with your Google Play developer account
3. You should see the Play Console dashboard

---

## Step 3: Create a New App

1. Click **"All apps"** in the left sidebar
2. Click the **"Create app"** button (top right)
3. Fill in the required information:
   - **App name**: Your app's display name (e.g., "Chat Bot")
   - **Default language**: Select your primary language (e.g., English - United States)
   - **App or game**: Select **App**
   - **Free or paid**: Select **Free** (or Paid if applicable)
   - Check the boxes confirming you comply with policies and export laws
4. Click **"Create app"**

---

## Step 4: Complete App Integrity (Signing Setup)

1. In your new app dashboard, go to **Setup → App integrity**
2. You'll see **"App signing"** section
3. Since you already have a keystore:
   - If you see an option to upload an upload key, you can skip it for now (EAS already signed the AAB)
   - If it asks about Play App Signing, choose to let Google manage it (recommended)
4. The signing will be handled automatically when you upload your AAB

---

## Step 5: Upload Your First AAB (Internal Testing)

**Important:** Always test your app in Internal Testing before going to Production!

1. Go to **Testing → Internal testing**
2. Click **"Create new release"**
3. Under **"App bundles and APKs"**, click **"Upload"**
4. Select your downloaded `.aab` file
5. Wait for processing (usually 1-2 minutes)
6. Add **Release notes** (e.g., "Initial release")
7. Click **"Save"** (don't roll out yet - we need to complete other sections first)

---

## Step 6: Complete Store Listing

1. Go to **Grow → Store presence → Main store listing**

2. Fill in the following sections:

   ### Basic Information
   - **App name**: Same as Step 3
   - **Short description**: ~80 characters
     - Example: "AI-powered chatbot for instant conversations and assistance"
   - **Full description**: 2-4 paragraphs describing:
     - What your app does
     - Key features
     - Benefits for users
     - Use cases

   ### Graphics (Required)
   - **App icon**: 
     - Size: 512×512 pixels
     - Format: PNG
     - Max size: 1024 KB
   - **Feature graphic**: 
     - Size: 1024×500 pixels
     - Format: PNG or JPG
   - **Phone screenshots**: 
     - At least 2 required
     - Recommended: 1080×1920 or 1440×2560 pixels
     - Show your app's main features
   - **Tablet screenshots** (Optional):
     - Only if your app supports tablets

   ### Categorization
   - **Application type**: App
   - **Category**: Select appropriate category (e.g., Productivity, Communication, Tools, etc.)

   ### Contact Details
   - **Website**: Your app/company website (or a placeholder)
   - **Email**: Your support email address
   - **Phone**: Optional

3. Click **"Save"**

---

## Step 7: Complete App Content (Required)

1. Go to **Policy → App content**

2. Complete each section:

   ### Target Audience and Content
   - Select appropriate age groups (e.g., 18+ or all ages)
   - If your app is designed for children, select the appropriate option

   ### App Access
   - Indicate if any part of your app requires login or invite-only access

   ### Ads
   - Select **"Yes"** if your app shows ads
   - Select **"No"** if your app doesn't show ads

   ### Data Safety (Required)
   - Click **"Start"** or **"Manage"**
   - Declare what data types you collect:
     - Location data
     - Personal information
     - Device ID
     - Other data types
   - Indicate whether data is:
     - Processed
     - Shared with third parties
   - Specify security practices (e.g., data encryption)
   - **Important:** Answer honestly based on your app's actual behavior

   ### Content Rating (Required)
   - Click **"Start"** or **"Manage"**
   - Enter your contact email
   - Select your app category
   - Answer questions about content:
     - Violence
     - Sexual content
     - Drugs/alcohol
     - User-generated content
     - etc.
   - Submit to get your content rating (e.g., Everyone, Teen)

---

## Step 8: Privacy Policy (Required)

1. **Create a Privacy Policy page:**
   - Host it on your website, GitHub Pages, or a free hosting service
   - Must be publicly accessible via URL

2. **Add Privacy Policy URL:**
   - In **Policy → App content → Privacy policy**
   - Paste your Privacy Policy URL
   - Click **"Save"**

**Note:** If you need a Privacy Policy template, you can find many free generators online or use a template service.

---

## Step 9: Pricing & Distribution

1. Go to **Monetize → Pricing & distribution** (or **Setup → Pricing & distribution**)

2. Configure:
   - **Price**: Free or Paid
   - **Countries/regions**: Select where you want to distribute your app
   - **Device categories**: 
     - Phones
     - Tablets
     - Chromebooks
     - etc.

3. Click **"Save"**

**Important:** If you mark your app as **Paid**, you cannot change it to Free later (for the same app ID). You can change Free to Paid, but not the reverse.

---

## Step 10: Test Your App (Internal Testing)

1. Go back to **Testing → Internal testing**
2. Find your saved release
3. Click **"Edit release"** → **"Review release"**
4. If all checks pass, click **"Start rollout to Internal testing"**

5. **Add testers:**
   - **Option A:** Add email addresses (up to 100 testers)
   - **Option B:** Create a testing link (anyone with the link can test)

6. **Test your app:**
   - Testers will receive a link to install your app from Play Store
   - Install on real devices
   - Test all major features
   - Verify everything works correctly

7. **When satisfied:** Proceed to Production release

---

## Step 11: Create Production Release

Once internal testing is successful:

1. Go to **Production → Releases**
2. Click **"Create new release"**
3. Under **"App bundles and APKs"**, click **"Add from library"**:
   - Select the same AAB you tested (or upload a new one if you made changes)
4. Add **Release notes** (e.g., "Initial release - AI chatbot with modern UI")
5. Click **"Next"**
6. **Review any warnings/errors:**
   - Missing content rating → Complete Step 7
   - Missing data safety → Complete Step 7
   - Missing privacy policy → Complete Step 8
   - Missing store listing → Complete Step 6
7. When all checks are green, click **"Review release"**
8. Finally, click **"Start rollout to Production"** (or **"Rollout"**)

---

## Step 12: Wait for Review

- Your app status will show **"In review"**
- **Review time:**
  - First release: Usually a few hours to a few days
  - Subsequent updates: Usually faster (hours to 1 day)
- You'll receive an email when:
  - ✅ **Published** → Your app is live on Play Store!
  - ❌ **Rejected** → Fix the issues mentioned and resubmit

---

## How to Send Updates (Future Releases)

### For Each Update:

1. **Build a new AAB:**
   ```bash
   eas build -p android --profile production
   ```
   - EAS will automatically increment `versionCode` (e.g., 2, 3, 4...)
   - Make sure your `app.json` has a new `version` (e.g., "1.0.1", "1.1.0")

2. **Download the new AAB** from Expo dashboard

3. **In Play Console:**
   - Go to **Production → Releases**
   - Click **"Create new release"**
   - Upload the new AAB
   - Add release notes (e.g., "Bug fixes and performance improvements")
   - Click **"Review release"** → **"Start rollout to Production"**

4. **Users will receive the update automatically** via Play Store

---

## Pre-Publishing Checklist

Before submitting to Production, ensure you have completed:

- [ ] AAB file downloaded from Expo
- [ ] Store listing completed (name, description, screenshots, icon)
- [ ] Content rating completed
- [ ] Data safety form completed
- [ ] Privacy policy URL added
- [ ] Pricing & distribution configured
- [ ] Internal testing completed and verified
- [ ] Production release created and submitted

---

## Important Notes

### Keystore Security
- **Keep your keystore file safe!** (`@dmccruez_chat_bot.jks`)
- If you lose it, you won't be able to update your app
- Consider backing it up securely (encrypted storage)
- EAS also stores it remotely, but having a local backup is recommended

### Version Numbers
- Each update must have a **higher `versionCode`**
- EAS handles this automatically
- Your `app.json` `version` field should also increment (e.g., "1.0.0" → "1.0.1")

### Review Time
- First release may take longer (up to several days)
- Subsequent updates are usually faster (hours to 1 day)
- Be patient and check your email for updates

### Store Listing Updates
- You can update text and graphics anytime without a new build
- Go to **Grow → Store presence → Main store listing** to make changes

---

## Troubleshooting

### Common Issues:

1. **"Missing content rating"**
   - Complete Step 7 → Content Rating section

2. **"Missing data safety"**
   - Complete Step 7 → Data Safety section

3. **"Missing privacy policy"**
   - Complete Step 8

4. **"App rejected"**
   - Read the rejection email carefully
   - Fix the mentioned issues
   - Resubmit

5. **"Version code already used"**
   - Build a new AAB with a higher version code
   - EAS handles this automatically

---

## Resources

- [Google Play Console](https://play.google.com/console)
- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Google Play Policy Center](https://play.google.com/about/developer-content-policy/)

---

## Support

If you encounter issues:
1. Check the Play Console for specific error messages
2. Review Google Play policies
3. Check Expo documentation for build issues
4. Contact Google Play support if needed

---

**Good luck with your app launch! 🚀**

