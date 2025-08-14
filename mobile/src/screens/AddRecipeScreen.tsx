import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import { Recipe, Ingredient, RecipeStep } from '../types/recipe';
import {
  ScreenHeader,
  FormInput,
  DifficultySelector,
  IngredientsList,
  StepsList,
  ImageUpload,
  CustomPopup,
} from '../components';
import { useCreateRecipe, useUpdateRecipe, useUploadRecipeImage } from '../services/hooks';
import { usePopup } from '../hooks/usePopup';

export default function AddRecipeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isEditMode = route.params?.mode === 'edit';
  const existingRecipe = route.params?.recipe as Recipe | undefined;
  
  const createRecipeMutation = useCreateRecipe();
  const updateRecipeMutation = useUpdateRecipe();
  const uploadRecipeImageMutation = useUploadRecipeImage();
  const { showSuccess, showError, popupConfig, isVisible, hidePopup } = usePopup();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [cuisine, setCuisine] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill form with existing recipe data in edit mode
  useEffect(() => {
    if (isEditMode && existingRecipe) {
      setTitle(existingRecipe.title);
      setDescription(existingRecipe.description || '');
      setCookingTime(existingRecipe.cookingTime.toString());
      setServings(existingRecipe.servings?.toString() || '1');
      setDifficulty(existingRecipe.difficulty);
      setCuisine(existingRecipe.cuisine || '');
      setImageUri(existingRecipe.image || null);
      setIngredients(existingRecipe.ingredients);
      setSteps(existingRecipe.steps);
    }
  }, [isEditMode, existingRecipe]);

  const saveRecipe = async () => {
    if (!title.trim()) {
      showError('Error', 'Please enter a recipe title');
      return;
    }
    if (ingredients.length === 0) {
      showError('Error', 'Please add at least one ingredient');
      return;
    }
    if (steps.length === 0) {
      showError('Error', 'Please add at least one step');
      return;
    }

    setIsSaving(true);

    const recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim(),
      image: imageUri || undefined,
      ingredients,
      steps,
      tags: [],
      cookingTime: parseInt(cookingTime) || 0,
      difficulty,
      servings: parseInt(servings) || 1,
      cuisine: cuisine || undefined,
      occasion: [],
      mood: [],
      season: [],
    };

    try {
      let savedRecipe;
      
      if (isEditMode) {
        // Update existing recipe
        savedRecipe = await updateRecipeMutation.mutateAsync({ id: route.params?.recipeId, recipeData: recipe });
        showSuccess('Success', 'Recipe updated successfully!', () => {
          navigation.goBack();
        });
      } else {
        // Create new recipe
        savedRecipe = await createRecipeMutation.mutateAsync(recipe);
        showSuccess('Success', 'Recipe saved successfully!', () => {
          navigation.navigate('RecipeDetail', { 
            recipeId: savedRecipe.id 
          });
        });
      }

      // Upload image if it's a local file
      if (imageUri && imageUri.startsWith('file://')) {
        try {
          // Convert the local URI to a File object for upload
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const file = new File([blob], 'recipe.jpg', { type: 'image/jpeg' });
          
          // Upload the recipe image
          await uploadRecipeImageMutation.mutateAsync({ 
            recipeId: savedRecipe.id, 
            imageFile: file 
          });
        } catch (error) {
          console.error('Failed to upload recipe image:', error);
          showError('Warning', 'Recipe saved but image upload failed. You can try uploading the image again later.');
        }
      }
    } catch (error: any) {
      console.error('Failed to save recipe:', error);
      showError('Error', error.message || 'Failed to save recipe');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScreenHeader
          title={isEditMode ? "Edit Recipe" : "Add Recipe"}
          onBack={() => navigation.goBack()}
          onSave={saveRecipe}
          showSave={true}
          saveDisabled={isSaving}
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Information Section */}
          <View style={styles.section}>
            <ImageUpload
              imageUri={imageUri || undefined}
              onImageChange={setImageUri}
              label="Recipe Image"
            />

            <FormInput
              label="Recipe Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter recipe title"
              required
            />

            <FormInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your recipe..."
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <FormInput
                  label="Cooking Time (min)"
                  value={cookingTime}
                  onChangeText={setCookingTime}
                  placeholder="30"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfWidth}>
                <FormInput
                  label="Servings"
                  value={servings}
                  onChangeText={setServings}
                  placeholder="4"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <DifficultySelector
              value={difficulty}
              onChange={setDifficulty}
            />

            <FormInput
              label="Cuisine"
              value={cuisine}
              onChangeText={setCuisine}
              placeholder="e.g., Italian, Mexican..."
            />
          </View>

          {/* Ingredients Section */}
          <IngredientsList
            ingredients={ingredients}
            onIngredientsChange={setIngredients}
          />

          {/* Steps Section */}
          <StepsList
            steps={steps}
            onStepsChange={setSteps}
          />
        </ScrollView>
      </KeyboardAvoidingView>

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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
}); 