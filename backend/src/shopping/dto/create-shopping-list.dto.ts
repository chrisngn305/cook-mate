import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShoppingListItemDto {
  @IsString()
  name: string;

  @IsString()
  quantity: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  recipeId?: string;
}

export class CreateShoppingListDto {
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateShoppingListItemDto)
  @IsArray()
  items?: CreateShoppingListItemDto[];
} 