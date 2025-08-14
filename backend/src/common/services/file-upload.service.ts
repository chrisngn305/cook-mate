import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private readonly uploadsDir = 'uploads';
  private readonly recipesDir = 'recipes';
  private readonly avatarsDir = 'avatars';

  async uploadRecipeImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File too large. Maximum size is 5MB.');
    }

    // Generate unique filename
    const fileExtension = extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    
    // Ensure uploads directory exists
    const uploadPath = join(this.uploadsDir, this.recipesDir);
    await mkdir(uploadPath, { recursive: true });

    // Save file
    const filePath = join(uploadPath, fileName);
    await writeFile(filePath, file.buffer);

    // Return the relative path for storage in database
    return `${this.recipesDir}/${fileName}`;
  }

  async uploadAvatarImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    // Validate file size (2MB limit for avatars)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new BadRequestException('File too large. Maximum size is 2MB.');
    }

    // Generate unique filename
    const fileExtension = extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    
    // Ensure uploads directory exists
    const uploadPath = join(this.uploadsDir, this.avatarsDir);
    await mkdir(uploadPath, { recursive: true });

    // Save file
    const filePath = join(uploadPath, fileName);
    await writeFile(filePath, file.buffer);

    // Return the relative path for storage in database
    return `${this.avatarsDir}/${fileName}`;
  }

  getFileUrl(filePath: string): string | null {
    if (!filePath) return null;
    // Return the full URL path for the uploaded file
    return `/uploads/${filePath}`;
  }
} 