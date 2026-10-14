import type { Metadata } from "next";
import { connection } from "next/server";
import { ContentForm } from "@/components/content/content-form";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Write" };

export default async function WritePage() {
  await connection();
  const user = await getSession();
  if (!user || user.role === "reader") {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:px-10">
        <h1 className="text-3xl font-semibold tracking-tight">Writers only</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          This account can read published work. Creating and editing pieces
          requires a writer or super admin role.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12 sm:px-10">
      <h1 className="text-3xl font-semibold tracking-tight">New piece</h1>
      <ContentForm />
    </main>
  );
}
