import React from 'react';
import { ShoeItem, SaleOrder } from '../types';
import { 
  X, 
  Tag, 
  QrCode, 
  Printer, 
  ShoppingBag, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  ExternalLink,
  ShieldAlert,
  User,
  MapPin,
  Phone,
  Truck
} from 'lucide-react';

interface ShoeDetailModalProps {
  shoe: ShoeItem | null;
  saleOrder?: SaleOrder | null;
  onClose: () => void;
  onEdit: (shoe: ShoeItem) => void;
  onDelete: (id: string) => void;
  onMarkAsSold: (shoe: ShoeItem) => void;
  onOpenPrintWaybill?: (sale: SaleOrder) => void;
}

export const ShoeDetailModal: React.FC<ShoeDetailModalProps> = ({
  shoe,
  saleOrder,
  onClose,
  onEdit,
  onDelete,
  onMarkAsSold,
  onOpenPrintWaybill,
}) => {
  if (!shoe) return null;

  const profit = shoe.sellingPrice - shoe.costPrice;
  const profitMargin = Math.round((profit / shoe.sellingPrice) * 100);
  const isSold = shoe.status === 'sold';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header Bar */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/80 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
              {shoe.sku}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              isSold 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : shoe.status === 'reserved'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {isSold ? 'SOLD' : shoe.status === 'reserved' ? 'RESERVED' : 'AVAILABLE'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Visual & Key Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image Preview */}
            <div className="space-y-3">
              <div className="aspect-4/3 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative">
                <img
                  src={shoe.image}
                  alt={shoe.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Printable Barcode Label Tag Card */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>scrapa.pk</span>
                  <span>SIZE: {shoe.size}</span>
                </div>
                {/* SVG Barcode Representation */}
                <div className="py-1 flex justify-center items-center gap-0.5 text-slate-200">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span 
                      key={i} 
                      className="bg-emerald-400 inline-block h-7" 
                      style={{ width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px' }} 
                    />
                  ))}
                </div>
                <p className="font-mono text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
                  *{shoe.sku}*
                </p>
              </div>
            </div>

            {/* Specifications Details */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  {shoe.brand}
                </span>
                <h2 className="text-xl font-extrabold text-white mt-0.5">
                  {shoe.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{shoe.category} • {shoe.color}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Shoe Size</span>
                  <span className="font-bold text-white text-sm">{shoe.size}</span>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Condition Grade</span>
                  <span className="font-bold text-emerald-300 text-xs">{shoe.conditionGrade}</span>
                </div>
              </div>

              {/* Financial Box */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">Listing Price (PKR):</span>
                  <span className="font-extrabold text-emerald-400 text-lg">
                    Rs. {shoe.sellingPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Cost Price: Rs. {shoe.costPrice.toLocaleString()}</span>
                  <span className="text-teal-300 font-bold">
                    Net Profit: +Rs. {profit.toLocaleString()} ({profitMargin}%)
                  </span>
                </div>
              </div>

              {shoe.notes && (
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs text-slate-300">
                  <strong className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">Item Notes:</strong>
                  <p className="italic">{shoe.notes}</p>
                </div>
              )}
            </div>

          </div>

          {/* If Sold: Customer Order Information */}
          {isSold && saleOrder && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-400" />
                  Customer Dispatch & Delivery Record
                </h4>
                {onOpenPrintWaybill && (
                  <button
                    onClick={() => onOpenPrintWaybill(saleOrder)}
                    className="text-[11px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Courier Slip</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3 text-emerald-400" /> Customer: <strong className="text-white">{saleOrder.customerName}</strong>
                  </p>
                  <p className="text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" /> Phone: <strong className="text-emerald-300">{saleOrder.customerPhone}</strong>
                  </p>
                  <p className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" /> City: <strong className="text-white">{saleOrder.city}</strong>
                  </p>
                  <p className="text-slate-500 text-[10px] pl-4">{saleOrder.address}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400 flex items-center gap-1">
                    <Truck className="w-3 h-3 text-sky-400" /> Courier: <strong className="text-white">{saleOrder.courierName}</strong>
                  </p>
                  <p className="text-slate-400 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-sky-400" /> Tracking: <strong className="text-sky-300 font-mono">{saleOrder.trackingNumber}</strong>
                  </p>
                  <p className="text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-amber-400" /> COD Amount: <strong className="text-amber-300">Rs. {saleOrder.totalAmount.toLocaleString()}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-800/80 px-6 py-4 border-t border-slate-700/80 flex justify-between items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm(`Delete ${shoe.sku}?`)) {
                onDelete(shoe.id);
                onClose();
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-2 rounded-xl hover:bg-rose-950/40 transition flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(shoe);
                onClose();
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Pair</span>
            </button>

            {!isSold && (
              <button
                onClick={() => {
                  onClose();
                  onMarkAsSold(shoe);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>Sell / Dispatch Pair</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
