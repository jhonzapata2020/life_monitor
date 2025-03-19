"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, BarChart3, Download, Waves, RefreshCw, Map } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Definir el tipo para los datos de erosión costera
type CoastalErosionData = {
  location: string
  rate: number // tasa de erosión en metros por año
  risk: "high" | "medium" | "low"
  affectedArea: number // área afectada en hectáreas
  coordinates: [number, number]
  trend: "increasing" | "stable" | "decreasing"
}

interface CoastalErosionViewProps {
  averageRate: number
  highRiskAreas: number
  data: CoastalErosionData[]
}

export default function CoastalErosionView({
  averageRate = 2.3,
  highRiskAreas = 5,
  data = [],
}: CoastalErosionViewProps) {
  const [activeTab, setActiveTab] = useState("areas")
  const [filterRisk, setFilterRisk] = useState<string>("all")

  // Formatear número con separador de miles
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-CO").format(num)
  }

  // Filtrar áreas por nivel de riesgo
  const filteredAreas =
    data.length > 0
      ? filterRisk === "all"
        ? data
        : data.filter((area) => area.risk === filterRisk)
      : defaultErosionData.filter((area) => filterRisk === "all" || area.risk === filterRisk)

  // Calcular el área total afectada
  const totalAffectedArea = filteredAreas.reduce((sum, area) => sum + area.affectedArea, 0)

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-100 flex items-center">
              <Waves className="mr-2 h-5 w-5 text-blue-500" />
              Erosión Costera - Golfo de Urabá
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                MONITOREO ACTIVO
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Tasa de Erosión Promedio"
              value={averageRate.toString()}
              unit="m/año"
              icon={Waves}
              trend="up"
              color="blue"
              detail="En áreas de manglar monitoreadas"
            />
            <MetricCard
              title="Áreas de Alto Riesgo"
              value={highRiskAreas.toString()}
              unit="zonas"
              icon={AlertCircle}
              trend="up"
              color="red"
              detail="Requieren intervención urgente"
            />
            <MetricCard
              title="Área Total Afectada"
              value={formatNumber(totalAffectedArea)}
              unit="hectáreas"
              icon={Map}
              trend="up"
              color="amber"
              detail="Impacto en ecosistema de manglar"
            />
          </div>

          <Tabs defaultValue="areas" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-slate-800/50 p-1">
                <TabsTrigger
                  value="areas"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-blue-400"
                >
                  Áreas Afectadas
                </TabsTrigger>
                <TabsTrigger
                  value="tendencias"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-blue-400"
                >
                  Tendencias
                </TabsTrigger>
                <TabsTrigger
                  value="mitigacion"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-blue-400"
                >
                  Mitigación
                </TabsTrigger>
              </TabsList>

              <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700/50 text-slate-300">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
            </div>

            <TabsContent value="areas" className="mt-0">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  Mostrando {filteredAreas.length} áreas con {formatNumber(totalAffectedArea)} hectáreas afectadas
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-slate-400 mr-2">Filtrar por riesgo:</span>
                  <Select value={filterRisk} onValueChange={setFilterRisk}>
                    <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700/50 text-slate-100">
                      <SelectValue placeholder="Todos los niveles" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                      <SelectItem value="all">Todos los niveles</SelectItem>
                      <SelectItem value="high">Alto riesgo</SelectItem>
                      <SelectItem value="medium">Riesgo medio</SelectItem>
                      <SelectItem value="low">Riesgo bajo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                  <div className="col-span-3">Ubicación</div>
                  <div className="col-span-2">Tasa de Erosión</div>
                  <div className="col-span-2">Área Afectada</div>
                  <div className="col-span-2">Nivel de Riesgo</div>
                  <div className="col-span-3">Tendencia</div>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {filteredAreas.length > 0 ? (
                    filteredAreas.map((area, index) => (
                      <ErosionAreaRow
                        key={index}
                        location={area.location}
                        rate={area.rate}
                        affectedArea={area.affectedArea}
                        risk={area.risk}
                        trend={area.trend}
                      />
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400">
                      No se encontraron áreas que coincidan con el filtro seleccionado.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tendencias" className="mt-0">
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                <h3 className="text-sm font-medium text-slate-200 mb-4">Tendencias de Erosión Costera (2020-2025)</h3>
                <div className="h-64 w-full relative">
                  <ErosionTrendChart />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <StatCard title="Tasa de Erosión 2020" value="1.8" unit="m/año" trend="stable" />
                  <StatCard title="Tasa de Erosión 2025" value="2.3" unit="m/año" trend="increasing" />
                  <StatCard title="Incremento" value="27.8" unit="%" trend="critical" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mitigacion" className="mt-0">
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                <h3 className="text-sm font-medium text-slate-200 mb-4">Estrategias de Mitigación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MitigationCard
                    title="Restauración de Manglares"
                    status="En progreso"
                    statusColor="blue"
                    progress={65}
                    description="Reforestación de manglares para estabilizar la línea costera y reducir la erosión."
                    targetAreas={["Playa Turbo", "Necoclí"]}
                    impact="Alto"
                  />
                  <MitigationCard
                    title="Barreras Naturales"
                    status="Planificado"
                    statusColor="amber"
                    progress={30}
                    description="Instalación de arrecifes artificiales y barreras naturales para reducir el impacto del oleaje."
                    targetAreas={["Punta Arenas", "Bahía Colombia"]}
                    impact="Medio"
                  />
                  <MitigationCard
                    title="Monitoreo Continuo"
                    status="Activo"
                    statusColor="green"
                    progress={100}
                    description="Sistema de monitoreo satelital y sensores in-situ para detectar cambios en la línea costera."
                    targetAreas={["Todas las áreas"]}
                    impact="Bajo"
                  />
                  <MitigationCard
                    title="Educación Comunitaria"
                    status="En progreso"
                    statusColor="blue"
                    progress={50}
                    description="Programas de concientización y capacitación para comunidades locales sobre la importancia de los manglares."
                    targetAreas={["Comunidades costeras"]}
                    impact="Medio"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Datos de erosión costera por defecto
const defaultErosionData: CoastalErosionData[] = [
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
  {
    location: "Desembocadura Río Atrato",
    rate: 1.8,
    risk: "medium",
    affectedArea: 7.5,
    coordinates: [8.2, -76.8],
    trend: "stable",
  },
  {
    location: "Punta Caimán",
    rate: 0.9,
    risk: "low",
    affectedArea: 3.2,
    coordinates: [8.1, -76.9],
    trend: "decreasing",
  },
  {
    location: "Isla de los Muertos",
    rate: 0.7,
    risk: "low",
    affectedArea: 2.8,
    coordinates: [8.0, -76.7],
    trend: "stable",
  },
]

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
      case "amber":
        return "from-amber-500 to-orange-500 border-amber-500/30"
      default:
        return "from-blue-500 to-indigo-500 border-blue-500/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return (
          <BarChart3
            className={`h-4 w-4 ${color === "red" || color === "amber" ? "text-red-500" : "text-green-500"}`}
          />
        )
      case "down":
        return <BarChart3 className={`h-4 w-4 rotate-180 ${color === "red" ? "text-green-500" : "text-red-500"}`} />
      case "stable":
        return <BarChart3 className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className="h-5 w-5 text-slate-300" />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {value} <span className="text-sm">{unit}</span>
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-blue-500 to-indigo-500"></div>
    </div>
  )
}

// Componente para filas de áreas de erosión
function ErosionAreaRow({
  location,
  rate,
  affectedArea,
  risk,
  trend,
}: {
  location: string
  rate: number
  affectedArea: number
  risk: "high" | "medium" | "low"
  trend: "increasing" | "stable" | "decreasing"
}) {
  const getRiskBadge = () => {
    switch (risk) {
      case "high":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Alto</Badge>
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Medio</Badge>
      case "low":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Bajo</Badge>
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Desconocido</Badge>
    }
  }

  const getTrendBadge = () => {
    switch (trend) {
      case "increasing":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">En aumento</Badge>
      case "stable":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Estable</Badge>
      case "decreasing":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">En disminución</Badge>
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Desconocido</Badge>
    }
  }

  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-3 text-slate-300">{location}</div>
      <div className="col-span-2 text-cyan-400">{rate} m/año</div>
      <div className="col-span-2 text-slate-300">{affectedArea} ha</div>
      <div className="col-span-2">{getRiskBadge()}</div>
      <div className="col-span-3">{getTrendBadge()}</div>
    </div>
  )
}

