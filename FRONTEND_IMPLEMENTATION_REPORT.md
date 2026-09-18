# UrbanGlide frontend integration

## Source and scope

The working directory initially contained no frontend files. The supplied `/Users/samsonjayaraju/Downloads/Uber-inspired app design/` project was used as the visual starting point and left unchanged. The pasted reconstruction brief was treated as supporting context; the current request to integrate supported backend capabilities governed implementation. No backend or Git history changes were made.

Contract sources: `../Urban Glide/UrbanGlide-Backend/README.md`, its `postman/UrbanGlide.postman_collection.json`, public controller signatures, DTOs, JWT expiry configuration, and validation error handler. Another backend folder exists nearby with different contracts; this implementation uses the one matching the user's stated API and onboarding requirements.

## Reference inventory and reuse

The reference includes landing, authentication, passenger dashboard/booking/search/ride/history/payment/profile, driver onboarding/dashboard/offers/location/ride/history/profile, and system-state prototypes. It uses React 19, TypeScript, Tailwind 4, Manrope and JetBrains Mono fonts, warm off-white surfaces, charcoal immersive cards, electric lime accents, rounded cards and buttons, desktop sidebars, mobile bottom navigation, a decorative route grid, and radar search animation.

Reused: design tokens and CSS, icons, buttons, input components, badges, route blocks, timeline, cards, avatars, logo, map illustration, radar animation, landing layout, auth split layout, and navigation shell. Refactored: prototype-only screen state, simulated delays, sample accounts/trips/payments, fake actions, and screen launcher. Functional screens adapt the same components. Immersive ride content sits inside the authenticated shell to retain navigation. Auth fields are initially empty. Unsupported driver names/vehicle details are replaced by the returned driver ID. No passenger-authorized driver profile endpoint exists in this contract.

## Integration

- `src/lib/api.ts`: typed contracts, configurable base URL, bearer authentication, readable errors and backend `errors` field map, timeout/abort behavior. Requests go exclusively through `/api/auth`, `/api/drivers`, `/api/rides`, `/api/payments`.
- `src/lib/auth.tsx`: per-tab session storage, login response handling, seconds-based expiry, `/api/auth/me` restoration, automatic 401/expiry logout. No backend secrets.
- `src/lib/hooks.ts`: cancellable, sequential polling and submission locks. Polling waits until each request settles before scheduling another, pauses network work while the document is hidden, and cancels on navigation/unmount. GET reads can retry on a later poll; mutations never automatically retry.
- `src/App.tsx`: hash routes and role checks before protected screens render.
- `src/screens/`: supported passenger, driver, account, authentication and payment flows.

## Endpoint-to-screen mapping

| Screen | Public gateway endpoints |
| --- | --- |
| Registration/login/session | POST `/api/auth/register/passenger`, `/api/auth/register/driver`, `/api/auth/login`; GET `/api/auth/me` |
| Driver onboarding/profile | GET `/api/drivers/me`; POST `/api/drivers`; PUT `/api/drivers/me` (profile and vehicle together) |
| Driver location/availability | PATCH `/api/drivers/me/location`, `/api/drivers/me/availability` |
| Passenger booking | POST `/api/rides` with exactly the six pickup/drop fields |
| Ride history/dashboard | GET `/api/rides/my`, `/api/rides/driver/my` |
| Ride details/status | GET `/api/rides/{id}`; PATCH `/api/rides/{id}/status` |
| Cancellation | POST `/api/rides/{id}/cancel` before assignment only |
| Driver offers | GET `/api/rides/driver/offers`; POST `/api/rides/{id}/accept` or `/reject` |
| Completion/payment | GET `/api/payments/ride/{rideId}`, `/api/payments/my`; POST `/api/payments/{id}/complete` |

## Journey behavior

Driver registration creates an account only. After sign-in, only a profile 404 opens onboarding; other failures show errors and retry. Drivers save name, phone, license and vehicle details, then save browser or manually entered coordinates before AVAILABLE is enabled. BUSY cannot be selected manually.

Passengers book using names and bounded coordinates. No fare is calculated or submitted. A failed booking is not retried automatically; the UI directs users to check ride history before another explicit attempt. SEARCHING displays the reference radar. NO_DRIVER_AVAILABLE explains that rematching is not automatic. Cancellation disappears after assignment.

Offers poll every three seconds while the driver profile is AVAILABLE. Empty offers are explicit. Acceptance conflicts refresh offers and explain that the ride or driver is no longer available. Ride details poll every three seconds until COMPLETED, CANCELLED or NO_DRIVER_AVAILABLE. Active dashboard lists poll every four seconds while active rides exist.

The driver sees only the next lifecycle action: ARRIVING, ARRIVED, IN_PROGRESS, COMPLETED. Both success and failure refresh authoritative ride state. COMPLETED with `completionSynced: false` presents an explicit Retry completion action, including when recovered from history.

Completed rides display returned fare in INR and geographical distance. Passenger payment lookup occurs after completion. Missing payment records display a retry and synchronization explanation. CASH, UPI and CARD are labels for simulated completion only; there are no payment credential inputs.

## Unsupported capabilities

No ratings submission, live maps/tracking, route-distance estimates, separate fare estimates, scheduling, wallets, real payments, chat, automatic rematching or offer expiry. Account data is read-only because the auth contract has no profile-update endpoint. Landing illustrations are labeled and fake nearby counts, ETAs, upfront fare promises and unsupported footer links were removed/adapted. Driver logout does not imply server-side OFFLINE; profile explains that availability must be changed explicitly.

## Layout and errors

Responsive desktop sidebar and mobile bottom navigation retained. Cards and forms collapse to one column on smaller screens. Reduced-motion CSS retained. Errors use visible alert regions, backend field names/messages, loading indicators and disabled pending actions. Inputs have associated labels. Location denial permits manual entry. Unknown routes and wrong roles show recovery screens.

## Verification and limits

Final verification: `npm run build` passed (including strict TypeScript checking), and `PLAYWRIGHT_CHANNEL=chrome npm test` passed all 8 tests. Browser tests use explicit contract fixtures in separate isolated passenger and driver contexts; the runtime application has no mock backend. Tests cover the complete journey, partial-completion retry, token expiry, role restrictions, 409 offers, location denial, duplicate-booking protection, cancellation rules and terminal polling. Screenshots capture mobile passenger completion and desktop driver completion; the mobile journey checks horizontal overflow at 390px.

The real gateway at `http://localhost:8080` was unreachable during implementation. Live passenger–driver–payment verification therefore remains outstanding, and fixture tests must not be interpreted as a successful live-backend test. Start the backend and follow README's real-backend checklist. Visual components/styles were preserved and rendered screenshots inspected; exhaustive pixel comparisons against every original prototype screen were not performed.

## Running

See README.md. Development origin is `http://127.0.0.1:5173`; the built-in Vite proxy targets the API Gateway at `http://localhost:8080`. Production requires a same-origin proxy or configured public gateway base URL and gateway CORS. `.env.example` documents frontend-safe configuration.
