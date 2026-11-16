-- ============================================================
-- Konys Pizza: datos de ejemplo + seguridad (RLS)
-- Ejecutar DESPUES de docs/schema.sql
-- ============================================================

-- ---------- DATOS DE EJEMPLO ----------
-- (Ejecutar una sola vez: si lo repites, se duplican los datos)

-- Mesas
insert into mesas (nombre, zona, capacidad, activa) values
  ('Mesa 1', 'terraza', 4, true),
  ('Mesa 2', 'terraza', 2, true),
  ('Mesa 3', 'salon', 6, true),
  ('Mesa 4', 'salon', 4, true),
  ('Mesa 5', 'salon', 8, true);

-- Horarios: almuerzo y noche, todos los dias
insert into horarios (dia_semana, jornada, hora_inicio, hora_fin, duracion_slot)
select d, 'almuerzo', '12:30'::time, '14:30'::time, 60
from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) as d
union all
select d, 'noche', '17:00'::time, '23:00'::time, 60
from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) as d;

-- Carta
insert into platos (nombre, categoria, descripcion, precio, disponible) values
  ('Pizza Konys Especial', 'pizzas', 'Jamón, pollo, champiñones y mucho queso', 42000, true),
  ('Pizza Hawaiana', 'pizzas', 'Jamón y piña', 36000, true),
  ('Pizza Pepperoni', 'pizzas', 'Pepperoni y queso mozzarella', 38000, true),
  ('Palitos de ajo', 'entradas', 'Palitos de pan con ajo y queso', 15000, true),
  ('Alitas BBQ', 'entradas', 'Ocho alitas con salsa BBQ', 24000, true),
  ('Brownie con helado', 'postres', 'Brownie caliente con bola de helado', 14000, true),
  ('Limonada natural', 'bebidas', 'Jarra de limonada', 12000, true),
  ('Gaseosa', 'bebidas', 'Botella personal', 5000, true);

-- ---------- SEGURIDAD (RLS) ----------

alter table mesas enable row level security;
alter table horarios enable row level security;
alter table reservas enable row level security;
alter table platos enable row level security;

-- Lectura publica
create policy "leer mesas" on mesas for select using (true);
create policy "leer horarios" on horarios for select using (true);
create policy "leer platos" on platos for select using (true);
create policy "leer reservas" on reservas for select using (true);

-- El cliente puede crear reservas
create policy "crear reservas" on reservas for insert with check (true);

-- Escrituras del admin (protegidas solo por la contrasena del front-end;
-- simplificacion academica, documentar como limitacion)
create policy "admin mesas" on mesas for all using (true) with check (true);
create policy "admin horarios" on horarios for all using (true) with check (true);
create policy "admin platos" on platos for all using (true) with check (true);
create policy "admin reservas editar" on reservas for update using (true) with check (true);
create policy "admin reservas borrar" on reservas for delete using (true);
