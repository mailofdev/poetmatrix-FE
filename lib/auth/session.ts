import { cache } from "react";
import { cookies } from "next/headers";
import { backendFetch, readJson } from "../api/backend";
import type { SessionUser } from "../api/types";
import {
  ACCESS_COOKIE,
  accessTokenExpiring,
} from "./session-cookie";

export const getSession = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (!access || accessTokenExpiring(access)) {
    return null;
  }
  const response = await backendFetch("/api/v1/auth/me", { token: access });
  if (!response.ok) {
    return null;
  }
  return readJson<SessionUser>(response);
});
