"use client";

export default function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-16 sm:px-10">
      <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        The page could not be displayed. Try again, or return home.
      </p>
      <button
        className="inline-flex h-12 w-fit items-center rounded-full bg-foreground px-5 text-sm font-medium text-background"
        type="button"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}
