import { createClient } from '@supabase/supabase-js';

// Types Definitions
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  features: string[];
  example_use: string;
  is_active: boolean;
}

export interface EmailTemplate {
  id: string;
  key_name: string;
  subject: string;
  body_html: string;
  body_text: string;
  is_active: boolean;
  updated_at: string;
}

export interface EmailSetting {
  id: string;
  key_name: string;
  value: string;
  description?: string;
  updated_at: string;
}

export interface Solution {
  id: string;
  name: string;
  slug: string;
  description: string;
  complexity_level: 'Bajo' | 'Medio' | 'Alto' | 'Avanzado';
  features: string[];
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  category: string;
  industry: string;
  type: string;
  status: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  is_concept: boolean;
  mockup_desktop?: string;
  mockup_mobile?: string;
  flow_diagram?: any;
  internal_view?: string;
  integrations?: string[];
  suggested_phases?: string[];
}

export interface Lead {
  id: string;
  code: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  city?: string;
  province?: string;
  industry?: string;
  service_interest?: string;
  message?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  status: 'Nuevo' | 'Contactado' | 'Reunión agendada' | 'Diagnóstico realizado' | 'Propuesta enviada' | 'Negociación' | 'Ganado' | 'Perdido' | 'Pausado';
  priority: 'Prioridad alta' | 'Oportunidad calificada' | 'En evaluación' | 'Proyecto inicial' | 'Consulta informativa';
  score: number;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  notes?: LeadNote[];
  events?: LeadEvent[];
}

