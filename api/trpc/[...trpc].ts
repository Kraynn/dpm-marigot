import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers.js";

export default function handler(request: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => ({
      user: null,
      req: {
        protocol: request.headers.get("x-forwarded-proto") === "https" ? "https" : "http",
        headers: Object.fromEntries(request.headers.entries()),
      },
      res: {
        clearCookie: () => {
          // no-op — les cookies auth ne sont pas gérés sur la fonction Vercel
        },
      },
    }),
  });
}
