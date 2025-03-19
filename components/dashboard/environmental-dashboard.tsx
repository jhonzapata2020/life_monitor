"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarIcon,
  Download,
  Share2,
  ArrowUp,
  ArrowDown,
  Leaf,
  TreePine,
  Waves,
  CloudSun,
  AlertTriangle,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import LeafletMapComponent from "./leaflet-map-component"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type Region = "uraba" | "cienaga" | "guajira" | "pacifico" | "caribe" | "all"
type AlertType = "deforestation" | "erosion" | "biodiversity" | "reforestation" | "co2"

interface Alert {
  id: string
  type: AlertType
  title: string
  description: string
  severity: "high" | "medium" | "low" | "info"
  coordinates: [number, number]
  date: string
  area?: number
  location: string
  species?: string
  count?: number
  rate?: number
}

interface Statistics {
  ecosystemQuality: number
  totalMangroveArea: number
  deforestedArea: number
  reforestedArea: number
  speciesCount: number
  endangeredSpecies: number
  averageErosionRate: number
  annualCO2Capture: number
  lastUpdated: string
}

interface Layer {
  id: string
  name: string
  type: string
  url: string
  visible: boolean
  opacity: number
  legend?: string
}

interface CombinedData {
  statistics: Statistics
  alerts: Alert[]
  layers: Layer[]
  region: Region
  date: string
}

