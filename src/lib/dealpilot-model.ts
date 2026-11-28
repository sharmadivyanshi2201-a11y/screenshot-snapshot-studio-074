import type {
  CustomerScenario,
  DcfAssumptions,
  FailureThresholds,
  FinancialInputs,
  SimulatorInputs,
} from "@/lib/dealpilot-data";

export type DerivedFinancials = FinancialInputs & {
  ebitdaMargin: number;
  enterpriseValue: number;
  equityValue: number;
  evRevenueMultiple: number;
};

export function deriveFinancials(inputs: FinancialInputs): DerivedFinancials {
  const ebitdaMargin = inputs.revenue > 0 ? (inputs.ebitda / inputs.revenue) * 100 : 0;
  const enterpriseValue = inputs.ebitda * inputs.ebitdaMultiple;
  return {
    ...inputs,
    ebitdaMargin,
    enterpriseValue,
    equityValue: enterpriseValue - inputs.debt + inputs.cashAndOtherAdjustments,
    evRevenueMultiple: inputs.revenue > 0 ? enterpriseValue / inputs.revenue : 0,
  };
}

export function calculateCustomerImpact(inputs: FinancialInputs, scenario: CustomerScenario) {
  const base = deriveFinancials(inputs);
  const revenueImpact = -inputs.revenue * (scenario.customerRevenueSharePct / 100) * (scenario.commitmentReductionPct / 100);
  const ebitdaImpact = revenueImpact * (base.ebitdaMargin / 100);
  const enterpriseValueImpact = ebitdaImpact * inputs.ebitdaMultiple;
  return {
    revenueImpact,
    ebitdaImpact,
    marginImpactPctPoints: base.ebitdaMargin - (base.revenue + revenueImpact > 0 ? ((base.ebitda + ebitdaImpact) / (base.revenue + revenueImpact)) * 100 : 0),
    enterpriseValueImpact,
    equityValueImpact: enterpriseValueImpact,
    revised: {
      revenue: base.revenue + revenueImpact,
      ebitda: base.ebitda + ebitdaImpact,
      ebitdaMargin: base.revenue + revenueImpact > 0 ? ((base.ebitda + ebitdaImpact) / (base.revenue + revenueImpact)) * 100 : 0,
      enterpriseValue: base.enterpriseValue + enterpriseValueImpact,
      equityValue: base.equityValue + enterpriseValueImpact,
    },
  };
}

export type DcfProjection = {
  year: number;
  revenue: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  taxes: number;
  capex: number;
  workingCapitalChange: number;
  freeCashFlow: number;
  presentValue: number;
};

export type DcfResult = {
  valid: boolean;
  error?: string;
  projections: DcfProjection[];
  terminalValue: number;
  presentValueOfForecasts: number;
  presentValueOfTerminalValue: number;
  enterpriseValue: number;
  equityValue: number;
};

export function calculateDcf(inputs: FinancialInputs, assumptions: DcfAssumptions): DcfResult {
  const wacc = assumptions.waccPct / 100;
  const terminalGrowth = assumptions.terminalGrowthPct / 100;
  if (wacc <= terminalGrowth || wacc <= 0) {
    return { valid: false, error: "WACC must be greater than the terminal growth rate.", projections: [], terminalValue: 0, presentValueOfForecasts: 0, presentValueOfTerminalValue: 0, enterpriseValue: 0, equityValue: 0 };
  }

  const margin = inputs.revenue > 0 ? inputs.ebitda / inputs.revenue : 0;
  const projections: DcfProjection[] = [];
  let revenue = inputs.revenue;
  for (let year = 1; year <= 5; year += 1) {
    revenue *= 1 + assumptions.revenueGrowthPct / 100;
    const ebitda = revenue * margin;
    const depreciation = revenue * assumptions.depreciationPct / 100;
    const ebit = ebitda - depreciation;
    const taxes = Math.max(0, ebit) * assumptions.taxRatePct / 100;
    const capex = revenue * assumptions.capexPct / 100;
    const workingCapitalChange = revenue * assumptions.workingCapitalPct / 100;
    const freeCashFlow = ebitda - taxes - capex - workingCapitalChange;
    projections.push({ year, revenue, ebitda, depreciation, ebit, taxes, capex, workingCapitalChange, freeCashFlow, presentValue: freeCashFlow / (1 + wacc) ** year });
  }

  const lastProjection = projections.at(-1);
  if (!lastProjection) {
    return { valid: false, error: "The DCF forecast is unavailable.", projections, terminalValue: 0, presentValueOfForecasts: 0, presentValueOfTerminalValue: 0, enterpriseValue: 0, equityValue: 0 };
  }
  const terminalValue = (lastProjection.freeCashFlow * (1 + terminalGrowth)) / (wacc - terminalGrowth);
  const presentValueOfForecasts = projections.reduce((total, row) => total + row.presentValue, 0);
  const presentValueOfTerminalValue = terminalValue / (1 + wacc) ** 5;
  const enterpriseValue = presentValueOfForecasts + presentValueOfTerminalValue;
  return {
    valid: true,
    projections,
    terminalValue,
    presentValueOfForecasts,
    presentValueOfTerminalValue,
    enterpriseValue,
    equityValue: enterpriseValue - inputs.debt + inputs.cashAndOtherAdjustments,
  };
}

export type StressResult = {
  revenue: number;
  ebitda: number;
  ebitdaMargin: number;
  cashFlow: number;
  debt: number;
  enterpriseValue: number;
  equityValue: number;
  leverage: number;
  customerRevenueLoss: number;
  supplierRevenueLoss: number;
  materialCostIncrease: number;
  interestCostIncrease: number;
  breachedThresholds: string[];
  mitigations: string[];
  riskContributions: Array<{ label: string; value: number }>;
};

