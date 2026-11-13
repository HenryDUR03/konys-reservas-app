// Operaciones del panel de administración con Supabase (mesas y horarios).
import { supabase } from './supabase'

// ---------- Mesas ----------
export async function listarMesas() {
  const { data, error } = await supabase.from('mesas').select('*')
  if (error) throw error
  // Orden natural: Mesa 2 antes que Mesa 10
  return data.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { numeric: true }))
}

// Si la mesa trae id se actualiza; si no, se crea una nueva.
export async function guardarMesa(mesa) {
  const { id, ...campos } = mesa
  const consulta = id
    ? supabase.from('mesas').update(campos).eq('id', id)
    : supabase.from('mesas').insert(campos)
  const { error } = await consulta
  if (error) throw error
}

export async function cambiarEstadoMesa(id, activa) {
  const { error } = await supabase.from('mesas').update({ activa }).eq('id', id)
  if (error) throw error
}

export async function borrarMesa(id) {
  const { error } = await supabase.from('mesas').delete().eq('id', id)
  if (error) throw error
}

// ---------- Horarios ----------
export async function listarHorarios() {
  const { data, error } = await supabase.from('horarios').select('*')
  if (error) throw error
  return data
}

export async function guardarHorario(id, campos) {
  const { error } = await supabase.from('horarios').update(campos).eq('id', id)
  if (error) throw error
}
