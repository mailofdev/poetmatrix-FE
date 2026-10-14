import Link from "next/link";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { backendFetch, readJson } from "@/lib/api/backend";
import type { Piece, PublicProfile } from "@/lib/api/types";
import { ACCESS_COOKIE } from "@/lib/auth/session-cookie";
import { getSession } from "@/lib/auth/session";

export default async function FollowingPage() {
  await connection();
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/following");
  }
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const [peopleResponse, feedResponse] = await Promise.all([
    backendFetch("/api/v1/following", { token }),
    backendFetch("/api/v1/feed", { token }),
  ]);
  const people = peopleResponse.ok ? await readJson<PublicProfile[]>(peopleResponse) : [];
  const feed = feedResponse.ok ? await readJson<Piece[]>(feedResponse) : [];
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Following</h1>
      <ul>{people.map((person) => <li key={person.id}><Link href={`/writers/${person.id}`}>{person.penName || person.displayName}</Link></li>)}</ul>
      <h2 className="text-xl font-semibold">Feed</h2>
      <ul>{feed.map((piece) => <li key={piece.id}><Link href={`/pieces/${piece.id}`}>{piece.title}</Link></li>)}</ul>
    </main>
  );
}
