import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers.js";

export default function handler(request: Request) {
  // Le runtime Node de Vercel fournit une Request dont `.url` est un chemin
  // relatif ; fetchRequestHandler fait `new URL(req.url)` et exige une URL
  // absolue, d'où ERR_INVALID_URL sans cette reconstruction.
  const protocol = request.headers.get("x-forwarded-proto") === "https" ? "https" : "http";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "localhost";
  const absoluteUrl = new URL(request.url, `${protocol}://${host}`);
  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  const absoluteRequest = new Request(absoluteUrl, {
    method: request.method,
    headers: request.headers,
    body: hasBody ? request.body : undefined,
    ...(hasBody ? { duplex: "half" } : {}),
  } as RequestInit);

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: absoluteRequest,
    router: appRouter,
    createContext: () => ({
      user: null,
      req: {
        protocol,
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
