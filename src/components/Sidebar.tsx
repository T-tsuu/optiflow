import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Factory,
  Boxes,
  Users,
  Bot,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { currentUser } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const sections = [
  {
    label: "Vue d'ensemble",
    items: [{ to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard }],
  },
  {
    label: "Ops Core",
    items: [
      { to: "/ops/orders", label: "Ordres de fabrication", icon: Factory },
      { to: "/ops/production", label: "Production", icon: ChevronRight },
    ],
  },
  {
    label: "Stock Bridge",
    items: [
      { to: "/stock/inventory", label: "Inventaire", icon: Boxes },
      { to: "/stock/transfers", label: "Transferts inter-sites", icon: ChevronRight },
    ],
  },
  {
    label: "CRM Connect",
    items: [
      { to: "/crm/clients", label: "Clients", icon: Users },
      { to: "/crm/pipeline", label: "Pipeline commercial", icon: ChevronRight },
      { to: "/crm/tickets", label: "Service après-vente", icon: ChevronRight },
    ],
  },
  {
    label: "IA",
    items: [{ to: "/assistant", label: "OptiFlow Assistant", icon: Bot }],
  },
] as const;

export function Sidebar() {
  const location = useLocation();
  return (
    <aside
      className="flex h-screen w-[240px] flex-col"
      style={{ backgroundColor: "var(--navy)", color: "var(--text-inverse)" }}
    >
      <div className="flex items-center gap-2 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div
          className="flex h-7 w-7 items-center justify-center rounded"
          style={{ backgroundColor: "var(--amber)", color: "var(--navy)" }}
        >
          <span className="text-[13px] font-bold">O</span>
        </div>
        <div className="leading-tight">
          <div className="text-[14px] font-semibold tracking-tight">OptiFlow</div>
          <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>
            Manage. Track. Deliver.
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map((sec) => (
          <div key={sec.label}>
            <div
              className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-faint)" }}
            >
              {sec.label}
            </div>
            <ul className="space-y-0.5">
              {sec.items.map((it) => {
                const active = location.pathname === it.to || location.pathname.startsWith(it.to + "/");
                const Icon = it.icon;
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className={cn(
                        "flex items-center gap-2.5 rounded px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                      )}
                      style={
                        active
                          ? { backgroundColor: "var(--navy-light)", color: "var(--amber)" }
                          : { color: "var(--text-inverse)" }
                      }
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.backgroundColor = "var(--navy-light)";
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <Icon size={16} strokeWidth={1.75} />
                      <span>{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t px-3 py-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold"
            style={{ backgroundColor: "var(--navy-light)", color: "var(--amber)" }}
          >
            {currentUser.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium truncate">{currentUser.name}</div>
            <div className="text-[11px] truncate" style={{ color: "var(--text-faint)" }}>
              {currentUser.role} · {currentUser.site}
            </div>
          </div>
        </div>
        <div className="mt-1 flex gap-1">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 rounded px-2 py-1.5 text-[12px]"
            style={{ color: "var(--text-faint)" }}
          >
            <Settings size={13} />
            Paramètres
          </button>
          <Link
            to="/login"
            className="flex-1 flex items-center justify-center gap-1.5 rounded px-2 py-1.5 text-[12px]"
            style={{ color: "var(--text-faint)" }}
          >
            <LogOut size={13} />
            Quitter
          </Link>
        </div>
      </div>
    </aside>
  );
}
