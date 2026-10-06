import { NextResponse } from "next/server";
import { requireCompany } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

export async function POST() {
  const { company, user } = await requireCompany();
  if (!process.env.STRIPE_PRICE_ID) return new NextResponse("STRIPE_PRICE_ID is not set", { status: 500 });

  let customerId = company.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email ?? undefined, name: company.name, metadata: { company_id: company.id } });
    customerId = customer.id;
    await createAdminClient().from("companies").update({ stripe_customer_id: customerId }).eq("id", company.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: company.id,
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    subscription_data: { metadata: { company_id: company.id } },
    allow_promotion_codes: true,
    success_url: `${site.url}/dashboard/settings/billing?status=success`,
    cancel_url: `${site.url}/dashboard/settings/billing`,
  });
  return NextResponse.redirect(session.url!, 303);
}
