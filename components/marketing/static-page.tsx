export function StaticPage({ title, body }: { title: string; body: string }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="leading-8 text-zinc-700 dark:text-zinc-300">{body}</p>
    </main>
  );
}
