export interface Recipe {
  id: string;
  title: string;
  description?: string;
  image?: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tags: RecipeTag[];
  cookingTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  cuisine?: string;
  occasion?: string[];
  mood?: string[];
  season?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface RecipeStep {
  id: string;
  order: number;
  description: string;
  image?: string;
  time?: number; // in minutes
}

export interface RecipeTag {
  id: string;
  name: string;
  type: 'cuisine' | 'taste' | 'difficulty' | 'occasion' | 'mood' | 'season';
}

export interface FridgeIngredient {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  expiryDate?: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: Date;
  completedAt?: Date;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isCompleted: boolean;
  recipeId?: string; // if added from a recipe
}

export interface RecipeFilter {
  search?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  cookingTime?: 'short' | 'medium' | 'long';
  cuisine?: string;
  occasion?: string;
  mood?: string;
  season?: string;
  ingredients?: string[];
}

export type CookingTimeCategory = 'short' | 'medium' | 'long';
export type DifficultyLevel = 'easy' | 'medium' | 'hard'; 