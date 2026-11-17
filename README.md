# Konys Pizza – Sistema de Reservas de Mesas

Aplicación web académica para la pizzería Konys (Cra. 36 con calle 41, Bucaramanga). Hoy las reservas se anotan a mano, por llamada, WhatsApp o Instagram, y eso produce dobles reservas, tiempos de espera y clientes perdidos. Esta aplicación permite que el cliente reserve su mesa por su cuenta, viendo la disponibilidad en tiempo real, y que el administrador gestione mesas, horarios, reservas y la carta.

## Enlaces

- **Aplicación desplegada:** https://konys-reservas-app-sigma.vercel.app
- **Repositorio:** https://github.com/HenryDUR03/konys-reservas-app
- **Video explicativo:** https://youtu.be/-lYvejARWpQ

## Funcionalidades

**Cliente** (ruta `/`, sin necesidad de registrarse)

- Ver las mesas disponibles, con su zona (terraza o salón) y capacidad.
- Elegir fecha entre los próximos días de atención y ver las horas libres y ocupadas.
- Reservar indicando nombre, número de personas (sin superar la capacidad de la mesa) y un contacto opcional.
- Ver una pantalla de confirmación con los datos de la reserva.
- Consultar la carta digital por categorías.

**Administrador** (ruta `/admin`, protegida con contraseña)

- Crear, editar, borrar y activar o inactivar mesas. Una mesa inactiva no aparece para los clientes.
- Definir el horario de atención por día y jornada (almuerzo y noche) y la duración de cada reserva.
- Ver todas las reservas, filtrarlas por fecha y por mesa, y cambiar su estado (confirmada, cancelada o completada).
- Agregar, editar, ocultar y eliminar platos de la carta.

## Tecnologías

- React 18 y Vite (JavaScript)
- CSS puro, con diseño responsive (mobile first)
- React Router
- Supabase (base de datos PostgreSQL) mediante `@supabase/supabase-js`, sin servidor propio
- GitHub y Vercel para el control de versiones y el despliegue

## Estructura del proyecto

```
konys-reservas-app/
  src/
    components/       Componentes del cliente (MesaCard, SlotGrid, ReservaModal...)
      admin/          Componentes del panel de administración
    hooks/            Lectura de datos (useMesas, usePlatos, useHorarios)
    pages/            Cliente.jsx y Admin.jsx
    services/         Conexión con Supabase, reservas, admin y utilidades de fechas
    styles/           Hojas de estilo
  docs/
    Documento-Proyecto.docx
    schema.sql                 Tablas de la base de datos
    datos_y_seguridad.sql      Datos de ejemplo y políticas de seguridad (RLS)
    mockups/                   Wireframes de baja fidelidad
  vercel.json         Redirección de rutas para la aplicación de una sola página
  .env.example        Variables de entorno necesarias (sin valores)
```

## Cómo ejecutarlo

1. Clona el repositorio e instala las dependencias:

```bash
npm install
```

2. Crea un proyecto en [Supabase](https://supabase.com). En el **SQL Editor**, ejecuta primero `docs/schema.sql` y después `docs/datos_y_seguridad.sql`. El segundo carga mesas, horarios y platos de ejemplo, y activa las políticas de seguridad. Ejecútalo una sola vez.

3. Copia el archivo de variables y complétalo con los datos de tu proyecto de Supabase (en **Project Settings → API Keys** está la URL y la clave pública `publishable`). Nunca uses la clave `secret` ni `service_role`.

```bash
copy .env.example .env
```

Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PASSWORD` (contraseña para entrar a `/admin`)

El archivo `.env` está en `.gitignore` y no se sube al repositorio.

4. Arranca el servidor de desarrollo:

```bash
npm run dev
```

La ruta `/` es la vista del cliente y `/admin` es el panel de administración.

## Despliegue

El proyecto se despliega en Vercel conectado al repositorio de GitHub: cada `git push` genera un despliegue nuevo. Las tres variables de entorno anteriores se configuran en **Settings → Environment Variables** de Vercel. El archivo `vercel.json` hace que entrar directamente a `/admin` funcione.

## Control de dobles reservas

Para que dos clientes no reserven la misma mesa a la misma hora, la aplicación vuelve a consultar la base de datos justo antes de guardar la reserva. Además, la base de datos tiene un índice único sobre mesa, fecha y hora de las reservas confirmadas, así que si dos personas confirman casi al mismo tiempo, una de las dos recibe el aviso de que ese horario ya fue tomado.

## Limitación académica de seguridad

En Supabase, la lectura de mesas, horarios, platos y reservas es pública, y el cliente puede insertar reservas. Las escrituras del administrador viajan con la clave pública (`VITE_SUPABASE_ANON_KEY`) y, en esta versión, la única barrera es la contraseña comprobada en el navegador (`VITE_ADMIN_PASSWORD`). Esa contraseña no es autenticación de Supabase y queda dentro del código que baja al navegador: quien conozca la clave pública podría escribir en la base de datos, y los datos de las reservas (nombre y contacto) son legibles. En un sistema real harían falta usuarios autenticados y políticas más estrictas. Se deja así porque el alcance del proyecto no incluye autenticación real.

## Fuera del alcance

Pagos en línea, pedidos a domicilio, aplicación móvil nativa, autenticación de clientes, notificaciones por correo, SMS o WhatsApp, reportes de ventas y gestión de inventario.

## Autor

Henry Uribe – Universidad de Santander
