// Formulario para crear o editar una mesa (RF-09).
import { useState } from 'react'

export default function MesaForm({ mesa, onGuardar, onCancelar }) {
  const [v, setV] = useState({
    nombre: mesa?.nombre ?? '',
    zona: mesa?.zona ?? 'salon',
    capacidad: mesa?.capacidad ?? '',
    foto_url: mesa?.foto_url ?? '',
  })
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const cambiar = (campo, valor) => setV({ ...v, [campo]: valor })

  async function enviar(e) {
    e.preventDefault()
    const errs = {}
    const capacidad = Number(v.capacidad)
    if (!v.nombre.trim()) errs.nombre = 'Escribe el nombre o número de la mesa.'
    if (!Number.isInteger(capacidad) || capacidad < 1) errs.capacidad = 'La capacidad debe ser un número mayor a 0.'
    setErrores(errs)
    if (Object.keys(errs).length > 0) return

    setGuardando(true)
    try {
      await onGuardar({
        ...(mesa?.id ? { id: mesa.id } : {}),
        nombre: v.nombre.trim(),
        zona: v.zona,
        capacidad,
        foto_url: v.foto_url.trim() || null,
      })
    } catch {
      setMensaje('No se pudo guardar la mesa. Inténtalo de nuevo.')
      setGuardando(false)
    }
  }

  return (
    <div className="adm-modal" onClick={onCancelar}>
      <form className="adm-modal__caja" onSubmit={enviar} noValidate onClick={(e) => e.stopPropagation()}>
        <h2>{mesa ? 'Editar mesa' : 'Nueva mesa'}</h2>

        <label>
          Nombre o número
          <input type="text" value={v.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
          {errores.nombre && <small className="adm-error">{errores.nombre}</small>}
        </label>

        <label>
          Zona
          <select value={v.zona} onChange={(e) => cambiar('zona', e.target.value)}>
            <option value="terraza">Terraza</option>
            <option value="salon">Salón</option>
          </select>
        </label>

        <label>
          Capacidad (personas)
          <input type="number" min="1" value={v.capacidad} onChange={(e) => cambiar('capacidad', e.target.value)} />
          {errores.capacidad && <small className="adm-error">{errores.capacidad}</small>}
        </label>

        <label>
          Foto (enlace, opcional)
          <input type="url" value={v.foto_url} onChange={(e) => cambiar('foto_url', e.target.value)} />
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
