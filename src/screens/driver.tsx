import { useState } from "react"
import { api, ApiError, type Driver, type Ride, type Offer } from "../lib/api"
import { useAuth } from "../lib/auth"
import { useNav } from "../lib/nav"
import { location, useAction, useResource } from "../lib/hooks"
import {
  Button,
  Card,
  DriverBadge,
  RouteBlock,
  Field,
  Input,
} from "../components/ui"
import {
  FormSection,
  ErrorNotice,
  Loading,
  Page,
  Refresh,
  TextField,
  formValues,
} from "./shared"
import { RideList } from "./rides"
export function DriverProfile({
  profile,
  onSaved,
}: {
  profile?: Driver
  onSaved: () => void
}) {
  const { user } = useAuth()
  const action = useAction()
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">
        {profile ? "Driver & vehicle details" : "Complete your driver profile"}
      </h2>
      <p className="text-sm text-muted mb-4">
        Save your profile and vehicle, update your location, then go available.
      </p>
      <ErrorNotice error={action.error} />
      <form
        className="grid sm:grid-cols-2 gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          const v = formValues(e.currentTarget)
          void action.run(async () => {
            await api("/api/drivers" + (profile ? "/me" : ""), {
              method: profile ? "PUT" : "POST",
              body: v,
            })
            onSaved()
          })
        }}
      >
        <div className="sm:col-span-2"><FormSection number="01" title="Driver information" /></div>
        <TextField
          name="name"
          label="Full name"
          value={profile?.name ?? user?.name}
          maxLength={100}
        />
        <TextField
          name="phone"
          label="Phone"
          value={profile?.phone ?? user?.phone}
          pattern="[+0-9 ()\-]{7,20}"
        />
        <TextField
          name="licenseNumber"
          label="Driving license number"
          value={profile?.licenseNumber}
          maxLength={60}
        />
        <div className="sm:col-span-2"><FormSection number="02" title="Vehicle details" /></div>
        <TextField
          name="vehicleNumber"
          label="Vehicle number"
          value={profile?.vehicleNumber}
          maxLength={40}
        />
        <TextField
          name="vehicleModel"
          label="Vehicle model"
          value={profile?.vehicleModel}
          maxLength={80}
        />
        <TextField
          name="vehicleType"
          label="Vehicle type"
          value={profile?.vehicleType}
          placeholder="CAR"
          maxLength={30}
        />
        <Button loading={action.pending} type="submit">
          Save profile
        </Button>
      </form>
    </Card>
  )
}
export function LocationForm({
  profile,
  onSaved,
}: {
  profile: Driver
  onSaved: () => void
}) {
  const action = useAction()
  const gps = useAction()
  const [lat, setLat] = useState(profile.latitude?.toString() ?? "")
  const [lng, setLng] = useState(profile.longitude?.toString() ?? "")
  return (
    <Card>
      <h2 className="text-xl font-bold">Update your location</h2>
      <p className="text-sm text-muted mt-2">
        Allow browser location access or enter your coordinates manually.
      </p>
      <ErrorNotice error={gps.error || action.error} />
      <Button
        className="my-4"
        variant="outline"
        loading={gps.pending}
        onClick={() =>
          void gps.run(async () => {
            const c = await location()
            setLat(String(c.latitude))
            setLng(String(c.longitude))
          })
        }
      >
        Use current location
      </Button>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          void action.run(async () => {
            await api("/api/drivers/me/location", {
              method: "PATCH",
              body: { latitude: Number(lat), longitude: Number(lng) },
            })
            onSaved()
          })
        }}
      >
        <Field label="Latitude" htmlFor="latitude">
          <Input
            id="latitude"
            required
            type="number"
            step="any"
            min={-90}
            max={90}
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </Field>
        <Field label="Longitude" htmlFor="longitude">
          <Input
            id="longitude"
            required
            type="number"
            step="any"
            min={-180}
            max={180}
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </Field>
        <Button type="submit" loading={action.pending}>
          Save location
        </Button>
      </form>
    </Card>
  )
}
export function DriverScreen({ view }: { view: string }) {
  const profile = useResource<Driver>("/api/drivers/me")
  const action = useAction()
  const nav = useNav()
  const { user } = useAuth()
  const missing =
    profile.error instanceof ApiError && profile.error.status === 404
  if (profile.loading) return <Loading />
  if (missing)
    return (
      <Page title="Welcome, driver">
        <DriverProfile onSaved={profile.refresh} />
      </Page>
    )
  if (!profile.data)
    return (
      <Page title="Driver profile">
        <ErrorNotice error={profile.error} />
        <Refresh refresh={profile.refresh} />
      </Page>
    )
  const p = profile.data
  return (
    <Page
      title={
        view === "d-profile"
          ? "Your profile"
          : view === "d-location"
            ? "Your location"
            : `Hello, ${user?.name.split(" ")[0]}`
      }
    >
      <ErrorNotice error={action.error} />
      {view === "d-profile" ? (
        <>
          <DriverProfile profile={p} onSaved={profile.refresh} />
          <Account />
        </>
      ) : view === "d-location" ? (
        <LocationForm profile={p} onSaved={profile.refresh} />
      ) : (
        <>
          <Card night className="on-night">
            <p className="text-lime text-xs uppercase tracking-widest font-bold">
              Current status
            </p>
            <div className="mt-3">
              <DriverBadge status={p.availability} />
            </div>
            <p className="text-night-muted my-4">
              {p.availability === "BUSY"
                ? "Your assigned ride controls your availability."
                : p.latitude == null
                  ? "Save a location before going available."
                  : "Receive nearby requests when you are available."}
            </p>
            <Button
              variant="night"
              loading={action.pending}
              disabled={
                p.availability === "BUSY" ||
                p.latitude == null ||
                p.longitude == null
              }
              onClick={() =>
                void action.run(async () => {
                  await api("/api/drivers/me/availability", {
                    method: "PATCH",
                    body: {
                      availability:
                        p.availability === "AVAILABLE"
                          ? "OFFLINE"
                          : "AVAILABLE",
                    },
                  })
                  profile.refresh()
                })
              }
            >
              {p.availability === "AVAILABLE" ? "Go offline" : "Go available"}
            </Button>
          </Card>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <h2 className="font-bold">Location</h2>
              <p className="my-3 font-mono text-sm">
                {p.latitude ?? "Not set"}, {p.longitude ?? "Not set"}
              </p>
              <Button variant="outline" onClick={() => nav("d-location")}>
                Update location
              </Button>
            </Card>
            <Card>
              <h2 className="font-bold">Vehicle</h2>
              <p className="mt-3">{p.vehicleModel}</p>
              <p className="font-mono text-sm">{p.vehicleNumber}</p>
            </Card>
          </div>
          <RideList driver activeOnly />
          {p.availability === "AVAILABLE" && (
            <Offers onAccepted={profile.refresh} />
          )}
        </>
      )}
    </Page>
  )
}
export function Offers({ onAccepted = () => {} }: { onAccepted?: () => void }) {
  const offers = useResource<Offer[]>("/api/rides/driver/offers", 3000)
  const action = useAction()
  const nav = useNav()
  const decide = (id: number, accept: boolean) =>
    void action.run(async () => {
      try {
        await api<Ride>(`/api/rides/${id}/${accept ? "accept" : "reject"}`, {
          method: "POST",
        })
        offers.refresh()
        if (accept) {
          onAccepted()
          nav(("d-active" + "?id=" + id) as never)
        }
      } catch (e) {
        offers.refresh()
        if (e instanceof ApiError && e.status === 409)
          throw new Error(
            "This ride or driver is no longer available. Offers have been refreshed.",
          )
        throw e
      }
    })
  return (
    <section>
      <h2 className="font-bold text-xl mb-4">Ride requests</h2>
      <ErrorNotice error={offers.error || action.error} />
      {offers.loading ? (
        <Loading />
      ) : !offers.data?.length ? (
        <Card>
          No pending offers. New requests appear here while you are available.
        </Card>
      ) : (
        <div className="space-y-4">
          {offers.data.map((o) => (
            <Card key={o.offerId}>
              <RouteBlock
                pickup={o.ride.pickupLocation}
                destination={o.ride.dropLocation}
              />
              <p className="text-sm text-muted my-4">
                Ride #{o.rideId} · Fare calculated after completion.
              </p>
              <div className="flex gap-3">
                <Button
                  loading={action.pending}
                  onClick={() => decide(o.rideId, true)}
                >
                  Accept ride
                </Button>
                <Button
                  variant="outline"
                  disabled={action.pending}
                  onClick={() => decide(o.rideId, false)}
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
export function Account() {
  const { user, logout } = useAuth()
  return (
    <Card>
      <h2 className="text-xl font-bold">Account</h2>
      <p className="mt-4">{user?.name}</p>
      <p className="break-all">{user?.email}</p>
      <p>{user?.phone}</p>
      <p className="text-sm text-muted my-4">
        {user?.role} · Account details are read-only.
      </p>
      <Button variant="outline" onClick={logout}>
        Log out
      </Button>
      <p className="mt-3 text-xs text-muted">
        Drivers should select OFFLINE before signing out. Signing out does not
        change server availability.
      </p>
    </Card>
  )
}
