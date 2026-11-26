import { createFileRoute } from "@tanstack/react-router";
import { ValuationPage } from "@/components/dealpilot/workspace-pages";

export const Route = createFileRoute("/valuation")({
  head: () => ({
    meta: [
      { title: "Valuation Studio | DealPilot AI" },
      { name: "description", content: "Review NovaTech's fictional operating metrics, enterprise value, equity bridge and disclosed valuation assumptions." },
      { property: "og:title", content: "Valuation Studio | DealPilot AI" },
      { property: "og:description", content: "Review NovaTech's fictional operating metrics, enterprise value, equity bridge and disclosed valuation assumptions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ValuationPage,
});