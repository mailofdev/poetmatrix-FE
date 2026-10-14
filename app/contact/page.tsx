"use client";

import { useActionState } from "react";
import { contactAction } from "@/lib/product/actions";
import type { ActionState } from "@/lib/validation/auth";
import { FormError, FormNote, SubmitButton, TextField } from "@/components/ui/form";

const initial: ActionState = {};

export default function ContactPage() {
  const [state, action, pending] = useActionState(contactAction, initial);
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <form className="flex flex-col gap-4" action={action}>
        <TextField label="Name" name="name" errors={state.fieldErrors?.name} />
        <TextField label="Email" name="email" type="email" errors={state.fieldErrors?.email} />
        <TextField label="Subject" name="subject" errors={state.fieldErrors?.subject} />
        <label className="flex flex-col gap-2 text-sm font-medium">
          Message
          <textarea className="min-h-32 rounded-2xl border border-black/10 px-4 py-3 dark:border-white/15" name="message" required minLength={10} />
        </label>
        <FormError message={state.error} />
        {state.message ? <FormNote>{state.message}</FormNote> : null}
        <SubmitButton>{pending ? "Sending…" : "Send"}</SubmitButton>
      </form>
    </main>
  );
}
