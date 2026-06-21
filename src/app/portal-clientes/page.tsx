'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText, Calendar, Clock, DollarSign, Download, Send,
  User, CheckCircle2, ChevronRight, MessageSquare, Briefcase, Lock, Key, ShieldCheck,
  UploadCloud, AlertCircle, ExternalLink, PlusCircle, LogOut, RefreshCw, Trash2, Copy, FileCode, Check
} from 'lucide-react';
import { dbClient, User as DBUser, Quote, ClientProject, ProjectPhase, Message, Document as DBDocument, Payment, Meeting } from '@/lib/db';

function PortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as any;

  // Session State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientUser, setClientUser] = useState<DBUser | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Portal Data State
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);
  const [activeProject, setActiveProject] = useState<ClientProject | null>(null);
  const [documents, setDocuments] = useState<DBDocument[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  
  // UI Tabs State: project, quote, docs, payments, chat, meetings
  const [activeTab, setActiveTab] = useState<'project' | 'quote' | 'docs' | 'payments' | 'chat' | 'meetings'>('project');
  
  // Inputs and Interactions
  const [newMessage, setNewMessage] = useState('');
  const [chatCategory, setChatCategory] = useState<Message['category']>('general');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Auto-debit Membership States
  const [autoDebitEnabled, setAutoDebitEnabled] = useState(true);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState('SOFIA MARTINEZ');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [showCardModal, setShowCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');

  // Load user session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recode_client_user');
      if (stored) {
        try {
          const user = JSON.parse(stored) as DBUser;
          setClientUser(user);
          setIsLoggedIn(true);
        } catch (e) {
          console.error('Error loading client user session', e);
        }
      }
    }
  }, []);

  // Fetch client data once logged in
  useEffect(() => {
    if (!isLoggedIn || !clientUser) return;
    loadPortalData();
  }, [isLoggedIn, clientUser]);

  // Handle initial tab redirection from query param
  useEffect(() => {
    if (initialTab && ['project', 'quote', 'docs', 'payments', 'chat', 'meetings'].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const loadPortalData = async () => {
    if (!clientUser) return;
    setLoading(true);
    try {
      const quotesData = await dbClient.getQuotesByUserId(clientUser.id);
      const projectsData = await dbClient.getClientProjects(clientUser.id);
      const docsData = await dbClient.getDocuments(clientUser.id);
      const paymentsData = await dbClient.getPayments(clientUser.id);
      const messagesData = await dbClient.getMessages(clientUser.id);
      const allMeetings = await dbClient.getMeetings();

      setQuotes(quotesData);
      if (quotesData.length > 0) {
        // Default to showing the latest quote
        setActiveQuote(quotesData[0]);
      }
      
      if (projectsData.length > 0) {
        setActiveProject(projectsData[0]);
      } else {
        setActiveProject(null);
      }

      setDocuments(docsData);
      setPayments(paymentsData);
      setChatMessages(messagesData);
      setMeetings(allMeetings);
    } catch (e) {
      console.error('Error loading portal datasets', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const res = await dbClient.signInClient(loginEmail, loginPassword);
      if (res.success && res.user) {
        localStorage.setItem('recode_client_user', JSON.stringify(res.user));
        setClientUser(res.user);
        setIsLoggedIn(true);
      } else {
        setLoginError(res.error || 'Email o clave incorrectos.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('recode_client_user');
    setClientUser(null);
    setIsLoggedIn(false);
    setQuotes([]);
    setActiveQuote(null);
    setActiveProject(null);
    setDocuments([]);
    setPayments([]);
    setChatMessages([]);
    setActiveTab('project');
  };

  // Chat actions
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !clientUser) return;

    try {
      const sentMsg = await dbClient.sendMessage({
        userId: clientUser.id,
        quoteId: activeQuote?.id,
        projectId: activeProject?.id,
        category: chatCategory,
        message: newMessage,
        sender: 'client',
        status: 'open'
      });

      setChatMessages(prev => [...prev, sentMsg]);
      setNewMessage('');

      // Simulate a premium automatic reply based on the message category
      setTimeout(async () => {
        let replyText = 'Entendido. Tomamos nota de tu mensaje. Un asesor técnico de ReCode lo revisará a la brevedad.';
        if (chatCategory === 'cambio_alcance') {
          replyText = 'Recibimos tu solicitud de ajuste sobre el alcance. Analizaremos si requiere recalcular los abonos y te responderemos por este medio o en la próxima reunión.';
        } else if (chatCategory === 'pagos') {
          replyText = 'Tu consulta sobre facturación ha sido registrada. Nuestro equipo de administración verificará tu cuenta corriente y actualizará la pestaña de Pagos.';
        } else if (chatCategory === 'documentos') {
          replyText = 'Gracias por cargar la documentación. Un ingeniero de ReCode revisará los archivos para verificar que tengan el formato correcto.';
        }

        const replyMsg = await dbClient.sendMessage({
          userId: clientUser.id,
          quoteId: activeQuote?.id,
          projectId: activeProject?.id,
          category: chatCategory,
          message: replyText,
          sender: 'recode',
          status: 'replied'
        });

        setChatMessages(prev => [...prev, replyMsg]);
      }, 1500);

    } catch (err) {
      console.error(err);
    }
  };

  // Documents Drag & Drop simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!clientUser) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await simulateUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!clientUser || !e.target.files || e.target.files.length === 0) return;
    await simulateUpload(e.target.files[0]);
  };

  const simulateUpload = async (file: File) => {
    if (!clientUser) return;
    setUploadProgress(10);
    
    // Simulate upload interval
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(async () => {
      clearInterval(interval);
      setUploadProgress(100);
      
      try {
        const sizeFormatted = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(file.size / 1024).toFixed(0)} KB`;

        const newDoc = await dbClient.uploadDocument({
          userId: clientUser.id,
          quoteId: activeQuote?.id,
          projectId: activeProject?.id,
          fileName: file.name,
          fileType: file.name.split('.').pop() || 'dat',
          fileSize: sizeFormatted
        });

        setDocuments(prev => [newDoc, ...prev]);
        
        // Also send automatic notification in Chat
        await dbClient.sendMessage({
          userId: clientUser.id,
          quoteId: activeQuote?.id,
          projectId: activeProject?.id,
          category: 'documentos',
          message: `Sistema: He subido un nuevo documento de soporte: "${file.name}" (${sizeFormatted}).`,
          sender: 'client',
          status: 'open'
        });

      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setUploadProgress(null), 500);
      }
    }, 1000);
  };

  // Payments uploaded receipt simulation
  const handleUploadReceipt = async (paymentId: string) => {
    try {
      await dbClient.uploadPaymentReceipt(paymentId);
      // Reload
      const paymentsData = await dbClient.getPayments(clientUser?.id);
      setPayments(paymentsData);
      alert('¡Comprobante subido con éxito! Se revisará por la administración.');
    } catch (err) {
      console.error(err);
    }
  };

  // Duplicate quote simulation
  const handleDuplicateQuote = async (quoteToDup: Quote) => {
    if (!clientUser) return;
    setLoading(true);
    try {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const quoteCode = `RC-QT-2026-${randNum}`;

      const duplicatedQuote: Quote = {
        id: `quote-${Date.now()}`,
        userId: clientUser.id,
        quoteCode: quoteCode,
        companyName: clientUser.companyName,
        project_type: quoteToDup.project_type,
        selected_modules: [...quoteToDup.selected_modules],
        complexity: quoteToDup.complexity,
        estimated_min: quoteToDup.estimated_min,
        estimated_max: quoteToDup.estimated_max,
        estimated_weeks: quoteToDup.estimated_weeks,
        currency: quoteToDup.currency,
        notes: `Duplicada a partir del código ${quoteToDup.quoteCode}.`,
        status: 'pendiente',
        created_at: new Date().toISOString()
      };

      await dbClient.submitQuote(duplicatedQuote);
      
      // Reload
      const quotesData = await dbClient.getQuotesByUserId(clientUser.id);
      setQuotes(quotesData);
      setActiveQuote(duplicatedQuote);
      alert(`Cotización duplicada con éxito bajo el código ${quoteCode}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Copy code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // PDF download simulation helper
  const simulatePdfDownload = (quoteCode: string) => {
    alert(`Generando y descargando PDF estructurado para la cotización ${quoteCode}.`);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim() || !newCardHolder.trim() || !newCardExpiry.trim()) {
      alert('Por favor completa todos los campos.');
      return;
    }
    const cleanNum = newCardNumber.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4);
    const masked = `•••• •••• •••• ${last4}`;
    
    setCardNumber(masked);
    setCardHolder(newCardHolder.toUpperCase());
    setCardExpiry(newCardExpiry);
    setShowCardModal(false);
    
    setNewCardNumber('');
    setNewCardHolder('');
    setNewCardExpiry('');
    setNewCardCvv('');
    alert('Tarjeta de débito automático actualizada con éxito.');
  };

  const handleToggleAutoDebit = () => {
    if (autoDebitEnabled) {
      if (activeProject) {
        const start = new Date(activeProject.startDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 365) {
          alert('No se puede cancelar durante el primer año, por políticas de contrato. Por dudas y consultas contactar a la administración de ReCode.');
          return;
        }
      }
      setAutoDebitEnabled(false);
    } else {
      setAutoDebitEnabled(true);
    }
  };

  const getProjectTypeLabel = (type: string) => {
    const labels: any = {
      'institucional': 'Web Institucional',
      'ecommerce': 'Tienda Online E-commerce',
      'ecommerce-gestion-interna': 'Ecommerce + Gestión Interna',
      'sistemas-gestion': 'Sistema de Gestión a Medida',
      'sistemas-contables': 'Sistema Contable',
      'automatizacion': 'Automatización de Procesos',
      'portales-clientes': 'Portal de Clientes Privado',
      'crm': 'CRM Comercial',
      'dashboards': 'Dashboard de Métricas',
      'sistemas-turnos': 'Sistema de Citas/Turnos',
      'integraciones': 'Integración Especial de APIs',
      'web-apps': 'Web App Compleja (SaaS)'
    };
    return labels[type] || type;
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 relative z-10">
        <div className="glass-card p-8 border border-brand-cyan/20 bg-brand-blue/5 shadow-2xl relative">
          
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-cyan/15 text-brand-cyan flex items-center justify-center mx-auto mb-3 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              <User size={20} className="text-brand-cyan" />
            </div>
            <h2 className="font-display font-extrabold text-xl text-brand-white">
              Portal de Clientes ReCode
            </h2>
            <p className="text-[10px] text-brand-gray-light font-mono mt-1 uppercase tracking-wider">
              Autogestión de Proyectos — ReCode Studio
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 text-center leading-relaxed">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 mt-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-brand-gray-light uppercase tracking-wider block">Email Corporativo</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white pl-8 font-sans"
                  placeholder="sofia@brumamoda.com"
                />
                <User size={12} className="absolute left-2.5 top-3 text-brand-gray-medium" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-brand-gray-light uppercase tracking-wider block">Clave de acceso</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white pl-8 font-sans"
                  placeholder="••••••••"
                />
                <Key size={12} className="absolute left-2.5 top-3 text-brand-gray-medium" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-xs font-bold text-brand-white py-3 rounded-lg flex items-center justify-center gap-2 mt-4 cursor-pointer font-sans"
            >
              {loading ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  Conectando...
                </>
              ) : (
                'Ingresar al portal'
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-brand-white/5 pt-4 text-center">
            <p className="text-[9px] text-brand-gray-medium leading-relaxed font-mono">
              Demo Client Account:<br />
              Email: <span className="text-brand-cyan">sofia@brumamoda.com</span><br />
              Password: <span className="text-brand-cyan">bruma2026</span>
            </p>
          </div>

        </div>
      </div>
    );
  }

  // Loaded portal UI
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-white/5 pb-6 mb-8">
        <div className="flex items-center gap-3">
          {/* Avatar Initials */}
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-blue to-brand-violet text-brand-white flex items-center justify-center font-display font-extrabold text-base border border-brand-cyan/20 shadow-[0_0_15px_rgba(23,75,255,0.3)]">
            {clientUser?.companyName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-brand-cyan bg-brand-cyan/15 px-2 py-0.5 rounded-full border border-brand-cyan/20 font-bold uppercase">
                Empresa: {clientUser?.companyName}
              </span>
              <span className="text-[10px] font-mono text-brand-gray-medium">
                Cliente: {clientUser?.name}
              </span>
            </div>
            <h1 className="text-2xl font-display font-extrabold text-brand-white mt-1">
              {activeProject ? `Proyecto: ${activeProject.name}` : `Ficha de Autogestión`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            href="/#cotizador"
            className="text-xs font-mono font-bold text-brand-cyan border border-brand-cyan/20 rounded-lg px-3 py-1.5 bg-brand-cyan/5 hover:bg-brand-cyan/10 transition-all flex items-center gap-1"
          >
            <PlusCircle size={12} />
            Nueva Cotización
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-mono font-bold text-brand-gray-light hover:text-red-400 border border-brand-white/10 rounded-lg px-3 py-1.5 bg-brand-gray-dark/50 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={12} />
            Salir del Portal
          </button>
        </div>
      </div>

      {/* Overview Cards Row (Aggregated) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 border border-brand-white/5 space-y-1">
          <span className="text-[8px] font-mono text-brand-gray-medium uppercase tracking-wider block">Estado del Proyecto</span>
          <span className="text-xs font-bold text-brand-white block truncate">
            {activeProject ? 'Aprobado y en Desarrollo' : 'Cotización en Revisión'}
          </span>
        </div>
        <div className="glass-card p-4 border border-brand-white/5 space-y-1">
          <span className="text-[8px] font-mono text-brand-gray-medium uppercase tracking-wider block">Avance General</span>
          <span className="text-xs font-bold text-brand-cyan block">
            {activeProject ? `${activeProject.progress}% Completado` : '15% (Revisión de Alcance)'}
          </span>
        </div>
        <div className="glass-card p-4 border border-brand-white/5 space-y-1">
          <span className="text-[8px] font-mono text-brand-gray-medium uppercase tracking-wider block">Próxima Acción Requerida</span>
          <span className="text-xs font-bold text-brand-white block truncate">
            {activeProject 
              ? activeProject.phases.find(p => p.status === 'en_proceso')?.title || 'Ninguna'
              : 'Esperar propuesta final'
            }
          </span>
        </div>
        <div className="glass-card p-4 border border-brand-white/5 space-y-1">
          <span className="text-[8px] font-mono text-brand-gray-medium uppercase tracking-wider block">Responsable Asignado PM</span>
          <span className="text-xs font-bold text-brand-cyan block">
            {activeProject ? activeProject.assignedPM : 'Tomas Recode'}
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-brand-white/10 mb-6 overflow-x-auto gap-2">
        {[
          { key: 'project', label: 'Estado del Proyecto', icon: Briefcase },
          { key: 'quote', label: 'Cotización Guardada', icon: FileCode },
          { key: 'docs', label: 'Documentación', icon: FileText },
          { key: 'payments', label: 'Pagos y Facturación', icon: DollarSign },
          { key: 'chat', label: 'Mensajes y Soporte', icon: MessageSquare },
          { key: 'meetings', label: 'Reuniones', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-3 text-[10px] font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'border-brand-cyan text-brand-white bg-brand-cyan/5' 
                  : 'border-transparent text-brand-gray-medium hover:text-brand-white hover:bg-brand-white/5'
              }`}
            >
              <Icon size={12} className={isActive ? 'text-brand-cyan' : 'text-brand-gray-medium'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="text-center py-20 font-mono text-xs text-brand-gray-medium flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin" size={14} />
            Actualizando datos del portal...
          </div>
        ) : (
          <>
            {/* TAB 1: Project Status timeline */}
            {activeTab === 'project' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                
                {/* Roadmap timeline (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass-card p-6 border border-brand-white/5 space-y-6">
                    
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                        Línea de Tiempo del Proyecto
                      </h3>
                      <span className="text-[10px] font-mono text-brand-cyan">
                        Última actualización: hace unas horas
                      </span>
                    </div>

                    {activeProject ? (
                      // Approved real project timeline
                      <div className="relative pl-6 border-l border-brand-white/10 space-y-8 mt-4">
                        {activeProject.phases.map((phase) => {
                          const isCompleted = phase.status === 'completado';
                          const isProcess = phase.status === 'en_proceso';
                          const isBlocked = phase.status === 'bloqueado';
                          
                          return (
                            <div key={phase.phaseNumber} className="relative">
                              {/* Connector circle */}
                              <div className={`absolute -left-[30px] top-0 w-4 h-4 rounded-full border border-brand-black flex items-center justify-center shadow-lg ${
                                isCompleted ? 'bg-brand-cyan text-brand-black shadow-[0_0_8px_#22D3EE]' :
                                isProcess ? 'bg-brand-blue border-brand-cyan animate-pulse' :
                                isBlocked ? 'bg-red-500 text-brand-white' : 'bg-brand-gray-dark border-brand-white/10'
                              }`}>
                                {isCompleted && <CheckCircle2 size={12} className="text-brand-black" />}
                                {isProcess && <Clock size={10} className="text-brand-cyan" />}
                                {isBlocked && <AlertCircle size={10} className="text-brand-white" />}
                              </div>

                              <div>
                                <h4 className="text-xs font-bold text-brand-white flex items-center gap-2">
                                  {phase.title}
                                  {isProcess && (
                                    <span className="text-[8px] font-mono font-bold text-brand-cyan bg-brand-cyan/15 px-1.5 py-0.5 rounded border border-brand-cyan/10">
                                      En Proceso ({phase.progress}%)
                                    </span>
                                  )}
                                  {isBlocked && (
                                    <span className="text-[8px] font-mono font-bold text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded border border-red-500/10">
                                      Bloqueado
                                    </span>
                                  )}
                                  {isCompleted && (
                                    <span className="text-[8px] font-mono font-bold text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded border border-green-500/10">
                                      Completado
                                    </span>
                                  )}
                                </h4>
                                <p className="text-[10px] text-brand-gray-light mt-1 font-sans">
                                  {phase.description}
                                </p>
                                <div className="text-[8px] font-mono text-brand-gray-medium mt-1">
                                  Fecha estimada: {phase.estimatedDate}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // Unapproved / Quote Received Status Timeline
                      <div className="space-y-6">
                        <div className="p-4 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex gap-3 text-brand-cyan">
                          <AlertCircle size={18} className="shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-brand-white">Alcance en Revisión Técnica</h4>
                            <p className="text-[10px] text-brand-gray-light leading-relaxed font-sans">
                              Estamos revisando la especificación funcional de los módulos seleccionados. Recibirás tu propuesta final por este portal. ¡Puedes subir tu logo o manual en la pestaña de "Documentación"!
                            </p>
                          </div>
                        </div>

                        <div className="relative pl-6 border-l border-brand-white/10 space-y-8 mt-6">
                          {[
                            { step: 1, title: 'Cotización Enviada', desc: 'Registraste los requerimientos y la estimación inicial.', status: 'completado' },
                            { step: 2, title: 'Revisión de Alcance', desc: 'Ingenieros de ReCode están validando la arquitectura e integraciones.', status: 'en_proceso' },
                            { step: 3, title: 'Propuesta Comercial', desc: 'Generaremos los valores mensuales definitivos y contrato formal.', status: 'pendiente' },
                            { step: 4, title: 'Aprobación del Cliente', desc: 'Aceptación digital del alcance técnico y comercial.', status: 'pendiente' },
                            { step: 5, title: 'Inicio de Proyecto', desc: 'Alta de PM y kickoff del desarrollo core.', status: 'pendiente' }
                          ].map((stepObj) => {
                            const isCompleted = stepObj.status === 'completado';
                            const isProcess = stepObj.status === 'en_proceso';

                            return (
                              <div key={stepObj.step} className="relative">
                                <div className={`absolute -left-[30px] top-0 w-4 h-4 rounded-full border border-brand-black flex items-center justify-center shadow-lg ${
                                  isCompleted ? 'bg-brand-cyan text-brand-black shadow-[0_0_8px_#22D3EE]' :
                                  isProcess ? 'bg-brand-blue border-brand-cyan animate-pulse' :
                                  'bg-brand-gray-dark border-brand-white/10'
                                }`}>
                                  {isCompleted && <CheckCircle2 size={12} className="text-brand-black" />}
                                  {isProcess && <Clock size={10} className="text-brand-cyan" />}
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-brand-white flex items-center gap-2">
                                    {stepObj.step}. {stepObj.title}
                                    {isProcess && (
                                      <span className="text-[8px] font-mono font-bold text-brand-cyan bg-brand-cyan/15 px-1.5 py-0.5 rounded">En Proceso</span>
                                    )}
                                  </h4>
                                  <p className="text-[10px] text-brand-gray-light mt-1 font-sans">
                                    {stepObj.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar details (1 col) */}
                <div className="space-y-6">
                  {/* Ficha card */}
                  <div className="glass-card p-6 border border-brand-white/5 space-y-4">
                    <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                      Detalles del Proyecto
                    </h3>

                    <div className="space-y-3 font-mono text-[10px] text-brand-gray-light">
                      <div className="flex justify-between border-b border-brand-white/5 pb-2">
                        <span>Código:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-brand-white font-bold">{activeProject ? activeProject.projectCode : 'RC-QT-PENDIENTE'}</span>
                          <button
                            onClick={() => handleCopyCode(activeProject ? activeProject.projectCode : 'RC-QT-PENDIENTE')}
                            className="text-brand-cyan hover:text-brand-white transition-colors"
                            title="Copiar código"
                          >
                            {isCopied ? <Check size={10} /> : <Copy size={10} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-brand-white/5 pb-2">
                        <span>Estado Actual:</span>
                        <span className="text-brand-cyan font-bold">{activeProject ? 'Desarrollo Core' : 'Cotizado'}</span>
                      </div>
                      <div className="flex justify-between border-b border-brand-white/5 pb-2">
                        <span>Abono Mensual:</span>
                        <span className="text-brand-white font-bold">
                          {activeQuote ? `$ ${activeQuote.estimated_min.toLocaleString('es-AR')} a $ ${activeQuote.estimated_max.toLocaleString('es-AR')}` : 'Por definir'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-brand-white/5 pb-2">
                        <span>Fecha de Inicio:</span>
                        <span className="text-brand-white font-bold">{activeProject ? activeProject.startDate : 'Por definir'}</span>
                      </div>
                      <div className="flex justify-between border-b border-brand-white/5 pb-2">
                        <span>Entrega Estimada:</span>
                        <span className="text-brand-white font-bold">{activeProject ? activeProject.estimatedDeliveryDate : 'Por definir'}</span>
                      </div>
                    </div>

                    <div className="bg-brand-cyan/5 border border-brand-cyan/20 p-3 rounded-lg flex gap-2.5 text-brand-cyan">
                      <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                      <p className="text-[9px] leading-relaxed font-sans">
                        Este espacio es privado. Cualquier cambio que realices quedará notificado en tiempo real a tu Project Manager asignado.
                      </p>
                    </div>
                  </div>

                  {/* Actions summary */}
                  <div className="glass-card p-6 border border-brand-white/5 space-y-4">
                    <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                      Próxima Acción
                    </h3>
                    <div className="p-3.5 rounded-lg bg-brand-cyan/5 border border-brand-cyan/15 space-y-2">
                      <div className="text-[9px] font-mono text-brand-cyan uppercase tracking-wider font-bold">Requerimiento Pendiente</div>
                      <p className="text-[10px] text-brand-gray-light leading-relaxed font-sans">
                        {activeProject 
                          ? 'Por favor revisá los últimos wireframes en la sección de Soporte y envianos tu feedback.' 
                          : 'Cargar el logo de la empresa y paleta de colores corporativos en la pestaña Documentación.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: Saved Quotes */}
            {activeTab === 'quote' && (
              <div className="glass-card p-6 border border-brand-white/5 space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-white/5 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                      Cotizaciones Guardadas
                    </h3>
                    <p className="text-[10px] text-brand-gray-medium mt-1">
                      Visualizá tus configuraciones guardadas y estimaciones mensuales asociadas.
                    </p>
                  </div>
                </div>

                {quotes.length === 0 ? (
                  <div className="text-center py-10 font-mono text-xs text-brand-gray-medium border border-dashed border-brand-white/10 rounded-lg">
                    No tenés cotizaciones guardadas en esta cuenta aún.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Selector if multiple */}
                    {quotes.length > 1 && (
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-brand-gray-medium uppercase">Ver Cotización:</span>
                        <select
                          value={activeQuote?.id || ''}
                          onChange={(e) => {
                            const match = quotes.find(q => q.id === e.target.value);
                            if (match) setActiveQuote(match);
                          }}
                          className="bg-brand-black border border-brand-white/10 rounded px-2 py-1 text-xs text-brand-white font-mono"
                        >
                          {quotes.map(q => (
                            <option key={q.id} value={q.id}>{q.quoteCode} - {getProjectTypeLabel(q.project_type)}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {activeQuote && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Detail spec list (2 cols) */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="bg-brand-gray-dark/40 border border-brand-white/5 p-5 rounded-xl space-y-4">
                            
                            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                              <div>
                                <span className="text-[9px] text-brand-gray-medium block uppercase">Solución Seleccionada</span>
                                <span className="text-brand-white font-bold block mt-1">{getProjectTypeLabel(activeQuote.project_type)}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-brand-gray-medium block uppercase">Código de Seguimiento</span>
                                <span className="text-brand-cyan font-bold block mt-1">{activeQuote.quoteCode}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-brand-gray-medium block uppercase">Fecha de Carga</span>
                                <span className="text-brand-gray-light block mt-1">
                                  {new Date(activeQuote.created_at).toLocaleDateString('es-AR')}
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] text-brand-gray-medium block uppercase">Estado de la Ficha</span>
                                <span className="text-brand-cyan font-bold block mt-1 uppercase">
                                  {activeQuote.status || 'pendiente'}
                                </span>
                              </div>
                            </div>

                            <div className="border-t border-brand-white/5 pt-4">
                              <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider block font-bold">Módulos Solicitados</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                {activeQuote.selected_modules.map((mKey) => (
                                  <div key={mKey} className="flex items-center gap-2 text-xs text-brand-gray-light bg-brand-black/35 border border-brand-white/5 p-2 rounded">
                                    <CheckCircle2 size={12} className="text-brand-cyan shrink-0" />
                                    <span className="truncate">{mKey.replace('-', ' ').replace('_', ' ')}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="border-t border-brand-white/5 pt-4 grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-[9px] text-brand-gray-medium block uppercase font-bold">Qué incluye el abono</span>
                                <ul className="mt-2 space-y-1.5 text-[9px] text-brand-gray-light font-sans list-disc pl-4">
                                  <li>Desarrollo completo a medida</li>
                                  <li>Diseño UX/UI personalizado</li>
                                  <li>Soporte técnico prioritario</li>
                                  <li>Mantenimiento evolutivo mensual</li>
                                  <li>Alojamiento en nube segura</li>
                                </ul>
                              </div>
                              <div>
                                <span className="text-[9px] text-brand-gray-medium block uppercase font-bold">Qué no incluye</span>
                                <ul className="mt-2 space-y-1.5 text-[9px] text-brand-gray-light font-sans list-disc pl-4">
                                  <li>Carga masiva de stock inicial</li>
                                  <li>Edición de imágenes de productos</li>
                                  <li>Licencias de software de terceros</li>
                                  <li>Costos de API pagas externas</li>
                                </ul>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Cost card (1 col) */}
                        <div className="space-y-4">
                          <div className="bg-brand-cyan/5 border border-brand-cyan/20 p-6 rounded-xl space-y-5">
                            <div>
                              <span className="text-[9px] font-mono text-brand-cyan uppercase block font-bold tracking-widest">Abono Mensual Estimado</span>
                              <h4 className="text-2xl font-display font-extrabold text-brand-white mt-1">
                                $ {activeQuote.estimated_min.toLocaleString('es-AR')} a $ {activeQuote.estimated_max.toLocaleString('es-AR')}
                                <span className="text-[10px] text-brand-gray-medium font-mono font-normal"> / mes</span>
                              </h4>
                              <span className="text-[9px] font-mono text-brand-cyan block mt-1.5 font-bold">Contratación mínima: 12 meses</span>
                            </div>

                            <div className="space-y-2 text-[10px] font-mono text-brand-gray-light border-t border-brand-white/5 pt-4">
                              <div className="flex justify-between">
                                <span>Complejidad:</span>
                                <span className="text-brand-white font-bold">{activeQuote.complexity}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Plazo de entrega:</span>
                                <span className="text-brand-white font-bold">{activeQuote.estimated_weeks} semanas</span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                              <button
                                onClick={() => handleDuplicateQuote(activeQuote)}
                                className="w-full btn-primary text-xs font-bold text-brand-white py-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                              >
                                Duplicar esta cotización
                              </button>
                              
                              <button
                                onClick={() => simulatePdfDownload(activeQuote.quoteCode || '')}
                                className="w-full text-center text-xs font-mono font-bold text-brand-gray-light hover:text-brand-cyan border border-brand-white/10 rounded-lg py-2.5 bg-brand-gray-dark/50 transition-colors"
                              >
                                Descargar Resumen (PDF)
                              </button>
                              
                              <button
                                onClick={() => {
                                  setActiveTab('chat');
                                  setChatCategory('cambio_alcance');
                                  setNewMessage(`Hola ReCode, me gustaría solicitar una revisión manual sobre los requerimientos de la cotización ${activeQuote.quoteCode}. Necesito agregar...`);
                                }}
                                className="w-full text-center text-xs font-mono font-bold text-brand-gray-light hover:text-brand-cyan border border-brand-white/10 rounded-lg py-2.5 bg-brand-gray-dark/50 transition-colors"
                              >
                                Solicitar Revisión Manual
                              </button>
                            </div>

                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Documentation Upload */}
            {activeTab === 'docs' && (
              <div className="glass-card p-6 border border-brand-white/5 space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                    Documentación del Proyecto
                  </h3>
                  <p className="text-[10px] text-brand-gray-medium mt-1">
                    Cargá y descargá manuales, logotipos, accesos técnicos o referencias de diseño.
                  </p>
                </div>

                {/* Drag and Drop Container */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging ? 'border-brand-cyan bg-brand-blue/10' : 'border-brand-white/10 bg-brand-gray-dark/25 hover:border-brand-cyan/40'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-brand-cyan/15 text-brand-cyan flex items-center justify-center">
                      <UploadCloud size={20} />
                    </div>
                    {uploadProgress !== null ? (
                      <div className="space-y-1.5 w-full max-w-xs">
                        <span className="text-[10px] font-mono text-brand-cyan block">Subiendo archivo... {uploadProgress}%</span>
                        <div className="w-full h-1 bg-brand-black rounded overflow-hidden">
                          <div className="h-full bg-brand-cyan transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs text-brand-white font-bold">Arrastrá y soltá tus archivos acá o hacé clic para buscar</p>
                          <p className="text-[9px] text-brand-gray-medium mt-1 font-mono">Formatos permitidos: PDF, PNG, JPG, DOCX, XLSX (Máx. 10MB)</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Documents Table */}
                <div className="space-y-3 mt-8">
                  <h4 className="text-xs font-bold text-brand-white font-mono uppercase tracking-wider">Archivos Cargados</h4>
                  {documents.length === 0 ? (
                    <div className="text-center py-6 font-mono text-[10px] text-brand-gray-medium border border-dashed border-brand-white/5 rounded-lg">
                      No se han cargado documentos para este proyecto todavía.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc) => (
                        <div key={doc.id} className="bg-brand-gray-dark/40 border border-brand-white/5 p-4 rounded-lg flex items-center justify-between gap-4 hover:border-brand-cyan/20 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-brand-blue/10 text-brand-cyan flex items-center justify-center">
                              <FileText size={18} />
                            </div>
                            <div className="max-w-[200px] sm:max-w-xs">
                              <h5 className="text-xs font-bold text-brand-white truncate">{doc.fileName}</h5>
                              <p className="text-[9px] font-mono text-brand-gray-medium mt-0.5">
                                {doc.fileType.toUpperCase()} • {doc.fileSize} • {new Date(doc.uploadedAt).toLocaleDateString('es-AR')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Document status badge */}
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                              doc.status === 'aprobado' ? 'bg-green-500/10 text-green-300 border-green-500/20' :
                              doc.status === 'revisado' ? 'bg-brand-blue/15 text-brand-cyan border-brand-blue/20' :
                              doc.status === 'falta_informacion' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              'bg-brand-gray-dark text-brand-gray-medium border-brand-white/10'
                            }`}>
                              {doc.status}
                            </span>
                            <button
                              onClick={() => simulatePdfDownload(doc.fileName)}
                              className="text-brand-cyan hover:text-brand-white transition-colors"
                              title="Descargar archivo"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: Payments and Billing (Membership Subscription Mode) */}
            {activeTab === 'payments' && (
              <div className="glass-card p-6 border border-brand-white/5 space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                    Membresía y Abono Mensual
                  </h3>
                  <p className="text-[10px] text-brand-gray-medium mt-1">
                    Gestioná tu suscripción de desarrollo continuo, actualizá tu método de débito automático y descargá tus facturas.
                  </p>
                </div>

                {payments.length === 0 ? (
                  // Empty state for Quotes
                  <div className="text-center py-10 font-mono text-xs text-brand-gray-medium border border-dashed border-brand-white/10 rounded-lg p-8 space-y-2">
                    <p className="text-brand-white font-bold">Abono Mensual de Suscripción no activo.</p>
                    <p className="text-[10px] text-brand-gray-light leading-relaxed max-w-sm mx-auto font-sans">
                      Una vez que aprobemos tu propuesta de cotización y comience la fase de kickoff de desarrollo, se activará tu membresía de software studio con los abonos mensuales correspondientes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* Membership & Credit Card Info */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-brand-black/40 border border-brand-white/5 p-6 rounded-2xl relative overflow-hidden">
                      <div className="absolute -right-16 -top-16 w-48 h-48 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
                      
                      {/* Premium CSS Card visual */}
                      <div className="md:col-span-5 bg-gradient-to-br from-brand-blue/30 via-brand-violet/20 to-brand-cyan/20 border border-brand-cyan/20 p-5 rounded-2xl relative overflow-hidden h-44 shadow-lg flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-mono uppercase text-brand-gray-light tracking-wider">ReCode Software Studio</span>
                            <h4 className="text-xs font-display font-extrabold text-brand-white mt-0.5">MEMBRESÍA ACTIVA</h4>
                          </div>
                          <div className="w-8 h-5 bg-brand-white/10 rounded border border-brand-white/15 flex items-center justify-center font-mono font-bold text-[8px] text-brand-cyan">
                            VISA
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-mono text-sm tracking-widest text-brand-white">
                            {cardNumber}
                          </div>
                          <div className="flex justify-between items-end mt-4">
                            <div>
                              <span className="text-[6px] font-mono uppercase text-brand-gray-medium block">Titular</span>
                              <span className="text-[9px] font-mono font-bold text-brand-white uppercase">{cardHolder}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[6px] font-mono uppercase text-brand-gray-medium block">Vence</span>
                              <span className="text-[9px] font-mono font-bold text-brand-white">{cardExpiry}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Subscription Status details */}
                      <div className="md:col-span-7 flex flex-col justify-between py-1 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-brand-white font-mono">ESTADO DEL ABONO:</span>
                            <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                              autoDebitEnabled ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
                            }`}>
                              {autoDebitEnabled ? 'Débito Automático Activo' : 'Débito Desactivado'}
                            </span>
                          </div>
                          <p className="text-[10px] text-brand-gray-light leading-relaxed font-sans">
                            La facturación se realiza de manera mensual. El débito se efectúa automáticamente de la tarjeta asociada entre el día 1 y 5 de cada mes. Como contingencia, siempre puedes cargar un comprobante de transferencia bancaria si tu tarjeta fuera rechazada.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            onClick={() => {
                              setNewCardNumber('');
                              setNewCardHolder('');
                              setNewCardExpiry('');
                              setNewCardCvv('');
                              setShowCardModal(true);
                            }}
                            className="text-[9px] font-mono font-bold text-brand-cyan border border-brand-cyan/20 rounded px-3 py-1.5 bg-brand-cyan/5 hover:bg-brand-cyan/10 transition-colors cursor-pointer"
                          >
                            Actualizar Tarjeta
                          </button>
                          <button
                            onClick={handleToggleAutoDebit}
                            className={`text-[9px] font-mono font-bold rounded px-3 py-1.5 border transition-colors cursor-pointer ${
                              autoDebitEnabled 
                                ? 'text-brand-gray-light border-brand-white/10 bg-brand-gray-dark/50 hover:bg-brand-gray-dark'
                                : 'text-brand-white border-brand-cyan bg-brand-cyan/10 hover:bg-brand-cyan/20'
                            }`}
                          >
                            {autoDebitEnabled ? 'Desactivar Débito Automático' : 'Habilitar Débito Automático'}
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Invoice/Debits History Table */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-brand-white font-mono uppercase tracking-wider">Historial de Débitos y Facturas</h4>
                      
                      <div className="space-y-3">
                        {payments.map((p) => {
                          const isPaid = p.status === 'pagado';
                          
                          return (
                            <div key={p.id} className="bg-brand-gray-dark/40 border border-brand-white/5 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div>
                                <h5 className="text-xs font-bold text-brand-white">{p.period}</h5>
                                <p className="text-[9px] font-mono text-brand-gray-medium mt-1">
                                  Vence: {new Date(p.dueDate).toLocaleDateString('es-AR')}
                                  {isPaid && p.paidAt && ` • Cobrado el: ${new Date(p.paidAt).toLocaleDateString('es-AR')}`}
                                  {!isPaid && autoDebitEnabled && ' • Próximo a debitar automáticamente'}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <span className="font-mono text-xs font-bold text-brand-white block">
                                    $ {p.amount.toLocaleString('es-AR')}
                                  </span>
                                  <span className="text-[8px] font-mono text-brand-gray-medium block">ARS</span>
                                </div>

                                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                  isPaid ? 'bg-green-500/10 text-green-300 border-green-500/20' :
                                  p.comprobanteUploaded ? 'bg-brand-blue/10 text-brand-cyan border-brand-cyan/20 animate-pulse' :
                                  'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
                                }`}>
                                  {isPaid ? 'Cobrado' : p.comprobanteUploaded ? 'Comprobante en Revisión' : 'Pendiente'}
                                </span>

                                <div className="flex gap-2">
                                  {!isPaid && (
                                    <button
                                      onClick={() => handleUploadReceipt(p.id)}
                                      className="text-[9px] font-mono font-bold text-brand-cyan border border-brand-cyan/20 rounded px-2 py-1 bg-brand-cyan/5 hover:bg-brand-cyan/10 transition-colors cursor-pointer"
                                    >
                                      {p.comprobanteUploaded ? 'Actualizar Transferencia' : 'Cargar Transferencia'}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => alert(`Generando y descargando Factura Fiscal Digital (A/B) para: ${p.period}`)}
                                    className="text-[9px] font-mono font-bold text-brand-gray-light hover:text-brand-white transition-colors cursor-pointer border border-brand-white/10 rounded px-2.5 py-1 bg-brand-gray-dark/50"
                                  >
                                    Factura PDF
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* Tarjeta Modal Form popup */}
                {showCardModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="glass-card max-w-sm w-full p-6 border border-brand-cyan/20 bg-brand-blue/5 shadow-2xl relative text-left">
                      <h3 className="font-display font-extrabold text-sm text-brand-white mb-4">
                        Asociar Tarjeta para Débito Automático
                      </h3>
                      
                      <form onSubmit={handleSaveCard} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-brand-gray-light uppercase block">Número de Tarjeta</label>
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={newCardNumber}
                            onChange={(e) => {
                              // Filter out non-digits, chunk in 4s
                              const digits = e.target.value.replace(/\D/g, '');
                              const chunks = digits.match(/.{1,4}/g);
                              setNewCardNumber(chunks ? chunks.join(' ') : '');
                            }}
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-1.5 text-xs text-brand-white focus:border-brand-cyan focus:outline-none font-mono"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-brand-gray-light uppercase block">Nombre del Titular (como figura en la tarjeta)</label>
                          <input
                            type="text"
                            required
                            value={newCardHolder}
                            onChange={(e) => setNewCardHolder(e.target.value)}
                            placeholder="SOFIA MARTINEZ"
                            className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-1.5 text-xs text-brand-white focus:border-brand-cyan focus:outline-none font-mono"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[8px] font-mono text-brand-gray-light uppercase block">Vencimiento</label>
                            <input
                              type="text"
                              required
                              maxLength={5}
                              value={newCardExpiry}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length >= 2) {
                                  setNewCardExpiry(val.slice(0, 2) + '/' + val.slice(2, 4));
                                } else {
                                  setNewCardExpiry(val);
                                }
                              }}
                              placeholder="MM/AA"
                              className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-1.5 text-xs text-brand-white focus:border-brand-cyan focus:outline-none text-center font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-mono text-brand-gray-light uppercase block">CVV / Seg.</label>
                            <input
                              type="password"
                              required
                              maxLength={4}
                              value={newCardCvv}
                              onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ''))}
                              placeholder="•••"
                              className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-1.5 text-xs text-brand-white focus:border-brand-cyan focus:outline-none text-center font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowCardModal(false)}
                            className="flex-1 text-center text-xs font-mono font-bold text-brand-gray-light border border-brand-white/10 rounded-lg py-2 hover:bg-brand-white/5 cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 btn-primary text-xs font-bold text-brand-white py-2 rounded-lg cursor-pointer"
                          >
                            Guardar Tarjeta
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 5: Support Messages */}
            {activeTab === 'chat' && (
              <div className="glass-card p-6 border border-brand-white/5 flex flex-col h-[500px] animate-fadeIn">
                <div className="border-b border-brand-white/5 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                      Mensajería de Soporte Técnico
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono text-brand-cyan flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
                    Soporte Técnico Activo
                  </span>
                </div>

                {/* Categories filter selector */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <span className="text-[9px] font-mono text-brand-gray-medium uppercase self-center mr-1">Categoría:</span>
                  {[
                    { key: 'general', label: 'General' },
                    { key: 'cambio_alcance', label: 'Cambio de Alcance' },
                    { key: 'soporte', label: 'Soporte Técnico' },
                    { key: 'documentos', label: 'Documentación' },
                    { key: 'pagos', label: 'Pagos' }
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setChatCategory(cat.key as any)}
                      className={`px-2.5 py-1 rounded text-[8px] font-mono font-bold uppercase border transition-colors cursor-pointer ${
                        chatCategory === cat.key 
                          ? 'bg-brand-cyan text-brand-black border-brand-cyan' 
                          : 'bg-brand-gray-dark text-brand-gray-light border-brand-white/10 hover:border-brand-white/20'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Messages balloon logs */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                  {chatMessages.length === 0 ? (
                    <p className="text-[10px] text-brand-gray-medium font-mono text-center py-10">No hay historial de soporte para esta categoría todavía. Escribe tu primera consulta abajo.</p>
                  ) : (
                    chatMessages.map((msg) => {
                      const isStudio = msg.sender === 'recode';
                      
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isStudio ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-md rounded-xl p-3.5 text-xs leading-relaxed ${
                            isStudio
                              ? 'bg-brand-gray-dark border border-brand-white/5 text-brand-gray-light rounded-tl-none'
                              : 'bg-brand-blue/35 border border-brand-blue/20 text-brand-white rounded-tr-none'
                          }`}>
                            <div className="flex justify-between items-center gap-4 text-[8px] font-mono text-brand-gray-medium mb-1 border-b border-brand-white/5 pb-1">
                              <span className="font-bold">{isStudio ? 'ReCode Studio PM' : 'Tú (Cliente)'}</span>
                              <span>{new Date(msg.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="whitespace-pre-line text-[11px] mt-1">{msg.message}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Send messaging input */}
                <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-brand-white/5 pt-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white font-sans font-normal"
                    placeholder={`Escribir consulta sobre: ${chatCategory.replace('_', ' ').toUpperCase()}...`}
                  />
                  <button
                    type="submit"
                    className="btn-primary text-xs font-bold text-brand-white px-5 rounded-lg flex items-center gap-1.5 font-sans cursor-pointer"
                  >
                    Enviar
                    <Send size={12} />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 6: Meetings / Next Steps */}
            {activeTab === 'meetings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                
                {/* Meeting card */}
                <div className="glass-card p-6 border border-brand-white/5 space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                      Reuniones Tecnológicas
                    </h3>
                    <p className="text-[10px] text-brand-gray-medium mt-1">
                      Agendá y visualizá tus llamadas de seguimiento de arquitectura o diseño.
                    </p>
                  </div>

                  {meetings.length === 0 ? (
                    <div className="text-center py-6 font-mono text-[10px] text-brand-gray-medium border border-dashed border-brand-white/5 rounded-lg">
                      No hay videollamadas agendadas actualmente.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {meetings.map((m) => (
                        <div key={m.id} className="p-4 rounded-lg bg-brand-gray-dark/40 border border-brand-white/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-brand-white">
                              {m.meeting_type === 'initial' ? 'Reunión de Relevamiento' : 'Llamada de Proyecto'}
                            </span>
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                              m.status === 'scheduled' ? 'bg-brand-blue/15 text-brand-cyan border-brand-cyan/20 animate-pulse' :
                              'bg-green-500/10 text-green-300 border-green-500/20'
                            }`}>
                              {m.status}
                            </span>
                          </div>

                          <div className="space-y-1 font-mono text-[9px] text-brand-gray-light leading-relaxed">
                            <div>Fecha: {new Date(m.scheduled_at).toLocaleString('es-AR')} (Hora Arg)</div>
                            <div>Duración: {m.duration_minutes} minutos</div>
                            {m.notes && <div>Observaciones: {m.notes}</div>}
                          </div>

                          {m.status === 'scheduled' && (
                            <a
                              href="https://meet.google.com/rcd-stud-mtg"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-brand-cyan hover:underline mt-2"
                            >
                              Enlace de Meet
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      alert('Conectando con Calendly de ReCode Studio para agendar una nueva fecha...');
                    }}
                    className="w-full btn-primary text-xs font-bold text-brand-white py-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                  >
                    Agendar Nueva Reunión
                  </button>
                </div>

                {/* Next steps Checklist */}
                <div className="glass-card p-6 border border-brand-white/5 space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                      Próximos Pasos Administrativos
                    </h3>
                    <p className="text-[10px] text-brand-gray-medium mt-1">
                      Checklist de tareas iniciales requeridas para el kickoff formal.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { idx: 1, title: 'Completar datos de contacto corporativos', done: true },
                      { idx: 2, title: 'Subir documentación técnica, logos y paleta de marcas', done: documents.length > 0 },
                      { idx: 3, title: 'Revisar la propuesta preliminar en PDF', done: quotes.length > 0 },
                      { idx: 4, title: 'Aprobar alcance funcional final y abonos', done: activeQuote?.status === 'aprobada' || activeProject !== null },
                      { idx: 5, title: 'Confirmar fecha del kickoff de desarrollo', done: activeProject !== null }
                    ].map((step) => (
                      <div key={step.idx} className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center mt-0.5 ${
                          step.done ? 'border-green-500 bg-green-500/10 text-green-300' : 'border-brand-white/20 bg-brand-gray-dark'
                        }`}>
                          {step.done && <CheckCircle2 size={10} />}
                        </div>
                        <div>
                          <span className={`text-xs font-bold block ${step.done ? 'text-brand-gray-medium line-through font-normal' : 'text-brand-white'}`}>
                            {step.idx}. {step.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}

export default function PortalClientesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-brand-gray-light font-mono text-xs">
        Cargando espacio de autogestión...
      </div>
    }>
      <PortalContent />
    </Suspense>
  );
}
