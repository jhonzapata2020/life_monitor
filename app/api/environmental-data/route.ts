import { type NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

// Tipos para los parámetros de la solicitud
type DataType = "biodiversity" | "deforestation" | "coastal-erosion" | "co2-capture" | "all"
type Region = "uraba" | "cienaga" | "guajira" | "pacifico" | "caribe" | "all"
type TimeRange = "day" | "week" | "month" | "year" | "custom"

// Interfaces para las respuestas
interface ApiResponse {
  success: boolean
  message?: string
  data?: any
  timestamp: string
  source?: string
}

// Función para verificar si KV está disponible
function isKVAvailable() {
  try {
    return process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  } catch (error) {
    return false
  }
}

// Función para obtener datos de biodiversidad
async function getBiodiversityData(region: Region, date?: string): Promise<ApiResponse> {
  try {
    // Clave para caché
    const cacheKey = `biodiversity:${region}:${date || "latest"}`

    // Intentar obtener datos de caché solo si KV está disponible
    if (isKVAvailable()) {
      try {
        const cachedData = await kv.get(cacheKey)
        if (cachedData) {
          console.log("Returning cached biodiversity data")
          return {
            success: true,
            data: cachedData,
            timestamp: new Date().toISOString(),
            source: "cache",
          }
        }
      } catch (error) {
        console.warn("KV cache error, using simulated data:", error)
      }
    } else {
      console.log("KV not available, using simulated data")
    }

    // Si no hay datos en caché o KV no está disponible, generar datos simulados
    console.log("Generating simulated biodiversity data")

    // Datos de ejemplo para biodiversidad
    const biodiversityData = {
      region: region,
      date: date || new Date().toISOString().split("T")[0],
      statistics: {
        totalSpecies: 187,
        endangeredSpecies: 42,
        newSpeciesDetected: 5,
        biodiversityIndex: 0.78,
      },
      species: [
        {
          id: "sp-001",
          scientificName: "Rhizophora mangle",
          commonName: "Mangle rojo",
          category: "flora",
          conservationStatus: "LC",
          observations: 156,
          coordinates: [
            [-76.57, 8.1],
            [-76.59, 8.12],
            [-76.55, 8.08],
          ],
        },
        {
          id: "sp-002",
          scientificName: "Trichechus manatus",
          commonName: "Manatí",
          category: "fauna",
          conservationStatus: "VU",
          observations: 23,
          coordinates: [
            [-76.65, 8.15],
            [-76.63, 8.14],
          ],
        },
        {
          id: "sp-003",
          scientificName: "Crocodylus acutus",
          commonName: "Caimán aguja",
          category: "fauna",
          conservationStatus: "VU",
          observations: 42,
          coordinates: [
            [-76.58, 8.11],
            [-76.56, 8.09],
          ],
        },
        {
          id: "sp-004",
          scientificName: "Caiman crocodilus",
          commonName: "Babilla",
          category: "fauna",
          conservationStatus: "LC",
          observations: 78,
          coordinates: [
            [-76.6, 8.12],
            [-76.58, 8.1],
          ],
        },
      ],
      hotspots: [
        {
          id: "hs-001",
          name: "Bahía Colombia",
          coordinates: [-76.65, 8.15],
          speciesCount: 78,
          importance: "high",
        },
        {
          id: "hs-002",
          name: "Ciénaga de Tumaradó",
          coordinates: [-76.57, 8.1],
          speciesCount: 65,
          importance: "medium",
        },
      ],
    }

    // Guardar en caché solo si KV está disponible
    if (isKVAvailable()) {
      try {
        await kv.set(cacheKey, biodiversityData, { ex: 3600 })
      } catch (error) {
        console.warn("Failed to cache biodiversity data:", error)
      }
    }

    return {
      success: true,
      data: biodiversityData,
      timestamp: new Date().toISOString(),
      source: "simulated",
    }
  } catch (error) {
    console.error("Error fetching biodiversity data:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error fetching biodiversity data",
      timestamp: new Date().toISOString(),
    }
  }
}

// Función para obtener datos de deforestación
async function getDeforestationData(region: Region, date?: string): Promise<ApiResponse> {
  try {
    // Clave para caché
    const cacheKey = `deforestation:${region}:${date || "latest"}`

    // Intentar obtener datos de caché solo si KV está disponible
    if (isKVAvailable()) {
      try {
        const cachedData = await kv.get(cacheKey)
        if (cachedData) {
          console.log("Returning cached deforestation data")
          return {
            success: true,
            data: cachedData,
            timestamp: new Date().toISOString(),
            source: "cache",
          }
        }
      } catch (error) {
        console.warn("KV cache error, using simulated data:", error)
      }
    } else {
      console.log("KV not available, using simulated data")
    }

    // Si no hay datos en caché o KV no está disponible, generar datos simulados
    console.log("Generating simulated deforestation data")

    // Datos de ejemplo para deforestación
    const deforestationData = {
      region: region,
      date: date || new Date().toISOString().split("T")[0],
      statistics: {
        totalArea: 12450, // hectáreas
        deforestedArea: 12.3, // hectáreas
        reforestedArea: 450, // hectáreas
        changeRate: -2.1, // porcentaje anual
      },
      alerts: [
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
          id: "def-002",
          type: "deforestation",
          title: "Deforestación Potencial",
          description: "Actividad sospechosa detectada por satélite",
          severity: "medium",
          coordinates: [-76.59, 8.12],
          date: "2025-03-16",
          area: 3.1,
        },
      ],
      reforestationProjects: [
        {
          id: "ref-001",
          name: "Restauración Bahía Colombia",
          coordinates: [-76.65, 8.15],
          area: 120,
          startDate: "2024-05-10",
          status: "in-progress",
          completionPercentage: 65,
        },
        {
          id: "ref-002",
          name: "Reforestación Zona Sur",
          coordinates: [-76.58, 8.05],
          area: 85,
          startDate: "2024-08-22",
          status: "completed",
          completionPercentage: 100,
        },
      ],
    }

    // Guardar en caché solo si KV está disponible
    if (isKVAvailable()) {
      try {
        await kv.set(cacheKey, deforestationData, { ex: 3600 })
      } catch (error) {
        console.warn("Failed to cache deforestation data:", error)
      }
    }

    return {
      success: true,
      data: deforestationData,
      timestamp: new Date().toISOString(),
      source: "simulated",
    }
  } catch (error) {
    console.error("Error fetching deforestation data:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error fetching deforestation data",
      timestamp: new Date().toISOString(),
    }
  }
}

