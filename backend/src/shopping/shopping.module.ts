import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingListsService } from './shopping-lists.service';
import { ShoppingListsController } from './shopping-lists.controller';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListItem } from './shopping-list-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingList, ShoppingListItem])],
  controllers: [ShoppingListsController],
  providers: [ShoppingListsService],
  exports: [ShoppingListsService],
})
export class ShoppingModule {} 