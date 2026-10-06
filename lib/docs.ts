export type DocType = "coi_gl" | "coi_wc" | "w9" | "license" | "agreement";
export type DocStatus = "missing" | "expired" | "expiring" | "valid";

export interface DocDef {
  key: DocType;
  label: string;
  short: string;
  expires: boolean;
  expiryRequired: boolean;
  required: boolean;
  help: string;
}

export const DOC_TYPES: DocDef[] = [
  {
    key: "coi_gl",
    label: "General liability certificate (COI)",
    short: "GL",
    expires: true,
    expiryRequired: true,
    required: true,
    help: "Ask your insurance agent for a certificate of insurance. Use the policy expiration date shown on it.",
  },
  {
    key: "coi_wc",
    label: "Workers' comp certificate or exemption",
    short: "WC",
    expires: true,
    expiryRequired: true,
    required: true,
    help: "Your workers' compensation certificate, or your state exemption certificate if you have no employees.",
  },
  {
    key: "w9",
    label: "W-9",
    short: "W-9",
    expires: false,
    expiryRequired: false,
    required: true,
    help: "IRS Form W-9, signed. A photo of the signed paper form works.",
  },
  {
    key: "license",
    label: "Contractor license",
    short: "LIC",
    expires: true,
    expiryRequired: false,
    required: false,
    help: "Your state or local trade license, if your trade needs one.",
  },
  {
    key: "agreement",
    label: "Signed subcontractor agreement",
    short: "AGR",
    expires: false,
    expiryRequired: false,
    required: true,
    help: "The agreement your builder sent you, signed.",
  },
];

export const DOC_KEYS = DOC_TYPES.map((d) => d.key);

export function getDocDef(key: string) {
  return DOC_TYPES.find((d) => d.key === key);
}

export interface DocRow {
  id: string;
  sub_id: string;
  company_id: string;
  doc_type: DocType;
  file_name: string;
  file_path: string;
  expires_on: string | null;
  uploaded_at: string;
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysIso(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysUntil(dateIso: string, from = todayIso()) {
  return Math.round((Date.parse(dateIso + "T00:00:00Z") - Date.parse(from + "T00:00:00Z")) / 86_400_000);
}

export function latestByType(docs: DocRow[]): Partial<Record<DocType, DocRow>> {
  const out: Partial<Record<DocType, DocRow>> = {};
  for (const d of [...docs].sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at))) {
    if (!out[d.doc_type]) out[d.doc_type] = d;
  }
  return out;
}

export const EXPIRY_WARNING_DAYS = 30;

export function docStatus(def: DocDef, doc?: DocRow): DocStatus {
  if (!doc) return "missing";
  if (!def.expires || !doc.expires_on) return "valid";
  const d = daysUntil(doc.expires_on);
  if (d < 0) return "expired";
  if (d <= EXPIRY_WARNING_DAYS) return "expiring";
  return "valid";
}

const ORDER: DocStatus[] = ["expired", "missing", "expiring", "valid"];

export function worstStatus(statuses: DocStatus[]): DocStatus {
  for (const s of ORDER) if (statuses.includes(s)) return s;
  return "valid";
}

export interface SubDocSummary {
  def: DocDef;
  status: DocStatus;
  doc?: DocRow;
}

export function summarizeSub(docs: DocRow[]) {
  const latest = latestByType(docs);
  const items: SubDocSummary[] = DOC_TYPES.map((def) => ({ def, status: docStatus(def, latest[def.key]), doc: latest[def.key] }));
  const overall = worstStatus(items.filter((i) => i.def.required || i.doc).map((i) => i.status));
  return { items, overall, latest };
}

export const STATUS_LABEL: Record<DocStatus, string> = {
  valid: "Valid",
  expiring: "Expires soon",
  expired: "Expired",
  missing: "Missing",
};

export const OVERALL_LABEL: Record<DocStatus, string> = {
  valid: "Good to work",
  expiring: "Renewal due",
  missing: "Paperwork missing",
  expired: "Coverage expired",
};
