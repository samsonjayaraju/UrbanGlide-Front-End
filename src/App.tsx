import { useEffect, useState } from "react"
import { NavCtx, type Route } from "./lib/nav"
import { AuthProvider, useAuth } from "./lib/auth"
import { ToastProvider, Button } from "./components/ui"
import { Landing } from "./screens/public"
import { AuthScreen } from "./screens/auth"
import { Shell } from "./screens/Shell"
import { Account, DriverScreen } from "./screens/driver"
import {
  BookRide,
  PassengerDashboard,
  Payments,
  RideDetail,
  RideList,
} from "./screens/rides"
import { Page, Loading } from "./screens/shared"
function Router() {
  const [hash, setHash] = useState(
    () => window.location.hash.slice(1) || "landing",
  )
  const auth = useAuth()
  useEffect(() => {
    const fn = () => setHash(window.location.hash.slice(1) || "landing")
    window.addEventListener("hashchange", fn)
    return () => window.removeEventListener("hashchange", fn)
  }, [])
  const nav = (r: Route) => {
    window.location.hash = r
    window.scrollTo(0, 0)
  }
  const [route, query] = hash.split("?")
  const id = Number(new URLSearchParams(query).get("id"))
  const driver = route.startsWith("d-") || route === "driver-setup"
  const passenger = route.startsWith("p-")
  const protectedRoute = driver || passenger
  let content
  if (auth.loading) content = <Loading />
  else if (protectedRoute && !auth.user) content = <AuthScreen />
  else if (protectedRoute && auth.error)
    content = (
      <Page title="Unable to restore your session" sub={auth.error}>
        <Button onClick={auth.restore}>Retry</Button>
        <Button onClick={auth.logout}>Sign out</Button>
      </Page>
    )
  else if (
    protectedRoute &&
    auth.user?.role !== (driver ? "DRIVER" : "PASSENGER")
  )
    content = (
      <Page
        title="Access restricted"
        sub="This screen belongs to another account role."
      >
        <Button
          onClick={() =>
            nav(auth.user?.role === "DRIVER" ? "d-dashboard" : "p-dashboard")
          }
        >
          Go to your dashboard
        </Button>
        <Button onClick={auth.logout}>Sign out</Button>
      </Page>
    )
  else if (route === "landing") content = <Landing />
  else if (route === "login") content = <AuthScreen />
  else if (route === "register-passenger" || route === "register-driver")
    content = (
      <AuthScreen
        key={route}
        register={route === "register-driver" ? "driver" : "passenger"}
      />
    )
  else if (protectedRoute) {
    let page
    switch (route) {
      case "p-dashboard":
        page = <PassengerDashboard />
        break
      case "p-book":
        page = <BookRide />
        break
      case "p-rides":
        page = (
          <Page title="My rides">
            <RideList />
          </Page>
        )
        break
      case "p-payments":
        page = <Payments />
        break
      case "p-profile":
        page = (
          <Page title="Your profile">
            <Account />
          </Page>
        )
        break
      case "p-ride":
      case "p-ride-details":
        page = <RideDetail id={id} />
        break
      case "d-history":
        page = (
          <Page title="Your rides">
            <RideList driver />
          </Page>
        )
        break
      case "d-active":
        page = <RideDetail id={id} driver />
        break
      case "d-dashboard":
      case "d-profile":
      case "d-location":
      case "d-requests":
      case "driver-setup":
        page = <DriverScreen key={route} view={route} />
        break
      default:
        page = (
          <Page title="Page not found">
            <Button onClick={() => nav("landing")}>Home</Button>
          </Page>
        )
    }
    content = <Shell active={route as Route}>{page}</Shell>
  } else
    content = (
      <Page
        title={route === "err-403" ? "Role not supported" : "Page not found"}
        sub="UrbanGlide provides passenger and driver experiences."
      >
        <Button onClick={() => nav("landing")}>Home</Button>
        <Button onClick={auth.logout}>Sign out</Button>
      </Page>
    )
  return <NavCtx.Provider value={nav}>{content}</NavCtx.Provider>
}
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </AuthProvider>
  )
}
