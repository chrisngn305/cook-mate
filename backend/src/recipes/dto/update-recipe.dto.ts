import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { CreateRecipeDto } from './create-recipe.dto';

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsNumber()
  views?: number;

  @IsOptional()
  @IsNumber()
  likes?: number;
} 