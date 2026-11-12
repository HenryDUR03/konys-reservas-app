// Lee las mesas activas desde Supabase (RF-01).
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export function useMesas() {
  const [datos, setDatos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    async function cargar() {
      const { data, error } = await supabase
        .from('mesas')
        .select('*')
        .eq('activa', true)
        .order('nombre')
      if (!activo) return
      if (error) setError(error.message)
      else setDatos(data)
      setCargando(false)
    }
    cargar()
    return () => {
      activo = false
    }
  }, [])

  return { datos, cargando, error }
}
