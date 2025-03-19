"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Activity,
  AlertCircle,
  Download,
  RefreshCw,
  Radio,
  Zap,
  Wifi,
  Cpu,
  HardDrive,
  ArrowUpRight,
  ArrowDownRight,
  Pause,
  Play,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Definir el tipo para los datos de monitoreo en tiempo real
type SystemMetric = {
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical" | "offline"
  history: number[]
}

type SystemEvent = {
  id: string
  timestamp: Date
  type: "info" | "warning" | "error" | "success"
  source: string
  message: string
}

type SensorData = {
  id: string
  name: string
  location: string
  type: string
  value: number
  unit: string
  status: "online" | "offline" | "maintenance"
  lastUpdate: Date
  battery?: number
}

interface RealTimeMonitoringViewProps {
  metrics?: SystemMetric[]
  events?: SystemEvent[]
  sensors?: SensorData[]
}

export default function RealTimeMonitoringView({
  metrics = [],
  events = [],
  sensors = [],
}: RealTimeMonitoringViewProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isPaused, setIsPaused] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>(metrics.length > 0 ? metrics : defaultMetrics)
  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>(events.length > 0 ? events : defaultEvents)
  const [sensorData, setSensorData] = useState<SensorData[]>(sensors.length > 0 ? sensors : defaultSensors)
  const [cpuUsage, setCpuUsage] = useState(42)
  const [memoryUsage, setMemoryUsage] = useState(68)
  const [networkStatus, setNetworkStatus] = useState(92)

  // Actualizar el tiempo actual
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Simular actualizaciones de datos en tiempo real
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      // Actualizar métricas del sistema
      setSystemMetrics((prevMetrics) =>
        prevMetrics.map((metric) => {
          // Generar un nuevo valor aleatorio cercano al valor actual
          const change = (Math.random() - 0.5) * 10
          const newValue = Math.max(0, Math.min(100, metric.value + change))

          // Actualizar el historial
          const newHistory = [...metric.history.slice(-19), newValue]

          // Determinar el estado basado en el nuevo valor
          let status = metric.status
          if (newValue > 90) status = "critical"
          else if (newValue > 75) status = "warning"
          else status = "normal"

          return {
            ...metric,
            value: Number.parseFloat(newValue.toFixed(1)),
            history: newHistory,
            status,
          }
        }),
      )

      // Actualizar uso de CPU, memoria y red
      setCpuUsage((prev) => Math.floor(Math.random() * 30) + 30)
      setMemoryUsage((prev) => Math.floor(Math.random() * 20) + 60)
      setNetworkStatus((prev) => Math.floor(Math.random() * 15) + 80)

      // Actualizar datos de sensores
      setSensorData((prevSensors) =>
        prevSensors.map((sensor) => {
          if (sensor.status !== "online") return sensor

          // Generar un nuevo valor aleatorio cercano al valor actual
          const change = (Math.random() - 0.5) * 5
          const newValue = Math.max(0, sensor.value + change)

          // Actualizar la batería si existe
          const newBattery = sensor.battery
            ? Math.max(0, Math.min(100, sensor.battery - Math.random() * 0.2))
            : undefined

          return {
            ...sensor,
            value: Number.parseFloat(newValue.toFixed(2)),
            lastUpdate: new Date(),
            battery: newBattery,
          }
        }),
      )

      // Ocasionalmente agregar un nuevo evento (10% de probabilidad)
      if (Math.random() < 0.1) {
        const eventTypes: ("info" | "warning" | "error" | "success")[] = ["info", "warning", "error", "success"]
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
        const sources = ["Sistema", "Sensor", "Red", "Base de datos", "API"]
        const source = sources[Math.floor(Math.random() * sources.length)]

        const messages = {
          info: [
            "Actualización de datos completada",
            "Conexión establecida con éxito",
            "Sincronización de sensores completada",
          ],
          warning: ["Latencia elevada en la red", "Uso de CPU por encima del umbral", "Batería baja en sensor remoto"],
          error: ["Pérdida de conexión con sensor", "Error en la transmisión de datos", "Fallo en la sincronización"],
          success: [
            "Mantenimiento programado completado",
            "Actualización de firmware exitosa",
            "Calibración de sensores completada",
          ],
        }

        const message = messages[eventType][Math.floor(Math.random() * messages[eventType].length)]

        const newEvent: SystemEvent = {
          id: `evt-${Date.now()}`,
          timestamp: new Date(),
          type: eventType,
          source,
          message,
        }

        setSystemEvents((prev) => [newEvent, ...prev].slice(0, 50))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused])

  // Formatear tiempo
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-CO", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Formatear fecha
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Formatear tiempo relativo
  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSeconds < 60) return `hace ${diffSeconds} seg`
    if (diffSeconds < 3600) return `hace ${Math.floor(diffSeconds / 60)} min`
    if (diffSeconds < 86400) return `hace ${Math.floor(diffSeconds / 3600)} h`
    return `hace ${Math.floor(diffSeconds / 86400)} d`
  }

  // Calcular el estado general del sistema
  const getSystemStatus = () => {
    const criticalCount = systemMetrics.filter((m) => m.status === "critical").length
    const warningCount = systemMetrics.filter((m) => m.status === "warning").length
    const offlineCount = systemMetrics.filter((m) => m.status === "offline").length

    if (criticalCount > 0) return "critical"
    if (warningCount > 0) return "warning"
    if (offlineCount > 0) return "degraded"
    return "normal"
  }

  const systemStatus = getSystemStatus()

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-100 flex items-center">
              <Activity className="mr-2 h-5 w-5 text-purple-500" />
              Monitoreo en Tiempo Real - Sistema de Manglares
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-slate-400 hover:text-slate-100"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Reanudar
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pausar
                    </>
                  )}
                </Button>
              </div>
              <StatusBadge status={systemStatus} />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Reloj y estado del sistema */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700/50 col-span-1">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xs text-slate-500 mb-1 font-mono">TIEMPO DEL SISTEMA</div>
                  <div className="text-2xl font-mono text-purple-400 mb-1">{formatTime(currentTime)}</div>
                  <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    {isPaused ? "Monitoreo en pausa" : "Monitoreo activo"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 col-span-2">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <MetricCard title="CPU" value={cpuUsage} icon={Cpu} color="cyan" />
                  <MetricCard title="Memoria" value={memoryUsage} icon={HardDrive} color="purple" />
                  <MetricCard title="Red" value={networkStatus} icon={Wifi} color="blue" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="dashboard" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-slate-800/50 p-1">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-purple-400"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="sensors"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-purple-400"
                >
                  Sensores
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-purple-400"
                >
                  Eventos
                </TabsTrigger>
              </TabsList>

              <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700/50 text-slate-300">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
            </div>

            <TabsContent value="dashboard" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {systemMetrics.map((metric, index) => (
                  <LiveMetricCard
                    key={index}
                    name={metric.name}
                    value={metric.value}
                    unit={metric.unit}
                    status={metric.status}
                    history={metric.history}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sensors" className="mt-0">
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                  <div className="col-span-2">Sensor</div>
                  <div className="col-span-2">Ubicación</div>
                  <div className="col-span-2">Tipo</div>
                  <div className="col-span-2">Valor</div>
                  <div className="col-span-2">Estado</div>
                  <div className="col-span-2">Última Actualización</div>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {sensorData.map((sensor) => (
                    <SensorRow
                      key={sensor.id}
                      name={sensor.name}
                      location={sensor.location}
                      type={sensor.type}
                      value={sensor.value}
                      unit={sensor.unit}
                      status={sensor.status}
                      lastUpdate={sensor.lastUpdate}
                      battery={sensor.battery}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                  <div className="col-span-2">Hora</div>
                  <div className="col-span-2">Fuente</div>
                  <div className="col-span-1">Tipo</div>
                  <div className="col-span-7">Mensaje</div>
                </div>

                <div className="divide-y divide-slate-700/30 max-h-[500px] overflow-y-auto">
                  {systemEvents.map((event) => (
                    <EventRow
                      key={event.id}
                      timestamp={event.timestamp}
                      source={event.source}
                      type={event.type}
                      message={event.message}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Controles de monitoreo */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-200 mb-4">Configuración de Monitoreo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Frecuencia de Actualización</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Radio className="text-purple-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Actualización Rápida (1s)</Label>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Radio className="text-purple-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Actualización Normal (3s)</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Radio className="text-purple-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Actualización Lenta (10s)</Label>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Notificaciones</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertCircle className="text-purple-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Alertas Críticas</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertCircle className="text-purple-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Alertas de Advertencia</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Zap className="text-purple-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Notificaciones por Email</Label>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Datos de métricas por defecto
const defaultMetrics: SystemMetric[] = [
  {
    name: "Temperatura del Agua",
    value: 27.5,
    unit: "°C",
    status: "normal",
    history: [
      26.8, 27.0, 27.2, 27.3, 27.5, 27.6, 27.8, 27.9, 28.0, 28.1, 28.0, 27.9, 27.8, 27.7, 27.6, 27.5, 27.4, 27.3, 27.4,
      27.5,
    ],
  },
  {
    name: "Nivel del Agua",
    value: 82.3,
    unit: "cm",
    status: "normal",
    history: [
      80.1, 80.5, 81.0, 81.3, 81.5, 81.8, 82.0, 82.1, 82.2, 82.3, 82.4, 82.5, 82.4, 82.3, 82.2, 82.1, 82.0, 82.1, 82.2,
      82.3,
    ],
  },
  {
    name: "Salinidad",
    value: 35.2,
    unit: "ppt",
    status: "normal",
    history: [
      34.5, 34.6, 34.7, 34.8, 34.9, 35.0, 35.1, 35.2, 35.3, 35.4, 35.5, 35.6, 35.5, 35.4, 35.3, 35.2, 35.1, 35.2, 35.2,
      35.2,
    ],
  },
  {
    name: "Oxígeno Disuelto",
    value: 6.8,
    unit: "mg/L",
    status: "normal",
    history: [6.5, 6.5, 6.6, 6.6, 6.7, 6.7, 6.8, 6.8, 6.9, 6.9, 7.0, 7.0, 6.9, 6.9, 6.8, 6.8, 6.7, 6.7, 6.8, 6.8],
  },
  {
    name: "pH",
    value: 8.1,
    unit: "",
    status: "normal",
    history: [8.0, 8.0, 8.0, 8.1, 8.1, 8.1, 8.1, 8.2, 8.2, 8.2, 8.2, 8.2, 8.2, 8.1, 8.1, 8.1, 8.1, 8.1, 8.1, 8.1],
  },
  {
    name: "Turbidez",
    value: 12.5,
    unit: "NTU",
    status: "warning",
    history: [
      10.2, 10.5, 10.8, 11.0, 11.3, 11.5, 11.8, 12.0, 12.2, 12.5, 12.8, 13.0, 13.2, 13.0, 12.8, 12.5, 12.3, 12.4, 12.5,
      12.5,
    ],
  },
]

// Datos de eventos por defecto
const defaultEvents: SystemEvent[] = [
  {
    id: "evt-001",
    timestamp: new Date(Date.now() - 120000), // 2 minutos atrás
    type: "info",
    source: "Sistema",
    message: "Inicio de monitoreo en tiempo real",
  },
  {
    id: "evt-002",
    timestamp: new Date(Date.now() - 100000), // 1.6 minutos atrás
    type: "success",
    source: "Sensores",
    message: "Todos los sensores conectados correctamente",
  },
  {
    id: "evt-003",
    timestamp: new Date(Date.now() - 80000), // 1.3 minutos atrás
    type: "warning",
    source: "Sensor",
    message: "Sensor de turbidez reportando valores elevados",
  },
  {
    id: "evt-004",
    timestamp: new Date(Date.now() - 60000), // 1 minuto atrás
    type: "info",
    source: "Sistema",
    message: "Sincronización de datos completada",
  },
  {
    id: "evt-005",
    timestamp: new Date(Date.now() - 30000), // 30 segundos atrás
    type: "info",
    source: "Red",
    message: "Conexión estable con todos los nodos",
  },
]

// Datos de sensores por defecto
const defaultSensors: SensorData[] = [
  {
    id: "sens-001",
    name: "Temp-01",
    location: "Manglar Norte",
    type: "Temperatura",
    value: 27.5,
    unit: "°C",
    status: "online",
    lastUpdate: new Date(Date.now() - 5000),
    battery: 85,
  },
  {
    id: "sens-002",
    name: "Nivel-01",
    location: "Manglar Norte",
    type: "Nivel de Agua",
    value: 82.3,
    unit: "cm",
    status: "online",
    lastUpdate: new Date(Date.now() - 8000),
    battery: 92,
  },
  {
    id: "sens-003",
    name: "Sal-01",
    location: "Manglar Norte",
    type: "Salinidad",
    value: 35.2,
    unit: "ppt",
    status: "online",
    lastUpdate: new Date(Date.now() - 12000),
    battery: 78,
  },
  {
    id: "sens-004",
    name: "Oxy-01",
    location: "Bahía Colombia",
    type: "Oxígeno",
    value: 6.8,
    unit: "mg/L",
    status: "online",
    lastUpdate: new Date(Date.now() - 7000),
    battery: 81,
  },
  {
    id: "sens-005",
    name: "pH-01",
    location: "Bahía Colombia",
    type: "pH",
    value: 8.1,
    unit: "",
    status: "online",
    lastUpdate: new Date(Date.now() - 15000),
    battery: 65,
  },
  {
    id: "sens-006",
    name: "Turb-01",
    location: "Desembocadura",
    type: "Turbidez",
    value: 12.5,
    unit: "NTU",
    status: "online",
    lastUpdate: new Date(Date.now() - 10000),
    battery: 73,
  },
  {
    id: "sens-007",
    name: "Temp-02",
    location: "Punta Caimán",
    type: "Temperatura",
    value: 28.2,
    unit: "°C",
    status: "online",
    lastUpdate: new Date(Date.now() - 9000),
    battery: 89,
  },
  {
    id: "sens-008",
    name: "Nivel-02",
    location: "Punta Caimán",
    type: "Nivel de Agua",
    value: 75.8,
    unit: "cm",
    status: "maintenance",
    lastUpdate: new Date(Date.now() - 3600000), // 1 hora atrás
    battery: 45,
  },
  {
    id: "sens-009",
    name: "Sal-02",
    location: "Necoclí",
    type: "Salinidad",
    value: 33.7,
    unit: "ppt",
    status: "offline",
    lastUpdate: new Date(Date.now() - 7200000), // 2 horas atrás
    battery: 0,
  },
]

// Componente para tarjetas de métricas simples
function MetricCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: number
  icon: React.ElementType
  color: string
}) {
  const getColor = () => {
    switch (color) {
      case "green":
        return "from-green-500 to-teal-500"
      case "cyan":
        return "from-cyan-500 to-blue-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "purple":
        return "from-purple-500 to-pink-500"
      default:
        return "from-purple-500 to-pink-500"
    }
  }

  const getStatusColor = () => {
    if (value > 90) return "text-red-500"
    if (value > 75) return "text-amber-500"
    return "text-green-500"
  }

  return (
    <div className="bg-slate-800/70 rounded-lg p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-slate-200">{value}%</div>
        <div className={getStatusColor()}>
          {value > 90 ? (
            <ArrowUpRight className="h-5 w-5" />
          ) : value > 75 ? (
            <ArrowUpRight className="h-5 w-5" />
          ) : (
            <ArrowDownRight className="h-5 w-5" />
          )}
        </div>
      </div>
      <div className="mt-2">
        <Progress value={value} className="h-1.5 bg-slate-700">
          <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }} />
        </Progress>
      </div>
    </div>
  )
}

// Componente para tarjetas de métricas en vivo
function LiveMetricCard({
  name,
  value,
  unit,
  status,
  history,
}: {
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical" | "offline"
  history: number[]
}) {
  const getStatusColor = () => {
    switch (status) {
      case "critical":
        return "text-red-500"
      case "warning":
        return "text-amber-500"
      case "offline":
        return "text-slate-500"
      default:
        return "text-green-500"
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "critical":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Crítico</Badge>
      case "warning":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Advertencia</Badge>
      case "offline":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Offline</Badge>
      default:
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Normal</Badge>
    }
  }

  // Encontrar el valor mínimo y máximo para escalar el gráfico
  const minValue = Math.min(...history)
  const maxValue = Math.max(...history)
  const range = maxValue - minValue || 1 // Evitar división por cero

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-slate-300">{name}</div>
        {getStatusBadge()}
      </div>

      <div className="flex items-end space-x-2 mb-4">
        <div className="text-2xl font-bold text-slate-100">{value}</div>
        <div className="text-sm text-slate-400 mb-1">{unit}</div>
      </div>

      {/* Mini gráfico de línea */}
      <div className="h-16 w-full">
        <div className="relative h-full w-full">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`gradient-${name.replace(/\s+/g, "-")}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#d946ef" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Línea del gráfico */}
            <polyline
              points={history
                .map((val, i) => {
                  const x = (i / (history.length - 1)) * 100 + "%"
                  const y = 100 - ((val - minValue) / range) * 100 + "%"
                  return `${x},${y}`
                })
                .join(" ")}
              fill="none"
              stroke={status === "critical" ? "#ef4444" : status === "warning" ? "#f59e0b" : "#8b5cf6"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Área bajo la línea */}
            <polygon
              points={`
                0,100% 
                ${history
                  .map((val, i) => {
                    const x = (i / (history.length - 1)) * 100 + "%"
                    const y = 100 - ((val - minValue) / range) * 100 + "%"
                    return `${x},${y}`
                  })
                  .join(" ")} 
                100%,100%
              `}
              fill={`url(#gradient-${name.replace(/\s+/g, "-")})`}
              opacity="0.5"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

// Componente para filas de sensores
function SensorRow({
  name,
  location,
  type,
  value,
  unit,
  status,
  lastUpdate,
  battery,
}: {
  name: string
  location: string
  type: string
  value: number
  unit: string
  status: "online" | "offline" | "maintenance"
  lastUpdate: Date
  battery?: number
}) {
  const getStatusBadge = () => {
    switch (status) {
      case "online":
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span className="text-green-400">Online</span>
            {battery !== undefined && <div className="ml-2 text-xs text-slate-500">{battery}%</div>}
          </div>
        )
      case "offline":
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
            <span className="text-red-400">Offline</span>
          </div>
        )
      case "maintenance":
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-amber-400">Mantenimiento</span>
          </div>
        )
      default:
        return null
    }
  }

  // Formatear tiempo relativo
  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSeconds < 60) return `hace ${diffSeconds} seg`
    if (diffSeconds < 3600) return `hace ${Math.floor(diffSeconds / 60)} min`
    if (diffSeconds < 86400) return `hace ${Math.floor(diffSeconds / 3600)} h`
    return `hace ${Math.floor(diffSeconds / 86400)} d`
  }

  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-2 text-slate-300">{name}</div>
      <div className="col-span-2 text-slate-400">{location}</div>
      <div className="col-span-2 text-slate-400">{type}</div>
      <div className="col-span-2 text-purple-400">
        {value} {unit}
      </div>
      <div className="col-span-2">{getStatusBadge()}</div>
      <div className="col-span-2 text-slate-500">{getRelativeTime(lastUpdate)}</div>
    </div>
  )
}

// Componente para filas de eventos
function EventRow({
  timestamp,
  source,
  type,
  message,
}: {
  timestamp: Date
  source: string
  type: "info" | "warning" | "error" | "success"
  message: string
}) {
  const getTypeIcon = () => {
    switch (type) {
      case "info":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Info</Badge>
      case "warning":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Aviso</Badge>
      case "error":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>
      case "success":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Éxito</Badge>
      default:
        return null
    }
  }

  // Formatear tiempo
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-CO", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-2 text-slate-500">{formatTime(timestamp)}</div>
      <div className="col-span-2 text-slate-400">{source}</div>
      <div className="col-span-1">{getTypeIcon()}</div>
      <div className="col-span-7 text-slate-300">{message}</div>
    </div>
  )
}

// Componente para badge de estado del sistema
function StatusBadge({ status }: { status: "normal" | "warning" | "critical" | "degraded" }) {
  switch (status) {
    case "normal":
      return (
        <Badge variant="outline" className="bg-slate-800/50 text-green-400 border-green-500/50 text-xs">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></div>
          SISTEMA NORMAL
        </Badge>
      )
    case "warning":
      return (
        <Badge variant="outline" className="bg-slate-800/50 text-amber-400 border-amber-500/50 text-xs">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1 animate-pulse"></div>
          ADVERTENCIAS
        </Badge>
      )
    case "critical":
      return (
        <Badge variant="outline" className="bg-slate-800/50 text-red-400 border-red-500/50 text-xs">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1 animate-pulse"></div>
          ALERTA CRÍTICA
        </Badge>
      )
    case "degraded":
      return (
        <Badge variant="outline" className="bg-slate-800/50 text-blue-400 border-blue-500/50 text-xs">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1 animate-pulse"></div>
          SERVICIO DEGRADADO
        </Badge>
      )
    default:
      return null
  }
}

