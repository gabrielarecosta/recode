'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dbClient } from '@/lib/db';
import { Cpu, ArrowRight, ArrowLeft, CheckCircle, FileText, Calendar, Calculator, Check, Users, ShieldAlert, Sparkles } from 'lucide-react';

const STEPS = [
  { title: 'Datos Básicos', description: 'Sobre vos y tu empresa' },
  { title: 'Tu Negocio', description: 'Cómo trabajan hoy' },
  { title: 'Necesidades', description: 'Qué te gustaría solucionar' },
  { title: 'Urgencia', description: 'Tiempos y presupuesto' },
];

export default function DiagnosticoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    province: '',
    industry: '',
    team_size: '1-5',
    current_tools: [] as string[],
    custom_tools: '',
    pain_points: [] as string[],
    needed_features: [] as string[],
    urgency: 'medio',
    budget_range: 'medio_presupuesto',
    decision_maker: 'yo',
    want_meeting: 'si',
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxToggle = (field: 'current_tools' | 'pain_points' | 'needed_features', value: string) => {
    const list = [...formData[field]];
    if (list.includes(value)) {
      setFormData({ ...formData, [field]: list.filter(item => item !== value) });
    } else {
      setFormData({ ...formData, [field]: [...list, value] });
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.company) {
      alert('Por favor completá los datos básicos (Nombre, Email y Empresa).');
      setCurrentStep(0);
      return;
    }

    setLoading(true);

    try {
      // 1. Submit lead
      const serviceInterest = formData.needed_features.includes('ecommerce') && formData.needed_features.includes('internal_panel')
        ? 'ecommerce-gestion-interna'
        : formData.needed_features.includes('accounting')
        ? 'sistemas-contables'
        : formData.needed_features.includes('internal_panel')
        ? 'sistemas-gestion'
        : 'paginas-web';

      const response = await dbClient.submitLeadForm({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        province: formData.province,
        industry: formData.industry,
        service_interest: serviceInterest,
        message: `Diagnóstico realizado. Dolores: ${formData.pain_points.join(', ')}. Herramientas actuales: ${formData.current_tools.join(', ')}.`,
        source: 'Diagnóstico Digital',
        budget: formData.budget_range,
        urgency: formData.urgency,
        team_size: formData.team_size,
        needs_integrations: formData.needed_features.includes('integrations'),
        needed_modules: formData.needed_features
      });

      if (response.success && response.lead) {
        const lead = response.lead;

        // 2. Recommend solution logic
        let recommendation = 'Página Web Institucional Avanzada';
        let complexity: 'Bajo' | 'Medio' | 'Alto' | 'Avanzado' = 'Medio';
        let weeks = 6;
        let modules: string[] = [];

        if (formData.needed_features.includes('ecommerce') && formData.needed_features.includes('internal_panel')) {
          recommendation = 'Ecommerce con Gestión Interna (e.g. Bruma Moda)';
          complexity = 'Avanzado';
          weeks = 12;
          modules = ['Catálogo Web', 'Carrito y Pasarela de Pagos', 'Gestión de Stock', 'Cuentas Corrientes', 'Automatización de Facturas'];
        } else if (formData.needed_features.includes('accounting') || formData.needed_features.includes('documents')) {
          recommendation = 'Portal Contable y de Clientes (e.g. ContaNova Estudio)';
          complexity = 'Alto';
          weeks = 10;
          modules = ['Portal Privado con Autenticación', 'Calendario Fiscal', 'Carga de Documentos (Drag & Drop)', 'Alertas automáticas'];
        } else if (formData.needed_features.includes('fleet') || formData.needed_features.includes('logistics')) {
          recommendation = 'Plataforma de Flota y Logística (e.g. Ruta Norte)';
          complexity = 'Avanzado';
          weeks = 12;
          modules = ['Monitoreo en Mapa en Tiempo Real', 'Calculadora de Viajes', 'Panel de Choferes', 'Control de Costos y Combustible'];
        } else if (formData.needed_features.includes('booking')) {
          recommendation = 'Sistema de Agenda y Turnos (e.g. NexoTurnos)';
          complexity = 'Alto';
          weeks = 8;
          modules = ['Calendario de Reservas Online', 'Notificaciones automáticas por WhatsApp', 'Módulo de Profesionales', 'Cobro de Señas'];
        } else if (formData.needed_features.includes('internal_panel') || formData.needed_features.includes('crm')) {
          recommendation = 'Sistema de Gestión Interna / CRM (e.g. AgroLink)';
          complexity = 'Alto';
          weeks = 9;
          modules = ['CRM de Prospectos', 'Fichero de Clientes y Equipos', 'Reportes de Ventas', 'Tablero Kanban de Tareas'];
        } else if (formData.needed_features.includes('automation')) {
          recommendation = 'Sistema de Automatizaciones e Integraciones';
          complexity = 'Medio';
          weeks = 6;
          modules = ['Flujos automatizados de Emails', 'Alertas de Stock', 'Integración de API Externa'];
        }

        // Save diagnostic answer
        const answersList = [
          { question: 'Tamaño del equipo', answer: formData.team_size },
          { question: 'Herramientas actuales', answer: formData.current_tools.join(', ') + (formData.custom_tools ? ` / ${formData.custom_tools}` : '') },
          { question: 'Principales dolores', answer: formData.pain_points.join(', ') },
          { question: 'Urgencia de lanzamiento', answer: formData.urgency },
          { question: 'Decisor de compra', answer: formData.decision_maker },
        ];

        await dbClient.submitDiagnostic({
          lead_id: lead.id,
          recommended_solution: recommendation,
          suggested_modules: modules,
          complexity,
          estimated_weeks: weeks,
          answers: answersList
        });

        setDiagnosticResult({
          leadCode: lead.code,
          recommendation,
          complexity,
          weeks,
          modules,
          score: lead.score,
          priority: lead.priority
        });

        setCompleted(true);
      }
    } catch (e) {
      console.error(e);
      alert('Hubo un error al registrar el diagnóstico. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
      
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-4 animate-pulse">
          <Cpu size={12} />
          <span>RECODE LABS — DIAGNÓSTICO DIGITAL</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-brand-white">
          Descubrí qué solución necesita tu empresa
        </h1>
        <p className="text-sm text-brand-gray-light mt-3 max-w-xl mx-auto">
          Completá este test interactivo de 4 pasos para identificar los cuellos de botella en tu operación y obtener una recomendación de sistema adaptada a tu negocio.
        </p>
      </div>

      {!completed ? (
        <div className="glass-card p-6 md:p-10 border border-brand-blue/10">
          
          {/* Steps Indicator */}
          <div className="flex items-center justify-between mb-8 border-b border-brand-white/5 pb-6">
            {STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 text-center relative">
                {idx > 0 && (
                  <div className={`absolute top-4 right-[55%] left-[-45%] h-[2px] -z-10 ${
                    idx <= currentStep ? 'bg-brand-cyan shadow-[0_0_8px_#22D3EE]' : 'bg-brand-white/10'
                  }`} />
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                  idx < currentStep
                    ? 'bg-brand-cyan text-brand-black shadow-[0_0_8px_#22D3EE]'
                    : idx === currentStep
                    ? 'bg-brand-blue text-brand-white border border-brand-cyan shadow-[0_0_12px_rgba(23,75,255,0.6)]'
                    : 'bg-brand-gray-dark border border-brand-white/10 text-brand-gray-medium'
                }`}>
                  {idx < currentStep ? <Check size={14} /> : idx + 1}
                </div>
                <span className={`text-[10px] md:text-xs font-bold mt-2 hidden sm:block ${
                  idx === currentStep ? 'text-brand-white' : 'text-brand-gray-medium'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* STEP 1: DATOS BASICOS */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="font-display font-bold text-lg text-brand-white border-l-2 border-brand-cyan pl-3">
                Cuéntanos sobre vos y tu empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-mono text-brand-gray-light">Tu nombre completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleTextChange}
                    className="bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-brand-cyan focus:outline-none transition-all text-brand-white"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="company" className="text-xs font-mono text-brand-gray-light">Nombre de tu empresa / marca *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleTextChange}
                    className="bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-brand-cyan focus:outline-none transition-all text-brand-white"
                    placeholder="Ej: Distribuidora Norte"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-mono text-brand-gray-light">Email corporativo *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleTextChange}
                    className="bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-brand-cyan focus:outline-none transition-all text-brand-white"
                    placeholder="juan@empresa.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs font-mono text-brand-gray-light">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleTextChange}
                    className="bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-brand-cyan focus:outline-none transition-all text-brand-white"
                    placeholder="Ej: +54 9 11 1234-5678"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="city" className="text-xs font-mono text-brand-gray-light">Ciudad</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleTextChange}
                    className="bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-brand-cyan focus:outline-none transition-all text-brand-white"
                    placeholder="Ej: Rosario"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="province" className="text-xs font-mono text-brand-gray-light">Provincia / Región</label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleTextChange}
                    className="bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-brand-cyan focus:outline-none transition-all text-brand-white"
                    placeholder="Ej: Santa Fe"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="industry" className="text-xs font-mono text-brand-gray-light">Rubro o sector comercial</label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleTextChange}
                    className="bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-brand-cyan focus:outline-none transition-all text-brand-white"
                  >
                    <option value="">Seleccioná un rubro</option>
                    <option value="indumentaria">Indumentaria, Calzado o Moda</option>
                    <option value="salud">Salud, Medicina o Consultorios</option>
                    <option value="agro">Agro, Repuestos o Campo</option>
                    <option value="logistica">Logística, Transporte o Flotas</option>
                    <option value="inmobiliaria">Inmobiliaria y Real Estate</option>
                    <option value="servicios">Servicios Profesionales (Estudio Contable, Legal, etc)</option>
                    <option value="gastronomia">Gastronomía y Hotelería</option>
                    <option value="retail">Comercio Minorista / Mayorista General</option>
                    <option value="tecnologia">Tecnología / Software / Startup</option>
                    <option value="otro">Otro Rubro</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TU NEGOCIO */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="font-display font-bold text-lg text-brand-white border-l-2 border-brand-cyan pl-3">
                ¿Cómo trabaja tu empresa hoy?
              </h3>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-brand-gray-light">¿Cuántas personas integran tu equipo?</label>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {['1', '2-5', '5-20', '20+'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, team_size: opt })}
                      className={`py-3 rounded-lg border text-sm font-bold transition-all ${
                        formData.team_size === opt
                          ? 'border-brand-cyan bg-brand-blue/10 text-brand-white shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                          : 'border-brand-white/10 bg-brand-gray-dark/50 text-brand-gray-light hover:border-brand-white/20'
                      }`}
                    >
                      {opt} {opt === '20+' ? 'personas' : opt === '1' ? 'persona' : 'personas'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-brand-gray-light">¿Qué herramientas utilizan actualmente para gestionar clientes y pedidos? (Seleccioná todas las que apliquen)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Planillas Excel / Sheets', val: 'excel' },
                    { label: 'WhatsApp manual', val: 'whatsapp' },
                    { label: 'Cuaderno / Papel', val: 'papel' },
                    { label: 'Email / Mensajes', val: 'email' },
                    { label: 'Tienda estándar (Tiendanube, Shopify)', val: 'plataforma_estandar' },
                    { label: 'Sistema de gestión clásico (ERP rígido)', val: 'erp_estandar' }
                  ].map((tool) => (
                    <button
                      key={tool.val}
                      type="button"
                      onClick={() => handleCheckboxToggle('current_tools', tool.val)}
                      className={`p-3 rounded-lg border text-xs text-left transition-all flex items-center justify-between ${
                        formData.current_tools.includes(tool.val)
                          ? 'border-brand-cyan bg-brand-blue/10 text-brand-white'
                          : 'border-brand-white/10 bg-brand-gray-dark/50 text-brand-gray-light hover:border-brand-white/20'
                      }`}
                    >
                      {tool.label}
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        formData.current_tools.includes(tool.val) ? 'border-brand-cyan bg-brand-cyan text-brand-black' : 'border-brand-white/20'
                      }`}>
                        {formData.current_tools.includes(tool.val) && <Check size={10} strokeWidth={4} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="custom_tools" className="text-xs font-mono text-brand-gray-light">¿Usan algún otro sistema?</label>
                <input
                  type="text"
                  id="custom_tools"
                  name="custom_tools"
                  value={formData.custom_tools}
                  onChange={handleTextChange}
                  className="bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-brand-cyan focus:outline-none transition-all text-brand-white"
                  placeholder="Ej: Zoho CRM, Tango, etc."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-brand-gray-light">¿Cuáles son los principales problemas de tu negocio hoy? (Seleccioná tus mayores dolores)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: 'Información desordenada en planillas / Pérdida de datos', val: 'planillas_desordenadas' },
                    { label: 'Pérdida de tiempo repitiendo tareas operativas a mano', val: 'tareas_repetitivas' },
                    { label: 'Clientes consultando stock / estados de pedidos sin autogestión', val: 'clientes_consultas' },
                    { label: 'Falta de reportes unificados o indicadores de rentabilidad', val: 'falta_reportes' },
                    { label: 'Fricción en cobros, cuentas corrientes o condicionales', val: 'cobros_friccion' },
                    { label: 'La web actual es rígida y no se adapta a las reglas del negocio', val: 'web_rigida' }
                  ].map((pain) => (
                    <button
                      key={pain.val}
                      type="button"
                      onClick={() => handleCheckboxToggle('pain_points', pain.val)}
                      className={`p-3 rounded-lg border text-xs text-left transition-all flex items-center justify-between gap-3 ${
                        formData.pain_points.includes(pain.val)
                          ? 'border-brand-cyan bg-brand-blue/10 text-brand-white'
                          : 'border-brand-white/10 bg-brand-gray-dark/50 text-brand-gray-light hover:border-brand-white/20'
                      }`}
                    >
                      <span>{pain.label}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        formData.pain_points.includes(pain.val) ? 'border-brand-cyan bg-brand-cyan text-brand-black' : 'border-brand-white/20'
                      }`}>
                        {formData.pain_points.includes(pain.val) && <Check size={10} strokeWidth={4} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: NECESIDADES */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="font-display font-bold text-lg text-brand-white border-l-2 border-brand-cyan pl-3">
                ¿Qué tipo de solución creés que necesitan?
              </h3>
              <p className="text-xs text-brand-gray-light">Seleccioná los módulos o características que imaginás para tu sistema ideal:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Página Web pública institucional', val: 'web_publica', desc: 'Sitio institucional rápido para mostrar la empresa.' },
                  { label: 'Tienda Online / Venta Web', val: 'ecommerce', desc: 'Catálogo público con carrito de compras y pasarela de cobro.' },
                  { label: 'Panel Administrativo Interno', val: 'internal_panel', desc: 'Gestión interna de pedidos, clientes y stock.' },
                  { label: 'Portal Privado para Clientes', val: 'client_portal', desc: 'Acceso seguro para que tus clientes descarguen facturas y vean saldos.' },
                  { label: 'Sistema de Liquidación / Contabilidad', val: 'accounting', desc: 'Control de caja diaria, facturación AFIP e impuestos.' },
                  { label: 'Sistema de Agenda y Reservas de Turnos', val: 'booking', desc: 'Gestión de citas automática con disponibilidad de profesionales.' },
                  { label: 'Notificaciones automáticas por WhatsApp / Email', val: 'automation', desc: 'Alertas de compras, recordatorios de vencimiento automáticos.' },
                  { label: 'CRM de Ventas / Seguimiento comercial', val: 'crm', desc: 'Gestión estructurada de prospectos y presupuestos enviados.' },
                  { label: 'Integraciones con otras APIs o Softwares locales', val: 'integrations', desc: 'Conexión de bases de datos externas o ERPs.' },
                  { label: 'Administración de flotas / Logística', val: 'fleet', desc: 'Seguimiento de camiones, conductores y costos de viajes.' }
                ].map((feat) => (
                  <button
                    key={feat.val}
                    type="button"
                    onClick={() => handleCheckboxToggle('needed_features', feat.val)}
                    className={`p-4 rounded-lg border text-left transition-all flex flex-col gap-1 relative ${
                      formData.needed_features.includes(feat.val)
                        ? 'border-brand-cyan bg-brand-blue/10'
                        : 'border-brand-white/10 bg-brand-gray-dark/50 hover:border-brand-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-brand-white">{feat.label}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        formData.needed_features.includes(feat.val) ? 'border-brand-cyan bg-brand-cyan text-brand-black' : 'border-brand-white/20'
                      }`}>
                        {formData.needed_features.includes(feat.val) && <Check size={10} strokeWidth={4} />}
                      </div>
                    </div>
                    <span className="text-[10px] text-brand-gray-light leading-relaxed">{feat.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: TIEMPOS Y PRESUPUESTO */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="font-display font-bold text-lg text-brand-white border-l-2 border-brand-cyan pl-3">
                Urgencia, presupuesto y próximos pasos
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-brand-gray-light">¿Cuándo te gustaría lanzar el proyecto?</label>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Urgente (< 1 mes)', val: 'alta' },
                    { label: '1 a 3 meses', val: 'medio' },
                    { label: 'Más de 3 meses', val: 'baja' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: opt.val })}
                      className={`py-3 rounded-lg border text-xs font-semibold transition-all ${
                        formData.urgency === opt.val
                          ? 'border-brand-cyan bg-brand-blue/10 text-brand-white shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                          : 'border-brand-white/10 bg-brand-gray-dark/50 text-brand-gray-light hover:border-brand-white/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-brand-gray-light">¿Cómo encaran la inversión económica de tecnología?</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Por etapas (Esencial primero)', val: 'bajo_presupuesto' },
                    { label: 'Presupuesto estándar definido', val: 'medio_presupuesto' },
                    { label: 'Alta prioridad (Inversión agresiva)', val: 'alto_presupuesto' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget_range: opt.val })}
                      className={`p-3 rounded-lg border text-xs font-semibold transition-all text-center ${
                        formData.budget_range === opt.val
                          ? 'border-brand-cyan bg-brand-blue/10 text-brand-white shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                          : 'border-brand-white/10 bg-brand-gray-dark/50 text-brand-gray-light hover:border-brand-white/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-brand-gray-light">¿Quién toma la decisión final del proyecto en la empresa?</label>
                <select
                  name="decision_maker"
                  value={formData.decision_maker}
                  onChange={handleTextChange}
                  className="bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-brand-cyan focus:outline-none transition-all text-brand-white"
                >
                  <option value="yo">Yo soy la persona decisora</option>
                  <option value="socio">Yo y un socio / colega</option>
                  <option value="directorio">Un directorio o gerencia general</option>
                  <option value="investigando">Solo estoy investigando por el momento</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 border-t border-brand-white/5 pt-4">
                <label className="text-xs font-mono text-brand-gray-light">¿Te gustaría agendar una reunión virtual de 20 min para analizar los resultados?</label>
                <div className="flex gap-4">
                  {[
                    { label: 'Sí, me interesa coordinar', val: 'si' },
                    { label: 'No, prefiero ver el reporte online primero', val: 'no' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setFormData({ ...formData, want_meeting: opt.val })}
                      className={`flex-1 py-3 rounded-lg border text-xs font-semibold transition-all ${
                        formData.want_meeting === opt.val
                          ? 'border-brand-cyan bg-brand-blue/10 text-brand-white shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                          : 'border-brand-white/10 bg-brand-gray-dark/50 text-brand-gray-light hover:border-brand-white/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-brand-cyan/5 border border-brand-cyan/20 rounded-lg flex gap-3 text-brand-cyan">
                <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed">
                  Sus datos están totalmente protegidos de acuerdo a nuestra política de privacidad. Los resultados obtenidos son orientativos y no constituyen una cotización de contrato final.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons Nav */}
          <div className="flex items-center justify-between border-t border-brand-white/5 pt-6 mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                currentStep === 0 ? 'text-brand-gray-medium cursor-not-allowed' : 'text-brand-white hover:text-brand-cyan'
              }`}
            >
              <ArrowLeft size={14} />
              Atrás
            </button>
            
            <button
              onClick={handleNext}
              disabled={loading}
              className="btn-primary text-xs font-bold text-brand-white px-6 py-2.5 rounded-lg flex items-center gap-2"
            >
              {loading ? (
                <span>Analizando procesos...</span>
              ) : currentStep === STEPS.length - 1 ? (
                <>
                  Obtener Diagnóstico
                  <Sparkles size={14} className="text-brand-cyan animate-pulse" />
                </>
              ) : (
                <>
                  Siguiente paso
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        /* DIAGNOSTIC RESULTS DISPLAY */
        <div className="space-y-8 animate-fadeIn printable-area">
          <div className="glass-card p-6 md:p-10 border border-brand-cyan/30 shadow-[0_0_30px_rgba(34,211,238,0.1)] relative">
            <div className="absolute top-4 right-4 text-[10px] font-mono text-brand-cyan bg-brand-cyan/15 px-2.5 py-1 rounded-full border border-brand-cyan/30">
              Código de caso: {diagnosticResult.leadCode}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <CheckCircle size={32} className="text-brand-cyan animate-bounce" />
              <div>
                <h3 className="font-display font-extrabold text-2xl text-brand-white">
                  ¡Diagnóstico procesado con éxito!
                </h3>
                <p className="text-xs text-brand-gray-light font-mono mt-1">
                  Tu empresa tiene una madurez tecnológica orientativa del {(diagnosticResult.score / 1.2).toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-brand-white/5 py-8 my-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-widest">Solución recomendada</span>
                <span className="text-sm font-bold text-brand-white">{diagnosticResult.recommendation}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-widest">Complejidad estimada</span>
                <span className="text-sm font-bold text-brand-cyan">{diagnosticResult.complexity}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-widest">Plazo sugerido de desarrollo</span>
                <span className="text-sm font-bold text-brand-white">{diagnosticResult.weeks} a {diagnosticResult.weeks + 2} semanas</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm text-brand-white flex items-center gap-2">
                <Users size={16} className="text-brand-cyan" />
                Módulos sugeridos para la Etapa Inicial (MVP):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {diagnosticResult.modules.map((mod: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg bg-brand-gray-dark/40 border border-brand-white/5">
                    <div className="w-5 h-5 rounded-full bg-brand-cyan/15 text-brand-cyan flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-xs text-brand-gray-light">{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-brand-gray-dark/50 border border-brand-white/10 rounded-lg text-xs leading-relaxed text-brand-gray-light mt-8">
              <span className="font-bold text-brand-white block mb-1">Aclaración importante:</span>
              Este diagnóstico digital se genera mediante un análisis algorítmico automatizado sobre tus respuestas. El alcance final del proyecto, las especificaciones de diseño UX/UI y las integraciones técnicas reales se definirán formalmente en una reunión de análisis estratégico.
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 p-4 rounded-xl border border-brand-white/10 bg-brand-gray-dark/40 text-brand-white hover:border-brand-cyan hover:bg-brand-gray-dark/60 transition-all font-mono text-xs font-bold"
            >
              <FileText size={16} className="text-brand-cyan" />
              Imprimir / Guardar PDF
            </button>
            <button
              onClick={() => router.push('/agendar')}
              className="flex items-center justify-center gap-2 p-4 rounded-xl border border-brand-cyan/20 bg-brand-blue/10 text-brand-white hover:border-brand-cyan transition-all font-mono text-xs font-bold"
            >
              <Calendar size={16} className="text-brand-cyan" />
              Agendar Reunión Inicial
            </button>
            <button
              onClick={() => router.push('/precotizador')}
              className="flex items-center justify-center gap-2 p-4 rounded-xl btn-primary text-brand-white hover:opacity-90 transition-all font-mono text-xs font-bold"
            >
              <Calculator size={16} />
              Ir al Precotizador
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
