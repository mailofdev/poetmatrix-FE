import Link from "next/link";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ReadingSession } from "@/components/content/reading-session";
import { backendFetch, readJson } from "@/lib/api/backend";
import type { Piece } from "@/lib/api/types";
import { ACCESS_COOKIE } from "@/lib/auth/session-cookie";
import { getSession } from "@/lib/auth/session";
import {
  bookmarkAction,
  commentAction,
  likeAction,
  reportAction,
} from "@/lib/product/actions";

export default async function PiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const response = await backendFetch(`/api/v1/content/${id}`, { token });
  if (response.status === 404) {
    notFound();
  }
  if (!response.ok) {
    return <main className="px-6 py-12">This piece is unavailable.</main>;
  }
  const piece = await readJson<Piece>(response);
  const user = await getSession();
  const commentsOn = await backendFetch("/api/v1/site").then(async (site) => {
    if (!site.ok) return true;
    const config = await readJson<{ commentsGloballyEnabled: boolean }>(site);
    return config.commentsGloballyEnabled && piece.commentsAllowed;
  });
  const comments = commentsOn
    ? await backendFetch(`/api/v1/content/${id}/comments`).then((result) =>
        result.ok ? readJson<Array<{ id: string; body: string }>>(result) : [],
      )
    : [];
  const progress = user
    ? await backendFetch(`/api/v1/content/${id}/progress`, { token }).then((result) =>
        result.ok ? readJson<{ scroll: number } | null>(result) : null,
      )
    : null;
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <ReadingSession id={piece.id} signedIn={Boolean(user)} initialScroll={progress?.scroll ?? 0} />
      <p className="text-sm text-zinc-500">{piece.genre} · {piece.readingMinutes} min · {piece.viewCount} views</p>
      <h1 className="text-4xl font-semibold">{piece.title}</h1>
      {piece.subtitle ? <p className="text-lg text-zinc-600">{piece.subtitle}</p> : null}
      <p className="text-sm">
        <Link href={piece.authorId ? `/writers/${piece.authorId}` : "/writers"}>{piece.authorName}</Link>
      </p>
      <article id="piece-body" className="leading-8" dangerouslySetInnerHTML={{ __html: piece.body }} />
      {user ? (
        <div className="flex flex-col gap-4">
          <form action={likeAction.bind(null, piece.id)}><button type="submit">Like</button></form>
          <form action={bookmarkAction.bind(null, piece.id)}><button type="submit">Bookmark</button></form>
          <ShareLink id={piece.id} />
          {commentsOn ? (
            <form action={commentAction.bind(null, piece.id)} className="flex flex-col gap-2">
              <textarea className="min-h-24 rounded-2xl border border-black/10 px-3 py-2" name="body" required />
              <button type="submit">Comment</button>
            </form>
          ) : <p className="text-sm text-zinc-500">Comments are closed.</p>}
          <form action={reportAction.bind(null, piece.id)} className="flex flex-col gap-2">
            <textarea className="min-h-20 rounded-2xl border border-black/10 px-3 py-2" name="reason" minLength={3} required />
            <button type="submit">Report</button>
          </form>
        </div>
      ) : (
        <p><Link href={`/login?next=/pieces/${piece.id}`}>Sign in to like, comment, or bookmark.</Link></p>
      )}
      {commentsOn ? (
        <ul className="flex flex-col gap-2">
          {comments.map((comment) => <li key={comment.id}>{comment.body}</li>)}
        </ul>
      ) : null}
    </main>
  );
}

function ShareLink({ id }: { id: string }) {
  return <p className="text-sm text-zinc-500">Share /pieces/{id}</p>;
}
