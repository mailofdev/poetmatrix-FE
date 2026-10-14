import type { SessionUser } from "../api/types";

export type Actor = "guest" | "reader" | "writer" | "superadmin";

export function resolveActor(user: SessionUser | null): Actor {
  if (!user) {
    return "guest";
  }
  if (user.role === "admin" || user.role === "superadmin") {
    return "superadmin";
  }
  if (user.mode === "writer" && user.writerSubscription) {
    return "writer";
  }
  return "reader";
}
