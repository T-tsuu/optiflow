import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useCommercialOrders } from "@/lib/hooks";
import { clients, formatDZD } from "@/lib/mockData";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/crm/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline commercial — OptiFlow" }] }),
  component: PipelinePage,
});

const stages = [
  "Lead",
  "Quote Sent",
  "Order Confirmed",
  "In Production",
  "Ready to Ship",
  "Delivered",
  "Invoiced",
] as const;

const labels: Record<string, string> = {
  "Lead": "Prospect",
  "Quote Sent": "Devis envoyé",
  "Order Confirmed": "Commande confirmée",
  "In Production": "En production",
  "Ready to Ship": "Prêt à expédier",
  "Delivered": "Livré",
  "Invoiced": "Facturé",
};

function PipelinePage() {
  const { data } = useCommercialOrders();

  return (
    <AppShell breadcrumbs={["OptiFlow", "CRM Connect", "Pipeline commercial"]}>
      <PageHeader
        title="Pipeline commercial"
        subtitle="Du prospect à la facturation — suivi visuel"
        actions={
          <button className="btn-primary inline-flex items-center gap-1.5">
            <Plus size={14} /> Nouvelle commande
          </button>
        }
      />

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          {stages.map((stage) => {
            const orders = data.filter((o) => o.stage === stage);
            const total = orders.reduce((s, o) => s + o.totalDZD, 0);
            return (
              <div key={stage} className="w-[280px] flex flex-col">
                <div
                  className="rounded-t-lg border border-b-0 px-3 py-2.5"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-2)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold uppercase tracking-wide">{labels[stage]}</div>
                    <span className="badge text-[11px]">{orders.length}</span>
                  </div>
                  <div className="text-[11px] tabular mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {formatDZD(total)}
                  </div>
                </div>
                <div
                  className="flex-1 space-y-2 rounded-b-lg border border-t-0 p-2 min-h-[300px]"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                >
                  {orders.map((o) => {
                    const c = clients.find((x) => x.id === o.clientId);
                    return (
                      <div key={o.id} className="rounded-md border p-3 cursor-grab" style={{ borderColor: "var(--border)" }}>
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-[12px] tabular font-semibold">{o.reference}</span>
                          {o.linkedMO && (
                            <span className="badge badge-info text-[10px] tabular">{o.linkedMO}</span>
                          )}
                        </div>
                        <div className="text-[13px] font-medium truncate">{c?.company}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {o.products[0].qty}× {o.products[0].name}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[12px] tabular font-semibold">{formatDZD(o.totalDZD)}</span>
                          <span className="text-[11px] tabular" style={{ color: "var(--text-muted)" }}>{o.deliveryDate}</span>
                        </div>
                      </div>
                    );
                  })}
                  {orders.length === 0 && (
                    <div className="text-[12px] text-center py-6" style={{ color: "var(--text-faint)" }}>
                      Aucune commande
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
