"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Truck,
  Thermometer,
  Package,
  Users,
  BarChart3,
  Shield,
  Globe,
} from "lucide-react";
import Link from "next/link";

interface OnboardingData {
  name: string;
  accountType: string;
  industry: string;
  shipmentMode: string;
  coldChain: boolean;
  tempThresholds: string;
  shockMonitoring: boolean;
  humidityMonitoring: boolean;
  numLanes: string;
  numUsers: string;
  publicTracking: boolean;
  eproofDeparture: boolean;
  eproofDelivery: boolean;
  waypointAlerts: boolean;
  pharmaMode: boolean;
  contacts: { name: string; title: string; email: string; phone: string; role: string }[];
}

const STEPS = [
  { id: "basics", label: "Basics", icon: Building2 },
  { id: "deployment", label: "Deployment", icon: Truck },
  { id: "capabilities", label: "Capabilities", icon: Shield },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "review", label: "Review", icon: CheckCircle2 },
];

export default function OnboardPage() {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [createdCustomerId, setCreatedCustomerId] = useState<string | null>(null);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    accountType: "Standard",
    industry: "",
    shipmentMode: "Truck",
    coldChain: false,
    tempThresholds: "",
    shockMonitoring: false,
    humidityMonitoring: false,
    numLanes: "",
    numUsers: "",
    publicTracking: false,
    eproofDeparture: false,
    eproofDelivery: false,
    waypointAlerts: false,
    pharmaMode: false,
    contacts: [{ name: "", title: "", email: "", phone: "", role: "primary" }],
  });

  function updateField<K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function saveCustomer() {
    setSaving(true);
    try {
      // Create customer
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          account_type: data.accountType,
          health_rag: "green",
          status: "active",
        }),
      });
      const customerData = await res.json();
      const customerId = customerData.customer?.id;
      if (!customerId) throw new Error("Failed to create customer");

      // Add contacts
      for (const contact of data.contacts.filter((c) => c.name.trim())) {
        await fetch(`/api/customers/${customerId}/contacts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contact),
        });
      }

      // Add deployment note as open item
      await fetch(`/api/customers/${customerId}/open-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: `Deployment setup: ${data.shipmentMode}, ${data.coldChain ? "cold chain" : "ambient"}, ${data.numLanes || "TBD"} lanes`,
          owner: "Jeffrey Calabro",
          priority: "high",
        }),
      });

      setCreatedCustomerId(customerId);
      toast.success("Customer onboarded successfully!");
    } catch {
      toast.error("Failed to onboard customer");
    } finally {
      setSaving(false);
    }
  }

  const stepId = STEPS[step].id;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Onboard New Customer</h1>
          <p className="text-sm text-[rgba(255,255,255,0.5)]">Set up a new Decklar customer account</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  i === step
                    ? "bg-[#6038FB] text-white shadow-[0_0_15px_rgba(96,56,251,0.5)]"
                    : i < step
                    ? "bg-[rgba(0,255,64,0.15)] text-[#00FF40] border border-[rgba(0,255,64,0.3)]"
                    : "bg-[rgba(13,17,23,0.8)] text-[rgba(255,255,255,0.5)] border border-[rgba(96,56,251,0.15)]"
                }`}
              >
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className={`h-4 w-4 ${i < step ? "text-[#00FF40]" : "text-[rgba(96,56,251,0.3)]"}`} />
              )}
            </div>
          ))}
        </div>

        {createdCustomerId ? (
          <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-[#00FF40]" />
              <h2 className="mt-4 text-xl font-semibold text-white">Customer Onboarded!</h2>
              <p className="mt-1 text-sm text-[rgba(255,255,255,0.5)]">
                {data.name} is now set up in the Decklar portal.
              </p>
              <div className="mt-6 flex gap-3">
                <Link href={`/customers/${createdCustomerId}`}>
                  <Button className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]">View Customer</Button>
                </Link>
                <Link href="/customers">
                  <Button variant="outline" className="border-[rgba(96,56,251,0.3)] text-white hover:bg-[rgba(96,56,251,0.1)]">All Customers</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {stepId === "basics" && (
              <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Customer Basics</CardTitle>
                  <CardDescription className="text-[rgba(255,255,255,0.5)]">Basic information about the new customer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Customer Name *</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g. Acme Supply Chain Co"
                      className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Account Type</Label>
                      <select
                        className="w-full rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white"
                        value={data.accountType}
                        onChange={(e) => updateField("accountType", e.target.value)}
                      >
                        <option>Standard</option>
                        <option>Premium</option>
                        <option>Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-white">Industry</Label>
                      <Input
                        value={data.industry}
                        onChange={(e) => updateField("industry", e.target.value)}
                        placeholder="e.g. Pharma, Logistics"
                        className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {stepId === "deployment" && (
              <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Deployment Configuration</CardTitle>
                  <CardDescription className="text-[rgba(255,255,255,0.5)]">How they will use Decklar tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Shipment Mode</Label>
                      <select
                        className="w-full rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white"
                        value={data.shipmentMode}
                        onChange={(e) => updateField("shipmentMode", e.target.value)}
                      >
                        <option>Truck</option>
                        <option>Air</option>
                        <option>Ocean</option>
                        <option>Rail</option>
                        <option>Multi-modal</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-white">Expected Lanes</Label>
                      <Input
                        type="number"
                        value={data.numLanes}
                        onChange={(e) => updateField("numLanes", e.target.value)}
                        placeholder="e.g. 50"
                        className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <ToggleChip
                      label="Cold Chain"
                      active={data.coldChain}
                      onClick={() => updateField("coldChain", !data.coldChain)}
                      icon={Thermometer}
                    />
                    <ToggleChip
                      label="Shock Monitoring"
                      active={data.shockMonitoring}
                      onClick={() => updateField("shockMonitoring", !data.shockMonitoring)}
                      icon={Package}
                    />
                    <ToggleChip
                      label="Humidity"
                      active={data.humidityMonitoring}
                      onClick={() => updateField("humidityMonitoring", !data.humidityMonitoring)}
                      icon={BarChart3}
                    />
                    <ToggleChip
                      label="Pharma Mode"
                      active={data.pharmaMode}
                      onClick={() => updateField("pharmaMode", !data.pharmaMode)}
                      icon={Shield}
                    />
                  </div>
                  {data.coldChain && (
                    <div>
                      <Label className="text-white">Temp Thresholds</Label>
                      <Input
                        value={data.tempThresholds}
                        onChange={(e) => updateField("tempThresholds", e.target.value)}
                        placeholder="e.g. 2-8°C, -20°C"
                        className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {stepId === "capabilities" && (
              <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Platform Capabilities</CardTitle>
                  <CardDescription className="text-[rgba(255,255,255,0.5)]">Which features to enable</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <CapabilityToggle
                      label="Public Tracking"
                      desc="Share tracking links with partners"
                      active={data.publicTracking}
                      onClick={() => updateField("publicTracking", !data.publicTracking)}
                    />
                    <CapabilityToggle
                      label="e-Proof Departure"
                      desc="Digital proof of shipment departure"
                      active={data.eproofDeparture}
                      onClick={() => updateField("eproofDeparture", !data.eproofDeparture)}
                    />
                    <CapabilityToggle
                      label="e-Proof Delivery"
                      desc="Digital proof of delivery"
                      active={data.eproofDelivery}
                      onClick={() => updateField("eproofDelivery", !data.eproofDelivery)}
                    />
                    <CapabilityToggle
                      label="Waypoint Alerts"
                      desc="Notifications at key transit points"
                      active={data.waypointAlerts}
                      onClick={() => updateField("waypointAlerts", !data.waypointAlerts)}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Expected Portal Users</Label>
                    <Input
                      type="number"
                      value={data.numUsers}
                      onChange={(e) => updateField("numUsers", e.target.value)}
                      placeholder="e.g. 10"
                      className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {stepId === "contacts" && (
              <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Primary Contacts</CardTitle>
                  <CardDescription className="text-[rgba(255,255,255,0.5)]">Add at least one primary contact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.contacts.map((contact, idx) => (
                    <div key={idx} className="space-y-3 rounded-lg border border-[rgba(96,56,251,0.1)] bg-[rgba(13,17,23,0.5)] p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Name *"
                          value={contact.name}
                          onChange={(e) => {
                            const next = [...data.contacts];
                            next[idx].name = e.target.value;
                            updateField("contacts", next);
                          }}
                          className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
                        />
                        <Input
                          placeholder="Title"
                          value={contact.title}
                          onChange={(e) => {
                            const next = [...data.contacts];
                            next[idx].title = e.target.value;
                            updateField("contacts", next);
                          }}
                          className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={contact.email}
                          onChange={(e) => {
                            const next = [...data.contacts];
                            next[idx].email = e.target.value;
                            updateField("contacts", next);
                          }}
                          className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
                        />
                        <Input
                          placeholder="Phone"
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => {
                            const next = [...data.contacts];
                            next[idx].phone = e.target.value;
                            updateField("contacts", next);
                          }}
                          className="border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
                        />
                      </div>
                      <select
                        className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white"
                        value={contact.role}
                        onChange={(e) => {
                          const next = [...data.contacts];
                          next[idx].role = e.target.value;
                          updateField("contacts", next);
                        }}
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                      </select>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateField("contacts", [
                        ...data.contacts,
                        { name: "", title: "", email: "", phone: "", role: "secondary" },
                      ])
                    }
                    className="border-[rgba(96,56,251,0.3)] text-white hover:bg-[rgba(96,56,251,0.1)]"
                  >
                    + Add Another Contact
                  </Button>
                </CardContent>
              </Card>
            )}

            {stepId === "review" && (
              <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Review & Create</CardTitle>
                  <CardDescription className="text-[rgba(255,255,255,0.5)]">Double-check before creating the account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ReviewRow label="Customer" value={data.name} />
                  <ReviewRow label="Account Type" value={data.accountType} />
                  <ReviewRow label="Shipment Mode" value={data.shipmentMode} />
                  <ReviewRow
                    label="Features"
                    value={[
                      data.coldChain && "Cold Chain",
                      data.shockMonitoring && "Shock",
                      data.pharmaMode && "Pharma",
                      data.publicTracking && "Public Tracking",
                      data.eproofDeparture && "e-Proof Dep",
                      data.eproofDelivery && "e-Proof Del",
                      data.waypointAlerts && "Waypoints",
                    ]
                      .filter(Boolean)
                      .join(", ") || "None selected"}
                  />
                  <ReviewRow
                    label="Contacts"
                    value={data.contacts
                      .filter((c) => c.name)
                      .map((c) => `${c.name} (${c.role})`)
                      .join(", ") || "None added"}
                  />
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="border-[rgba(96,56,251,0.3)] text-white hover:bg-[rgba(96,56,251,0.1)]"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 0 && !data.name.trim()}
                  className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]"
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={saveCustomer} disabled={saving || !data.name.trim()} className="bg-[#00FF40] text-[#0A0A0F] hover:bg-[#00CC33]">
                  {saving ? "Creating..." : "Create Customer"}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function ToggleChip({
  label,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-[rgba(0,255,64,0.3)] bg-[rgba(0,255,64,0.1)] text-[#00FF40]"
          : "border-[rgba(96,56,251,0.15)] bg-[rgba(13,17,23,0.6)] text-[rgba(255,255,255,0.5)] hover:border-[rgba(96,56,251,0.3)] hover:text-white"
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${active ? "text-[#00FF40]" : "text-[rgba(255,255,255,0.4)]"}`} />
      {label}
    </button>
  );
}

function CapabilityToggle({
  label,
  desc,
  active,
  onClick,
}: {
  label: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${
        active
          ? "border-[rgba(96,56,251,0.4)] bg-[rgba(96,56,251,0.1)]"
          : "border-[rgba(96,56,251,0.15)] bg-[rgba(13,17,23,0.5)] hover:border-[rgba(96,56,251,0.3)]"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`h-4 w-4 rounded-full border-2 ${
            active ? "border-[#6038FB] bg-[#6038FB]" : "border-[rgba(96,56,251,0.3)]"
          }`}
        >
          {active && <CheckCircle2 className="h-4 w-4 text-white" />}
        </div>
        <span className={`text-sm font-medium ${active ? "text-[#7B5CFF]" : "text-white"}`}>
          {label}
        </span>
      </div>
      <span className="text-xs text-[rgba(255,255,255,0.5)]">{desc}</span>
    </button>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[rgba(96,56,251,0.1)] py-2">
      <span className="text-sm text-[rgba(255,255,255,0.5)]">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
