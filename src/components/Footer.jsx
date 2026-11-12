// Pie de página con dirección, horarios y redes.
export default function Footer() {
  return (
    <footer id="contacto" className="footer">
      <div className="footer__grid contenedor">
        <div>
          <h3>Konys Pizza</h3>
          <p>Cra. 36 con calle 41, Bucaramanga</p>
        </div>
        <div>
          <h3>Horario</h3>
          <p>12:30 a 2:30 p. m. y 5:00 a 11:00 p. m.</p>
          <p>Domicilios y eventos</p>
        </div>
        <div>
          <h3>Escríbenos</h3>
          {/* Cambia el número de WhatsApp cuando tengas el real */}
          <p>
            <a href="https://wa.me/57" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </p>
          <p>
            <a href="https://www.instagram.com/konys_pizza" target="_blank" rel="noreferrer">
              Instagram @konys_pizza
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
