-- CreateTable
CREATE TABLE `schools` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',

    UNIQUE INDEX `schools_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `streams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stream_name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(70) NOT NULL,

    UNIQUE INDEX `streams_stream_name_key`(`stream_name`),
    UNIQUE INDEX `streams_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(70) NOT NULL,

    UNIQUE INDEX `classes_class_name_key`(`class_name`),
    UNIQUE INDEX `classes_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `section_name` VARCHAR(10) NOT NULL,
    `slug` VARCHAR(15) NOT NULL,

    UNIQUE INDEX `sections_section_name_key`(`section_name`),
    UNIQUE INDEX `sections_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NULL,
    `subject_name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,

    UNIQUE INDEX `subjects_school_id_slug_key`(`school_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'student',
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_stream_sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `class_id` INTEGER NOT NULL,
    `stream_id` INTEGER NULL,
    `section_id` INTEGER NOT NULL,
    `slug` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `class_stream_sections_slug_key`(`slug`),
    UNIQUE INDEX `class_stream_sections_school_id_class_id_stream_id_section_i_key`(`school_id`, `class_id`, `stream_id`, `section_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_classes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `class_stream_section_id` INTEGER NOT NULL,
    `subject_id` INTEGER NULL,

    UNIQUE INDEX `user_classes_user_id_class_stream_section_id_subject_id_key`(`user_id`, `class_stream_section_id`, `subject_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_stream_sections` ADD CONSTRAINT `class_stream_sections_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_stream_sections` ADD CONSTRAINT `class_stream_sections_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_stream_sections` ADD CONSTRAINT `class_stream_sections_stream_id_fkey` FOREIGN KEY (`stream_id`) REFERENCES `streams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_stream_sections` ADD CONSTRAINT `class_stream_sections_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_classes` ADD CONSTRAINT `user_classes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_classes` ADD CONSTRAINT `user_classes_class_stream_section_id_fkey` FOREIGN KEY (`class_stream_section_id`) REFERENCES `class_stream_sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_classes` ADD CONSTRAINT `user_classes_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
