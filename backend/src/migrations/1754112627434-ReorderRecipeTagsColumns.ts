import { MigrationInterface, QueryRunner } from "typeorm";

export class ReorderRecipeTagsColumns1754112627434 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Reorder columns in recipe_tags table
        // Move usageCount column to come after description column
        await queryRunner.query(`
            ALTER TABLE \`recipe_tags\` 
            MODIFY COLUMN \`usageCount\` int NOT NULL DEFAULT 0 AFTER \`description\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the column order back to original position
        // Move usageCount column back to the beginning
        await queryRunner.query(`
            ALTER TABLE \`recipe_tags\` 
            MODIFY COLUMN \`usageCount\` int NOT NULL DEFAULT 0 FIRST
        `);
    }

}
