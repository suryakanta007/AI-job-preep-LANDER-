export * from "./schema/user"
export * from "./schema/jobInfo"
export * from "./schema/interview"
export * from "./schema/question"


// Import all tables and relations
import { UserTable, userRelations } from "./schema/user";
import { JobInfoTable, jobInfoRelations } from "./schema/jobInfo";
import { InterviewTable, interviewRelations } from "./schema/interview";
import { QuestionTable, questionsRelations } from "./schema/question";

export const schema = {
  UserTable,
  JobInfoTable,
  InterviewTable,
  QuestionTable,
  userRelations,
  jobInfoRelations,
  interviewRelations,
  questionsRelations,
} as const;


