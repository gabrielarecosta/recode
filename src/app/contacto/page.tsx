'use client';

import { useState, useEffect } from 'react';
import { dbClient } from '@/lib/db';
import { Send, Phone, Mail, CheckCircle, RefreshCw, Cpu, ShieldAlert, ExternalLink } from 'lucide-react';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service_interest: 'sistemas-gestion',
    message: '',
    urgency: 'medio',
    budget: 'medio_presupuesto',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [caseCode, setCaseCode] = useState('');
  const [utmData, setUtmData] = useState({ utm_source: '', utm_medium: '', utm_campaign: '' });

  // Read UTM parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setUtmData({
        utm_source: searchParams.get('utm_source') || '',
        utm_medium: searchParams.get('utm_medium') || '',
        utm_campaign: searchParams.get('utm_campaign') || '',
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Por favor completá nombre e email.');
      return;
    }

    setLoading(true);
    try {
      const response = await dbClient.submitLeadForm({
        ...formData,
        ...utmData,
        source: 'Formulario de Contacto'
      });

      if (response.success && response.lead) {
        setCaseCode(response.lead.code);
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      alert('Hubo un error al enviar el formulario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
      
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-4 animate-pulse">
          <Mail size={12} />
          <span>CONTACTO — RECODE STUDIO</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-brand-white">
          Contanos tu idea de proyecto
        </h1>
        <p className="text-sm text-brand-gray-light mt-3 max-w-xl mx-auto">
          Escribinos tus necesidades de digitalización o automatización. Evaluaremos tu caso y te enviaremos una propuesta técnica estructurada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact info panel (1 col) */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-brand-white/5 space-y-6">
            <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
              Canales Directos
            </h3>

            <div className="space-y-4">
              
              {/* WhatsApp direct link */}
              <a
                href="https://wa.me/5493585142731?text=Hola%20ReCode%20Studio!%20Me%20gustar%C3%ADa%20consultar%20por%20un%20proyecto."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 hover:border-green-500 hover:bg-green-500/15 transition-all text-xs font-bold font-mono justify-between"
              >
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  WhatsApp Directo
                </div>
                <ExternalLink size={12} />
              </a>

              {/* Email direct link */}
              <a
                href="mailto:info@recodestudio.com.ar"
                className="flex items-center gap-3 p-4 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-cyan hover:border-brand-cyan hover:bg-brand-blue/15 transition-all text-xs font-bold font-mono justify-between"
              >
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  info@recodestudio.com.ar
                </div>
                <ExternalLink size={12} />
              </a>

            </div>

            <div className="p-4 bg-brand-gray-dark/50 border border-brand-white/10 rounded-lg text-xs leading-relaxed text-brand-gray-light">
              <span className="font-bold text-brand-white block mb-1">Horario de Atención:</span>
              Lunes a Viernes de 9:00 a 18:00 hs (Arg). Respondemos todas las consultas en menos de 24 horas hábiles.
            </div>
          </div>
        </div>

        {/* Contact Form Column (2 cols) */}
        <div className="lg:col-span-2">
          {!success ? (
            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 border border-brand-white/5 space-y-5">
              <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider mb-2">
                Formulario de Consulta
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-[10px] font-mono text-brand-gray-light">Nombre completo *</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-brand-black border border-brand-white/10 rounded p-2.5 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                    placeholder="Ej: Martín Rossi"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className="text-[10px] font-mono text-brand-gray-light">Empresa / Marca</label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="bg-brand-black border border-brand-white/10 rounded p-2.5 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                    placeholder="Ej: Rossi & Asociados"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[10px] font-mono text-brand-gray-light">Email de contacto *</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-brand-black border border-brand-white/10 rounded p-2.5 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                    placeholder="martin@rossi.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-[10px] font-mono text-brand-gray-light">WhatsApp / Celular</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-brand-black border border-brand-white/10 rounded p-2.5 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                    placeholder="+54 9 ..."
                  />
                </div>
                
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="service_interest" className="text-[10px] font-mono text-brand-gray-light">Solución de interés</label>
                  <select
                    name="service_interest"
                    id="service_interest"
                    value={formData.service_interest}
                    onChange={handleChange}
                    className="bg-brand-black border border-brand-white/10 rounded p-2.5 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                  >
                    <option value="paginas-web">Páginas Web Personalizadas</option>
                    <option value="ecommerce">Tienda Online (Ecommerce)</option>
                    <option value="ecommerce-gestion-interna">Ecommerce con Gestión Interna</option>
                    <option value="sistemas-gestion">Sistemas de Gestión Interna</option>
                    <option value="sistemas-contables">Sistemas Contables</option>
                    <option value="automatizacion">Automatización de Procesos</option>
                    <option value="portales-clientes">Portales de Clientes</option>
                    <option value="crm">CRM y Seguimiento</option>
                    <option value="dashboards">Dashboards de Métricas</option>
                    <option value="sistemas-turnos">Sistemas de Turnos</option>
                    <option value="integraciones">Integraciones de APIs</option>
                    <option value="web-apps">Web Apps Custom (SaaS)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="message" className="text-[10px] font-mono text-brand-gray-light">Detallanos brevemente los procesos a solucionar o tu idea *</label>
                  <textarea
                    name="message"
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-brand-black border border-brand-white/10 rounded p-2.5 text-xs focus:border-brand-cyan focus:outline-none text-brand-white resize-none"
                    placeholder="Ej: Tengo información desordenada en planillas Excel de stock mayorista. Busco un panel integrado..."
                  />
                </div>
              </div>

              <div className="p-3 bg-brand-cyan/5 border border-brand-cyan/20 rounded flex gap-3 text-brand-cyan">
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <span className="text-[9px] leading-relaxed">
                  Al enviar, autorizo a ReCode Studio a registrar mis datos impositivos declarados bajo las normas de protección de privacidad locales.
                </span>
              </div>

              <div className="flex justify-end border-t border-brand-white/5 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-xs font-bold text-brand-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      Registrando caso...
                    </>
                  ) : (
                    <>
                      Enviar Consulta
                      <Send size={12} />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* THANK YOU STATE */
            <div className="glass-card p-8 border border-brand-cyan/30 text-center space-y-6 animate-fadeIn shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <div className="w-12 h-12 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,211,238,0.2)] animate-pulse">
                <CheckCircle size={24} />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-xl text-brand-white">
                  ¡Consulta recibida con éxito!
                </h3>
                <p className="text-xs text-brand-gray-light font-mono">
                  Código de seguimiento: <span className="text-brand-cyan font-bold">{caseCode}</span>
                </p>
              </div>

              <p className="text-xs text-brand-gray-light leading-relaxed max-w-sm mx-auto">
                Hemos registrado tu caso en nuestra base de datos comercial. Uno de nuestros analistas técnicos revisará tus comentarios y te responderá en las próximas horas.
              </p>

              <button
                onClick={() => setSuccess(false)}
                className="text-xs font-mono text-brand-cyan hover:underline flex items-center justify-center gap-1.5 mx-auto pt-4"
              >
                Enviar otro formulario
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
