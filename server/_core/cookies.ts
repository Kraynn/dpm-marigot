import type { TrpcContext } from "./context.js";

export function getSessionCookieOptions(req: TrpcContext["req"]) {
  const secure = req.protocol === "https";
  return {
    httpOnly: true,
    secure,
    sameSite: (secure ? "none" : "lax") as "none" | "lax",
    path: "/",
  } as const;
}
