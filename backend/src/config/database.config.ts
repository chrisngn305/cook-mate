import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Recipe } from '../recipes/recipe.entity';
import { RecipeIngredient } from '../recipes/recipe-ingredient.entity';
import { RecipeStep } from '../recipes/recipe-step.entity';
import { RecipeTag } from '../recipes/recipe-tag.entity';
import { FridgeIngredient } from '../fridge/fridge-ingredient.entity';
import { ShoppingList } from '../shopping/shopping-list.entity';
import { ShoppingListItem } from '../shopping/shopping-list-item.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 3306),
  username: configService.get('DB_USERNAME', 'root'),
  password: configService.get('DB_PASSWORD', ''),
  database: configService.get('DB_NAME', 'cook_mate'),
  entities: [User, Recipe, RecipeIngredient, RecipeStep, RecipeTag, FridgeIngredient, ShoppingList, ShoppingListItem],
  synchronize: configService.get('NODE_ENV') !== 'production',
  logging: configService.get('NODE_ENV') === 'development',
  ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
}); 