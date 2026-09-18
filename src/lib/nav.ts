import { createContext, useContext } from "react"

export type Route = "boot" | "landing" | "login" | "register-passenger" | "register-driver" | "driver-setup" | "p-dashboard" | "p-book" | "p-finding" | "p-no-driver" | "p-ride" | "p-cancelled" | "p-rides" | "p-ride-details" | "p-payments" | "p-pay" | "p-pay-success" | "p-profile" | "d-dashboard" | "d-location" | "d-requests" | "d-active" | "d-history" | "d-profile" | "err-404" | "err-503" | "err-session" | "err-403" | "err-generic"

export const NavCtx = createContext<(r: Route) => void>(() => {})
export const useNav = () => useContext(NavCtx)
