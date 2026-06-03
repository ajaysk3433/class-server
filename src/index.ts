import express from "express";
import cors from "cors";
import { prisma } from "./config/database/db.ts";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* ==========================================================
   HELPERS
========================================================== */

async function getUserClassroom(userId: number, schoolId: number , classId? : number) {
  const assignment = await prisma.userClass.findFirst({
    where: {
      user_id: userId,
      class_stream_section: {
        school_id: schoolId,
        class_id : classId ? classId : undefined
      }
    },
    include: {
      class_stream_section: {
        include: {
          class: true,
          stream: true,
          section: true
        }
      }
    }
  });

  return assignment?.class_stream_section || null;
}

/* ==========================================================
   CLASS APIs
========================================================== */

/**
 * GET /api/v1/class/all
 * Response
 * {
    "success": true,
    "data": [
        {
            "id": 1,
            "class_name": "Class 10",
            "slug": "class-10"
        },
        {
            "id": 2,
            "class_name": "Class 11",
            "slug": "class-11"
        }
    ]
}
 */
app.get("/api/v1/class/all", async (_, res) => {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        id: "asc"
      }
    });

    return res.json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

/**
 * GET /api/v1/class?userId=1&schoolId=1
 * Response
 * {
    "success": true,
    "data": [
        {
            "id": 1,
            "class_name": "Class 10",
            "slug": "class-10"
        }
    ]
}
 */
