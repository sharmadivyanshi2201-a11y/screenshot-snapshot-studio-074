import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleAlert,
  FileText,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
  Upload,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  DEMO_ASSUMPTIONS,
  DEMO_DEAL,
  DEMO_EVIDENCE,
  DEMO_FINDINGS,
  DEMO_FINANCIALS,
  DEMO_IMPACT,
  DEMO_REPORTS,
  formatCr,
  formatSignedCr,
  reportText,
  type EvidenceRecord,
  type FindingStatus,
} from "@/lib/dealpilot-data";
import { useWorkspace } from "@/components/dealpilot/workspace-context";

type PageHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

function PageHeading({ eyebrow, title, description, children }: PageHeadingProps) {
  return (
    <div className="page-heading">
      <div className="min-w-0">
        <div className="eyebrow page-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="page-heading-actions">{children}</div>}
    </div>
  );
}

function PanelTitle({ title, detail, trailing }: { title: string; detail?: string; trailing?: React.ReactNode }) {
  return (
    <div className="panel-title-row">
      <div className="min-w-0">
        <h2>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {trailing}
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
  accent = "blue",
  icon,
}: {
  label: string;
  value: string;
  note: string;
  accent?: "blue" | "teal" | "purple" | "amber" | "red";
  icon?: React.ReactNode;
}) {
  return (
    <div className={cn("metric-card", `metric-card-${accent}`)}>
      <div className="metric-card-top">
        <span>{label}</span>
        {icon && <span className="metric-icon">{icon}</span>}
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "positive" | "warning" | "risk" | "blue" }) {
  const tones = {
    neutral: "status-neutral",
    positive: "status-positive",
    warning: "status-warning",
    risk: "status-risk",
    blue: "status-blue",
  };
  return <Badge variant="outline" className={cn("status-badge", tones[tone])}>{children}</Badge>;
}

