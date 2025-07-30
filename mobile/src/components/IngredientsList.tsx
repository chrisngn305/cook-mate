import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Ingredient } from '../types/recipe';
import FormInput from './FormInput';

interface IngredientsListProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export default function IngredientsList({ ingredients, onIngredientsChange }: IngredientsListProps) {
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '', unit: '' });

  const addIngredient = () => {
    if (newIngredient.name.trim() && newIngredient.quantity.trim()) {
      const ingredient: Ingredient = {
        id: Date.now().toString(),
        name: newIngredient.name.trim(),
        quantity: parseFloat(newIngredient.quantity),
        unit: newIngredient.unit.trim() || 'units',
      };
      onIngredientsChange([...ingredients, ingredient]);
      setNewIngredient({ name: '', quantity: '', unit: '' });
    }
  };

  const removeIngredient = (id: string) => {
    onIngredientsChange(ingredients.filter(ing => ing.id !== id));
  };

  const renderIngredientItem = (ingredient: Ingredient) => (
    <View key={ingredient.id} style={styles.ingredientItem}>
      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName}>{ingredient.name}</Text>
        <Text style={styles.ingredientQuantity}>
          {ingredient.quantity} {ingredient.unit}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => removeIngredient(ingredient.id)}
        style={styles.removeButton}
      >
        <Ionicons name="close-circle" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ingredients *</Text>
      
      {ingredients.map(renderIngredientItem)}

      <View style={styles.addItemContainer}>
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 2 }]}>
            <FormInput
              label=""
              value={newIngredient.name}
              onChangeText={(text) => setNewIngredient({ ...newIngredient, name: text })}
              placeholder="Ingredient name"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <FormInput
              label=""
              value={newIngredient.quantity}
              onChangeText={(text) => setNewIngredient({ ...newIngredient, quantity: text })}
              placeholder="Qty"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <FormInput
              label=""
              value={newIngredient.unit}
              onChangeText={(text) => setNewIngredient({ ...newIngredient, unit: text })}
              placeholder="Unit"
            />
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
          <Ionicons name="add" size={20} color={colors.surface} />
          <Text style={styles.addButtonText}>Add Ingredient</Text>
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
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  ingredientQuantity: {
    ...typography.bodySmall,
    color: colors.textSecondary,
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputGroup: {
    marginBottom: 0,
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