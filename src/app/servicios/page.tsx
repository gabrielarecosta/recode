'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dbClient, Service } from '@/lib/db';
import { Cpu, Check, ArrowRight, Star, Plus } from 'lucide-react';

const SERVICES_LIST: Service[] = [
  { id: 's1', name: 'Páginas Web Personalizadas', slug: 'paginas-web', description: 'Diseño único y código escrito a mano para lograr velocidad extrema, adaptabilidad total y el mejor posicionamiento SEO de tu marca.', category: 'web', features: ['Maquetación 100% a medida', 'Panel de administración intuitivo', 'Estructura SEO e Indexación', 'Optimización Core Web Vitals'], example_use: 'Sitio institucional para empresas de servicios corporativos.', is_active: true },
  { id: 's2', name: 'Tiendas Online (E-commerce)', slug: 'ecommerce', description: 'E-commerce diseñado estratégicamente para vender más, con integraciones fluidas de pasarelas de pago y calculadoras de envíos nacionales.', category: 'ecommerce', features: ['Carrito de compras dinámico', 'Mercado Pago integrado', 'Cotización Correo Argentino', 'Panel de cupones y ofertas'], example_use: 'Tienda de venta minorista de calzado y accesorios.', is_active: true },
  { id: 's3', name: 'Ecommerce con Gestión Interna', slug: 'ecommerce-gestion-interna', description: 'Nuestra solución premium: fusionamos tu tienda online minorista o mayorista con un panel administrativo interno de control operativo.', category: 'ecommerce', features: ['Sincronización de Stock en tiempo real', 'Cuentas corrientes para clientes', 'Ficheros electrónicos e historial', 'Módulo de entregas condicionales'], example_use: 'Negocio textil que vende web minorista y maneja revendedoras mayoristas.', is_active: true },
  { id: 's4', name: 'Sistemas de Gestión Interna', slug: 'sistemas-gestion', description: 'Software a medida para ordenar y centralizar la información de tu negocio. Olvídate de los cuellos de botella en planillas Excel.', category: 'system', features: ['Control de inventario y stock', 'Tableros de asignación de tareas', 'Módulo de proveedores y compras', 'Roles y permisos de empleados'], example_use: 'Gestión operativa para talleres mecánicos o distribuidoras.', is_active: true },
  { id: 's5', name: 'Sistemas Contables a Medida', slug: 'sistemas-contables', description: 'Módulos para registrar cajas diarias, egresos, facturación electrónica y reportes automáticos de rentabilidad.', category: 'system', features: ['Control de cajas y arqueos', 'Generación de facturas electrónicas', 'Resumen de cuentas corrientes', 'Reportes contables mensuales'], example_use: 'Control de caja y saldos adeudados para empresas de servicios.', is_active: true },
  { id: 's6', name: 'Automatización de Procesos', slug: 'automatizacion', description: 'Eliminamos tareas repetitivas conectando planillas y sistemas con WhatsApp, mails transaccionales y bases de datos.', category: 'automation', features: ['Conexión con WhatsApp Business API', 'Envío de presupuestos automatizados', 'Alertas internas por mail', 'Recordatorios automáticos de turnos'], example_use: 'Alertas de vencimiento de pólizas o recordatorio de pagos.', is_active: true },
  { id: 's7', name: 'Portales Privados de Clientes', slug: 'portales-clientes', description: 'Áreas de autogestión seguras para que tus clientes descarguen facturas, suban archivos y consulten el avance de sus proyectos.', category: 'system', features: ['Autenticación segura por cliente', 'Descarga de entregables y facturas', 'Historial de pagos y saldos', 'Mesa de ayuda y soporte técnico'], example_use: 'Estudio contable o inmobiliario coordinando archivos con clientes.', is_active: true },
  { id: 's8', name: 'CRM y Pipelines Comerciales', slug: 'crm', description: 'Gestión estructurada de tu equipo de ventas. Registra prospectos, cotizaciones y seguimientos sin perder clientes en el camino.', category: 'system', features: ['Embudo de ventas configurable', 'Ficha única de contacto comercial', 'Llamadas y notas integradas', 'Recordatorios de próximos contactos'], example_use: 'Equipo inmobiliario o consultorías comerciales.', is_active: true },
  { id: 's9', name: 'Dashboards y Métricas KPI', slug: 'dashboards', description: 'Paneles visuales dinámicos que centralizan la información clave de tu negocio en gráficos fáciles de leer en tiempo real.', category: 'system', features: ['Gráficos comparativos interactivos', 'Exportación XLS, CSV y PDF', 'KPIs principales unificados', 'Filtros rápidos por fecha o rubro'], example_use: 'Directores de empresas que necesitan ver caja y rentabilidad.', is_active: true },
  { id: 's10', name: 'Sistemas de Agenda y Turnos', slug: 'sistemas-turnos', description: 'Reserva de citas online para tus clientes, validación de profesionales, recordatorio automático y cobros integrados.', category: 'system', features: ['Calendario interactivo auto-gestionable', 'Integración de WhatsApp para alertas', 'Cobro de señas por Mercado Pago', 'Panel individual para profesionales'], example_use: 'Clínicas médicas, centros de estética u odontólogos.', is_active: true },
  { id: 's11', name: 'Integración de APIs y Sistemas', slug: 'integraciones', description: 'Conexión limpia entre softwares externos, ERPs locales instalados y bases de datos heredadas para evitar islas de información.', category: 'automation', features: ['Mapeo de datos bidireccional', 'Conexión de APIs externas', 'Seguridad y encriptado', 'Logs de auditoría del sistema'], example_use: 'Sincronizar stock de un software local con la tienda online.', is_active: true },
  { id: 's12', name: 'Web Apps Custom (SaaS)', slug: 'web-apps', description: 'Plataformas de software como servicio con arquitecturas escalables, pasarelas de suscripción y accesos multi-inquilino.', category: 'web', features: ['Modelos de suscripción (Stripe)', 'Multi-tenant seguro', 'Base de datos de alta velocidad', 'Despliegue auto-escalable en la nube'], example_use: 'Plataforma para gestión de flotas y transporte logístico.', is_active: true }
];

