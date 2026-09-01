import React, { useState } from 'react';
import { BulkImportRow, ShoeItem, ShoeBrand, ShoeCategory, ConditionGrade } from '../types';
import { parseExcelOrCsvFile, downloadSampleCsvTemplate } from '../lib/excelParser';
import { parsePdfOrTextContent, parsePastedTextRows } from '../lib/pdfParser';
import { 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  FileCode,
  Table
} from 'lucide-react';

interface BulkUploadModalProps {
  onImportShoes: (shoes: ShoeItem[]) => void;
  onClose?: () => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  onImportShoes,
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'pdf-text' | 'matrix'>('file');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedRows, setParsedRows] = useState<BulkImportRow[]>([]);
  const [rawText, setRawText] = useState('');
  const [importSuccessMessage, setImportSuccessMessage] = useState('');

  // Manual Matrix Rows
  const [matrixRows, setMatrixRows] = useState<BulkImportRow[]>([
    {
      title: 'Nike Air Max 97 OG Metallic Silver',
      brand: 'Nike',
      category: 'Sneakers',
      size: 'EU 42.5 / US 9',
      conditionGrade: '9/10 Excellent Preloved',
      color: 'Silver / Red',
      costPrice: 3200,
      sellingPrice: 7500,
      status: 'available',
      notes: 'Thrift bale A+',
      isValid: true,
      errors: [],
    },
    {
      title: 'Adidas Forum Exhibit Low',
      brand: 'Adidas',
      category: 'Casual / Canvas',
      size: 'EU 43 / US 9.5',
      conditionGrade: '8.5/10 Very Good Thrift',
      color: 'White / Black',
      costPrice: 2400,
      sellingPrice: 5800,
      status: 'available',
      notes: 'Clean sole',
      isValid: true,
      errors: [],
    }
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportSuccessMessage('');

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let rows: BulkImportRow[] = [];

      if (ext === 'pdf') {
        rows = await parsePdfOrTextContent(file);
      } else {
        rows = await parseExcelOrCsvFile(file);
      }

      setParsedRows(rows);
    } catch (err: any) {
      alert(`Error parsing file: ${err.message || 'Invalid format'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleParseRawText = () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    try {
      const rows = parsePastedTextRows(rawText);
      setParsedRows(rows);
    } catch (err: any) {
      alert(`Error parsing text: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateParsedCell = (index: number, field: keyof BulkImportRow, value: any) => {
    const updated = [...parsedRows];
    updated[index] = { ...updated[index], [field]: value };
    setParsedRows(updated);
  };

  const removeParsedRow = (index: number) => {
    setParsedRows(parsedRows.filter((_, i) => i !== index));
  };

  const updateMatrixCell = (index: number, field: keyof BulkImportRow, value: any) => {
    const updated = [...matrixRows];
    updated[index] = { ...updated[index], [field]: value };
    setMatrixRows(updated);
  };

  const addMatrixRow = () => {
    setMatrixRows([
      ...matrixRows,
      {
        title: '',
        brand: 'Nike',
        category: 'Sneakers',
        size: 'EU 42',
        conditionGrade: '9/10 Excellent Preloved',
        color: 'Multi',
        costPrice: 2500,
        sellingPrice: 6000,
        status: 'available',
        notes: '',
        isValid: true,
        errors: [],
      }
    ]);
  };

  const removeMatrixRow = (index: number) => {
    setMatrixRows(matrixRows.filter((_, i) => i !== index));
  };

  const confirmImport = (rowsToImport: BulkImportRow[]) => {
    const validRows = rowsToImport.filter(r => r.title.trim().length > 0 && r.sellingPrice >= r.costPrice);

    if (validRows.length === 0) {
      alert('No valid shoe rows to import. Please check model names and prices.');
      return;
    }

    const newShoes: ShoeItem[] = validRows.map((r, i) => ({
      id: `SCR-${Math.floor(1000 + Math.random() * 9000)}-${i}`,
      sku: `SCR-${Math.floor(1000 + Math.random() * 9000)}`,
      title: r.title,
      brand: (r.brand || 'Other') as ShoeBrand,
      category: (r.category || 'Sneakers') as ShoeCategory,
      size: r.size || 'EU 42',
      sizeEU: 42,
      conditionGrade: (r.conditionGrade || '9/10 Excellent Preloved') as ConditionGrade,
      color: r.color || 'Multi-color',
      costPrice: Number(r.costPrice) || 2000,
      sellingPrice: Number(r.sellingPrice) || 5000,
      status: 'available',
      image: r.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      notes: r.notes || 'Bulk imported stock',
      dateAdded: new Date().toISOString().split('T')[0],
    }));

    onImportShoes(newShoes);
    setImportSuccessMessage(`Successfully imported ${newShoes.length} preloved shoe pairs into scrapa.pk!`);
    setParsedRows([]);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-teal-500/30">
            Bulk Stock Engine
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">Bulk Stock Upload (Excel / PDF / CSV)</h2>
          <p className="text-xs text-slate-400 mt-1">Upload wholesale bale lots, courier sheets, or paste stock text to import multiple pairs at once.</p>
        </div>

        <button
          onClick={downloadSampleCsvTemplate}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* Success Notification */}
      {importSuccessMessage && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs flex justify-between items-center animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold">{importSuccessMessage}</span>
          </div>
          <button onClick={() => setImportSuccessMessage('')} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Mode Selector Tabs */}
      <div className="flex space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('file')}
          className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'file' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Excel / CSV File Upload</span>
        </button>

        <button
          onClick={() => setActiveTab('pdf-text')}
          className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'pdf-text' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>PDF / WhatsApp Text Manifest</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition ${
            activeTab === 'matrix' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Quick Spreadsheet Matrix</span>
        </button>
      </div>

      {/* TAB 1: File Dropzone */}
      {activeTab === 'file' && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Upload .xlsx, .xls, or .csv Spreadsheet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              File can include columns like Title/Model, Brand, Size, Category, Condition, Cost Price (PKR), Selling Price (PKR).
            </p>
          </div>

          <div className="pt-2">
            <label className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition">
              <Upload className="w-4 h-4 stroke-[3]" />
              <span>Select File from Computer</span>
              <input
                type="file"
                accept=".xlsx, .xls, .csv, .pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* TAB 2: PDF / Text Paste */}
      {activeTab === 'pdf-text' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              Paste PDF / Wholesale WhatsApp List Text
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Paste lines e.g.: "Nike Air Max 90 - Size 42 - Cost 3000 - Price 7500" or lot lists. The smart parser extracts shoe titles, sizes, and prices automatically.
            </p>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`Nike Air Max 90 OG Infrared, Size EU 42, Cost 3200, Sale 7800
Adidas UltraBoost 21 Triple Black, Size 43.5, Cost 4500, Sale 9500
New Balance 2002R Rain Cloud, Size 42.5, Cost 5200, Sale 11800`}
            className="w-full h-40 bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          <button
            onClick={handleParseRawText}
            disabled={!rawText.trim() || isProcessing}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Parse Stock List</span>
          </button>
        </div>
      )}

      {/* PARSED PREVIEW TABLE (For TAB 1 & TAB 2) */}
      {parsedRows.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Parsed Stock Preview ({parsedRows.length} pairs)
              </h3>
              <p className="text-xs text-slate-400">Review and edit cells before finalizing import into scrapa.pk.</p>
            </div>

            <button
              onClick={() => confirmImport(parsedRows)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Import All {parsedRows.length} Shoes</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-800 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700">
                  <th className="py-2.5 px-3">Title / Model</th>
                  <th className="py-2.5 px-3">Brand</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Condition</th>
                  <th className="py-2.5 px-3">Cost (PKR)</th>
                  <th className="py-2.5 px-3">Selling (PKR)</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {parsedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.title}
                        onChange={(e) => updateParsedCell(idx, 'title', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.brand}
                        onChange={(e) => updateParsedCell(idx, 'brand', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.size}
                        onChange={(e) => updateParsedCell(idx, 'size', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.conditionGrade}
                        onChange={(e) => updateParsedCell(idx, 'conditionGrade', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={row.costPrice}
                        onChange={(e) => updateParsedCell(idx, 'costPrice', Number(e.target.value))}
                        className="w-24 bg-slate-800 border border-slate-700 text-emerald-400 font-mono rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={row.sellingPrice}
                        onChange={(e) => updateParsedCell(idx, 'sellingPrice', Number(e.target.value))}
                        className="w-24 bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => removeParsedRow(idx)}
                        className="p-1 text-slate-400 hover:text-rose-400"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Quick Spreadsheet Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Table className="w-5 h-5 text-indigo-400" />
                Manual Batch Entry Matrix
              </h3>
              <p className="text-xs text-slate-400">Type multiple shoes directly in this spreadsheet table.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addMatrixRow}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Row</span>
              </button>
              <button
                onClick={() => confirmImport(matrixRows)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Import {matrixRows.length} Pairs</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-800 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700">
                  <th className="py-2.5 px-3">Title / Model</th>
                  <th className="py-2.5 px-3">Brand</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Condition</th>
                  <th className="py-2.5 px-3">Cost (PKR)</th>
                  <th className="py-2.5 px-3">Price (PKR)</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {matrixRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.title}
                        onChange={(e) => updateMatrixCell(idx, 'title', e.target.value)}
                        placeholder="Model name"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.brand}
                        onChange={(e) => updateMatrixCell(idx, 'brand', e.target.value)}
                        placeholder="Brand"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.size}
                        onChange={(e) => updateMatrixCell(idx, 'size', e.target.value)}
                        placeholder="Size"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.conditionGrade}
                        onChange={(e) => updateMatrixCell(idx, 'conditionGrade', e.target.value)}
                        placeholder="Condition"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={row.costPrice}
                        onChange={(e) => updateMatrixCell(idx, 'costPrice', Number(e.target.value))}
                        className="w-24 bg-slate-800 border border-slate-700 text-emerald-400 font-mono rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={row.sellingPrice}
                        onChange={(e) => updateMatrixCell(idx, 'sellingPrice', Number(e.target.value))}
                        className="w-24 bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => removeMatrixRow(idx)}
                        className="p-1 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
