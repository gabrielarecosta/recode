'use client';

import { useState } from 'react';
import { HelpCircle, Check, X, ArrowRight, Lightbulb, Sparkles, Scale, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Row {
  criterio: string;
  estandar: string;
  estandarOk: boolean;
  recode: string;
  recodeOk: boolean;
}

const COMPARISON_ROWS: Row[] = [
  { criterio: 'Velocidad de lanzamiento', estandar: 'Muy rápida (días/semanas)', estandarOk: true, recode: 'Moderada (4 a 12 semanas)', recodeOk: true },
  { criterio: 'Personalización visual', estandar: 'Limitada a plantillas rígidas', estandarOk: false, recode: '100% libre y a medida', recodeOk: true },
  { criterio: 'Funcionalidades especiales', estandar: 'Sujeta a plugins externos con costo', estandarOk: false, recode: 'Desarrolladas de cero según tus reglas', recodeOk: true },
  { criterio: 'Gestión de Procesos internos', estandar: 'No posee (requiere ERP separado)', estandarOk: false, recode: 'Integrado directamente a tu panel web', recodeOk: true },
  { criterio: 'Cuentas corrientes / Mayoristas', estandar: 'Difícil o limitado por plugins', estandarOk: false, recode: 'Fichero nativo con saldos y cobros', recodeOk: true },
  { criterio: 'Portales privados de clientes', estandar: 'Muy básicos e impersonales', estandarOk: false, recode: 'Acceso seguro con descarga de archivos', recodeOk: true },
  { criterio: 'Automatización de tareas', estandar: 'Básica por integraciones rígidas', estandarOk: false, recode: 'WhatsApp, mails y flujos automatizados', recodeOk: true },
  { criterio: 'Integración de APIs locales', estandar: 'Complejo o inviable en plantillas', estandarOk: false, recode: 'Conexión limpia con cualquier software', recodeOk: true },
  { criterio: 'Escalabilidad / Crecimiento', estandar: 'Te chocás con el límite de la plataforma', estandarOk: false, recode: 'Evoluciona por etapas sin límites', recodeOk: true },
  { criterio: 'Control y Propiedad de datos', estandar: 'Los datos pertenecen al servidor ajeno', estandarOk: false, recode: 'Propiedad total de la base de datos', recodeOk: true },
  { criterio: 'Paneles de acceso por rol', estandar: 'Pocas variantes rígidas', estandarOk: false, recode: 'Roles ilimitados (administración, chofer, etc)', recodeOk: true },
  { criterio: 'Soporte y Acompañamiento', estandar: 'Por tickets estándar automatizados', estandarOk: false, recode: 'Canal de comunicación directo y técnico', recodeOk: true }
];

export default function ComparadorPage() {
  // Test State
  const [testActive, setTestActive] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [testResult, setTestResult] = useState<string | null>(null);

  const testQuestions = [
    {
      id: 1,
      q: '¿Necesitás solamente mostrar/vender productos o también gestionar la trastienda operativa?',
      options: [
        { label: 'Solo mostrar productos o tener un carrito simple.', val: 'estandar' },
        { label: 'Gestionar stock sincronizado, condicionales de mercadería y tareas internas.', val: 'recode' }
      ]
    },
    {
      id: 2,
      q: '¿Tu negocio tiene reglas de cobro especiales o cuentas corrientes?',
      options: [
        { label: 'No, cobros minoristas directos por tarjeta.', val: 'estandar' },
        { label: 'Sí, vendo mayorista con saldos adeudados, señas o entregas condicionales.', val: 'recode' }
      ]
    },
    {
      id: 3,
      q: '¿Querés un diseño visual diferenciado del de tu competencia?',
      options: [
        { label: 'Me sirve una plantilla estándar de Tiendanube / Shopify.', val: 'estandar' },
        { label: 'Quiero una interfaz premium, interactiva y totalmente personalizada.', val: 'recode' }
      ]
    },
    {
      id: 4,
      q: '¿Necesitás integrar turnos, calculadoras de desgaste o flujos de WhatsApp a medida?',
      options: [
        { label: 'No, las herramientas básicas me alcanzan.', val: 'estandar' },
        { label: 'Sí, necesito simuladores o notificaciones automatizadas conectadas.', val: 'recode' }
      ]
    },
    {
      id: 5,
      q: '¿Planeás sumar nuevas funciones a tu sistema en el futuro?',
      options: [
        { label: 'No, con el catálogo básico me mantendré estable.', val: 'estandar' },
        { label: 'Sí, planeo escalar mi negocio sumando paneles por rol, informes y nuevos flujos.', val: 'recode' }
      ]
    }
  ];

  const handleSelectOption = (qId: number, val: string) => {
    setAnswers({ ...answers, [qId]: val });
  };

  const calculateTestResult = () => {
    const totalAnswers = Object.keys(answers).length;
    if (totalAnswers < 5) {
      alert('Por favor responde las 5 preguntas antes de finalizar.');
      return;
    }

    const recodeCount = Object.values(answers).filter(a => a === 'recode').length;

    if (recodeCount >= 4) {
      setTestResult('Tu proyecto definitivamente necesita un sistema a medida de ReCode Studio. Las plantillas tradicionales van a limitar tu operación y frenar tu crecimiento.');
    } else if (recodeCount >= 2) {
      setTestResult('Te conviene evaluar una solución personalizada. Aunque podrías iniciar con un mix estándar, las reglas de tu negocio requieren desarrollos a medida para no duplicar el trabajo.');
    } else {
      setTestResult('Podés empezar con una plataforma estándar. Si estás iniciando y tus requerimientos de trastienda son básicos, una plantilla tradicional resolverá tu necesidad inicial de forma rápida.');
    }
  };

  const resetTest = () => {
    setAnswers({});
    setTestResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
      
      {/* Background Decorative */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-4 animate-pulse">
          <Scale size={12} />
          <span>RECODE LABS — COMPARADOR ESTRATÉGICO</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-brand-white">
          ¿Plataforma estándar o desarrollo personalizado?
        </h1>
        <p className="text-sm text-brand-gray-light mt-3 max-w-xl mx-auto">
          Comprendé las diferencias operativas y técnicas entre las plantillas genéricas alquiladas y una solución digital a medida diseñada alrededor de tu negocio.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="glass-card border border-brand-white/5 overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-gray-dark/80 border-b border-brand-white/10">
                <th className="p-4 md:p-5 text-xs font-mono font-bold text-brand-white uppercase tracking-wider">Criterio de Evaluación</th>
                <th className="p-4 md:p-5 text-xs font-mono font-bold text-brand-gray-medium uppercase tracking-wider">Plataforma Estándar (Alquiler)</th>
                <th className="p-4 md:p-5 text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider">ReCode Studio (A Medida)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-white/5 text-xs">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-brand-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-brand-white">{row.criterio}</td>
                  <td className="p-4 text-brand-gray-light">
                    <div className="flex items-center gap-2">
                      {row.estandarOk ? <Check size={14} className="text-brand-gray-medium" /> : <X size={14} className="text-red-500" />}
                      <span>{row.estandar}</span>
                    </div>
                  </td>
                  <td className="p-4 text-brand-white font-semibold">
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-brand-cyan" />
                      <span>{row.recode}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-brand-gray-dark/40 p-5 text-xs leading-relaxed text-brand-gray-light border-t border-brand-white/10">
          <span className="font-bold text-brand-white block mb-1">Conclusión estratégica:</span>
          Una plataforma estándar es ideal si necesitás comenzar rápido con un catálogo básico y bajo presupuesto inicial. El desarrollo a medida es mejor cuando tu negocio ya cuenta con operaciones reales y necesitás automatizar procesos, integrar sistemas, gestionar cuentas corrientes o diseñar una experiencia de marca diferencial.
        </div>
      </div>

      {/* Mini Test Section */}
      <div className="glass-card p-6 md:p-10 border border-brand-cyan/20 bg-brand-blue/5">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-extrabold text-brand-white flex items-center justify-center gap-2">
            <HelpCircle className="text-brand-cyan" />
            ¿Qué opción es mejor para mi negocio?
          </h2>
          <p className="text-xs text-brand-gray-light mt-2">
            Respondé estas 5 breves preguntas estratégicas y nuestro orientador automático evaluará tu caso de inmediato.
          </p>
        </div>

        {!testActive && !testResult ? (
          <div className="text-center py-6">
            <button
              onClick={() => setTestActive(true)}
              className="btn-primary text-xs font-bold text-brand-white px-8 py-3 rounded-lg flex items-center gap-2 mx-auto"
            >
              Comenzar mini test
              <ArrowRight size={14} />
            </button>
          </div>
        ) : testActive && !testResult ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            {testQuestions.map((q) => {
              const selectedVal = answers[q.id];
              return (
                <div key={q.id} className="p-4 bg-brand-gray-dark/50 border border-brand-white/5 rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-brand-white font-mono flex gap-2">
                    <span className="text-brand-cyan">{q.id}.</span>
                    {q.q}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedVal === opt.val;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.val)}
                          className={`p-3 rounded-lg border text-xs text-left transition-all ${
                            isSelected
                              ? 'border-brand-cyan bg-brand-blue/15 text-brand-white'
                              : 'border-brand-white/10 bg-brand-black text-brand-gray-light hover:border-brand-white/20'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end gap-4 border-t border-brand-white/5 pt-4">
              <button
                onClick={resetTest}
                className="text-xs font-mono text-brand-gray-medium hover:text-brand-white"
              >
                Limpiar
              </button>
              <button
                onClick={calculateTestResult}
                className="btn-primary text-xs font-bold text-brand-white px-6 py-2.5 rounded-lg"
              >
                Ver Recomendación
              </button>
            </div>
          </div>
        ) : (
          /* RESULT DISPLAY */
          <div className="max-w-xl mx-auto p-6 bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl text-center space-y-5 animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mx-auto shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse">
              <Lightbulb size={20} />
            </div>
            
            <h3 className="font-display font-extrabold text-lg text-brand-white">
              Análisis de resultado
            </h3>
            
            <p className="text-xs text-brand-gray-light leading-relaxed">
              {testResult}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-brand-white/5">
              <button
                onClick={resetTest}
                className="text-xs font-mono text-brand-gray-medium hover:text-brand-white flex items-center justify-center gap-1.5 py-2.5 px-4 rounded border border-brand-white/10"
              >
                <RefreshCw size={12} />
                Volver a hacer test
              </button>
              <Link
                href="/diagnostico"
                className="btn-primary text-xs font-bold text-brand-white py-2.5 px-5 rounded flex items-center justify-center gap-2"
              >
                Ir al Diagnóstico Completo
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
