import React, { useState } from 'react';
import { SaleOrder, CustomerSummary } from '../types';
import { Users, Phone, MapPin, ShoppingBag, Search, Award, CheckCircle2 } from 'lucide-react';

interface CustomerCRMProps {
  sales: SaleOrder[];
}

export const CustomerCRM: React.FC<CustomerCRMProps> = ({ sales }) => {
  const [search, setSearch] = useState('');

  // Aggregate sales by phone number
  const customersMap: Record<string, CustomerSummary> = {};

  sales.forEach(sale => {
    const key = sale.customerPhone.trim();
    if (!customersMap[key]) {
      customersMap[key] = {
        phone: key,
        name: sale.customerName,
        city: sale.city,
        address: sale.address,
        totalOrders: 0,
        totalSpent: 0,
        orders: [],
      };
    }
    customersMap[key].totalOrders += 1;
    customersMap[key].totalSpent += sale.agreedPrice;
    customersMap[key].orders.push(sale);
  });

  const customers = Object.values(customersMap).sort((a, b) => b.totalSpent - a.totalSpent);

  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Customer Directory & Repeat Buyers (CRM)
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-bold">
              {filteredCustomers.length} unique buyers
            </span>
          </h2>
          <p className="text-xs text-slate-400">View customer purchase history, cities, repeat orders, and total spent on scrapa.pk.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by buyer name, phone, city..."
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.phone}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-xl transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    {cust.name}
                    {cust.totalOrders > 1 && (
                      <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Award className="w-3 h-3" />
                        Repeat VIP ({cust.totalOrders})
                      </span>
                    )}
                  </h3>
                  <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {cust.phone}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-amber-300 font-mono">
                    Rs. {cust.totalSpent.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-500">Total Spent</p>
                </div>
              </div>

              <div className="mt-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <p className="flex items-center gap-1 font-semibold text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{cust.city}</span>
                </p>
                <p className="text-[11px] text-slate-400 pl-4">{cust.address}</p>
              </div>
            </div>

            {/* Orders summary list */}
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Purchased Shoes ({cust.orders.length}):
              </span>
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {cust.orders.map((o) => (
                  <div key={o.id} className="text-[11px] bg-slate-800/60 p-1.5 rounded-lg flex justify-between items-center text-slate-300">
                    <span className="truncate max-w-[170px] font-medium">{o.shoeTitle}</span>
                    <span className="text-emerald-400 font-mono font-bold text-[10px]">Rs. {o.agreedPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
