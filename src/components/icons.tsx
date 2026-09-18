import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  }
}

export const Icon = {
  Menu: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  Close: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  ArrowRight: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  ArrowLeft: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  ),
  ChevronRight: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  ChevronDown: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  CheckCircle: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  ),
  Pin: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  Dot: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  Nav: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 2l9 20-9-5-9 5 9-20z" />
    </svg>
  ),
  Car: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 13l2-5.5A2 2 0 016.9 6h10.2a2 2 0 011.9 1.5L21 13v5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H6v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-5z" />
      <path d="M3 13h18" />
      <circle cx="7.5" cy="16.5" r=".6" />
      <circle cx="16.5" cy="16.5" r=".6" />
    </svg>
  ),
  Route: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M18 7v4a4 4 0 01-4 4H9a3 3 0 00-3 3" />
    </svg>
  ),
  Clock: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  Home: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v9h12v-9" />
    </svg>
  ),
  Receipt: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 3h12v18l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2L6 21V3z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  ),
  User: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  ),
  Wallet: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M16 14h2" />
    </svg>
  ),
  List: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </svg>
  ),
  Bell: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 9a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z" />
      <path d="M10 20a2 2 0 004 0" />
    </svg>
  ),
  Eye: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A10.9 10.9 0 0112 5c6.5 0 10 7 10 7a17.6 17.6 0 01-3.6 4.3M6.2 6.2A17.4 17.4 0 002 12s3.5 7 10 7a10.7 10.7 0 004.3-.9" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" />
    </svg>
  ),
  Search: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  ),
  Phone: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 4h4l1.5 5-2 1.5a12 12 0 005 5l1.5-2 5 1.5v4a2 2 0 01-2.2 2A17 17 0 013 6.2 2 2 0 015 4z" />
    </svg>
  ),
  Mail: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  ),
  Lock: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="4.5" y="10" width="15" height="10" rx="2" />
      <path d="M8 10V8a4 4 0 018 0v2" />
    </svg>
  ),
  Shield: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Bolt: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  ),
  Power: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3v8" />
      <path d="M6.4 6.4a8 8 0 1011.2 0" />
    </svg>
  ),
  Logout: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M14 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4" />
      <path d="M10 12h9M16 8l4 4-4 4" />
    </svg>
  ),
  Target: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  ),
  Warning: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3l9 16H3l9-16z" />
      <path d="M12 9v4M12 16.5h.01" />
    </svg>
  ),
  Info: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  ),
  X: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  ),
  Cash: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9v6M18 9v6" />
    </svg>
  ),
  Card: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 9.5h19M6 15h4" />
    </svg>
  ),
  Upi: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 12l6-8 3 4-6 8-3-4zM11 12l6-8 3 4-6 8" />
    </svg>
  ),
  Star: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9L12 3z" />
    </svg>
  ),
  License: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <path d="M13 9h5M13 12h5M5.5 15.5c.5-1.4 1.5-2 2.5-2s2 .6 2.5 2" />
    </svg>
  ),
  Edit: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 20h4L18.5 9.5a2 2 0 00-3-3L5 17v3z" />
      <path d="M14 7l3 3" />
    </svg>
  ),
  Location: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <circle cx="12" cy="12" r="8" opacity=".4" />
    </svg>
  ),
  Refresh: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M20 12a8 8 0 10-2.3 5.6M20 20v-4h-4" />
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
}

export type IconName = keyof typeof Icon
