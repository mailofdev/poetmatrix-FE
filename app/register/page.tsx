import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { TextLink } from "@/components/ui/form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Readers browse published work. Writers can also keep drafts.{" "}
          <TextLink href="/login">Sign in</TextLink>
        </p>
      </div>
      <RegisterForm />
    </main>
  );
}
