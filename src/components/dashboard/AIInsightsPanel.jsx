import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const priorityColors = {
  urgent: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  high: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  low: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
};

const insightIcons = {
  reorder_alert: AlertCircle,
  top_seller: TrendingUp,
  slow_mover: TrendingUp,
  bundle_suggestion: Lightbulb,
  price_optimization: Lightbulb,
  trend_analysis: TrendingUp,
  profit_warning: AlertCircle
};

export default function AIInsightsPanel({ insights = [] }) {
  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {insights.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm mb-2">No insights yet</p>
            <p className="text-xs">AI will analyze your data and provide recommendations</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.slice(0, 5).map((insight) => {
              const InsightIcon = insightIcons[insight.insight_type] || Lightbulb;
              
              return (
                <div
                  key={insight.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                      <InsightIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {insight.title}
                        </h4>
                        <Badge variant="outline" className={priorityColors[insight.priority] || priorityColors.medium}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {insight.description}
                      </p>
                      {insight.action_label && (
                        <Link to={insight.action_url || createPageUrl("Products")}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="mt-3 h-8 text-xs gap-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                          >
                            {insight.action_label}
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <Link to={createPageUrl("Analytics")} className="block mt-4">
          <Button variant="outline" className="w-full dark:border-gray-700 dark:hover:bg-gray-800">
            View All Insights
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}