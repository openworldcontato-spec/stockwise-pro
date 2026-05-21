import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TopProductsChart({ products = [], saleItems = [] }) {
  // Calculate top selling products
  const productSales = {};
  saleItems.forEach(item => {
    if (!productSales[item.product_id]) {
      productSales[item.product_id] = {
        quantity: 0,
        revenue: 0,
        name: item.product_name,
        sku: item.product_sku
      };
    }
    productSales[item.product_id].quantity += item.quantity || 0;
    productSales[item.product_id].revenue += item.total || 0;
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map(p => ({
      name: p.name?.substring(0, 15) + (p.name?.length > 15 ? '...' : ''),
      quantity: p.quantity,
      revenue: p.revenue
    }));

  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <TrendingUp className="w-5 h-5" />
          Produtos mais vendidos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {topProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Ainda não há dados de vendas</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [value, 'Quantidade']}
                labelFormatter={(label) => `Produto: ${label}`}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Bar 
                dataKey="quantity" 
                name="Quantidade"
                fill="url(#colorGradient)" 
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}