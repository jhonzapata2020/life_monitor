"use client"

import { useEffect, useState } from "react"
import {
  Activity,
  AlertCircle,
  Bell,
  Cloud,
  Command,
  Download,
  FileBarChart,
  FileText,
  Globe,
  Leaf,
  RefreshCw,
  Search,
  Settings,
  Trees,
  Waves,
  Shield,
  BarChart3,
  LineChart,
  Check,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DatePicker } from "@/components/ui/date-picker"

// Importación dinámica del componente de mapa
import dynamic from "next/dynamic"

// Importa el componente de efecto de partículas
import ParticleEffect from "@/components/dashboard/particle-effect"

// Importar las vistas de componentes
import DeforestationView from "@/components/dashboard/deforestation-view"
import BiodiversityView from "@/components/dashboard/biodiversity-view"
import CoastalErosionView from "@/components/dashboard/coastal-erosion-view"
import CO2CaptureView from "@/components/dashboard/co2-capture-view"
import RealTimeMonitoringView from "@/components/dashboard/real-time-monitoring-view"
import ReportsView from "@/components/dashboard/reports-view"
import SettingsView from "@/components/dashboard/settings-view"

// Definir el tipo para las alertas de deforestación
type DeforestationAlert = {
  id: string
  location: string
  coordinates: [number, number]
  severity: "high" | "medium" | "low"
  date: string
  area: number
  description: string
}

// Definir el tipo para los datos de biodiversidad
type BiodiversityData = {
  species: string
  count: number
  trend: "increasing" | "stable" | "decreasing"
  status: "endangered" | "vulnerable" | "stable"
  icon: string
}

// Definir el tipo para los datos de erosión costera
type CoastalErosionData = {
  location: string
  rate: number // tasa de erosión en metros por año
  risk: "high" | "medium" | "low"
  affectedArea: number // área afectada en hectáreas
  coordinates: [number, number]
  trend: "increasing" | "stable" | "decreasing"
}

// Definir el tipo para los datos de captura de CO2
type CO2CaptureData = {
  month: string
  value: number // toneladas de CO2
}

// Definir los tipos de vistas disponibles
type ViewType =
  | "dashboard"
  | "deforestation"
  | "map"
  | "biodiversity"
  | "erosion"
  | "co2"
  | "monitoring"
  | "reports"
  | "settings"

