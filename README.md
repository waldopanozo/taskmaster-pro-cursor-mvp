# TaskMaster Pro

MVP de **gestión de tareas** orientado a entornos corporativos, pensado para demostrar uso profesional de **Cursor AI**: arquitectura clara, modelo de datos con ORM, API REST con validación, pruebas automatizadas, reglas en `.cursorrules`, y una **capa visual estática** con paleta e inspiración desde **Figma Community**.

**Stack:** Node.js · Express · TypeScript · Prisma · SQLite · Zod · Jest · HTML/CSS estático.

**Repositorio público:** [github.com/waldopanozo/taskmaster-pro-cursor-mvp](https://github.com/waldopanozo/taskmaster-pro-cursor-mvp)

**Vídeo (YouTube):** demostración del bug al crear tareas desde PowerShell/curl y la solución — [youtu.be/MhX3rpg_8rU](https://youtu.be/MhX3rpg_8rU)

**Este `README.md` concentra toda la documentación del proyecto** (pasos del taller, CRUD, diseño/UX, arquitectura, reglas y prompts). El archivo **`.cursorrules`** se mantiene en la raíz porque Cursor lo usa de forma automática; su contenido se reproduce aquí en el [anexo](#anexo-reglas-del-proyecto-cursorrules).

---

## Tabla de chequeo (brief del taller vs lo entregado)

| # | Lo que pidieron | ¿Hecho? | Dónde / cómo |
|---|-----------------|---------|--------------|
| 1 | **Cursor AI** como entorno de desarrollo | Sí | Proyecto creado y documentado para usar con Cursor; `.cursorrules` en la raíz |
| 2 | **Reglas del proyecto** en `.cursorrules` (Clean Architecture, tipado, documentación) | Sí | `.cursorrules` + [anexo](#anexo-reglas-del-proyecto-cursorrules) en este README |
| 3 | **Stack Node.js (Express) o Python (FastAPI)** | Sí | **Node.js + Express + TypeScript** |
| 4 | **SQLite** sin configuración de servidor aparte | Sí | `DATABASE_URL=file:./dev.db`, Prisma |
| 5 | **ORM: Prisma o SQLAlchemy** | Sí | **Prisma** (`prisma/schema.prisma`, migraciones) |
| 6 | **Modelo de tarea:** id, title, description, status (pending/completed), fecha de creación | Sí | `Task`: UUID, `title`, `description?`, `TaskStatus` PENDING/COMPLETED, `createdAt` |
| 7 | **API para gestionar tareas (CRUD)** | Sí | `POST/GET/PUT/DELETE` bajo `/api/tasks` |
| 8 | **Validación de datos** | Sí | Esquemas **Zod** + middleware (`task.schema.ts`, `validateRequest.ts`) |
| 9 | **Manejo global de errores** | Sí | `error.middleware.ts` (`AppError`, `ZodError`, 500) |
| 10 | **Filtrar tareas por estado** | Sí | `GET /api/tasks?status=PENDING` o `COMPLETED` |
| 11 | **Pruebas con Jest o Pytest** | Sí | **Jest** — `npm test` (`*.test.ts`) |
| 12 | **README:** cómo ejecutar la app + prompts usados | Sí | Este README (instalación, scripts, [prompts](#prompts-utilizados-con-cursor)) |
| 13 | **Entrega: código** (ZIP o enlace repo) | Sí | [Repositorio en GitHub](https://github.com/waldopanozo/taskmaster-pro-cursor-mvp) |
| 14 | **Entrega: `.cursorrules`** | Sí | Raíz del proyecto |
| 15 | **Entrega: README** | Sí | Este archivo |
| 16 | **Entrega: vídeo ~1 min** (IA resolviendo un bug) | Sí | [YouTube — demostración TaskMaster Pro](https://youtu.be/MhX3rpg_8rU) (no está en el repo; es enlace externo) |
| — | *Extra (no exigido por el brief mínimo)* | | |
| E1 | Landing estática con paleta e inspiración **Figma Community** | Sí | `public/`, sección [Inspiración visual](#inspiración-visual-y-ux--figma-community) |
| E2 | **Patrón Repository** documentado | Sí | Puerto `TaskRepository` + `PrismaTaskRepository`; [Arquitectura](#arquitectura-y-patrón-repository) |
| E3 | **`GET /health`** y documentación de API con **curl** | Sí | `app.ts` + sección [API REST](#api-rest-crud-y-ejemplos) |
| E4 | **Node 20** vía **fnm** (`.node-version`) | Sí | `.node-version`, [Requisitos previos](#requisitos-previos-y-node-fnm) |

---

## Índice

1. [Tabla de chequeo (brief vs entregado)](#tabla-de-chequeo-brief-del-taller-vs-lo-entregado)
2. [Qué incluye este repositorio](#qué-incluye-este-repositorio)
3. [Requisitos previos y Node (fnm)](#requisitos-previos-y-node-fnm)
4. [Configuración](#configuración)
5. [Ejecución y scripts](#ejecución-y-scripts)
6. [Pasos del taller del curso (STEP 1 a 3)](#pasos-del-taller-del-curso-step-1-a-3)
7. [Inspiración visual y UX — Figma Community](#inspiración-visual-y-ux--figma-community)
8. [Interfaz implementada (landing)](#interfaz-implementada-landing)
9. [API REST, CRUD y ejemplos](#api-rest-crud-y-ejemplos) (incluye **Windows / PowerShell** y `curl.exe`)
10. [Modelo de datos (Prisma / SQLite)](#modelo-de-datos-prisma--sqlite)
11. [Arquitectura y patrón Repository](#arquitectura-y-patrón-repository)
12. [Pruebas](#pruebas)
13. [Estructura de carpetas](#estructura-de-carpetas)
14. [Anexo: reglas del proyecto (`.cursorrules`)](#anexo-reglas-del-proyecto-cursorrules)
15. [Prompts utilizados con Cursor](#prompts-utilizados-con-cursor)
16. [Entrega del taller](#entrega-del-taller)
17. [Licencia](#licencia)

---

## Qué incluye este repositorio

| Elemento | Descripción |
|----------|-------------|
| Código fuente | Backend por capas (`src/`), landing en `public/`, esquema Prisma |
| `.cursorrules` | Reglas para Cursor (mismo contenido resumido en [anexo](#anexo-reglas-del-proyecto-cursorrules)) |
| `README.md` | **Documentación única del proyecto** (este archivo) |
| Vídeo del taller | [YouTube — TaskMaster Pro (bug POST / tasks)](https://youtu.be/MhX3rpg_8rU) |
| Pruebas | Jest (`npm test`) |

**CRUD:** **Create, Read** (lista + por id), **Update** y **Delete** en `/api/tasks`, más **filtro por estado** (`?status=PENDING` o `COMPLETED`). Detalle en [API REST, CRUD y ejemplos](#api-rest-crud-y-ejemplos).

**Entrega académica habitual del taller:** código + `.cursorrules` + README + vídeo corto (≈1 min) sobre uso de IA al resolver un bug — [vídeo en YouTube](https://youtu.be/MhX3rpg_8rU).

---

## Requisitos previos y Node (fnm)

- **Node.js** 18 o superior (recomendado: **20**, en `.node-version` para [fnm](https://github.com/Schniz/fnm))
- **npm**

```bash
cd taskmaster-pro
fnm use
npm install
```

Si fnm indica que la versión no está instalada: `fnm install` o `fnm install 20`. Opcional: `fnm env --use-on-cd`, según la [documentación de fnm](https://github.com/Schniz/fnm).

---

## Configuración

```bash
cd taskmaster-pro
npm install
copy .env.example .env
npx prisma migrate dev
npx prisma generate
```

- **`DATABASE_URL`** (por defecto `file:./dev.db` en `.env.example`) → SQLite; la base se crea al migrar.
- Ajusta **`PORT`** en `.env` si hace falta.

---

## Ejecución y scripts

```bash
npm run dev      # desarrollo con recarga (tsx)
npm run build    # compila TypeScript → dist/
npm start        # ejecuta dist/server.js
```

Por defecto: **`http://localhost:3000`**.

| Script | Acción |
|--------|--------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación |
| `npm start` | Producción (tras `build`) |
| `npm test` / `npm run test:coverage` | Pruebas Jest |
| `npx prisma studio` | Explorar datos SQLite |

---

## Pasos del taller del curso (STEP 1 a 3)

Texto guía: *FullStack development with Cursor Vibe Coding — TaskMaster Pro / SaaS Microservice MVP Guide with Cursor AI*.

### Contexto del brief

| Requisito del taller | Cómo se cubre aquí |
|---------------------|-------------------|
| Stack **Node.js (Express)** o Python (FastAPI) | **Node.js + Express + TypeScript** |
| Base **SQLite** | **SQLite** vía Prisma (`DATABASE_URL=file:./dev.db`) |
| ORM (**Prisma** o SQLAlchemy) | **Prisma** |
| Pruebas (**Jest** o Pytest) | **Jest** (`npm test`) |
| Entrega: código, **`.cursorrules`**, **README**, vídeo | Código, `.cursorrules`, este README; [vídeo en YouTube](https://youtu.be/MhX3rpg_8rU) |

### Paso 1 — Setup and Context

**Enunciado del taller:** crear la carpeta del proyecto y definir reglas en **`.cursorrules`**.

**Prompt sugerido:** *"Generate rules for this project: use Clean Architecture, strong typing, and professional documentation standards."*

**Hecho:** carpeta **`taskmaster-pro/`** y archivo **`.cursorrules`** (arquitectura limpia, TypeScript, API, Prisma, errores, pruebas). Contenido textual en [anexo](#anexo-reglas-del-proyecto-cursorrules).

### Paso 2 — Data Modeling (@Codebase)

**Enunciado:** modelo en **SQLite con ORM** con campos: **id**, **title**, **description**, **status** (pending/completed), **fecha de creación**.

**Prompt sugerido:** *"Create a data model in SQLite using an ORM (Prisma or SQLAlchemy) for a task app with fields: id, title, description, status (pending/completed), and creation date."*

| Campo pedido | Implementación (Prisma) |
|--------------|-------------------------|
| id | `id String @id @default(uuid())` |
| title | `title String` |
| description | `description String?` |
| status | enum `TaskStatus`: `PENDING`, `COMPLETED` |
| fecha de creación | `createdAt DateTime @default(now())` |

- Esquema: **`prisma/schema.prisma`**
- Migraciones: **`prisma/migrations/`**

### Paso 3 — CRUD y lógica de negocio

**Enunciado:** endpoints con **validación**, **manejo global de errores** y **filtrado por estado**.

**Prompt sugerido:** *"Generate the API endpoints to manage tasks. Include data validation and global error handling. Also, create a function to filter tasks by status."*

| Operación | HTTP | Ruta | CRUD |
|-----------|------|------|------|
| Listar | `GET` | `/api/tasks` | Read (colección) |
| Filtrar por estado | `GET` | `/api/tasks?status=PENDING` \| `COMPLETED` | Read + filtro |
| Una tarea | `GET` | `/api/tasks/:id` | Read (ítem) |
| Crear | `POST` | `/api/tasks` | Create |
| Actualizar | `PUT` | `/api/tasks/:id` | Update |
| Eliminar | `DELETE` | `/api/tasks/:id` | Delete |

**Archivos:** rutas `src/presentation/http/routes/task.routes.ts` · servicio `src/application/task.service.ts` · persistencia `src/infrastructure/repositories/prisma-task.repository.ts` · validación Zod `src/presentation/http/schemas/task.schema.ts` · errores `src/presentation/http/middleware/error.middleware.ts` · salud `GET /health` en `src/presentation/http/app.ts`.

### Correspondencia brief → repo

| Paso | Artefacto principal |
|------|---------------------|
| 1 | `.cursorrules` |
| 2 | `prisma/schema.prisma` + migraciones |
| 3 | Rutas + servicio + repositorio + middlewares |

La **landing** en `public/` es una extensión del entregable (identidad visual); no sustituye los pasos anteriores.

---

## Inspiración visual y UX — Figma Community

El proyecto toma **paleta, ritmo y patrones de UX** de kits abiertos de **Figma Community** orientados a **gestión de tareas y dashboards SaaS**. Podés duplicar los archivos en Figma y revisar la guía de cada autor.

### Recursos recomendados (gratis)

| Recurso | Enlace | Qué aporta |
|--------|--------|------------|
| **Plan It — Task & Project Management Dashboard UI Kit** | [Community](https://www.figma.com/community/file/1291115639727516852/plan-it-free-task-project-management-dashboard-ui-kit) | Guía de estilo, componentes, claro/oscuro, wireframes |
| **Task Dashboard — Template UI Kit** | [Community](https://www.figma.com/community/file/1260446927126496958/task-dashboard-template-ui-kit) | Jerarquía, tablas/listas |
| **Task Management Dashboard** | [Community](https://www.figma.com/community/file/1197498556836882883/task-management-dashboard) | Layouts tipo SaaS para tareas |

**Licencia:** en Community cada archivo tiene condiciones del autor; usalos como inspiración y citá el enlace en trabajos académicos.

### Paleta y tokens (`public/styles.css`)

Interpretación propia inspirada en dashboards de productividad: neutros fríos, **acento teal** y estados **pendiente / completado** claros.

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg` | `#F0F4F8` | Fondo general |
| `--color-surface` | `#FFFFFF` | Tarjetas |
| `--color-text` | `#12151A` | Texto principal |
| `--color-text-muted` | `#5E6778` | Secundario |
| `--color-accent` | `#0D9488` | CTAs, enlaces, foco |
| `--color-accent-deep` | `#0F766E` | Hover |
| `--color-pending` | `#EA580C` | Pendiente |
| `--color-done` | `#059669` | Completado |
| `--color-border` | `#E1E7EF` | Bordes |

**Tipografía:** Plus Jakarta Sans (Google Fonts).

### Principios de UX adoptados

1. **Estado visible** (pendiente vs completado con color semántico).
2. **Escaneo en F:** título, subtítulo, acciones, detalle.
3. **Un acento primario;** el resto neutro.
4. **Feedback claro** hacia `/health` y la API.
5. **Accesibilidad básica:** contraste y `:focus-visible` en enlaces.

---

## Interfaz implementada (landing)

- **`public/index.html`:** hero, paleta, ejemplos de estados de tarea, bloques de API.
- **`public/styles.css`:** variables CSS y estilos.
- **`express.static`** en `src/presentation/http/app.ts` → **`/`** es la landing; **`/health`** y **`/api/tasks`** son la API.

Con el servidor en marcha: **http://localhost:3000/** y **http://localhost:3000/health**.

---

## API REST, CRUD y ejemplos

Implementación: `src/presentation/http/routes/task.routes.ts` y `src/application/task.service.ts`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servicio |
| GET | `/` | Landing HTML |
| GET | `/api/tasks` | Lista; `?status=PENDING` o `COMPLETED` |
| GET | `/api/tasks/:id` | Detalle |
| POST | `/api/tasks` | Crear (`title` obligatorio; `description` opcional) |
| PUT | `/api/tasks/:id` | Actualizar (al menos un campo) |
| DELETE | `/api/tasks/:id` | Eliminar (respuesta **204** sin cuerpo) |

Validación **Zod**; negocio con **`AppError`**; **middleware global** para `AppError`, `ZodError` y 500.

### Ejemplos con curl (Linux / macOS / Git Bash)

```bash
curl -s http://localhost:3000/health

curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Revisar informe","description":"Antes del viernes"}'

curl -s "http://localhost:3000/api/tasks?status=PENDING"
```

### Windows (PowerShell)

En **PowerShell**, `curl` **no** es el curl de Unix: es un alias de `Invoke-WebRequest`, con otra sintaxis. Para los mismos ejemplos usá **`curl.exe`** (el ejecutable que viene con Windows 10/11) o los cmdlets nativos.

**Salud del servicio con `curl.exe`:**

```powershell
curl.exe -s http://localhost:3000/health
```

**Equivalente con cmdlet (respuesta como objeto JSON):**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
```

**POST con cuerpo JSON (PowerShell) — recomendado:**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" -Method Post `
  -ContentType "application/json" `
  -Body '{"title":"Revisar informe","description":"Antes del viernes"}'
```

**Importante:** en PowerShell, un comando como  
`curl.exe ... -d "{\"title\":\"Demo\"}"` **suele romper el JSON** (las comillas se interpretan mal y el servidor recibe texto inválido → error 400 `INVALID_JSON` o, en versiones anteriores del manejador, 500). Preferí **`Invoke-RestMethod`** o guardá el JSON en un archivo y usá:

```powershell
Set-Content -Encoding utf8 body.json '{"title":"Demo","description":"Prueba"}' -NoNewline
curl.exe -s -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" --data-binary "@body.json"
```

Si copiás ejemplos “tipo bash” con `curl -s` y fallan o piden parámetros raros (`Uri:`), es porque PowerShell interpretó `curl` como `Invoke-WebRequest`: usá **`curl.exe`** explícito o `Invoke-RestMethod` / `Invoke-WebRequest -Uri ... -UseBasicParsing`.

### Probar todo el CRUD (sustituir `TU-UUID` por el id devuelto al crear)

**Bash / Git Bash:**

```bash
curl -s -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Demo","description":"Prueba CRUD"}'
curl -s http://localhost:3000/api/tasks
curl -s "http://localhost:3000/api/tasks?status=PENDING"
curl -s http://localhost:3000/api/tasks/TU-UUID
curl -s -X PUT http://localhost:3000/api/tasks/TU-UUID -H "Content-Type: application/json" -d '{"status":"COMPLETED"}'
curl -s -X DELETE http://localhost:3000/api/tasks/TU-UUID -w "\nHTTP %{http_code}\n"
```

**PowerShell (misma idea con `curl.exe`; una línea por comando):**

```powershell
curl.exe -s -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"Demo\",\"description\":\"Prueba CRUD\"}"
curl.exe -s http://localhost:3000/api/tasks
curl.exe -s "http://localhost:3000/api/tasks?status=PENDING"
curl.exe -s http://localhost:3000/api/tasks/TU-UUID
curl.exe -s -X PUT http://localhost:3000/api/tasks/TU-UUID -H "Content-Type: application/json" -d "{\"status\":\"COMPLETED\"}"
curl.exe -s -X DELETE http://localhost:3000/api/tasks/TU-UUID -w "`nHTTP %{http_code}`n"
```

---

## Modelo de datos (Prisma / SQLite)

- **`Task`:** `id` (UUID), `title`, `description` (opcional), `status` (`PENDING` \| `COMPLETED`), `createdAt`.
- **`prisma/schema.prisma`** · migraciones en **`prisma/migrations/`**.

---

## Arquitectura y patrón Repository

**Clean Architecture** ligera: dominio sin frameworks; aplicación orquesta; infraestructura implementa detalles; presentación expone HTTP.

### Patrón Repository

1. **Puerto:** `TaskRepository` en `src/application/ports/task.repository.port.ts` (sin Prisma/SQL en la interfaz).
2. **Implementación:** `PrismaTaskRepository` en `src/infrastructure/repositories/prisma-task.repository.ts`.
3. **Consumidor:** `TaskService` no importa `@prisma/client` directamente.

Las pruebas usan **mock** del repositorio (`src/application/task.service.test.ts`), separando negocio de persistencia.

### Composición

En **`src/server.ts`**: se instancia `PrismaTaskRepository`, se inyecta en `TaskService` (**composition root**; sin contenedor IoC en el MVP).

---

## Pruebas

```bash
npm test
```

- Servicio con repositorio mock.
- Esquemas Zod.

---

## Estructura de carpetas

```
taskmaster-pro/
├── .cursorrules
├── .env.example
├── .node-version
├── README.md                 # Documentación completa del proyecto
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── index.html
│   └── styles.css
└── src/
    ├── domain/
    ├── application/
    ├── infrastructure/
    ├── presentation/http/
    ├── shared/errors/
    ├── types/
    └── server.ts
```

---

## Anexo: reglas del proyecto (`.cursorrules`)

Contenido del archivo **`.cursorrules`** en la raíz (Cursor lo lee automáticamente):

### Arquitectura

- **Clean Architecture:** dominio sin dependencias externas; casos de uso en `application`; adaptadores (Prisma, HTTP) en `infrastructure` y `presentation`.
- **Inversión de dependencias:** puertos (`TaskRepository`); la infraestructura implementa contratos.
- **Un archivo, una responsabilidad**; evitar “god modules”.

### TypeScript

- `strict: true`; tipos explícitos en APIs públicas.
- No usar `any` salvo justificación breve en comentario.
- Enums/interfaces de dominio alineados con el modelo persistido; mapear en el repositorio si hace falta.

### API HTTP

- Express con JSON; rutas bajo `/api/tasks`.
- Validación con **Zod**; errores de validación con detalle vía middleware global.
- Códigos: **201** creación, **204** borrado, **404** si no existe el recurso.

### Datos

- **SQLite** con **Prisma**; migraciones en `prisma/migrations/`.
- Secretos solo en `.env` (no commitear); plantilla en `.env.example`.

### Errores y logging

- Negocio con **`AppError`** (status + código opcional).
- Middleware global: `AppError`, `ZodError`, fallback 500; log de errores no controlados en consola.

### Estilo y documentación

- Comentarios breves solo donde aporten contexto de negocio.
- README con instalación, variables y uso de la API (centralizado en este documento).

### Pruebas

- **Jest** para aplicación y validadores; mocks de repositorio en unitarios.

---

## Prompts utilizados con Cursor

1. **Reglas** — *"Generate rules for this project: use Clean Architecture, strong typing, and professional documentation standards."*
2. **Modelo** — *"Create a data model in SQLite using Prisma for a task app with fields: id, title, description, status (pending/completed), and creation date."*
3. **API** — *"Generate the API endpoints to manage tasks. Include data validation and global error handling. Also, create a function to filter tasks by status."*
4. **Pruebas** — *"Add Jest tests for TaskService with a mocked TaskRepository and Zod schemas for tasks."*
5. **Visual** — inspiración Figma Community, paleta teal/neutral y landing en `public/`.

---

## Entrega del taller

Incluí en tu ZIP o repositorio:

- Código fuente (este proyecto está en **[GitHub — taskmaster-pro-cursor-mvp](https://github.com/waldopanozo/taskmaster-pro-cursor-mvp)**)
- **`.cursorrules`**
- **`README.md`** (este archivo)
- Vídeo del taller (≈1 min): **[YouTube — youtu.be/MhX3rpg_8rU](https://youtu.be/MhX3rpg_8rU)** (creación de tareas, PowerShell/curl y solución del error de JSON)

---

## Licencia

MIT
