import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateFridgeIngredientDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
} 