// Componente para el gráfico de tendencia de erosión (simulado)
function ErosionTrendChart() {
  return (
    <div className="h-full w-full bg-slate-800/20 rounded-md border border-slate-700/50 p-4 flex items-center justify-center">
      <div className="w-full h-full relative">
        {/* Eje Y */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 text-xs text-slate-500">
          <div>4.0</div>
          <div>3.0</div>
          <div>2.0</div>
          <div>1.0</div>
          <div>0.0</div>
        </div>

        {/* Líneas de referencia horizontales */}
        <div className="absolute left-8 right-0 top-0 h-full">
          <div className="relative h-full">
            <div className="absolute top-0 w-full border-t border-dashed border-slate-700/30"></div>
            <div className="absolute top-1/4 w-full border-t border-dashed border-slate-700/30"></div>
            <div className="absolute top-2/4 w-full border-t border-dashed border-slate-700/30"></div>
            <div className="absolute top-3/4 w-full border-t border-dashed border-slate-700/30"></div>
            <div className="absolute bottom-0 w-full border-t border-dashed border-slate-700/30"></div>
          </div>
        </div>

        {/* Gráfico de líneas (simulado) */}
        <div className="absolute left-8 right-0 bottom-8 top-4">
          {/* Línea de tendencia general */}
          <svg className="w-full h-full">
            <path
              d="M 0,120 C 50,110 100,100 150,90 C 200,80 250,70 300,50 C 350,30 400,20 450,10"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Puntos de datos */}
          <div className="absolute left-0 bottom-[70%] h-3 w-3 rounded-full bg-blue-500 shadow-glow-blue"></div>
          <div className="absolute left-[20%] bottom-[65%] h-3 w-3 rounded-full bg-blue-500 shadow-glow-blue"></div>
          <div className="absolute left-[40%] bottom-[55%] h-3 w-3 rounded-full bg-blue-500 shadow-glow-blue"></div>
          <div className="absolute left-[60%] bottom-[40%] h-3 w-3 rounded-full bg-blue-500 shadow-glow-blue"></div>
          <div className="absolute left-[80%] bottom-[25%] h-3 w-3 rounded-full bg-blue-500 shadow-glow-blue"></div>
          <div className="absolute left-[95%] bottom-[15%] h-3 w-3 rounded-full bg-blue-500 shadow-glow-blue"></div>
        </div>

        {/* Eje X */}
        <div className="absolute left-8 right-0 bottom-0 flex justify-between text-xs text-slate-500">
          <div>2020</div>
          <div>2021</div>
          <div>2022</div>
          <div>2023</div>
          <div>2024</div>
          <div>2025</div>
        </div>

        {/* Leyenda */}
        <div className="absolute right-4 top-4 bg-slate-800/70 p-2 rounded-md text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 mr-2 rounded-sm"></div>
            <span className="text-slate-300">Tasa de erosión promedio (m/año)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para tarjetas de estadísticas
function StatCard({
  title,
  value,
  unit,
  trend,
}: {
  title: string
  value: string
  unit: string
  trend: "increasing" | "decreasing" | "stable" | "critical" | "warning"
}) {
  const getTrendColor = () => {
    switch (trend) {
      case "increasing":
        return "text-red-500"
      case "decreasing":
        return "text-green-500"
      case "stable":
        return "text-blue-500"
      case "critical":
        return "text-red-500"
      case "warning":
        return "text-amber-500"
      default:
        return "text-slate-500"
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
      <div className="text-xs text-slate-500 mb-1">{title}</div>
      <div className="text-lg font-medium text-slate-200">
        {value} <span className="text-sm text-slate-400">{unit}</span>
      </div>
      <div className={`text-xs mt-1 ${getTrendColor()}`}>
        {trend === "increasing" && "↑ En aumento"}
        {trend === "decreasing" && "↓ En disminución"}
        {trend === "stable" && "→ Estable"}
        {trend === "critical" && "⚠ Punto crítico"}
        {trend === "warning" && "⚠ Atención requerida"}
      </div>
    </div>
  )
}

// Componente para tarjetas de mitigación
function MitigationCard({
  title,
  status,
  statusColor,
  progress,
  description,
  targetAreas,
  impact,
}: {
  title: string
  status: string
  statusColor: string
  progress: number
  description: string
  targetAreas: string[]
  impact: string
}) {
  const getStatusColor = () => {
    switch (statusColor) {
      case "green":
        return "text-green-500"
      case "amber":
        return "text-amber-500"
      case "blue":
        return "text-blue-500"
      default:
        return "text-slate-400"
    }
  }

  const getProgressColor = () => {
    switch (statusColor) {
      case "green":
        return "bg-green-500"
      case "amber":
        return "bg-amber-500"
      case "blue":
        return "bg-blue-500"
      default:
        return "bg-slate-500"
    }
  }

  const getImpactColor = () => {
    switch (impact) {
      case "Alto":
        return "text-green-500"
      case "Medio":
        return "text-amber-500"
      case "Bajo":
        return "text-blue-500"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
      <h4 className="text-sm font-medium text-slate-200 mb-2">{title}</h4>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-slate-400">Estado:</div>
        <div className={`text-xs font-medium ${getStatusColor()}`}>{status}</div>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
        <div className={`h-full ${getProgressColor()}`} style={{ width: `${progress}%` }}></div>
      </div>
      <div className="text-xs text-slate-500 mb-3">{description}</div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-slate-400">Impacto:</div>
        <div className={`text-xs font-medium ${getImpactColor()}`}>{impact}</div>
      </div>
      <div className="text-xs text-slate-400 mb-1">Áreas objetivo:</div>
      <div className="flex flex-wrap gap-1">
        {targetAreas.map((area, index) => (
          <Badge key={index} variant="outline" className="bg-slate-800/70 text-slate-300 border-slate-600/50">
            {area}
          </Badge>
        ))}
      </div>
    </div>
  )
}

