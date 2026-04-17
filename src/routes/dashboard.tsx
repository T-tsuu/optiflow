import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, KpiCard, PageHeader, StatusBadge } from "@/components/AppShell";
import {
  useManufacturingOrders,
  useStockItems,
  useTransferRequests,
  useServiceTickets,
  useCommercialOrders,
} from "@/lib/hooks";
import { formatDZD, clients } from "@/lib/mockData";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { AlertTriangle, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — OptiFlow" }] }),
  component: Dashboard,
});

const productionTrend = [
  { d: "Lun", produced: 18 },
  { d: "Mar", produced: 22 },
  { d: "Mer", produced: 15 },
  { d: "Jeu", produced: 27 },
  { d: "Ven", produced: 31 },
  { d: "Sam", produced: 12 },
  { d: "Dim", produced: 0 },
];

const stockBySite = [
  { name: "Matières premières", Chlef: 540, Blida: 0 },
  { name: "Pièces détachées",   Chlef: 26,  Blida: 6 },
  { name: "Produits finis",     Chlef: 11,  Blida: 21 },
];

function Dashboard() {
  const { data: mos } = useManufacturingOrders();
  const { data: stock } = useStockItems();
  const { data: transfers } = useTransferRequests();
  const { data: tickets } = useServiceTickets();
  const { data: orders } = useCommercialOrders();

  const inProd = mos.filter((m) => m.status === "In Production").length;
  const overdue = mos.filter((m) => m.status === "In Production" && new Date(m.targetDate) < new Date()).length;
  const lowStock = stock.filter((s) => s.qtyChlef + s.qtyBlida < s.minThreshold).length;
  const openTickets = tickets.filter((t) => !["Resolved", "Closed"].includes(t.status)).length;
  const pipelineValue = orders.reduce((s, o) => s + o.totalDZD, 0);

  return (
    <AppShell breadcrumbs={["OptiFlow", "Tableau de bord"]}>
      <PageHeader
        title="Bonjour Karim"
        subtitle="Vue d'ensemble de l'activité — Chlef & Blida"
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard label="OF en production" value={inProd} delta="+2 vs semaine dernière" tone="default" />
        <KpiCard label="OF en retard" value={overdue} delta="Action requise" tone="error" />
        <KpiCard label="Articles sous seuil" value={lowStock} delta="Réapprovisionnement" tone="warning" />
        <KpiCard label="Tickets SAV ouverts" value={openTickets} delta="3 critiques" tone="warning" />
        <KpiCard label="Pipeline commercial" value={formatDZD(pipelineValue)} delta="+12% ce mois" tone="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2>Production de la semaine</h2>
            <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>Unités produites</span>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="d" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }} />
                <Line type="monotone" dataKey="produced" stroke="var(--navy)" strokeWidth={2} dot={{ fill: "var(--amber)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4">Stock par catégorie</h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockBySite} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }} />
                <Bar dataKey="Chlef" fill="var(--navy)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Blida" fill="var(--amber)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2>Alertes</h2>
            <AlertTriangle size={14} style={{ color: "var(--warning)" }} />
          </div>
          <ul className="space-y-3 text-[13px]">
            <li className="flex items-start gap-2">
              <span className="badge badge-error mt-0.5">Critique</span>
              <span>Tôle inox 1mm sous le seuil minimum à Chlef (22 / 25)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="badge badge-warning mt-0.5">Retard</span>
              <span>OF-2026-095 (Transpalette 3T) en retard de 4 jours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="badge badge-info mt-0.5">Transfert</span>
              <span>2 demandes Blida en attente de confirmation Chlef</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="badge badge-warning mt-0.5">SAV</span>
              <span>Ticket TKT-2026-011 (Imprimante 3D) — priorité critique</span>
            </li>
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2>OF en cours</h2>
            <Link to="/ops/orders" className="text-[12px] inline-flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              Voir tout <ArrowUpRight size={12} />
            </Link>
          </div>
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {mos.filter((m) => m.status === "In Production").slice(0, 4).map((m) => (
              <li key={m.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium tabular">{m.reference}</div>
                  <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>{m.product}</div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] tabular" style={{ color: "var(--text-muted)" }}>
                    {m.qtyProduced}/{m.qtyOrdered}
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2>Pipeline commercial</h2>
            <Link to="/crm/pipeline" className="text-[12px] inline-flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              Voir tout <ArrowUpRight size={12} />
            </Link>
          </div>
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {orders.slice(0, 4).map((o) => {
              const c = clients.find((x) => x.id === o.clientId);
              return (
                <li key={o.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium tabular">{o.reference}</div>
                    <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>{c?.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] tabular" style={{ color: "var(--text)" }}>{formatDZD(o.totalDZD)}</div>
                    <StatusBadge status={o.stage} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
