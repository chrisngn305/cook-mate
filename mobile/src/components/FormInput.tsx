import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

interface FormInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  right?: React.ReactNode;
}

export default function FormInput({ label, required = false, style, right, ...props }: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.inputPlaceholder}
          {...props}
        />
        {right && (
          <View style={styles.rightContainer}>
            {right}
          </View>
        )}
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
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 16,
    lineHeight: 20,
    minHeight: 48,
    textAlignVertical: 'center',
  },
  rightContainer: {
    paddingHorizontal: spacing.md,
  },
}); 