import type { Metadata } from "next";
import { login } from "@/app/actions/auth";
import AuthForm from "@/app/ui/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <AuthForm mode="login" action={login} />
    </main>
  );
}
