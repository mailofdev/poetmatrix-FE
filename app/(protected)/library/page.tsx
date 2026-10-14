import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { getSession } from "@/lib/auth/session";
import { loadContentPage } from "@/lib/content/actions";

export const metadata: Metadata = { title: "Library" };

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const page = Math.max(1, Number(rawPage) || 1);
  const user = await getSession();
  const result = await loadContentPage(page);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12 sm:px-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Library</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Published work is visible here. Drafts appear only for their author
            and for super admins.
          </p>
        </div>
        {user && user.role !== "reader" ? (
          <Link
            className="inline-flex h-10 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background"
            href="/write"
          >
            New piece
          </Link>
        ) : null}
      </div>
      {"error" in result ? (
        <p role="alert" className="text-sm text-red-700 dark:text-red-300">
          {result.error}
        </p>
      ) : result.data.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Nothing here yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {result.data.map((item) => {
            const canEdit =
              user?.role === "superAdmin" ||
              (user?.role === "writer" && item.authorId === user.id);
            return (
              <li
                className="rounded-3xl border border-black/8 bg-white px-5 py-4 dark:border-white/10 dark:bg-zinc-950"
                key={item.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      {item.genre} · {item.saveAs}
                    </p>
                  </div>
                  {canEdit ? (
                    <Link className="text-sm font-medium underline-offset-4 hover:underline" href={`/write/${item.id}`}>
                      Edit
                    </Link>
                  ) : null}
                </div>
                <p className="mt-3 line-clamp-4 leading-7 text-zinc-700 dark:text-zinc-300">
                  {item.writings}
                </p>
              </li>
            );
          })}
        </ul>
      )}
      {"data" in result && result.meta.total > result.meta.limit ? (
        <nav className="flex gap-4 text-sm font-medium" aria-label="Pagination">
          {page > 1 ? <Link href={`/library?page=${page - 1}`}>Previous</Link> : null}
          {page * result.meta.limit < result.meta.total ? (
            <Link href={`/library?page=${page + 1}`}>Next</Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
