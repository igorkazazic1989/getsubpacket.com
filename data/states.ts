export interface UsState {
  slug: string;
  name: string;
  abbr: string;
  // Optional, VERIFIED state-specific notes (licensing board, lien waiver rules, prompt-pay law).
  // Leave empty until you have checked them against the official source; thin or wrong legal facts hurt more than they help.
  notes?: string[];
  // Where the notes were verified (official statute or agency URL). Required for a page to be indexed.
  sources?: string[];
}

const RAW: [string, string][] = [
  ["Alabama", "AL"], ["Alaska", "AK"], ["Arizona", "AZ"], ["Arkansas", "AR"], ["California", "CA"], ["Colorado", "CO"],
  ["Connecticut", "CT"], ["Delaware", "DE"], ["District of Columbia", "DC"], ["Florida", "FL"], ["Georgia", "GA"], ["Hawaii", "HI"],
  ["Idaho", "ID"], ["Illinois", "IL"], ["Indiana", "IN"], ["Iowa", "IA"], ["Kansas", "KS"], ["Kentucky", "KY"], ["Louisiana", "LA"],
  ["Maine", "ME"], ["Maryland", "MD"], ["Massachusetts", "MA"], ["Michigan", "MI"], ["Minnesota", "MN"], ["Mississippi", "MS"],
  ["Missouri", "MO"], ["Montana", "MT"], ["Nebraska", "NE"], ["Nevada", "NV"], ["New Hampshire", "NH"], ["New Jersey", "NJ"],
  ["New Mexico", "NM"], ["New York", "NY"], ["North Carolina", "NC"], ["North Dakota", "ND"], ["Ohio", "OH"], ["Oklahoma", "OK"],
  ["Oregon", "OR"], ["Pennsylvania", "PA"], ["Rhode Island", "RI"], ["South Carolina", "SC"], ["South Dakota", "SD"],
  ["Tennessee", "TN"], ["Texas", "TX"], ["Utah", "UT"], ["Vermont", "VT"], ["Virginia", "VA"], ["Washington", "WA"],
  ["West Virginia", "WV"], ["Wisconsin", "WI"], ["Wyoming", "WY"],
];

