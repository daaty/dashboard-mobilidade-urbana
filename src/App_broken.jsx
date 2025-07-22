import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Target, TrendingUp, Clock, Star, BarChart3, Settings, Filter, Activity } from 'lucide-react';

// Importações seguras - removendo componentes que podem estar com problema
// import { GraficosAvancados } from './components/GraficosAvancados';
// import { ConfiguracaoAvancada } from './components/ConfiguracaoAvancada';
// import { FiltrosAvancados } from './components/FiltrosAvancados';
// import { SistemaNotificacoes } from './components/SistemaNotificacoes';
// import { ResumoPerformance } from './components/ResumoPerformance';

function App() {
  const [activeView, setActiveView] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/overview');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
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
    { id: 'graficos', label: 'Análises Avançadas', icon: BarChart3 },
    { id: 'corridas', label: 'Análise de Corridas', icon: Car },
    { id: 'motoristas', label: 'Motoristas', icon: Users },
    { id: 'metas', label: 'Metas por Cidade', icon: Target },
    { id: 'temporal', label: 'Comparativo Temporal', icon: Clock },
    { id: 'configuracao', label: 'Configurações', icon: Settings },
  ];

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        borderBottom: '1px solid #e5e7eb' 
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem 0' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Car style={{ height: '32px', width: '32px', color: '#3b82f6', marginRight: '12px' }} />
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#1f2937',
                margin: 0
              }}>
                Dashboard de Mobilidade Urbana
              </h1>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px' 
            }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <nav style={{ 
          width: '256px', 
          backgroundColor: 'white', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
          minHeight: '100vh' 
        }}>
          <div style={{ padding: '1rem' }}>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <li key={item.id} style={{ marginBottom: '8px' }}>
                    <button
                      onClick={() => setActiveView(item.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        border: 'none',
                        backgroundColor: isActive ? '#eff6ff' : 'transparent',
                        color: isActive ? '#1d4ed8' : '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderRight: isActive ? '2px solid #1d4ed8' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.target.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Icon style={{ height: '20px', width: '20px' }} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '1.5rem' }}>
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'overview' && <OverviewPage data={dashboardData} />}
            {activeView === 'performance' && <PerformancePage data={dashboardData} />}
            {activeView === 'graficos' && <GraficosPage data={dashboardData} />}
            {activeView === 'corridas' && <AnaliseCorreidasPage />}
            {activeView === 'motoristas' && <MotoristasPage />}
            {activeView === 'metas' && <MetasPage />}
            {activeView === 'temporal' && <TemporalPage />}
            {activeView === 'configuracao' && <ConfiguracaoPage />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// Componentes das páginas
const OverviewPage = ({ data }) => {
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
    </div>
  );
};

const PerformancePage = ({ data }) => (
  <div>
    <h2 style={{ 
      fontSize: '1.875rem', 
      fontWeight: 'bold', 
      color: '#1f2937',
      marginBottom: '16px'
    }}>
      Performance
    </h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <p>Análise de performance em desenvolvimento...</p>
    </div>
  </div>
);

const GraficosPage = ({ data }) => (
  <div>
    <h2 style={{ 
      fontSize: '1.875rem', 
      fontWeight: 'bold', 
      color: '#1f2937',
      marginBottom: '16px'
    }}>
      Análises Avançadas
    </h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <p>Gráficos avançados em desenvolvimento...</p>
    </div>
  </div>
);

const AnaliseCorreidasPage = () => (
  <div>
    <h2 style={{ 
      fontSize: '1.875rem', 
      fontWeight: 'bold', 
      color: '#1f2937',
      marginBottom: '16px'
    }}>
      Análise de Corridas
    </h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <p>Análise detalhada de corridas em desenvolvimento...</p>
    </div>
  </div>
);

const MotoristasPage = () => (
  <div>
    <h2 style={{ 
      fontSize: '1.875rem', 
      fontWeight: 'bold', 
      color: '#1f2937',
      marginBottom: '16px'
    }}>
      Motoristas
    </h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <p>Análise de motoristas em desenvolvimento...</p>
    </div>
  </div>
);

const MetasPage = () => (
  <div>
    <h2 style={{ 
      fontSize: '1.875rem', 
      fontWeight: 'bold', 
      color: '#1f2937',
      marginBottom: '16px'
    }}>
      Metas por Cidade
    </h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <p>Metas por cidade em desenvolvimento...</p>
    </div>
  </div>
);

const TemporalPage = () => (
  <div>
    <h2 style={{ 
      fontSize: '1.875rem', 
      fontWeight: 'bold', 
      color: '#1f2937',
      marginBottom: '16px'
    }}>
      Comparativo Temporal
    </h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <p>Análise temporal em desenvolvimento...</p>
    </div>
  </div>
);

const ConfiguracaoPage = () => (
  <div>
    <h2 style={{ 
      fontSize: '1.875rem', 
      fontWeight: 'bold', 
      color: '#1f2937',
      marginBottom: '16px'
    }}>
      Configurações
    </h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <p>Configurações do sistema em desenvolvimento...</p>
    </div>
  </div>
);

export default App;

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
