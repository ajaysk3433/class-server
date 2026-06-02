/*
  Warnings:

  - The primary key for the `class_subjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class_stream_section_id` on the `class_subjects` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `subjects` table. All the data in the column will be lost.
  - Added the required column `class_id` to the `class_subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `board` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `class_subjects` DROP FOREIGN KEY `class_subjects_class_stream_section_id_fkey`;

-- DropForeignKey
ALTER TABLE `subjects` DROP FOREIGN KEY `subjects_school_id_fkey`;

-- DropIndex
DROP INDEX `subjects_school_id_fkey` ON `subjects`;

-- AlterTable
ALTER TABLE `class_subjects` DROP PRIMARY KEY,
    DROP COLUMN `class_stream_section_id`,
    ADD COLUMN `class_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`class_id`, `subject_id`);

-- AlterTable
ALTER TABLE `subjects` DROP COLUMN `school_id`,
    ADD COLUMN `board` VARCHAR(255) NOT NULL,
    ADD COLUMN `language` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `class_subjects` ADD CONSTRAINT `class_subjects_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
