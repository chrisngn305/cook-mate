-- Initialize cook_mate database
USE cook_mate;

-- Create tables if they don't exist
-- This will be handled by TypeORM entities, but we can add any custom initialization here

-- Set timezone
SET time_zone = '+00:00';

-- Create uploads directory reference (for file uploads)
-- This is just a placeholder as actual file storage will be handled by the application 