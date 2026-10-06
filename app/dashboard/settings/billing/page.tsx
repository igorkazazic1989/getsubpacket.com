import { requireCompany, isPro } from "@/lib/auth";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ status?: string; need?: string }> }) {
  const { status, need } = await searchParams;
  const { company } = await requireCompany();
  const pro = isPro(company);

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-5xl font-bold leading-none">Billing</h1>
      {status === "success" && <p role="status" className="mt-6 border-l-4 border-ok bg-white p-4 text-sm font-semibold">Thanks. Pro is active as soon as Stripe confirms the payment (usually a few seconds). Reload if it still says Free.</p>}
      {need === "pro" && !pro && <p className="mt-6 border-l-4 border-pencil bg-white p-4 text-sm">The audit packet link is part of Pro.</p>}

      <section className="mt-8 rounded-lg border-2 border-ink bg-white p-6">
        <p className="text-sm text-ink/70">Current plan</p>
        <p className="font-display text-4xl font-bold">{pro ? "Pro" : "Free"}</p>
        {company.subscription_status && !pro && <p className="mt-1 text-sm text-bad">Subscription status: {company.subscription_status}</p>}

        {pro ? (
          <form action="/api/stripe/portal" method="post" className="mt-6">
            <Button type="submit" variant="outline">Manage subscription and invoices</Button>
          </form>
        ) : (
          <>
            <ul className="mt-4 space-y-1 text-ink/80">
              <li>Unlimited subs (Free: {site.freeSubLimit})</li>
              <li>Audit packet link with ZIP download</li>
            </ul>
            <form action="/api/stripe/checkout" method="post" className="mt-6">
              <Button type="submit" variant="pencil" size="lg">Upgrade to Pro, ${site.priceMonthly}/month</Button>
            </form>
            {company.stripe_customer_id && (
              <form action="/api/stripe/portal" method="post" className="mt-3">
                <Button type="submit" variant="ghost" size="sm">See past invoices</Button>
              </form>
            )}
          </>
        )}
      </section>
    </div>
  );
}
