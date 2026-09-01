export type ShoeBrand = 
  | 'Nike'
  | 'Adidas'
  | 'New Balance'
  | 'Puma'
  | 'Jordan'
  | 'Asics'
  | 'Dr. Martens'
  | 'Reebok'
  | 'Converse'
  | 'Vans'
  | 'Timberland'
  | 'Skechers'
  | 'Under Armour'
  | 'Hoka'
  | 'Other';

export type ShoeCategory = 
  | 'Sneakers'
  | 'Running / Athletic'
  | 'Casual / Canvas'
  | 'Boots & Leather'
  | 'Loafers & Formals'
  | 'Slides & Sandals'
  | 'Retro & Vintage';

export type ShoeStatus = 'available' | 'reserved' | 'sold';

export type ConditionGrade = 
  | '10/10 Brand New (Unworn)'
  | '9.5/10 Like New (Tried On)'
  | '9/10 Excellent Preloved'
  | '8.5/10 Very Good Thrift'
  | '8/10 Clean Used'
  | '7/10 Vintage Patina';

export interface ShoeItem {
  id: string; // e.g., 'SCR-1001'
  sku: string;
  title: string;
  brand: ShoeBrand;
  category: ShoeCategory;
  size: string; // e.g. "EU 42 / US 8.5" or "42"
  sizeEU: number;
  conditionGrade: ConditionGrade;
  color: string;
  costPrice: number; // PKR
  sellingPrice: number; // PKR
  status: ShoeStatus;
  image: string; // Main image URL
  additionalImages?: string[];
  notes?: string;
  dateAdded: string; // ISO date format YYYY-MM-DD
  dateSold?: string;
  saleId?: string; // links to SaleOrder if sold
}

export type CourierName = 
  | 'TCS'
  | 'Leopard Courier'
  | 'PostEx'
  | 'Trax Logistics'
  | 'M&P'
  | 'Call Courier'
  | 'Rider Courier'
  | 'Pakistan Post'
  | 'Self Pickup / Hand Delivery';

export type PaymentMethod = 'COD' | 'Bank Transfer' | 'EasyPaisa' | 'JazzCash' | 'Cash Hand';
export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded';
export type OrderStatus = 'Processing' | 'Booked with Courier' | 'In Transit' | 'Delivered' | 'Returned / RTS' | 'Cancelled';

export interface SaleOrder {
  id: string; // e.g., 'ORD-2025-101'
  shoeId: string;
  shoeSKU: string;
  shoeTitle: string;
  shoeBrand: string;
  shoeSize: string;
  customerName: string;
  customerPhone: string; // e.g. 0300-8472910
  address: string;
  city: string; // e.g. Lahore, Karachi, Islamabad
  courierName: CourierName;
  trackingNumber: string;
  costPrice: number; // PKR
  agreedPrice: number; // PKR
  shippingFee: number; // PKR
  totalAmount: number; // agreedPrice + shippingFee
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  orderDate: string;
  notes?: string;
}

export interface CustomerSummary {
  phone: string;
  name: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  orders: SaleOrder[];
}

export interface BulkImportRow {
  title: string;
  brand: string;
  category: string;
  size: string;
  conditionGrade: string;
  color: string;
  costPrice: number;
  sellingPrice: number;
  status: ShoeStatus;
  notes?: string;
  image?: string;
  isValid?: boolean;
  errors?: string[];
}

export type ViewTab = 'dashboard' | 'inventory' | 'sales' | 'customers' | 'bulk-upload' | 'storefront';
