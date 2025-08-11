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
}

export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
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
}); 