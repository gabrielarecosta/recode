'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Check } from 'lucide-react';

const SELECTOR_OPTIONS = [
  {
    key: 'ventas',
    label: 'Ventas',
    recommended: 'CRM Comercial a Medida',
    complexity: 'Alto',
    features: ['Pipeline de prospectos comercial', 'Fichas de clientes y cotizaciones', 'Historial de llamadas y mails', 'Alertas de seguimiento comercial'],
    desc: 'Ideal para coordinar equipos de venta, evitar prospectos olvidados y automatizar el envío de presupuestos.'
  },
  {
    key: 'administracion',
    label: 'Administración',
    recommended: 'Sistema de Gestión Interna (ERP Custom)',
    complexity: 'Alto',
    features: ['Control de inventarios y stock', 'Liquidación de sueldos y fichas', 'Gestión de compras y proveedores', 'Reportes operativos unificados'],
    desc: 'Pensado para pymes que manejan múltiples sucursales y necesitan unificar control sin rigideces.'
  },
  {
    key: 'atencion',
    label: 'Atención al cliente',
    recommended: 'WhatsApp API + Notificaciones Automáticas',
    complexity: 'Medio',
    features: ['Alertas de compras o envíos', 'Confirmación de turnos automáticos', 'Mensajes pre-cargados dinámicos', 'Respuestas automáticas inteligentes'],
    desc: 'Automatiza las respuestas a las preguntas más frecuentes de tus clientes vía WhatsApp y ahorra horas operativas.'
  },
  {
    key: 'control',
    label: 'Control interno',
    recommended: 'Panel de Tareas y Roles de Empleados',
    complexity: 'Medio',
    features: ['Acceso seguro con contraseñas', 'Auditoría de cambios y logs', 'Asignación de tareas por tablero', 'Alertas de retrasos en procesos'],
    desc: 'Ideal para descentralizar el control y registrar qué hace cada colaborador de forma segura.'
  },
  {
    key: 'ecommerce',
    label: 'E-commerce',
    recommended: 'Ecommerce con Gestión Interna Integrada',
    complexity: 'Avanzado',
    features: ['Tienda online responsive', 'Integración de stock en tiempo real', 'Cuentas corrientes para mayoristas', 'Notificaciones de despacho por WhatsApp'],
    desc: 'Unifica la venta al público con tus sistemas internos de administración en un solo código.'
  },
  {
    key: 'turnos',
    label: 'Turnos',
    recommended: 'Sistema de Reservas y Agenda Online',
    complexity: 'Alto',
    features: ['Calendario auto-gestionable por cliente', 'Recordatorio de citas por WhatsApp', 'Pago de señas (Mercado Pago)', 'Paneles de control para profesionales'],
    desc: 'Ideal para clínicas médicas, estéticas u odontólogos que quieren reducir el ausentismo.'
  },
  {
    key: 'contabilidad',
    label: 'Contabilidad',
    recommended: 'Módulo Contable y de Caja Diaria',
    complexity: 'Alto',
    features: ['Registro de ingresos y egresos', 'Arqueos de caja por sucursal', 'Factura electrónica AFIP', 'Resumen contable en PDF'],
    desc: 'Controla el flujo de caja e impositivo de tu empresa de forma clara y sin planillas sueltas.'
  },
  {
    key: 'reportes',
    label: 'Reportes',
    recommended: 'Dashboard de Métricas y KPIs en Tiempo Real',
    complexity: 'Medio',
    features: ['Gráficos dinámicos interactivos', 'Exportación a Excel / CSV', 'Filtros rápidos de fecha', 'Indicadores de rentabilidad'],
    desc: 'Visualizá toda la información clave de tu negocio consolidadas en un solo panel gráfico.'
  },
  {
    key: 'logistica',
    label: 'Logística',
    recommended: 'Plataforma de Flotas y Hojas de Ruta',
    complexity: 'Avanzado',
    features: ['Ficha de camiones y choferes', 'Seguimiento de viajes y costos', 'Alertas de seguros vencidos', 'Calculadora de viáticos digital'],
    desc: 'Mapea la distribución y controla los gastos operativos de combustible de tus vehículos.'
  },
  {
    key: 'procesos',
    label: 'Procesos repetitivos',
    recommended: 'Sistema de Automatizaciones e Integración de APIs',
    complexity: 'Medio',
    features: ['Conexión de planillas con softwares', 'Disparadores y alertas automáticas', 'Notificaciones multi-canal', 'Sincronizador automático'],
    desc: 'Conectamos tus sistemas actuales para evitar que tu equipo transcriba datos a mano todos los días.'
  }
];

