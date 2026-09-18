import { useEffect, useRef, useState } from "react"
import { api } from "./api"
export function useResource<T>(
  path: string | null,
  interval = 0,
  keepPolling: (v: T) => boolean = () => true,
) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(!!path)
  const [version, setVersion] = useState(0)
  const predicate = useRef(keepPolling)
  predicate.current = keepPolling
  useEffect(() => {
    setData(undefined)
    setError(null)
    setLoading(!!path)
    if (!path) return
    let stopped = false
    let timer: ReturnType<typeof setTimeout>
    const controller = new AbortController()
    const run = async () => {
      if (stopped) return
      if (document.hidden) {
        timer = setTimeout(run, interval || 3000)
        return
      }
      let again = interval > 0
      try {
        const value = await api<T>(path, { signal: controller.signal })
        if (!stopped) {
          setData(value)
          setError(null)
          again = again && predicate.current(value)
        }
      } catch (e) {
        if (!stopped) setError(e as Error)
      } finally {
        if (!stopped) {
          setLoading(false)
          if (again) timer = setTimeout(run, interval)
        }
      }
    }
    void run()
    return () => {
      stopped = true
      controller.abort()
      clearTimeout(timer)
    }
  }, [path, interval, version])
  return {
    data,
    error,
    loading,
    refresh: () => setVersion((v) => v + 1),
    setData,
  }
}
export function useAction() {
  const lock = useRef(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const run = async (fn: () => Promise<void>) => {
    if (lock.current) return
    lock.current = true
    setPending(true)
    setError(null)
    try {
      await fn()
    } catch (e) {
      setError(e as Error)
    } finally {
      lock.current = false
      setPending(false)
    }
  }
  return { pending, error, run, setError }
}
export function location(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(
        new Error("Location is unavailable. Enter coordinates manually."),
      )
    navigator.geolocation.getCurrentPosition(
      (p) => resolve(p.coords),
      () =>
        reject(
          new Error(
            "Location access was denied or unavailable. You can enter coordinates manually.",
          ),
        ),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  })
}
