import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Smartphone, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function POS() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(10); // 10% tax
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list(),
  });

  const createSaleMutation = useMutation({
    mutationFn: async (saleData) => {
      const sale = await base44.entities.Sale.create(saleData.sale);
      
      // Create sale items
      for (const item of saleData.items) {
        await base44.entities.SaleItem.create({ ...item, sale_id: sale.id });
        
        // Update product stock
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          await base44.entities.Product.update(product.id, {
            stock_quantity: product.stock_quantity - item.quantity
          });
          
          // Create stock adjustment record
          await base44.entities.StockAdjustment.create({
            product_id: product.id,
            product_name: product.name,
            adjustment_type: 'sale',
            quantity_change: -item.quantity,
            previous_quantity: product.stock_quantity,
            new_quantity: product.stock_quantity - item.quantity,
            reason: `Sale #${saleData.sale.sale_number}`,
            reference_id: sale.id
          });
        }
      }
      
      // Update customer stats if applicable
      if (selectedCustomer) {
        await base44.entities.Customer.update(selectedCustomer.id, {
          total_purchases: (selectedCustomer.total_purchases || 0) + saleData.sale.total_amount,
          purchase_count: (selectedCustomer.purchase_count || 0) + 1
        });
      }
      
      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);
      setShowCheckout(false);
      navigate(createPageUrl("Sales"));
    },
  });

  const filteredProducts = products.filter(p => 
    p.stock_quantity > 0 &&
    (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.barcode?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock_quantity) {
        setCart(cart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) return null;
        if (newQuantity > item.product.stock_quantity) return item;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.sell_price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
  const total = subtotal - discountAmount + taxAmount;

  const handleCheckout = () => {
    const saleNumber = `SALE-${Date.now()}`;
    
    const saleData = {
      sale: {
        sale_number: saleNumber,
        customer_id: selectedCustomer?.id,
        customer_name: selectedCustomer?.name || 'Walk-in',
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total_amount: total,
        payment_method: paymentMethod,
        status: 'completed',
        items_data: JSON.stringify(cart.map(item => ({
          name: item.product.name,
          sku: item.product.sku,
          quantity: item.quantity,
          price: item.product.sell_price
        })))
      },
      items: cart.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_sku: item.product.sku,
        quantity: item.quantity,
        unit_price: item.product.sell_price,
        cost_price: item.product.cost_price,
        discount: 0,
        total: item.product.sell_price * item.quantity
      }))
    };

    createSaleMutation.mutate(saleData);
  };

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-6">
      {/* Products Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Point of Sale</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search products by name, SKU, or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 dark:bg-gray-900 dark:border-gray-800"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingCart className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Stock: {product.stock_quantity}
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${product.sell_price?.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96 flex flex-col">
        <Card className="flex-1 flex flex-col border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <ShoppingCart className="w-5 h-5" />
              Cart ({cart.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="mb-4">
              <Select value={selectedCustomer?.id || ''} onValueChange={(id) => setSelectedCustomer(customers.find(c => c.id === id))}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue placeholder="Select customer (optional)" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-gray-800">
                  <SelectItem value={null}>Walk-in Customer</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p>Cart is empty</p>
                  <p className="text-sm mt-1">Add products to start</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ${item.product.sell_price?.toFixed(2)} each
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 dark:border-gray-700"
                          onClick={() => updateQuantity(item.product.id, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-gray-900 dark:text-gray-100">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 dark:border-gray-700"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          disabled={item.quantity >= item.product.stock_quantity}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">
                        ${(item.product.sell_price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax ({taxRate}%)</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">${taxAmount.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Discount ({discount}%)</span>
                      <span className="font-medium text-red-600 dark:text-red-400">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-800">
                    <span className="text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Checkout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Complete Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">${total.toFixed(2)}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className="flex-col h-20 dark:border-gray-700"
                >
                  <Banknote className="w-6 h-6 mb-1" />
                  <span className="text-xs">Cash</span>
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="flex-col h-20 dark:border-gray-700"
                >
                  <CreditCard className="w-6 h-6 mb-1" />
                  <span className="text-xs">Card</span>
                </Button>
                <Button
                  variant={paymentMethod === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('mobile')}
                  className="flex-col h-20 dark:border-gray-700"
                >
                  <Smartphone className="w-6 h-6 mb-1" />
                  <span className="text-xs">Mobile</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Discount %</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <Button
              onClick={handleCheckout}
              disabled={createSaleMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Check className="w-5 h-5 mr-2" />
              {createSaleMutation.isPending ? 'Processing...' : 'Complete Sale'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}