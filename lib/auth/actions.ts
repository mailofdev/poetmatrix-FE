"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { backendFetch, readError, readJson } from "../api/backend";
import type { IssuedSession } from "../api/types";
import {
  fieldErrors,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  type ActionState,
} from "../validation/auth";
import { clearSession, persistSession } from "./api-session";
import { ACCESS_COOKIE, REFRESH_COOKIE, safeNextPath } from "./session-cookie";

export async function loginAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const response = await backendFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });
  if (!response.ok) {
    return { error: await readError(response) };
  }
  await persistSession(await readJson<IssuedSession>(response));
  redirect(safeNextPath(formData.get("next")));
}

export async function registerAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const response = await backendFetch("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });
  if (!response.ok) {
    return { error: await readError(response) };
  }

  const login = await backendFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: parsed.data.email,
      password: parsed.data.password,
    }),
  });
  if (!login.ok) {
    redirect("/login");
  }
  await persistSession(await readJson<IssuedSession>(login));
  redirect("/library");
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (refreshToken) {
    await backendFetch("/api/v1/auth/logout", {
      method: "POST",
      token: access,
      body: JSON.stringify({ refreshToken }),
    });
  }
  await clearSession();
  redirect("/");
}

export async function forgotPasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }
  const response = await backendFetch("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });
  if (!response.ok) {
    return { error: await readError(response) };
  }
  const body = await readJson<{
    message?: string;
    developmentResetToken?: string;
  }>(response);
  return {
    message:
      body.message ??
      "If an account exists, reset instructions were issued.",
    developmentResetToken: body.developmentResetToken,
  };
}

export async function resetPasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }
  const response = await backendFetch("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });
  if (!response.ok) {
    return { error: await readError(response) };
  }
  redirect("/login");
}
