// Selector de fecha: muestra los próximos 14 días. Solo se pueden elegir los días de atención (RF-03).
import { DIAS, fechaISO } from '../services/tiempo'

export default function DiaSelector({ horarios, valor, onCambio }) {
  const hoy = new Date()
  const dias = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i)
    return {
      iso: fechaISO(d),
      semana: d.toLocaleDateString('es-CO', { weekday: 'short' }),
      numero: d.getDate(),
      mes: d.toLocaleDateString('es-CO', { month: 'short' }),
      habilitado: horarios.some((h) => h.dia_semana === DIAS[d.getDay()]),
    }
  })

  if (!dias.some((d) => d.habilitado)) {
    return <p className="aviso">Por ahora no hay días disponibles para reservar.</p>
  }

  return (
    <div className="dias">
      {dias.map((d) => (
        <button
          key={d.iso}
          type="button"
          disabled={!d.habilitado}
          className={`dia ${valor === d.iso ? 'dia--activo' : ''}`}
          onClick={() => onCambio(d.iso)}
        >
          <span>{d.semana}</span>
          <strong>{d.numero}</strong>
          <span>{d.mes}</span>
        </button>
      ))}
    </div>
  )
}
