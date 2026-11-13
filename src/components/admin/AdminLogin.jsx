// Pantalla de acceso al panel (RF-08). La contraseña se compara con VITE_ADMIN_PASSWORD.
// Es una protección básica del front-end; en un sistema real se usaría autenticación de verdad.
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminLogin({ onEntrar }) {
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')

  function enviar(e) {
    e.preventDefault()
    const correcta = import.meta.env.VITE_ADMIN_PASSWORD
    if (!correcta) {
      setError('Falta configurar VITE_ADMIN_PASSWORD en el archivo .env.')
      return
    }
    if (clave === correcta) onEntrar()
    else setError('Contraseña incorrecta. Inténtalo de nuevo.')
  }

  return (
    <div className="adm-login">
      <form className="adm-login__caja" onSubmit={enviar}>
        <h1>Panel de administración</h1>
        <p>Konys Pizza</p>
        <label>
          Contraseña
          <input
            type="password"
            value={clave}
            autoFocus
            onChange={(e) => setClave(e.target.value)}
          />
        </label>
        {error && <p className="adm-error">{error}</p>}
        <button type="submit" className="boton boton--acento">
          Ingresar
        </button>
        <Link to="/" className="adm-volver">
          Volver al sitio
        </Link>
      </form>
    </div>
  )
}
