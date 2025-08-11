import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => {
    if (value) {
      const date = new Date(value);
      return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    }
    return value;
  })
  expiryDate?: string;
} 