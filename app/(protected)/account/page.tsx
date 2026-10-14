import type { Metadata } from "next";
import { connection } from "next/server";
import { logoutAction } from "@/lib/auth/actions";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Account" };

const ROLE_LABEL = {
  reader: "Reader",
  writer: "Writer",
  superAdmin: "Super admin",
} as const;

export default async function AccountPage() {
  await connection();
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/account");
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12 sm:px-10">
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
      <dl className="grid gap-4 rounded-3xl border border-black/8 bg-white px-5 py-4 dark:border-white/10 dark:bg-zinc-950">
        <div>
          <dt className="text-sm text-zinc-500">Email</dt>
          <dd className="text-lg">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-500">Role</dt>
          <dd className="text-lg">{ROLE_LABEL[user.role]}</dd>
        </div>
      </dl>
      <form action={logoutAction}>
        <button
          className="inline-flex h-12 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background"
          type="submit"
        >
          Log out
        </button>
      </form>
    </main>
  );
}
