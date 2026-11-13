// Comprobante que se muestra al terminar la reserva (RF-06).
import { etiquetaFecha } from '../services/tiempo'

export default function Confirmacion({ reserva, mesa, onCerrar }) {
  return (
    <div className="confirmacion">
      <div className="confirmacion__sello" aria-hidden="true">OK</div>
      <h3>¡Reserva confirmada!</h3>
      <p className="confirmacion__nota">Toma una captura de esta pantalla como comprobante.</p>
      <dl>
        <dt>Nombre</dt>
        <dd>{reserva.cliente_nombre}</dd>
        <dt>Mesa</dt>
        <dd>
          {mesa.nombre} ({mesa.zona === 'terraza' ? 'Terraza' : 'Salón'})
        </dd>
        <dt>Fecha</dt>
        <dd>{etiquetaFecha(reserva.fecha)}</dd>
        <dt>Hora</dt>
        <dd>
          {reserva.hora_inicio.slice(0, 5)} a {reserva.hora_fin.slice(0, 5)}
        </dd>
        <dt>Personas</dt>
        <dd>{reserva.num_personas}</dd>
      </dl>
      <button className="boton boton--acento" onClick={onCerrar}>
        Volver al inicio
      </button>
    </div>
  )
}
