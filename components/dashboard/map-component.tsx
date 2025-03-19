"use client"

import { useEffect, useState, useRef } from "react"
import { MapPin, AlertCircle, Leaf, Waves, Cloud, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

// Definir las props del componente
type MapComponentProps = {
  selectedDate: string
  mapLayer: string
  onLayerChange: (layer: string) => void
  alerts?: DeforestationAlert[]
}

export default function MapComponent({ selectedDate, mapLayer, onLayerChange, alerts = [] }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<DeforestationAlert | null>(null)
  const [showLayersPanel, setShowLayersPanel] = useState(false) // Inicialmente oculto

  // Simular la carga del mapa
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Función para manejar el clic en una alerta
  const handleAlertClick = (alert: DeforestationAlert) => {
    setSelectedAlert(alert)
  }

  // Función para cerrar el popup de alerta
  const handleCloseAlert = () => {
    setSelectedAlert(null)
  }

  // Función para mostrar/ocultar el panel de capas
  const toggleLayersPanel = () => {
    setShowLayersPanel(!showLayersPanel)
  }

  // Obtener el color según la severidad de la alerta
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-500/20 border-red-500/30"
      case "medium":
        return "text-amber-500 bg-amber-500/20 border-amber-500/30"
      case "low":
        return "text-blue-500 bg-blue-500/20 border-blue-500/30"
      default:
        return "text-slate-500 bg-slate-500/20 border-slate-500/30"
    }
  }

  // Modificar la función para manejar el cambio de capa
  const handleLayerChange = (layer: string) => {
    onLayerChange(layer)
    // Cerrar el panel de capas después de seleccionar una
    setShowLayersPanel(false)
  }

  // Determinar qué imagen de fondo mostrar según la capa seleccionada
  const getMapBackground = () => {
    switch (mapLayer) {
      case "deforestation":
        return "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/placeholder.svg?height=500&width=800&text=Deforestación')"
      case "biodiversity":
        return "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/placeholder.svg?height=500&width=800&text=Biodiversidad')"
      case "erosion":
        return "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/placeholder.svg?height=500&width=800&text=Erosión')"
      case "co2":
        return "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/placeholder.svg?height=500&width=800&text=Captura+CO2')"
      default:
        return "url('/placeholder.svg?height=500&width=800&text=Vista+Satelital')"
    }
  }

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      {/* Mapa simulado */}
      <div
        ref={mapRef}
        className={`h-full w-full bg-slate-800 relative ${!isMapLoaded ? "animate-pulse" : ""}`}
        style={{
          backgroundImage: getMapBackground(),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-slate-400">Cargando mapa...</div>
          </div>
        )}

        {isMapLoaded && (
          <>
            {/* Información de la capa actual y fecha */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50 flex items-center">
              <MapPin className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <div className="text-sm font-medium text-slate-200">
                  {mapLayer === "satellite" && "Vista Satelital"}
                  {mapLayer === "deforestation" && "Deforestación"}
                  {mapLayer === "biodiversity" && "Biodiversidad"}
                  {mapLayer === "erosion" && "Erosión Costera"}
                  {mapLayer === "co2" && "Captura CO2"}
                </div>
                <div className="text-xs text-slate-400">Fecha: {selectedDate}</div>
              </div>
            </div>

            {/* Botón para mostrar panel de capas */}
            <div className="absolute top-4 right-4 z-20">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-900/80 border-slate-700/50 hover:bg-slate-800"
                onClick={toggleLayersPanel}
              >
                <Layers className="h-4 w-4 mr-2 text-green-500" />
                Capas del Mapa
              </Button>
            </div>

            {/* Panel de capas */}
            {showLayersPanel && (
              <div className="absolute top-16 right-4 bg-slate-900/90 backdrop-blur-sm rounded-md p-4 border border-slate-700/50 z-20 w-64">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-200">Capas del Mapa</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-slate-400"
                    onClick={() => setShowLayersPanel(false)}
                  >
                    ×
                  </Button>
                </div>
                <div className="space-y-2">
                  <LayerButton
                    icon="satellite"
                    label="Satelital"
                    active={mapLayer === "satellite"}
                    onClick={() => handleLayerChange("satellite")}
                  />
                  <LayerButton
                    icon="deforestation"
                    label="Deforestación"
                    active={mapLayer === "deforestation"}
                    onClick={() => handleLayerChange("deforestation")}
                  />
                  <LayerButton
                    icon="biodiversity"
                    label="Biodiversidad"
                    active={mapLayer === "biodiversity"}
                    onClick={() => handleLayerChange("biodiversity")}
                  />
                  <LayerButton
                    icon="erosion"
                    label="Erosión"
                    active={mapLayer === "erosion"}
                    onClick={() => handleLayerChange("erosion")}
                  />
                  <LayerButton
                    icon="co2"
                    label="Captura CO2"
                    active={mapLayer === "co2"}
                    onClick={() => handleLayerChange("co2")}
                  />
                </div>
              </div>
            )}

            {/* Marcadores de alertas */}
            {mapLayer === "deforestation" &&
              alerts.map((alert) => (
                <TooltipProvider key={alert.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-1 rounded-full ${
                          alert.severity === "high"
                            ? "bg-red-500/20 hover:bg-red-500/40"
                            : alert.severity === "medium"
                              ? "bg-amber-500/20 hover:bg-amber-500/40"
                              : "bg-blue-500/20 hover:bg-blue-500/40"
                        }`}
                        style={{
                          left: `${(alert.coordinates[1] + 77) * 10}%`,
                          top: `${(8.5 - alert.coordinates[0]) * 20}%`,
                        }}
                        onClick={() => handleAlertClick(alert)}
                      >
                        <AlertCircle
                          className={`h-4 w-4 ${
                            alert.severity === "high"
                              ? "text-red-500"
                              : alert.severity === "medium"
                                ? "text-amber-500"
                                : "text-blue-500"
                          }`}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {alert.location} - {alert.area} ha
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}

            {/* Popup de alerta seleccionada */}
            {selectedAlert && (
              <div
                className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-md p-3 border border-slate-700/50 max-w-xs"
                style={{ zIndex: 1000 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <AlertCircle
                      className={`h-4 w-4 mr-2 ${
                        selectedAlert.severity === "high"
                          ? "text-red-500"
                          : selectedAlert.severity === "medium"
                            ? "text-amber-500"
                            : "text-blue-500"
                      }`}
                    />
                    <div className="text-sm font-medium text-slate-200">{selectedAlert.location}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 -mt-1 -mr-1 text-slate-400"
                    onClick={handleCloseAlert}
                  >
                    ×
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Fecha:</span>
                    <span className="text-slate-300">{selectedAlert.date}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Área afectada:</span>
                    <span className="text-slate-300">{selectedAlert.area} hectáreas</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Severidad:</span>
                    <Badge className={getSeverityColor(selectedAlert.severity)}>
                      {selectedAlert.severity === "high"
                        ? "Alta"
                        : selectedAlert.severity === "medium"
                          ? "Media"
                          : "Baja"}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    <span className="block mb-1">Descripción:</span>
                    <span className="text-slate-300">{selectedAlert.description}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Componente para botones de capas del mapa
function LayerButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string
  label: string
  active: boolean
  onClick: () => void
}) {
  const getIcon = () => {
    switch (icon) {
      case "deforestation":
        return <AlertCircle className="h-4 w-4 mr-2" />
      case "biodiversity":
        return <Leaf className="h-4 w-4 mr-2" />
      case "erosion":
        return <Waves className="h-4 w-4 mr-2" />
      case "co2":
        return <Cloud className="h-4 w-4 mr-2" />
      default:
        return <MapPin className="h-4 w-4 mr-2" />
    }
  }

  return (
    <button
      className={`flex items-center w-full py-2 px-3 rounded-md transition-colors ${
        active
          ? "bg-green-500/20 text-green-400 border border-green-500/30"
          : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-300"
      }`}
      onClick={onClick}
    >
      {getIcon()}
      {label}
    </button>
  )
}

