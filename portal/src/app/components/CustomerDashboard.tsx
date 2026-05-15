'use client';

import { useState, useEffect } from 'react';
import { Building2, Users, AlertTriangle, ClipboardList, Search, Plus, Filter, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Customer {
  id: number;
  name: string;
  account_type: string;
  status: string;
  health_rag: 'green' | 'amber' | 'red';
  industry: string;
  region: string;
  last_contact: string;
  next_contact: string;
  open_items_count: number;
  new_insights: number;
}

interface Stats {
  totalCustomers: number;
  activeDeployments: number;
  atRiskCount: number;
  openItemsCount: number;
}

interface CustomerDashboardProps {
  onSelectCustomer: (customer: Customer) => void;
}

const healthConfig = {
  green: { color: 'bg-emerald-500', border: 'border-emerald-500/50', icon: '●', label: 'Healthy' },
  amber: { color: 'bg-amber-500', border: 'border-amber-500/50', icon: '▲', label: 'Attention' },
  red: { color: 'bg-red-500', border: 'border-red-500/50', icon: '◆', label: 'At Risk' },
};

export default function CustomerDashboard({ onSelectCustomer }: CustomerDashboardProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    activeDeployments: 0,
    atRiskCount: 0,
    openItemsCount: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
      
      // Calculate stats
      const active = data.filter((c: Customer) => c.status === 'active').length;
      const atRisk = data.filter((c: Customer) => c.health_rag === 'red').length;
      const openItems = data.reduce((sum: number, c: Customer) => sum + c.open_items_count, 0);
      
      setStats({
        totalCustomers: data.length,
        activeDeployments: active,
        atRiskCount: atRisk,
        openItemsCount: openItems,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getHealthGradient = (health: string) => {
    switch (health) {
      case 'green': return 'from-emerald-500 to-emerald-600';
      case 'amber': return 'from-amber-500 to-amber-600';
      case 'red': return 'from-red-500 to-red-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-decklar-500/30 border-t-decklar-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={Building2} 
          label="Total Customers" 
          value={stats.totalCustomers} 
          trend="+1 this month"
          trendColor="text-emerald-400"
          iconBg="bg-decklar-500/20"
          iconColor="text-decklar-500"
        />
        <StatCard 
          icon={Users} 
          label="Active Deployments" 
          value={stats.activeDeployments} 
          trend="80% deployed"
          trendColor="text-emerald-400"
          iconBg="bg-emerald-500/20"
          iconColor="text-emerald-400"
        />
        <StatCard 
          icon={AlertTriangle} 
          label="At Risk" 
          value={stats.atRiskCount} 
          trend="Needs attention"
          trendColor="text-red-400"
          iconBg="bg-red-500/20"
          iconColor="text-red-400"
        />
        <StatCard 
          icon={ClipboardList} 
          label="Open Items" 
          value={stats.openItemsCount} 
          trend="2 overdue"
          trendColor="text-amber-400"
          iconBg="bg-amber-500/20"
          iconColor="text-amber-400"
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers, contacts, or insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-decklar-500 transition-colors"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => onSelectCustomer(customer)}
            className={cn(
              "bg-dark-800 rounded-xl p-5 border cursor-pointer group transition-all",
              "hover:border-opacity-100 hover:shadow-lg hover:shadow-decklar-500/10",
              healthConfig[customer.health_rag].border
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center text-white font-bold text-sm",
                  getHealthGradient(customer.health_rag)
                )}>
                  {getInitials(customer.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-decklar-400 transition-colors">
                    {customer.name}
                  </h3>
                  <span className="text-xs text-slate-400 capitalize">{customer.account_type}</span>
                </div>
              </div>
              
              <div 
                className={cn("w-3 h-3 rounded-full", healthConfig[customer.health_rag].color)}
                title={healthConfig[customer.health_rag].label}
              />
            </div>
            
            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Industry</span>
                <span className="text-slate-300">{customer.industry}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-400">Last Contact</span>
                <span className={cn(
                  customer.health_rag === 'green' ? 'text-emerald-400' :
                  customer.health_rag === 'amber' ? 'text-amber-400' :
                  'text-red-400'
                )}>
                  {new Date(customer.last_contact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-400">Open Items</span>
                <span className={cn(
                  customer.open_items_count > 0 ? 'text-amber-400' : 'text-slate-400'
                )}>
                  {customer.open_items_count}
                </span>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-dark-700 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {customer.new_insights > 0 ? `${customer.new_insights} new insight${customer.new_insights > 1 ? 's' : ''}` : 'No new insights'}
              </span>
              <button className="text-decklar-500 text-sm font-medium group-hover:underline">
                View →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  trend: string;
  trendColor: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, trend, trendColor, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-dark-800 rounded-xl p-5 border border-dark-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className={cn("text-xs mt-1", trendColor)}>{trend}</div>
    </div>
  );
}
