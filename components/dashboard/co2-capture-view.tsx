"use client"

import { useState } from "react"
import { BarChart3, Download, Cloud, RefreshCw, Calendar, LineChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Definir el tipo para los datos de captura de CO2
type CO2CaptureData = {
  month: string
  value: number // toneladas de CO2
}

type CO2CaptureZone = {
  name: string
  area: number // hectáreas
  captureRate: number // toneladas por hectárea por año
  totalCapture: number // toneladas por año
  trend: "increasing" | "stable" | "decreasing"
  health: "excellent" | "good" | "fair" | "poor"
}

interface CO2CaptureViewProps {
  total: number
  monthly: number
  data: CO2CaptureData[]
  zones?: CO2CaptureZone[]
}

export default function CO2CaptureView({ total = 45280, monthly = 3750, data = [], zones = [] }: CO2CaptureViewProps) {
  const [activeTab, setActiveTab] = useState("resumen")
  const [selectedYear, setSelectedYear] = useState<string>("2025")
  const [selectedZoneHealth, setSelectedZoneHealth] = useState<string>("all")

  // Formatear número con separador de miles
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-CO").format(num)
  }

  // Usar datos por defecto si no se proporcionan
  const monthlyData = data.length > 0 ? data : defaultCO2Data
  const zoneData = zones.length > 0 ? zones : defaultZoneData

  // Filtrar zonas por estado de salud
  const filteredZones =
    selectedZoneHealth === "all" ? zoneData : zoneData.filter((zone) => zone.health === selectedZoneHealth)

  // Calcular el total de captura de las zonas filtradas
  const totalZoneCapture = filteredZones.reduce((sum, zone) => sum + zone.totalCapture, 0)

  // Calcular el promedio de captura por hectárea
  const averageCaptureRate =
    filteredZones.length > 0 ? filteredZones.reduce((sum, zone) => sum + zone.captureRate, 0) / filteredZones.length : 0

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-100 flex items-center">
              <Cloud className="mr-2 h-5 w-5 text-cyan-500" />
              Captura de CO2 - Manglares del Golfo de Urabá
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
              title="Captura Total de CO2"
              value={formatNumber(total)}
              unit="toneladas"
              icon={Cloud}
              trend="up"
              color="cyan"
              detail="Acumulado desde inicio del monitoreo"
            />
            <MetricCard
              title="Captura Mensual"
              value={formatNumber(monthly)}
              unit="ton/mes"
              icon={Calendar}
              trend="stable"
              color="blue"
              detail="Promedio último trimestre"
            />
            <MetricCard
              title="Tasa de Captura"
              value={averageCaptureRate.toFixed(1)}
              unit="ton/ha/año"
              icon={BarChart3}
              trend="up"
              color="green"
              detail="Eficiencia del ecosistema"
            />
          </div>

          <Tabs defaultValue="resumen" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-slate-800/50 p-1">
                <TabsTrigger
                  value="resumen"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                >
                  Resumen
                </TabsTrigger>
                <TabsTrigger
                  value="zonas"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                >
                  Zonas de Captura
                </TabsTrigger>
                <TabsTrigger
                  value="tendencias"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                >
                  Tendencias
                </TabsTrigger>
              </TabsList>

              <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700/50 text-slate-300">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
            </div>

            <TabsContent value="resumen" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-200 mb-4">Captura Mensual de CO2 (2025)</h3>
                  <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 h-[300px]">
                    <MonthlyCO2Chart data={monthlyData} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-200 mb-4">Distribución por Tipo de Manglar</h3>
                  <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 h-[300px]">
                    <MangroveTypePieChart />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-200 mb-4">Beneficios Ambientales</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <BenefitCard
                    title="Equivalente a"
                    value={formatNumber(Math.round(total / 4.6))}
                    unit="vehículos"
                    description="Emisiones anuales retiradas de circulación"
                    icon="🚗"
                  />
                  <BenefitCard
                    title="Oxígeno Generado"
                    value={formatNumber(Math.round(total * 0.73))}
                    unit="toneladas"
                    description="Contribución a la calidad del aire"
                    icon="💨"
                  />
                  <BenefitCard
                    title="Valor Económico"
                    value={formatNumber(Math.round(total * 25))}
                    unit="USD"
                    description="Basado en mercados de carbono"
                    icon="💰"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="zonas" className="mt-0">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  Mostrando {filteredZones.length} zonas con {formatNumber(totalZoneCapture)} toneladas de captura anual
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-slate-400 mr-2">Filtrar por estado:</span>
                  <Select value={selectedZoneHealth} onValueChange={setSelectedZoneHealth}>
                    <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700/50 text-slate-100">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="excellent">Excelente</SelectItem>
                      <SelectItem value="good">Bueno</SelectItem>
                      <SelectItem value="fair">Regular</SelectItem>
                      <SelectItem value="poor">Deficiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                  <div className="col-span-3">Zona</div>
                  <div className="col-span-2">Área</div>
                  <div className="col-span-2">Tasa de Captura</div>
                  <div className="col-span-2">Captura Total</div>
                  <div className="col-span-1">Tendencia</div>
                  <div className="col-span-2">Estado</div>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {filteredZones.length > 0 ? (
                    filteredZones.map((zone, index) => (
                      <CaptureZoneRow
                        key={index}
                        name={zone.name}
                        area={zone.area}
                        captureRate={zone.captureRate}
                        totalCapture={zone.totalCapture}
                        trend={zone.trend}
                        health={zone.health}
                      />
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400">
                      No se encontraron zonas que coincidan con el filtro seleccionado.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tendencias" className="mt-0">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-200">Tendencia Anual de Captura de CO2 (2020-2025)</h3>
                <div className="flex items-center">
                  <span className="text-sm text-slate-400 mr-2">Año:</span>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[120px] bg-slate-800/50 border-slate-700/50 text-slate-100">
                      <SelectValue placeholder="Seleccionar año" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                <div className="h-64 w-full relative">
                  <CO2TrendChart />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <StatCard title="Captura 2020" value="38,450" unit="toneladas" trend="baseline" />
                  <StatCard title="Captura 2025" value="45,280" unit="toneladas" trend="increasing" />
                  <StatCard title="Incremento" value="17.8" unit="%" trend="positive" />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-200 mb-4">Factores de Influencia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FactorCard
                    title="Reforestación de Manglares"
                    impact="Alto"
                    impactColor="green"
                    progress={75}
                    description="Incremento de área de manglar mediante programas de reforestación."
                    effect="Positivo"
                  />
                  <FactorCard
                    title="Calidad del Agua"
                    impact="Medio"
                    impactColor="amber"
                    progress={60}
                    description="Mejora en la calidad del agua que afecta la salud del ecosistema."
                    effect="Positivo"
                  />
                  <FactorCard
                    title="Cambio Climático"
                    impact="Alto"
                    impactColor="red"
                    progress={85}
                    description="Aumento de temperatura y eventos climáticos extremos."
                    effect="Negativo"
                  />
                  <FactorCard
                    title="Actividad Humana"
                    impact="Medio"
                    impactColor="amber"
                    progress={55}
                    description="Presión por actividades humanas en zonas costeras."
                    effect="Negativo"
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

// Datos mensuales de CO2 por defecto
const defaultCO2Data: CO2CaptureData[] = [
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

// Datos de zonas de captura por defecto
const defaultZoneData: CO2CaptureZone[] = [
  {
    name: "Manglar Norte",
    area: 3250,
    captureRate: 3.8,
    totalCapture: 12350,
    trend: "increasing",
    health: "excellent",
  },
  {
    name: "Bahía Colombia",
    area: 2800,
    captureRate: 3.5,
    totalCapture: 9800,
    trend: "stable",
    health: "good",
  },
  {
    name: "Desembocadura Río Atrato",
    area: 2100,
    captureRate: 3.2,
    totalCapture: 6720,
    trend: "increasing",
    health: "good",
  },
  {
    name: "Punta Caimán",
    area: 1850,
    captureRate: 2.9,
    totalCapture: 5365,
    trend: "decreasing",
    health: "fair",
  },
  {
    name: "Necoclí",
    area: 1650,
    captureRate: 3.4,
    totalCapture: 5610,
    trend: "stable",
    health: "good",
  },
  {
    name: "Turbo",
    area: 1200,
    captureRate: 2.5,
    totalCapture: 3000,
    trend: "decreasing",
    health: "fair",
  },
  {
    name: "Isla de los Muertos",
    area: 950,
    captureRate: 2.1,
    totalCapture: 1995,
    trend: "decreasing",
    health: "poor",
  },
  {
    name: "Boca Tarena",
    area: 850,
    captureRate: 2.8,
    totalCapture: 2380,
    trend: "stable",
    health: "fair",
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
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
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
        <Icon className="h-5 w-5 text-slate-300" />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {value} <span className="text-sm">{unit}</span>
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
    </div>
  )
}

// Componente para el gráfico de captura mensual de CO2
function MonthlyCO2Chart({ data }: { data: CO2CaptureData[] }) {
  return (
    <div className="h-full w-full relative">
      {/* Eje Y */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 text-xs text-slate-500">
        <div>4000</div>
        <div>3800</div>
        <div>3600</div>
        <div>3400</div>
        <div>3200</div>
        <div>3000</div>
      </div>

      {/* Líneas de referencia horizontales */}
      <div className="absolute left-8 right-0 top-0 h-full">
        <div className="relative h-full">
          <div className="absolute top-0 w-full border-t border-dashed border-slate-700/30"></div>
          <div className="absolute top-1/5 w-full border-t border-dashed border-slate-700/30"></div>
          <div className="absolute top-2/5 w-full border-t border-dashed border-slate-700/30"></div>
          <div className="absolute top-3/5 w-full border-t border-dashed border-slate-700/30"></div>
          <div className="absolute top-4/5 w-full border-t border-dashed border-slate-700/30"></div>
          <div className="absolute bottom-0 w-full border-t border-dashed border-slate-700/30"></div>
        </div>
      </div>

      {/* Barras del gráfico */}
      <div className="absolute left-10 right-4 bottom-8 top-4 flex items-end justify-between">
        {data.map((item, index) => {
          // Normalizar el valor para que se ajuste a la altura del gráfico
          // Asumiendo que el rango es de 3000 a 4000
          const normalizedHeight = ((item.value - 3000) / 1000) * 100

          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-6 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm"
                style={{ height: `${normalizedHeight}%` }}
              ></div>
              <div className="text-xs text-slate-500 mt-2">{item.month}</div>
            </div>
          )
        })}
      </div>

      {/* Línea de tendencia */}
      <div className="absolute left-10 right-4 bottom-8 top-4 pointer-events-none">
        <svg className="w-full h-full">
          <path
            d="M 0,50 C 50,45 100,40 150,35 C 200,30 250,25 300,20 C 350,25 400,30 450,35 C 500,40 550,45 600,50"
            fill="none"
            stroke="rgba(6, 182, 212, 0.7)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      </div>
    </div>
  )
}

// Componente para el gráfico de distribución por tipo de manglar
function MangroveTypePieChart() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="relative h-48 w-48">
        {/* Gráfico circular simulado */}
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#0ea5e9"
            strokeWidth="20"
            strokeDasharray="75 25"
            strokeDashoffset="0"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#14b8a6"
            strokeWidth="20"
            strokeDasharray="25 75"
            strokeDashoffset="-75"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#6366f1"
            strokeWidth="20"
            strokeDasharray="15 85"
            strokeDashoffset="-100"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#8b5cf6"
            strokeWidth="20"
            strokeDasharray="10 90"
            strokeDashoffset="-115"
          />
          <circle cx="50" cy="50" r="25" fill="#1e293b" />
        </svg>

        {/* Etiqueta central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-400">12,450</div>
            <div className="text-xs text-slate-400">hectáreas</div>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="ml-8 space-y-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-sky-500 mr-2 rounded-sm"></div>
          <span className="text-xs text-slate-300">Mangle Rojo (45%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-teal-500 mr-2 rounded-sm"></div>
          <span className="text-xs text-slate-300">Mangle Negro (25%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500 mr-2 rounded-sm"></div>
          <span className="text-xs text-slate-300">Mangle Blanco (15%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 mr-2 rounded-sm"></div>
          <span className="text-xs text-slate-300">Mangle Botoncillo (10%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-slate-500 mr-2 rounded-sm"></div>
          <span className="text-xs text-slate-300">Otros (5%)</span>
        </div>
      </div>
    </div>
  )
}

// Componente para tarjetas de beneficios
function BenefitCard({
  title,
  value,
  unit,
  description,
  icon,
}: {
  title: string
  value: string
  unit: string
  description: string
  icon: string
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-cyan-500/20 p-4">
      <div className="flex items-center mb-2">
        <div className="text-2xl mr-2">{icon}</div>
        <div className="text-sm font-medium text-slate-300">{title}</div>
      </div>
      <div className="text-xl font-bold mb-1 text-cyan-400">
        {value} <span className="text-sm text-cyan-300">{unit}</span>
      </div>
      <div className="text-xs text-slate-400">{description}</div>
    </div>
  )
}

// Componente para filas de zonas de captura
function CaptureZoneRow({
  name,
  area,
  captureRate,
  totalCapture,
  trend,
  health,
}: {
  name: string
  area: number
  captureRate: number
  totalCapture: number
  trend: "increasing" | "stable" | "decreasing"
  health: "excellent" | "good" | "fair" | "poor"
}) {
  const getTrendBadge = () => {
    switch (trend) {
      case "increasing":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">↑</Badge>
      case "stable":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">→</Badge>
      case "decreasing":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">↓</Badge>
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">?</Badge>
    }
  }

  const getHealthBadge = () => {
    switch (health) {
      case "excellent":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Excelente</Badge>
      case "good":
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Bueno</Badge>
      case "fair":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Regular</Badge>
      case "poor":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Deficiente</Badge>
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Desconocido</Badge>
    }
  }

  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-3 text-slate-300">{name}</div>
      <div className="col-span-2 text-slate-300">{area} ha</div>
      <div className="col-span-2 text-cyan-400">{captureRate} ton/ha/año</div>
      <div className="col-span-2 text-cyan-400">{totalCapture} ton/año</div>
      <div className="col-span-1">{getTrendBadge()}</div>
      <div className="col-span-2">{getHealthBadge()}</div>
    </div>
  )
}

// Componente para el gráfico de tendencia de CO2
function CO2TrendChart() {
  return (
    <div className="h-full w-full bg-slate-800/20 rounded-md border border-slate-700/50 p-4 flex items-center justify-center">
      <div className="w-full h-full relative">
        {/* Eje Y */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 text-xs text-slate-500">
          <div>50,000</div>
          <div>45,000</div>
          <div>40,000</div>
          <div>35,000</div>
          <div>30,000</div>
        </div>

        {/* Líneas de referencia horizontales */}
        <div className="absolute left-12 right-0 top-0 h-full">
          <div className="relative h-full">
            <div className="absolute top-0 w-full border-t border-dashed border-slate-700/30"></div>
            <div className="absolute top-1/4 w-full border-t border-dashed border-slate-700/30"></div>
            <div className="absolute top-2/4 w-full border-t border-dashed border-slate-700/30"></div>
            <div className="absolute top-3/4 w-full border-t border-dashed border-slate-700/30"></div>
            <div className="absolute bottom-0 w-full border-t border-dashed border-slate-700/30"></div>
          </div>
        </div>

        {/* Gráfico de líneas (simulado) */}
        <div className="absolute left-12 right-0 bottom-8 top-4">
          {/* Línea de tendencia general */}
          <svg className="w-full h-full">
            <path
              d="M 0,120 C 50,110 100,100 150,90 C 200,80 250,70 300,60 C 350,50 400,40 450,30"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Puntos de datos */}
          <div className="absolute left-0 bottom-[70%] h-3 w-3 rounded-full bg-cyan-500 shadow-glow-blue"></div>
          <div className="absolute left-[20%] bottom-[65%] h-3 w-3 rounded-full bg-cyan-500 shadow-glow-blue"></div>
          <div className="absolute left-[40%] bottom-[55%] h-3 w-3 rounded-full bg-cyan-500 shadow-glow-blue"></div>
          <div className="absolute left-[60%] bottom-[40%] h-3 w-3 rounded-full bg-cyan-500 shadow-glow-blue"></div>
          <div className="absolute left-[80%] bottom-[25%] h-3 w-3 rounded-full bg-cyan-500 shadow-glow-blue"></div>
          <div className="absolute left-[95%] bottom-[15%] h-3 w-3 rounded-full bg-cyan-500 shadow-glow-blue"></div>
        </div>

        {/* Eje X */}
        <div className="absolute left-12 right-0 bottom-0 flex justify-between text-xs text-slate-500">
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
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 mr-2 rounded-sm"></div>
            <span className="text-slate-300">Captura total de CO2 (toneladas)</span>
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
  trend: "increasing" | "decreasing" | "stable" | "positive" | "negative" | "baseline"
}) {
  const getTrendColor = () => {
    switch (trend) {
      case "increasing":
      case "positive":
        return "text-green-500"
      case "decreasing":
      case "negative":
        return "text-red-500"
      case "stable":
        return "text-blue-500"
      case "baseline":
        return "text-slate-400"
      default:
        return "text-slate-500"
    }
  }

  const getTrendText = () => {
    switch (trend) {
      case "increasing":
        return "↑ En aumento"
      case "decreasing":
        return "↓ En disminución"
      case "stable":
        return "→ Estable"
      case "positive":
        return "↑ Positivo"
      case "negative":
        return "↓ Negativo"
      case "baseline":
        return "Línea base"
      default:
        return ""
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
      <div className="text-xs text-slate-500 mb-1">{title}</div>
      <div className="text-lg font-medium text-slate-200">
        {value} <span className="text-sm text-slate-400">{unit}</span>
      </div>
      <div className={`text-xs mt-1 ${getTrendColor()}`}>{getTrendText()}</div>
    </div>
  )
}

// Componente para tarjetas de factores
function FactorCard({
  title,
  impact,
  impactColor,
  progress,
  description,
  effect,
}: {
  title: string
  impact: string
  impactColor: string
  progress: number
  description: string
  effect: "Positivo" | "Negativo"
}) {
  const getImpactColor = () => {
    switch (impactColor) {
      case "green":
        return "text-green-500"
      case "amber":
        return "text-amber-500"
      case "red":
        return "text-red-500"
      default:
        return "text-slate-400"
    }
  }

  const getProgressColor = () => {
    switch (impactColor) {
      case "green":
        return "bg-green-500"
      case "amber":
        return "bg-amber-500"
      case "red":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  const getEffectColor = () => {
    return effect === "Positivo" ? "text-green-500" : "text-red-500"
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
      <h4 className="text-sm font-medium text-slate-200 mb-2">{title}</h4>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-slate-400">Impacto:</div>
        <div className={`text-xs font-medium ${getImpactColor()}`}>{impact}</div>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
        <div className={`h-full ${getProgressColor()}`} style={{ width: `${progress}%` }}></div>
      </div>
      <div className="text-xs text-slate-500 mb-3">{description}</div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">Efecto:</div>
        <div className={`text-xs font-medium ${getEffectColor()}`}>{effect}</div>
      </div>
    </div>
  )
}

