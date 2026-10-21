# LoyLoop: sincronización de ofertas del admin con la app móvil

## Objetivo

Cuando el equipo cree, edite, active o elimine una recompensa, misión o campaña desde el panel de administración, la app móvil debe reflejar el estado guardado en Supabase en la sección del producto que corresponda.

## Estado actual

- El panel admin y la app móvil están configurados con el mismo proyecto Supabase.
- El admin ya escribe en las tablas `rewards`, `missions` y `campaigns`.
- La app móvil ya consulta esas tablas desde la pantalla de detalle del comercio y Beneficios.
- Las acciones de escritura del admin capturan errores y los registran en consola, sin entregar un resultado visible al formulario.
- Las consultas del admin usan datos de demostración cuando la consulta falla o la tabla no tiene filas, lo que puede esconder que no se persistió un registro.
- La pantalla Beneficios móvil agrega ofertas únicamente de comercios con membresía. El detalle del comercio consulta ofertas activas, pero necesita respetar mejor disponibilidad, fechas y acceso de visitante.
- `useResource` ya vuelve a cargar la información al enfocar una pantalla; no hay suscripción en tiempo real.

## Diseño aprobado

### Fuente de verdad

Supabase seguirá siendo la única fuente persistente para las ofertas del comercio. No se crearán tablas duplicadas ni rutas nuevas. Las entidades existentes se mantendrán diferenciadas:

- `rewards`: recompensa o beneficio del comercio.
- `campaigns`: promoción del comercio.
- `missions`: misión del comercio.

El nivel global LoyLevel y sus beneficios quedan fuera de este flujo.

### Escritura y errores en el admin

Las acciones de crear, editar y eliminar deben conservar los campos existentes y reportar los fallos de Supabase al flujo de la interfaz. Las pantallas del dashboard deben presentar datos reales, incluso si el resultado correcto es una lista vacía. Los datos de demostración no deben sustituir errores ni ocultar tablas vacías en esas vistas. El negocio objetivo seguirá siendo Café Central mientras el admin solo opere ese comercio.

### Lectura y visibilidad en el móvil

La app leerá registros del negocio seleccionado y solo tratará como utilizables los registros activos y vigentes. La visibilidad será:

- **Detalle del comercio, visitante:** promociones públicas activas visibles; recompensas y misiones exclusivas se pueden descubrir con indicación de que requieren unirse. No se permite reclamar como miembro.
- **Detalle del comercio, miembro:** promociones, recompensas y misiones elegibles según estado, vigencia y segmento, con el progreso existente cuando esté disponible.
- **Beneficios:** se agregan ofertas de comercios donde el usuario ya es miembro; beneficios, promociones y misiones conservan sus tipos y tabs actuales.

La evaluación de vigencia usará `active`, `status`, `starts_at` y `ends_at` donde aplique. Las reglas de segmento deben coincidir con el modelo existente del admin y nunca hacer visible una oferta inactiva.

### Actualización

Se reutilizará la recarga existente al enfocar la pantalla. Cuando el usuario vuelva a Beneficios o al detalle del comercio, la pantalla consultará Supabase otra vez. No se requiere Supabase Realtime en esta entrega.

### Alcance de cambios

- Admin LoyLoop: acciones de `lib/actions/loyalty.ts` y lecturas de `lib/data/dashboard.ts`, junto con los formularios si se necesita mostrar errores de acción.
- Móvil LoyLoopMobile: `src/lib/loyloop-data.ts` y, solo si es necesario, carga/estados en `src/app/recompensas.tsx` y `src/app/comercio/[slug].tsx`.
- No se cambian los diseños, navegación principal, esquema de tablas ni flujos de QR/reclamo salvo lo necesario para evitar que una oferta no elegible se reclame.

## Criterios de aceptación

1. Crear una recompensa, campaña o misión en admin persiste en la tabla correcta con el `business_id` de Café Central.
2. Los errores de escritura del admin no se reportan como éxito silencioso.
3. Una lista vacía real en dashboard se muestra vacía, no sustituida por registros ficticios; los errores de lectura son distinguibles de una lista vacía.
4. Un registro activo y vigente aparece en la app dentro de su tipo y sección, según las reglas de membresía.
5. Un registro inactivo, programado para el futuro o vencido no se muestra como disponible para reclamar.
6. Un visitante puede descubrir promociones públicas en el detalle y ve recompensas/misiones de miembros bloqueadas o con CTA para unirse.
7. Al regresar a la pantalla móvil, se reflejan cambios hechos desde el admin sin reiniciar la app.
8. Beneficios globales de LoyLevel permanecen separados de las recompensas por comercio.

## Fuera de alcance

- Crear negocios nuevos desde el admin o asignar automáticamente un negocio diferente a cada cuenta de admin.
- Gestionar beneficios globales de LoyLevel desde el panel.
- Realtime, notificaciones push o sincronización en segundo plano.
- Cambios a validación/consumo de QR más allá de impedir que la interfaz permita reclamar ofertas bloqueadas.
- Modificar tablas o desplegar cambios de esquema en Supabase.

## Riesgos y límites conocidos

- La configuración de escritura y las políticas RLS existentes deben permitir operaciones legítimas del admin. La implementación debe mostrar el fallo si no lo permiten; no debe ampliar permisos de base de datos silenciosamente.
- El admin actual fija Café Central como negocio de escritura. La especificación conserva ese comportamiento y no implica soporte multi-negocio.
- Se requiere que la cuenta móvil esté autenticada y tenga el perfil/membresía correspondiente para que sus ofertas de miembro aparezcan en Beneficios.
