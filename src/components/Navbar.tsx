import React from 'react';
import { 
  Package, 
  TrendingUp, 
  ShoppingBag, 
  Upload, 
  Users, 
  Eye, 
  Plus, 
  RefreshCw, 
  Tag, 
  CheckCircle2,
  Boxes
} from 'lucide-react';
import { ViewTab } from '../types';

interface NavbarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  availableCount: number;
  soldCount: number;
  totalRevenue: number;
  onOpenAddModal: () => void;
  onResetData: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  availableCount,
  soldCount,
  totalRevenue,
  onOpenAddModal,
  onResetData,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-4 py-1 text-xs text-white font-medium flex justify-between items-center">
        <div className="flex items-center space-[#030303] gap-2">
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Live System</span>
          <span>scrapa.pk Preloved Shoe Inventory & Sales Management (Currency: PKR / Rs.)</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-emerald-100">
          <span>Active Stock: <strong className="text-white">{availableCount} pairs</strong></span>
          <span>•</span>
          <span>Sold: <strong className="text-white">{soldCount} pairs</strong></span>
          <span>•</span>
          <span>Revenue: <strong className="text-emerald-200">Rs. {totalRevenue.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('inventory')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
              <Boxes className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  scrapa.pk
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase">
                  Thrift OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Preloved & Thrift Shoes Control Center</p>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, brand, model, customer or city..."
                className="w-full bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-500 transition"
              />
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Shoe Pair</span>
              <span className="sm:hidden">Add</span>
            </button>

            <button
              onClick={() => setActiveTab('bulk-upload')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
              title="Bulk Excel / PDF Upload"
            >
              <Upload className="w-4 h-4 text-teal-400" />
              <span className="hidden md:inline">Bulk Upload</span>
            </button>

            <button
              onClick={onResetData}
              className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 p-2 rounded-lg border border-slate-700 text-xs transition"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'inventory'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Shoe Inventory ({availableCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`px-3 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'sales'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sales & Customer Details ({soldCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'customers'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer CRM</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk-upload')}
            className={`px-3 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'bulk-upload'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload (PDF / Excel)</span>
          </button>

          <button
            onClick={() => setActiveTab('storefront')}
            className={`px-3 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'storefront'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/50'
            }`}
          >
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="flex items-center gap-1">
              <span>Customer Storefront</span>
              <span className="bg-purple-500/30 text-purple-200 text-[10px] px-1 rounded">Live</span>
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
