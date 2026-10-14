import Link from "next/link";
import { connection } from "next/server";
import { backendFetch, readJson } from "@/lib/api/backend";
import { resolveActor } from "@/lib/auth/actor";
import { getSession } from "@/lib/auth/session";

const FALLBACK = [
  { title: "A door that opens only at dusk", body: "Write the first scene on the other side." },
  { title: "The letter that arrived late", body: "Someone receives news that changes a quiet week." },
  { title: "Rain on a tin roof", body: "Stay with one room and the sound of the weather." },
];

export default async function PromptsPage() {
  await connection();
  const response = await backendFetch("/api/v1/prompts");
  const prompts = response.ok ? await readJson<Array<{ title: string; body: string }>>(response) : FALLBACK;
  const actor = resolveActor(await getSession());
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Weekly prompts</h1>
      <ul className="flex flex-col gap-4">
        {prompts.map((prompt) => (
          <li key={prompt.title}>
            <h2 className="text-xl font-medium">{prompt.title}</h2>
            <p className="text-zinc-600 dark:text-zinc-400">{prompt.body}</p>
            {actor === "writer" ? (
              <Link href={`/write?prompt=${encodeURIComponent(prompt.body)}`}>Start a piece</Link>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
