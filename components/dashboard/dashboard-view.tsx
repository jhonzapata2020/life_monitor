"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Clock,
  Cloud,
  Download,
  FileBarChart,
  FileText,
  Globe,
  Leaf,
  LineChartIcon,
  Maximize2,
  PieChartIcon,
  Shield,
  ThumbsUp,
  Trees,
  Waves,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Datos simulados para los gráficos
const deforestationData = [
  { month: "Ene", area: 8.2 },
  { month: "Feb", area: 7.5 },
  { month: "Mar", area: 12.3 },
  { month: "Abr", area: 9.8 },
  { month: "May", area: 11.2 },
  { month: "Jun", area: 10.5 },
  { month: "Jul", area: 9.3 },
  { month: "Ago", area: 8.7 },
  { month: "Sep", area: 10.1 },
  { month: "Oct", area: 11.8 },
  { month: "Nov", area: 13.2 },
  { month: "Dic", area: 12.7 },
]

const biodiversityData = [
  { name: "Mangle Rojo", value: 35 },
  { name: "Mangle Negro", value: 25 },
  { name: "Mangle Blanco", value: 20 },
  { name: "Mangle Botoncillo", value: 15 },
  { name: "Otras Especies", value: 5 },
]

const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#8884D8"]

const erosionData = [
  { year: "2020", rate: 1.2 },
  { year: "2021", rate: 1.5 },
  { year: "2022", rate: 1.8 },
  { year: "2023", rate: 2.1 },
  { year: "2024", rate: 2.3 },
  { year: "2025", rate: 2.5 },
]

const co2CaptureData = [
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
]

const areaData = [
  { year: "2020", mangrove: 12850, reforested: 120 },
  { year: "2021", mangrove: 12780, reforested: 180 },
  { year: "2022", mangrove: 12650, reforested: 250 },
  { year: "2023", mangrove: 12520, reforested: 320 },
  { year: "2024", mangrove: 12450, reforested: 380 },
  { year: "2025", mangrove: 12450, reforested: 450 },
]

const healthIndexData = [
  { name: "Norte", value: 78 },
  { name: "Centro", value: 65 },
  { name: "Sur", value: 82 },
  { name: "Este", value: 71 },
  { name: "Oeste", value: 59 },
]

const recentActivities = [
  {
    id: 1,
    type: "alert",
    title: "Alerta de Deforestación",
    description: "5.2 ha en Norte del Golfo de Urabá",
    time: "14:32:12",
    date: "15/03/2025",
    status: "high",
  },
  {
    id: 2,
    type: "monitoring",
    title: "Captura Satelital Completada",
    description: "Procesamiento de imágenes en curso",
    time: "12:15:00",
    date: "15/03/2025",
    status: "info",
  },
  {
    id: 3,
    type: "restoration",
    title: "Proyecto de Reforestación",
    description: "2.5 ha reforestadas en Punta Caimán",
    time: "09:45:30",
    date: "15/03/2025",
    status: "success",
  },
  {
    id: 4,
    type: "biodiversity",
    title: "Avistamiento de Especies",
    description: "Grupo de manatíes detectado en Bahía Colombia",
    time: "08:12:45",
    date: "15/03/2025",
    status: "info",
  },
  {
    id: 5,
    type: "erosion",
    title: "Erosión Acelerada",
    description: "Incremento de erosión en Playa Turbo",
    time: "07:45:06",
    date: "15/03/2025",
    status: "warning",
  },
]

const keyLocations = [
  {
    name: "Bahía Colombia",
    area: 3250,
    health: 78,
    risk: "low",
    species: 45,
  },
  {
    name: "Norte del Golfo",
    area: 2850,
    health: 65,
    risk: "high",
    species: 38,
  },
  {
    name: "Desembocadura del Río Atrato",
    area: 4120,
    health: 82,
    risk: "medium",
    species: 52,
  },
  {
    name: "Punta Caimán",
    area: 1850,
    health: 71,
    risk: "medium",
    species: 32,
  },
  {
    name: "Necoclí",
    area: 1380,
    health: 59,
    risk: "high",
    species: 29,
  },
]

