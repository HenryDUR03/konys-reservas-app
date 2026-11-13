// Formulario con los datos del cliente y el resumen de la reserva (RF-05).
import { etiquetaFecha } from '../services/tiempo'

export default function ReservaForm({ mesa, fecha, hora, valores, errores, enviando, mensaje, onCambio, onEnviar }) {
  return (
    <form className="form" onSubmit={onEnviar} noValidate>
      <h3>3. Tus datos</h3>

      <label>
        Nombre completo
        <input
          type="text"
          value={valores.nombre}
          onChange={(e) => onCambio('nombre', e.target.value)}
        />
        {errores.nombre && <small className="error">{errores.nombre}</small>}
      </label>

      <label>
        Número de personas (máximo {mesa.capacidad})
        <input
          type="number"
          min="1"
          max={mesa.capacidad}
          value={valores.personas}
          onChange={(e) => onCambio('personas', e.target.value)}
        />
        {errores.personas && <small className="error">{errores.personas}</small>}
      </label>

      <label>
        Teléfono o WhatsApp (opcional)
        <input
          type="tel"
          value={valores.contacto}
          onChange={(e) => onCambio('contacto', e.target.value)}
        />
      </label>

      <div className="resumen">
        <strong>Resumen</strong>
        <p>
          {mesa.nombre} ({mesa.zona === 'terraza' ? 'Terraza' : 'Salón'})
        </p>
        <p>{fecha ? etiquetaFecha(fecha) : 'Fecha: sin elegir'}</p>
        <p>{hora ? `Hora: ${hora.inicio} a ${hora.fin}` : 'Hora: sin elegir'}</p>
      </div>

      {mensaje && <p className="error error--bloque">{mensaje}</p>}

      <button type="submit" className="boton boton--acento" disabled={enviando}>
        {enviando ? 'Reservando...' : 'Confirmar reserva'}
      </button>
    </form>
  )
}
