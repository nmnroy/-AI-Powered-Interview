"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CircleUserRound,
  House,
  PanelLeft,
  Sparkles,
  Target,
  UserCircle2,
  WandSparkles,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navigation = [
  { label: "Home", href: "#", icon: House },
  { label: "Practice", href: "/dashboard/practice", icon: Target },
  { label: "Progress", href: "/dashboard/progress", icon: BarChart3 },
  { label: "Generate", href: "/dashboard/generate", icon: WandSparkles },
  { label: "Profile", href: "/dashboard", icon: CircleUserRound },
];

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    void fetch("/api/user/sync", { method: "POST" }).catch(() => undefined);

    return () => undefined;
  }, []);

  const activePath = useMemo(() => pathname ?? "/dashboard", [pathname]);

  const isActive = (href: string) =>
    href === "#"
      ? activePath === "/dashboard"
      : activePath === href || activePath.startsWith(`${href}/`);

  return (
    <div className="dashboard-shell">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col px-5 py-6 backdrop-blur-xl lg:flex" style={{
          background: 'linear-gradient(180deg, #0a0f1e 0%, #080d1a 100%)',
          borderRight: '1px solid rgba(0,212,255,0.1)'
        }}>
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Interview Prep
            </p>
            <p className="text-lg font-semibold text-white">AI Dashboard</p>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
            <Link
              key={item.label}
              href={item.href === "#" ? "/dashboard" : item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-300 ${
                isActive(item.href)
                  ? "bg-cyan-400/12 text-cyan-200 ring-1 ring-cyan-400/35"
                  : "text-slate-300 hover:bg-[#111b31] hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
            );
          })}
        </nav>

        <div className="dashboard-card-soft mt-auto rounded-3xl p-4">
          <p className="text-sm font-medium text-cyan-200">Keep your streak alive</p>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            Practice daily to build interview confidence and momentum.
          </p>
        </div>
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-[#1e2d4a] bg-[#0d1526] px-5 py-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                    Interview Prep
                  </p>
                  <p className="text-lg font-semibold text-white">AI Dashboard</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-full border border-[#1e2d4a] px-3 py-1 text-sm text-slate-300"
              >
                Close
              </button>
            </div>

            <nav className="mt-10 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                <Link
                  key={item.label}
                  href={item.href === "#" ? "/dashboard" : item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-300 ${
                    isActive(item.href)
                      ? "bg-cyan-400/12 text-cyan-200 ring-1 ring-cyan-400/35"
                      : "text-slate-300 hover:bg-[#111b31] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#1e2d4a] bg-[#0a0f1e]/90 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen((value) => !value)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#1e2d4a] bg-[#0d1526] text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300 lg:hidden"
                aria-label="Toggle navigation"
              >
                <PanelLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                    Interview Prep
                  </p>
                  <p className="text-lg font-semibold text-white">AI Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <div className="dashboard-card flex items-center gap-3 rounded-2xl px-3 py-2">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName ?? "User avatar"}
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111b31] text-slate-300">
                    <UserCircle2 className="h-5 w-5" />
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">
                    {user?.fullName ?? user?.firstName ?? "Member"}
                  </p>
                  <p className="text-xs text-slate-400">Clerk account</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-page-transition flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8" style={{
          background: 
            'radial-gradient(ellipse 70% 40% at 100% 0%, rgba(0,212,255,0.05), transparent), ' +
            'radial-gradient(ellipse 50% 40% at 0% 100%, rgba(124,58,237,0.05), transparent), ' +
            '#0a0f1e'
        }}>{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#1e2d4a] bg-[#0d1526]/95 px-2 py-2 backdrop-blur-xl lg:hidden">
          <div className="grid grid-cols-5 gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
              <Link
                key={item.label}
                href={item.href === "#" ? "/dashboard" : item.href}
                className={`flex flex-col items-center justify-center rounded-2xl px-2 py-3 text-xs font-medium transition duration-300 ${
                  isActive(item.href)
                    ? "bg-cyan-400/12 text-cyan-200 ring-1 ring-cyan-400/35"
                    : "text-slate-300 hover:bg-[#111b31]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="mt-1 text-[11px] leading-none">{item.label}</span>
              </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}