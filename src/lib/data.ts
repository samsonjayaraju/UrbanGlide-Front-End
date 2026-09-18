export type RideStatus = "REQUESTED" | "SEARCHING" | "DRIVER_ASSIGNED" | "ARRIVING" | "ARRIVED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_DRIVER_AVAILABLE"

export type DriverStatus = "AVAILABLE" | "BUSY" | "OFFLINE"
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED"

export type Loc = { name: string; lat: number; lng: number }

export type Ride = {
  id: string
  date: string
  pickup: Loc
  destination: Loc
  status: RideStatus
  distanceKm: number
  fare: number
  driver?: {
    name: string
    id: string
    vehicle: string
    plate: string
    rating: number
  }
  payment?: PaymentStatus
  txnRef?: string
  method?: "Cash" | "UPI" | "Card"
}

export const RIDE_FLOW: RideStatus[] = [
  "REQUESTED",
  "SEARCHING",
  "DRIVER_ASSIGNED",
  "ARRIVING",
  "ARRIVED",
  "IN_PROGRESS",
  "COMPLETED",
]

export const RIDE_STATUS_LABEL: Record<RideStatus, string> = {
  REQUESTED: "Requested",
  SEARCHING: "Searching",
  DRIVER_ASSIGNED: "Driver assigned",
  ARRIVING: "Arriving",
  ARRIVED: "Arrived",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_DRIVER_AVAILABLE: "No driver",
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n,
  )
