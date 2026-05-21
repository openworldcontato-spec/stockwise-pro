import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProductForm({ product, categories, onSubmit, onCancel, isLoading }) {
  const queryClient = useQueryClient();
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
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const createCategoryMutation = useMutation({
    mutationFn: (data) => base44.entities.Category.create(data),
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setFormData({ ...formData, category_id: newCategory.id });
      setShowNewCategory(false);
      setNewCategoryName('');
    },
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      createCategoryMutation.mutate({ name: newCategoryName });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU (Código interno do produto) *</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              placeholder="PROD-001"
              required
              className="dark:bg-gray-800 dark:border-gray-700"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Identificador único deste produto</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="barcode">Código de barras</Label>
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
          <Label htmlFor="name">Nome do produto *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Digite o nome do produto"
            required
            className="dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descrição do produto..."
            className="h-24 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <div className="flex gap-2">
              <Select value={formData.category_id} onValueChange={(value) => handleChange('category_id', value)}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-gray-800">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowNewCategory(true)}
                className="dark:border-gray-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-900 dark:border-gray-800">
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="discontinued">Descontinuado</SelectItem>
                <SelectItem value="out_of_stock">Sem estoque</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cost_price">Preço de custo *</Label>
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
            <Label htmlFor="sell_price">Preço de venda *</Label>
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
            <Label htmlFor="stock_quantity">Quantidade em estoque *</Label>
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
            <Label htmlFor="reorder_level">Nível de reposição</Label>
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
          <Label htmlFor="image_url">URL da imagem</Label>
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
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600">
            {isLoading ? 'Salvando...' : product ? 'Atualizar produto' : 'Criar produto'}
          </Button>
        </div>
      </form>

      <Dialog open={showNewCategory} onOpenChange={setShowNewCategory}>
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Adicionar nova categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new_category">Nome da categoria</Label>
              <Input
                id="new_category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Digite o nome da categoria"
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNewCategory(false)} className="dark:border-gray-700">
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {createCategoryMutation.isPending ? 'Criando...' : 'Criar categoria'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
