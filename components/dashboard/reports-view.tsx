"use client"

import type React from "react"

import { useState } from "react"
import {
  FileText,
  Download,
  Calendar,
  FileBarChart,
  FilePieChart,
  FileSpreadsheet,
  Filter,
  Printer,
  RefreshCw,
  Search,
  Share2,
  ChevronDown,
  Eye,
  Clock,
  BarChart3,
  Trees,
  Leaf,
  Waves,
  Cloud,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Tipos para los reportes
type ReportType =
  | "deforestation"
  | "biodiversity"
  | "coastal-erosion"
  | "co2-capture"
  | "real-time"
  | "executive"
  | "compliance"
  | "sustainability"

type ReportFormat = "pdf" | "excel" | "csv" | "json"

type ReportFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "custom"

type ReportStatus = "ready" | "processing" | "scheduled" | "error"

interface Report {
  id: string
  name: string
  type: ReportType
  description: string
  lastGenerated?: Date
  frequency?: ReportFrequency
  status: ReportStatus
  format: ReportFormat
  size?: string
  thumbnail?: string
}

interface ScheduledReport {
  id: string
  name: string
  type: ReportType
  frequency: ReportFrequency
  nextGeneration: Date
  recipients: string[]
  format: ReportFormat
}

export default function ReportsView() {
  const [activeTab, setActiveTab] = useState("available")
  const [selectedReportType, setSelectedReportType] = useState<ReportType | "all">("all")
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>("pdf")
  const [dateRange, setDateRange] = useState<"last-week" | "last-month" | "last-quarter" | "last-year" | "custom">(
    "last-month",
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  // Datos de ejemplo para los reportes disponibles
  const availableReports: Report[] = [
    {
      id: "rep-001",
      name: "Informe de Deforestación",
      type: "deforestation",
      description:
        "Análisis detallado de la deforestación en el área de manglares, incluyendo tasas, áreas afectadas y causas identificadas.",
      lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
      status: "ready",
      format: "pdf",
      size: "4.2 MB",
      thumbnail: "/placeholder.svg?height=120&width=90&text=Deforestación",
    },
    {
      id: "rep-002",
      name: "Biodiversidad - Especies Monitoreadas",
      type: "biodiversity",
      description:
        "Inventario completo de especies en el ecosistema de manglares, con tendencias poblacionales y estado de conservación.",
      lastGenerated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 días atrás
      status: "ready",
      format: "excel",
      size: "8.7 MB",
      thumbnail: "/placeholder.svg?height=120&width=90&text=Biodiversidad",
    },
    {
      id: "rep-003",
      name: "Análisis de Erosión Costera",
      type: "coastal-erosion",
      description:
        "Evaluación de la erosión costera en zonas de manglar, con mapas de riesgo y recomendaciones de mitigación.",
      lastGenerated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
      status: "ready",
      format: "pdf",
      size: "12.3 MB",
      thumbnail: "/placeholder.svg?height=120&width=90&text=Erosión",
    },
    {
      id: "rep-004",
      name: "Captura de CO2 - Tendencias",
      type: "co2-capture",
      description: "Análisis de la captura de carbono por los manglares, con proyecciones y comparativas históricas.",
      lastGenerated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
      status: "ready",
      format: "pdf",
      size: "6.8 MB",
      thumbnail: "/placeholder.svg?height=120&width=90&text=CO2",
    },
    {
      id: "rep-005",
      name: "Informe Ejecutivo Trimestral",
      type: "executive",
      description:
        "Resumen ejecutivo para tomadores de decisiones, con indicadores clave y recomendaciones estratégicas.",
      lastGenerated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 días atrás
      status: "ready",
      format: "pdf",
      size: "3.5 MB",
      thumbnail: "/placeholder.svg?height=120&width=90&text=Ejecutivo",
    },
    {
      id: "rep-006",
      name: "Datos de Monitoreo en Tiempo Real",
      type: "real-time",
      description: "Exportación de datos de sensores y monitoreo en tiempo real para análisis detallado.",
      status: "processing",
      format: "excel",
      thumbnail: "/placeholder.svg?height=120&width=90&text=Tiempo+Real",
    },
    {
      id: "rep-007",
      name: "Informe de Cumplimiento Ambiental",
      type: "compliance",
      description: "Evaluación del cumplimiento de normativas ambientales y compromisos de conservación.",
      lastGenerated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 días atrás
      status: "ready",
      format: "pdf",
      size: "5.1 MB",
      thumbnail: "/placeholder.svg?height=120&width=90&text=Cumplimiento",
    },
    {
      id: "rep-008",
      name: "Indicadores de Sostenibilidad",
      type: "sustainability",
      description: "Métricas de sostenibilidad del ecosistema de manglares y servicios ecosistémicos.",
      lastGenerated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 días atrás
      status: "ready",
      format: "excel",
      size: "7.2 MB",
      thumbnail: "/placeholder.svg?height=120&width=90&text=Sostenibilidad",
    },
  ]

  // Datos de ejemplo para los reportes programados
  const scheduledReports: ScheduledReport[] = [
    {
      id: "sched-001",
      name: "Informe Mensual de Deforestación",
      type: "deforestation",
      frequency: "monthly",
      nextGeneration: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días en el futuro
      recipients: ["direccion@manglaresuraba.org", "conservacion@manglaresuraba.org"],
      format: "pdf",
    },
    {
      id: "sched-002",
      name: "Datos de Biodiversidad",
      type: "biodiversity",
      frequency: "quarterly",
      nextGeneration: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 días en el futuro
      recipients: ["investigacion@manglaresuraba.org", "biodiversidad@manglaresuraba.org"],
      format: "excel",
    },
    {
      id: "sched-003",
      name: "Informe Ejecutivo para Junta Directiva",
      type: "executive",
      frequency: "monthly",
      nextGeneration: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 días en el futuro
      recipients: ["juntadirectiva@manglaresuraba.org", "direccion@manglaresuraba.org"],
      format: "pdf",
    },
    {
      id: "sched-004",
      name: "Reporte de Cumplimiento para Autoridades",
      type: "compliance",
      frequency: "quarterly",
      nextGeneration: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días en el futuro
      recipients: ["autoridades@manglaresuraba.org", "legal@manglaresuraba.org"],
      format: "pdf",
    },
  ]

  // Datos de ejemplo para el historial de reportes
  const reportHistory: Report[] = [
    {
      id: "hist-001",
      name: "Informe de Deforestación - Febrero 2025",
      type: "deforestation",
      description: "Análisis mensual de deforestación",
      lastGenerated: new Date(2025, 1, 28), // 28 de febrero de 2025
      status: "ready",
      format: "pdf",
      size: "4.1 MB",
    },
    {
      id: "hist-002",
      name: "Informe de Deforestación - Enero 2025",
      type: "deforestation",
      description: "Análisis mensual de deforestación",
      lastGenerated: new Date(2025, 0, 30), // 30 de enero de 2025
      status: "ready",
      format: "pdf",
      size: "3.9 MB",
    },
    {
      id: "hist-003",
      name: "Biodiversidad - Q4 2024",
      type: "biodiversity",
      description: "Informe trimestral de biodiversidad",
      lastGenerated: new Date(2024, 11, 15), // 15 de diciembre de 2024
      status: "ready",
      format: "excel",
      size: "8.5 MB",
    },
    {
      id: "hist-004",
      name: "Informe Ejecutivo - Q4 2024",
      type: "executive",
      description: "Resumen ejecutivo trimestral",
      lastGenerated: new Date(2024, 11, 20), // 20 de diciembre de 2024
      status: "ready",
      format: "pdf",
      size: "3.2 MB",
    },
    {
      id: "hist-005",
      name: "Captura de CO2 - Anual 2024",
      type: "co2-capture",
      description: "Análisis anual de captura de carbono",
      lastGenerated: new Date(2024, 11, 31), // 31 de diciembre de 2024
      status: "ready",
      format: "pdf",
      size: "12.7 MB",
    },
    {
      id: "hist-006",
      name: "Erosión Costera - Q4 2024",
      type: "coastal-erosion",
      description: "Análisis trimestral de erosión costera",
      lastGenerated: new Date(2024, 11, 18), // 18 de diciembre de 2024
      status: "ready",
      format: "pdf",
      size: "10.3 MB",
    },
  ]

  // Filtrar reportes según el tipo seleccionado y la búsqueda
  const filteredAvailableReports = availableReports.filter((report) => {
    const matchesType = selectedReportType === "all" || report.type === selectedReportType
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const filteredHistoryReports = reportHistory.filter((report) => {
    const matchesType = selectedReportType === "all" || report.type === selectedReportType
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  // Función para formatear fechas
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Función para simular la generación de un reporte
  const handleGenerateReport = () => {
    setIsGeneratingReport(true)
    setGenerationProgress(0)

    // Simular progreso
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsGeneratingReport(false)
            setGenerationProgress(0)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // Función para obtener el icono según el tipo de reporte
  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case "deforestation":
        return <Trees className="h-5 w-5 text-red-500" />
      case "biodiversity":
        return <Leaf className="h-5 w-5 text-green-500" />
      case "coastal-erosion":
        return <Waves className="h-5 w-5 text-blue-500" />
      case "co2-capture":
        return <Cloud className="h-5 w-5 text-cyan-500" />
      case "real-time":
        return <Activity className="h-5 w-5 text-purple-500" />
      case "executive":
        return <BarChart3 className="h-5 w-5 text-amber-500" />
      case "compliance":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case "sustainability":
        return <Leaf className="h-5 w-5 text-teal-500" />
      default:
        return <FileText className="h-5 w-5 text-slate-500" />
    }
  }

  // Función para obtener el icono según el formato del reporte
  const getFormatIcon = (format: ReportFormat) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-400" />
      case "excel":
        return <FileSpreadsheet className="h-4 w-4 text-green-400" />
      case "csv":
        return <FileBarChart className="h-4 w-4 text-blue-400" />
      case "json":
        return <FilePieChart className="h-4 w-4 text-purple-400" />
      default:
        return <FileText className="h-4 w-4 text-slate-400" />
    }
  }

  // Función para obtener el icono según el estado del reporte
  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "processing":
        return <RefreshCw className="h-4 w-4 text-amber-500 animate-spin" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Función para obtener el badge según el estado del reporte
  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Listo</Badge>
      case "processing":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Procesando</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Programado</Badge>
      case "error":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>
      default:
        return null
    }
  }

  // Función para obtener el badge según la frecuencia del reporte
  const getFrequencyBadge = (frequency: ReportFrequency) => {
    switch (frequency) {
      case "daily":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Diario</Badge>
      case "weekly":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Semanal</Badge>
      case "monthly":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Mensual</Badge>
      case "quarterly":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Trimestral</Badge>
      case "annual":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Anual</Badge>
      case "custom":
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Personalizado</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-100 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-indigo-500" />
              Centro de Reportes - Sistema de Manglares
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-slate-800/50 text-indigo-400 border-indigo-500/50 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-1"></div>
                REPORTES DISPONIBLES: {availableReports.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Barra de filtros y búsqueda */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-[200px]">
                <Select
                  value={selectedReportType}
                  onValueChange={(value) => setSelectedReportType(value as ReportType | "all")}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                    <SelectValue placeholder="Tipo de reporte" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectItem value="all">Todos los reportes</SelectItem>
                    <SelectItem value="deforestation">Deforestación</SelectItem>
                    <SelectItem value="biodiversity">Biodiversidad</SelectItem>
                    <SelectItem value="coastal-erosion">Erosión Costera</SelectItem>
                    <SelectItem value="co2-capture">Captura de CO2</SelectItem>
                    <SelectItem value="real-time">Tiempo Real</SelectItem>
                    <SelectItem value="executive">Ejecutivo</SelectItem>
                    <SelectItem value="compliance">Cumplimiento</SelectItem>
                    <SelectItem value="sustainability">Sostenibilidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <Select value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                    <SelectValue placeholder="Rango de fechas" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectItem value="last-week">Última semana</SelectItem>
                    <SelectItem value="last-month">Último mes</SelectItem>
                    <SelectItem value="last-quarter">Último trimestre</SelectItem>
                    <SelectItem value="last-year">Último año</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar reportes..."
                  className="pl-8 bg-slate-800/50 border-slate-700/50 text-slate-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button variant="outline" size="icon" className="bg-slate-800/50 border-slate-700/50 text-slate-300">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="available" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800/50 p-1 mb-6">
              <TabsTrigger
                value="available"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-400"
              >
                Reportes Disponibles
              </TabsTrigger>
              <TabsTrigger
                value="generate"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-400"
              >
                Generar Reporte
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-400"
              >
                Reportes Programados
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-400"
              >
                Historial
              </TabsTrigger>
            </TabsList>

            {/* Pestaña de Reportes Disponibles */}
            <TabsContent value="available" className="mt-0">
              {filteredAvailableReports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAvailableReports.map((report) => (
                    <Card key={report.id} className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
                      <div className="flex h-full flex-col">
                        <div className="relative h-32 bg-slate-700/50">
                          {report.thumbnail && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <img
                                src={report.thumbnail || "/placeholder.svg"}
                                alt={report.name}
                                className="h-full w-full object-cover opacity-70"
                              />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">{getStatusBadge(report.status)}</div>
                          <div className="absolute bottom-2 left-2 flex items-center">
                            {getReportTypeIcon(report.type)}
                            <Badge className="ml-2 bg-slate-900/70 text-slate-300 border-slate-700/50">
                              {report.format.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="flex-1 p-4">
                          <h3 className="text-sm font-medium text-slate-200 mb-2">{report.name}</h3>
                          <p className="text-xs text-slate-400 mb-3 line-clamp-2">{report.description}</p>

                          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                            {report.lastGenerated && <div>Generado: {formatDate(report.lastGenerated)}</div>}
                            {report.size && <div>{report.size}</div>}
                          </div>
                        </CardContent>

                        <CardFooter className="p-3 pt-0 flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-slate-800/70 border-slate-700/50 text-slate-300 hover:bg-slate-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Vista previa
                          </Button>

                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={report.status !== "ready"}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Descargar
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-8 text-center">
                  <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">No se encontraron reportes</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    No hay reportes disponibles que coincidan con los criterios de búsqueda. Intenta cambiar los filtros
                    o crear un nuevo reporte.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Pestaña de Generar Reporte */}
            <TabsContent value="generate" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-slate-200">Configuración del Reporte</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="report-name" className="text-slate-300">
                          Nombre del Reporte
                        </Label>
                        <Input
                          id="report-name"
                          placeholder="Ej: Informe de Deforestación - Marzo 2025"
                          className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="report-type" className="text-slate-300">
                            Tipo de Reporte
                          </Label>
                          <Select defaultValue="deforestation">
                            <SelectTrigger
                              id="report-type"
                              className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                            >
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                              <SelectItem value="deforestation">Deforestación</SelectItem>
                              <SelectItem value="biodiversity">Biodiversidad</SelectItem>
                              <SelectItem value="coastal-erosion">Erosión Costera</SelectItem>
                              <SelectItem value="co2-capture">Captura de CO2</SelectItem>
                              <SelectItem value="real-time">Tiempo Real</SelectItem>
                              <SelectItem value="executive">Ejecutivo</SelectItem>
                              <SelectItem value="compliance">Cumplimiento</SelectItem>
                              <SelectItem value="sustainability">Sostenibilidad</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="report-format" className="text-slate-300">
                            Formato
                          </Label>
                          <Select
                            value={selectedFormat}
                            onValueChange={(value) => setSelectedFormat(value as ReportFormat)}
                          >
                            <SelectTrigger
                              id="report-format"
                              className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                            >
                              <SelectValue placeholder="Seleccionar formato" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="excel">Excel</SelectItem>
                              <SelectItem value="csv">CSV</SelectItem>
                              <SelectItem value="json">JSON</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">Período de Datos</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="date-from" className="text-xs text-slate-400">
                              Desde
                            </Label>
                            <Input
                              id="date-from"
                              type="date"
                              className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                              defaultValue="2025-02-01"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="date-to" className="text-xs text-slate-400">
                              Hasta
                            </Label>
                            <Input
                              id="date-to"
                              type="date"
                              className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                              defaultValue="2025-03-01"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-slate-700/50" />

                      <div className="space-y-2">
                        <Label className="text-slate-300">Contenido del Reporte</Label>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="content-summary" defaultChecked />
                            <Label htmlFor="content-summary" className="text-sm text-slate-400">
                              Resumen ejecutivo
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="content-charts" defaultChecked />
                            <Label htmlFor="content-charts" className="text-sm text-slate-400">
                              Gráficos y visualizaciones
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="content-tables" defaultChecked />
                            <Label htmlFor="content-tables" className="text-sm text-slate-400">
                              Tablas de datos
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="content-maps" defaultChecked />
                            <Label htmlFor="content-maps" className="text-sm text-slate-400">
                              Mapas geoespaciales
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="content-recommendations" defaultChecked />
                            <Label htmlFor="content-recommendations" className="text-sm text-slate-400">
                              Recomendaciones y acciones
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="content-raw" />
                            <Label htmlFor="content-raw" className="text-sm text-slate-400">
                              Datos brutos para análisis
                            </Label>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-slate-700/50" />

                      <div className="space-y-2">
                        <Label className="text-slate-300">Opciones Adicionales</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="option-schedule" />
                            <Label htmlFor="option-schedule" className="text-sm text-slate-400">
                              Programar generación periódica
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="option-email" />
                            <Label htmlFor="option-email" className="text-sm text-slate-400">
                              Enviar por correo electrónico
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="option-compare" />
                            <Label htmlFor="option-compare" className="text-sm text-slate-400">
                              Incluir comparativa histórica
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="option-metadata" />
                            <Label htmlFor="option-metadata" className="text-sm text-slate-400">
                              Incluir metadatos
                            </Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  <Card className="bg-slate-800/50 border-slate-700/50 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-slate-200">Vista Previa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-slate-700/30 rounded-lg border border-slate-700/50 p-4 h-64 flex items-center justify-center">
                        {selectedFormat === "pdf" ? (
                          <div className="text-center">
                            <FileText className="h-16 w-16 text-red-400/70 mx-auto mb-2" />
                            <div className="text-sm text-slate-400">Vista previa del PDF</div>
                            <div className="text-xs text-slate-500 mt-1">Informe de Deforestación</div>
                          </div>
                        ) : selectedFormat === "excel" ? (
                          <div className="text-center">
                            <FileSpreadsheet className="h-16 w-16 text-green-400/70 mx-auto mb-2" />
                            <div className="text-sm text-slate-400">Vista previa de Excel</div>
                            <div className="text-xs text-slate-500 mt-1">Datos tabulares</div>
                          </div>
                        ) : selectedFormat === "csv" ? (
                          <div className="text-center">
                            <FileBarChart className="h-16 w-16 text-blue-400/70 mx-auto mb-2" />
                            <div className="text-sm text-slate-400">Vista previa de CSV</div>
                            <div className="text-xs text-slate-500 mt-1">Datos delimitados por comas</div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <FilePieChart className="h-16 w-16 text-purple-400/70 mx-auto mb-2" />
                            <div className="text-sm text-slate-400">Vista previa de JSON</div>
                            <div className="text-xs text-slate-500 mt-1">Datos estructurados</div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Tipo:</span>
                          <span className="text-slate-300">Deforestación</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Formato:</span>
                          <span className="text-slate-300">{selectedFormat.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Período:</span>
                          <span className="text-slate-300">Feb - Mar 2025</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Tamaño estimado:</span>
                          <span className="text-slate-300">4.5 MB</span>
                        </div>
                      </div>

                      {isGeneratingReport ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Generando reporte...</span>
                            <span className="text-slate-300">{generationProgress}%</span>
                          </div>
                          <Progress value={generationProgress} className="h-2 bg-slate-700">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                              style={{ width: `${generationProgress}%` }}
                            />
                          </Progress>
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={handleGenerateReport}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Generar Reporte
                        </Button>
                      )}

                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-slate-800/70 border-slate-700/50 text-slate-300"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Compartir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-slate-800/70 border-slate-700/50 text-slate-300"
                        >
                          <Printer className="h-4 w-4 mr-1" />
                          Imprimir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Pestaña de Reportes Programados */}
            <TabsContent value="scheduled" className="mt-0">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700/50 bg-slate-800/70">
                          <th className="text-left p-3 text-xs font-medium text-slate-400">Nombre</th>
                          <th className="text-left p-3 text-xs font-medium text-slate-400">Tipo</th>
                          <th className="text-left p-3 text-xs font-medium text-slate-400">Frecuencia</th>
                          <th className="text-left p-3 text-xs font-medium text-slate-400">Próxima Generación</th>
                          <th className="text-left p-3 text-xs font-medium text-slate-400">Destinatarios</th>
                          <th className="text-left p-3 text-xs font-medium text-slate-400">Formato</th>
                          <th className="text-left p-3 text-xs font-medium text-slate-400">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {scheduledReports.map((report) => (
                          <tr key={report.id} className="hover:bg-slate-800/30">
                            <td className="p-3 text-sm text-slate-300">{report.name}</td>
                            <td className="p-3 text-sm">
                              <div className="flex items-center">
                                {getReportTypeIcon(report.type)}
                                <span className="ml-2 text-slate-400">
                                  {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">{getFrequencyBadge(report.frequency)}</td>
                            <td className="p-3 text-sm text-slate-400">{formatDate(report.nextGeneration)}</td>
                            <td className="p-3 text-sm text-slate-400">
                              <div className="flex items-center">
                                <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/50">
                                  {report.recipients.length}
                                </Badge>
                                <span className="ml-2 text-xs truncate max-w-[120px]">{report.recipients[0]}</span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <div className="flex items-center">
                                {getFormatIcon(report.format)}
                                <span className="ml-2 text-slate-400">{report.format.toUpperCase()}</span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-400 hover:text-slate-100"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-400 hover:text-slate-100"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-slate-400 hover:text-slate-100"
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-slate-800 border-slate-700 text-slate-100">
                                    <DropdownMenuItem className="cursor-pointer">Editar</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Pausar</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer text-red-400">
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 flex justify-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Programar Nuevo Reporte
                </Button>
              </div>
            </TabsContent>

            {/* Pestaña de Historial */}
            <TabsContent value="history" className="mt-0">
              <Accordion
                type="single"
                collapsible
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden"
              >
                {filteredHistoryReports.map((report) => (
                  <AccordionItem
                    key={report.id}
                    value={report.id}
                    className="border-b border-slate-700/50 last:border-0"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-slate-800/70 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          {getReportTypeIcon(report.type)}
                          <span className="ml-2 text-sm font-medium text-slate-300">{report.name}</span>
                        </div>
                        <div className="flex items-center space-x-4 mr-4">
                          <div className="flex items-center">
                            {getFormatIcon(report.format)}
                            <span className="ml-1 text-xs text-slate-400">{report.format.toUpperCase()}</span>
                          </div>
                          <span className="text-xs text-slate-500">{formatDate(report.lastGenerated)}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 bg-slate-800/30">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <div className="text-xs text-slate-400 mb-2">{report.description}</div>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <div>Generado: {formatDate(report.lastGenerated)}</div>
                            <div>Tamaño: {report.size}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-slate-800/70 border-slate-700/50 text-slate-300"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Download className="h-4 w-4 mr-1" />
                            Descargar
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredHistoryReports.length === 0 && (
                <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-8 text-center">
                  <Clock className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">No hay historial disponible</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    No se encontraron reportes en el historial que coincidan con los criterios de búsqueda.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sección de Reportes Destacados */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-100 text-base">Reportes Destacados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeaturedReportCard
              title="Informe Ejecutivo"
              description="Resumen para tomadores de decisiones con indicadores clave"
              icon={BarChart3}
              color="amber"
            />
            <FeaturedReportCard
              title="Análisis de Deforestación"
              description="Evaluación detallada de pérdida de manglar"
              icon={Trees}
              color="red"
            />
            <FeaturedReportCard
              title="Estado de Biodiversidad"
              description="Inventario y estado de conservación de especies"
              icon={Leaf}
              color="green"
            />
            <FeaturedReportCard
              title="Captura de Carbono"
              description="Análisis de servicios ecosistémicos de carbono"
              icon={Cloud}
              color="cyan"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para tarjetas de reportes destacados
function FeaturedReportCard({
  title,
  description,
  icon: Icon,
  color,
}: {
  title: string
  description: string
  icon: React.ElementType
  color: string
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
      case "purple":
        return "from-purple-500 to-pink-500 border-purple-500/30"
      default:
        return "from-indigo-500 to-purple-500 border-indigo-500/30"
    }
  }

  return (
    <div
      className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden hover:bg-slate-800/70 transition-colors cursor-pointer`}
    >
      <div className="flex items-center mb-2">
        <Icon className={`h-5 w-5 text-${color}-500 mr-2`} />
        <div className="text-sm font-medium text-slate-200">{title}</div>
      </div>
      <div className="text-xs text-slate-400 mb-3">{description}</div>
      <div className="flex items-center text-xs text-indigo-400">
        <FileText className="h-3 w-3 mr-1" />
        <span>Ver reporte</span>
      </div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-indigo-500 to-purple-500"></div>
    </div>
  )
}

