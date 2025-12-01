# Android App Fix: Sub-Menu Navigation Context Tracking

## Problem Description

The Android app currently shows the main menu every time a user selects a menu option, instead of navigating through sub-menus correctly. This happens because the app is not sending context information (`parentMenuId` or `previousMenuItems`) to the backend API.

**Current Behavior (WRONG):**
1. User: "hi" → Shows main menu ✅
2. User: "1" → Shows Documents sub-menu ✅
3. User: "1" again → Shows main menu again ❌ (Should show Passport sub-menu)

**Expected Behavior (CORRECT):**
1. User: "hi" → Shows main menu ✅
2. User: "1" → Shows Documents sub-menu ✅
3. User: "1" again → Shows Passport sub-menu ✅

## Root Cause

The backend API requires context to know which menu level the user is currently in. Without this context, it defaults to the main menu level.

## Solution: Implement Context Tracking

The Android app needs to:
1. **Track `parentMenuId`** from each API response
2. **Send `parentMenuId`** in subsequent API requests
3. **Track `previousMenuItems`** to help with context inference
4. **Reset context** when user sends a greeting ("hi", "hello", etc.)

## API Endpoint Details

### Current API Support

The backend supports **both GET and POST** requests:

**GET Request Format:**
```
GET /api/chat/process?message=1&parentMenuId=<uuid>&previousMenuItems=<json-string>
```

**POST Request Format:**
```json
POST /api/chat/process
{
  "message": "1",
  "parentMenuId": "<uuid>",
  "previousMenuItems": [...]
}
```

### API Response Format

```json
{
  "success": true,
  "response": "You selected Documents...\n\n1. Passport Application\n2. Visa Application\n...",
  "menuItems": [
    {
      "id": "83823ae0-a05b-4c01-a231-74843d597c52",
      "title": "Passport Application",
      "option_number": 1,
      "parent_id": "83823ae0-a05b-4c01-a231-74843d597c52",
      "response_text": "...",
      "is_main_menu": false
    }
  ],
  "parentMenuId": "83823ae0-a05b-4c01-a231-74843d597c52",
  "menuContext": {
    "currentParentId": "83823ae0-a05b-4c01-a231-74843d597c52",
    "currentParentTitle": "Documents",
    "hierarchyLevel": 1,
    "path": ["1. Documents"]
  },
  "timestamp": "2025-12-01T04:17:32.820Z"
}
```

**Key Fields:**
- `parentMenuId`: The ID of the current menu level (null for main menu)
- `menuItems`: Array of menu items shown to the user (null if no sub-menu)
- `menuContext`: Additional context information

## Implementation Guide

### Step 1: Add State Management for Context

Create a context state to track the current menu level:

```typescript
// In your chat component or context
const [currentParentId, setCurrentParentId] = useState<string | null>(null);
const [previousMenuItems, setPreviousMenuItems] = useState<any[] | null>(null);
```

### Step 2: Update API Call Function

Modify your API call function to include context:

**If using GET requests:**
```typescript
const processMessage = async (message: string) => {
  const params = new URLSearchParams({
    message: message,
  });
  
  // Add parentMenuId if available
  if (currentParentId) {
    params.append('parentMenuId', currentParentId);
  }
  
  // Add previousMenuItems if available (as JSON string)
  if (previousMenuItems && previousMenuItems.length > 0) {
    params.append('previousMenuItems', JSON.stringify(previousMenuItems));
  }
  
  const response = await fetch(`${API_BASE_URL}/api/chat/process?${params.toString()}`);
  const data = await response.json();
  
  return data;
};
```

