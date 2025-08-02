import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Recipe } from '../recipes/recipe.entity';
import { RecipeIngredient } from '../recipes/recipe-ingredient.entity';
import { RecipeStep } from '../recipes/recipe-step.entity';
import { RecipeTag } from '../recipes/recipe-tag.entity';
import { FridgeIngredient } from '../fridge/fridge-ingredient.entity';
import { ShoppingList } from '../shopping/shopping-list.entity';
import { ShoppingListItem } from '../shopping/shopping-list-item.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cook_mate',
  entities: [User, Recipe, RecipeIngredient, RecipeStep, RecipeTag, FridgeIngredient, ShoppingList, ShoppingListItem],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
}); 