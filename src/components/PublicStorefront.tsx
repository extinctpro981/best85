import React, { useState } from 'react';
import { ShoeItem } from '../types';
import { Search, Tag, Eye, ArrowLeft, MessageCircle, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PublicStorefrontProps {
  shoes: ShoeItem[];
  onBackToAdmin: () => void;
}

export const PublicStorefront: React.FC<PublicStorefrontProps> = ({
  shoes,
  onBackToAdmin,
}) => {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');

  // Filter only AVAILABLE shoes
  const availableShoes = shoes.filter(s => s.status === 'available');

  const filtered = availableShoes.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = 
      s.title.toLowerCase().includes(q) ||
      s.sku.toLowerCase().includes(q) ||
      s.brand.toLowerCase().includes(q) ||
      s.color.toLowerCase().includes(q);

    const matchesBrand = brandFilter === 'all' || s.brand === brandFilter;
    const matchesSize = sizeFilter === 'all' || s.size.toLowerCase().includes(sizeFilter.toLowerCase());

    return matchesSearch && matchesBrand && matchesSize;
  });

  const getWhatsAppOrderLink = (shoe: ShoeItem) => {
    const phone = '923008472910'; // Pakistan WhatsApp number format
    const message = `Hello scrapa.pk! 👋 I am interested in buying this preloved shoe:
👟 *${shoe.title}*
🏷️ SKU: *${shoe.sku}*
📏 Size: *${shoe.size}*
✨ Condition: *${shoe.conditionGrade}*
💰 Price: *Rs. ${shoe.sellingPrice.toLocaleString()}*

Is this pair still available for delivery?`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6 pb-16 bg-slate-950 min-h-screen text-slate-100 rounded-3xl p-4 sm:p-6 border border-purple-900/40">
      
      {/* Top Banner Notice */}
      <div className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-purple-200">
            PUBLIC CUSTOMER SHOWCASE VIEW • scrapa.pk
          </span>
          <span className="text-[10px] text-purple-300/80 hidden sm:inline">(Internal cost prices & profits are hidden)</span>
        </div>

        <button
          onClick={onBackToAdmin}
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Return to Admin Dashboard</span>
        </button>
      </div>

      {/* Storefront Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 p-8 rounded-3xl border border-purple-800/40 text-center space-y-3 relative overflow-hidden shadow-2xl">
        <div className="inline-block bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30 uppercase tracking-widest">
          Authentic Preloved & Thrift Shoes Pakistan
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight bg-gradient-to-r from-white via-purple-100 to-emerald-300 bg-clip-text text-transparent">
          scrapa.pk Shoe Drop
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          100% Original Thrifted & Preloved Sneakers, Boots & Athletic Shoes. Each pair is a unique model & size. Express COD Shipping across Pakistan!
        </p>

        <div className="pt-2 flex justify-center items-center gap-4 text-xs font-medium text-emerald-400">
          <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Disinfected & Cleaned</span>
          <span>•</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Nationwide COD Courier</span>
        </div>
      </div>

      {/* Customer Filters */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search model, brand, color..."
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        >
          <option value="all">All Brands</option>
          <option value="Nike">Nike</option>
          <option value="Adidas">Adidas</option>
          <option value="New Balance">New Balance</option>
          <option value="Jordan">Jordan</option>
          <option value="Puma">Puma</option>
          <option value="Asics">Asics</option>
          <option value="Dr. Martens">Dr. Martens</option>
          <option value="Converse">Converse</option>
          <option value="Vans">Vans</option>
          <option value="Timberland">Timberland</option>
        </select>

        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        >
          <option value="all">All Available Sizes</option>
          <option value="40">EU 40 / US 7</option>
          <option value="41">EU 41 / US 8</option>
          <option value="42">EU 42 / US 8.5</option>
          <option value="43">EU 43 / US 9.5</option>
          <option value="44">EU 44 / US 10</option>
          <option value="45">EU 45 / US 11</option>
        </select>
      </div>

      {/* Shoe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((shoe) => (
          <div
            key={shoe.id}
            className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden shadow-2xl transition group flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 bg-slate-950 overflow-hidden">
              <img
                src={shoe.image}
                alt={shoe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              
              <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                {shoe.sku}
              </span>

              <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                SIZE: {shoe.size}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                  {shoe.brand}
                </span>
                <h3 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                  {shoe.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">{shoe.conditionGrade}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Price (PKR)</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    Rs. {shoe.sellingPrice.toLocaleString()}
                  </span>
                </div>

                <a
                  href={getWhatsAppOrderLink(shoe)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
