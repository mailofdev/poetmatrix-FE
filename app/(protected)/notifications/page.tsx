import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { backendFetch, readJson } from "@/lib/api/backend";
import { ACCESS_COOKIE } from "@/lib/auth/session-cookie";
import { getSession } from "@/lib/auth/session";
import { markAllReadAction } from "@/lib/product/actions";

type Notice = {
  id: string;
  read: boolean;
  message: string;
  type: string;
  createdAt: string;
};

export default async function NotificationsPage() {
  await connection();
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/notifications");
  }
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const [list, unread] = await Promise.all([
    backendFetch("/api/v1/notifications", { token }),
    backendFetch("/api/v1/notifications/unread-count", { token }),
  ]);
  const notes = list.ok ? await readJson<Notice[]>(list) : [];
  const count = unread.ok ? await readJson<{ count: number }>(unread) : { count: 0 };
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">Inbox</h1>
      <p className="text-sm text-zinc-500">{count.count} unread</p>
      <form action={markAllReadAction}><button type="submit">Mark all read</button></form>
      <ul className="flex flex-col gap-3">
        {notes.map((note) => (
          <li key={note.id}>
            <p>{note.message}</p>
            <p className="text-sm text-zinc-500">{note.type} · {note.read ? "read" : "unread"}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
