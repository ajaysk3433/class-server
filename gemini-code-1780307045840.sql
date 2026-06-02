-- Disable foreign key constraints temporarily to allow clean data rewriting
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE user_classes;
TRUNCATE TABLE class_subjects;
TRUNCATE TABLE class_stream_sections;
TRUNCATE TABLE stream_subjects;
TRUNCATE TABLE users;
TRUNCATE TABLE subjects;
TRUNCATE TABLE sections;
TRUNCATE TABLE classes;
TRUNCATE TABLE streams;
TRUNCATE TABLE schools;
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- 1. POPULATE CORE LOOKUP DICTIONARIES
-- =========================================================================

INSERT INTO schools (id, school_name, slug, status) VALUES
(1, 'Greenwood Academy', 'greenwood-academy', 'active'),
(2, 'Apex International', 'apex-international', 'active');

INSERT INTO classes (id, class_name, slug) VALUES
(1, 'Class 9', 'class-9'),
(2, 'Class 11', 'class-11');

INSERT INTO streams (id, stream_name, slug) VALUES
(1, 'Science', 'science'),
(2, 'Commerce', 'commerce');

INSERT INTO sections (id, section_name, slug) VALUES
(1, 'A', 'a'),
(2, 'B', 'b');

-- =========================================================================
-- 2. POPULATE SUBJECTS (Updated to match board and language fields)
-- =========================================================================

INSERT INTO subjects (id, subject_name, slug, board, language) VALUES
(1, 'Mathematics', 'mathematics', 'CBSE', 'English'),
(2, 'General Science', 'general-science', 'CBSE', 'English'),
(3, 'Physics', 'physics', 'CBSE', 'English'),
(4, 'Chemistry', 'chemistry', 'CBSE', 'English'),
(5, 'Hindi Core', 'hindi-core', 'CBSE', 'Hindi');

-- =========================================================================
-- 3. BUILD THE ARCHITECTURAL PHYSICAL ROOM BUNDLES
-- =========================================================================

INSERT INTO class_stream_sections (id, school_id, class_id, stream_id, section_id, slug) VALUES
-- Class 9-A (stream_id is NULL)
(10, 1, 1, NULL, 1, 'class-9-a'),
-- Class 11-B Science track
(20, 1, 2, 1, 2, 'class-11-science-b');

-- =========================================================================
-- 4. LINK STABLE STANDARD CORE SYLLABUSES TO THE CLASSES (Direct class_id linking)
-- =========================================================================

-- Class 9 (id: 1) core curriculum consists of Math and General Science
INSERT INTO class_subjects (class_id, subject_id) VALUES
(1, 1), 
(1, 2);

-- Class 11 (id: 2) core curriculum consists of Math, Physics, and Chemistry
INSERT INTO class_subjects (class_id, subject_id) VALUES
(2, 1), 
(2, 3), 
(2, 4);

-- =========================================================================
-- 5. REGISTER USERS (TEACHERS AND STUDENTS)
-- =========================================================================

INSERT INTO users (id, full_name, email, role, status) VALUES
(77, 'Alex Mercer', 'alex.m@greenwood.edu', 'teacher', 'active'),
(78, 'Bhawna Sharma', 'bhawna.s@greenwood.edu', 'teacher', 'active'),
(102, 'Jane Doe', 'jane.doe@student.com', 'student', 'active');

-- =========================================================================
-- 6. MAP WORKLOADS AND ROSTER TRACKS (user_classes)
-- =========================================================================

-- Note: Because your schema defines @@id([user_id, class_stream_section_id]), 
-- a user can only map to a class_stream_section ONCE. 
-- For multiple subjects in the same section, separate teachers are mapped below.

INSERT INTO user_classes (user_id, class_stream_section_id, subject_id) VALUES
-- Teacher Alex Mercer (77) handles Math (1) for Class 9-A (10)
(77, 10, 1),

-- Teacher Bhawna Sharma (78) handles General Science (2) for Class 9-A (10)
(78, 10, 2),

-- Teacher Alex Mercer (77) also handles Physics (3) for Class 11-B Science (20)
(77, 20, 3),

-- Student Enrollment: Jane Doe (102) belongs structurally inside Class 11-B Science (20)
(102, 20, NULL);