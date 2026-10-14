import Link from "next/link";
import { connection } from "next/server";
import { backendFetch, readJson } from "@/lib/api/backend";
import type { Piece } from "@/lib/api/types";

export default async function TrendingPage() {
  await connection();
  const response = await backendFetch("/api/v1/trending");
  const pieces = response.ok ? await readJson<Piece[]>(response) : [];
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">Trending</h1>
      <ul className="flex flex-col gap-3">
        {pieces.map((piece) => (
          <li key={piece.id}>
            <Link href={`/pieces/${piece.id}`}>{piece.title}</Link>
            <span className="ml-2 text-sm text-zinc-500">{piece.viewCount} views</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
