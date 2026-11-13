// Gestión de la carta: agregar, editar, ocultar y eliminar platos (RF-14).
import { useEffect, useState } from 'react'
import PlatoForm from './PlatoForm'
import {
  listarPlatos,
  guardarPlato,
  cambiarDisponibilidadPlato,
  borrarPlato,
} from '../../services/admin'

const NOMBRE_CATEGORIA = { pizzas: 'Pizzas', entradas: 'Entradas', postres: 'Postres', bebidas: 'Bebidas' }
const pesos = (valor) => `$${Number(valor).toLocaleString('es-CO')}`

export default function AdminCarta() {
  const [platos, setPlatos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  // null = cerrado, {} = plato nuevo, objeto con id = editar
  const [formulario, setFormulario] = useState(null)

  async function cargar() {
    try {
      setPlatos(await listarPlatos())
      setError('')
    } catch {
      setError('No se pudo cargar la carta.')
    }
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  async function guardar(plato) {
    await guardarPlato(plato)
    setFormulario(null)
    cargar()
  }

  async function alternar(plato) {
    try {
      await cambiarDisponibilidadPlato(plato.id, !plato.disponible)
      cargar()
    } catch {
      setError('No se pudo cambiar la disponibilidad del plato.')
    }
  }

  async function borrar(plato) {
    if (!window.confirm(`¿Eliminar "${plato.nombre}" de la carta? Si solo quieres ocultarlo, desactiva «Disponible».`)) return
    try {
      await borrarPlato(plato.id)
      cargar()
    } catch {
      setError('No se pudo eliminar el plato.')
    }
  }

  return (
    <section>
      <div className="adm-titulo">
        <h2>Carta</h2>
        <button className="boton boton--acento" onClick={() => setFormulario({})}>
          + Nuevo plato
        </button>
      </div>

      {cargando && <p>Cargando la carta...</p>}
      {error && <p className="adm-error">{error}</p>}
      {!cargando && !error && platos.length === 0 && <p>Todavía no hay platos en la carta.</p>}

      {platos.length > 0 && (
        <div className="adm-tabla">
          <table>
            <thead>
              <tr>
                <th>Plato</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {platos.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.nombre}
                    {p.descripcion && <small className="adm-contacto">{p.descripcion}</small>}
                  </td>
                  <td>{NOMBRE_CATEGORIA[p.categoria]}</td>
                  <td>{pesos(p.precio)}</td>
                  <td>
                    <button
                      role="switch"
                      aria-checked={p.disponible}
                      className={`adm-switch ${p.disponible ? 'adm-switch--on' : ''}`}
                      onClick={() => alternar(p)}
                    >
                      <span />
                    </button>
                    <small>{p.disponible ? ' Visible' : ' Oculto'}</small>
                  </td>
                  <td>
                    <div className="adm-acciones">
                      <button className="adm-mini" onClick={() => setFormulario(p)}>
                        Editar
                      </button>
                      <button className="adm-mini adm-mini--peligro" onClick={() => borrar(p)}>
                        Eliminar
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
        <PlatoForm
          plato={formulario.id ? formulario : null}
          onGuardar={guardar}
          onCancelar={() => setFormulario(null)}
        />
      )}
    </section>
  )
}
