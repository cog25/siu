import { renderTrpcPanel } from "trpc-ui";
import { appRouter } from "./app.ts";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "./context.ts";

import { ip2int } from "../../frontend/src/utils/ip.ts"
import { Buffer } from "node:buffer";

const server = Deno.serve((req) => {
  const url = new URL(req.url);
  
  if (url.pathname === "/") return new Response(
    renderTrpcPanel(appRouter, {
      url: `${url.origin}/trpc`,
      transformer: "superjson"
    }),
    { headers: { "content-type":"text/html;charset=UTF-8" } }
  )
  
  return fetchRequestHandler({
    router: appRouter,
    endpoint: "/trpc",
    req,
    createContext
  })
});

console.log(ip2int("127.0.0.1").toString(26))

// import { WebUI } from "https://deno.land/x/webui/mod.ts";

// const win = new WebUI();
// win.show(renderTrpcPanel(appRouter, {
//   url: `http://localhost:${server.addr.port}/trpc`,
//   transformer: "superjson"
// }),);
// await WebUI.wait();