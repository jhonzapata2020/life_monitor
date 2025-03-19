"use client"

import { useEffect, useRef, useState } from "react"
import { Layers, AlertCircle, Leaf, Waves, Cloud, Info, MapPin, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// Eliminar la importación estática de L
// import * as L from 'leaflet';

// Agregar esta declaración después de las importaciones:
// Definir L como cualquier para evitar errores de TypeScript
let L: any

// Tipos para las alertas y capas
type LayerType = "biodiversity" | "deforestation" | "coastal-erosion" | "co2-capture" | "base"
type Region = "uraba" | "cienaga" | "guajira" | "pacifico" | "caribe" | "all"

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
interface LeafletMapComponentProps {
  selectedDate?: string
  region?: Region
  onAlertClick?: (alert: Alert) => void
  className?: string
}

export default function LeafletMapComponent({
  selectedDate = "2025-03-17",
  region = "uraba",
  onAlertClick,
  className,
}: LeafletMapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapStyle, setMapStyle] = useState("satellite")
  const [layers, setLayers] = useState<MapLayer[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [showLayersPanel, setShowLayersPanel] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mapInitialized, setMapInitialized] = useState(false)
  const leafletMapRef = useRef<any>(null)
  const layerControlsRef = useRef<any>(null)

  // Cargar el mapa cuando el componente se monte
  useEffect(() => {
    // Cargar Leaflet solo en el cliente
    const loadLeafletLibrary = async () => {
      if (typeof window !== "undefined") {
        const leaflet = await import("leaflet")
        L = leaflet.default

        // Continuar con la inicialización solo si el contenedor existe
        if (mapContainerRef.current && !mapInitialized) {
          initializeMap()
        }
      }
    }

    loadLeafletLibrary()
  }, [])

  // Agregar un efecto para manejar el redimensionamiento de la ventana

  // Añadir este useEffect después del useEffect principal:
  useEffect(() => {
    // Manejar el redimensionamiento de la ventana
    const handleResize = () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize()
      }
    }

    window.addEventListener("resize", handleResize)

    // Llamar a invalidateSize después de un breve retraso para asegurar que el mapa se renderice correctamente
    const timeoutId = setTimeout(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize()
      }
    }, 300)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [mapInitialized])

  // Agregar la función initializeMap fuera del useEffect
  const initializeMap = async () => {
    try {
      setIsLoading(true)

      // Importar los estilos de Leaflet
      await import("leaflet/dist/leaflet.css")

      // Coordenadas iniciales (Golfo de Urabá)
      const initialCoords = [8.1, -76.57]
      const initialZoom = 9

      // Crear el mapa
      const map = L.map(mapContainerRef.current).setView(initialCoords, initialZoom)

      // Añadir capa base de satélite (ESRI World Imagery)
      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        },
      ).addTo(map)

      // Añadir capa base de OpenStreetMap
      const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })

      // Añadir capa base topográfica
      const topoLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
        },
      )

      // Crear control de capas base
      const baseLayers = {
        Satelital: satelliteLayer,
        OpenStreetMap: osmLayer,
        Topográfico: topoLayer,
      }

      // Crear control de capas
      const layerControl = L.control.layers(baseLayers, {}).addTo(map)

      // Guardar referencias
      leafletMapRef.current = map
      layerControlsRef.current = layerControl

      // Cargar capas de ejemplo
      loadExampleLayers(L, map, layerControl)

      // Cargar alertas de ejemplo
      loadExampleAlerts(L, map)

      setMapInitialized(true)
      setIsLoading(false)

      // Forzar un redimensionamiento del mapa después de que se haya inicializado
      setTimeout(() => {
        if (map) {
          map.invalidateSize()
        }
      }, 100)
    } catch (error) {
      console.error("Error al cargar Leaflet:", error)
      setIsLoading(false)
    }
  }

  // Cargar capas de ejemplo
  const loadExampleLayers = (L: any, map: any, layerControl: any) => {
    // Ejemplos de capas para cada tipo
    const exampleLayers: MapLayer[] = [
      {
        id: "manglar-coverage",
        name: "Cobertura de Manglar",
        type: "base",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        visible: true,
        opacity: 0.7,
        legend: "/placeholder.svg?height=100&width=50",
      },
      {
        id: "biodiversity-hotspots",
        name: "Puntos de Biodiversidad",
        type: "biodiversity",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        visible: false,
        opacity: 0.6,
        legend: "/placeholder.svg?height=100&width=50",
      },
      {
        id: "deforestation-areas",
        name: "Áreas de Deforestación",
        type: "deforestation",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        visible: false,
        opacity: 0.6,
        legend: "/placeholder.svg?height=100&width=50",
      },
      {
        id: "coastal-erosion",
        name: "Erosión Costera",
        type: "coastal-erosion",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        visible: false,
        opacity: 0.6,
        legend: "/placeholder.svg?height=100&width=50",
      },
      {
        id: "co2-capture",
        name: "Captura de CO2",
        type: "co2-capture",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        visible: false,
        opacity: 0.6,
        legend: "/placeholder.svg?height=100&width=50",
      },
    ]

    // Añadir capas al mapa y al control
    exampleLayers.forEach((layer) => {
      const tileLayer = L.tileLayer(layer.url, {
        opacity: layer.opacity,
      })

      if (layer.visible) {
        tileLayer.addTo(map)
      }

      // Añadir al control de capas
      layerControl.addOverlay(tileLayer, layer.name)
    })

    setLayers(exampleLayers)
  }

  // Cargar alertas de ejemplo
  const loadExampleAlerts = (L: any, map: any) => {
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

    // Añadir marcadores para cada alerta
    exampleAlerts.forEach((alert) => {
      // Crear icono personalizado según la severidad
      const iconColor = alert.severity === "high" ? "#ef4444" : alert.severity === "medium" ? "#f59e0b" : "#3b82f6"

      const icon = L.divIcon({
        html: `<div style="background-color: ${iconColor}30; padding: 5px; border-radius: 50%;">
                <div style="color: ${iconColor}; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    ${
                      alert.type === "deforestation"
                        ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
                        : alert.type === "biodiversity"
                          ? '<path d="M12 2a9 9 0 0 0-9 9c0 4.17 2.65 7.72 6.33 9h5.34c3.68-1.28 6.33-4.83 6.33-9a9 9 0 0 0-9-9z"></path><path d="M12 7v5"></path><path d="M9 9h6"></path>'
                          : alert.type === "erosion"
                            ? '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>'
                            : '<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><path d="M8 16h.01"></path><path d="M8 20h.01"></path><path d="M12 18h.01"></path><path d="M12 22h.01"></path><path d="M16 16h.01"></path><path d="M16 20h.01"></path>'
                    }
                  </svg>
                </div>
              </div>`,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      // Crear marcador
      const marker = L.marker([alert.coordinates[1], alert.coordinates[0]], { icon }).addTo(map)

      // Añadir popup con información
      const popupContent = `
        <div style="max-width: 200px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <strong>${alert.title}</strong>
            <span style="background-color: ${iconColor}20; color: ${iconColor}; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">
              ${alert.severity === "high" ? "Alta" : alert.severity === "medium" ? "Media" : "Baja"}
            </span>
          </div>
          <p style="margin: 5px 0; font-size: 0.875rem;">${alert.description}</p>
          <div style="font-size: 0.75rem; color: #64748b;">
            <div style="display: flex; justify-content: space-between; margin-top: 5px;">
              <span>Fecha:</span>
              <span>${alert.date}</span>
            </div>
            ${
              alert.area
                ? `
              <div style="display: flex; justify-content: space-between; margin-top: 2px;">
                <span>Área afectada:</span>
                <span>${alert.area} ha</span>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `

      marker.bindPopup(popupContent)

      // Manejar clic en el marcador
      marker.on("click", () => {
        setSelectedAlert(alert)
        if (onAlertClick) {
          onAlertClick(alert)
        }
      })
    })

    setAlerts(exampleAlerts)
  }

  // Cambiar el estilo del mapa base
  const changeMapStyle = (style: string) => {
    if (!leafletMapRef.current) return

    const map = leafletMapRef.current

    // Eliminar todas las capas base
    map.eachLayer((layer: any) => {
      if (layer._url && layer._url.includes("tile")) {
        map.removeLayer(layer)
      }
    })

    // Añadir la capa seleccionada
    if (style === "satellite") {
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      }).addTo(map)
    } else if (style === "osm") {
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)
    } else if (style === "topo") {
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution:
          "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
      }).addTo(map)
    }

    setMapStyle(style)
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

  return (
    <div className={cn("relative h-full w-full rounded-lg overflow-hidden", className)}>
      {/* Contenedor del mapa */}
      <div ref={mapContainerRef} className="h-full w-full" style={{ minHeight: "500px", position: "relative" }} />

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
                          onCheckedChange={() => {
                            // En una implementación real, esto activaría/desactivaría la capa en el mapa
                            const updatedLayers = layers.map((l) =>
                              l.id === layer.id ? { ...l, visible: !l.visible } : l,
                            )
                            setLayers(updatedLayers)
                          }}
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
                          onValueChange={(value) => {
                            // En una implementación real, esto cambiaría la opacidad de la capa en el mapa
                            const updatedLayers = layers.map((l) =>
                              l.id === layer.id ? { ...l, opacity: value[0] / 100 } : l,
                            )
                            setLayers(updatedLayers)
                          }}
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