export function calculateStressCase(
  inputs: FinancialInputs,
  scenario: CustomerScenario,
  stress: SimulatorInputs,
  thresholds: FailureThresholds,
): StressResult {
  const base = deriveFinancials(inputs);
  const customerRevenueLoss = inputs.revenue * (scenario.customerRevenueSharePct / 100) * (stress.largestCustomerLossPct / 100)
    + inputs.revenue * (stress.customerRevenueReductionPct / 100);
  const supplierRevenueLoss = inputs.revenue * stress.supplierDisruptionPct / 100;
  const revenue = Math.max(0, inputs.revenue - customerRevenueLoss - supplierRevenueLoss);
  const marginAfterCompression = Math.max(0, base.ebitdaMargin - stress.marginCompressionPct);
  const materialCostIncrease = inputs.revenue * 0.45 * stress.rawMaterialCostIncreasePct / 100;
  const ebitda = Math.max(0, revenue * marginAfterCompression / 100 - materialCostIncrease - stress.unexpectedOperatingExpensesCr);
  const debt = inputs.debt + stress.workingCapitalDelayCr + stress.debtIncreaseCr;
  const interestCostIncrease = debt * stress.interestRateIncreasePct / 100;
  const cashFlow = inputs.cashFlow + (ebitda - inputs.ebitda) - stress.workingCapitalDelayCr - interestCostIncrease;
  const enterpriseValue = ebitda * inputs.ebitdaMultiple;
  const equityValue = enterpriseValue - debt + inputs.cashAndOtherAdjustments;
  const ebitdaMargin = revenue > 0 ? ebitda / revenue * 100 : 0;
  const leverage = ebitda > 0 ? debt / ebitda : Number.POSITIVE_INFINITY;
  const breachedThresholds: string[] = [];
  if (ebitda < thresholds.minimumEbitdaCr) breachedThresholds.push("Minimum EBITDA");
  if (enterpriseValue < thresholds.minimumEnterpriseValueCr) breachedThresholds.push("Minimum enterprise value");
  if (leverage > thresholds.maximumLeverage) breachedThresholds.push("Maximum leverage");
  if (equityValue < thresholds.minimumEquityValueCr) breachedThresholds.push("Minimum equity value");

  const riskContributions = [
    { label: "Customer revenue reduction", value: customerRevenueLoss * base.ebitdaMargin / 100 },
    { label: "Supplier disruption", value: supplierRevenueLoss * base.ebitdaMargin / 100 },
    { label: "Raw material cost increase", value: materialCostIncrease },
    { label: "Margin compression", value: revenue * stress.marginCompressionPct / 100 },
    { label: "Unexpected operating expenses", value: stress.unexpectedOperatingExpensesCr },
    { label: "Working capital & debt", value: stress.workingCapitalDelayCr + stress.debtIncreaseCr },
    { label: "Interest rate increase", value: interestCostIncrease },
  ].filter((item) => item.value > 0).sort((a, b) => b.value - a.value);

  const mitigations: string[] = [];
  if (customerRevenueLoss > 0) mitigations.push("Secure minimum-volume renewal terms and reduce customer concentration.");
  if (supplierRevenueLoss > 0 || materialCostIncrease > 0) mitigations.push("Qualify alternative suppliers and add cost pass-through protections.");
  if (stress.workingCapitalDelayCr > 0 || stress.debtIncreaseCr > 0 || stress.interestRateIncreasePct > 0) mitigations.push("Review liquidity headroom, covenant capacity, and debt repricing protections.");
  if (stress.marginCompressionPct > 0 || stress.unexpectedOperatingExpensesCr > 0) mitigations.push("Validate fixed-cost flexibility and identify contingency cost actions.");
  if (!mitigations.length) mitigations.push("No stress beyond the selected customer scenario; monitor open diligence items.");

  return { revenue, ebitda, ebitdaMargin, cashFlow, debt, enterpriseValue, equityValue, leverage, customerRevenueLoss, supplierRevenueLoss, materialCostIncrease, interestCostIncrease, breachedThresholds, mitigations, riskContributions };
}

export function getDemoAssumptions(inputs: FinancialInputs, scenario: CustomerScenario) {
  const derived = deriveFinancials(inputs);
  return [
    { id: "revenue", label: "Annual revenue baseline", value: `₹${inputs.revenue.toFixed(1)} Cr`, type: "Editable demo input" },
    { id: "ebitda", label: "Annual EBITDA baseline", value: `₹${inputs.ebitda.toFixed(1)} Cr`, type: "Editable demo input" },
    { id: "margin", label: "EBITDA margin", value: `${derived.ebitdaMargin.toFixed(1)}%`, type: "Calculated · EBITDA ÷ revenue" },
    { id: "multiple", label: "Enterprise value multiple", value: `${inputs.ebitdaMultiple.toFixed(1)}× EBITDA`, type: "Manual demo assumption" },
    { id: "debt", label: "Gross debt", value: `₹${inputs.debt.toFixed(1)} Cr`, type: "Editable demo input" },
    { id: "bridge", label: "Cash & other equity bridge", value: `+₹${inputs.cashAndOtherAdjustments.toFixed(1)} Cr`, type: "Manual demo assumption" },
    { id: "customer-share", label: "Key customer revenue exposure", value: `${scenario.customerRevenueSharePct.toFixed(1)}%`, type: "Scenario assumption" },
    { id: "customer-reduction", label: "Potential commitment reduction", value: `${scenario.commitmentReductionPct.toFixed(1)}%`, type: "Scenario assumption" },
    { id: "cash-flow", label: "Annual cash flow", value: `₹${inputs.cashFlow.toFixed(1)} Cr`, type: "Editable demo input" },
  ];
}