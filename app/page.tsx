import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";
import { backendFetch, readJson } from "@/lib/api/backend";
import type { Piece, PublicProfile } from "@/lib/api/types";
import { resolveActor } from "@/lib/auth/actor";
import { ACCESS_COOKIE } from "@/lib/auth/session-cookie";
import { getSession } from "@/lib/auth/session";

type HomePayload = {
  heroTitle: string;
  heroSubtitle: string;
  genres: string[];
  pieces: Piece[];
  writers: PublicProfile[];
};

export async function generateMetadata(): Promise<Metadata> {
  const response = await backendFetch("/api/v1/site");
  if (!response.ok) {
    return {};
  }
  const site = await readJson<{ seoTitle: string; seoDescription: string }>(response);
  return { title: site.seoTitle, description: site.seoDescription };
}

export default function Home() {
  return (
    <Suspense fallback={<main className="px-6 py-16">Loading the reading room…</main>}>
      <HomeBody />
    </Suspense>
  );
}

async function HomeBody() {
  await connection();
  const user = await getSession();
  const actor = resolveActor(user);
  if (actor === "writer" && user) {
    return <WriterHome name={user.penName || user.displayName || "Writer"} />;
  }
  const homeResponse = await backendFetch("/api/v1/discovery/home");
  const home = homeResponse.ok ? await readJson<HomePayload>(homeResponse) : null;
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const continueResponse =
    actor === "reader" && token
      ? await backendFetch("/api/v1/reading/continue", { token })
      : null;
  const recommendations =
    actor === "reader" && token
      ? await backendFetch("/api/v1/recommendations", { token })
      : null;
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:px-10">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-medium tracking-[0.18em] text-zinc-500 uppercase">Reading room</p>
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight">{home?.heroTitle ?? "PoetMatrix"}</h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {home?.heroSubtitle ?? "A public place to discover and read literary work."}
        </p>
        <div className="flex gap-3 text-sm">
          <Link className="underline" href="/catalog">Read the catalog</Link>
          <Link className="underline" href="/plans">Become a writer</Link>
        </div>
      </section>
      <nav className="flex flex-wrap gap-2 text-sm" aria-label="Genres">
        {(home?.genres ?? []).map((genre) => (
          <Link className="rounded-full border border-black/10 px-3 py-1 dark:border-white/15" href={`/catalog?genre=${encodeURIComponent(genre)}`} key={genre}>
            {genre}
          </Link>
        ))}
      </nav>
      {actor === "reader" ? <ContinueReading response={continueResponse} /> : null}
      {actor === "reader" ? <PieceShelf title="From your interests" response={recommendations} /> : null}
      <PieceList title="New work" pieces={home?.pieces ?? []} />
      <section>
        <h2 className="text-xl font-semibold">Writers</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {(home?.writers ?? []).map((writer) => (
            <li key={writer.id}>
              <Link href={`/writers/${writer.id}`}>{writer.penName || writer.displayName || "Writer"}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

async function WriterHome({ name }: { name: string }) {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const [works, usage] = await Promise.all([
    backendFetch("/api/v1/content/mine", { token }),
    backendFetch("/api/v1/content/usage", { token }),
  ]);
  const pieces = works.ok ? await readJson<Piece[]>(works) : [];
  const month = usage.ok
    ? await readJson<{ used: number; cap: number | null; plan: string }>(usage)
    : null;
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16 sm:px-10">
      <h1 className="text-4xl font-semibold tracking-tight">{name}’s desk</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        {month
          ? `${month.used} published this month${month.cap === null ? "" : ` of ${month.cap}`} on the ${month.plan} plan.`
          : "Usage is unavailable."}
      </p>
      {month && month.plan !== "free" ? (
        <p className="text-sm text-zinc-500">
          {month.plan === "pro" ? "Full analytics are included on Pro." : "Basic analytics are included on this plan."}
        </p>
      ) : null}
      <Link className="underline" href="/write">New piece</Link>
      <PieceList title="Your pieces" pieces={pieces} hrefBase="/write" />
    </main>
  );
}

function PieceList({
  title,
  pieces,
  hrefBase = "/pieces",
}: {
  title: string;
  pieces: Piece[];
  hrefBase?: string;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      {pieces.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">Nothing here yet.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {pieces.map((piece) => (
            <li key={piece.id}>
              <Link className="font-medium" href={`${hrefBase}/${piece.id}`}>{piece.title}</Link>
              <p className="text-sm text-zinc-500">{piece.genre} · {piece.preview}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

async function PieceShelf({ title, response }: { title: string; response: Response | null }) {
  if (!response?.ok) {
    return null;
  }
  const pieces = await readJson<Piece[]>(response);
  return <PieceList title={title} pieces={pieces} />;
}

async function ContinueReading({ response }: { response: Response | null }) {
  if (!response?.ok) {
    return null;
  }
  const rows = await readJson<Array<{ contentId: string; percent: number }>>(response);
  if (rows.length === 0) {
    return null;
  }
  return (
    <section>
      <h2 className="text-xl font-semibold">Continue reading</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.contentId}>
            <Link href={`/pieces/${row.contentId}`}>{row.percent}% read</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
