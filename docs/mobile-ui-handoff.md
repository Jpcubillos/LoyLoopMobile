# LoyLoop: actualización móvil desde Figma

## Implementación

Referencia: archivo `UITegQ7U4n3fBriaUnLZZE`, tablero `528:2009`.
Se inspeccionaron los frames de Inicio, Comercios, detalle miembro/visitante,
Beneficios, reclamo, éxito, Perfil y edición personal.

- Navegación: Inicio, Comercios, Beneficios y Perfil. QR abre una acción modal.
- Inicio es un único scroll. Mis comercios/Explorar y los filtros de Beneficios
  son estados internos.
- El detalle de comercio comparte pantalla entre visitante y miembro. Incluye
  inscripción, progreso, sellos desplegables, ofertas, misiones y ubicaciones.
- Componentes reutilizables, Inter, tokens coral/rosa y variantes de cards.
- Reclamos: detalle, QR, código manual, caducidad y consulta del estado real.
  El éxito requiere `approved`; los puntos de fidelidad no se descuentan.
- Información personal: hojas de edición, avatar, contraseña, verificación
  de correo y eliminación explícita de cuenta.
- Se conservan Expo Router, Supabase y el cliente de reclamos existente.
  El proyecto se actualizó de Expo SDK 54 a 57 para abrirlo en Expo Go 57
  de iPhone. Las dependencias se alinearon con `expo install --fix` por SDK.

## Verificación

- `npm run typecheck`
- `npx expo-doctor@latest`: 21/21 comprobaciones correctas tras actualizar a SDK 57.
- `npm test`: cuatro pruebas de elegibilidad, vigencia, QR y validación.
- `npx expo export --platform all --output-dir dist`: completado con SDK 57 para Android,
  iOS y web con `EXPO_PUBLIC_DEMO_MODE=false`. Verifica bundles; no genera
  instaladores firmados ni equivale a una prueba en dispositivo.
- `npm run test:mobile`: recorrido con Chrome sin interfaz, servidor local
  en `http://localhost:8087`, datos demo aislados. Comprueba navegación,
  búsqueda, inscripción, acordeón, reclamo sin éxito anticipado, perfil y
  pantalla de 320 px. Capturas en `.design-reference/qa/` (ignoradas por Git).
- Revisión del código contra el esquema y validador del backend vecino
  `../LoyLoop`. La revisión no modifica ese backend.

Las pruebas en navegador no sustituyen pruebas de cámara/permisos en un
teléfono ni una validación presencial con una cuenta y comercio reales.

## Requisitos del servidor para producción

1. Aplicar `supabase/migrations/202610200001_mobile_profile.sql` al proyecto
   existente tras revisar la migración. **No se ha aplicado remotamente.**
   Configura bucket/políticas de avatar, sincronización de identidad al cambiar
   correo y RPC de eliminación. El cambio de correo comprueba el RPC de
   disponibilidad antes de pedir la actualización a Auth. La eliminación
   comprueba elegibilidad antes de retirar el avatar.
2. El servidor existente solo canjea la tarjeta llamada exactamente
   `Cafe gratis con 10 sellos`. La UI consulta esa misma tarjeta para evitar
   mezclar progresos. Para otras tarjetas se necesita ampliar el contrato
   del servidor con un identificador de tarjeta.
3. Las campañas envían su cantidad explícita de puntos/descuento. Las
   recompensas independientes de tipo `points`, `credit` o productos sin
   tarjeta compatible no tienen un canje automático soportado por el
   servidor actual: el detalle lo indica y no inventa una operación.
4. El nivel del comercio se lee de `business_memberships.tier`. El esquema
   actual no publica umbrales por puntos: en cuentas reales no se muestra un
   umbral inventado. Los ejemplos de progreso completo quedan en demo.
5. LoyLevel global admite datos administrados por el servidor en
   `auth.users.raw_app_meta_data.loylevel`:

   ```json
   {
     "xp": 2450,
     "level": "Oro",
     "nextLevel": "Platino",
     "nextXp": 3230,
     "badges": ["Explorador"],
     "benefits": ["Beneficio global"]
   }
   ```

   El backend actual no calcula ni actualiza este objeto. Sin él, la app
   presenta el nivel inicial sin beneficios/insignias. Nunca usa metadatos
   editables por el usuario para adjudicar progreso.
6. Faltan los documentos oficiales de términos y privacidad. La sección
   informa su disponibilidad pendiente; no se inventó contenido legal.

## Vista previa local

En PowerShell:

```powershell
$env:EXPO_PUBLIC_DEMO_MODE='true'
$env:EXPO_OFFLINE='1'
npx expo start --web --port 8087
```

Demo guarda inscripciones y ediciones localmente. El QR demo está identificado
y su validación se simula únicamente en ese modo. Para producción, usar
`EXPO_PUBLIC_DEMO_MODE=false`, las variables de `.env.example` y verificar
los requisitos anteriores.
