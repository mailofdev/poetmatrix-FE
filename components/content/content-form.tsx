"use client";

import { useActionState } from "react";
import { saveContentAction } from "@/lib/content/actions";
import type { ContentItem } from "@/lib/api/types";
import type { ActionState } from "@/lib/validation/auth";
import { FormError, SelectField, SubmitButton, TextField } from "../ui/form";

const initial: ActionState = {};

export function ContentForm({ content }: { content?: ContentItem }) {
  const [state, action, pending] = useActionState(saveContentAction, initial);
  return (
    <form className="flex flex-col gap-5" action={action}>
      {content ? <input type="hidden" name="id" value={content.id} /> : null}
      <TextField
        label="Title"
        name="title"
        defaultValue={content?.title}
        errors={state.fieldErrors?.title}
      />
      <TextField
        label="Genre"
        name="genre"
        defaultValue={content?.genre}
        errors={state.fieldErrors?.genre}
      />
      <SelectField
        label="Save as"
        name="saveAs"
        defaultValue={content?.saveAs === "published" ? "published" : "draft"}
        errors={state.fieldErrors?.saveAs}
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </SelectField>
      <label className="flex flex-col gap-2 text-sm font-medium">
        Writing
        <textarea
          className="min-h-56 rounded-2xl border border-black/10 bg-transparent px-4 py-3 text-base font-normal leading-7 outline-none focus-visible:border-foreground dark:border-white/15"
          name="writings"
          defaultValue={content?.writings}
          required
          aria-invalid={state.fieldErrors?.writings?.length ? true : undefined}
        />
        {state.fieldErrors?.writings?.[0] ? (
          <span className="font-normal text-red-700 dark:text-red-300">
            {state.fieldErrors.writings[0]}
          </span>
        ) : null}
      </label>
      <FormError message={state.error} />
      <SubmitButton>{pending ? "Saving…" : "Save"}</SubmitButton>
    </form>
  );
}
