// Carta digital en modo lectura, agrupada por categoría (RF-07).
import { usePlatos } from '../hooks/usePlatos'

const CATEGORIAS = [
  { clave: 'pizzas', titulo: 'Pizzas' },
  { clave: 'entradas', titulo: 'Entradas' },
  { clave: 'postres', titulo: 'Postres' },
  { clave: 'bebidas', titulo: 'Bebidas' },
]

// 42000 -> $42.000
const pesos = (valor) => `$${Number(valor).toLocaleString('es-CO')}`

export default function Carta() {
  const { datos, cargando, error } = usePlatos()

  return (
    <section id="carta" className="seccion seccion--clara">
      <div className="contenedor">
        <h2>Nuestra carta</h2>

        {cargando && <p className="aviso">Cargando la carta...</p>}
        {error && (
          <p className="aviso aviso--error">
            No pudimos cargar la carta. Revisa tu conexión e inténtalo de nuevo.
          </p>
        )}
        {!cargando && !error && datos.length === 0 && (
          <p className="aviso">La carta se está actualizando. Vuelve en un momento.</p>
        )}

        <div className="carta">
          {CATEGORIAS.map((cat) => {
            const platos = datos.filter((p) => p.categoria === cat.clave)
            if (platos.length === 0) return null
            return (
              <div key={cat.clave} className="carta__grupo">
                <h3>{cat.titulo}</h3>
                <ul>
                  {platos.map((p) => (
                    <li key={p.id} className="plato">
                      <div className="plato__linea">
                        <span className="plato__nombre">{p.nombre}</span>
                        <span className="plato__puntos" aria-hidden="true" />
                        <span className="plato__precio">{pesos(p.precio)}</span>
                      </div>
                      {p.descripcion && <p className="plato__desc">{p.descripcion}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
