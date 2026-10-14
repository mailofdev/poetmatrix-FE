"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/lib/auth/actions";
import type { ActionState } from "@/lib/validation/auth";
import { FormError, FormNote, SubmitButton, TextField, TextLink } from "../ui/form";

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
      {state.developmentResetToken ? (
        <FormNote>
          Development reset link:{" "}
          <TextLink href={`/reset-password?token=${encodeURIComponent(state.developmentResetToken)}`}>
            set a new password
          </TextLink>
        </FormNote>
      ) : null}
      <SubmitButton>{pending ? "Sending…" : "Send reset link"}</SubmitButton>
    </form>
  );
}
