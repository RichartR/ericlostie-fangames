# 🎮 Eric Lostie Fangames — Portal Web & CMS Visual

[![React 19](https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel%20Edge%20CDN-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint-teal)](https://oxc.rs/)

> **Portal web oficial y sistema de gestión de contenidos (CMS) interactivo** dedicado a la obra del creador de fangames de Pokémon **Eric Lostie** (_Pokémon Iberia, Pokémon Ópalo, Pokémon Añil, Pokémon Titán_). Diseñado con estética premium, carga ultrarrápida optimizada para Vercel Edge CDN y un panel de administración visual WYSIWYG en vivo.

---

## 🌟 Características Principales

### 🎯 Experiencia de Usuario (Pública)

- **Catálogo Interactivo**: Tarjetas de juegos con metadatos claros (versión, año, idiomas, plataformas disponibles PC/Android).
- **Modal de Detalle Completo**:
  - Sinopsis inmersiva con especificaciones del juego.
  - Lista de características destacadas con validación visual.
  - Gestor de descargas multiespejo (Mega, Mediafire, Google Drive) clasificadas por plataforma.
  - Galería visual de capturas con visor lightbox responsive.
  - Pestaña de agradecimientos comunitarios (artistas, compositores, testers).
- **Guía de Instalación Dinámica**: Instrucciones paso a paso para jugar en PC (nativo / launcher) y Android (Kirin).
- **Diseño 100% Vanilla CSS**: Sin sobrecarga de frameworks utilitarios, sistema de diseño basado en variables CSS, microanimaciones fluidas y tipografía moderna.

### ⚡ CMS Visual en Vivo para Administración (`#admin`)

- **Acceso Administrativo Seguro**: Autenticación gestionada vía **Supabase Auth** con persistencia de sesión y control de acceso.
- **Edición en Vivo (In-Place WYSIWYG)**: Modifica títulos, sinopsis, banners y especificaciones directamente sobre el mismo modal visual que ven los usuarios.
- **Reordenación Drag & Drop Orgánica**: Arrastra tarjetas con puntero táctil o ratón para definir el orden público de los juegos en tiempo real, sincronizado con base de datos.
- **Gestión Relacional en Cascada**:
  - Creación de juegos con generación automática de slug y borradores temporales en memoria para descargas, capturas y menciones.
  - Añadir, editar o eliminar servidores de descarga y capturas sin recargar la página.
  - Ocultar o publicar juegos con un solo clic (modo archivado).

### 🚀 Optimización de Arquitectura & Caching

- **Vercel Edge Network CDN**: Reglas de caché inmutable (`Cache-Control: public, max-age=31536000, immutable`) en `vercel.json` para bundles y recursos multimedia.
- **Code-Splitting Inteligente**: Configuración de `manualChunks` en Vite para aislar `vendor-react`, `vendor-supabase` y `vendor-icons`, minimizando el tiempo de primera carga.
- **Keep-Alive Automatizado**: Workflow de GitHub Actions (`.github/workflows/keep-alive.yml`) programado para mantener activo el proyecto Supabase de capa gratuita sin interrupciones.

---

## 🏗️ Arquitectura del Proyecto

```
ericlostie-fangames/
├── .github/
│   └── workflows/
│       └── keep-alive.yml          # Cron action para mantener activo Supabase
├── public/                         # Assets estáticos (logos, capturas, portadas)
├── src/
│   ├── components/                 # Componentes de interfaz pública
│   │   ├── admin/                  # Módulos desacoplados del CMS Admin
│   │   │   ├── AdminLogin.jsx          # Formulario de inicio de sesión seguro
│   │   │   ├── AdminNavbar.jsx         # Barra de navegación administrativa
│   │   │   ├── AdminGameCards.jsx      # Grilla de juegos con Drag & Drop
│   │   │   ├── AdminLiveEditModal.jsx  # Editor interactivo en vivo
│   │   │   └── AdminCreateModal.jsx    # Modal de creación con borradores
│   │   ├── AdminPortal.jsx         # Orquestador del panel de administración
│   │   ├── Hero.jsx                # Portada principal con llamadas a la acción
│   │   ├── GamesCatalog.jsx        # Grid público de juegos
│   │   ├── GameDetailModal.jsx     # Modal público de detalles y descargas
│   │   ├── HowToPlay.jsx           # Guías de instalación PC/Android
│   │   ├── CommunitySocials.jsx    # Enlaces oficiales y redes sociales
│   │   ├── Navbar.jsx              # Navegación pública con anclas suaves
│   │   └── Footer.jsx              # Pie de página y créditos legales
│   ├── services/
│   │   └── supabaseService.js      # Capa de datos desacoplada y consultas Supabase
│   ├── App.jsx                     # Componente raíz con detección de ruta #admin
│   ├── index.css                   # Sistema de diseño global y variables CSS
│   └── main.jsx                    # Punto de entrada de React 19
├── vercel.json                     # Cabeceras de caché CDN y rewrites SPA
├── vite.config.js                  # Configuración de compilación y chunking
└── package.json
```

---

## 🗄️ Modelo de Datos (Supabase PostgreSQL)

La base de datos relacional modela el catálogo de fangames en las siguientes tablas:

| Tabla              | Descripción                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `games`            | Registro principal del juego (título, slug, versión, estado, año, descripción, banner, orden). |
| `downloads`        | Servidores y enlaces de descarga vinculados a un juego por `game_id` (Mega, Mediafire, Drive). |
| `screenshots`      | Capturas de pantalla con orden de visualización asociadas por `game_id`.                       |
| `game_features`    | Puntos clave y mecánicas destacadas de cada juego.                                             |
| `acknowledgements` | Créditos y colaboraciones especiales (artistas, animadores, enlaces).                          |

---

## ⚙️ Instalación y Desarrollo Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/RichartR/ericlostie-fangames.git
cd ericlostie-fangames
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación se ejecutará en `http://localhost:5173`. Para acceder al panel de administración, añade el hash `#admin` a la URL:
`http://localhost:5173/#admin`

---

## 🧪 Calidad de Código y Build

- **Linter ultra rápido**:
  ```bash
  npm run lint
  ```
- **Compilación para producción**:
  ```bash
  npm run build
  ```
- **Previsualizar bundle de producción**:
  ```bash
  npm run preview
  ```

---

## 🚀 Despliegue en Vercel

El proyecto está preparado para despliegue directo en **Vercel**:

1. Conecta el repositorio en Vercel.
2. Añade las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. El archivo `vercel.json` se encarga automáticamente de:
   - Rutas SPA (fallback a `/index.html`).
   - Caching inmutable de 1 año para JavaScript y CSS versionados.
   - Caching de 30 días para imágenes y banners en el Edge CDN.

---

## 📄 Licencia y Reconocimientos

- Desarrollado como proyecto de exhibición técnica para catálogo y CMS.
- Los fangames, marcas y personajes pertenecen a sus respectivos autores y a **Eric Lostie** / **Nintendo / Game Freak**.
- Este proyecto es una obra sin fines de lucro creada con fines comunitarios y divulgativos.
