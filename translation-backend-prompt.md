# Translation Backend API - Implementation Prompt for Cursor AI

Copy and paste everything below this line into Cursor AI:

---

You are building a very small translation backend API for my mobile app. I have already created a Next.js project using `npx create-next-app@latest`. Please implement a single API endpoint `/api/translate` that wraps Google Cloud Translation API.

## High-Level Requirements

- **Framework**: Next.js 16+ with App Router (use `app/` directory structure)
- **Deployment**: Must be deployable to Vercel with zero additional code changes
- **Language**: TypeScript
- **Single Responsibility**: Provide a POST API endpoint at `/api/translate`

## API Endpoint Specification

### Request Format

The endpoint accepts POST requests with JSON body:

```json
{
  "text": "string (required) - text to translate",
  "sourceLang": "string (optional, defaults to 'en') - source language code",
  "targetLang": "string (required) - target language code ('si', 'ta', 'en', etc.)"
}
```

### Response Format

**Success (200):**
```json
{
  "translatedText": "string - translated text"
}
```

**Error (400/500):**
```json
{
  "error": "string - error message"
}
```

## Implementation Details

### 1. Create API Route File

Create `app/api/translate/route.ts` with a POST handler that:

- Uses Next.js 13+ App Router API route pattern (`export async function POST(request: Request)`)
- Parses request body with `await request.json()`
- Returns responses using `NextResponse.json()`

### 2. Request Validation

- Check if `text` is provided and is a non-empty string → return 400 if missing
- Check if `targetLang` is provided → return 400 if missing
- Default `sourceLang` to `"en"` if not provided

### 3. Short-Circuit for English

- If `targetLang === "en"`, immediately return `{ translatedText: text }` without calling Google API
- This optimizes performance and avoids unnecessary API calls

### 4. Google Cloud Translation Integration

- Use **Google Cloud Translation API v2 REST** with API key authentication
- Environment variable: `GOOGLE_TRANSLATE_API_KEY` (must be set in Vercel)
- API endpoint: `https://translation.googleapis.com/language/translate/v2`
- Request method: POST
- Request headers: `Content-Type: application/json`
- Request body format:
  ```json
  {
    "q": "text to translate",
    "source": "en",
    "target": "si",
    "format": "text"
  }
  ```
- Query parameter: `?key=${GOOGLE_TRANSLATE_API_KEY}`
- Response parsing: Extract `data.data.translations[0].translatedText`

### 5. Error Handling

- If `GOOGLE_TRANSLATE_API_KEY` is not set → return 500 with `{ error: "Translation service not configured" }`
- If Google API call fails (network error, non-200 status, etc.):
  - Log full error details to server console (use `console.error`)
  - Return 500 with `{ error: "Translation failed" }`
- If Google response is missing expected structure:
  - Log the response structure to console
  - Fall back to returning original text with a warning log
- Never expose raw Google API errors to the client
- Always return friendly error messages

### 6. Code Structure

```typescript
// app/api/translate/route.ts structure should be:

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Parse and validate request body
    // 2. Check if targetLang is 'en' → return early
    // 3. Check if GOOGLE_TRANSLATE_API_KEY exists
    // 4. Call Google Translation API
    // 5. Parse response and extract translatedText
    // 6. Return success response
  } catch (error) {
    // Log error and return 500
  }
}
```

## Environment Variables

Create a `.env.local` file (for local development) with:

```
GOOGLE_TRANSLATE_API_KEY=your-google-api-key-here
```

**Important**: Add `.env.local` to `.gitignore` (should already be there in Next.js)

## Testing Requirements

After implementation, the endpoint should work with:

```bash
# Test with Sinhala translation
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, how are you?","sourceLang":"en","targetLang":"si"}'

# Expected: {"translatedText":"..."} with Sinhala translation

# Test with Tamil translation
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, how are you?","sourceLang":"en","targetLang":"ta"}'

# Expected: {"translatedText":"..."} with Tamil translation

# Test English short-circuit
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, how are you?","sourceLang":"en","targetLang":"en"}'

# Expected: {"translatedText":"Hello, how are you?"} (no API call)

# Test missing fields
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello"}'

# Expected: 400 {"error":"text and targetLang are required"}
```

## Additional Files Needed

1. **README.md** - Update or create with:
   - Purpose: Translation API backend for mobile app
   - Environment variable setup instructions
   - Example curl commands
   - Deployment instructions for Vercel

2. **.env.example** - Create template file:
   ```
   GOOGLE_TRANSLATE_API_KEY=your-google-api-key-here
   ```

## Acceptance Criteria

- ✅ Endpoint is accessible at `/api/translate` via POST
- ✅ Accepts JSON body with `text`, `sourceLang` (optional), `targetLang` (required)
- ✅ Returns `{ translatedText: string }` on success
- ✅ Returns `{ error: string }` on failure with appropriate status codes
- ✅ Short-circuits for `targetLang === "en"` without calling Google API
- ✅ Calls Google Translation API correctly when needed
- ✅ Handles missing environment variable gracefully
- ✅ Handles Google API errors gracefully with proper logging
- ✅ Ready to deploy to Vercel (no code changes needed after setting env var)

## Notes

- Keep the implementation minimal and focused
- Use TypeScript types for request/response
- Add helpful console logs for debugging (but don't expose sensitive info)
- Follow Next.js 13+ App Router conventions
- Ensure all error paths are handled

Please implement this now and create all necessary files.