export default function DashboardView() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [healthIndex, setHealthIndex] = useState(74)
  const [deforestationRate, setDeforestationRate] = useState(12.3)
  const [totalArea, setTotalArea] = useState(12450)
  const [speciesCount, setSpeciesCount] = useState(187)
  const [co2Capture, setCo2Capture] = useState(45280)
  const [alertsCount, setAlertsCount] = useState(8)
  const [projectsCount, setProjectsCount] = useState(5)

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Formatear número con separador de miles
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-CO").format(num)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-green-500/30 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <div className="mt-4 text-green-500 font-mono text-sm">CARGANDO DASHBOARD</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Encabezado del Dashboard */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-100 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-teal-500" />
              Dashboard de Monitoreo de Manglares - Golfo de Urabá
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-slate-800/50 text-teal-400 border-teal-500/50 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-teal-500 mr-1 animate-pulse"></div>
                ACTUALIZADO
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800/50 p-1 mb-6">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-400"
              >
                Resumen General
              </TabsTrigger>
              <TabsTrigger
                value="statistics"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-400"
              >
                Estadísticas
              </TabsTrigger>
              <TabsTrigger
                value="locations"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-400"
              >
                Ubicaciones Clave
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-400"
              >
                Actividades Recientes
              </TabsTrigger>
            </TabsList>

            {/* Pestaña de Resumen General */}
            <TabsContent value="overview" className="mt-0 space-y-6">
              {/* Indicadores principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Índice de Salud"
                  value={healthIndex}
                  unit="%"
                  icon={Shield}
                  trend="stable"
                  color="green"
                  detail="Calidad ecosistémica"
                />
                <MetricCard
                  title="Área de Manglares"
                  value={formatNumber(totalArea)}
                  unit="ha"
                  icon={Trees}
                  trend="stable"
                  color="blue"
                  detail="450 ha reforestadas"
                />
                <MetricCard
                  title="Deforestación Mensual"
                  value={deforestationRate.toString()}
                  unit="ha"
                  icon={FileBarChart}
                  trend="up"
                  color="red"
                  detail="↑ 2.1% vs mes anterior"
                />
                <MetricCard
                  title="Especies Monitoreadas"
                  value={formatNumber(speciesCount)}
                  unit=""
                  icon={Leaf}
                  trend="up"
                  color="cyan"
                  detail="42 en peligro"
                />
              </div>

              {/* Gráficos principales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de área de manglares */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-slate-200">Evolución del Área de Manglares</CardTitle>
                      <Badge variant="outline" className="bg-slate-800/50 text-blue-400 border-blue-500/50 text-xs">
                        2020-2025
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-400">Hectáreas totales y reforestadas</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={areaData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="year" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                            itemStyle={{ color: "#f8fafc" }}
                            formatter={(value) => [`${value} ha`, ""]}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="mangrove"
                            stackId="1"
                            stroke="#0ea5e9"
                            fill="#0ea5e9"
                            name="Área Total"
                          />
                          <Area
                            type="monotone"
                            dataKey="reforested"
                            stackId="2"
                            stroke="#10b981"
                            fill="#10b981"
                            name="Área Reforestada"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Gráfico de deforestación */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-slate-200">Deforestación Mensual</CardTitle>
                      <Badge variant="outline" className="bg-slate-800/50 text-red-400 border-red-500/50 text-xs">
                        2025
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-400">Hectáreas deforestadas por mes</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={deforestationData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                            itemStyle={{ color: "#f8fafc" }}
                            formatter={(value) => [`${value} ha`, ""]}
                          />
                          <Bar dataKey="area" name="Área Deforestada" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tarjetas de información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200 flex items-center">
                      <Cloud className="mr-2 h-4 w-4 text-blue-500" />
                      Captura de CO2
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400 mb-1">{formatNumber(co2Capture)} ton</div>
                    <div className="text-sm text-slate-400">Captura total estimada</div>
                    <div className="mt-4 text-xs text-slate-500">
                      <div className="flex items-center">
                        <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                        <span>3,750 ton/mes en promedio</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200 flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                      Alertas Activas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400 mb-1">{alertsCount}</div>
                    <div className="text-sm text-slate-400">Alertas de deforestación y erosión</div>
                    <div className="mt-4 text-xs text-slate-500">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-slate-400 mr-1" />
                        <span>Última alerta: hace 2 horas</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200 flex items-center">
                      <ThumbsUp className="mr-2 h-4 w-4 text-green-500" />
                      Proyectos Activos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400 mb-1">{projectsCount}</div>
                    <div className="text-sm text-slate-400">Proyectos de conservación y restauración</div>
                    <div className="mt-4 text-xs text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 text-slate-400 mr-1" />
                        <span>Próxima actualización: 17/03/2025</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pestaña de Estadísticas */}
            <TabsContent value="statistics" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de composición de especies */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-slate-200">Composición de Especies</CardTitle>
                      <PieChartIcon className="h-4 w-4 text-teal-500" />
                    </div>
                    <CardDescription className="text-slate-400">Distribución de especies de manglar</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={biodiversityData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {biodiversityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                            itemStyle={{ color: "#f8fafc" }}
                            formatter={(value) => [`${value}%`, ""]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Gráfico de erosión costera */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-slate-200">Erosión Costera</CardTitle>
                      <LineChartIcon className="h-4 w-4 text-amber-500" />
                    </div>
                    <CardDescription className="text-slate-400">Tasa de erosión anual (m/año)</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={erosionData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="year" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                            itemStyle={{ color: "#f8fafc" }}
                            formatter={(value) => [`${value} m/año`, ""]}
                          />
                          <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="#f59e0b"
                            activeDot={{ r: 8 }}
                            name="Tasa de Erosión"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de captura de CO2 */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-slate-200">Captura de CO2</CardTitle>
                      <Badge variant="outline" className="bg-slate-800/50 text-blue-400 border-blue-500/50 text-xs">
                        2025
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-400">Toneladas de CO2 capturadas por mes</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={co2CaptureData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                            itemStyle={{ color: "#f8fafc" }}
                            formatter={(value) => [`${value} ton`, ""]}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                            name="CO2 Capturado"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Índice de salud por zona */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-slate-200">Índice de Salud por Zona</CardTitle>
                      <Badge variant="outline" className="bg-slate-800/50 text-green-400 border-green-500/50 text-xs">
                        2025
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-400">Calidad ecosistémica por región</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {healthIndexData.map((item) => (
                        <div key={item.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-300">{item.name}</span>
                            <span className="text-sm font-medium text-slate-300">{item.value}%</span>
                          </div>
                          <Progress value={item.value} max={100} className="h-2 bg-slate-700">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${item.value}%`,
                                background:
                                  item.value >= 80
                                    ? "linear-gradient(90deg, #10b981, #34d399)"
                                    : item.value >= 70
                                      ? "linear-gradient(90deg, #0ea5e9, #38bdf8)"
                                      : item.value >= 60
                                        ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                                        : "linear-gradient(90deg, #ef4444, #f87171)",
                              }}
                            />
                          </Progress>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pestaña de Ubicaciones Clave */}
            <TabsContent value="locations" className="mt-0">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-slate-200">Ubicaciones Clave de Monitoreo</CardTitle>
                    <Badge variant="outline" className="bg-slate-800/50 text-teal-400 border-teal-500/50 text-xs">
                      5 Zonas
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400">
                    Datos de las principales zonas de manglares
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700/50">
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Ubicación</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Área (ha)</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Índice de Salud</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Especies</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-slate-300">Nivel de Riesgo</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-300">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keyLocations.map((location, index) => (
                          <tr
                            key={location.name}
                            className={index !== keyLocations.length - 1 ? "border-b border-slate-700/30" : ""}
                          >
                            <td className="py-3 px-4 text-sm text-slate-300">{location.name}</td>
                            <td className="py-3 px-4 text-sm text-slate-300 text-center">
                              {formatNumber(location.area)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center">
                                <div
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    location.health >= 80
                                      ? "bg-green-500/20 text-green-400"
                                      : location.health >= 70
                                        ? "bg-blue-500/20 text-blue-400"
                                        : location.health >= 60
                                          ? "bg-amber-500/20 text-amber-400"
                                          : "bg-red-500/20 text-red-400"
                                  }`}
                                >
                                  {location.health}%
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-300 text-center">{location.species}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center">
                                <div
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    location.risk === "low"
                                      ? "bg-green-500/20 text-green-400"
                                      : location.risk === "medium"
                                        ? "bg-amber-500/20 text-amber-400"
                                        : "bg-red-500/20 text-red-400"
                                  }`}
                                >
                                  {location.risk === "low" ? "Bajo" : location.risk === "medium" ? "Medio" : "Alto"}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400">
                                <Globe className="h-4 w-4 mr-1" />
                                <span>Ver</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-700/50 pt-4">
                  <Button variant="outline" className="bg-slate-800/70 border-slate-700/50 text-slate-300 ml-auto">
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Reporte Completo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Pestaña de Actividades Recientes */}
            <TabsContent value="activities" className="mt-0">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-slate-200">Actividades Recientes</CardTitle>
                    <Badge variant="outline" className="bg-slate-800/50 text-blue-400 border-blue-500/50 text-xs">
                      Últimas 24 horas
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400">
                    Alertas, monitoreo y actividades del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"
                      >
                        <div
                          className={`mt-0.5 p-2 rounded-full ${
                            activity.status === "high" || activity.status === "warning"
                              ? "bg-amber-500/20 text-amber-400"
                              : activity.status === "success"
                                ? "bg-green-500/20 text-green-400"
                                : activity.status === "info"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {activity.type === "alert" && <AlertTriangle className="h-5 w-5" />}
                          {activity.type === "monitoring" && <Globe className="h-5 w-5" />}
                          {activity.type === "restoration" && <Trees className="h-5 w-5" />}
                          {activity.type === "biodiversity" && <Leaf className="h-5 w-5" />}
                          {activity.type === "erosion" && <Waves className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-slate-200">{activity.title}</h4>
                            <div className="flex items-center text-xs text-slate-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{activity.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-slate-500">{activity.date}</div>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-slate-400">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              <span>Detalles</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-700/50 pt-4 flex justify-between">
                  <Button variant="ghost" className="text-slate-400">
                    Ver Historial Completo
                  </Button>
                  <Button variant="outline" className="bg-slate-800/70 border-slate-700/50 text-slate-300">
                    Exportar Actividades
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
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
  value: string | number
  unit: string
  icon: React.ElementType
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
        return <LineChartIcon className="h-4 w-4 text-blue-500" />
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

