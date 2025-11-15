import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function ProductCard({ product, onEdit, onDelete, categories = [] }) {
  const category = categories.find(c => c.id === product.category_id);
  const stockStatus = product.stock_quantity <= 0 ? 'out' : 
                      product.stock_quantity <= (product.reorder_level || 5) ? 'low' : 'good';

  const statusColors = {
    out: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    low: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    good: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
  };

  const profit = ((product.sell_price - product.cost_price) / product.sell_price * 100).toFixed(1);

  return (
    <Card className="group overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400 dark:text-gray-600" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-800">
              <DropdownMenuItem onClick={() => onEdit(product)} className="cursor-pointer dark:hover:bg-gray-800">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(product.id)} 
                className="cursor-pointer text-red-600 dark:text-red-400 dark:hover:bg-gray-800"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className={statusColors[stockStatus]}>
            {stockStatus === 'out' ? 'Out of Stock' : 
             stockStatus === 'low' ? `Low: ${product.stock_quantity}` : 
             `Stock: ${product.stock_quantity}`}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              SKU: {product.sku}
            </p>
          </div>

          {category && (
            <Badge 
              variant="outline" 
              className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            >
              {category.name}
            </Badge>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                ${product.sell_price?.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Margin</p>
              <p className={`text-sm font-semibold ${
                profit > 30 ? 'text-green-600 dark:text-green-400' : 
                profit > 15 ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-red-600 dark:text-red-400'
              }`}>
                {profit}%
              </p>
            </div>
          </div>

          {stockStatus === 'low' && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Reorder soon</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}