"use client";
import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

export function CopyButton({ value, label = "Copy link", ...props }: { value: string; label?: string } & ButtonProps) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      {...props}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.prompt("Copy this link:", value);
        }
      }}
    >
      {copied ? "Copied" : label}
    </Button>
  );
}
