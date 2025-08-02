import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateFridgeIngredientDto } from './create-fridge-ingredient.dto';

export class UpdateFridgeIngredientDto extends PartialType(CreateFridgeIngredientDto) {
  @IsOptional()
  @IsBoolean()
  isExpired?: boolean;
} 