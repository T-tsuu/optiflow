import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, KpiCard, PageHeader, StatusBadge } from "@/components/AppShell";
import { useServiceTickets } from "@/lib/hooks";
import { clients } from "@/lib/mockData";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/crm/tickets")({
  head: () => ({ meta: [{ title: "Service après-vente — OptiFlow" }] }),
  component: TicketsPage,
});

function TicketsPage() {
  const { data } = useServiceTickets();
  const [filter, setFilter] = useState("Tous");

  const open = data.filter((t) => !["Resolved", "Closed"].includes(t.status)).length;
  const critical = data.filter((t) => t.priority === "Critique").length;
  const resolved = data.filter((t) => ["Resolved", "Closed"].includes(t.status)).length;

  const tabs = ["Tous", "Open", "Assigned", "In Progress", "Resolved", "Closed"];
  const list = filter === "Tous" ? data : data.filter((t) => t.status === filter);

  const priorityColor = (p: string) =>
    p === "Critique" ? "var(--error)" :
    p === "Haute"    ? "var(--warning)" :
    p === "Moyenne"  ? "var(--text)" : "var(--text-muted)";

  return (
    <AppShell breadcrumbs={["OptiFlow", "CRM Connect", "Service après-vente"]}>
      <PageHeader
        title="Tickets de service après-vente"
        subtitle="Suivi des interventions et historique par client"
        actions={
          <button className="btn-primary inline-flex items-center gap-1.5">
            <Plus size={14} /> Ouvrir un ticket
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Tickets ouverts" value={open} delta="Action requise" tone="warning" />
        <KpiCard label="Critiques" value={critical} delta="Priorité immédiate" tone="error" />
        <KpiCard label="Résolus ce mois" value={resolved} tone="success" />
        <KpiCard label="Délai moyen de résolution" value="2.4 j" delta="-18% vs mois -1" tone="success" />
      </div>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {tabs.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="rounded-md px-3 py-1.5 text-[12px] font-medium"
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

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead style={{ backgroundColor: "var(--surface-2)" }}>
            <tr className="text-left text-[12px]" style={{ color: "var(--text-muted)" }}>
              <th className="px-4 py-2.5 font-medium">Référence</th>
              <th className="px-4 py-2.5 font-medium">Client</th>
              <th className="px-4 py-2.5 font-medium">Produit / Série</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Priorité</th>
              <th className="px-4 py-2.5 font-medium">Technicien</th>
              <th className="px-4 py-2.5 font-medium">Site</th>
              <th className="px-4 py-2.5 font-medium">Ouvert le</th>
              <th className="px-4 py-2.5 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => {
              const c = clients.find((x) => x.id === t.clientId);
              return (
                <tr key={t.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3 tabular font-medium">{t.reference}</td>
                  <td className="px-4 py-3">{c?.company}</td>
                  <td className="px-4 py-3">
                    <div>{t.product}</div>
                    <div className="text-[11px] tabular" style={{ color: "var(--text-faint)" }}>{t.serial}</div>
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: "var(--text-muted)" }}>{t.type}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: priorityColor(t.priority) }}>{t.priority}</td>
                  <td className="px-4 py-3">{t.technician}</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: "var(--text-muted)" }}>{t.site}</td>
                  <td className="px-4 py-3 tabular text-[12px]" style={{ color: "var(--text-muted)" }}>{t.openedAt}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
