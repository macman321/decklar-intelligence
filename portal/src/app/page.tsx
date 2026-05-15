'use client';

import { useState } from 'react';
import CustomerDashboard from './components/CustomerDashboard';
import CustomerDetail from './components/CustomerDetail';
import GavinSidebar from './components/GavinSidebar';
import { Boxes } from 'lucide-react';

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

export default function Home() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-decklar-500 to-decklar-700 rounded-lg flex items-center justify-center">
              <Boxes className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Decklar</h1>
              <p className="text-xs text-slate-400">Customer Intelligence Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-decklar-600 hover:bg-decklar-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <span>+ New Customer</span>
            </button>
            
            <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-slate-300">JC</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Area */}
        <main className="flex-1 overflow-y-auto">
          {selectedCustomer ? (
            <CustomerDetail 
              customerId={selectedCustomer.id}
              onBack={() => setSelectedCustomer(null)}
            />
          ) : (
            <CustomerDashboard onSelectCustomer={setSelectedCustomer} />
          )}
        </main>

        {/* Gavin Sidebar */}
        <GavinSidebar 
          customerId={selectedCustomer?.id}
          customerName={selectedCustomer?.name}
        />
      </div>
    </div>
  );
}
