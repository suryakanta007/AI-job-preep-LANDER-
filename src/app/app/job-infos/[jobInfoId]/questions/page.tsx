import { db } from "@/drizzle/db"
import { JobInfoTable } from "@/drizzle/schema"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { and, eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { NewQuestionClientPage } from "./_NewQuestionClientPage"

export default async function NewQuestionPage({
    params,
}: {
    params: Promise<{ jobInfoId: string }>
}) {
    const { jobInfoId } = await params
    const { userId, redirectToSignIn } = await getCurrentUser()

    if (userId == null) return redirectToSignIn()

    const jobInfo = await db.query.JobInfoTable.findFirst({
        where: and(eq(JobInfoTable.id, jobInfoId), eq(JobInfoTable.userId, userId)),
        columns: {
            id: true,
            name: true,
            title: true,
        },
    })

    if (jobInfo == null) return notFound()

    return <NewQuestionClientPage jobInfo={jobInfo} />
}
