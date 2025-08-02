import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ShoppingListsService } from './shopping-lists.service';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from './dto/update-shopping-list.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('shopping-lists')
@UseGuards(AuthGuard('jwt'))
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {}

  @Post()
  create(@Body() createShoppingListDto: CreateShoppingListDto, @Request() req) {
    return this.shoppingListsService.create(createShoppingListDto, req.user.id);
  }

  @Post('from-recipe/:recipeId')
  generateFromRecipe(@Param('recipeId') recipeId: string, @Request() req) {
    return this.shoppingListsService.generateFromRecipe(recipeId, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.shoppingListsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.shoppingListsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoppingListDto: UpdateShoppingListDto, @Request() req) {
    return this.shoppingListsService.update(id, updateShoppingListDto, req.user.id);
  }

  @Patch(':id/complete')
  markAsCompleted(@Param('id') id: string, @Request() req) {
    return this.shoppingListsService.markAsCompleted(id, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.shoppingListsService.remove(id, req.user.id);
  }

  // Shopping list items endpoints
  @Post(':id/items')
  addItem(@Param('id') listId: string, @Body() item: any, @Request() req) {
    return this.shoppingListsService.addItem(listId, item, req.user.id);
  }

  @Patch(':id/items/:itemId')
  updateItem(@Param('id') listId: string, @Param('itemId') itemId: string, @Body() updateData: any, @Request() req) {
    return this.shoppingListsService.updateItem(listId, itemId, updateData, req.user.id);
  }

  @Patch(':id/items/:itemId/toggle')
  toggleItem(@Param('id') listId: string, @Param('itemId') itemId: string, @Request() req) {
    return this.shoppingListsService.toggleItem(listId, itemId, req.user.id);
  }

  @Delete(':id/items/:itemId')
  removeItem(@Param('id') listId: string, @Param('itemId') itemId: string, @Request() req) {
    return this.shoppingListsService.removeItem(listId, itemId, req.user.id);
  }
} 