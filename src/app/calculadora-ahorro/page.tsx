'use client';

import { useState, useEffect } from 'react';
import { Calculator, Sparkles, TrendingUp, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function CalculadoraAhorroPage() {
  const [mounted, setMounted] = useState(false);
  
  // Inputs
  const [teamSize, setTeamSize] = useState(3);
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [hourlyRate, setHourlyRate] = useState(12000); // ARS
  const [automationPercent, setAutomationPercent] = useState(75); // Slider (%)

  // Hydration fix for Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculations
  const hoursPerMonthCurrent = teamSize * hoursPerWeek * 4.33; // 4.33 weeks per month average
  const costPerMonthCurrent = hoursPerMonthCurrent * hourlyRate;
  
  const hoursSavedPerMonth = hoursPerMonthCurrent * (automationPercent / 100);
  const moneySavedPerMonth = costPerMonthCurrent * (automationPercent / 100);
  const moneySavedPerYear = moneySavedPerMonth * 12;

  // Chart Data
  const chartData = [
    {
      name: 'Horas Operativas',
      'Sin Automatizar': Math.round(hoursPerMonthCurrent),
      'Con Automatización': Math.round(hoursPerMonthCurrent - hoursSavedPerMonth),
    },
    {
      name: 'Costo de Ineficiencia ($)',
      'Sin Automatizar': Math.round(costPerMonthCurrent / 1000), // in thousands for display
      'Con Automatización': Math.round((costPerMonthCurrent - moneySavedPerMonth) / 1000),
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
      
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-4 animate-pulse">
          <TrendingUp size={12} />
          <span>RECODE LABS — CALCULADORA DE RETORNO (ROI)</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-brand-white">
          ¿Cuánto tiempo podría recuperar tu empresa?
        </h1>
        <p className="text-sm text-brand-gray-light mt-3 max-w-xl mx-auto">
          Descubrí el impacto económico oculto de los procesos manuales y repetitivos. Ingresá los datos de tu equipo y estimá el ahorro anual con software a medida.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input panel (1 col) */}
        <div className="glass-card p-6 border border-brand-white/5 space-y-6">
          <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
            Datos de Operación
          </h3>

          {/* Input 1: Team size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-mono text-brand-gray-light">Personas involucradas:</label>
              <span className="font-bold text-brand-cyan">{teamSize} {teamSize === 1 ? 'persona' : 'personas'}</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full accent-brand-cyan bg-brand-gray-dark h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Input 2: Hours per week */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-mono text-brand-gray-light">Horas semanales por persona en tareas manuales:</label>
              <span className="font-bold text-brand-cyan">{hoursPerWeek} hs/semana</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full accent-brand-cyan bg-brand-gray-dark h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-[9px] text-brand-gray-medium leading-relaxed">
              (Carga de datos, armado de reportes, facturación manual, responder consultas frecuentes, transferir planillas)
            </p>
          </div>

          {/* Input 3: Hourly rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-mono text-brand-gray-light">Costo estimado por hora (ARS):</label>
              <span className="font-bold text-brand-cyan">$ {hourlyRate.toLocaleString('es-AR')} / hora</span>
            </div>
            <input
              type="range"
              min="2000"
              max="50000"
              step="1000"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-brand-cyan bg-brand-gray-dark h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-[9px] text-brand-gray-medium leading-relaxed">
              (Salario por hora + cargas sociales o costo de oportunidad de los directores)
            </p>
          </div>

          {/* Input 4: Automation percentage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-mono text-brand-gray-light">Porcentaje de automatización objetivo:</label>
              <span className="font-bold text-brand-cyan">{automationPercent}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={automationPercent}
              onChange={(e) => setAutomationPercent(Number(e.target.value))}
              className="w-full accent-brand-cyan bg-brand-gray-dark h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-[9px] text-brand-gray-medium leading-relaxed">
              (Porcentaje de las tareas repetitivas que un software a medida resolvería automáticamente)
            </p>
          </div>

          <div className="bg-brand-gray-dark/50 border border-brand-white/5 p-3 rounded-lg text-[10px] text-brand-gray-light leading-relaxed flex gap-2">
            <ShieldCheck size={16} className="text-brand-cyan shrink-0 mt-0.5" />
            <span>Los cálculos son de carácter estimativo. El retorno de inversión real se evalúa analizando en profundidad cada tarea interna.</span>
          </div>
        </div>

        {/* Results Columns (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="glass-card p-5 border border-brand-cyan/20 bg-brand-blue/5 text-center flex flex-col justify-between">
              <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-wider block">Tiempo Perdido Actual</span>
              <span className="text-2xl font-display font-extrabold text-brand-white my-3 flex items-center justify-center gap-1.5">
                <Clock size={20} className="text-brand-cyan" />
                {Math.round(hoursPerMonthCurrent)} hs <span className="text-xs font-mono text-brand-gray-medium">/ mes</span>
              </span>
              <span className="text-[9px] text-brand-gray-light">Invertidos en tareas mecánicas.</span>
            </div>

            <div className="glass-card p-5 border border-brand-cyan/20 bg-brand-blue/5 text-center flex flex-col justify-between">
              <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-wider block">Tiempo Recuperable</span>
              <span className="text-2xl font-display font-extrabold text-brand-cyan my-3 flex items-center justify-center gap-1.5">
                <Sparkles size={20} className="text-brand-cyan animate-pulse" />
                {Math.round(hoursSavedPerMonth)} hs <span className="text-xs font-mono text-brand-gray-medium">/ mes</span>
              </span>
              <span className="text-[9px] text-brand-gray-light">Que tu equipo usará para hacer crecer el negocio.</span>
            </div>

            <div className="glass-card p-5 border border-brand-cyan/20 bg-brand-blue/5 text-center flex flex-col justify-between">
              <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-wider block">Ahorro Anual Estimado</span>
              <span className="text-2xl font-display font-extrabold text-brand-white my-3 block">
                $ {moneySavedPerYear.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[9px] text-brand-cyan font-mono">
                (~ US$ {(moneySavedPerYear / 1000).toLocaleString('es-AR', { maximumFractionDigits: 0 })})
              </span>
            </div>

          </div>

          {/* Recharts comparison bar chart */}
          <div className="glass-card p-6 border border-brand-white/5">
            <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 mb-6 uppercase tracking-wider">
              Comparación Mensual: Sin vs Con Automatización
            </h3>
            
            <div className="h-[250px] w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#767B91" fontSize={11} />
                    <YAxis stroke="#767B91" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#171827', borderColor: 'rgba(23,75,255,0.2)', color: '#F5F4F5' }}
                      itemStyle={{ color: '#22D3EE' }}
                    />
                    <Bar dataKey="Sin Automatizar" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Con Automatización" fill="#174BFF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-brand-gray-medium">
                  Cargando gráfico...
                </div>
              )}
            </div>
            
            <div className="flex justify-center gap-6 mt-4 font-mono text-[10px]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-brand-white/20 rounded" />
                <span className="text-brand-gray-light">Situación Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-brand-blue rounded" />
                <span className="text-brand-cyan font-bold">Automatizado (ReCode)</span>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="glass-card p-6 border border-brand-cyan/20 bg-brand-blue/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display font-bold text-base text-brand-white">
                ¿Querés automatizar tus procesos manuales?
              </h4>
              <p className="text-xs text-brand-gray-light mt-1.5 max-w-lg">
                Agenda una sesión estratégica gratis para relevar las tareas repetitivas de tu empresa y diseñar la arquitectura técnica ideal.
              </p>
            </div>
            <Link
              href="/agendar"
              className="btn-primary text-xs font-bold text-brand-white px-5 py-3 rounded-lg flex items-center gap-2 shrink-0"
            >
              Coordinar análisis gratis
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
