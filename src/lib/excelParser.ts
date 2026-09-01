import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { BulkImportRow, ShoeBrand, ShoeCategory, ConditionGrade, ShoeStatus } from '../types';

export async function parseExcelOrCsvFile(file: File): Promise<BulkImportRow[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const rows = processRawDataRows(results.data as Record<string, any>[]);
            resolve(rows);
          } catch (err) {
            reject(err);
          }
        },
        error: (err) => reject(err),
      });
    });
  } else if (extension === 'xlsx' || extension === 'xls') {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
    return processRawDataRows(jsonRows);
  } else {
    throw new Error('Unsupported file extension. Please upload a .csv, .xlsx, or .xls file.');
  }
}

function processRawDataRows(rawRows: Record<string, any>[]): BulkImportRow[] {
  return rawRows.map((row) => {
    // Standardize column key lookup (case-insensitive & space insensitive)
    const findValue = (possibleKeys: string[]): any => {
      const keys = Object.keys(row);
      for (const pk of possibleKeys) {
        const foundKey = keys.find(
          (k) => k.toLowerCase().trim().replace(/[^a-z0-9]/g, '') === pk.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
        );
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
          return row[foundKey];
        }
      }
      return undefined;
    };

    const rawTitle = findValue(['title', 'model', 'shoename', 'item', 'name', 'shoe']) || 'Preloved Shoe Pair';
    const rawBrand = findValue(['brand', 'make', 'company']) || detectBrand(String(rawTitle));
    const rawCategory = findValue(['category', 'type', 'style']) || 'Sneakers';
    const rawSize = findValue(['size', 'shoesize', 'eur', 'us', 'uk']) || 'EU 42';
    const rawCondition = findValue(['condition', 'grade', 'quality', 'state']) || '9/10 Excellent Preloved';
    const rawColor = findValue(['color', 'colour', 'shade']) || 'Multi-color';
    
    const rawCost = findValue(['cost', 'costprice', 'purchaseprice', 'buyprice', 'costpkr']) ?? 2500;
    const rawPrice = findValue(['price', 'sellingprice', 'salePrice', 'listprice', 'pricepkr']) ?? 5500;
    const rawStatus = findValue(['status', 'state', 'availability']) || 'available';
    const rawNotes = findValue(['notes', 'comment', 'description', 'detail']) || '';
    const rawImage = findValue(['image', 'photo', 'picture', 'imgurl']) || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';

    const costPrice = parseFloat(String(rawCost).replace(/[^0-9.]/g, '')) || 0;
    const sellingPrice = parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0;

    const brand = normalizeBrand(String(rawBrand));
    const category = normalizeCategory(String(rawCategory));
    const conditionGrade = normalizeCondition(String(rawCondition));
    const status = normalizeStatus(String(rawStatus));

    const errors: string[] = [];
    if (costPrice <= 0) errors.push('Cost price must be > 0');
    if (sellingPrice < costPrice) errors.push('Selling price is lower than cost');
    if (!rawTitle.trim()) errors.push('Title is required');

    return {
      title: String(rawTitle).trim(),
      brand,
      category,
      size: String(rawSize).trim(),
      conditionGrade,
      color: String(rawColor).trim(),
      costPrice,
      sellingPrice,
      status,
      notes: String(rawNotes).trim(),
      image: String(rawImage).trim(),
      isValid: errors.length === 0,
      errors,
    };
  });
}

function detectBrand(title: string): ShoeBrand {
  const t = title.toLowerCase();
  if (t.includes('nike')) return 'Nike';
  if (t.includes('adidas') || t.includes('yeezy')) return 'Adidas';
  if (t.includes('new balance') || t.includes('nb')) return 'New Balance';
  if (t.includes('jordan')) return 'Jordan';
  if (t.includes('puma')) return 'Puma';
  if (t.includes('asics')) return 'Asics';
  if (t.includes('doc') || t.includes('martens')) return 'Dr. Martens';
  if (t.includes('reebok')) return 'Reebok';
  if (t.includes('converse') || t.includes('chuck')) return 'Converse';
  if (t.includes('vans')) return 'Vans';
  if (t.includes('timberland')) return 'Timberland';
  if (t.includes('hoka')) return 'Hoka';
  return 'Other';
}

