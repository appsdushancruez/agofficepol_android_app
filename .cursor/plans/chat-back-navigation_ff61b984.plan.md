---
name: chat-back-navigation
overview: Add a visible back navigation from the chat interface to the welcome screen in an Expo Router app, using a header back button while keeping current history behavior (using replace).
todos:
  - id: identify-chat-file
    content: Locate and inspect the chat screen component file to understand its current structure and layout (likely app/chat.tsx or app/chat/index.tsx).
    status: completed
  - id: add-back-handler
    content: In the chat screen, add a back navigation handler that calls router.replace('/welcome') to go back to the main welcome page.
    status: completed
    dependencies:
      - identify-chat-file
  - id: insert-header-ui
    content: Add a custom header component at the top of the chat screen JSX with a touchable back arrow and a title, wired to the back handler.
    status: completed
    dependencies:
      - add-back-handler
  - id: style-header
    content: Define or update styles on the chat screen to ensure the new header matches the app’s visual style and works well with the existing chat layout.
    status: completed
    dependencies:
      - insert-header-ui
---

# Add back navigation from chat screen to welcome page

### Overview

We will add a visible back navigation control on the chat screen so users can easily return to the main welcome page. This will be implemented as a custom header area (since `headerShown` is currently false for `chat`) with a back arrow that navigates to the welcome screen using the same replace-style behavior you already use from welcome -> chat.

### Current structure

- **Navigation setup**: `RootLayout` in [`app/_layout.tsx`](app/_layout.tsx) defines a `Stack` with `index`, `loading`, `welcome`, and `chat` screens, all currently with `headerShown: false`.
- **Main page**: `WelcomeScreen` in [`app/welcome.tsx`](app/welcome.tsx) uses `router.replace('/chat')` in `handleChatPress`, so navigating to chat replaces the current route instead of pushing.
- **Chat page**: There is a `chat` route (`<Stack.Screen name="chat" ... />`), presumably implemented in a file like [`app/chat.tsx`](app/chat.tsx) or [`app/chat/index.tsx`](app/chat/index.tsx) where we will integrate the back UI.

### Plan

- **1. Confirm chat screen file and imports**
- Locate the chat screen component file (e.g., [`app/chat.tsx`](app/chat.tsx) or [`app/chat/index.tsx`](app/chat/index.tsx)).
- Ensure it imports `useRouter` from `expo-router` (or add it if missing) so we can navigate back to the welcome screen.

- **2. Define navigation behavior from chat to welcome**
- Implement a handler in the chat screen, e.g., `handleBackPress`, that calls `router.replace('/welcome')`.
- This keeps navigation behavior consistent with your existing `handleChatPress` in `welcome.tsx` (replace instead of push) and matches your preference to not change history semantics.

- **3. Add a custom header with a back arrow on the chat screen**
- Since `headerShown` is `false` for `chat` in [`app/_layout.tsx`](app/_layout.tsx), keep the native header hidden and build a custom header component at the top of the chat layout.
- The header will visually match your app style (rounded top area, soft colors) and include:
- **Left**: a touchable back arrow icon or text (e.g., `←`) wired to `handleBackPress`.
- **Center**: a short title like `t.chat.title` (if translations exist) or a simple `Text` label (e.g., "Chat with Bot").
- Ensure the header is placed above the messages list and does not interfere with your chat input.

- **4. Wire styling to match existing design**
- Reuse colors and typography from `welcome.tsx` (e.g., `#11486b` for primary accents, similar font weights) to keep visual consistency.
- Add styles for the new header container, back button touch area, and title text in the chat screen's `StyleSheet`.

- **5. Optional: respect platform back gestures**
- Optionally, we can later switch from `router.replace('/chat')` to `router.push('/chat')` and use `router.back()` in `handleBackPress` so both the on-screen back arrow and Android hardware back automatically return to `welcome`. For now, per your choice, we will keep the `replace` semantics and only add the visual back control.

### Implementation todos

- **identify-chat-file**: Find the chat screen component file and its layout to know where to insert the header.
- **add-back-handler**: Add a `handleBackPress` function in the chat screen that uses `router.replace('/welcome')`.
- **insert-header-ui**: Insert a new top header in the chat screen JSX with a touchable back arrow and title.
- **style-header**: Add or adjust styles in the chat screen to ensure the header matches the existing welcome page design and does not break the chat layout.