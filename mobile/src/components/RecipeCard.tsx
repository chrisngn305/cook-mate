import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

interface RecipeCardProps {
  recipe: any;
  onPress: () => void;
  horizontal?: boolean;
}

export default function RecipeCard({ recipe, onPress, horizontal = false }: RecipeCardProps) {
  if (horizontal) {
    return (
      <TouchableOpacity 
        style={styles.recipeCardHorizontal}
        onPress={onPress}
      >
        <View style={styles.recipeImageHorizontal}>
          {recipe.image ? (
            <Ionicons name="image" size={32} color={colors.primary} />
          ) : (
            <Ionicons name="restaurant" size={32} color={colors.primary} />
          )}
          
          {/* Duration Badge */}
          <View style={styles.durationBadge}>
            <Text style={styles.badgeText}>{recipe.cookingTime} mins</Text>
          </View>
          
          {/* Difficulty Badge */}
          <View style={[styles.difficultyBadge, styles[`difficulty${recipe.difficulty?.charAt(0).toUpperCase() + recipe.difficulty?.slice(1)}`]]}>
            <Text style={styles.badgeText}>{recipe.difficulty}</Text>
          </View>
        </View>
        
        <View style={styles.recipeInfoHorizontal}>
          <Text style={styles.recipeTitleHorizontal} numberOfLines={2}>
            {recipe.title}
          </Text>
          {recipe.description && (
            <Text style={styles.recipeDescription} numberOfLines={2}>
              {recipe.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Original vertical layout
  return (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={onPress}
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
}

const styles = StyleSheet.create({
  // Vertical layout styles (original)
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

  // Horizontal layout styles
  recipeCardHorizontal: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  recipeImageHorizontal: {
    width: '100%',
    height: 120,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  recipeInfoHorizontal: {
    padding: spacing.md,
  },
  recipeTitleHorizontal: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
    fontSize: 16,
    lineHeight: 20,
  },
  recipeDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Badge styles
  durationBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  difficultyBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  difficultyEasy: {
    backgroundColor: colors.success,
  },
  difficultyMedium: {
    backgroundColor: colors.warning,
  },
  difficultyHard: {
    backgroundColor: colors.error,
  },
  badgeText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '600',
    fontSize: 12,
  },
}); 