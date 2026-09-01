import { BulkImportRow, ShoeBrand, ShoeCategory, ConditionGrade } from '../types';

export async function parsePdfOrTextContent(textOrFileContent: string | File): Promise<BulkImportRow[]> {
  let text = '';
  if (typeof textOrFileContent === 'string') {
    text = textOrFileContent;
  } else {
    // Read plain text if text file / pdf fallback text
    text = await textOrFileContent.text();
  }

  return parsePastedTextRows(text);
}

export function parsePastedTextRows(text: string): BulkImportRow[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 3);
  const rows: BulkImportRow[] = [];

  for (const line of lines) {
    // Skip header lines
    if (/^(title|item|description|sr|no|sku|shoes|brand)/i.test(line)) continue;

    // Pattern matching e.g. "Nike Air Max 90 - Size 42 - Cost 3000 - Sale 7500 - Grade 9/10"
    // Or tab/comma/pipe separated: "Nike Air Max 90 | 42 | 3000 | 7500"
    const parts = line.split(/[,|\t;]|\s{2,}/);

    let title = '';
    let brand: ShoeBrand = 'Other';
    let size = 'EU 42';
    let costPrice = 2500;
    let sellingPrice = 5500;
    let conditionGrade: ConditionGrade = '9/10 Excellent Preloved';
    let category: ShoeCategory = 'Sneakers';

    if (parts.length >= 3) {
      title = parts[0].trim();
      
      // Try to parse size from second or third part
      const possibleSize = parts.find(p => /(eu|us|uk|\b[34][0-9]\b|\b[67891][0-2]?\b)/i.test(p));
      if (possibleSize) size = possibleSize.trim();

      // Look for numbers for cost and selling price
      const numbers = line.match(/\b\d{3,6}\b/g);
      if (numbers && numbers.length >= 2) {
        costPrice = parseInt(numbers[0], 10);
        sellingPrice = parseInt(numbers[1], 10);
      } else if (numbers && numbers.length === 1) {
        sellingPrice = parseInt(numbers[0], 10);
        costPrice = Math.round(sellingPrice * 0.45); // estimate cost
      }
    } else {
      // Single line text e.g. "Nike Dunk Low Panda Size 43 Price 6500 Cost 2800"
      title = line.replace(/(size|price|cost|rs|pkr|grade|\d{3,6})/gi, ' ').replace(/\s+/g, ' ').trim();
      
      const sizeMatch = line.match(/(size|sz|eur?|us|uk)?\s*([34][0-9](\.5)?|\b[67891][0-2]?(\.5)?\b)/i);
      if (sizeMatch) size = 'EU ' + sizeMatch[2];

      const numbers = line.match(/\b\d{3,6}\b/g);
      if (numbers && numbers.length >= 2) {
        costPrice = parseInt(numbers[0], 10);
        sellingPrice = parseInt(numbers[1], 10);
      } else if (numbers && numbers.length === 1) {
        sellingPrice = parseInt(numbers[0], 10);
        costPrice = Math.round(sellingPrice * 0.45);
      }
    }

    brand = detectBrand(title);
    category = detectCategory(title);
    conditionGrade = detectCondition(line);

    if (!title || title.length < 2) continue;

    rows.push({
      title,
      brand,
      category,
      size,
      conditionGrade,
      color: 'Standard',
      costPrice,
      sellingPrice,
      status: 'available',
      notes: 'Parsed from PDF / Text manifest',
      image: getPlaceholderForBrand(brand),
      isValid: costPrice > 0 && sellingPrice >= costPrice,
      errors: sellingPrice < costPrice ? ['Selling price is lower than cost'] : [],
    });
  }

  return rows;
}

function detectBrand(title: string): ShoeBrand {
  const t = title.toLowerCase();
  if (t.includes('nike')) return 'Nike';
  if (t.includes('adidas') || t.includes('yeezy')) return 'Adidas';
  if (t.includes('new balance') || t.includes('nb')) return 'New Balance';
  if (t.includes('jordan')) return 'Jordan';
  if (t.includes('puma')) return 'Puma';
  if (t.includes('asics')) return 'Asics';
  if (t.includes('martens') || t.includes('doc')) return 'Dr. Martens';
  if (t.includes('reebok')) return 'Reebok';
  if (t.includes('converse') || t.includes('chuck')) return 'Converse';
  if (t.includes('vans')) return 'Vans';
  if (t.includes('timberland')) return 'Timberland';
  if (t.includes('hoka')) return 'Hoka';
  return 'Other';
}

function detectCategory(title: string): ShoeCategory {
  const t = title.toLowerCase();
  if (t.includes('boot') || t.includes('leather')) return 'Boots & Leather';
  if (t.includes('run') || t.includes('athletic') || t.includes('zoom') || t.includes('boost')) return 'Running / Athletic';
  if (t.includes('loafer') || t.includes('formal') || t.includes('oxford')) return 'Loafers & Formals';
  if (t.includes('slide') || t.includes('sandal')) return 'Slides & Sandals';
  if (t.includes('retro') || t.includes('vintage') || t.includes('70') || t.includes('og')) return 'Retro & Vintage';
  return 'Sneakers';
}

function detectCondition(line: string): ConditionGrade {
  const l = line.toLowerCase();
  if (l.includes('10/10') || l.includes('new')) return '10/10 Brand New (Unworn)';
  if (l.includes('9.5')) return '9.5/10 Like New (Tried On)';
  if (l.includes('9/10') || l.includes('excellent')) return '9/10 Excellent Preloved';
  if (l.includes('8.5')) return '8.5/10 Very Good Thrift';
  if (l.includes('8/10')) return '8/10 Clean Used';
  return '8.5/10 Very Good Thrift';
}

function getPlaceholderForBrand(brand: ShoeBrand): string {
  switch (brand) {
    case 'Nike':
      return '/images/nike-sneaker.jpg';
    case 'Adidas':
      return '/images/adidas-sneaker.jpg';
    case 'New Balance':
      return '/images/nb-sneaker.jpg';
    case 'Dr. Martens':
    case 'Timberland':
      return '/images/leather-boots.jpg';
    default:
      return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
  }
}
