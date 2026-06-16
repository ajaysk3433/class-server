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
        varchar subject_name
        varchar slug
        varchar board
        varchar language
        int stream_id FK
    }

    CHAPTERS {
        int id PK
        varchar name
        int subject_id FK
    }

   

    USERS {
        int id PK
        varchar full_name
        varchar email UK
        int role_id FK
        varchar status
    }

    CLASS_STREAM_SECTIONS {
        int id PK
        int school_id FK
        int class_id FK
        int stream_id FK
        int section_id FK 
        varchar slug UK
    }

    CLASS_SUBJECTS {
        int class_id PK, FK
        int subject_id PK, FK
    }

    USER_CLASSES {
        int user_id PK, FK
        int class_stream_section_id PK, FK
    }

    %% --- Relationships ---

    SCHOOLS ||--o{ CLASS_STREAM_SECTIONS : "operates"
    CLASSES ||--o{ CLASS_STREAM_SECTIONS : "categorizes"
    STREAMS |o--o{ CLASS_STREAM_SECTIONS : "specifies"
    SECTIONS ||--o{ CLASS_STREAM_SECTIONS : "divides"

    STREAMS ||--o{ SUBJECTS : "contains"
    SUBJECTS ||--o{ CHAPTERS : "contains"

    CLASSES ||--o{ CLASS_SUBJECTS : "links"
    SUBJECTS ||--o{ CLASS_SUBJECTS : "assigned"

   
    USERS ||--o{ USER_CLASSES : "enrolled in"
    CLASS_STREAM_SECTIONS ||--o{ USER_CLASSES : "contains rosters for"