**If using POST requests:**
```typescript
const processMessage = async (message: string) => {
  const body: any = {
    message: message,
  };
  
  // Add parentMenuId if available
  if (currentParentId) {
    body.parentMenuId = currentParentId;
  }
  
  // Add previousMenuItems if available
  if (previousMenuItems && previousMenuItems.length > 0) {
    body.previousMenuItems = previousMenuItems;
  }
  
  const response = await fetch(`${API_BASE_URL}/api/chat/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  const data = await response.json();
  return data;
};
```

### Step 3: Update Response Handler

After receiving the API response, update the context:

```typescript
const handleSendMessage = async (message: string) => {
  // Check if it's a greeting - reset context
  const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)[\s!]*$/i.test(
    message.trim()
  );
  
  if (isGreeting) {
    // Reset context for greetings
    setCurrentParentId(null);
    setPreviousMenuItems(null);
  }
  
  try {
    const response = await processMessage(message);
    
    if (response.success) {
      // Update context from response
      setCurrentParentId(response.parentMenuId || null);
      
      // Update previousMenuItems if menuItems are returned
      if (response.menuItems && Array.isArray(response.menuItems)) {
        setPreviousMenuItems(response.menuItems);
      } else {
        // If no menuItems, keep previous ones for context inference
        // (Don't clear them immediately)
      }
      
      // Display the response in chat
      addBotMessage(response.response, response.menuItems);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    // Handle error
  }
};
```

### Step 4: Handle Menu Item Selection

When user taps a menu button, send the option number with current context:

```typescript
const handleMenuSelection = (optionNumber: number) => {
  // Send the option number as a message
  handleSendMessage(optionNumber.toString());
};
```

### Step 5: Complete Example Component

Here's a complete example of a chat component with context tracking:

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [previousMenuItems, setPreviousMenuItems] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'https://agofficepol.vercel.app'; // Replace with your URL

  const processMessage = async (message: string) => {
    const params = new URLSearchParams({
      message: message,
    });
    
    if (currentParentId) {
      params.append('parentMenuId', currentParentId);
    }
    
    if (previousMenuItems && previousMenuItems.length > 0) {
      params.append('previousMenuItems', JSON.stringify(previousMenuItems));
    }
    
    const response = await fetch(`${API_BASE_URL}/api/chat/process?${params.toString()}`);
    const data = await response.json();
    return data;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // Add user message to chat
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    }]);

    // Check if it's a greeting - reset context
    const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)[\s!]*$/i.test(
      userMessage
    );
    
    if (isGreeting) {
      setCurrentParentId(null);
      setPreviousMenuItems(null);
    }

    setLoading(true);

    try {
      const response = await processMessage(userMessage);
      
      if (response.success) {
        // Update context from response
        setCurrentParentId(response.parentMenuId || null);
        
        // Update previousMenuItems if menuItems are returned
        if (response.menuItems && Array.isArray(response.menuItems)) {
          setPreviousMenuItems(response.menuItems);
        }
        
        // Add bot message to chat
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: response.response,
          isUser: false,
          menuItems: response.menuItems || [],
          timestamp: new Date(),
        }]);
      } else {
        // Handle error
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Network error. Please check your connection.',
        isUser: false,
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSelection = (optionNumber: number) => {
    handleSendMessage(optionNumber.toString());
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {messages.map((msg) => (
          <View key={msg.id} style={{
            alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
            backgroundColor: msg.isUser ? '#007AFF' : '#E5E5EA',
            padding: 12,
            borderRadius: 16,
            marginBottom: 8,
            maxWidth: '80%',
          }}>
            <Text>{msg.text}</Text>
            
            {/* Display menu items as buttons */}
            {msg.menuItems && msg.menuItems.length > 0 && (
              <View style={{ marginTop: 8 }}>
                {msg.menuItems.map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleMenuSelection(item.option_number)}
                    style={{
                      backgroundColor: '#007AFF',
                      padding: 10,
                      borderRadius: 8,
                      marginTop: 4,
                    }}
                  >
                    <Text style={{ color: 'white' }}>
                      {item.option_number}. {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={{ flexDirection: 'row', padding: 16, borderTopWidth: 1 }}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          style={{ flex: 1, borderWidth: 1, padding: 8, borderRadius: 8 }}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={loading}
          style={{ marginLeft: 8, padding: 8 }}
        >
          <Text>{loading ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
```

## Testing Checklist

After implementing the fix, test these scenarios:

1. ✅ **Greeting Flow**
   - Send "hi" → Should show main menu
   - Context should be reset (parentMenuId = null)

2. ✅ **Main Menu Selection**
   - Send "1" → Should show Documents sub-menu
   - Response should include menuItems array
   - parentMenuId should be set to Documents ID

3. ✅ **Sub-Menu Selection**
   - After selecting "1" (Documents), send "1" again
   - Should show Passport sub-menu (not main menu)
   - parentMenuId should be sent in the request

4. ✅ **Deep Navigation**
   - Navigate through 3+ levels of menus
   - Each level should work correctly
   - Context should be maintained throughout

5. ✅ **Context Reset**
   - Navigate to a sub-menu
   - Send "hi" → Should reset to main menu
   - Context should be cleared

## Important Notes

1. **Context Persistence**: The `currentParentId` and `previousMenuItems` should persist across message sends until:
   - User sends a greeting (resets to main menu)
   - User navigates to a leaf node (no sub-menu items)

2. **Error Handling**: If the API returns an error, don't update the context. Keep the previous context for retry.

3. **Menu Items Display**: Always display `menuItems` from the response as clickable buttons, even if the response text also contains the menu.

4. **GET vs POST**: The backend supports both. Use GET if you prefer query parameters, POST if you prefer request body. Both work the same way.

## Debugging Tips

If sub-menu navigation still doesn't work:

1. **Check API Request**: Log the full URL/body being sent to verify `parentMenuId` is included
2. **Check API Response**: Log the response to verify `parentMenuId` is being returned
3. **Check State**: Log `currentParentId` and `previousMenuItems` before each API call
4. **Test with Postman**: Test the API directly with `parentMenuId` to verify backend works

## Example API Request/Response Flow

**Request 1:**
```
GET /api/chat/process?message=hi
```
**Response 1:**
```json
{
  "parentMenuId": null,
  "menuItems": [/* main menu items */]
}
```

**Request 2:**
```
GET /api/chat/process?message=1&parentMenuId=null&previousMenuItems=[...]
```
**Response 2:**
```json
{
  "parentMenuId": "83823ae0-a05b-4c01-a231-74843d597c52",
  "menuItems": [/* Documents sub-menu items */]
}
```

**Request 3:**
```
GET /api/chat/process?message=1&parentMenuId=83823ae0-a05b-4c01-a231-74843d597c52&previousMenuItems=[...]
```
**Response 3:**
```json
{
  "parentMenuId": "passport-item-id",
  "menuItems": [/* Passport sub-menu items if any */]
}
```

## Summary

The fix requires:
1. ✅ Track `parentMenuId` from API responses
2. ✅ Send `parentMenuId` in subsequent requests
3. ✅ Track `previousMenuItems` for context inference
4. ✅ Reset context on greetings
5. ✅ Update context after each successful API response

Once implemented, the app will correctly navigate through all menu levels!

