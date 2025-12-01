# Android App Development Requirements - Chatbot Application

## Project Overview

Build an Android mobile application using **Expo** (`npx create-expo-app@latest`) that provides an in-app chat interface for users to interact with an AI chatbot. The app connects to a Next.js backend API and Supabase database for bot responses, menu navigation, and Q&A functionality.

## Technical Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript (recommended) or JavaScript
- **Backend API**: Next.js REST API endpoints
- **Database**: Supabase (direct connection for reads)
- **State Management**: React Context API or Zustand (recommended)
- **HTTP Client**: Axios or fetch API
- **UI Library**: React Native Paper, NativeBase, or custom components

## Backend API Endpoints

### Base URL Configuration
- **Development**: `http://localhost:3000` (use `http://10.0.2.2:3000` for Android emulator)
- **Production**: `https://your-domain.com` (replace with actual domain)

### 1. Process Chat Message
**Endpoint**: `POST /api/chat/process`

**Request**:
```json
{
  "message": "hi"
}
```

**Response**:
```json
{
  "success": true,
  "response": "Welcome! Please choose a service:\n\n1. Documents\n2. Check Status of Request\n3. Document Prices\n\nReply with the number of your choice.",
  "menuItems": [
    {
      "id": "uuid",
      "title": "Documents",
      "option_number": 1,
      "response_text": "You selected Documents. Please provide more details...",
      "is_main_menu": true,
      "parent_id": null,
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Failed to process message",
  "message": "Error details"
}
```

### 2. Get Main Menu
**Endpoint**: `GET /api/chat/menu`

**Response**:
```json
{
  "success": true,
  "menuItems": [
    {
      "id": "uuid",
      "title": "Documents",
      "option_number": 1,
      "response_text": "You selected Documents...",
      "is_main_menu": true,
      "parent_id": null,
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3. Health Check
**Endpoint**: `GET /api/chat/health`

**Response**:
```json
{
  "status": "ok",
  "service": "chatbot-api",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

## Supabase Direct Connection (Optional but Recommended)

### Configuration
- **Supabase URL**: Get from Next.js `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`)
- **Supabase Anon Key**: Get from Next.js `.env.local` (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)

### Tables to Query

#### Menu Items
```sql
SELECT * FROM menu_items 
WHERE is_main_menu = true 
ORDER BY option_number ASC;
```

#### Q&A Pairs (for keyword search)
```sql
SELECT * FROM qa_pairs 
WHERE keyword ILIKE '%search_term%';
```

### Supabase Client Setup
Install: `npm install @supabase/supabase-js`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);
```

## Core Features to Implement

### 1. Chat Interface
- **Chat Screen**: Main screen with message list
- **Message Bubbles**: 
  - User messages: Right-aligned, different color
  - Bot messages: Left-aligned, different color
- **Input Field**: Text input at bottom with send button
- **Message History**: Scrollable list of all messages
- **Typing Indicator**: Show when waiting for bot response

### 2. Menu Display
- **Menu Buttons**: When bot sends main menu, display as clickable buttons
- **Menu Format**: Show numbered options (1, 2, 3, etc.)
- **Quick Selection**: Tapping a menu button sends the corresponding number
- **Visual Design**: Cards or buttons for each menu option

### 3. Message Processing
- **Send Message**: User types message → calls `/api/chat/process`
- **Display Response**: Show bot response in chat
- **Handle Errors**: Show error message if API call fails
- **Loading State**: Show loading indicator while processing

### 4. Conversation Flow
- **Greeting Detection**: When user sends "hi"/"hello", show menu buttons
- **Menu Selection**: When user sends "1"/"2"/"3", process and show response
- **Keyword Matching**: Handle any text input and search for matches
- **Default Response**: Show fallback message if no match found

### 5. Offline Support (Optional)
- **Cache Messages**: Store recent messages locally
- **Offline Indicator**: Show when app is offline
- **Queue Messages**: Queue messages when offline, send when online

## UI/UX Requirements

### Design Principles
- **Clean & Modern**: Simple, intuitive interface
- **Responsive**: Works on different screen sizes
- **Accessible**: Follow Android accessibility guidelines
- **Fast**: Smooth animations and quick response times

### Screen Layout

#### Chat Screen
```
┌─────────────────────────┐
│  [Header: Chat Bot]     │
├─────────────────────────┤
│                         │
│  [Bot Message]          │
│  [User Message]         │
│  [Menu Buttons]         │
│  [Bot Message]          │
│                         │
│  (Scrollable Area)      │
│                         │
├─────────────────────────┤
│ [Input Field] [Send]    │
└─────────────────────────┘
```

### Color Scheme
- **Primary Color**: Use brand color (suggest: #2563eb for blue)
- **User Messages**: Light blue or green background
- **Bot Messages**: Light gray or white background
- **Menu Buttons**: Primary color with white text
- **Background**: Light gray or white

### Typography
- **Message Text**: 14-16sp, readable font
- **Menu Titles**: 16-18sp, bold
- **Input Text**: 14-16sp

## Technical Implementation Details

### 1. Project Setup

```bash
# Create Expo app
npx create-expo-app@latest .
cd chatbot-mobile

# Install dependencies
npm install axios @supabase/supabase-js
npm install --save-dev @types/react @types/react-native

