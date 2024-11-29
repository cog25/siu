import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { z } from "zod";
import { Buffer } from "node:buffer"

export const StudentSchema = z.object({
  type: z.literal("student"),
  name: z.string(),
  id: z.number().gt(10000).lt(70000)
})

export const TeacherSchema = z.object({
  type: z.literal("teacher"),
  token: z.string(),
})

export const GuestSchema = z.object({
  type: z.literal("guest"),
});

export const UserSchema = z.union([StudentSchema, TeacherSchema, GuestSchema])


const dummyGuest: z.infer<typeof GuestSchema> = { type: "guest" }

function parseUser(auth?: string): z.infer<typeof UserSchema> {
  if(!auth || !auth.startsWith("Basic ")) return dummyGuest;
  try {
    const parsed = JSON.parse(
      Buffer
        .from(auth.replace("Basic ", ""), "base64")
        .toString()
    )
    const { success, data } = UserSchema.safeParse(parsed);
  
    console.log(data)
  
    if(success) return data
  } catch {;}

  return dummyGuest
}

export async function createContext({
  req
}: FetchCreateContextFnOptions) {
  console.debug(req.headers.get("Authorization"));
  const user = parseUser(req.headers.get("Authorization") ?? undefined);
  console.debug(user);
  return {
    user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;