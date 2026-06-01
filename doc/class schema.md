Here is the complete, cohesive documentation of your database architecture in **Markdown**. This contains everything we designed—from the architectural rules and full SQL schema script down to the query playbooks—structured cleanly so you can save it directly as a `.md` file for your team.

---

# School Platform Database Documentation (Multi-Tenant Architecture)

This document outlines the database schema designed to support a multi-tenant school ecosystem. It elegantly handles schools, streams (Arts, Commerce, Science), classes (including lower grades without streams), reusable sections, flexible subject management (global vs. custom), and complex multi-class teacher assignments.

## 1. Schema Architecture Overview

* **Multi-Tenant Isolation:** The `schools` table acts as the data root. Entities are scoped using `school_id` to ensure absolute isolation between clients.
* **The Hub Pattern:** The `class_stream_sections` table represents an absolute physical/logical room tracker.
* **Nullable Streams:** For lower grades (e.g., Class 9, Class 10), `stream_id` is set to `NULL`.
* **Granular User Rosters:** The `user_classes` junction table uses an optional `subject_id` to link a teacher to specific subjects within specific classrooms, allowing a single instructor to teach multiple subjects inside the same section or across different sections.

---

## 2. Complete SQL Data Definition Language (DDL)

```sql
-- ==========================================
-- 1. GLOBAL SYSTEM & TENANT CORE TABLES
-- ==========================================

CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE streams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stream_name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(70) NOT NULL UNIQUE
);

CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(70) NOT NULL UNIQUE
);

CREATE TABLE sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_name VARCHAR(10) NOT NULL UNIQUE,
    slug VARCHAR(15) NOT NULL UNIQUE
);

-- ==========================================
-- 2. TENANT-AWARE MASTER DATA
-- ==========================================

CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NULL, -- NULL means Global; assigned integer means School-Specific Custom
    subject_name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE(school_id, slug) 
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'student', -- 'student', 'teacher', 'admin'
    status VARCHAR(20) NOT NULL DEFAULT 'active'
);

-- ==========================================
-- 3. INTERSECTION & CONFIGURATION TABLES
-- ==========================================

-- System configuration: Mapping subjects across global streams
CREATE TABLE stream_subjects (
    stream_id INT,
    subject_id INT,
    PRIMARY KEY (stream_id, subject_id),
    FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- -- Tenant activation rulebook for global subjects
-- CREATE TABLE school_active_subjects (
--     school_id INT,
--     subject_id INT,
--     PRIMARY KEY (school_id, subject_id),
--     FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
--     FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
-- );

-- Central Hub: Maps Class + Stream (Optional) + Section inside a unique School
CREATE TABLE class_stream_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    class_id INT NOT NULL,
    stream_id INT NULL, -- Left NULL for Class 9/10/etc.
    section_id INT NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    UNIQUE(school_id, class_id, stream_id, section_id)
);

-- Structural Curriculum Assignment Mapping
CREATE TABLE class_subjects (
    class_stream_section_id INT,
    subject_id INT,
    PRIMARY KEY (class_stream_section_id, subject_id),
    FOREIGN KEY (class_stream_section_id) REFERENCES class_stream_sections(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Multi-Class/Multi-Subject User Deployment Roster
CREATE TABLE user_classes (
    user_id INT NOT NULL,
    class_stream_section_id INT NOT NULL,
    subject_id INT NULL, -- NULL for general student tracking; populated for teachers/electives
    PRIMARY KEY (user_id, class_stream_section_id, subject_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_stream_section_id) REFERENCES class_stream_sections(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- ==========================================
-- 4. PERFORMANCE & URL LOOKUP INDEXES
-- ==========================================
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_streams_slug ON streams(slug);
CREATE INDEX idx_classes_slug ON classes(slug);
CREATE INDEX idx_sections_slug ON sections(slug);
CREATE INDEX idx_subjects_slug ON subjects(slug);
CREATE INDEX idx_css_slug ON class_stream_sections(slug);

```

---

## 3. Production Query Playbook

*All scenarios below showcase lookups evaluating data constraints on **School ID: 1**.*

### Scenario A: Teacher Multi-Subject Login Payload

Fetches the active workspace profile for a multi-talented instructor (e.g., **Teacher ID: 77**) teaching multiple different topics across various classes.

```sql
SELECT 
    c.class_name,
    COALESCE(st.stream_name, 'General') AS stream_name,
    sec.section_name,
    sub.subject_name,
    css.slug AS class_room_slug,
    sub.slug AS subject_slug
FROM user_classes uc
INNER JOIN class_stream_sections css ON uc.class_stream_section_id = css.id
INNER JOIN classes c ON css.class_id = c.id
INNER JOIN sections sec ON css.section_id = sec.id
INNER JOIN subjects sub ON uc.subject_id = sub.id
WHERE uc.user_id = 77                 
  AND css.school_id = 1;

```

