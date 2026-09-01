import React, { useState } from 'react';
import { SaleOrder, OrderStatus, CourierName } from '../types';
import { PAKISTAN_CITIES, COURIER_PROVIDERS } from '../lib/initialData';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  MapPin, 
  Phone, 
  Printer, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  ExternalLink,
  Edit,
  Filter
} from 'lucide-react';

interface SalesViewProps {
  sales: SaleOrder[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onOpenPrintWaybill: (sale: SaleOrder) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  sales,
  searchQuery,
  setSearchQuery,
  onUpdateOrderStatus,
  onOpenPrintWaybill,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCourier, setSelectedCourier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredSales = sales.filter(s => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      s.customerName.toLowerCase().includes(query) ||
      s.customerPhone.toLowerCase().includes(query) ||
      s.city.toLowerCase().includes(query) ||
      s.trackingNumber.toLowerCase().includes(query) ||
      s.shoeSKU.toLowerCase().includes(query) ||
      s.shoeTitle.toLowerCase().includes(query);

    const matchesCity = selectedCity === 'all' || s.city === selectedCity;
    const matchesCourier = selectedCourier === 'all' || s.courierName === selectedCourier;
    const matchesStatus = selectedStatus === 'all' || s.orderStatus === selectedStatus;

    return matchesQuery && matchesCity && matchesCourier && matchesStatus;
  });

  const getTrackingUrl = (courierName: string, trackingNum: string) => {
    const found = COURIER_PROVIDERS.find(c => c.name === courierName);
    if (found && found.trackingUrl) {
      return `${found.trackingUrl}${trackingNum}`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(courierName + ' tracking ' + trackingNum)}`;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              Customer Orders & Sales Dispatch Log
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-bold">
                {filteredSales.length} orders
              </span>
            </h2>
            <p className="text-xs text-slate-400">Track sold shoes, buyer phone numbers, cities, couriers, and tracking numbers.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, phone, city, tracking..."
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Pakistani Cities</option>
            {PAKISTAN_CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedCourier}
            onChange={(e) => setSelectedCourier(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Courier Services</option>
            {COURIER_PROVIDERS.map(cp => (
              <option key={cp.name} value={cp.name}>{cp.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Order Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Booked with Courier">Booked with Courier</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Returned / RTS">Returned / RTS</option>
          </select>
        </div>
      </div>

      {/* Orders List Table */}
      {filteredSales.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Customer Sales Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSales.map((sale) => {
            const profit = sale.agreedPrice - sale.costPrice;

            return (
              <div
                key={sale.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                      {sale.id}
                    </span>
                    <span className="text-slate-400">Order Date: <strong className="text-slate-200">{sale.orderDate}</strong></span>
                  </div>

                  {/* Status Editor */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">Courier Status:</span>
                    <select
                      value={sale.orderStatus}
                      onChange={(e) => onUpdateOrderStatus(sale.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none ${
                        sale.orderStatus === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : sale.orderStatus === 'In Transit'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : sale.orderStatus === 'Returned / RTS'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      <option value="Processing" className="bg-slate-900 text-white">Processing</option>
                      <option value="Booked with Courier" className="bg-slate-900 text-white">Booked with Courier</option>
                      <option value="In Transit" className="bg-slate-900 text-white">In Transit</option>
                      <option value="Delivered" className="bg-slate-900 text-white">Delivered</option>
                      <option value="Returned / RTS" className="bg-slate-900 text-white">Returned / RTS</option>
                      <option value="Cancelled" className="bg-slate-900 text-white">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Body Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Column 1: Shoe Pair Info */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                      SKU: {sale.shoeSKU}
                    </span>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{sale.shoeTitle}</h4>
                    <p className="text-slate-400 text-[11px]">
                      Brand: <strong className="text-slate-200">{sale.shoeBrand}</strong> • Size: <strong className="text-emerald-300">{sale.shoeSize}</strong>
                    </p>
                  </div>

                  {/* Column 2: Customer Shipping Info */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-200 text-sm">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{sale.customerName}</span>
                    </div>
                    <p className="text-emerald-300 font-mono font-bold text-xs">{sale.customerPhone}</p>
                    <p className="text-slate-400 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <strong className="text-white">{sale.city}</strong>: {sale.address}
                    </p>
                  </div>

                  {/* Column 3: Courier & COD Financials */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          {sale.courierName}
                        </span>
                        <a
                          href={getTrackingUrl(sale.courierName, sale.trackingNumber)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5 font-mono"
                        >
                          <span>{sale.trackingNumber}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">COD Collect:</span>
                        <span className="font-extrabold text-amber-300 text-sm font-mono">
                          Rs. {sale.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                      <span>Method: {sale.paymentMethod}</span>
                      <span className="text-teal-400 font-bold">Profit: +Rs. {profit.toLocaleString()}</span>
                    </div>
                  </div>

                </div>

                {/* Footer Action Bar */}
                <div className="flex justify-between items-center pt-2 text-xs">
                  <span className="text-[11px] text-slate-500 italic">
                    {sale.notes ? `Note: ${sale.notes}` : 'Double checked and disinfected before packing'}
                  </span>

                  <button
                    onClick={() => onOpenPrintWaybill(sale)}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition text-xs"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                    <span>Print Courier Waybill / Slip</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
