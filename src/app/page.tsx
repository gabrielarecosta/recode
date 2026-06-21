'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuote } from '@/context/QuoteContext';
import { dbClient, QuoteRule, User, Quote } from '@/lib/db';
import RubrosMarquee from '@/components/RubrosMarquee';
import {
  Sparkles, Terminal, ArrowRight, CheckCircle2, ChevronRight, Plus, HelpCircle, Check, X,
  Layers, Settings, ShoppingBag, Eye, Cpu, Database, Mail, Phone, CalendarDays,
  Globe, ShoppingCart, Calculator, DollarSign, Calendar, Send, RefreshCw
} from 'lucide-react';

const EXCHANGE_RATE = 1000; // 1 USD = 1000 ARS (Valor de Referencia)

const getQuoteGroup = (projectType: string, selectedModules: string[]) => {
  const count = selectedModules.length;

  const hasEcommerce = selectedModules.includes('catalogo-productos') || selectedModules.includes('carrito-checkout') || projectType === 'ecommerce' || projectType === 'ecommerce-gestion-interna';
  const hasManagement = selectedModules.includes('panel-administrativo') || selectedModules.includes('gestion-clientes') || selectedModules.includes('control-stock') || selectedModules.includes('cuentas-corrientes') || projectType === 'sistemas-gestion' || projectType === 'sistemas-contables' || projectType === 'crm';
  const hasPortal = selectedModules.includes('portal-privado-clientes') || projectType === 'portales-clientes';
  const hasAutomations = selectedModules.includes('notificaciones-whatsapp') || selectedModules.includes('emails-transaccionales') || selectedModules.includes('generacion-pdf') || projectType === 'automatizacion';

  // 1. Solution Empresarial
  if (
    projectType === 'web-apps' || 
    projectType === 'dashboards' ||
    count >= 11 || 
    (hasEcommerce && hasManagement && hasPortal && hasAutomations && count >= 8)
  ) {
    return {
      complexity: 'Empresarial',
      minPrice: 750000,
      maxPrice: 1200000,
      minWeeks: 12,
      maxWeeks: 20
    };
  }

  // 2. Solution Avanzada
  if (
    projectType === 'ecommerce-gestion-interna' ||
    (hasEcommerce && hasManagement && count >= 6) ||
    count >= 7
  ) {
    return {
      complexity: 'Avanzada',
      minPrice: 450000,
      maxPrice: 750000,
      minWeeks: 8,
      maxWeeks: 14
    };
  }

  // 3. Solution Profesional (Alta)
  if (
    hasEcommerce ||
    hasManagement ||
    hasPortal ||
    projectType === 'sistemas-turnos' ||
    count >= 4
  ) {
    return {
      complexity: 'Alta',
      minPrice: 320000,
      maxPrice: 480000,
      minWeeks: 6,
      maxWeeks: 10
    };
  }

  // 4. Solution Intermedia (Media)
  if (
    projectType === 'avanzada' ||
    count >= 2
  ) {
    return {
      complexity: 'Media',
      minPrice: 220000,
      maxPrice: 350000,
      minWeeks: 4,
      maxWeeks: 7
    };
  }

  // 5. Solution Básica (Baja)
  return {
    complexity: 'Baja',
    minPrice: 120000,
    maxPrice: 220000,
    minWeeks: 2,
    maxWeeks: 4
  };
};

const getComplexityColor = (comp: string) => {
  switch (comp) {
    case 'Baja': return 'text-brand-gray-light';
    case 'Media': return 'text-brand-cyan';
    case 'Alta': return 'text-brand-softviolet';
    case 'Avanzada': return 'text-red-400';
    case 'Empresarial': return 'text-red-500';
    default: return 'text-brand-gray-light';
  }
};

function CheckCircleIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-brand-cyan/15 text-brand-cyan flex items-center justify-center mx-auto animate-bounce">
      <Check size={16} strokeWidth={3} />
    </div>
  );
}

const baseProjects = [
  { key: 'landing', label: 'Landing Page Comercial', desc: 'Página única orientada al diseño de conversión rápida.' },
  { key: 'institucional', label: 'Web Institucional Básica', desc: 'Sitio de presentación corporativo de múltiples páginas.' },
  { key: 'avanzada', label: 'Web Institucional Avanzada', desc: 'Diseño premium interactivo con animaciones avanzadas.' },
  { key: 'ecommerce', label: 'Tienda Online (Ecommerce)', desc: 'Carritos de compra, pasarelas de cobro y envíos estándar.' },
  { key: 'ecommerce-gestion-interna', label: 'Ecommerce + Panel de Gestión', desc: 'Tienda pública con panel administrativo para stock y cuentas corrientes.' },
  { key: 'sistemas-gestion', label: 'Sistema de Gestión Interna', desc: 'Gestión operativa interna, clientes, tareas y stock.' },
  { key: 'sistemas-contables', label: 'Sistema Contable', desc: 'Caja diaria contable, egresos y control impositivo.' },
  { key: 'portales-clientes', label: 'Portal de Clientes Privado', desc: 'Área de clientes segura con descarga de facturas y archivos.' },
  { key: 'sistemas-turnos', label: 'Sistema de Turnos', desc: 'Reserva online de turnos y agendas sincronizadas.' },
  { key: 'crm', label: 'CRM de Ventas', desc: 'Embudo de prospectos comerciales y cotizaciones rápidas.' },
  { key: 'dashboards', label: 'Dashboard y Reportes', desc: 'Paneles visuales y gráficos de métricas operativas.' },
  { key: 'automatizacion', label: 'Automatización de Procesos', desc: 'Sincronizaciones automáticas de planillas y alertas.' },
  { key: 'integraciones', label: 'Integración de Sistemas (API)', desc: 'Conectar tus plataformas mediante endpoints personalizados.' },
  { key: 'web-apps', label: 'Web App Personalizada (SaaS)', desc: 'Desarrollos complejos, multi-usuario con lógica operativa propia.' }
];

