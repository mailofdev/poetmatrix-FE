import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { logoutAction } from "@/lib/auth/actions";
import { getSession } from "@/lib/auth/session";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-5 sm:px-10">
      <Link className="text-lg font-semibold tracking-tight" href="/">
        PoetMatrix
      </Link>
      <Suspense fallback={<span className="text-sm text-zinc-500">Account</span>}>
        <HeaderSession />
      </Suspense>
    </header>
  );
}

async function HeaderSession() {
  await connection();
  const user = await getSession();
  if (!user) {
    return (
      <nav className="flex items-center gap-4 text-sm font-medium" aria-label="Account">
        <Link href="/login">Sign in</Link>
        <Link
          className="inline-flex h-10 items-center rounded-full bg-foreground px-4 text-background"
          href="/register"
        >
          Join
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4 text-sm font-medium" aria-label="Account">
      <Link href="/library">Library</Link>
      {user.role === "reader" ? null : <Link href="/write">Write</Link>}
      <Link href="/account">Account</Link>
      <form action={logoutAction}>
        <button className="underline-offset-4 hover:underline" type="submit">
          Log out
        </button>
      </form>
    </nav>
  );
}
