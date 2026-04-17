import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface FaultDatabase {
  id: string;
  title: string;
  code?: string;
  description: string;
  symptoms: string;
  keywords: string; // JSON string
  affectedSystems?: string; // JSON string
  vehicleTypes?: string; // JSON string
  vehicleMakes?: string; // JSON string
  commonCauses: string; // JSON string
  solutionProcess: string; // JSON string
  estimatedTime?: number;
  estimatedCost?: number;
  requiredParts?: string; // JSON string
  tools?: string; // JSON string
  relatedFaults?: string; // JSON string
  imagesUrls?: string; // JSON string
  videoUrl?: string;
  relatedDocLink?: string;
  isCommon: boolean;
  severity: string;
  computerRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

// Hook para buscar fallas
export function useFaultSearch(
  query: string,
  filters?: { system?: string; severity?: string; computerRequired?: boolean },
) {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (filters?.system && filters.system !== "")
    params.append("system", filters.system);
  if (filters?.severity && filters.severity !== "")
    params.append("severity", filters.severity);
  if (filters?.computerRequired !== undefined)
    params.append(
      "computerRequired",
      filters.computerRequired ? "true" : "false",
    );

  const { data, error, isLoading } = useSWR<FaultDatabase[]>(
    query || Object.keys(filters || {}).length > 0
      ? `/api/faults/search?${params.toString()}`
      : null,
    fetcher,
  );

  return {
    faults: data || [],
    isLoading,
    isError: !!error,
  };
}

// Hook para obtener una falla específica
export function useFault(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<FaultDatabase>(
    id ? `/api/faults/${id}` : null,
    fetcher,
  );

  return {
    fault: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook para obtener todas las fallas (paginado)
export function useFaults(page: number = 1, limit: number = 20) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/faults?page=${page}&limit=${limit}`,
    fetcher,
  );

  return {
    faults: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: !!error,
    mutate,
  };
}
