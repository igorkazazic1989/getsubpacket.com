"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StatusTag } from "@/components/status-tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STATUS_LABEL, type DocStatus, type DocType } from "@/lib/docs";
import { formatDate } from "@/lib/utils";

export interface UploadItem {
  key: DocType;
  label: string;
  help: string;
  expires: boolean;
  expiryRequired: boolean;
  required: boolean;
  status: DocStatus;
  currentName: string | null;
  currentExpires: string | null;
}

const SHORT: Record<DocType, string> = { coi_gl: "GL", coi_wc: "WC", w9: "W-9", license: "LIC", agreement: "AGR" };

export function UploadPanel({ token, items }: { token: string; items: UploadItem[] }) {
  const [open, setOpen] = useState<DocType | null>(items.find((i) => i.status !== "valid" && i.required)?.key ?? null);
  const router = useRouter();

  return (
    <ul className="mt-8 divide-y divide-line overflow-hidden rounded-lg border-2 border-ink bg-white">
      {items.map((item) => (
        <li key={item.key} className="p-4">
          <div className="flex items-center gap-3">
            <StatusTag label={SHORT[item.key]} status={item.status} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight">
                {item.label}
                {!item.required && <span className="font-normal text-ink/50"> (if you have one)</span>}
              </p>
              <p className="truncate text-xs text-ink/60">
                {STATUS_LABEL[item.status]}
                {item.currentExpires ? `, expires ${formatDate(item.currentExpires)}` : ""}
              </p>
            </div>
            <Button type="button" size="sm" variant={item.status === "valid" ? "outline" : "pencil"} onClick={() => setOpen(open === item.key ? null : item.key)} aria-expanded={open === item.key}>
              {item.status === "missing" ? "Upload" : "Replace"}
            </Button>
          </div>
          {open === item.key && (
            <UploadForm
              token={token}
              item={item}
              onDone={() => {
                setOpen(null);
                router.refresh();
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function UploadForm({ token, item, onDone }: { token: string; item: UploadItem; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [expiresOn, setExpiresOn] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Choose a file or take a photo.");
    if (file.size > 15 * 1024 * 1024) return setError("That file is over 15 MB. Take a photo instead, or send a smaller PDF.");
    if (item.expiryRequired && !expiresOn) return setError("Enter the policy expiration date shown on the certificate.");
    setBusy(true);
    setError(null);
    try {
      const signRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, docType: item.key, fileName: file.name, contentType: file.type, size: file.size }),
      });
      const sign = await signRes.json();
      if (!signRes.ok) throw new Error(sign.error || "The upload could not start.");

      const supabase = createClient();
      const { error: upErr } = await supabase.storage.from("documents").uploadToSignedUrl(sign.path, sign.uploadToken, file, {
        contentType: file.type || "application/octet-stream",
      });
      if (upErr) throw new Error("The file didn't upload. Check your connection and try again.");

      const doneRes = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, docType: item.key, path: sign.path, fileName: file.name, expiresOn: expiresOn || null }),
      });
      const done = await doneRes.json();
      if (!doneRes.ok) throw new Error(done.error || "The upload could not be saved.");
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4 border-t border-line pt-4">
      <p className="text-sm text-ink/75">{item.help}</p>
      <div>
        <Label htmlFor={`file-${item.key}`}>File or photo</Label>
        <input
          id={`file-${item.key}`}
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/heic,image/heif,image/webp,.pdf,.jpg,.jpeg,.png,.heic,.heif,.webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-4 file:py-2 file:font-semibold file:text-white"
        />
      </div>
      {item.expires && (
        <div>
          <Label htmlFor={`exp-${item.key}`}>Expiration date{item.expiryRequired ? "" : " (if it has one)"}</Label>
          <Input id={`exp-${item.key}`} type="date" value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} required={item.expiryRequired} />
        </div>
      )}
      {error && <p role="alert" className="text-sm font-semibold text-bad">{error}</p>}
      <Button type="submit" disabled={busy} className="w-full sm:w-auto">
        {busy ? "Uploading…" : `Upload ${item.label.toLowerCase().startsWith("w-9") ? "W-9" : "document"}`}
      </Button>
    </form>
  );
}
