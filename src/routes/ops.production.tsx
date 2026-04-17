import { createFileRoute } from "@tanstack/react-router";
import { AppShell, KpiCard, PageHeader, StatusBadge } from "@/components/AppShell";
import { useManufacturingOrders } from "@/lib/hooks";
import { machines } from "@/lib/mockData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/ops/production")({
  head: () => ({ meta: [{ title: "Production — OptiFlow" }] }),
  component: ProductionDashboard,
});

const machineLoad = [
  { machine: "CNC Plasma A1", load: 78 },
  { machine: "CNC Plasma A2", load: 64 },
  { machine: "Plieuse Hydra", load: 0 },
  { machine: "Soudure MIG-1", load: 92 },
  { machine: "Imprimante 3D X", load: 18 },
];

function ProductionDashboard() {
  const { data: mos } = useManufacturingOrders();

  const inProd = mos.filter((m) => m.status === "In Production");
  const completedThisWeek = mos.filter((m) => m.status === "Completed").length;
  const overdue = inProd.filter((m) => new Date(m.targetDate) < new Date()).length;
  const avgRate =
    Math.round(
      (inProd.reduce((s, m) => s + m.qtyProduced / m.qtyOrdered, 0) / Math.max(inProd.length, 1)) * 100,
    );

  return (
    <AppShell breadcrumbs={["OptiFlow", "Ops Core", "Production"]}>
      <PageHeader title="Tableau de production" subtitle="Site Chlef — Vue temps réel" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="OF en production aujourd'hui" value={inProd.length} delta="+1 vs hier" />
        <KpiCard label="Complétés cette semaine" value={completedThisWeek} delta="+3 vs semaine -1" tone="success" />
        <KpiCard label="OF en retard" value={overdue} delta="Au-delà de 20%" tone="error" />
        <KpiCard label="Taux d'avancement moyen" value={`${avgRate}%`} delta="Stable" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4">Planning par machine — Semaine en cours</h2>
          <Gantt orders={inProd} />
        </div>
        <div className="card p-5">
          <h2 className="mb-4">Charge des machines (%)</h2>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={machineLoad} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} />
                <YAxis dataKey="machine" type="category" stroke="var(--text-muted)" fontSize={11} width={100} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }} />
                <Bar dataKey="load" fill="var(--navy)" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={14} style={{ color: "var(--warning)" }} />
          <h2>Goulots d'étranglement détectés</h2>
        </div>
        <ul className="space-y-2 text-[13px]">
          <li className="flex items-center justify-between rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
            <div>
              <div className="font-medium">OF-2026-095 — Transpalette lourd 3T</div>
              <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                4 jours de retard · Bloqué sur Plieuse Hydra (en maintenance)
              </div>
            </div>
            <StatusBadge status="Cancelled" />
          </li>
          <li className="flex items-center justify-between rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
            <div>
              <div className="font-medium">OF-2026-087 — Poste à souder MIG 250A</div>
              <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                Soudure MIG-1 à 92% de capacité — risque de retard
              </div>
            </div>
            <StatusBadge status="In Production" />
          </li>
        </ul>
      </div>
    </AppShell>
  );
}

function Gantt({ orders }: { orders: ReturnType<typeof useManufacturingOrders>["data"] }) {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  // Hash machine -> rows
  const rows = machines.map((m) => ({
    machine: m,
    orders: orders.filter((o) => o.machineId === m.id),
  }));
  return (
    <div>
      <div className="grid grid-cols-[140px_1fr] gap-2 text-[11px] mb-2" style={{ color: "var(--text-muted)" }}>
        <div></div>
        <div className="grid grid-cols-7">
          {days.map((d) => <div key={d} className="text-center">{d}</div>)}
        </div>
      </div>
      <div className="space-y-1.5">
        {rows.map(({ machine, orders }) => (
          <div key={machine.id} className="grid grid-cols-[140px_1fr] gap-2 items-center">
            <div className="text-[12px] font-medium truncate">{machine.name}</div>
            <div className="relative h-7 grid grid-cols-7 gap-px rounded" style={{ backgroundColor: "var(--surface-2)" }}>
              {days.map((_, i) => (
                <div key={i} style={{ borderRight: i < 6 ? "1px dashed var(--border)" : undefined }} />
              ))}
              {orders.slice(0, 1).map((o, idx) => {
                // Pseudo-position: span based on index
                const start = (parseInt(o.id.replace("mo", "")) % 4);
                const span = Math.min(7 - start, 3 + (idx % 2));
                const isLate = new Date(o.targetDate) < new Date();
                return (
                  <div
                    key={o.id}
                    className="absolute top-1 h-5 rounded px-2 text-[11px] font-medium flex items-center tabular truncate"
                    style={{
                      left: `${(start / 7) * 100}%`,
                      width: `${(span / 7) * 100}%`,
                      backgroundColor: isLate ? "color-mix(in srgb, var(--error) 12%, white)" : "color-mix(in srgb, var(--navy) 8%, white)",
                      color: isLate ? "var(--error)" : "var(--navy)",
                      border: `1px solid ${isLate ? "color-mix(in srgb, var(--error) 30%, var(--border))" : "color-mix(in srgb, var(--navy) 25%, var(--border))"}`,
                    }}
                  >
                    {o.reference}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
