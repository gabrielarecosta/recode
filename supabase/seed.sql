-- ReCode Studio Supabase Database Seeding Script
-- Execute this script in the Supabase SQL Editor to populate the tables.

-- 1. ROLES
INSERT INTO public.roles (id, name)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'client')
ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;

-- 2. SERVICES
INSERT INTO public.services (id, name, slug, description, category, features, example_use, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Páginas Web Personalizadas', 'paginas-web', 'Diseño único adaptado a tu marca con código desde cero, velocidad extrema y optimización SEO.', 'web', ARRAY['Diseño a medida', 'Panel auto-administrable', 'Optimizado para SEO', 'Carga rápida'], 'Sitio institucional premium para empresas de servicios', true),
  ('00000000-0000-0000-0000-000000000002', 'Ecommerce Profesional', 'ecommerce', 'Tiendas online pensadas para vender más con pasarelas de pago y envíos integrados.', 'ecommerce', ARRAY['Carrito de compras', 'Mercado Pago / Stripe', 'Integración de Envíos', 'Cupón de descuentos'], 'Venta de productos físicos a nivel nacional', true),
  ('00000000-0000-0000-0000-000000000003', 'Ecommerce con Gestión Interna', 'ecommerce-gestion-interna', 'Solución completa que unifica la tienda online con tus paneles internos de administración.', 'ecommerce', ARRAY['Sincronización de Stock', 'Cuentas corrientes', 'Fichero de clientes', 'Reportes contables'], 'Negocio de retail con venta minorista y mayorista integrada', true),
  ('00000000-0000-0000-0000-000000000004', 'Sistemas de Gestión', 'sistemas-gestion', 'Herramientas a medida para organizar inventario, tareas, clientes y procesos de tu negocio.', 'system', ARRAY['Gestión de Stock', 'Flujo de tareas', 'Módulo de Clientes', 'Roles de empleados'], 'Control operativo de pymes y talleres de servicios', true),
  ('00000000-0000-0000-0000-000000000005', 'Sistemas Contables', 'sistemas-contables', 'Controles de caja, facturación, cuentas corrientes y reportes de rentabilidad automáticos.', 'system', ARRAY['Cajas diarias', 'Facturas PDF', 'Cuentas Corrientes', 'Reportes contables'], 'Control de caja y saldos adeudados para empresas de servicios.', true),
  ('00000000-0000-0000-0000-000000000006', 'Automatización de Procesos', 'automatizacion', 'Eliminamos tareas repetitivas conectando tus planillas con notificaciones automáticas por mail y WhatsApp.', 'automation', ARRAY['WhatsApp API', 'Emails transaccionales', 'Alertas internas', 'Recordatorios de turnos'], 'Envío de presupuestos y alertas de vencimiento automáticas', true),
  ('00000000-0000-0000-0000-000000000007', 'Portales de Clientes', 'portales-clientes', 'Área privada para que tus clientes descarguen facturas, vean avances y soliciten soporte.', 'system', ARRAY['Acceso seguro con clave', 'Descarga de documentos', 'Historial de pagos', 'Mensajería interna'], 'Estudio de arquitectura compartiendo entregables con clientes', true),
  ('00000000-0000-0000-0000-000000000008', 'CRM a Medida', 'crm', 'Seguimiento exacto de prospectos, cotizaciones y flujos de ventas comerciales.', 'system', ARRAY['Pipeline de ventas', 'Ficha de prospecto', 'Historial de contacto', 'Tareas pendientes'], 'Equipo comercial inmobiliario gestionando consultas', true),
  ('00000000-0000-0000-0000-000000000009', 'Dashboards y Métricas', 'dashboards', 'Visualizá toda la información clave de tu negocio en un solo panel gráfico interactivo.', 'system', ARRAY['Gráficos dinámicos', 'Exportación CSV/PDF', 'KPIs principales', 'Filtros avanzados'], 'Directores visualizando rentabilidad mensual por unidad', true),
  ('00000000-0000-0000-0000-000000000010', 'Sistemas de Turnos', 'sistemas-turnos', 'Agenda online para clientes, reservas por WhatsApp, pagos señados y gestión de profesionales.', 'system', ARRAY['Calendario interactivo', 'Recordatorios automáticos', 'Pago de señas', 'Paneles para profesionales'], 'Clínica médica o estética con múltiples consultorios', true),
  ('00000000-0000-0000-0000-000000000011', 'Integraciones Especiales', 'integraciones', 'Conexión segura entre tus sistemas actuales, APIs externas y bases de datos heredadas.', 'automation', ARRAY['Conexión de APIs', 'Sincronización horaria', 'Migración segura', 'Logs de auditoría'], 'Conectar un ERP local con una plataforma web externa', true),
  ('00000000-0000-0000-0000-000000000012', 'Web Apps Complejas', 'web-apps', 'Desarrollos avanzados a medida para plataformas escalables de software como servicio (SaaS).', 'web', ARRAY['Arquitectura SaaS', 'Base de datos robusta', 'Planes de suscripción', 'Multi-tenant'], 'Plataforma para gestión de flotas y conductores en tiempo real', true)
ON CONFLICT (slug) 
DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  features = EXCLUDED.features,
  example_use = EXCLUDED.example_use,
  is_active = EXCLUDED.is_active;

-- 3. PROJECTS
INSERT INTO public.projects (id, slug, name, category, industry, type, status, description, problem, solution, features, is_concept, suggested_phases, integrations)
VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    'bruma-moda',
    'Bruma Moda',
    'ecommerce',
    'Indumentaria y Accesorios',
    'Ecommerce + Gestión Interna',
    'concept',
    'Tienda online personalizada para negocios de indumentaria, accesorios o decoración que necesitan vender online y gestionar su operation real desde un panel interno unificado.',
    'La marca gestionaba ventas web por una plantilla tradicional, pero controlaba stock, condicionales, cuentas corrientes de clientes mayoristas y entregas mediante planillas Excel desconectadas, duplicando el trabajo y generando errores de inventario.',
    'Creamos una plataforma web a medida que integra la tienda online con un panel administrativo interno de gestión en tiempo real. Los clientes compran minorista y mayorista, y el equipo administra inventario, despachos, condicionales y cuentas corrientes en el mismo lugar.',
    ARRAY[
      'Tienda online 100% personalizada y optimizada para mobile',
      'Gestión de variantes de talles, colores y stock sincronizados',
      'Pasarela de cobro integrado con Mercado Pago y cotizador de Correo Argentino',
      'Panel administrador para control de inventario y pedidos',
      'Módulo de Cuentas Corrientes y control de mercadería "en condicional" para revendedoras',
      'Portal privado de cliente para ver historial de compras y saldos adeudados',
      'Emails transaccionales y notificaciones de WhatsApp automáticas'
    ],
    true,
    ARRAY['Fase 1: Tienda Online y Panel de Control de Stock', 'Fase 2: Módulo de Cuentas Corrientes y Revendedoras', 'Fase 3: Portal de Clientes y Automatizaciones por WhatsApp'],
    ARRAY['Mercado Pago', 'Correo Argentino', 'WhatsApp Business API', 'Factura Electrónica AFIP']
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'contanova-estudio',
    'ContaNova Estudio',
    'management',
    'Estudios Contables',
    'Sistema Contable + Portal de Clientes',
    'concept',
    'Web profesional y portal privado para la organización de vencimientos, carga de documentos, tareas y liquidación de impuestos de clientes del estudio contable.',
    'Dificultad para recibir documentación de clientes de forma ordenada, consultas constantes por WhatsApp sobre fechas de vencimientos y demoras en el envío de liquidaciones mensuales, generando fricción y cuellos de botella.',
    'Desarrollamos una plataforma institucional con un Portal Privado de Clientes donde cada empresa accede con su usuario para subir facturas, descargar liquidaciones de IVA/Sueldos, y ver alertas de su calendario fiscal personalizado.',
    ARRAY[
      'Web pública para captar empresas y autónomos con calculadora fiscal',
      'Portal del cliente seguro con visualización de calendario y vencimientos',
      'Sistema drag & drop para carga de facturas, balances y documentación',
      'Panel interno contable para ver clientes por CUIT y estado de trámites',
      'Recordatorios automatizados de vencimientos vía mail y notificaciones web',
      'Módulo de facturación de honorarios del estudio con cobro electrónico'
    ],
    true,
    ARRAY['Fase 1: Web Pública y Portal del Cliente Básico', 'Fase 2: Calendario Fiscal Automático y Panel de Tareas Contables', 'Fase 3: Carga Avanzada de Archivos con Clasificación Automática'],
    ARRAY['Mercado Pago (Débito Automático)', 'Google Drive / Storage', 'Notificaciones por Email (Resend)', 'WhatsApp Webhook']
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'agrolink-repuestos',
    'AgroLink Repuestos',
    'management',
    'Maquinaria y Repuestos Agrícolas',
    'Web + CRM + Portal de Clientes',
    'concept',
    'Catálogo de piezas de repuestos para maquinaria agrícola, cotizador interactivo, solicitudes posventa y seguimiento técnico de equipos.',
    'Los productores rurales necesitaban repuestos específicos con urgencia. El proceso de cotización telefónico era lento, sin historial de reparaciones por maquinaria y sin alertas automáticas de service.',
    'Desarrollamos un portal integral de autogestión donde el productor registra su flota de maquinaria, calcula el desgaste de piezas clave, solicita presupuestos y hace seguimiento de órdenes de trabajo en taller.',
    ARRAY[
      'Buscador técnico avanzado de repuestos por modelo y marca',
      'Portal de clientes con registro de maquinaria (Modelo, Año, Horas de uso)',
      'Calculadora interactiva de desgaste de consumibles (cuchillas, correas)',
      'CRM interno para gestión de presupuestos técnicos e historial de service',
      'Alertas preventivas de service al agricultor según las horas de uso declaradas',
      'Generador de reportes de mantenimiento y costo operativo anual en PDF'
    ],
    true,
    ARRAY['Fase 1: Catálogo y Cotizador de Repuestos con CRM interno', 'Fase 2: Portal del Cliente con Historial de Maquinaria', 'Fase 3: Módulo de Taller y Órdenes de Trabajo en Tiempo Real'],
    ARRAY['WhatsApp API (Notificación al campo)', 'ERP de Inventario Local', 'Generador PDF Automático']
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    'nexoturnos-salud',
    'NexoTurnos Salud',
    'management',
    'Salud y Estética',
    'Sistemas de Turnos + Gestión Profesional',
    'concept',
    'Sistema web para centralizar turnos online, disponibilidad médica, fichas de pacientes y recordatorios automáticos de asistencia.',
    'Alta tasa de ausentismo en turnos agendados, superposición horaria de profesionales y pérdida de tiempo del personal administrativo coordinando citas manualmente.',
    'Plataforma con agenda interactiva para pacientes que valida prepagas, permite el abono de una seña (Mercado Pago) para evitar ausentismo, y envía alertas automáticas por WhatsApp para confirmación o cancelación de citas.',
    ARRAY[
      'Reserva de turnos online por profesional, especialidad y obra social/prepaga',
      'Portal del paciente con historial de turnos, indicaciones médicas y descargas',
      'Panel del profesional para ver agenda diaria, bloqueo de horarios y notas',
      'Módulo administrativo para control de consultorios, pagos de copagos y cancelaciones',
      'Notificaciones y alertas automatizadas por WhatsApp 24 horas antes del turno',
      'Estadísticas de ausentismo y facturación por profesional'
    ],
    true,
    ARRAY['Fase 1: Motor de Turnos y Panel de Pacientes', 'Fase 2: Integración de Pagos de Señas y Notificaciones por WhatsApp', 'Fase 3: Portal del Profesional y Ficha de Evolución Básica'],
    ARRAY['Mercado Pago API', 'Google Calendar API (Sincronización médica)', 'WhatsApp Business Cloud API']
  ),
  (
    '00000000-0000-0000-0000-000000000105',
    'ruta-norte-logistica',
    'Ruta Norte Logística',
    'management',
    'Transporte y Logística',
    'Sistema de Flota + Seguimiento de Cargas',
    'concept',
    'Plataforma logística integral para gestionar la flota de vehículos, mantenimiento preventivo, asignación de viajes y portal de seguimiento para clientes.',
    'Falta de visibilidad sobre los costos de combustible por viaje, demoras en la actualización del estado del envío a los clientes e inconvenientes por vencimiento de pólizas de seguro de camiones.',
    'Creamos un panel de control interno para el despachante de carga y un portal de seguimiento para los clientes finales, integrando alertas de mantenimiento e indicadores de rentabilidad de la flota.',
    ARRAY[
      'Dashboard operativo de viajes activos, choferes asignados y combustible',
      'Calculadora de costos estimada según distancia, tipo de carga y urgencia',
      'Portal del cliente para seguimiento de carga en mapa interactivo con datos demo',
      'Módulo de mantenimiento preventivo y alertas de vencimiento de documentación',
      'Gestión de hojas de ruta, choferes y viáticos de forma digital',
      'Generación de remitos digitales y facturas de transporte'
    ],
    true,
    ARRAY['Fase 1: Módulo de Flota, Choferes y Viajes Internos', 'Fase 2: Calculadora de Distancias y Portal de Seguimiento al Cliente', 'Fase 3: Alertas de Mantenimiento Avanzado y Liquidación de Combustible'],
    ARRAY['Google Maps API', 'SMS/WhatsApp para alertas de entrega', 'APIs de Rastreo Satelital (Demo)']
  ),
  (
    '00000000-0000-0000-0000-000000000106',
    'prisma-gestion-inmobiliaria',
    'Prisma Gestión Inmobiliaria',
    'management',
    'Real Estate / Inmobiliarias',
    'Portal Inmobiliario + Administración de Alquileres',
    'concept',
    'Sitio de propiedades con filtros avanzados, CRM para agentes, portal de propietarios y portal de inquilinos para el cobro de alquileres.',
    'Desorden en las consultas recibidas de múltiples portales (ZonaProp, Argenprop), retrasos en las liquidaciones mensuales a propietarios y falta de seguimiento estructurado de visitas a inmuebles.',
    'Desarrollamos una plataforma inmobiliaria centralizada que unifica la web pública con un CRM para los agentes y portales privados de autogestión para propietarios e inquilinos.',
    ARRAY[
      'Buscador interactivo de propiedades con mapa y filtros específicos',
      'CRM interno de contactos, visitas agendadas y pipeline de negociación',
      'Portal del inquilino para ver cuotas de alquiler, subir comprobantes de pago y reportar averías',
      'Portal del propietario para ver liquidaciones mensuales y estado de sus inmuebles',
      'Calculadora de indexación de contratos según índices oficiales',
      'Formulario inteligente de tasación online con precalificación'
    ],
    true,
    ARRAY['Fase 1: Buscador de Propiedades y CRM de Consultas', 'Fase 2: Módulo de Contratos y Portales de Propietario/Inquilino', 'Fase 3: Liquidaciones Automatizadas y Tasaciones Online Inteligentes'],
    ARRAY['Mercado Pago', 'WhatsApp Webhook (Consultas instantáneas)', 'Google Calendar (Visitas)']
  )
