import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Target, 
  PieChart, 
  TrendingUp, 
  Settings,
  Menu,
  X,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Sidebar({ activeTab, setActiveTab, isOpen, onToggle }) {
  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: Home },
    { id: 'metas', label: 'Metas por Cidade', icon: Target },
    { id: 'analises', label: 'Análise de Corridas', icon: PieChart },
    { id: 'comparativo', label: 'Comparativo Temporal', icon: TrendingUp },
    { id: 'configuracao', label: 'Configurações', icon: Settings }
  ]

  return (
    <div className={`bg-white dark:bg-gray-800 h-screen shadow-xl border-r border-gray-200 dark:border-gray-700 ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Transporte</p>
              </div>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start p-3 h-auto transition-all duration-200 ${
                  isActive 
                    ? 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${!isOpen ? 'px-3' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className={`w-5 h-5 ${isOpen ? 'mr-3' : ''}`} />
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Button>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              Dashboard v1.0
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
              Empresa de Transporte
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

