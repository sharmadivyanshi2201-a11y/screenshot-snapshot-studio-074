import { describe, expect, it } from "vitest";

import { DEMO_ASSUMPTIONS, DEMO_EVIDENCE, DEMO_FINANCIALS, DEMO_IMPACT } from "@/lib/dealpilot-data";

describe("NovaTech fictional demo assumptions", () => {
  it.each([
    ["revenue", 140],
    ["ebitda", 21],
    ["ebitda margin", 15],
    ["debt", 45],
    ["net profit", 9],
    ["cash flow", 5],
    ["enterprise value", 168],
    ["equity value", 133],
  ] as const)("keeps the requested %s at ₹%s Cr", (_label, expected) => {
    const requestedValues = [
      DEMO_FINANCIALS.revenue,
      DEMO_FINANCIALS.ebitda,
      DEMO_FINANCIALS.ebitdaMargin,
      DEMO_FINANCIALS.debt,
      DEMO_FINANCIALS.netProfit,
      DEMO_FINANCIALS.cashFlow,
      DEMO_FINANCIALS.enterpriseValue,
      DEMO_FINANCIALS.equityValue,
    ];
    expect(requestedValues).toContain(expected);
  });

  it("links exactly nine assumptions to the initial demo evidence", () => {
    expect(DEMO_EVIDENCE.assumptions).toBe(9);
    expect(DEMO_ASSUMPTIONS).toHaveLength(9);
  });

  it("uses a consistent enterprise value calculation", () => {
    expect(DEMO_FINANCIALS.ebitda * DEMO_FINANCIALS.ebitdaMultiple).toBe(168);
  });

  it("uses a consistent equity value bridge", () => {
    expect(DEMO_FINANCIALS.enterpriseValue - DEMO_FINANCIALS.debt + DEMO_FINANCIALS.cashAndOtherAdjustments).toBe(133);
  });

  it("keeps the customer event explicitly pending banker review", () => {
    expect(DEMO_IMPACT.approval).toBe("Pending banker review");
  });
});