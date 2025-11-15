import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function ProductFilters({ filters, setFilters, categories }) {
  return (
    <div className="flex gap-3">
      <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
        <SelectTrigger className="w-40 dark:bg-gray-900 dark:border-gray-800">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-900 dark:border-gray-800">
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
        <SelectTrigger className="w-40 dark:bg-gray-900 dark:border-gray-800">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-900 dark:border-gray-800">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="discontinued">Discontinued</SelectItem>
          <SelectItem value="out_of_stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}