function AssumptionsDialog({
  evidence,
  open,
  onOpenChange,
}: {
  evidence: EvidenceRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="assumptions-dialog">
        <DialogHeader>
          <div className="dialog-kicker"><FileText size={14} /> SOURCE EVIDENCE</div>
          <DialogTitle>{evidence?.name ?? "Evidence assumptions"}</DialogTitle>
          <DialogDescription>
            {evidence?.status ?? "Fictional demo source · not independently verified"}
          </DialogDescription>
        </DialogHeader>
        <div className="evidence-detail-strip">
          <span><small>Source type</small><strong>{evidence?.kind ?? "Fictional source exhibit"}</strong></span>
          <span><small>Linked assumptions</small><strong>{evidence?.assumptions ?? 0}</strong></span>
          <span><small>Added by</small><strong>{evidence?.addedBy ?? "A. Morgan"}</strong></span>
        </div>
        {evidence?.assumptions ? (
          <div className="assumption-list">
            {DEMO_ASSUMPTIONS.map((assumption, index) => (
              <div className="assumption-row" key={assumption.id}>
                <span className="assumption-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="assumption-copy"><strong>{assumption.label}</strong><small>{assumption.type}</small></span>
                <span className="assumption-value">{assumption.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-assumptions"><CircleAlert size={17} /><span>No assumptions are linked to this uploaded file.</span></div>
        )}
        <div className="dialog-disclaimer"><LockKeyhole size={14} /> Demo data only. No document contents were extracted or verified.</div>
      </DialogContent>
    </Dialog>
  );
}

export function WorkspaceHome() {
  const { evidence, impactStatus, resetDemo, loadDemo, uploadEvidence } = useWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord | null>(null);
  const openImpacts = impactStatus === "Pending banker review" ? 1 : 0;

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) uploadEvidence(file.name);
    event.currentTarget.value = "";
  };

  return (
    <>
      <PageHeading
        eyebrow="ACTIVE DEMO DEAL"
        title="Deal Workspace"
        description="Trace a material customer event from source evidence through valuation, risk and reports."
      >
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
          aria-label="Choose evidence document"
          onChange={handleFileSelection}
        />
        <Button variant="outline" className="action-button" onClick={() => inputRef.current?.click()}>
          <Upload size={15} /> Upload Evidence
        </Button>
        <Button variant="secondary" className="action-button" onClick={loadDemo}>
          <BadgeCheck size={15} /> Use Demo Notice
        </Button>
        <Button variant="ghost" size="icon" className="reset-button" aria-label="Reset demo workspace" title="Reset demo workspace" onClick={resetDemo}>
          <RotateCcw size={16} />
        </Button>
      </PageHeading>

      <div className="fictional-banner"><SparklesIcon /> <span><strong>Fictional demo assumptions.</strong> Source evidence, financials and findings shown here are not independently verified.</span></div>

      <section className="deal-overview">
        <div className="deal-overview-main">
          <div className="company-symbol">NT</div>
          <div className="min-w-0">
            <div className="company-title-line"><h2>{DEMO_DEAL.company}</h2><StatusBadge tone="positive">{DEMO_DEAL.status}</StatusBadge></div>
            <div className="deal-subline"><span>{DEMO_DEAL.dealType}</span><span className="separator-dot" /><span>{DEMO_DEAL.stage}</span></div>
          </div>
        </div>
        <div className="deal-overview-meta">
          <div><span>DEAL OWNER</span><strong>{DEMO_DEAL.owner}</strong></div>
          <div><span>DEAL ID</span><strong>{DEMO_DEAL.dealId}</strong></div>
          <div className="deal-value"><span>ENTERPRISE VALUE</span><strong>₹168 Cr</strong></div>
        </div>
      </section>

      <section className="metric-grid" aria-label="Key deal metrics">
        <MetricCard label="Open impacts" value={String(openImpacts)} note={openImpacts ? "Banker approval required" : "All scenarios reviewed"} accent="purple" icon={<ActivityMark />} />
        <MetricCard label="Revenue" value="₹140 Cr" note="Fictional annual baseline" accent="blue" icon={<ArrowUpRight size={16} />} />
        <MetricCard label="EBITDA margin" value="15%" note="Calculated · ₹21 Cr / ₹140 Cr" accent="teal" icon={<ActivityMark />} />
        <MetricCard label="Equity value" value="₹133 Cr" note="Includes demo bridge assumptions" accent="amber" icon={<Wallet size={16} />} />
      </section>

      <div className="workspace-columns home-columns">
        <section className="workspace-panel evidence-panel">
          <PanelTitle
            title="Source evidence"
            detail="Materials linked to the active deal"
            trailing={<StatusBadge tone="blue">{evidence.length} item{evidence.length === 1 ? "" : "s"}</StatusBadge>}
          />
          <div className="evidence-table-head"><span>DOCUMENT</span><span>STATUS</span><span>ASSUMPTIONS</span><span /></div>
          <div className="evidence-rows">
            {evidence.map((item) => (
              <div className="evidence-row" key={item.id}>
                <div className="evidence-name-cell">
                  <span className="file-icon"><FileText size={16} /></span>
                  <span className="evidence-name-wrap"><strong>{item.name}</strong><small>{item.kind} · {item.addedAt}</small></span>
                </div>
                <div><StatusBadge tone={item.assumptions ? "warning" : "neutral"}>{item.status}</StatusBadge></div>
                <span className="assumption-count">{item.assumptions ? `${item.assumptions} linked` : "None"}</span>
                <Button variant="ghost" size="sm" className="row-action" onClick={() => setSelectedEvidence(item)}>
                  View {item.assumptions ? "assumptions" : "details"}<ChevronRight size={14} />
                </Button>
              </div>
            ))}
          </div>
          <div className="panel-footnote"><LockKeyhole size={13} /> Uploading a file records its selection only; no verification or extraction is performed.</div>
        </section>

        <section className="workspace-panel event-panel">
          <PanelTitle title="Material change to review" detail="Customer event · scenario only" trailing={<StatusBadge tone="risk">{DEMO_IMPACT.risk} risk</StatusBadge>} />
          <div className="event-customer-row"><span className="customer-avatar">NM</span><span><strong>{DEMO_IMPACT.customer}</strong><small>{DEMO_IMPACT.title}</small></span></div>
          <p className="event-summary">{DEMO_IMPACT.event}</p>
          <div className="event-impact-row">
            <span><small>Revenue</small><strong className="negative-value">−₹5.0 Cr</strong></span>
            <span><small>EBITDA</small><strong className="negative-value">−₹0.75 Cr</strong></span>
            <span><small>EV sensitivity</small><strong className="negative-value">−₹6.0 Cr</strong></span>
          </div>
          <div className="event-review-row">
            <StatusBadge tone={impactStatus === "Approved" ? "positive" : "warning"}>{impactStatus}</StatusBadge>
            <Button asChild variant="ghost" size="sm" className="row-action"><Link to="/change-impact">Review impact <ArrowRight size={14} /></Link></Button>
          </div>
        </section>
      </div>

      <section className="workspace-panel activity-preview">
        <PanelTitle title="Deal snapshot" detail="Current demo assumptions" trailing={<Link to="/audit-trail" className="text-link">View audit trail <ArrowRight size={14} /></Link>} />
        <div className="snapshot-grid">
          <span><small>EBITDA</small><strong>₹21 Cr</strong></span>
          <span><small>Debt</small><strong>₹45 Cr</strong></span>
          <span><small>Net profit</small><strong>₹9 Cr</strong></span>
          <span><small>Cash flow</small><strong>₹5 Cr</strong></span>
          <span><small>Evidence assumptions</small><strong>9 <small className="inline-note">· demo only</small></strong></span>
        </div>
      </section>

      <AssumptionsDialog evidence={selectedEvidence} open={selectedEvidence !== null} onOpenChange={(open) => !open && setSelectedEvidence(null)} />
    </>
  );
}

function SparklesIcon() {
  return <span className="banner-icon"><CircleAlert size={15} /></span>;
}

function ActivityMark() {
  return <span className="activity-mark"><span /><span /><span /></span>;
}

export function ChangeImpactPage() {
  const { impactStatus, approveImpact } = useWorkspace();
  const [showAssumptions, setShowAssumptions] = useState(false);
  const evidenceItem = DEMO_EVIDENCE;

  return (
    <>
      <PageHeading eyebrow="MATERIAL CHANGE REVIEW" title="Change Impact" description="Follow the customer event from evidence through financial sensitivity and banker approval.">
        <Button variant="outline" className="action-button" onClick={() => setShowAssumptions(true)}><FileText size={15} /> Source assumptions</Button>
      </PageHeading>

      <section className="impact-hero-panel">
        <div className="impact-hero-top">
          <div className="impact-event-heading">
            <span className="impact-alert-icon"><ShieldAlert size={20} /></span>
            <div><div className="eyebrow">IDENTIFIED BUSINESS EVENT</div><h2>{DEMO_IMPACT.title}</h2></div>
          </div>
          <div className="impact-status-stack"><StatusBadge tone="risk">{DEMO_IMPACT.risk} risk</StatusBadge><StatusBadge tone={impactStatus === "Approved" ? "positive" : "warning"}>{impactStatus}</StatusBadge></div>
        </div>
        <p className="impact-event-description">{DEMO_IMPACT.event}</p>
        <div className="impact-source-line"><FileText size={15} /><span><strong>{DEMO_IMPACT.source}</strong><small>Fictional source exhibit · not independently verified</small></span><Button variant="ghost" size="sm" className="row-action" onClick={() => setShowAssumptions(true)}>View evidence <ChevronRight size={14} /></Button></div>
      </section>

      <div className="impact-metric-grid">
        <MetricCard label="Revenue impact" value="−₹5.0 Cr" note="Potential annual revenue sensitivity" accent="red" icon={<ArrowDownToLine size={16} />} />
        <MetricCard label="EBITDA impact" value="−₹0.75 Cr" note="15% demo margin applied" accent="amber" icon={<ArrowDownToLine size={16} />} />
        <MetricCard label="Enterprise value" value="−₹6.0 Cr" note="8.0× EBITDA scenario sensitivity" accent="purple" icon={<ArrowDownToLine size={16} />} />
        <MetricCard label="Revenue exposure" value="18%" note="Assumed share from key customer" accent="blue" icon={<ActivityMark />} />
      </div>

      <div className="workspace-columns impact-columns">
        <section className="workspace-panel impact-analysis-panel">
          <PanelTitle title="Financial consequence" detail="Illustrative downside scenario · not a forecast" />
          <div className="impact-waterfall">
            <div className="waterfall-step"><span className="waterfall-number">01</span><span className="waterfall-copy"><strong>Customer commitment</strong><small>20% potential reduction under review</small></span><span className="waterfall-value">18% exposure</span></div>
            <div className="waterfall-connector"><span /></div>
            <div className="waterfall-step"><span className="waterfall-number">02</span><span className="waterfall-copy"><strong>Revenue sensitivity</strong><small>₹140 Cr × 18% × 20%</small></span><span className="waterfall-value negative-value">−₹5.0 Cr</span></div>
            <div className="waterfall-connector"><span /></div>
            <div className="waterfall-step"><span className="waterfall-number">03</span><span className="waterfall-copy"><strong>EBITDA sensitivity</strong><small>Revenue impact × 15% margin</small></span><span className="waterfall-value negative-value">−₹0.75 Cr</span></div>
            <div className="waterfall-connector"><span /></div>
            <div className="waterfall-step waterfall-step-final"><span className="waterfall-number">04</span><span className="waterfall-copy"><strong>Enterprise value sensitivity</strong><small>EBITDA impact × 8.0× demo multiple</small></span><span className="waterfall-value negative-value">−₹6.0 Cr</span></div>
          </div>
        </section>

        <section className="workspace-panel impact-review-panel">
          <PanelTitle title="Review & approval" detail="Banker review is required before treating this scenario as approved." />
          <div className="review-checklist">
            <div><span className="review-check-icon"><Check size={13} /></span><span><strong>Source attached</strong><small>Fictional exhibit linked to the scenario</small></span></div>
            <div><span className="review-check-icon"><Check size={13} /></span><span><strong>Assumptions disclosed</strong><small>Five scenario inputs summarized below</small></span></div>
            <div><span className="review-pending-icon"><CircleAlert size={13} /></span><span><strong>Independent verification</strong><small>Not performed for this demo</small></span></div>
          </div>
          <div className="review-approval-box">
            <span><small>CURRENT STATUS</small><strong>{impactStatus}</strong></span>
            <Button variant={impactStatus === "Approved" ? "secondary" : "default"} disabled={impactStatus === "Approved"} onClick={approveImpact}>
              {impactStatus === "Approved" ? <><Check size={15} /> Approved</> : <>Approve scenario <ArrowRight size={15} /></>}
            </Button>
          </div>
          <p className="approval-note">Approval updates the review trail only; base financials remain unchanged.</p>
        </section>
      </div>

      <section className="workspace-panel assumptions-summary-panel">
        <PanelTitle title="Scenario assumptions" detail="Inputs behind the illustrative financial impact" trailing={<StatusBadge tone="neutral">5 assumptions</StatusBadge>} />
        <div className="scenario-assumption-grid">
          {DEMO_IMPACT.assumptions.map((assumption, index) => (
            <div className="scenario-assumption" key={assumption}><span>{String(index + 1).padStart(2, "0")}</span><p>{assumption}</p></div>
          ))}
        </div>
      </section>

      <AssumptionsDialog evidence={evidenceItem} open={showAssumptions} onOpenChange={setShowAssumptions} />
    </>
  );
}

const valuationChartData = [
  { metric: "Revenue", amount: DEMO_FINANCIALS.revenue },
  { metric: "EBITDA", amount: DEMO_FINANCIALS.ebitda },
  { metric: "Net profit", amount: DEMO_FINANCIALS.netProfit },
  { metric: "Cash flow", amount: DEMO_FINANCIALS.cashFlow },
];

export function ValuationPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const valuationMetrics = [
    { label: "Enterprise value", value: "₹168 Cr", note: "8.0× demo EBITDA", accent: "blue" as const },
    { label: "Equity value", value: "₹133 Cr", note: "After debt & bridge", accent: "teal" as const },
    { label: "Revenue", value: "₹140 Cr", note: "Annual baseline", accent: "purple" as const },
    { label: "EBITDA", value: "₹21 Cr", note: "15% margin", accent: "amber" as const },
    { label: "EBITDA margin", value: "15%", note: "Calculated", accent: "teal" as const },
    { label: "Gross debt", value: "₹45 Cr", note: "Demo financial input", accent: "red" as const },
    { label: "Cash flow", value: "₹5 Cr", note: "Annual demo input", accent: "blue" as const },
    { label: "Net profit", value: "₹9 Cr", note: "Annual demo input", accent: "purple" as const },
  ];

  return (
    <>
      <PageHeading eyebrow="FINANCIAL ANALYSIS" title="Valuation Studio" description="Review operating performance, valuation assumptions and the equity bridge for NovaTech.">
        <StatusBadge tone="neutral">Fictional demo assumptions</StatusBadge>
      </PageHeading>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="valuation-tabs">
        <TabsList className="section-tabs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
          <TabsTrigger value="scenario">Scenario impact</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="tab-content">
          <section className="valuation-metric-grid" aria-label="Valuation metrics">
            {valuationMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
          </section>
          <div className="workspace-columns valuation-columns">
            <section className="workspace-panel valuation-chart-panel">
              <PanelTitle title="Operating performance" detail="Annual demo financials · ₹ Cr" trailing={<span className="chart-legend"><span /> FY demo</span>} />
              <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valuationChartData} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}>
                    <CartesianGrid vertical={false} className="chart-grid" />
                    <XAxis dataKey="metric" axisLine={false} tickLine={false} tickMargin={12} />
                    <YAxis axisLine={false} tickLine={false} tickMargin={10} tickFormatter={(value) => `₹${value}`} />
                    <ChartTooltip formatter={(value) => [`₹${value} Cr`, "Demo amount"]} />
                    <Bar dataKey="amount" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} maxBarSize={52} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-disclaimer">All figures are illustrative inputs; no external financial data is connected.</div>
            </section>

            <section className="workspace-panel valuation-bridge-panel">
              <PanelTitle title="Equity value bridge" detail="Enterprise value to equity value · ₹ Cr" />
              <div className="bridge-rows">
                <div><span>Enterprise value</span><strong>₹168 Cr</strong></div>
                <div><span>Less · gross debt</span><strong className="negative-value">−₹45 Cr</strong></div>
                <div><span>Add · cash & other adjustment</span><strong className="positive-value">+₹10 Cr</strong></div>
                <div className="bridge-total"><span>Equity value</span><strong>₹133 Cr</strong></div>
              </div>
              <div className="bridge-equation">₹168 Cr − ₹45 Cr + ₹10 Cr = <strong>₹133 Cr</strong></div>
              <div className="bridge-note"><CircleAlert size={14} /> The +₹10 Cr bridge is a manual fictional assumption, not a sourced cash balance.</div>
            </section>
          </div>
          <section className="workspace-panel valuation-assumptions-panel">
            <PanelTitle title="Key valuation assumptions" detail="Calculated values are separated from manually entered demo inputs" trailing={<Button variant="ghost" size="sm" className="row-action" onClick={() => setActiveTab("assumptions")}>Full assumptions <ArrowRight size={14} /></Button>} />
            <AssumptionTable compact />
          </section>
        </TabsContent>

        <TabsContent value="assumptions" className="tab-content">
          <section className="workspace-panel full-assumptions-panel">
            <PanelTitle title="Valuation assumptions" detail="Nine disclosed demo inputs and derived values" trailing={<StatusBadge tone="blue">9 linked assumptions</StatusBadge>} />
            <AssumptionTable />
            <div className="valuation-formula-note"><span className="formula-badge">CALCULATION</span><span>Enterprise value = EBITDA × 8.0× multiple. Equity value = enterprise value − debt + cash & other bridge.</span></div>
          </section>
        </TabsContent>

        <TabsContent value="scenario" className="tab-content">
          <div className="scenario-intro"><span className="eyebrow">CHANGE IMPACT SENSITIVITY</span><p>Illustrative downside scenario from a fictional customer commitment review. It is not included in the current base valuation.</p><Button asChild variant="outline" size="sm"><Link to="/change-impact">Open impact review <ArrowRight size={14} /></Link></Button></div>
          <section className="impact-metric-grid scenario-metric-grid">
            <MetricCard label="Revenue sensitivity" value="−₹5.0 Cr" note="18% exposure × 20% reduction" accent="red" />
            <MetricCard label="EBITDA sensitivity" value="−₹0.75 Cr" note="15% demo margin" accent="amber" />
            <MetricCard label="EV sensitivity" value="−₹6.0 Cr" note="8.0× EBITDA multiple" accent="purple" />
            <MetricCard label="Base EV" value="₹168 Cr" note="Unchanged until banker action" accent="blue" />
          </section>
        </TabsContent>
      </Tabs>
    </>
  );
}

