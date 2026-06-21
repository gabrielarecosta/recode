'use client';

import React from 'react';
import {
  Activity,
  Calculator,
  Stethoscope,
  ShoppingCart,
  Scale,
  Target,
  Home,
  Car,
  Settings,
  Sparkles,
  User,
  GraduationCap,
  Lightbulb,
  Store,
  Truck,
  Boxes,
  Wrench,
  ClipboardList,
  Building2,
  Utensils,
  Dumbbell,
  Users,
  Calendar,
  Database,
  DollarSign,
  Lock,
  MessageSquare,
  Mail,
  CreditCard,
  TrendingUp,
  LayoutDashboard,
  Sliders,
  Sparkle
} from 'lucide-react';

interface MarqueeItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const INDUSTRIES: MarqueeItem[] = [
  { label: 'Nutricionistas', icon: Activity },
  { label: 'Contadores', icon: Calculator },
  { label: 'Centros médicos', icon: Stethoscope },
  { label: 'Tiendas online', icon: ShoppingCart },
  { label: 'Estudios jurídicos', icon: Scale },
  { label: 'Agencias de marketing', icon: Target },
  { label: 'Inmobiliarias', icon: Home },
  { label: 'Concesionarias', icon: Car },
  { label: 'Agrorepuestos', icon: Settings },
  { label: 'Clínicas estéticas', icon: Sparkles },
  { label: 'Profesionales independientes', icon: User },
  { label: 'Institutos educativos', icon: GraduationCap },
  { label: 'Emprendedores', icon: Lightbulb },
  { label: 'Comercios locales', icon: Store },
  { label: 'Logística', icon: Truck },
  { label: 'Distribuidoras', icon: Boxes },
  { label: 'Talleres', icon: Wrench },
  { label: 'Consultorios', icon: ClipboardList },
  { label: 'Mayoristas', icon: Building2 },
  { label: 'Restaurantes', icon: Utensils },
  { label: 'Gimnasios', icon: Dumbbell },
  { label: 'Equipos administrativos', icon: Users }
];

const FEATURES: MarqueeItem[] = [
  { label: 'Turnos online', icon: Calendar },
  { label: 'Control de Stock', icon: Database },
  { label: 'Cuentas corrientes', icon: DollarSign },
  { label: 'Portales privados', icon: Lock },
  { label: 'Automatización WhatsApp', icon: MessageSquare },
  { label: 'Emails automáticos', icon: Mail },
  { label: 'Pagos (Mercado Pago)', icon: CreditCard },
  { label: 'Reportes & KPIs', icon: TrendingUp },
  { label: 'CRM Comercial', icon: Target },
  { label: 'Formularios inteligentes', icon: ClipboardList },
  { label: 'Dashboards a medida', icon: LayoutDashboard },
  { label: 'Gestión interna', icon: Sliders }
];

export default function RubrosMarquee() {
  return (
    <section className="relative py-16 overflow-hidden bg-brand-black/40 border-y border-brand-white/5">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-[10px] font-mono mb-4 uppercase tracking-wider">
          <Sparkle size={10} className="animate-pulse" />
          <span>Soluciones por rubro</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-white tracking-tight">
          Tenemos clientes de todas las áreas
        </h2>

        {/* Subtext */}
        <p className="text-sm text-brand-gray-light mt-3 max-w-2xl mx-auto leading-relaxed">
          Creamos sistemas, automatizaciones y plataformas digitales adaptadas a negocios reales, de rubros distintos y con necesidades distintas.
        </p>
      </div>

      {/* Marquee Track Container */}
      <div className="space-y-6 relative w-full select-none">
        
        {/* Left & Right fading gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-48 bg-gradient-to-r from-brand-black to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-48 bg-gradient-to-l from-brand-black to-transparent z-20 pointer-events-none" />

        {/* First Marquee: Right to Left */}
        <div className="w-full overflow-hidden flex">
          <div className="flex gap-4 py-2 w-max animate-marquee-css [will-change:transform]">
            {/* Main content loop */}
            {INDUSTRIES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`ind-1-${idx}`}
                  className="glass-card flex items-center gap-2.5 px-5 py-2.5 border border-brand-cyan/15 rounded-full bg-brand-gray-dark/40 backdrop-blur-md transition-all duration-300 hover:border-brand-cyan/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] group cursor-pointer shrink-0"
                >
                  <Icon className="w-4 h-4 text-brand-cyan group-hover:scale-110 transition-transform duration-300 shrink-0" />
                  <span className="text-xs font-mono font-medium text-brand-gray-light group-hover:text-brand-white transition-colors duration-300">
                    {item.label}
                  </span>
                </div>
              );
            })}
            {/* Duplicated content for infinite scroll */}
            {INDUSTRIES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`ind-2-${idx}`}
                  className="glass-card flex items-center gap-2.5 px-5 py-2.5 border border-brand-cyan/15 rounded-full bg-brand-gray-dark/40 backdrop-blur-md transition-all duration-300 hover:border-brand-cyan/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] group cursor-pointer shrink-0"
                >
                  <Icon className="w-4 h-4 text-brand-cyan group-hover:scale-110 transition-transform duration-300 shrink-0" />
                  <span className="text-xs font-mono font-medium text-brand-gray-light group-hover:text-brand-white transition-colors duration-300">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Second Marquee: Left to Right (Reverse direction) */}
        <div className="w-full overflow-hidden flex">
          <div className="flex gap-4 py-2 w-max animate-marquee-reverse-css [will-change:transform]">
            {/* Main content loop */}
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`feat-1-${idx}`}
                  className="glass-card flex items-center gap-2.5 px-5 py-2.5 border border-brand-blue/15 rounded-full bg-brand-gray-dark/40 backdrop-blur-md transition-all duration-300 hover:border-brand-blue/50 hover:shadow-[0_0_15px_rgba(23,75,255,0.2)] group cursor-pointer shrink-0"
                >
                  <Icon className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform duration-300 shrink-0" />
                  <span className="text-xs font-mono font-medium text-brand-gray-light group-hover:text-brand-white transition-colors duration-300">
                    {item.label}
                  </span>
                </div>
              );
            })}
            {/* Duplicated content for infinite scroll */}
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`feat-2-${idx}`}
                  className="glass-card flex items-center gap-2.5 px-5 py-2.5 border border-brand-blue/15 rounded-full bg-brand-gray-dark/40 backdrop-blur-md transition-all duration-300 hover:border-brand-blue/50 hover:shadow-[0_0_15px_rgba(23,75,255,0.2)] group cursor-pointer shrink-0"
                >
                  <Icon className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform duration-300 shrink-0" />
                  <span className="text-xs font-mono font-medium text-brand-gray-light group-hover:text-brand-white transition-colors duration-300">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </section>
  );
}
