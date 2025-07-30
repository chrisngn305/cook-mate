import React, { useState } from 'react';
import {
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import { Recipe, Ingredient, RecipeStep } from '../types/recipe';
import {
  ScreenHeader,
  FormInput,
  DifficultySelector,
  IngredientsList,
  StepsList,
  ImageUpload,
} from '../components';

export default function AddRecipeScreen() {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [cuisine, setCuisine] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);

  const saveRecipe = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a recipe title');
      return;
    }
    if (ingredients.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return;
    }
    if (steps.length === 0) {
      Alert.alert('Error', 'Please add at least one step');
      return;
    }

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

    // TODO: Save recipe to storage/database
    console.log('Saving recipe:', recipe);
    Alert.alert('Success', 'Recipe saved successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScreenHeader
          title="Add Recipe"
          onBack={() => navigation.goBack()}
          onSave={saveRecipe}
          showSave={true}
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