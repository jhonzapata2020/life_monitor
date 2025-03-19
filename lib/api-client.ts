// Tipos para las solicitudes de API
export type LayerType = "biodiversity" | "deforestation" | "coastal-erosion" | "co2-capture" | "base"
export type Region = "uraba" | "cienaga" | "guajira" | "pacifico" | "caribe" | "all"
export type TimeRange = "day" | "week" | "month" | "year" | "custom"

// Interfaces para las respuestas de API
interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

interface LayerResponse extends ApiResponse<any> {
  layers?: {
    id: string
    name: string
    type: LayerType
    url: string
    visible: boolean
    opacity: number
    legend?: string
  }[]
}

interface DataResponse extends ApiResponse<any> {
  statistics?: {
    [key: string]: any
  }
  alerts?: {
    id: string
    type: string
    title: string
    description: string
    severity: "high" | "medium" | "low"
    coordinates: [number, number]
    date: string
    area?: number
  }[]
}

interface CombinedResponse extends ApiResponse<any> {
  layers?: {
    id: string
    name: string
    type: LayerType
    url: string
    visible: boolean
    opacity: number
    legend?: string
  }[]
  statistics?: {
    [key: string]: any
  }
  alerts?: {
    id: string
    type: string
    title: string
    description: string
    severity: "high" | "medium" | "low"
    coordinates: [number, number]
    date: string
    area?: number
  }[]
}

// Cliente de API para datos ambientales
export const environmentalDataClient = {
  // Obtener datos específicos (biodiversidad, deforestación, etc.)
  async getData(type: LayerType, region?: Region, date?: string, timeRange?: TimeRange): Promise<DataResponse> {
    try {
      const params = new URLSearchParams()
      if (region) params.append("region", region)
      if (date) params.append("date", date)
      if (timeRange) params.append("timeRange", timeRange)

      const response = await fetch(`/api/environmental-data?type=${type}&${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error en la solicitud de datos:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      }
    }
  },

  // Obtener información de capas
  async getLayers(type?: LayerType, region?: Region): Promise<LayerResponse> {
    try {
      const params = new URLSearchParams()
      if (type) params.append("type", type)
      if (region) params.append("region", region)

      const response = await fetch(`/api/environmental-data/layers?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Error al obtener capas: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error en la solicitud de capas:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      }
    }
  },

  // Obtener datos combinados (capas, estadísticas y alertas)
  async getCombinedData(region?: Region, date?: string): Promise<CombinedResponse> {
    try {
      const params = new URLSearchParams()
      if (region) params.append("region", region)
      if (date) params.append("date", date)

      const response = await fetch(`/api/environmental-data/combined?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Error al obtener datos combinados: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error en la solicitud de datos combinados:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      }
    }
  },
}

