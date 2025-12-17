import { db } from "@/drizzle/db"
import { QuestionTable } from "@/drizzle/schema"
import { getJobInfoIdTag } from "@/fratures/jobInfos/dbCache"
import { getQuestionIdTag } from "@/fratures/questions/dbCache"
import { generateAiQuestionFeedback } from "@/services/ai/questions"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import z from "zod"

const schema = z.object({
    prompt: z.string().min(1),
    questionId: z.string().min(1),
})

export async function POST(req: Request) {
    const body = await req.json()
    const result = schema.safeParse(body)

    if (!result.success) {
        return new Response("Error generating your feedback", { status: 400 })
    }

    const { prompt: answer, questionId } = result.data
    const { userId } = await getCurrentUser()

    if (userId == null) {
        return new Response("You are not logged in", { status: 401 })
    }

    const question = await getQuestion(questionId, userId)
    if (question == null) {
        return new Response("You do not have permission to do this", {
            status: 403,
        })
    }

    try {
        const res = generateAiQuestionFeedback({
            question: question.text,
            answer,
        })

        console.log("Feedback AI result:", res)
        console.log("Text property:", res.text)

        // Wait for the full feedback to be generated
        const feedback = await res.text

        console.log("Generated feedback:", feedback)

        // Return complete feedback as JSON instead of streaming
        return Response.json({ feedback })
    } catch (error) {
        console.error("Feedback generation error:", error)
        return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 })
    }
}

async function getQuestion(id: string, userId: string) {
    "use cache"
    cacheTag(getQuestionIdTag(id))

    const question = await db.query.QuestionTable.findFirst({
        where: eq(QuestionTable.id, id),
        with: { jobInfo: { columns: { id: true, userId: true } } },
    })

    if (question == null) return null
    cacheTag(getJobInfoIdTag(question.jobInfo.id))

    if (question.jobInfo.userId !== userId) return null
    return question
}