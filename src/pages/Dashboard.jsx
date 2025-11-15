import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import StatsCard from "../components/dashboard/StatsCard";
import RecentSalesTable from "../components/dashboard/RecentSalesTable";
import LowStockAlerts from "../components/dashboard/LowStockAlerts";
import AIInsightsPanel from "../components/dashboard/AIInsightsPanel";
import TopProductsChart from "../components/dashboard/TopProductsChart";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('today');

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const { data: sales = [], isLoading: loadingSales } = useQuery({
    queryKey: ['sales'],
    queryFn: () => base44.entities.Sale.list('-created_date'),
  });

  const { data: insights = [] } = useQuery({
    queryKey: ['insights'],
    queryFn: () => base44.entities.AIInsight.list('-created_date', 10),
  });

  const { data: saleItems = [] } = useQuery({
    queryKey: ['saleItems'],
    queryFn: () => base44.entities.SaleItem.list(),
  });

  // Calculate KPIs
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock_quantity <= (p.reorder_level || 5)).length;
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const totalSales = sales.length;

  // Calculate today's sales
  const today = new Date().toDateString();
  const todaySales = sales.filter(sale => new Date(sale.created_date).toDateString() === today);
  const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

  // Previous day for comparison
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const yesterdaySales = sales.filter(sale => new Date(sale.created_date).toDateString() === yesterday);
  const yesterdayRevenue = yesterdaySales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

  const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1) : 0;
  const salesChange = yesterdaySales.length > 0 ? ((todaySales.length - yesterdaySales.length) / yesterdaySales.length * 100).toFixed(1) : 0;

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your business overview</p>
        </div>
        <div className="flex gap-3">
          <Link to={createPageUrl("POS")}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
              <ShoppingCart className="w-4 h-4" />
              New Sale
            </Button>
          </Link>
          <Link to={createPageUrl("Products")}>
            <Button variant="outline" className="gap-2 dark:border-gray-700 dark:hover:bg-gray-800">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Revenue"
          value={`$${todayRevenue.toFixed(2)}`}
          change={revenueChange}
          icon={DollarSign}
          color="blue"
        />
        <StatsCard
          title="Today's Sales"
          value={todaySales.length}
          change={salesChange}
          icon={ShoppingCart}
          color="green"
        />
        <StatsCard
          title="Total Products"
          value={totalProducts}
          subtitle={`${products.filter(p => p.stock_quantity > 0).length} in stock`}
          icon={Package}
          color="purple"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockProducts}
          subtitle="Needs attention"
          icon={AlertTriangle}
          color="orange"
          alert={lowStockProducts > 0}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TopProductsChart products={products} saleItems={saleItems} />
          <RecentSalesTable sales={sales.slice(0, 10)} />
        </div>

        <div className="space-y-6">
          <AIInsightsPanel insights={insights} />
          <LowStockAlerts products={products.filter(p => p.stock_quantity <= (p.reorder_level || 5)).slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}