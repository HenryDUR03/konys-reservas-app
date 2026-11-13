// Gestión de horarios por día y jornada (RF-11). Las franjas del cliente salen de esta tabla.
import { useEffect, useState } from 'react'
import { listarHorarios, guardarHorario } from '../../services/admin'
import { aMinutos } from '../../services/tiempo'

const ORDEN_DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const NOMBRE_DIA = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves',
  viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo',
}

// Una fila editable con su propio botón Guardar
function FilaHorario({ horario, onGuardar }) {
  const [v, setV] = useState({
    hora_inicio: horario.hora_inicio.slice(0, 5),
    hora_fin: horario.hora_fin.slice(0, 5),
    duracion_slot: horario.duracion_slot,
    activo: horario.activo,
  })
  const [mensaje, setMensaje] = useState('')

  async function guardar() {
    const duracion = Number(v.duracion_slot)
    if (!v.hora_inicio || !v.hora_fin || v.hora_fin <= v.hora_inicio) {
      setMensaje('El cierre debe ser después de la apertura.')
      return
    }
    if (!Number.isInteger(duracion) || duracion < 15) {
      setMensaje('La duración mínima es 15 minutos.')
      return
    }
    if (duracion > aMinutos(v.hora_fin) - aMinutos(v.hora_inicio)) {
      setMensaje('La duración no cabe en la jornada.')
      return
    }
    try {
      await onGuardar(horario.id, { ...v, duracion_slot: duracion })
      setMensaje('Guardado')
    } catch {
      setMensaje('No se pudo guardar.')
    }
  }

  const cambiar = (campo, valor) => {
    setV({ ...v, [campo]: valor })
    setMensaje('')
  }

  return (
    <tr>
      <td>{NOMBRE_DIA[horario.dia_semana]}</td>
      <td>{horario.jornada === 'almuerzo' ? 'Almuerzo' : 'Noche'}</td>
      <td>
        <input type="time" value={v.hora_inicio} onChange={(e) => cambiar('hora_inicio', e.target.value)} />
      </td>
      <td>
        <input type="time" value={v.hora_fin} onChange={(e) => cambiar('hora_fin', e.target.value)} />
      </td>
      <td>
        <input
          type="number"
          min="15"
          step="15"
          value={v.duracion_slot}
          onChange={(e) => cambiar('duracion_slot', e.target.value)}
          className="adm-num"
        />
      </td>
      <td>
        <input type="checkbox" checked={v.activo} onChange={(e) => cambiar('activo', e.target.checked)} />
      </td>
      <td>
        <button className="adm-mini" onClick={guardar}>
          Guardar
        </button>
        {mensaje && (
          <small className={mensaje === 'Guardado' ? 'adm-ok' : 'adm-error'}> {mensaje}</small>
        )}
      </td>
    </tr>
  )
}

export default function AdminHorarios() {
  const [horarios, setHorarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listarHorarios()
      .then((h) =>
        setHorarios(
          h.sort(
            (a, b) =>
              ORDEN_DIAS.indexOf(a.dia_semana) - ORDEN_DIAS.indexOf(b.dia_semana) ||
              a.jornada.localeCompare(b.jornada)
          )
        )
      )
      .catch(() => setError('No se pudieron cargar los horarios.'))
      .finally(() => setCargando(false))
  }, [])

  return (
    <section>
      <div className="adm-titulo">
        <h2>Horarios de atención</h2>
      </div>
      <p className="adm-ayuda">
        Cada día tiene dos jornadas. La duración define el largo de cada reserva. Desmarca «Activo» para
        cerrar una jornada.
      </p>

      {cargando && <p>Cargando horarios...</p>}
      {error && <p className="adm-error">{error}</p>}

      {horarios.length > 0 && (
        <div className="adm-tabla">
          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Jornada</th>
                <th>Apertura</th>
                <th>Cierre</th>
                <th>Duración (min)</th>
                <th>Activo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((h) => (
                <FilaHorario key={h.id} horario={h} onGuardar={guardarHorario} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
