import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixOrderFields1754208000000 implements MigrationInterface {
  name = 'FixOrderFields1754208000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add default values for order fields
    await queryRunner.query(`
      ALTER TABLE \`recipe_ingredients\` 
      MODIFY COLUMN \`order\` int NOT NULL DEFAULT 0
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`recipe_steps\` 
      MODIFY COLUMN \`order\` int NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove default values
    await queryRunner.query(`
      ALTER TABLE \`recipe_ingredients\` 
      MODIFY COLUMN \`order\` int NOT NULL
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`recipe_steps\` 
      MODIFY COLUMN \`order\` int NOT NULL
    `);
  }
} 