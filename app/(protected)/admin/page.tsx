import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { backendFetch, readJson } from "@/lib/api/backend";
import { resolveActor } from "@/lib/auth/actor";
import { ACCESS_COOKIE } from "@/lib/auth/session-cookie";
import { getSession } from "@/lib/auth/session";
import {
  addKeywordAction,
  approveReportAction,
  commentsSwitchAction,
  enquiryStatusAction,
  refreshLandingAction,
  rejectReportAction,
  setUserPlanAction,
} from "@/lib/admin/actions";

export default async function AdminPage() {
  await connection();
  const user = await getSession();
  if (resolveActor(user) !== "superadmin") {
    redirect("/");
  }
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const headers = { token };
  const [dashboard, users, reports, config, enquiries, content] = await Promise.all([
    backendFetch("/api/v1/admin/dashboard", headers),
    backendFetch("/api/v1/admin/users", headers),
    backendFetch("/api/v1/admin/reports", headers),
    backendFetch("/api/v1/admin/config", headers),
    backendFetch("/api/v1/admin/enquiries", headers),
    backendFetch("/api/v1/admin/content", headers),
  ]);
  const counts = dashboard.ok
    ? await readJson<{ users: number; pieces: number; reports: number; enquiries: number }>(dashboard)
    : null;
  const people = users.ok
    ? await readJson<Array<{ id: string; email: string; plan: string }>>(users)
    : [];
  const queue = reports.ok
    ? await readJson<Array<{ id: string; reason: string; status: string }>>(reports)
    : [];
  const inbox = enquiries.ok
    ? await readJson<Array<{ id: string; subject: string; status: string }>>(enquiries)
    : [];
  const pieces = content.ok
    ? await readJson<Array<{ id: string; title: string; saveAs: string }>>(content)
    : [];
  const site = config.ok
    ? await readJson<{ heroTitle: string; heroSubtitle: string; seoTitle: string; seoDescription: string; commentsGloballyEnabled: boolean }>(config)
    : null;
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <h1 className="text-3xl font-semibold">Admin</h1>
      {counts ? <p>{counts.users} users · {counts.pieces} pieces · {counts.reports} open reports · {counts.enquiries} enquiries</p> : null}
      <form action={refreshLandingAction}><button type="submit">Refresh landing</button></form>
      <section>
        <h2 className="text-xl font-semibold">Content</h2>
        <ul>{pieces.map((piece) => <li key={piece.id}>{piece.title} · {piece.saveAs}</li>)}</ul>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Enquiries</h2>
        {inbox.map((item) => (
          <form action={enquiryStatusAction} key={item.id}>
            <input type="hidden" name="id" value={item.id} />
            <span>{item.subject}</span>
            <select name="status" defaultValue={item.status}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <button type="submit">Update</button>
          </form>
        ))}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Users</h2>
        {people.map((person) => (
          <form className="flex items-center gap-2" action={setUserPlanAction} key={person.id}>
            <input type="hidden" name="userId" value={person.id} />
            <span className="text-sm">{person.email}</span>
            <select name="plan" defaultValue={person.plan}>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
            <button type="submit">Set plan</button>
          </form>
        ))}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Reports</h2>
        {queue.map((report) => (
          <div key={report.id}>
            <p>{report.status}: {report.reason}</p>
            <form action={approveReportAction}>
              <input type="hidden" name="id" value={report.id} />
              <input name="note" placeholder="Note" />
              <button type="submit">Approve</button>
            </form>
            <form action={rejectReportAction}>
              <input type="hidden" name="id" value={report.id} />
              <button type="submit">Reject and unpublish</button>
            </form>
          </div>
        ))}
      </section>
      <form className="flex flex-col gap-3" action={addKeywordAction}>
        <h2 className="text-xl font-semibold">Blocked keyword</h2>
        <input name="word" />
        <button type="submit">Add</button>
      </form>
      {site ? (
        <form className="flex flex-col gap-3" action={commentsSwitchAction}>
          <h2 className="text-xl font-semibold">Site</h2>
          <input name="heroTitle" defaultValue={site.heroTitle} />
          <input name="heroSubtitle" defaultValue={site.heroSubtitle} />
          <input name="seoTitle" defaultValue={site.seoTitle} />
          <input name="seoDescription" defaultValue={site.seoDescription} />
          <label>
            <input type="checkbox" name="commentsGloballyEnabled" defaultChecked={site.commentsGloballyEnabled} />
            Comments on
          </label>
          <button type="submit">Save site</button>
        </form>
      ) : null}
    </main>
  );
}
