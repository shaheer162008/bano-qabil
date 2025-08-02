"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function UtilsPage() {
  const [loading, setLoading] = useState(false)
  const [dbStatus, setDbStatus] = useState<string | null>(null)

  const checkConnection = async () => {
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      setDbStatus(data.state)
      toast.success(`Database ${data.state}`)
    } catch (error) {
      toast.error('Failed to check database connection')
    }
  }

  const handleReset = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/reset', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      
      if (data.success) {
        toast.success('Database reset successful')
      } else {
        toast.error(data.message || 'Failed to reset database')
      }
    } catch (error) {
      toast.error('Error resetting database')
    } finally {
      setLoading(false)
    }
  }

  const handleSeed = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/seed', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      
      if (data.success) {
        toast.success('Database seeded successfully')
      } else {
        toast.error(data.message || 'Failed to seed database')
      }
    } catch (error) {
      toast.error('Error seeding database')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Utilities</CardTitle>
          <CardDescription>
            Manage database operations safely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={checkConnection}
            variant="outline"
            className="w-full"
          >
            Check Database Connection
          </Button>
          
          {dbStatus && (
            <div className={`p-3 rounded-md ${
              dbStatus === 'connected' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              Database Status: {dbStatus}
            </div>
          )}

          <Button 
            onClick={handleReset}
            variant="destructive"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Database'
            )}
          </Button>

          <Button 
            onClick={handleSeed}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Seeding...
              </>
            ) : (
              'Seed Database'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}