export interface LeadNote {
  id: string;
  lead_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface LeadEvent {
  id: string;
  lead_id: string;
  event_type: string;
  description: string;
  created_at: string;
}

export interface Diagnostic {
  id: string;
  lead_id?: string;
  recommended_solution: string;
  suggested_modules: string[];
  complexity: 'Bajo' | 'Medio' | 'Alto' | 'Avanzado';
  estimated_weeks: number;
  answers: { question: string; answer: string }[];
  created_at: string;
}

export interface Quote {
  id: string;
  lead_id?: string;
  userId?: string;
  quoteCode?: string;
  companyName?: string;
  project_type: string;
  selected_modules: string[];
  complexity: 'Bajo' | 'Medio' | 'Alto' | 'Avanzado';
  estimated_min: number;
  estimated_max: number;
  estimated_weeks: number;
  currency: string;
  notes?: string;
  status?: 'pendiente' | 'revisada' | 'aprobada' | 'rechazada' | 'convertida';
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  companyName: string;
  password?: string;
  createdAt: string;
}

export interface ProjectPhase {
  phaseNumber: number;
  title: string;
  status: 'completado' | 'en_proceso' | 'pendiente' | 'bloqueado';
  progress: number;
  estimatedDate: string;
  description: string;
}

export interface ClientProject {
  id: string;
  projectCode: string;
  quoteId: string;
  userId: string;
  name: string;
  status: 'activo' | 'completado' | 'pausado';
  startDate: string;
  estimatedDeliveryDate: string;
  assignedPM: string;
  progress: number;
  phases: ProjectPhase[];
  createdAt: string;
}

export interface Message {
  id: string;
  userId: string;
  projectId?: string;
  quoteId?: string;
  category: 'general' | 'cambio_alcance' | 'soporte' | 'documentos' | 'pagos';
  message: string;
  sender: 'client' | 'recode';
  status: 'open' | 'review' | 'replied' | 'closed';
  createdAt: string;
}

export interface Document {
  id: string;
  userId: string;
  projectId?: string;
  quoteId?: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  status: 'recibido' | 'revisado' | 'falta_informacion' | 'aprobado';
  uploadedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  period: string;
  status: 'pendiente' | 'pagado' | 'vencido';
  dueDate: string;
  paidAt?: string;
  comprobanteUploaded?: boolean;
}

export interface QuoteRule {
  id: string;
  category: 'base_price' | 'additional_module' | 'multiplier';
  key_name: string;
  label: string;
  value: number;
  currency: string;
  is_active: boolean;
}

export interface Meeting {
  id: string;
  lead_id?: string;
  meeting_type: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

// Initial Mock Data Setup (Used if Supabase is offline/missing)
const DEFAULT_SERVICES: Service[] = [
  { id: 's1', name: 'Páginas Web Personalizadas', slug: 'paginas-web', description: 'Diseño único adaptado a tu marca con código desde cero, velocidad extrema y optimización SEO.', category: 'web', features: ['Diseño a medida', 'Panel auto-administrable', 'Optimizado para SEO', 'Carga rápida'], example_use: 'Sitio institucional premium para empresas de servicios', is_active: true },
  { id: 's2', name: 'Ecommerce Profesional', slug: 'ecommerce', description: 'Tiendas online pensadas para vender más con pasarelas de pago y envíos integrados.', category: 'ecommerce', features: ['Carrito de compras', 'Mercado Pago / Stripe', 'Integración de Envíos', 'Cupón de descuentos'], example_use: 'Venta de productos físicos a nivel nacional', is_active: true },
  { id: 's3', name: 'Ecommerce con Gestión Interna', slug: 'ecommerce-gestion-interna', description: 'Solución completa que unifica la tienda online con tus paneles internos de administración.', category: 'ecommerce', features: ['Sincronización de Stock', 'Cuentas corrientes', 'Fichero de clientes', 'Reportes contables'], example_use: 'Negocio de retail con venta minorista y mayorista integrada', is_active: true },
  { id: 's4', name: 'Sistemas de Gestión', slug: 'sistemas-gestion', description: 'Herramientas a medida para organizar inventario, tareas, clientes y procesos de tu negocio.', category: 'system', features: ['Gestión de Stock', 'Flujo de tareas', 'Módulo de Clientes', 'Roles de empleados'], example_use: 'Control operativo de pymes y talleres de servicios', is_active: true },
  { id: 's5', name: 'Sistemas Contables', slug: 'sistemas-contables', description: 'Controles de caja, facturación, cuentas corrientes y reportes de rentabilidad automáticos.', category: 'system', features: ['Cajas diarias', 'Facturas PDF', 'Cuentas Corrientes', 'Reportes contables'], example_use: 'Control de gastos y caja para estudios profesionales', is_active: true },
  { id: 's6', name: 'Automatización de Procesos', slug: 'automatizacion', description: 'Eliminamos tareas repetitivas conectando tus planillas con notificaciones automáticas por mail y WhatsApp.', category: 'automation', features: ['WhatsApp API', 'Emails transaccionales', 'Alertas internas', 'Recordatorios de turnos'], example_use: 'Envío de presupuestos y alertas de vencimiento automáticas', is_active: true },
  { id: 's7', name: 'Portales de Clientes', slug: 'portales-clientes', description: 'Área privada para que tus clientes descarguen facturas, vean avances y soliciten soporte.', category: 'system', features: ['Acceso seguro con clave', 'Descarga de documentos', 'Historial de pagos', 'Mensajería interna'], example_use: 'Estudio de arquitectura compartiendo entregables con clientes', is_active: true },
  { id: 's8', name: 'CRM a Medida', slug: 'crm', description: 'Seguimiento exacto de prospectos, cotizaciones y flujos de ventas comerciales.', category: 'system', features: ['Pipeline de ventas', 'Ficha de prospecto', 'Historial de contacto', 'Tareas pendientes'], example_use: 'Equipo comercial inmobiliario gestionando consultas', is_active: true },
  { id: 's9', name: 'Dashboards y Métricas', slug: 'dashboards', description: 'Visualizá toda la información clave de tu negocio en un solo panel gráfico interactivo.', category: 'system', features: ['Gráficos dinámicos', 'Exportación CSV/PDF', 'KPIs principales', 'Filtros avanzados'], example_use: 'Directores visualizando rentabilidad mensual por unidad', is_active: true },
  { id: 's10', name: 'Sistemas de Turnos', slug: 'sistemas-turnos', description: 'Agenda online para clientes, reservas por WhatsApp, pagos señados y gestión de profesionales.', category: 'system', features: ['Calendario interactivo', 'Recordatorios automáticos', 'Pago de señas', 'Paneles para profesionales'], example_use: 'Clínica médica o estética con múltiples consultorios', is_active: true },
  { id: 's11', name: 'Integraciones Especiales', slug: 'integraciones', description: 'Conexión segura entre tus sistemas actuales, APIs externas y bases de datos heredadas.', category: 'automation', features: ['Conexión de APIs', 'Sincronización horaria', 'Migración segura', 'Logs de auditoría'], example_use: 'Conectar un ERP local con una plataforma web externa', is_active: true },
  { id: 's12', name: 'Web Apps Complejas', slug: 'web-apps', description: 'Desarrollos avanzados a medida para plataformas escalables de software como servicio (SaaS).', category: 'web', features: ['Arquitectura SaaS', 'Base de datos robusta', 'Planes de suscripción', 'Multi-tenant'], example_use: 'Plataforma para gestión de flotas y conductores en tiempo real', is_active: true }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p1',
    slug: 'bruma-moda',
    name: 'Bruma Moda',
    category: 'ecommerce',
    industry: 'Indumentaria y Accesorios',
    type: 'Ecommerce + Gestión Interna',
    status: 'concept',
    description: 'Tienda online personalizada para negocios de indumentaria, accesorios o decoración que necesitan vender online y gestionar su operación real desde un panel interno unificado.',
    problem: 'La marca gestionaba ventas web por una plantilla tradicional, pero controlaba stock, condicionales, cuentas corrientes de clientes mayoristas y entregas mediante planillas Excel desconectadas, duplicando el trabajo y generando errores de inventario.',
    solution: 'Creamos una plataforma web a medida que integra la tienda online con un panel administrativo interno de gestión en tiempo real. Los clientes compran minorista y mayorista, y el equipo administra inventario, despachos, condicionales y cuentas corrientes en el mismo lugar.',
    features: [
      'Tienda online 100% personalizada y optimizada para mobile',
      'Gestión de variantes de talles, colores y stock sincronizados',
      'Pasarela de cobro integrado con Mercado Pago y cotizador de Correo Argentino',
      'Panel administrador para control de inventario y pedidos',
      'Módulo de Cuentas Corrientes y control de mercadería "en condicional" para revendedoras',
      'Portal privado de cliente para ver historial de compras y saldos adeudados',
      'Emails transaccionales y notificaciones de WhatsApp automáticas'
    ],
    is_concept: true,
    suggested_phases: ['Fase 1: Tienda Online y Panel de Control de Stock', 'Fase 2: Módulo de Cuentas Corrientes y Revendedoras', 'Fase 3: Portal de Clientes y Automatizaciones por WhatsApp'],
    integrations: ['Mercado Pago', 'Correo Argentino', 'WhatsApp Business API', 'Factura Electrónica AFIP']
  },
  {
    id: 'p2',
    slug: 'contanova-estudio',
    name: 'ContaNova Estudio',
    category: 'management',
    industry: 'Estudios Contables',
    type: 'Sistema Contable + Portal de Clientes',
    status: 'concept',
    description: 'Web profesional y portal privado para la organización de vencimientos, carga de documentos, tareas y liquidación de impuestos de clientes del estudio contable.',
    problem: 'Dificultad para recibir documentación de clientes de forma ordenada, consultas constantes por WhatsApp sobre fechas de vencimientos y demoras en el envío de liquidaciones mensuales, generando fricción y cuellos de botella.',
    solution: 'Desarrollamos una plataforma institucional con un Portal Privado de Clientes donde cada empresa accede con su usuario para subir facturas, descargar liquidaciones de IVA/Sueldos, y ver alertas de su calendario fiscal personalizado.',
    features: [
      'Web pública para captar empresas y autónomos con calculadora fiscal',
      'Portal del cliente seguro con visualización de calendario y vencimientos',
      'Sistema drag & drop para carga de facturas, balances y documentación',
      'Panel interno contable para ver clientes por CUIT y estado de trámites',
      'Recordatorios automatizados de vencimientos vía mail y notificaciones web',
      'Módulo de facturación de honorarios del estudio con cobro electrónico'
    ],
    is_concept: true,
    suggested_phases: ['Fase 1: Web Pública y Portal del Cliente Básico', 'Fase 2: Calendario Fiscal Automático y Panel de Tareas Contables', 'Fase 3: Carga Avanzada de Archivos con Clasificación Automática'],
    integrations: ['Mercado Pago (Débito Automático)', 'Google Drive / Storage', 'Notificaciones por Email (Resend)', 'WhatsApp Webhook']
  },
  {
    id: 'p3',
    slug: 'agrolink-repuestos',
    name: 'AgroLink Repuestos',
    category: 'management',
    industry: 'Maquinaria y Repuestos Agrícolas',
    type: 'Web + CRM + Portal de Clientes',
    status: 'concept',
    description: 'Catálogo de piezas de repuestos para maquinaria agrícola, cotizador interactivo, solicitudes posventa y seguimiento técnico de equipos.',
    problem: 'Los productores rurales necesitaban repuestos específicos con urgencia. El proceso de cotización telefónico era lento, sin historial de reparaciones por maquinaria y sin alertas automáticas de service.',
    solution: 'Desarrollamos un portal integral de autogestión donde el productor registra su flota de maquinaria, calcula el desgaste de piezas clave, solicita presupuestos y hace seguimiento de órdenes de trabajo en taller.',
    features: [
      'Buscador técnico avanzado de repuestos por modelo y marca',
      'Portal de clientes con registro de maquinaria (Modelo, Año, Horas de uso)',
      'Calculadora interactiva de desgaste de consumibles (cuchillas, correas)',
      'CRM interno para gestión de presupuestos técnicos e historial de service',
      'Alertas preventivas de service al agricultor según las horas de uso declaradas',
      'Generador de reportes de mantenimiento y costo operativo anual en PDF'
    ],
    is_concept: true,
    suggested_phases: ['Fase 1: Catálogo y Cotizador de Repuestos con CRM interno', 'Fase 2: Portal del Cliente con Historial de Maquinaria', 'Fase 3: Módulo de Taller y Órdenes de Trabajo en Tiempo Real'],
    integrations: ['WhatsApp API (Notificación al campo)', 'ERP de Inventario Local', 'Generador PDF Automático']
  },
  {
    id: 'p4',
    slug: 'nexoturnos-salud',
    name: 'NexoTurnos Salud',
    category: 'management',
    industry: 'Salud y Estética',
    type: 'Sistemas de Turnos + Gestión Profesional',
    status: 'concept',
    description: 'Sistema web para centralizar turnos online, disponibilidad médica, fichas de pacientes y recordatorios automáticos de asistencia.',
    problem: 'Alta tasa de ausentismo en turnos agendados, superposición horaria de profesionales y pérdida de tiempo del personal administrativo coordinando citas manualmente.',
    solution: 'Plataforma con agenda interactiva para pacientes que valida prepagas, permite el abono de una seña (Mercado Pago) para evitar ausentismo, y envía alertas automáticas por WhatsApp para confirmación o cancelación de citas.',
    features: [
      'Reserva de turnos online por profesional, especialidad y obra social/prepaga',
      'Portal del paciente con historial de turnos, indicaciones médicas y descargas',
      'Panel del profesional para ver agenda diaria, bloqueo de horarios y notas',
      'Módulo administrativo para control de consultorios, pagos de copagos y cancelaciones',
      'Notificaciones y alertas automatizadas por WhatsApp 24 horas antes del turno',
      'Estadísticas de ausentismo y facturación por profesional'
    ],
    is_concept: true,
    suggested_phases: ['Fase 1: Motor de Turnos y Panel de Pacientes', 'Fase 2: Integración de Pagos de Señas y Notificaciones por WhatsApp', 'Fase 3: Portal del Profesional y Ficha de Evolución Básica'],
    integrations: ['Mercado Pago API', 'Google Calendar API (Sincronización médica)', 'WhatsApp Business Cloud API']
  },
  {
    id: 'p5',
    slug: 'ruta-norte-logistica',
    name: 'Ruta Norte Logística',
    category: 'management',
    industry: 'Transporte y Logística',
    type: 'Sistema de Flota + Seguimiento de Cargas',
    status: 'concept',
    description: 'Plataforma logística integral para gestionar la flota de vehículos, mantenimiento preventivo, asignación de viajes y portal de seguimiento para clientes.',
    problem: 'Falta de visibilidad sobre los costos de combustible por viaje, demoras en la actualización del estado del envío a los clientes e inconvenientes por vencimiento de pólizas de seguro de camiones.',
    solution: 'Creamos un panel de control interno para el despachante de carga y un portal de seguimiento para los clientes finales, integrando alertas de mantenimiento e indicadores de rentabilidad de la flota.',
    features: [
      'Dashboard operativo de viajes activos, choferes asignados y combustible',
      'Calculadora de costos estimada según distancia, tipo de carga y urgencia',
      'Portal del cliente para seguimiento de carga en mapa interactivo con datos demo',
      'Módulo de mantenimiento preventivo y alertas de vencimiento de documentación',
      'Gestión de hojas de ruta, choferes y viáticos de forma digital',
      'Generación de remitos digitales y facturas de transporte'
    ],
    is_concept: true,
    suggested_phases: ['Fase 1: Módulo de Flota, Choferes y Viajes Internos', 'Fase 2: Calculadora de Distancias y Portal de Seguimiento al Cliente', 'Fase 3: Alertas de Mantenimiento Avanzado y Liquidación de Combustible'],
    integrations: ['Google Maps API', 'SMS/WhatsApp para alertas de entrega', 'APIs de Rastreo Satelital (Demo)']
  },
  {
    id: 'p6',
    slug: 'prisma-gestion-inmobiliaria',
    name: 'Prisma Gestión Inmobiliaria',
    category: 'management',
    industry: 'Real Estate / Inmobiliarias',
    type: 'Portal Inmobiliario + Administración de Alquileres',
    status: 'concept',
    description: 'Sitio de propiedades con filtros avanzados, CRM para agentes, portal de propietarios y portal de inquilinos para el cobro de alquileres.',
    problem: 'Desorden en las consultas recibidas de múltiples portales (ZonaProp, Argenprop), retrasos en las liquidaciones mensuales a propietarios y falta de seguimiento estructurado de visitas a inmuebles.',
    solution: 'Desarrollamos una plataforma inmobiliaria centralizada que unifica la web pública con un CRM para los agentes y portales privados de autogestión para propietarios e inquilinos.',
    features: [
      'Buscador interactivo de propiedades con mapa y filtros específicos',
      'CRM interno de contactos, visitas agendadas y pipeline de negociación',
      'Portal del inquilino para ver cuotas de alquiler, subir comprobantes de pago y reportar averías',
      'Portal del propietario para ver liquidaciones mensuales y estado de sus inmuebles',
      'Calculadora de indexación de contratos según índices oficiales',
      'Formulario inteligente de tasación online con precalificación'
    ],
    is_concept: true,
    suggested_phases: ['Fase 1: Buscador de Propiedades y CRM de Consultas', 'Fase 2: Módulo de Contratos y Portales de Propietario/Inquilino', 'Fase 3: Liquidaciones Automatizadas y Tasaciones Online Inteligentes'],
    integrations: ['Mercado Pago', 'WhatsApp Webhook (Consultas instantáneas)', 'Google Calendar (Visitas)']
  }
];

const DEFAULT_QUOTE_RULES: QuoteRule[] = [
  // Base Prices (ARS)
  { id: 'qr1', category: 'base_price', key_name: 'landing', label: 'Landing Page Comercial', value: 800000, currency: 'ARS', is_active: true },
  { id: 'qr2', category: 'base_price', key_name: 'institucional', label: 'Página Web Institucional', value: 1200000, currency: 'ARS', is_active: true },
  { id: 'qr3', category: 'base_price', key_name: 'avanzada', label: 'Página Web Avanzada', value: 1800000, currency: 'ARS', is_active: true },
  { id: 'qr4', category: 'base_price', key_name: 'ecommerce', label: 'Tienda Online (Ecommerce)', value: 2500000, currency: 'ARS', is_active: true },
  { id: 'qr5', category: 'base_price', key_name: 'ecommerce-gestion-interna', label: 'Ecommerce + Gestión Interna', value: 4000000, currency: 'ARS', is_active: true },
  { id: 'qr6', category: 'base_price', key_name: 'sistemas-gestion', label: 'Sistema de Gestión Interna', value: 3500000, currency: 'ARS', is_active: true },
  { id: 'qr7', category: 'base_price', key_name: 'sistemas-contables', label: 'Sistema Contable', value: 3000000, currency: 'ARS', is_active: true },
  { id: 'qr8', category: 'base_price', key_name: 'portales-clientes', label: 'Portal de Clientes Privado', value: 2200000, currency: 'ARS', is_active: true },
  { id: 'qr9', category: 'base_price', key_name: 'sistemas-turnos', label: 'Sistema de Turnos', value: 2000000, currency: 'ARS', is_active: true },
  { id: 'qr10', category: 'base_price', key_name: 'crm', label: 'CRM Comercial', value: 2800000, currency: 'ARS', is_active: true },
  { id: 'qr11', category: 'base_price', key_name: 'dashboards', label: 'Dashboard y Reportes', value: 1800000, currency: 'ARS', is_active: true },
  { id: 'qr12', category: 'base_price', key_name: 'automatizacion', label: 'Automatización de Procesos', value: 1500000, currency: 'ARS', is_active: true },
  { id: 'qr13', category: 'base_price', key_name: 'integraciones', label: 'Integración de Sistemas', value: 1200000, currency: 'ARS', is_active: true },
  { id: 'qr14', category: 'base_price', key_name: 'web-apps', label: 'Web App a Medida (SaaS)', value: 4500000, currency: 'ARS', is_active: true },
  
  // Additional Modules (ARS)
  { id: 'qr15', category: 'additional_module', key_name: 'auth', label: 'Mapeo de Roles y Permisos', value: 300000, currency: 'ARS', is_active: true },
  { id: 'qr16', category: 'additional_module', key_name: 'payments', label: 'Cobros Online (Mercado Pago)', value: 250000, currency: 'ARS', is_active: true },
  { id: 'qr17', category: 'additional_module', key_name: 'whatsapp', label: 'Notificaciones WhatsApp automáticas', value: 350000, currency: 'ARS', is_active: true },
  { id: 'qr18', category: 'additional_module', key_name: 'pdf_reports', label: 'Generación Automática de Reportes PDF', value: 200000, currency: 'ARS', is_active: true },
  { id: 'qr19', category: 'additional_module', key_name: 'stock_sync', label: 'Sincronización de Stock en tiempo real', value: 400000, currency: 'ARS', is_active: true },
  { id: 'qr20', category: 'additional_module', key_name: 'client_portal_access', label: 'Portal Privado con Autenticación', value: 450000, currency: 'ARS', is_active: true },
  { id: 'qr21', category: 'additional_module', key_name: 'custom_design_premium', label: 'Diseño UX/UI Premium 100% Personalizado', value: 500000, currency: 'ARS', is_active: true },

  // Multipliers
  { id: 'qr22', category: 'multiplier', key_name: 'urgencia_alta', label: 'Urgencia Alta (Menos de 1 mes)', value: 1.30, currency: 'factor', is_active: true },
  { id: 'qr23', category: 'multiplier', key_name: 'urgencia_media', label: 'Urgencia Media (1 a 3 meses)', value: 1.00, currency: 'factor', is_active: true },
  { id: 'qr24', category: 'multiplier', key_name: 'urgencia_baja', label: 'Urgencia Baja (Más de 3 meses)', value: 0.90, currency: 'factor', is_active: true }
];

const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'et-1',
    key_name: 'lead_confirmation',
    subject: '¡Gracias por contactar a ReCode Studio!',
    body_html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
    <h2 style="color: #ffffff; font-family: sans-serif; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">¡Hola {{name}}!</h2>
    <p>Hemos recibido tu consulta para <strong>{{company}}</strong> con éxito.</p>
    <p>Un consultor de nuestro equipo analizará tus requisitos y te contactará en menos de 24 horas hábiles.</p>
    <div style="background-color: #02031e; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee;">
      <p style="margin: 0; font-size: 14px;"><strong>Código de Consulta:</strong> {{code}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Mensaje enviado:</strong> {{message}}</p>
    </div>
    <p>Saludos cordiales,<br/>El equipo de ReCode Studio</p>
  </div>`,
    body_text: 'Hola {{name}}!\n\nHemos recibido tu consulta para {{company}} con éxito.\nUn consultor de nuestro equipo analizará tus requisitos y te contactará en menos de 24 horas hábiles.\n\nCódigo de Consulta: {{code}}\nMensaje enviado: {{message}}\n\nSaludos cordiales,\nEl equipo de ReCode Studio',
    is_active: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'et-2',
    key_name: 'quote_notification',
    subject: 'Tu estimación de abono mensual - ReCode Studio',
    body_html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
    <h2 style="color: #ffffff; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">Estimación de Abono Realizada</h2>
    <p>Hola {{name}},</p>
    <p>Registramos tu cálculo de abono mensual interactivo para el proyecto de tipo <strong>{{project_type}}</strong>.</p>
    <div style="background-color: #02031e; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee; text-align: center;">
      <span style="font-size: 12px; color: #9ca3af; text-transform: uppercase;">Cuota Mensual Estimada</span>
      <h3 style="color: #22d3ee; margin: 10px 0; font-size: 24px;">{{price_range}} / mes</h3>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">Contratación mínima: 12 meses</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #ffffff;">Plazo de implementación: {{weeks}} semanas</p>
    </div>
    <p>Código de seguimiento: <strong>{{code}}</strong></p>
    <p>Si querés avanzar con la propuesta final y ajustar los módulos, respondé a este email o agenda una llamada desde nuestro sitio.</p>
    <p>Atentamente,<br/>ReCode Studio</p>
  </div>`,
    body_text: 'Hola {{name}},\n\nRegistramos tu cálculo de abono mensual interactivo para el proyecto de tipo {{project_type}}.\n\nCuota Mensual Estimada: {{price_range}} / mes\nContratación mínima: 12 meses\nPlazo de implementación: {{weeks}} semanas\n\nCódigo de seguimiento: {{code}}\n\nSi querés avanzar con la propuesta final y ajustar los módulos, respondé a este email o agenda una llamada desde nuestro sitio.\n\nAtentamente,\nReCode Studio',
    is_active: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'et-3',
    key_name: 'meeting_scheduled',
    subject: 'Reunión agendada con ReCode Studio',
    body_html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
    <h2 style="color: #ffffff; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">¡Reunión Confirmada!</h2>
    <p>Hola {{name}},</p>
    <p>Tu reunión de consultoría tecnológica ha sido agendada con éxito.</p>
    <div style="background-color: #02031e; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee;">
      <p style="margin: 0; font-size: 14px;"><strong>Fecha y Hora:</strong> {{date_time}} (Argentina)</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Tipo de Reunión:</strong> {{meeting_type}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Enlace de Videollamada:</strong> <a href="{{link}}" style="color: #22d3ee; text-decoration: underline;">Acceder a la reunión</a></p>
    </div>
    <p>Te sugerimos tener a mano información sobre tus flujos de trabajo actuales y planillas Excel para hacer el relevamiento más ágil.</p>
    <p>¡Nos vemos pronto!<br/>ReCode Studio</p>
  </div>`,
    body_text: 'Hola {{name}},\n\nTu reunión de consultoría tecnológica ha sido agendada con éxito.\n\nFecha y Hora: {{date_time}} (Argentina)\nTipo de Reunión: {{meeting_type}}\nEnlace de Videollamada: {{link}}\n\nTe sugerimos tener a mano información sobre tus flujos de trabajo actuales y planillas Excel para hacer el relevamiento más ágil.\n\n¡Nos vemos pronto!\nReCode Studio',
    is_active: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'et-4',
    key_name: 'diagnostic_completed',
    subject: 'Tu Diagnóstico Tecnológico - ReCode Studio',
    body_html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
    <h2 style="color: #ffffff; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">Tu Diagnóstico de Procesos está listo</h2>
    <p>Hola {{name}},</p>
    <p>Procesamos tus respuestas y generamos el informe de madurez digital para <strong>{{company}}</strong>.</p>
    <div style="background-color: #02031e; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee;">
      <p style="margin: 0; font-size: 14px;"><strong>Solución Recomendada:</strong> {{recommendation}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Complejidad del Desarrollo:</strong> {{complexity}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Módulos sugeridos:</strong> {{modules}}</p>
    </div>
    <p>Código de caso para seguimiento: <strong>{{code}}</strong></p>
    <p>Podés ver y descargar tu informe de diagnóstico completo ingresando en nuestro sitio con tu código de caso.</p>
    <p>Saludos cordiales,<br/>ReCode Studio</p>
  </div>`,
    body_text: 'Hola {{name}},\n\nProcesamos tus respuestas y generamos el informe de madurez digital para {{company}}.\n\nSolución Recomendada: {{recommendation}}\nComplejidad del Desarrollo: {{complexity}}\nMódulos sugeridos: {{modules}}\n\nCódigo de caso para seguimiento: {{code}}\n\nPodés ver y descargar tu informe de diagnóstico completo ingresando en nuestro sitio con tu código de caso.\n\nSaludos cordiales,\nReCode Studio',
    is_active: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'et-5',
    key_name: 'contract_delivery',
    subject: 'Contrato de Membresía Tecnológica - ReCode Studio',
    body_html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
    <h2 style="color: #ffffff; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">Tu Contrato de Membresía Tecnológica</h2>
    <p>Hola {{name}},</p>
    <p>Nos alegra informarte que tu propuesta comercial para el proyecto <strong>{{project_name}}</strong> ha sido formalizada.</p>
    
    <div style="background-color: #02031e; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee; text-align: left;">
      <h3 style="color: #22d3ee; margin: 0 0 10px 0; font-size: 16px;">Detalle del Acuerdo</h3>
      <p style="margin: 5px 0; font-size: 12px; color: #ffffff;"><strong>Abono Mensual:</strong> {{price}} / mes</p>
      <p style="margin: 5px 0; font-size: 12px; color: #ffffff;"><strong>Mantenimiento y Soporte:</strong> Incluido 24/7</p>
      <p style="margin: 5px 0; font-size: 12px; color: #ffffff;"><strong>Permanencia Mínima:</strong> 12 meses (Sin cancelación de débito antes de los 6 meses)</p>
      <p style="margin: 5px 0; font-size: 12px; color: #ffffff;"><strong>Módulos Contratados:</strong> {{modules}}</p>
    </div>

    <p>Tu Project Manager asignado es <strong>{{pm}}</strong>. Ya puedes ingresar a tu Portal de Clientes para ver el timeline en tiempo real.</p>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="https://recodestudio.com.ar/contrato-firmado-recode.pdf" style="background-color: #174bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Descargar Contrato Digital (PDF)</a>
    </div>

    <p>¡Gracias por confiar en ReCode Studio para potenciar tu negocio!<br/>El equipo de ReCode Studio</p>
  </div>`,
    body_text: 'Hola {{name}},\n\nNos alegra informarte que tu propuesta comercial para el proyecto {{project_name}} ha sido formalizada.\n\nDetalle del Acuerdo:\n- Abono Mensual: {{price}} / mes\n- Permanencia Mínima: 12 meses (Sin cancelación antes de los 6 meses)\n- Módulos Contratados: {{modules}}\n\nTu Project Manager asignado es {{pm}}. Ingresa a tu portal de clientes para ver los avances.\n\nDescargar contrato: https://recodestudio.com.ar/contrato-firmado-recode.pdf\n\nSaludos cordiales,\nEl equipo de ReCode Studio',
    is_active: true,
    updated_at: new Date().toISOString()
  }
];

const DEFAULT_EMAIL_SETTINGS: EmailSetting[] = [
  { id: 'es-1', key_name: 'provider', value: 'mock', description: 'Proveedor activo de email: "mock" (imprime en logs) o "resend" (usa API key) o "smtp" (usa servidor SMTP)', updated_at: new Date().toISOString() },
  { id: 'es-2', key_name: 'api_key', value: '', description: 'API Key para el proveedor de emails (e.g. Resend re_...)', updated_at: new Date().toISOString() },
  { id: 'es-3', key_name: 'smtp_host', value: 'smtp.gmail.com', description: 'Servidor SMTP saliente', updated_at: new Date().toISOString() },
  { id: 'es-4', key_name: 'smtp_port', value: '587', description: 'Puerto SMTP (587 o 465)', updated_at: new Date().toISOString() },
  { id: 'es-5', key_name: 'smtp_user', value: '', description: 'Usuario SMTP (email)', updated_at: new Date().toISOString() },
  { id: 'es-6', key_name: 'smtp_pass', value: '', description: 'Contraseña del servidor SMTP', updated_at: new Date().toISOString() },
  { id: 'es-7', key_name: 'from_email', value: 'no-reply@recodestudio.com', description: 'Dirección de correo remitente', updated_at: new Date().toISOString() },
  { id: 'es-8', key_name: 'from_name', value: 'ReCode Studio', description: 'Nombre visible del remitente', updated_at: new Date().toISOString() }
];

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Lead Scoring Function
export function calculateLeadScore(data: any): { score: number; priority: Lead['priority'] } {
  let score = 0;

  // 1. Tipo de Proyecto (Max 25 pts)
  const projectType = data.project_type || data.service_interest || '';
  if (['ecommerce-gestion-interna', 'web-apps', 'sistemas-gestion'].includes(projectType)) {
    score += 25;
  } else if (['sistemas-contables', 'crm', 'ecommerce'].includes(projectType)) {
    score += 20;
  } else if (['portales-clientes', 'sistemas-turnos', 'dashboards'].includes(projectType)) {
    score += 15;
  } else if (['automatizacion', 'integraciones', 'avanzada'].includes(projectType)) {
    score += 10;
  } else {
    score += 5;
  }

  // 2. Presupuesto / Plan (Max 25 pts)
  const budget = data.budget || '';
  if (budget.includes('alto') || budget.includes('definido') || budget === 'advanced' || budget === 'alto_presupuesto') {
    score += 25;
  } else if (budget.includes('medio') || budget === 'medium' || budget === 'medio_presupuesto') {
    score += 15;
  } else if (budget.includes('bajo') || budget === 'low' || budget === 'bajo_presupuesto') {
    score += 5;
  } else {
    // Si no está declarado, asumimos interés medio
    score += 10;
  }

  // 3. Urgencia (Max 15 pts)
  const urgency = data.urgency || data.timeframe || '';
  if (urgency.includes('urgente') || urgency.includes('asap') || urgency.includes('alta') || urgency === 'alta') {
    score += 15;
  } else if (urgency.includes('medio') || urgency.includes('mes') || urgency === 'media') {
    score += 10;
  } else {
    score += 5;
  }

  // 4. Equipo / Usuarios (Max 15 pts)
  const teamSize = parseInt(data.team_size || data.users_count || '0', 10);
  if (teamSize > 20) {
    score += 15;
  } else if (teamSize >= 5) {
    score += 10;
  } else if (teamSize >= 1) {
    score += 5;
  } else {
    score += 5;
  }

  // 5. Integraciones y Automatizaciones requeridas (Max 10 pts)
  if (data.needs_integrations === true || (Array.isArray(data.needed_modules) && data.needed_modules.length > 5)) {
    score += 10;
  } else if (data.needs_integrations === false) {
    score += 0;
  } else {
    score += 5;
  }

  // 6. Dolor / Planillas declaradas (Max 10 pts)
  const painMessage = (data.message || '') + (data.pain_point || '') + (data.current_tool || '');
  if (painMessage.toLowerCase().includes('excel') || painMessage.toLowerCase().includes('planilla') || painMessage.toLowerCase().includes('perder') || painMessage.toLowerCase().includes('desorden')) {
    score += 10;
  } else if (painMessage.length > 30) {
    score += 5;
  }

  // Cap at 100
  score = Math.min(100, score);

  // Priority classification
  let priority: Lead['priority'] = 'En evaluación';
  if (score >= 75) {
    priority = 'Prioridad alta';
  } else if (score >= 50) {
    priority = 'Oportunidad calificada';
  } else if (score >= 30) {
    priority = 'En evaluación';
  } else if (score >= 15) {
    priority = 'Proyecto inicial';
  } else {
    priority = 'Consulta informativa';
  }

  return { score, priority };
}

// Generate code RC-YYYY-XXXXXX
export function generateLeadCode(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `RC-${year}-${rand}`;
}

// Local Storage Fallback Implementation
class LocalStorageDb {
  private getStorageItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(`recode_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(e);
      return defaultValue;
    }
  }

