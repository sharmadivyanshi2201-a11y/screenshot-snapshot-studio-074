import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/components/dealpilot/workspace-pages";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports | DealPilot AI" },
      { name: "description", content: "Preview and download NovaTech's fictional deal, financial, impact, diligence, risk and valuation reports." },
      { property: "og:title", content: "Reports | DealPilot AI" },
      { property: "og:description", content: "Preview and download NovaTech's fictional deal, financial, impact, diligence, risk and valuation reports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});