"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, BarChart3, Sparkles, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Target, label: "Practice", href: "/dashboard/practice" },
  { icon: BarChart3, label: "Progress", href: "/dashboard/progress" },
  { icon: Sparkles, label: "Generate", href: "/dashboard/generate" },
];

export default function DashboardSegmentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-void)' }}>
      {/* SIDEBAR */}
      <aside style={{ 
        width: '220px', 
        background: 'var(--bg-base)', 
        borderRight: '1px solid var(--border-subtle)', 
        padding: '24px 16px', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <span style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '2px' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>
            PrepAI
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-body)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent)' : 'none',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-elevated)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '24px', 
              height: '24px', 
              background: 'var(--accent)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#000', 
              fontSize: '11px', 
              fontWeight: 600 
            }}>
              {user?.firstName?.[0] ?? 'U'}
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
                {user?.firstName ?? 'User'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                Free plan
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
