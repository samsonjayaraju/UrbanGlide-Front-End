import { useState, type ReactNode } from "react"
import { Icon } from "../components/icons"
import {
  Button,
  Logo,
  Field,
  Input,
  PasswordInput,
  FauxMap,
  useToast,
} from "../components/ui"
import { useNav } from "../lib/nav"

export function AuthShell({
  children,
  quote,
}: {
  children: ReactNode
  quote: string
}) {
  const nav = useNav()
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* form side */}
      <div className="flex flex-col min-h-screen lg:min-h-0">
        <div className="p-5 md:p-8">
          <button onClick={() => nav("landing")} className="inline-flex">
            <Logo />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-5 pb-10">
          <div className="w-full max-w-sm anim-fade-up">{children}</div>
        </div>
      </div>
      {/* visual side */}
      <div className="hidden lg:block relative bg-ink on-night overflow-hidden">
        <FauxMap night className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="absolute bottom-0 p-12">
          <Icon.Nav
            size={40}
            className="text-lime"
            style={{ transform: "rotate(20deg)" }}
          />
          <p className="mt-5 text-2xl font-bold text-canvas max-w-sm leading-snug">
            {quote}
          </p>
        </div>
      </div>
    </div>
  )
}
