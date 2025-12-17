# Test Translation API - Debugging Guide

## Step 1: Check Vercel Logs

1. Go to https://vercel.com/dashboard
2. Click on your translation project: `agoffice-g-translate-api`
3. Click on **"Logs"** tab
4. Send a test request (from your app or curl)
5. Look for error messages in the logs

## Step 2: Test LibreTranslate Directly

Test if LibreTranslate public API is working:

```bash
# Using curl (if you have Git Bash or WSL)
curl -X POST https://libretranslate.com/translate \
  -H "Content-Type: application/json" \
  -d '{"q":"Hello","source":"en","target":"si","format":"text"}'
```

Expected response:
```json
{"translatedText":"..."}
```

## Step 3: Common Issues and Fixes

### Issue 1: LibreTranslate Rate Limiting
**Symptom**: 429 Too Many Requests or 500 errors
**Fix**: Wait a few minutes and try again, or use a different free service

### Issue 2: Language Code Mismatch
**Symptom**: Translation returns same text or error
**Check**: LibreTranslate uses ISO codes:
- Sinhala: `si` ✅
- Tamil: `ta` ✅
- English: `en` ✅

### Issue 3: Backend Code Bug
**Check**: Your backend route should:
- Call `https://libretranslate.com/translate` (not Google)
- Send body: `{ q, source, target, format: "text" }`
- Parse response: `data.translatedText`

### Issue 4: CORS Issues
**Symptom**: CORS error in browser console
**Fix**: Vercel should handle CORS automatically, but check if your route has CORS headers

## Step 4: Alternative Free Translation Services

If LibreTranslate doesn't work, try these alternatives:

### Option A: MyMemory Translation (Free Tier)
- Sign up at: https://mymemory.translated.net/
- Get free API key
- Endpoint: `https://api.mymemory.translated.net/get`
- Request: `?q=text&langpair=en|si`

### Option B: Use Backend Translation (Recommended)
- Modify your main chat backend (`agofficepol.vercel.app`)
- Add language parameter to chat API
- Translate responses on backend using LibreTranslate
- Single API call instead of two

## Step 5: Check Your Backend Code

Make sure your `app/api/translate/route.ts` has:

```typescript
// Correct LibreTranslate URL
const url = 'https://libretranslate.com/translate';

// Correct request body
const resp = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    q: text,           // Note: 'q' not 'text'
    source: sourceLang,
    target: targetLang,
    format: 'text',
  }),
});

// Correct response parsing
const data = await resp.json();
const translatedText = data.translatedText; // Note: direct property
```

## Next Steps

1. Check Vercel logs first - this will tell you exactly what's wrong
2. Test LibreTranslate directly to see if it's working
3. Verify your backend code matches the format above
4. If still failing, consider switching to backend translation approach


