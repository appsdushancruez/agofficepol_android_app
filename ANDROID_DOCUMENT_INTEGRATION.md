# Android Document Integration Guide

## API Response Structure

When a menu item has associated documents, the API response includes them in the `menuItems` array. Each menu item can have a `documents` array.

### Example Response with Documents

```json
{
  "success": true,
  "response": "Downloading...",
  "menuItems": [
    {
      "id": "menu-item-uuid",
      "title": "Download application",
      "option_number": 1,
      "response_text": "Downloading...",
      "is_main_menu": false,
      "parent_id": "parent-uuid",
      "created_at": "2025-12-03T11:30:48.942Z",
      "documents": [
        {
          "id": "doc-uuid",
          "title": "Application Form",
          "file_name": "application_form.pdf",
          "file_path": "https://your-supabase-url/storage/v1/object/public/documents/file.pdf",
          "file_size": 123456,
          "mime_type": "application/pdf"
        }
      ]
    }
  ],
  "parentMenuId": null,
  "menuContext": {
    "currentParentId": null,
    "currentParentTitle": null,
    "hierarchyLevel": 3,
    "path": ["1. Documents", "2. Passport Application", "1. new", "1. Download application"]
  },
  "timestamp": "2025-12-03T11:30:48.942Z"
}
```

## Document Object Structure

Each document in the `documents` array contains:

- `id` (string): Unique document identifier
- `title` (string): Display name for the document
- `file_name` (string): Original filename
- `file_path` (string): Public URL to download the file
- `file_size` (number): File size in bytes
- `mime_type` (string): MIME type (e.g., "application/pdf", "image/png")

## Android Implementation Guide

### 1. Check for Documents

After receiving the API response, check if any menu item has documents:

```typescript
// In your message processing code
const response = await chatAPI.processMessage(message);

// Check for documents in menuItems
const documents: Document[] = [];
if (response.menuItems && response.menuItems.length > 0) {
  response.menuItems.forEach((menuItem: any) => {
    if (menuItem.documents && menuItem.documents.length > 0) {
      documents.push(...menuItem.documents);
    }
  });
}
```

### 2. Display Documents in Chat

Create a component to display documents with download and share buttons:

```typescript
interface Document {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
}

function DocumentButtons({ documents }: { documents: Document[] }) {
  const handleDownload = async (document: Document) => {
    try {
      // Use expo-file-system or similar to download
      const fileUri = await FileSystem.downloadAsync(
        document.file_path,
        FileSystem.documentDirectory + document.file_name
      );
      
      // Show success message
      Alert.alert('Success', `Downloaded: ${document.title}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to download file');
    }
  };

  const handleShare = async (document: Document) => {
    try {
      await Share.share({
        message: `Check out this document: ${document.title}`,
        url: document.file_path,
        title: document.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share file');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <View style={{ marginTop: 8, gap: 8 }}>
      {documents.map((doc) => (
        <View
          key={doc.id}
          style={{
            backgroundColor: '#f0f0f0',
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ddd',
          }}
        >
          {/* Document Info */}
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {doc.title}
          </Text>
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
            {doc.file_name} • {formatFileSize(doc.file_size)}
          </Text>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => handleDownload(doc)}
              style={{
                flex: 1,
                backgroundColor: '#007AFF',
                padding: 10,
                borderRadius: 6,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Download
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleShare(doc)}
              style={{
                flex: 1,
                backgroundColor: '#34C759',
                padding: 10,
                borderRadius: 6,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}
```

### 3. Update Chat Message Component

Modify your chat message rendering to include documents:

```typescript
// In your ChatMessage component
const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  // Extract documents from menuItems
  const documents: Document[] = [];
  if (message.menuItems && message.menuItems.length > 0) {
    message.menuItems.forEach((menuItem: any) => {
      if (menuItem.documents && menuItem.documents.length > 0) {
        documents.push(...menuItem.documents);
      }
    });
  }

  return (
    <View style={styles.messageContainer}>
      <Text>{message.text}</Text>
      
      {/* Display menu buttons */}
      {message.menuItems && message.menuItems.length > 0 && (
        <MenuButtons items={message.menuItems} onSelect={handleMenuSelection} />
      )}
      
      {/* Display document buttons */}
      {documents.length > 0 && <DocumentButtons documents={documents} />}
    </View>
  );
};
```

### 4. Prevent Duplicate Downloads

Track downloaded documents to prevent showing duplicate buttons:

```typescript
const [downloadedDocs, setDownloadedDocs] = useState<Set<string>>(new Set());

const handleDownload = async (document: Document) => {
  // Check if already downloaded
  if (downloadedDocs.has(document.id)) {
    Alert.alert('Info', 'Document already downloaded');
    return;
  }

  try {
    // Download logic...
    setDownloadedDocs(new Set([...downloadedDocs, document.id]));
  } catch (error) {
    // Error handling...
  }
};
```

### 5. Required Expo Packages

Install these packages for file handling:

```bash
npx expo install expo-file-system expo-sharing
```

### 6. File Download Implementation

```typescript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const handleDownload = async (document: Document) => {
  try {
    const fileUri = FileSystem.documentDirectory + document.file_name;
    
    const downloadResumable = FileSystem.createDownloadResumable(
      document.file_path,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        console.log(`Download progress: ${(progress * 100).toFixed(0)}%`);
      }
    );

    const result = await downloadResumable.downloadAsync();
    
    if (result) {
      Alert.alert('Success', `Downloaded: ${document.title}`);
      
      // Optionally open the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri);
      }
    }
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Error', 'Failed to download file');
  }
};
```

## Important Notes

1. **Always check for documents**: Even if `menuItems` exists, check if individual items have `documents` array
2. **File paths are public URLs**: The `file_path` is a direct URL to the file in Supabase storage
3. **Handle errors gracefully**: Network errors, file system errors, etc.
4. **Show file names**: Display both `title` and `file_name` for clarity
5. **Prevent duplicate actions**: Track downloaded/shared documents to avoid duplicates
6. **File size formatting**: Format bytes to KB/MB for better UX

## Testing Checklist

- [ ] Documents appear when menu item has associated documents
- [ ] File names are displayed correctly
- [ ] Download button works and downloads file
- [ ] Share button works and shares file URL
- [ ] File size is displayed in readable format
- [ ] No duplicate download buttons appear
- [ ] Error handling works for failed downloads
- [ ] Documents don't appear when menu item has no documents
- [ ] Multiple documents display correctly

