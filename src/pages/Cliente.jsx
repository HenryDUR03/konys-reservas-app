// Página principal del cliente: hero, mesas, carta, pie de página y ventana de reserva.
import { useState } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import MesaCard from '../components/MesaCard'
import Carta from '../components/Carta'
import Footer from '../components/Footer'
import ReservaModal from '../components/ReservaModal'
import { useMesas } from '../hooks/useMesas'

export default function Cliente() {
  const { datos: mesas, cargando, error } = useMesas()
  // Mesa elegida para reservar (null = ventana cerrada)
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null)

  return (
    <>
      <Header />
      <main>
        <Hero />

        <section id="mesas" className="seccion">
          <div className="contenedor">
            <h2>Nuestras mesas</h2>
            <p className="seccion__intro">Elige la mesa que prefieras y mira los horarios libres.</p>

            {cargando && <p className="aviso">Cargando las mesas...</p>}
            {error && (
              <p className="aviso aviso--error">
                No pudimos cargar las mesas. Revisa tu conexión e inténtalo de nuevo.
              </p>
            )}
            {!cargando && !error && mesas.length === 0 && (
              <p className="aviso">
                Hoy no hay mesas disponibles para reservar. Escríbenos por WhatsApp o Instagram.
              </p>
            )}

            <div className="mesas">
              {mesas.map((m) => (
                <MesaCard key={m.id} mesa={m} onVerHorarios={setMesaSeleccionada} />
              ))}
            </div>
          </div>
        </section>

        <Carta />
      </main>
      <Footer />

      {mesaSeleccionada && (
        <ReservaModal mesa={mesaSeleccionada} onCerrar={() => setMesaSeleccionada(null)} />
      )}
    </>
  )
}
