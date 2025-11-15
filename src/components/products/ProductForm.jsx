import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductForm({ product, categories, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    cost_price: product?.cost_price || 0,
    sell_price: product?.sell_price || 0,
    stock_quantity: product?.stock_quantity || 0,
    reorder_level: product?.reorder_level || 5,
    image_url: product?.image_url || '',
    barcode: product?.barcode || '',
    status: product?.status || 'active',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="PROD-001"
            required
            className="dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => handleChange('barcode', e.target.value)}
            placeholder="123456789"
            className="dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter product name"
          required
          className="dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Product description..."
          className="h-24 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category_id} onValueChange={(value) => handleChange('category_id', value)}>
            <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:border-gray-800">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:border-gray-800">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cost_price">Cost Price *</Label>
          <Input
            id="cost_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.cost_price}
            onChange={(e) => handleChange('cost_price', parseFloat(e.target.value))}
            required
            className="dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sell_price">Sell Price *</Label>
          <Input
            id="sell_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.sell_price}
            onChange={(e) => handleChange('sell_price', parseFloat(e.target.value))}
            required
            className="dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock_quantity">Stock Quantity *</Label>
          <Input
            id="stock_quantity"
            type="number"
            min="0"
            value={formData.stock_quantity}
            onChange={(e) => handleChange('stock_quantity', parseInt(e.target.value))}
            required
            className="dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reorder_level">Reorder Level</Label>
          <Input
            id="reorder_level"
            type="number"
            min="0"
            value={formData.reorder_level}
            onChange={(e) => handleChange('reorder_level', parseInt(e.target.value))}
            className="dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => handleChange('image_url', e.target.value)}
          placeholder="https://..."
          className="dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button type="button" variant="outline" onClick={onCancel} className="dark:border-gray-700">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600">
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}