import { type NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

// Tipos para los parámetros de la solicitud
type LayerType = "biodiversity" | "deforestation" | "coastal-erosion" | "co2-capture" | "base" | "all"
type Region = "uraba" | "cienaga" | "guajira" | "pacifico" | "caribe" | "all"

// Interfaces para las respuestas
interface ApiResponse {
  success: boolean
  message?: string
  layers?: Layer[]
  timestamp: string
  source?: string
}

interface Layer {
  id: string
  name: string
  type: LayerType
  description?: string
  url: string
  visible: boolean
  opacity: number
  legend?: string
  metadata?: {
    source: string
    lastUpdated: string
    resolution?: string
    attribution?: string
  }
}

// Función para obtener capas disponibles
async function getLayers(type?: LayerType, region?: Region): Promise<ApiResponse> {
  try {
    // Clave para caché
    const cacheKey = `layers:${type || "all"}:${region || "all"}`

    // Intentar obtener datos de caché
    const cachedData = await kv.get(cacheKey)
    if (cachedData) {
      console.log("Returning cached layers data")
      return {
        success: true,
        layers: cachedData as Layer[],
        timestamp: new Date().toISOString(),
        source: "cache",
      }
    }

    // Si no hay datos en caché, generar datos de capas
    console.log("Generating fresh layers data")

    // Todas las capas disponibles
    const allLayers: Layer[] = [
      // Capas base
      {
        id: "base-satellite",
        name: "Imagen Satelital",
        type: "base",
        description: "Imágenes satelitales de alta resolución",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        visible: true,
        opacity: 1.0,
        metadata: {
          source: "ESRI",
          lastUpdated: "2025-01-15",
          resolution: "0.5m",
          attribution: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        },
      },
      {
        id: "base-topo",
        name: "Mapa Topográfico",
        type: "base",
        description: "Mapa topográfico con curvas de nivel",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        visible: false,
        opacity: 1.0,
        metadata: {
          source: "ESRI",
          lastUpdated: "2025-01-10",
          attribution: "Esri, USGS, FAO, NOAA",
        },
      },
      {
        id: "base-osm",
        name: "OpenStreetMap",
        type: "base",
        description: "Mapa base de OpenStreetMap",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        visible: false,
        opacity: 1.0,
        metadata: {
          source: "OpenStreetMap",
          lastUpdated: "2025-03-01",
          attribution: "© OpenStreetMap contributors",
        },
      },

      // Capas de biodiversidad
      {
        id: "bio-species-distribution",
        name: "Distribución de Especies",
        type: "biodiversity",
        description: "Distribución de especies en el ecosistema de manglar",
        url: "/api/tile/biodiversity/species-distribution/{z}/{x}/{y}",
        visible: false,
        opacity: 0.7,
        legend: "/legends/species-distribution.png",
        metadata: {
          source: "GBIF, iNaturalist",
          lastUpdated: "2025-03-10",
          resolution: "30m",
        },
      },
      {
        id: "bio-hotspots",
        name: "Puntos Calientes de Biodiversidad",
        type: "biodiversity",
        description: "Áreas con alta concentración de especies",
        url: "/api/tile/biodiversity/hotspots/{z}/{x}/{y}",
        visible: false,
        opacity: 0.8,
        legend: "/legends/biodiversity-hotspots.png",
        metadata: {
          source: "INVEMAR, IIAP",
          lastUpdated: "2025-02-28",
          resolution: "50m",
        },
      },
      {
        id: "bio-endangered",
        name: "Especies en Peligro",
        type: "biodiversity",
        description: "Ubicación de avistamientos de especies amenazadas",
        url: "/api/tile/biodiversity/endangered/{z}/{x}/{y}",
        visible: false,
        opacity: 0.8,
        legend: "/legends/endangered-species.png",
        metadata: {
          source: "IUCN Red List, INVEMAR",
          lastUpdated: "2025-03-05",
          resolution: "10m",
        },
      },

      // Capas de deforestación
      {
        id: "def-loss",
        name: "Pérdida de Cobertura",
        type: "deforestation",
        description: "Áreas donde se ha detectado pérdida de manglar",
        url: "/api/tile/deforestation/loss/{z}/{x}/{y}",
        visible: false,
        opacity: 0.7,
        legend: "/legends/forest-loss.png",
        metadata: {
          source: "Global Forest Watch, IDEAM",
          lastUpdated: "2025-03-15",
          resolution: "10m",
        },
      },
      {
        id: "def-risk",
        name: "Riesgo de Deforestación",
        type: "deforestation",
        description: "Áreas con alto riesgo de deforestación futura",
        url: "/api/tile/deforestation/risk/{z}/{x}/{y}",
        visible: false,
        opacity: 0.6,
        legend: "/legends/deforestation-risk.png",
        metadata: {
          source: "IDEAM, Universidad de Antioquia",
          lastUpdated: "2025-02-20",
          resolution: "30m",
        },
      },
      {
        id: "def-reforestation",
        name: "Proyectos de Reforestación",
        type: "deforestation",
        description: "Ubicación y estado de proyectos de reforestación",
        url: "/api/tile/deforestation/reforestation/{z}/{x}/{y}",
        visible: false,
        opacity: 0.8,
        legend: "/legends/reforestation.png",
        metadata: {
          source: "CORPOURABA, Ministerio de Ambiente",
          lastUpdated: "2025-03-01",
          resolution: "20m",
        },
      },

      // Capas de erosión costera
      {
        id: "ero-rate",
        name: "Tasa de Erosión",
        type: "coastal-erosion",
        description: "Tasa de erosión costera en metros por año",
        url: "/api/tile/coastal-erosion/rate/{z}/{x}/{y}",
        visible: false,
        opacity: 0.7,
        legend: "/legends/erosion-rate.png",
        metadata: {
          source: "INVEMAR, DIMAR",
          lastUpdated: "2025-02-15",
          resolution: "5m",
        },
      },
      {
        id: "ero-risk",
        name: "Riesgo de Inundación",
        type: "coastal-erosion",
        description: "Áreas con riesgo de inundación por aumento del nivel del mar",
        url: "/api/tile/coastal-erosion/flood-risk/{z}/{x}/{y}",
        visible: false,
        opacity: 0.6,
        legend: "/legends/flood-risk.png",
        metadata: {
          source: "IDEAM, NOAA",
          lastUpdated: "2025-01-30",
          resolution: "10m",
        },
      },
      {
        id: "ero-protection",
        name: "Infraestructura de Protección",
        type: "coastal-erosion",
        description: "Infraestructura existente para protección costera",
        url: "/api/tile/coastal-erosion/protection/{z}/{x}/{y}",
        visible: false,
        opacity: 0.8,
        legend: "/legends/coastal-protection.png",
        metadata: {
          source: "CORPOURABA, DIMAR",
          lastUpdated: "2025-02-10",
          resolution: "5m",
        },
      },

      // Capas de captura de CO2
      {
        id: "co2-stock",
        name: "Reservas de Carbono",
        type: "co2-capture",
        description: "Estimación de carbono almacenado en manglares",
        url: "/api/tile/co2-capture/carbon-stock/{z}/{x}/{y}",
        visible: false,
        opacity: 0.7,
        legend: "/legends/carbon-stock.png",
        metadata: {
          source: "Global Carbon Project, Universidad de Antioquia",
          lastUpdated: "2025-03-05",
          resolution: "30m",
        },
      },
      {
        id: "co2-sequestration",
        name: "Tasa de Secuestro",
        type: "co2-capture",
        description: "Tasa anual de secuestro de carbono",
        url: "/api/tile/co2-capture/sequestration/{z}/{x}/{y}",
        visible: false,
        opacity: 0.7,
        legend: "/legends/sequestration-rate.png",
        metadata: {
          source: "INVEMAR, Blue Carbon Initiative",
          lastUpdated: "2025-02-20",
          resolution: "50m",
        },
      },
      {
        id: "co2-potential",
        name: "Potencial de Restauración",
        type: "co2-capture",
        description: "Áreas con potencial para restauración y aumento de captura de CO2",
        url: "/api/tile/co2-capture/restoration-potential/{z}/{x}/{y}",
        visible: false,
        opacity: 0.6,
        legend: "/legends/restoration-potential.png",
        metadata: {
          source: "CORPOURABA, Ministerio de Ambiente",
          lastUpdated: "2025-01-25",
          resolution: "20m",
        },
      },
    ]

    // Filtrar capas según el tipo y región solicitados
    let filteredLayers = allLayers

    if (type && type !== "all") {
      filteredLayers = filteredLayers.filter((layer) => layer.type === type)
    }

    if (region && region !== "all") {
      // En un entorno real, aquí se filtrarían las capas por región
      // Para este ejemplo, asumimos que todas las capas están disponibles para todas las regiones
    }

    // Guardar en caché por 24 horas (86400 segundos)
    await kv.set(cacheKey, filteredLayers, { ex: 86400 })

    return {
      success: true,
      layers: filteredLayers,
      timestamp: new Date().toISOString(),
      source: "api",
    }
  } catch (error) {
    console.error("Error fetching layers:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error fetching layers",
      timestamp: new Date().toISOString(),
    }
  }
}

// Manejador principal de la ruta
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la solicitud
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type") as LayerType | null
    const region = searchParams.get("region") as Region | null

    // Obtener capas disponibles
    const response = await getLayers(type || undefined, region || undefined)

    // Respuesta JSON
    return NextResponse.json(response)
  } catch (error) {
    console.error("API route error:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error in API route",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

