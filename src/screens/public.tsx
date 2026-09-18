import { useState } from "react"
import { Icon } from "../components/icons"
import { Button, Logo, Card, FauxMap } from "../components/ui"
import { useNav } from "../lib/nav"

const NAV = ["Home", "How It Works", "Ride", "Drive"]

export function Landing() {
  const nav = useNav()
  const [menu, setMenu] = useState(false)
  return (
    <div className="min-h-screen bg-canvas">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur border-b border-line">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n}
                onClick={() =>
                  n === "Ride"
                    ? nav("register-passenger")
                    : n === "Drive"
                      ? nav("register-driver")
                      : document
                          .getElementById(
                            n === "Home" ? "home" : "how-it-works",
                          )
                          ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-3.5 py-2 text-sm font-semibold text-ink-soft hover:text-ink rounded-lg hover:bg-surface-2 transition-colors"
              >
                {n}
              </button>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => nav("login")}>
              Login
            </Button>
            <Button size="sm" onClick={() => nav("register-passenger")}>
              Get Started
            </Button>
          </div>
          <button
            className="md:hidden p-2 -mr-2"
            aria-label="Menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <Icon.Close /> : <Icon.Menu />}
          </button>
        </div>
        {menu && (
          <div className="md:hidden border-t border-line px-5 py-4 space-y-1 anim-fade">
            {NAV.map((n) => (
              <button
                key={n}
                onClick={() =>
                  n === "Ride"
                    ? nav("register-passenger")
                    : n === "Drive"
                      ? nav("register-driver")
                      : document
                          .getElementById(
                            n === "Home" ? "home" : "how-it-works",
                          )
                          ?.scrollIntoView({ behavior: "smooth" })
                }
                className="block py-2.5 text-sm font-semibold text-ink-soft"
              >
                {n}
              </button>
            ))}
            <div className="pt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => nav("login")}>
                Login
              </Button>
              <Button size="sm" onClick={() => nav("register-passenger")}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section
        id="home"
        className="mx-auto max-w-7xl px-5 pt-14 pb-16 md:pt-20 md:pb-24 grid lg:grid-cols-2 gap-12 items-center"
      >
        <div className="anim-fade-up">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-lime-deep bg-lime-dim px-3 h-7 rounded-full">
            <Icon.Bolt size={13} /> Urban mobility demonstration
          </span>
          <h1 className="mt-5 text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold tracking-tight leading-[0.98]">
            Move through your city{" "}
            <span className="text-lime-deep">effortlessly.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-soft max-w-md">
            Request a ride in seconds. Nearby drivers pick up your request, and
            you track every step from pickup to drop-off — transparent fare, no
            surprises.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              icon={<Icon.Pin size={18} />}
              onClick={() => nav("register-passenger")}
            >
              Book a Ride
            </Button>
            <Button
              size="lg"
              variant="outline"
              icon={<Icon.Car size={18} />}
              onClick={() => nav("register-driver")}
            >
              Drive with UrbanGlide
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Icon.Shield size={16} className="text-ink" /> Secure accounts
            </span>
            <span className="flex items-center gap-2">
              <Icon.Route size={16} className="text-ink" /> Ride status updates
            </span>
          </div>
        </div>
        {/* Hero visual */}
        <div className="relative anim-scale-in">
          <FauxMap className="aspect-[4/3] rounded-3xl border border-line shadow-2xl" />
          <Card className="absolute -bottom-5 left-5 right-5 sm:right-auto sm:w-72 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-lime grid place-items-center text-ink">
                <Icon.Car size={20} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold">Follow your ride</p>
                <p className="text-[12px] text-muted font-mono">
                  Illustration · not live tracking
                </p>
              </div>
              <span className="font-mono text-sm font-bold">Demo</span>
            </div>
          </Card>
          <div className="absolute -top-4 -right-3 hidden sm:block">
            <Card className="shadow-xl !p-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ok anim-pulse-dot" />
              <span className="text-[12px] font-bold">
                Nearby ride matching
              </span>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-ink text-canvas on-night">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-lime text-[12px] font-bold uppercase tracking-widest">
            How UrbanGlide works
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
            Four steps to your ride.
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                n: "01",
                t: "Request a ride",
                d: "Set your pickup and destination, then confirm.",
                i: <Icon.Pin size={22} />,
              },
              {
                n: "02",
                t: "Drivers receive offers",
                d: "Nearby available drivers see offers as their app refreshes.",
                i: <Icon.Bell size={22} />,
              },
              {
                n: "03",
                t: "A driver accepts",
                d: "The first available driver is matched and assigned.",
                i: <Icon.CheckCircle size={22} />,
              },
              {
                n: "04",
                t: "Complete your journey",
                d: "Follow ride status and complete a simulated payment.",
                i: <Icon.Nav size={22} />,
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-night-line bg-night-2 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="w-11 h-11 rounded-xl bg-lime grid place-items-center text-ink">
                    {s.i}
                  </span>
                  <span className="font-mono text-2xl font-bold text-night-line">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-4 font-bold text-lg">{s.t}</h3>
                <p className="mt-1.5 text-sm text-night-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ride / Drive split */}
      <section className="mx-auto max-w-7xl px-5 py-20 grid md:grid-cols-2 gap-5">
        {[
          {
            t: "For passengers",
            h: "Get where you need to be.",
            d: "Nearby matching, ride status updates, and a backend-calculated fare after completion.",
            cta: "Create passenger account",
            r: "register-passenger" as const,
            tone: "light",
          },
          {
            t: "For drivers",
            h: "Drive on your terms.",
            d: "Go online, accept requests nearby, and manage every ride from your phone.",
            cta: "Register as driver",
            r: "register-driver" as const,
            tone: "dark",
          },
        ].map((c) => (
          <div
            key={c.t}
            className={`rounded-3xl p-8 md:p-10 border ${
              c.tone === "dark"
                ? "bg-ink text-canvas border-ink on-night"
                : "bg-surface border-line"
            }`}
          >
            <p
              className={`text-[12px] font-bold uppercase tracking-widest ${
                c.tone === "dark" ? "text-lime" : "text-lime-deep"
              }`}
            >
              {c.t}
            </p>
            <h3 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              {c.h}
            </h3>
            <p
              className={`mt-3 ${
                c.tone === "dark" ? "text-night-muted" : "text-ink-soft"
              }`}
            >
              {c.d}
            </p>
            <Button
              className="mt-6"
              variant={c.tone === "dark" ? "night" : "primary"}
              icon={<Icon.ArrowRight size={17} />}
              onClick={() => nav(c.r)}
            >
              {c.cta}
            </Button>
          </div>
        ))}
      </section>

      {/* Why */}
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">
          Why UrbanGlide
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              i: <Icon.Bolt />,
              t: "Fast matching",
              d: "Requests reach nearby drivers the moment you book.",
            },
            {
              i: <Icon.Route />,
              t: "Simple ride tracking",
              d: "Watch each status from assigned to completed.",
            },
            {
              i: <Icon.Shield />,
              t: "Secure accounts",
              d: "Sign in securely to access your own rides.",
            },
            {
              i: <Icon.Receipt />,
              t: "Transparent fare",
              d: "See geographical distance and the final fare after completion.",
            },
            {
              i: <Icon.Home />,
              t: "Responsive experience",
              d: "Designed for mobile-first, works everywhere.",
            },
            {
              i: <Icon.Clock />,
              t: "Always ready",
              d: "Book a ride whenever your city calls.",
            },
          ].map((f) => (
            <Card
              key={f.t}
              className="hover:border-line-strong transition-colors"
            >
              <span className="w-11 h-11 rounded-xl bg-surface-2 grid place-items-center text-ink">
                {f.i}
              </span>
              <h3 className="mt-4 font-bold">{f.t}</h3>
              <p className="mt-1.5 text-sm text-muted">{f.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="rounded-3xl bg-lime px-8 py-14 md:py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink">
            Your city is waiting.
          </h2>
          <p className="mt-3 text-ink-soft text-lg">
            Book your first ride with UrbanGlide today.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => nav("register-passenger")}>
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="!border-ink"
              onClick={() => nav("login")}
            >
              I already have an account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-12 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted max-w-xs">
              Real-time urban ride dispatch & mobility orchestration.
            </p>
          </div>
          <div className="flex gap-12 flex-wrap">
            {["Ride", "Drive", "Login"].map((l) => (
              <button
                key={l}
                onClick={() =>
                  nav(
                    l === "Ride"
                      ? "register-passenger"
                      : l === "Drive"
                        ? "register-driver"
                        : "login",
                  )
                }
                className="text-sm font-semibold text-ink-soft hover:text-ink"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-line py-5 text-center text-[12px] text-muted">
          © 2026 UrbanGlide · Demonstration — no money moves
        </div>
      </footer>
    </div>
  )
}
