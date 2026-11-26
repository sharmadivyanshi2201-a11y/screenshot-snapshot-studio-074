import { createFileRoute } from "@tanstack/react-router";
import { ChangeImpactPage } from "@/components/dealpilot/workspace-pages";

export const Route = createFileRoute("/change-impact")({
  head: () => ({
    meta: [
      { title: "Change Impact | DealPilot AI" },
      { name: "description", content: "Trace the fictional NovaTech customer event through revenue, EBITDA, valuation sensitivity and banker review." },
      { property: "og:title", content: "Change Impact | DealPilot AI" },
      { property: "og:description", content: "Trace the fictional NovaTech customer event through revenue, EBITDA, valuation sensitivity and banker review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChangeImpactPage,
});