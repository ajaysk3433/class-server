# API Documentation

## Base URL

```text
http://localhost:3000/api/v1
```

---

# 1. Get All Classes and Subjects

## Endpoint

```http
GET /class-and-subject/all
```

## Description

Returns all classes with their assigned subjects, stream details, and chapters.

## Success Response

```json
{
  "success": true,
  "classes": [
    {
      "id": 1,
      "class_name": "Class 11",
      "slug": "class-11",
      "classSubjects": [
        {
          "class_id": 1,
          "subject_id": 1,
          "subject": {
            "id": 1,
            "subject_name": "Physics",
            "slug": "physics",
            "board": "CBSE",
            "language": "English",
            "stream_id": 1,
            "stream": {
              "id": 1,
              "stream_name": "Science",
              "slug": "science"
            },
            "chapters": [
              {
                "id": 1,
                "name": "Motion",
                "subject_id": 1
              },
              {
                "id": 2,
                "name": "Laws of Motion",
                "subject_id": 1
              }
            ]
          }
        }
      ]
    }
  ]
}
```

## Error Response

```json
{
  "success": false,
  "error": "Internal Server Error context."
}
```

---

# 2. Get Student Dashboard

## Endpoint

```http
GET /students/:id?schoolId=<schoolId>
```

## Example Request

```http
GET /students/1?schoolId=1
```

## Description

Returns:

* Student information
* Active classroom assignment
* Class details
* Stream details
* Section details
* Core subjects
* Chapters belonging to each subject

---

## Success Response

```json
{
  "success": true,
  "schoolId": 1,
  "student": {
    "id": 1,
    "name": "Rahul Sharma",
    "email": "rahul@example.com"
  },
  "classroom": {
    "class": "Class 11",
    "stream": "Science",
    "section": "A",
    "roomSlug": "class-11-science-a"
  },
  "subjects": [
    {
      "id": 1,
      "subjectName": "Physics",
      "slug": "physics",
      "type": "Core",
      "chapters": [
        {
          "id": 1,
          "name": "Motion",
          "subject_id": 1
        },
        {
          "id": 2,
          "name": "Laws of Motion",
          "subject_id": 1
        }
      ]
    },
    {
      "id": 2,
      "subjectName": "Chemistry",
      "slug": "chemistry",
      "type": "Core",
      "chapters": [
        {
          "id": 3,
          "name": "Atomic Structure",
          "subject_id": 2
        },
        {
          "id": 4,
          "name": "Chemical Bonding",
          "subject_id": 2
        }
      ]
    }
  ]
}
```

---

## Validation Error

Returned when Student ID or School ID is missing.

### Response

```json
{
  "success": false,
  "error": "Valid Student ID parameter and schoolId query parameter are required."
}
```

---

## Student Not Found

### Response

```json
{
  "success": false,
  "error": "Student profile not found."
}
```

---

## Student Not Assigned To School

### Response

```json
{
  "success": false,
  "error": "Student is not currently enrolled in an active class room track for this school."
}
```

---

## Internal Server Error

### Response

```json
{
  "success": false,
  "error": "Internal Server Error context."
}
```

---

# Response Structure

## Student Endpoint

| Field     | Type    | Description                       |
| --------- | ------- | --------------------------------- |
| success   | boolean | Request status                    |
| schoolId  | number  | School identifier                 |
| student   | object  | Student profile                   |
| classroom | object  | Assigned classroom                |
| subjects  | array   | Core subjects assigned to student |

### Subject Object

| Field       | Type   |
| ----------- | ------ |
| id          | number |
| subjectName | string |
| slug        | string |
| type        | string |
| chapters    | array  |

### Chapter Object

| Field      | Type   |
| ---------- | ------ |
| id         | number |
| name       | string |
| subject_id | number |

---

# Notes

* Subjects are filtered based on the student's assigned stream.
* Only subjects mapped through `class_subjects` are returned.
* Chapters are fetched from the `chapters` table using Prisma relations.
* A subject may contain zero or more chapters.
* Stream can be nullable in `class_stream_sections`.
