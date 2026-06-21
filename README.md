# ReCode Studio — Web Oficial

Esta es la plataforma web oficial de **ReCode Studio**, construida con tecnologías de alto rendimiento, preparada para la captación, precalificación y estimación de proyectos de software a medida.

## Tecnologías Utilizadas

- **Core**: [Next.js 16 (App Router)](https://nextjs.org/) con [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Base de Datos y Autenticación**: [Supabase](https://supabase.com/)
- **Formularios**: [React Hook Form](https://react-hook-form.com/) y [Zod](https://zod.dev/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Gráficos**: [Recharts](https://recharts.org/)

---

## Estructura del Proyecto

```bash
├── docs/
│   └── prompts-proyectos-recode.md   # Prompts de proyectos de ReCode Labs
├── src/
│   ├── app/
│   │   ├── admin/                    # Panel Administrativo CRM y Reglas
│   │   ├── portal-clientes/          # Autogestión de clientes
│   │   ├── diagnostico/              # Diagnóstico digital paso a paso
│   │   ├── precotizador/             # Calculadora inteligente
│   │   ├── calculadora-ahorro/       # ROI de automatización
│   │   ├── comparador/               # Comparador estándar vs custom
│   │   ├── soluciones/               # Rutas dinámicas de soluciones
│   │   ├── proyectos/                # Portfolio conceptual (ReCode Labs)
│   │   └── (institucionales)/        # Nosotros, FAQ, Contacto, Legal
│   ├── components/                   # Componentes reutilizables (Header, Footer, etc.)
│   └── lib/
│       └── db.ts                     # Cliente de base de datos híbrido
└── supabase/
    └── migrations/
        └── 20260621000000_init.sql   # Esquema SQL inicial de Supabase
```

---

## Modo de Persistencia Híbrida (Fallback)

Si la aplicación no detecta las variables de entorno de Supabase, **se activa automáticamente el modo fallback**.
En este modo:
- Las lecturas de catálogo (servicios, proyectos) usan datos semillas estáticos incorporados.
- Las escrituras (leads, cotizaciones, respuestas del diagnóstico, reuniones agendadas) se almacenan localmente en el navegador del visitante usando `LocalStorage`.
- El **Panel de Administración** (`/admin`) permite ver, filtrar, y calificar los leads guardados localmente, y editar las reglas de precios del precotizador de forma persistente.

---

## Guía de Configuración Local

### 1. Clonar e Instalar dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto. Podés tomar como referencia `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
```

### 3. Ejecutar Migraciones SQL
Si deseas usar Supabase en producción:
1. Crea un proyecto en [Supabase Console](https://database.new).
2. Ve a la sección **SQL Editor** y ejecuta el script completo en `supabase/migrations/20260621000000_init.sql` para crear las tablas, relaciones y políticas RLS.
3. Las variables de entorno se sincronizarán y el sitio comenzará a escribir directamente en la base de datos remota de PostgreSQL.

### 4. Levantar Servidor de Desarrollo
```bash
npm run dev
```
Accede a `http://localhost:3000` en tu navegador.

---

## Manual del Panel de Administración (`/admin`)

El panel de administración permite la gestión interna comercial.
- **Acceso Demo**:
  - Email: `admin@recodestudio.com`
  - Contraseña: `recode2026`

### Secciones Disponibles:
1. **Gestión de Leads**: Listado de contactos recibidos. Al hacer clic en un lead podés:
   - Ver su **Lead Score** calculado automáticamente de 0 a 100 y su prioridad comercial.
   - Leer sus respuestas al diagnóstico impositivo o los módulos seleccionados en el cotizador.
   - Cambiar el estado del lead (ej: Nuevo, Contactado, Reunión Agendada).
   - Escribir notas internas de seguimiento.
2. **Reglas del Cotizador**: Lista de valores base de soluciones y adicionales. Podés hacer clic en el botón de edición para modificar cualquier precio. Los cambios se verán reflejados inmediatamente en la calculadora de la web pública.
3. **Métricas de Embudo**: Ratios de tráfico y desempeño del embudo de ventas.

---

## Activación de Integraciones Externas

Cuando desees conectar las pasarelas reales:
- **Mercado Pago**: Carga tus credenciales de SDK e inicializa las preferencias de cobro en `src/app/portal-clientes` y `src/app/precotizador` (reemplazando los mocks de alerta).
- **Notificaciones por Email (Resend)**: Configura la API Key de Resend en el servidor para disparar correos automáticos en el Server Action de guardado de leads.
- **WhatsApp Cloud API**: Registra un webhook en Meta Developers y llama al endpoint de envío de plantillas de WhatsApp al crearse un lead prioritario.
# recode
