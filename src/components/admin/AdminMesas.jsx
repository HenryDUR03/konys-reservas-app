// Gestión de mesas: listado, alta, edición, borrado y activar/inactivar (RF-09, RF-10, RF-13).
import { useEffect, useState } from 'react'
import MesaForm from './MesaForm'
import { listarMesas, guardarMesa, cambiarEstadoMesa, borrarMesa } from '../../services/admin'

export default function AdminMesas() {
  const [mesas, setMesas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  // null = formulario cerrado, {} = mesa nueva, objeto con id = editar
  const [formulario, setFormulario] = useState(null)

  async function cargar() {
    try {
      setMesas(await listarMesas())
      setError('')
    } catch {
      setError('No se pudieron cargar las mesas.')
    }
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  async function guardar(mesa) {
    await guardarMesa(mesa)
    setFormulario(null)
    cargar()
  }

  async function alternar(mesa) {
    try {
      await cambiarEstadoMesa(mesa.id, !mesa.activa)
      cargar()
    } catch {
      setError('No se pudo cambiar el estado de la mesa.')
    }
  }

  async function borrar(mesa) {
    const seguro = window.confirm(
      `¿Borrar ${mesa.nombre}? También se borrarán sus reservas. Si solo quieres ocultarla, desactívala.`
    )
    if (!seguro) return
    try {
      await borrarMesa(mesa.id)
      cargar()
    } catch {
      setError('No se pudo borrar la mesa.')
    }
  }

  return (
    <section>
      <div className="adm-titulo">
        <h2>Mesas</h2>
        <button className="boton boton--acento" onClick={() => setFormulario({})}>
          + Nueva mesa
        </button>
      </div>

      {cargando && <p>Cargando mesas...</p>}
      {error && <p className="adm-error">{error}</p>}
      {!cargando && !error && mesas.length === 0 && <p>Todavía no hay mesas registradas.</p>}

      {mesas.length > 0 && (
        <div className="adm-tabla">
          <table>
            <thead>
              <tr>
                <th>Mesa</th>
                <th>Zona</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map((m) => (
                <tr key={m.id}>
                  <td>{m.nombre}</td>
                  <td>{m.zona === 'terraza' ? 'Terraza' : 'Salón'}</td>
                  <td>{m.capacidad} personas</td>
                  <td>
                    <button
                      role="switch"
                      aria-checked={m.activa}
                      className={`adm-switch ${m.activa ? 'adm-switch--on' : ''}`}
                      onClick={() => alternar(m)}
                    >
                      <span />
                    </button>
                    <small>{m.activa ? ' Activa' : ' Inactiva'}</small>
                  </td>
                  <td>
                    <div className="adm-acciones">
                      <button className="adm-mini" onClick={() => setFormulario(m)}>
                        Editar
                      </button>
                      <button className="adm-mini adm-mini--peligro" onClick={() => borrar(m)}>
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formulario && (
        <MesaForm
          mesa={formulario.id ? formulario : null}
          onGuardar={guardar}
          onCancelar={() => setFormulario(null)}
        />
      )}
    </section>
  )
}
