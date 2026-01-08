# Plan de Desarrollo - InkLink MVP

## Concepto del Producto

**InkLink** es una plataforma móvil que conecta clientes con tatuadores independientes.

### Tipos de Usuarios

1. **Clientes**: Personas que buscan tatuadores para realizarse un tatuaje
2. **Tatuadores**: Artistas independientes que ofrecen sus servicios

### Funcionalidades Core (MVP)

- Búsqueda y descubrimiento de tatuadores
- Portfolio visual de trabajos
- Sistema de contacto/mensajería entre clientes y tatuadores

---

## Sprint 0 (Setup) — ✅ COMPLETADO

**Objetivo:** Dejar el proyecto listo para iterar rápido con calidad.

### Entregables Completados

- ✅ React Native (Expo) + TypeScript + navegación base
- ✅ Firebase: Auth + Firestore + Storage configurados
- ✅ Entornos y configuración: `.env`
- ✅ Base UI: theme/tokens, componentes base (Button/Input/Screen)
- ✅ Estructura de carpetas (feature-based)
- ✅ ESLint + Prettier configurados

### DoD (Definition of Done)

- ✅ App corre en iOS/Android simulador
- ✅ Login screen "dummy" navegable
- ✅ Firebase conectado y validado

---

## Sprint 1 — Autenticación + Tipos de Usuario + Perfiles

**Objetivo:** Sistema completo de autenticación con diferenciación de tipos de usuario.

### User Stories

- Como usuario, quiero registrarme eligiendo si soy cliente o tatuador
- Como usuario, quiero iniciar sesión con email/password
- Como cliente, quiero tener un perfil básico con mis datos
- Como tatuador, quiero tener un perfil profesional con información adicional
- Como usuario, quiero editar mi perfil

### Back/DB (Firebase)

#### Colección `users`
```typescript
{
  uid: string;                    // Firebase Auth UID
  email: string;
  userType: 'client' | 'tattoo_artist';
  displayName: string;
  photoURL?: string;
  createdAt: timestamp;
  updatedAt: timestamp;

  // Campos comunes
  phone?: string;
  location?: {
    city: string;
    country: string;
  };

  // Solo para tatuadores (artistProfile existe solo si userType === 'tattoo_artist')
  artistProfile?: {
    bio: string;
    styles: string[];           // ["realismo", "tradicional", "minimalista", etc.]
    yearsOfExperience: number;
    priceRange: {
      min: number;
      max: number;
      currency: string;
    };
    availability: {
      acceptingClients: boolean;
      schedule?: string;        // "Lun-Vie 9am-6pm"
    };
    socialMedia?: {
      instagram?: string;
      portfolio?: string;
    };
  };
}
```

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;  // Perfiles públicos
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;  // No permitir borrado
    }
  }
}
```

### App - Pantallas

1. **Welcome Screen**
   - Botón "Iniciar Sesión"
   - Botón "Registrarse"

2. **Register Screen**
   - Selector de tipo de usuario (Cliente / Tatuador)
   - Email, Password, Confirmar Password
   - Nombre completo
   - Validación de formularios

3. **Login Screen**
   - Email, Password
   - Link a "¿Olvidaste tu contraseña?"
   - Link a "Registrarse"

4. **Profile Setup Screen** (después de registro)
   - **Para Clientes:**
     - Foto de perfil (opcional)
     - Ubicación (ciudad, país)
     - Teléfono (opcional)

   - **Para Tatuadores:**
     - Todo lo anterior +
     - Bio profesional
     - Estilos que practica (multi-select)
     - Años de experiencia
     - Rango de precios
     - Redes sociales

5. **Profile Screen**
   - Ver perfil propio
   - Editar perfil
   - Cerrar sesión

### Navegación

```
Auth Stack (no autenticado):
- Welcome
- Login
- Register

