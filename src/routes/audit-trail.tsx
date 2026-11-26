import { createFileRoute } from "@tanstack/react-router";
import { AuditTrailPage } from "@/components/dealpilot/workspace-pages";

export const Route = createFileRoute("/audit-trail")({
  head: () => ({
    meta: [
      { title: "Audit Trail | DealPilot AI" },
      { name: "description", content: "Review fictional NovaTech analysis activity, assumptions, timestamps and banker approval status." },
      { property: "og:title", content: "Audit Trail | DealPilot AI" },
      { property: "og:description", content: "Review fictional NovaTech analysis activity, assumptions, timestamps and banker approval status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditTrailPage,
});