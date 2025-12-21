"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Target,
  TrendingUp,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  ShieldX,
  FileCheck,
  Goal,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Eligibility Report", href: "/dashboard/eligibility", icon: FileText },
  { name: "Credit Path Optimizer", href: "/dashboard/optimizer", icon: Target },
  { name: "Loan Comparison", href: "/dashboard/loans", icon: TrendingUp },
  { name: "Application Timeline", href: "/dashboard/timeline", icon: Calendar },
  { name: "Peer Insights", href: "/dashboard/peers", icon: Users },
  { name: "Rejection Recovery", href: "/dashboard/rejection-recovery", icon: ShieldX },
  { name: "Document Checklist", href: "/dashboard/documents", icon: FileCheck },
  { name: "Multi-Goal Planner", href: "/dashboard/multi-goal", icon: Goal },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-emerald-600 hover:bg-emerald-700"
          size="icon"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ArthAstra</span>
            </Link>
          </div>

          {/* Navigation - English only, no translations */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              )
            })}

            <Link
              href="/dashboard/chat"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                pathname === "/dashboard/chat"
                  ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">Assistant</span>
            </Link>
          </nav>

          {/* Bottom Actions - Removed language toggle */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start text-gray-700">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="p-6 lg:p-10 max-w-[1600px]">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
