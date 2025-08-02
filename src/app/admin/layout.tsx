"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Wrench,
  CalendarDays
} from "lucide-react"
import { signOut } from "next-auth/react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Attendance",
      href: "/admin",
      icon: CalendarDays
    },
    {
      label: "Students",
      href: "/admin/students",
      icon: Users
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings
    },
    {
      label: "Utils",
      href: "/admin/utils",
      icon: Wrench
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
        <nav className="flex justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center p-2 ${
                  pathname === item.href ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 border-r bg-white">
        <div className="flex flex-col w-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Bano Qabil Admin</h1>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                        pathname === item.href
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}