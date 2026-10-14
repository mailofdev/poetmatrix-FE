import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { AccountForms } from "@/components/account/account-forms";
import { resolveActor } from "@/lib/auth/actor";
import { getSession } from "@/lib/auth/session";
import { deleteAccountAction } from "@/lib/product/actions";

export default async function AccountPage() {
  await connection();
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/account");
  }
  const actor = resolveActor(user);
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <h1 className="text-3xl font-semibold">Account</h1>
      <p className="text-sm text-zinc-500">{user.email} · {actor} · {user.plan}</p>
      <Link href="/settings">Settings</Link>
      <Link href="/plans/status">Plan status</Link>
      <AccountForms user={user} actor={actor} />
      <form action={deleteAccountAction}>
        <button className="text-sm text-red-700" type="submit">Delete account</button>
      </form>
    </main>
  );
}
