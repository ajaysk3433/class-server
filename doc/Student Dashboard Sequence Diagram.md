
```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend Client
    participant Express as Express Router
    participant DB as Prisma Client
  

    Client->>Express: GET /api/v1/students/:id/dashboard?schoolId=1
    Note over Express: Parse params & enforce multi-tenant isolation constraints.

    alt Invalid Inputs
        Express-->>Client: 400 Bad Request
    else Inputs Valid
        Express->>DB: prisma.user.findUnique()
        DB->>MySQL: SELECT * FROM users WHERE id = studentId
        MySQL-->>DB: Student row object
        
        alt Profile Not Found or Not a Student
            Express-->>Client: 404 Not Found
        else Valid Student Profile
            Express->>DB: prisma.userClass.findFirst(subject_id: null)
            Note over Express: Locates primary classroom tracking layout room anchor
            DB->>MySQL: Fetch base room link
            MySQL-->>DB: activeRoom object
            
            alt Not Enrolled in Active Room Track
                Express-->>Client: 404 Not Found
            else Enrolled
                par Fetch Core Syllabus
                    Express->>DB: prisma.classSubject.findMany()
                    DB->>MySQL: Get subjects for activeRoom.id
                    MySQL-->>DB: coreClassSubjects array
                and Fetch Student Electives
                    Express->>DB: prisma.userClass.findMany(subject_id != null)
                    DB->>MySQL: Get custom electives for studentId inside room
                    MySQL-->>DB: individualElectives array
                end
                
                Note over Express: Combine arrays, sanitize nulls,<br/>and attach type flags ("Core" / "Elective").
                Express-->>Client: 200 OK (Unified Dashboard Payload)
            end
        end
    end