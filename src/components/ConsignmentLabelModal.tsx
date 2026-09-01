import React from 'react';
import { SaleOrder } from '../types';
import { X, Printer, Truck, ShieldCheck, Phone, MapPin, Building } from 'lucide-react';

interface ConsignmentLabelModalProps {
  sale: SaleOrder | null;
  onClose: () => void;
}

export const ConsignmentLabelModal: React.FC<ConsignmentLabelModalProps> = ({
  sale,
  onClose,
}) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/80 flex justify-between items-center print:hidden">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            Print Courier Dispatch Air Waybill ({sale.courierName})
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Label Slip Body */}
        <div className="p-6 bg-white text-slate-950 print:p-0 print:m-0 space-y-4 font-sans text-xs">
          
          {/* Waybill Top Banner */}
          <div className="border-2 border-slate-900 p-3 rounded-lg space-y-3">
            
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2">
              <div>
                <h1 className="text-2xl font-extrabold uppercase tracking-tight text-slate-900">
                  {sale.courierName}
                </h1>
                <p className="text-[10px] font-bold text-slate-600">DOMESTIC COD EXPRESS DISPATCH</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono bg-slate-900 text-white px-2.5 py-1 rounded">
                  {sale.paymentMethod === 'COD' ? 'COD SHIPMENT' : 'PREPAID'}
                </span>
                <p className="text-[10px] text-slate-600 mt-1">Date: {sale.orderDate}</p>
              </div>
            </div>

            {/* Barcode Area */}
            <div className="text-center py-2 bg-slate-100 rounded border border-slate-300">
              <div className="flex justify-center items-center gap-0.5 h-10">
                {Array.from({ length: 32 }).map((_, i) => (
                  <span
                    key={i}
                    className="bg-slate-900 inline-block h-full"
                    style={{ width: i % 4 === 0 ? '4px' : i % 2 === 0 ? '1px' : '2px' }}
                  />
                ))}
              </div>
              <p className="font-mono text-sm font-black tracking-widest text-slate-900 mt-1">
                {sale.trackingNumber}
              </p>
            </div>

            {/* Shipper & Consignee Split */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-slate-900 text-[11px]">
              
              {/* Shipper */}
              <div className="p-2 border border-slate-300 rounded bg-slate-50">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">SHIPPER (SENDER):</p>
                <p className="font-extrabold text-slate-900 text-xs mt-0.5">scrapa.pk Thrift Store</p>
                <p className="text-slate-700">Preloved Shoes Hub, Gulberg III</p>
                <p className="text-slate-700">Lahore, Pakistan</p>
                <p className="text-slate-900 font-bold mt-1">Ph: 0300-8472910</p>
              </div>

              {/* Consignee */}
              <div className="p-2 border-2 border-slate-900 rounded bg-emerald-50">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">CONSIGNEE (RECEIVER):</p>
                <p className="font-black text-slate-900 text-sm mt-0.5">{sale.customerName}</p>
                <p className="font-bold text-emerald-800 text-xs">CITY: {sale.city.toUpperCase()}</p>
                <p className="text-slate-900 font-medium text-[11px] leading-tight mt-0.5">{sale.address}</p>
                <p className="font-extrabold text-slate-900 text-xs mt-1">PH: {sale.customerPhone}</p>
              </div>

            </div>

            {/* Item & COD Amount Box */}
            <div className="p-2.5 bg-slate-900 text-white rounded flex justify-between items-center text-xs">
              <div>
                <p className="text-[10px] text-slate-300 uppercase font-bold">ARTICLE DETAILS:</p>
                <p className="font-extrabold text-sm text-emerald-400">{sale.shoeTitle}</p>
                <p className="text-[10px] text-slate-300">SKU: {sale.shoeSKU} • Size: {sale.shoeSize}</p>
              </div>

              <div className="text-right border-l border-slate-700 pl-3">
                <p className="text-[10px] text-slate-300 uppercase font-bold">COD AMOUNT TO COLLECT:</p>
                <p className="text-lg font-black font-mono text-emerald-300">
                  Rs. {sale.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Fragile & Terms Footer */}
            <div className="flex justify-between items-center text-[9px] text-slate-600 border-t border-slate-300 pt-1">
              <span>FRAGILE - PRELOVED SHOES PACKAGING</span>
              <span>INSPECTED & DISINFECTED BY SCRAPA.PK</span>
            </div>

          </div>

        </div>

        {/* Modal Footer (Hidden when printing) */}
        <div className="bg-slate-800/80 px-6 py-4 border-t border-slate-700/80 flex justify-between items-center print:hidden">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-medium px-4 py-2 rounded-xl"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Print Waybill Slip</span>
          </button>
        </div>

      </div>
    </div>
  );
};
