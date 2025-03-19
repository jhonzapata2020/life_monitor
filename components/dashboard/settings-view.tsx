"use client"

import { useState } from "react"
import {
  Settings,
  Save,
  RefreshCw,
  Moon,
  Sun,
  Database,
  Wifi,
  Cloud,
  Monitor,
  LayoutGrid,
  AlertTriangle,
  Check,
  X,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState("general")
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark")
  const [language, setLanguage] = useState("es-CO")
  const [dataRefreshRate, setDataRefreshRate] = useState(30)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [mapDefaultView, setMapDefaultView] = useState("satellite")
  const [showSensitiveData, setShowSensitiveData] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState("1-year")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null)

  // Simular guardado de configuración
  const handleSaveSettings = () => {
    setIsSaving(true)

    // Simular una operación asíncrona
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)

      // Resetear el estado de éxito después de 3 segundos
      setTimeout(() => {
        setSaveSuccess(null)
      }, 3000)
    }, 1500)
  }

  // Función para obtener el icono del tema
  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-5 w-5 text-indigo-400" />
      case "light":
        return <Sun className="h-5 w-5 text-amber-400" />
      case "system":
        return <Monitor className="h-5 w-5 text-slate-400" />
      default:
        return <Moon className="h-5 w-5 text-indigo-400" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-100 flex items-center">
              <Settings className="mr-2 h-5 w-5 text-teal-500" />
              Configuración del Sistema - Manglar Monitor
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-slate-800/50 text-teal-400 border-teal-500/50 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-teal-500 mr-1"></div>
                CONFIGURACIÓN DEL SISTEMA
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="general" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800/50 p-1 mb-6">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-400"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="interface"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-400"
              >
                Interfaz
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-400"
              >
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="data" className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-400">
                Datos y Privacidad
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-teal-400"
              >
                Sistema
              </TabsTrigger>
            </TabsList>

            {/* Pestaña de Configuración General */}
            <TabsContent value="general" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Configuración General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="system-name" className="text-slate-300">
                        Nombre del Sistema
                      </Label>
                      <Input
                        id="system-name"
                        defaultValue="Manglar Monitor - Golfo de Urabá"
                        className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language-select" className="text-slate-300">
                        Idioma
                      </Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger
                          id="language-select"
                          className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                        >
                          <SelectValue placeholder="Seleccionar idioma" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="es-CO">Español (Colombia)</SelectItem>
                          <SelectItem value="en-US">English (United States)</SelectItem>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="fr-FR">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone-select" className="text-slate-300">
                        Zona Horaria
                      </Label>
                      <Select defaultValue="america-bogota">
                        <SelectTrigger
                          id="timezone-select"
                          className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                        >
                          <SelectValue placeholder="Seleccionar zona horaria" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="america-bogota">América/Bogotá (UTC-5)</SelectItem>
                          <SelectItem value="america-new_york">América/New_York (UTC-4)</SelectItem>
                          <SelectItem value="america-los_angeles">América/Los_Angeles (UTC-7)</SelectItem>
                          <SelectItem value="europe-madrid">Europa/Madrid (UTC+1)</SelectItem>
                          <SelectItem value="asia-tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date-format-select" className="text-slate-300">
                        Formato de Fecha
                      </Label>
                      <Select defaultValue="dd-mm-yyyy">
                        <SelectTrigger
                          id="date-format-select"
                          className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                        >
                          <SelectValue placeholder="Seleccionar formato de fecha" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Frecuencia de Actualización de Datos</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          value={[dataRefreshRate]}
                          min={5}
                          max={60}
                          step={5}
                          className="flex-1"
                          onValueChange={(value) => setDataRefreshRate(value[0])}
                        />
                        <span className="text-sm text-slate-300 min-w-[60px] text-right">{dataRefreshRate} seg</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Configuración de Usuario</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name" className="text-slate-300">
                        Nombre de Usuario
                      </Label>
                      <Input
                        id="user-name"
                        defaultValue="Administrador"
                        className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-email" className="text-slate-300">
                        Correo Electrónico
                      </Label>
                      <Input
                        id="user-email"
                        type="email"
                        defaultValue="admin@manglaresuraba.org"
                        className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-role" className="text-slate-300">
                        Rol
                      </Label>
                      <Select defaultValue="admin">
                        <SelectTrigger id="user-role" className="bg-slate-800/70 border-slate-700/50 text-slate-100">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="manager">Gestor</SelectItem>
                          <SelectItem value="analyst">Analista</SelectItem>
                          <SelectItem value="viewer">Visualizador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-2">
                      <Button variant="outline" className="bg-slate-800/70 border-slate-700/50 text-slate-300 w-full">
                        Cambiar Contraseña
                      </Button>
                    </div>

                    <Separator className="bg-slate-700/50" />

                    <div className="space-y-2">
                      <Label className="text-slate-300">Sesión Activa</Label>
                      <div className="bg-slate-800/70 border border-slate-700/50 rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-slate-300">Dispositivo actual</div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Activo</Badge>
                        </div>
                        <div className="text-xs text-slate-400">Última actividad: Hace 5 minutos</div>
                        <div className="text-xs text-slate-500 mt-1">IP: 192.168.1.45 • Navegador: Chrome</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pestaña de Interfaz */}
            <TabsContent value="interface" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Apariencia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Tema</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className={`bg-slate-800/70 border ${theme === "dark" ? "border-teal-500" : "border-slate-700/50"} rounded-md p-3 cursor-pointer hover:bg-slate-800`}
                          onClick={() => setTheme("dark")}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Moon className="h-8 w-8 text-indigo-400 mb-2" />
                            <span className="text-sm text-slate-300">Oscuro</span>
                          </div>
                        </div>
                        <div
                          className={`bg-slate-800/70 border ${theme === "light" ? "border-teal-500" : "border-slate-700/50"} rounded-md p-3 cursor-pointer hover:bg-slate-800`}
                          onClick={() => setTheme("light")}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Sun className="h-8 w-8 text-amber-400 mb-2" />
                            <span className="text-sm text-slate-300">Claro</span>
                          </div>
                        </div>
                        <div
                          className={`bg-slate-800/70 border ${theme === "system" ? "border-teal-500" : "border-slate-700/50"} rounded-md p-3 cursor-pointer hover:bg-slate-800`}
                          onClick={() => setTheme("system")}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Monitor className="h-8 w-8 text-slate-400 mb-2" />
                            <span className="text-sm text-slate-300">Sistema</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Esquema de Color</Label>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="h-8 rounded-md bg-gradient-to-r from-green-500 to-teal-500 cursor-pointer border border-slate-700/50"></div>
                        <div className="h-8 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 cursor-pointer border border-slate-700/50"></div>
                        <div className="h-8 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer border border-teal-500"></div>
                        <div className="h-8 rounded-md bg-gradient-to-r from-red-500 to-pink-500 cursor-pointer border border-slate-700/50"></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Densidad de la Interfaz</Label>
                      <Select defaultValue="compact">
                        <SelectTrigger className="bg-slate-800/70 border-slate-700/50 text-slate-100">
                          <SelectValue placeholder="Seleccionar densidad" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="compact">Compacta</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="comfortable">Cómoda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Tamaño de Fuente</Label>
                      <div className="flex items-center space-x-2">
                        <Slider defaultValue={[14]} min={10} max={20} step={1} className="flex-1" />
                        <span className="text-sm text-slate-300 min-w-[40px] text-right">14px</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="animations-toggle" className="text-slate-300">
                          Animaciones
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-slate-500 cursor-help">
                                <AlertTriangle className="h-4 w-4" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Desactivar animaciones puede mejorar el rendimiento</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Switch id="animations-toggle" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="particles-toggle" className="text-slate-300">
                        Efecto de Partículas
                      </Label>
                      <Switch id="particles-toggle" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Configuración del Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Vista Predeterminada</Label>
                      <Select defaultValue="dashboard">
                        <SelectTrigger className="bg-slate-800/70 border-slate-700/50 text-slate-100">
                          <SelectValue placeholder="Seleccionar vista predeterminada" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="dashboard">Dashboard Principal</SelectItem>
                          <SelectItem value="map">Mapa de Manglares</SelectItem>
                          <SelectItem value="deforestation">Deforestación</SelectItem>
                          <SelectItem value="biodiversity">Biodiversidad</SelectItem>
                          <SelectItem value="erosion">Erosión Costera</SelectItem>
                          <SelectItem value="co2">Captura de CO2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Vista de Mapa Predeterminada</Label>
                      <Select value={mapDefaultView} onValueChange={setMapDefaultView}>
                        <SelectTrigger className="bg-slate-800/70 border-slate-700/50 text-slate-100">
                          <SelectValue placeholder="Seleccionar vista de mapa" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="satellite">Satelital</SelectItem>
                          <SelectItem value="deforestation">Deforestación</SelectItem>
                          <SelectItem value="biodiversity">Biodiversidad</SelectItem>
                          <SelectItem value="erosion">Erosión</SelectItem>
                          <SelectItem value="co2">Captura CO2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Personalización de Widgets</Label>
                      <div className="bg-slate-800/70 border border-slate-700/50 rounded-md p-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="widget-deforestation" defaultChecked />
                            <Label htmlFor="widget-deforestation" className="text-sm text-slate-400">
                              Deforestación
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="widget-biodiversity" defaultChecked />
                            <Label htmlFor="widget-biodiversity" className="text-sm text-slate-400">
                              Biodiversidad
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="widget-erosion" defaultChecked />
                            <Label htmlFor="widget-erosion" className="text-sm text-slate-400">
                              Erosión Costera
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="widget-co2" defaultChecked />
                            <Label htmlFor="widget-co2" className="text-sm text-slate-400">
                              Captura de CO2
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="widget-alerts" defaultChecked />
                            <Label htmlFor="widget-alerts" className="text-sm text-slate-400">
                              Alertas
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="widget-weather" defaultChecked />
                            <Label htmlFor="widget-weather" className="text-sm text-slate-400">
                              Clima
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-refresh-toggle" className="text-slate-300">
                        Actualización Automática
                      </Label>
                      <Switch id="auto-refresh-toggle" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="realtime-updates-toggle" className="text-slate-300">
                        Actualizaciones en Tiempo Real
                      </Label>
                      <Switch id="realtime-updates-toggle" defaultChecked />
                    </div>

                    <Button variant="outline" className="bg-slate-800/70 border-slate-700/50 text-slate-300 w-full">
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      Restablecer Diseño Predeterminado
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pestaña de Notificaciones */}
            <TabsContent value="notifications" className="mt-0">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-200">Configuración de Notificaciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications-toggle" className="text-slate-300">
                        Notificaciones
                      </Label>
                      <p className="text-xs text-slate-500 mt-1">Habilitar o deshabilitar todas las notificaciones</p>
                    </div>
                    <Switch
                      id="notifications-toggle"
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>

                  <Separator className="bg-slate-700/50" />

                  <div className="space-y-4">
                    <Label className="text-slate-300">Canales de Notificación</Label>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications-toggle" className="text-sm text-slate-400">
                          Correo Electrónico
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">Recibir notificaciones por correo electrónico</p>
                      </div>
                      <Switch
                        id="email-notifications-toggle"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        disabled={!notificationsEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications-toggle" className="text-sm text-slate-400">
                          SMS
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">Recibir notificaciones por mensaje de texto</p>
                      </div>
                      <Switch
                        id="sms-notifications-toggle"
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                        disabled={!notificationsEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications-toggle" className="text-sm text-slate-400">
                          Notificaciones Push
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">Recibir notificaciones en el navegador</p>
                      </div>
                      <Switch
                        id="push-notifications-toggle"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                        disabled={!notificationsEnabled}
                      />
                    </div>
                  </div>

                  <Separator className="bg-slate-700/50" />

                  <div className="space-y-4">
                    <Label className="text-slate-300">Tipos de Notificaciones</Label>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="alert-notifications" className="text-sm text-slate-400">
                          Alertas de Deforestación
                        </Label>
                        <Select defaultValue="all" disabled={!notificationsEnabled}>
                          <SelectTrigger
                            id="alert-notifications"
                            className="w-[180px] bg-slate-800/70 border-slate-700/50 text-slate-100"
                          >
                            <SelectValue placeholder="Seleccionar nivel" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                            <SelectItem value="all">Todas las alertas</SelectItem>
                            <SelectItem value="high">Solo alta prioridad</SelectItem>
                            <SelectItem value="none">Ninguna</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="system-notifications" className="text-sm text-slate-400">
                          Notificaciones del Sistema
                        </Label>
                        <Select defaultValue="important" disabled={!notificationsEnabled}>
                          <SelectTrigger
                            id="system-notifications"
                            className="w-[180px] bg-slate-800/70 border-slate-700/50 text-slate-100"
                          >
                            <SelectValue placeholder="Seleccionar nivel" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="important">Solo importantes</SelectItem>
                            <SelectItem value="none">Ninguna</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="report-notifications" className="text-sm text-slate-400">
                          Reportes Generados
                        </Label>
                        <Select defaultValue="all" disabled={!notificationsEnabled}>
                          <SelectTrigger
                            id="report-notifications"
                            className="w-[180px] bg-slate-800/70 border-slate-700/50 text-slate-100"
                          >
                            <SelectValue placeholder="Seleccionar nivel" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                            <SelectItem value="all">Todos los reportes</SelectItem>
                            <SelectItem value="scheduled">Solo programados</SelectItem>
                            <SelectItem value="none">Ninguno</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-700/50" />

                  <div className="space-y-2">
                    <Label className="text-slate-300">Horario de Notificaciones</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="notification-start-time" className="text-xs text-slate-400">
                          Desde
                        </Label>
                        <Input
                          id="notification-start-time"
                          type="time"
                          defaultValue="08:00"
                          className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                          disabled={!notificationsEnabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notification-end-time" className="text-xs text-slate-400">
                          Hasta
                        </Label>
                        <Input
                          id="notification-end-time"
                          type="time"
                          defaultValue="20:00"
                          className="bg-slate-800/70 border-slate-700/50 text-slate-100"
                          disabled={!notificationsEnabled}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox id="weekend-notifications" disabled={!notificationsEnabled} />
                      <Label htmlFor="weekend-notifications" className="text-sm text-slate-400">
                        Recibir notificaciones en fines de semana
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña de Datos y Privacidad */}
            <TabsContent value="data" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Gestión de Datos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Período de Retención de Datos</Label>
                      <Select value={dataRetentionPeriod} onValueChange={setDataRetentionPeriod}>
                        <SelectTrigger className="bg-slate-800/70 border-slate-700/50 text-slate-100">
                          <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="3-months">3 meses</SelectItem>
                          <SelectItem value="6-months">6 meses</SelectItem>
                          <SelectItem value="1-year">1 año</SelectItem>
                          <SelectItem value="2-years">2 años</SelectItem>
                          <SelectItem value="5-years">5 años</SelectItem>
                          <SelectItem value="indefinite">Indefinido</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">
                        Los datos más antiguos que el período seleccionado se archivarán automáticamente
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Copias de Seguridad</Label>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-backup-toggle" className="text-sm text-slate-400">
                            Copia de Seguridad Automática
                          </Label>
                          <p className="text-xs text-slate-500 mt-1">Realizar copias de seguridad automáticas</p>
                        </div>
                        <Switch id="auto-backup-toggle" checked={autoBackup} onCheckedChange={setAutoBackup} />
                      </div>

                      <div className="mt-2">
                        <Select value={backupFrequency} onValueChange={setBackupFrequency} disabled={!autoBackup}>
                          <SelectTrigger className="bg-slate-800/70 border-slate-700/50 text-slate-100">
                            <SelectValue placeholder="Frecuencia de copia de seguridad" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                            <SelectItem value="daily">Diaria</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="mt-4">
                        <Button variant="outline" className="bg-slate-800/70 border-slate-700/50 text-slate-300 w-full">
                          <Database className="h-4 w-4 mr-2" />
                          Crear Copia de Seguridad Manual
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-slate-700/50" />

                    <div className="space-y-2">
                      <Label className="text-slate-300">Exportación de Datos</Label>
                      <p className="text-xs text-slate-500">
                        Exportar todos los datos del sistema en diferentes formatos
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button variant="outline" className="bg-slate-800/70 border-slate-700/50 text-slate-300">
                          Exportar como CSV
                        </Button>
                        <Button variant="outline" className="bg-slate-800/70 border-slate-700/50 text-slate-300">
                          Exportar como JSON
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Privacidad y Seguridad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sensitive-data-toggle" className="text-slate-300">
                            Mostrar Datos Sensibles
                          </Label>
                          <p className="text-xs text-slate-500 mt-1">
                            Mostrar información confidencial en el dashboard
                          </p>
                        </div>
                        <Switch
                          id="sensitive-data-toggle"
                          checked={showSensitiveData}
                          onCheckedChange={setShowSensitiveData}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Nivel de Registro de Actividad</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger className="bg-slate-800/70 border-slate-700/50 text-slate-100">
                          <SelectValue placeholder="Seleccionar nivel" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="minimal">Mínimo</SelectItem>
                          <SelectItem value="standard">Estándar</SelectItem>
                          <SelectItem value="detailed">Detallado</SelectItem>
                          <SelectItem value="debug">Depuración</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">Determina qué acciones se registran en el sistema</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Seguridad de la Sesión</Label>
                      <Select defaultValue="30">
                        <SelectTrigger className="bg-slate-800/70 border-slate-700/50 text-slate-100">
                          <SelectValue placeholder="Tiempo de inactividad" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                          <SelectItem value="never">Nunca cerrar sesión</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">
                        Tiempo de inactividad antes de cerrar sesión automáticamente
                      </p>
                    </div>

                    <Separator className="bg-slate-700/50" />

                    <div className="space-y-2">
                      <Label className="text-slate-300">Acceso a Datos</Label>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="access-location" defaultChecked />
                        <Label htmlFor="access-location" className="text-sm text-slate-400">
                          Permitir acceso a ubicación
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="access-camera" />
                        <Label htmlFor="access-camera" className="text-sm text-slate-400">
                          Permitir acceso a cámara
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="access-notifications" defaultChecked />
                        <Label htmlFor="access-notifications" className="text-sm text-slate-400">
                          Permitir notificaciones del navegador
                        </Label>
                      </div>
                    </div>

                    <Alert className="bg-amber-900/20 border-amber-900/30 text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Advertencia</AlertTitle>
                      <AlertDescription>
                        Cambiar la configuración de privacidad puede afectar la funcionalidad del sistema.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pestaña de Sistema */}
            <TabsContent value="system" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Información del Sistema</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Versión del Sistema:</span>
                        <span className="text-slate-300">Manglar Monitor v2.5.3</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Última Actualización:</span>
                        <span className="text-slate-300">15 de marzo, 2025</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Estado del Sistema:</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Operativo</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Tiempo de Actividad:</span>
                        <span className="text-slate-300">14 días, 6 horas, 32 minutos</span>
                      </div>
                    </div>

                    <Separator className="bg-slate-700/50" />

                    <div className="space-y-2">
                      <Label className="text-slate-300">Recursos del Sistema</Label>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">CPU:</span>
                          <span className="text-slate-300">42%</span>
                        </div>
                        <Progress value={42} className="h-1.5 bg-slate-700">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                        </Progress>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Memoria:</span>
                          <span className="text-slate-300">68%</span>
                        </div>
                        <Progress value={68} className="h-1.5 bg-slate-700">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                        </Progress>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Almacenamiento:</span>
                          <span className="text-slate-300">45%</span>
                        </div>
                        <Progress value={45} className="h-1.5 bg-slate-700">
                          <div className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full" />
                        </Progress>
                      </div>
                    </div>

                    <Separator className="bg-slate-700/50" />

                    <div className="space-y-2">
                      <Label className="text-slate-300">Conexiones</Label>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Wifi className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-slate-400">API de Datos Satelitales</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Conectado</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Database className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-slate-400">Base de Datos Principal</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Conectado</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Cloud className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-slate-400">Servicio de Almacenamiento</span>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Latencia Alta</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-200">Mantenimiento del Sistema</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Actualizaciones</Label>
                      <div className="bg-slate-800/70 border border-slate-700/50 rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-slate-300">Estado de Actualización</div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Actualizado</Badge>
                        </div>
                        <div className="text-xs text-slate-400">No hay actualizaciones pendientes</div>
                        <Button
                          variant="outline"
                          className="bg-slate-800/70 border-slate-700/50 text-slate-300 w-full mt-2"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Buscar Actualizaciones
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Programación de Mantenimiento</Label>
                      <Select defaultValue="automatic">
                        <SelectTrigger className="bg-slate-800/70 border-slate-700/50 text-slate-100">
                          <SelectValue placeholder="Seleccionar modo" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="automatic">Automático</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="scheduled">Programado</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">
                        Determina cómo se realizan las tareas de mantenimiento
                      </p>
                    </div>

                    <Separator className="bg-slate-700/50" />

                    <div className="space-y-2">
                      <Label className="text-slate-300">Optimización</Label>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-optimize-toggle" className="text-sm text-slate-400">
                          Optimización Automática
                        </Label>
                        <Switch id="auto-optimize-toggle" defaultChecked />
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button variant="outline" className="bg-slate-800/70 border-slate-700/50 text-slate-300">
                          Optimizar Base de Datos
                        </Button>
                        <Button variant="outline" className="bg-slate-800/70 border-slate-700/50 text-slate-300">
                          Limpiar Caché
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-slate-700/50" />

                    <div className="space-y-2">
                      <Label className="text-slate-300">Registro de Eventos</Label>
                      <Select defaultValue="errors">
                        <SelectTrigger className="bg-slate-800/70 border-slate-700/50 text-slate-100">
                          <SelectValue placeholder="Nivel de registro" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="all">Todos los eventos</SelectItem>
                          <SelectItem value="warnings">Advertencias y errores</SelectItem>
                          <SelectItem value="errors">Solo errores</SelectItem>
                          <SelectItem value="none">Ninguno</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        className="bg-slate-800/70 border-slate-700/50 text-slate-300 w-full mt-2"
                      >
                        Ver Registros del Sistema
                      </Button>
                    </div>

                    <Alert className="bg-red-900/20 border-red-900/30 text-red-400">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Opciones Avanzadas</AlertTitle>
                      <AlertDescription>
                        Las siguientes opciones pueden afectar el funcionamiento del sistema.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="bg-slate-800/70 border-slate-700/50 text-amber-400 border-amber-500/30"
                      >
                        Reiniciar Sistema
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-slate-800/70 border-slate-700/50 text-red-400 border-red-500/30"
                      >
                        Restablecer a Valores de Fábrica
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-slate-700/50 p-4 flex justify-between">
          <div className="flex items-center space-x-2">
            {saveSuccess === true && (
              <div className="flex items-center text-green-400 text-sm">
                <Check className="h-4 w-4 mr-1" />
                Configuración guardada correctamente
              </div>
            )}
            {saveSuccess === false && (
              <div className="flex items-center text-red-400 text-sm">
                <X className="h-4 w-4 mr-1" />
                Error al guardar la configuración
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="bg-slate-800/70 border-slate-700/50 text-slate-300">
              Cancelar
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

// Componente de Checkbox que faltaba
function Checkbox({ id, defaultChecked, checked, onCheckedChange, disabled }: any) {
  return (
    <input
      type="checkbox"
      id={id}
      defaultChecked={defaultChecked}
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      disabled={disabled}
      className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-900"
    />
  )
}

