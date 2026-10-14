import Link from "next/link";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { backendFetch, readJson } from "@/lib/api/backend";
import type { Piece } from "@/lib/api/types";
import { ACCESS_COOKIE } from "@/lib/auth/session-cookie";
import { getSession } from "@/lib/auth/session";

export default async function LibraryPage() {
  await connection();
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/library");
  }
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const response = await backendFetch("/api/v1/library", { token });
  const pieces = response.ok ? await readJson<Piece[]>(response) : [];
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">Library</h1>
      <Link href="/following">Writers you follow</Link>
      {pieces.length === 0 ? <p className="text-sm text-zinc-500">Bookmarks you save will appear here.</p> : null}
      <ul className="flex flex-col gap-3">
        {pieces.map((piece) => (
          <li key={piece.id}><Link href={`/pieces/${piece.id}`}>{piece.title}</Link></li>
        ))}
      </ul>
    </main>
  );
}
