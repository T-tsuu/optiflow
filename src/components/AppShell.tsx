import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({
  breadcrumbs,
  children,
}: {
  breadcrumbs: string[];
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1>{title}</h1>
        {subtitle && (
          <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string | number;
  delta?: string;
  tone?: "default" | "success" | "warning" | "error";
}) {
  const toneColor =
    tone === "success" ? "var(--success)" :
    tone === "warning" ? "var(--warning)" :
    tone === "error"   ? "var(--error)"   : "var(--text-muted)";
  return (
    <div className="card px-5 py-4">
      <div className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <div className="mt-2 text-[26px] font-semibold tabular leading-none">{value}</div>
      {delta && (
        <div className="mt-2 text-[12px] tabular" style={{ color: toneColor }}>
          {delta}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Completed": "badge-success",
    "Delivered": "badge-success",
    "Received": "badge-success",
    "Resolved": "badge-success",
    "Closed": "badge-success",
    "In Production": "badge-info",
    "In Progress": "badge-info",
    "Quality Check": "badge-info",
    "In Transit": "badge-info",
    "Confirmed": "badge-info",
    "Assigned": "badge-info",
    "Order Confirmed": "badge-info",
    "Ready to Ship": "badge-info",
    "Quote Sent": "badge",
    "Lead": "badge",
    "Draft": "badge",
    "Open": "badge-warning",
    "Requested": "badge-warning",
    "Cancelled": "badge-error",
    "Invoiced": "badge-success",
  };
  const cls = map[status] ?? "badge";
  return <span className={`badge ${cls}`}>{status}</span>;
}