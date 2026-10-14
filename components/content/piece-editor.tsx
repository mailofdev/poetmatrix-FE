"use client";

import { useActionState, useEffect } from "react";
import { saveContentAction } from "@/lib/content/actions";
import { GENRES, ARTICLE_SUBTYPES } from "@/lib/content/genres";
import type { Piece } from "@/lib/api/types";
import type { ActionState } from "@/lib/validation/auth";
import { FormError, SelectField, SubmitButton, TextField } from "../ui/form";

const initial: ActionState = {};
const draftKey = "poetmatrix-draft";

export function PieceEditor({
  piece,
  prompt,
  features,
}: {
  piece?: Piece;
  prompt?: string;
  features: {
    images: boolean;
    tables: boolean;
    video: boolean;
    source: boolean;
  };
}) {
  const [state, action, pending] = useActionState(saveContentAction, initial);
  const storageKey = piece ? `${draftKey}-${piece.id}` : draftKey;

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (sessionStorage.getItem(storageKey)) {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [storageKey]);

  return (
    <form
      className="flex flex-col gap-5"
      action={action}
      onChange={(event) => {
        const data = new FormData(event.currentTarget);
        sessionStorage.setItem(storageKey, String(data.get("body") ?? ""));
      }}
    >
      {piece ? <input type="hidden" name="id" value={piece.id} /> : null}
      <TextField label="Title" name="title" defaultValue={piece?.title} errors={state.fieldErrors?.title} />
      <TextField label="Subtitle" name="subtitle" defaultValue={piece?.subtitle} optional />
      <SelectField label="Type" name="type" defaultValue={piece?.type ?? "story"}>
        <option value="story">Story</option>
        <option value="article">Article</option>
      </SelectField>
      <SelectField label="Article subtype" name="articleSubtype" defaultValue={piece?.articleSubtype ?? ""}>
        <option value="">None</option>
        {ARTICLE_SUBTYPES.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </SelectField>
      <SelectField label="Genre" name="genre" defaultValue={piece?.genre}>
        <option value="">Choose when you publish</option>
        {GENRES.map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </SelectField>
      <SelectField label="Save as" name="status" defaultValue={piece?.status ?? "draft"}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </SelectField>
      <SelectField label="Visibility" name="visibility" defaultValue={piece?.visibility ?? "public"}>
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="premium">Premium</option>
      </SelectField>
      <label className="flex items-center gap-2 text-sm">
        <input name="commentsAllowed" type="checkbox" defaultChecked={piece?.commentsAllowed ?? true} />
        Allow comments
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium">
        Body
        <textarea
          className="min-h-64 rounded-2xl border border-black/10 bg-transparent px-4 py-3 text-base font-normal outline-none focus-visible:border-foreground dark:border-white/15"
          name="body"
          defaultValue={piece?.body ?? prompt ?? ""}
          required
        />
      </label>
      <p className="text-sm text-zinc-500">
        Free plans include formatting and links.
        {features.images ? " Images, tables, and alignment are available." : ""}
        {features.video ? " Video, source, and fullscreen are available." : ""}
      </p>
      {piece?.limitReason ? (
        <p className="text-sm text-red-700 dark:text-red-300">Saved as a draft: {piece.limitReason}</p>
      ) : null}
      <FormError message={state.error} />
      <SubmitButton>{pending ? "Saving…" : "Save"}</SubmitButton>
    </form>
  );
}
