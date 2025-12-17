import { db } from "@/drizzle/db"
import { JobInfoTable, QuestionTable } from "@/drizzle/schema"
import { getJobInfoIdTag } from "@/fratures/jobInfos/dbCache"
import { generateAiQuestion } from "@/services/ai/questions"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { and, desc, eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import z from "zod"

const schema = z.object({
  prompt: z.string().min(1),
  jobInfoId: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return new Response("Error generating your question", { status: 400 })
  }

  const { prompt: difficulty, jobInfoId } = result.data
  const { userId } = await getCurrentUser()

  if (userId == null) {
    return new Response("You are not logged in", { status: 401 })
  }

  const jobInfo = await getJobInfo(jobInfoId, userId)
  if (jobInfo == null) {
    return new Response("You do not have permission to do this", {
      status: 403,
    })
  }

  const previousQuestions = await db.query.QuestionTable.findMany({
    where: eq(QuestionTable.jobInfoId, jobInfoId),
    orderBy: desc(QuestionTable.createdAt),
    limit: 10,
    columns: {
      text: true,
      difficulty: true,
    },
  })

  let questionId: string | null = null

  const result_ai = generateAiQuestion({
    jobInfo,
    previousQuestions,
    difficulty: difficulty as any,
    onFinish: async (question) => {
      const [newQuestion] = await db
        .insert(QuestionTable)
        .values({
          jobInfoId,
          text: question,
          difficulty: difficulty as any,
        })
        .returning()
      questionId = newQuestion.id
    },
  })

  return result_ai.toTextStreamResponse()
}

async function getJobInfo(id: string, userId: string) {
  "use cache"
  cacheTag(getJobInfoIdTag(id))

  const jobInfo = await db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
    columns: {
      id: true,
      title: true,
      description: true,
      experienceLevel: true,
    },
  })

  return jobInfo
}