import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Recipe } from './src/recipes/recipe.entity';
import { RecipeIngredient } from './src/recipes/recipe-ingredient.entity';
import { RecipeStep } from './src/recipes/recipe-step.entity';
import { RecipeTag } from './src/recipes/recipe-tag.entity';
import { FridgeIngredient } from './src/fridge/fridge-ingredient.entity';
import { ShoppingList } from './src/shopping/shopping-list.entity';
import { ShoppingListItem } from './src/shopping/shopping-list-item.entity';

export default new DataSource({
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