// Verified state content. Every line must be checked against the linked official source before it is added.
// Last reviewed: 2026-10-06.
const CONTENT: Record<string, Pick<UsState, "notes" | "sources">> = {
  TX: {
    notes: [
      "Texas does not issue a statewide general contractor license. Electricians and HVAC/refrigeration contractors are licensed by the Texas Department of Licensing and Regulation (TDLR), and plumbers by the Texas State Board of Plumbing Examiners (TSBPE). For those trades, look up the sub's license before they start. Framers, drywall hangers, painters and similar trades have no state license to check, but your city may require registration.",
      "Texas does not require most private employers to carry workers' compensation. Employers who opt out are called non-subscribers and must file DWC Form-005 with the Texas Department of Insurance every year. A Texas sub without a workers' comp certificate may therefore be operating legally. Ask for their general liability certificate, and ask your own carrier how it treats payments to non-subscriber subs at your premium audit.",
      "Because a Texas sub can lawfully have no workers' comp, your agreement's insurance clause matters more here than in most states. If you want every sub covered, say so in the agreement and make payment conditional on a current certificate.",
    ],
    sources: [
      "https://www.tdi.texas.gov/forms/dwc/dwc005nocov.pdf",
      "https://www.tdlr.texas.gov/LicenseSearch/",
      "https://tsbpe.texas.gov/",
    ],
  },
  FL: {
    notes: [
      "In Florida's construction industry, an employer with one or more employees, counting the owner, must carry workers' compensation. Up to three corporate officers or LLC members of a construction business can file for an exemption with the Division of Workers' Compensation. Ask for the exemption certificate and track its expiration like a policy: construction exemptions are valid for two years.",
      "An exempt officer is not covered, and the exemption doesn't cover the sub's employees. If an exempt sub shows up with a crew, ask for a workers' comp certificate that covers that crew.",
      "Subcontractors and suppliers who don't contract directly with the owner must serve a Notice to Owner before, or within 45 days after, they first furnish labor, services or materials, to keep their lien rights (Fla. Stat. 713.06). On a residential job, expect these from your subs' suppliers, and collect lien releases from those parties as you pay.",
    ],
    sources: [
      "https://myfloridacfo.com/docs-sf/workers-compensation-libraries/workers-comp-documents/brochures-and-guides/important-workers%27-compensation-information-for-contractors.pdf",
      "https://www.flsenate.gov/Laws/Statutes/2025/713.06",
    ],
  },
  CA: {
    notes: [
      "Since January 1, 2025, an unlicensed person may only do minor work under $1,000 in total labor and materials, and only if the job needs no permit and they hire no workers (AB 2622). Above that, or on any permitted job, the sub needs a CSLB license in the right classification. Look up the license number and classification before work starts.",
      "California lien waivers must be in substantially the statutory form: Civil Code 8132 (conditional, progress payment), 8134 (unconditional, progress), 8136 (conditional, final) and 8138 (unconditional, final). A waiver on your own form can be void. In California, read the template's lien waiver clause as a requirement to use these statutory forms.",
      "An unconditional waiver is binding when signed, even if the check later bounces. Ask subs for conditional waivers with each payment request, and for unconditional waivers once the payment has cleared.",
    ],
    sources: [
      "https://www.cslb.ca.gov/Resources/IndustryBulletins/2024/AB%202622%20Implementation.FINAL.pdf",
      "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=8132",
    ],
  },
  NC: {
    notes: [
      "Under G.S. 97-19, a contractor who sublets work without getting a workers' compensation certificate from the sub can be liable for workers' comp benefits to the sub's injured employees, even when the sub has fewer than three employees and would not otherwise need coverage. The certificate has to be in hand before you sublet, so collect it before the sub starts, not with the first invoice.",
      "A North Carolina general contractor license from the NC Licensing Board for General Contractors is required for projects costing $40,000 or more. Under G.S. 87-14, building permits for those projects require a valid license and proof of workers' comp coverage as Chapter 97 requires.",
    ],
    sources: [
      "https://www.ic.nc.gov/ncic/pages/statute/97-19.htm",
      "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_87/GS_87-14.html",
      "https://www.nclbgc.org/",
    ],
  },
  GA: {
    notes: [
      "Georgia requires a residential or general contractor license from the State Licensing Board for Residential and General Contractors for general contracting work over $2,500 in labor, materials or both. The requirement has applied since July 1, 2008. Specialty trades such as electrical, plumbing and HVAC have their own state licenses.",
      "Georgia employers who regularly employ three or more people, counting regular part-time and seasonal workers, must provide workers' compensation. A small Georgia sub may lawfully have none, so decide in your agreement whether you require it anyway, and ask your carrier how it treats subs without coverage at audit.",
    ],
    sources: [
      "https://www.fayetteville-ga.gov/165/Contractor-Licensing-Requirements",
      "https://sbwc.georgia.gov/node/746",
    ],
  },
  OH: {
    notes: [
      "Ohio is one of four monopolistic workers' compensation states: coverage comes from an exclusive state fund run by the Ohio Bureau of Workers' Compensation (BWC). A sub's proof of coverage is a BWC certificate of coverage, not an ACORD form from an insurance agent, and you can verify it on the BWC website. An ACORD certificate from a private carrier showing Ohio workers' comp is a red flag.",
      "Ohio licenses electrical, plumbing, HVAC, hydronics and refrigeration contractors through the Ohio Construction Industry Licensing Board, so check those trades' state licenses before work starts. For other trades, check your city's licensing or registration rules.",
    ],
    sources: [
      "https://www.bwc.ohio.gov/downloads/blankpdf/ohiowcandyou.pdf",
      "https://www.greenecountyohio.gov/DocumentCenter/View/33825/2025-BWC-Certificate",
      "https://dam.assets.ohio.gov/image/upload/com.ohio.gov/documents/dico_ExamApplication.pdf",
    ],
  },
  WA: {
    notes: [
      "Washington workers' comp is run by the Department of Labor & Industries (L&I), not private insurers. Under RCW 51.12.070 and 51.16.070, a general contractor can be held responsible for a subcontractor's unpaid workers' comp premiums.",
      "L&I lists six conditions that must all be true to avoid that liability, including that both of you are properly registered or licensed, that you don't supervise the sub's workers, and that the sub has an L&I industrial insurance account in good standing. Check each sub at Lni.wa.gov/VerifyAContractor at least once a year, or file L&I's tracking request to be notified of changes.",
    ],
    sources: [
      "https://www.lni.wa.gov/forms-publications/F262-262-000.pdf",
    ],
  },
  NY: {
    notes: [
      "New York does not accept ACORD certificates as proof of workers' compensation coverage (WCL 57). Ask subs for form C-105.2 from their insurer, U-26.3 if they are insured by the State Insurance Fund, or CE-200 if they are exempt. Permit offices ask for the same forms.",
      "New York also requires disability benefits and Paid Family Leave coverage alongside workers' comp. Ask subs for proof of both, and track both expiration dates.",
    ],
    sources: ["https://www.wcb.ny.gov/content/main/coverage-requirements-wc/permits-licenses-contracts.jsp"],
  },
  PA: {
    notes: [
      "Contractors who do at least $5,000 of home improvements a year must register with the Pennsylvania Attorney General under the Home Improvement Consumer Protection Act. Subcontractors who perform home improvements must register too, even if they never contract with the homeowner. Registration is renewed every two years.",
      "Registration requires at least $50,000 of personal injury liability and $50,000 of property damage coverage. Registered contractors must show their number, in the form PA123456, on contracts, estimates, proposals and ads, so ask each residential sub for theirs and check it with the Attorney General's office.",
    ],
    sources: [
      "https://www.attorneygeneral.gov/home-improvement-contractor-registration/",
      "https://www.attorneygeneral.gov/businesses-and-organizations/home-improvement-contractor-registration/frequently-asked-questions/",
    ],
  },
  TN: {
    notes: [
      "Tennessee runs a workers' compensation exemption registry for the construction industry. Eligible owners, such as a sole proprietor owning 100% of the business, a corporate officer, or an LLC member or partner with at least 20% ownership, can exempt themselves. Exemptions are valid for two years, so track the expiration like a policy.",
      "The exemption only covers the owner. An exempt construction sub must still cover all of its employees, even if it has only one. If an exempt sub arrives with a helper, ask for a workers' comp certificate.",
    ],
    sources: [
      "https://www.tn.gov/workforce/injuries-at-work/employers/employers/who-must-carry-insurance/exemptions.html",
      "https://www.tn.gov/content/tn/commerce/insurance/consumer-resources/workers-compensation-insurance-information/wc-process.html",
    ],
  },
  VA: {
    notes: [
      "Virginia requires workers' compensation for employers who regularly employ more than two people, part-time or full-time. A builder who hires subs for its own trade or contract must count the subs' employees together with its own when deciding whether it is over two, even if every sub has its own coverage. A small Virginia builder can cross the line without hiring anyone directly.",
      "Projects over $1,000 in total value need a Virginia contractor license from the Board for Contractors (DPOR). The license class (C, B or A) sets how large a job it covers, so compare the sub's class with the size of the contract before work starts.",
    ],
    sources: [
      "https://workcomp.virginia.gov/workers-compensation-insurance-information-employers",
      "https://www.dpor.virginia.gov/sites/default/files/Consumer/Contractor%20consumer%20info%20sheet.pdf",
    ],
  },
  MD: {
    notes: [
      "Every contractor who solicits or performs home improvement work in Maryland must hold a Maryland Home Improvement Commission (MHIC) license. On a remodel, check that each sub working on the home has one.",
      "The MHIC license does not cover building new homes. Builders of new homes in Maryland must instead be registered with the Home Builder Registration Unit of the Office of the Attorney General. If you build custom homes and also remodel, you may need both.",
      "Maryland requires workers' compensation from every employer with one or more employees. A small remodeling sub with even one helper should be able to show you a certificate.",
    ],
    sources: [
      "https://labor.maryland.gov/license/mhic/mhicfaqlic.shtml",
      "https://www.wcc.state.md.us/PDF/Publications/QandA_Emplr.pdf",
    ],
  },
  NJ: {
    notes: [
      "New Jersey home improvement contractors must register with the Division of Consumer Affairs, and a subcontractor of a contractor must register too. Construction of a new residence is not a home improvement under the Act, so this applies to remodels, not new builds.",
      "Registration requires commercial general liability insurance of at least $500,000 per occurrence, in the contractor's own name. Registered contractors must show their registration number on ads, business cards, vehicles and business documents, which makes it easy to ask for and check.",
      "New Jersey requires workers' compensation from all employers. A corporation must cover anyone who works for it, corporate officers included, so a one-person corporation still needs a policy. Partnerships, LLCs and sole proprietors need coverage once anyone other than the owners works for them.",
    ],
    sources: [
      "https://www.njconsumeraffairs.gov/hic/Pages/FAQ.aspx",
      "https://www.nj.gov/labor/workerscompensation/employer-requirements/",
    ],
  },
  MI: {
    notes: [
      "A Michigan private employer must carry workers' compensation if it regularly employs three or more people at one time, or one or more people for 35 hours a week or more for 13 weeks or longer in the preceding 52 weeks.",
      "Michigan law lets workers' comp liability pass from an uninsured subcontractor to the general contractor. The state advises contractors to require a certificate of workers' compensation insurance, or a properly executed exclusion form, from any sub that has employees or is a partnership, corporation or LLC. A sole proprietor with no employees doesn't need a certificate under the Act.",
    ],
    sources: ["https://www.michigan.gov/leo/-/media/Project/Websites/leo/Documents/WDCA-RESOURCES-AND-REPORTS/Publications/wca_WCPUB002.pdf"],
  },
  IL: {
    notes: [
      "Illinois requires workers' compensation for almost every employer with even one employee, part-time included. Sole proprietors, partners, corporate officers and LLC members can generally exempt themselves, but the Illinois Workers' Compensation Commission warns that owners in construction and other extra-hazardous work must, in almost all instances, obtain insurance.",
      "You can check whether an Illinois business has workers' comp coverage in the Commission's online insurance search before the sub starts, instead of relying only on a certificate the sub forwards.",
      "Under Section 1(a)(3) of the Illinois Workers' Compensation Act, a business doing construction work that engages a contractor or subcontractor is liable to pay compensation to that contractor's employees unless the contractor has insured or guaranteed its liability. A current certificate from each sub is what protects you.",
    ],
    sources: [
      "https://iwcc.illinois.gov/about/insurance.html",
      "https://iwcc.illinois.gov/content/dam/soi/en/web/iwcc/documents/act.pdf",
    ],
  },
  SC: {
    notes: [
      "South Carolina residential specialty contractors must register with the Residential Builders Commission when a job exceeds $500. A specialty contractor may not build additions to a home without supervision by a residential builder or other appropriately licensed person.",
      "A contractor who needs to practice more than three trade classifications at a time must be licensed as a residential builder instead. Specialty contractors must also file a $5,000 surety bond before doing work that costs more than $5,000 in total.",
      "South Carolina requires workers' compensation from businesses that regularly employ four or more people in the state. Whether a general contractor, or a sub with fewer than four employees, must carry it is decided case by case, so ask your agent before you accept a sub without coverage.",
    ],
    sources: [
      "https://llr.sc.gov/res/PDF/Residential_Specialty_Contractor_Registration_Application_PKG.pdf",
      "https://www.wcc.sc.gov/employer-faqs",
    ],
  },
  CO: {
    notes: [
      "Colorado requires workers' compensation for all employers, with few exceptions. Workers are presumed to be employees unless they are free from direction and control and have an independent business doing that kind of work. Paying someone on a 1099 does not make them a contractor.",
      "Owners of corporations and LLCs must either get coverage for themselves or file a form rejecting it. Ask Colorado subs without a workers' comp certificate for that rejection form, and use the state's online workers' comp verification to check coverage.",
    ],
    sources: [
      "https://cdle.colorado.gov/dwc/employers/independent-contractors-and-coverage-exemptions",
      "https://cdle.colorado.gov/dwc/verify-WC",
    ],
  },
  AZ: {
    notes: [
      "According to the Arizona Registrar of Contractors, anyone doing a project whose total cost, labor and materials included, is over $1,000, or that needs a local permit, must hold an ROC license, whether they call themselves a handyman or a contractor.",
      "The ROC has investigated unlicensed businesses using licensed contractors' ROC numbers. Look the license up on the ROC website and call the phone number listed on the license, not the one on the sub's card, to confirm you're dealing with the licensed company.",
      "Under A.R.S. 23-902, when you contract out work that is part of your own business and keep supervision or control over it, the contractor and its employees can be treated as your employees for workers' compensation. A sub who runs the job independently, on a definite piece of work, falls outside that rule. Collect a workers' comp certificate either way.",
    ],
    sources: [
      "https://roc.az.gov/news/contracting-arizona-heres-what-you-need-know",
      "https://www.azleg.gov/ars/23/00902.htm",
    ],
  },
};

export const STATES: UsState[] = RAW.map(([name, abbr]) => ({
  name,
  abbr,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  ...(CONTENT[abbr] ?? {}),
}));

export function getState(slug: string) {
  return STATES.find((s) => s.slug === slug);
}

// Sources must be a government agency or the statute itself. Non-.gov official domains are listed explicitly.
const OFFICIAL_NON_GOV = new Set(["myfloridacfo.com", "www.myfloridacfo.com", "nclbgc.org", "www.nclbgc.org"]);

export function isOfficialSource(url: string) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.endsWith(".gov") || host.endsWith(".us") || OFFICIAL_NON_GOV.has(host);
  } catch {
    return false;
  }
}

// A state page is indexable only with at least two verified notes and at least one source, all of them official.
export function hasStateContent(s: UsState) {
  const sources = s.sources ?? [];
  return (s.notes?.length ?? 0) >= 2 && sources.length >= 1 && sources.every(isOfficialSource);
}

export const INDEXABLE_STATES = () => STATES.filter(hasStateContent);
