import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch (err) {
    console.error("[stripe] bad signature", err);
    return new NextResponse("Bad signature", { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.mode === "subscription" && s.subscription && s.client_reference_id) {
        const sub = await stripe.subscriptions.retrieve(typeof s.subscription === "string" ? s.subscription : s.subscription.id);
        await admin
          .from("companies")
          .update({ stripe_customer_id: String(s.customer), stripe_subscription_id: sub.id, subscription_status: sub.status })
          .eq("id", s.client_reference_id);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const update = { stripe_subscription_id: sub.id, subscription_status: sub.status };
      const companyId = sub.metadata?.company_id;
      if (companyId) await admin.from("companies").update(update).eq("id", companyId);
      else await admin.from("companies").update(update).eq("stripe_customer_id", customerId);
      break;
    }
  }
  return NextResponse.json({ received: true });
}
