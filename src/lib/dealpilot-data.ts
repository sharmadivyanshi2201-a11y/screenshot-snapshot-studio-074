export type ApprovalStatus = "Pending banker review" | "Approved";

export type EvidenceRecord = {
  id: string;
  name: string;
  kind: string;
  status: string;
  assumptions: number;
  addedBy: string;
  addedAt: string;
};

export type FindingStatus = "Open" | "In review" | "Reviewed";

export type ActivityRecord = {
  id: string;
  activity: string;
  user: string;
  timestamp: string;
  changedAssumption: string;
  analysisStatus: string;
  approvalStatus: string;
  category: "analysis" | "assumption" | "approval" | "evidence";
};

export const DEMO_DEAL = {
  company: "NovaTech Industries Pvt. Ltd.",
  dealType: "Sell-side M&A",
  status: "Active",
  owner: "A. Morgan",
  stage: "Material change review",
  industry: "Industrial technology",
  geography: "India",
  dealId: "NVT-2026-014",
};

export const DEMO_FINANCIALS = {
  revenue: 140,
  ebitda: 21,
  ebitdaMargin: 15,
  debt: 45,
  netProfit: 9,
  cashFlow: 5,
  enterpriseValue: 168,
  equityValue: 133,
  ebitdaMultiple: 8,
  cashAndOtherAdjustments: 10,
};

export const DEMO_EVIDENCE: EvidenceRecord = {
  id: "demo-customer-review",
  name: "NovaTech — Key Customer Renewal Review.pdf",
  kind: "Fictional source exhibit",
  status: "Demo source · not verified",
  assumptions: 9,
  addedBy: "A. Morgan",
  addedAt: "18 Nov 2025 · 09:30",
};

export const DEMO_ASSUMPTIONS = [
  { id: "revenue", label: "Annual revenue baseline", value: "₹140 Cr", type: "Demo financial input" },
  { id: "ebitda", label: "Annual EBITDA baseline", value: "₹21 Cr", type: "Demo financial input" },
  { id: "margin", label: "EBITDA margin", value: "15.0%", type: "Calculated · EBITDA ÷ revenue" },
  { id: "multiple", label: "Enterprise value multiple", value: "8.0× EBITDA", type: "Manual demo assumption" },
  { id: "debt", label: "Gross debt", value: "₹45 Cr", type: "Demo financial input" },
  { id: "bridge", label: "Cash & other equity bridge", value: "+₹10 Cr", type: "Manual demo assumption" },
  { id: "customer-share", label: "Key customer revenue exposure", value: "18%", type: "Scenario assumption" },
  { id: "customer-reduction", label: "Potential commitment reduction", value: "20%", type: "Scenario assumption" },
  { id: "cash-flow", label: "Annual cash flow", value: "₹5 Cr", type: "Demo financial input" },
] as const;

export const DEMO_IMPACT = {
  id: "impact-customer-renewal",
  customer: "Northstar Mobility",
  title: "Key customer commitment under review",
  event: "A material customer has moved its next-year supply commitment into a commercial review.",
  source: DEMO_EVIDENCE.name,
  revenueExposure: "18% of annual revenue",
  revenueImpact: -5,
  ebitdaImpact: -0.75,
  valuationImpact: -6,
  risk: "High",
  approval: "Pending banker review" as ApprovalStatus,
  assumptions: [
    "Customer concentration is assumed at 18% of annual revenue.",
    "The scenario models a 20% reduction to the customer's annual commitment.",
    "Revenue at risk is rounded to ₹5.0 Cr from ₹140 Cr × 18% × 20%.",
    "EBITDA impact uses the 15% demo margin: approximately ₹0.75 Cr downside.",
    "Enterprise value sensitivity applies the 8.0× EBITDA demo multiple: approximately ₹6 Cr downside.",
  ],
};

export const DEMO_FINDINGS = [
  {
    id: "customer-concentration",
    area: "Customer concentration",
    severity: "High",
    description: "One key account is modeled at 18% of revenue; renewal timing is a material diligence item.",
    status: "Open" as FindingStatus,
    evidence: DEMO_EVIDENCE.name,
  },
  {
    id: "revenue-quality",
    area: "Revenue quality",
    severity: "Medium",
    description: "The customer commitment scenario may affect forward revenue visibility; contract terms remain unverified.",
    status: "In review" as FindingStatus,
    evidence: DEMO_EVIDENCE.name,
  },
  {
    id: "debt-cash-flow",
    area: "Debt & cash flow",
    severity: "Medium",
    description: "Demo gross debt is ₹45 Cr against ₹5 Cr annual cash flow; confirm repayment profile in diligence.",
    status: "Open" as FindingStatus,
    evidence: "Demo financial assumptions",
  },
  {
    id: "operations",
    area: "Operational continuity",
    severity: "Low",
    description: "No operational interruption is included in the fictional demo scenario.",
    status: "Reviewed" as FindingStatus,
    evidence: "Demo scenario note",
  },
  {
    id: "profitability",
    area: "Financial performance",
    severity: "Low",
    description: "Demo net profit is ₹9 Cr; margins and normalization items require source-document review.",
    status: "In review" as FindingStatus,
    evidence: "Demo financial assumptions",
  },
] as const;