function AssumptionTable({ compact = false }: { compact?: boolean }) {
  return (
    <div className="table-scroll">
      <table className="data-table assumptions-table">
        <thead><tr><th>ASSUMPTION</th><th>VALUE</th><th>CLASSIFICATION</th><th>CALCULATION / SOURCE</th></tr></thead>
        <tbody>
          {DEMO_ASSUMPTIONS.slice(0, compact ? 5 : undefined).map((assumption) => (
            <tr key={assumption.id}>
              <td><strong>{assumption.label}</strong></td>
              <td className="table-value">{assumption.value}</td>
              <td><StatusBadge tone={assumption.type.startsWith("Calculated") ? "positive" : assumption.type.startsWith("Manual") || assumption.type.startsWith("Scenario") ? "warning" : "neutral"}>{assumption.type.startsWith("Calculated") ? "Calculated" : assumption.type.startsWith("Manual") || assumption.type.startsWith("Scenario") ? "Manual / scenario" : "Demo input"}</StatusBadge></td>
              <td className="table-muted">{assumption.type}</td>
            </tr>
          ))}
          {!compact && (
            <>
              <tr><td><strong>Enterprise value</strong></td><td className="table-value">₹168 Cr</td><td><StatusBadge tone="positive">Calculated</StatusBadge></td><td className="table-muted">₹21 Cr EBITDA × 8.0×</td></tr>
              <tr><td><strong>Equity value</strong></td><td className="table-value">₹133 Cr</td><td><StatusBadge tone="positive">Calculated</StatusBadge></td><td className="table-muted">₹168 Cr EV − ₹45 Cr debt + ₹10 Cr bridge</td></tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function DiligencePage() {
  const { findingStatuses, markFindingReviewed } = useWorkspace();
  const [filter, setFilter] = useState<"All" | FindingStatus>("All");
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord | null>(null);
  const findings = useMemo(() => DEMO_FINDINGS.map((finding) => ({
    ...finding,
    status: findingStatuses[finding.id] ?? finding.status,
  })).filter((finding) => filter === "All" || finding.status === filter), [filter, findingStatuses]);
  const filters: Array<"All" | FindingStatus> = ["All", "Open", "In review", "Reviewed"];

  return (
    <>
      <PageHeading eyebrow="DUE DILIGENCE" title="Diligence Workspace" description="Review financial, business and operational findings alongside their supporting demo evidence.">
        <StatusBadge tone="neutral">{DEMO_FINDINGS.length} findings</StatusBadge>
      </PageHeading>

      <section className="diligence-summary-grid">
        <MetricCard label="Financial diligence" value="2 items" note="Performance, leverage & cash flow" accent="blue" icon={<Wallet size={16} />} />
        <MetricCard label="Business diligence" value="2 items" note="Customer concentration & revenue quality" accent="purple" icon={<ActivityMark />} />
        <MetricCard label="Operational risks" value="1 item" note="Continuity scenario review" accent="amber" icon={<ShieldAlert size={16} />} />
        <MetricCard label="Open review items" value={String(findings.filter((item) => item.status !== "Reviewed").length)} note="Fictional demo findings" accent="red" icon={<CircleAlert size={16} />} />
      </section>

      <section className="workspace-panel diligence-findings-panel">
        <PanelTitle title="Findings register" detail="Severity and review status reflect fictional demo assumptions" trailing={<span className="finding-count">{findings.length} shown</span>} />
        <div className="filter-row" role="group" aria-label="Filter diligence findings">
          {filters.map((item) => (
            <Button key={item} size="sm" variant={filter === item ? "secondary" : "ghost"} className="filter-chip" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</Button>
          ))}
        </div>
        <div className="finding-list">
          {findings.map((finding) => (
            <article className="finding-row" key={finding.id}>
              <div className={cn("finding-severity-mark", `severity-${finding.severity.toLowerCase()}`)} />
              <div className="finding-main">
                <div className="finding-title-row"><h3>{finding.area}</h3><StatusBadge tone={finding.severity === "High" ? "risk" : finding.severity === "Medium" ? "warning" : "neutral"}>{finding.severity} severity</StatusBadge></div>
                <p>{finding.description}</p>
                <button type="button" className="evidence-reference" onClick={() => setSelectedEvidence(finding.evidence === DEMO_EVIDENCE.name ? DEMO_EVIDENCE : { ...DEMO_EVIDENCE, name: finding.evidence, assumptions: 0, kind: "Demo financial note" })}>
                  <FileText size={13} /> {finding.evidence} <ArrowUpRight size={12} />
                </button>
              </div>
              <div className="finding-actions">
                <StatusBadge tone={finding.status === "Reviewed" ? "positive" : finding.status === "In review" ? "blue" : "warning"}>{finding.status}</StatusBadge>
                {finding.status !== "Reviewed" && <Button variant="ghost" size="sm" className="row-action" onClick={() => markFindingReviewed(finding.id, finding.area)}>Mark reviewed <Check size={13} /></Button>}
              </div>
            </article>
          ))}
          {!findings.length && <div className="empty-state">No findings match this review filter.</div>}
        </div>
      </section>

      <div className="workspace-columns diligence-support-columns">
        <section className="workspace-panel"><PanelTitle title="Financial review" detail="Demo financial inputs · ₹ Cr" /><div className="diligence-financial-grid"><span><small>Revenue</small><strong>₹140</strong></span><span><small>EBITDA</small><strong>₹21</strong></span><span><small>Net profit</small><strong>₹9</strong></span><span><small>Debt</small><strong>₹45</strong></span><span><small>Cash flow</small><strong>₹5</strong></span></div><p className="panel-footnote"><CircleAlert size={13} /> Verify all figures against source materials during diligence.</p></section>
        <section className="workspace-panel"><PanelTitle title="Evidence coverage" detail="Demo evidence is attached but not verified" /><div className="coverage-meter"><div><span>Customer renewal review</span><strong>Linked</strong></div><div className="coverage-track"><span className="coverage-fill" /></div><small>1 fictional exhibit · 9 assumptions · 0 verified documents</small></div><Button variant="outline" size="sm" className="evidence-open-button" onClick={() => setSelectedEvidence(DEMO_EVIDENCE)}><FileText size={14} /> Review demo source</Button></section>
      </div>

      <AssumptionsDialog evidence={selectedEvidence} open={selectedEvidence !== null} onOpenChange={(open) => !open && setSelectedEvidence(null)} />
    </>
  );
}

const dependencyNodes = [
  { id: "customer", label: "Customer", value: "18% exposure", detail: "Northstar Mobility scenario assumes 18% of annual revenue is connected to this account.", className: "map-node-customer" },
  { id: "revenue", label: "Revenue", value: "₹140 Cr", detail: "A 20% commitment reduction on 18% customer exposure implies approximately ₹5.0 Cr revenue sensitivity.", className: "map-node-revenue" },
  { id: "ebitda", label: "EBITDA", value: "₹21 Cr", detail: "The 15% base EBITDA margin translates the revenue sensitivity into approximately ₹0.75 Cr EBITDA impact.", className: "map-node-ebitda" },
  { id: "cashflow", label: "Cash flow", value: "₹5 Cr", detail: "Annual demo cash flow is shown as a separate leverage and resilience input.", className: "map-node-cashflow" },
  { id: "debt", label: "Debt", value: "₹45 Cr", detail: "Gross demo debt is a key input to the equity value bridge; repayment data is not modeled.", className: "map-node-debt" },
  { id: "enterprise", label: "Enterprise value", value: "₹168 Cr", detail: "Base enterprise value is calculated at 8.0× demo EBITDA; the customer scenario sensitivity is approximately −₹6 Cr.", className: "map-node-enterprise" },
  { id: "equity", label: "Equity value", value: "₹133 Cr", detail: "Equity value equals ₹168 Cr enterprise value less ₹45 Cr debt plus a manual ₹10 Cr cash and other adjustment.", className: "map-node-equity" },
] as const;

export function DependencyMapPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("customer");
  const selectedNode = dependencyNodes.find((node) => node.id === selectedNodeId) ?? dependencyNodes[0];

  return (
    <>
      <PageHeading eyebrow="FINANCIAL RELATIONSHIPS" title="Dependency Map" description="See how a customer event can flow through operating metrics and into deal value.">
        <StatusBadge tone="blue">7 connected nodes</StatusBadge>
      </PageHeading>

      <div className="map-legend"><span><i className="legend-dot legend-source" /> Source / event</span><span><i className="legend-dot legend-financial" /> Financial metric</span><span><i className="legend-dot legend-value" /> Valuation output</span><span><span className="legend-arrow">→</span> Direction of sensitivity</span></div>
      <section className="workspace-panel dependency-panel">
        <div className="dependency-map-scroll">
          <div className="dependency-map">
            <svg className="dependency-connectors" viewBox="0 0 1120 390" aria-hidden="true" preserveAspectRatio="none">
              <defs><marker id="dependency-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" className="fill-connector" /></marker></defs>
              <path d="M184 194 C245 194 270 78 337 78" markerEnd="url(#dependency-arrow)" />
              <path d="M461 78 L510 78" markerEnd="url(#dependency-arrow)" />
              <path d="M405 113 C405 177 405 205 405 252" markerEnd="url(#dependency-arrow)" />
              <path d="M635 78 L740 78" markerEnd="url(#dependency-arrow)" />
              <path d="M463 296 L510 296" markerEnd="url(#dependency-arrow)" />
              <path d="M635 296 C780 296 790 211 900 211" markerEnd="url(#dependency-arrow)" />
              <path d="M864 78 C914 78 915 155 930 174" markerEnd="url(#dependency-arrow)" />
            </svg>
            {dependencyNodes.map((node) => (
              <Button
                key={node.id}
                variant="outline"
                className={cn("dependency-node", node.className, selectedNodeId === node.id && "dependency-node-selected")}
                aria-pressed={selectedNodeId === node.id}
                onClick={() => setSelectedNodeId(node.id)}
              >
                <span className="dependency-node-label">{node.label}</span>
                <strong>{node.value}</strong>
              </Button>
            ))}
          </div>
        </div>
        <div className="dependency-detail">
          <span className="dependency-detail-icon"><GitBranchIcon /></span>
          <div><span className="eyebrow">SELECTED RELATIONSHIP</span><h3>{selectedNode?.label ?? "Customer"}</h3><p>{selectedNode?.detail ?? "Select a node to inspect its role in the demo deal."}</p></div>
          <Link to="/change-impact" className="text-link">Open impact review <ArrowRight size={14} /></Link>
        </div>
      </section>

      <div className="dependency-insight"><CircleAlert size={16} /><p>The dotted scenario path represents modeled sensitivity only. It does not change NovaTech’s base financial values unless reviewed separately.</p></div>
    </>
  );
}

function GitBranchIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="6" cy="5" r="2" /><circle cx="18" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M6 7v3a4 4 0 004 4h4a4 4 0 014 4M18 7v2" /></svg>;
}

function downloadReport(title: string) {
  const blob = new Blob([reportText(title)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${title.toLowerCase().replaceAll(" ", "-")}-demo-report.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<(typeof DEMO_REPORTS)[number] | null>(null);

  return (
    <>
      <PageHeading eyebrow="DEAL OUTPUTS" title="Reports" description="Preview and download concise deal reports generated from the fictional NovaTech demo assumptions.">
        <StatusBadge tone="neutral">6 demo reports</StatusBadge>
      </PageHeading>

      <div className="report-notice"><FileText size={16} /><span><strong>Demo report outputs</strong><small>Downloads are text summaries of the displayed assumptions, not verified investment advice.</small></span></div>
      <section className="workspace-panel reports-panel">
        <PanelTitle title="Report library" detail="All reports use the same deal assumptions and scenario inputs" />
        <div className="report-list">
          {DEMO_REPORTS.map((report, index) => (
            <article className="report-row" key={report.id}>
              <span className={cn("report-icon", `report-icon-${index % 3}`)}><FileText size={18} /></span>
              <div className="report-details"><strong>{report.title}</strong><span>{report.description}</span><small>Updated {report.updated} <span className="separator-dot" /> Fictional demo</small></div>
              <StatusBadge tone="blue">Ready</StatusBadge>
              <Button variant="ghost" size="sm" className="row-action" onClick={() => setSelectedReport(report)}>Preview <ArrowUpRight size={14} /></Button>
              <Button variant="outline" size="icon" className="report-download" aria-label={`Download ${report.title}`} title={`Download ${report.title}`} onClick={() => downloadReport(report.title)}><ArrowDownToLine size={16} /></Button>
            </article>
          ))}
        </div>
      </section>
      <div className="report-footnote"><LockKeyhole size={14} /> Reports are prepared locally from the demo data shown in this workspace.</div>

      <Dialog open={selectedReport !== null} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="report-preview-dialog">
          <DialogHeader>
            <div className="dialog-kicker"><FileText size={14} /> REPORT PREVIEW</div>
            <DialogTitle>{selectedReport?.title ?? "Demo report"}</DialogTitle>
            <DialogDescription>{selectedReport?.description ?? "Fictional demo assumptions"}</DialogDescription>
          </DialogHeader>
          <pre className="report-preview-text">{reportText(selectedReport?.title ?? "Deal overview")}</pre>
          <div className="dialog-footer-actions"><Button variant="outline" onClick={() => setSelectedReport(null)}>Close</Button><Button onClick={() => selectedReport && downloadReport(selectedReport.title)}><ArrowDownToLine size={15} /> Download report</Button></div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AuditTrailPage() {
  const { activities, impactStatus } = useWorkspace();
  const [filter, setFilter] = useState<"all" | "assumption" | "approval" | "evidence" | "analysis">("all");
  const filters: Array<{ value: typeof filter; label: string }> = [
    { value: "all", label: "All activity" },
    { value: "analysis", label: "Analysis" },
    { value: "assumption", label: "Assumptions" },
    { value: "approval", label: "Approvals" },
    { value: "evidence", label: "Evidence" },
  ];
  const visibleActivities = activities.filter((item) => filter === "all" || item.category === filter);

  return (
    <>
      <PageHeading eyebrow="DEAL GOVERNANCE" title="Audit Trail" description="Review demo activity, changed assumptions and the current banker approval state.">
        <StatusBadge tone="neutral">{activities.length} activities</StatusBadge>
      </PageHeading>

      <div className="audit-summary-grid">
        <MetricCard label="Latest analysis" value="Demo scenario" note="Customer event impact" accent="blue" icon={<ActivityMark />} />
        <MetricCard label="Approval status" value={impactStatus === "Approved" ? "Approved" : "Pending"} note={impactStatus} accent={impactStatus === "Approved" ? "teal" : "amber"} icon={<ShieldAlert size={16} />} />
        <MetricCard label="Changed assumptions" value="9 linked" note="Fictional source exhibit" accent="purple" icon={<FileText size={16} />} />
        <MetricCard label="User" value="A. Morgan" note="Deal owner · demo session" accent="blue" icon={<BadgeCheck size={16} />} />
      </div>

      <section className="workspace-panel audit-panel">
        <PanelTitle title="Activity log" detail="Fictional demo timestamps; latest actions appear first" trailing={<span className="audit-tz">IST · UTC +05:30</span>} />
        <div className="filter-row audit-filters" role="group" aria-label="Filter audit activity">
          {filters.map((item) => <Button key={item.value} size="sm" variant={filter === item.value ? "secondary" : "ghost"} className="filter-chip" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}</Button>)}
        </div>
        <div className="table-scroll audit-table-scroll">
          <table className="data-table audit-table">
            <thead><tr><th>ACTIVITY</th><th>USER</th><th>TIMESTAMP</th><th>CHANGED ASSUMPTIONS</th><th>ANALYSIS STATUS</th><th>APPROVAL</th></tr></thead>
            <tbody>
              {visibleActivities.map((item) => (
                <tr key={item.id}>
                  <td><span className="audit-activity"><span className={cn("audit-category-dot", `audit-dot-${item.category}`)} /><strong>{item.activity}</strong></span></td>
                  <td>{item.user}</td>
                  <td className="table-muted">{item.timestamp}</td>
                  <td className="table-muted">{item.changedAssumption}</td>
                  <td><span className="analysis-status-text">{item.analysisStatus}</span></td>
                  <td><StatusBadge tone={item.approvalStatus === "Approved" ? "positive" : item.approvalStatus === "Pending banker review" ? "warning" : "neutral"}>{item.approvalStatus}</StatusBadge></td>
                </tr>
              ))}
              {!visibleActivities.length && <tr><td colSpan={6} className="table-empty">No activity matches this filter.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="audit-disclaimer"><LockKeyhole size={14} /> Activity is stored in this browser session only and resets with the demo workspace.</div>
      </section>
    </>
  );
}