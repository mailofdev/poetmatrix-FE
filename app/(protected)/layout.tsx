import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { RefreshSession } from "@/components/auth/refresh-session";
import { getSession } from "@/lib/auth/session";
import { REFRESH_COOKIE } from "@/lib/auth/session-cookie";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
          <p className="text-sm text-zinc-500">Checking your session…</p>
        </main>
      }
    >
      <SessionGate>{children}</SessionGate>
    </Suspense>
  );
}

async function SessionGate({ children }: { children: React.ReactNode }) {
  await connection();
  const user = await getSession();
  if (user) {
    return children;
  }
  const refresh = (await cookies()).get(REFRESH_COOKIE)?.value;
  if (refresh) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <RefreshSession />
      </main>
    );
  }
  redirect("/login");
}
