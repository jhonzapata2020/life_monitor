"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Download, Share2 } from "lucide-react"
import LeafletMapComponent from "./leaflet-map-component"
import { cn } from "@/lib/utils"

type Region = "uraba" | "cienaga" | "guajira" | "pacifico" | "caribe" | "all"

export default function MapView() {
  const [selectedRegion, setSelectedRegion] = useState<Region>("uraba")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState("map")

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

            <TabsContent value="map" className="flex-1 m-0 overflow-hidden">
              <div className="h-full relative" style={{ minHeight: "500px" }}>
                <LeafletMapComponent selectedDate={formattedDate} region={selectedRegion} className="h-full w-full" />

                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-900/80 border-slate-700/50 hover:bg-slate-800"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
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

            <TabsContent value="data" className="flex-1 m-0 p-6 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/40 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Estadísticas de Cobertura</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Área total de manglar:</span>
                        <span className="font-medium text-slate-200">12,450 ha</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Área reforestada:</span>
                        <span className="font-medium text-green-400">450 ha</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Pérdida reciente:</span>
                        <span className="font-medium text-red-400">12.3 ha</span>
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
                        <span className="font-medium text-slate-200">187</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Especies en peligro:</span>
                        <span className="font-medium text-red-400">42</span>
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
                        <span className="font-medium text-amber-400">1.2 m/año</span>
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
                        <span className="font-medium text-green-400">45,320 ton</span>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

