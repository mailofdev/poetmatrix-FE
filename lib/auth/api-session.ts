import { cookies } from "next/headers";
import { backendFetch, isIssuedSession, readJson } from "../api/backend";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  sessionCookieOptions,
} from "./session-cookie";

export async function persistSession(session: {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  refreshExpiresIn: number;
}): Promise<void> {
  const jar = await cookies();
  jar.set(
    ACCESS_COOKIE,
    session.accessToken,
    sessionCookieOptions(session.accessExpiresIn),
  );
  jar.set(
    REFRESH_COOKIE,
    session.refreshToken,
    sessionCookieOptions(session.refreshExpiresIn),
  );
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

export async function rotateSession(): Promise<boolean> {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return false;
  }
  const response = await backendFetch("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    await clearSession();
    return false;
  }
  const body = await readJson<unknown>(response);
  if (!isIssuedSession(body)) {
    await clearSession();
    return false;
  }
  await persistSession(body);
  return true;
}

export async function authorizedFetch(
  path: string,
  init: RequestInit = {},
  options: { rotate?: boolean } = {},
): Promise<Response> {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const first = await backendFetch(path, { ...init, token: access });
  if (first.status !== 401 || !options.rotate) {
    return first;
  }
  const refreshed = await rotateSession();
  if (!refreshed) {
    return first;
  }
  const nextAccess = (await cookies()).get(ACCESS_COOKIE)?.value;
  return backendFetch(path, { ...init, token: nextAccess });
}
