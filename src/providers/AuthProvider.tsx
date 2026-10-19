import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"
import { cloudEnabled, getSupabase } from "@/lib/supabase"

interface AuthState {
  ready: boolean
  signedIn: boolean
  isGuest: boolean
  userId: string | null
}

const AuthCtx = createContext<AuthState>({ ready: false, signedIn: false, isGuest: false, userId: null })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ ready: !cloudEnabled, signedIn: false, isGuest: false, userId: null })

  useEffect(() => {
    if (!cloudEnabled) {
      setState({ ready: true, signedIn: false, isGuest: false, userId: null })
      return
    }
    const supabase = getSupabase()
    if (!supabase) return

    let cancelled = false

    const apply = (session: Session | null) => {
      if (cancelled) return
      setState({
        ready: true,
        signedIn: Boolean(session),
        isGuest: session?.user?.is_anonymous ?? false,
        userId: session?.user?.id ?? null,
      })
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        apply(data.session)
      } else {
        // Guest-first: sign in invisibly so progress has somewhere to live.
        supabase.auth.signInAnonymously().then(({ data: anon }) => apply(anon.session)).catch(() => apply(null))
      }
    }).catch(() => apply(null))

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => apply(session))
    return () => { cancelled = true; sub.subscription.unsubscribe() }
  }, [])

  return <AuthCtx.Provider value={state}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
