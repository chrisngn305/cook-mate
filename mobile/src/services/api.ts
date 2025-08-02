import { queryClient } from './queryClient';
import { Platform } from 'react-native';

// Determine the correct API URL based on platform
const getApiBaseUrl = () => {
  // If environment variable is set, use it
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // For Android emulator, use 10.0.2.2 instead of localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  
  // For iOS simulator and other platforms, use localhost
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

interface ApiResponse<T> {
  data: T;
  message?: string;
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
  tags: RecipeTag[];
  views: number;
  likes: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

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

interface RecipeTag {
  id: string;
  name: string;
  type: string;
}

interface FridgeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  isExpired: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ShoppingList {
  id: string;
  name: string;
  isCompleted: boolean;
  userId: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isCompleted: boolean;
  shoppingListId: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  recipesCount: number;
  favoritesCount: number;
  shoppingListsCount: number;
  daysStreak: number;
  preferences: {
    cuisine: string[];
    dietaryRestrictions: string[];
    cookingSkill: 'beginner' | 'intermediate' | 'advanced';
    favoriteIngredients: string[];
  };
}

interface LoginResponse {
  access_token: string;
  user: User;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  getApiUrl(): string {
    return API_BASE_URL;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async register(email: string, password: string, name: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/users/profile');
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    return this.request<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  async updateProfilePreferences(preferences: any): Promise<User> {
    return this.request<User>('/users/profile/preferences', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }

  async updateProfileAvatar(avatarUrl: string): Promise<User> {
    return this.request<User>('/users/profile/avatar', {
      method: 'PATCH',
      body: JSON.stringify({ avatar: avatarUrl }),
    });
  }

  // Recipes
  async getRecipes(filters?: any): Promise<Recipe[]> {
    const queryParams = filters ? new URLSearchParams(filters).toString() : '';
    const endpoint = queryParams ? `/recipes?${queryParams}` : '/recipes';
    return this.request<Recipe[]>(endpoint);
  }

  async getMyRecipes(filters?: any): Promise<Recipe[]> {
    const queryParams = filters ? new URLSearchParams(filters).toString() : '';
    const endpoint = queryParams ? `/recipes/my-recipes?${queryParams}` : '/recipes/my-recipes';
    return this.request<Recipe[]>(endpoint);
  }

  async getRecipe(id: string): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${id}`);
  }

  async createRecipe(recipeData: any): Promise<Recipe> {
    return this.request<Recipe>('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
  }

  async updateRecipe(id: string, recipeData: any): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(recipeData),
    });
  }

  async deleteRecipe(id: string): Promise<void> {
    return this.request<void>(`/recipes/${id}`, {
      method: 'DELETE',
    });
  }

  async searchRecipesByIngredients(ingredients: string[]): Promise<Recipe[]> {
    const ingredientsParam = ingredients.join(',');
    return this.request<Recipe[]>(`/recipes/search-by-ingredients?ingredients=${ingredientsParam}`);
  }

  async likeRecipe(id: string): Promise<void> {
    return this.request<void>(`/recipes/${id}/like`, {
      method: 'POST',
    });
  }

  async viewRecipe(id: string): Promise<void> {
    return this.request<void>(`/recipes/${id}/view`, {
      method: 'POST',
    });
  }

  // Fridge Ingredients
  async getFridgeIngredients(): Promise<FridgeIngredient[]> {
    return this.request<FridgeIngredient[]>('/fridge-ingredients');
  }

  async addFridgeIngredient(ingredient: any): Promise<FridgeIngredient> {
    return this.request<FridgeIngredient>('/fridge-ingredients', {
      method: 'POST',
      body: JSON.stringify(ingredient),
    });
  }

  async addMultipleFridgeIngredients(ingredients: any[]): Promise<FridgeIngredient[]> {
    return this.request<FridgeIngredient[]>('/fridge-ingredients/multiple', {
      method: 'POST',
      body: JSON.stringify(ingredients),
    });
  }

  async updateFridgeIngredient(id: string, ingredient: any): Promise<FridgeIngredient> {
    return this.request<FridgeIngredient>(`/fridge-ingredients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(ingredient),
    });
  }

  async deleteFridgeIngredient(id: string): Promise<void> {
    return this.request<void>(`/fridge-ingredients/${id}`, {
      method: 'DELETE',
    });
  }

  async markFridgeIngredientAsExpired(id: string): Promise<FridgeIngredient> {
    return this.request<FridgeIngredient>(`/fridge-ingredients/${id}/expire`, {
      method: 'PATCH',
    });
  }

  async getExpiredIngredients(): Promise<FridgeIngredient[]> {
    return this.request<FridgeIngredient[]>('/fridge-ingredients/expired');
  }

  // Shopping Lists
  async getShoppingLists(): Promise<ShoppingList[]> {
    return this.request<ShoppingList[]>('/shopping-lists');
  }

  async createShoppingList(listData: any): Promise<ShoppingList> {
    return this.request<ShoppingList>('/shopping-lists', {
      method: 'POST',
      body: JSON.stringify(listData),
    });
  }

  async updateShoppingList(id: string, listData: any): Promise<ShoppingList> {
    return this.request<ShoppingList>(`/shopping-lists/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(listData),
    });
  }

  async deleteShoppingList(id: string): Promise<void> {
    return this.request<void>(`/shopping-lists/${id}`, {
      method: 'DELETE',
    });
  }

  async addShoppingListItem(listId: string, item: any): Promise<ShoppingListItem> {
    return this.request<ShoppingListItem>(`/shopping-lists/${listId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateShoppingListItem(listId: string, itemId: string, item: any): Promise<ShoppingListItem> {
    return this.request<ShoppingListItem>(`/shopping-lists/${listId}/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(item),
    });
  }

  async toggleShoppingListItem(listId: string, itemId: string): Promise<ShoppingListItem> {
    return this.request<ShoppingListItem>(`/shopping-lists/${listId}/items/${itemId}/toggle`, {
      method: 'PATCH',
    });
  }

  async deleteShoppingListItem(listId: string, itemId: string): Promise<void> {
    return this.request<void>(`/shopping-lists/${listId}/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async generateShoppingListFromRecipe(recipeId: string): Promise<ShoppingList> {
    return this.request<ShoppingList>(`/shopping-lists/from-recipe/${recipeId}`, {
      method: 'POST',
    });
  }

  // Invalidate queries when data changes
  invalidateQueries() {
    queryClient.invalidateQueries();
  }
}

export const apiService = new ApiService();
export type { Recipe, FridgeIngredient, ShoppingList, User, LoginResponse }; 