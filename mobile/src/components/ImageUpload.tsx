import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, borderRadius } from '../theme';
import { usePopup } from '../hooks/usePopup';
import CustomPopup from './CustomPopup';

interface ImageUploadProps {
  imageUri?: string;
  onImageChange: (uri: string | null) => void;
  label?: string;
}

export default function ImageUpload({ imageUri, onImageChange, label = 'Recipe Image' }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showConfirmation, showWarning, popupConfig, isVisible, hidePopup } = usePopup();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showError('Permission Required', 'Sorry, we need camera roll permissions to upload images.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      showError('Error', 'Failed to pick image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showError('Permission Required', 'Sorry, we need camera permissions to take photos.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      showError('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    showConfirmation(
      'Remove Image',
      'Are you sure you want to remove this image?',
      () => onImageChange(null),
      () => {}
    );
  };

  const showImageOptions = () => {
    showConfirmation(
      'Add Recipe Image',
      'Choose how you want to add an image',
      () => takePhoto(),
      () => pickImage()
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <Ionicons name="close-circle" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={showImageOptions}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="hourglass" size={24} color={colors.textSecondary} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="camera" size={32} color={colors.primary} />
              <Text style={styles.uploadText}>Add Recipe Image</Text>
              <Text style={styles.uploadSubtext}>Tap to upload or take a photo</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Custom Popup */}
      {popupConfig && (
        <CustomPopup
          visible={isVisible}
          title={popupConfig.title}
          message={popupConfig.message}
          type={popupConfig.type}
          confirmText={popupConfig.confirmText}
          cancelText={popupConfig.cancelText}
          showCancel={popupConfig.showCancel}
          onConfirm={popupConfig.onConfirm}
          onCancel={popupConfig.onCancel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  uploadText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  uploadSubtext: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xs,
  },
}); 