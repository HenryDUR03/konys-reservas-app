// Ventana de reserva: 1) fecha, 2) hora, 3) datos. Al terminar muestra la confirmación.
import { useEffect, useState } from 'react'
import DiaSelector from './DiaSelector'
import SlotGrid from './SlotGrid'
import ReservaForm from './ReservaForm'
import Confirmacion from './Confirmacion'
import { useHorarios } from '../hooks/useHorarios'
import { obtenerOcupados, crearReserva } from '../services/reservas'
import { DIAS, aFecha, generarSlots } from '../services/tiempo'
import '../styles/reserva.css'

export default function ReservaModal({ mesa, onCerrar }) {
  const { datos: horarios, cargando, error } = useHorarios()
  const [fecha, setFecha] = useState(null)
  const [ocupados, setOcupados] = useState([])
  const [cargandoSlots, setCargandoSlots] = useState(false)
  const [hora, setHora] = useState(null)
  const [valores, setValores] = useState({ nombre: '', personas: '', contacto: '' })
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [reserva, setReserva] = useState(null)

  // Cerrar con Escape y bloquear el scroll de la página de fondo
  useEffect(() => {
    const alTeclear = (e) => e.key === 'Escape' && onCerrar()
    document.addEventListener('keydown', alTeclear)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.body.style.overflow = ''
    }
  }, [onCerrar])

  // Cada vez que cambia la fecha, consulta qué horas ya están ocupadas
  useEffect(() => {
    if (!fecha) return
    let activo = true
    setHora(null)
    setCargandoSlots(true)
    obtenerOcupados(mesa.id, fecha)
      .then((o) => activo && setOcupados(o))
      .catch(() => activo && setMensaje('No pudimos consultar los horarios. Inténtalo de nuevo.'))
      .finally(() => activo && setCargandoSlots(false))
    return () => {
      activo = false
    }
  }, [fecha, mesa.id])

  const horariosDelDia = fecha
    ? horarios.filter((h) => h.dia_semana === DIAS[aFecha(fecha).getDay()])
    : []
  const slots = generarSlots(horariosDelDia)

  function cambiarCampo(campo, valor) {
    setValores({ ...valores, [campo]: valor })
  }

  async function confirmar(e) {
    e.preventDefault()
    setMensaje('')

    if (!fecha || !hora) {
      setMensaje('Elige una fecha y una hora antes de confirmar.')
      return
    }

    // Validaciones del formulario
    const errs = {}
    const personas = Number(valores.personas)
    if (!valores.nombre.trim()) errs.nombre = 'Escribe tu nombre.'
    if (!Number.isInteger(personas) || personas < 1) errs.personas = 'Indica cuántas personas van.'
    else if (personas > mesa.capacidad)
      errs.personas = `Esta mesa admite máximo ${mesa.capacidad} personas.`
    setErrores(errs)
    if (Object.keys(errs).length > 0) return

    setEnviando(true)
    const resultado = await crearReserva({
      mesa_id: mesa.id,
      cliente_nombre: valores.nombre.trim(),
      cliente_contacto: valores.contacto.trim() || null,
      num_personas: personas,
      fecha,
      hora_inicio: hora.inicio,
      hora_fin: hora.fin,
    })
    setEnviando(false)

    if (resultado.ok) {
      setReserva(resultado.reserva)
    } else if (resultado.motivo === 'ocupado') {
      // Otro cliente se adelantó: refrescamos las horas y pedimos elegir otra
      setMensaje('Ese horario acaba de ser reservado. Elige otra hora.')
      setHora(null)
      obtenerOcupados(mesa.id, fecha).then(setOcupados)
    } else {
      setMensaje('No pudimos guardar tu reserva. Inténtalo de nuevo en un momento.')
    }
  }

  return (
    <div className="modal" onClick={onCerrar}>
      <div
        className="modal__caja"
        role="dialog"
        aria-modal="true"
        aria-label={`Reservar ${mesa.nombre}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__cabecera">
          <h2>
            Reservar {mesa.nombre} ({mesa.zona === 'terraza' ? 'Terraza' : 'Salón'}, {mesa.capacidad} personas)
          </h2>
          <button className="modal__cerrar" onClick={onCerrar} aria-label="Cerrar">
            ×
          </button>
        </div>

        {reserva ? (
          <Confirmacion reserva={reserva} mesa={mesa} onCerrar={onCerrar} />
        ) : cargando ? (
          <p className="aviso">Cargando horarios...</p>
        ) : error ? (
          <p className="aviso aviso--error">No pudimos cargar los horarios. Revisa tu conexión.</p>
        ) : (
          <div className="modal__cuerpo">
            <div>
              <h3>1. Elige la fecha</h3>
              <DiaSelector horarios={horarios} valor={fecha} onCambio={setFecha} />

              <h3>2. Elige la hora</h3>
              {!fecha && <p className="aviso">Primero elige una fecha.</p>}
              {fecha && cargandoSlots && <p className="aviso">Buscando horas libres...</p>}
              {fecha && !cargandoSlots && (
                <SlotGrid
                  slots={slots}
                  ocupados={ocupados}
                  fecha={fecha}
                  seleccionado={hora}
                  onSeleccionar={setHora}
                />
              )}
            </div>

            <ReservaForm
              mesa={mesa}
              fecha={fecha}
              hora={hora}
              valores={valores}
              errores={errores}
              enviando={enviando}
              mensaje={mensaje}
              onCambio={cambiarCampo}
              onEnviar={confirmar}
            />
          </div>
        )}
      </div>
    </div>
  )
}
