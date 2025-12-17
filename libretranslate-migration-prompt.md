# Switch Translation Backend from Google Cloud to LibreTranslate - Migration Prompt

Copy and paste everything below this line into Cursor AI:

---

I need to migrate my existing translation API backend from Google Cloud Translation API to LibreTranslate (free, open-source). Please update the code to use LibreTranslate instead of Google Cloud Translation.

## Current Situation

- I have a Next.js API route at `app/api/translate/route.ts` that currently uses Google Cloud Translation API v2
- The endpoint accepts POST requests with `{ text, sourceLang, targetLang }` and returns `{ translatedText }`
- It currently requires `GOOGLE_TRANSLATE_API_KEY` environment variable
- I want to switch to LibreTranslate public API (free, no API key needed)

## Migration Requirements

### 1. Replace Google Cloud Translation API with LibreTranslate

**Current Google API endpoint:**
- URL: `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`
- Request body: `{ q, source, target, format: "text" }`
- Response structure: `data.data.translations[0].translatedText`

**New LibreTranslate API:**
- URL: `https://libretranslate.com/translate` (public instance, free)
- Request body: `{ q, source, target, format: "text" }` (same format)
- Response structure: `{ translatedText: "..." }` (simpler structure)
- **No API key required** - remove all Google API key dependencies

### 2. Update API Route Implementation

In `app/api/translate/route.ts`:

- **Remove** the check for `GOOGLE_TRANSLATE_API_KEY` environment variable
- **Replace** the Google API URL with LibreTranslate URL: `https://libretranslate.com/translate`
- **Update** response parsing to use `data.translatedText` instead of `data.data.translations[0].translatedText`
- **Keep** all existing validation logic (text, targetLang checks)
- **Keep** the English short-circuit logic (`if targetLang === 'en'`)
- **Keep** all error handling, but update error messages to reference LibreTranslate

### 3. Error Handling Updates

- If LibreTranslate API call fails (network error, non-200 status):
  - Log full error details to server console
  - Return 500 with `{ error: "Translation failed" }`
- If LibreTranslate response is missing `translatedText`:
  - Log a warning
  - Fall back to returning original text
- Remove any "Translation service not configured" errors related to missing API key

### 4. Code Structure

The updated route should:

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Parse and validate request body (keep existing validation)
    // 2. Check if targetLang is 'en' → return early (keep existing)
    // 3. Call LibreTranslate API (replace Google API call)
    // 4. Parse response and extract translatedText (update parsing)
    // 5. Return success response
  } catch (error) {
    // Log error and return 500 (keep existing error handling)
  }
}
```

### 5. Specific Changes Needed

**Replace this pattern:**
```typescript
const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
```

**With:**
```typescript
const url = 'https://libretranslate.com/translate';
```

**Replace this pattern:**
```typescript
if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
  return NextResponse.json(
    { error: 'Translation service not configured' },
    { status: 500 }
  );
}
```

**With:**
```typescript
// No API key check needed for LibreTranslate public instance
```

**Replace this pattern:**
```typescript
const data = await resp.json();
const translatedText = data.data?.translations?.[0]?.translatedText ?? text;
```

**With:**
```typescript
const data = await resp.json();
const translatedText = data.translatedText || text;
```

### 6. Request/Response Format

**Request format stays the same:**
```json
{
  "text": "Hello, how are you?",
  "sourceLang": "en",
  "targetLang": "si"
}
```

**Response format stays the same:**
```json
{
  "translatedText": "..."
}
```

**LibreTranslate API request body:**
```json
{
  "q": "Hello, how are you?",
  "source": "en",
  "target": "si",
  "format": "text"
}
```

### 7. Environment Variables

- **Remove** `GOOGLE_TRANSLATE_API_KEY` from `.env.example` (or mark as optional/not needed)
- Update `README.md` to reflect that no API key is needed for LibreTranslate
- Note: LibreTranslate public instance doesn't require authentication

### 8. Testing Requirements

After migration, verify:

- ✅ Endpoint still accepts same request format
- ✅ Returns same response format `{ translatedText: string }`
- ✅ English short-circuit still works (`targetLang === 'en'`)
- ✅ Sinhala translation works (`targetLang === 'si'`)
- ✅ Tamil translation works (`targetLang === 'ta'`)
- ✅ Error handling works when LibreTranslate is unavailable
- ✅ No API key errors occur

### 9. Additional Notes

- LibreTranslate public instance may have rate limits - handle gracefully
- If translation fails, fall back to original English text (don't crash)
- Keep all existing TypeScript types and interfaces
- Maintain code quality and error logging
- Update any comments that reference Google Cloud Translation

## Acceptance Criteria

- ✅ Code successfully migrated from Google Cloud Translation to LibreTranslate
- ✅ No API key required (removed all Google API key dependencies)
- ✅ All existing functionality preserved (validation, error handling, English short-circuit)
- ✅ Response format unchanged (mobile app compatibility maintained)
- ✅ Error handling updated appropriately
- ✅ README/docs updated to reflect LibreTranslate usage
- ✅ Code is ready to deploy to Vercel without any environment variable changes

Please update the code now and ensure all changes are complete.