# For TypeScript (recommended)
npx expo install typescript @types/react @types/react-native
```

### 2. Project Structure

```
chatbot-mobile/
├── app/
│   ├── (tabs)/
│   │   └── index.tsx          # Chat screen
│   └── _layout.tsx
├── components/
│   ├── ChatMessage.tsx        # Message bubble component
│   ├── MenuButtons.tsx        # Menu option buttons
│   ├── MessageInput.tsx       # Input field component
│   └── TypingIndicator.tsx   # Loading indicator
├── services/
│   ├── api.ts                 # API client
│   ├── supabase.ts            # Supabase client
│   └── chatService.ts         # Chat logic
├── types/
│   └── index.ts               # TypeScript types
├── config/
│   └── constants.ts           # API URLs, config
└── app.json
```

### 3. TypeScript Types

```typescript
// types/index.ts
export interface MenuItem {
  id: string;
  title: string;
  option_number: number;
  response_text: string;
  is_main_menu: boolean;
  parent_id: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  menuItems?: MenuItem[];
}

export interface ChatResponse {
  success: boolean;
  response: string;
  menuItems?: MenuItem[];
  timestamp: string;
  error?: string;
}
```

### 4. API Service Implementation

```typescript
// services/api.ts
import axios from 'axios';
import { ChatResponse } from '../types';

const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000'  // Android emulator
  : 'https://your-domain.com';

export const chatAPI = {
  processMessage: async (message: string): Promise<ChatResponse> => {
    const response = await axios.post(`${API_BASE_URL}/api/chat/process`, {
      message,
    });
    return response.data;
  },

  getMenu: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/chat/menu`);
    return response.data;
  },

  healthCheck: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/chat/health`);
    return response.data;
  },
};
```

### 5. Chat Screen Component Structure

```typescript
// app/(tabs)/index.tsx
import { useState, useRef } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ChatMessage } from '../../components/ChatMessage';
import { MessageInput } from '../../components/MessageInput';
import { MenuButtons } from '../../components/MenuButtons';
import { chatAPI } from '../../services/api';
import { ChatMessage as ChatMessageType } from '../../types';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Get bot response
    setIsLoading(true);
    try {
      const response = await chatAPI.processMessage(text);
      const botMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        menuItems: response.menuItems,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <>
            <ChatMessage message={item} />
            {item.menuItems && <MenuButtons items={item.menuItems} onSelect={handleSendMessage} />}
          </>
        )}
        keyExtractor={(item) => item.id}
      />
      <MessageInput onSend={handleSendMessage} isLoading={isLoading} />
    </View>
  );
}
```

## Required Features Checklist

### Core Features
- [ ] Chat interface with message bubbles
- [ ] Send message functionality
- [ ] Receive and display bot responses
- [ ] Menu buttons display when menu is shown
- [ ] Menu button selection sends corresponding number
- [ ] Loading indicator while processing
- [ ] Error handling and display
- [ ] Scroll to bottom on new message

### UI/UX Features
- [ ] User messages (right-aligned, different color)
- [ ] Bot messages (left-aligned, different color)
- [ ] Menu buttons with numbers and titles
- [ ] Smooth scrolling
- [ ] Keyboard handling (dismiss on send)
- [ ] Input field at bottom (sticky)
- [ ] Typing indicator

### Technical Features
- [ ] API integration with error handling
- [ ] Network status checking
- [ ] Message state management
- [ ] TypeScript types (if using TS)
- [ ] Environment configuration (dev/prod URLs)

### Optional Features
- [ ] Supabase direct connection for menu items
- [ ] Real-time updates via Supabase subscriptions
- [ ] Message history persistence (local storage)
- [ ] Offline support
- [ ] Push notifications
- [ ] Dark mode support

## Testing Requirements

### Manual Testing
1. **Send greeting message** ("hi", "hello") → Should show menu
2. **Select menu option** (send "1", "2", or "3") → Should show corresponding response
3. **Send keyword** (e.g., "price", "document") → Should match Q&A and show response
4. **Send unknown message** → Should show default fallback message
5. **Test error handling** → Disconnect network, send message → Should show error

### API Testing
- Test all endpoints with Postman/curl before implementing
- Verify response formats match TypeScript types
- Test error scenarios (network failure, invalid responses)

## Environment Configuration

Create `config/constants.ts`:

```typescript
export const CONFIG = {
  API_BASE_URL: __DEV__
    ? 'http://10.0.2.2:3000'  // Android emulator localhost
    : 'https://your-production-domain.com',
  
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
};
```

## Development Workflow

1. **Setup Expo project** → `npx create-expo-app@latest`
2. **Install dependencies** → axios, supabase-js
3. **Create project structure** → Folders for components, services, types
4. **Implement API service** → Create API client functions
5. **Build chat UI** → Message bubbles, input field
6. **Integrate API calls** → Connect UI to backend
7. **Add menu buttons** → Display and handle menu selection
8. **Test end-to-end** → Test all conversation flows
9. **Polish UI/UX** → Styling, animations, error handling

## Integration Points with Backend

1. **Message Processing**: All user messages go through `/api/chat/process`
2. **Menu Display**: Menu items come from API response or Supabase query
3. **Q&A Matching**: Handled by backend, app just displays responses
4. **Real-time Updates**: Optional - use Supabase subscriptions for live menu/Q&A updates

## Success Criteria

The app is complete when:
- ✅ Users can send messages and receive bot responses
- ✅ Menu buttons appear and work correctly
- ✅ All conversation flows work (greeting, menu, keywords)
- ✅ Error handling works properly
- ✅ UI is clean and responsive
- ✅ App works on Android devices and emulator

## Additional Resources

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **Supabase JS Client**: https://supabase.com/docs/reference/javascript/introduction
- **Backend API Docs**: See `ANDROID_INTEGRATION.md` in Next.js project

## Notes

- Use Android emulator IP `10.0.2.2` instead of `localhost` for local development
- Test on real device for production API URLs
- Consider adding analytics for message patterns
- Implement proper error boundaries for production
- Add loading states for better UX

