import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import {
  DEMO_ACTIVITIES,
  DEMO_EVIDENCE,
  DEMO_FINDINGS,
  type ActivityRecord,
  type ApprovalStatus,
  type EvidenceRecord,
  type FindingStatus,
} from "@/lib/dealpilot-data";

type WorkspaceContextValue = {
  evidence: EvidenceRecord[];
  activities: ActivityRecord[];
  findingStatuses: Record<string, FindingStatus>;
  impactStatus: ApprovalStatus;
  notice: string;
  clearNotice: () => void;
  resetDemo: () => void;
  loadDemo: () => void;
  uploadEvidence: (name: string) => void;
  approveImpact: () => void;
  markFindingReviewed: (id: string, area: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const initialFindingStatuses = (): Record<string, FindingStatus> =>
  Object.fromEntries(DEMO_FINDINGS.map((finding) => [finding.id, finding.status]));

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([DEMO_EVIDENCE]);
  const [activities, setActivities] = useState<ActivityRecord[]>(DEMO_ACTIVITIES);
  const [findingStatuses, setFindingStatuses] = useState<Record<string, FindingStatus>>(initialFindingStatuses);
  const [impactStatus, setImpactStatus] = useState<ApprovalStatus>("Pending banker review");
  const [notice, setNotice] = useState("");

  const clearNotice = useCallback(() => setNotice(""), []);

  const resetDemo = useCallback(() => {
    setEvidence([DEMO_EVIDENCE]);
    setActivities(DEMO_ACTIVITIES);
    setFindingStatuses(initialFindingStatuses());
    setImpactStatus("Pending banker review");
    setNotice("Demo workspace reset to its original assumptions.");
  }, []);

  const loadDemo = useCallback(() => {
    setEvidence([DEMO_EVIDENCE]);
    setActivities(DEMO_ACTIVITIES);
    setFindingStatuses(initialFindingStatuses());
    setImpactStatus("Pending banker review");
    setNotice("NovaTech fictional demo deal loaded.");
  }, []);

  const uploadEvidence = useCallback((name: string) => {
    const timestamp = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const record: EvidenceRecord = {
      id: `upload-${Date.now()}`,
      name,
      kind: "User-selected file",
      status: "Uploaded · not verified",
      assumptions: 0,
      addedBy: "A. Morgan",
      addedAt: timestamp,
    };
    setEvidence((current) => [record, ...current]);
    setActivities((current) => [
      {
        id: `activity-upload-${Date.now()}`,
        activity: `Evidence file selected: ${name}`,
        user: "A. Morgan",
        timestamp,
        changedAssumption: "None",
        analysisStatus: "Uploaded · no analysis performed",
        approvalStatus: "Not applicable",
        category: "evidence",
      },
      ...current,
    ]);
    setNotice(`${name} added. No document verification or AI analysis was performed.`);
  }, []);

  const approveImpact = useCallback(() => {
    setImpactStatus("Approved");
    const timestamp = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setActivities((current) => [
      {
        id: `activity-approval-${Date.now()}`,
        activity: "Customer impact scenario approved by banker",
        user: "A. Morgan",
        timestamp,
        changedAssumption: "No values changed · scenario approval only",
        analysisStatus: "Impact scenario reviewed",
        approvalStatus: "Approved",
        category: "approval",
      },
      ...current,
    ]);
    setNotice("Impact scenario marked approved. Demo financials remain unchanged.");
  }, []);

  const markFindingReviewed = useCallback((id: string, area: string) => {
    setFindingStatuses((current) => ({ ...current, [id]: "Reviewed" }));
    const timestamp = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setActivities((current) => [
      {
        id: `activity-review-${Date.now()}`,
        activity: `${area} marked reviewed`,
        user: "A. Morgan",
        timestamp,
        changedAssumption: "Review status only",
        analysisStatus: "Reviewed",
        approvalStatus: "Not applicable",
        category: "analysis",
      },
      ...current,
    ]);
    setNotice(`${area} marked reviewed.`);
  }, []);

  const value = useMemo(
    () => ({
      evidence,
      activities,
      findingStatuses,
      impactStatus,
      notice,
      clearNotice,
      resetDemo,
      loadDemo,
      uploadEvidence,
      approveImpact,
      markFindingReviewed,
    }),
    [
      evidence,
      activities,
      findingStatuses,
      impactStatus,
      notice,
      clearNotice,
      resetDemo,
      loadDemo,
      uploadEvidence,
      approveImpact,
      markFindingReviewed,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  }
  return context;
}