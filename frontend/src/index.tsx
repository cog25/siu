/* @refresh reload */

import { render } from "solid-js/web";
import { routes } from "@generouted/solid-router";
import { HashRouter } from "@solidjs/router";
import { Toaster } from "~/components/ui/sonner";

import "./index.css";
import "virtual:uno.css";
import "@unocss/reset/tailwind-compat.css";
import type { CreateTRPCClient } from "@trpc/client";
import { AppRouter } from "@siu/backend/src/app";
import superjson from "superjson";
import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

// const client = createTRPCClient<AppRouter>({
//   links: [
//     httpBatchLink({
//       url: 'http://localhost:3000/trpc',
//       transformer: superjson,
//       // You can pass any HTTP headers you wish here
//       async headers() {
//         return {
//           authorization: ""
//         };
//       },
//     }),
//   ],
// });

const [trpc, setTrpc] = createStore<{ client?: CreateTRPCClient<AppRouter> }>({});

const TRPCContext = createContext<typeof trpc>()
export const useTRPC = () => useContext(TRPCContext);
export const setTRPC = (client: CreateTRPCClient<AppRouter>) => setTrpc({ client });

render(
  () => (
    <HashRouter
      root={(props) => (
        <>
        <TRPCContext.Provider value={trpc}>
          {props.children}
        </TRPCContext.Provider>
          <Toaster expand={true} />
        </>
      )}
    >
      {routes}
    </HashRouter>
  ),
  document.getElementById("root")!,
);

// import { attachDevtoolsOverlay } from "@solid-devtools/overlay";
// if (import.meta.env.DEV) {
//   attachDevtoolsOverlay();
// }
