import { pgTable, integer, text, time, serial } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm";

export const students = pgTable('students', {
  name: text().notNull(),
  id: integer().primaryKey(),
  createdAt: time().defaultNow().notNull(),
  testStartedAt: time(),
  testEndedAt: time(),
  ip: text()
});

export const studentsRelations = relations(students, ({ many }) => ({
  submissions: many(submissions),
}))

export const submissions = pgTable("submissions", {
  id: serial().primaryKey(),
  createdAt: time().defaultNow().notNull(),

  studentId: integer().notNull(),
  problemId: integer().notNull(),
})

export const submissionsRelations = relations(students, ({ one }) => ({
  student: one(submissions, {
    fields: [students.id],
    references: [submissions.studentId],
  }),
}));