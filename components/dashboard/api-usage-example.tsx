"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { environmentalDataClient, type Region, type DataType, type TimeRange } from "@/lib/api-client"

export default function ApiUsageExample() {
  const [activeTab, setActiveTab] = useState<string>("biodiversity")
  const [region, setRegion] = useState<Region>("uraba")
  const [timeRange, setTimeRange] = useState<TimeRange>("last-year")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  // Función para cargar datos según el tipo seleccionado
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    setData(null)

    try {
      let result

      if (activeTab === "combined") {
        result = await environmentalDataClient.getCombinedData(region, timeRange, true)
      } else if (activeTab === "layers") {
        result = await environmentalDataClient.getLayers(activeTab as any, region)
      } else {
        result = await environmentalDataClient.getData(activeTab as DataType, region)
      }

      setData(result)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos cuando cambia la pestaña o la región
  useEffect(() => {
    fetchData()
  }, [activeTab, region, timeRange])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ejemplo de Uso de la API</CardTitle>
        <CardDescription>Consulta datos ambientales de diferentes fuentes</CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="biodiversity">Biodiversidad</TabsTrigger>
            <TabsTrigger value="deforestation">Deforestación</TabsTrigger>
            <TabsTrigger value="coastal-erosion">Erosión Costera</TabsTrigger>
            <TabsTrigger value="co2-capture">Captura CO2</TabsTrigger>
            <TabsTrigger value="combined">Combinado</TabsTrigger>
          </TabsList>
        </div>

        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1/3">
              <label className="text-sm font-medium mb-1 block">Región</label>
              <Select value={region} onValueChange={(value) => setRegion(value as Region)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las regiones</SelectItem>
                  <SelectItem value="uraba">Golfo de Urabá</SelectItem>
                  <SelectItem value="cienaga">Ciénaga Grande</SelectItem>
                  <SelectItem value="guajira">Costa Guajira</SelectItem>
                  <SelectItem value="pacifico">Pacífico Colombiano</SelectItem>
                  <SelectItem value="caribe">Caribe Colombiano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {activeTab === "combined" && (
              <div className="w-1/3">
                <label className="text-sm font-medium mb-1 block">Periodo de Tiempo</label>
                <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-month">Último mes</SelectItem>
                    <SelectItem value="last-quarter">Último trimestre</SelectItem>
                    <SelectItem value="last-year">Último año</SelectItem>
                    <SelectItem value="last-5-years">Últimos 5 años</SelectItem>
                    <SelectItem value="all-time">Todo el historial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex-1 flex justify-end">
              <Button onClick={fetchData} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  "Actualizar datos"
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Datos cargados correctamente</AlertTitle>
              <AlertDescription>
                Se han obtenido {data?.count || data?.summaries?.length || "los"} registros de datos.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 max-h-[500px] overflow-auto">
            <pre className="text-xs">{data ? JSON.stringify(data, null, 2) : "Cargando datos..."}</pre>
          </div>
        </CardContent>
      </Tabs>

      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>
          Endpoint:{" "}
          <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
            /api/environmental-data{activeTab === "combined" ? "/combined" : activeTab === "layers" ? "/layers" : ""}
          </code>
        </div>
        <div>Última actualización: {new Date().toLocaleTimeString()}</div>
      </CardFooter>
    </Card>
  )
}

