import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-16 sm:px-10">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        That page is not part of PoetMatrix.
      </p>
      <Link className="font-medium underline-offset-4 hover:underline" href="/">
        Back home
      </Link>
    </main>
  );
}
