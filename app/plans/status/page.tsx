import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { backendFetch, readJson } from "@/lib/api/backend";
import { resolveActor } from "@/lib/auth/actor";
import { ACCESS_COOKIE } from "@/lib/auth/session-cookie";
import { getSession } from "@/lib/auth/session";

export default async function PlanStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await connection();
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/plans/status");
  }
  const { error } = await searchParams;
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const response = await backendFetch("/api/v1/billing/status", { token });
  const status = response.ok ? await readJson<{ plan: string }>(response) : { plan: user.plan };
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">Plan</h1>
      <p>Current plan: {status.plan}</p>
      {resolveActor(user) === "writer" ? <p>Checkout uses the server price: Basic ₹199, Pro ₹999.</p> : <p>Writer checkout opens after you become a writer.</p>}
      {error ? <p>Checkout could not start. Payments may be unconfigured.</p> : null}
    </main>
  );
}
