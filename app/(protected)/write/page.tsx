import { connection } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PieceEditor } from "@/components/content/piece-editor";
import { backendFetch, readJson } from "@/lib/api/backend";
import type { Piece } from "@/lib/api/types";
import { resolveActor } from "@/lib/auth/actor";
import { ACCESS_COOKIE } from "@/lib/auth/session-cookie";
import { getSession } from "@/lib/auth/session";

export default async function WritePage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  await connection();
  const user = await getSession();
  if (resolveActor(user) !== "writer" && resolveActor(user) !== "superadmin") {
    redirect("/");
  }
  const { prompt } = await searchParams;
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const featuresResponse = await backendFetch("/api/v1/content/editor", { token });
  const features = featuresResponse.ok
    ? await readJson<{ images: boolean; tables: boolean; video: boolean; source: boolean }>(featuresResponse)
    : { images: false, tables: false, video: false, source: false };
  const mine = await backendFetch("/api/v1/content/mine", { token });
  const pieces = mine.ok ? await readJson<Piece[]>(mine) : [];
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <h1 className="text-3xl font-semibold">New piece</h1>
      <PieceEditor prompt={prompt} features={features} />
      <ul className="flex flex-col gap-2 text-sm">
        {pieces.map((piece) => (
          <li key={piece.id}><a href={`/write/${piece.id}`}>{piece.title} · {piece.status}</a></li>
        ))}
      </ul>
    </main>
  );
}
