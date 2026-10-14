import { connection } from "next/server";
import { Suspense } from "react";
import { backendFetch, readError, readJson } from "@/lib/api/backend";
import type { ContentPage } from "@/lib/api/types";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:px-10">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-medium tracking-[0.18em] text-zinc-500 uppercase">
          Reading room
        </p>
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight">
          Poems, drafts, and the people who keep them.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Published work is open to every reader. Writers keep drafts private
          until they choose to share them.
        </p>
      </section>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading published work…</p>}>
        <PublishedWork />
      </Suspense>
    </main>
  );
}

async function PublishedWork() {
  await connection();
  const response = await backendFetch("/api/v1/content?page=1&limit=20");
  if (!response.ok) {
    return (
      <p role="status" className="text-sm text-zinc-600 dark:text-zinc-400">
        The library is unavailable right now. {await readError(response)}
      </p>
    );
  }
  const page = await readJson<ContentPage>(response);
  if (page.data.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No published work yet.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-4">
      {page.data.map((item) => (
        <li
          className="rounded-3xl border border-black/8 bg-white px-5 py-4 dark:border-white/10 dark:bg-zinc-950"
          key={item.id}
        >
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{item.genre}</p>
          <p className="mt-3 line-clamp-3 leading-7 text-zinc-700 dark:text-zinc-300">
            {item.writings}
          </p>
        </li>
      ))}
    </ul>
  );
}
