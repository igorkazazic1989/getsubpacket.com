export interface AgreementData {
  builder: string;
  builderAddress: string;
  sub: string;
  subAddress: string;
  state: string;
  project: string;
  scope: string;
  price: string;
  paymentTerms: string;
  glLimit: string;
  date: string;
}

const or = (v: string, fallback: string) => (v && v.trim() ? v.trim() : fallback);

export function stateLawPhrase(state: string) {
  if (!state) return "the state where the Project is located";
  return state === "District of Columbia" ? "the District of Columbia" : `the State of ${state}`;
}

export function agreementSections(d: AgreementData) {
  const law = stateLawPhrase(d.state);
  const bAddr = d.builderAddress.trim() ? `, ${d.builderAddress.trim()}` : "";
  const sAddr = d.subAddress.trim() ? `, ${d.subAddress.trim()}` : "";
  return [
    {
      h: "1. Parties and project",
      p: [
        `This Subcontractor Agreement ("Agreement") is made on ${or(d.date, "[date]")} between ${or(d.builder, "[Contractor name]")}${bAddr} ("Contractor") and ${or(d.sub, "[Subcontractor name]")}${sAddr} ("Subcontractor") for work at ${or(d.project, "[project address]")} (the "Project").`,
      ],
    },
    {
      h: "2. Scope of work",
      p: [
        or(d.scope, "[Describe the work, which party supplies which materials, and the drawings or specifications that apply.]"),
        "Subcontractor will perform the work in a good and workmanlike manner, following the plans, applicable building codes and Contractor's reasonable schedule. Changes to scope or price must be agreed in writing before the changed work is performed.",
      ],
    },
    {
      h: "3. Price and payment",
      p: [
        `Contractor will pay Subcontractor ${or(d.price, "[amount]")} for the work. ${or(d.paymentTerms, "[Payment schedule, e.g. progress payments within 15 days of an approved invoice]")}`,
        "Before each payment, Subcontractor will provide an invoice and, where permitted by law, a lien waiver for the amount being paid. Before the first payment, Subcontractor will provide a completed and signed IRS Form W-9.",
      ],
    },
    {
      h: "4. Independent contractor",
      p: [
        "Subcontractor is an independent contractor and controls the means and methods of its work. Subcontractor is responsible for its own workers, tools, taxes, wages and benefits. This Agreement does not create an employment, partnership or joint venture relationship.",
      ],
    },
    {
      h: "5. Insurance",
      p: [
        `Before starting work, and for as long as work continues, Subcontractor will carry: (a) commercial general liability insurance of at least ${or(d.glLimit, "[limit]")} per occurrence; (b) workers' compensation insurance as required by the laws of ${law}, or proof of a valid exemption; and (c) commercial auto insurance for vehicles used for the Project. Subcontractor will deliver certificates of insurance before starting and renewed certificates before any policy expires. Where Contractor requires it, Contractor will be added as an additional insured on the general liability policy by endorsement.`,
        "Contractor may withhold payment while any required certificate is missing or expired.",
      ],
    },
    {
      h: "6. Indemnification",
      p: [
        "To the extent permitted by law, Subcontractor will defend, indemnify and hold harmless Contractor and the property owner from claims, damages and costs arising from Subcontractor's work or the acts or omissions of Subcontractor, its workers or suppliers, except to the extent caused by Contractor's negligence.",
      ],
    },
    {
      h: "7. Licenses, permits and safety",
      p: [
        "Subcontractor will hold every license its trade requires, follow applicable safety laws and Contractor's site rules, keep its work area reasonably clean and remove its own debris.",
      ],
    },
    {
      h: "8. Warranty",
      p: [
        "Subcontractor warrants its work, and materials it supplies, against defects for one year after completion and will correct defective work promptly at its own cost.",
      ],
    },
    {
      h: "9. Termination",
      p: [
        "Either party may terminate this Agreement for a material breach not cured within seven days after written notice. Contractor may also terminate for convenience by written notice and will pay for work properly performed through the termination date.",
      ],
    },
    {
      h: "10. Governing law and entire agreement",
      p: [
        `This Agreement is governed by the laws of ${law}. It is the entire agreement between the parties on this subject and may be changed only in a writing signed by both parties.`,
      ],
    },
  ];
}
