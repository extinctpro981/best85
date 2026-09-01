import React, { useState, useEffect } from 'react';
import { ShoeItem, ShoeBrand, ShoeCategory, ConditionGrade, ShoeStatus } from '../types';
import { X, Tag, Plus, Check, DollarSign, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';

interface AddEditShoeModalProps {
  isOpen: boolean;
  shoeToEdit?: ShoeItem | null;
  onClose: () => void;
  onSave: (shoeData: Partial<ShoeItem>) => void;
}

export const AddEditShoeModal: React.FC<AddEditShoeModalProps> = ({
  isOpen,
  shoeToEdit,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState<ShoeBrand>('Nike');
  const [category, setCategory] = useState<ShoeCategory>('Sneakers');
  const [size, setSize] = useState('EU 42 / US 8.5');
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>('9/10 Excellent Preloved');
  const [color, setColor] = useState('Multi-color');
  const [costPrice, setCostPrice] = useState<number>(2500);
  const [sellingPrice, setSellingPrice] = useState<number>(6500);
  const [status, setStatus] = useState<ShoeStatus>('available');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80');
  const [notes, setNotes] = useState('');
  const [sku, setSku] = useState('');

  useEffect(() => {
    if (shoeToEdit) {
      setTitle(shoeToEdit.title);
      setBrand(shoeToEdit.brand);
      setCategory(shoeToEdit.category);
      setSize(shoeToEdit.size);
      setConditionGrade(shoeToEdit.conditionGrade);
      setColor(shoeToEdit.color);
      setCostPrice(shoeToEdit.costPrice);
      setSellingPrice(shoeToEdit.sellingPrice);
      setStatus(shoeToEdit.status);
      setImage(shoeToEdit.image);
      setNotes(shoeToEdit.notes || '');
      setSku(shoeToEdit.sku);
    } else {
      // Default new shoe setup
      setTitle('');
      setBrand('Nike');
      setCategory('Sneakers');
      setSize('EU 42 / US 8.5');
      setConditionGrade('9/10 Excellent Preloved');
      setColor('Black / White');
      setCostPrice(2800);
      setSellingPrice(6800);
      setStatus('available');
      setImage('/images/nike-sneaker.jpg');
      setNotes('Thrift bale grade A, disinfected and cleaned.');
      setSku(`SCR-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [shoeToEdit, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateNewSKU = () => {
    setSku(`SCR-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a shoe title/model name.');
      return;
    }

    onSave({
      id: shoeToEdit ? shoeToEdit.id : undefined,
      sku: sku || `SCR-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      brand,
      category,
      size,
      conditionGrade,
      color,
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      status,
      image,
      notes,
      dateAdded: shoeToEdit ? shoeToEdit.dateAdded : new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  const profit = sellingPrice - costPrice;
  const profitMargin = sellingPrice > 0 ? Math.round((profit / sellingPrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/80 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-400" />
              {shoeToEdit ? 'Edit Preloved Shoe Pair' : 'Add New Preloved Shoe Pair'}
            </h3>
            <p className="text-xs text-slate-400">Specify model name, size, thrift condition, cost and sale price in PKR.</p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Row 1: SKU & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Stock SKU Code
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={generateNewSKU}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                  title="Generate New SKU"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Shoe Title / Model Name *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nike Air Max 90 OG Infrared"
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Row 2: Brand, Category, Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as ShoeBrand)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
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
                <option value="Skechers">Skechers</option>
                <option value="Under Armour">Under Armour</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ShoeCategory)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Sneakers">Sneakers</option>
                <option value="Running / Athletic">Running / Athletic</option>
                <option value="Casual / Canvas">Casual / Canvas</option>
                <option value="Boots & Leather">Boots & Leather</option>
                <option value="Loafers & Formals">Loafers & Formals</option>
                <option value="Slides & Sandals">Slides & Sandals</option>
                <option value="Retro & Vintage">Retro & Vintage</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Size (EU/US/UK)</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. EU 42 / US 8.5"
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Row 3: Condition Grade & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Thrift Condition Grade</label>
              <select
                value={conditionGrade}
                onChange={(e) => setConditionGrade(e.target.value as ConditionGrade)}
                className="w-full bg-slate-800 border border-slate-700 text-emerald-300 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="10/10 Brand New (Unworn)">10/10 Brand New (Unworn)</option>
                <option value="9.5/10 Like New (Tried On)">9.5/10 Like New (Tried On)</option>
                <option value="9/10 Excellent Preloved">9/10 Excellent Preloved</option>
                <option value="8.5/10 Very Good Thrift">8.5/10 Very Good Thrift</option>
                <option value="8/10 Clean Used">8/10 Clean Used</option>
                <option value="7/10 Vintage Patina">7/10 Vintage Patina</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Colorway</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. White / Infrared / Black"
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Pricing PKR & Live Margin Indicator */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span>Financial Pricing (Pakistani Rupees)</span>
              <span className="text-[10px] text-emerald-400 font-mono">Currency: PKR / Rs.</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Cost Price (Rs.)
                </label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Selling Price (Rs.)
                </label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Expected Net Profit:</span>
              <span className={`font-extrabold ${profit > 0 ? 'text-teal-300' : 'text-rose-400'}`}>
                +Rs. {profit.toLocaleString()} ({profitMargin}% Margin)
              </span>
            </div>
          </div>

          {/* Row 5: Photo URL / Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Shoe Photo</label>
            <div className="flex items-center gap-3">
              <img
                src={image}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-xl border border-slate-700 bg-slate-950"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80');
                }}
              />
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL or upload file..."
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-[10px] text-slate-400 file:bg-slate-800 file:border-0 file:rounded-md file:px-2 file:py-1 file:text-white hover:file:bg-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Row 6: Status & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ShoeStatus)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Notes / Thrift Grade Info</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Minor scuff on heel, clean insoles, bale batch #12"
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
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
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{shoeToEdit ? 'Save Changes' : 'Add to Inventory'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
