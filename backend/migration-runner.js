const { DataSource } = require('typeorm');
const path = require('path');

// Import compiled entities
const { User } = require('./dist/users/user.entity');
const { Recipe } = require('./dist/recipes/recipe.entity');
const { RecipeIngredient } = require('./dist/recipes/recipe-ingredient.entity');
const { RecipeStep } = require('./dist/recipes/recipe-step.entity');
const { RecipeTag } = require('./dist/recipes/recipe-tag.entity');
const { FridgeIngredient } = require('./dist/fridge/fridge-ingredient.entity');
const { ShoppingList } = require('./dist/shopping/shopping-list.entity');
const { ShoppingListItem } = require('./dist/shopping/shopping-list-item.entity');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cook_mate',
  entities: [User, Recipe, RecipeIngredient, RecipeStep, RecipeTag, FridgeIngredient, ShoppingList, ShoppingListItem],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});

module.exports = AppDataSource; 