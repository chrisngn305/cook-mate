import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { RecipeStep } from '../types/recipe';
import FormInput from './FormInput';

interface StepsListProps {
  steps: RecipeStep[];
  onStepsChange: (steps: RecipeStep[]) => void;
}

export default function StepsList({ steps, onStepsChange }: StepsListProps) {
  const [newStep, setNewStep] = useState('');

  const addStep = () => {
    if (newStep.trim()) {
      const step: RecipeStep = {
        id: Date.now().toString(),
        order: steps.length + 1,
        description: newStep.trim(),
      };
      onStepsChange([...steps, step]);
      setNewStep('');
    }
  };

  const removeStep = (id: string) => {
    const updatedSteps = steps.filter(step => step.id !== id);
    // Reorder remaining steps
    const reorderedSteps = updatedSteps.map((step, index) => ({ 
      ...step, 
      order: index + 1 
    }));
    onStepsChange(reorderedSteps);
  };

  const renderStepItem = (step: RecipeStep) => (
    <View key={step.id} style={styles.stepItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{step.order}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepDescription}>{step.description}</Text>
      </View>
      <TouchableOpacity
        onPress={() => removeStep(step.id)}
        style={styles.removeButton}
      >
        <Ionicons name="close-circle" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Instructions *</Text>
      
      {steps.map(renderStepItem)}

      <View style={styles.addItemContainer}>
        <FormInput
          label=""
          value={newStep}
          onChangeText={setNewStep}
          placeholder="Enter step description..."
          multiline
          numberOfLines={2}
          style={styles.textArea}
        />
        <TouchableOpacity style={styles.addButton} onPress={addStep}>
          <Ionicons name="add" size={20} color={colors.surface} />
          <Text style={styles.addButtonText}>Add Step</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepDescription: {
    ...typography.body,
    color: colors.text,
  },
  removeButton: {
    padding: spacing.xs,
  },
  addItemContainer: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  addButtonText: {
    ...typography.bodySmall,
    color: colors.surface,
    fontWeight: '600',
  },
}); 