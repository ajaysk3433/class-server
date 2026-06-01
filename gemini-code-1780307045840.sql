-- Disable foreign key constraints temporarily to allow clean data rewriting
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE user_classes;
TRUNCATE TABLE class_subjects;
TRUNCATE TABLE class_stream_sections;
TRUNCATE TABLE school_active_subjects;
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
-- 2. POPULATE SUBJECTS (BOTH GLOBAL AND TENANT-SPECIFIC)
-- =========================================================================

INSERT INTO subjects (id, school_id, subject_name, slug) VALUES
-- System Global Level Subjects (school_id is NULL)
(1, NULL, 'Mathematics', 'mathematics'),
(2, NULL, 'General Science', 'general-science'),
(3, NULL, 'Physics', 'physics'),
(4, NULL, 'Chemistry', 'chemistry'),
-- School-Specific Custom Subject (Exclusive to Greenwood Academy)
(5, 1, 'Advanced Robotics & AI', 'advanced-robotics-ai');

-- =========================================================================
-- 3. BUILD THE ARCHITECTURAL PHYSICAL ROOM BUNDLES
-- =========================================================================

INSERT INTO class_stream_sections (id, school_id, class_id, stream_id, section_id, slug) VALUES
-- Class 9-A has no stream specialization (stream_id is NULL)
(10, 1, 1, NULL, 1, 'class-9-a'),
-- Class 11-B is a specialized Science track layout
(20, 1, 2, 1, 2, 'class-11-science-b');

-- =========================================================================
-- 4. LINK STABLE STANDARD CORE SYLLABUSES TO THE ROOMS
-- =========================================================================

-- Class 9-A core curriculum consists of Math and General Science
INSERT INTO class_subjects (class_stream_section_id, subject_id) VALUES
(10, 1), 
(10, 2);

-- Class 11-B Science track core curriculum consists of Math, Physics, and Chemistry
INSERT INTO class_subjects (class_stream_section_id, subject_id) VALUES
(20, 1), 
(20, 3), 
(20, 4);

-- =========================================================================
-- 5. REGISTER USERS (TEACHERS AND STUDENTS)
-- =========================================================================

INSERT INTO users (id, full_name, email, role, status) VALUES
(77, 'Alex Mercer', 'alex.m@greenwood.edu', 'teacher', 'active'),
(102, 'Jane Doe', 'jane.doe@student.com', 'student', 'active');

-- =========================================================================
-- 6. MAP WORKLOADS AND ROSTER TRACKS (user_classes)
-- =========================================================================

-- Note: Ensure your database schema column matching supports individual records 
-- for multiple subject tracking across identical user_id fields.

INSERT INTO user_classes (user_id, class_stream_section_id, subject_id) VALUES
-- Teacher Assignments: Alex Mercer (77) teaches Math (1) and Science (2) to Class 9-A (10)
(77, 10, 1),
(77, 10, 2),
-- Alex Mercer (77) also teaches Physics (3) to Class 11-B Science (20)
(77, 20, 3),

-- Student Enrollment: Jane Doe (102) belongs structurally inside Class 11-B Science (20)
-- Row A: Base Classroom configuration tracking (subject_id is NULL)
(102, 20, NULL),
-- Row B: Jane chooses to take the custom "Advanced Robotics & AI" (5) elective inside her section
(102, 20, 5);