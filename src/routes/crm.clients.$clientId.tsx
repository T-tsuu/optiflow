import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, StatusBadge } from "@/components/AppShell";
import { clients, commercialOrders, serviceTickets, formatDZD } from "@/lib/mockData";
import { ArrowLeft, Mail, Phone, MapPin, Building2, FileText, Wrench, Plus } from "lucide-react";

export const Route = createFileRoute("/crm/clients/$clientId")({
  head: () => ({ meta: [{ title: "Profil client — OptiFlow" }] }),
  component: ClientProfile,
});

function ClientProfile() {
  const { clientId } = Route.useParams();
  const client = clients.find((c) => c.id === clientId);
  if (!client) {
    return (
      <AppShell breadcrumbs={["OptiFlow", "CRM Connect", "Client introuvable"]}>
        <p>Client introuvable.</p>
      </AppShell>
    );
  }

  const orders = commercialOrders.filter((o) => o.clientId === client.id);
  const tickets = serviceTickets.filter((t) => t.clientId === client.id);
  const totalCA = orders.reduce((s, o) => s + o.totalDZD, 0);

  return (
    <AppShell breadcrumbs={["OptiFlow", "CRM Connect", "Clients", client.company]}>
      <Link to="/crm/clients" className="inline-flex items-center gap-1 text-[12px] mb-3" style={{ color: "var(--text-muted)" }}>
        <ArrowLeft size={12} /> Retour à la liste
      </Link>

      <PageHeader
        title={client.company}
        subtitle={`${client.sector} · ${client.wilaya} · ${client.type}`}
        actions={
          <>
            <button className="btn-secondary inline-flex items-center gap-1.5"><FileText size={13} /> Devis</button>
            <button className="btn-primary inline-flex items-center gap-1.5"><Plus size={14} /> Nouvelle commande</button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <h2 className="mb-3">Coordonnées</h2>
          <div className="space-y-2.5 text-[13px]">
            <div className="flex items-center gap-2"><Building2 size={13} style={{ color: "var(--text-muted)" }} /> {client.contact}</div>
            <div className="flex items-center gap-2"><Phone size={13} style={{ color: "var(--text-muted)" }} /> <span className="tabular">{client.phone}</span></div>
            <div className="flex items-center gap-2"><Mail size={13} style={{ color: "var(--text-muted)" }} /> {client.email}</div>
            <div className="flex items-center gap-2"><MapPin size={13} style={{ color: "var(--text-muted)" }} /> {client.wilaya}</div>
          </div>
          <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3" style={{ borderColor: "var(--border)" }}>
            <div>
              <div className="label">CA total</div>
              <div className="text-[15px] font-semibold tabular mt-0.5">{formatDZD(totalCA)}</div>
            </div>
            <div>
              <div className="label">Commandes</div>
              <div className="text-[15px] font-semibold tabular mt-0.5">{orders.length}</div>
            </div>
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-3">Historique des commandes</h2>
          {orders.length === 0 && <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>Aucune commande pour ce client.</p>}
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
                <div>
                  <div className="text-[13px] font-medium tabular">{o.reference}</div>
                  <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {o.products.map((p) => `${p.qty}× ${p.name}`).join(", ")}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--text-faint)" }}>
                    Livraison <span className="tabular">{o.deliveryDate}</span> · {o.paymentTerms}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-[13px] tabular font-medium">{formatDZD(o.totalDZD)}</div>
                  <StatusBadge status={o.stage} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2"><Wrench size={14} /> Tickets SAV</h2>
            <Link to="/crm/tickets" className="text-[12px]" style={{ color: "var(--text-muted)" }}>Voir tout →</Link>
          </div>
          {tickets.length === 0 ? (
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>Aucun ticket pour ce client.</p>
          ) : (
            <table className="w-full text-[13px]">
              <thead style={{ color: "var(--text-muted)" }}>
                <tr className="text-left text-[12px]">
                  <th className="py-2 font-medium">Référence</th>
                  <th className="py-2 font-medium">Produit / Série</th>
                  <th className="py-2 font-medium">Type</th>
                  <th className="py-2 font-medium">Priorité</th>
                  <th className="py-2 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="py-2.5 tabular font-medium">{t.reference}</td>
                    <td className="py-2.5">{t.product} <span className="text-[11px] tabular" style={{ color: "var(--text-faint)" }}>· {t.serial}</span></td>
                    <td className="py-2.5">{t.type}</td>
                    <td className="py-2.5">{t.priority}</td>
                    <td className="py-2.5"><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShell>
  );
}
