import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, StatusBadge } from "@/components/AppShell";
import { useTransferRequests, useStockItems } from "@/lib/hooks";
import { Plus, ArrowRight, Truck, Package, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/stock/transfers")({
  head: () => ({ meta: [{ title: "Transferts inter-sites — OptiFlow" }] }),
  component: TransfersPage,
});

const stages = [
  { key: "Requested",  label: "Demandé",       Icon: Clock },
  { key: "Confirmed",  label: "Confirmé",      Icon: Package },
  { key: "In Transit", label: "En transit",    Icon: Truck },
  { key: "Received",   label: "Reçu à Blida",  Icon: CheckCircle2 },
] as const;

function TransfersPage() {
  const { data: transfers } = useTransferRequests();
  const { data: items } = useStockItems();

  return (
    <AppShell breadcrumbs={["OptiFlow", "Stock Bridge", "Transferts"]}>
      <PageHeader
        title="Transferts inter-sites"
        subtitle="Chlef → Blida · Suivi en temps réel"
        actions={
          <button className="btn-primary inline-flex items-center gap-1.5">
            <Plus size={14} /> Nouvelle demande
          </button>
        }
      />

      <div className="space-y-3">
        {transfers.map((t) => {
          const item = items.find((i) => i.id === t.itemId);
          const idx = stages.findIndex((s) => s.key === t.status);
          return (
            <div key={t.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-semibold tabular">{t.reference}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="text-[13px]">{item?.name} · <span className="tabular">{t.quantity} {item?.unit}</span></div>
                  <div className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Demandé par {t.requestedBy} le {t.requestedAt} · ETA Blida : <span className="tabular">{t.expectedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
                  <span>Chlef</span>
                  <ArrowRight size={14} />
                  <span>Blida</span>
                </div>
              </div>

              {/* Stepper */}
              <div className="grid grid-cols-4 gap-0">
                {stages.map((s, i) => {
                  const Icon = s.Icon;
                  const done = i <= idx;
                  const active = i === idx;
                  return (
                    <div key={s.key} className="flex items-center">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: done ? "var(--navy)" : "var(--surface-2)",
                            color: done ? "var(--amber)" : "var(--text-faint)",
                            border: active ? `2px solid var(--amber)` : "none",
                          }}
                        >
                          <Icon size={14} />
                        </div>
                        <div className="mt-1.5 text-[11px] font-medium" style={{ color: done ? "var(--text)" : "var(--text-faint)" }}>
                          {s.label}
                        </div>
                      </div>
                      {i < stages.length - 1 && (
                        <div className="h-px flex-1" style={{ backgroundColor: i < idx ? "var(--navy)" : "var(--border)" }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-4">
                {t.status === "Requested" && <button className="btn-primary">Confirmer (Chlef)</button>}
                {t.status === "Confirmed" && <button className="btn-primary">Marquer expédié</button>}
                {t.status === "In Transit" && <button className="btn-primary">Confirmer réception (Blida)</button>}
                <button className="btn-secondary">Détails</button>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
