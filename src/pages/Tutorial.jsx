import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  PlayCircle,
  CheckCircle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tutorials = [
  {
    id: 1,
    title: "Getting Started",
    category: "basics",
    icon: BookOpen,
    duration: "5 min",
    difficulty: "Beginner",
    steps: [
      "Navigate to Dashboard to see overview",
      "Check the stats cards for quick insights",
      "Review low stock alerts and AI recommendations",
      "Explore the sidebar menu to access all features"
    ]
  },
  {
    id: 2,
    title: "Adding Products",
    category: "products",
    icon: Package,
    duration: "3 min",
    difficulty: "Beginner",
    steps: [
      "Go to Products page from sidebar",
      "Click 'Add Product' button",
      "Fill in required fields: SKU, Name, Price, Stock",
      "Optionally add category, barcode, and image",
      "Click 'Create Product' to save"
    ]
  },
  {
    id: 3,
    title: "Processing Sales",
    category: "pos",
    icon: ShoppingCart,
    duration: "4 min",
    difficulty: "Beginner",
    steps: [
      "Navigate to POS page",
      "Search for products or browse the catalog",
      "Click products to add them to cart",
      "Adjust quantities using +/- buttons",
      "Select customer (optional)",
      "Click 'Checkout' and choose payment method",
      "Complete the sale"
    ]
  },
  {
    id: 4,
    title: "Managing Customers",
    category: "customers",
    icon: Users,
    duration: "3 min",
    difficulty: "Beginner",
    steps: [
      "Go to Customers page",
      "Click 'Add Customer'",
      "Enter customer name (required)",
      "Add email, phone, and address (optional)",
      "Save the customer",
      "View customer purchase history on their card"
    ]
  },
  {
    id: 5,
    title: "Viewing Analytics",
    category: "analytics",
    icon: BarChart3,
    duration: "5 min",
    difficulty: "Intermediate",
    steps: [
      "Navigate to Analytics page",
      "Review KPI cards for revenue, profit, and average order value",
      "Check the sales trend chart for daily performance",
      "Analyze sales by category in the pie chart",
      "Review top selling products",
      "Export reports using the 'Export Report' button"
    ]
  },
  {
    id: 6,
    title: "Import/Export Products",
    category: "products",
    icon: Package,
    duration: "4 min",
    difficulty: "Intermediate",
    steps: [
      "Go to Products page",
      "Click 'Import/Export' button",
      "To export: Click 'Export to CSV' to download all products",
      "To import: Prepare CSV with columns: SKU, Name, Description, Cost Price, Sell Price, Stock, etc.",
      "Upload the CSV file",
      "Review and confirm the import"
    ]
  },
  {
    id: 7,
    title: "Refunding Sales",
    category: "sales",
    icon: ShoppingCart,
    duration: "2 min",
    difficulty: "Intermediate",
    steps: [
      "Navigate to Sales page",
      "Find the completed sale you want to refund",
      "Click the refund icon (circular arrow)",
      "Confirm the refund",
      "Stock will be automatically restored",
      "Sale status changes to 'Refunded'"
    ]
  },
  {
    id: 8,
    title: "Using AI Assistant",
    category: "help",
    icon: PlayCircle,
    duration: "3 min",
    difficulty: "Beginner",
    steps: [
      "Go to Help page from sidebar",
      "Use quick help buttons for common questions",
      "Or type your question in the chat",
      "AI assistant will provide step-by-step guidance",
      "Ask follow-up questions for more details"
    ]
  },
  {
    id: 9,
    title: "Managing Settings",
    category: "settings",
    icon: Settings,
    duration: "3 min",
    difficulty: "Beginner",
    steps: [
      "Navigate to Settings page",
      "Update store information (name, address, contact)",
      "Configure tax rate for sales",
      "Customize receipt settings",
      "Toggle between dark and light mode",
      "Save changes"
    ]
  }
];

const categories = [
  { value: "all", label: "All Topics", icon: BookOpen },
  { value: "basics", label: "Basics", icon: BookOpen },
  { value: "products", label: "Products", icon: Package },
  { value: "pos", label: "POS", icon: ShoppingCart },
  { value: "customers", label: "Customers", icon: Users },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
  { value: "sales", label: "Sales", icon: ShoppingCart },
  { value: "help", label: "Help", icon: PlayCircle },
  { value: "settings", label: "Settings", icon: Settings }
];

export default function Tutorial() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTutorial, setExpandedTutorial] = useState(null);

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.steps.some(step => step.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const difficultyColors = {
    Beginner: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    Intermediate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    Advanced: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Tutorials & Guides</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Step-by-step guides to help you master the system
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search tutorials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 dark:bg-gray-900 dark:border-gray-800"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.value)}
              className="whitespace-nowrap gap-2 dark:border-gray-700"
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Tutorials Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTutorials.map((tutorial) => {
          const Icon = tutorial.icon;
          const isExpanded = expandedTutorial === tutorial.id;
          
          return (
            <Card 
              key={tutorial.id}
              className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-all"
            >
              <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-gray-900 dark:text-gray-100 mb-2">
                        {tutorial.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={difficultyColors[tutorial.difficulty]}>
                          {tutorial.difficulty}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                          {tutorial.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpandedTutorial(isExpanded ? null : tutorial.id)}
                    className="flex-shrink-0"
                  >
                    <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </Button>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Steps:</h4>
                  <div className="space-y-3">
                    {tutorial.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-semibold">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium text-sm">
                        Follow these steps and you'll be all set!
                      </span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {filteredTutorials.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No tutorials found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter
          </p>
        </div>
      )}
    </div>
  );
}