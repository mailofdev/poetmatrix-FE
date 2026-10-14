import type { IssuedSession } from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

type BackendInit = RequestInit & { token?: string | null };

export async function backendFetch(
  path: string,
  { token, ...request }: BackendInit = {},
): Promise<Response> {
  const headers = new Headers(request.headers);
  if (request.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }
  try {
    return await fetch(`${API_URL}${path}`, {
      ...request,
      headers,
      cache: "no-store",
    });
  } catch {
    return new Response(
      JSON.stringify({
        message: "The PoetMatrix API is not reachable.",
      }),
      {
        status: 503,
        headers: { "content-type": "application/json" },
      },
    );
  }
}

export async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) {
      return body.message.join(" ");
    }
    if (typeof body.message === "string") {
      return body.message;
    }
  } catch {
    return "Request failed.";
  }
  return "Request failed.";
}

export async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export function isIssuedSession(value: unknown): value is IssuedSession {
  if (!value || typeof value !== "object") {
    return false;
  }
  const session = value as Partial<IssuedSession>;
  return (
    typeof session.accessToken === "string" &&
    typeof session.refreshToken === "string" &&
    typeof session.accessExpiresIn === "number" &&
    typeof session.refreshExpiresIn === "number"
  );
}