Main Stack (autenticado):
- Home (diferente según userType)
- Profile
- Edit Profile
```

### DoD

- [ ] Registro funcional con selección de tipo de usuario
- [ ] Login/Logout funcional
- [ ] Perfil de cliente completo y editable
- [ ] Perfil de tatuador completo y editable
- [ ] Persistencia de sesión (AsyncStorage)
- [ ] Validaciones de formularios con feedback visual
- [ ] Firestore Rules configuradas y testeadas

---

## Sprint 2 — Portfolio del Tatuador

**Objetivo:** Los tatuadores pueden crear y gestionar su portfolio visual.

### User Stories

- Como tatuador, quiero subir fotos de mis trabajos
- Como tatuador, quiero agregar descripción y estilo a cada trabajo
- Como tatuador, quiero ver/editar/eliminar mi portfolio
- Como usuario (cualquiera), quiero ver el portfolio público de un tatuador

### Back/DB (Firebase)

#### Colección `portfolio_items`
```typescript
{
  id: string;
  artistId: string;             // uid del tatuador
  imageUrl: string;             // URL en Firebase Storage
  thumbnailUrl?: string;        // Versión optimizada
  description: string;
  style: string;                // "realismo", "tradicional", etc.
  tags?: string[];              // ["brazo", "color", "grande"]
  createdAt: timestamp;
  likes?: number;               // Para futura implementación
}
```

#### Firebase Storage
```
/portfolio/{artistId}/{imageId}.jpg
/portfolio/{artistId}/thumbs/{imageId}_200x200.jpg
```

#### Firestore Rules
```javascript
match /portfolio_items/{itemId} {
  allow read: if true;  // Portfolio público
  allow create: if request.auth != null
    && request.resource.data.artistId == request.auth.uid
    && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'tattoo_artist';
  allow update, delete: if request.auth != null
    && resource.data.artistId == request.auth.uid;
}
```

### App - Pantallas

1. **My Portfolio Screen** (solo tatuadores)
   - Grid de imágenes del portfolio
   - Botón "Agregar trabajo"
   - Tap para ver detalle/editar/eliminar

2. **Add Portfolio Item Screen**
   - Selector de imagen (cámara/galería)
   - Descripción
   - Selector de estilo
   - Tags opcionales
   - Preview de la imagen

3. **Portfolio Item Detail Screen**
   - Imagen full screen
   - Descripción
   - Opciones de editar/eliminar (si es el dueño)

4. **Public Artist Profile Screen**
   - Info del tatuador
   - Grid del portfolio
   - Botón "Contactar"

### DoD

- [ ] Subir imágenes a Firebase Storage funcional
- [ ] CRUD completo de portfolio items
- [ ] Vista pública del portfolio optimizada (lazy loading)
- [ ] Compresión/optimización de imágenes
- [ ] Storage rules configuradas

---

## Sprint 3 — Búsqueda y Descubrimiento

**Objetivo:** Los clientes pueden buscar y descubrir tatuadores.

### User Stories

- Como cliente, quiero ver una lista de tatuadores disponibles
- Como cliente, quiero filtrar por ubicación y estilo
- Como cliente, quiero ver el perfil público de un tatuador
- Como cliente, quiero ver el portfolio de un tatuador

### Back/DB (Firebase)

#### Índices de Firestore
```javascript
// Composite index para queries eficientes
users (collection)
  - userType Ascending
  - location.city Ascending
  - artistProfile.styles Array-contains
```

### App - Pantallas

1. **Discover Screen** (Home para clientes)
   - Lista/Grid de tatuadores
   - Barra de búsqueda
   - Filtros:
     - Ubicación (ciudad)
     - Estilos (multi-select)
     - Rango de precios
   - Card por tatuador:
     - Foto de perfil
     - Nombre
     - Estilos principales
     - Ubicación
     - Preview de 3 trabajos del portfolio

2. **Artist Public Profile Screen**
   - Header con foto, nombre, bio
   - Badges de estilos
   - Info de ubicación y precios
   - Redes sociales
   - Grid completo del portfolio
   - Botón "Contactar" (va a mensajería)

3. **Filter Modal**
   - Selector de ciudad
   - Multi-selector de estilos
   - Slider de rango de precios

### DoD

- [ ] Lista de tatuadores funcional con paginación
- [ ] Filtros funcionando correctamente
- [ ] Búsqueda por texto (nombre)
- [ ] Performance optimizada (lazy loading, cache)
- [ ] Vista pública del perfil completa

---

## Sprint 4 — Sistema de Mensajería

**Objetivo:** Comunicación directa entre clientes y tatuadores.

### User Stories

- Como cliente, quiero contactar a un tatuador
- Como usuario, quiero ver mis conversaciones activas
- Como usuario, quiero enviar/recibir mensajes en tiempo real
- Como usuario, quiero ver cuándo fue el último mensaje

### Back/DB (Firebase)

#### Colección `conversations`
```typescript
{
  id: string;
  participants: {
    [userId: string]: {
      userType: 'client' | 'tattoo_artist';
      displayName: string;
      photoURL?: string;
    }
  };
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: timestamp;
  };
  unreadCount: {
    [userId: string]: number;
  };
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### Colección `messages`
```typescript
{
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: timestamp;
  read: boolean;
}
```

