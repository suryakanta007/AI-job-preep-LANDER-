import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { de } from "zod/locales";
import { UserTable } from "./user";
import { relations } from "drizzle-orm/relations";
import { QuestionTable } from "./questions";
import { InterviewTable } from "./interview";

export const experienceLevels = ["junior","mid-level","senior"] as const;
export type ExprienceLevel = (typeof experienceLevels)[number]; 

export const experienceLevelEnum = pgEnum(
    "job_infos_experience_level",
    experienceLevels
)


export const JobInfoTable = pgTable("job_info",{
    id,
    title:varchar(),
    name:varchar(),
    experienceLevel:experienceLevelEnum().notNull(),
    description:varchar().notNull(),
    userId:varchar()
    .references(()=> UserTable.id,{onDelete:"cascade"})
    .notNull(),
    createdAt,
    updatedAt
})

export const jobInfoRelations = relations(JobInfoTable, ({ one, many }) => ({
    user: one(UserTable, {
      fields: [JobInfoTable.userId],
      references: [UserTable.id],
    }),
    questions: many(QuestionTable),
    interviews: many(InterviewTable),
  }))