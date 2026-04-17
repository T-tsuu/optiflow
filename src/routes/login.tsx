import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — OptiFlow" },
      { name: "description", content: "Plateforme industrielle pour PME algériennes." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("k.bensalem@2mp.dz");
  const [password, setPassword] = useState("••••••••");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ backgroundColor: "var(--bg)" }}>
      {/* Left brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between px-12 py-10"
        style={{ backgroundColor: "var(--navy)", color: "var(--text-inverse)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded"
            style={{ backgroundColor: "var(--amber)", color: "var(--navy)" }}
          >
            <span className="text-[14px] font-bold">O</span>
          </div>
          <div className="text-[15px] font-semibold">OptiFlow</div>
        </div>

        <div className="max-w-md">
          <div className="text-[12px] uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
            Manage. Track. Deliver.
          </div>
          <h2 className="text-[28px] font-semibold leading-tight">
            Connectez l'atelier de Chlef au point de vente de Blida — en temps réel.
          </h2>
          <p className="mt-4 text-[14px]" style={{ color: "var(--text-faint)" }}>
            Production, stock, clients et service après-vente dans une seule plateforme conçue
            pour les PME industrielles algériennes.
          </p>
        </div>

        <div className="text-[12px]" style={{ color: "var(--text-faint)" }}>
          © 2026 OptiFlow · Pilote 2MP Industry SPA
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-[22px] font-semibold">Connexion</h1>
          <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
            Accédez à votre espace OptiFlow.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="label block mb-1.5">Email professionnel</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
                <input
                  className="input pl-9"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label">Mot de passe</label>
                <a href="#" className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  Oublié ?
                </a>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
                <input
                  className="input pl-9"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
              Se connecter <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-6 rounded-md border p-3 text-[12px]" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            Démo — utilisez n'importe quel identifiant pour entrer.
          </div>

          <div className="mt-8 text-center text-[12px]" style={{ color: "var(--text-faint)" }}>
            <Link to="/dashboard" style={{ color: "var(--text-muted)" }}>
              Aperçu sans connexion →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
