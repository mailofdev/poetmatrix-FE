import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Reset password</h1>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          We will respond the same way whether or not an account exists.
          Password delivery by email is not configured yet; development shows a
          one-time reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </main>
  );
}
