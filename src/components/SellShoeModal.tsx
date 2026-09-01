import React, { useState, useEffect } from 'react';
import { ShoeItem, SaleOrder, CourierName, PaymentMethod, PaymentStatus, OrderStatus } from '../types';
import { PAKISTAN_CITIES, COURIER_PROVIDERS } from '../lib/initialData';
import { X, ShoppingBag, Truck, User, MapPin, Phone, DollarSign, CheckCircle2, RefreshCw } from 'lucide-react';

interface SellShoeModalProps {
  shoe: ShoeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteSale: (saleData: SaleOrder) => void;
}

export const SellShoeModal: React.FC<SellShoeModalProps> = ({
  shoe,
  isOpen,
  onClose,
  onCompleteSale,
}) => {
  if (!isOpen || !shoe) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('0300-1234567');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [courierName, setCourierName] = useState<CourierName>('TCS');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [agreedPrice, setAgreedPrice] = useState<number>(shoe.sellingPrice);
  const [shippingFee, setShippingFee] = useState<number>(250);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('Booked with Courier');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setAgreedPrice(shoe.sellingPrice);
    generateTrackingCode('TCS');
  }, [shoe]);

  const generateTrackingCode = (courier: CourierName) => {
    const prefix = courier === 'TCS' ? 'TCS' : courier.includes('Leopard') ? 'LEO' : courier === 'PostEx' ? 'PEX' : courier.includes('Trax') ? 'TRAX' : 'PK';
    const num = Math.floor(100000000 + Math.random() * 900000000);
    setTrackingNumber(`${prefix}-${num}`);
  };

  const handleCourierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCourier = e.target.value as CourierName;
    setCourierName(newCourier);
    generateTrackingCode(newCourier);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Please enter customer phone number');
      return;
    }
    if (!address.trim()) {
      alert('Please enter shipping address');
      return;
    }

    const saleOrder: SaleOrder = {
      id: `ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      shoeId: shoe.id,
      shoeSKU: shoe.sku,
      shoeTitle: shoe.title,
      shoeBrand: shoe.brand,
      shoeSize: shoe.size,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: address.trim(),
      city,
      courierName,
      trackingNumber: trackingNumber || `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      costPrice: shoe.costPrice,
      agreedPrice: Number(agreedPrice) || shoe.sellingPrice,
      shippingFee: Number(shippingFee) || 0,
      totalAmount: (Number(agreedPrice) || shoe.sellingPrice) + (Number(shippingFee) || 0),
      paymentMethod,
      paymentStatus,
      orderStatus,
      orderDate: new Date().toISOString().split('T')[0],
      notes,
    };

    onCompleteSale(saleOrder);
    onClose();
  };

  const totalAmount = agreedPrice + shippingFee;
  const netProfit = agreedPrice - shoe.costPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              Record Sale & Customer Dispatch
            </h3>
            <p className="text-xs text-slate-400">Capture buyer phone, city, address, courier, and tracking number.</p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Selected Shoe Summary Banner */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
            <img
              src={shoe.image}
              alt={shoe.title}
              className="w-14 h-14 object-cover rounded-xl border border-slate-800 bg-slate-900"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                  {shoe.sku}
                </span>
                <span className="text-xs text-slate-400">{shoe.brand}</span>
              </div>
              <h4 className="text-sm font-bold text-white line-clamp-1">{shoe.title}</h4>
              <p className="text-xs text-emerald-300 font-medium">
                Confirmed Size: <strong className="text-white">{shoe.size}</strong> • Cost: Rs. {shoe.costPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Customer Personal Details */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" />
              1. Customer Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Hamza Chaudhry"
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Phone Number (Pakistan Format) *
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0300-1234567 or 0321-9876543"
                  className="w-full bg-slate-800 border border-slate-700 text-emerald-300 font-mono font-bold text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Address & City */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">City (Pakistan) *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Shipping Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 45, Street 12, Phase 5 DHA"
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Courier & Tracking Details */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              2. Courier Shipping & Tracking
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Courier Service</label>
                <select
                  value={courierName}
                  onChange={handleCourierChange}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {COURIER_PROVIDERS.map((cp) => (
                    <option key={cp.name} value={cp.name}>{cp.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Consignment / Tracking #</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. TCS-892014729"
                    className="w-full bg-slate-800 border border-slate-700 text-sky-300 font-mono font-bold text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => generateTrackingCode(courierName)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                    title="Auto Generate Tracking Code"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Sale Calculation */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              3. Payment & Pricing Breakdown (PKR)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Agreed Price (Rs.)</label>
                <input
                  type="number"
                  value={agreedPrice}
                  onChange={(e) => setAgreedPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Shipping Fee (Rs.)</label>
                <input
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="Bank Transfer">Bank Transfer (Meezan / HBL / NBP)</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Cash Hand">Cash in Hand</option>
                </select>
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-300">Total COD Amount to Collect:</span>
                <p className="text-[10px] text-slate-400">Includes shoe price + shipping fee</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-emerald-400 font-mono">
                  Rs. {totalAmount.toLocaleString()}
                </span>
                <p className="text-[10px] text-teal-300 font-bold">
                  Net Profit: +Rs. {netProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white font-medium px-4 py-2.5 rounded-xl hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Confirm Order & Mark Sold</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
