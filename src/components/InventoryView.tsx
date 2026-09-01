import React, { useState } from 'react';
import { 
  ShoeItem, 
  ShoeBrand, 
  ShoeCategory, 
  ShoeStatus 
} from '../types';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  ShoppingBag, 
  Eye, 
  Edit, 
  Trash2, 
  Tag, 
  CheckSquare, 
  Square, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  Share2
} from 'lucide-react';

interface InventoryViewProps {
  shoes: ShoeItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAddModal: () => void;
  onSelectShoeDetail: (shoe: ShoeItem) => void;
  onEditShoe: (shoe: ShoeItem) => void;
  onDeleteShoe: (id: string) => void;
  onMarkAsSold: (shoe: ShoeItem) => void;
  onBatchDelete?: (ids: string[]) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  shoes,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onSelectShoeDetail,
  onEditShoe,
  onDeleteShoe,
  onMarkAsSold,
  onBatchDelete,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter logic
  const filteredShoes = shoes.filter(s => {
    // Search query
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      s.title.toLowerCase().includes(query) ||
      s.sku.toLowerCase().includes(query) ||
      s.brand.toLowerCase().includes(query) ||
      s.size.toLowerCase().includes(query) ||
      s.color.toLowerCase().includes(query) ||
      (s.notes && s.notes.toLowerCase().includes(query));

    // Status filter
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;

    // Brand filter
    const matchesBrand = selectedBrand === 'all' || s.brand === selectedBrand;

    // Category filter
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;

    // Size filter
    const matchesSize = selectedSize === 'all' || s.size.toLowerCase().includes(selectedSize.toLowerCase());

    return matchesSearch && matchesStatus && matchesBrand && matchesCategory && matchesSize;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredShoes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredShoes.map(s => s.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected shoes?`)) {
      if (onBatchDelete) {
        onBatchDelete(selectedIds);
      } else {
        selectedIds.forEach(id => onDeleteShoe(id));
      }
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        
        {/* Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-400" />
              Preloved Shoe Inventory
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-bold">
                {filteredShoes.length} pairs
              </span>
            </h2>
            <p className="text-xs text-slate-400">Each pair is a unique model, size, and thrift condition grade.</p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View Mode Switcher */}
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onOpenAddModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Pair</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800">
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, SKU, size..."
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available Stock</option>
            <option value="sold">Sold Items</option>
            <option value="reserved">Reserved</option>
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
            <option value="Reebok">Reebok</option>
            <option value="Hoka">Hoka</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Sneakers">Sneakers</option>
            <option value="Running / Athletic">Running / Athletic</option>
            <option value="Casual / Canvas">Casual / Canvas</option>
            <option value="Boots & Leather">Boots & Leather</option>
            <option value="Loafers & Formals">Loafers & Formals</option>
            <option value="Retro & Vintage">Retro & Vintage</option>
          </select>

          {/* Size Quick Select */}
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Sizes</option>
            <option value="40">EU 40 / US 7</option>
            <option value="41">EU 41 / US 8</option>
            <option value="42">EU 42 / US 8.5</option>
            <option value="43">EU 43 / US 9.5</option>
            <option value="44">EU 44 / US 10</option>
            <option value="45">EU 45 / US 11</option>
          </select>

        </div>

        {/* Batch Actions Banner (if items selected) */}
        {selectedIds.length > 0 && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 p-3 rounded-xl flex justify-between items-center text-xs">
            <span className="text-emerald-200 font-medium">
              <strong>{selectedIds.length}</strong> items selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBatchDelete}
                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Main Shoes Content Display */}
      {filteredShoes.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Tag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Preloved Shoes Found</h3>
          <p className="text-xs max-w-md mx-auto text-slate-400">
            No items matched your search filters. Try clearing filters or add a new shoe pair to inventory.
          </p>
          <button
            onClick={onOpenAddModal}
            className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Pair</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* Grid Mode View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredShoes.map((shoe) => {
            const profit = shoe.sellingPrice - shoe.costPrice;
            const isSold = shoe.status === 'sold';

            return (
              <div
                key={shoe.id}
                className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-xl transition group flex flex-col justify-between ${
                  isSold 
                    ? 'border-slate-800/80 opacity-80' 
                    : 'border-slate-800 hover:border-emerald-500/50 hover:shadow-emerald-500/10'
                }`}
              >
                {/* Image Header with Badge Overlays */}
                <div className="relative aspect-4/3 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onSelectShoeDetail(shoe)}>
                  <img
                    src={shoe.image}
                    alt={shoe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      // Fallback image on error
                      (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80');
                    }}
                  />
                  
                  {/* SKU Badge */}
                  <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    {shoe.sku}
                  </span>

                  {/* Status Badge */}
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-md ${
                    isSold
                      ? 'bg-rose-500/90 text-white'
                      : shoe.status === 'reserved'
                      ? 'bg-amber-500/90 text-slate-950'
                      : 'bg-emerald-500/90 text-slate-950'
                  }`}>
                    {isSold ? 'SOLD' : shoe.status === 'reserved' ? 'RESERVED' : 'AVAILABLE'}
                  </span>

                  {/* Size overlay */}
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                    {shoe.size}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                        {shoe.brand}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        {shoe.category}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectShoeDetail(shoe)}
                      className="text-sm font-bold text-white line-clamp-1 hover:text-emerald-400 cursor-pointer transition mt-0.5"
                    >
                      {shoe.title}
                    </h3>

                    {/* Condition Rating */}
                    <div className="mt-1.5 flex items-center justify-between text-[11px]">
                      <span className="bg-slate-800 text-slate-300 border border-slate-700/80 px-2 py-0.5 rounded text-[10px] font-medium">
                        {shoe.conditionGrade}
                      </span>
                      <span className="text-slate-400 text-[10px] truncate max-w-[110px]">
                        {shoe.color}
                      </span>
                    </div>
                  </div>

                  {/* Financial & Profit Details */}
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 text-[10px]">Selling Price:</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        Rs. {shoe.sellingPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Cost: Rs. {shoe.costPrice.toLocaleString()}</span>
                      <span className="text-teal-400 font-bold">
                        Profit: +Rs. {profit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5">
                    {!isSold ? (
                      <button
                        onClick={() => onMarkAsSold(shoe)}
                        className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Sell / Dispatch</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectShoeDetail(shoe)}
                        className="flex-1 bg-slate-800 text-slate-300 hover:bg-slate-700 py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sale Details</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectShoeDetail(shoe)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
                      title="View Tag & Barcode"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onEditShoe(shoe)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
                      title="Edit Shoe Details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${shoe.title} (${shoe.sku})?`)) {
                          onDeleteShoe(shoe.id);
                        }
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700 transition"
                      title="Delete Shoe"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      ) : (

        /* Table Mode View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === filteredShoes.length}
                      onChange={toggleSelectAll}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="py-3 px-3">SKU & Photo</th>
                  <th className="py-3 px-3">Model & Brand</th>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Condition</th>
                  <th className="py-3 px-3 text-right">Cost (PKR)</th>
                  <th className="py-3 px-3 text-right">Price (PKR)</th>
                  <th className="py-3 px-3 text-right">Profit</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredShoes.map((shoe) => {
                  const profit = shoe.sellingPrice - shoe.costPrice;
                  const isSold = shoe.status === 'sold';
                  const isChecked = selectedIds.includes(shoe.id);

                  return (
                    <tr key={shoe.id} className={`hover:bg-slate-800/40 transition ${isChecked ? 'bg-emerald-950/20' : ''}`}>
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(shoe.id)}
                          className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                        />
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={shoe.image}
                            alt={shoe.title}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-800 bg-slate-950"
                          />
                          <span className="font-mono text-emerald-400 font-bold text-[11px]">
                            {shoe.sku}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div 
                          onClick={() => onSelectShoeDetail(shoe)}
                          className="font-bold text-white hover:text-emerald-400 cursor-pointer"
                        >
                          {shoe.title}
                        </div>
                        <div className="text-[10px] text-slate-400">{shoe.brand} • {shoe.category}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded text-[11px] border border-slate-700">
                          {shoe.size}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                          {shoe.conditionGrade}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right text-slate-400 font-mono">
                        Rs. {shoe.costPrice.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-emerald-400 font-mono">
                        Rs. {shoe.sellingPrice.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-teal-300 font-mono">
                        +Rs. {profit.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isSold 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : shoe.status === 'reserved'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {isSold ? 'Sold' : shoe.status === 'reserved' ? 'Reserved' : 'Available'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!isSold && (
                            <button
                              onClick={() => onMarkAsSold(shoe)}
                              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold px-2 py-1 rounded-lg text-[10px] flex items-center gap-1 transition"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Sell</span>
                            </button>
                          )}
                          <button
                            onClick={() => onSelectShoeDetail(shoe)}
                            className="p-1 text-slate-400 hover:text-white"
                            title="View Tag"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditShoe(shoe)}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${shoe.sku}?`)) onDeleteShoe(shoe.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      )}

    </div>
  );
};
