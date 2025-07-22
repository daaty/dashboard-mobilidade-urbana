import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MetricsOverview({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Erro ao carregar dados</p>
      </div>
    )
  }

  const metrics = [
    {
      title: 'Total de Corridas',
      value: data.metricas_principais?.total_corridas || 0,
      icon: TrendingUp,
      color: 'blue',
      trend: `${data.comparacao_anterior?.variacao_corridas > 0 ? '+' : ''}${data.comparacao_anterior?.variacao_corridas || 0}%`,
      trendUp: (data.comparacao_anterior?.variacao_corridas || 0) >= 0
    },
    {
      title: 'Corridas Concluídas',
      value: data.metricas_principais?.corridas_concluidas || 0,
      percentage: data.metricas_principais?.taxa_conversao || 0,
      icon: CheckCircle,
      color: 'green',
      trend: `${data.metricas_principais?.taxa_conversao || 0}%`,
      trendUp: true
    },
    {
      title: 'Corridas Canceladas',
      value: data.metricas_principais?.corridas_canceladas || 0,
      percentage: data.metricas_principais?.corridas_canceladas ? 
        ((data.metricas_principais.corridas_canceladas / data.metricas_principais.total_corridas) * 100).toFixed(1) : 0,
      icon: XCircle,
      color: 'red',
      trend: 'Reduzir',
      trendUp: false
    },
    {
      title: 'Receita Total',
      value: `R$ ${(data.metricas_principais?.receita_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'green',
      trend: `${data.comparacao_anterior?.variacao_receita > 0 ? '+' : ''}${data.comparacao_anterior?.variacao_receita || 0}%`,
      trendUp: (data.comparacao_anterior?.variacao_receita || 0) >= 0
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      green: 'text-green-600 bg-green-100 dark:bg-green-900/20',
      red: 'text-red-600 bg-red-100 dark:bg-red-900/20',
      yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const colorClasses = getColorClasses(metric.color)

          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${colorClasses}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value.toLocaleString()}
                    </span>
                    {metric.percentage && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({metric.percentage}%)
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-2 space-x-1">
                    {metric.trendUp ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      metric.trendUp ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      vs. mês anterior
                    </span>
                  </div>

                  {/* Progress bar for percentages */}
                  {metric.percentage && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.percentage}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                          className={`h-1.5 rounded-full ${
                            metric.color === 'green' ? 'bg-green-500' :
                            metric.color === 'red' ? 'bg-red-500' :
                            metric.color === 'yellow' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Decorative gradient */}
                <div className={`absolute top-0 right-0 w-20 h-20 opacity-10 ${
                  metric.color === 'green' ? 'bg-green-500' :
                  metric.color === 'red' ? 'bg-red-500' :
                  metric.color === 'yellow' ? 'bg-yellow-500' :
                  'bg-blue-500'
                } rounded-full -translate-y-10 translate-x-10`} />
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Stats */}
      {/* Resumo Rápido e KPIs Adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Resumo de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {data.metricas_principais?.taxa_conversao || 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Taxa de Conversão
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  R$ {(data.metricas_principais?.receita_media_corrida || 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Receita Média/Corrida
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {data.metricas_principais?.motoristas_ativos || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Motoristas Ativos
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {data.metricas_principais?.avaliacao_media || 0}/5
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Avaliação Média
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

