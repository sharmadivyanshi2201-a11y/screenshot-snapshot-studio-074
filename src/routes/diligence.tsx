import { createFileRoute } from "@tanstack/react-router";
import { DiligencePage } from "@/components/dealpilot/workspace-pages";

export const Route = createFileRoute("/diligence")({
  head: () => ({
    meta: [
      { title: "Diligence Workspace | DealPilot AI" },
      { name: "description", content: "Review fictional financial, business, customer concentration and operational diligence findings for NovaTech." },
      { property: "og:title", content: "Diligence Workspace | DealPilot AI" },
      { property: "og:description", content: "Review fictional financial, business, customer concentration and operational diligence findings for NovaTech." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiligencePage,
});