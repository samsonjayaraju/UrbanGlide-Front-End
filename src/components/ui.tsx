import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { Icon } from "./icons"
import type { RideStatus, DriverStatus, PaymentStatus } from "../lib/data"
import { RIDE_STATUS_LABEL } from "../lib/data"

/* ---------- Buttons ---------- */
type BtnVariant = "primary" | "secondary" | "outline" | "danger" | "ghost" | "night"
export function Button({
  variant = "primary",
  size = "md",
  full,
  loading,
  icon,
  children,
  className = "",
  night,
  ...props
}: {
  variant?: BtnVariant
  size?: "sm" | "md" | "lg"
  full?: boolean
  loading?: boolean
  icon?: ReactNode
  night?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizes = {
    sm: "h-9 px-3.5 text-[13px]",
    md: "h-11 px-5 text-sm",
    lg: "h-13 px-6 text-[15px]",
  }
  const variants: Record<BtnVariant, string> = {
    primary: "bg-ink text-canvas hover:bg-[#26271c] active:translate-y-px",
    night: "bg-lime text-ink hover:bg-[#d0ff4d] active:translate-y-px",
    secondary: night
      ? "bg-night-2 text-canvas border border-night-line hover:border-night-muted"
      : "bg-surface-2 text-ink hover:bg-line",
    outline: night
      ? "border border-night-line text-canvas hover:border-lime"
      : "border border-line-strong text-ink hover:border-ink bg-transparent",
    danger: "bg-danger text-white hover:brightness-95 active:translate-y-px",
    ghost: night
      ? "text-canvas hover:bg-night-2"
      : "text-ink hover:bg-surface-2",
  }
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`ug-button inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-200 disabled:opacity-55 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${
        full ? "w-full" : ""
      } ${className}`}
    >
      {loading && (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent anim-spin" />
      )}
      {!loading && icon}
      {children}
    </button>
  )
}

export function IconButton({
  label,
  night,
  active,
  className = "",
  ...props
}: {
  label: string
  night?: boolean
  active?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-label={label}
      {...props}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
        night
          ? "text-canvas hover:bg-night-2"
          : active
            ? "bg-ink text-canvas"
            : "text-ink hover:bg-surface-2"
      } ${className}`}
    />
  )
}

/* ---------- Inputs ---------- */
export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
  htmlFor?: string
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-[13px] font-semibold text-ink-soft"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[12px] text-danger flex items-center gap-1">
          <Icon.Warning size={13} />
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export function Input({
  icon,
  error,
  className = "",
  mono,
  ...props
}: {
  icon?: ReactNode
  error?: boolean
  mono?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`w-full h-11 rounded-xl bg-surface border text-sm text-ink placeholder:text-muted transition-colors focus:border-ink ${
          icon ? "pl-10 pr-3.5" : "px-3.5"
        } ${error ? "border-danger" : "border-line-strong"} ${
          mono ? "font-mono tracking-tight" : ""
        } ${className}`}
      />
    </div>
  )
}

export function PasswordInput({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
        <Icon.Lock size={17} />
      </span>
      <input
        {...props}
        type={show ? "text" : "password"}
        className="w-full h-11 rounded-xl bg-surface border border-line-strong text-sm text-ink placeholder:text-muted pl-10 pr-11 focus:border-ink transition-colors"
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow(!show)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-1"
      >
        {show ? <Icon.EyeOff size={17} /> : <Icon.Eye size={17} />}
      </button>
    </div>
  )
}

export function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 disabled:opacity-50 ${
        checked ? "bg-lime-deep" : "bg-line-strong"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  night,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  night?: boolean
}) {
  return (
    <div
      className={`inline-flex p-1 rounded-xl gap-1 ${
        night ? "bg-night-2" : "bg-surface-2"
      }`}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3.5 h-9 rounded-lg text-[13px] font-semibold transition-colors ${
            value === o.value
              ? night
                ? "bg-lime text-ink"
                : "bg-ink text-canvas"
              : night
                ? "text-night-muted hover:text-canvas"
                : "text-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 h-9 rounded-full text-[13px] font-semibold border transition-colors ${
        active
          ? "bg-ink text-canvas border-ink"
          : "bg-surface text-ink-soft border-line-strong hover:border-ink"
      }`}
    >
      {children}
    </button>
  )
}

