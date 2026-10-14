import Link from "next/link";
import { connection } from "next/server";
import { backendFetch, readJson } from "@/lib/api/backend";
import type { Piece } from "@/lib/api/types";
import { GENRES } from "@/lib/content/genres";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; cursor?: string }>;
}) {
  await connection();
  const { genre, cursor } = await searchParams;
  const params = new URLSearchParams({ limit: "20" });
  if (cursor) params.set("cursor", cursor);
  if (genre) params.set("genre", genre);
  const response = await backendFetch(`/api/v1/content?${params.toString()}`);
  const page = response.ok
    ? await readJson<{ data: Piece[]; nextCursor: string | null }>(response)
    : { data: [], nextCursor: null };
  const pieces = page.data;
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12 sm:px-10">
      <h1 className="text-3xl font-semibold">Catalog</h1>
      <form className="flex gap-2" action="/search">
        <input className="h-12 flex-1 rounded-2xl border border-black/10 px-4 dark:border-white/15" name="q" placeholder="Search titles" minLength={2} />
        <button className="rounded-full bg-foreground px-4 text-sm text-background" type="submit">Search</button>
      </form>
      <nav className="flex flex-wrap gap-2 text-sm">
        <Link href="/catalog">All</Link>
        {GENRES.map((item) => (
          <Link href={`/catalog?genre=${encodeURIComponent(item)}`} key={item}>{item}</Link>
        ))}
      </nav>
      <ul className="flex flex-col gap-4">
        {pieces.map((piece) => (
          <li key={piece.id}>
            <Link className="text-lg font-medium" href={`/pieces/${piece.id}`}>{piece.title}</Link>
            <p className="text-sm text-zinc-500">{piece.authorName} · {piece.genre}</p>
            <p className="mt-1 text-zinc-700 dark:text-zinc-300">{piece.preview}</p>
          </li>
        ))}
      </ul>
      {page.nextCursor ? <Link href={`/catalog?cursor=${encodeURIComponent(page.nextCursor)}`}>More</Link> : null}
    </main>
  );
}