export const DEMO_ACTIVITIES: ActivityRecord[] = [
  {
    id: "activity-1",
    activity: "Material customer event flagged for review",
    user: "A. Morgan",
    timestamp: "18 Nov 2025 · 10:15",
    changedAssumption: "Customer commitment scenario",
    analysisStatus: "Impact calculated · demo",
    approvalStatus: "Pending banker review",
    category: "analysis",
  },
  {
    id: "activity-2",
    activity: "Nine demo assumptions linked to source exhibit",
    user: "A. Morgan",
    timestamp: "18 Nov 2025 · 09:42",
    changedAssumption: "Valuation & customer exposure",
    analysisStatus: "Assumptions saved · demo",
    approvalStatus: "Not applicable",
    category: "assumption",
  },
  {
    id: "activity-3",
    activity: "Fictional customer renewal exhibit added",
    user: "A. Morgan",
    timestamp: "18 Nov 2025 · 09:30",
    changedAssumption: "None",
    analysisStatus: "Source not independently verified",
    approvalStatus: "Not applicable",
    category: "evidence",
  },
];

export const DEMO_REPORTS = [
  { id: "deal-overview", title: "Deal overview", description: "Transaction profile, stage and headline metrics", updated: "18 Nov 2025" },
  { id: "financial-analysis", title: "Financial analysis", description: "Operating performance, leverage and valuation bridge", updated: "18 Nov 2025" },
  { id: "change-impact", title: "Change impact report", description: "Customer event, scenario assumptions and sensitivities", updated: "18 Nov 2025" },
  { id: "diligence-findings", title: "Due diligence findings", description: "Open items across financial, business and operations", updated: "18 Nov 2025" },
  { id: "risk-summary", title: "Risk summary", description: "Severity-weighted review items and approval status", updated: "18 Nov 2025" },
  { id: "valuation-summary", title: "Valuation summary", description: "Enterprise value and equity bridge assumptions", updated: "18 Nov 2025" },
] as const;

export const formatCr = (value: number, digits = 0) =>
  `₹${Math.abs(value).toFixed(digits)} Cr`;

export const formatSignedCr = (value: number, digits = 1) =>
  `${value < 0 ? "−" : "+"}${formatCr(value, digits)}`;

export const reportText = (title: string) =>
  [
    `DEALPILOT AI · ${title.toUpperCase()}`,
    "Fictional demo assumptions — not verified financial, legal, or diligence advice.",
    "",
    `Company: ${DEMO_DEAL.company}`,
    `Deal type: ${DEMO_DEAL.dealType}`,
    `Stage: ${DEMO_DEAL.stage}`,
    `Deal owner: ${DEMO_DEAL.owner}`,
    "",
    `Revenue: ₹${DEMO_FINANCIALS.revenue} Cr`,
    `EBITDA: ₹${DEMO_FINANCIALS.ebitda} Cr (${DEMO_FINANCIALS.ebitdaMargin}%)`,
    `Net profit: ₹${DEMO_FINANCIALS.netProfit} Cr`,
    `Debt: ₹${DEMO_FINANCIALS.debt} Cr`,
    `Cash flow: ₹${DEMO_FINANCIALS.cashFlow} Cr`,
    `Enterprise value: ₹${DEMO_FINANCIALS.enterpriseValue} Cr`,
    `Equity value: ₹${DEMO_FINANCIALS.equityValue} Cr`,
    "",
    `Customer event: ${DEMO_IMPACT.title}`,
    `Revenue sensitivity: ${formatSignedCr(DEMO_IMPACT.revenueImpact)}`,
    `EBITDA sensitivity: ${formatSignedCr(DEMO_IMPACT.ebitdaImpact)}`,
    `Enterprise value sensitivity: ${formatSignedCr(DEMO_IMPACT.valuationImpact)}`,
    `Approval status: ${DEMO_IMPACT.approval}`,
    "",
    "All names, documents, events and financials in this report are fictional demo content.",
  ].join("\n");