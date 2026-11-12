// Conexión con Supabase. Las claves vienen del archivo .env (nunca van en el código).
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Revisa tu archivo .env y reinicia npm run dev.'
  )
}

export const supabase = createClient(url, key)
export default supabase
