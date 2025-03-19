"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function SystemTime() {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1 font-mono">SYSTEM TIME</div>
            <div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
            <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
              <div className="text-xs text-slate-500 mb-1">Uptime</div>
              <div className="text-sm font-mono text-slate-200">14d 06:42:18</div>
            </div>
            <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
              <div className="text-xs text-slate-500 mb-1">Time Zone</div>
              <div className="text-sm font-mono text-slate-200">UTC-08:00</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

