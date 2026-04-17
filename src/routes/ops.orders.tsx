import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader, StatusBadge } from "@/components/AppShell";
import { useManufacturingOrders } from "@/lib/hooks";
import { machines, users } from "@/lib/mockData";
import type { ManufacturingOrder } from "@/lib/mockData";
import { Plus, Filter, Calendar, User, Cog, X } from "lucide-react";

export const Route = createFileRoute("/ops/orders")({
  head: () => ({ meta: [{ title: "Ordres de fabrication — OptiFlow" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const { data } = useManufacturingOrders();
  const [selected, setSelected] = useState<ManufacturingOrder | null>(data[0] ?? null);
  const [filter, setFilter] = useState<string>("Tous");

  const statuses = ["Tous", "Draft", "In Production", "Quality Check", "Completed", "Cancelled"];
  const list = filter === "Tous" ? data : data.filter((o) => o.status === filter);

  return (
    <AppShell breadcrumbs={["OptiFlow", "Ops Core", "Ordres de fabrication"]}>
      <PageHeader
        title="Ordres de fabrication"
        subtitle="Site Chlef — Production en temps réel"
        actions={
          <>
            <button className="btn-secondary inline-flex items-center gap-1.5">
              <Filter size={13} /> Filtres
            </button>
            <button className="btn-primary inline-flex items-center gap-1.5">
              <Plus size={14} /> Nouvel OF
            </button>
          </>
        }
      />

      <div className="flex gap-1.5 mb-4">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors"
            style={{
              backgroundColor: filter === s ? "var(--navy)" : "var(--surface)",
              color: filter === s ? "var(--text-inverse)" : "var(--text)",
              border: `1px solid ${filter === s ? "var(--navy)" : "var(--border)"}`,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="card overflow-hidden col-span-12 lg:col-span-7">
          <table className="w-full text-[13px]">
            <thead style={{ backgroundColor: "var(--surface-2)" }}>
              <tr className="text-left" style={{ color: "var(--text-muted)" }}>
                <th className="px-4 py-2.5 font-medium text-[12px]">Référence</th>
                <th className="px-4 py-2.5 font-medium text-[12px]">Produit</th>
                <th className="px-4 py-2.5 font-medium text-[12px] text-right">Avancement</th>
                <th className="px-4 py-2.5 font-medium text-[12px]">Échéance</th>
                <th className="px-4 py-2.5 font-medium text-[12px]">Statut</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => {
                const isLate = o.status === "In Production" && new Date(o.targetDate) < new Date();
                const pct = Math.round((o.qtyProduced / o.qtyOrdered) * 100);
                return (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(o)}
                    className="cursor-pointer border-t transition-colors"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: selected?.id === o.id ? "var(--surface-2)" : "transparent",
                    }}
                  >
                    <td className="px-4 py-3 tabular font-medium">{o.reference}</td>
                    <td className="px-4 py-3">
                      <div>{o.product}</div>
                      <div className="text-[11px] tabular" style={{ color: "var(--text-faint)" }}>{o.sku}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="tabular text-[12px]">{o.qtyProduced} / {o.qtyOrdered}</div>
                      <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-2)" }}>
                        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "var(--success)" : "var(--amber)" }} />
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular text-[12px]" style={{ color: isLate ? "var(--error)" : "var(--text)" }}>
                      {o.targetDate}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selected && <DetailPanel order={selected} onClose={() => setSelected(null)} />}
      </div>
    </AppShell>
  );
}

function DetailPanel({ order, onClose }: { order: ManufacturingOrder; onClose: () => void }) {
  const machine = machines.find((m) => m.id === order.machineId);
  const operator = users.find((u) => u.id === order.operatorId);
  const pct = Math.round((order.qtyProduced / order.qtyOrdered) * 100);
  return (
    <div className="card col-span-12 lg:col-span-5 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>Détail</div>
          <h2 className="tabular">{order.reference}</h2>
        </div>
        <button onClick={onClose} className="rounded p-1" style={{ color: "var(--text-muted)" }}>
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="label">Produit</div>
          <div className="text-[14px] font-medium">{order.product}</div>
          <div className="text-[12px] tabular" style={{ color: "var(--text-muted)" }}>SKU : {order.sku}</div>
        </div>

        <div>
          <div className="label mb-1.5">Avancement</div>
          <div className="flex items-baseline justify-between">
            <span className="text-[20px] font-semibold tabular">{order.qtyProduced} <span className="text-[13px] font-normal" style={{ color: "var(--text-muted)" }}>/ {order.qtyOrdered}</span></span>
            <span className="text-[13px] tabular" style={{ color: "var(--text-muted)" }}>{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-2)" }}>
            <div className="h-full" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "var(--success)" : "var(--amber)" }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
              <Cog size={12} /> Machine
            </div>
            <div className="mt-1 text-[13px] font-medium">{machine?.name}</div>
            <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>{machine?.type}</div>
          </div>
          <div className="rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
              <User size={12} /> Opérateur
            </div>
            <div className="mt-1 text-[13px] font-medium">{operator?.name}</div>
            <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>{operator?.role}</div>
          </div>
          <div className="rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
              <Calendar size={12} /> Démarré
            </div>
            <div className="mt-1 text-[13px] tabular">{order.startedAt ?? "—"}</div>
          </div>
          <div className="rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
              <Calendar size={12} /> Échéance
            </div>
            <div className="mt-1 text-[13px] tabular">{order.targetDate}</div>
          </div>
        </div>

        <div>
          <div className="label mb-1">Statut</div>
          <StatusBadge status={order.status} />
        </div>

        {order.notes && (
          <div>
            <div className="label mb-1">Notes</div>
            <div className="rounded-md border p-3 text-[13px]" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-2)" }}>
              {order.notes}
            </div>
          </div>
        )}

        {order.clientOrderId && (
          <div>
            <div className="label mb-1">Commande client liée</div>
            <div className="text-[13px] tabular">{order.clientOrderId.replace("co", "CMD-2026-06")}</div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button className="btn-primary flex-1">Mettre à jour</button>
          <button className="btn-secondary">Imprimer</button>
        </div>
      </div>
    </div>
  );
}