function normalizeBrand(brandStr: string): ShoeBrand {
  const b = brandStr.trim().toLowerCase();
  if (b.includes('nike')) return 'Nike';
  if (b.includes('adidas') || b.includes('yeezy')) return 'Adidas';
  if (b.includes('new balance') || b.includes('nb')) return 'New Balance';
  if (b.includes('jordan')) return 'Jordan';
  if (b.includes('puma')) return 'Puma';
  if (b.includes('asics')) return 'Asics';
  if (b.includes('martens') || b.includes('doc')) return 'Dr. Martens';
  if (b.includes('reebok')) return 'Reebok';
  if (b.includes('converse')) return 'Converse';
  if (b.includes('vans')) return 'Vans';
  if (b.includes('timberland')) return 'Timberland';
  if (b.includes('skechers')) return 'Skechers';
  if (b.includes('hoka')) return 'Hoka';
  return 'Other';
}

function normalizeCategory(catStr: string): ShoeCategory {
  const c = catStr.trim().toLowerCase();
  if (c.includes('boot') || c.includes('leather')) return 'Boots & Leather';
  if (c.includes('run') || c.includes('athletic') || c.includes('gym')) return 'Running / Athletic';
  if (c.includes('loaf') || c.includes('formal') || c.includes('oxford')) return 'Loafers & Formals';
  if (c.includes('slide') || c.includes('sandal') || c.includes('flip')) return 'Slides & Sandals';
  if (c.includes('retro') || c.includes('vintage')) return 'Retro & Vintage';
  if (c.includes('casual') || c.includes('canvas')) return 'Casual / Canvas';
  return 'Sneakers';
}

function normalizeCondition(condStr: string): ConditionGrade {
  const c = condStr.trim().toLowerCase();
  if (c.includes('10/10') || c.includes('new')) return '10/10 Brand New (Unworn)';
  if (c.includes('9.5')) return '9.5/10 Like New (Tried On)';
  if (c.includes('9/10') || c.includes('excellent')) return '9/10 Excellent Preloved';
  if (c.includes('8.5')) return '8.5/10 Very Good Thrift';
  if (c.includes('8/10') || c.includes('clean')) return '8/10 Clean Used';
  return '7/10 Vintage Patina';
}

function normalizeStatus(statusStr: string): ShoeStatus {
  const s = statusStr.trim().toLowerCase();
  if (s.includes('sold')) return 'sold';
  if (s.includes('reserve')) return 'reserved';
  return 'available';
}

export function downloadSampleCsvTemplate() {
  const templateData = [
    {
      'Title': 'Nike Air Force 1 07 White',
      'Brand': 'Nike',
      'Category': 'Sneakers',
      'Size': 'EU 43 / US 9.5',
      'Condition': '9/10 Excellent Preloved',
      'Color': 'Triple White',
      'Cost Price (PKR)': '3000',
      'Selling Price (PKR)': '7500',
      'Status': 'available',
      'Notes': 'Thrift bale grade A, white soles cleaned',
    },
    {
      'Title': 'Adidas Forum Low Classic',
      'Brand': 'Adidas',
      'Category': 'Sneakers',
      'Size': 'EU 42 / US 8.5',
      'Condition': '8.5/10 Very Good Thrift',
      'Color': 'White / Royal Blue',
      'Cost Price (PKR)': '2500',
      'Selling Price (PKR)': '6200',
      'Status': 'available',
      'Notes': 'Ankle strap included, light creasing',
    },
    {
      'Title': 'New Balance 550 White Green',
      'Brand': 'New Balance',
      'Category': 'Retro & Vintage',
      'Size': 'EU 41 / US 8',
      'Condition': '9.5/10 Like New (Tried On)',
      'Color': 'White / Green',
      'Cost Price (PKR)': '4200',
      'Selling Price (PKR)': '9800',
      'Status': 'available',
      'Notes': 'Near deadstock condition',
    },
  ];

  const csvContent = Papa.unparse(templateData);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'scrapa_pk_shoes_inventory_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
