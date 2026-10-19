import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Cloud is optional. If the env vars are missing the app runs fully on
// localStorage, so a live demo never depends on the network or on keys.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const cloudEnabled = Boolean(url && anonKey)

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!cloudEnabled) return null
  if (!client) {
    client = createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  }
  return client
}
