"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/lib/auth/actions";
import type { ActionState } from "@/lib/validation/auth";
import { FormError, FormNote, SubmitButton, TextField } from "../ui/form";

const initial: ActionState = {};

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initial);
  return (
    <form className="flex flex-col gap-5" action={action}>
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        errors={state.fieldErrors?.email}
      />
      <FormError message={state.error} />
      {state.message ? <FormNote>{state.message}</FormNote> : null}
      <SubmitButton>{pending ? "Sending…" : "Email me a reset link"}</SubmitButton>
    </form>
  );
}
