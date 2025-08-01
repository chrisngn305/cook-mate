import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

export default function FridgeScreen() {
  const [ingredients, setIngredients] = useState<string[]>([
    'tomatoes', 
    'onions', 
    'chicken', 
    'garlic', 
    'olive oil',
    'bread'
  ]);
  const [newIngredient, setNewIngredient] = useState('');
  const [highlightedIngredient, setHighlightedIngredient] = useState<string | null>(null);

  const allIngredients = [
    'eggs', 'milk', 'cheese', 'butter', 'rice', 'pasta', 
    'potatoes', 'carrots', 'bell peppers', 'spinach', 'lemons',
    'tomatoes', 'onions', 'garlic', 'olive oil', 'bread', 'chicken',
    'beef', 'pork', 'fish', 'shrimp', 'salmon', 'tuna',
    'broccoli', 'cauliflower', 'zucchini', 'eggplant', 'mushrooms',
    'basil', 'oregano', 'thyme', 'rosemary', 'parsley', 'cilantro',
    'lemon', 'lime', 'orange', 'apple', 'banana', 'strawberries',
    'cream', 'yogurt', 'sour cream', 'mayonnaise', 'ketchup', 'mustard',
    'soy sauce', 'vinegar', 'honey', 'sugar', 'flour', 'cornstarch'
  ];

  const allRecipes = [
    {
      id: '1',
      title: 'Chicken Stir Fry',
      ingredients: ['chicken', 'soy sauce', 'ginger', 'onions', 'garlic'],
      cookingTime: 20,
      difficulty: 'medium',
    },
    {
      id: '2',
      title: 'Tomato Pasta',
      ingredients: ['tomatoes', 'pasta', 'garlic', 'onions', 'olive oil'],
      cookingTime: 15,
      difficulty: 'easy',
    },
    {
      id: '3',
      title: 'Onion Soup',
      ingredients: ['onions', 'beef broth', 'bread', 'garlic', 'butter'],
      cookingTime: 45,
      difficulty: 'medium',
    },
    {
      id: '4',
      title: 'Tomato Salad',
      ingredients: ['tomatoes', 'onions', 'olive oil', 'basil'],
      cookingTime: 10,
      difficulty: 'easy',
    },
    {
      id: '5',
      title: 'Chicken Soup',
      ingredients: ['chicken', 'onions', 'carrots', 'celery', 'broth'],
      cookingTime: 60,
      difficulty: 'medium',
    },
    {
      id: '6',
      title: 'Garlic Bread',
      ingredients: ['bread', 'garlic', 'butter', 'parmesan'],
      cookingTime: 15,
      difficulty: 'easy',
    },
  ];

  // Calculate recipe matches based on available ingredients
  const calculateRecipeMatches = () => {
    return allRecipes.map(recipe => {
      const availableIngredients = ingredients.map(ing => ing.toLowerCase());
      const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
      
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
      
      return {
        ...recipe,
        matchPercentage,
        missingIngredients,
        matchingIngredients,
      };
    }).filter(recipe => recipe.matchPercentage > 0).sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  const suggestedRecipes = calculateRecipeMatches();

  // Filter ingredients based on search query
  const filteredIngredients = allIngredients.filter(ingredient =>
    ingredient.toLowerCase().includes(newIngredient.toLowerCase()) &&
    !ingredients.includes(ingredient)
  ).slice(0, 8); // Limit to 8 suggestions

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const ingredientToAdd = newIngredient.trim();
      setIngredients([ingredientToAdd, ...ingredients]);
      setNewIngredient('');
      setHighlightedIngredient(ingredientToAdd);
      // Clear highlight after 2 seconds
      setTimeout(() => setHighlightedIngredient(null), 2000);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const renderIngredientChip = ({ item, index }: { item: string; index: number }) => {
    const isHighlighted = highlightedIngredient === item;
    return (
      <View style={[
        styles.ingredientChip,
        isHighlighted && styles.ingredientChipHighlighted
      ]}>
        <Text style={styles.ingredientText}>{item}</Text>
        <TouchableOpacity onPress={() => removeIngredient(index)}>
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderRecipeCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.recipeCard}>
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{item.matchPercentage}% match</Text>
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

      {item.matchingIngredients.length > 0 && (
        <View style={styles.matchingContainer}>
          <Text style={styles.matchingTitle}>You have: {item.matchingIngredients.length}/{item.ingredients.length} ingredients</Text>
          <View style={styles.matchingIngredients}>
            {item.matchingIngredients.map((ingredient: string, index: number) => (
              <View key={index} style={styles.matchingChip}>
                <Text style={styles.matchingText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {item.missingIngredients.length > 0 && (
        <View style={styles.missingContainer}>
          <Text style={styles.missingTitle}>Missing ingredients:</Text>
          <View style={styles.missingIngredients}>
            {item.missingIngredients.map((ingredient: string, index: number) => (
              <View key={index} style={styles.missingChip}>
                <Text style={styles.missingText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
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
          <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
            <Ionicons name="add" size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Current Ingredients */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Ingredients</Text>
        <FlatList
          data={ingredients}
          renderItem={renderIngredientChip}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ingredientsContainer}
        />
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
                onPress={() => {
                  setIngredients([item, ...ingredients]);
                  setNewIngredient('');
                  setHighlightedIngredient(item);
                  // Clear highlight after 2 seconds
                  setTimeout(() => setHighlightedIngredient(null), 2000);
                }}
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
        {suggestedRecipes.length > 0 ? (
          <FlatList
            data={suggestedRecipes}
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
}); 