import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <h1 className="font-display text-5xl font-bold">This page doesn&apos;t exist</h1>
      <p className="mt-3 text-ink/75">If you followed an upload or audit link, it may have been replaced or turned off. Ask the person who sent it for a new one.</p>
      <Link href="/" className="mt-6 font-semibold underline">Go to the home page</Link>
    </div>
  );
}
