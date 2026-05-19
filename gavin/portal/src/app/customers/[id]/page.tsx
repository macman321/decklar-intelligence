"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthBadge } from "@/components/health-badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  User,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  FileText,
  Lightbulb,
  Plus,
  Crown,
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
  success_criteria: string | null;
  memory_json: string | null;
}

interface Contact {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  role: string;
}

interface OpenItem {
  id: string;
  item: string;
  owner: string | null;
  status: string;
  due_date: string | null;
  priority: string;
  created_at: string;
}

interface Call {
  id: string;
  date: string;
  type: string | null;
  participants: string | null;
  summary: string | null;
  key_decisions: string | null;
}

interface Insight {
  id: string;
  type: string | null;
  text: string;
  source: string | null;
  date: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [openItems, setOpenItems] = useState<OpenItem[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!customerId) return;
    fetch(`/api/customers/${customerId}`)
      .then((r) => r.json())
      .then((d) => {
        setCustomer(d.customer);
        setContacts(d.contacts || []);
        setOpenItems(d.openItems || []);
        setCalls(d.calls || []);
        setInsights(d.insights || []);
      })
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return (
      <AppShell>
        <div className="text-sm text-[rgba(255,255,255,0.5)]">Loading customer...</div>
      </AppShell>
    );
  }

  if (!customer) {
    return (
      <AppShell>
        <div className="text-sm text-[#EF4444]">Customer not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="ghost" size="sm" className="text-white hover:text-[#7B5CFF]">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
            <p className="mt-1 text-sm text-[rgba(255,255,255,0.5)]">
              {customer.account_type} · Managed by {customer.account_manager}
            </p>
          </div>
          <HealthBadge status={customer.health_rag} size="md" />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex-wrap bg-[rgba(13,17,23,0.85)] border border-[rgba(96,56,251,0.15)]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#6038FB] data-[state=active]:text-white text-[rgba(255,255,255,0.7)]">Overview</TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-[#6038FB] data-[state=active]:text-white text-[rgba(255,255,255,0.7)]">Contacts ({contacts.length})</TabsTrigger>
            <TabsTrigger value="open-items" className="data-[state=active]:bg-[#6038FB] data-[state=active]:text-white text-[rgba(255,255,255,0.7)]">Open Items ({openItems.length})</TabsTrigger>
            <TabsTrigger value="calls" className="data-[state=active]:bg-[#6038FB] data-[state=active]:text-white text-[rgba(255,255,255,0.7)]">Calls ({calls.length})</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-[#6038FB] data-[state=active]:text-white text-[rgba(255,255,255,0.7)]">Insights ({insights.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab customer={customer} contacts={contacts} openItems={openItems} calls={calls} />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <ContactsTab customerId={customerId} contacts={contacts} setContacts={setContacts} />
          </TabsContent>

          <TabsContent value="open-items" className="space-y-4">
            <OpenItemsTab customerId={customerId} items={openItems} setItems={setOpenItems} />
          </TabsContent>

          <TabsContent value="calls" className="space-y-4">
            <CallsTab customerId={customerId} calls={calls} setCalls={setCalls} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <InsightsTab customerId={customerId} insights={insights} setInsights={setInsights} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function OverviewTab({
  customer,
  contacts,
  openItems,
  calls,
}: {
  customer: Customer;
  contacts: Contact[];
  openItems: OpenItem[];
  calls: Call[];
}) {
  const pendingItems = openItems.filter((i) => i.status === "Pending");
  const recentCalls = calls.slice(0, 5);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2 border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Customer Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <InfoRow icon={Building2} label="Account Type" value={customer.account_type} />
            <InfoRow icon={User} label="Account Manager" value={customer.account_manager} />
            <InfoRow
              icon={Calendar}
              label="Created"
              value={new Date(customer.created_at).toLocaleDateString()}
            />
            <InfoRow
              icon={Clock}
              label="Last Contact"
              value={
                customer.last_contact
                  ? new Date(customer.last_contact).toLocaleDateString()
                  : "Never"
              }
            />
          </div>
          {customer.success_criteria && (
            <div className="mt-4 rounded-md bg-[rgba(96,56,251,0.1)] border border-[rgba(96,56,251,0.15)] p-3">
              <p className="text-xs font-medium text-[#7B5CFF]">Success Criteria</p>
              <p className="mt-1 text-sm text-[rgba(255,255,255,0.7)]">{customer.success_criteria}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatRow label="Contacts" value={contacts.length} />
            <StatRow label="Pending Items" value={pendingItems.length} />
            <StatRow label="Total Calls" value={calls.length} />
          </CardContent>
        </Card>

        {recentCalls.length > 0 && (
          <Card className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">Recent Calls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentCalls.map((call) => (
                <div key={call.id} className="rounded-md border border-[rgba(96,56,251,0.1)] bg-[rgba(13,17,23,0.5)] p-2 text-sm">
                  <p className="font-medium text-white">{call.type || "Call"}</p>
                  <p className="text-xs text-[rgba(255,255,255,0.5)]">
                    {new Date(call.date).toLocaleDateString()} · {call.participants || "No participants listed"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-[#7B5CFF]" />
      <div>
        <p className="text-xs text-[rgba(255,255,255,0.5)]">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[rgba(255,255,255,0.5)]">{label}</span>
      <span className="text-sm font-semibold text-[#7B5CFF]">{value}</span>
    </div>
  );
}

function ContactsTab({
  customerId,
  contacts,
  setContacts,
}: {
  customerId: string;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function addContact(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch(`/api/customers/${customerId}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, title, email, phone }),
    });
    if (res.ok) {
      const d = await res.json();
      setContacts((prev) => [...prev, d.contact]);
      setName(""); setTitle(""); setEmail(""); setPhone(""); setAdding(false);
      toast.success("Contact added");
    } else {
      toast.error("Failed to add contact");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Contacts</h2>
        <Button size="sm" onClick={() => setAdding(!adding)} className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]">
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>

      {adding && (
        <form onSubmit={addContact} className="grid gap-3 rounded-lg border border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] p-4 sm:grid-cols-2">
          <input className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)]" placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)]" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)]" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)]" placeholder="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" size="sm" className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]">Save</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)} className="border-[rgba(96,56,251,0.3)] text-white hover:bg-[rgba(96,56,251,0.1)]">Cancel</Button>
          </div>
        </form>
      )}

      {contacts.length === 0 ? (
        <p className="text-sm text-[rgba(255,255,255,0.5)]">No contacts yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <Card key={c.id} className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6038FB] to-[#7B5CFF] shadow-[0_0_10px_rgba(96,56,251,0.3)] text-xs font-bold text-white">
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">{c.name}</p>
                      <p className="text-xs text-[rgba(255,255,255,0.5)]">{c.title || "No title"}</p>
                    </div>
                  </div>
                  {c.role === "primary" && (
                    <Badge variant="secondary" className="text-xs bg-[rgba(0,255,64,0.15)] text-[#00FF40] border border-[rgba(0,255,64,0.3)]">Primary</Badge>
                  )}
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-[#7B5CFF] hover:underline">
                      <Mail className="h-3.5 w-3.5" /> {c.email}
                    </a>
                  )}
                  {c.phone && (
                    <div className="flex items-center gap-1.5 text-[rgba(255,255,255,0.5)]">
                      <Phone className="h-3.5 w-3.5" /> {c.phone}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function OpenItemsTab({
  customerId,
  items,
  setItems,
}: {
  customerId: string;
  items: OpenItem[];
  setItems: React.Dispatch<React.SetStateAction<OpenItem[]>>;
}) {
  const [adding, setAdding] = useState(false);
  const [itemText, setItemText] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!itemText.trim()) return;
    const res = await fetch(`/api/customers/${customerId}/open-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: itemText, owner, due_date: dueDate, priority }),
    });
    if (res.ok) {
      const d = await res.json();
      setItems((prev) => [...prev, d.item]);
      setItemText(""); setOwner(""); setDueDate(""); setPriority("medium"); setAdding(false);
      toast.success("Open item added");
    } else {
      toast.error("Failed to add item");
    }
  }

  const priorityBorder: Record<string, string> = {
    critical: "border-l-4 border-l-[#EF4444]",
    high: "border-l-4 border-l-[#F59E0B]",
    medium: "border-l-4 border-l-[#F59E0B]/60",
    low: "border-l-4 border-l-[rgba(96,56,251,0.3)]",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Open Items</h2>
        <Button size="sm" onClick={() => setAdding(!adding)} className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]">
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>

      {adding && (
        <form onSubmit={addItem} className="grid gap-3 rounded-lg border border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] p-4 sm:grid-cols-2">
          <input className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)]" placeholder="Item description *" value={itemText} onChange={(e) => setItemText(e.target.value)} required />
          <input className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)]" placeholder="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
          <input className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white" placeholder="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <select className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" size="sm" className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]">Save</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)} className="border-[rgba(96,56,251,0.3)] text-white hover:bg-[rgba(96,56,251,0.1)]">Cancel</Button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-[rgba(255,255,255,0.5)]">No open items.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Card key={item.id} className={`${priorityBorder[item.priority] || ""} border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl`}>
              <CardContent className="flex items-start justify-between py-4">
                <div className="space-y-1">
                  <p className="font-medium text-white">{item.item}</p>
                  <div className="flex gap-3 text-xs text-[rgba(255,255,255,0.5)]">
                    {item.owner && <span>Owner: {item.owner}</span>}
                    {item.due_date && <span>Due: {new Date(item.due_date).toLocaleDateString()}</span>}
                    <Badge variant="outline" className="text-xs border-[rgba(96,56,251,0.3)] text-[#7B5CFF]">{item.priority}</Badge>
                  </div>
                </div>
                <Badge variant={item.status === "Pending" ? "secondary" : "default"} className={item.status === "Pending" ? "bg-[rgba(96,56,251,0.15)] text-[#7B5CFF]" : "bg-[rgba(0,255,64,0.15)] text-[#00FF40]"}>
                  {item.status === "Pending" ? (
                    <span className="flex items-center gap-1"><Circle className="h-3 w-3" /> Pending</span>
                  ) : (
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Done</span>
                  )}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CallsTab({
  customerId,
  calls,
  setCalls,
}: {
  customerId: string;
  calls: Call[];
  setCalls: React.Dispatch<React.SetStateAction<Call[]>>;
}) {
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState("");
  const [participants, setParticipants] = useState("");
  const [summary, setSummary] = useState("");

  async function addCall(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/customers/${customerId}/calls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date().toISOString(),
        type: type || "Call",
        participants,
        summary,
      }),
    });
    if (res.ok) {
      const d = await res.json();
      setCalls((prev) => [d.call, ...prev]);
      setType(""); setParticipants(""); setSummary(""); setAdding(false);
      toast.success("Call logged");
    } else {
      toast.error("Failed to log call");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Call History</h2>
        <Button size="sm" onClick={() => setAdding(!adding)} className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]">
          <Plus className="mr-1 h-4 w-4" /> Log Call
        </Button>
      </div>

      {adding && (
        <form onSubmit={addCall} className="grid gap-3 rounded-lg border border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] p-4">
          <input className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)]" placeholder="Call type (e.g. QBR, Check-in)" value={type} onChange={(e) => setType(e.target.value)} />
          <input className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)]" placeholder="Participants" value={participants} onChange={(e) => setParticipants(e.target.value)} />
          <textarea className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)]" placeholder="Summary" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]">Save</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)} className="border-[rgba(96,56,251,0.3)] text-white hover:bg-[rgba(96,56,251,0.1)]">Cancel</Button>
          </div>
        </form>
      )}

      {calls.length === 0 ? (
        <p className="text-sm text-[rgba(255,255,255,0.5)]">No calls logged yet.</p>
      ) : (
        <div className="space-y-3">
          {calls.map((call) => (
            <Card key={call.id} className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-white">{call.type || "Call"}</p>
                    <p className="text-xs text-[rgba(255,255,255,0.5)]">
                      <Calendar className="mr-1 inline h-3 w-3" />
                      {new Date(call.date).toLocaleDateString()}
                      {call.participants && ` · ${call.participants}`}
                    </p>
                  </div>
                </div>
                {call.summary && (
                  <div className="mt-2 rounded-md border border-[rgba(96,56,251,0.1)] bg-[rgba(13,17,23,0.5)] p-2 text-sm text-[rgba(255,255,255,0.7)]">{call.summary}</div>
                )}
                {call.key_decisions && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-[#7B5CFF]">Key Decisions</p>
                    <p className="text-sm text-[rgba(255,255,255,0.7)]">{call.key_decisions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function InsightsTab({
  customerId,
  insights,
  setInsights,
}: {
  customerId: string;
  insights: Insight[];
  setInsights: React.Dispatch<React.SetStateAction<Insight[]>>;
}) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState("");

  async function addInsight(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch(`/api/customers/${customerId}/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, type: type || null }),
    });
    if (res.ok) {
      const d = await res.json();
      setInsights((prev) => [d.insight, ...prev]);
      setText(""); setType(""); setAdding(false);
      toast.success("Insight added");
    } else {
      toast.error("Failed to add insight");
    }
  }

  const typeIcons: Record<string, React.ReactNode> = {
    warning: <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />,
    tip: <Lightbulb className="h-4 w-4 text-[#7B5CFF]" />,
    risk: <AlertTriangle className="h-4 w-4 text-[#EF4444]" />,
    opportunity: <CheckCircle2 className="h-4 w-4 text-[#00FF40]" />,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Insights</h2>
        <Button size="sm" onClick={() => setAdding(!adding)} className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]">
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>

      {adding && (
        <form onSubmit={addInsight} className="grid gap-3 rounded-lg border border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] p-4">
          <select className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Select type...</option>
            <option value="warning">Warning</option>
            <option value="tip">Tip</option>
            <option value="risk">Risk</option>
            <option value="opportunity">Opportunity</option>
          </select>
          <textarea className="rounded-md border border-[rgba(96,56,251,0.2)] bg-[rgba(13,17,23,0.6)] px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)]" placeholder="Insight text *" rows={3} value={text} onChange={(e) => setText(e.target.value)} required />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="bg-[#6038FB] text-white hover:bg-[#7B5CFF]">Save</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)} className="border-[rgba(96,56,251,0.3)] text-white hover:bg-[rgba(96,56,251,0.1)]">Cancel</Button>
          </div>
        </form>
      )}

      {insights.length === 0 ? (
        <p className="text-sm text-[rgba(255,255,255,0.5)]">No insights yet.</p>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => (
            <Card key={insight.id} className="border-[rgba(96,56,251,0.15)] bg-[rgba(19,22,32,0.8)] backdrop-blur-xl">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{typeIcons[insight.type || ""] || <FileText className="h-4 w-4 text-[rgba(255,255,255,0.5)]" />}</div>
                  <div className="flex-1">
                    <p className="text-sm text-[rgba(255,255,255,0.7)]">{insight.text}</p>
                    <p className="mt-1 text-xs text-[rgba(255,255,255,0.4)]">
                      {insight.type || "Note"} · {new Date(insight.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
