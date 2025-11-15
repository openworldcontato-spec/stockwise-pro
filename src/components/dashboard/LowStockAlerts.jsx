import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function LowStockAlerts({ products = [] }) {
  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">All products well stocked!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-3 rounded-lg border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/20 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      SKU: {product.sku}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700 whitespace-nowrap">
                    {product.stock_quantity} left
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Reorder at: {product.reorder_level || 5}
                  </span>
                  <Link to={createPageUrl("Products")}>
                    <Button size="sm" variant="outline" className="h-7 text-xs dark:border-gray-700 dark:hover:bg-gray-800">
                      Restock
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}