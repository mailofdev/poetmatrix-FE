export const ACCESS_COOKIE = "pm_access";
export const REFRESH_COOKIE = "pm_refresh";

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function safeNextPath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return "/library";
  }
  if (value.startsWith("//") || value.startsWith("/\\") || value.includes("://")) {
    return "/library";
  }
  if (value.startsWith("/login") || value.startsWith("/register")) {
    return "/library";
  }
  return value;
}

export function accessTokenExpiring(token: string, skewSeconds = 60): boolean {
  const payload = token.split(".")[1];
  if (!payload) {
    return true;
  }
  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { exp?: unknown };
    return (
      typeof decoded.exp !== "number" ||
      decoded.exp * 1000 <= Date.now() + skewSeconds * 1000
    );
  } catch {
    return true;
  }
}
