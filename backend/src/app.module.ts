import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { FridgeModule } from './fridge/fridge.module';
import { ShoppingModule } from './shopping/shopping.module';
import { AuthModule } from './auth/auth.module';
import { getDatabaseConfig } from './config/database.config';
import { getJwtConfig } from './config/jwt.config';
import { SeederService } from './database/seeder';
import { User } from './users/user.entity';
import { Recipe } from './recipes/recipe.entity';
import { RecipeIngredient } from './recipes/recipe-ingredient.entity';
import { RecipeStep } from './recipes/recipe-step.entity';
import { RecipeTag } from './recipes/recipe-tag.entity';
import { FridgeIngredient } from './fridge/fridge-ingredient.entity';
import { ShoppingList } from './shopping/shopping-list.entity';
import { ShoppingListItem } from './shopping/shopping-list-item.entity';
import { FileUploadModule } from './common/services/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
        fallthrough: false,
        etag: true,
        lastModified: true,
      },
    }),
    PassportModule,
    UsersModule,
    RecipesModule,
    FridgeModule,
    ShoppingModule,
    AuthModule,
    FileUploadModule,
    TypeOrmModule.forFeature([
      User,
      Recipe,
      RecipeIngredient,
      RecipeStep,
      RecipeTag,
      FridgeIngredient,
      ShoppingList,
      ShoppingListItem,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}