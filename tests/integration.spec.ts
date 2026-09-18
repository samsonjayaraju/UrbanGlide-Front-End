import { test, expect, type BrowserContext } from "@playwright/test"
const passenger = {
  id: 1,
  name: "Test Passenger",
  email: "passenger@example.test",
  phone: "9876543210",
  role: "PASSENGER",
}
const driver = {
  id: 2,
  name: "Test Driver",
  email: "driver@example.test",
  phone: "9876543211",
  role: "DRIVER",
}
const initialRide = {
  rideId: 1,
  passengerId: 1,
  driverId: null,
  pickupLocation: "Station",
  pickupLatitude: 14.44,
  pickupLongitude: 79.98,
  dropLocation: "Market",
  dropLatitude: 14.47,
  dropLongitude: 79.99,
  status: "SEARCHING",
  distance: null,
  fare: null,
  createdAt: new Date().toISOString(),
  completedAt: null,
  completionSynced: false,
}
test("separate passenger and driver sessions: onboarding, booking, lifecycle recovery and payment", async ({
  browser,
}) => {
  let ride: any = null,
    profile: any = null,
    payment: any = null,
    failCompletion = true,
    bookings = 0
  const passengerContext = await browser.newContext()
  const driverContext = await browser.newContext()
  async function backend(context: BrowserContext, user: typeof passenger) {
    await context.route("**/api/**", async (route) => {
      const req = route.request(),
        path = new URL(req.url()).pathname,
        method = req.method(),
        body = req.postDataJSON()
      let data: any
      let status = 200
      if (path === "/api/auth/login")
        data = { token: user.role, tokenType: "Bearer", expiresIn: 3600, user }
      else {
        expect(req.headers().authorization).toBe(`Bearer ${user.role}`)
        if (path === "/api/auth/me") data = user
        else if (path === "/api/drivers" && method === "POST") {
          profile = {
            ...body,
            driverId: 1,
            userId: 2,
            availability: "OFFLINE",
            latitude: null,
            longitude: null,
          }
          data = profile
        } else if (path === "/api/drivers/me") {
          data = profile || { message: "Profile not found" }
          status = profile ? 200 : 404
        } else if (path === "/api/drivers/me/location") {
          Object.assign(profile, body)
          data = profile
        } else if (path === "/api/drivers/me/availability") {
          Object.assign(profile, body)
          data = profile
        } else if (path === "/api/rides" && method === "POST") {
          bookings++
          expect(Object.keys(body).sort()).toEqual([
            "dropLatitude",
            "dropLocation",
            "dropLongitude",
            "pickupLatitude",
            "pickupLocation",
            "pickupLongitude",
          ])
          ride = { ...initialRide, ...body }
          data = ride
        } else if (path === "/api/rides/my" || path === "/api/rides/driver/my")
          data =
            ride && (user.role === "PASSENGER" || ride.driverId) ? [ride] : []
        else if (path === "/api/rides/driver/offers")
          data =
            ride?.status === "SEARCHING"
              ? [
                  {
                    offerId: 1,
                    rideId: 1,
                    driverId: 1,
                    status: "PENDING",
                    ride,
                  },
                ]
              : []
        else if (path === "/api/rides/1/accept") {
          ride.status = "DRIVER_ASSIGNED"
          ride.driverId = 1
          profile.availability = "BUSY"
          data = ride
        } else if (path === "/api/rides/1/status") {
          ride.status = body.status
          if (body.status === "COMPLETED") {
            ride.fare = 95.42
            ride.distance = 3.028
            ride.completedAt = new Date().toISOString()
            if (failCompletion) {
              failCompletion = false
              status = 503
              data = { message: "Payment service unavailable" }
            } else {
              ride.completionSynced = true
              profile.availability = "AVAILABLE"
              payment = {
                paymentId: 1,
                rideId: 1,
                amount: 95.42,
                paymentMethod: "CASH",
                paymentStatus: "PENDING",
                transactionReference: null,
              }
              data = ride
            }
          } else data = ride
        } else if (path === "/api/rides/1") data = ride
        else if (path === "/api/payments/ride/1") {
          data = payment || { message: "Payment not ready" }
          status = payment ? 200 : 404
        } else if (path === "/api/payments/1/complete") {
          expect(body).toEqual({ paymentMethod: "UPI" })
          payment.paymentStatus = "SUCCESS"
          payment.paymentMethod = "UPI"
          payment.transactionReference = "DEMO-1"
          data = payment
        } else throw new Error(`Unexpected endpoint ${method} ${path}`)
      }
      await route.fulfill({ status, json: data })
    })
  }
  await backend(passengerContext, passenger)
  await backend(driverContext, driver)
  const p = await passengerContext.newPage(),
    d = await driverContext.newPage()
  for (const [page, user] of [
    [p, passenger],
    [d, driver],
  ] as const) {
    await page.goto("/#login")
    await page.getByLabel("Email", { exact: true }).fill(user.email)
    await page.getByLabel("Password", { exact: true }).fill("password123")
    await page.getByRole("button", { name: "Sign in", exact: true }).click()
  }
  await d.getByLabel("Driving license number").fill("TEST-LICENSE")
  await d.getByLabel("Vehicle number").fill("TEST-123")
  await d.getByLabel("Vehicle model").fill("Swift")
  await d.getByLabel("Vehicle type").fill("CAR")
  await d.getByRole("button", { name: "Save profile" }).click()
  await expect(d.getByRole("button", { name: "Go available" })).toBeDisabled()
  await d.getByRole("button", { name: "Update location" }).click()
  await d.getByLabel("Latitude", { exact: true }).fill("14.44")
  await d.getByLabel("Longitude", { exact: true }).fill("79.98")
  await d.getByRole("button", { name: "Save location" }).click()
  await d.getByRole("button", { name: "Dashboard", exact: true }).click()
  await d.getByRole("button", { name: "Go available" }).click()
  await p.getByRole("button", { name: "Book a ride", exact: true }).click()
  await p.getByLabel("Pickup", { exact: true }).fill("Station")
  await p.getByLabel("Pickup latitude").fill("14.44")
  await p.getByLabel("Pickup longitude").fill("79.98")
  await p.getByLabel("Destination", { exact: true }).fill("Market")
  await p.getByLabel("Drop latitude").fill("14.47")
  await p.getByLabel("Drop longitude").fill("79.99")
  await p.getByRole("button", { name: "Request ride", exact: true }).click()
  await expect(p.getByText("Finding nearby drivers…")).toBeVisible()
  await d.getByRole("button", { name: "Accept ride", exact: true }).click()
  await expect(
    d.getByRole("button", { name: "Set Arriving", exact: true }),
  ).toBeVisible()
  for (const label of [
    "Set Arriving",
    "Set Arrived",
    "Set In progress",
    "Set Completed",
  ])
    await d.getByRole("button", { name: label, exact: true }).click()
  await expect(
    d.getByRole("button", { name: "Retry completion" }),
  ).toBeVisible()
  await d.getByRole("button", { name: "Retry completion" }).click()
  await expect(d.getByRole("button", { name: "Retry completion" })).toHaveCount(
    0,
  )
  await p.reload()
  await p.getByLabel("Payment method").selectOption("UPI")
  await p.getByRole("button", { name: "Complete demo payment" }).click()
  await expect(p.getByText("Payment successful · UPI")).toBeVisible()
  expect(bookings).toBe(1)
  await p.setViewportSize({ width: 390, height: 844 })
  await expect(p.locator("body")).toHaveJSProperty("scrollWidth", 390)
  await p.screenshot({
    path: "test-results/passenger-completed-mobile.png",
    fullPage: true,
  })
  await d.screenshot({
    path: "test-results/driver-completed.png",
    fullPage: true,
  })
  await passengerContext.close()
  await driverContext.close()
})
test("expired tokens clear the session and prevent protected access", async ({
  page,
}) => {
  await page.goto("/")
  await page.evaluate(
    (user) =>
      sessionStorage.setItem(
        "urbanglide.session",
        JSON.stringify({
          token: "expired",
          expiresAt: Date.now() + 60000,
          user,
        }),
      ),
    passenger,
  )
  await page.route("**/api/auth/me", (r) =>
    r.fulfill({ status: 401, json: { message: "Expired" } }),
  )
  await page.goto("/#p-profile")
  await page.reload()
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible()
  expect(
    await page.evaluate(() => sessionStorage.getItem("urbanglide.session")),
  ).toBeNull()
})
test("offer conflict refreshes offers and explains the conflict", async ({
  page,
}) => {
  let reads = 0,
    conflicted = false
  await page.goto("/")
  await page.evaluate(
    (user) =>
      sessionStorage.setItem(
        "urbanglide.session",
        JSON.stringify({
          token: "DRIVER",
          expiresAt: Date.now() + 60000,
          user,
        }),
      ),
    driver,
  )
  await page.route("**/api/**", (r) => {
    const path = new URL(r.request().url()).pathname
    if (path === "/api/auth/me") return r.fulfill({ json: driver })
    if (path === "/api/drivers/me")
      return r.fulfill({
        json: {
          driverId: 1,
          availability: "AVAILABLE",
          latitude: 0,
          longitude: 0,
          vehicleModel: "Swift",
          vehicleNumber: "TEST",
        },
      })
    if (path === "/api/rides/driver/my") return r.fulfill({ json: [] })
    if (path === "/api/rides/driver/offers") {
      reads++
      return r.fulfill({
        json: !conflicted ? [{ offerId: 1, rideId: 1, ride: initialRide }] : [],
      })
    }
    if (path === "/api/rides/1/accept") {
      conflicted = true
      return r.fulfill({ status: 409, json: { message: "Conflict" } })
    }
    throw new Error(path)
  })
  await page.goto("/#d-dashboard")
  await page.reload()
  await page.getByRole("button", { name: "Accept ride", exact: true }).click()
  await expect(
    page.getByText(
      "This ride or driver is no longer available. Offers have been refreshed.",
    ),
  ).toBeVisible()
  await expect(
    page.getByText("No pending offers.", { exact: false }),
  ).toBeVisible()
  expect(reads).toBeGreaterThan(1)
})
test("denied location supports manual entry; booking failures never retry automatically", async ({
  page,
}) => {
  let bookings = 0
  await page.goto("/")
  await page.evaluate(
    (user) =>
      sessionStorage.setItem(
        "urbanglide.session",
        JSON.stringify({
          token: "PASSENGER",
          expiresAt: Date.now() + 60000,
          user,
        }),
      ),
    passenger,
  )
  await page.route("**/api/**", (r) => {
    if (r.request().url().endsWith("/api/auth/me"))
      return r.fulfill({ json: passenger })
    bookings++
    return r.fulfill({ status: 503, json: { message: "Service unavailable" } })
  })
  await page.goto("/#p-book")
  await page.reload()
  await page.getByRole("button", { name: "Use current location" }).click()
  await expect(
    page.getByText("Location access was denied or unavailable.", {
      exact: false,
    }),
  ).toBeVisible()
  for (const [label, value] of [
    ["Pickup", "Station"],
    ["Pickup latitude", "0"],
    ["Pickup longitude", "0"],
    ["Destination", "Market"],
    ["Drop latitude", "1"],
    ["Drop longitude", "1"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value)
  await page.getByRole("button", { name: "Request ride", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "Request ride", exact: true }),
  ).toBeDisabled()
  expect(bookings).toBe(1)
})
test("wrong-role deep links are blocked without loading passenger data", async ({
  page,
}) => {
  await page.goto("/")
  await page.evaluate(
    (user) =>
      sessionStorage.setItem(
        "urbanglide.session",
        JSON.stringify({
          token: "DRIVER",
          expiresAt: Date.now() + 60000,
          user,
        }),
      ),
    driver,
  )
  await page.route("**/api/**", (r) => {
    expect(new URL(r.request().url()).pathname).toBe("/api/auth/me")
    return r.fulfill({ json: driver })
  })
  await page.goto("/#p-payments")
  await page.reload()
  await expect(
    page.getByRole("heading", { name: "Access restricted" }),
  ).toBeVisible()
})
for (const status of ["SEARCHING", "NO_DRIVER_AVAILABLE", "DRIVER_ASSIGNED"])
  test(`ride ${status}: cancellation rules and terminal polling`, async ({
    page,
  }) => {
    let ride = { ...initialRide, status },
      reads = 0
    await page.goto("/")
    await page.evaluate(
      (user) =>
        sessionStorage.setItem(
          "urbanglide.session",
          JSON.stringify({
            token: "PASSENGER",
            expiresAt: Date.now() + 60000,
            user,
          }),
        ),
      passenger,
    )
    await page.route("**/api/**", (r) => {
      const path = new URL(r.request().url()).pathname
      if (path === "/api/auth/me") return r.fulfill({ json: passenger })
      if (path === "/api/rides/1/cancel") {
        ride.status = "CANCELLED"
        return r.fulfill({ json: ride })
      }
      if (path === "/api/rides/1") {
        reads++
        return r.fulfill({ json: ride })
      }
      throw new Error(path)
    })
    await page.goto("/#p-ride?id=1")
    await page.reload()
    await expect(page.getByRole("heading", { name: "Ride #1" })).toBeVisible()
    if (status === "SEARCHING") {
      await page.getByRole("button", { name: "Cancel request" }).click()
      await expect(page.getByText("This ride was cancelled.")).toBeVisible()
    } else
      await expect(
        page.getByRole("button", { name: "Cancel request" }),
      ).toHaveCount(0)
    if (status === "NO_DRIVER_AVAILABLE") {
      await expect(
        page.getByText("No driver is available for this request.", {
          exact: false,
        }),
      ).toBeVisible()
      const count = reads
      await page.waitForTimeout(3300)
      expect(reads).toBe(count)
    }
  })
