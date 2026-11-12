# Konys Pizza – Sistema de Reservas de Mesas
Pizzería Konys, Bucaramanga. Proyecto académico. App web para reservar mesas (hoy se hace a mano por llamada, WhatsApp o Instagram y causa dobles reservas). Idioma de la UI, textos y commits: español. Tablas y campos en español, snake_case.

## Stack (no cambiar)
React 18 + Vite (JavaScript, NO TypeScript), CSS puro, React Router, Supabase (@supabase/supabase-js) como único back-end (NO crear servidor propio), GitHub + Vercel. Variables de entorno: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ADMIN_PASSWORD. Nunca claves en el código; .env en .gitignore.

## Estructura
src/main.jsx, src/App.jsx, src/components/ (MesaCard, SlotGrid, ReservaForm...), src/pages/Cliente.jsx y Admin.jsx, src/services/supabase.js, src/styles/styles.css, docs/ (schema.sql, mockups/), README.md, .gitignore. Componentes reutilizables y comentados.

## Alcance
SÍ: ver mesas, elegir mesa, fecha y hora, reservar, confirmación, carta digital solo lectura, panel admin (mesas, horarios, reservas, carta), responsive.
NO (no implementar ni sugerir): pagos, pedidos a domicilio en línea, app móvil nativa, autenticación de clientes, notificaciones, reportes, inventario.

## Actores
Cliente (sin login), Administrador (/admin con contraseña simple validada en el front-end con VITE_ADMIN_PASSWORD), Supabase.

## Modelo de datos
- mesas: id uuid, nombre, zona ('terraza'|'salon'), capacidad, activa bool, foto_url, creado_en
- horarios: id, dia_semana ('lunes'..'domingo'), jornada ('almuerzo'|'noche'), hora_inicio, hora_fin, duracion_slot (min), activo. Ej: almuerzo 12:30–14:30 y noche 17:00–23:00, slots de 60 min
- reservas: id, mesa_id → mesas, cliente_nombre, cliente_contacto (opcional), num_personas (<= capacidad), fecha, hora_inicio, hora_fin, estado ('confirmada'|'cancelada'|'completada'), creado_en. Índice único parcial (mesa_id, fecha, hora_inicio) donde estado='confirmada'
- platos: id, nombre, categoria ('pizzas'|'entradas'|'postres'|'bebidas'), descripcion, precio (COP entero), disponible bool

## Requisitos funcionales
Cliente: RF-01 mesas visuales (nombre, zona, capacidad, estado); RF-02 clic en mesa muestra detalles y horarios; RF-03 selector de fecha solo en días de atención; RF-04 slots libres vs ocupados (ocupado en gris); RF-05 reservar con nombre, personas (no mayor a la capacidad) y contacto opcional; RF-06 mensaje de confirmación con todos los datos; RF-07 carta por categorías (ocultar no disponibles).
Admin: RF-08 acceso a /admin con contraseña; RF-09 registrar mesas; RF-10 listar mesas; RF-11 gestionar horarios por día; RF-12 ver reservas con filtro por fecha y mesa; RF-13 activar/inactivar mesa (si está inactiva no aparece al cliente); RF-14 CRUD de la carta.

## Reglas clave
- Antes de insertar una reserva, volver a consultar que el slot siga libre (condición de carrera) y manejar el error del índice único como "slot ya tomado".
- Errores a manejar: slot ocupado, campos vacíos, personas > capacidad, sin mesas activas, sin horarios para ese día.
- Reservar en menos de 3 pasos. Mobile first. Carga < 3 s.
- RLS en Supabase: lectura pública de mesas, horarios y platos; el cliente solo inserta reservas; escrituras del admin con la anon key protegidas por la contraseña del front-end (limitación académica, documentarla en el README).

## Diseño
Primario #0F2B3D (azul petróleo oscuro), acento #F28C28 (naranja), fondo blanco o gris claro, fuente Inter. Página principal: header con menú (Inicio, Mesas, Carta, Reservar, Contacto) y botón discreto Admin, hero con "La pizza más icónica de la ciudad" y botón "Reserva tu mesa", cards de mesas, footer con dirección (Cra. 36 con calle 41), WhatsApp y redes. Reserva en modal: 1) fecha, 2) hora en grilla, 3) datos y botón "Confirmar reserva". Admin: login, menú lateral (Mesas, Horarios, Reservas, Carta), tablas con Editar/Borrar y toggle Activa/Inactiva.

## Convenciones
Trabajar por etapas y funcionalidades, sin salirse del alcance. Commits pequeños en español con Conventional Commits (feat:, fix:, docs:, chore:). Código simple y legible, que un estudiante pueda explicar en un video. Textos de error amables y en español.
