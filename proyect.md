# InkLink Mobile – Plan de Proyecto (React Native)

InkLink Mobile es una aplicación nativa multiplataforma desarrollada en **React Native** cuyo propósito es ayudar a los usuarios a **descubrir tatuadores independientes**, filtrarlos por estilo, ubicación, disponibilidad y otros criterios relevantes.  

El proyecto se organizará mediante **sprints ágiles semanales**, gestionados con **GitHub Projects**, siguiendo una estructura clara basada en épicas, historias de usuario, tareas técnicas y definición de hecho (DoD).  

---

# 📅 Organización por Sprints

Cada sprint incluye:
- 🧩 Epic (feature principal)
- 🧠 Historias de usuario
- 🔧 Tareas técnicas (issues)
- ✅ Definition of Done (DoD)
- 🕒 Duración estimada: 1 semana

Este documento describe únicamente el **Sprint 0 (Setup)** replanificado para la versión móvil en React Native.

---

# 🧭 SPRINT 0 — Setup del entorno y base de datos

**Epic:** Preparar la infraestructura base para desarrollo móvil (React Native + Firebase + CI/CD)

## 🧠 Historias de usuario

- Como *equipo de desarrollo*, quiero una estructura limpia de proyecto para poder iterar con rapidez.
- Como *usuario*, quiero que la app se ejecute correctamente en mi dispositivo desde el primer build.
- Como *administrador*, quiero que la base de datos inicial esté configurada para almacenar tatuadores y usuarios.

---

# 🔧 Tareas técnicas del Sprint 0 (con descripción)

## **0.1 — Inicializar proyecto React Native + TypeScript + Expo**

### Descripción
Configurar el proyecto base utilizando **Expo + React Native + TypeScript** para disponer de un entorno estable, escalable y multiplataforma desde el primer día.

### Checklist
- Crear proyecto con `npx create-expo-app inklink`.
- Activar TypeScript y añadir `tsconfig.json`.
- Crear estructura `/src` con carpetas de componentes, pantallas y navegación.
- Añadir librerías esenciales:  
  `react-navigation`, `expo-location`, `expo-image-picker`, `react-native-safe-area-context`.

### DoD
- La app se ejecuta en emulador o dispositivo físico sin errores.
- Estructura inicial creada y documentada.

---

## **0.2 — Integrar Firebase (Auth, Firestore, Storage)**

### Descripción
Configurar la plataforma backend completa para gestión de usuarios, artistas, datos y almacenamiento de imágenes.

### Checklist
- Crear proyecto en Firebase Console.
- Añadir `firebase` en el proyecto React Native.
- Configurar `firebaseConfig.ts`.
- Inicializar Firestore, Auth y Storage.
- Crear colecciones: `artists` y `users`.

### DoD
- La app puede leer/escribir documentos básicos.
- Firebase conectado sin warnings.

---

## **0.3 — Crear la arquitectura de carpetas del proyecto**

### Descripción
Establecer un sistema de carpetas modular que escale con el producto.

### Checklist
- Crear estructura sugerida:
src/
├── components/
├── screens/
├── navigation/
├── services/
├── hooks/
├── theme/
├── types/
└── utils/

- Implementar `NavigationContainer` y un Stack base.
- Añadir un tema inicial (colores, tipografías, estilos base).

### DoD
- App inicial navega entre pantallas dummy.
- El proyecto tiene las carpetas listas para escalar.

---

## **0.4 — Añadir ESLint, Prettier y convenciones del equipo**

### Descripción
Garantizar la consistencia del código y evitar errores comunes desde el inicio.

### Checklist
- Instalar `eslint`, `prettier`, `eslint-config-prettier`, `eslint-plugin-react`.
- Configurar reglas en `.eslintrc.js`.
- Añadir scripts:
- `"lint": "eslint . --ext .ts,.tsx"`
- `"format": "prettier --write ."`
- (Opcional) Instalar `husky` para pre-commits automáticos.

### DoD
- `npm run lint` y `npm run format` funcionan sin errores.

---

## **0.5 — Configurar CI/CD (Expo EAS o GitHub Actions)**

### Descripción
Automatizar builds de la aplicación para pruebas y distribución a testers.

### Checklist
- Conectar repo GitHub a Expo EAS.
- Configurar workflows automáticos:
- Build Android
- Build iOS
- Deploy a testers
- Añadir documentación básica en el README.

### DoD
- Se puede generar un `.apk` o `.aab` de desarrollo.
- CI/CD ejecuta builds sin fallos.

---

## **0.6 — Sembrar datos iniciales en Firestore**

### Descripción
Poblar Firestore con artistas de prueba para validar búsquedas y prototipos UI.

### Checklist
- Añadir 2–3 artistas ficticios con campos:
```json
{
  "name": "Luna Vega Tattoo",
  "city": "Barcelona",
  "styles": ["realismo", "fine line"],
  "rating": 4.9,
  "images": ["https://.../1.jpg"]
}
