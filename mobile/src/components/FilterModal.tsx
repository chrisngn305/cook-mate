import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  advancedFilters: {
    difficulty: string;
    maxCookingTime: string;
    cuisine: string;
    dietaryRestrictions: string[];
    tags: string[];
    ingredients: string[];
  };
  onFiltersChange: (filters: any) => void;
  fridgeIngredients: any[];
}

export default function FilterModal({
  visible,
  onClose,
  advancedFilters,
  onFiltersChange,
  fridgeIngredients,
}: FilterModalProps) {
  const [newIngredient, setNewIngredient] = useState('');

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...advancedFilters,
      [key]: value,
    });
  };

  const addIngredient = () => {
    if (newIngredient.trim() && !advancedFilters.ingredients.includes(newIngredient.trim().toLowerCase())) {
      handleFilterChange('ingredients', [...advancedFilters.ingredients, newIngredient.trim().toLowerCase()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    const newIngredients = advancedFilters.ingredients.filter((_, i) => i !== index);
    handleFilterChange('ingredients', newIngredients);
  };

  const clearIngredients = () => {
    handleFilterChange('ingredients', []);
  };

  const addIngredientFromFridge = (ingredientName: string) => {
    if (!advancedFilters.ingredients.includes(ingredientName.toLowerCase())) {
      handleFilterChange('ingredients', [...advancedFilters.ingredients, ingredientName.toLowerCase()]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Advanced Filters</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Difficulty Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Difficulty</Text>
            <View style={styles.filterOptions}>
              {['easy', 'medium', 'hard'].map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.filterOption,
                    advancedFilters.difficulty === difficulty && styles.filterOptionSelected
                  ]}
                  onPress={() => handleFilterChange('difficulty', 
                    advancedFilters.difficulty === difficulty ? '' : difficulty
                  )}
                >
                  <Text style={[
                    styles.filterOptionText,
                    advancedFilters.difficulty === difficulty && styles.filterOptionTextSelected
                  ]}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cooking Time Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Maximum Cooking Time</Text>
            <View style={styles.filterOptions}>
              {['15', '30', '45', '60', '90'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.filterOption,
                    advancedFilters.maxCookingTime === time && styles.filterOptionSelected
                  ]}
                  onPress={() => handleFilterChange('maxCookingTime', 
                    advancedFilters.maxCookingTime === time ? '' : time
                  )}
                >
                  <Text style={[
                    styles.filterOptionText,
                    advancedFilters.maxCookingTime === time && styles.filterOptionTextSelected
                  ]}>
                    {time} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cuisine Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Cuisine</Text>
            <View style={styles.filterOptions}>
              {['Italian', 'Mexican', 'Asian', 'Mediterranean', 'American'].map((cuisine) => (
                <TouchableOpacity
                  key={cuisine}
                  style={[
                    styles.filterOption,
                    advancedFilters.cuisine === cuisine && styles.filterOptionSelected
                  ]}
                  onPress={() => handleFilterChange('cuisine', 
                    advancedFilters.cuisine === cuisine ? '' : cuisine
                  )}
                >
                  <Text style={[
                    styles.filterOptionText,
                    advancedFilters.cuisine === cuisine && styles.filterOptionTextSelected
                  ]}>
                    {cuisine}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Dietary Restrictions */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Dietary Restrictions</Text>
            <View style={styles.filterOptions}>
              {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map((restriction) => (
                <TouchableOpacity
                  key={restriction}
                  style={[
                    styles.filterOption,
                    advancedFilters.dietaryRestrictions.includes(restriction) && styles.filterOptionSelected
                  ]}
                  onPress={() => {
                    const newRestrictions = advancedFilters.dietaryRestrictions.includes(restriction)
                      ? advancedFilters.dietaryRestrictions.filter(r => r !== restriction)
                      : [...advancedFilters.dietaryRestrictions, restriction];
                    handleFilterChange('dietaryRestrictions', newRestrictions);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    advancedFilters.dietaryRestrictions.includes(restriction) && styles.filterOptionTextSelected
                  ]}>
                    {restriction}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ingredients Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Ingredients</Text>
            <Text style={styles.filterSectionSubtitle}>
              Select ingredients to find recipes that use them
            </Text>
            
            {/* Add Ingredient Input */}
            <View style={styles.addIngredientContainer}>
              <TextInput
                style={styles.addIngredientInput}
                placeholder="Type ingredient name..."
                placeholderTextColor={colors.inputPlaceholder}
                value={newIngredient}
                onChangeText={setNewIngredient}
                onSubmitEditing={addIngredient}
              />
              <TouchableOpacity 
                style={styles.addIngredientButton}
                onPress={addIngredient}
              >
                <Ionicons name="add" size={20} color={colors.surface} />
              </TouchableOpacity>
            </View>

            {/* Selected Ingredients */}
            {advancedFilters.ingredients.length > 0 && (
              <View style={styles.selectedIngredientsContainer}>
                <Text style={styles.selectedIngredientsTitle}>Selected ingredients:</Text>
                <View style={styles.selectedIngredientsList}>
                  {advancedFilters.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientChip}>
                      <Text style={styles.ingredientChipText}>{ingredient}</Text>
                      <TouchableOpacity 
                        style={styles.removeIngredientButton}
                        onPress={() => removeIngredient(index)}
                      >
                        <Ionicons name="close" size={16} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <TouchableOpacity 
                  style={styles.clearIngredientsButton}
                  onPress={clearIngredients}
                >
                  <Text style={styles.clearIngredientsText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Suggested Ingredients from Fridge */}
            {fridgeIngredients.length > 0 && (
              <View style={styles.suggestedIngredientsContainer}>
                <Text style={styles.suggestedIngredientsTitle}>From your fridge:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.suggestedIngredientsList}>
                    {fridgeIngredients
                      .filter(ing => !advancedFilters.ingredients.includes(ing.name.toLowerCase()))
                      .slice(0, 10)
                      .map((ingredient) => (
                        <TouchableOpacity
                          key={ingredient.id}
                          style={styles.suggestedIngredientChip}
                          onPress={() => addIngredientFromFridge(ingredient.name)}
                        >
                          <Text style={styles.suggestedIngredientText}>{ingredient.name}</Text>
                          <Ionicons name="add" size={16} color={colors.primary} />
                        </TouchableOpacity>
                      ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Apply Filters Button */}
        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={styles.applyFiltersButton}
            onPress={onClose}
          >
            <Text style={styles.applyFiltersButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.sm,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  filterSection: {
    marginVertical: spacing.lg,
  },
  filterSectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  filterSectionSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterOption: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  filterOptionTextSelected: {
    color: colors.surface,
  },
  modalFooter: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyFiltersButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  applyFiltersButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
  // Ingredient Search Styles
  addIngredientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addIngredientInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.md,
    fontSize: 16,
    lineHeight: 20,
    color: colors.text,
    minHeight: 40,
    textAlignVertical: 'center',
  },
  addIngredientButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIngredientsContainer: {
    marginBottom: spacing.md,
  },
  selectedIngredientsTitle: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  selectedIngredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    gap: spacing.xs,
  },
  ingredientChipText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  removeIngredientButton: {
    padding: spacing.xs,
  },
  clearIngredientsButton: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
  },
  clearIngredientsText: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '600',
  },
  suggestedIngredientsContainer: {
    marginBottom: spacing.md,
  },
  suggestedIngredientsTitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  suggestedIngredientsList: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  suggestedIngredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing.xs,
  },
  suggestedIngredientText: {
    ...typography.bodySmall,
    color: colors.text,
  },
}); 