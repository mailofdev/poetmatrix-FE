"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/lib/auth/actions";
import type { ActionState } from "@/lib/validation/auth";
import { FormError, SubmitButton, TextField } from "../ui/form";

const initial: ActionState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, initial);
  return (
    <form className="flex flex-col gap-5" action={action}>
      <input type="hidden" name="token" value={token} />
      <TextField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        errors={state.fieldErrors?.password}
      />
      <FormError message={state.error} />
      <SubmitButton>{pending ? "Updating…" : "Update password"}</SubmitButton>
    </form>
  );
}
