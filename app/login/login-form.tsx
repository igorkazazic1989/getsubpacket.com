"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setError(error.message);
      setState("idle");
    } else {
      setState("sent");
    }
  }

  if (state === "sent") {
    return (
      <div className="mt-8 border-l-4 border-pencil bg-white p-5">
        <p className="font-semibold">Check your email</p>
        <p className="mt-1 text-sm text-ink/80">We sent a sign-in link to {email}. Open it on this device.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <Label htmlFor="email">Work email</Label>
        <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {error && <p role="alert" className="text-sm font-semibold text-bad">{error}</p>}
      <Button type="submit" size="lg" variant="pencil" className="w-full" disabled={state === "sending"}>
        {state === "sending" ? "Sending link…" : "Email me a sign-in link"}
      </Button>
    </form>
  );
}
