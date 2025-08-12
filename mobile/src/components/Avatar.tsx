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

  const handleImageError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    console.log('Avatar image failed to load:', error.nativeEvent.error);
    setImageError(true);
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

  // Show fallback icon if no source or image failed to load
  if (!source || imageError) {
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
        onLoad={() => setImageError(false)}
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