### Scenario B: Dynamic Unified Student Roster Payload

Pulls a complete structural academic course load for a specific pupil (**Student ID: 102**), aggregating default curriculum assignments with individual chosen electives.

```sql
WITH student_room AS (
    SELECT class_stream_section_id 
    FROM user_classes 
    WHERE user_id = 102 AND subject_id IS NULL 
)
SELECT 
    sub.id AS subject_id,
    sub.subject_name,
    sub.slug AS subject_slug,
    'Core Subject' AS subject_type
FROM class_subjects cs
INNER JOIN subjects sub ON cs.subject_id = sub.id
WHERE cs.class_stream_section_id = (SELECT class_stream_section_id FROM student_room)

UNION 

SELECT 
    sub.id AS subject_id,
    sub.subject_name,
    sub.slug AS subject_slug,
    'Individual Elective' AS subject_type
FROM user_classes uc
INNER JOIN subjects sub ON uc.subject_id = sub.id
WHERE uc.user_id = 102 AND uc.subject_id IS NOT NULL;

```

### Scenario C: Tenant Admin Curriculum Configurator Lookups

Aggregates active allowed data rows for a local administrator constructing class curriculum schedules.

```sql
SELECT s.id, s.subject_name, s.slug, 'Global System Default' AS source
FROM subjects s
INNER JOIN school_active_subjects sas ON s.id = sas.subject_id
WHERE sas.school_id = 1

UNION

SELECT id, subject_name, slug, 'Custom Tenant Unique' AS source
FROM subjects 
WHERE school_id = 1;

```

### Scenario D: Standardized Syllabus API Routings

Allows your application to query a unified API endpoint like `/api/v1/curriculum/:slug` to safely generate syllabus indexes for stream-less layouts and specialized tracks alike.

```sql
SELECT sub.subject_name, sub.slug
FROM class_subjects cs
INNER JOIN class_stream_sections css ON cs.class_stream_section_id = css.id
INNER JOIN subjects sub ON cs.subject_id = sub.id
WHERE css.slug = 'class-9-a' -- Or pass 'class-11-science-b' interchangeably
  AND css.school_id = 1;

```

---

```mermaid

 erDiagram
    SCHOOLS {
        int id PK
        varchar school_name
        varchar slug UK
        varchar status
    }

    STREAMS {
        int id PK
        varchar stream_name
        varchar slug UK
    }

    CLASSES {
        int id PK
        varchar class_name
        varchar slug UK
    }

    SECTIONS {
        int id PK
        varchar section_name
        varchar slug UK
    }

    SUBJECTS {
        int id PK
        int school_id FK "NULLABLE"
        varchar subject_name
        varchar slug
        varchar board
    }

    BOARD {
        int id PK
        varchar board
        varchar slug
    }

    BOARD_SUBJECTS {
        int id PK
        int subjects_id FK
        int board_id FK
    }

    USERS {
        int id PK
        varchar full_name
        varchar email UK
        varchar role
        varchar status
    }

    CLASS_STREAM_SECTIONS {
        int id PK
        int school_id FK
        int class_id FK
        int stream_id FK "NULLABLE"
        int section_id FK
        varchar slug UK
    }

    STREAM_SUBJECTS {
        int stream_id PK, FK
        int subject_id PK, FK
    }

    CLASS_SUBJECTS {
        int class_stream_section_id PK, FK
        int subject_id PK, FK
    }

    USER_CLASSES {
        int user_id PK, FK
        int class_stream_section_id PK, FK
        int subject_id FK "NULLABLE"
    }

    %% --- Relationships & Cardinalities ---

    %% Multi-Tenant & Infrastructure Core
    SCHOOLS ||--o{ CLASS_STREAM_SECTIONS : "operates"
    SCHOOLS ||--o{ SUBJECTS : "registers custom"
    
    CLASSES ||--o{ CLASS_STREAM_SECTIONS : "has"
    STREAMS |o--o{ CLASS_STREAM_SECTIONS : "applies to"
    SECTIONS ||--o{ CLASS_STREAM_SECTIONS : "has"

    %% Curriculum Structures
    STREAMS ||--o{ STREAM_SUBJECTS : "defines"
    SUBJECTS ||--o{ STREAM_SUBJECTS : "belongs to"

    CLASS_STREAM_SECTIONS ||--o{ CLASS_SUBJECTS : "maps curriculum"
    SUBJECTS ||--o{ CLASS_SUBJECTS : "assigned to room"

    %% Board Management
    BOARD ||--o{ BOARD_SUBJECTS : "defines"
    SUBJECTS ||--o{ BOARD_SUBJECTS : "included_in"

    %% Users & Multi-Class/Subject Assignments
    USERS ||--o{ USER_CLASSES : "fulfills roster"
    CLASS_STREAM_SECTIONS ||--o{ USER_CLASSES : "allocated to"
    SUBJECTS |o--o{ USER_CLASSES : "restricts workload to"