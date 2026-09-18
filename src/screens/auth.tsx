import { useState } from "react"
import { AuthShell } from "./AuthShell"
import { Button, Field, PasswordInput } from "../components/ui"
import { useNav } from "../lib/nav"
import { useAuth } from "../lib/auth"
import { api } from "../lib/api"
import { useAction } from "../lib/hooks"
import { ErrorNotice, TextField, formValues } from "./shared"
export function AuthScreen({
  register,
}: {
  register?: "passenger" | "driver"
}) {
  const nav = useNav()
  const auth = useAuth()
  const action = useAction()
  const [created, setCreated] = useState(false)
  return (
    <AuthShell quote="Move through your city effortlessly.">
      <h1 className="text-3xl font-extrabold tracking-tight">
        {register ? `Create ${register} account` : "Welcome back"}
      </h1>
      <p className="mt-2 text-ink-soft">
        {register === "driver"
          ? "Create an account, then sign in to set up your driver profile."
          : "Sign in to continue your journey."}
      </p>
      {created && (
        <p role="status" className="mt-4 text-ok">
          Account created. Sign in to continue.
        </p>
      )}
      <ErrorNotice
        error={
          action.error ||
          (!register && auth.error ? new Error(auth.error) : null)
        }
      />
      <form
        className="mt-7 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          const v = formValues(e.currentTarget)
          void action.run(async () => {
            if (register) {
              if (v.password !== v.confirm)
                throw new Error("Passwords do not match.")
              await api(`/api/auth/register/${register}`, {
                method: "POST",
                public: true,
                body: {
                  name: v.name,
                  email: v.email,
                  password: v.password,
                  phone: v.phone,
                },
              })
              setCreated(true)
              nav("login")
            } else {
              const u = await auth.login(v.email, v.password)
              nav(
                u.role === "DRIVER"
                  ? "d-dashboard"
                  : u.role === "PASSENGER"
                    ? "p-dashboard"
                    : "err-403",
              )
            }
          })
        }}
      >
        {register && (
          <>
            <TextField name="name" label="Full name" maxLength={100} />
            <TextField
              name="phone"
              label="Phone number"
              type="tel"
              minLength={7}
              maxLength={20}
              pattern="[+0-9 ()\-]{7,20}"
            />
          </>
        )}
        <TextField
          name="email"
          label="Email"
          type="email"
          maxLength={180}
          autoComplete="email"
        />
        <Field label="Password" htmlFor="password">
          <PasswordInput
            id="password"
            name="password"
            required
            minLength={register ? 8 : undefined}
            maxLength={register ? 72 : undefined}
            autoComplete={register ? "new-password" : "current-password"}
          />
        </Field>
        {register && (
          <Field label="Confirm password" htmlFor="confirm">
            <PasswordInput
              id="confirm"
              name="confirm"
              required
              autoComplete="new-password"
            />
          </Field>
        )}
        <Button full size="lg" type="submit" loading={action.pending}>
          {register ? "Create account" : "Sign in"}
        </Button>
      </form>
      <div className="mt-6 space-y-3 text-sm text-center">
        {register ? (
          <button onClick={() => nav("login")}>
            Already registered? Sign in
          </button>
        ) : (
          <>
            <p>
              <button
                className="underline"
                onClick={() => nav("register-passenger")}
              >
                Create Passenger Account
              </button>
            </p>
            <p>
              <button
                className="underline"
                onClick={() => nav("register-driver")}
              >
                Register as Driver
              </button>
            </p>
          </>
        )}
      </div>
    </AuthShell>
  )
}
