import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  CircleHelp,
  FileChartColumnIncreasing,
  GitBranch,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  WalletCards,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DEMO_DEAL } from "@/lib/dealpilot-data";
import { useWorkspace } from "@/components/dealpilot/workspace-context";

const navigation = [
  { title: "Deal Workspace", to: "/", icon: BriefcaseBusiness },
  { title: "Change Impact", to: "/change-impact", icon: Activity },
  { title: "Valuation", to: "/valuation", icon: WalletCards },
  { title: "Diligence", to: "/diligence", icon: ShieldCheck },
  { title: "Dependency Map", to: "/dependency-map", icon: GitBranch },
  { title: "Reports", to: "/reports", icon: FileChartColumnIncreasing },
  { title: "Audit Trail", to: "/audit-trail", icon: CircleHelp },
] as const;

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const activePageTitle = navigation.find((item) => item.to === pathname)?.title ?? "Deal Workspace";
  const { notice, clearNotice, activities } = useWorkspace();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(clearNotice, 5200);
    return () => window.clearTimeout(timer);
  }, [notice, clearNotice]);

  const matchingNavigation = navigation.filter((item) =>
    item.title.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  return (
    <TooltipProvider delayDuration={450}>
      <div className="workspace-shell min-h-screen lg:flex">
        <aside className="workspace-sidebar hidden lg:flex">
          <Link to="/" className="brand-lockup" aria-label="DealPilot AI — Deal Workspace">
            <span className="brand-mark"><BriefcaseBusiness size={19} /></span>
            <span className="min-w-0">
              <span className="brand-name">DealPilot<span> AI</span></span>
              <span className="brand-caption">DEAL INTELLIGENCE</span>
            </span>
          </Link>

          <div className="sidebar-deal">
            <span className="eyebrow">ACTIVE DEAL</span>
            <span className="sidebar-company">NovaTech Industries</span>
            <span className="sidebar-stage">{DEMO_DEAL.stage}</span>
            <span className="sidebar-deal-id">{DEMO_DEAL.dealId}</span>
          </div>

          <nav className="sidebar-navigation" aria-label="Deal sections">
            <span className="eyebrow sidebar-nav-label">WORKSPACE</span>
            {navigation.map((item) => {
              const isActive = item.to === pathname;
              return (
                <Button
                  key={item.to}
                  asChild
                  variant="ghost"
                  className={cn("sidebar-link", isActive && "sidebar-link-active")}
                >
                  <Link to={item.to} aria-current={isActive ? "page" : undefined}>
                    <item.icon size={17} strokeWidth={1.8} />
                    <span>{item.title}</span>
                    {item.to === "/change-impact" && <span className="nav-count">1</span>}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-ai-note">
              <Sparkles size={15} />
              <span>Demo workspace</span>
              <span className="sidebar-ai-status">SIMULATED</span>
            </div>
            <div className="sidebar-user">
              <span className="avatar-mark">AM</span>
              <span className="min-w-0 flex-1">
                <span className="sidebar-user-name">A. Morgan</span>
                <span className="sidebar-user-role">Deal owner</span>
              </span>
              <ChevronDown size={15} className="text-muted-foreground" />
            </div>
          </div>
        </aside>

        <main className="workspace-main min-w-0 flex-1">
          <header className="workspace-topbar">
            <div className="topbar-crumbs">
              <span className="topbar-company">NovaTech Industries</span>
              <span className="breadcrumb-separator">/</span>
              <span className="topbar-current">{activePageTitle}</span>
            </div>
            <div className="topbar-actions">
              <span className="sync-indicator"><span className="sync-dot" /> Last synced · 09:42 IST</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label={searchOpen ? "Close section search" : "Search sections"}
                    title="Search sections"
                    variant="ghost"
                    size="icon"
                    className="topbar-icon"
                    onClick={() => {
                      setSearchOpen((open) => !open);
                      setSearchText("");
                    }}
                  >
                    {searchOpen ? <X size={17} /> : <Search size={17} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search deal sections</TooltipContent>
              </Tooltip>
              <div className="topbar-menu-anchor">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      aria-label="Notifications"
                      aria-expanded={notificationsOpen}
                      title="Notifications"
                      variant="ghost"
                      size="icon"
                      className="topbar-icon notification-button"
                      onClick={() => {
                        setNotificationsOpen((open) => !open);
                        setProfileOpen(false);
                      }}
                    >
                      <Bell size={17} />
                      {activities.some((activity) => activity.approvalStatus === "Pending banker review") && (
                        <span className="notification-dot" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
                {notificationsOpen && (
                  <div className="topbar-popover notification-popover">
                    <div className="popover-heading">
                      <span>Notifications</span>
                      <Button variant="ghost" size="icon" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)}>
                        <X size={15} />
                      </Button>
                    </div>
                    <p className="popover-note">One item needs banker review.</p>
                    <Link to="/change-impact" className="notification-item" onClick={() => setNotificationsOpen(false)}>
                      <span className="notification-item-dot" />
                      <span><strong>Customer event pending</strong><small>Northstar Mobility · demo scenario</small></span>
                    </Link>
                  </div>
                )}
              </div>
              <div className="topbar-menu-anchor">
                <Button
                  variant="ghost"
                  className="profile-button"
                  aria-expanded={profileOpen}
                  onClick={() => {
                    setProfileOpen((open) => !open);
                    setNotificationsOpen(false);
                  }}
                >
                  <span className="avatar-mark avatar-small">AM</span>
                  <span className="profile-name">A. Morgan</span>
                  <ChevronDown size={14} />
                </Button>
                {profileOpen && (
                  <div className="topbar-popover profile-popover">
                    <span className="popover-eyebrow">DEAL OWNER</span>
                    <strong>A. Morgan</strong>
                    <small>Investment banking · Demo session</small>
                    <span className="profile-separator" />
                    <span className="profile-demo-label">Fictional demo workspace</span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {searchOpen && (
            <div className="search-strip">
              <Search size={17} className="text-muted-foreground" />
              <Input
                autoFocus
                aria-label="Search deal sections"
                placeholder="Search deal sections…"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="search-input"
              />
              {searchText.trim() && (
                <div className="search-results" role="listbox" aria-label="Matching sections">
                  {matchingNavigation.length ? matchingNavigation.map((item) => (
                    <Link key={item.to} to={item.to} className="search-result" onClick={() => setSearchOpen(false)}>
                      <item.icon size={16} />{item.title}
                    </Link>
                  )) : <span className="search-empty">No matching sections</span>}
                </div>
              )}
              <Button variant="ghost" size="icon" aria-label="Close search" onClick={() => setSearchOpen(false)}>
                <X size={16} />
              </Button>
            </div>
          )}

          <nav className="mobile-navigation" aria-label="Deal sections">
            {navigation.map((item) => {
              const isActive = item.to === pathname;
              return (
                <Button key={item.to} asChild variant="ghost" className={cn("mobile-nav-link", isActive && "mobile-nav-link-active")}>
                  <Link to={item.to} aria-current={isActive ? "page" : undefined}>
                    <item.icon size={15} />{item.title}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="workspace-content">{children}</div>
          <footer className="workspace-footer">
            <span><Sparkles size={13} /> Fictional demo assumptions · No document verification or AI processing performed</span>
            <span>DEALPILOT AI <span className="footer-divider">/</span> PRIVATE WORKSPACE</span>
          </footer>
        </main>

        {notice && (
          <div className="workspace-toast" role="status" aria-live="polite">
            <span className="toast-mark"><Upload size={15} /></span>
            <span>{notice}</span>
            <Button variant="ghost" size="icon" aria-label="Dismiss message" onClick={clearNotice}><X size={15} /></Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}