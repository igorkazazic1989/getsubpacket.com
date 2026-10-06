import { cn } from "@/lib/utils";
import { STATUS_LABEL, type DocStatus } from "@/lib/docs";

const STYLE: Record<DocStatus, string> = {
  valid: "bg-ok text-white border-ok",
  expiring: "bg-warn text-white border-warn",
  expired: "bg-bad text-white border-bad",
  missing: "bg-white text-bad border-bad border-dashed",
};

export function StatusTag({ status, label, detail, className }: { status: DocStatus; label: string; detail?: string; className?: string }) {
  const title = `${label}: ${STATUS_LABEL[status]}${detail ? ` (${detail})` : ""}`;
  return (
    <span
      title={title}
      aria-label={title}
      className={cn("inline-flex h-7 min-w-[2.75rem] items-center justify-center rounded-[3px] border px-1.5 font-display text-sm font-semibold", STYLE[status], className)}
    >
      {label}
    </span>
  );
}

const DOT: Record<DocStatus, string> = { valid: "bg-ok", expiring: "bg-warn", expired: "bg-bad", missing: "bg-bad" };

export function StatusDot({ status }: { status: DocStatus }) {
  return <span aria-hidden className={cn("inline-block h-2.5 w-2.5 rounded-full", DOT[status])} />;
}
