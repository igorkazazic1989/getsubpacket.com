export const site = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "SubPacket",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  priceMonthly: 39,
  freeSubLimit: 3, // keep in sync with enforce_sub_limit() in supabase/schema.sql
};

// Form 1099-NEC: $2,000 for payments made in 2026 (OBBBA), indexed for inflation from 2027.
// Update this every autumn before the January filing season.
export const TAX_1099 = { year: 2026, threshold: 2000, previousYear: 2025, previousThreshold: 600 };
