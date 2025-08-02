import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, type Recipe, type FridgeIngredient, type ShoppingList, type User } from './api';

// Recipe hooks
export const useRecipes = (filters?: any) => {
  return useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => apiService.getRecipes(filters),
  });
};

export const useMyRecipes = (filters?: any) => {
  return useQuery({
    queryKey: ['my-recipes', filters],
    queryFn: () => apiService.getMyRecipes(filters),
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => apiService.getRecipe(id),
    enabled: !!id,
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipeData: any) => apiService.createRecipe(recipeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['my-recipes'] });
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, recipeData }: { id: string; recipeData: any }) =>
      apiService.updateRecipe(id, recipeData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recipe', id] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['my-recipes'] });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['my-recipes'] });
    },
  });
};

export const useSearchRecipesByIngredients = (ingredients: string[]) => {
  return useQuery({
    queryKey: ['recipes-by-ingredients', ingredients],
    queryFn: () => apiService.searchRecipesByIngredients(ingredients),
    enabled: ingredients.length > 0,
  });
};

export const useLikeRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.likeRecipe(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['recipe', id] });
    },
  });
};

export const useViewRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.viewRecipe(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['recipe', id] });
    },
  });
};

// Fridge ingredients hooks
export const useFridgeIngredients = () => {
  return useQuery({
    queryKey: ['fridge-ingredients'],
    queryFn: () => apiService.getFridgeIngredients(),
  });
};

export const useAddFridgeIngredient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ingredient: any) => apiService.addFridgeIngredient(ingredient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fridge-ingredients'] });
    },
  });
};

export const useAddMultipleFridgeIngredients = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ingredients: any[]) => apiService.addMultipleFridgeIngredients(ingredients),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fridge-ingredients'] });
    },
  });
};

export const useUpdateFridgeIngredient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ingredient }: { id: string; ingredient: any }) =>
      apiService.updateFridgeIngredient(id, ingredient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fridge-ingredients'] });
    },
  });
};

export const useDeleteFridgeIngredient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteFridgeIngredient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fridge-ingredients'] });
    },
  });
};

export const useMarkFridgeIngredientAsExpired = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.markFridgeIngredientAsExpired(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fridge-ingredients'] });
    },
  });
};

export const useExpiredIngredients = () => {
  return useQuery({
    queryKey: ['expired-ingredients'],
    queryFn: () => apiService.getExpiredIngredients(),
  });
};

// Shopping lists hooks
export const useShoppingLists = () => {
  return useQuery({
    queryKey: ['shopping-lists'],
    queryFn: () => apiService.getShoppingLists(),
  });
};

export const useCreateShoppingList = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (listData: any) => apiService.createShoppingList(listData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
};

export const useUpdateShoppingList = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, listData }: { id: string; listData: any }) =>
      apiService.updateShoppingList(id, listData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
};

export const useDeleteShoppingList = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteShoppingList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
};

export const useAddShoppingListItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ listId, item }: { listId: string; item: any }) =>
      apiService.addShoppingListItem(listId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
};

export const useUpdateShoppingListItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ listId, itemId, item }: { listId: string; itemId: string; item: any }) =>
      apiService.updateShoppingListItem(listId, itemId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
};

export const useToggleShoppingListItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ listId, itemId }: { listId: string; itemId: string }) =>
      apiService.toggleShoppingListItem(listId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
};

export const useDeleteShoppingListItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ listId, itemId }: { listId: string; itemId: string }) =>
      apiService.deleteShoppingListItem(listId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
};

export const useGenerateShoppingListFromRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipeId: string) => apiService.generateShoppingListFromRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
};

// User hooks
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiService.getProfile(),
  });
}; 