/* ---------- Surfaces ---------- */
export function Card({
  children,
  className = "",
  pad = true,
  night,
}: {
  children: ReactNode
  className?: string
  pad?: boolean
  night?: boolean
}) {
  return (
    <div
      className={`ug-card ${night ? "ug-card-night" : ""} rounded-2xl border ${
        night ? "bg-night-2 border-night-line" : "bg-surface border-line"
      } ${pad ? "p-5" : ""} ${className}`}
    >
      {children}
    </div>
  )
}

export function Avatar({
  name,
  size = 40,
  night,
}: {
  name: string
  size?: number
  night?: boolean
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`inline-flex items-center justify-center rounded-full font-bold shrink-0 ${
        night ? "bg-lime text-ink" : "bg-ink text-canvas"
      }`}
    >
      {initials}
    </span>
  )
}

/* ---------- Badges ---------- */
const RIDE_TONE: Record<RideStatus, string> = {
  REQUESTED: "info",
  SEARCHING: "warn",
  DRIVER_ASSIGNED: "info",
  ARRIVING: "warn",
  ARRIVED: "ok",
  IN_PROGRESS: "lime",
  COMPLETED: "ok",
  CANCELLED: "danger",
  NO_DRIVER_AVAILABLE: "danger",
}
const TONE_CLASS: Record<string, string> = {
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  lime: "bg-lime-dim text-lime-deep",
  muted: "bg-surface-2 text-muted",
}

