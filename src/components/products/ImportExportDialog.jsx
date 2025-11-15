import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ImportExportDialog({ open, onClose, products }) {
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    const csvContent = [
      ['SKU', 'Name', 'Description', 'Cost Price', 'Sell Price', 'Stock Quantity', 'Reorder Level', 'Barcode'].join(','),
      ...products.map(p => [
        p.sku,
        `"${p.name}"`,
        `"${p.description || ''}"`,
        p.cost_price,
        p.sell_price,
        p.stock_quantity,
        p.reorder_level,
        p.barcode || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: await base44.entities.Product.schema()
      });

      if (result.status === 'success' && result.output) {
        const products = Array.isArray(result.output) ? result.output : [result.output];
        await base44.entities.Product.bulkCreate(products);
        alert(`Successfully imported ${products.length} products`);
        onClose();
        window.location.reload();
      } else {
        alert('Error importing products: ' + result.details);
      }
    } catch (error) {
      alert('Error importing products. Please check the file format.');
    }
    setImporting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Import / Export Products</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h3 className="font-semibold text-center mb-2 text-gray-900 dark:text-gray-100">Export Products</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Download all products as CSV
            </p>
            <Button onClick={handleExport} variant="outline" className="w-full dark:border-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export to CSV
            </Button>
          </div>

          <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h3 className="font-semibold text-center mb-2 text-gray-900 dark:text-gray-100">Import Products</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Upload CSV file to import products
            </p>
            <label>
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
                disabled={importing}
              />
              <Button variant="outline" className="w-full dark:border-gray-700" disabled={importing}>
                <Upload className="w-4 h-4 mr-2" />
                {importing ? 'Importing...' : 'Import from CSV'}
              </Button>
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}