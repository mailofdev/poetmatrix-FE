"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/auth/actions";
import type { ActionState } from "@/lib/validation/auth";
import { GoogleButton } from "./google-button";
import { FormError, SubmitButton, TextField } from "../ui/form";

const initial: ActionState = {};

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial);
  return (
    <form className="flex flex-col gap-5" action={action}>
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        errors={state.fieldErrors?.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        errors={state.fieldErrors?.password}
      />
      <FormError message={state.error} />
      <SubmitButton>{pending ? "Creating account…" : "Create account"}</SubmitButton>
      <GoogleButton />
    </form>
  );
}
