# Konys Pizza – Sistema de Reservas de Mesas

Aplicación web académica para la pizzería Konys (Bucaramanga). El cliente reserva una mesa eligiendo fecha y hora, y el administrador gestiona mesas, horarios, reservas y la carta. Hoy esas reservas se anotan a mano por llamada, WhatsApp o Instagram, y eso produce dobles reservas.

## Tecnologías

- React 18 y Vite (JavaScript, sin TypeScript)
- CSS puro
- React Router
- Supabase (`@supabase/supabase-js`) como único back-end
- Despliegue previsto en GitHub y Vercel

## Cómo ejecutarlo

1. Instala las dependencias:

```bash
npm install
```

2. Copia el ejemplo de variables y completa los valores en tu máquina. El archivo `.env` no se sube al repositorio.

```bash
copy .env.example .env
```

Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PASSWORD`

3. Arranca el servidor de desarrollo:

```bash
npm run dev
```

La ruta `/` es la vista del cliente y `/admin` es el panel de administración.

## Enlaces

- Aplicación: (pendiente)
- Video: (pendiente)

## Limitación académica de seguridad

En Supabase, la lectura de mesas, horarios y platos es pública y el cliente solo puede insertar reservas. Las escrituras del administrador viajan con la clave anónima (`VITE_SUPABASE_ANON_KEY`) y, en esta versión, la única barrera es la contraseña comprobada en el navegador (`VITE_ADMIN_PASSWORD`). Esa contraseña no es autenticación de Supabase: quien conozca la clave anónima podría escribir si las políticas lo permiten. En un sistema real harían falta usuarios autenticados y políticas más estrictas. Se deja así porque el alcance del curso no incluye autenticación real.
