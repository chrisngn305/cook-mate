import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListItem } from './shopping-list-item.entity';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from './dto/update-shopping-list.dto';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListsRepository: Repository<ShoppingList>,
    @InjectRepository(ShoppingListItem)
    private shoppingListItemsRepository: Repository<ShoppingListItem>,
  ) {}

  async create(createShoppingListDto: CreateShoppingListDto, userId: string): Promise<ShoppingList> {
    const shoppingList = this.shoppingListsRepository.create({
      ...createShoppingListDto,
      userId,
    });

    const savedList = await this.shoppingListsRepository.save(shoppingList);

    // Add items if provided
    if (createShoppingListDto.items && createShoppingListDto.items.length > 0) {
      const items = createShoppingListDto.items.map(item => 
        this.shoppingListItemsRepository.create({
          ...item,
          shoppingListId: savedList.id,
        })
      );
      await this.shoppingListItemsRepository.save(items);
    }

    return this.findOne(savedList.id, userId);
  }

  async findAll(userId: string): Promise<ShoppingList[]> {
    return this.shoppingListsRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListsRepository.findOne({
      where: { id, userId },
      relations: ['items'],
    });

    if (!shoppingList) {
      throw new NotFoundException(`Shopping list with ID ${id} not found`);
    }

    return shoppingList;
  }

  async update(id: string, updateShoppingListDto: UpdateShoppingListDto, userId: string): Promise<ShoppingList> {
    const shoppingList = await this.findOne(id, userId);
    Object.assign(shoppingList, updateShoppingListDto);
    return this.shoppingListsRepository.save(shoppingList);
  }

  async remove(id: string, userId: string): Promise<void> {
    const shoppingList = await this.findOne(id, userId);
    await this.shoppingListsRepository.remove(shoppingList);
  }

  async addItem(listId: string, item: any, userId: string): Promise<ShoppingListItem> {
    await this.findOne(listId, userId); // Verify list exists and belongs to user
    
    const shoppingItemData = {
      ...item,
      shoppingListId: listId,
    };

    const result = await this.shoppingListItemsRepository.insert(shoppingItemData);
    const savedItem = await this.shoppingListItemsRepository.findOne({
      where: { id: result.identifiers[0].id }
    });
    
    return savedItem!;
  }

  async updateItem(listId: string, itemId: string, updateData: any, userId: string): Promise<ShoppingListItem> {
    await this.findOne(listId, userId); // Verify list exists and belongs to user
    
    const item = await this.shoppingListItemsRepository.findOne({
      where: { id: itemId, shoppingListId: listId },
    });

    if (!item) {
      throw new NotFoundException(`Shopping list item with ID ${itemId} not found`);
    }

    Object.assign(item, updateData);
    return this.shoppingListItemsRepository.save(item);
  }

  async removeItem(listId: string, itemId: string, userId: string): Promise<void> {
    await this.findOne(listId, userId); // Verify list exists and belongs to user
    
    const item = await this.shoppingListItemsRepository.findOne({
      where: { id: itemId, shoppingListId: listId },
    });

    if (!item) {
      throw new NotFoundException(`Shopping list item with ID ${itemId} not found`);
    }

    await this.shoppingListItemsRepository.remove(item);
  }

  async toggleItem(listId: string, itemId: string, userId: string): Promise<ShoppingListItem> {
    const item = await this.updateItem(listId, itemId, {}, userId);
    item.isCompleted = !item.isCompleted;
    return this.shoppingListItemsRepository.save(item);
  }

  async markAsCompleted(id: string, userId: string): Promise<ShoppingList> {
    const shoppingList = await this.findOne(id, userId);
    shoppingList.isCompleted = true;
    shoppingList.completedAt = new Date();
    return this.shoppingListsRepository.save(shoppingList);
  }

  async generateFromRecipe(recipeId: string, userId: string): Promise<ShoppingList> {
    // This would integrate with the recipes service to get ingredients
    // For now, creating a basic shopping list
    const shoppingList = this.shoppingListsRepository.create({
      name: `Shopping List from Recipe`,
      userId,
    });

    return this.shoppingListsRepository.save(shoppingList);
  }
} 