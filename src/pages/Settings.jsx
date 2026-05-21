import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Store, Receipt, LogOut, Save, Upload, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  clearSavedAppSettings,
  defaultReceiptSettings,
  defaultStoreSettings,
  loadReceiptSettings,
  loadStoreSettings,
  saveReceiptSettings,
  saveStoreSettings,
} from "@/lib/appSettings";

const currencies = [
  { code: "BRL", name: "Real brasileiro (R$)" },
  { code: "USD", name: "Dólar americano ($)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "Libra esterlina (£)" },
  { code: "JPY", name: "Iene japonês (¥)" },
  { code: "CNY", name: "Yuan chinês (¥)" },
  { code: "KRW", name: "Won sul-coreano (₩)" },
  { code: "SGD", name: "Dólar de Singapura (S$)" },
  { code: "MYR", name: "Ringgit malaio (RM)" },
  { code: "THB", name: "Baht tailandês (฿)" },
  { code: "IDR", name: "Rupia indonésia (Rp)" },
  { code: "VND", name: "Dong vietnamita (₫)" },
  { code: "INR", name: "Rupia indiana (₹)" },
  { code: "AUD", name: "Dólar australiano (A$)" },
  { code: "CAD", name: "Dólar canadense (C$)" },
  { code: "CHF", name: "Franco suíço (Fr)" },
  { code: "NZD", name: "Dólar neozelandês (NZ$)" },
  { code: "HKD", name: "Dólar de Hong Kong (HK$)" },
  { code: "TWD", name: "Dólar taiwanês (NT$)" },
  { code: "MXN", name: "Peso mexicano (Mex$)" },
  { code: "AED", name: "Dirham dos Emirados (د.إ)" },
  { code: "SAR", name: "Riyal saudita (﷼)" }
];

export default function Settings() {
  const [storeSettings, setStoreSettings] = useState(defaultStoreSettings);
  const [receiptSettings, setReceiptSettings] = useState(defaultReceiptSettings);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    setStoreSettings(loadStoreSettings());
    setReceiptSettings(loadReceiptSettings());
  }, []);

  const handleSaveStore = () => {
    const savedSettings = saveStoreSettings(storeSettings);
    setStoreSettings(savedSettings);
    toast.success("Configurações da loja salvas com sucesso!");
  };

  const handleSaveReceipt = () => {
    const savedSettings = saveReceiptSettings(receiptSettings);
    setReceiptSettings(savedSettings);
    toast.success("Configurações do recibo salvas com sucesso!");
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Envie uma imagem válida para o logo.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Use uma imagem de até 2 MB para evitar travar o armazenamento local.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptSettings((current) => ({
        ...current,
        store_logo: reader.result,
        show_store_logo: true
      }));
      toast.success("Logo carregado. Clique em salvar para gravar.");
    };
    reader.onerror = () => toast.error("Não foi possível carregar o logo.");
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setReceiptSettings((current) => ({ ...current, store_logo: "" }));
    toast.success("Logo removido. Clique em salvar para gravar.");
  };

  const handleSair = async () => {
    if (confirm("Tem certeza que deseja sair?")) {
      await base44.auth.logout();
    }
  };

  const handleDeleteAccount = async () => {
    const firstConfirm = confirm(
      "Tem certeza que deseja excluir sua conta? Essa ação tenta remover seu usuário e limpa as configurações salvas neste app."
    );
    if (!firstConfirm) return;

    const typedConfirmation = prompt('Digite EXCLUIR para confirmar a exclusão da conta:');
    if (typedConfirmation !== "EXCLUIR") {
      toast.info("Exclusão cancelada.");
      return;
    }

    setIsDeletingAccount(true);

    try {
      const currentUser = await base44.auth.me();
      if (!currentUser?.id) {
        throw new Error("Usuário não encontrado.");
      }

      await base44.entities.User.delete(currentUser.id);
      clearSavedAppSettings();
      toast.success("Conta excluída com sucesso.");
      setTimeout(() => base44.auth.logout(), 800);
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast.error("Não foi possível excluir a conta automaticamente. Verifique as permissões da entidade User no Base44.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Configurações</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie sua loja e as preferências do sistema
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configurações da loja */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Store className="w-5 h-5" />
              Informações da loja
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store_name">Nome da loja</Label>
              <Input
                id="store_name"
                value={storeSettings.store_name}
                onChange={(e) => setStoreSettings({ ...storeSettings, store_name: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={storeSettings.address}
                onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                className="h-20 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax_rate">Taxa de imposto (%)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={storeSettings.tax_rate}
                  onChange={(e) => setStoreSettings({ ...storeSettings, tax_rate: Number(e.target.value) || 0 })}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
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
              Salvar configurações da loja
            </Button>
          </CardContent>
        </Card>

        {/* Configurações do recibo */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Receipt className="w-5 h-5" />
              Configurações do recibo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receipt_header">Cabeçalho do recibo</Label>
              <Input
                id="receipt_header"
                value={receiptSettings.receipt_header}
                onChange={(e) => setReceiptSettings({ ...receiptSettings, receipt_header: e.target.value })}
                placeholder="Obrigado pela sua compra!"
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt_footer">Rodapé do recibo</Label>
              <Textarea
                id="receipt_footer"
                value={receiptSettings.receipt_footer}
                onChange={(e) => setReceiptSettings({ ...receiptSettings, receipt_footer: e.target.value })}
                placeholder="Volte sempre"
                className="h-20 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store_logo">Logo da loja no recibo</Label>
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-4 space-y-3">
                {receiptSettings.store_logo ? (
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center">
                      <img src={receiptSettings.store_logo} alt="Logo da loja" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Logo carregado</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Clique em salvar para manter no recibo.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveLogo} className="gap-2 dark:border-gray-700">
                      <Trash2 className="w-4 h-4" />
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Envie um PNG ou JPG de até 2 MB.</p>
                  </div>
                )}
                <Input
                  id="store_logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-900 dark:text-gray-100">Mostrar detalhes dos impostos</span>
                <button
                  type="button"
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
                <span className="text-sm text-gray-900 dark:text-gray-100">Mostrar logo da loja</span>
                <button
                  type="button"
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
              Salvar configurações do recibo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ações do sistema */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <SettingsIcon className="w-5 h-5" />
            Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Versão do app</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1.0.0</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Tema</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alterar no rodapé da barra lateral</p>
              </div>
            </div>

            <Button
              onClick={handleSair}
              variant="destructive"
              className="w-full gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
        <CardHeader className="border-b border-red-200 dark:border-red-900">
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <AlertTriangle className="w-5 h-5" />
            Zona de segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-red-700 dark:text-red-300">
            Use esta opção apenas quando o usuário realmente quiser remover a conta do app.
          </p>
          <Button
            onClick={handleDeleteAccount}
            disabled={isDeletingAccount}
            variant="destructive"
            className="w-full gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeletingAccount ? "Excluindo conta..." : "Excluir minha conta"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