ON CONFLICT (slug)
DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  industry = EXCLUDED.industry,
  type = EXCLUDED.type,
  status = EXCLUDED.status,
  description = EXCLUDED.description,
  problem = EXCLUDED.problem,
  solution = EXCLUDED.solution,
  features = EXCLUDED.features,
  is_concept = EXCLUDED.is_concept,
  suggested_phases = EXCLUDED.suggested_phases,
  integrations = EXCLUDED.integrations;

-- 4. QUOTE RULES
INSERT INTO public.quote_rules (id, category, key_name, label, value, currency, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000201', 'base_price', 'landing', 'Landing Page Comercial', 800000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000202', 'base_price', 'institucional', 'Página Web Institucional', 1200000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000203', 'base_price', 'avanzada', 'Página Web Avanzada', 1800000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000204', 'base_price', 'ecommerce', 'Tienda Online (Ecommerce)', 2500000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000205', 'base_price', 'ecommerce-gestion-interna', 'Ecommerce + Gestión Interna', 4000000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000206', 'base_price', 'sistemas-gestion', 'Sistema de Gestión Interna', 3500000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000207', 'base_price', 'sistemas-contables', 'Sistema Contable', 3000000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000208', 'base_price', 'portales-clientes', 'Portal de Clientes Privado', 2200000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000209', 'base_price', 'sistemas-turnos', 'Sistema de Turnos', 2000000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000210', 'base_price', 'crm', 'CRM Comercial', 2800000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000211', 'base_price', 'dashboards', 'Dashboard y Reportes', 1800000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000212', 'base_price', 'automatizacion', 'Automatización de Procesos', 1500000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000213', 'base_price', 'integraciones', 'Integración de Sistemas', 1200000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000214', 'base_price', 'web-apps', 'Web App a Medida (SaaS)', 4500000, 'ARS', true),
  
  ('00000000-0000-0000-0000-000000000215', 'additional_module', 'auth', 'Mapeo de Roles y Permisos', 300000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000216', 'additional_module', 'payments', 'Cobros Online (Mercado Pago)', 250000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000217', 'additional_module', 'whatsapp', 'Notificaciones WhatsApp automáticas', 350000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000218', 'additional_module', 'pdf_reports', 'Generación Automática de Reportes PDF', 200000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000219', 'additional_module', 'stock_sync', 'Sincronización de Stock en tiempo real', 400000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000220', 'additional_module', 'client_portal_access', 'Portal Privado con Autenticación', 450000, 'ARS', true),
  ('00000000-0000-0000-0000-000000000221', 'additional_module', 'custom_design_premium', 'Diseño UX/UI Premium 100% Personalizado', 500000, 'ARS', true),

  ('00000000-0000-0000-0000-000000000222', 'multiplier', 'urgencia_alta', 'Urgencia Alta (Menos de 1 mes)', 1.30, 'factor', true),
  ('00000000-0000-0000-0000-000000000223', 'multiplier', 'urgencia_media', 'Urgencia Media (1 a 3 meses)', 1.00, 'factor', true),
  ('00000000-0000-0000-0000-000000000224', 'multiplier', 'urgencia_baja', 'Urgencia Baja (Más de 3 meses)', 0.90, 'factor', true)
ON CONFLICT (key_name)
DO UPDATE SET
  category = EXCLUDED.category,
  label = EXCLUDED.label,
  value = EXCLUDED.value,
  currency = EXCLUDED.currency,
  is_active = EXCLUDED.is_active;

-- 5. Ensure default templates exist (re-seed email_templates in case it wasn't done)
INSERT INTO public.email_templates (key_name, subject, body_html, body_text)
VALUES
('lead_confirmation', '¡Gracias por contactar a ReCode Studio!', 
 '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
    <h2 style="color: #ffffff; font-family: sans-serif; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">¡Hola {{name}}!</h2>
    <p>Hemos recibido tu consulta para <strong>{{company}}</strong> con éxito.</p>
    <p>Un consultor de nuestro equipo analizará tus requisitos y te contactará en menos de 24 horas hábiles.</p>
    <div style="background-color: #02031e; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee;">
      <p style="margin: 0; font-size: 14px;"><strong>Código de Consulta:</strong> {{code}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Mensaje enviado:</strong> {{message}}</p>
    </div>
    <p>Saludos cordiales,<br/>El equipo de ReCode Studio</p>
  </div>',
 'Hola {{name}}!\n\nHemos recibido tu consulta para {{company}} con éxito.\nUn consultor de nuestro equipo analizará tus requisitos y te contactará en menos de 24 horas hábiles.\n\nCódigo de Consulta: {{code}}\nMensaje enviado: {{message}}\n\nSaludos cordiales,\nEl equipo de ReCode Studio'),

('quote_notification', 'Tu estimación de presupuesto - ReCode Studio', 
 '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
    <h2 style="color: #ffffff; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">Estimación de Presupuesto Realizada</h2>
    <p>Hola {{name}},</p>
    <p>Registramos tu cálculo de presupuesto interactivo para el proyecto de tipo <strong>{{project_type}}</strong>.</p>
    <div style="background-color: #02031e; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee; text-align: center;">
      <span style="font-size: 12px; color: #9ca3af; text-transform: uppercase;">Inversión Estimada</span>
      <h3 style="color: #22d3ee; margin: 10px 0; font-size: 24px;">{{price_range}}</h3>
      <p style="margin: 0; font-size: 14px; color: #ffffff;">Plazo de entrega: {{weeks}} semanas</p>
    </div>
    <p>Código de seguimiento: <strong>{{code}}</strong></p>
    <p>Si querés avanzar con la propuesta final y ajustar los módulos, respondé a este email o agenda una llamada desde nuestro sitio.</p>
    <p>Atentamente,<br/>ReCode Studio</p>
  </div>',
 'Hola {{name}},\n\nRegistramos tu cálculo de presupuesto interactivo para el proyecto de tipo {{project_type}}.\n\nInversión Estimada: {{price_range}}\nPlazo de entrega: {{weeks}} semanas\n\nCódigo de seguimiento: {{code}}\n\nSi querés avanzar con la propuesta final y ajustar los módulos, respondé a este email o agenda una llamada desde nuestro sitio.\n\nAtentamente,\nReCode Studio'),

('meeting_scheduled', 'Reunión agendada con ReCode Studio', 
 '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
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
  </div>',
 'Hola {{name}},\n\nTu reunión de consultoría tecnológica ha sido agendada con éxito.\n\nFecha y Hora: {{date_time}} (Argentina)\nTipo de Reunión: {{meeting_type}}\nEnlace de Videollamada: {{link}}\n\nTe sugerimos tener a mano información sobre tus flujos de trabajo actuales y planillas Excel para hacer el relevamiento más ágil.\n\n¡Nos vemos pronto!\nReCode Studio'),

('diagnostic_completed', 'Tu Diagnóstico Tecnológico - ReCode Studio', 
 '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
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
  </div>',
 'Hola {{name}},\n\nProcesamos tus respuestas y generamos el informe de madurez digital para {{company}}.\n\nSolución Recomendada: {{recommendation}}\nComplejidad del Desarrollo: {{complexity}}\nMódulos sugeridos: {{modules}}\n\nCódigo de caso para seguimiento: {{code}}\n\nPodés ver y descargar tu informe de diagnóstico completo ingresando en nuestro sitio con tu código de caso.\n\nSaludos cordiales,\nReCode Studio')
ON CONFLICT (key_name) 
DO UPDATE SET 
  subject = EXCLUDED.subject, 
  body_html = EXCLUDED.body_html, 
  body_text = EXCLUDED.body_text;

-- 6. Ensure default email settings exist
INSERT INTO public.email_settings (key_name, value, description)
VALUES
  ('provider', 'mock', 'Proveedor activo de email: "mock" (imprime en logs) o "resend" (usa API key) o "smtp" (usa servidor SMTP)'),
  ('api_key', '', 'API Key para el proveedor de emails (e.g. Resend re_...)'),
  ('smtp_host', 'smtp.gmail.com', 'Servidor SMTP saliente'),
  ('smtp_port', '587', 'Puerto SMTP (587 o 465)'),
  ('smtp_user', '', 'Usuario SMTP (email)'),
  ('smtp_pass', '', 'Contraseña del servidor SMTP'),
  ('from_email', 'no-reply@recodestudio.com', 'Dirección de correo remitente'),
  ('from_name', 'ReCode Studio', 'Nombre visible del remitente')
ON CONFLICT (key_name) DO NOTHING;

-- 7. CLIENT SEED DATA (sofia@brumamoda.com)
INSERT INTO public.clients (id, name, email, whatsapp, company_name, password)
VALUES (
  '00000000-0000-0000-0000-000000000301',
  'Sofía Martínez',
  'sofia@brumamoda.com',
  '+5493585142731',
  'Bruma Moda',
  'bruma2026'
)
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  whatsapp = EXCLUDED.whatsapp,
  company_name = EXCLUDED.company_name,
  password = EXCLUDED.password;

-- 8. CLIENT SEED QUOTE
INSERT INTO public.quotes (id, user_id, quote_code, company_name, project_type, selected_modules, complexity, estimated_min, estimated_max, estimated_weeks, currency, notes, status)
VALUES (
  '00000000-0000-0000-0000-000000000401',
  '00000000-0000-0000-0000-000000000301',
  'RC-QT-2026-0001',
  'Bruma Moda',
  'ecommerce-gestion-interna',
  ARRAY['catalogo-productos', 'carrito-checkout', 'cobros-mercado-pago', 'control-stock', 'cuentas-corrientes', 'portal-privado-clientes', 'notificaciones-whatsapp', 'emails-transaccionales'],
  'Alto',
  4000000,
  5200000,
  12,
  'ARS',
  'Precotización inicial para e-commerce mayorista sincronizado.',
  'convertida'
)
ON CONFLICT (id) DO NOTHING;

-- 9. CLIENT SEED PROJECT
INSERT INTO public.client_projects (id, project_code, quote_id, user_id, name, status, start_date, estimated_delivery_date, assigned_pm, progress, phases)
VALUES (
  '00000000-0000-0000-0000-000000000501',
  'RC-PRJ-2026-0001',
  '00000000-0000-0000-0000-000000000401',
  '00000000-0000-0000-0000-000000000301',
  'Bruma Moda Core',
  'activo',
  '2026-05-10',
  '2026-08-05',
  'Tomas Recode',
  65,
  '[
    {"phaseNumber": 1, "title": "Fase 1: Relevamiento y Alcance", "status": "completado", "progress": 100, "estimatedDate": "2026-05-15", "description": "Definición de funcionalidades, pasarelas de pago y diseño de base de datos final."},
    {"phaseNumber": 2, "title": "Fase 2: Diseño UX/UI", "status": "completado", "progress": 100, "estimatedDate": "2026-05-30", "description": "Wireframes interactivos de la tienda online pública y el panel administrativo. Enlace de revisión aprobado."},
    {"phaseNumber": 3, "title": "Fase 3: Desarrollo Core Frontend & Backend", "status": "en_proceso", "progress": 65, "estimatedDate": "2026-07-10", "description": "Codificación del sistema Next.js, base de datos local y panel administrador de stock."},
    {"phaseNumber": 4, "title": "Fase 4: Integraciones y Pruebas", "status": "pendiente", "progress": 0, "estimatedDate": "2026-07-25", "description": "Conexión de Mercado Pago y Correo Argentino. Pruebas de velocidad y SEO."},
    {"phaseNumber": 5, "title": "Fase 5: Lanzamiento y Capacitación", "status": "pendiente", "progress": 0, "estimatedDate": "2026-08-05", "description": "Subida a servidores de producción, traspaso de dominios y capacitación de uso del panel al equipo."}
  ]'::jsonb
)
ON CONFLICT (project_code) DO NOTHING;

-- 10. CLIENT SEED PAYMENTS (12 Months)
INSERT INTO public.payments (id, user_id, project_id, amount, period, status, due_date, paid_at, comprobante_uploaded)
VALUES
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 1/12)', 'pagado', '2026-05-10', '2026-05-10T12:00:00.000Z', false),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 2/12)', 'pagado', '2026-06-10', '2026-06-09T15:00:00.000Z', false),
  ('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 3/12)', 'pendiente', '2026-07-10', null, false),
  ('00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 4/12)', 'pendiente', '2026-08-10', null, false),
  ('00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 5/12)', 'pendiente', '2026-09-10', null, false),
  ('00000000-0000-0000-0000-000000000606', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 6/12)', 'pendiente', '2026-10-10', null, false),
  ('00000000-0000-0000-0000-000000000607', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 7/12)', 'pendiente', '2026-11-10', null, false),
  ('00000000-0000-0000-0000-000000000608', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 8/12)', 'pendiente', '2026-12-10', null, false),
  ('00000000-0000-0000-0000-000000000609', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 9/12)', 'pendiente', '2027-01-10', null, false),
  ('00000000-0000-0000-0000-000000000610', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 10/12)', 'pendiente', '2027-02-10', null, false),
  ('00000000-0000-0000-0000-000000000611', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 11/12)', 'pendiente', '2027-03-10', null, false),
  ('00000000-0000-0000-0000-000000000612', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 1200000, 'Abono Mensual (Cuota 12/12)', 'pendiente', '2027-04-10', null, false)
