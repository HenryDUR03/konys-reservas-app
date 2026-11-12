-- Konys Pizza: mesas, horarios, reservas y carta.
-- Los textos de día van sin tilde para compararlos fácil desde la app.

create extension if not exists pgcrypto;

create table mesas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  zona text not null check (zona in ('terraza', 'salon')),
  capacidad integer not null check (capacidad > 0),
  activa boolean not null default true,
  foto_url text,
  creado_en timestamptz not null default now()
);

create table horarios (
  id uuid primary key default gen_random_uuid(),
  dia_semana text not null check (
    dia_semana in (
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado',
      'domingo'
    )
  ),
  jornada text not null check (jornada in ('almuerzo', 'noche')),
  hora_inicio time not null,
  hora_fin time not null,
  duracion_slot integer not null check (duracion_slot > 0),
  activo boolean not null default true,
  check (hora_fin > hora_inicio)
);

create table reservas (
  id uuid primary key default gen_random_uuid(),
  mesa_id uuid not null references mesas (id) on delete restrict,
  cliente_nombre text not null,
  cliente_contacto text,
  -- El tope contra mesas.capacidad se valida en la app: un check de SQL no puede leer otra tabla.
  num_personas integer not null check (num_personas > 0),
  fecha date not null,
  hora_inicio time not null,
  hora_fin time not null,
  estado text not null default 'confirmada' check (
    estado in ('confirmada', 'cancelada', 'completada')
  ),
  creado_en timestamptz not null default now(),
  check (hora_fin > hora_inicio)
);

-- Solo una reserva confirmada por mesa, fecha y hora de inicio.
create unique index reservas_mesa_fecha_hora_confirmada_idx
  on reservas (mesa_id, fecha, hora_inicio)
  where estado = 'confirmada';

create table platos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text not null check (
    categoria in ('pizzas', 'entradas', 'postres', 'bebidas')
  ),
  descripcion text,
  precio integer not null check (precio >= 0),
  disponible boolean not null default true
);
