import { cookies } from "next/headers";
import { connection } from "next/server";
import { backendFetch, readJson } from "@/lib/api/backend";
import { ACCESS_COOKIE } from "@/lib/auth/session-cookie";

type Challenge = {
  id: string;
  title: string;
  description: string;
  target: number;
  type: string;
  progress: number;
};

export default async function ChallengesPage() {
  await connection();
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const response = await backendFetch("/api/v1/challenges", { token });
  const rows = response.ok ? await readJson<Challenge[]>(response) : [];
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">Reading challenges</h1>
      {rows.length === 0 ? <p className="text-sm text-zinc-500">No active challenge this month.</p> : null}
      <ul className="flex flex-col gap-4">
        {rows.map((row) => (
          <li key={row.id}>
            <h2 className="text-xl">{row.title}</h2>
            <p>{row.description}</p>
            <p className="text-sm text-zinc-500">{row.progress} / {row.target} · {row.type}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