  private setStorageItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`recode_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  }

  // Services
  getServices(): Service[] {
    return this.getStorageItem<Service[]>('services', DEFAULT_SERVICES);
  }

  // Solutions
  getSolutions(): Solution[] {
    const list = this.getServices();
    return list.map(s => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description,
      complexity_level: s.slug.includes('web-apps') || s.slug.includes('gestion-interna') ? 'Avanzado' : s.slug.includes('gestion') || s.slug.includes('contables') ? 'Alto' : 'Medio',
      features: s.features
    }));
  }

  // Projects
  getProjects(): Project[] {
    return this.getStorageItem<Project[]>('projects', DEFAULT_PROJECTS);
  }

  getProjectBySlug(slug: string): Project | undefined {
    return this.getProjects().find(p => p.slug === slug);
  }

  // Rules
  getQuoteRules(): QuoteRule[] {
    return this.getStorageItem<QuoteRule[]>('quote_rules', DEFAULT_QUOTE_RULES);
  }

  updateQuoteRules(rules: QuoteRule[]): void {
    this.setStorageItem('quote_rules', rules);
  }

  updateSingleQuoteRule(ruleId: string, value: number): void {
    const rules = this.getQuoteRules();
    const updated = rules.map(r => r.id === ruleId ? { ...r, value, updated_at: new Date().toISOString() } : r);
    this.updateQuoteRules(updated);
  }

  // Leads
  getLeads(): Lead[] {
    // Generate initial dummy leads if empty, so the admin has data to look at!
    const defaultLeads: Lead[] = [
      {
        id: 'l-seed-1',
        code: 'RC-2026-881273',
        name: 'Sofía Martínez',
        company: 'Bruma Indumentaria',
        email: 'sofia@brumamoda.com',
        phone: '+54 9 358 514-2731',
        city: 'CABA',
        province: 'Buenos Aires',
        industry: 'Moda y Retail',
        service_interest: 'ecommerce-gestion-interna',
        message: 'Hola! Tenemos un local físico y tienda online, pero gestionamos el stock mayorista y las cuentas corrientes de 40 revendedoras en planillas Excel de forma manual. Queremos unificar todo en un solo sistema.',
        source: 'Instagram Ad',
        status: 'Nuevo',
        priority: 'Prioridad alta',
        score: 85,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        notes: [],
        events: [{ id: 'e1', lead_id: 'l-seed-1', event_type: 'creation', description: 'Lead registrado en formulario', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }]
      },
      {
        id: 'l-seed-2',
        code: 'RC-2026-104928',
        name: 'Martín Rossi',
        company: 'Rossi & Asociados',
        email: 'martin@rossi.com',
        phone: '+54 341 458-1002',
        city: 'Rosario',
        province: 'Santa Fe',
        industry: 'Servicios Profesionales',
        service_interest: 'sistemas-contables',
        message: 'Estudio contable. Queremos un portal donde los clientes puedan subir sus facturas de compras y descargar las liquidaciones de IVA mensuales. Actualmente enviamos todo por email.',
        source: 'Google Search',
        status: 'Contactado',
        priority: 'Oportunidad calificada',
        score: 65,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        notes: [{ id: 'n1', lead_id: 'l-seed-2', author_name: 'Admin Recode', content: 'Llamada telefónica realizada. Martín se mostró muy interesado en ordenar la recepción de facturas.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() }],
        events: [
          { id: 'e2', lead_id: 'l-seed-2', event_type: 'creation', description: 'Lead registrado en el cotizador', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
          { id: 'e3', lead_id: 'l-seed-2', event_type: 'status_change', description: 'Estado cambiado a Contactado', created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() }
        ]
      }
    ];

    return this.getStorageItem<Lead[]>('leads', defaultLeads);
  }

  saveLead(lead: Lead): void {
    const leads = this.getLeads();
    leads.unshift(lead);
    this.setStorageItem('leads', leads);
  }

  updateLeadStatus(leadId: string, status: Lead['status']): void {
    const leads = this.getLeads();
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const events = l.events || [];
        events.push({
          id: `ev-${Date.now()}`,
          lead_id: leadId,
          event_type: 'status_change',
          description: `Estado cambiado de "${l.status}" a "${status}"`,
          created_at: new Date().toISOString()
        });
        return {
          ...l,
          status,
          events,
          updated_at: new Date().toISOString()
        };
      }
      return l;
    });
    this.setStorageItem('leads', updated);
  }

  addLeadNote(leadId: string, content: string): void {
    const leads = this.getLeads();
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const notes = l.notes || [];
        notes.push({
          id: `note-${Date.now()}`,
          lead_id: leadId,
          author_name: 'Admin Recode',
          content,
          created_at: new Date().toISOString()
        });
        const events = l.events || [];
        events.push({
          id: `ev-note-${Date.now()}`,
          lead_id: leadId,
          event_type: 'note_added',
          description: 'Nota interna agregada',
          created_at: new Date().toISOString()
        });
        return {
          ...l,
          notes,
          events,
          updated_at: new Date().toISOString()
        };
      }
      return l;
    });
    this.setStorageItem('leads', updated);
  }

  // Diagnostics
  getDiagnostics(): Diagnostic[] {
    return this.getStorageItem<Diagnostic[]>('diagnostics', []);
  }

  saveDiagnostic(diagnostic: Diagnostic): void {
    const diagnostics = this.getDiagnostics();
    diagnostics.unshift(diagnostic);
    this.setStorageItem('diagnostics', diagnostics);
  }

  // Quotes
  getQuotes(): Quote[] {
    const defaultQuotes: Quote[] = [
      {
        id: 'q-bruma',
        userId: 'u-bruma',
        quoteCode: 'RC-QT-2026-0001',
        companyName: 'Bruma Moda',
        project_type: 'ecommerce-gestion-interna',
        selected_modules: ['catalogo-productos', 'carrito-checkout', 'cobros-mercado-pago', 'control-stock', 'cuentas-corrientes', 'portal-privado-clientes', 'notificaciones-whatsapp', 'emails-transaccionales'],
        complexity: 'Alto',
        estimated_min: 4000000,
        estimated_max: 5200000,
        estimated_weeks: 12,
        currency: 'ARS',
        notes: 'Precotización inicial para e-commerce mayorista sincronizado.',
        status: 'convertida',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
      }
    ];
    return this.getStorageItem<Quote[]>('quotes', defaultQuotes);
  }

  saveQuote(quote: Quote): void {
    const quotes = this.getQuotes();
    quotes.unshift(quote);
    this.setStorageItem('quotes', quotes);
  }

  updateQuoteStatus(quoteId: string, status: Quote['status'], comments?: string): void {
    const quotes = this.getQuotes();
    const updated = quotes.map(q => q.id === quoteId ? { ...q, status, notes: comments || q.notes, updated_at: new Date().toISOString() } : q);
    this.setStorageItem('quotes', updated);
  }

  updateQuoteDetails(quoteId: string, status: Quote['status'], min: number, max: number, weeks: number, notes: string): void {
    const quotes = this.getQuotes();
    const updated = quotes.map(q => q.id === quoteId ? {
      ...q,
      status,
      estimated_min: min,
      estimated_max: max,
      estimated_weeks: weeks,
      notes,
      updated_at: new Date().toISOString()
    } : q);
    this.setStorageItem('quotes', updated);
  }

  // Users
  getUsers(): User[] {
    const defaultUsers: User[] = [
      {
        id: 'u-bruma',
        name: 'Sofía Martínez',
        email: 'sofia@brumamoda.com',
        whatsapp: '+5493585142731',
        companyName: 'Bruma Moda',
        password: 'bruma2026',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
      }
    ];
    return this.getStorageItem<User[]>('users', defaultUsers);
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.setStorageItem('users', users);
  }

  // Client Projects
  getClientProjects(): ClientProject[] {
    const defaultProjects: ClientProject[] = [
      {
        id: 'p-bruma',
        projectCode: 'RC-PRJ-2026-0001',
        quoteId: 'q-bruma',
        userId: 'u-bruma',
        name: 'Bruma Moda Core',
        status: 'activo',
        startDate: '2026-05-10',
        estimatedDeliveryDate: '2026-08-05',
        assignedPM: 'Tomas Recode',
        progress: 65,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        phases: [
          { phaseNumber: 1, title: 'Fase 1: Relevamiento y Alcance', status: 'completado', progress: 100, estimatedDate: '2026-05-15', description: 'Definición de funcionalidades, pasarelas de pago y diseño de base de datos final.' },
          { phaseNumber: 2, title: 'Fase 2: Diseño UX/UI', status: 'completado', progress: 100, estimatedDate: '2026-05-30', description: 'Wireframes interactivos de la tienda online pública y el panel administrativo. Enlace de revisión aprobado.' },
          { phaseNumber: 3, title: 'Fase 3: Desarrollo Core Frontend & Backend', status: 'en_proceso', progress: 65, estimatedDate: '2026-07-10', description: 'Codificación del sistema Next.js, base de datos local y panel administrador de stock.' },
          { phaseNumber: 4, title: 'Fase 4: Integraciones y Pruebas', status: 'pendiente', progress: 0, estimatedDate: '2026-07-25', description: 'Conexión de Mercado Pago y Correo Argentino. Pruebas de velocidad y SEO.' },
          { phaseNumber: 5, title: 'Fase 5: Lanzamiento y Capacitación', status: 'pendiente', progress: 0, estimatedDate: '2026-08-05', description: 'Subida a servidores de producción, traspaso de dominios y capacitación de uso del panel al equipo.' }
        ]
      }
    ];
    return this.getStorageItem<ClientProject[]>('client_projects', defaultProjects);
  }

  saveClientProject(project: ClientProject): void {
    const projects = this.getClientProjects();
    projects.unshift(project);
    this.setStorageItem('client_projects', projects);
  }

  updateClientProject(project: ClientProject): void {
    const projects = this.getClientProjects();
    const updated = projects.map(p => p.id === project.id ? project : p);
    this.setStorageItem('client_projects', updated);
  }

  // Messages
  getMessages(): Message[] {
    const defaultMessages: Message[] = [
      { id: 'msg-1', userId: 'u-bruma', quoteId: 'q-bruma', category: 'general', message: '¡Hola! Bienvenidos a su portal de clientes de ReCode Studio. Aquí pueden ver el avance del proyecto, descargar documentos y realizar consultas.', sender: 'recode', status: 'replied', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 29).toISOString() },
      { id: 'msg-2', userId: 'u-bruma', quoteId: 'q-bruma', category: 'general', message: 'Hola! Buenísimo. ¿Cuándo estarían listos los primeros mockups del diseño?', sender: 'client', status: 'replied', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString() },
      { id: 'msg-3', userId: 'u-bruma', quoteId: 'q-bruma', category: 'general', message: 'Están planificados para el próximo martes. Les va a llegar una alerta por email con el enlace interactivo.', sender: 'recode', status: 'replied', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28 + 1000 * 60 * 30).toISOString() }
    ];
    return this.getStorageItem<Message[]>('messages', defaultMessages);
  }

  saveMessage(msg: Message): void {
    const messages = this.getMessages();
    messages.push(msg);
    this.setStorageItem('messages', messages);
  }

  // Documents
  getDocuments(): Document[] {
    const defaultDocs: Document[] = [
      { id: 'doc-1', userId: 'u-bruma', quoteId: 'q-bruma', fileName: 'Contrato y Especificación de Requerimientos (SRS).pdf', fileType: 'pdf', fileSize: '1.4 MB', status: 'aprobado', uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 29).toISOString() },
      { id: 'doc-2', userId: 'u-bruma', quoteId: 'q-bruma', fileName: 'Logo Bruma Moda Vectorizado.ai', fileType: 'ai', fileSize: '2.3 MB', status: 'revisado', uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString() },
      { id: 'doc-3', userId: 'u-bruma', quoteId: 'q-bruma', fileName: 'Manual Preliminar de Administración.pdf', fileType: 'pdf', fileSize: '2.1 MB', status: 'recibido', uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() }
    ];
    return this.getStorageItem<Document[]>('documents', defaultDocs);
  }

  saveDocument(doc: Document): void {
    const docs = this.getDocuments();
    docs.unshift(doc);
    this.setStorageItem('documents', docs);
  }

  updateDocumentStatus(docId: string, status: Document['status']): void {
    const docs = this.getDocuments();
    const updated = docs.map(d => d.id === docId ? { ...d, status } : d);
    this.setStorageItem('documents', updated);
  }

  // Payments
  getPayments(): Payment[] {
    const defaultPayments: Payment[] = [
      { id: 'pay-seed-1', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 1/12)', status: 'pagado', dueDate: '2026-05-10', paidAt: '2026-05-10' },
      { id: 'pay-seed-2', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 2/12)', status: 'pagado', dueDate: '2026-06-10', paidAt: '2026-06-09' },
      { id: 'pay-seed-3', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 3/12)', status: 'pendiente', dueDate: '2026-07-10' },
      { id: 'pay-seed-4', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 4/12)', status: 'pendiente', dueDate: '2026-08-10' },
      { id: 'pay-seed-5', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 5/12)', status: 'pendiente', dueDate: '2026-09-10' },
      { id: 'pay-seed-6', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 6/12)', status: 'pendiente', dueDate: '2026-10-10' },
      { id: 'pay-seed-7', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 7/12)', status: 'pendiente', dueDate: '2026-11-10' },
      { id: 'pay-seed-8', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 8/12)', status: 'pendiente', dueDate: '2026-12-10' },
      { id: 'pay-seed-9', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 9/12)', status: 'pendiente', dueDate: '2027-01-10' },
      { id: 'pay-seed-10', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 10/12)', status: 'pendiente', dueDate: '2027-02-10' },
      { id: 'pay-seed-11', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 11/12)', status: 'pendiente', dueDate: '2027-03-10' },
      { id: 'pay-seed-12', userId: 'u-bruma', projectId: 'p-bruma', amount: 1200000, period: 'Abono Mensual (Cuota 12/12)', status: 'pendiente', dueDate: '2027-04-10' }
    ];
    return this.getStorageItem<Payment[]>('payments', defaultPayments);
  }

  savePayment(pay: Payment): void {
    const payments = this.getPayments();
    payments.push(pay);
    this.setStorageItem('payments', payments);
  }

  updatePaymentStatus(payId: string, status: Payment['status'], paidAt?: string): void {
    const payments = this.getPayments();
    const updated = payments.map(p => p.id === payId ? { ...p, status, paidAt } : p);
    this.setStorageItem('payments', updated);
  }

  uploadPaymentReceipt(payId: string): void {
    const payments = this.getPayments();
    const updated = payments.map(p => p.id === payId ? { ...p, comprobanteUploaded: true } : p);
    this.setStorageItem('payments', updated);
  }

  updateProjectAbonoAmount(projectId: string, amount: number): void {
    const payments = this.getPayments();
    const updated = payments.map(p => {
      if (p.projectId === projectId && p.status !== 'pagado') {
        return { ...p, amount };
      }
      return p;
    });
    this.setStorageItem('payments', updated);
  }

  // Meetings
  getMeetings(): Meeting[] {
    const defaultMeetings: Meeting[] = [
      {
        id: 'meet-1',
        lead_id: 'l-seed-2',
        meeting_type: 'initial',
        scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // in 2 days
        duration_minutes: 30,
        status: 'scheduled',
        notes: 'Auditoría digital para Rossi & Asociados',
        created_at: new Date().toISOString()
      }
    ];
    return this.getStorageItem<Meeting[]>('meetings', defaultMeetings);
  }

  saveMeeting(meeting: Meeting): void {
    const meetings = this.getMeetings();
    meetings.push(meeting);
    this.setStorageItem('meetings', meetings);
  }

  // Email templates local storage helpers
  getEmailTemplates(): EmailTemplate[] {
    return this.getStorageItem<EmailTemplate[]>('email_templates', DEFAULT_EMAIL_TEMPLATES);
  }

  updateEmailTemplate(keyName: string, subject: string, bodyHtml: string, bodyText: string): void {
    const templates = this.getEmailTemplates();
    const updated = templates.map(t => t.key_name === keyName ? { ...t, subject, body_html: bodyHtml, body_text: bodyText, updated_at: new Date().toISOString() } : t);
    this.setStorageItem('email_templates', updated);
  }

  // Email settings local storage helpers
  getEmailSettings(): EmailSetting[] {
    return this.getStorageItem<EmailSetting[]>('email_settings', DEFAULT_EMAIL_SETTINGS);
  }

  updateEmailSettings(settings: { key_name: string; value: string }[]): void {
    const current = this.getEmailSettings();
    const updated = current.map(s => {
      const match = settings.find(x => x.key_name === s.key_name);
      return match ? { ...s, value: match.value, updated_at: new Date().toISOString() } : s;
    });
    this.setStorageItem('email_settings', updated);
  }

  // Convert a quote to a client project (local fallback)
  convertQuoteToProject(quoteId: string, finalMonthlyAbono?: number): ClientProject {
    const quotes = this.getQuotes();
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) throw new Error('Cotización no encontrada');

    this.updateQuoteStatus(quoteId, 'convertida');

    const rand = Math.floor(1000 + Math.random() * 9000);
    const projectCode = `RC-PRJ-2026-${rand}`;
    const startDate = new Date().toISOString().split('T')[0];
    const weeks = quote.estimated_weeks || 12;
    const estimatedDeliveryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * weeks).toISOString().split('T')[0];
    const phases: ProjectPhase[] = [
      { phaseNumber: 1, title: 'Fase 1: Relevamiento y Alcance', status: 'en_proceso', progress: 0, estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString().split('T')[0], description: 'Definición de funcionalidades y diseño de base de datos.' },
      { phaseNumber: 2, title: 'Fase 2: Diseño UX/UI', status: 'pendiente', progress: 0, estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString().split('T')[0], description: 'Wireframes interactivos del sistema.' },
      { phaseNumber: 3, title: 'Fase 3: Desarrollo Core Frontend & Backend', status: 'pendiente', progress: 0, estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString().split('T')[0], description: 'Codificación del sistema.' },
      { phaseNumber: 4, title: 'Fase 4: Integraciones y Pruebas', status: 'pendiente', progress: 0, estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString().split('T')[0], description: 'Pruebas de velocidad y SEO.' },
      { phaseNumber: 5, title: 'Fase 5: Lanzamiento y Capacitación', status: 'pendiente', progress: 0, estimatedDate: estimatedDeliveryDate, description: 'Subida a producción y capacitación.' }
    ];

    const newProject: ClientProject = {
      id: `p-${Date.now()}`,
      projectCode,
      quoteId,
      userId: quote.userId || '',
      name: `${quote.companyName || 'Proyecto'} Core`,
      status: 'activo',
      startDate,
      estimatedDeliveryDate,
      assignedPM: 'Tomas Recode',
      progress: 0,
      phases,
      createdAt: new Date().toISOString()
    };

    this.saveClientProject(newProject);

    const abonoValue = finalMonthlyAbono || quote.estimated_min;
    const payments: Payment[] = [];
    for (let i = 1; i <= 12; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + (i - 1));
      payments.push({
        id: `pay-${Date.now()}-${i}`,
        userId: newProject.userId,
        projectId: newProject.id,
        amount: abonoValue,
        period: `Abono Mensual (Cuota ${i}/12)`,
        status: i === 1 ? 'pagado' : 'pendiente',
        dueDate: dueDate.toISOString().split('T')[0],
        paidAt: i === 1 ? new Date().toISOString() : undefined,
        comprobanteUploaded: false
      });
    }
    const existing = this.getPayments();
    this.setStorageItem('payments', [...existing, ...payments]);

    return newProject;
  }

  // Update a specific phase inside a client project (local fallback)
  updateProjectPhase(projectId: string, phaseNumber: number, status: ProjectPhase['status'], progress: number, date?: string, desc?: string): void {
    const projects = this.getClientProjects();
    const updated = projects.map(p => {
      if (p.id !== projectId) return p;
      const updatedPhases = p.phases.map(ph => {
        if (ph.phaseNumber !== phaseNumber) return ph;
        return { ...ph, status, progress, estimatedDate: date || ph.estimatedDate, description: desc || ph.description };
      });
      const totalProgress = Math.round(updatedPhases.reduce((acc, ph) => acc + ph.progress, 0) / updatedPhases.length);
      return { ...p, phases: updatedPhases, progress: totalProgress };
    });
    this.setStorageItem('client_projects', updated);
  }

  // Update the assigned PM and/or delivery date of a project (local fallback)
  updateProjectPM(projectId: string, assignedPM: string, estimatedDeliveryDate?: string): void {
    const projects = this.getClientProjects();
    const updated = projects.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, assignedPM, ...(estimatedDeliveryDate ? { estimatedDeliveryDate } : {}) };
    });
    this.setStorageItem('client_projects', updated);
  }
}

export const localDb = new LocalStorageDb();

// High level Unified API Client that works both client/server with local-storage fallback
export const dbClient = {
  // Projects
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
      if (!error && data) return data as Project[];
    }
    return localDb.getProjects();
  },

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
      if (!error && data) return data as Project;
    }
    return localDb.getProjectBySlug(slug);
  },

  // Services / Solutions
  async getServices(): Promise<Service[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('services').select('*').eq('is_active', true);
      if (!error && data) return data as Service[];
    }
    return localDb.getServices();
  },

  // Quote Rules
  async getQuoteRules(): Promise<QuoteRule[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('quote_rules').select('*').eq('is_active', true);
      if (!error && data) return data as QuoteRule[];
    }
    return localDb.getQuoteRules();
  },

  async updateSingleQuoteRule(ruleId: string, value: number): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('quote_rules').update({ value, updated_at: new Date().toISOString() }).eq('id', ruleId);
      if (!error) return;
    }
    localDb.updateSingleQuoteRule(ruleId, value);
  },

  // Submissions (Lead + Diagnostic/Quote/Meeting)
  async submitLeadForm(formData: {
    name: string;
    company?: string;
    email: string;
    phone?: string;
    city?: string;
    province?: string;
    industry?: string;
    service_interest?: string;
    message?: string;
    source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    budget?: string;
    urgency?: string;
    team_size?: string;
    needs_integrations?: boolean;
    needed_modules?: string[];
  }): Promise<{ lead: Lead; success: boolean }> {
    const code = generateLeadCode();
    const { score, priority } = calculateLeadScore(formData);
    
    const lead: Lead = {
      id: `l-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      code,
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      province: formData.province,
      industry: formData.industry,
      service_interest: formData.service_interest,
      message: formData.message,
      source: formData.source || 'Formulario Web',
      utm_source: formData.utm_source,
      utm_medium: formData.utm_medium,
      utm_campaign: formData.utm_campaign,
      status: 'Nuevo',
      priority,
      score,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: [],
      events: [{
        id: `ev-${Date.now()}`,
        lead_id: '', // Will be matched
        event_type: 'creation',
        description: 'Lead registrado en el sitio web',
        created_at: new Date().toISOString()
      }]
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('leads').insert({
        code,
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        city: lead.city,
        province: lead.province,
        industry: lead.industry,
        service_interest: lead.service_interest,
        message: lead.message,
        source: lead.source,
        utm_source: lead.utm_source,
        utm_medium: lead.utm_medium,
        utm_campaign: lead.utm_campaign,
        status: lead.status,
        priority: lead.priority,
        score: lead.score
      }).select().single();

