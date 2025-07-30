import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface DifficultySelectorProps {
  value: DifficultyLevel;
  onChange: (difficulty: DifficultyLevel) => void;
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy', icon: 'leaf' },
  { value: 'medium', label: 'Medium', icon: 'star' },
  { value: 'hard', label: 'Hard', icon: 'flame' },
] as const;

export default function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.buttonContainer}>
        {difficultyOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.button,
              value === option.value && styles.buttonActive,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Ionicons 
              name={option.icon as any} 
              size={16} 
              color={value === option.value ? colors.surface : colors.primary} 
            />
            <Text style={[
              styles.buttonText,
              value === option.value && styles.buttonTextActive,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  buttonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  buttonTextActive: {
    color: colors.surface,
  },
}); 