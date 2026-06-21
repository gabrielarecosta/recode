import Link from 'next/link';
import { Terminal, Mail, Phone, Shield, ArrowUpRight, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-brand-black border-t border-brand-white/5 pt-20 pb-10 overflow-hidden">
      
      {/* Decorative background grid and glow */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-brand-violet/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-brand-white/5">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-brand-blue to-brand-violet text-brand-white shadow-[0_0_10px_rgba(23,75,255,0.3)]">
                <img src="/favicon.png" alt="ReCode Studio" className="w-5 h-5 object-contain" />
              </div>
              <span className="font-display font-extrabold text-lg text-brand-white tracking-wider">
                RECODE<span className="text-brand-cyan">.</span>STUDIO
              </span>
            </Link>
            <p className="text-sm text-brand-gray-light leading-relaxed max-w-sm">
              Diseñamos tecnología a medida para que tu empresa venda, gestione y crezca mejor. Convertimos procesos desordenados en herramientas digitales claras y escalables.
            </p>
            <div className="flex flex-col gap-3 font-mono text-xs">
              <a href="mailto:info@recodestudio.com.ar" className="text-brand-gray-light hover:text-brand-cyan flex items-center gap-2 transition-colors">
                <Mail size={14} className="text-brand-cyan" />
                info@recodestudio.com.ar
              </a>
              <a href="https://wa.me/5493585142731?text=Hola%20ReCode%20Studio!%20Me%20gustar%C3%ADa%20consultar%20por%20un%20proyecto." target="_blank" rel="noopener noreferrer" className="text-brand-gray-light hover:text-brand-cyan flex items-center gap-2 transition-colors">
                <Phone size={14} className="text-brand-cyan" />
                +54 9 358 514-2731 (WhatsApp)
              </a>
            </div>
          </div>

          {/* Col 2: Soluciones */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-sm font-bold text-brand-white tracking-wider uppercase">
              Soluciones
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-brand-gray-light">
              <li>
                <Link href="/soluciones/ecommerce-gestion-interna" className="hover:text-brand-cyan transition-colors">
                  Ecommerce con Gestión
                </Link>
              </li>
              <li>
                <Link href="/soluciones/sistemas-gestion" className="hover:text-brand-cyan transition-colors">
                  Sistemas de Gestión
                </Link>
              </li>
              <li>
                <Link href="/soluciones/sistemas-contables" className="hover:text-brand-cyan transition-colors">
                  Sistemas Contables
                </Link>
              </li>
              <li>
                <Link href="/soluciones/portales-clientes" className="hover:text-brand-cyan transition-colors">
                  Portales de Clientes
                </Link>
              </li>
              <li>
                <Link href="/soluciones/crm" className="hover:text-brand-cyan transition-colors">
                  CRMs y Dashboards
                </Link>
              </li>
              <li>
                <Link href="/soluciones/automatizacion" className="hover:text-brand-cyan transition-colors">
                  Automatización
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Labs / Proyectos */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-sm font-bold text-brand-white tracking-wider uppercase">
              ReCode Labs
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-brand-gray-light">
              <li>
                <Link href="/proyectos/bruma-moda" className="hover:text-brand-cyan transition-colors flex items-center gap-1">
                  Bruma Moda <span className="text-[9px] font-mono text-brand-cyan/70 bg-brand-cyan/5 px-1 rounded">Prototipo</span>
                </Link>
              </li>
              <li>
                <Link href="/proyectos/contanova-estudio" className="hover:text-brand-cyan transition-colors flex items-center gap-1">
                  ContaNova <span className="text-[9px] font-mono text-brand-cyan/70 bg-brand-cyan/5 px-1 rounded">Prototipo</span>
                </Link>
              </li>
              <li>
                <Link href="/proyectos/agrolink-repuestos" className="hover:text-brand-cyan transition-colors flex items-center gap-1">
                  AgroLink <span className="text-[9px] font-mono text-brand-cyan/70 bg-brand-cyan/5 px-1 rounded">Prototipo</span>
                </Link>
              </li>
              <li>
                <Link href="/proyectos/nexoturnos-salud" className="hover:text-brand-cyan transition-colors flex items-center gap-1">
                  NexoTurnos <span className="text-[9px] font-mono text-brand-cyan/70 bg-brand-cyan/5 px-1 rounded">Prototipo</span>
                </Link>
              </li>
              <li>
                <Link href="/proyectos/ruta-norte-logistica" className="hover:text-brand-cyan transition-colors flex items-center gap-1">
                  Ruta Norte <span className="text-[9px] font-mono text-brand-cyan/70 bg-brand-cyan/5 px-1 rounded">Prototipo</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Herramientas */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-sm font-bold text-brand-white tracking-wider uppercase">
              Herramientas
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-brand-gray-light">
              <li>
                <Link href="/nosotros" className="hover:text-brand-cyan transition-colors">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/precotizador" className="hover:text-brand-cyan transition-colors flex items-center gap-1">
                  Precotizador Inteligente <ArrowUpRight size={10} className="text-brand-cyan" />
                </Link>
              </li>
              <li>
                <Link href="/calculadora-ahorro" className="hover:text-brand-cyan transition-colors flex items-center gap-1">
                  Calculadora de Ahorro
                </Link>
              </li>
              <li>
                <Link href="/comparador" className="hover:text-brand-cyan transition-colors flex items-center gap-1">
                  Comparador de Plataformas
                </Link>
              </li>
              <li>
                <Link href="/como-trabajamos" className="hover:text-brand-cyan transition-colors">
                  Cómo Trabajamos
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-brand-cyan transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-brand-gray-medium">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} ReCode Studio. Todos los derechos reservados.</span>
            <span className="hidden md:inline text-brand-white/10">|</span>
            <Link href="/politica-de-privacidad" className="hover:text-brand-cyan transition-colors">
              Privacidad
            </Link>
            <span className="text-brand-white/10">|</span>
            <Link href="/terminos" className="hover:text-brand-cyan transition-colors">
              Términos
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-display font-medium text-brand-white/40 text-[10px] uppercase tracking-wider">
              “Código que conecta. Tecnología que transforma.”
            </span>
            
            {/* Panel links */}
            <div className="flex items-center gap-2">
              <Link href="/portal-clientes" className="hover:text-brand-cyan flex items-center gap-1 bg-brand-gray-dark/50 px-2 py-1 rounded border border-brand-white/5 transition-all duration-200">
                <Shield size={10} />
                Portal
              </Link>
              <Link href="/admin" className="hover:text-brand-cyan flex items-center gap-1 bg-brand-gray-dark/50 px-2 py-1 rounded border border-brand-white/5 transition-all duration-200">
                <Lock size={10} />
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Visual Circuit completion effect at the bottom */}
        <div className="relative w-full h-[2px] bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent mt-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_#22D3EE] animate-pulse" />
          <div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-violet shadow-[0_0_8px_#6325D9]" />
          <div className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_#174BFF]" />
        </div>

      </div>
    </footer>
  );
}