const constructorCategories = [
  {
    title: 'Web Pública',
    items: [
      { key: 'paginas-institucionales', label: 'Páginas Institucionales', desc: 'Sitio de presentación corporativo de múltiples páginas.' },
      { key: 'formularios-inteligentes', label: 'Formularios Inteligentes', desc: 'Formularios interactivos con validación y guardado.' },
      { key: 'calculadoras-simuladores', label: 'Calculadoras / Simuladores', desc: 'Simuladores de costos o calculadoras para el cliente.' },
      { key: 'portfolio-conceptual', label: 'Portfolio conceptual', desc: 'Espacio dinámico para mostrar trabajos o productos.' }
    ]
  },
  {
    title: 'E-commerce',
    items: [
      { key: 'catalogo-productos', label: 'Catálogo de Productos', desc: 'Exposición interactiva de productos con filtros.' },
      { key: 'carrito-checkout', label: 'Carrito de Compras y Checkout', desc: 'Flujo completo de compra para el cliente.' },
      { key: 'cobros-mercado-pago', label: 'Cobros (Mercado Pago)', desc: 'Integración de pasarela para pagos online.' },
      { key: 'cotizador-envios', label: 'Cotizador Envíos nacionales', desc: 'Cálculo automático de costos de envío.' }
    ]
  },
  {
    title: 'Gestión Interna',
    items: [
      { key: 'panel-administrativo', label: 'Roles y Permisos (Admin)', desc: 'Panel de control con permisos de acceso diferenciales.' },
      { key: 'gestion-clientes', label: 'Gestión de Clientes (CRM)', desc: 'Fichas, historial y base de datos de clientes.' },
      { key: 'control-stock', label: 'Sincronizador de Stock', desc: 'Control de inventario integrado con canales de venta.' },
      { key: 'cuentas-corrientes', label: 'Cuentas Corrientes', desc: 'Mapeo de saldos y créditos mayoristas.' },
      { key: 'portal-privado-clientes', label: 'Área Privada Clientes', desc: 'Portal para descarga de facturas y archivos.' }
    ]
  },
  {
    title: 'Automatización',
    items: [
      { key: 'notificaciones-whatsapp', label: 'Notificaciones WhatsApp', desc: 'Envío de mensajes automáticos desde tus sistemas.' },
      { key: 'emails-transaccionales', label: 'Emails automáticos', desc: 'Plantillas de correo autogestionadas desde el panel.' },
      { key: 'generacion-pdf', label: 'Generación PDF', desc: 'Exportación automática de facturas, remitos y reportes.' }
    ]
  }
];

const optionalModulesFlat = constructorCategories.flatMap(c => c.items);

