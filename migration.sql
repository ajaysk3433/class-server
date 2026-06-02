-- 1. Create Role Table
CREATE TABLE `admin_roles` (
    `id` INT AUTO_INCREMENT,
    `role_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Create School Table
CREATE TABLE `schools` (
    `id` INT AUTO_INCREMENT,
    `school_name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `schools_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Create Stream Table
CREATE TABLE `streams` (
    `id` INT AUTO_INCREMENT,
    `stream_name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `streams_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Create Class Table
CREATE TABLE `classes` (
    `id` INT AUTO_INCREMENT,
    `class_name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `classes_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Create Section Table
CREATE TABLE `sections` (
    `id` INT AUTO_INCREMENT,
    `section_name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `sections_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Create User Table (Depends on admin_roles)
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `role_id` INT NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_key` (`email`),
    CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `admin_roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Create Subject Table (Depends on streams)
CREATE TABLE `subjects` (
    `id` INT AUTO_INCREMENT,
    `subject_name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `board` VARCHAR(255) NOT NULL,
    `language` VARCHAR(255) NOT NULL,
    `stream_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `subjects_stream_id_fkey` FOREIGN KEY (`stream_id`) REFERENCES `streams` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Create ClassStreamSection Table (Depends on schools, classes, streams, sections)
CREATE TABLE `class_stream_sections` (
    `id` INT AUTO_INCREMENT,
    `school_id` INT NOT NULL,
    `class_id` INT NOT NULL,
    `stream_id` INT NULL, -- Explicitly nullable matching your schema
    `section_id` INT NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `class_stream_sections_slug_key` (`slug`),
    CONSTRAINT `class_stream_sections_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `class_stream_sections_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `class_stream_sections_stream_id_fkey` FOREIGN KEY (`stream_id`) REFERENCES `streams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `class_stream_sections_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Create ClassSubject Junction Table (Composite Primary Key)
CREATE TABLE `class_subjects` (
    `class_id` INT NOT NULL,
    `subject_id` INT NOT NULL,
    PRIMARY KEY (`class_id`, `subject_id`),
    CONSTRAINT `class_subjects_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `class_subjects_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Create UserClass Junction Table (Composite Primary Key)
CREATE TABLE `user_classes` (
    `user_id` INT NOT NULL,
    `class_stream_section_id` INT NOT NULL,
    PRIMARY KEY (`user_id`, `class_stream_section_id`),
    CONSTRAINT `user_classes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `user_classes_class_stream_section_id_fkey` FOREIGN KEY (`class_stream_section_id`) REFERENCES `class_stream_sections` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;