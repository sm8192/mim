import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifySession, getUser } from "@/lib/dal";
import { logout } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // Secure check at the data source (proxy is only an optimistic gate).
  await verifySession();
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-black/[.08] bg-white p-8 shadow-sm dark:border-white/[.12] dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Welcome, {user.username}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          You are signed in. This page is protected and only visible to
          authenticated users.
        </p>

        <form action={logout} className="mt-6">
          <button
            type="submit"
            className="flex h-11 items-center justify-center rounded-full border border-black/[.12] px-5 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.16] dark:text-zinc-50 dark:hover:bg-white/[.06]"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
