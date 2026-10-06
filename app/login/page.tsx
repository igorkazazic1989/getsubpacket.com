import type { Metadata } from "next";
import { Wordmark } from "@/components/site-header";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
      <Wordmark />
      <h1 className="mt-8 font-display text-4xl font-bold">Log in or start free</h1>
      <p className="mt-2 text-ink/75">We&apos;ll email you a sign-in link. No password.</p>
      {error && <p role="alert" className="mt-4 text-sm font-semibold text-bad">That sign-in link expired or was already used. Request a new one.</p>}
      <LoginForm next={safeNext} />
    </div>
  );
}
