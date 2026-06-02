import express from 'express';
import cors from 'cors';
import { prisma } from "./config/database/db.ts";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/**
 * @route   GET /api/v1/teachers/:id/dashboard
 * @desc    Fetch the complete workload configuration payload for a logged-in teacher
 */
app.get('/api/v1/class-and-subject/all', async (req, res) => {


    try {

        const classes = await prisma.classSubject.findMany({
            include: {
                class: true,
                subject: {
                    include: {
                        stream: true
                    }
                }
            }
        });
        // const subject = await prisma.subject.findMany()
        // const stream = await prisma.stream.findMany();
        console.dir(classes)



        return res.status(200).json({
            success: true,
            classes,
            workload: "testing"
        });

    } catch (error) {
        console.error("Database Error on Teacher Dashboard query:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error context." });
    }
});

/**
 * @route   GET /api/v1/students/:id/dashboard
 * @desc    Fetch classroom tracking and complete core + elective subjects for a student
 */
app.get('/api/v1/students/:id/dashboard', async (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    const schoolId = parseInt(req.query.schoolId as string, 10);

    if (isNaN(studentId) || !schoolId) {
        return res.status(400).json({
            success: false,
            error: "Valid Student ID parameter and schoolId query parameter are required."
        });
    }

    try {
        const student = await prisma.user.findUnique({
            where: { id: studentId }
        });

        if (!student || student.role.toLowerCase() !== 'student') {
            return res.status(404).json({ success: false, error: "Student profile not found." });
        }

        const primaryClassAssignment = await prisma.userClass.findFirst({
            where: {
                user_id: studentId,
               
                class_stream_section: {
                    school_id: schoolId
                }
            },
            include: {
                class_stream_section: {
                    include: {
                        class: true,
                        section: true,
                        stream: true
                    }
                }
            }
        });


        if (!primaryClassAssignment) {
            return res.status(404).json({
                success: false,
                error: "Student is not currently enrolled in an active class room track for this school."
            });
        }

        const activeRoom = primaryClassAssignment.class_stream_section;

        const coreClassSubjects = await prisma.classSubject.findMany({
            where: {
                class_id: activeRoom.class.id,
                subject: {
                    stream_id: activeRoom.stream_id! // Filters out the main record if the subject doesn't match
                }
            },
            include: {
                subject: true // Pulls in the subject data for the matching records
            }
        });

       

        const corePayload = coreClassSubjects.map(cs => ({
            id: cs.subject.id,
            subjectName: cs.subject.subject_name,
            slug: cs.subject.slug,
            type: "Core"
        }));

       

        return res.status(200).json({
            success: true,
            schoolId: schoolId,
            student: {
                id: student.id,
                name: student.full_name,
                email: student.email
            },
            classroom: {
                class: activeRoom.class.class_name,
                stream: activeRoom.stream ? activeRoom.stream.stream_name : "General / No Stream",
                section: activeRoom.section.section_name,
                roomSlug: activeRoom.slug
            },
            subjects: [...corePayload]
        });

    } catch (error) {
        console.error("Database Error on Student Dashboard query:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error context." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Multi-tenant School API Server running natively on port ${PORT}`);
});