      if (!error && data) {
        const dbLead = data as Lead;
        lead.id = dbLead.id;
      }
    } else {
      localDb.saveLead(lead);
    }

    // Trigger Lead Confirmation Email in background
    dbClient.sendEmailTrigger('lead_confirmation', lead.email, {
      name: lead.name,
      company: lead.company || 'Particular',
      code: lead.code,
      message: lead.message || 'Consulta de servicios.'
    });

    return { lead, success: true };
  },

  async submitDiagnostic(diagnostic: Omit<Diagnostic, 'id' | 'created_at'>): Promise<boolean> {
    const fullDiagnostic: Diagnostic = {
      ...diagnostic,
      id: `diag-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    let savedDiagnosticId = fullDiagnostic.id;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('diagnostics').insert({
        lead_id: diagnostic.lead_id,
        recommended_solution: diagnostic.recommended_solution,
        suggested_modules: diagnostic.suggested_modules,
        complexity: diagnostic.complexity,
        estimated_weeks: diagnostic.estimated_weeks
      }).select().single();

      if (!error && data) {
        savedDiagnosticId = data.id;
        const answersToInsert = diagnostic.answers.map(ans => ({
          diagnostic_id: savedDiagnosticId,
          question: ans.question,
          answer: ans.answer
        }));
        await supabase.from('diagnostic_answers').insert(answersToInsert);
      }
    } else {
      localDb.saveDiagnostic(fullDiagnostic);
    }

    // Trigger email notification in background
    const leads = await dbClient.getLeads();
    const lead = leads.find(l => l.id === diagnostic.lead_id);
    if (lead) {
      dbClient.sendEmailTrigger('diagnostic_completed', lead.email, {
        name: lead.name,
        company: lead.company || 'Particular',
        code: lead.code,
        recommendation: diagnostic.recommended_solution,
        complexity: diagnostic.complexity,
        modules: diagnostic.suggested_modules.join(', ')
      });
    }

    return true;
  },

  async submitQuote(quote: Omit<Quote, 'id' | 'created_at'>): Promise<boolean> {
    const generatedId = `quote-${Date.now()}`;
    const fullQuote: Quote = {
      ...quote,
      id: generatedId,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('quotes').insert({
        lead_id: quote.lead_id || null,
        user_id: quote.userId || null,
        quote_code: quote.quoteCode || null,
        company_name: quote.companyName || null,
        status: quote.status || 'pendiente',
        project_type: quote.project_type,
        selected_modules: quote.selected_modules,
        complexity: quote.complexity,
        estimated_min: quote.estimated_min,
        estimated_max: quote.estimated_max,
        estimated_weeks: quote.estimated_weeks,
        currency: quote.currency,
        notes: quote.notes
      });
    } else {
      localDb.saveQuote(fullQuote);
    }

    // Trigger email notification in background
    const leads = await dbClient.getLeads();
    const lead = leads.find(l => l.id === quote.lead_id);
    if (lead) {
      const formattedPrice = `$ ${quote.estimated_min.toLocaleString('es-AR')} a $ ${quote.estimated_max.toLocaleString('es-AR')}`;
      dbClient.sendEmailTrigger('quote_notification', lead.email, {
        name: lead.name,
        project_type: quote.project_type,
        price_range: formattedPrice,
        weeks: quote.estimated_weeks,
        code: lead.code
      });
    }

    return true;
  },

  async scheduleMeeting(meeting: Omit<Meeting, 'id' | 'created_at' | 'status'>): Promise<boolean> {
    const fullMeeting: Meeting = {
      ...meeting,
      id: `meet-${Date.now()}`,
      status: 'scheduled',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('meetings').insert({
        lead_id: meeting.lead_id,
        meeting_type: meeting.meeting_type,
        scheduled_at: meeting.scheduled_at,
        duration_minutes: meeting.duration_minutes,
        status: 'scheduled',
        notes: meeting.notes
      });
    } else {
      localDb.saveMeeting(fullMeeting);
    }

    // Trigger email notification in background
    const leads = await dbClient.getLeads();
    const lead = leads.find(l => l.id === meeting.lead_id);
    if (lead) {
      dbClient.sendEmailTrigger('meeting_scheduled', lead.email, {
        name: lead.name,
        date_time: new Date(meeting.scheduled_at).toLocaleString('es-AR'),
        meeting_type: meeting.meeting_type === 'initial' ? 'Auditoría Digital de 20 min' : 'Consultoría de Proyecto',
        link: 'https://meet.google.com/rcd-stud-mtg'
      });
    }

    return true;
  },

  // Admin Actions
  async getLeads(): Promise<Lead[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        // Fetch notes and events for each lead
        const leads = data as Lead[];
        for (const l of leads) {
          const { data: notes } = await supabase.from('lead_notes').select('*').eq('lead_id', l.id);
          const { data: events } = await supabase.from('lead_events').select('*').eq('lead_id', l.id);
          l.notes = (notes || []) as LeadNote[];
          l.events = (events || []) as LeadEvent[];
        }
        return leads;
      }
    }
    return localDb.getLeads();
  },

  async updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('leads').update({ status, updated_at: new Date().toISOString() }).eq('id', leadId);
      // Log event
      await supabase.from('lead_events').insert({
        lead_id: leadId,
        event_type: 'status_change',
        description: `Estado cambiado a ${status}`
      });
      return;
    }
    localDb.updateLeadStatus(leadId, status);
  },

  async addLeadNote(leadId: string, content: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
      if (profiles && profiles[0]) {
        await supabase.from('lead_notes').insert({
          lead_id: leadId,
          content,
          author_id: profiles[0].id
        });
        await supabase.from('lead_events').insert({
          lead_id: leadId,
          event_type: 'note_added',
          description: 'Nota interna agregada'
        });
      }
      return;
    }
    localDb.addLeadNote(leadId, content);
  },

  async getMeetings(): Promise<Meeting[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('meetings').select('*').order('scheduled_at', { ascending: true });
      if (!error && data) return data as Meeting[];
    }
    return localDb.getMeetings();
  },

  async getDiagnostics(): Promise<Diagnostic[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('diagnostics').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const diagnostics = data as Diagnostic[];
        for (const d of diagnostics) {
          const { data: answers } = await supabase.from('diagnostic_answers').select('*').eq('diagnostic_id', d.id);
          d.answers = (answers || []) as any[];
        }
        return diagnostics;
      }
    }
    return localDb.getDiagnostics();
  },

  async getQuotes(): Promise<Quote[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(q => ({
          id: q.id,
          lead_id: q.lead_id,
          userId: q.user_id,
          quoteCode: q.quote_code,
          companyName: q.company_name,
          status: q.status,
          project_type: q.project_type,
          selected_modules: q.selected_modules,
          complexity: q.complexity,
          estimated_min: Number(q.estimated_min),
          estimated_max: Number(q.estimated_max),
          estimated_weeks: q.estimated_weeks,
          currency: q.currency,
          notes: q.notes,
          created_at: q.created_at,
          updated_at: q.updated_at
        })) as Quote[];
      }
    }
    return localDb.getQuotes();
  },

  // Auth Operations
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }
    // Mock login
    const normalizedEmail = email.toLowerCase().trim();
    const isAdmin = normalizedEmail === 'admin@recodestudio.com' || 
                    normalizedEmail === 'admin@recodestudio.com.ar' || 
                    normalizedEmail === 'gabriela@recodestudio.com.ar';
    if (isAdmin && password === 'recode2026') {
      return { success: true };
    }
    return { success: false, error: 'Credenciales incorrectas.' };
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  },

  // Email Templates Operations
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('email_templates').select('*').order('key_name', { ascending: true });
      if (!error && data) return data as EmailTemplate[];
    }
    return localDb.getEmailTemplates();
  },

  async updateEmailTemplate(keyName: string, subject: string, bodyHtml: string, bodyText: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('email_templates')
        .update({ subject, body_html: bodyHtml, body_text: bodyText, updated_at: new Date().toISOString() })
        .eq('key_name', keyName);
      return;
    }
    localDb.updateEmailTemplate(keyName, subject, bodyHtml, bodyText);
  },

  // Email Settings Operations
  async getEmailSettings(): Promise<EmailSetting[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('email_settings').select('*').order('key_name', { ascending: true });
      if (!error && data) return data as EmailSetting[];
    }
    return localDb.getEmailSettings();
  },

  async updateEmailSettings(settings: { key_name: string; value: string }[]): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      for (const item of settings) {
        await supabase.from('email_settings')
          .update({ value: item.value, updated_at: new Date().toISOString() })
          .eq('key_name', item.key_name);
      }
      return;
    }
    localDb.updateEmailSettings(settings);
  },

  // Trigger server-side mail sending API route
  async sendEmailTrigger(templateKey: string, toEmail: string, data: any): Promise<boolean> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateKey, toEmail, data })
      });
      return response.ok;
    } catch (e) {
      console.error('Failed to trigger send-email API:', e);
      return false;
    }
  },

  // Client Auth Operations
  async signUp(user: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; user?: User; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      const { data: existing } = await supabase.from('clients').select('id').eq('email', user.email).limit(1);
      if (existing && existing.length > 0) {
        return { success: false, error: 'El email ya se encuentra registrado.' };
      }
      
      const { data, error } = await supabase.from('clients').insert({
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        company_name: user.companyName,
        password: user.password
      }).select().single();
      
      if (!error && data) {
        return {
          success: true,
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            whatsapp: data.whatsapp,
            companyName: data.company_name,
            createdAt: data.created_at
          }
        };
      }
      return { success: false, error: error?.message || 'Error al registrar cliente.' };
    }
    
    // Fallback
    const users = localDb.getUsers();
    const exists = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) {
      return { success: false, error: 'El email ya se encuentra registrado.' };
    }
    const newUser: User = {
      ...user,
      id: `u-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    localDb.saveUser(newUser);
    return { success: true, user: newUser };
  },

  async signInClient(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('clients')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('password', password)
        .limit(1);
      if (!error && data && data.length > 0) {
        const c = data[0];
        return {
          success: true,
          user: {
            id: c.id,
            name: c.name,
            email: c.email,
            whatsapp: c.whatsapp,
            companyName: c.company_name,
            createdAt: c.created_at
          }
        };
      }
      return { success: false, error: 'Credenciales inválidas.' };
    }
    
    // Fallback
    const users = localDb.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      return { success: true, user: found };
    }
    return { success: false, error: 'Credenciales inválidas.' };
  },

  async getQuotesByUserId(userId: string): Promise<Quote[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('quotes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(q => ({
          id: q.id,
          lead_id: q.lead_id,
          userId: q.user_id,
          quoteCode: q.quote_code,
          companyName: q.company_name,
          status: q.status,
          project_type: q.project_type,
          selected_modules: q.selected_modules,
          complexity: q.complexity,
          estimated_min: Number(q.estimated_min),
          estimated_max: Number(q.estimated_max),
          estimated_weeks: q.estimated_weeks,
          currency: q.currency,
          notes: q.notes,
          created_at: q.created_at,
          updated_at: q.updated_at
        })) as Quote[];
      }
    }
    const quotes = localDb.getQuotes();
    return quotes.filter(q => q.userId === userId);
  },

  async getClientProjects(userId?: string): Promise<ClientProject[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('client_projects').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data.map(p => ({
          id: p.id,
          projectCode: p.project_code,
          quoteId: p.quote_id,
          userId: p.user_id,
          name: p.name,
          status: p.status,
          startDate: p.start_date,
          estimatedDeliveryDate: p.estimated_delivery_date,
          assignedPM: p.assigned_pm,
          progress: p.progress,
          phases: p.phases,
          createdAt: p.created_at
        })) as ClientProject[];
      }
    }
    const projects = localDb.getClientProjects();
    if (userId) {
      return projects.filter(p => p.userId === userId);
    }
    return projects;
  },

  async convertQuoteToProject(quoteId: string, finalMonthlyAbono?: number): Promise<ClientProject> {
    if (isSupabaseConfigured && supabase) {
      const { data: quoteData, error: quoteErr } = await supabase.from('quotes').select('*').eq('id', quoteId).single();
      if (quoteErr || !quoteData) throw new Error('Cotización no encontrada');
      
      await supabase.from('quotes').update({ status: 'convertida', updated_at: new Date().toISOString() }).eq('id', quoteId);
      
      const rand = Math.floor(1000 + Math.random() * 9000);
      const projectCode = `RC-PRJ-2026-${rand}`;
      const startDate = new Date().toISOString().split('T')[0];
      const estimatedDeliveryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * quoteData.estimated_weeks).toISOString().split('T')[0];
      const phases = [
        { phaseNumber: 1, title: 'Fase 1: Relevamiento y Alcance', status: 'en_proceso', progress: 0, estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString().split('T')[0], description: 'Definición de funcionalidades, pasarelas de pago y diseño de base de datos final.' },
        { phaseNumber: 2, title: 'Fase 2: Diseño UX/UI', status: 'pendiente', progress: 0, estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString().split('T')[0], description: 'Wireframes interactivos de la tienda online pública y el panel administrativo.' },
        { phaseNumber: 3, title: 'Fase 3: Desarrollo Core Frontend & Backend', status: 'pendiente', progress: 0, estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString().split('T')[0], description: 'Codificación del sistema Next.js, base de datos local y panel administrador de stock.' },
        { phaseNumber: 4, title: 'Fase 4: Integraciones y Pruebas', status: 'pendiente', progress: 0, estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString().split('T')[0], description: 'Conexión de Mercado Pago y Correo Argentino. Pruebas de velocidad y SEO.' },
        { phaseNumber: 5, title: 'Fase 5: Lanzamiento y Capacitación', status: 'pendiente', progress: 0, estimatedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 75).toISOString().split('T')[0], description: 'Subida a servidores de producción, traspaso de dominios y capacitación de uso del panel al equipo.' }
      ];
      
      const { data: newProject, error: projErr } = await supabase.from('client_projects').insert({
        project_code: projectCode,
        quote_id: quoteId,
        user_id: quoteData.user_id,
        name: `${quoteData.company_name || 'Proyecto'} Core`,
        status: 'activo',
        start_date: startDate,
        estimated_delivery_date: estimatedDeliveryDate,
        assigned_pm: 'Tomas Recode',
        progress: 0,
        phases: phases
      }).select().single();
      
      if (projErr || !newProject) throw new Error(projErr?.message || 'Error al crear proyecto');
      
      const abonoValue = finalMonthlyAbono || Number(quoteData.estimated_min);
      const paymentsToInsert = [];
      for (let i = 1; i <= 12; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + (i - 1));
        paymentsToInsert.push({
          user_id: quoteData.user_id,
          project_id: newProject.id,
          amount: abonoValue,
          period: `Abono Mensual (Cuota ${i}/12)`,
          status: i === 1 ? 'pagado' : 'pendiente',
          due_date: dueDate.toISOString().split('T')[0],
          paid_at: i === 1 ? new Date().toISOString() : null
        });
      }
      await supabase.from('payments').insert(paymentsToInsert);
      
      const { data: clientData } = await supabase.from('clients').select('email, name').eq('id', quoteData.user_id).single();
      if (clientData) {
        const formattedPrice = `$ ${abonoValue.toLocaleString('es-AR')}`;
        const modulesList = quoteData.selected_modules.join(', ');
        dbClient.sendEmailTrigger('contract_delivery', clientData.email, {
          name: clientData.name,
          project_name: newProject.name,
          price: formattedPrice,
          modules: modulesList,
          pm: newProject.assigned_pm
        });
      }
      
      return {
        id: newProject.id,
        projectCode: newProject.project_code,
        quoteId: newProject.quote_id,
        userId: newProject.user_id,
        name: newProject.name,
        status: newProject.status,
        startDate: newProject.start_date,
        estimatedDeliveryDate: newProject.estimated_delivery_date,
        assignedPM: newProject.assigned_pm,
        progress: newProject.progress,
        phases: newProject.phases,
        createdAt: newProject.created_at
      } as ClientProject;
    }
    
    return localDb.convertQuoteToProject(quoteId, finalMonthlyAbono);
  },

  async updateProjectPhase(projectId: string, phaseNumber: number, status: ProjectPhase['status'], progress: number, date?: string, desc?: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { data: project, error } = await supabase.from('client_projects').select('phases').eq('id', projectId).single();
      if (error || !project) throw new Error('Proyecto no encontrado');
      
      const currentPhases = project.phases as ProjectPhase[];
      const updatedPhases = currentPhases.map(ph => {
        if (ph.phaseNumber === phaseNumber) {
          return {
            ...ph,
            status,
            progress,
            estimatedDate: date || ph.estimatedDate,
            description: desc || ph.description
          };
        }
        return ph;
      });
      
      const totalProgress = Math.round(updatedPhases.reduce((acc, p) => acc + p.progress, 0) / updatedPhases.length);
      
      await supabase.from('client_projects').update({
        phases: updatedPhases,
        progress: totalProgress
      }).eq('id', projectId);
      return;
    }
    localDb.updateProjectPhase(projectId, phaseNumber, status, progress, date, desc);
  },

  async updateProjectPM(projectId: string, assignedPM: string, estimatedDeliveryDate?: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const updates: any = { assigned_pm: assignedPM };
      if (estimatedDeliveryDate) {
        updates.estimated_delivery_date = estimatedDeliveryDate;
      }
      await supabase.from('client_projects').update(updates).eq('id', projectId);
      return;
    }
    localDb.updateProjectPM(projectId, assignedPM, estimatedDeliveryDate);
  },

  async updateProjectAbonoAmount(projectId: string, amount: number): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('payments')
        .update({ amount })
        .eq('project_id', projectId)
        .neq('status', 'pagado');
      if (error) throw new Error(error.message);
      return;
    }
    localDb.updateProjectAbonoAmount(projectId, amount);
  },

  async getMessages(userId?: string): Promise<Message[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('messages').select('*').order('created_at', { ascending: true });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data.map(m => ({
          id: m.id,
          userId: m.user_id,
          projectId: m.project_id,
          quoteId: m.quote_id,
          category: m.category,
          message: m.message,
          sender: m.sender,
          status: m.status,
          createdAt: m.created_at
        })) as Message[];
      }
    }
    const messages = localDb.getMessages();
    if (userId) {
      return messages.filter(m => m.userId === userId);
    }
    return messages;
  },

  async sendMessage(msg: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('messages').insert({
        user_id: msg.userId,
        project_id: msg.projectId || null,
        quote_id: msg.quoteId || null,
        category: msg.category,
        message: msg.message,
        sender: msg.sender,
        status: msg.status
      }).select().single();
      
      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          projectId: data.project_id,
          quoteId: data.quote_id,
          category: data.category,
          message: data.message,
          sender: data.sender,
          status: data.status,
          createdAt: data.created_at
        } as Message;
      }
    }
    
    // Fallback
    const newMsg: Message = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    localDb.saveMessage(newMsg);
    return newMsg;
  },

  async getDocuments(userId?: string): Promise<Document[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data.map(d => ({
          id: d.id,
          userId: d.user_id,
          projectId: d.project_id,
          quoteId: d.quote_id,
          fileName: d.file_name,
          fileType: d.file_type,
          fileSize: d.file_size,
          status: d.status,
          uploadedAt: d.uploaded_at
        })) as Document[];
      }
    }
    const docs = localDb.getDocuments();
    if (userId) {
      return docs.filter(d => d.userId === userId);
    }
    return docs;
  },

  async uploadDocument(doc: Omit<Document, 'id' | 'uploadedAt' | 'status'>): Promise<Document> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('documents').insert({
        user_id: doc.userId,
        project_id: doc.projectId || null,
        quote_id: doc.quoteId || null,
        file_name: doc.fileName,
        file_type: doc.fileType,
        file_size: doc.fileSize,
        status: 'recibido'
      }).select().single();
      
      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          projectId: data.project_id,
          quoteId: data.quote_id,
          fileName: data.file_name,
          fileType: data.file_type,
          fileSize: data.file_size,
          status: data.status,
          uploadedAt: data.uploaded_at
        } as Document;
      }
    }
    
    // Fallback
    const newDoc: Document = {
      ...doc,
      id: `doc-${Date.now()}`,
      status: 'recibido',
      uploadedAt: new Date().toISOString()
    };
    localDb.saveDocument(newDoc);
    return newDoc;
  },

  async updateDocumentStatus(docId: string, status: Document['status']): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('documents').update({ status }).eq('id', docId);
      return;
    }
    localDb.updateDocumentStatus(docId, status);
  },

  async getPayments(userId?: string): Promise<Payment[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('payments').select('*').order('due_date', { ascending: true });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data.map(p => ({
          id: p.id,
          userId: p.user_id,
          projectId: p.project_id,
          amount: Number(p.amount),
          period: p.period,
          status: p.status,
          dueDate: p.due_date,
          paidAt: p.paid_at || undefined,
          comprobanteUploaded: p.comprobante_uploaded
        })) as Payment[];
      }
    }
    const payments = localDb.getPayments();
    if (userId) {
      return payments.filter(p => p.userId === userId);
    }
    return payments;
  },

  async updatePaymentStatus(paymentId: string, status: Payment['status'], paidAt?: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('payments').update({
        status,
        paid_at: paidAt || null
      }).eq('id', paymentId);
      return;
    }
    localDb.updatePaymentStatus(paymentId, status, paidAt);
  },

  async uploadPaymentReceipt(paymentId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('payments').update({
        comprobante_uploaded: true
      }).eq('id', paymentId);
      return;
    }
    localDb.uploadPaymentReceipt(paymentId);
  },

  async getClients(): Promise<User[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          whatsapp: c.whatsapp,
          companyName: c.company_name,
          createdAt: c.created_at
        }));
      }
    }
    return localDb.getUsers();
  },

  async updateQuoteStatus(quoteId: string, status: Quote['status'], comments?: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const updates: any = { status };
      if (comments !== undefined) {
        updates.notes = comments;
      }
      await supabase.from('quotes').update(updates).eq('id', quoteId);
      return;
    }
    localDb.updateQuoteStatus(quoteId, status, comments);
  },

  async updateQuoteDetails(quoteId: string, status: Quote['status'], min: number, max: number, weeks: number, notes: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('quotes').update({
        status,
        estimated_min: min,
        estimated_max: max,
        estimated_weeks: weeks,
        notes,
        updated_at: new Date().toISOString()
      }).eq('id', quoteId);
      return;
    }
    localDb.updateQuoteDetails(quoteId, status, min, max, weeks, notes);
  }
};
