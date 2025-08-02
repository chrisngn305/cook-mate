import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useRecipes, useFridgeIngredients, useSearchRecipesByIngredients } from '../services/hooks';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Fetch data from API
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes();
  const { data: fridgeIngredients = [], isLoading: fridgeLoading } = useFridgeIngredients();
  
  // Get ingredient names for recipe search
  const ingredientNames = fridgeIngredients.map(ing => ing.name);
  const { data: suggestedRecipes = [], isLoading: suggestionsLoading } = useSearchRecipesByIngredients(ingredientNames);

  const quickFilters = [
    { id: 'easy', label: 'Easy to Cook', icon: 'checkmark-circle' },
    { id: 'short', label: 'Quick (< 30min)', icon: 'time' },
    { id: 'cold', label: 'Cold Day', icon: 'snow' },
    { id: 'party', label: 'Party', icon: 'people' },
  ];

  // Filter recipes based on selected filters
  const filteredRecipes = recipes.filter(recipe => {
    if (selectedFilters.length === 0) return true;
    
    return selectedFilters.some(filter => {
      switch (filter) {
        case 'easy':
          return recipe.difficulty === 'easy';
        case 'short':
          return recipe.cookingTime <= 30;
        case 'cold':
          return recipe.tags?.some(tag => tag.name.toLowerCase().includes('cold'));
        case 'party':
          return recipe.tags?.some(tag => tag.name.toLowerCase().includes('party'));
        default:
          return false;
      }
    });
  });

  // Handle filter selection
  const handleFilterPress = (filterId: string) => {
    setSelectedFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const renderRecipeCard = (recipe: any) => (
    <TouchableOpacity 
      key={recipe.id} 
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { 
        recipeId: recipe.id,
        recipeTitle: recipe.title 
      })}
    >
      <View style={styles.recipeImage}>
        {recipe.image ? (
          <Ionicons name="image" size={32} color={colors.primary} />
        ) : (
          <Ionicons name="restaurant" size={32} color={colors.primary} />
        )}
      </View>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{recipe.cookingTime} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading recipes...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Recipe Book</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddRecipe')}
          >
            <Ionicons name="add" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search any recipe..."
              placeholderTextColor={colors.inputPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Filters */}
        <View style={styles.section}>
          <View style={styles.filterHeader}>
            <Text style={styles.sectionTitle}>Quick Filters</Text>
            {selectedFilters.length > 0 && (
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={() => setSelectedFilters([])}
              >
                <Text style={styles.clearFiltersText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filtersContainer}>
              {quickFilters.map((filter) => {
                const isSelected = selectedFilters.includes(filter.id);
                return (
                  <TouchableOpacity 
                    key={filter.id} 
                    style={[
                      styles.filterChip,
                      isSelected && styles.filterChipSelected
                    ]}
                    onPress={() => handleFilterPress(filter.id)}
                  >
                    <Ionicons 
                      name={filter.icon as any} 
                      size={16} 
                      color={isSelected ? colors.surface : colors.primary} 
                    />
                    <Text style={[
                      styles.filterText,
                      isSelected && styles.filterTextSelected
                    ]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Fridge Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fridge Suggestions</Text>
          <Text style={styles.sectionSubtitle}>
            Recipes based on your ingredients
          </Text>
          {suggestionsLoading ? (
            renderLoadingState()
          ) : suggestedRecipes.length > 0 ? (
            suggestedRecipes.slice(0, 5).map(renderRecipeCard)
          ) : (
            <View style={styles.noRecipesContainer}>
              <Ionicons name="restaurant-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.noRecipesText}>No suggestions found</Text>
              <Text style={styles.noRecipesSubtext}>Add ingredients to your fridge to see recipe suggestions</Text>
            </View>
          )}
        </View>

        {/* All Recipes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Recipes</Text>
          {recipesLoading ? (
            renderLoadingState()
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.slice(0, 10).map(renderRecipeCard)
          ) : (
            <View style={styles.noRecipesContainer}>
              <Ionicons name="restaurant-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.noRecipesText}>No recipes found</Text>
              <Text style={styles.noRecipesSubtext}>Try adjusting your filters or add some recipes</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 16,
    lineHeight: 20,
    color: colors.text,
    textAlignVertical: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  clearFiltersButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  clearFiltersText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  filterText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTextSelected: {
    color: colors.surface,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
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
}); 