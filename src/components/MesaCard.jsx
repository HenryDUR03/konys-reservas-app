// Tarjeta de una mesa. Si no tiene foto, dibuja la mesa con tantas sillas como su capacidad.
function DibujoMesa({ capacidad }) {
  const sillas = Math.min(capacidad, 10)
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={`Mesa para ${capacidad} personas`}>
      <circle cx="60" cy="60" r="26" className="dibujo__mesa" />
      {Array.from({ length: sillas }).map((_, i) => {
        const ang = (2 * Math.PI * i) / sillas - Math.PI / 2
        return (
          <circle
            key={i}
            cx={60 + 44 * Math.cos(ang)}
            cy={60 + 44 * Math.sin(ang)}
            r="7"
            className="dibujo__silla"
          />
        )
      })}
    </svg>
  )
}

export default function MesaCard({ mesa, onVerHorarios }) {
  const zona = mesa.zona === 'terraza' ? 'Terraza' : 'Salón'

  return (
    <article className="mesa">
      <div className="mesa__imagen">
        {mesa.foto_url ? (
          <img src={mesa.foto_url} alt={mesa.nombre} />
        ) : (
          <DibujoMesa capacidad={mesa.capacidad} />
        )}
      </div>
      <div className="mesa__info">
        <h3>{mesa.nombre}</h3>
        <p>
          {zona} · {mesa.capacidad} personas
        </p>
        <span className="mesa__estado">Disponible</span>
        <button className="boton boton--borde" onClick={() => onVerHorarios(mesa)}>
          Ver horarios
        </button>
      </div>
    </article>
  )
}
