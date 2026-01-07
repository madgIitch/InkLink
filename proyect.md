# Plan de Desarrollo - MVP Mobile App

## Sprint 0 (Setup) — 2–4 días

**Objetivo:** Dejar el proyecto listo para iterar rápido con calidad.

### Entregables

- Repo + monorepo simple (opcional) + CI básico (lint/test/build)
- React Native (ideal: Expo) + navegación base
- Supabase project: DB + Auth + Storage habilitados
- Entornos y configuración: `.env`, staging vs prod
- Base UI: theme/tokens (aunque sea mínimo), componentes base (Button/Input/Screen)
- Estructura de carpetas (feature-based)

### DoD (Definition of Done)

- [ ] App corre en iOS/Android simulador
- [ ] Login screen "dummy" navegable
- [ ] Supabase conectado y validado con un ping simple

---

## Sprint 1 — Autenticación + Perfil mínimo (1 semana)

**Objetivo:** Usuarios reales pueden entrar y tener identidad persistente.

### User Stories

- Como usuario, quiero registrarme/iniciar sesión
- Como usuario, quiero ver/editar mi perfil básico

### Back/DB (Supabase)

- Tabla `profiles` (1:1 con `auth.users`)
- Trigger para auto-crear profiles al registrarse
- RLS: cada usuario solo lee/escribe su perfil

### App

- Email/password auth (o magic link si encaja)
- Pantallas: Register / Login / Forgot password / Profile
- Validación de formularios + estados de carga/errores

### DoD

- [ ] RLS verificada (no se puede leer perfil ajeno)
- [ ] Deep link de reset password funcionando (si aplica)

---

## Sprint 2 — Core Feature v1 (Create + List) (1 semana)

**Objetivo:** Primer caso de uso real end-to-end.

> Aquí defines tu "objeto principal": items, posts, listings, tasks, spots, etc.

### User Stories

- Como usuario, quiero crear un elemento
- Como usuario, quiero ver listado de mis elementos (o feed simple)

### Back/DB

- Tabla principal `entities` + índices
- Storage (si hay imagen): bucket + política + path por user
- RLS por propiedad (`user_id`)

### App

- Create screen (form + upload opcional)
- List screen (FlatList con paginación simple)
- Detalle simple (tap en card)

### DoD

- [ ] CRUD parcial: Create + Read listo
- [ ] Performance aceptable en listas (paginación)

---

## Sprint 3 — Core Feature v2 (Update/Delete + UX) (1 semana)

**Objetivo:** Cerrar el ciclo CRUD y mejorar usabilidad.

### User Stories

- Como usuario, quiero editar/eliminar mis elementos
- Como usuario, quiero ver estados vacíos y feedback claro

### Back/DB

- Constraints y validaciones (no nulos, checks)
- Opcional: soft delete (`deleted_at`) si te interesa

### App

- Edit screen (reutilizar formulario)
- Delete con confirmación
- UI states: empty, loading skeleton, error retry
- Pull-to-refresh

### DoD

- [ ] CRUD completo para el objeto principal
- [ ] Flujos sin "pantallas rotas" (navegación consistente)

---

## Sprint 4 — Descubrimiento/Interacción (según producto) (1 semana)

**Objetivo:** Convertir el MVP en "producto", no solo CRUD.

**Elige 1–2 de estas (no todas):**

### Opción A: Búsqueda + filtros

- Query por texto + filtros básicos (categoría, rango, tags)
- Índices en DB para queries frecuentes

### Opción B: Social básico

- Likes/favs, guardados, o follow
- Tabla `favorites` con RLS

### Opción C: Comunicación

- Chat básico con tabla `messages` + `conversations`
- Realtime (solo si de verdad lo necesitas en MVP)

### DoD

- [ ] La funcionalidad elegida funciona end-to-end con RLS sólida

---

## Sprint 5 — Calidad de producto (1 semana)

**Objetivo:** Preparar una beta real.

### Incluye

- Analítica mínima (eventos clave: signup, create, publish, etc.)
- Crash/error reporting
- Edge Functions (solo si necesitas lógica "server-side": pagos, notificaciones, moderación ligera)
- Hardening de seguridad: revisar RLS, políticas de Storage, rate limiting (a nivel app y/o función)
- Performance: caché ligera y reducción de llamadas redundantes

### DoD

- [ ] Checklist de release (permisos, secretos, RLS, builds reproducibles)
- [ ] Beta interna lista

---

## Sprint 6 — Pulido + Lanzamiento (opcional, 1 semana)

**Objetivo:** Cerrar lo necesario para publicar.

### Tareas

- Onboarding corto
- Legal mínimo: términos/privacidad (si aplica)
- Feedback in-app (form o email)
- Preparar store listing (capturas, copy) si vas a stores

---

## Backlog

> **Para NO meter en MVP**, pero tenerlo "aparcado"

- Notificaciones push
- Offline-first serio
- Roles complejos (admin/moderator)
- Recomendaciones / ranking
- IA (si no es núcleo)
- Multi-idioma
- Pagos/subs

---

## Arquitectura Recomendada (simple y escalable)

### Frontend

- **React Native (Expo) + TypeScript**
- **Estado:** React Query (tanstack) para data fetching/caché
- **Navegación:** React Navigation
- **UI:** Tu kit propio básico + tokens (o Tamagui / RN Paper si quieres velocidad)

### Backend (Supabase)

- **Auth**
- **Postgres + RLS**
- **Storage** (si imágenes)
- **Edge Functions** solo para lo que no debe estar en cliente

---

## Plan de Entregas (Resumen)

| Semana | Sprint | Enfoque |
|--------|--------|---------|
| **0** | Setup | Configuración inicial |
| **1** | Auth + Profile | Autenticación y perfiles |
| **2** | Core Create + List | Funcionalidad principal (parte 1) |
| **3** | CRUD completo + UX | Funcionalidad principal (parte 2) |
| **4** | Discovery o interacción clave | Diferenciación del producto |
| **5** | Beta hardening | Calidad y seguridad |
| **6** | Launch (opcional) | Lanzamiento |
