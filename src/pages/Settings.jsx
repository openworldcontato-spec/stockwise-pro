import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Store, Receipt, LogOut, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currencies = [
  { code: "PHP", name: "Philippine Peso (₱)" },
  { code: "USD", name: "US Dollar ($)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "JPY", name: "Japanese Yen (¥)" },
  { code: "CNY", name: "Chinese Yuan (¥)" },
  { code: "KRW", name: "South Korean Won (₩)" },
  { code: "SGD", name: "Singapore Dollar (S$)" },
  { code: "MYR", name: "Malaysian Ringgit (RM)" },
  { code: "THB", name: "Thai Baht (฿)" },
  { code: "IDR", name: "Indonesian Rupiah (Rp)" },
  { code: "VND", name: "Vietnamese Dong (₫)" },
  { code: "INR", name: "Indian Rupee (₹)" },
  { code: "AUD", name: "Australian Dollar (A$)" },
  { code: "CAD", name: "Canadian Dollar (C$)" },
  { code: "CHF", name: "Swiss Franc (Fr)" },
  { code: "NZD", name: "New Zealand Dollar (NZ$)" },
  { code: "HKD", name: "Hong Kong Dollar (HK$)" },
  { code: "TWD", name: "Taiwan Dollar (NT$)" },
  { code: "BRL", name: "Brazilian Real (R$)" },
  { code: "MXN", name: "Mexican Peso (Mex$)" },
  { code: "AED", name: "UAE Dirham (د.إ)" },
  { code: "SAR", name: "Saudi Riyal (﷼)" }
];

export default function Settings() {
  const [storeSettings, setStoreSettings] = useState({
    store_name: "InvenTrack Store",
    address: "123 Business Street",
    phone: "+63 (917) 123-4567",
    email: "store@inventtrack.com",
    tax_rate: 12,
    currency: "PHP"
  });

  const [receiptSettings, setReceiptSettings] = useState({
    receipt_header: "Thank you for your purchase!",
    receipt_footer: "Visit us again soon",
    show_tax_details: true,
    show_store_logo: true
  });

  const handleSaveStore = () => {
    toast.success("Store settings saved successfully!");
  };

  const handleSaveReceipt = () => {
    toast.success("Receipt settings saved successfully!");
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await base44.auth.logout();
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your store and system preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Store Settings */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Store className="w-5 h-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store_name">Store Name</Label>
              <Input
                id="store_name"
                value={storeSettings.store_name}
                onChange={(e) => setStoreSettings({ ...storeSettings, store_name: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={storeSettings.address}
                onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                className="h-20 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={storeSettings.phone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={storeSettings.email}
                  onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={storeSettings.tax_rate}
                  onChange={(e) => setStoreSettings({ ...storeSettings, tax_rate: parseFloat(e.target.value) })}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={storeSettings.currency} onValueChange={(value) => setStoreSettings({ ...storeSettings, currency: value })}>
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-gray-800 max-h-[300px]">
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSaveStore}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
            >
              <Save className="w-4 h-4" />
              Save Store Settings
            </Button>
          </CardContent>
        </Card>

        {/* Receipt Settings */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Receipt className="w-5 h-5" />
              Receipt Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receipt_header">Receipt Header</Label>
              <Input
                id="receipt_header"
                value={receiptSettings.receipt_header}
                onChange={(e) => setReceiptSettings({ ...receiptSettings, receipt_header: e.target.value })}
                placeholder="Thank you for your purchase!"
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt_footer">Receipt Footer</Label>
              <Textarea
                id="receipt_footer"
                value={receiptSettings.receipt_footer}
                onChange={(e) => setReceiptSettings({ ...receiptSettings, receipt_footer: e.target.value })}
                placeholder="Visit us again soon"
                className="h-20 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-900 dark:text-gray-100">Show Tax Details</span>
                <button
                  onClick={() => setReceiptSettings({ ...receiptSettings, show_tax_details: !receiptSettings.show_tax_details })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    receiptSettings.show_tax_details ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      receiptSettings.show_tax_details ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-900 dark:text-gray-100">Show Store Logo</span>
                <button
                  onClick={() => setReceiptSettings({ ...receiptSettings, show_store_logo: !receiptSettings.show_store_logo })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    receiptSettings.show_store_logo ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      receiptSettings.show_store_logo ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <Button
              onClick={handleSaveReceipt}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
            >
              <Save className="w-4 h-4" />
              Save Receipt Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Actions */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <SettingsIcon className="w-5 h-5" />
            System
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">App Version</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1.0.0 - Production</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Theme</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle in sidebar footer</p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}