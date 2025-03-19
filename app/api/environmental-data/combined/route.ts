import { type NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

// Tipos para los parámetros de la solicitud
type Region = "uraba" | "cienaga" | "guajira" | "pacifico" | "caribe" | "all"

// Interfaces para las respuestas
interface ApiResponse {
  success: boolean
  message?: string
  data?: any
  layers?: any[]
  alerts?: any[]
  statistics?: any
  timestamp: string
  source?: string
}

// Función para obtener datos combinados
async function getCombinedData(region: Region, date?: string): Promise<ApiResponse> {
  try {
    // Clave para caché
    const cacheKey = `combined:${region}:${date || "latest"}`

    // Intentar obtener datos de caché
    const cachedData = await kv.get(cacheKey)
    if (cachedData) {
      console.log("Returning cached combined data")
      return {
        success: true,
        ...(cachedData as any),
        timestamp: new Date().toISOString(),
        source: "cache",
      }
    }

    // Si no hay datos en caché, obtener de las APIs
    console.log("Fetching fresh combined data")

    // En un entorno real, aquí se harían llamadas a las APIs internas
    // Para este ejemplo, generamos datos de muestra

    // Estadísticas generales
    const statistics = {
      ecosystemQuality: 74, // porcentaje
      totalMangroveArea: 12450, // hectáreas
      deforestedArea: 12.3, // hectáreas
      reforestedArea: 450, // hectáreas
      speciesCount: 187,
      endangeredSpecies: 42,
      averageErosionRate: 1.2, // metros por año
      annualCO2Capture: 45320, // toneladas
      lastUpdated: date || new Date().toISOString().split("T")[0],
    }

    // Alertas recientes
    const alerts = [
      {
        id: "def-001",
        type: "deforestation",
        title: "Deforestación Detectada",
        description: "Pérdida de manglar por tala ilegal",
        severity: "high",
        coordinates: [-76.57, 8.1],
        date: "2025-03-15",
        area: 5.2,
        location: "Norte del Golfo de Urabá",
      },
      {
        id: "ero-001",
        type: "erosion",
        title: "Erosión Acelerada",
        description: "Incremento de erosión en Playa Turbo",
        severity: "medium",
        coordinates: [-76.72, 8.05],
        date: "2025-03-14",
        rate: 2.8,
        location: "Playa Turbo",
      },
      {
        id: "bio-001",
        type: "biodiversity",
        title: "Avistamiento de Especies",
        description: "Grupo de manatíes detectado en Bahía Colombia",
        severity: "low",
        coordinates: [-76.65, 8.15],
        date: "2025-03-16",
        species: "Trichechus manatus",
        count: 8,
        location: "Bahía Colombia",
      },
      {
        id: "ref-001",
        type: "reforestation",
        title: "Reforestación Completada",
        description: "Proyecto de reforestación finalizado con éxito",
        severity: "info",
        coordinates: [-76.58, 8.05],
        date: "2025-03-12",
        area: 3.5,
        location: "Zona sur",
      },
    ]

    // Capas recomendadas
    const layers = [
      {
        id: "base-satellite",
        name: "Imagen Satelital",
        type: "base",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        visible: true,
        opacity: 1.0,
      },
      {
        id: "def-loss",
        name: "Pérdida de Cobertura",
        type: "deforestation",
        url: "/api/tile/deforestation/loss/{z}/{x}/{y}",
        visible: true,
        opacity: 0.7,
        legend: "/legends/forest-loss.png",
      },
      {
        id: "bio-endangered",
        name: "Especies en Peligro",
        type: "biodiversity",
        url: "/api/tile/biodiversity/endangered/{z}/{x}/{y}",
        visible: true,
        opacity: 0.8,
        legend: "/legends/endangered-species.png",
      },
      {
        id: "ero-rate",
        name: "Tasa de Erosión",
        type: "coastal-erosion",
        url: "/api/tile/coastal-erosion/rate/{z}/{x}/{y}",
        visible: true,
        opacity: 0.7,
        legend: "/legends/erosion-rate.png",
      },
      {
        id: "co2-stock",
        name: "Reservas de Carbono",
        type: "co2-capture",
        url: "/api/tile/co2-capture/carbon-stock/{z}/{x}/{y}",
        visible: true,
        opacity: 0.7,
        legend: "/legends/carbon-stock.png",
      },
    ]

    // Datos combinados
    const combinedData = {
      statistics,
      alerts,
      layers,
      region,
      date: date || new Date().toISOString().split("T")[0],
    }

    // Guardar en caché por 1 hora (3600 segundos)
    await kv.set(cacheKey, combinedData, { ex: 3600 })

    return {
      success: true,
      ...combinedData,
      timestamp: new Date().toISOString(),
      source: "api",
    }
  } catch (error) {
    console.error("Error fetching combined data:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error fetching combined data",
      timestamp: new Date().toISOString(),
    }
  }
}

// Manejador principal de la ruta
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la solicitud
    const searchParams = request.nextUrl.searchParams
    const region = (searchParams.get("region") as Region) || "uraba"
    const date = searchParams.get("date") || undefined
    const format = searchParams.get("format") || "json"

    // Obtener datos combinados
    const response = await getCombinedData(region, date)

    // Manejar formato de respuesta
    if (format === "csv" && response.success) {
      // Convertir a CSV (implementación simplificada)
      const csvData = "CSV data would be generated here"

      return new NextResponse(csvData, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="combined-data-${region}-${date || "latest"}.csv"`,
        },
      })
    }

    // Respuesta JSON por defecto
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

