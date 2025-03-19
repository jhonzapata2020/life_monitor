"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Map,
  TreePine,
  Leaf,
  Waves,
  CloudSun,
  BarChart2,
  FileText,
  Settings,
  AlertTriangle,
} from "lucide-react"
import SystemTime from "@/components/dashboard/system-time"
import ParticleEffect from "@/components/dashboard/particle-effect"
import DashboardView from "@/components/dashboard/dashboard-view"
import BiodiversityView from "@/components/dashboard/biodiversity-view"
import DeforestationView from "@/components/dashboard/deforestation-view"
import CoastalErosionView from "@/components/dashboard/coastal-erosion-view"
import CO2CaptureView from "@/components/dashboard/co2-capture-view"
import RealTimeMonitoringView from "@/components/dashboard/real-time-monitoring-view"
import ReportsView from "@/components/dashboard/reports-view"
import SettingsView from "@/components/dashboard/settings-view"
import MapView from "@/components/dashboard/map-view"
import DashboardDataView from "@/components/dashboard/dashboard-data-view"

export default function DashboardManglares() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [systemStatus, setSystemStatus] = useState("online")
  const [uptime, setUptime] = useState("14d 06:42:18")
  const [timeZone, setTimeZone] = useState("UTC-05:00")

  // Simular cambios en el estado del sistema
  useEffect(() => {
    const interval = setInterval(() => {
      // Actualizar tiempo de actividad
      const [days, time] = uptime.split(" ")
      const [hours, minutes, seconds] = time.split(":").map(Number)

      let newSeconds = seconds + 1
      let newMinutes = minutes
      let newHours = hours
      let newDays = Number.parseInt(days.replace("d", ""))

      if (newSeconds >= 60) {
        newSeconds = 0
        newMinutes += 1
      }

      if (newMinutes >= 60) {
        newMinutes = 0
        newHours += 1
      }

      if (newHours >= 24) {
        newHours = 0
        newDays += 1
      }

      setUptime(
        `${newDays}d ${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`,
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [uptime])

  // Renderizar el contenido principal según la vista seleccionada
  const renderMainContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardDataView />
      case "map":
        return <MapView />
      case "deforestation":
        return <DeforestationView />
      case "biodiversity":
        return <BiodiversityView />
      case "coastal-erosion":
        return <CoastalErosionView />
      case "co2-capture":
        return <CO2CaptureView />
      case "real-time":
        return <RealTimeMonitoringView />
      case "reports":
        return <ReportsView />
      case "settings":
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 bg-slate-900/50 border-r border-slate-800/50 backdrop-blur-sm flex flex-col">
        <div className="p-4 border-b border-slate-800/50">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mr-3">
              <Leaf className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-green-500">MANGLAR</h1>
              <p className="text-xs text-slate-400">MONITOR</p>
            </div>
          </div>
        </div>

        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-slate-500 px-3 mb-2">NAVEGACIÓN</p>
            <nav className="space-y-1">
              <button
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  currentView === "dashboard"
                    ? "bg-green-500/20 text-green-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
                onClick={() => setCurrentView("dashboard")}
              >
                <LayoutDashboard className="h-4 w-4 mr-3" />
                Dashboard
              </button>

              <button
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  currentView === "map"
                    ? "bg-green-500/20 text-green-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
                onClick={() => setCurrentView("map")}
              >
                <Map className="h-4 w-4 mr-3" />
                Mapa de Manglares
              </button>

              <button
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  currentView === "deforestation"
                    ? "bg-green-500/20 text-green-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
                onClick={() => setCurrentView("deforestation")}
              >
                <TreePine className="h-4 w-4 mr-3" />
                Deforestación
              </button>

              <button
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  currentView === "biodiversity"
                    ? "bg-green-500/20 text-green-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
                onClick={() => setCurrentView("biodiversity")}
              >
                <Leaf className="h-4 w-4 mr-3" />
                Biodiversidad
              </button>

              <button
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  currentView === "coastal-erosion"
                    ? "bg-green-500/20 text-green-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
                onClick={() => setCurrentView("coastal-erosion")}
              >
                <Waves className="h-4 w-4 mr-3" />
                Erosión Costera
              </button>

              <button
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  currentView === "co2-capture"
                    ? "bg-green-500/20 text-green-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
                onClick={() => setCurrentView("co2-capture")}
              >
                <CloudSun className="h-4 w-4 mr-3" />
                Captura de CO₂
              </button>
            </nav>
          </div>

          <div className="px-3 mt-6">
            <p className="text-xs font-semibold text-slate-500 px-3 mb-2">ANÁLISIS</p>
            <nav className="space-y-1">
              <button
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  currentView === "real-time"
                    ? "bg-green-500/20 text-green-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
                onClick={() => setCurrentView("real-time")}
              >
                <BarChart2 className="h-4 w-4 mr-3" />
                Monitoreo en Tiempo Real
              </button>

              <button
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  currentView === "reports"
                    ? "bg-green-500/20 text-green-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
                onClick={() => setCurrentView("reports")}
              >
                <FileText className="h-4 w-4 mr-3" />
                Informes y Reportes
              </button>
            </nav>
          </div>

          <div className="px-3 mt-6">
            <p className="text-xs font-semibold text-slate-500 px-3 mb-2">SISTEMA</p>
            <nav className="space-y-1">
              <button
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  currentView === "settings"
                    ? "bg-green-500/20 text-green-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
                onClick={() => setCurrentView("settings")}
              >
                <Settings className="h-4 w-4 mr-3" />
                Configuración
              </button>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <div className="text-xs uppercase font-semibold text-slate-500 mb-2">ESTADO DEL SISTEMA</div>
          <div className="bg-slate-800/50 rounded-md p-3">
            <SystemTime />

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-slate-800/80 rounded p-2">
                <div className="text-xs text-slate-500 mb-1">Uptime</div>
                <div className="text-sm font-mono text-slate-300">{uptime}</div>
              </div>
              <div className="bg-slate-800/80 rounded p-2">
                <div className="text-xs text-slate-500 mb-1">Time Zone</div>
                <div className="text-sm font-mono text-slate-300">{timeZone}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center">
              <div
                className={cn("h-2 w-2 rounded-full mr-2", systemStatus === "online" ? "bg-green-500" : "bg-red-500")}
              ></div>
              <span className="text-xs text-slate-400">
                {systemStatus === "online" ? "Sistema en línea" : "Sistema fuera de línea"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <ParticleEffect />

        {/* Header */}
        <div className="h-16 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">
              {currentView === "dashboard" && "Dashboard"}
              {currentView === "map" && "Mapa de Manglares"}
              {currentView === "deforestation" && "Monitoreo de Deforestación"}
              {currentView === "biodiversity" && "Biodiversidad"}
              {currentView === "coastal-erosion" && "Erosión Costera"}
              {currentView === "co2-capture" && "Captura de CO₂"}
              {currentView === "real-time" && "Monitoreo en Tiempo Real"}
              {currentView === "reports" && "Informes y Reportes"}
              {currentView === "settings" && "Configuración del Sistema"}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-green-500/50 transition-colors">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </button>
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-slate-900 text-[10px] flex items-center justify-center text-white">
                3
              </span>
            </div>

            <div className="flex items-center">
              <div className="mr-4 text-right">
                <div className="text-sm font-medium">16 de marzo de 2025</div>
                <div className="text-xs text-slate-400">Golfo de Urabá, Colombia</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/10 border border-slate-700 hover:border-green-500/50 transition-colors overflow-hidden">
                <img src="/placeholder.svg?height=40&width=40" alt="User" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden p-6">{renderMainContent()}</div>
      </div>
    </div>
  )
}

