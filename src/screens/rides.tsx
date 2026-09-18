import { useState } from "react"
import { api, terminal, nextStatus, type Ride, type Payment } from "../lib/api"
import { useAction, useResource, location } from "../lib/hooks"
import { useNav } from "../lib/nav"
import { useAuth } from "../lib/auth"
import {
  Button,
  Card,
  Input,
  Field,
  RouteBlock,
  RideBadge,
  RideTimeline,
  StatRow,
  PaymentBadge,
  FauxMap,
} from "../components/ui"
import { RadarSearch } from "../components/RadarSearch"
import { money, RIDE_STATUS_LABEL } from "../lib/data"
import {
  FormSection,
  ErrorNotice,
  Loading,
  Page,
  Refresh,
  TextField,
  formValues,
} from "./shared"
export function RideList({
  driver = false,
  activeOnly = false,
}: {
  driver?: boolean
  activeOnly?: boolean
}) {
  const resource = useResource<Ride[]>(
    driver ? "/api/rides/driver/my" : "/api/rides/my",
    activeOnly ? 4000 : 0,
    (rs) => rs.some((r) => !terminal(r)),
  )
  const nav = useNav()
  const rows = (resource.data || [])
    .filter(
      (r) =>
        !activeOnly ||
        !terminal(r) ||
        (driver && r.status === "COMPLETED" && !r.completionSynced),
    )
    .sort((a, b) => b.rideId - a.rideId)
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">
        {activeOnly ? "Current rides" : "Ride history"}
      </h2>
      <ErrorNotice error={resource.error} />
      {resource.error && <Refresh refresh={resource.refresh} />}
      {resource.loading ? (
        <Loading />
      ) : !rows.length ? (
        <Card>{activeOnly ? "No active rides." : "No rides yet."}</Card>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <Card key={r.rideId}>
              <div className="flex flex-wrap justify-between gap-2 mb-4">
                <span className="text-xs text-muted">
                  #{r.rideId} · {new Date(r.createdAt).toLocaleString()}
                </span>
                <RideBadge status={r.status} />
              </div>
              <RouteBlock
                pickup={r.pickupLocation}
                destination={r.dropLocation}
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="font-mono font-semibold">
                  {r.fare == null ? "Fare after completion" : money(r.fare)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    nav(
                      `${
                        driver ? "d-active" : "p-ride"
                      }?id=${r.rideId}` as never,
                    )
                  }
                >
                  View ride
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
export function PassengerDashboard() {
  const { user } = useAuth()
  const nav = useNav()
  return (
    <Page
      title={`Hello, ${user?.name.split(" ")[0]}`}
      sub="Where would you like to go?"
    >
      <Card night className="on-night">
        <h2 className="text-2xl font-bold text-canvas">
          Your city. Your next journey.
        </h2>
        <p className="text-night-muted my-4">
          Choose your pickup and destination to request a ride.
        </p>
        <Button variant="night" onClick={() => nav("p-book")}>
          Book a ride
        </Button>
      </Card>
      <RideList activeOnly />
      <RideList />
    </Page>
  )
}
export function BookRide() {
  const action = useAction()
  const gps = useAction()
  const nav = useNav()
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [uncertain, setUncertain] = useState(false)
  return (
    <Page
      title="Where are we going?"
      sub="Enter pickup and destination names and coordinates."
    >
      <div className="ug-booking-grid grid md:grid-cols-2 gap-6">
        <Card>
          <ErrorNotice error={action.error || gps.error} />
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              const v = formValues(e.currentTarget)
              void action.run(async () => {
                const body = {
                  ...v,
                  pickupLatitude: Number(v.pickupLatitude),
                  pickupLongitude: Number(v.pickupLongitude),
                  dropLatitude: Number(v.dropLatitude),
                  dropLongitude: Number(v.dropLongitude),
                }
                try {
                  const ride = await api<Ride>("/api/rides", {
                    method: "POST",
                    body,
                  })
                  nav(`p-ride?id=${ride.rideId}` as never)
                } catch (e) {
                  setUncertain(true)
                  throw e
                }
              })
            }}
          >
            <FormSection number="01" title="Your pickup" />
            <TextField name="pickupLocation" label="Pickup" maxLength={255} />
            <Button
              type="button"
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
            <div className="grid grid-cols-2 gap-3">
              <Field label="Pickup latitude" htmlFor="pickupLatitude">
                <Input
                  id="pickupLatitude"
                  name="pickupLatitude"
                  required
                  type="number"
                  step="any"
                  min={-90}
                  max={90}
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </Field>
              <Field label="Pickup longitude" htmlFor="pickupLongitude">
                <Input
                  id="pickupLongitude"
                  name="pickupLongitude"
                  required
                  type="number"
                  step="any"
                  min={-180}
                  max={180}
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
              </Field>
            </div>
            <FormSection number="02" title="Your destination" />
            <TextField
              name="dropLocation"
              label="Destination"
              maxLength={255}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                name="dropLatitude"
                label="Drop latitude"
                type="number"
                step="any"
                min={-90}
                max={90}
              />
              <TextField
                name="dropLongitude"
                label="Drop longitude"
                type="number"
                step="any"
                min={-180}
                max={180}
              />
            </div>
            <p className="text-sm text-muted">
              Your final fare in INR is calculated by UrbanGlide after
              completion. Distance is geographical, not road distance. Fare
              estimates are not available.
            </p>
            <Button
              full
              loading={action.pending}
              disabled={uncertain}
              type="submit"
            >
              Request ride
            </Button>
          </form>
          {uncertain && (
            <div className="mt-4 space-y-3">
              <p className="text-sm">
                Check My Rides before requesting again: the server may have
                received your booking.
              </p>
              <Button variant="outline" onClick={() => nav("p-rides")}>
                Check my rides
              </Button>
              <Button variant="ghost" onClick={() => setUncertain(false)}>
                I checked — allow a new request
              </Button>
            </div>
          )}
        </Card>
        <FauxMap className="ug-booking-map min-h-64 rounded-3xl border border-line">
          <p className="absolute bottom-4 left-4 right-4 text-sm bg-surface rounded-xl p-3">
            Route illustration · not a live map
          </p>
        </FauxMap>
      </div>
    </Page>
  )
}
export function RideDetail({
  id,
  driver = false,
}: {
  id: number
  driver?: boolean
}) {
  const ride = useResource<Ride>(
    id ? `/api/rides/${id}` : null,
    3000,
    (r) => !terminal(r),
  )
  const action = useAction()
  const nav = useNav()
  if (!id)
    return (
      <Page title="Your rides">
        <RideList driver={driver} activeOnly />
      </Page>
    )
  if (ride.loading) return <Loading />
  const r = ride.data
  if (!r)
    return (
      <Page title="Ride details">
        <ErrorNotice error={ride.error} />
        <Refresh refresh={ride.refresh} />
      </Page>
    )
  const next = nextStatus(r)
  const retry = r.status === "COMPLETED" && !r.completionSynced
  const change = (status: string) =>
    void action.run(async () => {
      try {
        const updated = await api<Ride>(`/api/rides/${id}/status`, {
          method: "PATCH",
          body: { status },
        })
        ride.setData(updated)
        ride.refresh()
      } catch (e) {
        ride.refresh()
        throw e
      }
    })
  return (
    <Page
      title={`Ride #${r.rideId}`}
      sub={new Date(r.createdAt).toLocaleString()}
    >
      <ErrorNotice error={ride.error || action.error} />
      <div className="grid md:grid-cols-2 gap-5">
        <Card night className="on-night ug-ride-summary">
          <div className="mb-5">
            <RideBadge status={r.status} />
            <h2 className="ug-ride-status">{RIDE_STATUS_LABEL[r.status]}</h2>
          </div>
          <RouteBlock
            night
            pickup={r.pickupLocation}
            destination={r.dropLocation}
          />
          {["REQUESTED", "SEARCHING"].includes(r.status) && (
            <div className="overflow-hidden flex flex-col items-center py-10">
              <RadarSearch size={150} />
              <p className="text-canvas mt-8 font-bold">
                Finding nearby drivers…
              </p>
              <p className="text-night-muted text-sm mt-2">
                Waiting for a driver to accept.
              </p>
            </div>
          )}
          <div className="mt-5">
            <StatRow
              night
              label="Assigned driver"
              value={r.driverId ? `Driver #${r.driverId}` : "Not assigned"}
            />
            <StatRow
              night
              label="Geographical distance"
              value={
                r.distance == null ? "After completion" : `${r.distance} km`
              }
            />
            <StatRow
              night
              label="Fare (INR)"
              value={r.fare == null ? "After completion" : money(r.fare)}
            />
          </div>
          {r.completedAt && (
            <p className="text-night-muted text-xs mt-3">
              Completed {new Date(r.completedAt).toLocaleString()}
            </p>
          )}
        </Card>
        <Card className="ug-progress-card">
          <h2 className="ug-section-label">Journey progress</h2>
          <RideTimeline status={r.status} />
          <p className="text-sm text-muted mt-4">
            Updates refresh every 3 seconds during an active ride. No live
            vehicle tracking.
          </p>
        </Card>
      </div>
      {r.status === "NO_DRIVER_AVAILABLE" && (
        <Card>
          No driver is available for this request. This ride will not rematch
          automatically.{" "}
          <Button className="mt-3" onClick={() => nav("p-book")}>
            Book another ride
          </Button>
        </Card>
      )}
      {!driver && ["REQUESTED", "SEARCHING"].includes(r.status) && (
        <Button
          variant="danger"
          loading={action.pending}
          onClick={() =>
            void action.run(async () => {
              try {
                const updated = await api<Ride>(`/api/rides/${id}/cancel`, {
                  method: "POST",
                })
                ride.setData(updated)
                ride.refresh()
              } catch (e) {
                ride.refresh()
                throw e
              }
            })
          }
        >
          Cancel request
        </Button>
      )}
      {driver && (next || retry) && (
        <Card>
          {retry && (
            <p className="mb-3">
              Ride completed, but payment creation or driver release is still
              pending. Retry completion to finish synchronizing.
            </p>
          )}
          <Button
            loading={action.pending}
            onClick={() => change(retry ? "COMPLETED" : next!)}
          >
            {retry ? "Retry completion" : `Set ${RIDE_STATUS_LABEL[next!]}`}
          </Button>
        </Card>
      )}
      {!driver && r.status === "COMPLETED" && <PaymentForRide rideId={id} />}
    </Page>
  )
}
function PaymentForRide({ rideId }: { rideId: number }) {
  const payment = useResource<Payment>(`/api/payments/ride/${rideId}`)
  return (
    <section>
      <ErrorNotice error={payment.error} />
      {payment.loading ? (
        <Loading />
      ) : payment.data ? (
        <PaymentCard payment={payment.data} onSaved={payment.refresh} />
      ) : (
        <Card>
          <p className="mb-4">
            Payment may still be synchronizing. The assigned driver can retry
            completion if needed.
          </p>
          <Refresh refresh={payment.refresh} />
        </Card>
      )}
    </section>
  )
}
function PaymentCard({
  payment: p,
  onSaved,
}: {
  payment: Payment
  onSaved: () => void
}) {
  const action = useAction()
  const [method, setMethod] = useState<Payment["paymentMethod"]>(
    p.paymentMethod,
  )
  return (
    <Card className="ug-receipt">
      <div className="ug-receipt-heading flex flex-wrap justify-between items-center gap-3">
        <h2 className="font-bold text-xl">Payment · Ride #{p.rideId}</h2>
        <PaymentBadge status={p.paymentStatus} />
      </div>
      <p className="ug-receipt-amount font-mono text-2xl font-bold my-4">{money(p.amount)}</p>
      <p className="text-sm text-muted mb-4">
        Demonstration only — no money moves. Do not enter card numbers, CVVs or
        UPI PINs.
      </p>
      <ErrorNotice error={action.error} />
      {p.paymentStatus !== "SUCCESS" ? (
        <>
          <label
            className="block text-sm font-semibold mb-2"
            htmlFor={`method-${p.paymentId}`}
          >
            Payment method
          </label>
          <select
            id={`method-${p.paymentId}`}
            className="w-full h-11 border border-line-strong rounded-xl px-3 mb-4"
            value={method}
            disabled={action.pending}
            onChange={(e) => setMethod(e.target.value as typeof method)}
          >
            {["CASH", "UPI", "CARD"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <Button
            loading={action.pending}
            onClick={() =>
              void action.run(async () => {
                await api(`/api/payments/${p.paymentId}/complete`, {
                  method: "POST",
                  body: { paymentMethod: method },
                })
                onSaved()
              })
            }
          >
            Complete demo payment
          </Button>
        </>
      ) : (
        <p role="status" className="ug-payment-success text-ok break-all">
          Payment successful · {p.paymentMethod}
          <br />
          {p.transactionReference}
        </p>
      )}
    </Card>
  )
}
export function Payments() {
  const r = useResource<Payment[]>("/api/payments/my")
  return (
    <Page title="Your payments" sub="Simulated payments only. No money moves.">
      <ErrorNotice error={r.error} />
      <Refresh refresh={r.refresh} />
      {r.loading ? (
        <Loading />
      ) : r.data?.length ? (
        r.data.map((p) => (
          <PaymentCard key={p.paymentId} payment={p} onSaved={r.refresh} />
        ))
      ) : (
        <Card>No payments yet.</Card>
      )}
    </Page>
  )
}
