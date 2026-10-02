import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-4 py-16 text-center dark:bg-black">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          mim
        </h1>
        <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
          A minimal app with username and password authentication.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="flex h-11 w-44 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="flex h-11 w-44 items-center justify-center rounded-full border border-black/[.12] px-5 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.16] dark:text-zinc-50 dark:hover:bg-white/[.06]"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
