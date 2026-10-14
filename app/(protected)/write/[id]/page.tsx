import { cookies } from "next/headers";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { PieceEditor } from "@/components/content/piece-editor";
import { backendFetch, readJson } from "@/lib/api/backend";
import type { Piece } from "@/lib/api/types";
import { resolveActor } from "@/lib/auth/actor";
import { ACCESS_COOKIE } from "@/lib/auth/session-cookie";
import { getSession } from "@/lib/auth/session";
import { deleteContentAction, loadPiece } from "@/lib/content/actions";

export default async function EditPiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const user = await getSession();
  const actor = resolveActor(user);
  if (actor !== "writer" && actor !== "superadmin") {
    redirect("/");
  }
  const { id } = await params;
  const piece = await loadPiece(id);
  if (actor === "writer" && piece.authorId !== user?.id) {
    notFound();
  }
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const featuresResponse = await backendFetch("/api/v1/content/editor", { token });
  const features = featuresResponse.ok
    ? await readJson<{ images: boolean; tables: boolean; video: boolean; source: boolean }>(featuresResponse)
    : { images: false, tables: false, video: false, source: false };
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Edit</h1>
      <PieceEditor piece={piece as Piece} features={features} />
      <form action={deleteContentAction.bind(null, id)}>
        <button className="text-sm text-red-700" type="submit">Delete</button>
      </form>
    </main>
  );
}