ON CONFLICT (id) DO NOTHING;

-- 11. CLIENT SEED MESSAGES (Chat history)
INSERT INTO public.messages (id, user_id, project_id, quote_id, category, message, sender, status, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', 'general', '¡Hola! Bienvenidos a su portal de clientes de ReCode Studio. Aquí pueden ver el avance del proyecto, descargar documentos y realizar consultas.', 'recode', 'replied', timezone('utc'::text, now()) - INTERVAL '29 days'),
  ('00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', 'general', 'Hola! Buenísimo. ¿Cuándo estarían listos los primeros mockups del diseño?', 'client', 'replied', timezone('utc'::text, now()) - INTERVAL '28 days'),
  ('00000000-0000-0000-0000-000000000703', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', 'general', 'Están planificados para el próximo martes. Les va a llegar una alerta por email con el enlace interactivo.', 'recode', 'replied', timezone('utc'::text, now()) - INTERVAL '28 days' + INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- 12. CLIENT SEED DOCUMENTS
INSERT INTO public.documents (id, user_id, project_id, quote_id, file_name, file_type, file_size, status, uploaded_at)
VALUES
  ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', 'Contrato y Especificación de Requerimientos (SRS).pdf', 'pdf', '1.4 MB', 'aprobado', timezone('utc'::text, now()) - INTERVAL '29 days'),
  ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', 'Logo Bruma Moda Vectorizado.ai', 'ai', '2.3 MB', 'revisado', timezone('utc'::text, now()) - INTERVAL '25 days'),
  ('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', 'Manual Preliminar de Administración.pdf', 'pdf', '2.1 MB', 'recibido', timezone('utc'::text, now()) - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;
