/*
  Warnings:

  - You are about to drop the `stream_subjects` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stream_id` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `stream_subjects` DROP FOREIGN KEY `stream_subjects_stream_id_fkey`;

-- DropForeignKey
ALTER TABLE `stream_subjects` DROP FOREIGN KEY `stream_subjects_subject_id_fkey`;

-- AlterTable
ALTER TABLE `subjects` ADD COLUMN `stream_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `stream_subjects`;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_stream_id_fkey` FOREIGN KEY (`stream_id`) REFERENCES `streams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
