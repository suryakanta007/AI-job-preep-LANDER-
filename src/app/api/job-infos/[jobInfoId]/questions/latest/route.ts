import { db } from "@/drizzle/db"
import { QuestionTable } from "@/drizzle/schema"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { and, desc, eq } from "drizzle-orm"

type Params = Promise<{
    jobInfoId: string
}>

export async function GET(req: Request, segmentData: { params: Params }) {
    const { jobInfoId } = await segmentData.params
    const { userId } = await getCurrentUser()

    if (!userId) {
        return new Response("Unauthorized", { status: 401 })
    }

    const latestQuestion = await db.query.QuestionTable.findFirst({
        where: eq(QuestionTable.jobInfoId, jobInfoId),
        orderBy: desc(QuestionTable.createdAt),
        with: {
            jobInfo: {
                columns: {
                    userId: true,
                },
            },
        },
    })

    if (!latestQuestion) {
        return new Response("No questions found", { status: 404 })
    }

    if (latestQuestion.jobInfo.userId !== userId) {
        return new Response("Forbidden", { status: 403 })
    }

    return Response.json({
        text: latestQuestion.text,
        id: latestQuestion.id,
    })
}
