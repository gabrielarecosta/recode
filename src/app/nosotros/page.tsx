import Link from 'next/link';
import { Terminal, Shield, Sparkles, Check, ArrowRight, Cpu, Code, Sliders } from 'lucide-react';

export default function NosotrosPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 relative z-10 space-y-16">
      
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero: Sobre Nosotros */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-2 animate-pulse">
            <img src="/favicon.png" alt="ReCode Studio" className="w-3 h-3 object-contain" />
            <span>NOSOTROS — RECODE STUDIO</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-brand-white">
            Sobre Nosotros
          </h1>
          <p className="text-sm text-brand-gray-light leading-relaxed">
            Somos un equipo de ingenieros de datos, analistas de sistemas y programadores apasionados por la tecnología y especializados en automatización y desarrollo de software a medida.
          </p>
        </div>

        {/* Side-by-side grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          
          {/* Left Column: Cards Stack (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Card 1: Ingenieros */}
            <div className="glass-card p-5 border border-brand-white/5 hover:border-brand-cyan/30 transition-all duration-300">
              <div className="w-9 h-9 rounded-lg bg-brand-cyan/15 flex items-center justify-center text-brand-cyan mb-3">
                <Cpu size={18} />
              </div>
              <h4 className="font-display font-bold text-xs text-brand-white">Ingenieros de Datos</h4>
              <p className="text-[10px] text-brand-gray-light leading-relaxed mt-1.5">
                Diseñamos arquitecturas de datos robustas y escalables, asegurando que tu plataforma soporte el volumen de tu negocio bajo estrictos estándares de seguridad y rendimiento.
              </p>
            </div>

            {/* Card 2: Analistas */}
            <div className="glass-card p-5 border border-brand-white/5 hover:border-brand-blue/30 transition-all duration-300">
              <div className="w-9 h-9 rounded-lg bg-brand-blue/15 flex items-center justify-center text-brand-blue mb-3">
                <Sliders size={18} />
              </div>
              <h4 className="font-display font-bold text-xs text-brand-white">Analistas de Sistemas</h4>
              <p className="text-[10px] text-brand-gray-light leading-relaxed mt-1.5">
                Mapeamos tus procesos operativos reales, identificando cuellos de botella en planillas y flujos manuales para traducirlos en un diseño funcional inteligente.
              </p>
            </div>

            {/* Card 3: Programadores */}
            <div className="glass-card p-5 border border-brand-white/5 hover:border-brand-softviolet/30 transition-all duration-300">
              <div className="w-9 h-9 rounded-lg bg-brand-softviolet/15 flex items-center justify-center text-brand-softviolet mb-3">
                <Code size={18} />
              </div>
              <h4 className="font-display font-bold text-xs text-brand-white">Programadores Especializados</h4>
              <p className="text-[10px] text-brand-gray-light leading-relaxed mt-1.5">
                Escribimos código limpio, rápido y mantenible. Nos especializamos en la automatización de tareas y la integración fluida de APIs y bases de datos.
              </p>
            </div>

          </div>

          {/* Right Column: team2.png Image (7 cols) */}
          <div className="lg:col-span-7 relative flex justify-center overflow-hidden rounded-2xl">
            <img
              src="/team2.png"
              alt="ReCode Studio Team"
              className="w-full h-auto object-contain filter saturate-[0.85] hover:saturate-100 transition-all duration-500 pb-8"
            />
            {/* Difuminado negro en la parte inferior para integrar con el fondo */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-black to-transparent pointer-events-none z-10" />
          </div>

        </div>
      </div>

      {/* Filosofía: No hacemos páginas genéricas */}
      <div className="space-y-8 border-t border-brand-white/5 pt-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl md:text-4xl font-display font-extrabold text-brand-white">
            No hacemos páginas genéricas
          </h2>
          <p className="text-xs text-brand-gray-light leading-relaxed">
            Creamos soluciones digitales personalizadas para empresas, profesionales y emprendimientos que necesitan vender mejor, ordenar sus procesos, automatizar tareas y diferenciarse con tecnología.
          </p>
        </div>

        {/* Positioning Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
          <div className="space-y-4">
            <h3 className="text-xl font-display font-extrabold text-brand-white border-l-2 border-brand-cyan pl-3">
              El sistema debe adaptarse a tu empresa
            </h3>
            <p className="text-xs text-brand-gray-light leading-relaxed">
              Tu empresa no debería adaptarse a un software rígido o a una plantilla enlatada. En **ReCode Studio** analizamos en detalle cómo funciona tu negocio en la realidad y construimos herramientas digitales a la medida de tus procesos.
            </p>
            <p className="text-xs text-brand-gray-light leading-relaxed">
              Convertimos procesos lentos, repetitivos y desordenados en herramientas web claras, funcionales y altamente escalables. Nuestro objetivo es que recuperes tiempo y te enfoques en crecer.
            </p>
          </div>

          <div className="glass-card p-6 border border-brand-cyan/20 bg-brand-blue/5 space-y-4">
            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider block">Nuestra Diferencia</span>
            
            <ul className="space-y-3 text-xs text-brand-gray-light">
              {[
                'Diseño 100% personalizable (libre de plantillas enlatadas)',
                'Funcionalidades desarrolladas a medida para tu trastienda',
                'Sistemas internos y web pública integrados',
                'Automatizaciones de email, WhatsApp y reportes PDF',
                'Desarrollo escalable por etapas (MVP y evoluciones)',
                'Acompañamiento estratégico constante y cercano'
              ].map((diff, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <Check size={12} className="text-brand-cyan shrink-0" />
                  <span>{diff}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Honesty Box */}
      <div className="glass-card p-8 border border-brand-white/5 text-center max-w-3xl mx-auto space-y-4">
        <h3 className="font-display font-bold text-base text-brand-white">
          Compromiso y Honestidad Profesional
        </h3>
        <p className="text-xs text-brand-gray-light leading-relaxed max-w-xl mx-auto">
          No te vamos a prometer resultados milagrosos ni estadísticas imposibles. Creemos en la comunicación directa, sincera y realista. Analizamos la viabilidad técnica de tu proyecto y te acompañamos paso a paso, buscando siempre la solución que sea útil, clara y sostenible para tu empresa.
        </p>
      </div>

      {/* CTA final */}
      <div className="text-center space-y-6 pt-6 border-t border-brand-white/5">
        <h3 className="font-display font-bold text-lg text-brand-white">
          ¿Listo para automatizar y crecer?
        </h3>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/precotizador"
            className="text-xs font-mono font-bold text-brand-gray-light hover:text-brand-white border border-brand-white/10 rounded px-5 py-3 bg-brand-gray-dark/50"
          >
            Precotizar mi sistema
          </Link>
          <Link
            href="/contacto"
            className="btn-primary text-xs font-bold text-brand-white px-6 py-3 rounded-lg flex items-center gap-1.5"
          >
            Escribinos tu consulta
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

    </div>
  );
}
