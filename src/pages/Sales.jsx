import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Receipt, RefreshCcw, X, Eye, Filter } from "lucide-react";
import { formatCurrency, formatDateTime, translatePaymentMethod, translateSaleStatus } from "@/lib/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors = {
  completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  refunded: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  voided: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700"
};

export default function Sales() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: () => base44.entities.Sale.list('-created_date'),
  });

  const { data: saleItems = [] } = useQuery({
    queryKey: ['saleItems'],
    queryFn: () => base44.entities.SaleItem.list(),
  });

  const updateSaleMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Sale.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      setShowDetails(false);
    },
  });

  const handleRefund = async (sale) => {
    if (!confirm(`Reembolsar a venda ${sale.sale_number}? Isso não poderá ser desfeito.`)) return;
    
    const items = saleItems.filter(item => item.sale_id === sale.id);
    
    for (const item of items) {
      try {
        const { data: products } = await base44.entities.Product.filter({ id: item.product_id });
        if (products && products.length > 0) {
          const product = products[0];
          await base44.entities.Product.update(product.id, {
            stock_quantity: product.stock_quantity + item.quantity
          });
        }
      } catch (error) {
        console.error("Erro ao restaurar estoque:", error);
      }
    }
    
    updateSaleMutation.mutate({ 
      id: sale.id, 
      data: { status: 'refunded' } 
    });
  };

  const handleVoid = (sale) => {
    if (!confirm(`Cancelar a venda ${sale.sale_number}?`)) return;
    updateSaleMutation.mutate({ 
      id: sale.id, 
      data: { status: 'voided' } 
    });
  };

  const viewDetails = (sale) => {
    setSelectedSale(sale);
    setShowDetails(true);
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.sale_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const saleItemsForSelected = selectedSale ? saleItems.filter(item => item.sale_id === selectedSale.id) : [];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Vendas e transações</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredSales.length} vendas • Total: {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar por número da venda ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-gray-900 dark:border-gray-800"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 dark:bg-gray-900 dark:border-gray-800">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-800">
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="completed">Concluída</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="refunded">Reembolsada</SelectItem>
            <SelectItem value="voided">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <Receipt className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhuma venda encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Venda nº</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Pagamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                          {sale.sale_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {sale.customer_name || 'Cliente avulso'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(sale.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {translatePaymentMethod(sale.payment_method)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className={statusColors[sale.status]}>
                          {translateSaleStatus(sale.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {formatDateTime(sale.created_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => viewDetails(sale)} className="h-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {sale.status === 'completed' && (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => handleRefund(sale)} className="h-8 text-orange-600 dark:text-orange-400">
                                <RefreshCcw className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleVoid(sale)} className="h-8 text-red-600 dark:text-red-400">
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Detalhes da venda - {selectedSale?.sale_number}
            </DialogTitle>
          </DialogHeader>

          {selectedSale && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedSale.customer_name || 'Cliente avulso'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Forma de pagamento</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {translatePaymentMethod(selectedSale.payment_method)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatDateTime(selectedSale.created_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <Badge variant="outline" className={statusColors[selectedSale.status]}>
                    {translateSaleStatus(selectedSale.status)}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Itens</h4>
                <div className="space-y-2">
                  {saleItemsForSelected.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.product_name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(selectedSale.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Imposto</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(selectedSale.tax_amount)}</span>
                </div>
                {selectedSale.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Desconto</span>
                    <span className="font-medium text-red-600 dark:text-red-400">-{formatCurrency(selectedSale.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-blue-600 dark:text-blue-400">{formatCurrency(selectedSale.total_amount)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
