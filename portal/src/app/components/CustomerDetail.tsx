'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Users, Settings, ClipboardList, History, Lightbulb, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerDetailProps {
  customerId: number;
  onBack: () => void;
}

interface CustomerData {
  id: number;
  name: string;
  account_type: string;
  status: string;
  health_rag: 'green' | 'amber' | 'red';
  industry: string;
  region: string;
  annual_spend?: number;
  last_contact: string;
  next_contact: string;
  go_live_date?: string;
  contract_renewal?: string;
  contacts: any[];
  deployment?: any;
  open_items: any[];
  insights: any[];
  recent_calls: any[];
}

const healthConfig = {
  green: { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400', label: 'Healthy' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400', label: 'Attention Needed' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', label: 'At Risk' },
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'deployment', label: 'Deployment', icon: Settings },
  { id: 'open-items', label: 'Open Items', icon: ClipboardList },
  { id: 'history', label: 'History', icon: History },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function CustomerDetail({ customerId, onBack }: CustomerDetailProps) {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}`);
      const data = await response.json();
      setCustomer(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-decklar-500/30 border-t-decklar-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  const health = healthConfig[customer.health_rag];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl",
              health.bg
            )}>
              {customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-slate-400">{customer.industry}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{customer.region}</span>
                <span className="text-slate-600">•</span>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", health.bg, health.text)}>
                  {health.label}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-white">${(customer.annual_spend || 0).toLocaleString()}</p>
            <p className="text-sm text-slate-400">Annual Contract Value</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-700 mb-6">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2",
                activeTab === tab.id
                  ? "border-decklar-500 text-decklar-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && <OverviewTab customer={customer} />}
        {activeTab === 'contacts' && <ContactsTab contacts={customer.contacts} />}
        {activeTab === 'deployment' && <DeploymentTab deployment={customer.deployment} />}
        {activeTab === 'open-items' && <OpenItemsTab items={customer.open_items} />}
        {activeTab === 'history' && <HistoryTab calls={customer.recent_calls} />}
        {activeTab === 'insights' && <InsightsTab insights={customer.insights} />}
      </div>
    </div>
  );
}

function OverviewTab({ customer }: { customer: CustomerData }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card title="Account Status">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Status</span>
            <span className="text-white capitalize">{customer.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Account Type</span>
            <span className="text-white capitalize">{customer.account_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Last Contact</span>
            <span className="text-white">{new Date(customer.last_contact).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Next Contact</span>
            <span className="text-white">{customer.next_contact ? new Date(customer.next_contact).toLocaleDateString() : 'Not scheduled'}</span>
          </div>
        </div>
      </Card>

      <Card title="Contract">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Go Live Date</span>
            <span className="text-white">{customer.go_live_date ? new Date(customer.go_live_date).toLocaleDateString() : 'TBD'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Contract Renewal</span>
            <span className="text-white">{customer.contract_renewal ? new Date(customer.contract_renewal).toLocaleDateString() : 'TBD'}</span>
          </div>
        </div>
      </Card>

      <Card title="Quick Stats">
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Contacts" value={customer.contacts.length} />
          <Stat label="Open Items" value={customer.open_items.length} />
          <Stat label="Insights" value={customer.insights.length} />
        </div>
      </Card>
    </div>
  );
}

function ContactsTab({ contacts }: { contacts: any[] }) {
  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <Card key={contact.id} title={contact.name}>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-slate-300">{contact.title}</p>
              <div className="flex items-center gap-4 text-sm">
                <a href={`mailto:${contact.email}`} className="text-decklar-400 hover:underline">{contact.email}</a>
                <span className="text-slate-400">{contact.phone}</span>
              </div>
            </div>
            {contact.is_primary && (
              <span className="px-2 py-1 bg-decklar-500/20 text-decklar-400 text-xs rounded-full">
                Primary Contact
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function DeploymentTab({ deployment }: { deployment?: any }) {
  if (!deployment) return <p className="text-slate-400">No deployment configured.</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card title="Configuration">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Shipment Mode</span>
            <span className="text-white">{deployment.shipment_mode || 'TBD'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Number of Lanes</span>
            <span className="text-white">{deployment.num_lanes || 'TBD'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Device Type</span>
            <span className="text-white">{deployment.device_type || 'TBD'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Cold Chain</span>
            <span className="text-white">{deployment.cold_chain ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </Card>

      <Card title="Features Enabled">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'public_tracking', label: 'Public Tracking' },
            { key: 'e_proof_departure', label: 'e-Proof Departure' },
            { key: 'e_proof_delivery', label: 'e-Proof Delivery' },
            { key: 'waypoint_alerts', label: 'Waypoint Alerts' },
            { key: 'shock_monitoring', label: 'Shock Monitoring' },
            { key: 'vehicle_tracking', label: 'Vehicle Tracking' },
          ].map(({ key, label }) => (
            <span
              key={key}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                deployment[key] 
                  ? "bg-emerald-500/20 text-emerald-400" 
                  : "bg-dark-700 text-slate-500"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

function OpenItemsTab({ items }: { items: any[] }) {
  if (items.length === 0) {
    return <div className="text-center py-12 text-slate-400">No open items.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white font-medium">{item.item}</p>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span className="text-slate-400">Owner: {item.owner}</span>
                {item.due_date && (
                  <span className={cn(
                    "text-xs",
                    new Date(item.due_date) < new Date() ? 'text-red-400' : 'text-slate-400'
                  )}>
                    Due: {new Date(item.due_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
              item.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' :
              item.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
              'bg-slate-500/20 text-slate-400'
            )}>
              {item.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryTab({ calls }: { calls: any[] }) {
  if (calls.length === 0) {
    return <div className="text-center py-12 text-slate-400">No call history yet.</div>;
  }

  return (
    <div className="space-y-3">
      {calls.map((call) => (
        <Card key={call.id} title={new Date(call.call_date).toLocaleDateString()} >
          <div className="space-y-2">
            <span className="px-2 py-1 bg-dark-700 rounded text-xs text-slate-300">
              {call.call_type}
            </span>
            <p className="text-slate-300">{call.summary}</p>
            {call.key_decisions && (
              <div className="mt-2 p-2 bg-decklar-500/10 rounded">
                <p className="text-xs text-decklar-400 font-medium">Key Decisions:</p>
                <p className="text-sm text-slate-300">{call.key_decisions}</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function InsightsTab({ insights }: { insights: any[] }) {
  if (insights.length === 0) {
    return <div className="text-center py-12 text-slate-400">No insights yet.</div>;
  }

  const typeColors = {
    opportunity: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
    warning: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
    risk: 'bg-red-500/20 border-red-500/30 text-red-400',
    tip: 'bg-decklar-500/20 border-decklar-500/30 text-decklar-400',
  };

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <div 
          key={insight.id} 
          className={cn(
            "rounded-lg p-4 border",
            typeColors[insight.insight_type as keyof typeof typeColors] || typeColors.tip
          )}
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 mt-0.5" />
            <div className="flex-1">
              <p className="text-white">{insight.text}</p>
              <div className="flex items-center gap-3 mt-2 text-xs opacity-75">
                <span>Source: {insight.source}</span>
                {insight.confidence && <span>Confidence: {Math.round(insight.confidence * 100)}%</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-dark-800 rounded-xl p-5 border border-dark-700">
      {title && <h3 className="text-white font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
