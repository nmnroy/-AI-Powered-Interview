"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  House,
  Target,
  WandSparkles,
  Menu,
  X
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Practice", href: "/dashboard/practice", icon: Target },
  { label: "Progress", href: "/dashboard/progress", icon: BarChart3 },
  { label: "Generate", href: "/dashboard/generate", icon: WandSparkles },
];

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    void fetch("/api/user/sync", { method: "POST" }).catch(() => undefined);
  }, []);

  const activePath = useMemo(() => pathname ?? "/dashboard", [pathname]);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return activePath === "/dashboard";
    }
    return activePath.startsWith(href);
  };

  const firstName = user?.firstName ?? "User";
  const initial = firstName.charAt(0).toUpperCase();

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', background: 'var(--accent)' }} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
          PrepAI
        </span>
      </div>

      {/* Nav */}
      <nav style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '40px',
                padding: '0 12px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 500,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: active ? 'var(--accent-dim)' : 'transparent',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              className="hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            >
              <item.icon style={{ width: '16px', height: '16px' }} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', 
          color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-display)'
        }}>
          {initial}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2 }}>{firstName}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.2 }}>Free plan</span>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-void)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex" style={{
        width: '220px',
        flexDirection: 'column',
        background: 'var(--bg-base)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '24px 16px',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        zIndex: 40
      }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex w-[220px] flex-col" style={{
            background: 'var(--bg-base)',
            borderRight: '1px solid var(--border-subtle)',
            padding: '24px 16px',
            height: '100%'
          }}>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-[220px]">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              PrepAI
            </span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-[var(--text-secondary)]">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* The children are the dashboard pages themselves */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}