---
name: multilingual-chat-replies
overview: Extend the chat experience to support Sinhala, English, and Tamil by translating incoming English bot replies on the client using a cloud translation API, driven by the existing language selector.
todos:
  - id: add-tamil-language-support
    content: Extend Language type and translations to include Tamil (ta), and expose Tamil in the welcome screen language selector.
    status: completed
  - id: translation-helper-utility
    content: Create a reusable translateText helper that calls a configurable cloud translation API, with graceful error handling and short-circuit for English.
    status: completed
  - id: integrate-translation-into-chat
    content: In chat.tsx, translate bot reply text based on the current language before storing it in message state, falling back to English on failure.
    status: completed
    dependencies:
      - translation-helper-utility
  - id: update-chat-ui-translations
    content: Add any missing chat-related UI strings (e.g., backLabel) for all three languages and ensure they are wired through LanguageContext.
    status: completed
    dependencies:
      - add-tamil-language-support
  - id: test-multilingual-chat
    content: Manually test chat flows in Sinhala, English, and Tamil to ensure replies and UI text display correctly and the app behaves well on language switches.
    status: completed
    dependencies:
      - integrate-translation-into-chat
      - update-chat-ui-translations
---

# Add Sinhala/English/Tamil translation for chat replies

### Overview

We will keep the backend responses in English but translate them on the client according to the user’s selected language (Sinhala, English, or Tamil) before rendering each bot message. The existing `LanguageContext` and `translations` setup will be extended to include Tamil, and the chat screen will use a translation helper that calls a cloud translation API when the selected language is not English.

### Current structure

- **Language context** (`contexts/LanguageContext.tsx`):
  - `Language` is currently `'si' | 'en'`, persisted in AsyncStorage.
  - `t` provides localized UI strings via `translations[language]`.
- **Translations** (`constants/translations.ts`):
  - Defines UI strings for `si` and `en` for `welcome` and `chat` sections.
  - No Tamil language or chat-specific keys for the new back button label yet (we can add those as part of this work).
- **Chat API** (`services/api.ts` and `chatAPI.processMessage`):
  - Returns `ChatResponse` objects that include `response` (bot’s English text), `menuItems` (with English titles and descriptions), and other metadata.
- **Chat screen** (`app/chat.tsx`):
  - Renders `ChatMessage` components from `messages`, where bot messages currently use `response` text directly.
  - Uses `useLanguage` only for static UI strings like `t.chat.headerTitle` and `t.chat.emptyMessage`.

### Plan

#### 1. Extend language system to support Tamil

- **Update type definitions and storage**
  - Extend `Language` in `constants/translations.ts` to include `'ta'` (Tamil).
  - Update `LanguageContext` to accept `'ta'` as a valid persisted value when loading/saving from AsyncStorage.
- **Add Tamil UI translations**
  - Add a new `ta` entry to `translations` with Tamil strings for:
    - `welcome.badge`, `titlePart*`, `description`, `chatButton`, `liveStatus`, `selectLanguage`.
    - `chat.headerTitle`, `chat.emptyMessage`, `chat.jobNumberHint` (and `chat.backLabel` if needed for the back arrow).
- **Expose Tamil in the welcome screen language selector**
  - In `welcome.tsx`, add a third `Pressable` language button for Tamil (label `தமிழ்`) that calls `handleLanguageChange('ta')`.
  - Ensure styling matches the existing two buttons (active state, etc.).

#### 2. Design translation helper for dynamic bot content

- **Define a reusable translation utility**
  - Create a helper (e.g., `translateText(message: string, targetLang: Language): Promise<string>`) in a new file like `utils/translation.ts`.
  - Internally, this function will:
    - Short-circuit when `targetLang === 'en'` and return the original message.
    - Call the chosen cloud translation API when `targetLang` is `'si'` or `'ta'`.
    - Handle errors gracefully by returning the original English text if translation fails, logging the error.
- **Decide on translation API wiring**
  - Use a configurable base (e.g., `CONFIG.TRANSLATION_API_URL` and/or `CONFIG.TRANSLATION_API_KEY`) so the translation service can be swapped without touching UI logic.
  - Implement a small wrapper that posts `{ text, sourceLang: 'en', targetLang }` to the translation endpoint and expects `{ translatedText }` back.

#### 3. Integrate translation into chat message flow

- **Extend `ChatMessage` type or message state to hold translated text**
  - Option A (simple): store only the display text as already translated.
    - When constructing a bot `ChatMessage` in `chat.tsx`, compute the translated text first and store that in `text`.
    - We keep the original English version only transiently in the function.
  - Option B (more future-proof): store both `originalText` and `displayText`.
    - For now we’ll implement Option A for simplicity, since you chose “translated only”.
- **Translate bot replies before appending them to state**
  - In `handleSendMessage` in `chat.tsx`:
    - After receiving `response` (`responseText`) from `chatAPI.processMessage`, read the current `language` from `useLanguage()`.
    - If language is `'en'`, use `responseText` as is.
    - If language is `'si'` or `'ta'`, call `translateText(responseText, language)` and await the result.
    - Use the translated text when creating the `botMessage` (`text` field), while leaving menu metadata untouched.
  - Ensure we don’t block the UI unnecessarily:
    - Keep the existing `isLoading` behavior, but include translation time in that loading state.
    - If translation fails, fall back to the original `responseText`.

#### 4. Translate dynamic menu-related text where appropriate

- **Menu items, button labels, and descriptions**
  - Menu/Document titles (`menuItem.title`) currently come from the backend in English; for a consistent UX we can also translate those.
  - Strategy:
    - When we build the `botMessage` in `chat.tsx`, optionally loop through `response.menuItems` and produce client-side translated labels based on the same `translateText` helper.
    - Because this may involve many strings, consider translating only the visible parts (e.g., `menuItem.title`) and leaving internal IDs untouched.
  - For the first iteration, keep menu items in English to avoid complexity; once core reply translation is working, we can extend the same helper to menu titles if desired.

#### 5. Handle language changes during an active chat

- **Behavior on language switch mid-conversation**
  - Keep message history as already translated at the time they were received.
  - On language change (via `setLanguage` on the welcome or later a settings screen), future messages will be translated into the new language; past messages remain in their existing language.
  - This avoids the complexity of re-translating the entire history, but we can later add a “refresh translations” feature if needed.

#### 6. Testing and UX considerations

- **Test matrix**
  - Start from welcome screen in each language (Sinhala, English, Tamil), then enter chat and verify:
    - UI chrome (`headerTitle`, `emptyMessage`, placeholders) show in the selected language.
    - Bot replies appear translated only when language ≠ English.
    - Error states (translation failure, API down) still show English replies instead of breaking.
  - Confirm that when returning from chat to welcome and switching language, new replies honor the latest selection.
- **Performance and rate limiting**
  - Optionally debounce or batch translation calls if you expect very long replies or a high message rate.
  - Add minimal logging around translation calls to help debug latency or quota issues in production.

### High-level flow diagram

```mermaid
flowchart TD
  user[User selects language on welcome] --> langCtx[LanguageContext stores language]
  user --> sendMsg[User sends message]
  sendMsg --> chatAPI[chatAPI.processMessage (English reply)]
  chatAPI --> handleResp[chat.tsx handleSendMessage]
  handleResp --> checkLang{language === 'en'?}
  checkLang -->|Yes| useOriginal[Use English responseText]
  checkLang -->|No (si/ta)| translate[translateText(responseText, language)]
  translate --> displayText[Translated or fallback text]
  useOriginal --> displayText
  displayText --> updateState[Append bot message to messages]
  updateState --> ui[Chat UI renders localized reply]
```