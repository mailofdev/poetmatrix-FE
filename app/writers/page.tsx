import Link from "next/link";
import { connection } from "next/server";
import { backendFetch, readJson } from "@/lib/api/backend";
import type { PublicProfile } from "@/lib/api/types";

export default async function WritersPage() {
  await connection();
  const response = await backendFetch("/api/v1/writers");
  const writers = response.ok ? await readJson<PublicProfile[]>(response) : [];
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">Writers</h1>
      <ul className="flex flex-col gap-3">
        {writers.map((writer) => (
          <li key={writer.id}>
            <Link href={`/writers/${writer.id}`}>{writer.penName || writer.displayName || "Writer"}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
