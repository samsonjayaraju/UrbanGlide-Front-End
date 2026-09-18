# UrbanGlide frontend

React, TypeScript and Vite frontend using the supplied UrbanGlide visual reference and the existing API Gateway contract.

## Run

```sh
npm install
npm run dev
```

Development origin: **http://127.0.0.1:5173**. The Vite development proxy forwards `/api` to **http://localhost:8080**, so browser CORS configuration is not required for local development. Start the existing backend separately. No backend files were changed.

Copy `.env.example` to `.env.local` to customize. `API_PROXY_TARGET` selects the gateway for development; `VITE_API_BASE_URL` selects an explicit public gateway URL for deployed builds. An empty base URL uses same-origin `/api`. Production hosting must proxy `/api` to the gateway or set the base URL and allow the exact frontend origin in gateway CORS. Never put backend secrets in Vite environment variables.

```sh
npm run build
npm run typecheck
npx playwright install chromium
npm test
# Or use an installed Google Chrome:
PLAYWRIGHT_CHANNEL=chrome npm test
```

Routes use URL hashes, including `/#login`, `/#p-dashboard`, `/#p-book`, `/#p-ride?id=1`, `/#p-rides`, `/#p-payments`, `/#p-profile`, `/#d-dashboard`, `/#d-profile`, `/#d-location`, `/#d-requests`, `/#d-active?id=1`, and `/#d-history`.

Sessions are isolated per browser tab using sessionStorage. Use separate browser contexts/profiles for passenger and driver testing. No mock data or automatic lifecycle transitions are used by the application. Playwright's explicitly intercepted API fixtures run only inside tests; they are not a substitute for live backend verification.

## Real-backend journey

1. Start the gateway and its services using the backend README. Open the frontend in two separate browser sessions.
2. Register a driver; sign in; save profile and vehicle; allow browser geolocation or enter valid coordinates; save location; select AVAILABLE.
3. Register/sign in as a passenger in the other session. Book a ride with pickup coordinates near the driver. Check SEARCHING and the driver's pending offers.
4. Accept the offer, then set ARRIVING, ARRIVED, IN_PROGRESS and COMPLETED in order. Check passenger polling after each transition.
5. Check the returned fare and geographical distance. Choose CASH, UPI or CARD and complete the demonstration payment. Verify both histories.
6. Additional cases: reject all offers; book without nearby available drivers; cancel while searching; competing acceptances returning 409; deny geolocation; expired session; completion returning 503 after committing COMPLETED. In the last case, restore the failed service and use Retry completion as the assigned driver.

Payment is simulated. No actual payment credentials are requested and no money moves.
