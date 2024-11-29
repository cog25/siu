import { initTRPC, TRPCError } from '@trpc/server';
import superjson from "superjson";
import { Context } from "./context.ts";
import { TRPCPanelMeta } from 'trpc-ui';
import { Buffer } from 'node:buffer';

 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC
  .context<Context>()
  .meta<TRPCPanelMeta>()
  .create({ transformer: superjson, isServer: true });

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const studentProcedure = t.procedure.use((opts)=>{
  const user = opts.ctx.user;
  // const win = new WebUI();
  // win.show(renderTrpcPanel(appRouter, {
  //   url: `http://localhost:${server.addr.port}/trpc`,
  //   transformer: "superjson"
  // }),);
  // await WebUI.wait();

  if(user.type !== "student") throw new TRPCError({ message: "You must student to use this procedure",code: "UNAUTHORIZED" })
  
  return opts.next({ ctx: { user } })
})

const TOKEN_FOR_TEACHER = Buffer.from(crypto.getRandomValues(new Uint8Array(64))).toString("hex");

export const teacherProcedure = t.procedure.use((opts)=>{
  const user = opts.ctx.user;

  // TODO: 빠른 테스트를 위한 
  // if(user.type !== "teacher") throw new TRPCError({ code: "UNAUTHORIZED" })
  // if(user.token != TOKEN_FOR_TEACHER) throw new TRPCError({ code: "UNAUTHORIZED" })

  return opts.next({ ctx: { user } })
})
