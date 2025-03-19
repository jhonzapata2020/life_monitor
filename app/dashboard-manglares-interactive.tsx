"use client"

import type React from "react"

import { useState } from "react"
import {
  LayoutDashboard,
  Globe,
  TreePine,
  Fish,
  Waves,
  CloudSun,
  Activity,
  FileBarChart,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import BiodiversityView from "@/components/dashboard/biodiversity-view"
import DeforestationView from "@/components/dashboard/deforestation-view"
import CoastalErosionView from "@/components/dashboard/coastal-erosion-view"
import CO2CaptureView from "@/components/dashboard/co2-capture-view"
import SettingsView from "@/components/dashboard/settings-view"
import MapView from "@/components/dashboard/map-view"

// Tipo para las vistas disponibles
type View =
  | "dashboard"
  | "map"
  | "deforestation"
  | "biodiversity"
  | "coastal-erosion"
  | "co2-capture"
  | "realtime"
  | "reports"
  | "settings"

export default function DashboardManglaresInteractive() {
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const currentDate = new Date()
  const formattedDate = format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: es })

  // Opciones de navegación
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "map", label: "Mapa de Manglares", icon: Globe },
    { id: "deforestation", label: "Deforestación", icon: TreePine },
    { id: "biodiversity", label: "Biodiversidad", icon: Fish },
    { id: "coastal-erosion", label: "Erosión Costera", icon: Waves },
    { id: "co2-capture", label: "Captura de CO2", icon: CloudSun },
    { id: "realtime", label: "Monitoreo en Tiempo Real", icon: Activity },
    { id: "reports", label: "Reportes", icon: FileBarChart },
    { id: "settings", label: "Configuración", icon: Settings },
  ]

  // Renderizar el contenido principal según la vista seleccionada
  const renderMainContent = () => {
    switch (currentView) {
      case "map":
        return <MapView />
      case "biodiversity":
        return <BiodiversityView />
      case "deforestation":
        return <DeforestationView />
      case "coastal-erosion":
        return <CoastalErosionView />
      case "co2-capture":
        return <CO2CaptureView />
      case "settings":
        return <SettingsView />
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-200 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tarjetas de ejemplo para el dashboard */}
              <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
                <h2 className="text-lg font-medium text-slate-200 mb-2">Resumen de Manglares</h2>
                <p className="text-slate-400">Visualización general del estado de los manglares.</p>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
                <h2 className="text-lg font-medium text-slate-200 mb-2">Alertas Recientes</h2>
                <p className="text-slate-400">Últimas alertas de deforestación y cambios.</p>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
                <h2 className="text-lg font-medium text-slate-200 mb-2">Estadísticas</h2>
                <p className="text-slate-400">Datos estadísticos sobre la salud de los manglares.</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 bg-slate-900/80 backdrop-blur-sm border-r border-slate-800/60 transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center p-4 border-b border-slate-800/60">
          <div className="flex items-center space-x-2">
            <div className="bg-green-600 p-1 rounded">
              <TreePine className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-green-500">MANGLAR MONITOR</span>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id as View)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 rounded-md transition-colors",
                    currentView === item.id
                      ? "bg-green-600/20 text-green-500"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Contenido principal */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-64" : "ml-0",
        )}
      >
        {/* Barra superior */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/60 flex items-center justify-between px-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 mr-2"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar ubicación..."
                className="bg-slate-800/60 border border-slate-700/50 rounded-full py-1.5 px-4 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 w-64"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-400">
              <span className="hidden sm:inline">{formattedDate}</span>
            </div>
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-slate-700 hover:border-green-500 transition-colors">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                      <AvatarFallback className="bg-slate-800 text-slate-200">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-slate-800 border-slate-700 text-slate-200"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Juan Pérez</p>
                      <p className="text-xs text-slate-400">juan.perez@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-slate-700">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-slate-700">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-slate-700 hover:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Contenido de la vista actual */}
        <main className="flex-1 overflow-auto">{renderMainContent()}</main>
      </div>
    </div>
  )
}

// Componentes de iconos faltantes
function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function LogOut(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

