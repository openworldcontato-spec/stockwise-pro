import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Code, 
  Sparkles, 
  Shield, 
  Zap, 
  Users,
  Heart,
  Github,
  Globe
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Package,
      title: "Inventory Management",
      description: "Track products, manage stock levels, and get reorder alerts automatically"
    },
    {
      icon: Zap,
      title: "Fast POS System",
      description: "Lightning-fast checkout process with barcode support and multiple payment methods"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations and insights to optimize your business"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Built with security best practices and reliable data management"
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Build and maintain relationships with your customers"
    },
    {
      icon: Code,
      title: "Modern Tech Stack",
      description: "Built with React, Tailwind CSS, and cutting-edge technologies"
    }
  ];

  const techStack = [
    "React 18",
    "Tailwind CSS",
    "Shadcn/UI",
    "Recharts",
    "React Query",
    "Base44 Platform"
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <Package className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          InvenTrack POS
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          A modern, AI-powered inventory management and point of sale system designed for small businesses
        </p>
        <div className="flex items-center justify-center gap-3">
          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
            Version 1.0.0
          </Badge>
          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
            Production Ready
          </Badge>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={idx}
                className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-all group"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tech Stack */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Code className="w-5 h-5" />
            Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech, idx) => (
              <Badge 
                key={idx}
                variant="outline"
                className="px-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What's Included */}
      <Card className="border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="text-gray-900 dark:text-gray-100">
            What's Included
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Complete inventory management system",
              "Point of sale with multiple payment methods",
              "Customer relationship management",
              "Real-time analytics and reporting",
              "AI-powered insights and recommendations",
              "Import/Export functionality (CSV)",
              "Dark mode support",
              "Responsive design for all devices",
              "Stock adjustment tracking",
              "Sales refund and void capabilities",
              "Low stock alerts",
              "AI chat assistant for help",
              "Comprehensive tutorial system",
              "Barcode support"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credits */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Heart className="w-5 h-5 text-red-500" />
            Built With
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Developed for small businesses to streamline their operations with modern technology and AI assistance.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Powered by Base44 Platform • React • Tailwind CSS
            </p>
            <div className="flex items-center justify-center gap-6 pt-4">
              <a 
                href="https://base44.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">Base44 Platform</span>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
        <p>© 2024 InvenTrack POS. All rights reserved.</p>
        <p className="mt-2">
          Made for IT students and small businesses
        </p>
      </div>
    </div>
  );
}