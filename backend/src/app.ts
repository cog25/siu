import { router } from "./trpc.ts";
import { studentRouter } from "./router/student.ts";
import { teacherRouter } from './router/teacher.ts';


export const appRouter = router({
  student: studentRouter,
  teacher: teacherRouter
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
