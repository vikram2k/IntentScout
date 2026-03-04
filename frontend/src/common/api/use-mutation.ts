import {
  useMutation as libUseMutation,
  type UseMutationOptions,
} from "@tanstack/react-query"
import type { ErrorResponse } from "./error"

interface UseMutationParams<TData, TVariables> {
  mutationKey?: unknown[]
  mutationFn: (variables: TVariables) => Promise<TData>
  options?: Omit<
    UseMutationOptions<TData, ErrorResponse, TVariables>,
    "mutationKey" | "mutationFn"
  >
}

export const useMutation = <TData, TVariables>({
  mutationKey,
  mutationFn,
  options,
}: UseMutationParams<TData, TVariables>) =>
  libUseMutation<TData, ErrorResponse, TVariables>({
    mutationKey,
    mutationFn,
    ...options,
  })
