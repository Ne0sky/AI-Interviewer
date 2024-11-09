import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mock_interview", {
    id: serial('id').primaryKey(),
    jsonMockresp:text('json_mockresp').notNull(),
    jobPosition: varchar('job_position').notNull(),
    jobDesc: varchar('job_desc').notNull(),
    jobExperience: varchar('job_experience').notNull(),
    createdBy: varchar('created_by').notNull(),
    createdAt: varchar('created_at'),
    mockId: varchar('mock_id').notNull(),
});

export const UserAnswer = pgTable("user_answer", {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mock_id').notNull(),
    question: varchar('question').notNull(),
    correctAns: text('CorrectAns'),
    userAns: text('userAns'),
    rating: varchar('rating'),
    feedback: varchar('feedback'),
    userEmail: varchar('userEmail'),
    createdAt: varchar('created_at'),
});