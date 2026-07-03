import type { User } from "../../drizzle/schema.js";

export type TrpcContext = {
  user: User | null;
  req: {
    protocol: string;
    headers: Record<string, string | string[] | undefined>;
  };
  res: {
    clearCookie: (name: string, options?: Record<string, unknown>) => void;
  };
};
