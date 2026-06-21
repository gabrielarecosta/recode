import { dbClient } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Cpu, ArrowLeft, Check, Sparkles, Network, ArrowRight, ShieldAlert } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProyectoDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await dbClient.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const getPrecotizadorUrl = () => {
    switch (slug) {
      case 'bruma-moda':
        return '/precotizador?type=ecommerce-gestion-interna&modules=stock_sync,whatsapp';
      case 'contanova-estudio':
        return '/precotizador?type=portales-clientes&modules=pdf_reports,auth';
      case 'agrolink-repuestos':
        return '/precotizador?type=crm&modules=pdf_reports';
      case 'nexoturnos-salud':
        return '/precotizador?type=sistemas-turnos&modules=whatsapp';
      case 'ruta-norte-logistica':
        return '/precotizador?type=sistemas-gestion&modules=auth';
      default:
        return '/precotizador';
    }
  };

  // Draw simple text nodes flow diagram based on slug
  const renderFlowDiagram = () => {
    switch (slug) {
      case 'bruma-moda':
        return (
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6 font-mono text-[10px] text-brand-gray-light">
            <div className="bg-brand-gray-dark border border-brand-white/10 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">E-commerce Público</span>
              Cliente compra minorista/mayorista
            </div>
            <ArrowRight className="hidden md:block text-brand-cyan" />
            <div className="bg-brand-gray-dark border border-brand-white/10 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">API Pasarela</span>
              Mercado Pago procesa seña/pago
            </div>
            <ArrowRight className="hidden md:block text-brand-cyan" />
            <div className="bg-brand-blue/10 border border-brand-cyan/30 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">Base de Datos</span>
              Stock y Cuenta Corriente al instante
            </div>
            <ArrowRight className="hidden md:block text-brand-cyan" />
            <div className="bg-brand-gray-dark border border-brand-white/10 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">Panel de Control</span>
              Equipo despacha y registra saldos
            </div>
          </div>
        );
      case 'contanova-estudio':
        return (
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6 font-mono text-[10px] text-brand-gray-light">
            <div className="bg-brand-gray-dark border border-brand-white/10 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">Portal del Cliente</span>
              Empresa sube facturas en lote
            </div>
            <ArrowRight className="hidden md:block text-brand-cyan" />
            <div className="bg-brand-gray-dark border border-brand-white/10 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">Notificaciones</span>
              WhatsApp alerta al contador asignado
            </div>
            <ArrowRight className="hidden md:block text-brand-cyan" />
            <div className="bg-brand-blue/10 border border-brand-cyan/30 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">Panel Contable</span>
              Liquidador genera IVA y emite PDFs
            </div>
            <ArrowRight className="hidden md:block text-brand-cyan" />
            <div className="bg-brand-gray-dark border border-brand-white/10 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">Calendario Fiscal</span>
              Vencimiento se marca como resuelto
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6 font-mono text-[10px] text-brand-gray-light">
            <div className="bg-brand-gray-dark border border-brand-white/10 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">Ingreso de Datos</span>
              Usuario interactúa en web/portal
            </div>
            <ArrowRight className="hidden md:block text-brand-cyan" />
            <div className="bg-brand-gray-dark border border-brand-white/10 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">Lógica Core</span>
              Validación y automatizaciones internas
            </div>
            <ArrowRight className="hidden md:block text-brand-cyan" />
            <div className="bg-brand-blue/10 border border-brand-cyan/30 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">Persistencia</span>
              Supabase procesa en tiempo real
            </div>
            <ArrowRight className="hidden md:block text-brand-cyan" />
            <div className="bg-brand-gray-dark border border-brand-white/10 p-3 rounded-lg text-center">
              <span className="text-brand-cyan font-bold block mb-1">Salida / Dashboard</span>
              Reportes en PDF y alertas móviles
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
      
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-violet/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Back button */}
      <Link href="/proyectos" className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-gray-light hover:text-brand-cyan mb-8 transition-colors">
        <ArrowLeft size={12} />
        Volver a proyectos
      </Link>

      {/* Project Header */}
      <div className="relative glass-card p-6 md:p-8 border border-brand-cyan/25 bg-brand-blue/5 mb-8">
        
        {/* Mandatory tag */}
        <div className="absolute top-4 right-4 text-[8px] font-mono font-bold text-brand-cyan bg-brand-cyan/15 px-2.5 py-1 rounded border border-brand-cyan/30">
          ReCode Lab — Proyecto Conceptual
        </div>

        <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider block">
          Proyecto Conceptuado: {project.industry}
        </span>
        
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-brand-white mt-2">
          {project.name}
        </h1>
        
        <p className="text-sm text-brand-gray-light mt-3 leading-relaxed">
          {project.description}
        </p>

        <div className="flex items-center gap-2 mt-5 text-[9px] font-mono text-brand-gray-medium border-t border-brand-white/5 pt-4">
          <span>Tecnologías: Next.js (App Router) • TypeScript • Tailwind CSS • Supabase</span>
        </div>
      </div>

      {/* Core details */}
      <div className="space-y-8">
        
        {/* Browser Mockup Autoscroll Showcase */}
        <div className="glass-card p-6 border border-brand-cyan/20 bg-brand-blue/5 overflow-hidden">
          <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 mb-6 uppercase tracking-wider flex items-center gap-2">
            <Cpu size={16} className="text-brand-cyan" />
            Vista del Prototipo Autogestionable (Navegación Interactiva)
          </h3>

          {/* Browser Container Mockup */}
          <div className="relative mx-auto max-w-2xl border border-brand-white/15 rounded-xl overflow-hidden shadow-2xl bg-brand-black">
            
            {/* Browser Top Header */}
            <div className="bg-brand-gray-dark px-4 py-3 border-b border-brand-white/10 flex items-center gap-4">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 bg-brand-black/40 text-[9px] font-mono text-brand-gray-medium rounded px-3 py-1 text-center select-none truncate">
                https://labs.recodestudio.com/{slug}
              </div>
            </div>

            {/* Viewport with autoscroll */}
            <div className="relative h-[350px] w-full overflow-hidden bg-brand-gray-dark/20">
              <img
                src={`/images/${slug}.png`}
                alt={`Prototipo de ${project.name}`}
                className="w-full h-auto absolute top-0 left-0 animate-scroll-mockup"
              />
            </div>
            
          </div>
          
          <p className="text-[10px] text-brand-gray-medium font-mono text-center mt-4">
            * El prototipo recorre automáticamente las secciones de la página principal para mostrar toda la estructura visual y funcional de la solución.
          </p>
        </div>

        {/* Problem vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-5 border border-brand-white/5">
            <h4 className="font-display font-bold text-xs text-red-400 uppercase tracking-wider mb-2">El Desafío / Problema</h4>
            <p className="text-xs text-brand-gray-light leading-relaxed">
              {project.problem}
            </p>
          </div>
          <div className="glass-card p-5 border border-brand-cyan/10">
            <h4 className="font-display font-bold text-xs text-brand-cyan uppercase tracking-wider mb-2">La Solución Propuesta</h4>
            <p className="text-xs text-brand-gray-light leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* System architecture flow diagram */}
        <div className="glass-card p-6 border border-brand-white/5">
          <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Network size={16} className="text-brand-cyan" />
            Flujo de Datos e Integración del Sistema
          </h3>
          {renderFlowDiagram()}
        </div>

        {/* Features List */}
        <div className="glass-card p-6 border border-brand-white/5 space-y-4">
          <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
            Funcionalidades Técnicas Desarrolladas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs">
                <div className="w-4 h-4 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={10} strokeWidth={3} />
                </div>
                <span className="text-brand-gray-light leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Implementation stages */}
        {project.suggested_phases && (
          <div className="glass-card p-6 border border-brand-white/5 space-y-4">
            <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
              Hoja de Ruta sugerida de Desarrollo
            </h3>
            <div className="space-y-3 font-mono text-[10px]">
              {project.suggested_phases.map((phase, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-brand-gray-dark/40 rounded border border-brand-white/5">
                  <div className="text-brand-cyan font-bold">Fase {idx + 1}</div>
                  <div className="text-brand-white">{phase}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer Warning */}
        <div className="p-4 bg-brand-cyan/5 border border-brand-cyan/20 rounded-lg flex gap-3 text-brand-cyan text-xs">
          <ShieldAlert size={20} className="shrink-0 mt-0.5 animate-pulse" />
          <p className="leading-relaxed">
            <strong className="text-brand-white">ReCode Labs Disclaimer:</strong> Este proyecto es un prototipo conceptual ficticio. Ninguno de los problemas descritos ni las soluciones han sido contratados por clientes reales bajo este nombre. Su propósito es ilustrar nuestra metodología de análisis de procesos y capacidades técnicas.
          </p>
        </div>

        {/* Bottom Call to Action */}
        <div className="glass-card p-6 border border-brand-cyan/20 bg-brand-blue/5 text-center space-y-4">
          <h3 className="font-display font-extrabold text-lg text-brand-white">
            ¿Tu empresa necesita una solución como esta?
          </h3>
          <p className="text-xs text-brand-gray-light max-w-lg mx-auto">
            Hablemos sobre los procesos que te gustaría automatizar. Podemos adaptar y customizar estas arquitecturas según las reglas reales de tu negocio.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/contacto"
              className="text-xs font-mono font-bold text-brand-gray-light hover:text-brand-cyan border border-brand-white/10 rounded px-5 py-2.5 bg-brand-gray-dark/50"
            >
              Consultar por email
            </Link>
            <Link
              href={getPrecotizadorUrl()}
              className="btn-primary text-xs font-bold text-brand-white px-5 py-2.5 rounded-lg flex items-center gap-1.5"
            >
              Cotizar algo similar
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
