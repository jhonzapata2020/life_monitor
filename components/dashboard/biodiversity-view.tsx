"use client"

import { useState } from "react"
import { AlertCircle, BarChart3, Download, Leaf, RefreshCw, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// Definir el tipo para los datos de biodiversidad
type BiodiversityData = {
  species: string
  count: number
  trend: "increasing" | "stable" | "decreasing"
  status: "endangered" | "vulnerable" | "stable"
  icon: string
}

interface BiodiversityViewProps {
  speciesCount: number
  endangeredCount: number
  species: BiodiversityData[]
}

export default function BiodiversityView({
  speciesCount = 187,
  endangeredCount = 42,
  species = [],
}: BiodiversityViewProps) {
  const [activeTab, setActiveTab] = useState("especies")
  const [searchTerm, setSearchTerm] = useState("")

  // Formatear número con separador de miles
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-CO").format(num)
  }

  // Filtrar especies por término de búsqueda
  const filteredSpecies =
    species.length > 0
      ? species.filter((s) => s.species.toLowerCase().includes(searchTerm.toLowerCase()))
      : defaultSpecies.filter((s) => s.species.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-100 flex items-center">
              <Leaf className="mr-2 h-5 w-5 text-green-500" />
              Biodiversidad de Manglares - Golfo de Urabá
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
              title="Especies Totales"
              value={formatNumber(speciesCount)}
              unit="especies"
              icon={Leaf}
              trend="stable"
              color="green"
              detail="Monitoreadas en el ecosistema"
            />
            <MetricCard
              title="Especies en Peligro"
              value={formatNumber(endangeredCount)}
              unit="especies"
              icon={AlertCircle}
              trend="up"
              color="red"
              detail="Requieren protección urgente"
            />
            <MetricCard
              title="Índice de Biodiversidad"
              value="7.8"
              unit="/10"
              icon={BarChart3}
              trend="down"
              color="amber"
              detail="Disminución del 0.3 en 5 años"
            />
          </div>

          <Tabs defaultValue="especies" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-slate-800/50 p-1">
                <TabsTrigger
                  value="especies"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-green-400"
                >
                  Especies
                </TabsTrigger>
                <TabsTrigger
                  value="tendencias"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-green-400"
                >
                  Tendencias
                </TabsTrigger>
                <TabsTrigger
                  value="conservacion"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-green-400"
                >
                  Conservación
                </TabsTrigger>
              </TabsList>

              <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700/50 text-slate-300">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
            </div>

            <TabsContent value="especies" className="mt-0">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar especies..."
                    className="pl-8 bg-slate-800/50 border-slate-700/50 text-slate-100"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                  <div className="col-span-1">Icono</div>
                  <div className="col-span-4">Especie</div>
                  <div className="col-span-2">Población</div>
                  <div className="col-span-2">Tendencia</div>
                  <div className="col-span-3">Estado</div>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {filteredSpecies.length > 0 ? (
                    filteredSpecies.map((species, index) => (
                      <SpeciesRow
                        key={index}
                        icon={species.icon}
                        name={species.species}
                        count={species.count}
                        trend={species.trend}
                        status={species.status}
                      />
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400">
                      No se encontraron especies que coincidan con la búsqueda.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tendencias" className="mt-0">
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                <h3 className="text-sm font-medium text-slate-200 mb-4">Tendencias de Biodiversidad (2020-2025)</h3>
                <div className="h-64 w-full relative">
                  <BiodiversityTrendChart />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <StatCard title="Especies en Aumento" value="12" unit="especies" trend="increasing" />
                  <StatCard title="Especies en Declive" value="28" unit="especies" trend="decreasing" />
                  <StatCard title="Especies Estables" value="147" unit="especies" trend="stable" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="conservacion" className="mt-0">
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                <h3 className="text-sm font-medium text-slate-200 mb-4">Programas de Conservación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ConservationCard
                    title="Protección de Hábitat"
                    status="En progreso"
                    statusColor="blue"
                    progress={75}
                    description="Establecimiento de áreas protegidas para preservar el hábitat de especies en peligro de extinción."
                    targetSpecies={["Manatí", "Garza tigre"]}
                  />
                  <ConservationCard
                    title="Monitoreo de Especies"
                    status="Activo"
                    statusColor="green"
                    progress={100}
                    description="Seguimiento continuo de poblaciones de especies clave para evaluar la salud del ecosistema."
                    targetSpecies={["Mangle rojo", "Cangrejo azul", "Pez sábalo"]}
                  />
                  <ConservationCard
                    title="Restauración de Ecosistemas"
                    status="Planificado"
                    statusColor="amber"
                    progress={35}
                    description="Recuperación de áreas degradadas mediante la reforestación y restauración ecológica."
                    targetSpecies={["Mangle rojo", "Mangle negro"]}
                  />
                  <ConservationCard
                    title="Educación Ambiental"
                    status="En progreso"
                    statusColor="blue"
                    progress={60}
                    description="Programas educativos para comunidades locales sobre la importancia de la biodiversidad de manglares."
                    targetSpecies={["Todas las especies"]}
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

// Datos de especies por defecto
const defaultSpecies: BiodiversityData[] = [
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
  {
    species: "Mangle negro (Avicennia germinans)",
    count: 8500,
    trend: "stable",
    status: "stable",
    icon: "🌲",
  },
  {
    species: "Iguana verde (Iguana iguana)",
    count: 2300,
    trend: "increasing",
    status: "stable",
    icon: "🦎",
  },
  {
    species: "Cocodrilo americano (Crocodylus acutus)",
    count: 120,
    trend: "decreasing",
    status: "endangered",
    icon: "🐊",
  },
  {
    species: "Pelícano pardo (Pelecanus occidentalis)",
    count: 850,
    trend: "stable",
    status: "stable",
    icon: "🦢",
  },
  {
    species: "Ostra de mangle (Crassostrea rhizophorae)",
    count: 25000,
    trend: "decreasing",
    status: "vulnerable",
    icon: "🦪",
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
        return "from-green-500 to-teal-500 border-green-500/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className={`h-4 w-4 ${color === "red" ? "text-red-500" : "text-green-500"}`} />
      case "down":
        return (
          <BarChart3
            className={`h-4 w-4 rotate-180 ${color === "red" || color === "amber" ? "text-red-500" : "text-green-500"}`}
          />
        )
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

// Componente para filas de especies
function SpeciesRow({
  icon,
  name,
  count,
  trend,
  status,
}: {
  icon: string
  name: string
  count: number
  trend: "increasing" | "stable" | "decreasing"
  status: "endangered" | "vulnerable" | "stable"
}) {
  const getTrendBadge = () => {
    switch (trend) {
      case "increasing":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">En aumento</Badge>
      case "stable":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Estable</Badge>
      case "decreasing":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">En declive</Badge>
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Desconocido</Badge>
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "endangered":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">En peligro</Badge>
      case "vulnerable":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Vulnerable</Badge>
      case "stable":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Estable</Badge>
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Desconocido</Badge>
    }
  }

  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-1 text-2xl">{icon}</div>
      <div className="col-span-4 text-slate-300">{name}</div>
      <div className="col-span-2 text-cyan-400">{new Intl.NumberFormat("es-CO").format(count)}</div>
      <div className="col-span-2">{getTrendBadge()}</div>
      <div className="col-span-3">{getStatusBadge()}</div>
    </div>
  )
}

// Componente para el gráfico de tendencia de biodiversidad (simulado)
function BiodiversityTrendChart() {
  return (
    <div className="h-full w-full bg-slate-800/20 rounded-md border border-slate-700/50 p-4 flex items-center justify-center">
      <div className="w-full h-full relative">
        {/* Eje Y */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 text-xs text-slate-500">
          <div>200</div>
          <div>150</div>
          <div>100</div>
          <div>50</div>
          <div>0</div>
        </div>

        {/* Barras del gráfico (simuladas) */}
        <div className="absolute left-10 right-0 bottom-8 top-4 flex items-end justify-between">
          <div className="flex flex-col items-center">
            <div className="flex items-end space-x-1">
              <div
                className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
                style={{ height: "120px" }}
              ></div>
              <div
                className="w-8 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-sm"
                style={{ height: "30px" }}
              ></div>
              <div
                className="w-8 bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm"
                style={{ height: "20px" }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 mt-2">2020</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-end space-x-1">
              <div
                className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
                style={{ height: "115px" }}
              ></div>
              <div
                className="w-8 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-sm"
                style={{ height: "35px" }}
              ></div>
              <div
                className="w-8 bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm"
                style={{ height: "25px" }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 mt-2">2021</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-end space-x-1">
              <div
                className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
                style={{ height: "110px" }}
              ></div>
              <div
                className="w-8 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-sm"
                style={{ height: "38px" }}
              ></div>
              <div
                className="w-8 bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm"
                style={{ height: "30px" }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 mt-2">2022</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-end space-x-1">
              <div
                className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
                style={{ height: "105px" }}
              ></div>
              <div
                className="w-8 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-sm"
                style={{ height: "42px" }}
              ></div>
              <div
                className="w-8 bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm"
                style={{ height: "35px" }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 mt-2">2023</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-end space-x-1">
              <div
                className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
                style={{ height: "100px" }}
              ></div>
              <div
                className="w-8 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-sm"
                style={{ height: "45px" }}
              ></div>
              <div
                className="w-8 bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm"
                style={{ height: "42px" }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 mt-2">2024</div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="absolute right-4 top-4 bg-slate-800/70 p-2 rounded-md text-xs">
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-green-500 mr-2 rounded-sm"></div>
            <span className="text-slate-300">Especies estables</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-amber-500 mr-2 rounded-sm"></div>
            <span className="text-slate-300">Especies vulnerables</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 mr-2 rounded-sm"></div>
            <span className="text-slate-300">Especies en peligro</span>
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
        return "text-green-500"
      case "decreasing":
        return "text-red-500"
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

// Componente para tarjetas de conservación
function ConservationCard({
  title,
  status,
  statusColor,
  progress,
  description,
  targetSpecies,
}: {
  title: string
  status: string
  statusColor: string
  progress: number
  description: string
  targetSpecies: string[]
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
      <div className="text-xs text-slate-500 mb-3">{description}</div>
      <div className="text-xs text-slate-400 mb-1">Especies objetivo:</div>
      <div className="flex flex-wrap gap-1">
        {targetSpecies.map((species, index) => (
          <Badge key={index} variant="outline" className="bg-slate-800/70 text-slate-300 border-slate-600/50">
            {species}
          </Badge>
        ))}
      </div>
    </div>
  )
}

