import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
  vehicles?: Vehicle[]
}

export interface Vehicle {
  id: string
  clientId: string
  make: string
  model: string
  year: number
  licensePlate: string
  vin?: string
  type: string
  fuelType?: string
  transmission?: string
  mileage?: number
  color?: string
  engineType: string
  notes?: string
  createdAt: string
  updatedAt: string
  client?: {
    id: string
    name: string
  }
}

// Hook para obtener todos los clientes
export function useClients() {
  const { data, error, isLoading, mutate } = useSWR<Client[]>(
    '/api/clients',
    fetcher
  )

  return {
    clients: data || [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

// Hook para obtener un cliente específico
export function useClient(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Client>(
    id ? `/api/clients/${id}` : null,
    fetcher
  )

  return {
    client: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}

// Hook para obtener vehículos de un cliente
export function useClientVehicles(clientId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Vehicle[]>(
    clientId ? `/api/vehicles?clientId=${clientId}` : null,
    fetcher
  )

  return {
    vehicles: data || [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

// Hook para obtener todos los vehículos
export function useVehicles() {
  const { data, error, isLoading, mutate } = useSWR<Vehicle[]>(
    '/api/vehicles',
    fetcher
  )

  return {
    vehicles: data || [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

// Hook para obtener un vehículo específico
export function useVehicle(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Vehicle>(
    id ? `/api/vehicles/${id}` : null,
    fetcher
  )

  return {
    vehicle: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}
