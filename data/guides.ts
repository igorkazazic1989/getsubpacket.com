export interface Guide {
  slug: string;
  title: string; // <title> and H1
  description: string; // meta description
  intro: string;
  sections: { heading: string; paragraphs: string[]; table?: { head: string[]; rows: string[][] } }[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  reviewed: string; // ISO date the facts were last checked against the sources
  cta: { href: string; label: string; text: string };
}

const IRS_1099_NEC = { label: "IRS: About Form 1099-NEC", url: "https://www.irs.gov/forms-pubs/about-form-1099-nec" };
const IRS_W9 = { label: "IRS: About Form W-9", url: "https://www.irs.gov/forms-pubs/about-form-w-9" };
const IRS_BACKUP = { label: "IRS: Backup withholding", url: "https://www.irs.gov/businesses/small-businesses-self-employed/backup-withholding" };
const NC_9719 = { label: "N.C. Gen. Stat. 97-19 (NC Industrial Commission)", url: "https://www.ic.nc.gov/ncic/pages/statute/97-19.htm" };
const FL_DWC = {
  label: "Florida Division of Workers' Compensation: information for contractors",
  url: "https://myfloridacfo.com/docs-sf/workers-compensation-libraries/workers-comp-documents/brochures-and-guides/important-workers%27-compensation-information-for-contractors.pdf",
};
const BEACON_AUDIT = { label: "Beacon Mutual: The premium audit process", url: "https://www.beaconmutual.com/assets/The-Premium-Audit-Process.pdf" };
const TN_EXEMPT = { label: "Tennessee: workers' comp exemptions for construction", url: "https://www.tn.gov/workforce/injuries-at-work/employers/employers/who-must-carry-insurance/exemptions.html" };
const TX_DWC005 = { label: "Texas DWC Form-005 (non-subscriber notice)", url: "https://www.tdi.texas.gov/forms/dwc/dwc005nocov.pdf" };

export const GUIDES: Guide[] = [
  {
    slug: "do-i-need-to-send-a-1099-to-a-subcontractor",
    title: "Do I need to send a 1099 to my subcontractor? 2026 rules for builders",
    description:
      "When a residential builder or remodeler has to file Form 1099-NEC for a subcontractor, the $2,000 threshold for 2026 payments, who is exempt, and a worked example.",
    intro:
      "Most small builders pay a handful of trades every year and find out in January which ones they owe a 1099 for. Here is how to know before then, with a worked example.",
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "If you paid a subcontractor $2,000 or more during 2026 for work in your business, and they are not a corporation, you generally file Form 1099-NEC for them. For payments you made during 2025, the old $600 threshold still applies to the forms you file in early 2026.",
          "The change came from the One Big Beautiful Bill Act and applies to payments made after December 31, 2025. From 2027 on, the $2,000 threshold is adjusted for inflation, so check the number each autumn.",
        ],
      },
      {
        heading: "Four questions, in order",
        paragraphs: [
          "1. Did you pay them for services in your business? Paying a sub for labor on a client's remodel counts. Buying materials from a supplier doesn't go on a 1099-NEC.",
          "2. How did you pay? Payments by credit card, debit card or a payment app are reported by the card company or app on Form 1099-K. Leave those payments out of your 1099-NEC total.",
          "3. What does their W-9 say? Payments to C and S corporations generally don't need a 1099-NEC (attorneys are the main exception). LLCs depend on how they are taxed: a single-member LLC taxed as a sole proprietorship, or an LLC taxed as a partnership, generally gets one. An LLC that elected corporate tax treatment generally doesn't. You can't tell from the name, which is why the box the sub checks on the W-9 matters.",
          "4. Did the total paid by check, ACH or cash reach the threshold? $2,000 for 2026 payments, $600 for 2025 payments.",
        ],
      },
      {
        heading: "Worked example: four subs on one remodel, paid in 2026",
        paragraphs: [
          "A builder pays four trades during 2026. Here is how the questions above sort them.",
        ],
        table: {
          head: ["Sub", "W-9 says", "Paid in 2026", "Paid by", "1099-NEC?"],
          rows: [
            ["Electrician", "Single-member LLC", "$18,500", "Check", "Yes: non-corporate, over $2,000"],
            ["Plumber", "Individual / sole proprietor", "$1,800", "ACH", "No: under $2,000 (it would have been yes for 2025 payments)"],
            ["Drywall crew", "S corporation", "$9,000", "Check", "No: corporation"],
            ["Painter", "Individual / sole proprietor", "$4,000", "Credit card", "No 1099-NEC: card payments are reported on 1099-K"],
          ],
        },
      },
      {
        heading: "The deadline",
        paragraphs: [
          "Form 1099-NEC goes to the subcontractor and to the IRS by January 31 of the following year. When the 31st falls on a weekend or holiday, the deadline moves to the next business day.",
        ],
      },
      {
        heading: "Reading the W-9 for an LLC",
        paragraphs: [
          "An LLC checks the \"Limited liability company\" box and writes a tax letter next to it: C for C corporation, S for S corporation, P for partnership. A single-member LLC taxed as a sole proprietorship checks the individual/sole proprietor box instead. C or S means no 1099-NEC in most cases. P, or the individual box, means you file one once the threshold is met.",
        ],
      },
      {
        heading: "Your January checklist",
        paragraphs: [
          "1. Pull total payments per sub for the year from your books, by check, ACH and cash only.",
          "2. Drop corporations (per their W-9) and everyone under the threshold.",
          "3. For everyone left, confirm you have a signed W-9 with a taxpayer ID. Chase missing ones now; the deadline won't move.",
          "4. File by January 31. If you file 10 or more information returns in total for the year, counting all 1099 types and W-2s together, you must file electronically. The IRS's free IRIS portal handles 1099-NEC e-filing.",
          "5. Send each sub their copy by the same date.",
        ],
      },
      {
        heading: "If a sub won't give you a W-9",
        paragraphs: [
          "If you make reportable payments to someone who hasn't given you a taxpayer identification number, you may have to withhold 24% backup withholding from what you pay them and send it to the IRS. That is why the W-9 belongs before the first payment, when the sub still wants the job.",
        ],
      },
    ],
    faqs: [
      { q: "Is the 1099 threshold $600 or $2,000?", a: "$600 for payments made in 2025 (filed in early 2026). $2,000 for payments made in 2026 (filed in early 2027), adjusted for inflation from 2027." },
      { q: "Do I send a 1099 to an LLC?", a: "Often yes. A single-member LLC taxed as a sole proprietorship, or an LLC taxed as a partnership, generally gets a 1099-NEC. An LLC taxed as a C or S corporation generally doesn't. The sub's W-9 shows which applies." },
      { q: "I paid part by check and part by card. What counts?", a: "Only the check, ACH and cash part counts toward the 1099-NEC total. Card and payment-app payments are reported on 1099-K by the processor." },
      { q: "Does the sub owe tax if I don't send a 1099?", a: "Yes. The threshold only decides whether you file the form. The income is taxable to the sub either way." },
    ],
    sources: [IRS_1099_NEC, IRS_W9, IRS_BACKUP, { label: "IRS: E-file information returns with IRIS", url: "https://www.irs.gov/filing/e-file-information-returns-with-iris" }],
    reviewed: "2026-10-06",
    cta: { href: "/tools/1099-checker", label: "Check which subs need a 1099", text: "Enter what you paid each sub and see who needs a 1099-NEC." },
  },
  {
    slug: "1099-threshold-2026",
    title: "1099-NEC threshold 2026: $600 is now $2,000 for contractor payments",
    description: "The 1099-NEC reporting threshold rises from $600 to $2,000 for payments made in 2026. What changes, and what doesn't, for builders who pay subcontractors.",
    intro: "For the first time in decades the 1099-NEC threshold has moved. Here is what it means if you pay trades, and why your January workload may barely shrink.",
    sections: [
      {
        heading: "What changed",
        paragraphs: [
          "For payments made after December 31, 2025, you generally file Form 1099-NEC only when you paid a non-corporate contractor $2,000 or more in the calendar year. The old threshold was $600. Payments made in 2025, reported on forms due in early 2026, still use $600.",
          "From 2027 the threshold is indexed for inflation, so it will drift upward in small steps.",
        ],
      },
      {
        heading: "Which year's rule applies",
        paragraphs: ["The rule follows the date you paid, not the date of the work or the invoice."],
        table: {
          head: ["Payments made in", "Forms due by", "Threshold"],
          rows: [
            ["2025", "January 31, 2026 (moves to the next business day if it falls on a weekend)", "$600"],
            ["2026", "January 31, 2027 (same rule)", "$2,000"],
            ["2027 and later", "January 31 of the next year", "$2,000, adjusted for inflation"],
          ],
        },
      },
      {
        heading: "Payments that straddle the year",
        paragraphs: [
          "A remodel that runs from November 2025 to February 2026 is split by payment date. Checks you wrote in 2025 count toward that year's $600 test; checks you wrote in 2026 count toward the $2,000 test for 2026. A sub paid $1,500 in December 2025 and $1,500 in January 2026 gets a 1099-NEC for 2025 (over $600) but not for 2026 (under $2,000).",
          "A check dated December 30 but mailed in January is a common argument at tax time. Ask your tax preparer how they want it treated, and be consistent from year to year.",
        ],
      },
      {
        heading: "What did not change",
        paragraphs: [
          "Collecting W-9s, the January 31 deadline, the corporate exemption, the card-payment exclusion and backup withholding all work the same way. A sub you paid $1,800 in 2026 may not get a 1099 from you, but the income is still taxable to them.",
        ],
      },
      {
        heading: "What to do this year",
        paragraphs: [
          "1. Keep collecting a W-9 from every sub before the first payment, whatever you expect to pay them.",
          "2. Track payments per sub by method. Card and payment-app payments never count toward the 1099-NEC total.",
          "3. In December, run the list: non-corporate subs paid $2,000 or more by check, ACH or cash in 2026 get a 1099-NEC by January 31, 2027.",
          "4. Next autumn, check the inflation-adjusted figure for 2027 before you run the list again.",
        ],
      },
      {
        heading: "Why most builders will still file about as many",
        paragraphs: [
          "Most trades on a remodel or new build cross $2,000 on the first job. The subs who drop out are the ones who came once for a small repair, and those are exactly the ones most likely to be missing a W-9. Keep collecting W-9s from everyone: at the first payment you rarely know how much you'll pay a sub over the year.",
        ],
      },
    ],
    faqs: [
      { q: "When does the $2,000 threshold start?", a: "For payments made during 2026, reported on forms filed in early 2027." },
      { q: "Do I still need W-9s from subs I pay less than $2,000?", a: "It is still good practice. You often don't know at the first payment how much you will pay a sub over the year, and the W-9 tells you if they are a corporation." },
      { q: "Does the change affect 1099-K?", a: "Card and payment-app payments are still reported on 1099-K by the processor, not on your 1099-NEC." },
    ],
    sources: [IRS_1099_NEC, IRS_W9],
    reviewed: "2026-10-06",
    cta: { href: "/tools/1099-checker", label: "Run the 1099 checker", text: "See which subs cross the threshold for 2025 or 2026 payments." },
  },
  {
    slug: "w-9-for-subcontractors",
    title: "Get the W-9 before the first payment: a builder's guide to subcontractor W-9s",
    description: "Why builders should collect a signed W-9 from every subcontractor before the first payment, what to check on it, what happens without one, and how to store it safely.",
    intro: "The W-9 is a one-page form. Chasing it in January, after every sub has been paid, is how small builders lose a week every year.",
    sections: [
      {
        heading: "Why before the first payment",
        paragraphs: [
          "Before the first payment, the sub wants the job and the check. After the last payment, your W-9 request competes with every other job they have. Make it part of onboarding, together with the certificate of insurance and the signed agreement, and don't release the first payment without it.",
          "There is also a tax reason. If you make reportable payments to someone who hasn't given you a taxpayer identification number, you may have to withhold 24% backup withholding from what you pay them.",
        ],
      },
      {
        heading: "What the W-9 gives you",
        paragraphs: [
          "The sub's legal name, their business name if different, their federal tax classification (individual, LLC, partnership, C or S corporation) and their taxpayer identification number. You need all four to decide whether they get a 1099-NEC and to fill it in correctly.",
        ],
      },
      {
        heading: "What to check, in 30 seconds",
        paragraphs: [
          "It is signed and dated. Exactly one tax classification box is checked (and for an LLC, the tax letter is filled in). The name matches the name on the invoices you pay and on their insurance certificate. If any of those don't match, ask before work starts, not in January.",
        ],
      },
      {
        heading: "When the W-9 doesn't match",
        paragraphs: [
          "The name on the W-9 is not the name on the invoices: ask which entity you are actually paying, and get a W-9 for that one. A 1099 filed under a name and number that don't match IRS records can come back to you as a mismatch notice.",
          "The sub writes \"applied for\" instead of a number: they are waiting for an EIN. Note the date, follow up, and ask your tax preparer whether to start backup withholding if the number doesn't arrive.",
          "The W-9 is years old: it is still valid, but if the sub has incorporated or changed names since, the old form gives you the wrong answer on whether they need a 1099. A new job is a good moment to ask for a fresh one.",
        ],
      },
      {
        heading: "A one-message onboarding request",
        paragraphs: [
          "Most subs will send paperwork if you ask once, clearly, before the job: \"Before we start on Monday I need three things: your W-9, a current certificate of insurance for general liability and workers' comp, and the signed agreement. Photos are fine. I can't release the first payment without them.\" Sending the request with the agreement, not after the first invoice, is what makes it work.",
        ],
      },
      {
        heading: "Keep it private",
        paragraphs: [
          "A W-9 contains a Social Security number or EIN. Don't leave it in a group text, a shared photo album or an email thread copied to half the office. Store it somewhere access-controlled, and don't include it when you send documents to lenders, owners or auditors who don't need it.",
        ],
      },
    ],
    faqs: [
      { q: "Does a W-9 expire?", a: "No, but ask for a new one when a sub changes its business name, entity type or tax ID." },
      { q: "Can a sub send a photo of the W-9?", a: "Yes. A clear photo or scan of the signed form is fine for your records." },
      { q: "What if the sub refuses?", a: "Ask once more and explain that you can't pay without it. If you pay without a TIN, you may need to apply 24% backup withholding." },
    ],
    sources: [IRS_W9, IRS_BACKUP, IRS_1099_NEC],
    reviewed: "2026-10-06",
    cta: { href: "/login", label: "Collect W-9s by text", text: "Send each sub one link. They upload their W-9 and insurance from their phone, before the first payment." },
  },
  {
    slug: "subcontractor-certificate-of-insurance-requirements",
    title: "Certificate of insurance requirements for subcontractors (residential builders)",
    description: "What insurance to require from subcontractors on residential jobs, how to read a certificate of insurance, and the mistakes that leave builders exposed.",
    intro: "A certificate of insurance is a one-page summary of a sub's policies. It only protects you if you check it and keep it current.",
    sections: [
      {
        heading: "What to require",
        paragraphs: [
          "Most builders ask every sub for general liability, workers' compensation (or proof of a valid exemption where their state allows one) and commercial auto if they drive to or on the job. Many residential builders require general liability limits of $1,000,000 per occurrence; your own insurer or lender may set the minimum for you, so ask them first.",
          "State rules for workers' comp differ a lot. In Florida, construction employers need coverage with a single employee, while up to three corporate officers can file an exemption. In Texas, most private employers aren't required to carry workers' comp at all. Know your state before you decide what to accept.",
        ],
      },
      {
        heading: "Additional insured is an endorsement, not a checkbox",
        paragraphs: [
          "If you need to be an additional insured on the sub's policy, the certificate alone doesn't do that. The sub's insurer has to add an endorsement. Ask for the endorsement page together with the certificate.",
        ],
      },
      {
        heading: "How to read the certificate",
        paragraphs: [
          "Check that the named insured matches the company you pay, that the policy dates cover the whole time the sub works for you, and that the limits meet what you asked for. Certificates that come straight from the insurance agent are harder to fake than ones the sub forwards. If something looks off, call the agent listed on the certificate.",
        ],
      },
      {
        heading: "States where the certificate itself is different",
        paragraphs: [
          "In New York, ACORD certificates are not accepted as proof of workers' comp. Ask for form C-105.2 from the insurer, U-26.3 from the State Insurance Fund, or CE-200 for an exempt business.",
          "In Ohio and Washington, workers' comp comes from the state, not private insurers. An Ohio sub's proof is a certificate from the Ohio Bureau of Workers' Compensation; a Washington sub's is an L&I account in good standing, which you can check online. A private-carrier certificate showing Ohio or Washington workers' comp should make you ask questions.",
          "In Florida and Tennessee, many small construction subs have an owner's exemption instead of a policy. The exemption lasts two years and covers only the owner, not anyone the sub brings along.",
        ],
      },
      {
        heading: "A short checklist for every certificate",
        paragraphs: [
          "1. Named insured matches the company on the invoices and W-9.",
          "2. General liability limit meets your minimum.",
          "3. Workers' comp is listed, or you have the state exemption instead.",
          "4. Policy dates cover the whole time the sub will work for you.",
          "5. If you need additional insured status, the endorsement page is attached.",
          "6. The certificate came from the agent, or you confirmed it with the agent.",
          "7. You wrote down the earliest expiration date and when to ask for the renewal.",
        ],
      },
      {
        heading: "The part everyone forgets: renewals",
        paragraphs: [
          "Policies renew once a year, usually on a date that has nothing to do with your projects. A sub who was covered in March can be uncovered in September. Track expiration dates and ask for the renewed certificate before the old one runs out.",
        ],
      },
    ],
    faqs: [
      { q: "Do I need a COI from a sub with no employees?", a: "You still want proof of general liability. For workers' comp, many states let owners without employees file an exemption; ask for that certificate instead, and check how your own carrier treats it at audit." },
      { q: "How long should I keep certificates?", a: "At least for the full period your own workers' comp policy covers, plus the audit. Keep every certificate that covered the period, not just the latest one." },
    ],
    sources: [FL_DWC, TX_DWC005, NC_9719, TN_EXEMPT, { label: "New York WCB: acceptable proof of coverage", url: "https://www.wcb.ny.gov/content/main/coverage-requirements-wc/permits-licenses-contracts.jsp" }, { label: "Ohio BWC: Ohio workers' comp and you", url: "https://www.bwc.ohio.gov/downloads/blankpdf/ohiowcandyou.pdf" }],
    reviewed: "2026-10-06",
    cta: { href: "/login", label: "Track COIs and renewals", text: "Get a reminder 30 days before any sub's certificate expires." },
  },
  {
    slug: "workers-comp-audit-uninsured-subcontractors",
    title: "Workers' comp audit and uninsured subcontractors: how builders end up paying",
    description: "How a workers' comp premium audit treats payments to subcontractors without their own coverage, a worked example of the cost, and how small builders avoid the bill.",
    intro: "The bill usually shows up months after the job is finished, when nobody remembers which sub had which policy.",
    sections: [
      {
        heading: "How the audit works",
        paragraphs: [
          "Your workers' comp premium is estimated at the start of the policy period. After the period ends, the insurer audits what you actually paid and adjusts the premium up or down.",
          "As part of that, the auditor looks at what you paid subcontractors. Payments to a sub who can't show their own workers' comp coverage, or a valid exemption, for the dates they worked are commonly treated as your payroll, and you pay premium on them. Carriers and states differ in the details, so ask your agent how yours does it.",
        ],
      },
      {
        heading: "What the auditor counts as your payroll",
        paragraphs: [
          "At audit you'll be asked for a list of everyone you paid who isn't on your payroll, with the amounts, and a certificate for each. Carriers put it plainly: a subcontractor without proper documentation is included on the audit and charged on the amounts paid to them. What counts as proper documentation is a certificate issued by the sub's insurer or agent that shows workers' comp coverage for the period the work was done, or a valid state exemption.",
          "The charge is usually on the full amount you paid, not just the labor. Some carriers and states accept a labor-only figure when the invoice separates labor from materials, so ask your auditor before the audit, not during it.",
          "The auditor assigns a class code that matches the sub's work, not your own main code. In most states that use NCCI codes, residential carpentry is commonly 5645; California, New York, Pennsylvania and a few other states use their own systems. Your rate per $100 for that code is on your policy's declarations page. If the code isn't on your policy, the auditor adds it at the state's rate for your carrier.",
        ],
      },
      {
        heading: "Worked example: one policy year, three subs",
        paragraphs: [
          "Illustrative numbers. Your codes, rates and carrier rules will differ, and an experience modifier multiplies the result.",
          "The builder's policy runs January 1 to December 31. The electrician had a current certificate all year. The framer's certificate expired March 31 and nobody asked for the renewal; they were paid $28,000 between April and September. The painter is a sole proprietor with no employees who never sent anything.",
        ],
        table: {
          head: ["Sub", "Paid", "Proof for the work dates", "Code (example)", "Rate per $100 (example)", "Added premium"],
          rows: [
            ["Electrician", "$22,000", "Certificate covering the whole year", "-", "-", "$0"],
            ["Framer", "$28,000 (Apr to Sep)", "Expired March 31, renewal never collected", "5645", "$12.50", "$3,500"],
            ["Painter", "$6,000", "None, and no state exemption", "5474", "$8.00", "$480"],
            ["Total", "$56,000", "", "", "", "$3,980"],
          ],
        },
      },
      {
        heading: "What changes the number",
        paragraphs: [
          "Get the renewal: if the framer's policy did renew on April 1, a certificate from their agent showing April to September brings that line to $0, even if you collect it after the year is over.",
          "Get the exemption: if the painter's state lets owners without employees file an exemption, a copy of it usually removes that line too. In Florida and Tennessee, construction exemptions are valid for two years and must be renewed.",
          "Separate labor: if the auditor accepts labor-only figures and the painter's invoices showed $4,500 labor and $1,500 paint, the charge drops to $360.",
        ],
      },
      {
        heading: "It can be more than premium",
        paragraphs: [
          "Some states also make the hiring contractor responsible for injuries to an uninsured sub's workers. North Carolina's G.S. 97-19 makes a contractor who sublets work without getting the sub's workers' comp certificate liable for benefits to the sub's injured employees, even when the sub is small enough not to need coverage itself. Florida's Division of Workers' Compensation likewise tells contractors that a sub's employees can become their responsibility when the sub has no coverage or exemption.",
        ],
      },
      {
        heading: "Why small builders get hit",
        paragraphs: [
          "The certificate was collected once at the start and never again. The sub's policy lapsed mid-year. The certificate is in someone's email, but the auditor needs proof for the exact dates the work was done.",
        ],
      },
      {
        heading: "How to avoid it",
        paragraphs: [
          "Collect a workers' comp certificate or exemption before the first payment. Track the expiration date and get the renewal before it lapses. Keep payment records per sub, and keep every certificate that covered the policy period, not just the latest one. At audit, hand the auditor one list: each sub, what you paid them, and the certificates that covered those dates.",
        ],
      },
    ],
    faqs: [
      { q: "How much can an uninsured sub add to my premium?", a: "Roughly what you paid them divided by 100, times your rate for the class code the auditor assigns. Some carriers count only the labor part of an invoice. Use the calculator with your own rate." },
      { q: "Does every state treat it the same way?", a: "No. Rules and auditor practice vary by state and carrier, and Texas doesn't require most private employers to carry workers' comp at all. Ask your agent how your carrier handles subs without coverage." },
      { q: "The sub had coverage, but I can't find the certificate. What now?", a: "Ask the sub's insurance agent for a certificate showing the policy dates. A certificate issued now can still prove the policy was in force when the work was done." },
    ],
    sources: [BEACON_AUDIT, NC_9719, FL_DWC, TN_EXEMPT, TX_DWC005],
    reviewed: "2026-10-06",
    cta: { href: "/tools/workers-comp-audit-calculator", label: "Estimate your audit exposure", text: "See what uncovered sub payments could add to your premium." },
  },
  {
    slug: "subcontractor-insurance-expired-mid-job",
    title: "Subcontractor's insurance expired mid-job: what to do this week",
    description: "A sub's certificate of insurance lapsed while they're still on your job. What to do now, what to hold, what to keep for the audit, and how to stop it happening again.",
    intro: "You notice the date on the certificate has passed and the sub is still on site. Here is what to do, in order.",
    sections: [
      {
        heading: "1. Find out if the policy actually lapsed",
        paragraphs: [
          "Most of the time the policy renewed and nobody sent you the new certificate. Call or email the insurance agent listed on the old certificate and ask for a current one. Ask for it to come from the agent, not forwarded by the sub.",
        ],
      },
      {
        heading: "2. Hold payment until you have it",
        paragraphs: [
          "If your agreement makes payment conditional on current insurance, use that clause: tell the sub, in writing, that the next payment is on hold until you receive the renewed certificate. Pay the moment it arrives. Most subs fix this within a day once a check depends on it.",
          "Whether the sub keeps working in the meantime is your call and depends on your contract, your own policy and your state. Ask your agent before you let an uncovered sub keep working.",
        ],
      },
      {
        heading: "3. If there really was a gap",
        paragraphs: [
          "Write down the dates the sub worked while uncovered and what you paid them for that period. At your workers' comp audit, payments for uncovered periods are often added to your payroll. In North Carolina, a contractor who sublets without the sub's certificate can also be liable for benefits if one of the sub's employees is hurt. Tell your agent now rather than letting the auditor find it.",
        ],
      },
      {
        heading: "Example: what a two-month gap can cost",
        paragraphs: [
          "Illustrative numbers. A framing sub's workers' comp lapsed on June 1 and was reinstated on August 1. You paid them $14,000 for June and July. At audit, those payments can be charged as your payroll at your framing rate. At $12.50 per $100, that is $1,750 in added premium, before any experience modifier. The payments before June 1 and after August 1 are covered by the certificates, if you kept both.",
        ],
      },
      {
        heading: "4. Keep both certificates",
        paragraphs: [
          "Keep the expired certificate and the renewal. Together they show the auditor which dates were covered. Throwing away the old one when the new one arrives is a common way to lose the proof you need.",
        ],
      },
      {
        heading: "What changes by state",
        paragraphs: [
          "In North Carolina, a contractor who sublets work without the sub's workers' comp certificate can be liable for benefits to the sub's injured employees. In Michigan, workers' comp liability can pass from an uninsured sub to the general contractor. In Washington, a general contractor can be held responsible for a sub's unpaid L&I premiums. In Texas, a sub may lawfully have no workers' comp at all. Check your state's page before deciding how strict to be.",
        ],
      },
      {
        heading: "5. Stop it happening again",
        paragraphs: [
          "Write down every certificate's expiration date when you receive it, and ask for the renewal 30 days before. That is the whole system; the hard part is doing it for every sub, every year.",
        ],
      },
    ],
    faqs: [
      { q: "Can I keep paying a sub whose insurance expired?", a: "Legally that depends on your contract and state. Practically, payments for uncovered periods can end up in your workers' comp premium at audit, so most builders hold payment until the renewal arrives." },
      { q: "The sub says the policy renewed automatically. Is that enough?", a: "No. Ask for the renewed certificate from the agent. The auditor wants paper showing the dates, not the sub's word." },
    ],
    sources: [NC_9719, FL_DWC, BEACON_AUDIT, { label: "Michigan: employer insurance requirements for subcontractors and general contractors", url: "https://www.michigan.gov/leo/-/media/Project/Websites/leo/Documents/WDCA-RESOURCES-AND-REPORTS/Publications/wca_WCPUB002.pdf" }, { label: "Washington L&I: are you responsible for your subcontractor's premiums?", url: "https://www.lni.wa.gov/forms-publications/F262-262-000.pdf" }],
    reviewed: "2026-10-06",
    cta: { href: "/login", label: "Get renewal reminders", text: "We ask each sub for the renewed certificate 30 days before it expires, and tell you if it doesn't arrive." },
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
