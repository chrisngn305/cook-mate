import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useRecipe, useLikeRecipe } from '../services/hooks';
import { usePopup } from '../hooks/usePopup';
import CustomPopup from '../components/CustomPopup';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface RecipeStep {
  id: string;
  stepNumber: number;
  description: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  image?: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  views: number;
  likes: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function RecipeDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const recipeId = route.params?.recipeId || 'unknown';
  const shouldRefresh = route.params?.refreshData;

  // Use React Query hooks for data fetching
  const { data: recipe, isLoading, error, refetch } = useRecipe(recipeId);
  const likeRecipeMutation = useLikeRecipe();
  const { showSuccess, showError, showWarning, popupConfig, isVisible, hidePopup } = usePopup();
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Reload recipe data when screen comes back into focus (after editing)
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [recipeId, refetch])
  );

  const handleLike = async () => {
    try {
      await likeRecipeMutation.mutateAsync(recipeId);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like recipe:', error);
    }
  };

  const handleShare = async () => {
    if (!recipe) return;

    try {
      // Create a nicely formatted share message
      const shareMessage = `🍳 ${recipe.title}\n\n${recipe.description}\n\n⏱️ Cooking Time: ${recipe.cookingTime} minutes\n🎯 Difficulty: ${recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}\n🌍 Cuisine: ${recipe.cuisine}\n\n📝 Ingredients:\n${recipe.ingredients.map(ing => `• ${ing.quantity} ${ing.unit} ${ing.name}`).join('\n')}\n\n👨‍🍳 Steps:\n${recipe.steps.map(step => `${step.stepNumber}. ${step.description}`).join('\n')}\n\nShared from CookMate App`;

      const result = await Share.share({
        message: shareMessage,
        title: recipe.title,
        url: `https://cookmate.app/recipe/${recipe.id}`, // Replace with your actual recipe URL
      });

      if (result.action === Share.sharedAction) {
        showWarning('Shared!', 'Recipe shared successfully!');
      }
    } catch (error) {
      console.error('Failed to share recipe:', error);
      showWarning('Share Failed', 'Failed to share recipe. Please try again.');
    }
  };

  const handleAddToShoppingList = () => {
    if (!recipe) return;

    try {
      // Create shopping list items from recipe ingredients
      const shoppingItems = recipe.ingredients.map(ingredient => ({
        name: ingredient.name,
        quantity: ingredient.quantity.toString(),
        unit: ingredient.unit,
      }));

      // For now, we'll show a success message
      // In a real app, you'd add these items to the shopping list via API
      showSuccess(
        'Added to Shopping List!', 
        `${recipe.ingredients.length} ingredients added to your shopping list.`
      );
    } catch (error) {
      console.error('Failed to add to shopping list:', error);
      showError('Error', 'Failed to add ingredients to shopping list. Please try again.');
    }
  };

  const handleEditRecipe = () => {
    navigation.navigate('AddRecipe', {
      mode: 'edit',
      recipeId: recipeId,
      recipe: recipe
    });
  };

  const handleStepToggle = (stepId: string) => {
    const newCompletedSteps = new Set(completedSteps);
    if (newCompletedSteps.has(stepId)) {
      newCompletedSteps.delete(stepId);
    } else {
      newCompletedSteps.add(stepId);
    }
    setCompletedSteps(newCompletedSteps);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const getProgressPercentage = () => {
    if (!recipe || recipe.steps.length === 0) return 0;
    return Math.round((completedSteps.size / recipe.steps.length) * 100);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading recipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
          <Text style={styles.errorText}>Recipe not found</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddToShoppingList}>
              <Ionicons name="cart-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            {user?.id && recipe?.userId && user.id === recipe.userId && (
              <TouchableOpacity style={styles.actionButton} onPress={handleEditRecipe}>
                <Ionicons name="create-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Recipe Image */}
        <View style={styles.imageContainer}>
          {recipe.image ? (
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="restaurant" size={64} color={colors.textSecondary} />
            </View>
          )}
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? colors.error : colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Recipe Info */}
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text style={styles.recipeDescription}>{recipe.description}</Text>

          <View style={styles.recipeStats}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.statText}>{recipe.cookingTime} min</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="speedometer-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: getDifficultyColor(recipe.difficulty) }]}>
                {getDifficultyText(recipe.difficulty)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ingredients' && styles.activeTab]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
              Ingredients ({recipe.ingredients.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'steps' && styles.activeTab]}
            onPress={() => setActiveTab('steps')}
          >
            <Text style={[styles.tabText, activeTab === 'steps' && styles.activeTabText]}>
              Steps ({recipe.steps.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar for Steps */}
        {activeTab === 'steps' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                Progress: {completedSteps.size}/{recipe.steps.length} steps
              </Text>
              <Text style={styles.progressPercentage}>
                {getProgressPercentage()}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${getProgressPercentage()}%` }
                ]}
              />
            </View>
          </View>
        )}

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'ingredients' ? (
            <View style={styles.ingredientsList}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={ingredient.id} style={styles.ingredientItem}>
                  <View style={styles.ingredientBullet}>
                    <Text style={styles.ingredientNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.ingredientContent}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    <Text style={styles.ingredientQuantity}>
                      {ingredient.quantity} {ingredient.unit}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.stepsList}>
              {recipe.steps.map((step) => {
                const isCompleted = completedSteps.has(step.id);
                return (
                  <TouchableOpacity
                    key={step.id}
                    style={[
                      styles.stepItem,
                      isCompleted && styles.completedStepItem
                    ]}
                    onPress={() => handleStepToggle(step.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.stepNumber,
                      isCompleted && styles.completedStepNumber
                    ]}>
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={20} color={colors.surface} />
                      ) : (
                        <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                      )}
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={[
                        styles.stepDescription,
                        isCompleted && styles.completedStepDescription
                      ]}>
                        {step.description}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        isCompleted && styles.checkedCheckbox
                      ]}
                      onPress={() => handleStepToggle(step.id)}
                    >
                      {isCompleted && (
                        <Ionicons name="checkmark" size={16} color={colors.surface} />
                      )}
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  errorText: {
    ...typography.h2,
    color: colors.error,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
  },
  retryButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    marginBottom: spacing.lg,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.pill,
    padding: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeInfo: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  recipeTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  recipeDescription: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  difficultyText: {
    ...typography.caption,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  ingredientsList: {
    gap: spacing.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ingredientBullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  ingredientNumber: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  ingredientContent: {
    flex: 1,
  },
  ingredientName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  ingredientQuantity: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  stepsList: {
    gap: spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  completedStepItem: {
    opacity: 0.7,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  completedStepNumber: {
    backgroundColor: colors.primary,
  },
  stepNumberText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
  },
  stepDescription: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  completedStepDescription: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  checkedCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  progressContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  progressPercentage: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
}); 