export * from "./schema/user"
export * from "./schema/jobInfo"
export * from "./schema/interview"
export * from "./schema/questions"


// Add this to the same file (or create src/db/schemaMap.ts)
import { UserTable } from "./schema/user";
import { JobInfoTable } from "./schema/jobInfo";
import { InterviewTable } from "./schema/interview";
import { QuestionTable } from "./schema/questions";

export const schema = {
    UserTable,
    JobInfoTable,
    InterviewTable,
    QuestionTable,
  } as const;
  

