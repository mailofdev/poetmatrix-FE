import Link from "next/link";

export function TextField({
  label,
  name,
  type = "text",
  defaultValue,
  errors,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  errors?: string[];
  autoComplete?: string;
}) {
  const messageId = `${name}-error`;
  return (
    <label className="flex flex-col gap-2 text-sm font-medium">
      {label}
      <input
        className="h-12 rounded-2xl border border-black/10 bg-transparent px-4 text-base font-normal outline-none focus-visible:border-foreground dark:border-white/15"
        name={name}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={errors?.length ? messageId : undefined}
        required
      />
      {errors?.length ? (
        <span id={messageId} className="font-normal text-red-700 dark:text-red-300">
          {errors[0]}
        </span>
      ) : null}
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  errors,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  errors?: string[];
  children: React.ReactNode;
}) {
  const messageId = `${name}-error`;
  return (
    <label className="flex flex-col gap-2 text-sm font-medium">
      {label}
      <select
        className="h-12 rounded-2xl border border-black/10 bg-transparent px-4 text-base font-normal outline-none focus-visible:border-foreground dark:border-white/15"
        name={name}
        defaultValue={defaultValue}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={errors?.length ? messageId : undefined}
      >
        {children}
      </select>
      {errors?.length ? (
        <span id={messageId} className="font-normal text-red-700 dark:text-red-300">
          {errors[0]}
        </span>
      ) : null}
    </label>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      type="submit"
    >
      {children}
    </button>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p role="alert" className="text-sm text-red-700 dark:text-red-300">
      {message}
    </p>
  );
}

export function FormNote({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{children}</p>;
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="font-medium text-foreground underline-offset-4 hover:underline" href={href}>
      {children}
    </Link>
  );
}