export default function EnvironmentalDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<Region>("uraba")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<CombinedData | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value as Region)
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const formattedDate = format(selectedDate, "yyyy-MM-dd")
  const displayDate = format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })

  // Cargar datos combinados
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/environmental-data/combined?region=${selectedRegion}&date=${formattedDate}`)

        if (!response.ok) {
          throw new Error(`Error al obtener datos: ${response.statusText}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || "Error desconocido al obtener datos")
        }

        setData({
          statistics: result.statistics,
          alerts: result.alerts,
          layers: result.layers,
          region: result.region,
          date: result.date,
        })
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedRegion, formattedDate])

  // Función para exportar datos
  const handleExportData = async (format: "json" | "csv") => {
    try {
      const response = await fetch(
        `/api/environmental-data/combined?region=${selectedRegion}&date=${formattedDate}&format=${format}`,
      )

      if (!response.ok) {
        throw new Error(`Error al exportar datos: ${response.statusText}`)
      }

      if (format === "csv") {
        // Descargar como archivo CSV
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `manglar-monitor-${selectedRegion}-${formattedDate}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        // Descargar como archivo JSON
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `manglar-monitor-${selectedRegion}-${formattedDate}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error("Error exporting data:", err)
      // Aquí podrías mostrar una notificación de error
    }
  }

  // Renderizar icono según el tipo de alerta
  const renderAlertIcon = (type: AlertType) => {
    switch (type) {
      case "deforestation":
        return <TreePine className="h-5 w-5 text-red-500" />
      case "biodiversity":
        return <Leaf className="h-5 w-5 text-blue-500" />
      case "erosion":
        return <Waves className="h-5 w-5 text-amber-500" />
      case "co2":
        return <CloudSun className="h-5 w-5 text-purple-500" />
      case "reforestation":
        return <Leaf className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-slate-500" />
    }
  }

  // Renderizar color según la severidad
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "info":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-slate-100 text-slate-800 border-slate-300"
    }
  }

  // Renderizar tendencia
  const renderTrend = (value: number, isPositive: boolean) => {
    return (
      <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
        <span>{Math.abs(value)}%</span>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col overflow-hidden border-slate-800/60 bg-slate-900/60 backdrop-blur-sm">
        <CardHeader className="px-6 py-4 border-b border-slate-800/60 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <CardTitle className="text-xl font-semibold text-slate-200">
              Monitoreo de Manglares -{" "}
              {selectedRegion === "uraba"
                ? "Golfo de Urabá"
                : selectedRegion === "cienaga"
                  ? "Ciénaga Grande"
                  : selectedRegion === "guajira"
                    ? "La Guajira"
                    : selectedRegion === "pacifico"
                      ? "Pacífico"
                      : selectedRegion === "caribe"
                        ? "Caribe"
                        : "Todas las Regiones"}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedRegion} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-[180px] bg-slate-800/60 border-slate-700/60 text-slate-200">
                <SelectValue placeholder="Seleccionar región" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectItem value="uraba">Golfo de Urabá</SelectItem>
                <SelectItem value="cienaga">Ciénaga Grande</SelectItem>
                <SelectItem value="guajira">La Guajira</SelectItem>
                <SelectItem value="pacifico">Pacífico</SelectItem>
                <SelectItem value="caribe">Caribe</SelectItem>
                <SelectItem value="all">Todas las Regiones</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-700/60"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {displayDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700 text-slate-200">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  initialFocus
                  className="bg-slate-800 text-slate-200"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 pt-4 border-b border-slate-800/60">
              <TabsList className="bg-slate-800/40 border border-slate-700/50">
                <TabsTrigger
                  value="dashboard"
                  className={cn(
                    "data-[state=active]:bg-green-600 data-[state=active]:text-white",
                    "data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-400",
                  )}
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className={cn(
                    "data-[state=active]:bg-green-600 data-[state=active]:text-white",
                    "data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-400",
                  )}
                >
                  Vista de Mapa
                </TabsTrigger>
                <TabsTrigger
                  value="data"
                  className={cn(
                    "data-[state=active]:bg-green-600 data-[state=active]:text-white",
                    "data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-400",
                  )}
                >
                  Datos y Análisis
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="flex-1 m-0 p-6 overflow-auto">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-slate-800/40 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-24 bg-slate-700" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-20 mb-2 bg-slate-700" />
                        <Skeleton className="h-4 w-full bg-slate-700" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-md text-red-200 mb-6">
                  <AlertTriangle className="h-5 w-5 inline-block mr-2" />
                  Error al cargar datos: {error}
                </div>
              ) : data ? (
                <>
                  {/* Tarjetas de estadísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card className="bg-slate-800/40 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Calidad ecosistémica</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-500 mb-1">
                          {data.statistics.ecosystemQuality}%
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-600 to-green-400"
                            style={{ width: `${data.statistics.ecosystemQuality}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/40 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Área de manglar</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-500 mb-1">
                          {data.statistics.totalMangroveArea.toLocaleString()} <span className="text-lg">ha</span>
                        </div>
                        <div className="text-sm text-slate-400">
                          {data.statistics.reforestedArea} ha reforestadas
                          <span className="ml-2 text-green-500">
                            <ArrowUp className="h-3 w-3 inline-block mr-1" />
                            3.7%
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/40 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Pérdida de cobertura</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-red-500 mb-1">
                          {data.statistics.deforestedArea.toLocaleString()} <span className="text-lg">ha</span>
                        </div>
                        <div className="text-sm text-slate-400">
                          vs. mes anterior
                          <span className="ml-2 text-red-500">
                            <ArrowUp className="h-3 w-3 inline-block mr-1" />
                            2.1%
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/40 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Especies monitoreadas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-500 mb-1">{data.statistics.speciesCount}</div>
                        <div className="text-sm text-slate-400">
                          {data.statistics.endangeredSpecies} en peligro
                          <span className="ml-2 text-green-500">
                            <ArrowUp className="h-3 w-3 inline-block mr-1" />5 nuevas
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Mapa y alertas */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-slate-800/40 border-slate-700/50 overflow-hidden">
                      <CardHeader className="pb-2 border-b border-slate-700/50">
                        <CardTitle className="text-sm font-medium text-slate-200">Mapa de Monitoreo</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="h-[400px]">
                          <LeafletMapComponent
                            selectedDate={formattedDate}
                            region={selectedRegion}
                            className="h-full"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/40 border-slate-700/50">
                      <CardHeader className="pb-2 border-b border-slate-700/50">
                        <CardTitle className="text-sm font-medium text-slate-200">Alertas Recientes</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="max-h-[400px] overflow-y-auto">
                          <div className="divide-y divide-slate-700/50">
                            {data.alerts.map((alert) => (
                              <div
                                key={alert.id}
                                className="p-3 hover:bg-slate-700/20 cursor-pointer"
                                onClick={() => setSelectedAlert(alert)}
                              >
                                <div className="flex items-start">
                                  <div className="mr-3 mt-0.5">{renderAlertIcon(alert.type)}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="text-sm font-medium text-slate-200">{alert.title}</h4>
                                      <Badge className={cn("text-xs", getSeverityColor(alert.severity))}>
                                        {alert.severity === "high"
                                          ? "Alta"
                                          : alert.severity === "medium"
                                            ? "Media"
                                            : alert.severity === "low"
                                              ? "Baja"
                                              : "Info"}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-1">{alert.description}</p>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                      <span>{alert.location}</span>
                                      <span>{format(new Date(alert.date), "dd/MM/yyyy")}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : null}
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map" className="flex-1 m-0 overflow-hidden">
              <div className="h-full relative">
                <LeafletMapComponent selectedDate={formattedDate} region={selectedRegion} className="h-full" />

                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-900/80 border-slate-700/50 hover:bg-slate-800"
                    onClick={() => handleExportData("json")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-900/80 border-slate-700/50 hover:bg-slate-800"
                    onClick={() => handleExportData("csv")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-900/80 border-slate-700/50 hover:bg-slate-800"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Data Tab */}
            <TabsContent value="data" className="flex-1 m-0 p-6 overflow-auto">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-slate-800/40 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-24 bg-slate-700" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2 bg-slate-700" />
                        <Skeleton className="h-4 w-full mb-2 bg-slate-700" />
                        <Skeleton className="h-4 w-full mb-2 bg-slate-700" />
                        <Skeleton className="h-4 w-3/4 bg-slate-700" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-md text-red-200">
                  <AlertTriangle className="h-5 w-5 inline-block mr-2" />
                  Error al cargar datos: {error}
                </div>
              ) : data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/40 border-slate-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Estadísticas de Cobertura</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Área total de manglar:</span>
                          <span className="font-medium text-slate-200">
                            {data.statistics.totalMangroveArea.toLocaleString()} ha
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Área reforestada:</span>
                          <span className="font-medium text-green-400">{data.statistics.reforestedArea} ha</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Pérdida reciente:</span>
                          <span className="font-medium text-red-400">{data.statistics.deforestedArea} ha</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Tasa de cambio anual:</span>
                          <span className="font-medium text-amber-400">-2.1%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/40 border-slate-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Biodiversidad</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Especies monitoreadas:</span>
                          <span className="font-medium text-slate-200">{data.statistics.speciesCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Especies en peligro:</span>
                          <span className="font-medium text-red-400">{data.statistics.endangeredSpecies}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Avistamientos recientes:</span>
                          <span className="font-medium text-blue-400">23</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Índice de biodiversidad:</span>
                          <span className="font-medium text-green-400">0.78</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/40 border-slate-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Erosión Costera</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Tasa de erosión promedio:</span>
                          <span className="font-medium text-amber-400">{data.statistics.averageErosionRate} m/año</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Puntos críticos:</span>
                          <span className="font-medium text-red-400">8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Línea costera protegida:</span>
                          <span className="font-medium text-green-400">65%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Riesgo de inundación:</span>
                          <span className="font-medium text-amber-400">Medio</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/40 border-slate-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Captura de CO2</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Captura anual estimada:</span>
                          <span className="font-medium text-green-400">
                            {data.statistics.annualCO2Capture.toLocaleString()} ton
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Carbono almacenado:</span>
                          <span className="font-medium text-slate-200">1.2M ton</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Eficiencia de captura:</span>
                          <span className="font-medium text-green-400">Alta</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Potencial de restauración:</span>
                          <span className="font-medium text-blue-400">+15%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

