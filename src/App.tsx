import React, { useState, useEffect } from 'react';
import { ShoeItem, SaleOrder, ViewTab, OrderStatus } from './types';
import { INITIAL_SHOES, INITIAL_SALES } from './lib/initialData';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { InventoryView } from './components/InventoryView';
import { ShoeDetailModal } from './components/ShoeDetailModal';
import { AddEditShoeModal } from './components/AddEditShoeModal';
import { SellShoeModal } from './components/SellShoeModal';
import { SalesView } from './components/SalesView';
import { CustomerCRM } from './components/CustomerCRM';
import { BulkUploadModal } from './components/BulkUploadModal';
import { ConsignmentLabelModal } from './components/ConsignmentLabelModal';
import { PublicStorefront } from './components/PublicStorefront';

export default function App() {
  // Load state from localStorage or initialize with pre-seeded data
  const [shoes, setShoes] = useState<ShoeItem[]>(() => {
    const saved = localStorage.getItem('scrapa_shoes_inventory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SHOES;
      }
    }
    return INITIAL_SHOES;
  });

  const [sales, setSales] = useState<SaleOrder[]>(() => {
    const saved = localStorage.getItem('scrapa_sales_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SALES;
      }
    }
    return INITIAL_SALES;
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('inventory');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedShoeDetail, setSelectedShoeDetail] = useState<ShoeItem | null>(null);
  const [shoeToEdit, setShoeToEdit] = useState<ShoeItem | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);

  const [shoeForSale, setShoeForSale] = useState<ShoeItem | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  const [saleForWaybill, setSaleForWaybill] = useState<SaleOrder | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('scrapa_shoes_inventory', JSON.stringify(shoes));
  }, [shoes]);

  useEffect(() => {
    localStorage.setItem('scrapa_sales_orders', JSON.stringify(sales));
  }, [sales]);

  // Calculated Counters
  const availableCount = shoes.filter(s => s.status === 'available').length;
  const soldCount = shoes.filter(s => s.status === 'sold').length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.agreedPrice, 0);

  // Handlers
  const handleOpenAddModal = () => {
    setShoeToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEditModal = (shoe: ShoeItem) => {
    setShoeToEdit(shoe);
    setIsAddEditOpen(true);
  };

  const handleSaveShoe = (shoeData: Partial<ShoeItem>) => {
    if (shoeToEdit) {
      // Edit existing
      setShoes(prev =>
        prev.map(s => (s.id === shoeToEdit.id ? { ...s, ...shoeData } as ShoeItem : s))
      );
    } else {
      // Create new
      const newShoe: ShoeItem = {
        id: shoeData.id || `SCR-${Math.floor(1000 + Math.random() * 9000)}`,
        sku: shoeData.sku || `SCR-${Math.floor(1000 + Math.random() * 9000)}`,
        title: shoeData.title || 'Preloved Shoe Pair',
        brand: shoeData.brand || 'Nike',
        category: shoeData.category || 'Sneakers',
        size: shoeData.size || 'EU 42',
        sizeEU: 42,
        conditionGrade: shoeData.conditionGrade || '9/10 Excellent Preloved',
        color: shoeData.color || 'Multi-color',
        costPrice: shoeData.costPrice || 2500,
        sellingPrice: shoeData.sellingPrice || 6500,
        status: shoeData.status || 'available',
        image: shoeData.image || '/images/nike-sneaker.jpg',
        notes: shoeData.notes || '',
        dateAdded: new Date().toISOString().split('T')[0],
      };
      setShoes(prev => [newShoe, ...prev]);
    }
    setIsAddEditOpen(false);
  };

  const handleDeleteShoe = (id: string) => {
    setShoes(prev => prev.filter(s => s.id !== id));
    setSales(prev => prev.filter(sale => sale.shoeId !== id));
  };

  const handleBatchDeleteShoes = (ids: string[]) => {
    setShoes(prev => prev.filter(s => !ids.includes(s.id)));
    setSales(prev => prev.filter(sale => !ids.includes(sale.shoeId)));
  };

  const handleOpenSellModal = (shoe: ShoeItem) => {
    setShoeForSale(shoe);
    setIsSellModalOpen(true);
  };

  const handleCompleteSale = (saleOrder: SaleOrder) => {
    // 1. Add order to sales list
    setSales(prev => [saleOrder, ...prev]);

    // 2. Mark shoe as sold
    setShoes(prev =>
      prev.map(s =>
        s.id === saleOrder.shoeId
          ? {
              ...s,
              status: 'sold',
              dateSold: saleOrder.orderDate,
              saleId: saleOrder.id,
            }
          : s
      )
    );

    setIsSellModalOpen(false);
    setShoeForSale(null);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setSales(prev =>
      prev.map(sale => (sale.id === orderId ? { ...sale, orderStatus: newStatus } : sale))
    );
  };

  const handleImportBulkShoes = (newShoes: ShoeItem[]) => {
    setShoes(prev => [...newShoes, ...prev]);
    setActiveTab('inventory');
  };

  const handleResetData = () => {
    if (window.confirm('Reset scrapa.pk to original preloaded thrift shoe demo dataset?')) {
      setShoes(INITIAL_SHOES);
      setSales(INITIAL_SALES);
      localStorage.removeItem('scrapa_shoes_inventory');
      localStorage.removeItem('scrapa_sales_orders');
    }
  };

  // Find linked sale order if shoe detail is open
  const selectedSaleOrder = selectedShoeDetail
    ? sales.find(s => s.shoeId === selectedShoeDetail.id || s.id === selectedShoeDetail.saleId)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        availableCount={availableCount}
        soldCount={soldCount}
        totalRevenue={totalRevenue}
        onOpenAddModal={handleOpenAddModal}
        onResetData={handleResetData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <Dashboard
            shoes={shoes}
            sales={sales}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAddModal={handleOpenAddModal}
            onOpenSellModalForShoe={handleOpenSellModal}
          />
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <InventoryView
            shoes={shoes}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenAddModal={handleOpenAddModal}
            onSelectShoeDetail={(shoe) => setSelectedShoeDetail(shoe)}
            onEditShoe={handleOpenEditModal}
            onDeleteShoe={handleDeleteShoe}
            onMarkAsSold={handleOpenSellModal}
            onBatchDelete={handleBatchDeleteShoes}
          />
        )}

        {/* Sales & Customer Tracking Tab */}
        {activeTab === 'sales' && (
          <SalesView
            sales={sales}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onOpenPrintWaybill={(sale) => setSaleForWaybill(sale)}
          />
        )}

        {/* Customer CRM Directory Tab */}
        {activeTab === 'customers' && (
          <CustomerCRM sales={sales} />
        )}

        {/* Bulk Excel/PDF Upload Tab */}
        {activeTab === 'bulk-upload' && (
          <BulkUploadModal
            onImportShoes={handleImportBulkShoes}
          />
        )}

        {/* Public Storefront View */}
        {activeTab === 'storefront' && (
          <PublicStorefront
            shoes={shoes}
            onBackToAdmin={() => setActiveTab('inventory')}
          />
        )}

      </main>

      {/* Modals & Overlays */}
      
      {/* 1. Shoe Specs & Barcode Detail Modal */}
      <ShoeDetailModal
        shoe={selectedShoeDetail}
        saleOrder={selectedSaleOrder}
        onClose={() => setSelectedShoeDetail(null)}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteShoe}
        onMarkAsSold={handleOpenSellModal}
        onOpenPrintWaybill={(sale) => setSaleForWaybill(sale)}
      />

      {/* 2. Add / Edit Single Pair Modal */}
      <AddEditShoeModal
        isOpen={isAddEditOpen}
        shoeToEdit={shoeToEdit}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveShoe}
      />

      {/* 3. Mark as Sold / Dispatch Form Modal */}
      <SellShoeModal
        shoe={shoeForSale}
        isOpen={isSellModalOpen}
        onClose={() => {
          setIsSellModalOpen(false);
          setShoeForSale(null);
        }}
        onCompleteSale={handleCompleteSale}
      />

      {/* 4. Courier Consignment Air Waybill Modal */}
      <ConsignmentLabelModal
        sale={saleForWaybill}
        onClose={() => setSaleForWaybill(null)}
      />

    </div>
  );
}
