'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Terminal, Filter, ArrowRight, Layers } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'Todos' },
  { key: 'web', label: 'Páginas Web' },
  { key: 'ecommerce', label: 'E-commerce' },
  { key: 'management', label: 'Gestión Interna' }
];

const PROJECTS = [
  {
    slug: 'bruma-moda',
    name: 'Bruma Moda',
    category: 'ecommerce',
    rubro: 'Indumentaria y Accesorios',
    type: 'Ecommerce + Gestión Interna',
    desc: 'Tienda online premium unificada con un panel de control administrativo para coordinar stock, condicionales y cuentas corrientes mayoristas en tiempo real.'
  },
  {
    slug: 'contanova-estudio',
    name: 'ContaNova Estudio',
    category: 'management',
    rubro: 'Estudios Contables',
    type: 'Sistema Contable + Portal Clientes',
    desc: 'Plataforma con Portal Privado para clientes del estudio contable, agenda, recordatorios automáticos de vencimientos y carga drag & drop de facturas.'
  },
  {
    slug: 'agrolink-repuestos',
    name: 'AgroLink Repuestos',
    category: 'management',
    rubro: 'Repuestos Maquinaria Agrícola',
    type: 'Web + CRM + Portal de Clientes',
    desc: 'Catálogo de piezas de repuestos con cotizador técnico, calculadoras de desgaste preventivo por horas de uso e historial de mantenimiento técnico.'
  },
  {
    slug: 'nexoturnos-salud',
    name: 'NexoTurnos Salud',
    category: 'management',
    rubro: 'Salud, Estética y Clínicas',
    type: 'Turnos + Gestión Profesional',
    desc: 'Sistema de reservas online con cobro de señas integrados, alertas automáticas de asistencia por WhatsApp y agendas para profesionales médicos.'
  },
  {
    slug: 'ruta-norte-logistica',
    name: 'Ruta Norte Logística',
    category: 'management',
    rubro: 'Transporte y Logística',
    type: 'Gestión de Flota + Viajes',
    desc: 'Plataforma para vehículos, choferes, vencimiento de seguros y calculadora de costos operativos de viajes activos con datos interactivos en mapa.'
  },
  {
    slug: 'prisma-gestion-inmobiliaria',
    name: 'Prisma Gestión Inmobiliaria',
    category: 'web',
    rubro: 'Real Estate / Inmobiliarias',
    type: 'Sitio Inmobiliario + CRM',
    desc: 'Buscador de propiedades con filtros interactivos, CRM interno para agentes de venta y portales separados para inquilinos y propietarios.'
  }
];

export default function ProyectosPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = activeCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      
      {/* Background Decorative */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-4 animate-pulse">
          <Layers size={12} />
          <span>RECODE LABS — PROYECTOS CONCEPTUALES</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-brand-white">
          Fichas y Prototipos Conceptuales
        </h1>
        <p className="text-sm text-brand-gray-light mt-3 max-w-xl mx-auto">
          Explorá nuestros prototipos y conceptos de diseño. Sirven para ilustrar nuestras capacidades de frontend, backend, automatizaciones e integraciones complejas en distintos rubros comerciales.
        </p>
      </div>

      {/* Filters Switcher */}
      <div className="flex justify-center gap-2.5 flex-wrap border-b border-brand-white/5 pb-6 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
              activeCategory === cat.key
                ? 'border-brand-cyan bg-brand-blue/15 text-brand-white shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                : 'border-brand-white/10 bg-brand-gray-dark/50 text-brand-gray-light hover:border-brand-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((p) => (
          <div key={p.slug} className="glass-card p-6 border border-brand-white/5 flex flex-col justify-between h-[340px] relative">
            
            {/* Concept Label */}
            <div className="absolute top-4 right-4 text-[8px] font-mono font-bold text-brand-cyan bg-brand-cyan/15 px-2 py-0.5 rounded border border-brand-cyan/20">
              ReCode Lab — Proyecto Conceptual
            </div>

            <div>
              <span className="text-[9px] font-mono text-brand-gray-medium uppercase block tracking-wider mt-2">
                {p.rubro}
              </span>
              
              <h3 className="font-display font-extrabold text-lg text-brand-white mt-1">
                {p.name}
              </h3>
              
              <span className="text-[10px] font-mono text-brand-cyan/85 mt-0.5 block">
                {p.type}
              </span>

              <p className="text-xs text-brand-gray-light leading-relaxed mt-4 line-clamp-4">
                {p.desc}
              </p>
            </div>

            <div className="border-t border-brand-white/5 pt-4 flex items-center justify-between mt-auto">
              <span className="text-[9px] font-mono text-brand-gray-medium uppercase">Next.js • Tailwind • Supabase</span>
              <Link
                href={`/proyectos/${p.slug}`}
                className="text-xs font-bold text-brand-white hover:text-brand-cyan flex items-center gap-1 transition-colors"
              >
                Ver ficha técnica
                <ArrowRight size={12} />
              </Link>
            </div>

          </div>
        ))}
      </div>
      
      {/* Disclaimer */}
      <div className="bg-brand-gray-dark/40 border border-brand-white/10 p-5 rounded-xl text-center text-xs leading-relaxed text-brand-gray-light max-w-xl mx-auto mt-16">
        <span className="font-bold text-brand-white block mb-1">Aclaración de honestidad comercial:</span>
        Todos los nombres de proyectos y marcas representados en este catálogo (Bruma Moda, ContaNova, AgroLink, NexoTurnos, Ruta Norte, Prisma) son **ficticios**. No representamos clientes ni facturaciones reales. Sirven puramente como modelo de referencia de nuestras capacidades de ingeniería y diseño de software.
      </div>

    </div>
  );
}
