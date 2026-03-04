import {
  QueryClient,
  useQuery as libUseQuery,
  type UseQueryOptions,
} from "@tanstack/react-query"
import type { ErrorResponse } from "./error"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
      refetchInterval: false,
    },
  },
})

interface UseQueryParams<T> {
  queryKey: unknown[]
  queryFn: () => Promise<T>
  options?: Omit<UseQueryOptions<T, ErrorResponse>, "queryKey" | "queryFn">
}

export const useQuery = <T>({ queryKey, queryFn, options }: UseQueryParams<T>) =>
  libUseQuery<T, ErrorResponse>({ queryKey, queryFn, ...options })
