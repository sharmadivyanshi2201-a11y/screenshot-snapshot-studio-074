import { createFileRoute } from "@tanstack/react-router";
import { DependencyMapPage } from "@/components/dealpilot/workspace-pages";

export const Route = createFileRoute("/dependency-map")({
  head: () => ({
    meta: [
      { title: "Dependency Map | DealPilot AI" },
      { name: "description", content: "Explore how a fictional customer event can flow through revenue, EBITDA, cash flow, debt and NovaTech valuation." },
      { property: "og:title", content: "Dependency Map | DealPilot AI" },
      { property: "og:description", content: "Explore how a fictional customer event can flow through revenue, EBITDA, cash flow, debt and NovaTech valuation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DependencyMapPage,
});