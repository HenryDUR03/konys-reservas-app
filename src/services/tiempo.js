// Funciones auxiliares para fechas y horas (no usan Supabase).

// Nombres de los días, iguales a los guardados en la tabla horarios (sin tildes).
export const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

// Date -> '2026-11-15' (usando la hora local, no UTC)
export const fechaISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// '2026-11-15' -> Date a las 00:00 locales
export const aFecha = (iso) => new Date(`${iso}T00:00:00`)

// '19:30' o '19:30:00' -> 1170 (minutos desde medianoche)
export const aMinutos = (hora) => {
  const [h, m] = hora.split(':')
  return Number(h) * 60 + Number(m)
}

// 1170 -> '19:30'
export const aHora = (min) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

// '2026-11-15' -> 'domingo 15 de noviembre de 2026'
export const etiquetaFecha = (iso) =>
  aFecha(iso).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

// Convierte los horarios de un día (almuerzo, noche) en bloques: [{ inicio: '12:30', fin: '13:30' }, ...]
export function generarSlots(horariosDelDia) {
  const slots = []
  horariosDelDia.forEach((h) => {
    const duracion = h.duracion_slot
    const fin = aMinutos(h.hora_fin)
    for (let ini = aMinutos(h.hora_inicio); ini + duracion <= fin; ini += duracion) {
      slots.push({ inicio: aHora(ini), fin: aHora(ini + duracion) })
    }
  })
  return slots.sort((a, b) => a.inicio.localeCompare(b.inicio))
}
