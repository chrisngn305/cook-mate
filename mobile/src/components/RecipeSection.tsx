import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import RecipeCard from './RecipeCard';

interface RecipeSectionProps {
  title: string;
  subtitle?: string;
  recipes: any[];
  isLoading: boolean;
  onRecipePress: (recipe: any) => void;
  maxRecipes?: number;
  emptyStateIcon?: string;
  emptyStateText: string;
  emptyStateSubtext: string;
  horizontal?: boolean;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
}

export default function RecipeSection({
  title,
  subtitle,
  recipes,
  isLoading,
  onRecipePress,
  maxRecipes = 10,
  emptyStateIcon = 'restaurant-outline',
  emptyStateText,
  emptyStateSubtext,
  horizontal = false,
  showSeeAll = false,
  onSeeAllPress,
}: RecipeSectionProps) {
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading recipes...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.noRecipesContainer}>
      <Ionicons name={emptyStateIcon as any} size={48} color={colors.textSecondary} />
      <Text style={styles.noRecipesText}>{emptyStateText}</Text>
      <Text style={styles.noRecipesSubtext}>{emptyStateSubtext}</Text>
    </View>
  );

  const renderRecipes = () => {
    if (horizontal) {
      return (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContainer}
        >
          {recipes.slice(0, maxRecipes).map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => onRecipePress(recipe)}
              horizontal={true}
            />
          ))}
        </ScrollView>
      );
    }

    return recipes.slice(0, maxRecipes).map((recipe) => (
      <RecipeCard
        key={recipe.id}
        recipe={recipe}
        onPress={() => onRecipePress(recipe)}
        horizontal={false}
      />
    ));
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.sectionSubtitle}>{subtitle}</Text>
          )}
        </View>
        {showSeeAll && onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isLoading ? (
        renderLoadingState()
      ) : recipes.length > 0 ? (
        renderRecipes()
      ) : (
        renderEmptyState()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 0,
  },
  seeAllText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  horizontalScrollContainer: {
    paddingRight: spacing.lg,
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