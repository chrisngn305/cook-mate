import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Recipe } from '../recipes/recipe.entity';
import { RecipeIngredient } from '../recipes/recipe-ingredient.entity';
import { RecipeStep } from '../recipes/recipe-step.entity';
import { RecipeTag, TagType } from '../recipes/recipe-tag.entity';
import { FridgeIngredient } from '../fridge/fridge-ingredient.entity';
import { ShoppingList } from '../shopping/shopping-list.entity';
import { ShoppingListItem } from '../shopping/shopping-list-item.entity';
import { DifficultyLevel } from '../recipes/recipe.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private ingredientsRepository: Repository<RecipeIngredient>,
    @InjectRepository(RecipeStep)
    private stepsRepository: Repository<RecipeStep>,
    @InjectRepository(RecipeTag)
    private tagsRepository: Repository<RecipeTag>,
    @InjectRepository(FridgeIngredient)
    private fridgeIngredientsRepository: Repository<FridgeIngredient>,
    @InjectRepository(ShoppingList)
    private shoppingListsRepository: Repository<ShoppingList>,
    @InjectRepository(ShoppingListItem)
    private shoppingListItemsRepository: Repository<ShoppingListItem>,
  ) {}

  async seed() {
    console.log('Starting database seeding...');

    // Create tags
    const tags = await this.createTags();

    // Create users
    const users = await this.createUsers();

    // Create recipes
    const recipes = await this.createRecipes(users[0], tags);

    // Create fridge ingredients
    await this.createFridgeIngredients(users[0]);

    // Create shopping lists
    await this.createShoppingLists(users[0]);

    console.log('Database seeding completed!');
  }

  private async createTags(): Promise<RecipeTag[]> {
    const tagData = [
      { name: 'Easy to Cook', type: TagType.DIFFICULTY, icon: 'checkmark-circle' },
      { name: 'Quick (< 30min)', type: TagType.DIFFICULTY, icon: 'time' },
      { name: 'Cold Day', type: TagType.OCCASION, icon: 'snow' },
      { name: 'Party', type: TagType.OCCASION, icon: 'people' },
      { name: 'Italian', type: TagType.CUISINE, icon: 'restaurant' },
      { name: 'Asian', type: TagType.CUISINE, icon: 'restaurant' },
      { name: 'Mexican', type: TagType.CUISINE, icon: 'restaurant' },
      { name: 'Comfort Food', type: TagType.MOOD, icon: 'heart' },
      { name: 'Healthy', type: TagType.MOOD, icon: 'leaf' },
      { name: 'Summer', type: TagType.SEASON, icon: 'sunny' },
      { name: 'Winter', type: TagType.SEASON, icon: 'snow' },
    ];

    const tags = tagData.map(tag => this.tagsRepository.create(tag));
    return this.tagsRepository.save(tags);
  }

  private async createUsers(): Promise<User[]> {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        email: 'john@example.com',
        password: hashedPassword,
        name: 'Chef John',
        avatar: undefined,
        recipesCount: 24,
        favoritesCount: 12,
        shoppingListsCount: 8,
        daysStreak: 15,
        preferences: {
          cuisine: ['Italian', 'Mexican'],
          dietaryRestrictions: [],
          cookingSkill: 'intermediate' as const,
          favoriteIngredients: ['garlic', 'olive oil', 'tomatoes'],
        },
      },
      {
        email: 'sarah@example.com',
        password: hashedPassword,
        name: 'Chef Sarah',
        avatar: undefined,
        recipesCount: 18,
        favoritesCount: 8,
        shoppingListsCount: 5,
        daysStreak: 12,
        preferences: {
          cuisine: ['Asian', 'Mediterranean'],
          dietaryRestrictions: ['vegetarian'],
          cookingSkill: 'advanced' as const,
          favoriteIngredients: ['ginger', 'soy sauce', 'vegetables'],
        },
      },
    ];

    const userEntities = users.map((user) => this.usersRepository.create(user));
    return this.usersRepository.save(userEntities);
  }

  private async createRecipes(user: User, tags: RecipeTag[]): Promise<Recipe[]> {
    const recipes = [
      {
        title: 'Pasta Carbonara',
        description: 'A classic Italian pasta dish with eggs, cheese, and pancetta',
        cookingTime: 25,
        difficulty: DifficultyLevel.EASY,
        servings: 4,
        cuisine: 'Italian',
        occasion: ['dinner', 'date night'],
        mood: ['comfort food'],
        season: ['all year'],
        isPublic: true,
        ingredients: [
          { name: 'Spaghetti', quantity: 400.0, unit: 'g', order: 1 },
          { name: 'Eggs', quantity: 4.0, unit: 'pieces', order: 2 },
          { name: 'Parmesan cheese', quantity: 100.0, unit: 'g', order: 3 },
          { name: 'Pancetta', quantity: 150.0, unit: 'g', order: 4 },
          { name: 'Black pepper', quantity: 2.0, unit: 'tsp', order: 5 },
        ],
        steps: [
          { order: 1, description: 'Bring a large pot of salted water to boil', time: 5 },
          { order: 2, description: 'Cook spaghetti according to package directions', time: 10 },
          { order: 3, description: 'Meanwhile, cook pancetta in a large skillet until crispy', time: 8 },
          { order: 4, description: 'Beat eggs and cheese in a bowl', time: 2 },
          { order: 5, description: 'Drain pasta and add to skillet with pancetta', time: 2 },
          { order: 6, description: 'Remove from heat and quickly stir in egg mixture', time: 1 },
        ],
      },
      {
        title: 'Chicken Stir Fry',
        description: 'Quick and healthy Asian stir fry with vegetables',
        cookingTime: 20,
        difficulty: DifficultyLevel.MEDIUM,
        servings: 4,
        cuisine: 'Asian',
        occasion: ['dinner', 'weeknight'],
        mood: ['healthy'],
        season: ['all year'],
        isPublic: true,
        ingredients: [
          { name: 'Chicken breast', quantity: 500.0, unit: 'g', order: 1 },
          { name: 'Broccoli', quantity: 300.0, unit: 'g', order: 2 },
          { name: 'Soy sauce', quantity: 60.0, unit: 'ml', order: 3 },
          { name: 'Ginger', quantity: 2.0, unit: 'tbsp', order: 4 },
          { name: 'Garlic', quantity: 4.0, unit: 'cloves', order: 5 },
        ],
        steps: [
          { order: 1, description: 'Cut chicken into bite-sized pieces', time: 5 },
          { order: 2, description: 'Heat oil in a wok or large skillet', time: 2 },
          { order: 3, description: 'Stir fry chicken until golden brown', time: 8 },
          { order: 4, description: 'Add vegetables and stir fry for 3 minutes', time: 3 },
          { order: 5, description: 'Add sauce and cook for 2 more minutes', time: 2 },
        ],
      },
      {
        title: 'Beef Stew',
        description: 'Hearty beef stew perfect for cold days',
        cookingTime: 120,
        difficulty: DifficultyLevel.HARD,
        servings: 6,
        cuisine: 'American',
        occasion: ['dinner', 'family meal'],
        mood: ['comfort food'],
        season: ['winter', 'fall'],
        isPublic: true,
        ingredients: [
          { name: 'Beef chuck', quantity: 1000.0, unit: 'g', order: 1 },
          { name: 'Potatoes', quantity: 500.0, unit: 'g', order: 2 },
          { name: 'Carrots', quantity: 300.0, unit: 'g', order: 3 },
          { name: 'Onions', quantity: 200.0, unit: 'g', order: 4 },
          { name: 'Beef broth', quantity: 1000.0, unit: 'ml', order: 5 },
        ],
        steps: [
          { order: 1, description: 'Cut beef into cubes and season with salt and pepper', time: 10 },
          { order: 2, description: 'Brown beef in batches in a large pot', time: 20 },
          { order: 3, description: 'Add vegetables and broth', time: 10 },
          { order: 4, description: 'Simmer for 1.5 hours until meat is tender', time: 90 },
        ],
      },
      {
        title: 'Pizza Margherita',
        description: 'Classic Italian pizza with tomato, mozzarella, and basil',
        cookingTime: 45,
        difficulty: DifficultyLevel.MEDIUM,
        servings: 4,
        cuisine: 'Italian',
        occasion: ['dinner', 'party'],
        mood: ['fun'],
        season: ['all year'],
        isPublic: true,
        ingredients: [
          { name: 'Pizza dough', quantity: 1.0, unit: 'piece', order: 1 },
          { name: 'Tomato sauce', quantity: 200.0, unit: 'ml', order: 2 },
          { name: 'Mozzarella', quantity: 200.0, unit: 'g', order: 3 },
          { name: 'Fresh basil', quantity: 20.0, unit: 'g', order: 4 },
          { name: 'Olive oil', quantity: 30.0, unit: 'ml', order: 5 },
        ],
        steps: [
          { order: 1, description: 'Preheat oven to 450°F (230°C)', time: 10 },
          { order: 2, description: 'Roll out pizza dough on a floured surface', time: 5 },
          { order: 3, description: 'Spread tomato sauce evenly over dough', time: 3 },
          { order: 4, description: 'Add mozzarella and bake for 15-20 minutes', time: 20 },
          { order: 5, description: 'Top with fresh basil and drizzle with olive oil', time: 2 },
        ],
      },
      {
        title: 'Chocolate Cake',
        description: 'Rich and moist chocolate cake with chocolate frosting',
        cookingTime: 90,
        difficulty: DifficultyLevel.HARD,
        servings: 12,
        cuisine: 'American',
        occasion: ['dessert', 'party', 'birthday'],
        mood: ['celebration'],
        season: ['all year'],
        isPublic: true,
        ingredients: [
          { name: 'All-purpose flour', quantity: 300.0, unit: 'g', order: 1 },
          { name: 'Cocoa powder', quantity: 60.0, unit: 'g', order: 2 },
          { name: 'Sugar', quantity: 400.0, unit: 'g', order: 3 },
          { name: 'Eggs', quantity: 4.0, unit: 'pieces', order: 4 },
          { name: 'Milk', quantity: 240.0, unit: 'ml', order: 5 },
          { name: 'Vegetable oil', quantity: 120.0, unit: 'ml', order: 6 },
        ],
        steps: [
          { order: 1, description: 'Preheat oven to 350°F (175°C) and grease cake pans', time: 10 },
          { order: 2, description: 'Mix dry ingredients in a large bowl', time: 5 },
          { order: 3, description: 'Beat wet ingredients in another bowl', time: 5 },
          { order: 4, description: 'Combine wet and dry ingredients', time: 3 },
          { order: 5, description: 'Pour into pans and bake for 30-35 minutes', time: 35 },
          { order: 6, description: 'Let cool completely before frosting', time: 30 },
        ],
      },
    ];

    const savedRecipes: Recipe[] = [];
    for (const recipeData of recipes) {
      const { ingredients, steps, ...recipeInfo } = recipeData;
      
      const recipe = this.recipesRepository.create({
        ...recipeInfo,
        userId: user.id,
      });

      const savedRecipe = await this.recipesRepository.save(recipe);

      // Save ingredients
      const recipeIngredients = ingredients.map(ingredient => 
        this.ingredientsRepository.create({
          ...ingredient,
          recipeId: savedRecipe.id,
        })
      );
      await this.ingredientsRepository.save(recipeIngredients);

      // Save steps
      const recipeSteps = steps.map(step => 
        this.stepsRepository.create({
          ...step,
          recipeId: savedRecipe.id,
        })
      );
      await this.stepsRepository.save(recipeSteps);

      savedRecipes.push(savedRecipe);
    }

    return savedRecipes;
  }

  private async createFridgeIngredients(user: User): Promise<void> {
    const ingredients = [
      { name: 'tomatoes', quantity: 6.0, unit: 'pieces' },
      { name: 'onions', quantity: 3.0, unit: 'pieces' },
      { name: 'chicken', quantity: 500.0, unit: 'g' },
      { name: 'garlic', quantity: 10.0, unit: 'cloves' },
      { name: 'olive oil', quantity: 200.0, unit: 'ml' },
      { name: 'bread', quantity: 1.0, unit: 'loaf' },
      { name: 'eggs', quantity: 12.0, unit: 'pieces' },
      { name: 'milk', quantity: 1000.0, unit: 'ml' },
      { name: 'cheese', quantity: 200.0, unit: 'g' },
      { name: 'butter', quantity: 250.0, unit: 'g' },
    ];

    const fridgeIngredients = ingredients.map(ingredient => 
      this.fridgeIngredientsRepository.create({
        ...ingredient,
        userId: user.id,
      })
    );

    await this.fridgeIngredientsRepository.save(fridgeIngredients);
  }

  private async createShoppingLists(user: User): Promise<void> {
    const shoppingLists = [
      {
        name: 'Weekly Groceries',
        items: [
          { name: 'Tomatoes', quantity: 4.0, unit: 'pieces', isCompleted: false },
          { name: 'Onions', quantity: 2.0, unit: 'pieces', isCompleted: true },
          { name: 'Chicken breast', quantity: 500.0, unit: 'g', isCompleted: false },
          { name: 'Pasta', quantity: 250.0, unit: 'g', isCompleted: false },
        ],
      },
      {
        name: 'Party Shopping',
        items: [
          { name: 'Pizza dough', quantity: 2.0, unit: 'pieces', isCompleted: false },
          { name: 'Mozzarella', quantity: 400.0, unit: 'g', isCompleted: false },
          { name: 'Tomato sauce', quantity: 400.0, unit: 'ml', isCompleted: false },
          { name: 'Fresh basil', quantity: 40.0, unit: 'g', isCompleted: false },
        ],
      },
    ];

    for (const listData of shoppingLists) {
      const { items, ...listInfo } = listData;
      
      const shoppingList = this.shoppingListsRepository.create({
        ...listInfo,
        userId: user.id,
      });

      const savedList = await this.shoppingListsRepository.save(shoppingList);

      // Save items
      const listItems = items.map(item => 
        this.shoppingListItemsRepository.create({
          ...item,
          shoppingListId: savedList.id,
        })
      );

      await this.shoppingListItemsRepository.save(listItems);
    }
  }
} 