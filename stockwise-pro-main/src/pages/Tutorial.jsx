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
    title: "Primeiros passos",
    category: "basics",
    icon: BookOpen,
    duration: "5 min",
    difficulty: "Iniciante",
    steps: [
      "Acesse o Painel para ver o resumo",
      "Confira os cards de métricas para insights rápidos",
      "Revise alertas de estoque baixo e recomendações de IA",
      "Explore o menu lateral para acessar todos os recursos"
    ]
  },
  {
    id: 2,
    title: "Adicionando produtos",
    category: "products",
    icon: Package,
    duration: "3 min",
    difficulty: "Iniciante",
    steps: [
      "Acesse Produtos pelo menu lateral",
      "Clique no botão 'Adicionar produto'",
      "Preencha os campos obrigatórios: SKU, nome, preço e estoque",
      "Opcionalmente, adicione categoria, código de barras e imagem",
      "Clique em 'Criar produto' para salvar"
    ]
  },
  {
    id: 3,
    title: "Processando vendas",
    category: "pos",
    icon: ShoppingCart,
    duration: "4 min",
    difficulty: "Iniciante",
    steps: [
      "Acesse a página PDV",
      "Busque produtos ou navegue pelo catálogo",
      "Clique nos produtos para adicionar ao carrinho",
      "Ajuste as quantidades usando os botões +/-",
      "Selecione o cliente (opcional)",
      "Clique em 'Finalizar venda' e escolha a forma de pagamento",
      "Conclua a venda"
    ]
  },
  {
    id: 4,
    title: "Gerenciando clientes",
    category: "customers",
    icon: Users,
    duration: "3 min",
    difficulty: "Iniciante",
    steps: [
      "Acesse a página Clientes",
      "Clique em 'Adicionar cliente'",
      "Informe o nome do cliente (obrigatório)",
      "Adicione e-mail, telefone e endereço (opcional)",
      "Salve o cliente",
      "Veja o histórico de compras no card do cliente"
    ]
  },
  {
    id: 5,
    title: "Visualizando relatórios",
    category: "analytics",
    icon: BarChart3,
    duration: "5 min",
    difficulty: "Intermediário",
    steps: [
      "Acesse a página Relatórios",
      "Revise os KPIs de receita, lucro e ticket médio",
      "Confira o gráfico de tendência de vendas por dia",
      "Analise vendas por categoria no gráfico de pizza",
      "Revise os produtos mais vendidos",
      "Exporte relatórios usando o botão 'Exportar relatório'"
    ]
  },
  {
    id: 6,
    title: "Importar/exportar produtos",
    category: "products",
    icon: Package,
    duration: "4 min",
    difficulty: "Intermediário",
    steps: [
      "Acesse a página Produtos",
      "Clique no botão 'Importar/Exportar'",
      "Para exportar: clique em 'Exportar para CSV' para baixar todos os produtos",
      "Para importar: prepare um CSV com colunas: SKU, nome, descrição, preço de custo, preço de venda, estoque etc.",
      "Envie o arquivo CSV",
      "Revise e confirme a importação"
    ]
  },
  {
    id: 7,
    title: "Reembolsando vendas",
    category: "sales",
    icon: ShoppingCart,
    duration: "2 min",
    difficulty: "Intermediário",
    steps: [
      "Acesse a página Vendas",
      "Encontre a venda concluída que deseja reembolsar",
      "Clique no ícone de reembolso (seta circular)",
      "Confirme o reembolso",
      "O estoque será restaurado automaticamente",
      "O status da venda muda para 'Reembolsada'"
    ]
  },
  {
    id: 8,
    title: "Usando o assistente de IA",
    category: "help",
    icon: PlayCircle,
    duration: "3 min",
    difficulty: "Iniciante",
    steps: [
      "Acesse Ajuda pelo menu lateral",
      "Use os botões de ajuda rápida para perguntas comuns",
      "Ou digite sua pergunta no chat",
      "O assistente de IA dará orientações passo a passo",
      "Faça perguntas de acompanhamento para mais detalhes"
    ]
  },
  {
    id: 9,
    title: "Gerenciando configurações",
    category: "settings",
    icon: Settings,
    duration: "3 min",
    difficulty: "Iniciante",
    steps: [
      "Acesse a página Configurações",
      "Atualize as informações da loja (nome, endereço e contato)",
      "Configure a taxa de imposto das vendas",
      "Personalize as configurações do recibo",
      "Alterne entre modo escuro e claro",
      "Salve as alterações"
    ]
  }
];

const categories = [
  { value: "all", label: "Todos", icon: BookOpen },
  { value: "basics", label: "Básico", icon: BookOpen },
  { value: "products", label: "Produtos", icon: Package },
  { value: "pos", label: "PDV", icon: ShoppingCart },
  { value: "customers", label: "Clientes", icon: Users },
  { value: "analytics", label: "Relatórios", icon: BarChart3 },
  { value: "sales", label: "Vendas", icon: ShoppingCart },
  { value: "help", label: "Ajuda", icon: PlayCircle },
  { value: "settings", label: "Configurações", icon: Settings }
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
    Iniciante: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    Intermediário: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    Avançado: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Tutoriais e guias</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Guias passo a passo para dominar o sistema
        </p>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Buscar tutoriais..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 dark:bg-gray-900 dark:border-gray-800"
        />
      </div>

      {/* Filtro de categoria */}
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

      {/* Grade de tutoriais */}
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
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Passos:</h4>
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
                        Siga estes passos e pronto, sem drama.
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
            Nenhum tutorial encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tente ajustar sua busca ou filtro
          </p>
        </div>
      )}
    </div>
  );
}