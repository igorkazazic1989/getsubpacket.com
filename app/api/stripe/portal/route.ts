import { NextResponse } from "next/server";
import { requireCompany } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { site } from "@/lib/site";

export async function POST() {
  const { company } = await requireCompany();
  if (!company.stripe_customer_id) return NextResponse.redirect(`${site.url}/dashboard/settings/billing`, 303);
  const session = await stripe.billingPortal.sessions.create({
    customer: company.stripe_customer_id,
    return_url: `${site.url}/dashboard/settings/billing`,
  });
  return NextResponse.redirect(session.url, 303);
}
