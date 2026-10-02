"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { AuthFormState } from "@/lib/definitions";

type AuthAction = (
  state: AuthFormState,
  formData: FormData,
) => Promise<AuthFormState>;

type AuthFormProps = {
  mode: "login" | "signup";
  action: AuthAction;
};

const copy = {
  login: {
    title: "Sign in",
    submit: "Sign in",
    pendingSubmit: "Signing in…",
    altPrompt: "Need an account?",
    altHref: "/signup",
    altLabel: "Create one",
    autoComplete: "current-password",
  },
  signup: {
    title: "Create account",
    submit: "Create account",
    pendingSubmit: "Creating account…",
    altPrompt: "Already have an account?",
    altHref: "/login",
    altLabel: "Sign in",
    autoComplete: "new-password",
  },
} as const;

export default function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const t = copy[mode];

  return (
    <div className="w-full max-w-sm rounded-2xl border border-black/[.08] bg-white p-8 shadow-sm dark:border-white/[.12] dark:bg-zinc-950">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {t.title}
      </h1>

      <form action={formAction} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="username"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            aria-describedby="username-error"
            className="h-11 rounded-lg border border-black/[.12] bg-transparent px-3 text-black outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10 dark:border-white/[.16] dark:text-zinc-50 dark:focus:border-white/40 dark:focus:ring-white/10"
          />
          <FieldErrors id="username-error" errors={state?.errors?.username} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={t.autoComplete}
            required
            aria-describedby="password-error"
            className="h-11 rounded-lg border border-black/[.12] bg-transparent px-3 text-black outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10 dark:border-white/[.16] dark:text-zinc-50 dark:focus:border-white/40 dark:focus:ring-white/10"
          />
          <FieldErrors id="password-error" errors={state?.errors?.password} />
        </div>

        {state?.message && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400"
          >
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {pending ? t.pendingSubmit : t.submit}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        {t.altPrompt}{" "}
        <Link
          href={t.altHref}
          className="font-medium text-black underline-offset-4 hover:underline dark:text-zinc-50"
        >
          {t.altLabel}
        </Link>
      </p>
    </div>
  );
}

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <ul id={id} className="mt-0.5 space-y-0.5">
      {errors.map((error) => (
        <li key={error} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </li>
      ))}
    </ul>
  );
}
