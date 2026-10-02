import type { Metadata } from "next";
import { signup } from "@/app/actions/auth";
import AuthForm from "@/app/ui/auth-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <AuthForm mode="signup" action={signup} />
    </main>
  );
}