export default function ServiciosPage() {
  const router = useRouter();

  const handleAddProject = (slug: string) => {
    // Redirect to precotizador with selected service as projectType
    router.push(`/precotizador?type=${slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-4 animate-pulse">
          <Cpu size={12} />
          <span>RECODE LABS — CATÁLOGO DE SERVICIOS</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-brand-white">
          Soluciones digitales diseñadas para tu empresa
        </h1>
        <p className="text-sm text-brand-gray-light mt-3 max-w-xl mx-auto">
          No hacemos páginas genéricas basadas en plantillas rígidas. Diseñamos, programamos e implementamos herramientas alrededor de la forma real en la que trabaja tu equipo.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES_LIST.map((s) => (
          <div
            key={s.id}
            id={s.slug}
            className="glass-card p-6 border border-brand-white/5 flex flex-col justify-between relative hover:border-brand-cyan/30 transition-all duration-300"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest bg-brand-cyan/5 px-2 py-0.5 rounded border border-brand-cyan/15">
                  {s.category}
                </span>
                <Star size={14} className="text-brand-cyan opacity-40" />
              </div>

              <h3 className="font-display font-bold text-lg text-brand-white mt-3">
                {s.name}
              </h3>

              <p className="text-xs text-brand-gray-light leading-relaxed mt-3">
                {s.description}
              </p>

              {/* Feature bullets */}
              <div className="mt-5 space-y-2">
                <span className="text-[9px] font-mono text-brand-gray-medium uppercase tracking-wider block">Características clave</span>
                {s.features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[10px] text-brand-gray-light font-mono">
                    <Check size={10} className="text-brand-cyan shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Example usage */}
              <div className="mt-5 p-2.5 rounded bg-brand-gray-dark/50 border border-brand-white/5">
                <span className="text-[8px] font-mono text-brand-cyan uppercase tracking-wider block">Ejemplo real de uso</span>
                <span className="text-[10px] text-brand-gray-light mt-0.5 block italic leading-relaxed">
                  "{s.example_use}"
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-brand-white/5 pt-4 mt-6">
              <button
                onClick={() => router.push(`/soluciones/${s.slug}`)}
                className="flex-1 text-center py-2.5 rounded text-xs font-bold text-brand-white border border-brand-white/10 hover:border-brand-cyan bg-brand-gray-dark/30 hover:bg-brand-gray-dark/50 transition-colors"
              >
                Detalles
              </button>
              <button
                onClick={() => handleAddProject(s.slug)}
                className="flex-1 btn-primary py-2.5 rounded text-xs font-bold text-brand-white flex items-center justify-center gap-1"
              >
                <Plus size={12} />
                Agregar a mi cotización
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Custom request CTA */}
      <div className="glass-card p-8 border border-brand-cyan/20 bg-brand-blue/5 text-center space-y-4 max-w-xl mx-auto mt-16">
        <h3 className="font-display font-bold text-lg text-brand-white">
          ¿Tenés una idea o requerimiento diferente?
        </h3>
        <p className="text-xs text-brand-gray-light leading-relaxed">
          Diseñamos cualquier funcionalidad interactiva que imagines: simuladores matemáticos, sistemas con geolocalización, sincronización offline o portales con firma digital. Contanos qué necesitás.
        </p>
        <button
          onClick={() => router.push('/contacto')}
          className="btn-primary text-xs font-bold text-brand-white px-8 py-3 rounded-lg flex items-center gap-2 mx-auto cursor-pointer"
        >
          Consultar con un especialista
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
