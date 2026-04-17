import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  cost?: number;
  quantity: number;
  unit: string;
  supplier?: string;
  minStock: number;
  maxStock: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orderItems: number;
    quotationItems: number;
    stockMovements: number;
  };
}

// Hook para productos
export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    "/api/products",
    fetcher,
  );

  return {
    products: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook para producto específico
export function useProduct(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Product>(
    id ? `/api/products/${id}` : null,
    fetcher,
  );

  return {
    product: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
