import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { safeNextPath } from "@/lib/auth/session-cookie";
import { TextLink } from "@/components/ui/form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          New here? <TextLink href="/register">Create an account</TextLink>
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading form…</p>}>
        <LoginNext searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function LoginNext({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextValue = Array.isArray(params.next) ? params.next[0] : params.next;
  return <LoginForm nextPath={safeNextPath(nextValue)} />;
}
