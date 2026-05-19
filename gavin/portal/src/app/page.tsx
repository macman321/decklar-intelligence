"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthBadge } from "@/components/health-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  AlertTriangle,
  ClipboardList,
  Phone,
  Building2,
  Search,
  ArrowRight,
  TrendingUp,
  Activity,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  account_type: string;
  status: string;
  health_rag: string;
  last_contact: string | null;
  created_at: string;
  account_manager: string;
}

interface Stats {
  total: number;
  active: number;
  atRisk: number;
  green: number;
  amber: number;
  red: number;
  openItems: number;
  calls: number;
}

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []));
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalHealth = (stats?.green ?? 0) + (stats?.amber ?? 0) + (stats?.red ?? 0);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="mt-0.5 text-sm text-[rgba(255,255,255,0.7)]">
              Overview of your customer portfolio and key metrics
            </p>
          </div>
          <Link href="/customers">
            <Button variant="outline" size="sm" className="gap-1.5 border-[rgba(96,56,251,0.3)] bg-[rgba(96,56,251,0.1)] text-white hover:bg-[rgba(96,56,251,0.2)] hover:border-[rgba(96,56,251,0.5)]">
              View All Customers
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard
            title="Customers"
            value={stats?.total ?? 0}
            icon={Building2}
            color="violet"
          />
          <StatCard
            title="At Risk"
            value={stats?.atRisk ?? 0}
            icon={AlertTriangle}
            color="amber"
          />
          <StatCard
            title="Open Items"
            value={stats?.openItems ?? 0}
            icon={ClipboardList}
            color="red"
          />
          <StatCard
            title="Calls"
            value={stats?.calls ?? 0}
            icon={Phone}
            color="green"
          />
          <StatCard
            title="Active"
            value={stats?.active ?? 0}
            icon={Users}
            color="violet"
          />
        </div>

        {/* Main grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Health Distribution */}
          <Card className="lg:col-span-1 border-[rgba(96,56,251,0.2)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#7B5CFF]" />
                <CardTitle className="text-sm font-semibold text-white">
                  Health Distribution
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {totalHealth > 0 ? (
                <>
                  <div className="flex items-center justify-center py-2">
                    <div className="relative h-32 w-32">
                      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="15.915" fill="none"
                          stroke="#00FF40" strokeWidth="3"
                          strokeDasharray={`${(stats?.green ?? 0) / totalHealth * 100} ${100 - (stats?.green ?? 0) / totalHealth * 100}`}
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="18" cy="18" r="15.915" fill="none"
                          stroke="#F59E0B" strokeWidth="3"
                          strokeDasharray={`${(stats?.amber ?? 0) / totalHealth * 100} ${100 - (stats?.amber ?? 0) / totalHealth * 100}`}
                          strokeDashoffset={`${-(stats?.green ?? 0) / totalHealth * 100}`}
                        />
                        <circle
                          cx="18" cy="18" r="15.915" fill="none"
                          stroke="#EF4444" strokeWidth="3"
                          strokeDasharray={`${(stats?.red ?? 0) / totalHealth * 100} ${100 - (stats?.red ?? 0) / totalHealth * 100}`}
                          strokeDashoffset={`${-((stats?.green ?? 0) + (stats?.amber ?? 0)) / totalHealth * 100}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{totalHealth}</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[rgba(255,255,255,0.5)]">Total</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <HealthBar label="Healthy" count={stats?.green ?? 0} total={totalHealth} color="#00FF40" />
                    <HealthBar label="At Risk" count={stats?.amber ?? 0} total={totalHealth} color="#F59E0B" />
                    <HealthBar label="Critical" count={stats?.red ?? 0} total={totalHealth} color="#EF4444" />
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-sm text-[rgba(255,255,255,0.5)]">
                  No customer health data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Customers */}
          <Card className="lg:col-span-2 border-[rgba(96,56,251,0.2)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#7B5CFF]" />
                <CardTitle className="text-sm font-semibold text-white">
                  Recent Customers
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[rgba(255,255,255,0.5)]" />
                <Input
                  placeholder="Search customers..."
                  className="pl-9 border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="mt-4 space-y-1.5">
                {loading ? (
                  <div className="py-8 text-center text-sm text-[rgba(255,255,255,0.5)]">Loading customers...</div>
                ) : filtered.length === 0 ? (
                  <div className="py-8 text-center text-sm text-[rgba(255,255,255,0.5)]">
                    No customers found.
                  </div>
                ) : (
                  filtered.slice(0, 8).map((c) => (
                    <Link key={c.id} href={`/customers/${c.id}`}>
                      <div className="group flex items-center justify-between rounded-lg border border-[rgba(96,56,251,0.15)] bg-[rgba(13,17,23,0.6)] px-4 py-3 transition-all hover:border-[rgba(96,56,251,0.4)] hover:shadow-[0_0_20px_rgba(96,56,251,0.15)]">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                          <p className="text-xs text-[rgba(255,255,255,0.5)]">
                            {c.account_type} · {c.account_manager}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <HealthBadge status={c.health_rag} />
                          <ArrowRight className="h-3.5 w-3.5 text-[rgba(255,255,255,0.5)] opacity-0 transition-opacity group-hover:opacity-100 text-[#7B5CFF]" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All customers grid */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">All Customers</h2>
            <span className="text-xs font-medium text-[rgba(255,255,255,0.5)]">
              {filtered.length} total
            </span>
          </div>
          {loading ? (
            <div className="py-8 text-center text-sm text-[rgba(255,255,255,0.5)]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[rgba(96,56,251,0.2)] p-12 text-center">
              <p className="text-sm text-[rgba(255,255,255,0.5)]">No customers found.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((c) => (
                <Link key={c.id} href={`/customers/${c.id}`}>
                  <Card className="group cursor-pointer border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl shadow-sm transition-all hover:border-[rgba(96,56,251,0.4)] hover:shadow-[0_0_25px_rgba(96,56,251,0.2)]">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-white truncate">{c.name}</h3>
                          <p className="mt-0.5 text-xs text-[rgba(255,255,255,0.5)]">
                            {c.account_type} · {c.account_manager}
                          </p>
                        </div>
                        <HealthBadge status={c.health_rag} />
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-[rgba(96,56,251,0.15)] pt-3 text-xs text-[rgba(255,255,255,0.5)]">
                        <span>Status: <span className="font-medium text-white">{c.status}</span></span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-[#7B5CFF]" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: "violet" | "green" | "amber" | "red";
}) {
  const colorMap = {
    violet: { icon: "text-[#7B5CFF]", bg: "bg-[rgba(96,56,251,0.15)]", ring: "ring-[rgba(96,56,251,0.3)]", text: "text-[#6038FB]" },
    green: { icon: "text-[#00FF40]", bg: "bg-[rgba(0,255,64,0.1)]", ring: "ring-[rgba(0,255,64,0.2)]", text: "text-[#00CC33]" },
    amber: { icon: "text-[#F59E0B]", bg: "bg-[rgba(245,158,11,0.1)]", ring: "ring-[rgba(245,158,11,0.2)]", text: "text-[#F59E0B]" },
    red: { icon: "text-[#EF4444]", bg: "bg-[rgba(239,68,68,0.1)]", ring: "ring-[rgba(239,68,68,0.2)]", text: "text-[#EF4444]" },
  };
  const c = colorMap[color];

  return (
    <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl shadow-sm transition-all hover:border-[rgba(96,56,251,0.3)]">
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.5)]">
              {title}
            </p>
            <p className={`mt-1 text-2xl font-bold tabular-nums tracking-tight ${c.text}`}>
              {value}
            </p>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg} ${c.ring} ring-1`}>
            <Icon className={`h-5 w-5 ${c.icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HealthBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 w-24">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs font-medium text-white">{label}</span>
      </div>
      <div className="flex-1 rounded-full bg-[rgba(255,255,255,0.1)] h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-10 text-right text-xs font-semibold tabular-nums text-white">{count}</span>
    </div>
  );
}
