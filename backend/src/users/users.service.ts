import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'avatar', 'role', 'createdAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['recipes', 'fridgeIngredients', 'shoppingLists'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'avatar', 'role', 'createdAt', 'updatedAt'],
    });
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(userId);

    // Handle email update with duplicate check
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Handle password update
    if (updateUserDto.password) {
      if (updateUserDto.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters long');
      }
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Handle name validation
    if (updateUserDto.name && updateUserDto.name.length < 2) {
      throw new BadRequestException('Name must be at least 2 characters long');
    }

    // Update user with new data
    Object.assign(user, updateUserDto);
    
    const updatedUser = await this.usersRepository.save(user);
    
    // Remove password from response
    const { password, ...result } = updatedUser;
    return result as User;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async updateStats(id: string): Promise<User> {
    const user = await this.findOne(id);
    
    // Update recipe count
    const recipesCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.recipes', 'recipe')
      .where('user.id = :id', { id })
      .getCount();

    // Update shopping lists count
    const shoppingListsCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.shoppingLists', 'list')
      .where('user.id = :id', { id })
      .getCount();

    user.recipesCount = recipesCount;
    user.shoppingListsCount = shoppingListsCount;

    return this.usersRepository.save(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async updatePreferences(userId: string, preferences: any): Promise<User> {
    const user = await this.findOne(userId);
    
    user.preferences = {
      ...user.preferences,
      ...preferences,
    };

    const updatedUser = await this.usersRepository.save(user);
    const { password, ...result } = updatedUser;
    return result as User;
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    const user = await this.findOne(userId);
    user.avatar = avatarUrl;
    
    const updatedUser = await this.usersRepository.save(user);
    const { password, ...result } = updatedUser;
    return result as User;
  }
} 