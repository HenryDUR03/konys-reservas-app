// Panel de administración (/admin): acceso con contraseña y menú lateral.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLogin from '../components/admin/AdminLogin'
import AdminMesas from '../components/admin/AdminMesas'
import AdminHorarios from '../components/admin/AdminHorarios'
import AdminReservas from '../components/admin/AdminReservas'
import AdminCarta from '../components/admin/AdminCarta'
import '../styles/admin.css'
import '../styles/admin-extra.css'

const SECCIONES = ['Mesas', 'Horarios', 'Reservas', 'Carta']
const CLAVE_SESION = 'konys_admin'

export default function Admin() {
  // La sesión se guarda solo mientras la pestaña esté abierta
  const [autenticado, setAutenticado] = useState(() => sessionStorage.getItem(CLAVE_SESION) === 'si')
  const [seccion, setSeccion] = useState('Mesas')

  function entrar() {
    sessionStorage.setItem(CLAVE_SESION, 'si')
    setAutenticado(true)
  }

  function salir() {
    sessionStorage.removeItem(CLAVE_SESION)
    setAutenticado(false)
  }

  if (!autenticado) return <AdminLogin onEntrar={entrar} />

  return (
    <div className="adm">
      <aside className="adm-lateral">
        <strong className="adm-marca">Konys - Admin</strong>
        <nav>
          {SECCIONES.map((s) => (
            <button
              key={s}
              className={seccion === s ? 'adm-nav adm-nav--activo' : 'adm-nav'}
              onClick={() => setSeccion(s)}
            >
              {s}
            </button>
          ))}
        </nav>
        <div className="adm-pie">
          <Link to="/">Ver el sitio</Link>
          <button className="adm-nav" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="adm-contenido">
        {seccion === 'Mesas' && <AdminMesas />}
        {seccion === 'Horarios' && <AdminHorarios />}
        {seccion === 'Reservas' && <AdminReservas />}
        {seccion === 'Carta' && <AdminCarta />}
      </main>
    </div>
  )
}
