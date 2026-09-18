import type { RideStatus, DriverStatus, PaymentStatus } from "./data"
export type User = {
  id: number
  name: string
  email: string
  phone: string
  role: "PASSENGER" | "DRIVER" | "ADMIN"
}
export type Session = {
  token: string
  tokenType: string
  expiresAt: number
  user: User
}
export type Driver = {
  driverId: number
  userId: number
  name: string
  phone: string
  licenseNumber: string
  vehicleNumber: string
  vehicleModel: string
  vehicleType: string
  availability: DriverStatus
  latitude: number | null
  longitude: number | null
  rating: number
}
export type Ride = {
  rideId: number
  passengerId: number
  driverId: number | null
  pickupLocation: string
  pickupLatitude: number
  pickupLongitude: number
  dropLocation: string
  dropLatitude: number
  dropLongitude: number
  distance: number | null
  fare: number | null
  status: RideStatus
  createdAt: string
  completedAt: string | null
  completionSynced: boolean
}
export type Offer = {
  offerId: number
  rideId: number
  driverId: number
  status: string
  ride: Ride
}
export type Payment = {
  paymentId: number
  rideId: number
  amount: number
  paymentMethod: "CASH" | "UPI" | "CARD"
  paymentStatus: PaymentStatus
  transactionReference: string | null
  createdAt: string
}
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors: Record<string, string> = {},
  ) {
    super(message)
  }
}
const key = "urbanglide.session"
export function readSession(): Session | null {
  try {
    const s = JSON.parse(sessionStorage.getItem(key) || "null")
    return s?.token && s.expiresAt > Date.now() ? s : null
  } catch {
    return null
  }
}
export function saveSession(s: Session | null) {
  if (s) sessionStorage.setItem(key, JSON.stringify(s))
  else sessionStorage.removeItem(key)
}
export function expire() {
  saveSession(null)
  window.dispatchEvent(new Event("auth-expired"))
}
export async function api<T>(
  path: string,
  options: {
    method?: string
    body?: unknown
    signal?: AbortSignal
    public?: boolean
  } = {},
): Promise<T> {
  const session = readSession()
  if (!options.public && !session) {
    expire()
    throw new ApiError(401, "Your session has expired. Please sign in again.")
  }
  const controller = new AbortController()
  const abort = () => controller.abort()
  options.signal?.addEventListener("abort", abort, { once: true })
  if (options.signal?.aborted) controller.abort()
  const timeout = setTimeout(abort, 15000)
  try {
    const res = await fetch(
      `${(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")}${path}`,
      {
        method: options.method || "GET",
        signal: controller.signal,
        headers: {
          ...(options.body !== undefined
            ? { "Content-Type": "application/json" }
            : {}),
          ...(!options.public && session
            ? { Authorization: `Bearer ${session.token}` }
            : {}),
        },
        body:
          options.body !== undefined ? JSON.stringify(options.body) : undefined,
      },
    )
    const raw = await res.text()
    let body
    try {
      body = raw ? JSON.parse(raw) : undefined
    } catch {
      body = undefined
    }
    if (!res.ok) {
      if (res.status === 401 && !options.public) expire()
      throw new ApiError(
        res.status,
        body?.message ||
          (res.status >= 500
            ? "The service is unavailable. Please try again."
            : `Request failed (${res.status}).`),
        body?.errors || body?.fieldErrors || {},
      )
    }
    return body as T
  } catch (e) {
    if (e instanceof ApiError || options.signal?.aborted) throw e
    throw new ApiError(
      0,
      controller.signal.aborted
        ? "The request timed out. Refresh to check its result before trying again."
        : "Cannot reach UrbanGlide. Check your connection and that the API Gateway is running.",
    )
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener("abort", abort)
  }
}
export const terminal = (r: Ride) =>
  ["COMPLETED", "CANCELLED", "NO_DRIVER_AVAILABLE"].includes(r.status)
export const nextStatus = (r: Ride): RideStatus | undefined =>
  (({
    DRIVER_ASSIGNED: "ARRIVING",
    ARRIVING: "ARRIVED",
    ARRIVED: "IN_PROGRESS",
    IN_PROGRESS: "COMPLETED",
  }) as Partial<Record<RideStatus, RideStatus>>)[r.status]
