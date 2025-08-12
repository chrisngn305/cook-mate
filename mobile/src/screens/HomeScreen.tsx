import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useRecipes, useFridgeIngredients, useSearchRecipesByIngredients } from '../services/hooks';
import { FilterModal, QuickFilters, RecipeSection } from '../components';

export default function HomeScreen() {
  type HomeScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
  
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    difficulty: '',
    maxCookingTime: '',
    cuisine: '',
    dietaryRestrictions: [],
    tags: [],
    ingredients: [],
  });
  // Fetch data from API
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes();
  const { data: fridgeIngredients = [], isLoading: fridgeLoading } = useFridgeIngredients();
  
  // Get ingredient names for recipe search
  const ingredientNames = fridgeIngredients.map(ing => ing.name);
  const { data: suggestedRecipes = [], isLoading: suggestionsLoading } = useSearchRecipesByIngredients(ingredientNames);

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
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFiltersModal(true)}
            >
              <Ionicons name="filter" size={20} color={colors.primary} />
            </TouchableOpacity>

          </View>
        </View>

        {/* Quick Filters */}
        <QuickFilters
          selectedFilters={selectedFilters}
          onFilterPress={handleFilterPress}
          onClearFilters={() => setSelectedFilters([])}
        />

        {/* Fridge Suggestions */}
        <RecipeSection
          title="Fridge Suggestions"
          subtitle="Recipes based on your ingredients"
          recipes={suggestedRecipes}
          isLoading={suggestionsLoading}
          onRecipePress={(recipe) => navigation.navigate('RecipeDetail', { 
            recipeId: recipe.id,
            recipeTitle: recipe.title 
          })}
          maxRecipes={5}
          horizontal={true}
          showSeeAll={true}
          onSeeAllPress={() => navigation.navigate('Recipes')}
          emptyStateText="No suggestions found"
          emptyStateSubtext="Add ingredients to your fridge to see recipe suggestions"
        />

        {/* All Recipes */}
        <RecipeSection
          title="All Recipes"
          recipes={filteredRecipes}
          isLoading={recipesLoading}
          onRecipePress={(recipe) => navigation.navigate('RecipeDetail', { 
            recipeId: recipe.id,
            recipeTitle: recipe.title 
          })}
          maxRecipes={10}
          horizontal={true}
          showSeeAll={true}
          onSeeAllPress={() => navigation.navigate('Recipes')}
          emptyStateText="No recipes found"
          emptyStateSubtext="Try adjusting your filters or add some recipes"
        />
      </ScrollView>

      {/* Filters Modal */}
      <FilterModal
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        advancedFilters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        fridgeIngredients={fridgeIngredients}
      />
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
  filterButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
}); 