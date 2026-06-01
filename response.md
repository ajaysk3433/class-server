Student 
```JSON
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
      "id": 5,
      "subjectName": "Physics",
      "slug": "physics",
      "type": "Core"
    },
    {
      "id": 6,
      "subjectName": "Chemistry",
      "slug": "chemistry",
      "type": "Core"
    },
    {
      "id": 1,
      "subjectName": "Mathematics",
      "slug": "mathematics",
      "type": "Core"
    },
    {
      "id": 9,
      "subjectName": "Advanced Robotics & AI",
      "slug": "advanced-robotics-ai",
      "type": "Elective"
    }
  ]
}


Teacher 

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
      "subject": "Science",
      "classRoomSlug": "class-9-a",
      "subjectSlug": "science"
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