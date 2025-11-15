import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const colorMap = {
  blue: 'from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400',
  green: 'from-green-500/20 to-green-600/20 text-green-600 dark:text-green-400',
  purple: 'from-purple-500/20 to-purple-600/20 text-purple-600 dark:text-purple-400',
  orange: 'from-orange-500/20 to-orange-600/20 text-orange-600 dark:text-orange-400',
};

export default function StatsCard({ title, value, change, subtitle, icon: Icon, color = 'blue', alert }) {
  const isPositive = change >= 0;

  return (
    <Card className="relative overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 group">
      <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br", colorMap[color])} />
      
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-3 rounded-xl bg-gradient-to-br", colorMap[color])}>
            <Icon className="w-5 h-5" />
          </div>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full", 
              isPositive ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            )}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(change)}%
            </div>
          )}
          {alert && (
            <div className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 animate-pulse">
              Alert
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}