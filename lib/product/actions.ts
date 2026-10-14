"use server";

import { redirect } from "next/navigation";
import { authorizedFetch } from "../auth/api-session";
import { readError } from "../api/backend";
import { changePasswordSchema, fieldErrors, type ActionState } from "../validation/auth";

async function post(path: string, body?: unknown, method = "POST") {
  const response = await authorizedFetch(
    path,
    {
      method,
      body: body ? JSON.stringify(body) : undefined,
    },
    { rotate: true },
  );
  return response;
}

export async function likeAction(id: string) {
  await post(`/api/v1/content/${id}/like`);
  redirect(`/pieces/${id}`);
}

export async function bookmarkAction(id: string) {
  await post(`/api/v1/content/${id}/bookmark`);
  redirect(`/pieces/${id}`);
}

export async function commentAction(id: string, formData: FormData) {
  await post(`/api/v1/content/${id}/comments`, { body: String(formData.get("body") ?? "") });
  redirect(`/pieces/${id}`);
}

export async function reportAction(id: string, formData: FormData) {
  await post(`/api/v1/content/${id}/report`, { reason: String(formData.get("reason") ?? "") });
  redirect(`/pieces/${id}`);
}

export async function viewAction(id: string) {
  await post(`/api/v1/content/${id}/view`);
}

export async function progressAction(id: string, percent: number, scroll: number) {
  await post(`/api/v1/content/${id}/progress`, { percent, scroll });
}

export async function followAction(id: string) {
  await post(`/api/v1/users/${id}/follow`);
  redirect(`/writers/${id}`);
}

export async function profileAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const payload: Record<string, string> = {};
  for (const key of ["displayName", "penName", "bio", "gender", "phone"]) {
    const value = String(formData.get(key) ?? "").trim();
    if (value) {
      payload[key] = value;
    }
  }
  const response = await post("/api/v1/users/me", payload, "PATCH");
  if (!response.ok) {
    return { error: await readError(response) };
  }
  return { message: "Profile saved." };
}

export async function modeAction(formData: FormData) {
  await post("/api/v1/users/me/mode", { mode: String(formData.get("mode")) });
  redirect("/");
}

export async function becomeWriterAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const response = await post("/api/v1/users/me/become-writer", {
    fullName: String(formData.get("fullName") ?? ""),
    penName: String(formData.get("penName") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    phone: String(formData.get("phone") ?? "") || undefined,
    gender: String(formData.get("gender") ?? ""),
  });
  if (!response.ok) {
    return { error: await readError(response) };
  }
  redirect("/write");
}

export async function passwordAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }
  const response = await post("/api/v1/users/me/password", parsed.data);
  if (!response.ok) {
    return { error: await readError(response) };
  }
  return { message: "Password changed." };
}

export async function interestsAction(formData: FormData) {
  const genres = formData.getAll("genres").map(String);
  await post("/api/v1/users/me/interests", { genres });
  redirect("/");
}

export async function preferencesAction(formData: FormData) {
  await post("/api/v1/users/me/preferences", {
    theme: String(formData.get("theme") ?? "system"),
    pushEnabled: formData.get("pushEnabled") === "on",
  });
  redirect("/settings");
}

export async function deleteAccountAction() {
  const response = await post("/api/v1/users/me", undefined, "DELETE");
  if (!response.ok) {
    throw new Error("Account deletion did not finish. You can try again.");
  }
  const { clearSession } = await import("../auth/api-session");
  await clearSession();
  redirect("/");
}

export async function contactAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const response = await post("/api/v1/contact", {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  });
  if (!response.ok) {
    return { error: await readError(response) };
  }
  return { message: "Message received." };
}

export async function checkoutAction(formData: FormData) {
  const response = await post("/api/v1/billing/checkout", {
    plan: String(formData.get("plan")),
  });
  if (!response.ok) {
    redirect(`/plans/checkout?error=1`);
  }
  redirect("/plans/status");
}

export async function markAllReadAction() {
  await post("/api/v1/notifications/read-all");
  redirect("/notifications");
}
