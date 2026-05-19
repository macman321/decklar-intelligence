"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HealthBadge } from "@/components/health-badge";
import {
  Plus,
  Search,
  ArrowRight,
  Building2,
  Filter,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

const healthOptions = ["all", "green", "amber", "red"] as const;
const statusOptions = ["all", "active", "prospect", "churned"] as const;

type HealthFilter = (typeof healthOptions)[number];
type StatusFilter = (typeof statusOptions)[number];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  function loadCustomers() {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((d) => {
        setCustomers(d.customers || []);
      })
      .finally(() => setLoading(false));
  }

  async function createCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    if (res.ok) {
      toast.success("Customer created");
      setNewName("");
      setShowAdd(false);
      loadCustomers();
    } else {
      toast.error("Failed to create customer");
    }
  }

  const filtered = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesHealth =
      healthFilter === "all" || c.health_rag?.toLowerCase() === healthFilter;
    const matchesStatus =
      statusFilter === "all" || c.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesHealth && matchesStatus;
  });

  const activeFilters =
    (healthFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Customers
            </h1>
            <p className="mt-0.5 text-sm text-[rgba(255,255,255,0.7)]">
              Manage your customer accounts and track engagement
            </p>
          </div>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 bg-[#00FF40] text-[#0A0A0F] hover:bg-[#00CC33]">
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="border-[rgba(96,56,251,0.2)] bg-[rgba(19,22,32,0.95)] backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Add New Customer
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={createCustomer} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-white"
                  >
                    Customer Name
                  </Label>
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter customer name..."
                    autoFocus
                    className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdd(false)}
                    className="border-[rgba(96,56,251,0.3)] text-white hover:bg-[rgba(96,56,251,0.1)]"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[rgba(255,255,255,0.5)]" />
            <Input
              placeholder="Search customers..."
              className="pl-9 border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-[rgba(96,56,251,0.15)] bg-[rgba(13,17,23,0.6)] p-1">
              <Filter className="ml-2 h-3.5 w-3.5 text-[rgba(255,255,255,0.5)]" />
              {healthOptions.map((h) => (
                <button
                  key={h}
                  onClick={() =>
                    setHealthFilter((prev) => (prev === h ? "all" : h))
                  }
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    healthFilter === h
                      ? "bg-[#6038FB] text-white"
                      : "text-[rgba(255,255,255,0.5)] hover:text-white"
                  }`}
                >
                  {h === "all"
                    ? "All Health"
                    : h === "green"
                    ? "Healthy"
                    : h === "amber"
                    ? "At Risk"
                    : "Critical"}
                </button>
              ))}
            </div>
            {activeFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs text-[rgba(255,255,255,0.5)] hover:text-white"
                onClick={() => {
                  setHealthFilter("all");
                  setStatusFilter("all");
                }}
              >
                <X className="h-3 w-3" />
                Clear ({activeFilters})
              </Button>
            )}
          </div>
        </div>

        {/* Customer Grid */}
        {loading ? (
          <div className="py-12 text-center text-sm text-[rgba(255,255,255,0.5)]">
            Loading customers...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[rgba(96,56,251,0.2)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(96,56,251,0.15)]">
              <Building2 className="h-6 w-6 text-[rgba(255,255,255,0.5)]" />
            </div>
            <p className="text-sm font-medium text-white">
              No customers found
            </p>
            <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)]">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-[rgba(96,56,251,0.3)] text-white hover:bg-[rgba(96,56,251,0.1)]"
              onClick={() => setShowAdd(true)}
            >
              Add your first customer
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <Link key={c.id} href={`/customers/${c.id}`}>
                <Card className="group cursor-pointer border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl shadow-sm transition-all hover:border-[rgba(96,56,251,0.5)] hover:shadow-[0_0_25px_rgba(96,56,251,0.2)]">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {c.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-[rgba(255,255,255,0.5)]">
                          {c.account_type} · {c.account_manager}
                        </p>
                      </div>
                      <HealthBadge status={c.health_rag} />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[rgba(96,56,251,0.15)] pt-3 text-xs">
                      <span className="text-[rgba(255,255,255,0.5)]">
                        Status:{" "}
                        <span className="font-medium text-white capitalize">
                          {c.status}
                        </span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#7B5CFF] opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