#### Firestore Rules
```javascript
match /conversations/{conversationId} {
  allow read, write: if request.auth != null
    && request.auth.uid in resource.data.participants;
}

match /messages/{messageId} {
  allow read: if request.auth != null
    && request.auth.uid in get(/databases/$(database)/documents/conversations/$(resource.data.conversationId)).data.participants;
  allow create: if request.auth != null
    && request.auth.uid in get(/databases/$(database)/documents/conversations/$(request.resource.data.conversationId)).data.participants
    && request.resource.data.senderId == request.auth.uid;
}
```

### App - Pantallas

1. **Conversations List Screen**
   - Lista de conversaciones
   - Preview del último mensaje
   - Badge de mensajes no leídos
   - Foto y nombre del otro participante

2. **Chat Screen**
   - Mensajes en tiempo real
   - Input de mensaje
   - Indicador de "escribiendo..." (opcional)
   - Scroll automático al último mensaje

### DoD

- [ ] Crear conversación desde perfil de tatuador
- [ ] Enviar/recibir mensajes en tiempo real
- [ ] Lista de conversaciones actualizada
- [ ] Contador de mensajes no leídos funcional
- [ ] Performance optimizada (paginación de mensajes)

---

## Sprint 5 — Calidad de Producto

**Objetivo:** Preparar una beta real.

### Incluye

- Analítica básica (Firebase Analytics)
  - Eventos: signup, login, profile_view, message_sent, etc.
- Crash reporting (Firebase Crashlytics si es posible con Expo)
- Optimización de imágenes
- Manejo de errores robusto
- Loading states y skeletons
- Error boundaries
- Validación exhaustiva de datos
- Revisar Firestore Rules
- Rate limiting básico

### DoD

- [ ] Analytics configurado y funcionando
- [ ] Manejo de errores en todas las pantallas
- [ ] Loading states consistentes
- [ ] Firestore Rules revisadas y seguras
- [ ] App testeada en dispositivos reales
- [ ] Performance aceptable (< 3s carga inicial)

---

## Sprint 6 — Pulido + Lanzamiento

**Objetivo:** Preparar para publicar.

### Tareas

- Onboarding de 3 pantallas (beneficios, cómo funciona, tipos de usuario)
- Pantalla de términos y privacidad
- Feedback in-app
- Capturas de pantalla para stores
- Descripción de la app
- TestFlight / Google Play Internal Testing

---

## Backlog Futuro

> **Para NO meter en MVP**, pero considerar después

### Funcionalidades
- Notificaciones push
- Reserva/agenda de citas
- Sistema de reseñas y ratings
- Favoritos/guardados
- Compartir perfiles
- Modo oscuro
- Multi-idioma (ES/EN)
- Geolocalización en mapa
- Video en portfolio
- Stories temporales (trabajos recientes)

### Monetización (post-MVP)
- Perfiles premium para tatuadores
- Destacar perfil en búsquedas
- Estadísticas avanzadas para tatuadores
- Comisión por citas agendadas

---

## Arquitectura Técnica

### Frontend

- **React Native (Expo) + TypeScript**
- **Estado:** Context API para auth, queries directas a Firebase
- **Navegación:** React Navigation (Stack + Bottom Tabs)
- **UI:** Sistema de diseño propio con tokens
- **Imágenes:** expo-image-picker + expo-image-manipulator

### Backend (Firebase)

- **Authentication:** Email/Password
- **Firestore:** Base de datos principal
- **Storage:** Imágenes del portfolio
- **Analytics:** Eventos básicos
- **Opcional:** Cloud Functions para notificaciones

### Estructura de Datos Resumida

```
users/
  {uid}/
    - email, userType, displayName, photoURL
    - location, phone
    - artistProfile? (solo tatuadores)

portfolio_items/
  {itemId}/
    - artistId, imageUrl, description, style
    - createdAt

conversations/
  {conversationId}/
    - participants, lastMessage, unreadCount

messages/
  {messageId}/
    - conversationId, senderId, text
    - createdAt, read
```

---

## Plan de Entregas (Actualizado)

| Semana | Sprint | Enfoque | Estado |
|--------|--------|---------|--------|
| **0** | Setup | Configuración inicial | ✅ Completado |
| **1** | Auth + Tipos de Usuario + Perfiles | Registro diferenciado y perfiles | 🔄 En progreso |
| **2** | Portfolio del Tatuador | CRUD de trabajos con imágenes | ⏳ Pendiente |
| **3** | Búsqueda y Descubrimiento | Encontrar tatuadores | ⏳ Pendiente |
| **4** | Mensajería | Chat en tiempo real | ⏳ Pendiente |
| **5** | Calidad de Producto | Pulido y optimización | ⏳ Pendiente |
| **6** | Lanzamiento | Beta testing | ⏳ Pendiente |
