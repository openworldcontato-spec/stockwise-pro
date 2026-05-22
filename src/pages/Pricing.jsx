import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Check, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PRICE_MONTHLY = "price_1TRLh1HKgQbXEpueuqLnkmeQ";
const PRICE_ANNUAL = "price_1TZgnKHKgQbXEpue5LUyazJg";

const features = [
  "PDV completo com leitor de código de barras",
  "Gestão de estoque ilimitada",
  "Relatórios e analytics avançados",
  "Gestão de clientes",
  "Alertas de estoque baixo",
  "Insights com Inteligência Artificial",
  "Exportação de dados (CSV/PDF)",
  "Suporte prioritário",
];

export default function Pricing() {
  const [loading, setLoading] = useState(null);

  const handleCheckout = async (priceId, planName) => {
    // Block inside iframe (preview)
    if (window.self !== window.top) {
      alert("O checkout só funciona a partir do app publicado. Publique o app e abra em uma nova aba.");
      return;
    }

    setLoading(planName);
    try {
      const response = await base44.functions.invoke("createCheckoutSession", { priceId });
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      alert("Erro ao iniciar pagamento. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Escolha seu plano
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Acesso completo ao StockWise PRO. Cancele quando quiser.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Monthly */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mensal</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Flexibilidade total</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">R$97</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">/mês</span>
            </div>

            <Button
              className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleCheckout(PRICE_MONTHLY, "mensal")}
              disabled={loading !== null}
            >
              {loading === "mensal" ? "Redirecionando..." : "Assinar Plano Mensal"}
            </Button>

            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Annual */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-purple-500 p-8 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-purple-600 text-white px-4 py-1 text-sm font-semibold">
                🔥 Mais popular • Economize 32%
              </Badge>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Anual</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Melhor custo-benefício</p>
              </div>
            </div>

            <div className="mb-1">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">R$797</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">/ano</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-6">
              Equivale a R$66,42/mês — economize R$367/ano
            </p>

            <Button
              className="w-full mb-8 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => handleCheckout(PRICE_ANNUAL, "anual")}
              disabled={loading !== null}
            >
              {loading === "anual" ? "Redirecionando..." : "Assinar Plano Anual"}
            </Button>

            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-10">
          Pagamento seguro processado pelo Stripe. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
}