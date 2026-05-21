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
      title: "Gestão de estoque",
      description: "Controle produtos, níveis de estoque e alertas automáticos de reposição"
    },
    {
      icon: Zap,
      title: "PDV rápido",
      description: "Venda com agilidade, suporte a código de barras e múltiplas formas de pagamento"
    },
    {
      icon: Sparkles,
      title: "Insights com IA",
      description: "Receba recomendações inteligentes para otimizar seu negócio"
    },
    {
      icon: Shield,
      title: "Seguro e confiável",
      description: "Criado com boas práticas de segurança e gestão confiável de dados"
    },
    {
      icon: Users,
      title: "Gestão de clientes",
      description: "Organize e fortaleça o relacionamento com seus clientes"
    },
    {
      icon: Code,
      title: "Tecnologia moderna",
      description: "Construído com React, Tailwind CSS e tecnologias atuais"
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
      {/* Seção principal */}
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <Package className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          StockWise PRO
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          Sistema moderno de estoque e ponto de venda com IA, criado para pequenos negócios
        </p>
        <div className="flex items-center justify-center gap-3">
          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
            Versão 1.0.0
          </Badge>
          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
            Pronto para produção
          </Badge>
        </div>
      </div>

      {/* Grade de recursos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Principais recursos
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
            Stack tecnológica
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

      {/* O que está incluído */}
      <Card className="border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="text-gray-900 dark:text-gray-100">
            O que está incluído
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Sistema completo de gestão de estoque",
              "PDV com múltiplas formas de pagamento",
              "Gestão de relacionamento com clientes",
              "Análises e relatórios em tempo real",
              "Insights e recomendações com IA",
              "Importação/exportação via CSV",
              "Suporte a modo escuro",
              "Layout responsivo para todos os dispositivos",
              "Rastreamento de ajustes de estoque",
              "Recursos de reembolso e cancelamento de vendas",
              "Alertas de estoque baixo",
              "Assistente de IA para suporte",
              "Sistema completo de tutoriais",
              "Suporte a código de barras"
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

      {/* Créditos */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Heart className="w-5 h-5 text-red-500" />
            Desenvolvido com
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Desenvolvido para pequenos negócios simplificarem suas operações com tecnologia moderna e apoio de IA.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Baseado em Base44 Platform • React • Tailwind CSS
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

      {/* Rodapé */}
      <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
        <p>© 2024 StockWise PRO. Todos os direitos reservados.</p>
        <p className="mt-2">
          Feito para estudantes de TI e pequenos negócios
        </p>
      </div>
    </div>
  );
}