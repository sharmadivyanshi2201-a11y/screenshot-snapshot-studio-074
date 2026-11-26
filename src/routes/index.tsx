import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceHome } from "@/components/dealpilot/workspace-pages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deal Workspace | DealPilot AI" },
      { name: "description", content: "Review NovaTech deal metrics, fictional source evidence and a material customer impact scenario." },
      { property: "og:title", content: "Deal Workspace | DealPilot AI" },
      { property: "og:description", content: "Review NovaTech deal metrics, fictional source evidence and a material customer impact scenario." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkspaceHome,
});