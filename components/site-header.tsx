import Link from "next/link";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";

export function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold leading-none text-ink">
      <span aria-hidden className="inline-block h-5 w-2.5 -skew-x-12 bg-pencil" />
      {site.name}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Wordmark />
        <nav aria-label="Main" className="flex items-center gap-1 text-sm sm:gap-4">
          <Link href="/guides" className="hidden px-2 py-1 hover:underline md:inline">Guides</Link>
          <Link href="/tools" className="hidden px-2 py-1 hover:underline md:inline">Free tools</Link>
          <Link href="/subcontractor-agreement-template" className="hidden px-2 py-1 hover:underline lg:inline">Agreement template</Link>
          <Link href="/login" className="px-2 py-1 hover:underline">Log in</Link>
          <Button asChild size="sm" variant="pencil">
            <Link href="/login">Start free</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
