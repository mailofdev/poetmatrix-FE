import Link from "next/link";
import { connection } from "next/server";
import { backendFetch, readError, readJson } from "@/lib/api/backend";
import type { Piece } from "@/lib/api/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string; writer?: string }>;
}) {
  await connection();
  const { q = "", genre, writer } = await searchParams;
  if (q.trim().length < 2) {
    return <main className="mx-auto max-w-3xl px-6 py-12">Search needs at least 2 characters.</main>;
  }
  const params = new URLSearchParams({ q });
  if (genre) params.set("genre", genre);
  if (writer) params.set("writer", writer);
  const response = await backendFetch(`/api/v1/search?${params.toString()}`);
  const pieces = response.ok ? await readJson<Piece[]>(response) : [];
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">Search</h1>
      {!response.ok ? <p>{await readError(response)}</p> : null}
      <ul className="flex flex-col gap-3">
        {pieces.map((piece) => (
          <li key={piece.id}><Link href={`/pieces/${piece.id}`}>{piece.title}</Link></li>
        ))}
      </ul>
    </main>
  );
}
