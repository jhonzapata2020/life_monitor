"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, BarChart3, Download, FileBarChart, RefreshCw, Trees } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

interface DeforestationViewProps {
  alerts: DeforestationAlert[]
  totalDeforestation: number
  monthlyDeforestation: number
}

export default function DeforestationView({
  alerts = [],
  totalDeforestation = 245.8,
  monthlyDeforestation = 12.3,
}: DeforestationViewProps) {
  const [activeTab, setActiveTab] = useState("alertas")

  // Formatear número con separador de miles
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-CO").format(num)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-100 flex items-center">
              <Trees className="mr-2 h-5 w-5 text-green-500" />
              Monitoreo de Deforestación - Golfo de Urabá
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-slate-800/50 text-red-400 border-red-500/50 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1 animate-pulse"></div>
                ALERTA ACTIVA
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
              title="Deforestación Total"
              value={formatNumber(totalDeforestation)}
              unit="hectáreas"
              icon={Trees}
              trend="up"
              color="red"
              detail="Desde inicio del monitoreo"
            />
            <MetricCard
              title="Deforestación Mensual"
              value={formatNumber(monthlyDeforestation)}
              unit="hectáreas"
              icon={FileBarChart}
              trend="up"
              color="amber"
              detail="Último mes"
            />
            <MetricCard
              title="Alertas Activas"
              value={alerts.length.toString()}
              unit="alertas"
              icon={AlertCircle}
              trend="stable"
              color="blue"
              detail="Requieren verificación"
            />
          </div>

          <Tabs defaultValue="alertas" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-slate-800/50 p-1">
                <TabsTrigger
                  value="alertas"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-green-400"
                >
                  Alertas
                </TabsTrigger>
                <TabsTrigger
                  value="tendencias"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-green-400"
                >
                  Tendencias
                </TabsTrigger>
                <TabsTrigger
                  value="mitigacion"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-green-400"
                >
                  Mitigación
                </TabsTrigger>
              </TabsList>

              <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700/50 text-slate-300">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
            </div>

            <TabsContent value="alertas" className="mt-0">
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-3">Ubicación</div>
                  <div className="col-span-2">Fecha</div>
                  <div className="col-span-1">Área</div>
                  <div className="col-span-3">Descripción</div>
                  <div className="col-span-2">Severidad</div>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <AlertRow
                        key={alert.id}
                        id={alert.id}
                        location={alert.location}
                        date={alert.date}
                        area={alert.area}
                        description={alert.description}
                        severity={alert.severity}
                      />
                    ))
                  ) : (
                    <>
                      <AlertRow
                        id="DEF-001"
                        location="Norte del Golfo de Urabá"
                        date="2025-03-12"
                        area={5.2}
                        description="Tala ilegal detectada por cambios en la firma espectral"
                        severity="high"
                      />
                      <AlertRow
                        id="DEF-002"
                        location="Bahía Colombia"
                        date="2025-03-10"
                        area={3.1}
                        description="Reducción de cobertura vegetal detectada"
                        severity="medium"
                      />
                      <AlertRow
                        id="DEF-003"
                        location="Desembocadura del Río Atrato"
                        date="2025-03-08"
                        area={7.5}
                        description="Conversión de manglar a zona agrícola"
                        severity="high"
                      />
                      <AlertRow
                        id="DEF-004"
                        location="Punta Caimán"
                        date="2025-03-05"
                        area={1.8}
                        description="Posible degradación natural"
                        severity="low"
                      />
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tendencias" className="mt-0">
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                <h3 className="text-sm font-medium text-slate-200 mb-4">Tendencia de Deforestación (2020-2025)</h3>
                <div className="h-64 w-full relative">
                  <DeforestationTrendChart />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <StatCard title="Tasa Anual" value="49.2" unit="ha/año" trend="increasing" />
                  <StatCard title="Área Más Afectada" value="Norte del Golfo" unit="" trend="critical" />
                  <StatCard title="Causa Principal" value="Agricultura" unit="" trend="warning" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mitigacion" className="mt-0">
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                <h3 className="text-sm font-medium text-slate-200 mb-4">Acciones de Mitigación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MitigationCard
                    title="Patrullaje y Vigilancia"
                    status="En progreso"
                    statusColor="blue"
                    progress={65}
                    description="Incrementar patrullajes en áreas de alto riesgo identificadas por el sistema de monitoreo satelital."
                  />
                  <MitigationCard
                    title="Programa de Reforestación"
                    status="Planificado"
                    statusColor="amber"
                    progress={30}
                    description="Reforestación de 25 hectáreas en zonas degradadas con especies nativas de manglar."
                  />
                  <MitigationCard
                    title="Educación Comunitaria"
                    status="Completado"
                    statusColor="green"
                    progress={100}
                    description="Talleres comunitarios sobre la importancia de la conservación de manglares y prácticas sostenibles."
                  />
                  <MitigationCard
                    title="Monitoreo Participativo"
                    status="En progreso"
                    statusColor="blue"
                    progress={45}
                    description="Implementación de sistema de monitoreo participativo con comunidades locales para detección temprana."
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
        return "from-green-500 to-teal-500 border-green-500/30"
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
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-green-500 to-teal-500"></div>
    </div>
  )
}

// Componente para filas de alertas
function AlertRow({
  id,
  location,
  date,
  area,
  description,
  severity,
}: {
  id: string
  location: string
  date: string
  area: number
  description: string
  severity: "high" | "medium" | "low"
}) {
  const getSeverityBadge = () => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Alta</Badge>
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Media</Badge>
      case "low":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Baja</Badge>
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Desconocida</Badge>
    }
  }

  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-1 text-slate-500">{id}</div>
      <div className="col-span-3 text-slate-300">{location}</div>
      <div className="col-span-2 text-slate-400">{date}</div>
      <div className="col-span-1 text-green-400">{area} ha</div>
      <div className="col-span-3 text-slate-400 truncate">{description}</div>
      <div className="col-span-2">{getSeverityBadge()}</div>
    </div>
  )
}

// Componente para el gráfico de tendencia (simulado)
function DeforestationTrendChart() {
  return (
    <div className="h-full w-full bg-slate-800/20 rounded-md border border-slate-700/50 p-4 flex items-center justify-center">
      <div className="w-full h-full relative">
        {/* Eje Y */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 text-xs text-slate-500">
          <div>50 ha</div>
          <div>40 ha</div>
          <div>30 ha</div>
          <div>20 ha</div>
          <div>10 ha</div>
          <div>0 ha</div>
        </div>

        {/* Barras del gráfico (simuladas) */}
        <div className="absolute left-10 right-0 bottom-8 top-4 flex items-end justify-between">
          {[35, 42, 38, 45, 49].map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-12 bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm"
                style={{ height: `${value * 2}px` }}
              ></div>
              <div className="text-xs text-slate-500 mt-2">{2020 + index}</div>
            </div>
          ))}
        </div>

        {/* Línea de tendencia */}
        <div className="absolute left-10 right-0 bottom-8 top-4 pointer-events-none">
          <svg className="w-full h-full">
            <line
              x1="6%"
              y1="30%"
              x2="94%"
              y2="10%"
              stroke="rgba(239, 68, 68, 0.7)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
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
}: {
  title: string
  status: string
  statusColor: string
  progress: number
  description: string
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
      <div className="text-xs text-slate-500">{description}</div>
    </div>
  )
}

