import type { Metadata } from "next";
import { connection } from "next/server";
import { ContentForm } from "@/components/content/content-form";
import { deleteContentAction } from "@/lib/content/actions";
import { getSession } from "@/lib/auth/session";
import { loadContent } from "@/lib/content/actions";

export const metadata: Metadata = { title: "Edit piece" };

export default async function EditPiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const [user, content] = await Promise.all([getSession(), loadContent(id)]);
  const canEdit =
    user?.role === "superAdmin" ||
    (user?.role === "writer" && content.authorId === user.id);

  if (!canEdit) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:px-10">
        <h1 className="text-3xl font-semibold tracking-tight">{content.title}</h1>
        <p className="mt-2 text-sm text-zinc-500">{content.genre}</p>
        <p className="mt-6 whitespace-pre-wrap leading-8">{content.writings}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12 sm:px-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Edit piece</h1>
        <form action={deleteContentAction.bind(null, content.id)}>
          <button
            className="text-sm font-medium text-red-700 underline-offset-4 hover:underline dark:text-red-300"
            type="submit"
          >
            Delete
          </button>
        </form>
      </div>
      <ContentForm content={content} />
    </main>
  );
}
