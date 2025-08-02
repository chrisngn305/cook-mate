import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Recipe } from './recipes/recipe.entity';
import { RecipeIngredient } from './recipes/recipe-ingredient.entity';
import { RecipeStep } from './recipes/recipe-step.entity';
import { RecipeTag, TagType } from './recipes/recipe-tag.entity';
import { FridgeIngredient } from './fridge/fridge-ingredient.entity';
import { ShoppingList } from './shopping/shopping-list.entity';
import { ShoppingListItem } from './shopping/shopping-list-item.entity';
import { DifficultyLevel } from './recipes/recipe.entity';
import * as bcrypt from 'bcrypt';
import { getDatabaseConfig } from './config/database.config';

async function bootstrap() {
  console.log('Starting database seeding...');

  // Create data source
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'mysql',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'cookmate',
    password: process.env.DB_PASSWORD || 'cookmate123',
    database: process.env.DB_NAME || 'cook_mate',
    entities: [User, Recipe, RecipeIngredient, RecipeStep, RecipeTag, FridgeIngredient, ShoppingList, ShoppingListItem],
    synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    // Create tags
    const tags = await createTags(dataSource);

    // Create users
    const users = await createUsers(dataSource);

    // Create recipes
    await createRecipes(dataSource, users[0], tags);

    // Create fridge ingredients
    await createFridgeIngredients(dataSource, users[0]);

    // Create shopping lists
    await createShoppingLists(dataSource, users[0]);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await dataSource.destroy();
  }
}

async function createTags(dataSource: DataSource): Promise<RecipeTag[]> {
  const tagRepository = dataSource.getRepository(RecipeTag);
  
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

  const tags = tagData.map(tag => tagRepository.create(tag));
  return tagRepository.save(tags);
}

async function createUsers(dataSource: DataSource): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);
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
      daysStreak: 22,
      preferences: {
        cuisine: ['Asian', 'Mediterranean'],
        dietaryRestrictions: ['vegetarian'],
        cookingSkill: 'advanced' as const,
        favoriteIngredients: ['ginger', 'soy sauce', 'lemongrass'],
      },
    },
  ];

  const userEntities = users.map(user => userRepository.create(user));
  return userRepository.save(userEntities);
}

async function createRecipes(dataSource: DataSource, user: User, tags: RecipeTag[]): Promise<Recipe[]> {
  const recipeRepository = dataSource.getRepository(Recipe);
  const ingredientRepository = dataSource.getRepository(RecipeIngredient);
  const stepRepository = dataSource.getRepository(RecipeStep);

  const recipes = [
    {
      title: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
      difficulty: DifficultyLevel.EASY,
      cookingTime: 35, // prepTime + cookTime
      servings: 4,
      image: undefined,
      tags: [tags[0], tags[4]], // Easy to Cook, Italian
      ingredients: [
        { name: 'Spaghetti', quantity: 400, unit: 'g', order: 1 },
        { name: 'Eggs', quantity: 4, unit: 'pieces', order: 2 },
        { name: 'Parmesan cheese', quantity: 100, unit: 'g', order: 3 },
        { name: 'Pancetta', quantity: 150, unit: 'g', order: 4 },
        { name: 'Black pepper', quantity: 2, unit: 'tsp', order: 5 },
      ],
      steps: [
        { order: 1, description: 'Cook spaghetti according to package instructions' },
        { order: 2, description: 'Fry pancetta until crispy' },
        { order: 3, description: 'Beat eggs with grated parmesan' },
        { order: 4, description: 'Combine pasta with egg mixture and pancetta' },
      ],
    },
    {
      title: 'Chicken Stir Fry',
      description: 'Quick and healthy Asian stir fry with vegetables',
      difficulty: DifficultyLevel.MEDIUM,
      cookingTime: 35, // prepTime + cookTime
      servings: 3,
      image: undefined,
      tags: [tags[1], tags[5]], // Quick, Asian
      ingredients: [
        { name: 'Chicken breast', quantity: 300, unit: 'g', order: 1 },
        { name: 'Broccoli', quantity: 200, unit: 'g', order: 2 },
        { name: 'Soy sauce', quantity: 3, unit: 'tbsp', order: 3 },
        { name: 'Ginger', quantity: 1, unit: 'tbsp', order: 4 },
        { name: 'Garlic', quantity: 3, unit: 'cloves', order: 5 },
      ],
      steps: [
        { order: 1, description: 'Cut chicken into bite-sized pieces' },
        { order: 2, description: 'Stir fry chicken until golden' },
        { order: 3, description: 'Add vegetables and stir fry' },
        { order: 4, description: 'Add soy sauce and serve' },
      ],
    },
  ];

  for (const recipeData of recipes) {
    const recipe = recipeRepository.create({
      ...recipeData,
      user,
      tags: recipeData.tags,
    });
    const savedRecipe = await recipeRepository.save(recipe);

    // Create ingredients
    const ingredients = recipeData.ingredients.map(ing => 
      ingredientRepository.create({ ...ing, recipe: savedRecipe })
    );
    await ingredientRepository.save(ingredients);

    // Create steps
    const steps = recipeData.steps.map(step => 
      stepRepository.create({ ...step, recipe: savedRecipe })
    );
    await stepRepository.save(steps);
  }

  return recipeRepository.find({ where: { user: { id: user.id } } });
}

async function createFridgeIngredients(dataSource: DataSource, user: User): Promise<void> {
  const fridgeRepository = dataSource.getRepository(FridgeIngredient);

  const ingredients = [
    {
      name: 'Milk',
      quantity: 1,
      unit: 'L',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      category: 'Dairy',
    },
    {
      name: 'Eggs',
      quantity: 12,
      unit: 'pieces',
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      category: 'Dairy',
    },
    {
      name: 'Chicken breast',
      quantity: 500,
      unit: 'g',
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      category: 'Meat',
    },
  ];

  const fridgeIngredients = ingredients.map(ing => 
    fridgeRepository.create({ ...ing, user })
  );
  await fridgeRepository.save(fridgeIngredients);
}

async function createShoppingLists(dataSource: DataSource, user: User): Promise<void> {
  const shoppingListRepository = dataSource.getRepository(ShoppingList);
  const itemRepository = dataSource.getRepository(ShoppingListItem);

  const shoppingList = shoppingListRepository.create({
    name: 'Weekly Groceries',
    user,
    isCompleted: false,
  });
  const savedList = await shoppingListRepository.save(shoppingList);

  const items = [
    { name: 'Bread', quantity: 2, unit: 'loaves', isCompleted: false },
    { name: 'Tomatoes', quantity: 500, unit: 'g', isCompleted: false },
    { name: 'Pasta', quantity: 500, unit: 'g', isCompleted: false },
    { name: 'Cheese', quantity: 200, unit: 'g', isCompleted: false },
  ];

  const shoppingItems = items.map(item => 
    itemRepository.create({ ...item, shoppingList: savedList })
  );
  await itemRepository.save(shoppingItems);
}

bootstrap(); 