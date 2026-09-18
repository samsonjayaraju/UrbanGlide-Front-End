import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  api,
  expire,
  readSession,
  saveSession,
  type Session,
  type User,
} from "./api"
const Auth = createContext<{
  user: User | null
  loading: boolean
  error: string
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  restore: () => void
}>(null!)
export const useAuth = () => useContext(Auth)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession)
  const [loading, setLoading] = useState(!!session)
  const [error, setError] = useState("")
  const [version, setVersion] = useState(0)
  useEffect(() => {
    const fn = () => {
      setSession(null)
      setError("Your session has expired. Please sign in again.")
      setLoading(false)
    }
    window.addEventListener("auth-expired", fn)
    return () => window.removeEventListener("auth-expired", fn)
  }, [])
  useEffect(() => {
    const current = readSession()
    if (!current) {
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    api<User>("/api/auth/me", { signal: controller.signal })
      .then((user) => {
        const s = { ...current, user }
        saveSession(s)
        setSession(s)
        setError("")
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [version])
  useEffect(() => {
    if (!session) return
    const timer = setTimeout(
      expire,
      Math.min(session.expiresAt - Date.now(), 2147483647),
    )
    return () => clearTimeout(timer)
  }, [session])
  return (
    <Auth.Provider
      value={{
        user: session?.user ?? null,
        loading,
        error,
        restore: () => setVersion((v) => v + 1),
        logout: () => {
          saveSession(null)
          setSession(null)
          setError("")
        },
        login: async (email, password) => {
          const data = await api<{
            token: string
            tokenType: string
            expiresIn: number
            user: User
          }>("/api/auth/login", {
            method: "POST",
            body: { email, password },
            public: true,
          })
          const s = { ...data, expiresAt: Date.now() + data.expiresIn * 1000 }
          saveSession(s)
          setSession(s)
          setError("")
          return data.user
        },
      }}
    >
      {children}
    </Auth.Provider>
  )
}
