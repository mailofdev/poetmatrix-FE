import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Choose a new password" };

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Choose a new password</h1>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading form…</p>}>
        <ResetToken searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function ResetToken({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  if (!token) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        This reset link is missing its token.
      </p>
    );
  }
  return <ResetPasswordForm token={token} />;
}
