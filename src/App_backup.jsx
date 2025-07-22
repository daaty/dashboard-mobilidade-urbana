import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Target, TrendingUp, Clock, Star, BarChart3, Settings, Filter, Activity, Bell, Brain, FileText } from 'lucide-react';
import { GraficosAvancados } from './components/GraficosAvancados';
import { ConfiguracaoAvancada } from './components/ConfiguracaoAvancada';
import { FiltrosAvancados } from './components/FiltrosAvancados';
import { SistemaNotificacoes } from './components/SistemaNotificacoes';
import { ResumoPerformance } from './components/ResumoPerformance';
import SistemaAlertas from './components/SistemaAlertas';
import ImportacaoAvancada from './components/ImportacaoAvancada';
import AnalisePreditiva from './components/AnalisePreditiva';
import RelatoriosExecutivos from './components/RelatoriosExecutivos';

function App() {
  const [activeView, setActiveView] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  // Fetch dashboard data from backend
  useEffect(() => {
    fetch('/api/dashboard/overview')
      .then(response => response.json())
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar dados do dashboard:', error);
        setLoading(false);
      });
  }, []);

  const sidebarItems = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'alertas', label: 'Sistema de Alertas', icon: Bell },
    { id: 'importacao', label: 'Importação de Dados', icon: Database },
    { id: 'graficos', label: 'Análises Avançadas', icon: BarChart3 },
    { id: 'corridas', label: 'Análise de Corridas', icon: Car },
    { id: 'motoristas', label: 'Motoristas', icon: Users },
    { id: 'metas', label: 'Metas por Cidade', icon: Target },
    { id: 'temporal', label: 'Comparativo Temporal', icon: Clock },
    { id: 'configuracao', label: 'Configurações', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard de Mobilidade Urbana
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <FiltrosAvancados onFilterChange={setFilters} data={dashboardData} />
              <SistemaNotificacoes />
              <div className="text-sm text-gray-500">
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveView(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                        activeView === item.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'overview' && <OverviewPage data={dashboardData} />}
            {activeView === 'performance' && <ResumoPerformance data={dashboardData} loading={loading} />}
            {activeView === 'alertas' && <SistemaAlertas />}
            {activeView === 'importacao' && <ImportacaoAvancada />}
            {activeView === 'graficos' && <GraficosAvancados data={dashboardData} loading={loading} />}
            {activeView === 'corridas' && <AnaliseCorreidasPage />}
            {activeView === 'motoristas' && <MotoristasPage />}
            {activeView === 'metas' && <MetasPage />}
            {activeView === 'temporal' && <TemporalPage />}
            {activeView === 'configuracao' && <ConfiguracaoAvancada />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// Overview Page Component
function OverviewPage({ data }) {
  const metricas = data?.data?.metricas_principais || {};
  const comparacao = data?.data?.comparacao_anterior || {};

  const metricCards = [
    {
      title: 'Corridas Concluídas',
      value: metricas.corridas_concluidas || 0,
      change: comparacao.corridas_concluidas || 0,
      icon: Car,
      color: 'blue'
    },
    {
      title: 'Receita Total',
      value: `R$ ${(metricas.receita_total || 0).toLocaleString('pt-BR')}`,
      change: comparacao.receita_total || 0,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Motoristas Ativos',
      value: metricas.motoristas_ativos || 0,
      change: comparacao.motoristas_ativos || 0,
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Avaliação Média',
      value: (metricas.avaliacao_media || 0).toFixed(1),
      change: comparacao.avaliacao_media || 0,
      icon: Star,
      color: 'yellow'
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;
          
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                  <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
              </div>
              
              {metric.change !== 0 && (
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? '+' : ''}{metric.change.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    vs período anterior
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Placeholder para gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Corridas por Município
          </h3>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <p className="text-gray-500">Gráfico será implementado em breve</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tendência Temporal
          </h3>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <p className="text-gray-500">Gráfico será implementado em breve</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder components for other pages
function AnaliseCorreidasPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Análise de Corridas</h2>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <p className="text-gray-600">Análise detalhada de corridas será implementada em breve.</p>
      </div>
    </div>
  );
}

function MotoristasPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Motoristas</h2>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <p className="text-gray-600">Gestão de motoristas será implementada em breve.</p>
      </div>
    </div>
  );
}

function MetasPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Metas por Cidade</h2>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <p className="text-gray-600">Configuração de metas será implementada em breve.</p>
      </div>
    </div>
  );
}

function TemporalPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Comparativo Temporal</h2>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <p className="text-gray-600">Análise temporal será implementada em breve.</p>
      </div>
    </div>
  );
}

export default App;
