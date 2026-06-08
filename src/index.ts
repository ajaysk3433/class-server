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

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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






/**
 * POST /api/v1/users/assign-class
 * Asign class to user
 */

app.post(
  "/api/v1/users/assign-class",
  async (req, res) => {
    try {
      const {
        userId,
        schoolId,
        classId,
        streamId,
        sectionId,
      } = req.body;

      if (!userId || !schoolId || !classId || !sectionId || !streamId) {
        return res.status(400).json({
          success: false,
          message:
            "userId, schoolId, classId, streamId and sectionId are required",
        });
      }

      let classroom =
        await prisma.classStreamSection.findFirst({
          where: {
            school_id: Number(schoolId),
            class_id: Number(classId),
          
              stream_id: Number(streamId),
           
            section_id: Number(sectionId),
          },
          include: {
            class: true,
            stream: true,
            section: true,
            school: true,
          },
        });

      // Create classroom if it doesn't exist
      if (!classroom) {
        classroom =
          await prisma.classStreamSection.create({
            data: {
              school_id: Number(schoolId),
              class_id: Number(classId),
              stream_id: Number(streamId),
              section_id: Number(sectionId),
              slug: `school-${schoolId}-class-${classId}-stream-${
                streamId
              }-section-${sectionId}`,
            },
            include: {
              class: true,
              stream: true,
              section: true,
              school: true,
            },
          });
      }

      const existingAssignment =
        await prisma.userClass.findFirst({
          where: {
            user_id: Number(userId),
            class_stream_section_id: classroom.id,
          },
        });

      if (existingAssignment) {
        return res.status(409).json({
          success: false,
          message: "class already assigned",
        });
      }

      const assignment =
        await prisma.userClass.create({
          data: {
            user_id: Number(userId),
            class_stream_section_id: classroom.id,
          },
        });

      return res.status(201).json({
        success: true,
        message: "Class assigned successfully",
        data: {
          assignment,
          classroom,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error:
          error instanceof Error
            ? error.message
            : "Unknown Error",
      });
    }
  }
);

/**
 * DELETE /api/v1/users/remove-class
 * Remove asign class
 */
app.delete("/api/v1/users/remove-class", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const deleted = await prisma.userClass.deleteMany({
      where: {
        user_id: Number(userId),
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        success: false,
        message: "No class assignment found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class assignment removed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

  /**
   * POST /api/v1/subject
   * Create subject
   */
  app.post("/api/v1/subject", async (req, res) => {
    try {
      const {
        subjectName,
        board,
        streamId,
        classIds,
        lang
      } = req.body ;

      if (
        !subjectName ||
        !board ||
        !streamId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "subjectName, board and streamId are required",
        });
      }
      const boardUpperCase = board.toUpperCase();
      const subject = await prisma.subject.create({
        data: {
          subject_name: subjectName,
          slug: `${generateSlug(subjectName)}-${Date.now()}`,
          board: boardUpperCase,
          stream_id: Number(streamId),
          language : lang
        },
      });

      if (Array.isArray(classIds) && classIds.length) {
        await prisma.classSubject.createMany({
          data: classIds.map((classId: number) => ({
            class_id: classId,
            subject_id: subject.id,
          })),
        });
      }

    return res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/**
 * DELETE /api/v1/subject/5
 * Delete subject
 */

app.delete("/api/v1/subject/:subjectId", async (req, res) => {
  try {
    const subjectId = Number(req.params.subjectId);

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "subjectId is required",
      });
    }

    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    await prisma.$transaction([
      prisma.classSubject.deleteMany({
        where: {
          subject_id: subjectId,
        },
      }),

      prisma.chapter.deleteMany({
        where: {
          subject_id: subjectId,
        },
      }),

      prisma.subject.delete({
        where: {
          id: subjectId,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
/**
 * POST /api/v1/chapter
 * Create chapter
 */

app.post("/api/v1/chapter", async (req, res) => {
  try {
    const {
      name,
      subjectId,
      language,
    } = req.body;

    if (!name || !subjectId || !language) {
      return res.status(400).json({
        success: false,
        message:
          "name, subjectId and language are required",
      });
    }

    const subject = await prisma.subject.findUnique({
      where: {
        id: Number(subjectId),
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const chapter = await prisma.chapter.create({
      data: {
        name,
        subject_id: Number(subjectId),
        language,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Chapter created successfully",
      data: chapter,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/**
 * DELETE /api/v1/chapter/12
 * Delete chapter
 */

app.delete("/api/v1/chapter/:chapterId", async (req, res) => {
  try {
    const chapterId = Number(req.params.chapterId);

    if (!chapterId) {
      return res.status(400).json({
        success: false,
        message: "chapterId is required",
      });
    }

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    await prisma.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Chapter deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/**
 * GET /api/v1/section
 * Get all sections
 */

app.get("/api/v1/section", async (req, res) => {
  try {
    const sections = await prisma.section.findMany({
      orderBy: {
        section_name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Get all educational boards
app.get("/api/v1/board", async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      orderBy: {
        board: "asc", // Alphabetical order
      },
    });

    return res.status(200).json({
      success: true,
      data: boards,
    });
  } catch (error) {
    console.error("Error fetching boards:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred while fetching boards.",
    });
  }
});

// Get all available languages
app.get("/api/v1/lang", async (req, res) => {
  try {
    const languages = await prisma.language.findMany({
      orderBy: {
        language: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: languages,
    });
  } catch (error) {
    console.error("Error fetching languages:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred while fetching languages.",
    });
  }
});
/* ==========================================================
   SERVER
========================================================== */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

