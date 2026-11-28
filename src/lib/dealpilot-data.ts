export type ApprovalStatus = "Pending banker review" | "Approved";
export type FindingStatus = "Open" | "In progress" | "Resolved";
export type FindingSeverity = "Critical" | "High" | "Medium" | "Low";
export type DiligenceCategory = "Financial" | "Commercial" | "Legal" | "Operational";

export type DealProfile = {
  company: string;
  dealType: string;
  status: string;
  owner: string;
  stage: string;
  industry: string;
  geography: string;
  dealId: string;
  buyer: string;
  seller: string;
};

export type FinancialInputs = {
  revenue: number;
  ebitda: number;
  debt: number;
  netProfit: number;
  cashFlow: number;
  ebitdaMultiple: number;
  cashAndOtherAdjustments: number;
};

export type CustomerScenario = {
  customer: string;
  customerRevenueSharePct: number;
  commitmentReductionPct: number;
  confidencePct: number;
  verificationStatus: string;
};

export type DcfAssumptions = {
  revenueGrowthPct: number;
  taxRatePct: number;
  depreciationPct: number;
  capexPct: number;
  workingCapitalPct: number;
  waccPct: number;
  terminalGrowthPct: number;
};

export type SimulatorInputs = {
  largestCustomerLossPct: number;
  customerRevenueReductionPct: number;
  rawMaterialCostIncreasePct: number;
  marginCompressionPct: number;
  workingCapitalDelayCr: number;
  interestRateIncreasePct: number;
  supplierDisruptionPct: number;
  unexpectedOperatingExpensesCr: number;
  debtIncreaseCr: number;
};

export type FailureThresholds = {
  minimumEbitdaCr: number;
  minimumEnterpriseValueCr: number;
  maximumLeverage: number;
  minimumEquityValueCr: number;
};

export type EvidenceRecord = {
  id: string;
  name: string;
  kind: string;
  status: string;
  assumptions: number;
  addedBy: string;
  addedAt: string;
};

export type ActivityRecord = {
  id: string;
  activity: string;
  user: string;
  timestamp: string;
  changedAssumption: string;
  analysisStatus: string;
  approvalStatus: string;
  category: "analysis" | "assumption" | "approval" | "evidence" | "valuation" | "diligence";
  oldValue?: string;
  newValue?: string;
};

export type FindingRecord = {
  id: string;
  category: DiligenceCategory;
  area: string;
  severity: FindingSeverity;
  description: string;
  status: FindingStatus;
  evidence: string;
  responsible: string;
  comments: string;
  resolutionNotes: string;
};

export type WorkspaceData = {
  deal: DealProfile;
  inputs: FinancialInputs;
  customerScenario: CustomerScenario;
  dcf: DcfAssumptions;
  simulator: SimulatorInputs;
  thresholds: FailureThresholds;
  evidence: EvidenceRecord[];
  activities: ActivityRecord[];
  findings: FindingRecord[];
  impactStatus: ApprovalStatus;
};

export const DEMO_DEAL: DealProfile = {
  company: "NovaTech Industries Pvt. Ltd.",
  dealType: "Sell-side M&A",
  status: "Active",
  owner: "A. Morgan",
  stage: "Material change review",
  industry: "Industrial technology",
  geography: "India",
  dealId: "NVT-2026-014",
  buyer: "Confidential buyer · demo",
  seller: "NovaTech shareholders · demo",
};

export const DEMO_FINANCIAL_INPUTS: FinancialInputs = {
  revenue: 140,
  ebitda: 21,
  debt: 45,
  netProfit: 9,
  cashFlow: 5,
  ebitdaMultiple: 8,
  cashAndOtherAdjustments: 10,
};

export const DEMO_CUSTOMER_SCENARIO: CustomerScenario = {
  customer: "Northstar Mobility",
  customerRevenueSharePct: 18,
  commitmentReductionPct: 20,
  confidencePct: 65,
  verificationStatus: "Pending · fictional source only",
};

export const DEMO_DCF: DcfAssumptions = {
  revenueGrowthPct: 8,
  taxRatePct: 25,
  depreciationPct: 2,
  capexPct: 3,
  workingCapitalPct: 1,
  waccPct: 12,
  terminalGrowthPct: 3,
};

export const DEMO_SIMULATOR: SimulatorInputs = {
  largestCustomerLossPct: 0,
  customerRevenueReductionPct: 20,
  rawMaterialCostIncreasePct: 0,
  marginCompressionPct: 0,
  workingCapitalDelayCr: 0,
  interestRateIncreasePct: 0,
  supplierDisruptionPct: 0,
  unexpectedOperatingExpensesCr: 0,
  debtIncreaseCr: 0,
};

