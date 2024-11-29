
import { z } from "zod";
import { router, studentProcedure } from "../trpc.ts";
import { EventEmitter, on } from "node:events"
import { db } from "../db/drizzle.ts";
import { students, submissions } from "../db/schema.ts";
import { and, eq, sql } from "drizzle-orm";
import { teacherEventBroker } from "./teacher.ts";
import { omit } from "es-toolkit"




export const studentRouter = router({
  join: studentProcedure
    .meta({ description: "시험의 참가를 알리고 시험의 Metadata를 받습니다." })
    .input(z.object({
      ip: z.string()
    }))
    .output(z.object({
      시험명: z.string(),
      문항수: z.number(),
      problems: z.record(z.string(), z.string())
    }))
    .mutation(async ({ ctx: { user: { id, name } }, input: { ip } }) => {

      await db.insert(students).values({ id, name, ip });

      return {
        시험명: "테스트시험",
        문항수: 5,
        problems: {
          "1": "문제1",
          "2": "문제2",
          "3": "문제3",
          "4": "문제4",
          "5": "문제5",
        }
      }
    }),

  subscribeStart: studentProcedure.subscription(async function* ({ signal, ctx: { user } }) {
    // listen for new events
    for await (const [_data] of on(teacherEventBroker, 'start', {
      signal: signal,
    })) {
      yield { type: "start" } as const
      await db
        .update(students)
        .set({ testStartedAt: sql`NOW()` })
        .where(
          and(
            eq(students.name, user.name),
            eq(students.id, user.id)
          )
        )
    }
  }),

  subscribeEnd: studentProcedure.subscription(async function* ({ signal, ctx: { user } }) {
    // listen for new events
    for await (const [_data] of on(teacherEventBroker, 'end', {
      signal: signal,
    })) {
      yield { type: "end" } as const
      await db
        .update(students)
        .set({ testEndedAt: sql`NOW()` })
        .where(
          and(
            eq(students.name, user.name),
            eq(students.id, user.id)
          )
        )
    }
  }),

  submit: studentProcedure
    .input(z.object({
      problemId: z.number(),
      source: z.string()
    }))
    .mutation(async ({ ctx: { user }, input }) => {
      await db.insert(submissions).values({
        studentId: user.id,
        ...input
      })
      return;
    })

});

