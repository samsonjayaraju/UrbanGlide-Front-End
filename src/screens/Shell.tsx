import { useState, type ReactNode } from "react"
import { Icon, type IconName } from "../components/icons"
import { Logo, Avatar, Modal, Button, useToast } from "../components/ui"
import { useNav, type Route } from "../lib/nav"
import { useAuth } from "../lib/auth"
const DRIVER_NAV: { r: Route; label: string; icon: IconName }[] = [
  { r: "d-dashboard", label: "Dashboard", icon: "Home" },
  { r: "d-requests", label: "Requests", icon: "Bell" },
  { r: "d-history", label: "Rides", icon: "List" },
  { r: "d-location", label: "Location", icon: "Pin" },
  { r: "d-profile", label: "Profile", icon: "User" },
]
const PASSENGER_NAV: { r: Route; label: string; icon: IconName }[] = [
  { r: "p-dashboard", label: "Dashboard", icon: "Home" },
  { r: "p-book", label: "Book Ride", icon: "Pin" },
  { r: "p-rides", label: "My Rides", icon: "List" },
  { r: "p-payments", label: "Payments", icon: "Wallet" },
  { r: "p-profile", label: "Profile", icon: "User" },
]

export function Shell({
  active,
  children,
}: {
  active: Route
  children: ReactNode
}) {
  const nav = useNav()
  const { user, logout: signOut } = useAuth()
  const NAV = user?.role === "DRIVER" ? DRIVER_NAV : PASSENGER_NAV
  const toast = useToast()
  const [logout, setLogout] = useState(false)
  return (
    <div className="ug-shell min-h-screen bg-canvas lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="ug-sidebar hidden lg:flex flex-col border-r border-line bg-surface sticky top-0 h-screen">
        <div className="p-5">
          <button onClick={() => nav("landing")}>
            <Logo />
          </button>
        </div>
        <p className="ug-nav-caption">{user?.role === "DRIVER" ? "Driver workspace" : "Your journeys"}</p>
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.r}
              aria-current={active === n.r ? "page" : undefined}
              onClick={() => nav(n.r)}
              className={`w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-sm font-semibold transition-colors ${
                active === n.r
                  ? "bg-ink text-canvas"
                  : "text-ink-soft hover:bg-surface-2"
              }`}
            >
              {(() => {
                const I = Icon[n.icon]
                return <I size={19} />
              })()} {n.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-line">
          <button
            onClick={() => setLogout(true)}
            className="w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-sm font-semibold text-ink-soft hover:bg-surface-2"
          >
            <Icon.Logout size={19} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-canvas/90 backdrop-blur border-b border-line px-5 h-14 flex items-center justify-between">
        <button onClick={() => nav("landing")}>
          <Logo size="sm" />
        </button>
        <button onClick={() => nav("p-profile")}>
          <Avatar name={user?.name ?? "User"} size={32} />
        </button>
      </div>

      <main className="pb-24 lg:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="ug-bottom-nav lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-line grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {NAV.map((n) => {
          const I = Icon[n.icon]
          const on = active === n.r
          return (
            <button
              key={n.r}
              aria-current={active === n.r ? "page" : undefined}
              onClick={() => nav(n.r)}
              className={`relative flex flex-col items-center justify-center gap-0.5 h-16 text-[10px] font-semibold ${
                on ? "text-ink" : "text-muted"
              }`}
            >
              <I size={21} />{" "}
              {n.label === "Book Ride"
                ? "Ride"
                : n.label === "Dashboard"
                  ? "Home"
                  : n.label === "My Rides"
                    ? "Rides"
                    : n.label}
              {on && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-lime-deep" />
              )}
            </button>
          )
        })}
      </nav>

      <Modal
        open={logout}
        onClose={() => setLogout(false)}
        title="Log out of UrbanGlide?"
      >
        <p className="text-sm text-ink-soft">
          You'll need to sign in again to book rides.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => setLogout(false)}>
            Stay signed in
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setLogout(false)
              signOut()
              nav("login")
            }}
          >
            Log out
          </Button>
        </div>
      </Modal>
    </div>
  )
}
