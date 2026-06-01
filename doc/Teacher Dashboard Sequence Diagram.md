
```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend Client
    participant Express as Express Router
    participant DB_Check as Prisma (User Table)
    participant Workload as Prisma (UserClass Table)
 

    Client->>Express: GET /api/v1/teachers/:id/dashboard?schoolId=1
    Note over Express: Parse parameters & query string.<br/>Validate if teacherId is a number and schoolId exists.
    
    alt Invalid Parameters
        Express-->>Client: 400 Bad Request (JSON)
    else Parameters Valid
        Express->>DB_Check: prisma.user.findUnique({ where: { id: teacherId } })
        DB_Check->>MySQL: SELECT * FROM users WHERE id = teacherId
        MySQL-->>DB_Check: User record payload (or null)
        
        alt Profile Not Found or Not a Teacher
            Express-->>Client: 404 Not Found (JSON)
        else Authorized Teacher Profile
            Express->>Workload: prisma.userClass.findMany({ where: { user_id, subject_id, class_stream_section } })
            Note over Workload: Inner joins class, section,<br/>stream, and subject configurations.
            Workload->>MySQL: Multi-table JOIN query optimized by indexes
            MySQL-->>Workload: Array of raw database assignments
            
            Note over Express: Map database array into clean camelCase payload.<br/>Format stream defaults ("General / No Stream").
            Express-->>Client: 200 OK (Unified JSON Response)
        end
    end