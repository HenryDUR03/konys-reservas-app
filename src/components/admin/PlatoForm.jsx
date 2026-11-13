// Formulario para agregar o editar un plato de la carta (RF-14).
import { useState } from 'react'

export default function PlatoForm({ plato, onGuardar, onCancelar }) {
  const [v, setV] = useState({
    nombre: plato?.nombre ?? '',
    categoria: plato?.categoria ?? 'pizzas',
    descripcion: plato?.descripcion ?? '',
    precio: plato?.precio ?? '',
    disponible: plato?.disponible ?? true,
  })
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const cambiar = (campo, valor) => setV({ ...v, [campo]: valor })

  async function enviar(e) {
    e.preventDefault()
    const errs = {}
    const precio = Number(v.precio)
    if (!v.nombre.trim()) errs.nombre = 'Escribe el nombre del plato.'
    if (v.precio === '' || !Number.isInteger(precio) || precio < 0)
      errs.precio = 'El precio debe ser un número entero en pesos.'
    setErrores(errs)
    if (Object.keys(errs).length > 0) return

    setGuardando(true)
    try {
      await onGuardar({
        ...(plato?.id ? { id: plato.id } : {}),
        nombre: v.nombre.trim(),
        categoria: v.categoria,
        descripcion: v.descripcion.trim() || null,
        precio,
        disponible: v.disponible,
      })
    } catch {
      setMensaje('No se pudo guardar el plato. Inténtalo de nuevo.')
      setGuardando(false)
    }
  }

  return (
    <div className="adm-modal" onClick={onCancelar}>
      <form className="adm-modal__caja" onSubmit={enviar} noValidate onClick={(e) => e.stopPropagation()}>
        <h2>{plato ? 'Editar plato' : 'Nuevo plato'}</h2>

        <label>
          Nombre
          <input type="text" value={v.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
          {errores.nombre && <small className="adm-error">{errores.nombre}</small>}
        </label>

        <label>
          Categoría
          <select value={v.categoria} onChange={(e) => cambiar('categoria', e.target.value)}>
            <option value="pizzas">Pizzas</option>
            <option value="entradas">Entradas</option>
            <option value="postres">Postres</option>
            <option value="bebidas">Bebidas</option>
          </select>
        </label>

        <label>
          Descripción
          <textarea rows="3" value={v.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} />
        </label>

        <label>
          Precio (COP)
          <input type="number" min="0" step="500" value={v.precio} onChange={(e) => cambiar('precio', e.target.value)} />
          {errores.precio && <small className="adm-error">{errores.precio}</small>}
        </label>

        <label className="adm-check">
          <input type="checkbox" checked={v.disponible} onChange={(e) => cambiar('disponible', e.target.checked)} />
          Disponible (visible en la carta)
        </label>

        {mensaje && <p className="adm-error">{mensaje}</p>}

        <div className="adm-acciones">
          <button type="button" className="boton boton--borde" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="boton boton--acento" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}
