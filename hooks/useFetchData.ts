import { useEffect, useState, useCallback } from "react"
import { fetchCurrentUser, UserData } from "@/hooks/user"

export function useFetch<T>(fn: () => Promise<T>, deps: any[] = []) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
        const result = await fn()
        setData(result)
    } catch (err) {
        setError(err)
    } finally {
        setLoading(false)
    }
    }, deps)

    useEffect(() => {
    load()
    }, [load])

    return { data, loading, error, refetch: load }
}

export function useCurrentUser() {
  return useFetch<UserData | null>(fetchCurrentUser, [])
}