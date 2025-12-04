import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Document } from '@/types';

interface DocumentButtonsProps {
  documents: Document[];
  downloadedDocs: Set<string>;
  onDownloadComplete: (documentId: string) => void;
}

export function DocumentButtons({
  documents,
  downloadedDocs,
  onDownloadComplete,
}: DocumentButtonsProps) {
  const [downloadingDocs, setDownloadingDocs] = useState<Set<string>>(new Set());
  const [sharingDocs, setSharingDocs] = useState<Set<string>>(new Set());
  // Store local file paths for downloaded documents
  const [localFilePaths, setLocalFilePaths] = useState<Map<string, string>>(new Map());
  // Track download progress percentage (0-100)
  const [downloadProgress, setDownloadProgress] = useState<Map<string, number>>(new Map());

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const saveToDownloads = async (fileUri: string, fileName: string, mimeType: string): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        // Request media library permissions
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Media library permission not granted');
          return false;
        }

        // For Android, try to save to Downloads using MediaLibrary
        // Note: MediaLibrary.createAssetAsync works for documents on Android 10+
        try {
          const asset = await MediaLibrary.createAssetAsync(fileUri);
          // Move to Downloads folder
          await MediaLibrary.createAlbumAsync('Download', asset, false);
          return true;
        } catch (error) {
          console.log('MediaLibrary save failed, trying alternative method:', error);
          // Fallback: Use sharing to save to Downloads
          // This will open a dialog where user can choose Downloads folder
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
              mimeType: mimeType,
              dialogTitle: `Save ${fileName} to Downloads`,
              UTI: mimeType,
            });
            return true;
          }
          return false;
        }
      } else {
        // iOS: Files are already accessible via Files app
        // Optionally use sharing to save to Downloads
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: mimeType,
            dialogTitle: `Save ${fileName}`,
          });
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error saving to Downloads:', error);
      return false;
    }
  };

  const handleDownload = async (document: Document) => {
    // Check if already downloaded
    if (downloadedDocs.has(document.id)) {
      Alert.alert('Info', 'Document already downloaded');
      return;
    }

    // Check if already downloading
    if (downloadingDocs.has(document.id)) {
      return;
    }

    try {
      // Mark as downloading and reset progress
      setDownloadingDocs(new Set([...downloadingDocs, document.id]));
      setDownloadProgress((prev) => new Map(prev).set(document.id, 0));

      const fileUri = FileSystem.documentDirectory + document.file_name;

      const downloadResumable = FileSystem.createDownloadResumable(
        document.file_path,
        fileUri,
        {},
        (downloadProgressData) => {
          const progress =
            downloadProgressData.totalBytesWritten /
            downloadProgressData.totalBytesExpectedToWrite;
          const progressPercent = Math.round(progress * 100);
          console.log(`Download progress: ${progressPercent}%`);
          // Update progress state
          setDownloadProgress((prev) => new Map(prev).set(document.id, progressPercent));
        }
      );

      const result = await downloadResumable.downloadAsync();

      if (result) {
        // Store local file path for sharing
        setLocalFilePaths((prev) => new Map(prev).set(document.id, result.uri));
        
        // Try to save to Downloads folder
        const savedToDownloads = await saveToDownloads(
          result.uri,
          document.file_name,
          document.mime_type
        );

        // Mark as downloaded
        onDownloadComplete(document.id);
        // Set progress to 100%
        setDownloadProgress((prev) => new Map(prev).set(document.id, 100));
        
        if (savedToDownloads) {
          Alert.alert('Success', `Downloaded: ${document.title}\nSaved to Downloads folder`);
        } else {
          Alert.alert('Success', `Downloaded: ${document.title}\nFile saved to app storage`);
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Provide specific error messages for permission issues
      if (errorMessage.includes('permission') || errorMessage.includes('Permission')) {
        Alert.alert(
          'Permission Required',
          'Please grant storage permission to save files to Downloads folder. You can enable it in app settings.',
          [
            { text: 'OK', style: 'default' },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to download file. Please try again.');
      }
      
      // Clear progress on error
      setDownloadProgress((prev) => {
        const newMap = new Map(prev);
        newMap.delete(document.id);
        return newMap;
      });
    } finally {
      // Remove from downloading set
      setDownloadingDocs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(document.id);
        return newSet;
      });
    }
  };

  const handleShare = async (document: Document) => {
    // Check if already sharing
    if (sharingDocs.has(document.id)) {
      return;
    }

    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      // Check if file is already downloaded
      let localFilePath = localFilePaths.get(document.id);

      // If not downloaded, download it first
      if (!localFilePath) {
        setSharingDocs((prev) => new Set([...prev, document.id]));

        // Download the file first
        const fileUri = FileSystem.documentDirectory + document.file_name;
        const downloadResumable = FileSystem.createDownloadResumable(
          document.file_path,
          fileUri
        );

        const result = await downloadResumable.downloadAsync();

        if (!result) {
          throw new Error('Download failed');
        }

        localFilePath = result.uri;
        setLocalFilePaths((prev) => new Map(prev).set(document.id, result.uri));
      }

      // Share the local file
      await Sharing.shareAsync(localFilePath, {
        mimeType: document.mime_type,
        dialogTitle: `Share ${document.title}`,
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share file. Please try again.');
    } finally {
      setSharingDocs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(document.id);
        return newSet;
      });
    }
  };

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {documents.map((doc) => {
        const isDownloaded = downloadedDocs.has(doc.id);
        const isDownloading = downloadingDocs.has(doc.id);
        const isSharing = sharingDocs.has(doc.id);
        const progress = downloadProgress.get(doc.id) || 0;

        return (
          <View key={doc.id} style={styles.documentCard}>
            {/* Document Info */}
            <Text style={styles.documentTitle}>{doc.title}</Text>
            <Text style={styles.documentInfo}>
              {doc.file_name} • {formatFileSize(doc.file_size)}
            </Text>

            {/* Progress Bar */}
            {isDownloading && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{progress}%</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleDownload(doc)}
                disabled={isDownloaded || isDownloading}
                style={[
                  styles.downloadButton,
                  (isDownloaded || isDownloading) && styles.buttonDisabled,
                ]}>
                {isDownloading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isDownloaded ? 'Downloaded' : 'Download'}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleShare(doc)}
                disabled={!isDownloaded || isSharing}
                style={[
                  styles.shareButton,
                  (!isDownloaded || isSharing) && styles.buttonDisabled,
                ]}>
                {isSharing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Share</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginHorizontal: 16,
    gap: 8,
  },
  documentCard: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  documentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#000000',
  },
  documentInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 8,
    gap: 4,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#11486b', // Dark teal - primary color
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#11486b', // Dark teal - primary color
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#478356', // Earthy green - secondary color
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  buttonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

