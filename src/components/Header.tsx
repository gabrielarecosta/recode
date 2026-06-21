'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Terminal, ChevronDown, Cpu, ArrowRight } from 'lucide-react';

const SOLUTIONS = [
  { name: 'Páginas Web', href: '/soluciones/paginas-web' },
  { name: 'E-commerce', href: '/soluciones/ecommerce' },
  { name: 'E-commerce + Gestión', href: '/soluciones/ecommerce-gestion-interna' },
  { name: 'Sistemas de Gestión', href: '/soluciones/sistemas-gestion' },
  { name: 'Sistemas Contables', href: '/soluciones/sistemas-contables' },
  { name: 'Automatizaciones', href: '/soluciones/automatizacion' },
  { name: 'Portales de Clientes', href: '/soluciones/portales-clientes' },
  { name: 'CRM de Ventas', href: '/soluciones/crm' },
  { name: 'Dashboards de Métricas', href: '/soluciones/dashboards' },
  { name: 'Integraciones de APIs', href: '/soluciones/integraciones' },
];

const SERVICES = [
  { name: 'Desarrollo Web', href: '/servicios#desarrollo-web' },
  { name: 'Sistemas a Medida', href: '/servicios#sistemas-medida' },
  { name: 'Automatización y API', href: '/servicios#automatizaciones' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when page changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-black/80 border-b border-brand-blue/10 backdrop-blur-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-blue to-brand-violet text-brand-white shadow-[0_0_15px_rgba(23,75,255,0.4)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-300">
              <img src="/favicon.png" alt="ReCode Studio" className="w-6 h-6 object-contain group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl leading-none text-brand-white tracking-wider">
                RECODE<span className="text-brand-cyan">.</span>
              </span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-brand-gray-light leading-none uppercase mt-1">
                STUDIO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`font-display text-sm font-semibold transition-colors hover:text-brand-cyan ${
                isActive('/') ? 'text-brand-cyan font-bold' : 'text-brand-gray-light'
              }`}
            >
              Inicio
            </Link>

            {/* Soluciones Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('soluciones')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 font-display text-sm font-semibold transition-colors hover:text-brand-cyan ${
                  pathname.startsWith('/soluciones') ? 'text-brand-cyan' : 'text-brand-gray-light'
                }`}
              >
                Soluciones
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'soluciones' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'soluciones' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[320px] pt-4">
                  <div className="bg-brand-gray-dark/95 border border-brand-blue/10 rounded-xl p-3 shadow-2xl backdrop-blur-lg grid grid-cols-1 gap-1">
                    <div className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest px-3 py-1 mb-1 border-b border-brand-white/5">
                      Sistemas a medida
                    </div>
                    {SOLUTIONS.map((sol) => (
                      <Link
                        key={sol.href}
                        href={sol.href}
                        className={`text-xs px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                          pathname === sol.href
                            ? 'bg-brand-blue/10 text-brand-white font-semibold'
                            : 'text-brand-gray-light hover:bg-brand-white/5 hover:text-brand-white'
                        }`}
                      >
                        {sol.name}
                        <ArrowRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-cyan" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Servicios Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('servicios')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 font-display text-sm font-semibold transition-colors hover:text-brand-cyan ${
                  isActive('/servicios') ? 'text-brand-cyan' : 'text-brand-gray-light'
                }`}
              >
                Servicios
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'servicios' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'servicios' && (
                <div className="absolute top-full left-0 w-[240px] pt-4">
                  <div className="bg-brand-gray-dark/95 border border-brand-blue/10 rounded-xl p-3 shadow-2xl backdrop-blur-lg flex flex-col gap-1">
                    <Link
                      href="/servicios"
                      className="text-xs px-3 py-2 font-bold text-brand-cyan hover:underline border-b border-brand-white/5 pb-2 mb-1"
                    >
                      Ver Catálogo Completo
                    </Link>
                    {SERVICES.map((ser) => (
                      <Link
                        key={ser.href}
                        href={ser.href}
                        className="text-xs px-3 py-2 rounded-lg text-brand-gray-light hover:bg-brand-white/5 hover:text-brand-white transition-colors"
                      >
                        {ser.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/proyectos"
              className={`font-display text-sm font-semibold transition-colors hover:text-brand-cyan ${
                pathname.startsWith('/proyectos') ? 'text-brand-cyan font-bold' : 'text-brand-gray-light'
              }`}
            >
              Proyectos
            </Link>

            <Link
              href="/como-trabajamos"
              className={`font-display text-sm font-semibold transition-colors hover:text-brand-cyan ${
                isActive('/como-trabajamos') ? 'text-brand-cyan font-bold' : 'text-brand-gray-light'
              }`}
            >
              Cómo Trabajamos
            </Link>

            <Link
              href="/nosotros"
              className={`font-display text-sm font-semibold transition-colors hover:text-brand-cyan ${
                isActive('/nosotros') ? 'text-brand-cyan font-bold' : 'text-brand-gray-light'
              }`}
            >
              Quiénes Somos
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/portal-clientes"
              className="text-sm font-semibold text-brand-white hover:text-brand-cyan px-4 py-2 flex items-center gap-2 border border-brand-white/10 rounded-lg hover:border-brand-cyan/30 transition-all duration-300 bg-brand-gray-dark/40"
            >
              Ingresar
            </Link>
            <Link
              href="/precotizador"
              className="btn-primary text-sm font-bold text-brand-white px-5 py-2.5 rounded-lg flex items-center gap-2"
            >
              Cotizar mi proyecto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-4">
            <Link
              href="/precotizador"
              className="text-xs font-bold text-brand-white btn-primary px-3.5 py-2 rounded-lg shadow-sm"
            >
              Cotizar
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-white p-1 hover:text-brand-cyan transition-colors"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Fullscreen / Sliding) */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-full max-w-xs bg-brand-black/95 border-l border-brand-blue/20 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 lg:hidden transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-6 border-b border-brand-white/10 mt-2">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center bg-brand-cyan/15 rounded border border-brand-cyan/20">
              <img src="/favicon.png" alt="ReCode Studio" className="w-4 h-4 object-contain" />
            </div>
            <span className="font-display font-extrabold text-lg text-brand-white tracking-wider">
              RECODE<span className="text-brand-cyan">.</span>
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="text-brand-white p-1 hover:text-brand-cyan"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`font-display text-base font-semibold ${isActive('/') ? 'text-brand-cyan' : 'text-brand-gray-light'}`}
          >
            Inicio
          </Link>

          {/* Soluciones Accordion */}
          <div>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'sol_mob' ? null : 'sol_mob')}
              className="flex items-center justify-between w-full font-display text-base font-semibold text-brand-gray-light"
            >
              Soluciones
              <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === 'sol_mob' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'sol_mob' && (
              <div className="mt-2 pl-4 flex flex-col gap-3 border-l border-brand-blue/20">
                <Link
                  href="/soluciones"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-brand-cyan hover:underline"
                >
                  Ver todas las soluciones
                </Link>
                {SOLUTIONS.map((sol) => (
                  <Link
                    key={sol.href}
                    href={sol.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-brand-gray-light hover:text-brand-white"
                  >
                    {sol.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/servicios"
            onClick={() => setIsOpen(false)}
            className={`font-display text-base font-semibold ${isActive('/servicios') ? 'text-brand-cyan' : 'text-brand-gray-light'}`}
          >
            Servicios
          </Link>

          <Link
            href="/proyectos"
            onClick={() => setIsOpen(false)}
            className={`font-display text-base font-semibold ${pathname.startsWith('/proyectos') ? 'text-brand-cyan' : 'text-brand-gray-light'}`}
          >
            Proyectos
          </Link>

          <Link
            href="/como-trabajamos"
            onClick={() => setIsOpen(false)}
            className={`font-display text-base font-semibold ${isActive('/como-trabajamos') ? 'text-brand-cyan' : 'text-brand-gray-light'}`}
          >
            Cómo Trabajamos
          </Link>

          <Link
            href="/nosotros"
            onClick={() => setIsOpen(false)}
            className={`font-display text-base font-semibold ${isActive('/nosotros') ? 'text-brand-cyan' : 'text-brand-gray-light'}`}
          >
            Quiénes Somos
          </Link>

          <Link
            href="/contacto"
            onClick={() => setIsOpen(false)}
            className={`font-display text-base font-semibold ${isActive('/contacto') ? 'text-brand-cyan' : 'text-brand-gray-light'}`}
          >
            Contacto
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
          <Link
            href="/portal-clientes"
            onClick={() => setIsOpen(false)}
            className="w-full text-center text-sm font-semibold text-brand-white border border-brand-white/10 rounded-lg py-3 hover:border-brand-cyan bg-brand-gray-dark/40"
          >
            Ingresar a Clientes
          </Link>
        </div>
      </div>
    </header>
  );
}