// Función para obtener datos de erosión costera
async function getCoastalErosionData(region: Region, date?: string): Promise<ApiResponse> {
  try {
    // Clave para caché
    const cacheKey = `coastal-erosion:${region}:${date || "latest"}`

    // Intentar obtener datos de caché solo si KV está disponible
    if (isKVAvailable()) {
      try {
        const cachedData = await kv.get(cacheKey)
        if (cachedData) {
          console.log("Returning cached coastal erosion data")
          return {
            success: true,
            data: cachedData,
            timestamp: new Date().toISOString(),
            source: "cache",
          }
        }
      } catch (error) {
        console.warn("KV cache error, using simulated data:", error)
      }
    } else {
      console.log("KV not available, using simulated data")
    }

    // Si no hay datos en caché o KV no está disponible, generar datos simulados
    console.log("Generating simulated coastal erosion data")

    // Datos de ejemplo para erosión costera
    const coastalErosionData = {
      region: region,
      date: date || new Date().toISOString().split("T")[0],
      statistics: {
        averageErosionRate: 1.2, // metros por año
        criticalPoints: 8,
        protectedCoastline: 65, // porcentaje
        floodRisk: "medium",
      },
      alerts: [
        {
          id: "ero-001",
          type: "erosion",
          title: "Erosión Acelerada",
          description: "Incremento de erosión en Playa Turbo",
          severity: "medium",
          coordinates: [-76.72, 8.05],
          date: "2025-03-14",
          rate: 2.8, // metros por año
        },
        {
          id: "ero-002",
          type: "erosion",
          title: "Riesgo de Inundación",
          description: "Zona baja con riesgo de inundación por marea alta",
          severity: "high",
          coordinates: [-76.68, 8.08],
          date: "2025-03-16",
        },
      ],
      criticalZones: [
        {
          id: "cz-001",
          name: "Playa Turbo",
          coordinates: [
            [-76.72, 8.05],
            [-76.73, 8.06],
            [-76.71, 8.04],
          ],
          erosionRate: 2.8,
          riskLevel: "high",
          affectedCommunities: ["Turbo", "El Waffe"],
        },
        {
          id: "cz-002",
          name: "Punta Caimán",
          coordinates: [
            [-76.68, 8.08],
            [-76.69, 8.09],
            [-76.67, 8.07],
          ],
          erosionRate: 1.5,
          riskLevel: "medium",
          affectedCommunities: ["Necoclí"],
        },
      ],
    }

    // Guardar en caché solo si KV está disponible
    if (isKVAvailable()) {
      try {
        await kv.set(cacheKey, coastalErosionData, { ex: 3600 })
      } catch (error) {
        console.warn("Failed to cache coastal erosion data:", error)
      }
    }

    return {
      success: true,
      data: coastalErosionData,
      timestamp: new Date().toISOString(),
      source: "simulated",
    }
  } catch (error) {
    console.error("Error fetching coastal erosion data:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error fetching coastal erosion data",
      timestamp: new Date().toISOString(),
    }
  }
}

