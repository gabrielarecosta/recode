'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  Calculator,
  Users,
  FileCode,
  Layers,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Cpu,
  Key
} from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Cotizamos tu proyecto',
    desc: 'Usando nuestro precotizador digital o mediante una propuesta personalizada, definimos el alcance técnico, los módulos y el abono mensual estimado.',
    icon: Calculator,
    color: 'text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5'
  },
  {
    num: '02',
    title: 'Tenemos una reunión',
    desc: 'Nos reunimos para entender a fondo la trastienda de tu negocio, mapear tus procesos reales y ajustar el diagrama de flujo y requerimientos finales.',
    icon: Users,
    color: 'text-brand-blue border-brand-blue/20 bg-brand-blue/5'
  },
  {
    num: '03',
    title: 'Te enviamos una demo',
    desc: 'Desarrollamos prototipos y maquetas interactivas funcionales para que puedas tocar y probar el flujo de la aplicación antes de la consolidación total.',
    icon: FileCode,
    color: 'text-brand-softviolet border-brand-softviolet/20 bg-brand-softviolet/5'
  },
  {
    num: '04',
    title: 'Consolidamos el proyecto',
    desc: 'Programamos el código definitivo, configuramos la base de datos, estructuramos las automatizaciones y realizamos pruebas de rendimiento y seguridad.',
    icon: Layers,
    color: 'text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5'
  },
  {
    num: '05',
    title: 'Te entregamos todo listo',
    desc: 'Lanzamos la plataforma y coordinamos una reunión de entrenamiento personalizada para enseñarte a vos y a tu equipo a dominar el sistema a la perfección.',
    icon: CheckCircle2,
    color: 'text-green-400 border-green-500/20 bg-green-500/5'
  }
];

export default function ComoTrabajamosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative z-10 space-y-16">
      
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-4 animate-pulse">
          <Cpu size={12} />
          <span>METODOLOGÍA — RECODE STUDIO</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-brand-white">
          Cómo Trabajamos
        </h1>
        <p className="text-sm text-brand-gray-light mt-4 leading-relaxed">
          Diseñamos y programamos sistemas a medida mediante un proceso claro, transparente y enfocado en la usabilidad real. Sin sorpresas, paso a paso.
        </p>
      </div>

      {/* Steps Flow (Vertical timeline with giant cards and arrows) */}
      <div className="space-y-8 relative">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="flex flex-col items-center">
              
              {/* Step Card */}
              <div className="w-full glass-card p-6 md:p-8 border border-brand-white/5 bg-brand-gray-dark/20 relative overflow-hidden group hover:border-brand-cyan/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-white/5 rounded-full blur-2xl group-hover:bg-brand-cyan/5 transition-all pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  
                  {/* Left: icon & text */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${step.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider">Paso {step.num}</span>
                      <h3 className="font-display font-bold text-lg text-brand-white mt-1 group-hover:text-brand-cyan transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs text-brand-gray-light leading-relaxed mt-2 max-w-xl">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right: Giant Number */}
                  <span className="text-5xl md:text-6xl font-display font-extrabold text-brand-white/5 group-hover:text-brand-cyan/5 transition-colors font-mono select-none">
                    {step.num}
                  </span>

                </div>
              </div>

              {/* Arrow Connector (except last step) */}
              {idx < STEPS.length - 1 && (
                <div className="my-6 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border border-brand-white/10 bg-brand-gray-dark/50 flex items-center justify-center text-brand-cyan shadow-[0_0_10px_rgba(34,211,238,0.1)] animate-bounce">
                    <ArrowDown size={14} />
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Project Progress Tracker Box */}
      <div className="glass-card p-6 md:p-8 border border-brand-cyan/25 bg-brand-blue/5 max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-cyan/15 flex items-center justify-center text-brand-cyan">
            <Key size={16} />
          </div>
          <h3 className="font-display font-bold text-sm text-brand-white uppercase tracking-wider">
            Seguimiento de tu proyecto
          </h3>
        </div>
        <p className="text-xs text-brand-gray-light leading-relaxed">
          En ReCode creemos en la transparencia total. Por eso, **podés seguir el progreso de tu proyecto desde el panel de ingreso con tu email y contraseña**. En el portal podrás ver las tareas completadas, el cronograma en tiempo real y probar las demos de cada fase del desarrollo.
        </p>
        <div className="pt-2">
          <Link
            href="/portal-clientes"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-cyan hover:underline"
          >
            Ir al Portal de Clientes
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Scope Disclaimer warning */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 text-yellow-300 max-w-3xl mx-auto">
        <ShieldAlert size={20} className="shrink-0 mt-0.5" />
        <span className="text-xs leading-relaxed">
          <strong>Aclaración importante de alcance:</strong> Todo desarrollo que contemple tiendas online (e-commerce) o catálogos interactivos <strong>no incluye la carga manual de productos, descripciones, fotos ni precios de stock</strong> en la tarifa base de cotización. ReCode Studio entrega la base de datos completamente estructurada, el panel administrativo adaptado y capacita al cliente para la autogestión de su inventario.
        </span>
      </div>

      {/* CTA final */}
      <div className="text-center space-y-6 pt-6 border-t border-brand-white/5">
        <h3 className="font-display font-bold text-lg text-brand-white">
          ¿Comenzamos a diseñar tu solución?
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
