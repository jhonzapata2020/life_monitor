"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Map, NavigationControl, Popup, Source, Layer } from "react-map-gl"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { Layers, AlertCircle, Leaf, Waves, Cloud, Info, MapPin, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { environmentalDataClient, type LayerType, type Region } from "@/lib/api-client"
import { cn } from "@/lib/utils"

// Tipos para las alertas y capas
type Alert = {
  id: string
  type: "deforestation" | "erosion" | "biodiversity" | "co2"
  title: string
  description: string
  severity: "high" | "medium" | "low"
  coordinates: [number, number]
  date: string
  area?: number
}

type MapLayer = {
  id: string
  name: string
  type: LayerType
  url: string
  visible: boolean
  opacity: number
  legend?: string
}

// Props del componente
interface AdvancedMapComponentProps {
  selectedDate?: string
  region?: Region
  onAlertClick?: (alert: Alert) => void
  className?: string
}

export default function AdvancedMapComponent({
  selectedDate = "2025-03-17",
  region = "uraba",
  onAlertClick,
  className,
}: AdvancedMapComponentProps) {
  // Referencias y estados
  const mapRef = useRef<any>(null)
  const [viewState, setViewState] = useState({
    longitude: -76.57, // Coordenadas aproximadas del Golfo de Urabá
    latitude: 8.1,
    zoom: 9,
  })
  const [mapStyle, setMapStyle] = useState("satellite")
  const [layers, setLayers] = useState<MapLayer[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [popupInfo, setPopupInfo] = useState<{ longitude: number; latitude: number; content: React.ReactNode } | null>(
    null,
  )
  const [showLayersPanel, setShowLayersPanel] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar capas desde la API
  useEffect(() => {
    const fetchLayers = async () => {
      try {
        setIsLoading(true)
        const response = await environmentalDataClient.getLayers(undefined, region)

        if (response.success && response.layers) {
          // Transformar las capas de la API al formato que necesitamos
          const mappedLayers = response.layers.map((layer: any) => ({
            id: layer.id,
            name: layer.name,
            type: layer.type as LayerType,
            url: layer.url,
            visible: layer.visible,
            opacity: layer.opacity,
            legend: layer.legend,
          }))

          setLayers(mappedLayers)
        }
      } catch (error) {
        console.error("Error al cargar las capas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Cargar alertas de ejemplo (en una aplicación real, esto vendría de la API)
    const loadExampleAlerts = () => {
      const exampleAlerts: Alert[] = [
        {
          id: "def-001",
          type: "deforestation",
          title: "Deforestación Detectada",
          description: "Pérdida de manglar por tala ilegal",
          severity: "high",
          coordinates: [-76.57, 8.1],
          date: "2025-03-15",
          area: 5.2,
        },
        {
          id: "ero-001",
          type: "erosion",
          title: "Erosión Acelerada",
          description: "Incremento de erosión en Playa Turbo",
          severity: "medium",
          coordinates: [-76.72, 8.05],
          date: "2025-03-14",
          area: 2.8,
        },
        {
          id: "bio-001",
          type: "biodiversity",
          title: "Avistamiento de Especies",
          description: "Grupo de manatíes detectado en Bahía Colombia",
          severity: "low",
          coordinates: [-76.65, 8.15],
          date: "2025-03-16",
        },
      ]

      setAlerts(exampleAlerts)
    }

    fetchLayers()
    loadExampleAlerts()
  }, [region])

  // Manejar clic en alerta
  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert)
    setPopupInfo({
      longitude: alert.coordinates[0],
      latitude: alert.coordinates[1],
      content: (
        <div className="p-2 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">{alert.title}</h3>
            <Badge
              className={cn(
                "text-xs",
                alert.severity === "high"
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  : alert.severity === "medium"
                    ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
                    : "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30",
              )}
            >
              {alert.severity === "high" ? "Alta" : alert.severity === "medium" ? "Media" : "Baja"}
            </Badge>
          </div>
          <p className="text-xs text-slate-300 mb-2">{alert.description}</p>
          <div className="text-xs text-slate-400">
            <div className="flex justify-between mb-1">
              <span>Fecha:</span>
              <span className="text-slate-300">{alert.date}</span>
            </div>
            {alert.area && (
              <div className="flex justify-between">
                <span>Área afectada:</span>
                <span className="text-slate-300">{alert.area} ha</span>
              </div>
            )}
          </div>
        </div>
      ),
    })

    // Centrar el mapa en la alerta
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [alert.coordinates[0], alert.coordinates[1]],
        zoom: 12,
        duration: 1000,
      })
    }

    // Llamar al callback si existe
    if (onAlertClick) {
      onAlertClick(alert)
    }
  }

  // Cambiar la visibilidad de una capa
  const toggleLayerVisibility = (layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) => (layer.id === layerId ? { ...layer, visible: !layer.visible } : layer)),
    )
  }

  // Cambiar la opacidad de una capa
  const changeLayerOpacity = (layerId: string, opacity: number) => {
    setLayers((prevLayers) => prevLayers.map((layer) => (layer.id === layerId ? { ...layer, opacity } : layer)))
  }

  // Cambiar el estilo del mapa base
  const changeMapStyle = (style: string) => {
    setMapStyle(style)
  }

  // Obtener el estilo del mapa según la selección
  const getMapStyle = () => {
    switch (mapStyle) {
      case "satellite":
        return {
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
              tileSize: 256,
              attribution: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
            },
          },
          layers: [
            {
              id: "simple-tiles",
              type: "raster",
              source: "raster-tiles",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        }
      case "hybrid":
        return {
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
              tileSize: 256,
              attribution: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
            },
            "osm-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "simple-tiles",
              type: "raster",
              source: "raster-tiles",
              minzoom: 0,
              maxzoom: 22,
            },
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 22,
              paint: {
                "raster-opacity": 0.3,
              },
            },
          ],
        }
      case "topo":
        return {
          version: 8,
          sources: {
            "topo-tiles": {
              type: "raster",
              tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"],
              tileSize: 256,
              attribution: "Esri, HERE, Garmin, Intermap, and the GIS user community",
            },
          },
          layers: [
            {
              id: "topo-tiles",
              type: "raster",
              source: "topo-tiles",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        }
      default:
        return {
          version: 8,
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        }
    }
  }

  // Renderizar el icono según el tipo de alerta
  const renderAlertIcon = (type: string) => {
    switch (type) {
      case "deforestation":
        return <AlertCircle className="h-4 w-4" />
      case "biodiversity":
        return <Leaf className="h-4 w-4" />
      case "erosion":
        return <Waves className="h-4 w-4" />
      case "co2":
        return <Cloud className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  // Obtener el color según la severidad
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

  // Agrupar capas por tipo
  const layersByType = layers.reduce(
    (acc, layer) => {
      if (!acc[layer.type]) {
        acc[layer.type] = []
      }
      acc[layer.type].push(layer)
      return acc
    },
    {} as Record<string, MapLayer[]>,
  )

  return (
    <div className={cn("relative h-full w-full rounded-lg overflow-hidden", className)}>
      {/* Mapa principal */}
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={getMapStyle()}
        style={{ width: "100%", height: "100%" }}
        attributionControl={true}
      >
        {/* Controles de navegación */}
        <NavigationControl position="bottom-right" />

        {/* Capas adicionales (en una aplicación real, estas se cargarían desde la API) */}
        {layers
          .filter((layer) => layer.visible)
          .map((layer) => (
            <Source key={layer.id} id={layer.id} type="raster" tiles={[layer.url]} tileSize={256}>
              <Layer
                id={`layer-${layer.id}`}
                type="raster"
                paint={{
                  "raster-opacity": layer.opacity,
                }}
              />
            </Source>
          ))}

        {/* Marcadores de alertas */}
        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            longitude={alert.coordinates[0]}
            latitude={alert.coordinates[1]}
            onClick={() => handleAlertClick(alert)}
          >
            <div
              className={cn(
                "p-1 rounded-full cursor-pointer transition-all hover:scale-110",
                alert.severity === "high"
                  ? "bg-red-500/20"
                  : alert.severity === "medium"
                    ? "bg-amber-500/20"
                    : "bg-blue-500/20",
              )}
            >
              <div
                className={cn(
                  "text-white",
                  alert.severity === "high"
                    ? "text-red-500"
                    : alert.severity === "medium"
                      ? "text-amber-500"
                      : "text-blue-500",
                )}
              >
                {renderAlertIcon(alert.type)}
              </div>
            </div>
          </Marker>
        ))}

        {/* Popup de información */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            className="bg-slate-900/90 backdrop-blur-sm text-white border border-slate-700/50 rounded-md overflow-hidden"
          >
            {popupInfo.content}
          </Popup>
        )}
      </Map>

      {/* Información de la capa actual y fecha */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50 flex items-center z-10">
        <MapPin className="h-5 w-5 text-green-500 mr-2" />
        <div>
          <div className="text-sm font-medium text-slate-200">
            {mapStyle === "satellite" && "Vista Satelital"}
            {mapStyle === "hybrid" && "Vista Híbrida"}
            {mapStyle === "topo" && "Vista Topográfica"}
            {mapStyle === "osm" && "OpenStreetMap"}
          </div>
          <div className="text-xs text-slate-400">Fecha: {selectedDate}</div>
        </div>
      </div>

      {/* Botón para mostrar panel de capas */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-900/80 border-slate-700/50 hover:bg-slate-800"
          onClick={() => setShowLayersPanel(!showLayersPanel)}
        >
          <Layers className="h-4 w-4 mr-2 text-green-500" />
          Capas del Mapa
        </Button>
      </div>

      {/* Botón de actualizar */}
      <div className="absolute top-4 right-36 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-slate-900/80 border-slate-700/50 hover:bg-slate-800"
                onClick={() => {
                  setIsLoading(true)
                  setTimeout(() => setIsLoading(false), 1000)
                }}
              >
                <RefreshCw className={cn("h-4 w-4 text-green-500", isLoading && "animate-spin")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Actualizar datos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Panel de capas */}
      {showLayersPanel && (
        <div className="absolute top-16 right-4 bg-slate-900/90 backdrop-blur-sm rounded-md p-4 border border-slate-700/50 z-10 w-72 max-h-[80%] overflow-y-auto">
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

          {/* Selector de mapa base */}
          <div className="mb-4">
            <h3 className="text-xs font-medium text-slate-400 mb-2">Mapa Base</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={mapStyle === "satellite" ? "default" : "outline"}
                size="sm"
                className={cn(
                  "text-xs h-8",
                  mapStyle === "satellite" ? "bg-green-600 hover:bg-green-700" : "bg-slate-800/50",
                )}
                onClick={() => changeMapStyle("satellite")}
              >
                Satelital
              </Button>
              <Button
                variant={mapStyle === "hybrid" ? "default" : "outline"}
                size="sm"
                className={cn(
                  "text-xs h-8",
                  mapStyle === "hybrid" ? "bg-green-600 hover:bg-green-700" : "bg-slate-800/50",
                )}
                onClick={() => changeMapStyle("hybrid")}
              >
                Híbrido
              </Button>
              <Button
                variant={mapStyle === "topo" ? "default" : "outline"}
                size="sm"
                className={cn(
                  "text-xs h-8",
                  mapStyle === "topo" ? "bg-green-600 hover:bg-green-700" : "bg-slate-800/50",
                )}
                onClick={() => changeMapStyle("topo")}
              >
                Topográfico
              </Button>
              <Button
                variant={mapStyle === "osm" ? "default" : "outline"}
                size="sm"
                className={cn(
                  "text-xs h-8",
                  mapStyle === "osm" ? "bg-green-600 hover:bg-green-700" : "bg-slate-800/50",
                )}
                onClick={() => changeMapStyle("osm")}
              >
                OpenStreetMap
              </Button>
            </div>
          </div>

          {/* Capas por categoría */}
          {Object.entries(layersByType).map(([type, typeLayers]) => (
            <div key={type} className="mb-4">
              <h3 className="text-xs font-medium text-slate-400 mb-2">
                {type === "biodiversity" && "Biodiversidad"}
                {type === "deforestation" && "Deforestación"}
                {type === "coastal-erosion" && "Erosión Costera"}
                {type === "co2-capture" && "Captura de CO2"}
                {type === "base" && "Capas Base"}
              </h3>
              <div className="space-y-3">
                {typeLayers.map((layer) => (
                  <div key={layer.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Switch
                          checked={layer.visible}
                          onCheckedChange={() => toggleLayerVisibility(layer.id)}
                          className="mr-2"
                        />
                        <span className="text-xs text-slate-300">{layer.name}</span>
                      </div>
                      {layer.legend && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                <Info className="h-3 w-3 text-slate-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <div className="w-32">
                                <img src={layer.legend || "/placeholder.svg"} alt="Leyenda" className="w-full" />
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {layer.visible && (
                      <div className="pl-9 pr-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400">Opacidad</span>
                          <span className="text-xs text-slate-400">{Math.round(layer.opacity * 100)}%</span>
                        </div>
                        <Slider
                          value={[layer.opacity * 100]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(value) => changeLayerOpacity(layer.id, value[0] / 100)}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-2"></div>
            <div className="text-sm text-slate-200">Cargando datos del mapa...</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente Marker personalizado
function Marker({
  longitude,
  latitude,
  children,
  onClick,
}: { longitude: number; latitude: number; children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${longitude}px`,
        top: `${latitude}px`,
        pointerEvents: "auto",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

