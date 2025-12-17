import { db } from "@/drizzle/db"
import { JobInfoTable } from "@/drizzle/schema"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { analyzeResumeForJob } from "@/services/ai/resumes/ai"
import { and, eq } from "drizzle-orm"

export async function POST(req: Request) {
    const { userId } = await getCurrentUser()

    if (!userId) {
        return new Response("Unauthorized", { status: 401 })
    }

    const formData = await req.formData()
    const resumeFile = formData.get("resumeFile") as File | null
    const jobInfoId = formData.get("jobInfoId") as string | null

    if (!resumeFile) {
        return new Response("Resume file is required", { status: 400 })
    }

    if (!jobInfoId) {
        return new Response("Job info ID is required", { status: 400 })
    }

    // Fetch the job info from the database
    const jobInfo = await db.query.JobInfoTable.findFirst({
        where: and(
            eq(JobInfoTable.id, jobInfoId),
            eq(JobInfoTable.userId, userId)
        ),
        columns: {
            title: true,
            description: true,
            experienceLevel: true,
        },
    })

    if (!jobInfo) {
        return new Response("Job info not found or access denied", { status: 404 })
    }

    // Analyze the resume
    const result = analyzeResumeForJob({
        resumeFile,
        jobInfo,
    })

    return result.toTextStreamResponse()
}