// Función para obtener datos de captura de CO2
async function getCO2CaptureData(region: Region, date?: string): Promise<ApiResponse> {
  try {
    // Clave para caché
    const cacheKey = `co2-capture:${region}:${date || "latest"}`

    // Intentar obtener datos de caché solo si KV está disponible
    if (isKVAvailable()) {
      try {
        const cachedData = await kv.get(cacheKey)
        if (cachedData) {
          console.log("Returning cached CO2 capture data")
          return {
            success: true,
            data: cachedData,
            timestamp: new Date().toISOString(),
            source: "cache",
          }
        }
      } catch (error) {
        console.warn("KV cache error, using simulated data:", error)
      }
    } else {
      console.log("KV not available, using simulated data")
    }

    // Si no hay datos en caché o KV no está disponible, generar datos simulados
    console.log("Generating simulated CO2 capture data")

    // Datos de ejemplo para captura de CO2
    const co2CaptureData = {
      region: region,
      date: date || new Date().toISOString().split("T")[0],
      statistics: {
        annualCapture: 45320, // toneladas
        storedCarbon: 1200000, // toneladas
        captureEfficiency: "high",
        restorationPotential: 15, // porcentaje
      },
      mangroveZones: [
        {
          id: "mz-001",
          name: "Bahía Colombia",
          coordinates: [
            [-76.65, 8.15],
            [-76.66, 8.16],
            [-76.64, 8.14],
          ],
          area: 3200, // hectáreas
          carbonStock: 450000, // toneladas
          annualSequestration: 15600, // toneladas por año
          health: "good",
        },
        {
          id: "mz-002",
          name: "Ciénaga de Tumaradó",
          coordinates: [
            [-76.57, 8.1],
            [-76.58, 8.11],
            [-76.56, 8.09],
          ],
          area: 2800, // hectáreas
          carbonStock: 380000, // toneladas
          annualSequestration: 12800, // toneladas por año
          health: "excellent",
        },
      ],
      restorationProjects: [
        {
          id: "rp-001",
          name: "Captura de Carbono Azul",
          coordinates: [-76.63, 8.12],
          area: 450, // hectáreas
          potentialCapture: 8500, // toneladas por año
          status: "planned",
          startDate: "2025-06-01",
        },
      ],
    }

    // Guardar en caché solo si KV está disponible
    if (isKVAvailable()) {
      try {
        await kv.set(cacheKey, co2CaptureData, { ex: 3600 })
      } catch (error) {
        console.warn("Failed to cache CO2 capture data:", error)
      }
    }

    return {
      success: true,
      data: co2CaptureData,
      timestamp: new Date().toISOString(),
      source: "simulated",
    }
  } catch (error) {
    console.error("Error fetching CO2 capture data:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error fetching CO2 capture data",
      timestamp: new Date().toISOString(),
    }
  }
}

// Función para obtener todos los datos combinados
async function getAllData(region: Region, date?: string): Promise<ApiResponse> {
  try {
    // Obtener datos de todas las categorías en paralelo
    const [biodiversityResponse, deforestationResponse, coastalErosionResponse, co2CaptureResponse] = await Promise.all(
      [
        getBiodiversityData(region, date),
        getDeforestationData(region, date),
        getCoastalErosionData(region, date),
        getCO2CaptureData(region, date),
      ],
    )

    // Combinar todos los datos
    const combinedData = {
      region: region,
      date: date || new Date().toISOString().split("T")[0],
      biodiversity: biodiversityResponse.success ? biodiversityResponse.data : null,
      deforestation: deforestationResponse.success ? deforestationResponse.data : null,
      coastalErosion: coastalErosionResponse.success ? coastalErosionResponse.data : null,
      co2Capture: co2CaptureResponse.success ? co2CaptureResponse.data : null,
      summary: {
        ecosystemQuality: 74, // porcentaje
        totalMangroveArea: 12450, // hectáreas
        deforestedArea: 12.3, // hectáreas
        reforestedArea: 450, // hectáreas
        speciesCount: 187,
        endangeredSpecies: 42,
        averageErosionRate: 1.2, // metros por año
        annualCO2Capture: 45320, // toneladas
      },
    }

    return {
      success: true,
      data: combinedData,
      timestamp: new Date().toISOString(),
      source: "combined",
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
    const type = (searchParams.get("type") as DataType) || "all"
    const region = (searchParams.get("region") as Region) || "uraba"
    const date = searchParams.get("date") || undefined
    const format = searchParams.get("format") || "json"

    let response: ApiResponse

    // Obtener datos según el tipo solicitado
    switch (type) {
      case "biodiversity":
        response = await getBiodiversityData(region, date)
        break
      case "deforestation":
        response = await getDeforestationData(region, date)
        break
      case "coastal-erosion":
        response = await getCoastalErosionData(region, date)
        break
      case "co2-capture":
        response = await getCO2CaptureData(region, date)
        break
      case "all":
      default:
        response = await getAllData(region, date)
        break
    }

    // Manejar formato de respuesta
    if (format === "csv" && response.success) {
      // Convertir a CSV (implementación simplificada)
      // En un entorno real, se usaría una biblioteca como json2csv
      const csvData = "CSV data would be generated here"

      return new NextResponse(csvData, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="environmental-data-${type}-${region}-${date || "latest"}.csv"`,
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

