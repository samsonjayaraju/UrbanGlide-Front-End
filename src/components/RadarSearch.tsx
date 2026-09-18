import { Icon } from "./icons"

/** Signature UrbanGlide ride-search animation: center pin, expanding radar rings, orbiting driver dots. */
export function RadarSearch({ size = 220 }: { size?: number }) {
  const dots = [
    { a: 20, r: 0.32 },
    { a: 140, r: 0.42 },
    { a: 250, r: 0.28 },
    { a: 310, r: 0.46 },
  ]
  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* faint concentric guides */}
      {[0.55, 0.8, 1].map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full border border-night-line"
          style={{ width: size * s, height: size * s }}
        />
      ))}
      {/* expanding rings */}
      {[0, 0.5, 1].map((d) => (
        <span
          key={d}
          className="absolute rounded-full border-2 border-lime"
          style={{
            width: size,
            height: size,
            animation: `ug-radar 2.4s ${d}s cubic-bezier(0.2,0.6,0.3,1) infinite`,
          }}
        />
      ))}
      {/* orbiting driver dots */}
      {dots.map((d, i) => {
        const x = Math.cos((d.a * Math.PI) / 180) * (size / 2) * d.r
        const y = Math.sin((d.a * Math.PI) / 180) * (size / 2) * d.r
        return (
          <span
            key={i}
            className="absolute w-6 h-6 rounded-full grid place-items-center bg-night-2 border border-night-line text-lime anim-pulse-dot"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <Icon.Car size={13} />
          </span>
        )
      })}
      {/* center pin */}
      <span className="relative z-10 w-14 h-14 rounded-full bg-lime grid place-items-center text-ink shadow-lg">
        <Icon.Pin size={26} />
      </span>
    </div>
  )
}
