Here is the production-ready API documentation for your multi-tenant School Dashboard API endpoints.

---

## Global Headers & Configuration

* **Base URL:** `https://api.yourdomain.com/api/v1`
* **Content-Type:** `application/json`
* **Authentication:** *Internal/Protected (Expects an authentication token/session validation in your production middleware).*

---

## 1. Teacher Dashboard Endpoint

### Request Details

* **HTTP Method:** `GET`
* **Route:** `/teachers/:id/dashboard`
* **Description:** Fetches the complete multi-class and multi-subject academic workload for a verified teacher. It restricts rows strictly to the requested school tenant to ensure data security.

### Request Parameters

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `Integer` | **Yes** | The unique database identifier (`id`) of the teacher. |

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `schoolId` | `Integer` | **Yes** | Enforces tenant isolation. The query returns data only if the classroom belongs to this school. |

---

### API Responses

#### 🟢 200 OK

Returned when the profile is verified and active workloads are mapped successfully.

```json
{
  "success": true,
  "schoolId": 1,
  "teacher": {
    "id": 77,
    "name": "Alex Mercer",
    "email": "alex.m@greenwood.edu"
  },
  "workload": [
    {
      "class": "Class 9",
      "stream": "General / No Stream",
      "section": "A",
      "subject": "Mathematics",
      "classRoomSlug": "class-9-a",
      "subjectSlug": "mathematics"
    },
    {
      "class": "Class 9",
      "stream": "General / No Stream",
      "section": "A",
      "subject": "General Science",
      "classRoomSlug": "class-9-a",
      "subjectSlug": "general-science"
    },
    {
      "class": "Class 11",
      "stream": "Science",
      "section": "B",
      "subject": "Physics",
      "classRoomSlug": "class-11-science-b",
      "subjectSlug": "physics"
    }
  ]
}

```

#### 🟡 400 Bad Request

Returned when `id` is not a valid integer or `schoolId` query parameters are completely missing.

```json
{
  "success": false,
  "error": "Valid Teacher ID parameter and schoolId query parameter are required."
}

```

#### 🔴 404 Not Found

Returned when the user profile doesn't exist or holds a user role other than `teacher`.

```json
{
  "success": false,
  "error": "Teacher profile not found."
}

```

---

## 2. Student Dashboard Endpoint

### Request Details

* **HTTP Method:** `GET`
* **Route:** `/students/:id/dashboard`
* **Description:** Assembles a customized student landing feed. It fetches the primary classroom tracking room, maps the baseline core syllabus templates taught in that space, and appends individual elective choices tied directly to the student.

### Request Parameters

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `Integer` | **Yes** | The unique database identifier (`id`) of the student. |

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `schoolId` | `Integer` | **Yes** | Validates tenant-level access limits to block cross-school data visibility. |

---

### API Responses

#### 🟢 200 OK

Returned when the base tracking room resolves cleanly and compiles core + elective data.

```json
{
  "success": true,
  "schoolId": 1,
  "student": {
    "id": 102,
    "name": "Jane Doe",
    "email": "jane.doe@student.com"
  },
  "classroom": {
    "class": "Class 11",
    "stream": "Science",
    "section": "B",
    "roomSlug": "class-11-science-b"
  },
  "subjects": [
    {
      "id": 1,
      "subjectName": "Mathematics",
      "slug": "mathematics",
      "type": "Core"
    },
    {
      "id": 3,
      "subjectName": "Physics",
      "slug": "physics",
      "type": "Core"
    },
    {
      "id": 4,
      "subjectName": "Chemistry",
      "slug": "chemistry",
      "type": "Core"
    },
    {
      "id": 5,
      "subjectName": "Advanced Robotics & AI",
      "slug": "advanced-robotics-ai",
      "type": "Elective"
    }
  ]
}

```

#### 🟡 400 Bad Request

Returned if the `id` param fails basic integer validation parsing or `schoolId` is missing.

```json
{
  "success": false,
  "error": "Valid Student ID parameter and schoolId query parameter are required."
}

```

#### 🔴 404 Not Found (Profile Missing)

Returned if the `id` doesn't match any record or the role field does not evaluate to `student`.

```json
{
  "success": false,
  "error": "Student profile not found."
}

```

#### 🔴 404 Not Found (Unassigned Classroom Roster)

Returned if the student profile is valid, but they haven't been linked to a base room roster track (`subject_id: null`) in the database.

```json
{
  "success": false,
  "error": "Student is not currently enrolled in an active class room track for this school."
}

```

---

## 3. Global Server Exception Handler

#### 💥 500 Internal Server Error

Returned whenever the runtime engine encounters database communication timeouts, parsing bugs, or underlying runtime drops.

```json
{
  "success": false,
  "error": "Internal Server Error context."
}

```