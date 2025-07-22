import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Target, TrendingUp, Clock, Star, BarChart3, Settings, Filter, Activity, Bell, Brain, FileText, Database } from 'lucide-react';
import { GraficosAvancados } from './components/GraficosAvancados';
import { ResumoPerformance } from './components/ResumoPerformance';
import { SistemaNotificacoes } from './components/SistemaNotificacoes';
import ChatLLM from './components/ChatLLM';
import SistemaIA from './components/SistemaIA';

function App() {
  const [activeView, setActiveView] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  // Fetch dashboard data from backend com fallback para dados mock
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/overview');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          // Dados mock para teste - mais realistas
          setDashboardData({
            data: {
              metricas_principais: {
                corridas_concluidas: 1247,
                receita_total: 45200,
                motoristas_ativos: 85,
                avaliacao_media: 4.7
              },
              comparacao_anterior: {
                corridas_concluidas: 15,
                receita_total: 8,
                motoristas_ativos: 3,
                avaliacao_media: 0.2
              }
            }
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Dados mock para teste
        setDashboardData({
          data: {
            metricas_principais: {
              corridas_concluidas: 1247,
              receita_total: 45200,
              motoristas_ativos: 85,
              avaliacao_media: 4.7
            },
            comparacao_anterior: {
              corridas_concluidas: 15,
              receita_total: 8,
              motoristas_ativos: 3,
              avaliacao_media: 0.2
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sidebarItems = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'ia', label: 'Sistema de IA', icon: Brain },
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
            {activeView === 'ia' && <SistemaIA />}
            {activeView === 'alertas' && <AlertasPage />}
            {activeView === 'importacao' && <ImportacaoPage />}
            {activeView === 'graficos' && <GraficosPage data={dashboardData} loading={loading} />}
            {activeView === 'corridas' && <AnaliseCorreidasPage />}
            {activeView === 'motoristas' && <MotoristasPage />}
            {activeView === 'metas' && <MetasPage />}
            {activeView === 'temporal' && <TemporalPage />}
            {activeView === 'configuracao' && <ConfiguracaoPage />}
          </motion.div>
        </main>
      </div>
      
      {/* Chat LLM */}
      <ChatLLM />
    </div>
  );
}

// Overview Page Component - Versão melhorada
function OverviewPage({ data }) {
  const metricas = data?.data?.metricas_principais || {};
  const comparacao = data?.data?.comparacao_anterior || {};

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const cardData = [
    {
      title: 'Corridas Concluídas',
      value: metricas.corridas_concluidas?.toLocaleString('pt-BR') || '0',
      change: comparacao.corridas_concluidas || 0,
      icon: Car,
      color: 'bg-blue-500'
    },
    {
      title: 'Receita Total',
      value: formatCurrency(metricas.receita_total || 0),
      change: comparacao.receita_total || 0,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Motoristas Ativos',
      value: metricas.motoristas_ativos?.toString() || '0',
      change: comparacao.motoristas_ativos || 0,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Avaliação Média',
      value: metricas.avaliacao_media?.toFixed(1) || '0.0',
      change: comparacao.avaliacao_media || 0,
      icon: Star,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          Visão Geral
        </h2>
        <p style={{ color: '#6b7280' }}>
          Principais métricas da plataforma de mobilidade urbana
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {cardData.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: '#f3f4f6',
                  marginRight: '12px'
                }}>
                  <Icon style={{ height: '24px', width: '24px', color: '#3b82f6' }} />
                </div>
                <h3 style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  fontWeight: '500',
                  margin: 0
                }}>
                  {card.title}
                </h3>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <span style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: '#1f2937'
                }}>
                  {card.value}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                <span style={{ 
                  color: isPositive ? '#059669' : '#dc2626',
                  marginRight: '4px'
                }}>
                  {isPositive ? '↗' : '↘'} {Math.abs(card.change)}%
                </span>
                <span style={{ color: '#6b7280' }}>vs período anterior</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Gráficos placeholder com estilo melhorado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Corridas por Município
          </h3>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded flex items-center justify-center">
            <BarChart3 className="h-16 w-16 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tendência Temporal
          </h3>
          <div className="h-64 bg-gradient-to-r from-green-50 to-green-100 rounded flex items-center justify-center">
            <TrendingUp className="h-16 w-16 text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder components for other pages
function PerformancePage() {
  return (
    <div>
      <h2 style={{ 
        fontSize: '1.875rem', 
        fontWeight: 'bold', 
        color: '#1f2937',
        marginBottom: '8px'
      }}>
        Performance
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Análise detalhada do desempenho operacional
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eficiência Operacional</h3>
          <div className="text-2xl font-bold text-green-600">94.2%</div>
          <p className="text-sm text-gray-500">+2.1% vs mês anterior</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tempo Médio de Resposta</h3>
          <div className="text-2xl font-bold text-blue-600">3.2 min</div>
          <p className="text-sm text-gray-500">-0.5 min vs mês anterior</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Taxa de Cancelamento</h3>
          <div className="text-2xl font-bold text-red-600">2.8%</div>
          <p className="text-sm text-gray-500">-0.3% vs mês anterior</p>
        </div>
      </div>
    </div>
  );
}

function AlertasPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Sistema de Alertas</h2>
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-red-800 font-semibold">Alerta Crítico</h3>
          </div>
          <p className="text-red-700 mt-2">Taxa de cancelamento acima do limite em São Paulo</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-yellow-800 font-semibold">Alerta de Atenção</h3>
          </div>
          <p className="text-yellow-700 mt-2">Diminuição na avaliação média dos motoristas</p>
        </div>
      </div>
    </div>
  );
}

function ImportacaoPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Importação de Dados</h2>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload de Arquivos</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Arraste arquivos aqui ou clique para selecionar</p>
          <p className="text-sm text-gray-500 mt-2">Formatos suportados: CSV, Excel, JSON</p>
        </div>
      </div>
    </div>
  );
}

function GraficosPage({ data, loading }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Análises Avançadas</h2>
      <GraficosAvancados data={data} loading={loading} />
    </div>
  );
}

function ConfiguracaoPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Configurações</h2>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações do Sistema</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Notificações por email</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Ativado</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Backup automático</span>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Ativado</button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
