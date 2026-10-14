import { connection } from "next/server";
import { notFound } from "next/navigation";
import { followAction } from "@/lib/product/actions";
import { backendFetch, readJson } from "@/lib/api/backend";
import type { PublicProfile } from "@/lib/api/types";
import { getSession } from "@/lib/auth/session";

export default async function WriterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const response = await backendFetch(`/api/v1/profiles/${id}`);
  if (response.status === 404) {
    notFound();
  }
  if (!response.ok) {
    return <main className="px-6 py-12">This profile is unavailable.</main>;
  }
  const profile = await readJson<PublicProfile>(response);
  const user = await getSession();
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">{profile.penName || profile.displayName || "Writer"}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">{profile.bio}</p>
      <p className="text-sm text-zinc-500">{profile.writer ? "Writer" : "Reader"} · {profile.followerCount ?? 0} followers</p>
      {user && user.id !== profile.id ? (
        <form action={followAction.bind(null, profile.id)}>
          <button className="rounded-full bg-foreground px-4 py-2 text-sm text-background" type="submit">Follow</button>
        </form>
      ) : null}
    </main>
  );
}
