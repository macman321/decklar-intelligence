import VoiceConversation from './VoiceConversation';
import { Phone, Sparkles, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';

interface GavinSidebarProps {
  customerId?: string;
  customerName?: string;
}

export default function GavinSidebar({ customerId, customerName }: GavinSidebarProps) {
  return (
    <div className="w-96 bg-dark-800 border-l border-dark-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-dark-700 bg-gradient-to-r from-dark-800 to-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-decklar-500 via-purple-500 to-decklar-600 rounded-2xl flex items-center justify-center shadow-lg shadow-decklar-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Gavin</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400">AI Assistant • Voice Ready</span>
            </div>
          </div>
        </div>
        
        {customerName && (
          <div className="mt-3 p-2 bg-decklar-500/10 border border-decklar-500/30 rounded-lg">
            <p className="text-xs text-slate-300">
              Context: <span className="font-semibold text-decklar-400">{customerName}</span>
            </p>
          </div>
        )}
      </div>
      
      {/* Voice Conversation */}
      <div className="flex-1 overflow-hidden">
        <VoiceConversation 
          customerId={customerId}
          customerName={customerName}
        />
      </div>
      
      {/* Quick Actions */}
      <div className="p-4 border-t border-dark-700 bg-dark-800/50">
        <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-left transition-colors">
            <TrendingUp className="w-4 h-4 text-emerald-400 mb-1" />
            <p className="text-xs text-slate-300">Health Check</p>
          </button>
          
          <button className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-left transition-colors">
            <AlertCircle className="w-4 h-4 text-amber-400 mb-1" />
            <p className="text-xs text-slate-300">Open Items</p>
          </button>
          
          <button className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-left transition-colors">
            <AlertTriangle className="w-4 h-4 text-red-400 mb-1" />
            <p className="text-xs text-slate-300">Risks</p>
          </button>
          
          <button className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-left transition-colors">
            <Sparkles className="w-4 h-4 text-decklar-400 mb-1" />
            <p className="text-xs text-slate-300">Brainstorm</p>
          </button>
        </div>
      </div>
    </div>
  );
}
