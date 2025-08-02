import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useFridgeIngredients, useAddFridgeIngredient, useDeleteFridgeIngredient } from '../services/hooks';
import { useRecipes } from '../services/hooks';
import { usePopup } from '../hooks/usePopup';
import CustomPopup from '../components/CustomPopup';

export default function FridgeScreen() {
  const navigation = useNavigation<any>();
  const [newIngredient, setNewIngredient] = useState('');
  const [highlightedIngredient, setHighlightedIngredient] = useState<string | null>(null);
  const { showError, showSuccess, popupConfig, isVisible, hidePopup } = usePopup();

  // Fetch data
  const { data: fridgeIngredients = [], isLoading: fridgeLoading } = useFridgeIngredients();
  const addIngredientMutation = useAddFridgeIngredient();
  const deleteIngredientMutation = useDeleteFridgeIngredient();
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes();

  // Get ingredient names for recipe search
  const availableIngredients = fridgeIngredients.map((item: any) => item.name.toLowerCase());
  const filteredIngredients = ['tomato', 'onion', 'garlic', 'olive oil', 'salt', 'pepper', 'cheese', 'bread', 'milk', 'eggs']
    .filter(ingredient => ingredient.includes(newIngredient.toLowerCase()) && !availableIngredients.includes(ingredient));

  const addIngredient = async () => {
    if (!newIngredient.trim()) {
      showError('Error', 'Please enter an ingredient name');
      return;
    }

    try {
      await addIngredientMutation.mutateAsync({
        name: newIngredient.trim(),
        quantity: 1,
        unit: 'piece',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      });
      setNewIngredient('');
      showSuccess('Success', 'Ingredient added to fridge!');
    } catch (error: any) {
      showError('Error', 'Failed to add ingredient. Please try again.');
    }
  };

  const removeIngredient = async (ingredient: any) => {
    try {
      await deleteIngredientMutation.mutateAsync(ingredient.id);
      showSuccess('Success', 'Ingredient removed from fridge!');
    } catch (error: any) {
      showError('Error', 'Failed to remove ingredient. Please try again.');
    }
  };

  const addIngredientFromSuggestion = async (ingredientName: string) => {
    try {
      await addIngredientMutation.mutateAsync({
        name: ingredientName,
        quantity: 1,
        unit: 'piece',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setNewIngredient('');
      showSuccess('Success', 'Ingredient added to fridge!');
    } catch (error: any) {
      showError('Error', 'Failed to add ingredient. Please try again.');
    }
  };

  const renderIngredientChip = ({ item, index }: { item: any; index: number }) => {
    const isHighlighted = highlightedIngredient === item.name;
    return (
      <View style={[
        styles.ingredientChip,
        isHighlighted && styles.ingredientChipHighlighted
      ]}>
        <Text style={styles.ingredientText}>{item.name}</Text>
        <TouchableOpacity onPress={() => removeIngredient(item)}>
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderRecipeCard = ({ item }: { item: any }) => {
    // Calculate recipe matches based on available ingredients
    const availableIngredients = fridgeIngredients.map(ing => ing.name.toLowerCase());
    const recipeIngredients = item.ingredients.map((ing: any) => ing.name.toLowerCase());
    
    const matchingIngredients = recipeIngredients.filter(ingredient =>
      availableIngredients.some(available => 
        available.includes(ingredient) || ingredient.includes(available)
      )
    );
    
    const missingIngredients = recipeIngredients.filter(ingredient =>
      !availableIngredients.some(available => 
        available.includes(ingredient) || ingredient.includes(available)
      )
    );
    
    const matchPercentage = Math.round((matchingIngredients.length / recipeIngredients.length) * 100);

    return (
      <TouchableOpacity 
        style={styles.recipeCard}
        onPress={() => navigation.navigate('RecipeDetail', { 
          recipeId: item.id,
          recipeTitle: item.title 
        })}
      >
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{matchPercentage}% match</Text>
          </View>
        </View>
        
        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.cookingTime} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.difficulty}</Text>
          </View>
        </View>

        {matchingIngredients.length > 0 && (
          <View style={styles.matchingContainer}>
            <Text style={styles.matchingTitle}>You have: {matchingIngredients.length}/{recipeIngredients.length} ingredients</Text>
            <View style={styles.matchingIngredients}>
              {matchingIngredients.map((ingredient: string, index: number) => (
                <View key={index} style={styles.matchingChip}>
                  <Text style={styles.matchingText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {missingIngredients.length > 0 && (
          <View style={styles.missingContainer}>
            <Text style={styles.missingTitle}>Missing ingredients:</Text>
            <View style={styles.missingIngredients}>
              {missingIngredients.map((ingredient: string, index: number) => (
                <View key={index} style={styles.missingChip}>
                  <Text style={styles.missingText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Fridge Mode</Text>
        <TouchableOpacity style={styles.scanButton}>
          <Ionicons name="scan" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Add Ingredient */}
      <View style={styles.addContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add ingredient..."
            placeholderTextColor={colors.inputPlaceholder}
            value={newIngredient}
            onChangeText={setNewIngredient}
            onSubmitEditing={addIngredient}
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addIngredient}
            disabled={addIngredientMutation.isPending}
          >
            {addIngredientMutation.isPending ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <Ionicons name="add" size={20} color={colors.surface} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Current Ingredients */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Ingredients</Text>
        {fridgeLoading ? (
          renderLoadingState()
        ) : fridgeIngredients.length > 0 ? (
          <FlatList
            data={fridgeIngredients}
            renderItem={renderIngredientChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ingredientsContainer}
          />
        ) : (
          <Text style={styles.emptyText}>No ingredients added yet</Text>
        )}
      </View>

      {/* Search Suggestions */}
      {newIngredient.length > 0 && filteredIngredients.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <FlatList
            data={filteredIngredients}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.suggestionChip}
                onPress={() => addIngredientFromSuggestion(item)}
              >
                <Text style={styles.suggestionChipText}>{item}</Text>
                <Ionicons name="add" size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContainer}
          />
        </View>
      )}

      {/* Suggested Recipes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested Recipes</Text>
        {recipesLoading ? (
          renderLoadingState()
        ) : recipes.length > 0 ? (
          <FlatList
            data={recipes}
            renderItem={renderRecipeCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noRecipesContainer}>
            <Ionicons name="restaurant-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.noRecipesText}>No recipes found</Text>
            <Text style={styles.noRecipesSubtext}>Try adding more ingredients to see suggestions</Text>
          </View>
        )}
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  scanButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
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
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  suggestionsContainer: {
    gap: spacing.sm,
  },
  suggestionChip: {
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
  suggestionChipText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  ingredientsContainer: {
    gap: spacing.sm,
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
  ingredientText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  ingredientChipHighlighted: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  recipeCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recipeTitle: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
  },
  matchBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  matchText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '600',
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  matchingContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginBottom: spacing.sm,
  },
  matchingTitle: {
    ...typography.bodySmall,
    color: colors.success,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  matchingIngredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  matchingChip: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  matchingText: {
    ...typography.caption,
    color: colors.success,
  },
  missingContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  missingTitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  missingIngredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  missingChip: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  missingText: {
    ...typography.caption,
    color: colors.error,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  loadingText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  noRecipesContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  noRecipesText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  noRecipesSubtext: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 