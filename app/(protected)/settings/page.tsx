import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { preferencesAction } from "@/lib/product/actions";

export default async function SettingsPage() {
  await connection();
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/settings");
  }
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <form className="flex flex-col gap-4" action={preferencesAction}>
        <label className="flex flex-col gap-2 text-sm">
          Theme
          <select className="h-12 rounded-2xl border border-black/10 px-3" name="theme" defaultValue={user.theme}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="pushEnabled" defaultChecked={user.pushEnabled} />
          Allow push notifications
        </label>
        <button className="h-12 rounded-full bg-foreground px-5 text-sm text-background" type="submit">Save</button>
      </form>
      <Link href="/onboarding">Edit reading interests</Link>
    </main>
  );
}
