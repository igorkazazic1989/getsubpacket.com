import Link from "next/link";
import type { Metadata } from "next";
import { Wordmark } from "@/components/site-header";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Wordmark />
          <nav aria-label="App" className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="hover:underline">Subs</Link>
            <Link href="/dashboard/settings/billing" className="hover:underline">Billing</Link>
            <form action="/auth/signout" method="post">
              <button type="submit" className="hover:underline">Log out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
