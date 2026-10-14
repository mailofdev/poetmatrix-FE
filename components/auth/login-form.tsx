"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/auth/actions";
import type { ActionState } from "@/lib/validation/auth";
import { GoogleButton } from "./google-button";
import { FormError, SubmitButton, TextField, TextLink } from "../ui/form";

const initial: ActionState = {};

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form className="flex flex-col gap-5" action={action}>
      <input type="hidden" name="next" value={nextPath} />
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
        autoComplete="current-password"
        errors={state.fieldErrors?.password}
      />
      <FormError message={state.error} />
      <SubmitButton>{pending ? "Signing in…" : "Sign in"}</SubmitButton>
      <GoogleButton next={nextPath} />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        <TextLink href="/forgot-password">Forgot password</TextLink>
      </p>
    </form>
  );
}
