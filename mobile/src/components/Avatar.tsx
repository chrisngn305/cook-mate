import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageErrorEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';

interface AvatarProps {
  source?: string | null;
  size?: number;
  fallbackIcon?: string;
  fallbackColor?: string;
  style?: any;
}

export default function Avatar({
  source,
  size = 80,
  fallbackIcon = 'person',
  fallbackColor = colors.primary,
  style,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    console.log('Avatar image failed to load:', error.nativeEvent.error);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
    setImageError(false);
  };

  const handleImageLoadEnd = () => {
    setImageLoading(false);
  };

  const avatarStyles = [
    styles.avatar,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    style,
  ];

  const imageStyles = [
    styles.avatarImage,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
  ];

  // Show fallback icon if no source, image failed to load, or while loading
  if (!source || imageError || imageLoading) {
    return (
      <View style={avatarStyles}>
        <Ionicons 
          name={fallbackIcon as any} 
          size={size * 0.5} 
          color={fallbackColor} 
        />
      </View>
    );
  }

  return (
    <View style={avatarStyles}>
      <Image
        source={{ uri: source }}
        style={imageStyles}
        onError={handleImageError}
        onLoadStart={handleImageLoadStart}
        onLoadEnd={handleImageLoadEnd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
}); 