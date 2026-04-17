import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Bot, Send, Sparkles, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "OptiFlow Assistant — OptiFlow" }] }),
  component: AssistantPage,
});

interface Msg { role: "user" | "assistant"; text: string }

const suggestions = [
  "Combien d'unités de MIG 250A sont disponibles à Blida ?",
  "Quels ordres de fabrication sont en retard cette semaine ?",
  "Quel client n'a pas encore reçu sa livraison ?",
  "Génère un rapport de production de la journée.",
  "Vérifie les stocks sous le seuil minimum.",
];

const mockReplies: Record<string, string> = {
  "stock":
    "État du stock à Blida pour Poste à souder MIG 250A : **7 unités disponibles**. Seuil minimum : 3. Aucune action requise.\n\nÀ Chlef, 4 unités supplémentaires sont prêtes (référence FG-WLD-MIG250).",
  "retard":
    "3 ordres sont en retard cette semaine :\n\n• **OF-2026-095** — Transpalette lourd 3T (4 jours) — bloqué sur Plieuse Hydra (maintenance)\n• **OF-2026-087** — Poste à souder MIG 250A (2 jours)\n• **OF-2026-091** — Machine CNC 1530 (1 jour)\n\nCliquez sur une référence pour ouvrir l'OF.",
  "livraison":
    "1 commande reste à livrer aujourd'hui :\n\n• **CMD-2026-063** — Cosider Construction (20× Transpalette 3T) — livraison prévue le 17/04, statut **In Production** côté Chlef.",
  "rapport":
    "**Rapport de production — 16/04/2026**\n\n• OF actifs : 3\n• Unités produites aujourd'hui : 12\n• OF en retard : 3\n• Machines actives : 3 / 5 (Plieuse Hydra en maintenance)\n• Charge moyenne : 50%\n\nRecommandation : redéployer 1 opérateur du poste 3D (idle) vers la finition MIG.",
  "seuil":
    "2 articles sont sous le seuil minimum :\n\n• **Tôle inox 1mm** — 22 / 25 (Chlef) — fournisseur Imetal Algiers (délai 21 j)\n• **Servo-moteur 400W** — 8 / 8 (total Chlef+Blida) — fournisseur Yaskawa (délai 60 j)\n\nProposition de commande : 30 feuilles inox + 5 servo-moteurs.",
};

function reply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("stock") || q.includes("disponible") || q.includes("mig") || q.includes("blida")) return mockReplies.stock;
  if (q.includes("retard")) return mockReplies.retard;
  if (q.includes("livraison") || q.includes("livré")) return mockReplies.livraison;
  if (q.includes("rapport") || q.includes("production")) return mockReplies.rapport;
  if (q.includes("seuil") || q.includes("alerte")) return mockReplies.seuil;
  return "Je peux répondre à des questions sur les stocks, les ordres de fabrication, les livraisons et générer des rapports. Essayez l'une des suggestions ci-dessous.";
}

function AssistantPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text:
        "Bonjour Karim. Je suis l'assistant OptiFlow. Posez-moi une question sur la production, les stocks ou les clients — en français ou en darija.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "assistant", text: reply(text) }]);
    }, 600);
  };

  return (
    <AppShell breadcrumbs={["OptiFlow", "OptiFlow Assistant"]}>
      <PageHeader
        title="OptiFlow Assistant"
        subtitle="Posez vos questions sur la production, les stocks et les clients — en français ou en darija."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="card flex flex-col h-[68vh] lg:col-span-3">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: m.role === "user" ? "var(--surface-2)" : "var(--navy)",
                    color: m.role === "user" ? "var(--text)" : "var(--amber)",
                  }}
                >
                  {m.role === "user" ? <UserIcon size={13} /> : <Bot size={13} />}
                </div>
                <div
                  className={`max-w-[75%] rounded-lg px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-line ${
                    m.role === "user" ? "" : ""
                  }`}
                  style={{
                    backgroundColor: m.role === "user" ? "var(--navy)" : "var(--surface-2)",
                    color: m.role === "user" ? "var(--text-inverse)" : "var(--text)",
                  }}
                  dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
                />
              </div>
            ))}
          </div>

          <div className="border-t p-3" style={{ borderColor: "var(--border)" }}>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre question…"
                className="input"
              />
              <button type="submit" className="btn-primary inline-flex items-center gap-1.5">
                <Send size={13} /> Envoyer
              </button>
            </form>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: "var(--amber)" }} />
            <h2>Suggestions</h2>
          </div>
          <div className="space-y-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left rounded-md border px-3 py-2 text-[12.5px] transition-colors hover:bg-[var(--surface-2)]"
                style={{ borderColor: "var(--border)" }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t text-[11px] leading-relaxed" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            L'assistant accède en lecture aux données Supabase de votre rôle. Aucune écriture n'est effectuée sans confirmation.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
