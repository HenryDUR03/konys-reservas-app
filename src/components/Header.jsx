// Encabezado fijo con menú. En móvil el menú se abre con el botón de hamburguesa.
import { useState } from 'react'
import { Link } from 'react-router-dom'

const ENLACES = [
  { texto: 'Inicio', destino: '#inicio' },
  { texto: 'Mesas', destino: '#mesas' },
  { texto: 'Carta', destino: '#carta' },
  { texto: 'Reservar', destino: '#mesas' },
  { texto: 'Contacto', destino: '#contacto' },
]

export default function Header() {
  const [abierto, setAbierto] = useState(false)

  return (
    <header className="header">
      <div className="header__barra contenedor">
        <a href="#inicio" className="header__marca">
          Konys Pizza
        </a>

        <button
          className="header__boton"
          aria-label="Abrir o cerrar el menú"
          aria-expanded={abierto}
          onClick={() => setAbierto(!abierto)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`header__menu ${abierto ? 'header__menu--abierto' : ''}`}>
          {ENLACES.map((e) => (
            <a key={e.texto} href={e.destino} onClick={() => setAbierto(false)}>
              {e.texto}
            </a>
          ))}
          <Link to="/admin" className="header__admin">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
