import { connection } from "next/server";
import { redirect } from "next/navigation";
import { GENRES } from "@/lib/content/genres";
import { resolveActor } from "@/lib/auth/actor";
import { getSession } from "@/lib/auth/session";
import { interestsAction } from "@/lib/product/actions";

export default async function OnboardingPage() {
  await connection();
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/onboarding");
  }
  if (resolveActor(user) === "superadmin") {
    redirect("/admin");
  }
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">What do you want to read?</h1>
      <form className="flex flex-col gap-3" action={interestsAction}>
        {GENRES.map((genre) => (
          <label className="flex items-center gap-2" key={genre}>
            <input type="checkbox" name="genres" value={genre} />
            {genre}
          </label>
        ))}
        <button className="mt-4 h-12 rounded-full bg-foreground px-5 text-sm text-background" type="submit">Save interests</button>
      </form>
      <form action={interestsAction}>
        <button className="text-sm underline" type="submit">Skip</button>
      </form>
    </main>
  );
}
