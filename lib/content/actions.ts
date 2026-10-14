"use server";

import { notFound, redirect } from "next/navigation";
import { authorizedFetch } from "../auth/api-session";
import { readError, readJson } from "../api/backend";
import type { ContentItem, ContentPage } from "../api/types";
import { contentSchema } from "../validation/content";
import { fieldErrors, type ActionState } from "../validation/auth";

export async function loadContentPage(
  page = 1,
): Promise<ContentPage | { error: string }> {
  const response = await authorizedFetch(
    `/api/v1/content?page=${page}&limit=20`,
  );
  if (response.status === 401) {
    redirect("/login?next=/library");
  }
  if (!response.ok) {
    return { error: await readError(response) };
  }
  return readJson<ContentPage>(response);
}

export async function loadContent(id: string): Promise<ContentItem> {
  const response = await authorizedFetch(`/api/v1/content/${id}`);
  if (response.status === 404) {
    notFound();
  }
  if (response.status === 401) {
    redirect(`/login?next=/write/${id}`);
  }
  if (!response.ok) {
    throw new Error("Unable to load this piece");
  }
  return readJson<ContentItem>(response);
}

export async function saveContentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = contentSchema.safeParse({
    title: formData.get("title"),
    genre: formData.get("genre"),
    saveAs: formData.get("saveAs"),
    writings: formData.get("writings"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const id = formData.get("id");
  const path =
    typeof id === "string" && id.length > 0
      ? `/api/v1/content/${id}`
      : "/api/v1/content";
  const response = await authorizedFetch(
    path,
    {
      method: typeof id === "string" && id.length > 0 ? "PATCH" : "POST",
      body: JSON.stringify(parsed.data),
    },
    { rotate: true },
  );
  if (response.status === 401) {
    redirect("/login?next=/write");
  }
  if (!response.ok) {
    return { error: await readError(response) };
  }
  const saved = await readJson<ContentItem>(response);
  redirect(`/write/${saved.id}`);
}

export async function deleteContentAction(id: string): Promise<void> {
  const response = await authorizedFetch(
    `/api/v1/content/${id}`,
    { method: "DELETE" },
    { rotate: true },
  );
  if (response.status === 401) {
    redirect("/login?next=/library");
  }
  if (!response.ok && response.status !== 404) {
    throw new Error("Unable to delete this piece");
  }
  redirect("/library");
}
