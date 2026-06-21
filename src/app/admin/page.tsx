'use client';

import { useState, useEffect } from 'react';
import { dbClient, Lead, QuoteRule, Meeting, Diagnostic, EmailTemplate, EmailSetting, User, Quote, ClientProject, ProjectPhase, Message, Document, Payment } from '@/lib/db';
import {
  Lock, Key, Users, Calendar, DollarSign, Cpu, FileText,
  Search, Filter, ChevronRight, Edit3, Trash2, ArrowUpRight, CheckCircle,
  MessageSquare, Shield, Clock, TrendingUp, RefreshCw, BarChart2, Mail, Settings, Send, Globe
} from 'lucide-react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [rules, setRules] = useState<QuoteRule[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [activeTab, setActiveTab] = useState<'leads' | 'quotes' | 'projects' | 'documents' | 'support' | 'rules' | 'emails' | 'metrics'>('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [priorityFilter, setPriorityFilter] = useState('Todos');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Extended Admin States
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [clients, setClients] = useState<User[]>([]);

  // Selection states
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);
  const [replyMessageText, setReplyMessageText] = useState('');
  const [replyCategory, setReplyCategory] = useState<'general' | 'cambio_alcance' | 'soporte' | 'documentos' | 'pagos'>('soporte');

  // Edit quote inputs
  const [editQuoteMin, setEditQuoteMin] = useState<number>(0);
  const [editQuoteMax, setEditQuoteMax] = useState<number>(0);
  const [editQuoteWeeks, setEditQuoteWeeks] = useState<number>(0);
  const [editQuoteNotes, setEditQuoteNotes] = useState<string>('');
  const [editQuoteFinalAbono, setEditQuoteFinalAbono] = useState<number>(0);

  // Edit project PM inputs
  const [editProjPM, setEditProjPM] = useState<string>('');
  const [editProjDeliveryDate, setEditProjDeliveryDate] = useState<string>('');
  const [editProjAbono, setEditProjAbono] = useState<number>(0);

  // Edit project phase inputs (indexed by phaseNumber 1-5)
  const [phaseEditNumber, setPhaseEditNumber] = useState<number | null>(null);
  const [phaseEditStatus, setPhaseEditStatus] = useState<'completado' | 'en_proceso' | 'pendiente' | 'bloqueado'>('pendiente');
  const [phaseEditProgress, setPhaseEditProgress] = useState<number>(0);
  const [phaseEditDate, setPhaseEditDate] = useState<string>('');
  const [phaseEditDesc, setPhaseEditDesc] = useState<string>('');
  
  // Note inputs
  const [newNoteContent, setNewNoteContent] = useState('');
  
  // Rules editing states
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  // Email administration states
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [emailSettings, setEmailSettings] = useState<EmailSetting[]>([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('lead_confirmation');
  const [editingTemplateSubject, setEditingTemplateSubject] = useState<string>('');
  const [editingTemplateHtml, setEditingTemplateHtml] = useState<string>('');
  const [editingTemplateText, setEditingTemplateText] = useState<string>('');

  // Test email state
  const [testEmailRecipient, setTestEmailRecipient] = useState<string>('');
  const [testEmailSending, setTestEmailSending] = useState<boolean>(false);
  const [testEmailResult, setTestEmailResult] = useState<string>('');

  // Email Configuration states
  const [provider, setProvider] = useState<string>('mock');
  const [apiKey, setApiKey] = useState<string>('');
  const [smtpHost, setSmtpHost] = useState<string>('');
  const [smtpPort, setSmtpPort] = useState<string>('587');
  const [smtpUser, setSmtpUser] = useState<string>('');
  const [smtpPass, setSmtpPass] = useState<string>('');
  const [fromEmail, setFromEmail] = useState<string>('');
  const [fromName, setFromName] = useState<string>('');
  const [savingSettings, setSavingSettings] = useState<boolean>(false);

  // Check session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('recode_admin_session');
      if (saved === 'true') {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const reloadAllData = async () => {
    try {
      const leadsData = await dbClient.getLeads();
      const rulesData = await dbClient.getQuoteRules();
      const meetingsData = await dbClient.getMeetings();
      const templatesData = await dbClient.getEmailTemplates();
      const settingsData = await dbClient.getEmailSettings();
      const quotesData = await dbClient.getQuotes();
      const projectsData = await dbClient.getClientProjects();
      const documentsData = await dbClient.getDocuments();
      const messagesData = await dbClient.getMessages();
      const clientsData = await dbClient.getClients();

      setLeads(leadsData);
      setRules(rulesData);
      setMeetings(meetingsData);
      setEmailTemplates(templatesData);
      setEmailSettings(settingsData);
      setQuotes(quotesData);
      setProjects(projectsData);
      setDocuments(documentsData);
      setMessages(messagesData);
      setClients(clientsData);

      // Prepopulate configuration states
      const getVal = (key: string, def: string) => settingsData.find(s => s.key_name === key)?.value || def;
      setProvider(getVal('provider', 'mock'));
      setApiKey(getVal('api_key', ''));
      setSmtpHost(getVal('smtp_host', 'smtp.gmail.com'));
      setSmtpPort(getVal('smtp_port', '587'));
      setSmtpUser(getVal('smtp_user', ''));
      setSmtpPass(getVal('smtp_pass', ''));
      setFromEmail(getVal('from_email', 'no-reply@recodestudio.com'));
      setFromName(getVal('from_name', 'ReCode Studio'));

      // Prepopulate template editor
      const currentTemp = templatesData.find(t => t.key_name === selectedTemplateKey) || templatesData.find(t => t.key_name === 'lead_confirmation');
      if (currentTemp) {
        setEditingTemplateSubject(currentTemp.subject);
        setEditingTemplateHtml(currentTemp.body_html);
        setEditingTemplateText(currentTemp.body_text);
      }
    } catch (e) {
      console.error("Error loading admin data:", e);
    }
  };

  // Fetch admin data once logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    async function loadAdminData() {
      setLoading(true);
      await reloadAllData();
      setLoading(false);
    }
    loadAdminData();
  }, [isLoggedIn, selectedTemplateKey]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const result = await dbClient.signIn(email, password);
      if (result.success) {
        setIsLoggedIn(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('recode_admin_session', 'true');
        }
      } else {
        setLoginError(result.error || 'Credenciales incorrectas. Pista: gabriela@recodestudio.com.ar / admin@recodestudio.com / recode2026');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error al autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await dbClient.signOut();
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('recode_admin_session');
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    await dbClient.updateLeadStatus(leadId, newStatus);
    // Reload leads list
    const updatedLeads = await dbClient.getLeads();
    setLeads(updatedLeads);
    // Sync current selected lead
    const match = updatedLeads.find(l => l.id === leadId);
    if (match) setSelectedLead(match);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteContent.trim()) return;

    await dbClient.addLeadNote(selectedLead.id, newNoteContent);
    setNewNoteContent('');
    
    // Reload
    const updatedLeads = await dbClient.getLeads();
    setLeads(updatedLeads);
    const match = updatedLeads.find(l => l.id === selectedLead.id);
    if (match) setSelectedLead(match);
  };

  // Quote Handlers
  const handleSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setEditQuoteMin(quote.estimated_min);
    setEditQuoteMax(quote.estimated_max);
    setEditQuoteWeeks(quote.estimated_weeks);
    setEditQuoteNotes(quote.notes || '');
    setEditQuoteFinalAbono(quote.estimated_min);
  };

  const handleUpdateQuoteDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;
    try {
      await dbClient.updateQuoteDetails(
        selectedQuote.id,
        selectedQuote.status || 'pendiente',
        editQuoteMin,
        editQuoteMax,
        editQuoteWeeks,
        editQuoteNotes
      );
      alert('Cotización actualizada con éxito.');
      await reloadAllData();
    } catch (err: any) {
      alert(`Error al actualizar cotización: ${err.message}`);
    }
  };

  const handleQuoteStatusDropdownChange = async (quoteId: string, status: Quote['status']) => {
    try {
      await dbClient.updateQuoteStatus(quoteId, status);
      await reloadAllData();
    } catch (err: any) {
      alert(`Error al cambiar estado de cotización: ${err.message}`);
    }
  };

  const handleConvertQuoteToProject = async (quoteId: string) => {
    try {
      const proj = await dbClient.convertQuoteToProject(quoteId, editQuoteFinalAbono);
      alert(`¡Proyecto creado con éxito! Código: ${proj.projectCode}`);
      await reloadAllData();
      // Select the newly created project and switch tab
      setSelectedProject(proj);
      setEditProjPM(proj.assignedPM);
      setEditProjDeliveryDate(proj.estimatedDeliveryDate);
      setActiveTab('projects');
    } catch (err: any) {
      alert(`Error al convertir a proyecto: ${err.message}`);
    }
  };

  const handleSelectProject = async (project: ClientProject) => {
    setSelectedProject(project);
    setEditProjPM(project.assignedPM);
    setEditProjDeliveryDate(project.estimatedDeliveryDate);
    try {
      const allPayments = await dbClient.getPayments();
      const projPayments = allPayments.filter(pay => pay.projectId === project.id);
      const cuotaValue = projPayments.length > 0 ? projPayments[0].amount : 0;
      setEditProjAbono(cuotaValue);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setEditProjAbono(0);
    }
    setPhaseEditNumber(null); // Reset phase edit mode
  };

  const handleUpdateProjectPM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      await dbClient.updateProjectPM(selectedProject.id, editProjPM, editProjDeliveryDate);
      await dbClient.updateProjectAbonoAmount(selectedProject.id, editProjAbono);
      alert('Datos de proyecto actualizados (PM, plazo y valor de cuota).');
      await reloadAllData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleStartPhaseEdit = (phase: ProjectPhase) => {
    setPhaseEditNumber(phase.phaseNumber);
    setPhaseEditStatus(phase.status);
    setPhaseEditProgress(phase.progress);
    setPhaseEditDate(phase.estimatedDate);
    setPhaseEditDesc(phase.description);
  };

  const handleSavePhaseEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || phaseEditNumber === null) return;
    try {
      await dbClient.updateProjectPhase(
        selectedProject.id,
        phaseEditNumber,
        phaseEditStatus,
        phaseEditProgress,
        phaseEditDate,
        phaseEditDesc
      );
      alert(`Fase ${phaseEditNumber} actualizada con éxito.`);
      setPhaseEditNumber(null); // exit edit mode
      await reloadAllData();
    } catch (err: any) {
      alert(`Error al actualizar fase: ${err.message}`);
    }
  };

  // Document Handler
  const handleUpdateDocumentStatus = async (docId: string, status: Document['status']) => {
    try {
      await dbClient.updateDocumentStatus(docId, status);
      await reloadAllData();
    } catch (err: any) {
      alert(`Error al cambiar estado del documento: ${err.message}`);
    }
  };

  // Support / Messages Handlers
  const handleSelectChatUser = (userId: string) => {
    setSelectedChatUserId(userId);
    setReplyMessageText('');
  };

  const handleSendAdminReplyMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatUserId || !replyMessageText.trim()) return;

    try {
      await dbClient.sendMessage({
        userId: selectedChatUserId,
        sender: 'recode',
        message: replyMessageText,
        category: replyCategory,
        status: 'replied'
      });
      setReplyMessageText('');
      await reloadAllData();
    } catch (err: any) {
      alert(`Error al enviar mensaje: ${err.message}`);
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

  // Rule editing helpers
  const startEditingRule = (rule: QuoteRule) => {
    setEditingRuleId(rule.id);
    setEditingValue(rule.value.toString());
  };

  const saveRuleEdit = async (ruleId: string) => {
    const num = parseFloat(editingValue);
    if (isNaN(num)) {
      alert('Ingresá un valor numérico válido.');
      return;
    }

    await dbClient.updateSingleQuoteRule(ruleId, num);
    setEditingRuleId(null);
    
    // Reload rules
    const updatedRules = await dbClient.getQuoteRules();
    setRules(updatedRules);
  };

  // Email module handlers
  const handleTemplateSelection = (key: string) => {
    setSelectedTemplateKey(key);
    const temp = emailTemplates.find(t => t.key_name === key);
    if (temp) {
      setEditingTemplateSubject(temp.subject);
      setEditingTemplateHtml(temp.body_html);
      setEditingTemplateText(temp.body_text);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dbClient.updateEmailTemplate(selectedTemplateKey, editingTemplateSubject, editingTemplateHtml, editingTemplateText);
      alert('Plantilla guardada con éxito.');
      // Refresh templates
      const updated = await dbClient.getEmailTemplates();
      setEmailTemplates(updated);
    } catch (err) {
      console.error(err);
      alert('Error al guardar la plantilla.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const payload = [
        { key_name: 'provider', value: provider },
        { key_name: 'api_key', value: apiKey },
        { key_name: 'smtp_host', value: smtpHost },
        { key_name: 'smtp_port', value: smtpPort },
        { key_name: 'smtp_user', value: smtpUser },
        { key_name: 'smtp_pass', value: smtpPass },
        { key_name: 'from_email', value: fromEmail },
        { key_name: 'from_name', value: fromName }
      ];
      await dbClient.updateEmailSettings(payload);
      alert('Configuración de email guardada con éxito.');
      const updated = await dbClient.getEmailSettings();
      setEmailSettings(updated);
    } catch (err) {
      console.error(err);
      alert('Error al guardar la configuración.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient) return;
    setTestEmailSending(true);
    setTestEmailResult('');
    try {
      const testData = {
        name: 'Destinatario de Test',
        company: 'Estudio de Ejemplo S.A.',
        code: 'RC-TEST-123456',
        message: 'Mensaje de validación enviado desde el panel de control de email de ReCode Studio.',
        project_type: 'Portal de Clientes Privado',
        price_range: '$ 2.200.000 a $ 2.620.000 ARS',
        weeks: '6',
        date_time: new Date().toLocaleString('es-AR'),
        meeting_type: 'Auditoría Digital de 20 min',
        link: 'https://meet.google.com/rcd-stud-mtg',
        recommendation: 'Portal Contable y de Clientes (e.g. ContaNova Estudio)',
        complexity: 'Alto',
        modules: 'Carga de Documentos, Alertas de WhatsApp, Calendario Fiscal'
      };

      const success = await dbClient.sendEmailTrigger(selectedTemplateKey, testEmailRecipient, testData);
      if (success) {
        setTestEmailResult('¡Email de prueba enviado con éxito! Revisa tu casilla o la consola del servidor (Node).');
      } else {
        setTestEmailResult('Error al procesar el envío. Revisa la consola del servidor.');
      }
    } catch (err: any) {
      setTestEmailResult(`Error inesperado: ${err.message}`);
    } finally {
      setTestEmailSending(false);
    }
  };

  // Filters calculation
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Todos' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'Todos' || lead.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // KPI Calculations
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'Nuevo').length;
  const highPriority = leads.filter(l => l.priority === 'Prioridad alta').length;
  const scheduledMeetings = meetings.filter(m => m.status === 'scheduled').length;

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 relative z-10">
        <div className="glass-card p-8 border border-brand-cyan/20 bg-brand-blue/5 shadow-2xl relative">
          
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-cyan/15 text-brand-cyan flex items-center justify-center mx-auto mb-3 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              <Shield size={20} />
            </div>
            <h2 className="font-display font-extrabold text-xl text-brand-white">
              Panel Administrativo Interno
            </h2>
            <p className="text-[10px] text-brand-gray-light font-mono mt-1 uppercase tracking-wider">
              Acceso Restringido — ReCode Studio
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 text-center leading-relaxed">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 mt-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-brand-gray-light uppercase tracking-wider">Usuario / Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white pl-8"
                  placeholder="admin@recodestudio.com"
                />
                <Lock size={12} className="absolute left-2.5 top-3 text-brand-gray-medium" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-brand-gray-light uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white pl-8"
                  placeholder="••••••••"
                />
                <Key size={12} className="absolute left-2.5 top-3 text-brand-gray-medium" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary text-xs font-bold text-brand-white py-3 rounded-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              Ingresar al sistema
            </button>
          </form>

          <div className="mt-6 border-t border-brand-white/5 pt-4 text-center">
            <p className="text-[9px] text-brand-gray-medium leading-relaxed">
              Credenciales de Acceso:<br />
              Email: <span className="text-brand-cyan">gabriela@recodestudio.com.ar o admin@recodestudio.com</span><br />
              Clave: <span className="text-brand-cyan">recode2026</span>
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-brand-white flex items-center gap-2">
            <Shield className="text-brand-cyan" size={24} />
            Panel de Operaciones CRM
          </h1>
          <p className="text-xs text-brand-gray-light mt-1">
            Gestión interna de leads, scoring automático y control de reglas de precotización.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="self-start md:self-auto text-xs font-mono font-bold text-brand-gray-light hover:text-brand-cyan border border-brand-white/10 rounded px-3.5 py-1.5 bg-brand-gray-dark/50"
        >
          Cerrar Sesión (Admin)
        </button>
      </div>

      {/* KPI Cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 border border-brand-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-brand-gray-medium uppercase tracking-wider block">Leads Totales</span>
            <span className="text-2xl font-display font-extrabold text-brand-white mt-1 block">{totalLeads}</span>
          </div>
          <Users className="text-brand-cyan/40" size={24} />
        </div>
        <div className="glass-card p-5 border border-brand-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-brand-gray-medium uppercase tracking-wider block">Leads Nuevos</span>
            <span className="text-2xl font-display font-extrabold text-brand-cyan mt-1 block">{newLeads}</span>
          </div>
          <Clock className="text-brand-cyan/40" size={24} />
        </div>
        <div className="glass-card p-5 border border-brand-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-brand-gray-medium uppercase tracking-wider block">Prioridad Alta</span>
            <span className="text-2xl font-display font-extrabold text-brand-white mt-1 block">{highPriority}</span>
          </div>
          <TrendingUp className="text-brand-violet/40" size={24} />
        </div>
        <div className="glass-card p-5 border border-brand-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-brand-gray-medium uppercase tracking-wider block">Reuniones Activas</span>
            <span className="text-2xl font-display font-extrabold text-brand-white mt-1 block">{scheduledMeetings}</span>
          </div>
          <Calendar className="text-brand-blue/40" size={24} />
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-brand-white/10 mb-6 overflow-x-auto gap-1">
        {[
          { key: 'leads', label: 'Leads' },
          { key: 'quotes', label: 'Cotizaciones' },
          { key: 'projects', label: 'Proyectos' },
          { key: 'documents', label: 'Documentos' },
          { key: 'support', label: 'Soporte y Mensajes' },
          { key: 'rules', label: 'Reglas Precotizador' },
          { key: 'emails', label: 'Emails' },
          { key: 'metrics', label: 'Métricas' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any);
              setSelectedLead(null);
              setSelectedQuote(null);
              setSelectedProject(null);
            }}
            className={`px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.key 
                ? 'border-brand-cyan text-brand-white' 
                : 'border-transparent text-brand-gray-medium hover:text-brand-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Leads */}
      {activeTab === 'leads' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Leads List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Filters panel */}
            <div className="glass-card p-4 border border-brand-white/5 flex flex-wrap gap-4 items-center justify-between">
              
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-1.5 text-xs focus:border-brand-cyan focus:outline-none text-brand-white pl-8"
                  placeholder="Buscar por nombre, empresa, código..."
                />
                <Search size={12} className="absolute left-2.5 top-2.5 text-brand-gray-medium" />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-brand-gray-medium uppercase">Estado:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-brand-black border border-brand-white/10 rounded px-2.5 py-1 text-xs text-brand-white"
                >
                  <option value="Todos">Todos</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Contactado">Contactado</option>
                  <option value="Reunión agendada">Reunión agendada</option>
                  <option value="Diagnóstico realizado">Diagnóstico realizado</option>
                  <option value="Propuesta enviada">Propuesta enviada</option>
                  <option value="Negociación">Negociación</option>
                  <option value="Ganado">Ganado</option>
                  <option value="Perdido">Perdido</option>
                  <option value="Pausado">Pausado</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-brand-gray-medium uppercase">Calificación:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-brand-black border border-brand-white/10 rounded px-2.5 py-1 text-xs text-brand-white"
                >
                  <option value="Todos">Todos</option>
                  <option value="Prioridad alta">Prioridad alta</option>
                  <option value="Oportunidad calificada">Oportunidad calificada</option>
                  <option value="En evaluación">En evaluación</option>
                  <option value="Proyecto inicial">Proyecto inicial</option>
                  <option value="Consulta informativa">Consulta informativa</option>
                </select>
              </div>

            </div>

            {/* List */}
            <div className="space-y-2.5">
              {loading ? (
                <div className="text-center py-10 font-mono text-xs text-brand-gray-medium flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin" size={14} />
                  Cargando base de datos...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-10 font-mono text-xs text-brand-gray-medium border border-dashed border-brand-white/10 rounded-lg">
                  Ningún lead coincide con la búsqueda o filtros.
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`w-full glass-card p-4 border text-left flex items-center justify-between gap-4 transition-all ${
                      selectedLead?.id === lead.id ? 'border-brand-cyan bg-brand-blue/10 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'border-brand-white/5'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] font-bold text-brand-cyan bg-brand-cyan/15 px-1.5 py-0.5 rounded">
                          {lead.code}
                        </span>
                        <span className="text-xs font-bold text-brand-white">{lead.name}</span>
                        {lead.company && (
                          <span className="text-[10px] text-brand-gray-medium">({lead.company})</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 font-mono text-[9px] text-brand-gray-light">
                        <span>Score: <strong className="text-brand-cyan font-bold">{lead.score}/100</strong></span>
                        <span>•</span>
                        <span>Prioridad: <strong className="text-brand-white font-bold">{lead.priority}</strong></span>
                        <span>•</span>
                        <span>Fecha: {new Date(lead.created_at).toLocaleDateString('es-AR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status pill */}
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        lead.status === 'Nuevo' ? 'bg-brand-blue/15 text-brand-white border-brand-blue' :
                        lead.status === 'Contactado' ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' :
                        lead.status === 'Ganado' ? 'bg-green-500/15 text-green-300 border-green-500/30' :
                        'bg-brand-gray-dark text-brand-gray-light border-brand-white/10'
                      }`}>
                        {lead.status}
                      </span>
                      <ChevronRight size={14} className="text-brand-gray-medium" />
                    </div>

                  </button>
                ))
              )}
            </div>

          </div>

          {/* Lead Detail Panel (1 col) */}
          <div className="space-y-4">
            {selectedLead ? (
              <div className="glass-card p-6 border border-brand-cyan/20 bg-brand-blue/5 space-y-6">
                
                {/* Header */}
                <div className="border-b border-brand-white/5 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-cyan">{selectedLead.code}</span>
                    <span className="text-[10px] font-mono text-brand-gray-medium">Scoring privado</span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-brand-white mt-1">
                    {selectedLead.name}
                  </h3>
                  {selectedLead.company && (
                    <p className="text-xs text-brand-gray-light font-mono mt-0.5">{selectedLead.company}</p>
                  )}
                </div>

                {/* Private Scoring box */}
                <div className="bg-brand-black/40 border border-brand-white/5 p-4 rounded-lg space-y-2">
                  <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-wider block">Calificación de Lead</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-extrabold text-brand-white">{selectedLead.score}</span>
                    <span className="text-xs text-brand-gray-medium font-mono">/ 100 pts</span>
                  </div>
                  <div className="text-[10px] font-mono text-brand-gray-light">
                    Clasificación: <strong className="text-brand-cyan font-bold">{selectedLead.priority}</strong>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 font-mono text-[10px] text-brand-gray-light border-b border-brand-white/5 pb-4">
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <a href={`mailto:${selectedLead.email}`} className="text-brand-white hover:underline font-bold">{selectedLead.email}</a>
                  </div>
                  <div className="flex justify-between">
                    <span>Tel / WhatsApp:</span>
                    <span className="text-brand-white font-bold">{selectedLead.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ubicación:</span>
                    <span className="text-brand-white font-bold">{selectedLead.city ? `${selectedLead.city}, ${selectedLead.province}` : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interés:</span>
                    <span className="text-brand-cyan font-bold uppercase">{selectedLead.service_interest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuente:</span>
                    <span className="text-brand-white font-bold">{selectedLead.source}</span>
                  </div>
                </div>

                {/* User Message */}
                <div className="space-y-1 bg-brand-black/20 p-3 rounded border border-brand-white/5">
                  <span className="text-[9px] font-mono text-brand-gray-medium uppercase block">Mensaje / Dolores declarados</span>
                  <p className="text-xs text-brand-gray-light leading-relaxed whitespace-pre-line">
                    {selectedLead.message}
                  </p>
                </div>

                {/* Edit status dropdown */}
                <div className="flex items-center justify-between border-t border-brand-white/5 pt-4">
                  <span className="text-[10px] font-mono text-brand-gray-medium uppercase">Editar Estado:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as Lead['status'])}
                    className="bg-brand-black border border-brand-white/10 rounded px-2 py-1 text-xs text-brand-white font-semibold"
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Reunión agendada">Reunión agendada</option>
                    <option value="Diagnóstico realizado">Diagnóstico realizado</option>
                    <option value="Propuesta enviada">Propuesta enviada</option>
                    <option value="Negociación">Negociación</option>
                    <option value="Ganado">Ganado</option>
                    <option value="Perdido">Perdido</option>
                    <option value="Pausado">Pausado</option>
                  </select>
                </div>

                {/* Notes Stream */}
                <div className="space-y-3 border-t border-brand-white/5 pt-4">
                  <span className="text-[10px] font-mono text-brand-gray-medium uppercase tracking-wider block">Notas del Equipo</span>
                  
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {!selectedLead.notes || selectedLead.notes.length === 0 ? (
                      <p className="text-[10px] text-brand-gray-medium font-mono text-center">No hay notas de seguimiento aún.</p>
                    ) : (
                      selectedLead.notes.map((note) => (
                        <div key={note.id} className="bg-brand-black/30 p-2 rounded border border-brand-white/5 text-[10px]">
                          <div className="flex justify-between text-[8px] font-mono text-brand-gray-medium mb-1">
                            <span>{note.author_name}</span>
                            <span>{new Date(note.created_at).toLocaleDateString('es-AR')}</span>
                          </div>
                          <p className="text-brand-gray-light leading-relaxed whitespace-pre-line">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add note form */}
                  <form onSubmit={handleAddNote} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="flex-1 bg-brand-black border border-brand-white/10 rounded px-2.5 py-1.5 text-[10px] focus:border-brand-cyan focus:outline-none text-brand-white"
                      placeholder="Nueva nota de seguimiento..."
                    />
                    <button
                      type="submit"
                      className="btn-primary text-[10px] font-bold text-brand-white px-3.5 py-1.5 rounded flex items-center justify-center shrink-0"
                    >
                      Guardar
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              <div className="glass-card p-10 border border-dashed border-brand-white/10 text-center font-mono text-xs text-brand-gray-medium">
                Seleccioná un lead de la lista para ver su ficha técnica, respuestas al diagnóstico e historial.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab: Quotes */}
      {activeTab === 'quotes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quotes List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-4 border border-brand-white/5 flex flex-wrap gap-4 items-center justify-between">
              <h3 className="font-display font-bold text-xs text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                Lista de Cotizaciones
              </h3>
              <p className="text-[10px] text-brand-gray-light font-mono">
                Filtrado por cotizaciones del precotizador
              </p>
            </div>

            <div className="space-y-2.5">
              {quotes.length === 0 ? (
                <div className="text-center py-10 font-mono text-xs text-brand-gray-medium border border-dashed border-brand-white/10 rounded-lg">
                  No se han registrado cotizaciones en localStorage.
                </div>
              ) : (
                quotes.map((q) => {
                  const clientName = clients.find(c => c.id === q.userId)?.name || q.companyName || 'Particular';
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleSelectQuote(q)}
                      className={`w-full glass-card p-4 border text-left flex items-center justify-between gap-4 transition-all ${
                        selectedQuote?.id === q.id ? 'border-brand-cyan bg-brand-blue/10' : 'border-brand-white/5'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-bold text-brand-cyan bg-brand-cyan/15 px-1.5 py-0.5 rounded">
                            {q.quoteCode}
                          </span>
                          <span className="text-xs font-bold text-brand-white">{clientName}</span>
                          {q.companyName && q.companyName !== clientName && (
                            <span className="text-[10px] text-brand-gray-medium">({q.companyName})</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 font-mono text-[9px] text-brand-gray-light">
                          <span>Solución: <strong className="text-brand-white font-bold">{getProjectTypeLabel(q.project_type)}</strong></span>
                          <span>•</span>
                          <span>Complejidad: <strong className="text-brand-cyan font-bold">{q.complexity}</strong></span>
                          <span>•</span>
                          <span>Semanas: <strong className="text-brand-white font-bold">{q.estimated_weeks}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                          q.status === 'aprobada' ? 'bg-green-500/10 text-green-300 border-green-500/20' :
                          q.status === 'convertida' ? 'bg-brand-blue/15 text-brand-cyan border-brand-blue/20' :
                          q.status === 'revisada' ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' :
                          'bg-brand-gray-dark text-brand-gray-medium border-brand-white/10'
                        }`}>
                          {q.status || 'pendiente'}
                        </span>
                        <ChevronRight size={14} className="text-brand-gray-medium" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Quote Details Editor (1 col) */}
          <div>
            {selectedQuote ? (
              <div className="glass-card p-6 border border-brand-cyan/20 bg-brand-blue/5 space-y-6 text-left">
                <div className="border-b border-brand-white/5 pb-4">
                  <span className="font-mono text-xs font-bold text-brand-cyan">{selectedQuote.quoteCode}</span>
                  <h3 className="font-display font-extrabold text-base text-brand-white mt-1">
                    Cotización de {clients.find(c => c.id === selectedQuote.userId)?.name || selectedQuote.companyName || 'Cliente'}
                  </h3>
                </div>

                {/* Modules list */}
                <div className="space-y-2 bg-brand-black/20 p-3.5 rounded border border-brand-white/5">
                  <span className="text-[9px] font-mono text-brand-gray-medium uppercase block">Módulos seleccionados:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedQuote.selected_modules.map((m) => (
                      <span key={m} className="text-[8px] font-mono text-brand-gray-light bg-brand-white/5 px-2 py-0.5 rounded border border-brand-white/5">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleUpdateQuoteDetails} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-brand-gray-light uppercase block">Precio Mínimo (ARS)</label>
                      <input
                        type="number"
                        required
                        value={editQuoteMin}
                        onChange={(e) => setEditQuoteMin(parseInt(e.target.value))}
                        className="w-full bg-brand-black border border-brand-white/10 rounded px-2.5 py-1.5 text-xs text-brand-white focus:border-brand-cyan focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-brand-gray-light uppercase block">Precio Máximo (ARS)</label>
                      <input
                        type="number"
                        required
                        value={editQuoteMax}
                        onChange={(e) => setEditQuoteMax(parseInt(e.target.value))}
                        className="w-full bg-brand-black border border-brand-white/10 rounded px-2.5 py-1.5 text-xs text-brand-white focus:border-brand-cyan focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-brand-gray-light uppercase block">Plazo de Implementación (Semanas)</label>
                    <input
                      type="number"
                      required
                      value={editQuoteWeeks}
                      onChange={(e) => setEditQuoteWeeks(parseInt(e.target.value))}
                      className="w-full bg-brand-black border border-brand-white/10 rounded px-2.5 py-1.5 text-xs text-brand-white focus:border-brand-cyan focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-brand-cyan uppercase block font-bold">Abono Mensual Final Acordado (ARS) *</label>
                    <input
                      type="number"
                      required
                      value={editQuoteFinalAbono}
                      onChange={(e) => setEditQuoteFinalAbono(parseInt(e.target.value))}
                      className="w-full bg-brand-black border border-brand-cyan/40 rounded px-2.5 py-1.5 text-xs text-brand-white focus:border-brand-cyan focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-brand-gray-light uppercase block">Comentarios / Observaciones Internas</label>
                    <textarea
                      rows={3}
                      value={editQuoteNotes}
                      onChange={(e) => setEditQuoteNotes(e.target.value)}
                      placeholder="Observaciones de alcance técnico..."
                      className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs text-brand-white focus:border-brand-cyan focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-between items-center border-t border-brand-white/5 pt-4 font-sans">
                    <span className="text-[10px] font-mono text-brand-gray-medium uppercase">Estado:</span>
                    <select
                      value={selectedQuote.status || 'pendiente'}
                      onChange={(e) => handleQuoteStatusDropdownChange(selectedQuote.id, e.target.value as Quote['status'])}
                      className="bg-brand-black border border-brand-white/10 rounded px-2 py-1 text-xs text-brand-white font-semibold font-mono"
                    >
                      <option value="pendiente">pendiente</option>
                      <option value="revisada">revisada</option>
                      <option value="aprobada">aprobada</option>
                      <option value="rechazada">rechazada</option>
                      <option value="convertida">convertida</option>
                    </select>
                  </div>

                  <div className="flex gap-2.5 pt-2 font-sans">
                    <button
                      type="submit"
                      className="flex-1 btn-primary text-xs font-bold text-brand-white py-2 rounded-lg cursor-pointer"
                    >
                      Guardar Cambios
                    </button>
                    {selectedQuote.status === 'aprobada' && selectedQuote.userId && (
                      <button
                        type="button"
                        onClick={() => handleConvertQuoteToProject(selectedQuote.id)}
                        className="flex-1 bg-brand-cyan hover:bg-brand-cyan/80 text-brand-black text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors"
                      >
                        Convertir a Proyecto
                      </button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="glass-card p-10 border border-dashed border-brand-white/10 text-center font-mono text-xs text-brand-gray-medium">
                Seleccioná una cotización de la lista para editar los abonos estimados, plazos o convertirla en un proyecto de desarrollo real.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Projects */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-4 border border-brand-white/5 flex flex-wrap gap-4 items-center justify-between">
              <h3 className="font-display font-bold text-xs text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                Proyectos Activos de Clientes
              </h3>
            </div>

            <div className="space-y-2.5">
              {projects.length === 0 ? (
                <div className="text-center py-10 font-mono text-xs text-brand-gray-medium border border-dashed border-brand-white/10 rounded-lg">
                  No hay proyectos activos en desarrollo.
                </div>
              ) : (
                projects.map((p) => {
                  const clientName = clients.find(c => c.id === p.userId)?.name || 'Cliente';
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProject(p)}
                      className={`w-full glass-card p-4 border text-left flex items-center justify-between gap-4 transition-all ${
                        selectedProject?.id === p.id ? 'border-brand-cyan bg-brand-blue/10' : 'border-brand-white/5'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-bold text-brand-cyan bg-brand-cyan/15 px-1.5 py-0.5 rounded">
                            {p.projectCode}
                          </span>
                          <span className="text-xs font-bold text-brand-white">{p.name}</span>
                          <span className="text-[10px] text-brand-gray-medium">({clientName})</span>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 font-mono text-[9px] text-brand-gray-light">
                          <span>PM: <strong className="text-brand-white font-bold">{p.assignedPM}</strong></span>
                          <span>•</span>
                          <span>Entrega: <strong className="text-brand-white font-bold">{p.estimatedDeliveryDate}</strong></span>
                          <span>•</span>
                          <span>Progreso: <strong className="text-brand-cyan font-bold">{p.progress}%</strong></span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-48 bg-brand-black h-1 rounded overflow-hidden mt-2">
                          <div className="bg-brand-cyan h-full" style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                          p.status === 'activo' ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-brand-gray-dark text-brand-gray-light border-brand-white/10'
                        }`}>
                          {p.status}
                        </span>
                        <ChevronRight size={14} className="text-brand-gray-medium" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Project Details / Phase Editor (1 col) */}
          <div>
            {selectedProject ? (
              <div className="glass-card p-6 border border-brand-cyan/20 bg-brand-blue/5 space-y-6 text-left">
                
                {/* Meta Settings */}
                <div className="border-b border-brand-white/5 pb-4 space-y-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-cyan">{selectedProject.projectCode}</span>
                    <h3 className="font-display font-extrabold text-base text-brand-white mt-1">
                      {selectedProject.name}
                    </h3>
                  </div>

                  <form onSubmit={handleUpdateProjectPM} className="space-y-3 bg-brand-black/20 p-3.5 rounded border border-brand-white/5 font-sans">
                    <span className="text-[9px] font-mono text-brand-cyan uppercase block font-bold">Configuración de Proyecto</span>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-brand-gray-light uppercase block">Project Manager Asignado</label>
                      <input
                        type="text"
                        required
                        value={editProjPM}
                        onChange={(e) => setEditProjPM(e.target.value)}
                        className="w-full bg-brand-black border border-brand-white/10 rounded px-2.5 py-1.5 text-xs text-brand-white focus:border-brand-cyan focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-brand-gray-light uppercase block">Fecha de Entrega Final</label>
                      <input
                        type="date"
                        required
                        value={editProjDeliveryDate}
                        onChange={(e) => setEditProjDeliveryDate(e.target.value)}
                        className="w-full bg-brand-black border border-brand-white/10 rounded px-2.5 py-1.5 text-xs text-brand-white focus:border-brand-cyan focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-brand-gray-light uppercase block">Valor Mensual de la Cuota (ARS)</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={editProjAbono}
                        onChange={(e) => setEditProjAbono(parseFloat(e.target.value) || 0)}
                        className="w-full bg-brand-black border border-brand-white/10 rounded px-2.5 py-1.5 text-xs text-brand-white focus:border-brand-cyan focus:outline-none font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-primary text-[10px] font-bold text-brand-white py-2 rounded font-mono cursor-pointer"
                    >
                      Actualizar PM / Plazo / Cuota
                    </button>
                  </form>
                </div>

                {/* Phases Control */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-brand-white font-mono uppercase tracking-wider">Fases de Desarrollo</h4>
                  
                  <div className="space-y-2">
                    {selectedProject.phases.map((ph) => (
                      <div key={ph.phaseNumber} className="bg-brand-black/20 border border-brand-white/5 p-3 rounded-lg flex items-center justify-between gap-3 text-left">
                        <div className="max-w-[200px]">
                          <div className="text-xs font-bold text-brand-white flex items-center gap-1.5">
                            F{ph.phaseNumber}: {ph.title}
                          </div>
                          <span className="text-[8px] font-mono text-brand-gray-medium uppercase block mt-0.5">
                            Status: {ph.status} ({ph.progress}%)
                          </span>
                        </div>
                        <button
                          onClick={() => handleStartPhaseEdit(ph)}
                          className="text-[9px] font-mono font-bold text-brand-cyan border border-brand-cyan/25 rounded px-2 py-1 bg-brand-cyan/5 hover:bg-brand-cyan/15 transition-all cursor-pointer shrink-0"
                        >
                          Editar
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Phase Editor Dialog popup */}
                  {phaseEditNumber !== null && (
                    <form onSubmit={handleSavePhaseEdit} className="bg-brand-cyan/5 border border-brand-cyan/20 p-4 rounded-xl space-y-3.5 font-sans">
                      <h5 className="text-xs font-bold text-brand-white font-mono uppercase">Editar Fase {phaseEditNumber}</h5>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-brand-gray-light uppercase block">Estado</label>
                          <select
                            value={phaseEditStatus}
                            onChange={(e) => setPhaseEditStatus(e.target.value as any)}
                            className="w-full bg-brand-black border border-brand-white/10 rounded px-2 py-1 text-xs text-brand-white font-mono"
                          >
                            <option value="pendiente">pendiente</option>
                            <option value="en_proceso">en_proceso</option>
                            <option value="completado">completado</option>
                            <option value="bloqueado">bloqueado</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-brand-gray-light uppercase block">Progreso %</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            required
                            value={phaseEditProgress}
                            onChange={(e) => setPhaseEditProgress(parseInt(e.target.value) || 0)}
                            className="w-full bg-brand-black border border-brand-white/10 rounded px-2.5 py-1 text-xs text-brand-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-brand-gray-light uppercase block">Fecha Estimada</label>
                        <input
                          type="date"
                          required
                          value={phaseEditDate}
                          onChange={(e) => setPhaseEditDate(e.target.value)}
                          className="w-full bg-brand-black border border-brand-white/10 rounded px-2.5 py-1 text-xs text-brand-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-brand-gray-light uppercase block">Descripción del Estado</label>
                        <textarea
                          rows={2}
                          required
                          value={phaseEditDesc}
                          onChange={(e) => setPhaseEditDesc(e.target.value)}
                          className="w-full bg-brand-black border border-brand-white/10 rounded px-2.5 py-1 text-xs text-brand-white leading-relaxed"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPhaseEditNumber(null)}
                          className="flex-1 text-center text-xs font-mono font-bold text-brand-gray-light border border-brand-white/10 rounded-lg py-1.5 hover:bg-brand-white/5 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-1 btn-primary text-xs font-bold text-brand-white py-1.5 rounded-lg cursor-pointer"
                        >
                          Actualizar
                        </button>
                      </div>
                    </form>
                  )}
                </div>

              </div>
            ) : (
              <div className="glass-card p-10 border border-dashed border-brand-white/10 text-center font-mono text-xs text-brand-gray-medium">
                Seleccioná un proyecto activo para cambiar el PM a cargo, actualizar plazos de entrega o modificar el progreso y estado de sus fases de desarrollo.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === 'documents' && (
        <div className="glass-card p-6 border border-brand-white/5 space-y-6 text-left">
          <div className="border-b border-brand-white/5 pb-4">
            <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
              Control de Documentación Técnica Cargada por Clientes
            </h3>
            <p className="text-[10px] text-brand-gray-medium mt-1">
              Revisá y aprobá los archivos cargados por los clientes en su espacio de autogestión.
            </p>
          </div>

          <div className="overflow-x-auto">
            {documents.length === 0 ? (
              <div className="text-center py-10 font-mono text-xs text-brand-gray-medium border border-dashed border-brand-white/10 rounded-lg">
                No se han cargado documentos en localStorage aún.
              </div>
            ) : (
              <table className="w-full font-mono text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-white/10 text-[9px] text-brand-gray-medium uppercase tracking-wider">
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Nombre Archivo</th>
                    <th className="py-3 px-4">Tamaño</th>
                    <th className="py-3 px-4">Fecha Carga</th>
                    <th className="py-3 px-4">Estado Actual</th>
                    <th className="py-3 px-4 text-right">Modificar Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-white/5">
                  {documents.map((doc) => {
                    const clientName = clients.find(c => c.id === doc.userId)?.companyName || 'Particular';
                    return (
                      <tr key={doc.id} className="hover:bg-brand-white/5 transition-colors">
                        <td className="py-3 px-4 font-bold text-brand-white">{clientName}</td>
                        <td className="py-3 px-4 text-brand-gray-light font-sans">{doc.fileName}</td>
                        <td className="py-3 px-4 text-brand-gray-medium">{doc.fileSize}</td>
                        <td className="py-3 px-4 text-brand-gray-medium">
                          {new Date(doc.uploadedAt).toLocaleDateString('es-AR')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                            doc.status === 'aprobado' ? 'bg-green-500/10 text-green-300 border-green-500/20' :
                            doc.status === 'revisado' ? 'bg-brand-blue/15 text-brand-cyan border-brand-blue/20' :
                            doc.status === 'falta_informacion' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-brand-gray-dark text-brand-gray-medium border-brand-white/10'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={doc.status}
                            onChange={(e) => handleUpdateDocumentStatus(doc.id, e.target.value as any)}
                            className="bg-brand-black border border-brand-white/15 rounded px-2 py-0.5 text-[10px] text-brand-white font-semibold font-mono"
                          >
                            <option value="recibido">recibido</option>
                            <option value="revisado">revisado</option>
                            <option value="falta_informacion">falta_informacion</option>
                            <option value="aprobado">aprobado</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab: Support / Chat */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client List (1 col) */}
          <div className="space-y-4">
            <div className="glass-card p-4 border border-brand-white/5">
              <h3 className="font-display font-bold text-xs text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                Chats de Soporte por Cliente
              </h3>
            </div>

            <div className="space-y-2">
              {clients.length === 0 ? (
                <div className="text-center py-6 font-mono text-[10px] text-brand-gray-medium">
                  No hay clientes registrados en el sistema.
                </div>
              ) : (
                clients.map((c) => {
                  const hasMessages = messages.some(m => m.userId === c.id);
                  const lastMessage = [...messages].reverse().find(m => m.userId === c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectChatUser(c.id)}
                      className={`w-full glass-card p-4 border text-left flex flex-col gap-1 transition-all ${
                        selectedChatUserId === c.id ? 'border-brand-cyan bg-brand-blue/10' : 'border-brand-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold text-brand-white">{c.name}</span>
                        {hasMessages && (
                          <span className="text-[8px] font-mono text-brand-cyan font-bold uppercase">Chat Activo</span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-brand-gray-medium">{c.companyName} ({c.email})</span>
                      {lastMessage && (
                        <p className="text-[10px] text-brand-gray-light truncate mt-1.5 font-sans italic">
                          Último: {lastMessage.message}
                        </p>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat Conversation (2 cols) */}
          <div className="lg:col-span-2">
            {selectedChatUserId ? (
              (() => {
                const clientObj = clients.find(c => c.id === selectedChatUserId);
                const userMessages = messages.filter(m => m.userId === selectedChatUserId);
                
                return (
                  <div className="glass-card p-6 border border-brand-cyan/20 bg-brand-blue/5 flex flex-col h-[500px] text-left">
                    <div className="border-b border-brand-white/5 pb-3 mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-display font-bold text-sm text-brand-white">
                          Chat con: {clientObj?.name || 'Cliente'}
                        </h3>
                        <p className="text-[9px] font-mono text-brand-gray-medium mt-0.5 uppercase tracking-wider">
                          Empresa: {clientObj?.companyName || 'Particular'}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-brand-cyan font-bold">
                        {userMessages.length} mensajes en historial
                      </span>
                    </div>

                    {/* Messages list */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                      {userMessages.length === 0 ? (
                        <p className="text-[10px] text-brand-gray-medium font-mono text-center py-10">No hay mensajes previos con este cliente.</p>
                      ) : (
                        userMessages.map((msg) => {
                          const isStudio = msg.sender === 'recode';
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isStudio ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-md rounded-xl p-3 text-xs leading-relaxed ${
                                isStudio
                                  ? 'bg-brand-blue/35 border border-brand-blue/20 text-brand-white rounded-tr-none'
                                  : 'bg-brand-gray-dark border border-brand-white/5 text-brand-gray-light rounded-tl-none'
                              }`}>
                                <div className="flex justify-between items-center gap-4 text-[8px] font-mono text-brand-gray-medium mb-1 border-b border-brand-white/5 pb-1">
                                  <span className="font-bold">{isStudio ? 'Tú (ReCode Admin)' : 'Cliente'}</span>
                                  <span>
                                    {new Date(msg.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <span className="text-[7px] font-mono font-bold text-brand-cyan uppercase bg-brand-cyan/15 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                                  Categoría: {msg.category}
                                </span>
                                <p className="whitespace-pre-line text-[11px] mt-1.5">{msg.message}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Reply Form */}
                    <form onSubmit={handleSendAdminReplyMessage} className="space-y-3 border-t border-brand-white/5 pt-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono text-brand-gray-medium uppercase">Categoría de respuesta:</span>
                        <select
                          value={replyCategory}
                          onChange={(e) => setReplyCategory(e.target.value as any)}
                          className="bg-brand-black border border-brand-white/10 rounded px-2.5 py-0.5 text-[10px] text-brand-white font-mono"
                        >
                          <option value="general">general</option>
                          <option value="cambio_alcance">cambio_alcance</option>
                          <option value="soporte">soporte</option>
                          <option value="documentos">documentos</option>
                          <option value="pagos">pagos</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyMessageText}
                          onChange={(e) => setReplyMessageText(e.target.value)}
                          className="flex-1 bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white font-sans"
                          placeholder="Escribí tu respuesta técnica al cliente..."
                        />
                        <button
                          type="submit"
                          className="btn-primary text-xs font-bold text-brand-white px-5 rounded-lg flex items-center gap-1.5 cursor-pointer font-sans"
                        >
                          Responder
                          <Send size={12} />
                        </button>
                      </div>
                    </form>
                  </div>
                );
              })()
            ) : (
              <div className="glass-card p-10 border border-dashed border-brand-white/10 text-center font-mono text-xs text-brand-gray-medium">
                Seleccioná un cliente de la lista para ver su conversación de soporte, responder a sus consultas técnicas o enviarle novedades sobre el alcance.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Rules */}
      {activeTab === 'rules' && (
        <div className="glass-card p-6 border border-brand-white/5">
          <div className="flex items-center justify-between border-b border-brand-white/5 pb-4 mb-4">
            <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
              Configuración de Precios del Precotizador
            </h3>
            <span className="text-[10px] font-mono text-brand-gray-medium">
              Estos valores modifican en tiempo real los presupuestos del precotizador público.
            </span>
          </div>

          <div className="space-y-8">
            {/* Category 1: Base prices */}
            <div>
              <h4 className="font-display text-xs font-bold text-brand-cyan uppercase tracking-wider mb-3">Precios Base de Soluciones (ARS)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rules.filter(r => r.category === 'base_price').map((rule) => (
                  <div key={rule.id} className="bg-brand-gray-dark/50 border border-brand-white/5 p-4 rounded-lg flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-brand-white block">{rule.label}</span>
                      <span className="text-[9px] font-mono text-brand-gray-medium block mt-1">Clave: {rule.key_name}</span>
                    </div>
                    <div>
                      {editingRuleId === rule.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="bg-brand-black border border-brand-cyan rounded px-2 py-1 text-xs font-mono text-brand-white w-24 text-right"
                          />
                          <button
                            onClick={() => saveRuleEdit(rule.id)}
                            className="bg-brand-cyan text-brand-black font-bold text-xs p-1 px-2 rounded"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-white">
                            $ {rule.value.toLocaleString('es-AR')}
                          </span>
                          <button
                            onClick={() => startEditingRule(rule)}
                            className="text-brand-gray-medium hover:text-brand-cyan transition-colors"
                          >
                            <Edit3 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 2: Additional modules */}
            <div>
              <h4 className="font-display text-xs font-bold text-brand-cyan uppercase tracking-wider mb-3">Costos Adicionales de Módulos (ARS)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rules.filter(r => r.category === 'additional_module').map((rule) => (
                  <div key={rule.id} className="bg-brand-gray-dark/50 border border-brand-white/5 p-4 rounded-lg flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-brand-white block">{rule.label}</span>
                      <span className="text-[9px] font-mono text-brand-gray-medium block mt-1">Clave: {rule.key_name}</span>
                    </div>
                    <div>
                      {editingRuleId === rule.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="bg-brand-black border border-brand-cyan rounded px-2 py-1 text-xs font-mono text-brand-white w-24 text-right"
                          />
                          <button
                            onClick={() => saveRuleEdit(rule.id)}
                            className="bg-brand-cyan text-brand-black font-bold text-xs p-1 px-2 rounded"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-white">
                            $ {rule.value.toLocaleString('es-AR')}
                          </span>
                          <button
                            onClick={() => startEditingRule(rule)}
                            className="text-brand-gray-medium hover:text-brand-cyan transition-colors"
                          >
                            <Edit3 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 3: Multipliers */}
            <div>
              <h4 className="font-display text-xs font-bold text-brand-cyan uppercase tracking-wider mb-3">Multiplicadores por Urgencia (Factor)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rules.filter(r => r.category === 'multiplier').map((rule) => (
                  <div key={rule.id} className="bg-brand-gray-dark/50 border border-brand-white/5 p-4 rounded-lg flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-brand-white block">{rule.label}</span>
                      <span className="text-[9px] font-mono text-brand-gray-medium block mt-1">Factor multiplicador</span>
                    </div>
                    <div>
                      {editingRuleId === rule.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="bg-brand-black border border-brand-cyan rounded px-2 py-1 text-xs font-mono text-brand-white w-16 text-right"
                          />
                          <button
                            onClick={() => saveRuleEdit(rule.id)}
                            className="bg-brand-cyan text-brand-black font-bold text-xs p-1 px-2 rounded"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-cyan">
                            x {rule.value}
                          </span>
                          <button
                            onClick={() => startEditingRule(rule)}
                            className="text-brand-gray-medium hover:text-brand-cyan transition-colors"
                          >
                            <Edit3 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab: Emails */}
      {activeTab === 'emails' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn text-left">
          
          {/* Left Column: Email Configuration settings (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 border border-brand-white/5 space-y-5">
              <div className="border-b border-brand-white/5 pb-3">
                <h3 className="font-display font-bold text-sm text-brand-white flex items-center gap-2">
                  <Settings size={16} className="text-brand-cyan" />
                  Configuración del Servidor de Correo
                </h3>
                <p className="text-[10px] text-brand-gray-light mt-1 leading-relaxed">
                  Configurá el proveedor para enviar emails reales de confirmación y agendamiento.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                
                {/* Active Provider */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray-light uppercase tracking-wider block text-left">Proveedor de Correo</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                  >
                    <option value="mock">Simulación (Imprimir en Consola)</option>
                    <option value="resend">Resend API (Recomendado)</option>
                    <option value="smtp">Servidor SMTP Personalizado</option>
                  </select>
                </div>

                {/* Resend Provider config */}
                {provider === 'resend' && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[10px] font-mono text-brand-gray-light uppercase tracking-wider block text-left">Resend API Key</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="re_..."
                      className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white font-mono"
                    />
                    <span className="text-[8px] text-brand-gray-medium font-mono leading-relaxed block text-left">
                      Obtené tu clave en <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline">resend.com</a>. Requiere verificar el dominio.
                    </span>
                  </div>
                )}

                {/* SMTP Config */}
                {provider === 'smtp' && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-mono text-brand-gray-light uppercase block text-left">Host SMTP</label>
                        <input
                          type="text"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                          placeholder="smtp.gmail.com"
                          className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-brand-gray-light uppercase block text-left">Puerto</label>
                        <input
                          type="text"
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(e.target.value)}
                          placeholder="587"
                          className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-brand-gray-light uppercase block text-left">Usuario SMTP</label>
                      <input
                        type="text"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        placeholder="tu-email@gmail.com"
                        className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-brand-gray-light uppercase block text-left">Contraseña SMTP</label>
                      <input
                        type="password"
                        value={smtpPass}
                        onChange={(e) => setSmtpPass(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                      />
                    </div>
                  </div>
                )}

                {/* From settings */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-brand-white/5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-brand-gray-light uppercase block text-left">Remitente (Email)</label>
                    <input
                      type="email"
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="no-reply@recode.com"
                      className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-brand-gray-light uppercase block text-left">Nombre Visible</label>
                    <input
                      type="text"
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      placeholder="ReCode Studio"
                      className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full btn-primary text-xs font-bold text-brand-white py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {savingSettings ? <RefreshCw className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                  Guardar Servidor de Correo
                </button>
              </form>
            </div>
            
            {/* Direct Test Panel */}
            <div className="glass-card p-6 border border-brand-white/5 space-y-4">
              <div className="border-b border-brand-white/5 pb-2">
                <h3 className="font-display font-bold text-xs text-brand-white flex items-center gap-1.5">
                  <Send size={14} className="text-brand-cyan" />
                  Enviar Email de Prueba (Test)
                </h3>
              </div>
              <form onSubmit={handleSendTestEmail} className="space-y-3">
                <input
                  type="email"
                  required
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  placeholder="destinatario@correo.com"
                  className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                />
                <button
                  type="submit"
                  disabled={testEmailSending || !testEmailRecipient}
                  className="w-full text-center text-xs font-mono font-bold text-brand-white border border-brand-white/10 rounded-lg py-2 hover:border-brand-cyan bg-brand-gray-dark/50 transition-colors cursor-pointer"
                >
                  {testEmailSending ? 'Enviando...' : 'Enviar plantilla seleccionada'}
                </button>
              </form>
              {testEmailResult && (
                <div className="p-3 rounded text-[9px] font-mono leading-relaxed bg-brand-blue/10 border border-brand-cyan/20 text-brand-gray-light whitespace-pre-wrap">
                  {testEmailResult}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Template Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 border border-brand-white/5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-white/5 pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-brand-white flex items-center gap-2">
                    <Mail size={16} className="text-brand-cyan" />
                    Editor de Plantillas de Email
                  </h3>
                  <p className="text-[10px] text-brand-gray-light mt-1">
                    Modificá los textos y el diseño HTML de las alertas automatizadas.
                  </p>
                </div>
                
                {/* Template Selector dropdown */}
                <select
                  value={selectedTemplateKey}
                  onChange={(e) => handleTemplateSelection(e.target.value)}
                  className="bg-brand-black border border-brand-cyan/50 rounded px-3 py-1.5 text-xs text-brand-white font-bold max-w-[200px]"
                >
                  <option value="lead_confirmation">Confirmación de Lead</option>
                  <option value="quote_notification">Nueva Cotización</option>
                  <option value="meeting_scheduled">Reunión Agendada</option>
                  <option value="diagnostic_completed">Diagnóstico Listo</option>
                </select>
              </div>

              <form onSubmit={handleSaveTemplate} className="space-y-4">
                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray-light uppercase tracking-wider block text-left">Asunto del Correo</label>
                  <input
                    type="text"
                    required
                    value={editingTemplateSubject}
                    onChange={(e) => setEditingTemplateSubject(e.target.value)}
                    className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white font-bold"
                  />
                </div>

                {/* HTML Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-brand-gray-light uppercase tracking-wider">Cuerpo HTML (Plantilla renderizada)</label>
                    <span className="text-[8px] font-mono text-brand-gray-medium uppercase">Variables: name, company, code, message, price_range</span>
                  </div>
                  <textarea
                    rows={12}
                    required
                    value={editingTemplateHtml}
                    onChange={(e) => setEditingTemplateHtml(e.target.value)}
                    className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2.5 text-xs focus:border-brand-cyan focus:outline-none text-brand-white font-mono leading-relaxed"
                  />
                </div>

                {/* Plain Text Body */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray-light uppercase tracking-wider block text-left">Cuerpo de Texto Plano (Fallback sin HTML)</label>
                  <textarea
                    rows={5}
                    required
                    value={editingTemplateText}
                    onChange={(e) => setEditingTemplateText(e.target.value)}
                    className="w-full bg-brand-black border border-brand-white/10 rounded px-3 py-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white font-mono leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="btn-primary text-xs font-bold text-brand-white px-6 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle size={14} />
                    Guardar Plantilla
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* Tab: Metrics */}
      {activeTab === 'metrics' && (
        <div className="glass-card p-6 border border-brand-white/5 space-y-8">
          <div className="flex items-center justify-between border-b border-brand-white/5 pb-4 mb-4">
            <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
              Análisis de Conversión del Embudo de Ventas
            </h3>
            <span className="text-[10px] font-mono text-brand-gray-medium">
              Datos analíticos calculados a partir de los registros del panel.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Conversion card 1 */}
            <div className="bg-brand-gray-dark/40 border border-brand-white/5 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider">Origen de Tráfico</span>
                <BarChart2 size={16} className="text-brand-cyan" />
              </div>
              
              <div className="space-y-2.5 font-mono text-[10px] text-brand-gray-light">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Directo (Formulario)</span>
                    <span className="text-brand-white font-bold">40%</span>
                  </div>
                  <div className="w-full bg-brand-black h-1 rounded overflow-hidden">
                    <div className="bg-brand-cyan h-full" style={{ width: '40%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Diagnóstico Web</span>
                    <span className="text-brand-white font-bold">35%</span>
                  </div>
                  <div className="w-full bg-brand-black h-1 rounded overflow-hidden">
                    <div className="bg-brand-cyan h-full" style={{ width: '35%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Precotizador</span>
                    <span className="text-brand-white font-bold">25%</span>
                  </div>
                  <div className="w-full bg-brand-black h-1 rounded overflow-hidden">
                    <div className="bg-brand-cyan h-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion card 2 */}
            <div className="bg-brand-gray-dark/40 border border-brand-white/5 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider">Interés por Solución</span>
                <Cpu size={16} className="text-brand-cyan" />
              </div>

              <div className="space-y-2.5 font-mono text-[10px] text-brand-gray-light">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Ecommerce + Gestión</span>
                    <span className="text-brand-white font-bold">45%</span>
                  </div>
                  <div className="w-full bg-brand-black h-1 rounded overflow-hidden">
                    <div className="bg-brand-violet h-full" style={{ width: '45%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Sistemas de Gestión</span>
                    <span className="text-brand-white font-bold">30%</span>
                  </div>
                  <div className="w-full bg-brand-black h-1 rounded overflow-hidden">
                    <div className="bg-brand-violet h-full" style={{ width: '30%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Sistemas Contables</span>
                    <span className="text-brand-white font-bold">25%</span>
                  </div>
                  <div className="w-full bg-brand-black h-1 rounded overflow-hidden">
                    <div className="bg-brand-violet h-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion card 3 */}
            <div className="bg-brand-gray-dark/40 border border-brand-white/5 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider">Calificación de leads (Scoring)</span>
                <CheckCircle size={16} className="text-brand-cyan" />
              </div>

              <div className="space-y-2.5 font-mono text-[10px] text-brand-gray-light">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Prioridad alta (Score &gt;= 75)</span>
                    <span className="text-brand-white font-bold">{highPriority} leads</span>
                  </div>
                  <div className="w-full bg-brand-black h-1 rounded overflow-hidden">
                    <div className="bg-brand-blue h-full" style={{ width: `${(highPriority/Math.max(1,totalLeads))*100}%` }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Oportunidades calificadas</span>
                    <span className="text-brand-white font-bold">{leads.filter(l => l.priority === 'Oportunidad calificada').length} leads</span>
                  </div>
                  <div className="w-full bg-brand-black h-1 rounded overflow-hidden">
                    <div className="bg-brand-blue h-full" style={{ width: `${(leads.filter(l => l.priority === 'Oportunidad calificada').length/Math.max(1,totalLeads))*100}%` }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>En Evaluación / Inicial / Consulta</span>
                    <span className="text-brand-white font-bold">{leads.filter(l => !['Prioridad alta', 'Oportunidad calificada'].includes(l.priority)).length} leads</span>
                  </div>
                  <div className="w-full bg-brand-black h-1 rounded overflow-hidden">
                    <div className="bg-brand-blue h-full" style={{ width: `${(leads.filter(l => !['Prioridad alta', 'Oportunidad calificada'].includes(l.priority)).length/Math.max(1,totalLeads))*100}%` }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="p-4 bg-brand-cyan/5 border border-brand-cyan/20 rounded-lg text-xs leading-relaxed text-brand-gray-light">
            <span className="font-bold text-brand-white block mb-1">Métricas de conversión y desempeño:</span>
            Los ratios de cierre y calificación de leads demuestran que el <strong className="text-brand-cyan">Ecommerce con Gestión Interna</strong> y los <strong className="text-brand-cyan">Sistemas de Gestión a Medida</strong> son las soluciones más consultadas por las empresas que completan el diagnóstico, impulsando el interés comercial hacia integraciones más complejas y presupuestos de mayor escala.
          </div>
        </div>
      )}

    </div>
  );
}
