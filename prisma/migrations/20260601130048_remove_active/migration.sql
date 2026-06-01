/*
  Warnings:

  - You are about to drop the `school_active_subjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `school_active_subjects` DROP FOREIGN KEY `school_active_subjects_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `school_active_subjects` DROP FOREIGN KEY `school_active_subjects_subject_id_fkey`;

-- DropTable
DROP TABLE `school_active_subjects`;
