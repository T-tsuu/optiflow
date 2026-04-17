import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, KpiCard, PageHeader } from "@/components/AppShell";
import { useStockItems } from "@/lib/hooks";
import type { StockItem } from "@/lib/mockData";
import { QrCode, Plus, Search, X, ScanLine, Check } from "lucide-react";

export const Route = createFileRoute("/stock/inventory")({
  head: () => ({ meta: [{ title: "Inventaire — OptiFlow" }] }),
  component: InventoryPage,
});

function InventoryPage() {
  const { data } = useStockItems();
  const [scanOpen, setScanOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Tous");

  const cats = ["Tous", "Raw Material", "Spare Part", "WIP", "Finished Good"];
  const filtered = data.filter(
    (i) =>
      (cat === "Tous" || i.category === cat) &&
      (q === "" || i.name.toLowerCase().includes(q.toLowerCase()) || i.reference.toLowerCase().includes(q.toLowerCase())),
  );

  const totalItems = data.length;
  const lowStock = data.filter((i) => i.qtyChlef + i.qtyBlida < i.minThreshold).length;
  const totalChlef = data.reduce((s, i) => s + i.qtyChlef, 0);
  const totalBlida = data.reduce((s, i) => s + i.qtyBlida, 0);

  return (
    <AppShell breadcrumbs={["OptiFlow", "Stock Bridge", "Inventaire"]}>
      <PageHeader
        title="Inventaire unifié"
        subtitle="Stock Chlef + Blida — synchronisé en temps réel"
        actions={
          <>
            <button onClick={() => setScanOpen(true)} className="btn-secondary inline-flex items-center gap-1.5">
              <ScanLine size={14} /> Scanner QR
            </button>
            <button className="btn-primary inline-flex items-center gap-1.5">
              <Plus size={14} /> Nouvel article
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Articles référencés" value={totalItems} />
        <KpiCard label="Sous le seuil minimum" value={lowStock} delta="Réapprovisionner" tone="warning" />
        <KpiCard label="Stock Chlef (unités)" value={totalChlef.toLocaleString("fr-DZ")} />
        <KpiCard label="Stock Blida (unités)" value={totalBlida.toLocaleString("fr-DZ")} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
          <input className="input pl-8 w-72" placeholder="Rechercher article ou référence…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex gap-1.5">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="rounded-md px-3 py-1.5 text-[12px] font-medium"
              style={{
                backgroundColor: cat === c ? "var(--navy)" : "var(--surface)",
                color: cat === c ? "var(--text-inverse)" : "var(--text)",
                border: `1px solid ${cat === c ? "var(--navy)" : "var(--border)"}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead style={{ backgroundColor: "var(--surface-2)" }}>
            <tr className="text-left text-[12px]" style={{ color: "var(--text-muted)" }}>
              <th className="px-4 py-2.5 font-medium">Référence</th>
              <th className="px-4 py-2.5 font-medium">Désignation</th>
              <th className="px-4 py-2.5 font-medium">Catégorie</th>
              <th className="px-4 py-2.5 font-medium text-right">Chlef</th>
              <th className="px-4 py-2.5 font-medium text-right">Blida</th>
              <th className="px-4 py-2.5 font-medium text-right">Total</th>
              <th className="px-4 py-2.5 font-medium text-right">Seuil</th>
              <th className="px-4 py-2.5 font-medium">Fournisseur</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => {
              const total = it.qtyChlef + it.qtyBlida;
              const low = total < it.minThreshold;
              return (
                <tr key={it.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3 tabular font-medium">{it.reference}</td>
                  <td className="px-4 py-3">
                    <div>{it.name}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>Unité : {it.unit}</div>
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: "var(--text-muted)" }}>{it.category}</td>
                  <td className="px-4 py-3 text-right tabular">{it.qtyChlef}</td>
                  <td className="px-4 py-3 text-right tabular">{it.qtyBlida}</td>
                  <td className="px-4 py-3 text-right tabular font-medium" style={{ color: low ? "var(--error)" : "var(--text)" }}>{total}</td>
                  <td className="px-4 py-3 text-right tabular text-[12px]" style={{ color: "var(--text-muted)" }}>{it.minThreshold}</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: "var(--text-muted)" }}>{it.supplier}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded p-1.5" style={{ color: "var(--text-muted)" }} aria-label="QR">
                      <QrCode size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {scanOpen && <ScanModal items={data} onClose={() => setScanOpen(false)} />}
    </AppShell>
  );
}

function ScanModal({ items, onClose }: { items: StockItem[]; onClose: () => void }) {
  const [step, setStep] = useState<"scan" | "form" | "done">("scan");
  const [selected, setSelected] = useState<StockItem | null>(null);
  const [type, setType] = useState("Production Consumption");
  const [qty, setQty] = useState(12);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="card w-full max-w-md p-6 m-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2>Nouveau mouvement de stock</h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              Scannez le code QR sur le colis pour identifier l'article.
            </p>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}><X size={16} /></button>
        </div>

        {step === "scan" && (
          <>
            <div
              className="rounded-lg border-2 border-dashed h-56 flex flex-col items-center justify-center mb-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-2)" }}
            >
              <ScanLine size={36} style={{ color: "var(--text-faint)" }} />
              <div className="mt-2 text-[13px]" style={{ color: "var(--text-muted)" }}>Pointez la caméra vers le QR…</div>
              <div className="mt-1 text-[11px]" style={{ color: "var(--text-faint)" }}>Démo — sélectionnez un article ci-dessous</div>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {items.slice(0, 5).map((it) => (
                <button
                  key={it.id}
                  onClick={() => { setSelected(it); setStep("form"); }}
                  className="w-full text-left rounded-md border px-3 py-2 text-[13px] hover:bg-[var(--surface-2)]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex justify-between">
                    <span>{it.name}</span>
                    <span className="tabular text-[12px]" style={{ color: "var(--text-muted)" }}>{it.reference}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "form" && selected && (
          <>
            <div className="rounded-md border p-3 mb-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-2)" }}>
              <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>Article identifié</div>
              <div className="font-medium">{selected.name}</div>
              <div className="text-[12px] tabular" style={{ color: "var(--text-muted)" }}>
                {selected.reference} · Chlef : {selected.qtyChlef} {selected.unit}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label block mb-1.5">Type de mouvement</label>
                <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                  <option>Incoming</option>
                  <option>Production Consumption</option>
                  <option>Transfer</option>
                  <option>Sale</option>
                  <option>Scrap</option>
                </select>
              </div>
              <div>
                <label className="label block mb-1.5">Quantité</label>
                <input type="number" className="input" value={qty} onChange={(e) => setQty(parseInt(e.target.value || "0"))} />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setStep("scan")} className="btn-secondary flex-1">Retour</button>
              <button onClick={() => setStep("done")} className="btn-primary flex-1">Confirmer</button>
            </div>
          </>
        )}

        {step === "done" && (
          <div className="text-center py-6">
            <div
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--success) 12%, white)", color: "var(--success)" }}
            >
              <Check size={22} />
            </div>
            <div className="text-[15px] font-semibold">Mouvement enregistré</div>
            <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>
              Stock mis à jour en temps réel via Supabase.
            </div>
            <button onClick={onClose} className="btn-primary mt-5">Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
}
