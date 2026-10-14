import Link from "next/link";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { backendFetch, readJson } from "@/lib/api/backend";
import type { Piece } from "@/lib/api/types";
import { resolveActor } from "@/lib/auth/actor";
import { ACCESS_COOKIE } from "@/lib/auth/session-cookie";
import { getSession } from "@/lib/auth/session";

export default async function ActivityPage() {
  await connection();
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/activity");
  }
  const actor = resolveActor(user);
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (actor === "writer") {
    const response = await backendFetch("/api/v1/content/mine", { token });
    const pieces = response.ok ? await readJson<Piece[]>(response) : [];
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-semibold">Writing activity</h1>
        <ul className="mt-4 flex flex-col gap-2">
          {pieces.map((piece) => <li key={piece.id}><Link href={`/write/${piece.id}`}>{piece.title}</Link> · {piece.status}</li>)}
        </ul>
      </main>
    );
  }
  const response = await backendFetch("/api/v1/reading/continue", { token });
  const rows = response.ok ? await readJson<Array<{ contentId: string; percent: number }>>(response) : [];
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Reading history</h1>
      <ul className="mt-4 flex flex-col gap-2">
        {rows.map((row) => <li key={row.contentId}><Link href={`/pieces/${row.contentId}`}>{row.percent}%</Link></li>)}
      </ul>
    </main>
  );
}
