import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "./schema.ts";
import { dropRight } from "es-toolkit";

export const db = drizzle({ schema });
await migrate(db, { migrationsFolder: dropRight(import.meta.dirname!.split('/'), 2).join('/') + "/drizzle" })

// await db.insert(schema.students).values({ id: 20901, name: "강태웅" })

// console.log(await db.query.students.findMany())

// await db.$client.dumpDataDir("gzip").then(async (file) => {
//   await Deno.writeFile("./dump", new Uint8Array(await file.arrayBuffer()))
// })

