import { Language } from '@/constants/translations';
import { CONFIG } from '../config/constants';

/**
 * Translate dynamic bot text from English into the current UI language.
 * - If target language is English, returns the original text.
 * - If translation is not configured or fails, falls back to the original text.
 */
export async function translateText(text: string, targetLang: Language): Promise<string> {
  if (!text) {
    return text;
  }

  // English responses are already correct
  if (targetLang === 'en') {
    return text;
  }

  // If no translation endpoint is configured, just return original
  if (!CONFIG.TRANSLATION_API_URL) {
    console.warn('Translation API URL is not configured. Returning original text.');
    return text;
  }

  try {
    const response = await fetch(CONFIG.TRANSLATION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(CONFIG.TRANSLATION_API_KEY
          ? { Authorization: `Bearer ${CONFIG.TRANSLATION_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        text,
        sourceLang: 'en',
        targetLang,
      }),
    });

    if (!response.ok) {
      // Try to get error details from response
      let errorDetails = '';
      try {
        const errorData = await response.text();
        errorDetails = errorData;
        console.error('Translation API error status:', response.status, response.statusText);
        console.error('Translation API error response:', errorDetails);
      } catch (e) {
        console.error('Translation API error status:', response.status, response.statusText);
        console.error('Could not parse error response');
      }
      return text;
    }

    const data = await response.json();

    const translated =
      data.translatedText ?? data.text ?? data.translation ?? data.result ?? text;

    if (typeof translated !== 'string') {
      console.warn('Unexpected translation response shape, using original text:', data);
      return text;
    }

    return translated;
  } catch (error) {
    console.error('Translation error, falling back to original text:', error);
    return text;
  }
}


