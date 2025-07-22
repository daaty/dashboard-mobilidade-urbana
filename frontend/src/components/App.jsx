import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { MetricsOverview } from './components/MetricsOverview'
import { MetasCidades } from './components/MetasCidades'
import { AnaliseCorreidas } from './components/AnaliseCorreidas'
import { ComparativoTemporal } from './components/ComparativoTemporal'
import { ConfiguracaoSheets } from './components/ConfiguracaoSheets'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [metricsData, setMetricsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetricsData()
  }, [])

  const fetchMetricsData = async () => {
    try {
      setLoading(true)
      // Usar a nova API do backend que criamos
      const response = await fetch('http://localhost:5000/api/dashboard/overview')
      const data = await response.json()
      
      if (data.success) {
        setMetricsData(data.data)
      } else {
        console.error('Erro na API:', data.error)
      }
    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    }

    switch (activeTab) {
      case 'overview':
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible">
            <MetricsOverview data={metricsData} loading={loading} />
          </motion.div>
        )
      case 'metas':
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible">
            <MetasCidades />
          </motion.div>
        )
      case 'analises':
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible">
            <AnaliseCorreidas />
          </motion.div>
        )
      case 'comparativo':
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible">
            <ComparativoTemporal />
          </motion.div>
        )
      case 'configuracao':
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible">
            <ConfiguracaoSheets />
          </motion.div>
        )
      default:
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible">
            <MetricsOverview data={metricsData} loading={loading} />
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -250 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed left-0 top-0 h-full z-30"
        >
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        </motion.div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          {/* Header */}
          <Header 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onRefresh={fetchMetricsData}
          />

          {/* Content */}
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App

