/*
  Warnings:

  - You are about to drop the column `language` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `user_classes` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - Added the required column `role_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_classes` DROP FOREIGN KEY `user_classes_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_classes` DROP FOREIGN KEY `user_classes_user_id_fkey`;

-- DropIndex
DROP INDEX `user_classes_subject_id_fkey` ON `user_classes`;

-- AlterTable
ALTER TABLE `subjects` DROP COLUMN `language`;

-- AlterTable
ALTER TABLE `user_classes` DROP COLUMN `subject_id`;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `role`,
    ADD COLUMN `role_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`user_id`);

-- CreateTable
CREATE TABLE `chapters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `language` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chapters` ADD CONSTRAINT `chapters_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_classes` ADD CONSTRAINT `user_classes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
