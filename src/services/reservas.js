// Consultas y escritura de reservas en Supabase.
import { supabase } from './supabase'

// Devuelve las horas de inicio ya ocupadas de una mesa en una fecha: ['19:00', '20:00']
export async function obtenerOcupados(mesaId, fecha) {
  const { data, error } = await supabase
    .from('reservas')
    .select('hora_inicio')
    .eq('mesa_id', mesaId)
    .eq('fecha', fecha)
    .eq('estado', 'confirmada')
  if (error) throw error
  return data.map((r) => r.hora_inicio.slice(0, 5))
}

// Crea la reserva. Primero verifica que el slot siga libre (condición de carrera)
// y además la base de datos lo protege con un índice único.
export async function crearReserva(reserva) {
  const ocupados = await obtenerOcupados(reserva.mesa_id, reserva.fecha)
  if (ocupados.includes(reserva.hora_inicio)) return { ok: false, motivo: 'ocupado' }

  const { data, error } = await supabase
    .from('reservas')
    .insert({ ...reserva, estado: 'confirmada' })
    .select()
    .single()

  if (error) {
    // 23505 = violación del índice único: alguien reservó justo antes
    if (error.code === '23505') return { ok: false, motivo: 'ocupado' }
    return { ok: false, motivo: 'error', mensaje: error.message }
  }
  return { ok: true, reserva: data }
}
