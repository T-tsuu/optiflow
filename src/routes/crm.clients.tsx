import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useClients } from "@/lib/hooks";
import { Plus, Search, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/crm/clients")({
  head: () => ({ meta: [{ title: "Clients — OptiFlow" }] }),
  component: ClientsPage,
});

function ClientsPage() {
  const { data } = useClients();
  const [q, setQ] = useState("");
  const filtered = data.filter((c) => c.company.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell breadcrumbs={["OptiFlow", "CRM Connect", "Clients"]}>
      <PageHeader
        title="Registre clients"
        subtitle="Gérez tous vos clients privés et institutions publiques"
        actions={
          <button className="btn-primary inline-flex items-center gap-1.5">
            <Plus size={14} /> Nouveau client
          </button>
        }
      />

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
          <input className="input pl-8" placeholder="Rechercher un client…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Link
            key={c.id}
            to="/crm/clients/$clientId"
            params={{ clientId: c.id }}
            className="card p-5 transition-colors hover:bg-[var(--surface-2)]"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[14px] font-semibold">{c.company}</div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>{c.sector}</div>
              </div>
              <span className="badge">{c.type === "Privé" ? "Privé" : "Public"}</span>
            </div>
            <div className="space-y-1.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
              <div className="flex items-center gap-2"><MapPin size={12} /> {c.wilaya}</div>
              <div className="flex items-center gap-2"><Phone size={12} className="tabular" /> <span className="tabular">{c.phone}</span></div>
              <div className="flex items-center gap-2 truncate"><Mail size={12} /> {c.email}</div>
            </div>
            <div className="mt-3 pt-3 border-t flex items-center justify-between text-[12px]" style={{ borderColor: "var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>Commercial</span>
              <span className="font-medium">{c.rep}</span>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
