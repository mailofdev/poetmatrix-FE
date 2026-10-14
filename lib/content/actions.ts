"use server";

import { notFound, redirect } from "next/navigation";
import { authorizedFetch } from "../auth/api-session";
import { readError, readJson } from "../api/backend";
import type { Piece } from "../api/types";
import { fieldErrors, type ActionState } from "../validation/auth";
import { z } from "zod";
import { GENRES } from "./genres";

const saveSchema = z.object({
  title: z.string().trim().min(1).max(200),
  subtitle: z.string().max(300).optional(),
  body: z.string().min(1).max(100000),
  type: z.enum(["story", "article"]),
  articleSubtype: z.string().optional(),
  genre: z.string().optional(),
  status: z.enum(["draft", "published"]),
  visibility: z.enum(["public", "private", "premium"]),
  commentsAllowed: z.boolean(),
});

export async function loadPiece(id: string): Promise<Piece> {
  const response = await authorizedFetch(`/api/v1/content/${id}`);
  if (response.status === 404) {
    notFound();
  }
  if (!response.ok) {
    throw new Error("Unable to load this piece");
  }
  return readJson<Piece>(response);
}

export async function saveContentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const genre = String(formData.get("genre") ?? "");
  const parsed = saveSchema.safeParse({
    title: formData.get("title"),
    subtitle: String(formData.get("subtitle") ?? ""),
    body: formData.get("body"),
    type: formData.get("type") === "article" ? "article" : "story",
    articleSubtype: String(formData.get("articleSubtype") ?? "") || undefined,
    genre: GENRES.includes(genre as (typeof GENRES)[number]) ? genre : undefined,
    status: formData.get("status") === "published" ? "published" : "draft",
    visibility:
      formData.get("visibility") === "private" || formData.get("visibility") === "premium"
        ? formData.get("visibility")
        : "public",
    commentsAllowed: formData.get("commentsAllowed") === "on",
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }
  const id = formData.get("id");
  const updating = typeof id === "string" && id.length > 0;
  const payload = {
    ...parsed.data,
    articleSubtype: parsed.data.articleSubtype || undefined,
    genre: parsed.data.genre || undefined,
    subtitle: parsed.data.subtitle || undefined,
  };
  const response = await authorizedFetch(
    updating ? `/api/v1/content/${id}` : "/api/v1/content",
    { method: "POST", body: JSON.stringify(payload) },
    { rotate: true },
  );
  if (response.status === 401 || response.status === 403) {
    redirect("/login?next=/write");
  }
  if (!response.ok) {
    return { error: await readError(response) };
  }
  const saved = await readJson<Piece>(response);
  redirect(`/write/${saved.id}`);
}

export async function deleteContentAction(id: string): Promise<void> {
  const response = await authorizedFetch(
    `/api/v1/content/${id}`,
    { method: "DELETE" },
    { rotate: true },
  );
  if (!response.ok && response.status !== 404) {
    throw new Error("Unable to delete this piece");
  }
  redirect("/write");
}