export const DEMO_FAILURE_THRESHOLDS: FailureThresholds = {
  minimumEbitdaCr: 14,
  minimumEnterpriseValueCr: 112,
  maximumLeverage: 4,
  minimumEquityValueCr: 70,
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

export const DEMO_FINDINGS: FindingRecord[] = [
  {
    id: "customer-concentration",
    category: "Commercial",
    area: "Customer concentration",
    severity: "High",
    description: "One key account is modeled at 18% of revenue; renewal timing is a material diligence item.",
    status: "Open",
    evidence: DEMO_EVIDENCE.name,
    responsible: "A. Morgan",
    comments: "Confirm renewal timing and contractual minimums.",
    resolutionNotes: "",
  },
  {
    id: "revenue-quality",
    category: "Financial",
    area: "Revenue quality",
    severity: "Medium",
    description: "The customer commitment scenario may affect forward revenue visibility; contract terms remain unverified.",
    status: "In progress",
    evidence: DEMO_EVIDENCE.name,
    responsible: "A. Morgan",
    comments: "Demo scenario only; no customer contract reviewed.",
    resolutionNotes: "",
  },
  {
    id: "debt-cash-flow",
    category: "Financial",
    area: "Debt & cash flow",
    severity: "Medium",
    description: "Demo gross debt is ₹45 Cr against ₹5 Cr annual cash flow; confirm repayment profile in diligence.",
    status: "Open",
    evidence: "Demo financial assumptions",
    responsible: "A. Morgan",
    comments: "Repayment schedule not included in this demo.",
    resolutionNotes: "",
  },
  {
    id: "contract-terms",
    category: "Legal",
    area: "Customer contract terms",
    severity: "High",
    description: "Change-of-control and termination rights have not been independently reviewed.",
    status: "Open",
    evidence: "No verified legal documents",
    responsible: "Legal diligence lead",
    comments: "No legal opinion is represented here.",
    resolutionNotes: "",
  },
  {
    id: "operations",
    category: "Operational",
    area: "Supplier continuity",
    severity: "Low",
    description: "No operational interruption is included in the fictional demo scenario.",
    status: "Resolved",
    evidence: "Demo scenario note",
    responsible: "A. Morgan",
    comments: "Illustrative status only.",
    resolutionNotes: "No disruption modeled in the baseline.",
  },
];

export const DEMO_REPORTS = [
  { id: "deal-overview", title: "Executive deal summary", description: "Transaction profile, progress and headline metrics", updated: "Demo snapshot" },
  { id: "financial-analysis", title: "Financial analysis", description: "Operating performance, leverage and cash flow", updated: "Demo snapshot" },
  { id: "valuation-summary", title: "Valuation report", description: "DCF, illustrative multiples and sensitivity range", updated: "Demo snapshot" },
  { id: "change-impact", title: "Change impact report", description: "Customer event, assumptions and revised metrics", updated: "Demo snapshot" },
  { id: "diligence-findings", title: "Due diligence report", description: "Open items across financial, commercial, legal and operational areas", updated: "Demo snapshot" },
  { id: "risk-summary", title: "Risk assessment report", description: "Severity-weighted review items and approval status", updated: "Demo snapshot" },
  { id: "failure-simulation", title: "Deal failure simulation report", description: "Deterministic stress scenario and threshold breaches", updated: "Demo snapshot" },
] as const;

export const createDefaultWorkspace = (): WorkspaceData => ({
  deal: { ...DEMO_DEAL },
  inputs: { ...DEMO_FINANCIAL_INPUTS },
  customerScenario: { ...DEMO_CUSTOMER_SCENARIO },
  dcf: { ...DEMO_DCF },
  simulator: { ...DEMO_SIMULATOR },
  thresholds: { ...DEMO_FAILURE_THRESHOLDS },
  evidence: [{ ...DEMO_EVIDENCE }],
  activities: [],
  findings: DEMO_FINDINGS.map((finding) => ({ ...finding })),
  impactStatus: "Pending banker review",
});

export const formatCr = (value: number, digits = 1) =>
  `₹${Math.abs(value).toFixed(digits)} Cr`;

export const formatSignedCr = (value: number, digits = 1) =>
  `${value < 0 ? "−" : "+"}${formatCr(value, digits)}`;

export const safeNumber = (value: string, fallback: number, min = 0, max = 1_000_000) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
};