import { z } from "zod";
import { router, studentProcedure, teacherProcedure } from "../trpc.ts";
import { EventEmitter, on } from "node:events"
import { db } from "../db/drizzle.ts";
import { students } from "../db/schema.ts";

export const teacherEventBroker = new EventEmitter<{ "start": [], "end": [], "connected": [] }>();
let testStatus: "WAITING" | "STARTED" | "ENDED" = "WAITING";


teacherEventBroker.on("connected", () => {
  if (testStatus === "STARTED") teacherEventBroker.emit("start")
  else if (testStatus === "ENDED") teacherEventBroker.emit("end")

});


export const teacherRouter = router({
  startTest: teacherProcedure
    .mutation((opts) => {
      testStatus = "STARTED"
      return teacherEventBroker.emit("start");
    }),
  endTest: teacherProcedure
    .mutation((opts) => {
      testStatus = "STARTED"
      return teacherEventBroker.emit("start");
    })
});