app.get("/api/v1/class", async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    const schoolId = Number(req.query.schoolId);

    if (!userId || !schoolId) {
      return res.status(400).json({
        success: false,
        message: "userId and schoolId are required"
      });
    }

    const room = await getUserClassroom(userId, schoolId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found"
      });
    }

    return res.json({
      success: true,
      data: [room.class]
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

/* ==========================================================
   SUBJECT APIs
========================================================== */

/**
 * GET
 * /api/v1/class/:classId/subject/all?board=CBSE&streamId=1
 * Response
 * {
    "success": true,
    "data": [
        {
            "id": 1,
            "subject_name": "Physics",
            "slug": "physics",
            "board": "CBSE",
            "stream_id": 1,
            "stream": {
                "id": 1,
                "stream_name": "Science",
                "slug": "science"
            }
        },
        {
            "id": 2,
            "subject_name": "Chemistry",
            "slug": "chemistry",
            "board": "CBSE",
            "stream_id": 1,
            "stream": {
                "id": 1,
                "stream_name": "Science",
                "slug": "science"
            }
        },
        {
            "id": 3,
            "subject_name": "Mathematics",
            "slug": "mathematics",
            "board": "CBSE",
            "stream_id": 1,
            "stream": {
                "id": 1,
                "stream_name": "Science",
                "slug": "science"
            }
        }
    ]
}
 */
app.get("/api/v1/class/:classId/subject/all", async (req, res) => {
  try {
    const classId = Number(req.params.classId);

    const board = req.query.board as string | undefined;
    const streamId = Number(req.query.streamId);

    const subjects = await prisma.classSubject.findMany({
      where: {
        class_id: classId,
        ...(board || streamId
          ? {
              subject: {
                ...(board && { board }),
                ...(streamId && { stream_id: streamId })
              }
            }
          : {})
      },
      include: {
        subject: {
          include: {
            stream: true
          }
        }
      }
    });

    return res.json({
      success: true,
      data: subjects.map((item) => item.subject)
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

/**
 * GET
 * /api/v1/class/:classId/subject
 * ?userId=1&schoolId=1&board=CBSE&streamId=1
 * Response
 * {
    "success": true,
    "data": [
        {
            "id": 1,
            "subject_name": "Physics",
            "slug": "physics",
            "board": "CBSE",
            "stream_id": 1,
            "stream": {
                "id": 1,
                "stream_name": "Science",
                "slug": "science"
            }
        },
        {
            "id": 2,
            "subject_name": "Chemistry",
            "slug": "chemistry",
            "board": "CBSE",
            "stream_id": 1,
            "stream": {
                "id": 1,
                "stream_name": "Science",
                "slug": "science"
            }
        },
        {
            "id": 3,
            "subject_name": "Mathematics",
            "slug": "mathematics",
            "board": "CBSE",
            "stream_id": 1,
            "stream": {
                "id": 1,
                "stream_name": "Science",
                "slug": "science"
            }
        }
    ]
}
 */
app.get("/api/v1/class/:classId/subject", async (req, res) => {
  try {
    const classId = Number(req.params.classId);

    const userId = Number(req.query.userId);
    const schoolId = Number(req.query.schoolId);

    const board = req.query.board as string | undefined;
    const streamId = Number(req.query.streamId);

    if (!userId || !schoolId) {
      return res.status(400).json({
        success: false,
        message: "userId and schoolId are required"
      });
    }

    const room = await getUserClassroom(userId, schoolId, classId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found"
      });
    }

    const effectiveStreamId = streamId || room.stream_id;

    const subjects = await prisma.classSubject.findMany({
      where: {
        class_id: classId,
        subject: {
          ...(board && { board }),
          ...(effectiveStreamId && {
            stream_id: effectiveStreamId
          })
        }
      },
      include: {
        subject: {
          include: {
            stream: true
          }
        }
      }
    });

    return res.json({
      success: true,
      data: subjects.map((item) => item.subject)
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

/* ==========================================================
   STREAM APIs
========================================================== */

/**
 * GET /api/v1/stream
 * Response
 * {
    "success": true,
    "data": [
        {
            "id": 1,
            "stream_name": "Science",
            "slug": "science"
        },
        {
            "id": 2,
            "stream_name": "Commerce",
            "slug": "commerce"
        }
    ]
}
 * 
 */
app.get("/api/v1/stream", async (_, res) => {
  try {
    const streams = await prisma.stream.findMany({
      orderBy: {
        id: "asc"
      }
    });

    return res.json({
      success: true,
      data: streams
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

/* ==========================================================
   CHAPTER APIs
========================================================== */

/**
 * GET
 * /api/v1/class/:classId/subject/:subjectId/chapter/all?lang=en
 * Response
 * {
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Motion",
            "subject_id": 1,
            "language": "en"
        },
        {
            "id": 2,
            "name": "Force and Laws of Motion",
            "subject_id": 1,
            "language": "en"
        }
    ]
}
 */
app.get(
  "/api/v1/class/:classId/subject/:subjectId/chapter/all",
  async (req, res) => {
    try {
      const subjectId = Number(req.params.subjectId);
      const lang = req.query.lang as string | undefined;

      const chapters = await prisma.chapter.findMany({
        where: {
          subject_id: subjectId,
          ...(lang && {
            language: lang
          })
        },
        orderBy: {
          id: "asc"
        }
      });

      return res.json({
        success: true,
        data: chapters
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  }
);

/**
 * GET
 * /api/v1/class/:classId/subject/:subjectId/chapter
 * ?userId=1&schoolId=1&lang=en
 * Response
 * {
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Motion",
            "subject_id": 1,
            "language": "en"
        },
        {
            "id": 2,
            "name": "Force and Laws of Motion",
            "subject_id": 1,
            "language": "en"
        }
    ]
}
 */
app.get(
  "/api/v1/class/:classId/subject/:subjectId/chapter",
  async (req, res) => {
    try {
      const classId = Number(req.params.classId);
      const subjectId = Number(req.params.subjectId);

      const userId = Number(req.query.userId);
      const schoolId = Number(req.query.schoolId);

      const lang = req.query.lang as string | undefined;

      if (!userId || !schoolId) {
        return res.status(400).json({
          success: false,
          message: "userId and schoolId are required"
        });
      }

      const room = await getUserClassroom(userId, schoolId,classId);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Classroom not found"
        });
      }

      const subject = await prisma.classSubject.findFirst({
        where: {
          class_id: classId,
          subject_id: subjectId,
          subject: {
            stream_id: room.stream_id!
          }
        }
      });

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not available for user"
        });
      }

      const chapters = await prisma.chapter.findMany({
        where: {
          subject_id: subjectId,
          ...(lang && {
            language: lang
          })
        },
        orderBy: {
          id: "asc"
        }
      });

      return res.json({
        success: true,
        data: chapters
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  }
);

/* ==========================================================
   SERVER
========================================================== */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

