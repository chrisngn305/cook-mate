import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FridgeIngredientsService } from './fridge-ingredients.service';
import { FridgeIngredientsController } from './fridge-ingredients.controller';
import { FridgeIngredient } from './fridge-ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FridgeIngredient])],
  controllers: [FridgeIngredientsController],
  providers: [FridgeIngredientsService],
  exports: [FridgeIngredientsService],
})
export class FridgeModule {} 