import Link from "next/link";
import { connection } from "next/server";
import { backendFetch, readJson } from "@/lib/api/backend";
import { resolveActor } from "@/lib/auth/actor";
import { getSession } from "@/lib/auth/session";
import { checkoutAction } from "@/lib/product/actions";

type PlanCard = { plan: string; priceLabel: string; cap: number | null };

export default async function PlansPage() {
  await connection();
  const response = await backendFetch("/api/v1/billing/plans");
  const plans = response.ok ? await readJson<PlanCard[]>(response) : [];
  const user = await getSession();
  const actor = resolveActor(user);
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Writer plans</h1>
      <ul className="grid gap-4">
        {plans.map((plan) => (
          <li className="rounded-3xl border border-black/10 px-5 py-4 dark:border-white/15" key={plan.plan}>
            <h2 className="text-xl font-semibold capitalize">{plan.plan}</h2>
            <p>{plan.priceLabel} · {plan.cap === null ? "No publish cap" : `${plan.cap} published pieces a month`} · Public</p>
            {actor === "writer" && plan.plan !== "free" ? (
              <form action={checkoutAction}>
                <input type="hidden" name="plan" value={plan.plan} />
                <button className="mt-3 underline" type="submit">Checkout</button>
              </form>
            ) : null}
          </li>
        ))}
      </ul>
      {user ? <Link href="/plans/status">Your plan</Link> : <Link href="/register">Create an account</Link>}
    </main>
  );
}
