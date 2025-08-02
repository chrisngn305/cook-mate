import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FridgeIngredientsService } from './fridge-ingredients.service';
import { CreateFridgeIngredientDto } from './dto/create-fridge-ingredient.dto';
import { UpdateFridgeIngredientDto } from './dto/update-fridge-ingredient.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('fridge-ingredients')
@UseGuards(AuthGuard('jwt'))
export class FridgeIngredientsController {
  constructor(private readonly fridgeIngredientsService: FridgeIngredientsService) {}

  @Post()
  create(@Body() createFridgeIngredientDto: CreateFridgeIngredientDto, @Request() req) {
    return this.fridgeIngredientsService.create(createFridgeIngredientDto, req.user.id);
  }

  @Post('multiple')
  addMultiple(@Body() ingredients: CreateFridgeIngredientDto[], @Request() req) {
    return this.fridgeIngredientsService.addMultiple(ingredients, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.fridgeIngredientsService.findAll(req.user.id);
  }

  @Get('expired')
  findExpired(@Request() req) {
    return this.fridgeIngredientsService.checkExpiredIngredients(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.fridgeIngredientsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFridgeIngredientDto: UpdateFridgeIngredientDto, @Request() req) {
    return this.fridgeIngredientsService.update(id, updateFridgeIngredientDto, req.user.id);
  }

  @Patch(':id/expire')
  markAsExpired(@Param('id') id: string, @Request() req) {
    return this.fridgeIngredientsService.markAsExpired(id, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.fridgeIngredientsService.remove(id, req.user.id);
  }
} 