function HomeContent() {
  const router = useRouter();

  // SECTION 2: Problem cards interactive state
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  const problemCards = [
    { id: 'p1', title: 'Tengo información en muchas planillas.', rec: 'Podrías necesitar un sistema de gestión interno con clientes, tareas, reportes y automatizaciones.' },
    { id: 'p2', title: 'Repito tareas todos los días.', rec: 'Se puede solucionar con automatizaciones conectadas a WhatsApp y correos electrónicos automáticos.' },
    { id: 'p3', title: 'Mis clientes preguntan siempre lo mismo.', rec: 'Un Portal de Clientes o un Sistema de Turnos les daría autogestión de saldos, facturas y reservas.' },
    { id: 'p4', title: 'No tengo seguimiento claro.', rec: 'Te conviene implementar un CRM a medida con tableros Kanban para ver el pipeline de ventas.' },
    { id: 'p5', title: 'Mi tienda online no se adapta a mi negocio.', rec: 'Necesitás un Ecommerce con Gestión Interna que coordine stock, condicionales y cuentas corrientes.' },
    { id: 'p6', title: 'No puedo ver toda mi operación en un solo lugar.', rec: 'Un Dashboard de Métricas consolidaría tus bases de datos e inventarios en gráficos en tiempo real.' }
  ];

  const [rules, setRules] = useState<QuoteRule[]>([]);
  useEffect(() => {
    async function loadRules() {
      try {
        const data = await dbClient.getQuoteRules();
        setRules(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadRules();
  }, []);

  // Shared state from QuoteContext
  const {
    quote,
    setProjectType,
    setCustomDesign,
    setSelectedModules,
    toggleModule,
    setUrgency,
    setCurrency,
    clearQuote
  } = useQuote();

  const {
    projectType,
    customDesign,
    selectedModules,
    urgency,
    currency
  } = quote;

  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const modulesParam = searchParams.get('modules');

  // Calculation Results
  const [pricing, setPricing] = useState({ min: 0, max: 0, minWeeks: 2, maxWeeks: 4, complexity: 'Baja' });

  // Lead Capture State
  const [leadData, setLeadData] = useState({ name: '', company: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedQuoteCode, setSubmittedQuoteCode] = useState('');

  const [clientUser, setClientUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  const [authError, setAuthError] = useState('');
  
  // Auth Form State
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    companyName: '',
    password: ''
  });

  // Load client user session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recode_client_user');
      if (stored) {
        try {
          setClientUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleSaveQuoteDirectly = async (userObj: User) => {
    setSubmitting(true);
    try {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const quoteCode = `RC-QT-2026-${randNum}`;
      
      const newQuote: Quote = {
        id: `quote-${Date.now()}`,
        userId: userObj.id,
        quoteCode: quoteCode,
        companyName: userObj.companyName,
        project_type: projectType,
        selected_modules: selectedModules,
        complexity: (pricing.complexity === 'Baja'
          ? 'Bajo'
          : pricing.complexity === 'Media'
          ? 'Medio'
          : pricing.complexity === 'Alta'
          ? 'Alto'
          : 'Avanzado') as 'Bajo' | 'Medio' | 'Alto' | 'Avanzado',
        estimated_min: pricing.min,
        estimated_max: pricing.max,
        estimated_weeks: pricing.maxWeeks,
        currency: currency,
        notes: `Estimación guardada por cliente ${userObj.name} (${userObj.companyName}).`,
        status: 'pendiente',
        created_at: new Date().toISOString()
      };

      // Guardar cotización
      await dbClient.submitQuote(newQuote);

      setSubmittedQuoteCode(quoteCode);
      setSubmitted(true);
      setShowAuthModal(false);
    } catch (err) {
      console.error(err);
      alert('Error al guardar la cotización.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveQuoteDirectlyClick = () => {
    if (clientUser) {
      handleSaveQuoteDirectly(clientUser);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);
    
    try {
      if (authTab === 'register') {
        if (!authForm.name || !authForm.email || !authForm.whatsapp || !authForm.companyName || !authForm.password) {
          setAuthError('Por favor completa todos los campos.');
          setSubmitting(false);
          return;
        }
        
        const res = await dbClient.signUp({
          name: authForm.name,
          email: authForm.email,
          whatsapp: authForm.whatsapp,
          companyName: authForm.companyName,
          password: authForm.password
        });
        
        if (res.success && res.user) {
          localStorage.setItem('recode_client_user', JSON.stringify(res.user));
          setClientUser(res.user);
          await handleSaveQuoteDirectly(res.user);
        } else {
          setAuthError(res.error || 'Error al registrarse.');
        }
      } else {
        if (!authForm.email || !authForm.password) {
          setAuthError('Por favor ingresa email y contraseña.');
          setSubmitting(false);
          return;
        }
        
        const res = await dbClient.signInClient(authForm.email, authForm.password);
        if (res.success && res.user) {
          localStorage.setItem('recode_client_user', JSON.stringify(res.user));
          setClientUser(res.user);
          await handleSaveQuoteDirectly(res.user);
        } else {
          setAuthError(res.error || 'Email o contraseña incorrectos.');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Ocurrió un error.');
    } finally {
      setSubmitting(false);
    }
  };

  // Sincronizar parámetros de consulta de la URL (type y modules) de forma reactiva sólo si están presentes
  useEffect(() => {
    if (typeParam) {
      if (typeParam === 'custom') {
        setProjectType('web-apps');
      } else if (typeParam === 'paginas-web') {
        setProjectType('institucional');
      } else {
        setProjectType(typeParam);
      }
    }

    if (modulesParam) {
      const mods = modulesParam.split(',').filter(Boolean);
      const mappedMods: string[] = [];

      mods.forEach(mod => {
        if (mod === 'mp_pay' || mod === 'payments' || mod === 'cobros-mercado-pago') {
          mappedMods.push('cobros-mercado-pago');
        } else if (mod === 'stock' || mod === 'stock_sync' || mod === 'control-stock') {
          mappedMods.push('control-stock');
        } else if (mod === 'whatsapp_notif' || mod === 'whatsapp' || mod === 'notificaciones-whatsapp') {
          mappedMods.push('notificaciones-whatsapp');
        } else if (mod === 'pdf_gen' || mod === 'pdf_reports' || mod === 'generacion-pdf') {
          mappedMods.push('generacion-pdf');
        } else if (mod === 'portal_client' || mod === 'client_portal_access' || mod === 'portal-privado-clientes') {
          mappedMods.push('portal-privado-clientes');
        } else if (mod === 'admin_panel' || mod === 'auth' || mod === 'panel-administrativo') {
          mappedMods.push('panel-administrativo');
        } else {
          mappedMods.push(mod);
        }
      });

      setSelectedModules(Array.from(new Set(mappedMods)));
    }
  }, [typeParam, modulesParam]);

  // Recalculate on selection change
  useEffect(() => {
    const group = getQuoteGroup(projectType, selectedModules);

    let minWeeks = group.minWeeks;
    let maxWeeks = group.maxWeeks;
    if (urgency === 'urgencia_alta') {
      minWeeks = Math.max(2, Math.round(minWeeks * 0.75));
      maxWeeks = Math.max(3, Math.round(maxWeeks * 0.75));
    }

    setPricing({
      min: group.minPrice,
      max: group.maxPrice,
      minWeeks,
      maxWeeks,
      complexity: group.complexity
    });
  }, [projectType, selectedModules, urgency]);

  const handleLeadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.name || !leadData.email) {
      alert('Por favor completá nombre e email.');
      return;
    }

    setSubmitting(true);
    try {
      // Create lead in DB client
      const leadResponse = await dbClient.submitLeadForm({
        name: leadData.name,
        company: leadData.company,
        email: leadData.email,
        phone: leadData.phone,
        service_interest: projectType,
        message: `Cotización mensual realizada en la Home. Módulos: ${selectedModules.join(', ')}. Urgencia: ${urgency}. Diseño personalizado: ${customDesign ? 'Sí' : 'No'}.`,
        source: 'Precotizador Home',
        budget: pricing.max > 750000 ? 'alto_presupuesto' : pricing.max > 350000 ? 'medio_presupuesto' : 'bajo_presupuesto',
        urgency: urgency === 'urgencia_alta' ? 'alta' : urgency === 'urgencia_baja' ? 'baja' : 'media',
        team_size: '5-20',
        needed_modules: selectedModules
      });

      if (leadResponse.success && leadResponse.lead) {
        // Save quote in DB client
        await dbClient.submitQuote({
          lead_id: leadResponse.lead.id,
          project_type: projectType,
          selected_modules: selectedModules,
          complexity: (pricing.complexity === 'Baja'
            ? 'Bajo'
            : pricing.complexity === 'Media'
            ? 'Medio'
            : pricing.complexity === 'Alta'
            ? 'Alto'
            : 'Avanzado') as 'Bajo' | 'Medio' | 'Alto' | 'Avanzado',
          estimated_min: pricing.min,
          estimated_max: pricing.max,
          estimated_weeks: pricing.maxWeeks,
          currency: 'ARS',
          notes: `Estimación realizada vía cotizador web en Home (modelo mensual). Código de lead: ${leadResponse.lead.code}`
        });

        setSubmittedQuoteCode(leadResponse.lead.code);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      alert('Error al guardar la cotización.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (val: number) => {
    const amount = currency === 'USD' ? val / EXCHANGE_RATE : val;
    const symbol = currency === 'USD' ? 'USD' : '$';
    return `${symbol} ${amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
  };

  const getWhatsAppUrl = () => {
    const selectedLabels = selectedModules.map(key => {
      const item = optionalModulesFlat.find(m => m.key === key);
      return item ? item.label : key;
    }).join(', ');

    const priceText = `${formatPrice(pricing.min)} a ${formatPrice(pricing.max)} / mes`;
    const text = `Hola ReCode Studio, quiero cotizar una solución con estos módulos: ${selectedLabels || 'Ninguno seleccionado'}. Complejidad estimada: ${pricing.complexity}. Cuota mensual estimada: ${priceText}. Contratación mínima: 12 meses.`;

    return `https://wa.me/5493585142731?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-24">
      
      {/* SECCIÓN 1: HERO PRINCIPAL */}
      <section className="relative min-h-[90vh] flex items-center pt-10">
        
        {/* Glow halo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/10 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Copy block (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-brand-white leading-tight">
              Transformamos procesos lentos en sistemas que <span className="bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet bg-clip-text text-transparent">trabajan para tu empresa</span>
            </h1>

            <p className="text-sm md:text-base text-brand-gray-light max-w-2xl leading-relaxed">
              Diseñamos páginas web, tiendas online, sistemas internos y automatizaciones completamente personalizadas para vender más, ahorrar tiempo y ordenar tu operación real.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/diagnostico"
                className="btn-primary text-xs font-bold text-brand-white px-6 py-3.5 rounded-lg flex items-center gap-2"
              >
                Descubrir mi solución
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/proyectos"
                className="btn-secondary text-xs font-bold text-brand-white px-6 py-3.5 rounded-lg"
              >
                Ver proyectos conceptuales
              </Link>
            </div>

          </div>

          {/* Visual compositions (5 cols) */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative w-full h-[400px] bg-circuit-lines rounded-2xl border border-brand-white/5 bg-brand-gray-dark/20 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
              
              {/* Scan overlay line */}
              <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent animate-scan" />

              {/* Float dashboard card 1 */}
              <div className="glass-card p-4 border border-brand-cyan/20 bg-brand-blue/5 rounded-xl self-start w-[240px] transform hover:scale-105 shadow-lg">
                <div className="flex justify-between items-center border-b border-brand-white/5 pb-2 mb-2">
                  <span className="font-mono text-[8px] text-brand-cyan">STOCK DE PRODUCTOS</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-brand-gray-light">Bruma Camisa L</span>
                  <span className="text-brand-white font-bold">14 un</span>
                </div>
              </div>

              {/* Float notification card 2 */}
              <div className="glass-card p-4 border border-brand-violet/20 bg-brand-gray-dark/40 rounded-xl self-end w-[240px] transform hover:scale-105 shadow-lg">
                <div className="flex justify-between items-center border-b border-brand-white/5 pb-2 mb-2">
                  <span className="font-mono text-[8px] text-brand-violet">AUTOMATIZACIÓN</span>
                  <Database size={10} className="text-brand-cyan" />
                </div>
                <div className="text-[10px] text-brand-gray-light leading-relaxed">
                  WhatsApp enviado a clienta: "Tu pedido ya está en camino a Correo Argentino."
                </div>
              </div>

              {/* Float metrics card 3 */}
              <div className="glass-card p-4 border border-brand-white/10 bg-brand-gray-dark/40 rounded-xl self-start w-[200px] transform hover:scale-105 shadow-lg">
                <div className="flex justify-between items-center border-b border-brand-white/5 pb-2 mb-2">
                  <span className="font-mono text-[8px] text-brand-gray-medium">CUENTAS CORRIENTES</span>
                  <span className="font-mono text-[8px] text-brand-cyan">$ ARS</span>
                </div>
                <div className="text-xs font-mono font-bold text-brand-white">
                  Saldo: $ 120.000
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CINTA DE RUBROS ANIMADA */}
      <RubrosMarquee />

      {/* SECCIÓN NUEVA: ¿QUÉ NECESITÁS? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider block mb-2">Comenzá por tu prioridad</span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-white tracking-tight">
            ¿QUÉ NECESITÁS?
          </h2>
          <p className="text-sm text-brand-gray-light mt-3">
            Seleccioná la opción que mejor se adapte a tu situación actual y descubrí cómo podemos ayudarte a automatizar y escalar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Página Web */}
          <Link
            href="/?type=institucional#cotizador"
            className="group relative glass-card p-6 border border-brand-white/5 bg-brand-gray-dark/20 hover:bg-brand-gray-dark/45 hover:border-brand-cyan/40 hover:scale-[1.02] transition-all duration-300 rounded-2xl flex flex-col justify-between min-h-[220px] overflow-hidden hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/5 rounded-full blur-2xl group-hover:bg-brand-cyan/10 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/15 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-brand-white group-hover:text-brand-cyan transition-colors">
                  Necesito una página web
                </h4>
                <p className="text-[10px] text-brand-gray-light leading-relaxed mt-2">
                  Sitio institucional, Landing Page persuasiva o Portfolio digital optimizado para SEO y conversión.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-cyan mt-4 group-hover:translate-x-1 transition-transform relative z-10">
              <span>Cotizar ahora</span>
              <ArrowRight size={10} />
            </div>
          </Link>

          {/* Card 2: Vender Online */}
          <Link
            href="/?type=ecommerce#cotizador"
            className="group relative glass-card p-6 border border-brand-white/5 bg-brand-gray-dark/20 hover:bg-brand-gray-dark/45 hover:border-brand-blue/40 hover:scale-[1.02] transition-all duration-300 rounded-2xl flex flex-col justify-between min-h-[220px] overflow-hidden hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-brand-blue/15 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                <ShoppingCart size={20} />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-brand-white group-hover:text-brand-blue transition-colors">
                  Quiero vender online
                </h4>
                <p className="text-[10px] text-brand-gray-light leading-relaxed mt-2">
                  Tienda virtual a medida, catálogo interactivo con carrito de compras y pasarela de cobros (Mercado Pago).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-blue mt-4 group-hover:translate-x-1 transition-transform relative z-10">
              <span>Cotizar ahora</span>
              <ArrowRight size={10} />
            </div>
          </Link>

          {/* Card 3: Sistema de Gestión */}
          <Link
            href="/?type=sistemas-gestion#cotizador"
            className="group relative glass-card p-6 border border-brand-white/5 bg-brand-gray-dark/20 hover:bg-brand-gray-dark/45 hover:border-brand-violet/40 hover:scale-[1.02] transition-all duration-300 rounded-2xl flex flex-col justify-between min-h-[220px] overflow-hidden hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-violet/5 rounded-full blur-2xl group-hover:bg-brand-violet/10 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-brand-violet/15 flex items-center justify-center text-brand-violet group-hover:scale-110 transition-transform">
                <Database size={20} />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-brand-white group-hover:text-brand-violet transition-colors">
                  Sistema de gestión
                </h4>
                <p className="text-[10px] text-brand-gray-light leading-relaxed mt-2">
                  Panel administrativo interno, CRM para clientes, control de inventario, stock y cuentas corrientes.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-violet mt-4 group-hover:translate-x-1 transition-transform relative z-10">
              <span>Cotizar ahora</span>
              <ArrowRight size={10} />
            </div>
          </Link>

          {/* Card 4: Automatizar Procesos */}
          <Link
            href="/?type=automatizacion#cotizador"
            className="group relative glass-card p-6 border border-brand-white/5 bg-brand-gray-dark/20 hover:bg-brand-gray-dark/45 hover:border-brand-cyan/40 hover:scale-[1.02] transition-all duration-300 rounded-2xl flex flex-col justify-between min-h-[220px] overflow-hidden hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/5 rounded-full blur-2xl group-hover:bg-brand-cyan/10 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/15 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
                <Cpu size={20} />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-brand-white group-hover:text-brand-cyan transition-colors">
                  Automatizar procesos
                </h4>
                <p className="text-[10px] text-brand-gray-light leading-relaxed mt-2">
                  Conexión de sistemas, bots de WhatsApp, envío automático de correos y alertas en tiempo real.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-cyan mt-4 group-hover:translate-x-1 transition-transform relative z-10">
              <span>Cotizar ahora</span>
              <ArrowRight size={10} />
            </div>
          </Link>

          {/* Card 5: Idea diferente */}
          <Link
            href="/contacto"
            className="group relative glass-card p-6 border border-brand-white/5 bg-brand-gray-dark/20 hover:bg-brand-gray-dark/45 hover:border-brand-white/20 hover:scale-[1.02] transition-all duration-300 rounded-2xl flex flex-col justify-between min-h-[220px] overflow-hidden hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-white/5 rounded-full blur-2xl group-hover:bg-brand-white/10 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-brand-white/10 flex items-center justify-center text-brand-white group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-brand-white group-hover:text-brand-cyan transition-colors">
                  Tengo una idea diferente
                </h4>
                <p className="text-[10px] text-brand-gray-light leading-relaxed mt-2">
                  ¿Tenés un proyecto a medida o una idea única? Contanos tu propuesta para diseñar una solución a tu medida.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-gray-light mt-4 group-hover:translate-x-1 transition-transform relative z-10">
              <span>Contactar</span>
              <ArrowRight size={10} />
            </div>
          </Link>

        </div>
      </section>

      {/* SECCIÓN 2: PROBLEMA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-white">
            Tu empresa no necesita otra herramienta aislada
          </h2>
          <p className="text-sm text-brand-gray-light mt-3">
            Necesita un sistema conectado que acompañe la forma real en la que trabaja tu equipo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problemCards.map((p) => {
            const isSelected = selectedProblem === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProblem(isSelected ? null : p.id)}
                className={`p-5 rounded-xl border text-left flex flex-col justify-between min-h-[140px] transition-all duration-300 ${
                  isSelected
                    ? 'border-brand-cyan bg-brand-blue/15 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                    : 'border-brand-white/5 bg-brand-gray-dark/30 hover:border-brand-white/15'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-brand-white font-mono flex gap-2">
                    <HelpCircle size={14} className="text-brand-cyan shrink-0 mt-0.5" />
                    {p.title}
                  </h4>
                  {isSelected && (
                    <div className="mt-4 p-3 rounded bg-brand-black/40 border border-brand-cyan/20 text-[10px] text-brand-gray-light leading-relaxed animate-fadeIn">
                      <strong className="text-brand-cyan block mb-1">Recomendación ReCode:</strong>
                      {p.rec}
                    </div>
                  )}
                </div>
                
                <span className="text-[9px] font-mono text-brand-cyan/80 mt-4 flex items-center gap-1.5 self-end">
                  {isSelected ? 'Ocultar sugerencia' : 'Hacer clic para ver sugerencia'}
                  <ChevronRight size={10} className={`transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/diagnostico"
            className="btn-primary text-xs font-bold text-brand-white px-8 py-3.5 rounded-lg inline-flex items-center gap-2"
          >
            Analizar mi caso
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* SECCIÓN 5: CONSTRUCTOR INTERACTIVO / COTIZADOR COMPLETO */}
      <section id="cotizador" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
        
        {/* Glow halo */}
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-4 animate-pulse">
            <Calculator size={12} />
            <span>RECODE LABS — COTIZADOR DE PROYECTOS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-white">
            Imaginá tu sistema. Nosotros lo construimos.
          </h2>
          <p className="text-sm text-brand-gray-light mt-3">
            Precotizá tu proyecto digital seleccionando el tipo de desarrollo, diseño y módulos opcionales. El estimador calculará tu abono mensual en tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form & Selection Area (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Base Project selection */}
            <div className="glass-card p-6 border border-brand-white/5">
              <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 mb-4 uppercase tracking-wider">
                1. Tipo de Proyecto Base
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {baseProjects.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setProjectType(p.key)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      projectType === p.key
                        ? 'border-brand-cyan bg-brand-blue/10'
                        : 'border-brand-white/10 bg-brand-gray-dark/50 hover:border-brand-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-brand-white block">{p.label}</span>
                    <span className="text-[10px] text-brand-gray-light leading-relaxed block mt-1">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Design & UX Selection */}
            <div className="glass-card p-6 border border-brand-white/5">
              <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 mb-4 uppercase tracking-wider">
                2. Nivel de Diseño Visual
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCustomDesign(false)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    !customDesign
                      ? 'border-brand-cyan bg-brand-blue/10'
                      : 'border-brand-white/10 bg-brand-gray-dark/50 hover:border-brand-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-white">Diseño Estándar</span>
                    {!customDesign && <Check size={14} className="text-brand-cyan" />}
                  </div>
                  <span className="text-[10px] text-brand-gray-light leading-relaxed block mt-1">
                    Estilo limpio utilizando patrones preestablecidos de alta calidad.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomDesign(true)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    customDesign
                      ? 'border-brand-cyan bg-brand-blue/10'
                      : 'border-brand-white/10 bg-brand-gray-dark/50 hover:border-brand-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-white flex items-center gap-1.5">
                      Diseño Premium 100% Personalizado
                      <Sparkles size={12} className="text-brand-cyan animate-pulse" />
                    </span>
                    {customDesign && <Check size={14} className="text-brand-cyan" />}
                  </div>
                  <span className="text-[10px] text-brand-gray-light leading-relaxed block mt-1">
                    Prototipo interactivo desde cero, experiencia del usuario (UX) única a medida.
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Additional Modules Selection (Categorized) */}
            <div className="glass-card p-6 border border-brand-white/5 space-y-6">
              <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 mb-4 uppercase tracking-wider">
                3. Módulos Adicionales Requeridos
              </h3>
              
              <div className="space-y-6">
                {constructorCategories.map((cat, idx) => (
                  <div key={idx} className="border-t border-brand-white/5 pt-5 first:border-t-0 first:pt-0">
                    <h4 className="font-display font-bold text-xs text-brand-cyan uppercase tracking-wider mb-3">
                      {cat.title}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cat.items.map((m) => {
                        const isSelected = selectedModules.includes(m.key);
                        return (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() => toggleModule(m.key)}
                            className={`p-4 rounded-lg border text-left transition-all flex items-start gap-3 ${
                              isSelected
                                ? 'border-brand-cyan bg-brand-blue/10'
                                : 'border-brand-white/10 bg-brand-gray-dark/50 hover:border-brand-white/20'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border mt-0.5 shrink-0 flex items-center justify-center ${
                              isSelected ? 'border-brand-cyan bg-brand-cyan text-brand-black' : 'border-brand-white/20'
                            }`}>
                              {isSelected && <Check size={10} strokeWidth={4} />}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-brand-white block">{m.label}</span>
                              <span className="text-[10px] text-brand-gray-light leading-relaxed block mt-0.5">{m.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Plazo y Urgencia */}
            <div className="glass-card p-6 border border-brand-white/5">
              <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 mb-4 uppercase tracking-wider">
                4. Plazo y Urgencia
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { key: 'urgencia_alta', label: 'Urgente (< 1 mes)', desc: 'Prioridad alta de desarrollo.' },
                  { key: 'urgencia_media', label: 'Estándar (1-3 meses)', desc: 'Tiempos planificados normales.' },
                  { key: 'urgencia_baja', label: 'Flexible (> 3 meses)', desc: 'Desarrollo en fases relajadas.' }
                ].map((urg) => (
                  <button
                    key={urg.key}
                    type="button"
                    onClick={() => setUrgency(urg.key)}
                    className={`p-3 rounded-lg border transition-all ${
                      urgency === urg.key
                        ? 'border-brand-cyan bg-brand-blue/10'
                        : 'border-brand-white/10 bg-brand-gray-dark/50 hover:border-brand-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-brand-white block">{urg.label}</span>
                    <span className="text-[9px] text-brand-gray-medium leading-relaxed block mt-1">{urg.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Pricing Dashboard Side Card (1 col) */}
          <div className="space-y-6">
            <div className="glass-card p-6 border border-brand-cyan/20 bg-brand-blue/5 shadow-[0_0_20px_rgba(23,75,255,0.05)] sticky top-28">
              
              {/* Currency Toggle */}
              <div className="flex items-center justify-between border-b border-brand-white/5 pb-4 mb-4">
                <span className="text-xs font-mono text-brand-gray-medium uppercase tracking-wider">Moneda</span>
                <div className="inline-flex rounded-lg bg-brand-gray-dark p-1 border border-brand-white/5">
                  <button
                    onClick={() => setCurrency('ARS')}
                    className={`px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all ${
                      currency === 'ARS' ? 'bg-brand-cyan text-brand-black' : 'text-brand-gray-light hover:text-brand-white'
                    }`}
                  >
                    ARS ($)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all ${
                      currency === 'USD' ? 'bg-brand-cyan text-brand-black' : 'text-brand-gray-light hover:text-brand-white'
                    }`}
                  >
                    USD (US$)
                  </button>
                </div>
              </div>

              {/* Calculations Display */}
              <div className="space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-widest block font-bold">Módulos</span>
                    <span className="text-xl font-display font-extrabold text-brand-white mt-1 block">
                      {selectedModules.length}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-widest block font-bold">Complejidad</span>
                    <span className={`text-sm font-bold mt-1.5 block uppercase ${getComplexityColor(pricing.complexity)}`}>
                      {pricing.complexity}
                    </span>
                  </div>
                </div>

                <div className="border-t border-brand-white/5 pt-3">
                  <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-widest block">Tardanza estimada de implementación</span>
                  <span className="text-sm font-bold text-brand-white mt-1 flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand-cyan" />
                    {pricing.minWeeks} a {pricing.maxWeeks} semanas
                  </span>
                </div>

                <div className="border-t border-brand-white/5 pt-3">
                  <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-widest block">CUOTA MENSUAL ESTIMADA</span>
                  <div className="flex items-baseline gap-1 mt-1 text-brand-white">
                    <span className="text-2xl font-display font-extrabold">{formatPrice(pricing.min)}</span>
                    <span className="text-xs text-brand-gray-medium font-mono">a</span>
                    <span className="text-2xl font-display font-extrabold text-brand-cyan">{formatPrice(pricing.max)}</span>
                    <span className="text-xs text-brand-gray-medium font-mono ml-1">/ mes</span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-cyan block mt-1.5 font-bold">Contratación mínima: 12 meses</span>
                  <span className="text-[9px] text-brand-gray-light leading-relaxed block mt-1.5">
                    Incluye implementación, soporte, mantenimiento, actualizaciones mensuales y acompañamiento técnico.
                  </span>
                </div>

                {/* Modalidad ReCode */}
                <div className="border-t border-brand-white/5 pt-4 space-y-2.5">
                  <div>
                    <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block font-bold">Modalidad ReCode</span>
                    <p className="text-[9px] text-brand-gray-light leading-relaxed mt-1">
                      Desarrollamos, implementamos y acompañamos la evolución mensual de tu sistema.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[
                      'Soporte incluido',
                      'Actualizaciones mensuales',
                      'Mantenimiento técnico',
                      'Escalable',
                      'Sin depender de Excel'
                    ].map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="text-[8px] font-mono text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tu selección incluye */}
                <div className="border-t border-brand-white/5 pt-4">
                  <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block font-bold">Tu abono mensual incluye:</span>
                  <ul className="mt-2.5 flex flex-col gap-1.5 font-mono text-[9px] text-brand-gray-light">
                    {[
                      'Implementación inicial',
                      'Diseño UX/UI adaptado al negocio',
                      'Desarrollo frontend y backend',
                      'Panel administrativo y Base de datos',
                      'Integraciones seleccionadas',
                      'Automatizaciones configuradas',
                      'Soporte técnico prioritario',
                      'Monitoreo 24/7 para incidencias críticas',
                      'Actualizaciones mensuales',
                      'Mejoras evolutivas menores incluidas',
                      'Capacitación inicial de uso'
                    ].map((inc, iIdx) => (
                      <li key={iIdx} className="flex items-center gap-2">
                        <Check size={10} className="text-brand-cyan shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Desglose activo */}
                <div className="border-t border-brand-white/5 pt-4">
                  <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-widest block mb-2">Desglose activo</span>
                  <div className="max-h-[140px] overflow-y-auto pr-1 space-y-2.5 font-mono text-[9px] text-brand-gray-light">
                    {selectedModules.length === 0 ? (
                      <p className="text-brand-gray-medium">Ningún módulo seleccionado.</p>
                    ) : (() => {
                      const categoriesMap = {
                        'Web Pública': ['paginas-institucionales', 'formularios-inteligentes', 'calculadoras-simuladores', 'portfolio-conceptual'],
                        'E-commerce': ['catalogo-productos', 'carrito-checkout', 'cobros-mercado-pago', 'cotizador-envios'],
                        'Gestión Interna': ['panel-administrativo', 'gestion-clientes', 'control-stock', 'cuentas-corrientes', 'portal-privado-clientes'],
                        'Automatización': ['notificaciones-whatsapp', 'emails-transaccionales', 'generacion-pdf']
                      };
                      return Object.entries(categoriesMap).map(([catName, itemKeys]) => {
                        const selectedInCat = selectedModules.filter(k => itemKeys.includes(k));
                        if (selectedInCat.length === 0) return null;
                        return (
                          <div key={catName} className="space-y-1">
                            <span className="text-[8px] text-brand-cyan uppercase tracking-wider block font-bold">{catName}</span>
                            {selectedInCat.map(k => {
                              const label = optionalModulesFlat.find(m => m.key === k)?.label || k;
                              return (
                                <div key={k} className="flex items-center gap-1.5 pl-1.5">
                                  <div className="w-1 h-1 rounded-full bg-brand-cyan" />
                                  <span>{label}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {(selectedModules.length > 0 || projectType !== 'institucional' || !customDesign || urgency !== 'urgencia_media') && (
                    <button
                      onClick={clearQuote}
                      className="text-[9px] font-mono text-red-400 hover:text-red-300 hover:underline mt-4 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw size={10} />
                      Limpiar selección
                    </button>
                  )}
                </div>

                {/* Submit Confirmation or Lead Capture Form */}
                {!submitted ? (
                  clientUser ? (
                    <div className="border-t border-brand-white/5 pt-4 space-y-3">
                      <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block mb-1 font-bold">Tu Cuenta Activa</span>
                      <p className="text-[11px] text-brand-gray-light leading-relaxed">
                        Estás conectado como <strong className="text-brand-white font-bold">{clientUser.name}</strong> ({clientUser.companyName}).
                      </p>
                      <button
                        onClick={handleSaveQuoteDirectlyClick}
                        disabled={submitting}
                        className="w-full btn-primary text-xs font-bold text-brand-white py-3 rounded-lg flex items-center justify-center gap-2 mt-1 cursor-pointer font-sans"
                      >
                        {submitting ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            Cotizar mi proyecto
                            <Send size={12} />
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="border-t border-brand-white/5 pt-4 space-y-3">
                      <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-widest block mb-1 font-bold">Guardar Estimación</span>
                      <p className="text-[10px] text-brand-gray-light leading-relaxed mb-2">
                        Creá tu cuenta para conservar esta cotización, recibir soporte y acceder a tu portal de autogestión.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthForm({
                            name: '',
                            email: '',
                            whatsapp: '',
                            companyName: '',
                            password: ''
                          });
                          setAuthTab('register');
                          setShowAuthModal(true);
                        }}
                        className="w-full btn-primary text-xs font-bold text-brand-white py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer font-sans"
                      >
                        Cotizar mi proyecto
                        <Send size={12} />
                      </button>
                    </div>
                  )
                ) : (
                  <div className="border-t border-brand-cyan/20 bg-brand-cyan/5 p-5 rounded-xl text-center space-y-4 border shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                    <div className="w-10 h-10 rounded-full bg-brand-cyan/20 text-brand-cyan flex items-center justify-center mx-auto shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs text-brand-white">¡Tu cotización fue guardada correctamente!</h4>
                      <p className="text-[10px] text-brand-cyan font-mono mt-1 uppercase tracking-wider font-bold font-mono">
                        Código: {submittedQuoteCode}
                      </p>
                    </div>

                    <div className="bg-brand-black/40 border border-brand-white/5 p-3 rounded-lg space-y-2 text-left">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-brand-gray-medium">Abono Mensual:</span>
                        <span className="text-brand-white font-bold">{formatPrice(pricing.min)} a {formatPrice(pricing.max)}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-brand-gray-medium">Contratación Mínima:</span>
                        <span className="text-brand-white font-bold">12 meses</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-brand-gray-medium">Estado:</span>
                        <span className="text-brand-cyan font-bold font-mono">Pendiente de revisión</span>
                      </div>
                      <div className="text-[9px] text-brand-gray-light leading-relaxed border-t border-brand-white/5 pt-2 mt-2 font-sans">
                        Incluye soporte prioritario, mantenimiento técnico mensual, actualizaciones continuas y mejoras evolutivas menores.
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Link
                        href="/portal-clientes"
                        className="w-full btn-primary text-xs font-bold text-brand-white py-3 rounded-lg flex items-center justify-center gap-1.5 font-sans animate-pulse"
                      >
                        Ver mi portal
                        <ArrowRight size={12} />
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/portal-clientes?tab=docs"
                          className="text-[10px] text-center font-mono font-bold text-brand-gray-light hover:text-brand-cyan border border-brand-white/10 rounded-lg py-2.5 bg-brand-gray-dark/50"
                        >
                          Subir archivos
                        </Link>
                        <Link
                          href="/portal-clientes?tab=meetings"
                          className="text-[10px] text-center font-mono font-bold text-brand-gray-light hover:text-brand-cyan border border-brand-white/10 rounded-lg py-2.5 bg-brand-gray-dark/50"
                        >
                          Solicitar reunión
                        </Link>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        clearQuote();
                      }}
                      className="text-[9px] font-mono text-brand-gray-medium hover:text-brand-cyan hover:underline block mx-auto mt-2 font-mono"
                    >
                      Crear otra cotización
                    </button>
                  </div>
                )}
              </div>

              <div className="text-[9px] text-brand-gray-medium leading-relaxed mt-5 border-t border-brand-white/5 pt-4 text-center">
                * La estimación mensual no constituye un contrato de servicios definitivo. El abono final dependerá de la especificación funcional acordada.
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN 6: POR QUÉ RECODE STUDIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-white border-l-2 border-brand-cyan pl-3">
            Cuando una plantilla no alcanza, necesitás una solución propia
          </h2>
          <p className="text-xs text-brand-gray-light leading-relaxed">
            Las tiendas pre-armadas o plantillas rápidas sirven para iniciar, pero tienen límites insalvables cuando tu negocio tiene procesos propios, reglas de facturación únicas, cuentas corrientes de clientes mayoristas o necesitas unificar trastiendas.
          </p>
          
          <div className="text-sm font-bold text-brand-cyan italic font-display">
            “No obligamos a tu empresa a entrar en una plantilla. Creamos una herramienta alrededor de tu forma de trabajar.”
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Check size={12} className="text-brand-cyan shrink-0 mt-0.5" />
              <span className="text-brand-gray-light">Diseño 100% exclusivo</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check size={12} className="text-brand-cyan shrink-0 mt-0.5" />
              <span className="text-brand-gray-light">Cuentas Corrientes integradas</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check size={12} className="text-brand-cyan shrink-0 mt-0.5" />
              <span className="text-brand-cyan shrink-0 mt-0.5" />
              <span className="text-brand-gray-light">Notificaciones automáticas</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check size={12} className="text-brand-cyan shrink-0 mt-0.5" />
              <span className="text-brand-gray-light">Desarrollo escalable en fases</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border border-brand-white/5 space-y-4">
          <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest block">Comparativa rápida</span>
          <div className="space-y-3 text-xs leading-relaxed text-brand-gray-light">
            <div className="border-b border-brand-white/5 pb-2 flex justify-between">
              <span>Personalización Visual</span>
              <span className="text-brand-white font-bold">Total (A medida)</span>
            </div>
            <div className="border-b border-brand-white/5 pb-2 flex justify-between">
              <span>Base de Datos</span>
              <span className="text-brand-white font-bold">Propiedad del Cliente</span>
            </div>
            <div className="border-b border-brand-white/5 pb-2 flex justify-between">
              <span>Soporte Técnico</span>
              <span className="text-brand-white font-bold">Canal directo por WhatsApp</span>
            </div>
            <div className="flex justify-between">
              <span>Evolución Futura</span>
              <span className="text-brand-cyan font-bold">Ilimitada en módulos</span>
            </div>
          </div>
          <div className="pt-4 text-center">
            <Link href="/comparador" className="text-xs font-mono font-bold text-brand-cyan hover:underline inline-flex items-center gap-1">
              Ver cuadro comparativo detallado
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN 8: ECOMMERCE CON GESTIÓN INTERNA (BRUMA MODA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="glass-card p-6 md:p-10 border border-brand-cyan/25 bg-brand-blue/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
          
          <div className="absolute top-4 right-4 text-[8px] font-mono font-bold text-brand-cyan bg-brand-cyan/15 px-2.5 py-1 rounded border border-brand-cyan/30">
            ReCode Lab — Proyecto Conceptual
          </div>

          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider block">Prototipo Interactivo</span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-white">
              Bruma Moda: Tienda online + gestión interna mayorista
            </h2>
            <p className="text-xs text-brand-gray-light leading-relaxed">
              Bruma Moda representa una tienda online personalizada para negocios de indumentaria, accesorios o cosmética que necesitan vender online minorista y mayorista, coordinando cuentas corrientes y stock físico desde una sola trastienda sin planillas Excel.
            </p>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-brand-gray-light pt-2">
              <div className="flex items-center gap-2"><Check size={10} className="text-brand-cyan" /> Tienda Web minorista</div>
              <div className="flex items-center gap-2"><Check size={10} className="text-brand-cyan" /> Panel Administrador</div>
              <div className="flex items-center gap-2"><Check size={10} className="text-brand-cyan" /> Mapeo de Cuentas Corrientes</div>
              <div className="flex items-center gap-2"><Check size={10} className="text-brand-cyan" /> Alertas WhatsApp</div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <Link
              href="/proyectos/bruma-moda"
              className="w-full text-center text-xs font-mono font-bold text-brand-white border border-brand-white/10 rounded-lg py-3 hover:border-brand-cyan bg-brand-gray-dark/50 transition-colors"
            >
              Ver ficha técnica de Bruma Moda
            </Link>
            <Link
              href="/?type=ecommerce-gestion-interna&modules=stock_sync,whatsapp#cotizador"
              className="w-full btn-primary text-xs font-bold text-brand-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              Cotizar ecommerce personalizado
              <ArrowRight size={12} />
            </Link>
          </div>

        </div>
      </section>

      {/* SECCIÓN 9: PORFOLIO CONCEPTUAL TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-white">
              ReCode Labs: Proyectos Conceptuales
            </h2>
            <p className="text-sm text-brand-gray-light mt-1">
              Desarrollos conceptuales ficticios para ilustrar nuestras capacidades por sector comercial.
            </p>
          </div>
          <Link
            href="/proyectos"
            className="text-xs font-mono font-bold text-brand-cyan hover:underline flex items-center gap-1"
          >
            Ver todos los laboratorios
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { slug: 'bruma-moda', name: 'Bruma Moda', type: 'Ecommerce + Gestión', desc: 'Indumentaria, stock, variantes, envíos y saldos.' },
            { slug: 'contanova-estudio', name: 'ContaNova Estudio', type: 'Contabilidad + Portal Clientes', desc: 'Estudio contable, carga fiscal y vencimientos automáticos.' },
            { slug: 'agrolink-repuestos', name: 'AgroLink Repuestos', type: 'Web + CRM + Repuestos', desc: 'Agro, cotizador de repuestos y calculadoras de desgaste.' }
          ].map((p, idx) => (
            <div key={idx} className="glass-card p-5 border border-brand-white/5 flex flex-col justify-between h-[240px] relative">
              <div className="absolute top-4 right-4 text-[7px] font-mono text-brand-cyan bg-brand-cyan/15 px-1.5 py-0.5 rounded border border-brand-cyan/20">
                Lab Concepto
              </div>
              
              <div className="mt-2">
                <h4 className="font-display font-bold text-base text-brand-white">{p.name}</h4>
                <span className="text-[9px] font-mono text-brand-cyan block mt-0.5">{p.type}</span>
                <p className="text-[11px] text-brand-gray-light leading-relaxed mt-3">{p.desc}</p>
              </div>

              <Link
                href={`/proyectos/${p.slug}`}
                className="text-xs font-bold text-brand-white hover:text-brand-cyan flex items-center gap-1 mt-6 transition-colors"
              >
                Ficha Técnica
                <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de Autenticación Premium */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-brand-gray-dark/95 border border-brand-cyan/20 p-8 rounded-2xl shadow-2xl space-y-6">
            
            {/* Close button */}
            <button
              onClick={() => {
                setShowAuthModal(false);
                setAuthError('');
              }}
              className="absolute top-4 right-4 text-brand-gray-medium hover:text-brand-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-brand-cyan/15 text-brand-cyan flex items-center justify-center mx-auto shadow-[0_0_10px_rgba(34,211,238,0.25)]">
                <Terminal size={18} />
              </div>
              <h3 className="font-display font-extrabold text-lg text-brand-white">
                {authTab === 'register' ? 'Creá tu cuenta para guardar tu cotización' : 'Ingresá a tu cuenta'}
              </h3>
              <p className="text-[10px] text-brand-gray-light leading-relaxed max-w-xs mx-auto font-sans font-normal text-brand-gray-light">
                {authTab === 'register' 
                  ? 'Guardamos tu cotización en tu espacio privado para que puedas seguir el avance, revisar documentación y comunicarte con nuestro equipo.'
                  : 'Ingresa tus credenciales para asociar y guardar tu estimación actual.'
                }
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 text-center leading-relaxed font-mono">
                {authError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authTab === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-brand-gray-medium uppercase tracking-wider block">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white font-sans font-normal"
                      placeholder="Ej: Sofia Martínez"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-brand-gray-medium uppercase tracking-wider block">Nombre de tu Empresa *</label>
                    <input
                      type="text"
                      required
                      value={authForm.companyName}
                      onChange={(e) => setAuthForm({ ...authForm, companyName: e.target.value })}
                      className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white font-sans font-normal"
                      placeholder="Ej: Bruma Moda"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-brand-gray-medium uppercase tracking-wider block">WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={authForm.whatsapp}
                      onChange={(e) => setAuthForm({ ...authForm, whatsapp: e.target.value })}
                      className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white font-mono"
                      placeholder="Ej: +54 9 358 514-2731"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-brand-gray-medium uppercase tracking-wider block">Email Corporativo *</label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white font-sans font-normal"
                  placeholder="Ej: sofia@brumamoda.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-brand-gray-medium uppercase tracking-wider block">Contraseña *</label>
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white font-sans font-normal"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary text-xs font-bold text-brand-white py-3 rounded-lg flex items-center justify-center gap-2 mt-4 cursor-pointer font-sans"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    {authTab === 'register' ? 'Registrarse y Guardar' : 'Ingresar y Guardar'}
                    <ArrowRight size={12} />
                  </>
                )}
              </button>
            </form>

            {/* Alternator */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthTab(authTab === 'register' ? 'login' : 'register');
                  setAuthError('');
                }}
                className="text-[10px] text-brand-gray-light hover:text-brand-cyan font-mono transition-colors"
              >
                {authTab === 'register' 
                  ? '¿Ya tenés cuenta? Iniciar Sesión'
                  : '¿No tenés cuenta? Registrate aquí'
                }
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-brand-gray-light font-mono text-xs">
        Cargando ReCode Studio...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
