import React from 'react';
import { 
  ShoeItem, 
  SaleOrder 
} from '../types';
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Award, 
  MapPin, 
  Truck, 
  ArrowUpRight, 
  Plus, 
  Upload, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';

interface DashboardProps {
  shoes: ShoeItem[];
  sales: SaleOrder[];
  onNavigateTab: (tab: 'inventory' | 'sales' | 'bulk-upload' | 'storefront') => void;
  onOpenAddModal: () => void;
  onOpenSellModalForShoe?: (shoe: ShoeItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  shoes,
  sales,
  onNavigateTab,
  onOpenAddModal,
}) => {
  const totalShoesCount = shoes.length;
  const availableShoes = shoes.filter(s => s.status === 'available');
  const soldShoes = shoes.filter(s => s.status === 'sold');

  const activeCapitalValue = availableShoes.reduce((sum, s) => sum + s.costPrice, 0);
  const potentialRevenue = availableShoes.reduce((sum, s) => sum + s.sellingPrice, 0);

  const totalRevenue = sales.reduce((sum, s) => sum + s.agreedPrice, 0);
  const totalCostOfSold = sales.reduce((sum, s) => sum + s.costPrice, 0);
  const grossProfit = totalRevenue - totalCostOfSold;
  const profitMarginPercent = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;
  const avgProfitPerPair = sales.length > 0 ? Math.round(grossProfit / sales.length) : 0;

  // City breakdown data for Recharts
  const cityCounts: Record<string, number> = {};
  sales.forEach(s => {
    cityCounts[s.city] = (cityCounts[s.city] || 0) + 1;
  });
  const cityData = Object.keys(cityCounts).map(city => ({
    name: city,
    value: cityCounts[city],
  })).sort((a, b) => b.value - a.value).slice(0, 6);

  const COLORS = ['#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];

  // Brand sales distribution
  const brandSales: Record<string, { count: number; revenue: number }> = {};
  sales.forEach(s => {
    if (!brandSales[s.shoeBrand]) {
      brandSales[s.shoeBrand] = { count: 0, revenue: 0 };
    }
    brandSales[s.shoeBrand].count += 1;
    brandSales[s.shoeBrand].revenue += s.agreedPrice;
  });

  const brandData = Object.keys(brandSales).map(b => ({
    brand: b,
    count: brandSales[b].count,
    revenue: brandSales[b].revenue,
  })).sort((a, b) => b.revenue - a.revenue);

  // Financial summary data for bar chart
  const financialData = [
    { name: 'Total Revenue', amount: totalRevenue, color: '#10B981' },
    { name: 'Cost of Stock', amount: totalCostOfSold, color: '#F59E0B' },
    { name: 'Net Profit', amount: grossProfit, color: '#06B6D4' },
    { name: 'Active Capital', amount: activeCapitalValue, color: '#6366F1' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Thrift Inventory Engine
              </span>
              <span className="text-slate-400 text-xs">• scrapa.pk</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Inventory & Sales Overview
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Real-time Pakistani Rupee (PKR) metrics for unique preloved shoe pairs, customer dispatches, and profits.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onOpenAddModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Pair</span>
            </button>
            <button
              onClick={() => onNavigateTab('bulk-upload')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <Upload className="w-4 h-4 text-teal-400" />
              <span>Bulk Excel/PDF Upload</span>
            </button>
            <button
              onClick={() => onNavigateTab('storefront')}
              className="bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-700/50 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <ExternalLink className="w-4 h-4 text-purple-400" />
              <span>View Public Storefront</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Sold & Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl hover:border-emerald-500/40 transition group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Sales Revenue</p>
              <h2 className="text-2xl md:text-3xl font-black text-emerald-400 mt-1">
                Rs. {totalRevenue.toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Sold Pairs: <strong className="text-white">{soldShoes.length}</strong></span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Rs. {avgProfitPerPair.toLocaleString()} avg profit/pair
            </span>
          </div>
        </div>

        {/* Metric 2: Gross Profit & Margin */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl hover:border-teal-500/40 transition group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Gross Profit (PKR)</p>
              <h2 className="text-2xl md:text-3xl font-black text-teal-300 mt-1">
                Rs. {grossProfit.toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400 group-hover:scale-110 transition">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Profit Margin:</span>
            <span className="bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-500/30">
              {profitMarginPercent}% Margin
            </span>
          </div>
        </div>

        {/* Metric 3: Active Available Inventory */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl hover:border-indigo-500/40 transition group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Available Stock</p>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
                {availableShoes.length} <span className="text-sm font-normal text-slate-400">/ {totalShoesCount} pairs</span>
              </h2>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Capital Investment:</span>
            <strong className="text-indigo-300">Rs. {activeCapitalValue.toLocaleString()}</strong>
          </div>
        </div>

        {/* Metric 4: Potential Sales Value */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl hover:border-amber-500/40 transition group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Expected Stock Revenue</p>
              <h2 className="text-2xl md:text-3xl font-black text-amber-400 mt-1">
                Rs. {potentialRevenue.toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400 group-hover:scale-110 transition">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Expected Net Profit:</span>
            <strong className="text-amber-300">Rs. {(potentialRevenue - activeCapitalValue).toLocaleString()}</strong>
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Financial Breakdown Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Financial Overview (PKR)
              </h3>
              <p className="text-xs text-slate-400">Revenue, cost of goods sold, profit, and tied-up stock capital</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `Rs.${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                  formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#10B981">
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Selling Pakistani Cities */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-teal-400" />
              Top Order Cities
            </h3>
            <p className="text-xs text-slate-400 mb-4">Most popular buyer locations across Pakistan</p>

            {cityData.length > 0 ? (
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {cityData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                      formatter={(val: any) => [`${val} orders`, 'City Sales']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">No city data available yet</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800">
            {cityData.slice(0, 4).map((c, idx) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-300 font-medium truncate">{c.name}</span>
                <span className="text-slate-500 font-bold ml-auto">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Brand Sales & Recent Sales Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Brand Performance List */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Fast-Moving Brands
            </h3>
            <button 
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-emerald-400 hover:underline font-medium"
            >
              View Inventory
            </button>
          </div>

          <div className="space-y-3">
            {brandData.map((b) => (
              <div key={b.brand} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">{b.brand}</h4>
                  <p className="text-[11px] text-slate-400">{b.count} pair{b.count > 1 ? 's' : ''} sold</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">Rs. {b.revenue.toLocaleString()}</span>
                  <p className="text-[10px] text-slate-500">Total Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales Activity */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                Recent Customer Orders & Couriers
              </h3>
              <p className="text-xs text-slate-400">Sold shoes with shipping & tracking details</p>
            </div>
            <button 
              onClick={() => onNavigateTab('sales')}
              className="text-xs text-emerald-400 hover:underline font-medium flex items-center gap-1"
            >
              <span>All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Shoe Model & SKU</th>
                  <th className="py-2.5 px-3">Customer & City</th>
                  <th className="py-2.5 px-3">Courier & Tracking</th>
                  <th className="py-2.5 px-3 text-right">Price (PKR)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{sale.shoeTitle}</div>
                      <div className="text-[10px] text-slate-400">{sale.shoeSKU} • Size {sale.shoeSize}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{sale.customerName}</div>
                      <div className="text-[10px] text-slate-400">{sale.city} • {sale.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium">
                        {sale.courierName}
                      </span>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{sale.trackingNumber}</div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-bold text-emerald-400">Rs. {sale.agreedPrice.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">Profit: +Rs. {(sale.agreedPrice - sale.costPrice).toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sale.orderStatus === 'Delivered' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : sale.orderStatus === 'In Transit'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {sale.orderStatus === 'Delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                        {sale.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
