import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  onSave?: () => void;
  showSave?: boolean;
}

export default function ScreenHeader({ title, onBack, onSave, showSave = false }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {showSave && (
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Ionicons name="checkmark" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  saveButton: {
    padding: spacing.sm,
  },
}); 