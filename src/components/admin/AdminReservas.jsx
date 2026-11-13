// Lista de reservas con filtros por fecha y por mesa (RF-12). También permite cambiar su estado.
import { useEffect, useState } from 'react'
import { listarReservas, listarMesas, cambiarEstadoReserva } from '../../services/admin'
import { fechaISO } from '../../services/tiempo'

// '2026-11-15' -> '15/11/2026'
const verFecha = (iso) => iso.split('-').reverse().join('/')

export default function AdminReservas() {
  const [reservas, setReservas] = useState([])
  const [mesas, setMesas] = useState([])
  const [fecha, setFecha] = useState('')
  const [mesaId, setMesaId] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  // Se incrementa para volver a consultar después de un cambio
  const [version, setVersion] = useState(0)

  // Lista de mesas para el filtro
  useEffect(() => {
    listarMesas().then(setMesas).catch(() => {})
  }, [])

  // Consulta las reservas cada vez que cambia un filtro
  useEffect(() => {
    let activo = true
    setCargando(true)
    listarReservas({ fecha, mesaId })
      .then((datos) => {
        if (!activo) return
        setReservas(datos)
        setError('')
      })
      .catch(() => activo && setError('No se pudieron cargar las reservas.'))
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
    }
  }, [fecha, mesaId, version])

  async function cambiarEstado(reserva, estado) {
    setAviso('')
    try {
      await cambiarEstadoReserva(reserva.id, estado)
    } catch (e) {
      // 23505: el horario ya lo tomó otro cliente (no se puede reactivar)
      setAviso(
        e.code === '23505'
          ? 'No se puede reactivar: ese horario ya fue reservado por otro cliente.'
          : 'No se pudo cambiar el estado de la reserva.'
      )
    }
    setVersion((v) => v + 1)
  }

  return (
    <section>
      <div className="adm-titulo">
        <h2>Reservas</h2>
      </div>

      <div className="adm-filtros">
        <label>
          Fecha
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
        <label>
          Mesa
          <select value={mesaId} onChange={(e) => setMesaId(e.target.value)}>
            <option value="">Todas</option>
            {mesas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </label>
        <button className="adm-mini" onClick={() => setFecha(fechaISO(new Date()))}>
          Hoy
        </button>
        <button className="adm-mini" onClick={() => { setFecha(''); setMesaId('') }}>
          Quitar filtros
        </button>
      </div>

      {aviso && <p className="adm-error">{aviso}</p>}
      {error && <p className="adm-error">{error}</p>}
      {cargando && <p>Cargando reservas...</p>}
      {!cargando && !error && reservas.length === 0 && <p>No hay reservas con esos filtros.</p>}

      {reservas.length > 0 && (
        <>
          <div className="adm-tabla">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Mesa</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Personas</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.cliente_nombre}
                      {r.cliente_contacto && <small className="adm-contacto">{r.cliente_contacto}</small>}
                    </td>
                    <td>{r.mesas?.nombre ?? '-'}</td>
                    <td>{verFecha(r.fecha)}</td>
                    <td>{r.hora_inicio.slice(0, 5)}</td>
                    <td>{r.num_personas}</td>
                    <td>
                      <select
                        className={`adm-estado adm-estado--${r.estado}`}
                        value={r.estado}
                        onChange={(e) => cambiarEstado(r, e.target.value)}
                      >
                        <option value="confirmada">Confirmada</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="completada">Completada</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="adm-cuenta">Mostrando {reservas.length} reservas</p>
        </>
      )}
    </section>
  )
}
