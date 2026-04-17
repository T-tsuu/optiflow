import { Bell, Search } from "lucide-react";
import { currentUser } from "@/lib/mockData";

export function TopBar({ breadcrumbs }: { breadcrumbs: string[] }) {
  return (
    <header
      className="flex items-center justify-between border-b px-6 py-3"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <nav className="flex items-center gap-1.5 text-[13px]">
        {breadcrumbs.map((b, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span
              style={{
                color: i === breadcrumbs.length - 1 ? "var(--text)" : "var(--text-muted)",
                fontWeight: i === breadcrumbs.length - 1 ? 500 : 400,
              }}
            >
              {b}
            </span>
            {i < breadcrumbs.length - 1 && (
              <span style={{ color: "var(--text-faint)" }}>/</span>
            )}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-faint)" }}
          />
          <input
            placeholder="Rechercher…"
            className="rounded-md border pl-8 pr-3 py-1.5 text-[13px] w-64"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
          />
        </div>
        <button
          className="relative rounded-md p-2"
          style={{ backgroundColor: "var(--surface-2)" }}
          aria-label="Notifications"
        >
          <Bell size={15} strokeWidth={1.75} />
          <span
            className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "var(--amber)" }}
          />
        </button>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold"
          style={{ backgroundColor: "var(--navy)", color: "var(--amber)" }}
        >
          {currentUser.initials}
        </div>
      </div>
    </header>
  );
}