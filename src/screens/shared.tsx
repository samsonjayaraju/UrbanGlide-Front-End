import type { ReactNode } from "react"
import { ApiError } from "../lib/api"
import { Button, Field, Input, Spinner } from "../components/ui"
export function ErrorNotice({ error }: { error: Error | null | undefined }) {
  return error ? (
    <div
      role="alert"
      className="rounded-xl bg-danger-soft text-danger p-4 text-sm my-4"
    >
      <p>{error.message}</p>
      {error instanceof ApiError &&
        Object.entries(error.fieldErrors).map(([k, v]) => (
          <p key={k}>
            {k}: {String(v)}
          </p>
        ))}
    </div>
  ) : null
}
export function Loading() {
  return (
    <p role="status" className="p-6 flex gap-3 items-center">
      <Spinner /> Loading…
    </p>
  )
}
export function Page({
  title,
  sub,
  children,
}: {
  title: string
  sub?: string
  children: ReactNode
}) {
  return (
    <div className="ug-page p-5 md:p-8 max-w-5xl mx-auto anim-fade">
      <h1 className="ug-page-title text-2xl md:text-3xl font-extrabold tracking-tight">
        {title}
      </h1>
      {sub && <p className="mt-2 text-ink-soft">{sub}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  )
}
export function TextField({
  name,
  label,
  value,
  ...props
}: {
  name: string
  label: string
  value?: string | number
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} htmlFor={name}>
      <Input id={name} name={name} defaultValue={value} required {...props} />
    </Field>
  )
}
export function Refresh({ refresh }: { refresh: () => void }) {
  return (
    <Button variant="outline" onClick={refresh}>
      Refresh
    </Button>
  )
}
export const formValues = (form: HTMLFormElement) =>
  Object.fromEntries(new FormData(form).entries()) as Record<string, string>

export function FormSection({number,title}:{number:string;title:string}) {
 return <div className="ug-form-section"><span aria-hidden="true">{number}</span><h3>{title}</h3></div>
}
