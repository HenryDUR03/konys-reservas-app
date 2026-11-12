// Sección principal con el slogan y el botón para reservar.
export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__contenido contenedor">
        <h1>Konys Pizza</h1>
        <p>La pizza más icónica de la ciudad</p>
        <a href="#mesas" className="boton boton--acento">
          Reserva tu mesa
        </a>
      </div>
    </section>
  )
}