export default function DashboardManglares() {
  // Estado para la vista actual
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")

  // Estado para la fecha seleccionada - inicializado con una fecha estática para SSR
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2025-03-17"))

  // Estado para la capa del mapa seleccionada
  const [selectedLayer, setSelectedLayer] = useState<string>("satellite")

  // Estado para los datos de deforestación - inicializado con valores estáticos para SSR
  const [deforestationData, setDeforestationData] = useState<{
    total: number
    monthly: number
    alerts: DeforestationAlert[]
  }>({
    total: 245.8,
    monthly: 12.3,
    alerts: [],
  })

  // Estado para los datos de biodiversidad - inicializado con valores estáticos para SSR
  const [biodiversityData, setBiodiversityData] = useState<{
    speciesCount: number
    endangeredCount: number
    species: BiodiversityData[]
  }>({
    speciesCount: 187,
    endangeredCount: 42,
    species: [],
  })

  // Estado para los datos de erosión costera - inicializado con valores estáticos para SSR
  const [coastalErosionData, setCoastalErosionData] = useState<{
    averageRate: number
    highRiskAreas: number
    data: CoastalErosionData[]
  }>({
    averageRate: 2.3,
    highRiskAreas: 5,
    data: [],
  })

  // Estado para los datos de captura de CO2 - inicializado con valores estáticos para SSR
  const [co2CaptureData, setCo2CaptureData] = useState<{
    total: number
    monthly: number
    data: CO2CaptureData[]
  }>({
    total: 45280,
    monthly: 3750,
    data: [],
  })

  // Estado para el estado del sistema - inicializado con valores estáticos para SSR
  const [systemStatus, setSystemStatus] = useState({
    satellite: 95,
    dataProcessing: 86,
    alerts: 92,
  })

  const [isLoading, setIsLoading] = useState(true)

  // Cargar el componente de mapa de forma dinámica para evitar problemas de SSR
  const MapComponent = dynamic(() => import("@/components/dashboard/map-component"), {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700/50">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-green-500/30 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <div className="mt-4 text-green-500 font-mono text-sm">CARGANDO MAPA</div>
        </div>
      </div>
    ),
  })

  // Simular carga de datos - solo en el cliente
  useEffect(() => {
    // Retrasar la carga para asegurar que la hidratación ya ocurrió
    const timer = setTimeout(() => {
      // Simular datos de deforestación
      setDeforestationData({
        total: 245.8, // hectáreas
        monthly: 12.3, // hectáreas en el último mes
        alerts: [
          {
            id: "DEF-001",
            location: "Norte del Golfo de Urabá",
            coordinates: [8.1, -76.7],
            severity: "high",
            date: "2025-03-12",
            area: 5.2,
            description: "Tala ilegal detectada por cambios en la firma espectral",
          },
          {
            id: "DEF-002",
            location: "Bahía Colombia",
            coordinates: [8.0, -76.8],
            severity: "medium",
            date: "2025-03-10",
            area: 3.1,
            description: "Reducción de cobertura vegetal detectada",
          },
          {
            id: "DEF-003",
            location: "Desembocadura del Río Atrato",
            coordinates: [8.2, -76.9],
            severity: "high",
            date: "2025-03-08",
            area: 7.5,
            description: "Conversión de manglar a zona agrícola",
          },
          {
            id: "DEF-004",
            location: "Punta Caimán",
            coordinates: [8.3, -76.7],
            severity: "low",
            date: "2025-03-05",
            area: 1.8,
            description: "Posible degradación natural",
          },
        ],
      })

      // Simular datos de biodiversidad
      setBiodiversityData({
        speciesCount: 187,
        endangeredCount: 42,
        species: [
          {
            species: "Mangle rojo (Rhizophora mangle)",
            count: 12500,
            trend: "stable",
            status: "stable",
            icon: "🌳",
          },
          {
            species: "Cangrejo azul (Cardisoma guanhumi)",
            count: 8700,
            trend: "decreasing",
            status: "vulnerable",
            icon: "🦀",
          },
          {
            species: "Garza tigre (Tigrisoma fasciatum)",
            count: 350,
            trend: "decreasing",
            status: "endangered",
            icon: "🐦",
          },
          {
            species: "Pez sábalo (Megalops atlanticus)",
            count: 1200,
            trend: "increasing",
            status: "vulnerable",
            icon: "🐟",
          },
          {
            species: "Manatí (Trichechus manatus)",
            count: 78,
            trend: "stable",
            status: "endangered",
            icon: "🐋",
          },
        ],
      })

      // Simular datos de erosión costera
      setCoastalErosionData({
        averageRate: 2.3, // metros por año
        highRiskAreas: 5,
        data: [
          {
            location: "Playa Turbo",
            rate: 3.2,
            risk: "high",
            affectedArea: 12.5,
            coordinates: [8.1, -76.7],
            trend: "increasing",
          },
          {
            location: "Punta Arenas",
            rate: 2.8,
            risk: "high",
            affectedArea: 8.7,
            coordinates: [8.0, -76.8],
            trend: "increasing",
          },
          {
            location: "Bahía Colombia",
            rate: 1.5,
            risk: "medium",
            affectedArea: 5.3,
            coordinates: [8.2, -76.9],
            trend: "stable",
          },
          {
            location: "Boca Tarena",
            rate: 2.1,
            risk: "medium",
            affectedArea: 6.8,
            coordinates: [8.3, -76.7],
            trend: "increasing",
          },
          {
            location: "Necoclí",
            rate: 3.5,
            risk: "high",
            affectedArea: 14.2,
            coordinates: [8.4, -76.8],
            trend: "increasing",
          },
        ],
      })

      // Simular datos de captura de CO2
      setCo2CaptureData({
        total: 45280, // toneladas
        monthly: 3750, // toneladas en el último mes
        data: [
          { month: "Ene", value: 3650 },
          { month: "Feb", value: 3720 },
          { month: "Mar", value: 3750 },
          { month: "Abr", value: 3800 },
          { month: "May", value: 3850 },
          { month: "Jun", value: 3900 },
          { month: "Jul", value: 3820 },
          { month: "Ago", value: 3780 },
          { month: "Sep", value: 3750 },
          { month: "Oct", value: 3720 },
          { month: "Nov", value: 3680 },
          { month: "Dic", value: 3650 },
        ],
      })

      setIsLoading(false)
    }, 1000) // Reducido para la demostración

    return () => clearTimeout(timer)
  }, [])

  // Función para manejar el cambio de capa del mapa
  const handleLayerChange = (layer: string) => {
    setSelectedLayer(layer)
  }

  // Función para manejar el cambio de fecha
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  // Función para manejar el cambio de vista
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
  }

  // Formatear número con separador de miles
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-CO").format(num)
  }

  // Renderizar el contenido principal según la vista seleccionada
  const renderMainContent = () => {
    switch (currentView) {
      case "deforestation":
        return (
          <DeforestationView
            alerts={deforestationData.alerts}
            totalDeforestation={deforestationData.total}
            monthlyDeforestation={deforestationData.monthly}
          />
        )
      case "biodiversity":
        return (
          <BiodiversityView
            speciesCount={biodiversityData.speciesCount}
            endangeredCount={biodiversityData.endangeredCount}
            species={biodiversityData.species}
          />
        )
      case "erosion":
        return (
          <CoastalErosionView
            averageRate={coastalErosionData.averageRate}
            highRiskAreas={coastalErosionData.highRiskAreas}
            data={coastalErosionData.data}
          />
        )
      case "co2":
        return (
          <CO2CaptureView total={co2CaptureData.total} monthly={co2CaptureData.monthly} data={co2CaptureData.data} />
        )
      case "monitoring":
        return <RealTimeMonitoringView />
      case "reports":
        return <ReportsView />
      case "settings":
        return <SettingsView />
      case "dashboard":
      default:
        return (
          <div className="grid gap-6">
            {/* Mapa de visualización */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-slate-700/50 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-green-500" />
                    Monitoreo de Manglares - Golfo de Urabá
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-slate-800/50 text-green-400 border-green-500/50 text-xs">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                      SATELITAL
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  {/* Componente del mapa */}
                  <div className="h-[500px] w-full">
                    <MapComponent
                      selectedDate={selectedDate.toISOString().split("T")[0]}
                      mapLayer={selectedLayer}
                      onLayerChange={handleLayerChange}
                      alerts={deforestationData.alerts}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Área de Manglares"
                value="12,450"
                unit="hectáreas"
                icon={Trees}
                trend="stable"
                color="green"
                detail="Última actualización: 15/03/2025"
              />
              <MetricCard
                title="Deforestación"
                value={formatNumber(deforestationData.total)}
                unit="hectáreas"
                icon={FileBarChart}
                trend="up"
                color="red"
                detail={`${deforestationData.monthly} ha en el último mes`}
              />
              <MetricCard
                title="Especies Monitoreadas"
                value={formatNumber(biodiversityData.speciesCount)}
                unit="especies"
                icon={Leaf}
                trend="stable"
                color="cyan"
                detail={`${biodiversityData.endangeredCount} en peligro`}
              />
              <MetricCard
                title="Captura de CO2"
                value={formatNumber(co2CaptureData.total)}
                unit="ton"
                icon={Cloud}
                trend="up"
                color="blue"
                detail={`${formatNumber(co2CaptureData.monthly)} ton/mes`}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 relative overflow-hidden">
      {/* Fondo de partículas */}
      <ParticleEffect className="absolute inset-0 w-full h-full opacity-20" />

      {/* Overlay de carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-green-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-cyan-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-teal-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-green-500 font-mono text-sm tracking-wider">INICIALIZANDO SISTEMA</div>
            <div className="mt-2 text-slate-400 text-xs">Cargando datos de monitoreo de manglares</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Encabezado */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Trees className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
              MANGLAR MONITOR
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar ubicación..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Alertas de deforestación</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DatePicker
                date={selectedDate}
                onSelect={handleDateChange}
                className="bg-slate-800/50 border-slate-700/50 text-slate-100"
              />

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Usuario" />
                <AvatarFallback className="bg-slate-700 text-green-500">CM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="grid grid-cols-12 gap-6">
          {/* Barra lateral */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem
                    icon={Command}
                    label="Dashboard"
                    active={currentView === "dashboard"}
                    onClick={() => handleViewChange("dashboard")}
                  />
                  <NavItem
                    icon={Globe}
                    label="Mapa de Manglares"
                    active={currentView === "map"}
                    onClick={() => handleViewChange("map")}
                  />
                  <NavItem
                    icon={Trees}
                    label="Deforestación"
                    active={currentView === "deforestation"}
                    onClick={() => handleViewChange("deforestation")}
                  />
                  <NavItem
                    icon={Leaf}
                    label="Biodiversidad"
                    active={currentView === "biodiversity"}
                    onClick={() => handleViewChange("biodiversity")}
                  />
                  <NavItem
                    icon={Waves}
                    label="Erosión Costera"
                    active={currentView === "erosion"}
                    onClick={() => handleViewChange("erosion")}
                  />
                  <NavItem
                    icon={Cloud}
                    label="Captura de CO2"
                    active={currentView === "co2"}
                    onClick={() => handleViewChange("co2")}
                  />
                  <NavItem
                    icon={Activity}
                    label="Monitoreo en Tiempo Real"
                    active={currentView === "monitoring"}
                    onClick={() => handleViewChange("monitoring")}
                  />
                  <NavItem
                    icon={FileText}
                    label="Reportes"
                    active={currentView === "reports"}
                    onClick={() => handleViewChange("reports")}
                  />
                  <NavItem
                    icon={Settings}
                    label="Configuración"
                    active={currentView === "settings"}
                    onClick={() => handleViewChange("settings")}
                  />
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2 font-mono">ESTADO DEL SISTEMA</div>
                  <div className="space-y-3">
                    <StatusItem label="Conexión Satelital" value={systemStatus.satellite} color="green" />
                    <StatusItem label="Procesamiento de Datos" value={systemStatus.dataProcessing} color="cyan" />
                    <StatusItem label="Sistema de Alertas" value={systemStatus.alerts} color="blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard principal */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7">{renderMainContent()}</div>

          {/* Barra lateral derecha */}
          <div className="col-span-12 lg:col-span-3">
            <div className="grid gap-6">
              {/* Resumen del sistema */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1 font-mono">RESUMEN DEL SISTEMA</div>
                      <div className="text-2xl font-mono text-green-400 mb-1">Golfo de Urabá</div>
                      <div className="text-sm text-slate-400">Monitoreo de Manglares</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Última Actualización</div>
                        <div className="text-sm font-mono text-slate-200">15/03/2025</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Próxima Captura</div>
                        <div className="text-sm font-mono text-slate-200">17/03/2025</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alertas recientes */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 flex items-center text-base">
                    <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                    Alertas Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AlertItem
                      title="Deforestación Detectada"
                      time="14:32:12"
                      description="5.2 ha en Norte del Golfo de Urabá"
                      type="error"
                    />
                    <AlertItem
                      title="Erosión Acelerada"
                      time="13:45:06"
                      description="Incremento de erosión en Playa Turbo"
                      type="warning"
                    />
                    <AlertItem
                      title="Avistamiento de Especies"
                      time="09:12:45"
                      description="Grupo de manatíes detectado en Bahía Colombia"
                      type="info"
                    />
                    <AlertItem
                      title="Reforestación Completada"
                      time="04:30:00"
                      description="2.5 ha reforestadas en Punta Caimán"
                      type="success"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Acciones rápidas */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton icon={Download} label="Descargar Datos" />
                    <ActionButton icon={RefreshCw} label="Sincronizar" />
                    <ActionButton icon={Globe} label="Buscar Zonas" />
                    <ActionButton icon={Activity} label="Ver Alertas" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para elementos de navegación
function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${active ? "bg-slate-800/70 text-green-400" : "text-slate-400 hover:text-slate-100"}`}
      onClick={onClick}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

// Componente para elementos de estado
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "green":
        return "from-green-500 to-teal-500"
      case "cyan":
        return "from-cyan-500 to-blue-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "red":
        return "from-red-500 to-pink-500"
      default:
        return "from-green-500 to-teal-500"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-xs text-slate-400">{value}%</div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

// Componente para tarjetas de métricas
function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color,
  detail,
}: {
  title: string
  value: string
  unit: string
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: string
  detail: string
}) {
  const getColor = () => {
    switch (color) {
      case "green":
        return "from-green-500 to-teal-500 border-green-500/30"
      case "cyan":
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30"
      case "red":
        return "from-red-500 to-pink-500 border-red-500/30"
      default:
        return "from-green-500 to-teal-500 border-green-500/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className={`h-4 w-4 ${color === "red" ? "text-red-500" : "text-green-500"}`} />
      case "down":
        return <BarChart3 className={`h-4 w-4 rotate-180 ${color === "red" ? "text-green-500" : "text-red-500"}`} />
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className={`h-5 w-5 text-${color === "red" ? "red" : color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {value} <span className="text-sm">{unit}</span>
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-green-500 to-teal-500"></div>
    </div>
  )
}

// Componente para elementos de alerta
function AlertItem({
  title,
  time,
  description,
  type,
}: {
  title: string
  time: string
  description: string
  type: "info" | "warning" | "error" | "success" | "update"
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "info":
        return { icon: AlertCircle, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
      case "warning":
        return { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" }
      case "error":
        return { icon: AlertCircle, color: "text-red-500 bg-red-500/10 border-red-500/30" }
      case "success":
        return { icon: CheckIcon, color: "text-green-500 bg-green-500/10 border-green-500/30" }
      case "update":
        return { icon: Download, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30" }
      default:
        return { icon: AlertCircle, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
    }
  }

  const { icon: Icon, color } = getTypeStyles()

  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
        <Icon className={`h-3 w-3 ${color.split(" ")[0]}`} />
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-slate-200">{title}</div>
          <div className="ml-2 text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
    </div>
  )
}

// Action button component
function ActionButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <Button
      variant="outline"
      className="h-auto py-3 px-3 border-slate-700 bg-slate-700/50 hover:bg-slate-500 flex flex-col items-center justify-center space-y-1 w-full"
    >
      <Icon className="h-5 w-5 text-green-500" />
      <span className="text-xs">{label}</span>
    </Button>
  )
}

// Add missing imports


function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Check {...props} />;
}

