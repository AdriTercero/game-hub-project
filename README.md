# GameHub & Services Ecosystem

> Plataforma de referencia para la industria del videojuego — proyecto universitario de Ingeniería del Software, UMH GIITI 2º curso, 2025–2026.

---

## Índice

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Estructura de archivos](#estructura-de-archivos)
- [Instalación y despliegue](#instalación-y-despliegue)
- [API Reference](#api-reference)
- [Roles y permisos](#roles-y-permisos)
- [Equipo](#equipo)

---

## Descripción

GameHub centraliza en una sola plataforma web los principales recursos del sector del videojuego:

- **Catálogo** de juegos con puntuaciones de prensa y comunidad, filtrado por género, plataforma, año y nota
- **Noticias** del sector con sistema de categorías y paginación
- **Blog de opinión** con artículos de redactores y colaboradores externos
- **Multimedia** con streams en directo (Twitch) y trailers (YouTube)
- **Agenda** de lanzamientos, ferias y convenciones en formato calendario mensual
- **Sistema de usuarios** con cuatro roles diferenciados (Admin, Redactor, Colaborador, Suscriptor)
- **Dashboards** personalizados por rol con KPIs, gestión de contenido y moderación
- **Internacionalización** completa ES/EN con cambio de idioma en tiempo real

Todo el contenido es de carácter demostrativo y académico.

---

## Tecnologías

|     Capa      |                           Tecnología                          |
|---------------|---------------------------------------------------------------|
| Frontend      | HTML5, CSS3, JavaScript vanilla                               |
| Backend       | Python 3.10+, Flask, Flask-Bcrypt, Flask-CORS                 |
| Base de datos | MySQL 8.0                                                     |
| Comunicación  | API REST con JSON, cookies HttpOnly                           |
| Seguridad     | Bcrypt (hashing), prepared statements, sanitización XSS, RBAC |
| Dev tools     | VS Code + Live Server, MySQL Workbench / phpMyAdmin           |

---

## Arquitectura

```
Browser (frontend)
      │  fetch /api/*  credentials: include
      ▼
Flask REST API (backend)
      │  mysql-connector
      ▼
MySQL 8.0 (game_hub_db)
```

El frontend y el backend están completamente desacoplados. El frontend hace peticiones a la API mediante `fetch` con `credentials: 'include'` para que la cookie de sesión se adjunte automáticamente. El backend valida la cookie en cada endpoint protegido mediante `verify_role_and_session()`.

---

## Estructura de archivos

```
game-hub/
├── backend/
│   ├── app.py              ← API Flask principal
│   ├── requirements.txt
│   └── .env                ← variables de entorno
│              
├── database/
│   ├── schema.sql          ← estructura de tablas
│   └── seeds.sql           ← datos de prueba
│
└── frontend/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── catalogo.html
    ├── noticias.html
    ├── blog.html
    ├── post.html
    ├── multimedia.html
    ├── agenda.html
    ├── dashboard-suscriptor.html
    ├── dashboard-admin.html
    ├── dashboard-redactor.html
    ├── dashboard-colaborador.html
    ├── css/
    │   ├── base.css            ← variables, reset, navbar, footer, drawer
    │   ├── dashboard.css       ← shell compartido de todos los dashboards
    │   ├── dashboard-admin.css
    │   ├── dashboard-redactor.css
    │   ├── dashboard-colaborador.css
    │   └── [página].css
    └── js/
        ├── i18n.js             ← sistema de traducciones ES/EN
        ├── base.js             ← tema, drawer, footer (inyectados automáticamente)
        ├── modals.js           ← modales: Sobre, Contacto, Privacidad, TOS, Equipo
        └── [página].js
```

---

## Instalación y despliegue

### Requisitos previos

- Python 3.10 o superior
- MySQL Server 8.0 o superior (o XAMPP / Laragon)
- Visual Studio Code con la extensión **Live Server** (Ritwick Dey)

### 1. Base de datos

```sql
-- En MySQL Workbench o phpMyAdmin:
SOURCE database/schema.sql;
SOURCE database/seeds.sql;
```

### 2. Backend

```bash
cd backend

# Crear y activar entorno virtual
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

Crear el archivo `.env` en `backend/`:

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=cambia_esto_por_una_clave_segura

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=game_hub_db
```

Arrancar el servidor:

```bash
python app.py
# → http://127.0.0.1:5000
```

### 3. Frontend

1. Abre la carpeta `frontend/` en VS Code
2. Haz clic derecho sobre `index.html` → **Open with Live Server**
3. El navegador abrirá `http://127.0.0.1:5500/`

> **Nota sobre reproductores multimedia:** Los embeds de Twitch y YouTube requieren un dominio público con HTTPS. En entorno local solo se puede forzar manualmente un canal conocido; la integración completa funciona únicamente en producción con dominio real.

---

## API Reference

Todos los endpoints tienen el prefijo `/api`. Los endpoints protegidos requieren la cookie `session_token` activa.

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/register` | — | Registro de nuevo usuario (rol Suscriptor) |
| POST | `/api/login` | — | Inicio de sesión, devuelve cookie + `role_id` |
| POST | `/api/logout` | cualquiera | Cierra sesión eliminando la cookie |
| GET | `/api/auth/me` | cualquiera | Datos del usuario autenticado |
| GET | `/api/catalog` | — | Catálogo con filtros `genre`, `platform`, `page` |
| GET | `/api/games/<id>` | — | Ficha completa de un juego |
| GET | `/api/news` | — | Noticias con filtros `category`, `page` |
| GET | `/api/news/<id>` | — | Noticia individual con comentarios |
| POST | `/api/news` | Admin / Redactor | Publicar noticia |
| GET | `/api/posts` | — | Posts del blog con filtros `category`, `page` |
| GET | `/api/posts/<id>` | — | Post individual con comentarios |
| POST | `/api/comments` | cualquiera | Añadir comentario a una noticia |
| GET | `/api/events` | — | Eventos con filtros `type`, `year`, `month` |
| GET | `/api/dashboard/me` | cualquiera | KPIs, actividad, favoritos y recomendaciones |
| POST | `/api/favorites` | cualquiera | Añadir juego a favoritos |
| DELETE | `/api/favorites/<game_id>` | cualquiera | Quitar juego de favoritos |
| GET | `/api/admin/users` | Admin | Listado de usuarios con filtros y búsqueda |
| PUT | `/api/admin/users/<id>/role` | Admin | Cambiar rol de un usuario |

### Ejemplo de request / response

```js
// Login
const res = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ identifier: 'usuario@email.com', password: '1234' })
});
const data = await res.json();
// { message: 'Login exitoso', role_id: 3 }
```

---

## Roles y permisos

| ID |     Rol     |                              Puede hacer                              |
|----|-------------|-----------------------------------------------------------------------|
| 1  | Admin       | Todo — gestión de usuarios, roles, contenido y moderación             |
| 2  | Redactor    | Publicar y editar noticias/posts, aprobar artículos de colaboradores  |
| 3  | Suscriptor  | Comentar, añadir favoritos, guardar eventos                           |
| 4  | Colaborador | Proponer artículos (quedan en revisión hasta aprobación del redactor) |

El sistema aplica **bloqueo temporal** tras 5 intentos de login fallidos consecutivos (gestionado tanto en cliente como en servidor).

---

## Equipo

Proyecto desarrollado por el equipo **PatataSoft** para la asignatura de Ingeniería del Software — UMH GIITI, curso 2025–2026.

|        Integrante        |            Rol            |
|--------------------------|---------------------------|
| Adrian Tercero Delicado  | Project Manager & Backend |
| Pablo Fernández Llorca   | Frontend & UX/UI          |
| Alejandro Pomares García | Backend & Base de Datos   |
| Pedro Martínez Torres    | QA & Documentación        |

---

> Proyecto académico — todo el contenido mostrado en la plataforma es de ejemplo y no constituye información comercial real.
