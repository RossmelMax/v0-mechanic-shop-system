'use client'

import React from 'react'
import { useClient } from '@/hooks/use-clients'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { VehiclesList } from '@/components/clients/vehicles-list'
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react'

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.id as string
  const { client, isLoading } = useClient(clientId)
  const [_refreshKey, setRefreshKey] = React.useState(0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div className="text-center text-gray-500">Cliente no encontrado</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-gray-600 mt-2">Información del cliente y sus vehículos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {client.phone && (
            <div className="bg-white p-4 rounded-lg border flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <a href={`tel:${client.phone}`} className="font-semibold text-blue-600 hover:underline">
                  {client.phone}
                </a>
              </div>
            </div>
          )}

          {client.email && (
            <div className="bg-white p-4 rounded-lg border flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <a href={`mailto:${client.email}`} className="font-semibold text-blue-600 hover:underline">
                  {client.email}
                </a>
              </div>
            </div>
          )}

          {client.address && (
            <div className="bg-white p-4 rounded-lg border flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="font-semibold">{client.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Vehículos</h2>
        <VehiclesList
          client={client}
          onVehicleAdded={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
    </div>
  )
}
