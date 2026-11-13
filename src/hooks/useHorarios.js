// Lee los horarios de atención vigentes (RF-03, RF-04).
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export function useHorarios() {
  const [datos, setDatos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    async function cargar() {
      const { data, error } = await supabase.from('horarios').select('*').eq('activo', true)
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
