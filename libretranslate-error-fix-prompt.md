# Fix LibreTranslate Error - Backend Update Prompt

Copy and paste everything below this line into Cursor AI in your translation backend project:

---

The LibreTranslate API is returning a non-2xx status code, causing 500 errors. I need to improve error handling and logging to see the actual error from LibreTranslate, and add fallback handling.

## Current Issue

- Error log shows: `[Translate API] LibreTranslate API responded with non-2xx status`
- The backend is calling LibreTranslate but getting an error response
- Need to see the actual error message from LibreTranslate to fix it

## Required Changes

### 1. Improve Error Logging

In `app/api/translate/route.ts`, when calling LibreTranslate:

- **Capture the full error response** from LibreTranslate (status code, status text, response body)
- **Log the complete error details** to console so we can see what LibreTranslate is actually returning
- **Include the request details** (text length, sourceLang, targetLang) in error logs for debugging

### 2. Handle Common LibreTranslate Errors

Add specific handling for common LibreTranslate errors:

- **429 Too Many Requests**: Return a helpful error message
- **400 Bad Request**: Log the request body and LibreTranslate's error message
- **503 Service Unavailable**: Indicate LibreTranslate is down
- **Any other error**: Log full details and fallback gracefully

### 3. Add Fallback Behavior

When LibreTranslate fails:

- **Log the error** with full details (status, response body, request details)
- **Return original English text** instead of crashing (graceful degradation)
- **Return 200 status** with `{ translatedText: originalText }` so the mobile app doesn't break

### 4. Update Code Structure

```typescript
// In app/api/translate/route.ts

try {
  const resp = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text',
    }),
  });

  // Log request details for debugging
  console.log('LibreTranslate request:', {
    textLength: text.length,
    sourceLang,
    targetLang,
    url: 'https://libretranslate.com/translate'
  });

  if (!resp.ok) {
    // Capture full error response
    const errorText = await resp.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = errorText;
    }

    // Log complete error details
    console.error('LibreTranslate API error:', {
      status: resp.status,
      statusText: resp.statusText,
      response: errorData,
      request: { textLength: text.length, sourceLang, targetLang }
    });

    // Handle specific error cases
    if (resp.status === 429) {
      console.error('LibreTranslate rate limit exceeded');
    } else if (resp.status === 400) {
      console.error('LibreTranslate bad request:', errorData);
    } else if (resp.status === 503) {
      console.error('LibreTranslate service unavailable');
    }

    // Fallback: return original text instead of error
    return NextResponse.json({ translatedText: text });
  }

  // Success case - parse response
  const data = await resp.json();
  const translatedText = data.translatedText || text;

  return NextResponse.json({ translatedText });

} catch (error) {
  // Network errors or other exceptions
  console.error('Translation endpoint error:', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    request: { textLength: text.length, sourceLang, targetLang }
  });

  // Fallback: return original text
  return NextResponse.json({ translatedText: text });
}
```

### 5. Test Error Scenarios

After updating, the code should:

- ✅ Log full LibreTranslate error details when it fails
- ✅ Return original text (not crash) when LibreTranslate errors
- ✅ Return 200 status (not 500) so mobile app continues working
- ✅ Provide detailed logs in Vercel for debugging

## Expected Outcome

After these changes:

1. **Vercel logs will show** the actual error message from LibreTranslate (status code, response body, etc.)
2. **Mobile app won't crash** - it will receive the original English text if translation fails
3. **We can debug** the actual issue with LibreTranslate based on the detailed logs

Please update the code with improved error handling and logging as described above.

