import { nodeHTTPRequestHandler } from "@trpc/server/adapters/node-http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { appRouter } from "../../server/routers.js";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = url.pathname.replace(/^\/api\/trpc\//, "");

  return nodeHTTPRequestHandler({
    req,
    res,
    path,
    router: appRouter,
    createContext: () => ({
      user: null,
      req: {
        protocol: req.headers["x-forwarded-proto"] === "https" ? "https" : "http",
        headers: req.headers as Record<string, string | string[] | undefined>,
      },
      res: {
        clearCookie: () => {
          // no-op — les cookies auth ne sont pas gérés sur la fonction Vercel
        },
      },
    }),
  });
}