export default function SolutionsSelector() {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState('ventas');

  const selectedOpt = SELECTOR_OPTIONS.find(o => o.key === selectedKey) || SELECTOR_OPTIONS[0];

  const getPrecotizadorUrl = () => {
    switch (selectedKey) {
      case 'ventas':
        return '/precotizador?type=crm';
      case 'administracion':
        return '/precotizador?type=sistemas-gestion';
      case 'atencion':
        return '/precotizador?type=automatizacion&modules=whatsapp';
      case 'control':
        return '/precotizador?type=sistemas-gestion&modules=auth';
      case 'ecommerce':
        return '/precotizador?type=ecommerce-gestion-interna&modules=stock_sync';
      case 'turnos':
        return '/precotizador?type=sistemas-turnos&modules=whatsapp';
      case 'contabilidad':
        return '/precotizador?type=sistemas-contables&modules=pdf_reports';
      case 'reportes':
        return '/precotizador?type=dashboards&modules=pdf_reports';
      case 'logistica':
        return '/precotizador?type=web-apps';
      case 'procesos':
        return '/precotizador?type=automatizacion';
      default:
        return '/precotizador';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* Options list (1 col) */}
      <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2.5">
        {SELECTOR_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setSelectedKey(opt.key)}
            className={`p-3.5 rounded-lg border text-left font-display text-xs font-bold transition-all ${
              selectedKey === opt.key
                ? 'border-brand-cyan bg-brand-blue/15 text-brand-white shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                : 'border-brand-white/10 bg-brand-gray-dark/40 text-brand-gray-light hover:border-brand-white/20'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Recommended Output card (2 cols) */}
      <div className="lg:col-span-2 glass-card p-6 md:p-8 border border-brand-cyan/20 bg-brand-blue/5 min-h-[300px] flex flex-col justify-between animate-fadeIn">
        <div>
          <div className="flex items-center justify-between border-b border-brand-white/5 pb-4 mb-4">
            <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-widest">Área seleccionada: {selectedKey}</span>
            <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/15 px-2 py-0.5 rounded border border-brand-cyan/20">
              Complejidad: {selectedOpt.complexity}
            </span>
          </div>

          <h3 className="font-display font-extrabold text-xl text-brand-white">
            {selectedOpt.recommended}
          </h3>

          <p className="text-xs text-brand-gray-light leading-relaxed mt-2">
            {selectedOpt.desc}
          </p>

          <div className="mt-5 space-y-2">
            <span className="text-[9px] font-mono text-brand-gray-medium uppercase tracking-wider block">Módulos sugeridos</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono text-brand-gray-light">
              {selectedOpt.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check size={10} className="text-brand-cyan shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-brand-white/5 mt-6 justify-end">
          <button
            onClick={() => router.push('/diagnostico')}
            className="text-xs font-mono font-bold text-brand-gray-light hover:text-brand-white border border-brand-white/10 rounded px-4 py-2.5 bg-brand-gray-dark/50"
          >
            Analizar mi caso
          </button>
          <button
            onClick={() => router.push(getPrecotizadorUrl())}
            className="btn-primary text-xs font-bold text-brand-white px-5 py-2.5 rounded-lg flex items-center gap-1.5"
          >
            Precotizar solución
            <ArrowRight size={12} />
          </button>
        </div>

      </div>

    </div>
  );
}
