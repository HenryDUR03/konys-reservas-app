// Operaciones del panel de administración con Supabase: mesas, horarios, reservas y carta.
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

// ---------- Reservas ----------
// Filtros opcionales: fecha ('2026-11-15') y mesaId. Trae también el nombre de la mesa.
export async function listarReservas({ fecha, mesaId } = {}) {
  let consulta = supabase
    .from('reservas')
    .select('*, mesas(nombre)')
    .order('fecha')
    .order('hora_inicio')
  if (fecha) consulta = consulta.eq('fecha', fecha)
  if (mesaId) consulta = consulta.eq('mesa_id', mesaId)
  const { data, error } = await consulta
  if (error) throw error
  return data
}

export async function cambiarEstadoReserva(id, estado) {
  const { error } = await supabase.from('reservas').update({ estado }).eq('id', id)
  if (error) throw error
}

// ---------- Carta ----------
const ORDEN_CATEGORIAS = ['pizzas', 'entradas', 'postres', 'bebidas']

export async function listarPlatos() {
  const { data, error } = await supabase.from('platos').select('*')
  if (error) throw error
  return data.sort(
    (a, b) =>
      ORDEN_CATEGORIAS.indexOf(a.categoria) - ORDEN_CATEGORIAS.indexOf(b.categoria) ||
      a.nombre.localeCompare(b.nombre, 'es')
  )
}

export async function guardarPlato(plato) {
  const { id, ...campos } = plato
  const consulta = id
    ? supabase.from('platos').update(campos).eq('id', id)
    : supabase.from('platos').insert(campos)
  const { error } = await consulta
  if (error) throw error
}

export async function cambiarDisponibilidadPlato(id, disponible) {
  const { error } = await supabase.from('platos').update({ disponible }).eq('id', id)
  if (error) throw error
}

export async function borrarPlato(id) {
  const { error } = await supabase.from('platos').delete().eq('id', id)
  if (error) throw error
}