export function Badge({
  tone = "muted",
  dot,
  children,
}: {
  tone?: string
  dot?: boolean
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full text-[11px] font-bold uppercase tracking-wide ${TONE_CLASS[tone] ?? TONE_CLASS.muted}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function RideBadge({ status }: { status: RideStatus }) {
  return (
    <Badge tone={RIDE_TONE[status]} dot>
      {RIDE_STATUS_LABEL[status]}
    </Badge>
  )
}

export function DriverBadge({ status }: { status: DriverStatus }) {
  const tone =
    status === "AVAILABLE" ? "ok" : status === "BUSY" ? "warn" : "muted"
  return (
    <Badge tone={tone} dot>
      {status.toLowerCase()}
    </Badge>
  )
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const tone =
    status === "SUCCESS" ? "ok" : status === "PENDING" ? "warn" : "danger"
  return (
    <Badge tone={tone} dot>
      {status.toLowerCase()}
    </Badge>
  )
}

/* ---------- Route block ---------- */
export function RouteBlock({
  pickup,
  destination,
  night,
  distanceKm,
}: {
  pickup: string
  destination: string
  night?: boolean
  distanceKm?: number
}) {
  return (
    <div className="ug-route flex gap-3">
      <div className="flex flex-col items-center pt-1.5">
        <span
          className={`w-2.5 h-2.5 rounded-full ${night ? "bg-lime" : "bg-ink"}`}
        />
        <span
          className={`w-px flex-1 my-1 ${
            night ? "bg-night-line" : "bg-line-strong"
          }`}
          style={{ minHeight: 18 }}
        />
        <span
          className={`w-2.5 h-2.5 rounded-sm ${
            night ? "bg-canvas" : "bg-lime-deep"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        <div>
          <p
            className={`text-[11px] font-semibold uppercase tracking-wide ${
              night ? "text-night-muted" : "text-muted"
            }`}
          >
            Pickup
          </p>
          <p
            className={`text-sm font-semibold truncate ${
              night ? "text-canvas" : "text-ink"
            }`}
          >
            {pickup}
          </p>
        </div>
        <div>
          <p
            className={`text-[11px] font-semibold uppercase tracking-wide ${
              night ? "text-night-muted" : "text-muted"
            }`}
          >
            Destination
          </p>
          <p
            className={`text-sm font-semibold truncate ${
              night ? "text-canvas" : "text-ink"
            }`}
          >
            {destination}
          </p>
        </div>
      </div>
      {distanceKm != null && (
        <div className={`text-right ${night ? "text-canvas" : "text-ink"}`}>
          <p className="font-mono text-sm font-semibold">{distanceKm} km</p>
        </div>
      )}
    </div>
  )
}

/* ---------- Timeline ---------- */
import { RIDE_FLOW } from "../lib/data"
export function RideTimeline({
  status,
  night,
}: {
  status: RideStatus
  night?: boolean
}) {
  if (status === "CANCELLED" || status === "NO_DRIVER_AVAILABLE") {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
          status === "CANCELLED" ? "bg-danger-soft" : "bg-warn-soft"
        }`}
      >
        <Icon.X
          size={18}
          className={status === "CANCELLED" ? "text-danger" : "text-warn"}
        />
        <p className="text-sm font-semibold text-ink">
          {status === "CANCELLED"
            ? "This ride was cancelled."
            : "No driver could be matched."}
        </p>
      </div>
    )
  }
  const idx = RIDE_FLOW.indexOf(status)
  return (
    <ol className="space-y-0">
      {RIDE_FLOW.map((s, i) => {
        const done = i < idx,
          current = i === idx
        return (
          <li key={s} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`grid place-items-center w-6 h-6 rounded-full text-[11px] transition-colors ${
                  done
                    ? night
                      ? "bg-lime text-ink"
                      : "bg-ink text-canvas"
                    : current
                      ? "bg-lime text-ink"
                      : night
                        ? "bg-night-line text-night-muted"
                        : "bg-surface-2 text-muted"
                }`}
              >
                {done ? (
                  <Icon.Check size={13} />
                ) : current ? (
                  <span className="w-2 h-2 rounded-full bg-ink anim-pulse-dot" />
                ) : (
                  i + 1
                )}
              </span>
              {i < RIDE_FLOW.length - 1 && (
                <span
                  className={`w-px h-6 ${
                    done
                      ? night
                        ? "bg-lime"
                        : "bg-ink"
                      : night
                        ? "bg-night-line"
                        : "bg-line-strong"
                  }`}
                />
              )}
            </div>
            <div
              className={`pb-6 -mt-0.5 ${
                i === RIDE_FLOW.length - 1 ? "pb-0" : ""
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  current
                    ? night
                      ? "text-lime"
                      : "text-ink"
                    : done
                      ? night
                        ? "text-canvas"
                        : "text-ink"
                      : night
                        ? "text-night-muted"
                        : "text-muted"
                }`}
              >
                {RIDE_STATUS_LABEL[s]}
              </p>
              {current && (
                <p
                  className={`text-[12px] ${
                    night ? "text-night-muted" : "text-muted"
                  }`}
                >
                  {status === "COMPLETED" ? "Finished" : "Current stage"}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/* ---------- Faux map ---------- */
export function FauxMap({
  night,
  className = "",
  children,
}: {
  night?: boolean
  className?: string
  children?: ReactNode
}) {
  const line = night ? "rgba(196,247,51,0.5)" : "#14150f"
  return (
    <div
      className={`relative overflow-hidden ${
        night ? "map-grid-night" : "map-grid"
      } ${className}`}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 400 300"
      >
        <path
          d="M-10 210 Q 120 180 190 120 T 410 40"
          fill="none"
          stroke={line}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="10 8"
          style={{ animation: "ug-dash 1.2s linear infinite" }}
          opacity="0.85"
        />
        <path
          d="M40 -10 L 120 120 L 60 300"
          fill="none"
          stroke={night ? "rgba(255,255,255,0.08)" : "#d3d0c0"}
          strokeWidth="10"
        />
        <path
          d="M400 90 L 240 150 L 300 310"
          fill="none"
          stroke={night ? "rgba(255,255,255,0.08)" : "#d3d0c0"}
          strokeWidth="10"
        />
        <circle cx="20" cy="205" r="6" fill={night ? "#c4f733" : "#14150f"} />
        <rect
          x="197"
          y="112"
          width="12"
          height="12"
          rx="2"
          fill={night ? "#f6f5ef" : "#a6d61d"}
        />
      </svg>
      {children}
    </div>
  )
}

/* ---------- Modal / Bottom sheet ---------- */
export function Modal({
  open,
  onClose,
  title,
  children,
  danger,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  danger?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink/45 anim-fade" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl border border-line shadow-2xl anim-slide-up sm:anim-scale-in">
        <div className="p-5">
          <div className="sm:hidden mx-auto mb-4 w-10 h-1 rounded-full bg-line-strong" />
          <h3
            className={`text-lg font-bold tracking-tight ${
              danger ? "text-danger" : "text-ink"
            }`}
          >
            {title}
          </h3>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Skeleton ---------- */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-lg ${className}`} />
}

export function Spinner({
  size = 20,
  night,
}: {
  size?: number
  night?: boolean
}) {
  return (
    <span
      style={{ width: size, height: size }}
      className={`inline-block rounded-full border-2 border-t-transparent anim-spin ${
        night ? "border-lime" : "border-ink"
      }`}
    />
  )
}

/* ---------- Toasts ---------- */
type Toast = { id: number; title: string; tone?: string; icon?: ReactNode }
const ToastCtx = createContext<(t: Omit<Toast, "id">) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = (t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random()
    setToasts((v) => [...v, { ...t, id }])
    setTimeout(() => setToasts((v) => v.filter((x) => x.id !== id)), 3200)
  }
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="anim-toast-in flex items-center gap-3 bg-ink text-canvas rounded-xl px-4 py-3 shadow-xl"
          >
            <span
              className={`shrink-0 ${
                t.tone === "ok"
                  ? "text-lime"
                  : t.tone === "danger"
                    ? "text-danger"
                    : "text-canvas"
              }`}
            >
              {t.icon ?? <Icon.Info size={18} />}
            </span>
            <p className="text-sm font-semibold">{t.title}</p>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- Wordmark ---------- */
export function Logo({
  night,
  size = "md",
}: {
  night?: boolean
  size?: "sm" | "md" | "lg"
}) {
  const sz = { sm: "text-base", md: "text-lg", lg: "text-2xl" }[size]
  const box = { sm: 20, md: 24, lg: 32 }[size]
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <span
        style={{ width: box, height: box }}
        className={`relative grid place-items-center rounded-lg ${
          night ? "bg-lime" : "bg-ink"
        }`}
      >
        <Icon.Nav
          size={box * 0.58}
          className={night ? "text-ink" : "text-lime"}
          style={{ transform: "rotate(20deg)" }}
        />
      </span>
      <span
        className={`font-extrabold tracking-tight ${sz} ${
          night ? "text-canvas" : "text-ink"
        }`}
      >
        Urban
        <span className={night ? "text-lime" : "text-lime-deep"}>Glide</span>
      </span>
    </span>
  )
}

export function StatRow({
  label,
  value,
  mono,
  night,
}: {
  label: string
  value: ReactNode
  mono?: boolean
  night?: boolean
}) {
  return (
    <div
      className="flex items-center justify-between py-2.5 border-b last:border-0"
      style={{
        borderColor: night ? "var(--color-night-line)" : "var(--color-line)",
      }}
    >
      <span
        className={`text-[13px] ${night ? "text-night-muted" : "text-muted"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${mono ? "font-mono" : ""} ${
          night ? "text-canvas" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  )
}
