import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Cpu, ArrowLeft, Check, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface SolutionData {
  title: string;
  category: string;
  complexity: 'Bajo' | 'Medio' | 'Alto' | 'Avanzado';
  weeks: string;
  problem: string;
  solution: string;
  modules: string[];
  example: string;
}

const SOLUTIONS_MAP: Record<string, SolutionData> = {
  'paginas-web': {
    title: 'Páginas Web Personalizadas',
    category: 'web',
    complexity: 'Medio',
    weeks: '4 a 6 semanas',
    problem: 'Tu marca se ve genérica y lenta porque usa plantillas prefabricadas, lo que resulta en una mala experiencia de usuario y penalizaciones en motores de búsqueda (SEO).',
    solution: 'Programamos tu web desde cero, optimizándola para mobile, velocidad extrema y posicionamiento SEO, con un panel autoadministrable intuitivo.',
    modules: ['Maquetación 100% personalizada en Next.js', 'Optimizaciones Core Web Vitals (Velocidad)', 'Panel de control de contenidos (CMS)', 'SEO técnico e indexación automatizada'],
    example: 'Sitio institucional premium para estudios contables o empresas de servicios.'
  },
  'ecommerce': {
    title: 'Tienda Online (Ecommerce)',
    category: 'ecommerce',
    complexity: 'Medio',
    weeks: '6 a 8 semanas',
    problem: 'Las tiendas genéricas de alquiler tienen límites estrictos de personalización, comisiones por venta y no permiten implementar reglas de negocio a medida.',
    solution: 'Desarrollamos un ecommerce libre, rápido, sin comisiones por venta, y con pasarelas de pago y envíos integrados.',
    modules: ['Catálogo autoadministrable de productos', 'Carrito de compras y Checkout dinámico', 'Mercado Pago / cobros electrónicos', 'Integración con Correo Argentino / Andreani'],
    example: 'Tienda para marcas de cosmética natural o calzado minorista.'
  },
  'ecommerce-gestion-interna': {
    title: 'Ecommerce con Gestión Interna',
    category: 'ecommerce',
    complexity: 'Avanzado',
    weeks: '10 a 12 semanas',
    problem: 'La tienda online minorista y el depósito mayorista están desconectados, obligando a tu equipo a sincronizar stock y saldos en planillas Excel manualmente.',
    solution: 'Unificamos la tienda pública con tus paneles administrativos en un solo sistema. Los pedidos restan stock e impactan en las cuentas corrientes al instante.',
    modules: ['Panel de control administrativo integrado', 'Módulo de Cuentas Corrientes y Revendedoras', 'Sincronizador automático de stock e inventario', 'Registro de condicionales de mercadería', 'Notificaciones de despacho vía WhatsApp'],
    example: 'Distribuidora mayorista y minorista de indumentaria (e.g. Bruma Moda).'
  },
  'sistemas-gestion': {
    title: 'Sistemas de Gestión Interna',
    category: 'system',
    complexity: 'Alto',
    weeks: '8 a 10 semanas',
    problem: 'Tu empresa maneja información en muchas planillas separadas. Hay pérdida de datos, retrasos operativos y no se sabe qué tareas están pendientes.',
    solution: 'Construimos un panel a medida adaptado a tus procesos reales de clientes, stock, proveedores y tareas operativas.',
    modules: ['Ficheros únicos de clientes y proveedores', 'Control de stock físico e ingresos', 'Tableros Kanban de seguimiento de tareas', 'Módulo de reportes y exportación de datos'],
    example: 'Control de órdenes de trabajo para talleres o service de maquinaria.'
  },
  'sistemas-contables': {
    title: 'Sistemas Contables y de Caja',
    category: 'system',
    complexity: 'Alto',
    weeks: '8 a 10 semanas',
    problem: 'Dificultades para conciliar cajas diarias en múltiples sucursales, facturación manual AFIP lenta y descontrol en saldos adeudados.',
    solution: 'Módulos para registrar cierres de caja, arqueos impositivos, facturación electrónica y cuentas corrientes integradas.',
    modules: ['Mapeo de caja diaria y arqueos', 'Mapeo de egresos y flujo operativo', 'Facturación electrónica (conexión AFIP)', 'Resúmenes de Cuentas Corrientes e interés'],
    example: 'Control contable diario para estudios profesionales o retail con caja.'
  },
  'automatizacion': {
    title: 'Automatización de Procesos',
    category: 'automation',
    complexity: 'Medio',
    weeks: '4 a 6 semanas',
    problem: 'Tu equipo repite tareas mecánicas todos los días (enviar mails, alertar vencimientos, transcribir datos de planillas).',
    solution: 'Desarrollamos flujos automatizados de emails, WhatsApp y sincronizaciones impositivas que eliminan las tareas manuales.',
    modules: ['Envío automático de WhatsApp Business', 'Automatización de correos de vencimiento', 'Alertas internas por WhatsApp para stock bajo', 'Conectores automáticos de Sheets a base de datos'],
    example: 'Recordatorio automático de turnos médicos y cobro de vencimientos.'
  },
  'portales-clientes': {
    title: 'Portales Privados de Clientes',
    category: 'system',
    complexity: 'Medio',
    weeks: '6 a 8 semanas',
    problem: 'Tus clientes solicitan constantemente facturas, balances o estados de cuentas por WhatsApp, saturando al equipo de atención.',
    solution: 'Área segura de autogestión donde cada cliente inicia sesión para descargar su documentación impositiva o ver sus balances.',
    modules: ['Autenticación segura por cliente', 'Repositorio drag & drop de archivos (PDF)', 'Visualización de estados de cuenta y saldos', 'Mensajería interna de soporte técnico'],
    example: 'Estudio contable compartiendo liquidaciones mensuales con clientes (e.g. ContaNova).'
  },
  'crm': {
    title: 'CRM y Seguimiento Comercial',
    category: 'system',
    complexity: 'Alto',
    weeks: '8 a 10 semanas',
    problem: 'Falta de orden en el seguimiento de prospectos. Los vendedores olvidan llamar a los contactos y se pierden oportunidades de ventas.',
    solution: 'Diseñamos un pipeline de ventas dinámico donde registrás prospectos, cotizaciones asociadas e historial de llamadas.',
    modules: ['Tablero de etapas comerciales (Kanban)', 'Ficha única de prospecto comercial', 'Recordatorios y asignación de tareas a vendedores', 'Estadísticas de ratios de conversión de embudo'],
    example: 'Equipo comercial de desarrolladora inmobiliaria.'
  },
  'dashboards': {
    title: 'Dashboards y Métricas KPI',
    category: 'system',
    complexity: 'Medio',
    weeks: '4 a 6 semanas',
    problem: 'Los directores de la empresa no pueden ver la rentabilidad ni el estado operativo consolidado en un solo lugar.',
    solution: 'Unificamos la información de tus bases de datos o planillas en un panel gráfico interactivo en tiempo real.',
    modules: ['Gráficos de barras, líneas e indicadores', 'Filtros rápidos de fecha y vendedor', 'Módulo de exportación automatizada a PDF/Excel', 'Logs de auditoría del sistema de bases'],
    example: 'Visualización de márgenes mensuales y egresos consolidados.'
  },
  'integraciones': {
    title: 'Integración de Sistemas y APIs',
    category: 'automation',
    complexity: 'Medio',
    weeks: '4 a 6 semanas',
    problem: 'Tu sistema local o ERP instalado no conversa con tu sitio web o plataformas externas, forzando la doble carga de datos.',
    solution: 'Conectamos de forma segura tus APIs, bases de datos remotas y ERPs locales mediante integraciones personalizadas.',
    modules: ['Conexión de APIs REST / webhooks', 'Sincronizador automático cron-job', 'Logs de auditoría y reportes de errores', 'Migración segura de datos heredados'],
    example: 'Conectar un sistema Tango Gestión local con una web pública.'
  }
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SolucionDetailPage({ params }: Props) {
  const { slug } = await params;
  const sol = SOLUTIONS_MAP[slug];

  if (!sol) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
      
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Back button */}
      <Link href="/soluciones" className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-gray-light hover:text-brand-cyan mb-8 transition-colors">
        <ArrowLeft size={12} />
        Volver a soluciones
      </Link>

      {/* Header card */}
      <div className="relative glass-card p-6 md:p-8 border border-brand-cyan/25 bg-brand-blue/5 mb-8">
        
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider">
            Solución: {sol.category}
          </span>
          <span className="text-[10px] font-mono text-brand-white bg-brand-white/10 px-2.5 py-0.5 rounded border border-brand-white/20">
            Complejidad: {sol.complexity}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-brand-white mt-2">
          {sol.title}
        </h1>
        
        <p className="text-sm text-brand-gray-light mt-3 leading-relaxed">
          Diseñamos e implementamos este módulo de forma 100% personalizada.
        </p>

        <div className="flex items-center gap-2 mt-5 text-[9px] font-mono text-brand-gray-medium border-t border-brand-white/5 pt-4">
          <span>Tiempo de desarrollo sugerido: {sol.weeks}</span>
        </div>
      </div>

      {/* Problem vs Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-5 border border-brand-white/5">
          <h4 className="font-display font-bold text-xs text-red-400 uppercase tracking-wider mb-2">El Desafío / Problema</h4>
          <p className="text-xs text-brand-gray-light leading-relaxed">
            {sol.problem}
          </p>
        </div>
        <div className="glass-card p-5 border border-brand-cyan/10">
          <h4 className="font-display font-bold text-xs text-brand-cyan uppercase tracking-wider mb-2">La Propuesta ReCode</h4>
          <p className="text-xs text-brand-gray-light leading-relaxed">
            {sol.solution}
          </p>
        </div>
      </div>

      {/* Modules breakdown */}
      <div className="glass-card p-6 border border-brand-white/5 space-y-4 mb-8">
        <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
          Módulos y Entregables Incluidos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sol.modules.map((m, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs">
              <div className="w-4 h-4 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center shrink-0 mt-0.5">
                <Check size={10} strokeWidth={3} />
              </div>
              <span className="text-brand-gray-light leading-relaxed">{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Example usage */}
      <div className="glass-card p-5 border border-brand-white/5 mb-8">
        <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider block">Ejemplo práctico de aplicación</span>
        <p className="text-xs text-brand-white leading-relaxed mt-2 italic font-mono">
          "{sol.example}"
        </p>
      </div>

      {/* CTAs */}
      <div className="glass-card p-6 border border-brand-cyan/20 bg-brand-blue/5 text-center space-y-4">
        <h3 className="font-display font-extrabold text-lg text-brand-white">
          ¿Querés cotizar {sol.title}?
        </h3>
        <p className="text-xs text-brand-gray-light max-w-lg mx-auto">
          Completá el test diagnóstico o calcula el presupuesto orientativo de tu software en tiempo real.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/diagnostico"
            className="text-xs font-mono font-bold text-brand-gray-light hover:text-brand-white border border-brand-white/10 rounded px-5 py-2.5 bg-brand-gray-dark/50"
          >
            Realizar diagnóstico
          </Link>
          <Link
            href={`/precotizador?type=${slug}`}
            className="btn-primary text-xs font-bold text-brand-white px-5 py-2.5 rounded-lg flex items-center gap-1.5"
          >
            Precotizar ahora
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

    </div>
  );
}
