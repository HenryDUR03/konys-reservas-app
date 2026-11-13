// Grilla de horas: libres, ocupadas y la seleccionada (RF-04).
import { aMinutos, fechaISO } from '../services/tiempo'

export default function SlotGrid({ slots, ocupados, fecha, seleccionado, onSeleccionar }) {
  const ahora = new Date()
  const esHoy = fecha === fechaISO(ahora)
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes()

  if (slots.length === 0) {
    return <p className="aviso">No hay horarios para este día.</p>
  }

  return (
    <>
      <div className="slots">
        {slots.map((s) => {
          const ocupado = ocupados.includes(s.inicio)
          const pasado = esHoy && aMinutos(s.inicio) <= minutosAhora
          const activo = seleccionado?.inicio === s.inicio
          return (
            <button
              key={s.inicio}
              type="button"
              disabled={ocupado || pasado}
              className={`slot ${ocupado || pasado ? 'slot--ocupado' : ''} ${activo ? 'slot--activo' : ''}`}
              onClick={() => onSeleccionar(s)}
              title={ocupado ? 'Ocupado' : pasado ? 'Ya pasó' : 'Libre'}
            >
              {s.inicio}
            </button>
          )
        })}
      </div>
      <p className="leyenda">
        <i className="leyenda__libre" /> Libre <i className="leyenda__ocupado" /> Ocupado{' '}
        <i className="leyenda__activo" /> Seleccionado
      </p>
    </>
  )
}
