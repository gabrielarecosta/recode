'use client';

import { useState } from 'react';
import { dbClient } from '@/lib/db';
import { Calendar, Clock, Check, ArrowRight, Video, CalendarDays, Cpu, RefreshCw, CheckCircle } from 'lucide-react';

const MEETING_TYPES = [
  { id: 'initial', label: 'Reunión Inicial Estratégica', duration: 20, desc: 'Sesión breve para conocer tu negocio y bosquejar alcances.' },
  { id: 'audit', label: 'Auditoría de Procesos Digitales', duration: 30, desc: 'Relevamiento técnico detallado de tus planillas y cuellos de botella.' },
  { id: 'ecommerce', label: 'Consulta de Ecommerce con Gestión', duration: 30, desc: 'Análisis de integraciones de stock, pagos, envíos y cuentas corrientes.' },
  { id: 'automation', label: 'Consulta sobre Automatizaciones', duration: 30, desc: 'Evaluación de flujos WhatsApp, alertas y sincronización de planillas.' },
];

const TIME_SLOTS = ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00'];

export default function AgendarPage() {
  const [meetingType, setMeetingType] = useState('initial');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Lead info
  const [leadInfo, setLeadInfo] = useState({ name: '', company: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // Generate next 7 working days dynamically
  const getNextWorkingDays = () => {
    const days = [];
    const date = new Date();
    while (days.length < 7) {
      date.setDate(date.getDate() + 1);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sat/Sun
        days.push({
          formattedStr: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('es-AR', { weekday: 'short' }),
          dayNum: date.getDate(),
          monthName: date.toLocaleDateString('es-AR', { month: 'short' })
        });
      }
    }
    return days;
  };

  const nextDays = getNextWorkingDays();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLeadInfo({ ...leadInfo, [e.target.name]: e.target.value });
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert('Por favor elegí fecha y horario.');
      return;
    }
    if (!leadInfo.name || !leadInfo.email) {
      alert('Por favor completá nombre e email.');
      return;
    }

    setLoading(true);
    try {
      const typeLabel = MEETING_TYPES.find(m => m.id === meetingType)?.label || 'Reunión ReCode';
      const duration = MEETING_TYPES.find(m => m.id === meetingType)?.duration || 30;

      // Register lead
      const leadResponse = await dbClient.submitLeadForm({
        name: leadInfo.name,
        company: leadInfo.company,
        email: leadInfo.email,
        phone: leadInfo.phone,
        service_interest: meetingType,
        message: `Reunión agendada. Tipo: ${typeLabel}. Fecha/Hora: ${selectedDate} ${selectedTime}. Notas: ${leadInfo.message}`,
        source: 'Agenda Web',
        budget: 'medio_presupuesto',
        urgency: 'medio',
        team_size: '2-5'
      });

      if (leadResponse.success && leadResponse.lead) {
        const scheduledTime = `${selectedDate}T${selectedTime}:00`;
        
        // Register meeting
        await dbClient.scheduleMeeting({
          lead_id: leadResponse.lead.id,
          meeting_type: meetingType,
          scheduled_at: scheduledTime,
          duration_minutes: duration,
          notes: leadInfo.message
        });

        // Generate Google Calendar Link
        const startTimeStr = scheduledTime.replace(/-|:/g, '');
        const endTimeDate = new Date(new Date(scheduledTime).getTime() + duration * 60000);
        const endTimeStr = endTimeDate.toISOString().split('.')[0].replace(/-|:/g, '');
        
        const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(typeLabel)}&dates=${startTimeStr}/${endTimeStr}&details=${encodeURIComponent(`Sesión virtual con ReCode Studio. Código de caso: ${leadResponse.lead.code}. Notas: ${leadInfo.message}`)}&location=${encodeURIComponent('Google Meet (Enlace en la invitación)')}`;

        setBookingDetails({
          code: leadResponse.lead.code,
          type: typeLabel,
          datetime: `${selectedDate} a las ${selectedTime} hs`,
          calendarLink
        });
        
        setBooked(true);
      }
    } catch (err) {
      console.error(err);
      alert('Hubo un error al registrar el turno.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
      
      {/* Background Decorative */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-4 animate-pulse">
          <CalendarDays size={12} />
          <span>RECODE LABS — RESERVA DE REUNIONES</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-brand-white">
          Agenda una sesión de consultoría
        </h1>
        <p className="text-sm text-brand-gray-light mt-3 max-w-xl mx-auto">
          Elegí la temática que necesitás resolver, seleccioná el día y horario que te quede cómodo, y coordiná una llamada virtual sin costo.
        </p>
      </div>

      {!booked ? (
        <form onSubmit={handleBook} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Select Meeting Type & Slots (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Meeting Type */}
            <div className="glass-card p-6 border border-brand-white/5">
              <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 mb-4 uppercase tracking-wider">
                1. Seleccioná el tipo de reunión
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MEETING_TYPES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMeetingType(m.id)}
                    className={`p-4 rounded-lg border text-left transition-all flex flex-col gap-1 relative ${
                      meetingType === m.id
                        ? 'border-brand-cyan bg-brand-blue/10'
                        : 'border-brand-white/10 bg-brand-gray-dark/50 hover:border-brand-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-brand-white block">{m.label}</span>
                    <span className="text-[10px] text-brand-gray-light leading-relaxed block my-1">{m.desc}</span>
                    <span className="text-[9px] font-mono text-brand-cyan mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      {m.duration} minutos
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Calendar Days */}
            <div className="glass-card p-6 border border-brand-white/5">
              <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 mb-4 uppercase tracking-wider">
                2. Elegí el día de la reunión
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                {nextDays.map((day) => {
                  const isSelected = selectedDate === day.formattedStr;
                  return (
                    <button
                      key={day.formattedStr}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day.formattedStr);
                        setSelectedTime(''); // Reset time selection on day change
                      }}
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'border-brand-cyan bg-brand-blue/15 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                          : 'border-brand-white/10 bg-brand-gray-dark/50 hover:border-brand-white/20'
                      }`}
                    >
                      <span className="text-[9px] uppercase font-mono text-brand-gray-medium">{day.dayName}</span>
                      <span className="text-base font-bold text-brand-white my-0.5">{day.dayNum}</span>
                      <span className="text-[9px] uppercase font-mono text-brand-gray-medium">{day.monthName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Time slots */}
            {selectedDate && (
              <div className="glass-card p-6 border border-brand-white/5 animate-fadeIn">
                <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 mb-4 uppercase tracking-wider">
                  3. Seleccioná el horario disponible (Zona: Arg)
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {TIME_SLOTS.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-lg border font-mono text-xs font-bold transition-all text-center ${
                          isSelected
                            ? 'border-brand-cyan bg-brand-blue/15 text-brand-white shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                            : 'border-brand-white/10 bg-brand-gray-dark/50 text-brand-gray-light hover:border-brand-white/20'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Form details (1 col) */}
          <div className="space-y-6">
            <div className="glass-card p-6 border border-brand-white/5 space-y-4">
              <h3 className="font-display font-bold text-sm text-brand-white border-l-2 border-brand-cyan pl-3 uppercase tracking-wider">
                4. Completá tus datos
              </h3>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-[10px] font-mono text-brand-gray-light">Nombre completo *</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={leadInfo.name}
                  onChange={handleInputChange}
                  className="bg-brand-black border border-brand-white/10 rounded p-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                  placeholder="Ej: Sofía Martínez"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="company" className="text-[10px] font-mono text-brand-gray-light">Empresa / Marca</label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={leadInfo.company}
                  onChange={handleInputChange}
                  className="bg-brand-black border border-brand-white/10 rounded p-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                  placeholder="Ej: Bruma Moda"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[10px] font-mono text-brand-gray-light">Email corporativo *</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={leadInfo.email}
                  onChange={handleInputChange}
                  className="bg-brand-black border border-brand-white/10 rounded p-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                  placeholder="sofia@empresa.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-[10px] font-mono text-brand-gray-light">WhatsApp / Celular</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={leadInfo.phone}
                  onChange={handleInputChange}
                  className="bg-brand-black border border-brand-white/10 rounded p-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white"
                  placeholder="+54 9 ..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-[10px] font-mono text-brand-gray-light">Contanos brevemente qué buscás solucionar</label>
                <textarea
                  name="message"
                  id="message"
                  rows={3}
                  value={leadInfo.message}
                  onChange={handleInputChange}
                  className="bg-brand-black border border-brand-white/10 rounded p-2 text-xs focus:border-brand-cyan focus:outline-none text-brand-white resize-none"
                  placeholder="Ej: Reemplazar planillas mayoristas..."
                />
              </div>

              <div className="border-t border-brand-white/5 pt-4">
                <button
                  type="submit"
                  disabled={loading || !selectedDate || !selectedTime}
                  className="w-full btn-primary text-xs font-bold text-brand-white py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      Agendando cita...
                    </>
                  ) : (
                    <>
                      Confirmar Reunión
                      <ArrowRight size={12} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </form>
      ) : (
        /* BOOKED CONFIRMATION STATE */
        <div className="max-w-xl mx-auto glass-card p-8 border border-brand-cyan/30 text-center space-y-6 animate-fadeIn shadow-[0_0_30px_rgba(34,211,238,0.1)]">
          <div className="w-12 h-12 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,211,238,0.2)] animate-pulse">
            <CheckCircle size={24} />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-extrabold text-xl text-brand-white">
              ¡Reunión agendada correctamente!
            </h3>
            <p className="text-xs text-brand-gray-light font-mono">
              Código de lead: <span className="text-brand-cyan font-bold">{bookingDetails.code}</span>
            </p>
          </div>

          <div className="p-4 bg-brand-gray-dark/50 border border-brand-white/5 rounded-lg flex flex-col gap-2 text-xs text-brand-gray-light leading-relaxed">
            <div>
              <span className="font-mono text-[10px] text-brand-gray-medium uppercase block">Tipo de Sesión</span>
              <span className="font-bold text-brand-white">{bookingDetails.type}</span>
            </div>
            <div className="border-t border-brand-white/5 pt-2">
              <span className="font-mono text-[10px] text-brand-gray-medium uppercase block">Fecha y Horario</span>
              <span className="font-bold text-brand-white">{bookingDetails.datetime}</span>
            </div>
            <div className="border-t border-brand-white/5 pt-2">
              <span className="font-mono text-[10px] text-brand-gray-medium uppercase block">Modalidad</span>
              <span className="font-bold text-brand-cyan flex items-center justify-center gap-1">
                <Video size={12} />
                Llamada Virtual (Google Meet)
              </span>
            </div>
          </div>

          <p className="text-[10px] text-brand-gray-medium leading-relaxed">
            Te hemos enviado un email automático de confirmación con los accesos. Por favor, agregá el evento a tu calendario haciendo clic en el siguiente botón:
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center border-t border-brand-white/5 pt-4">
            <button
              onClick={() => setBooked(false)}
              className="text-xs font-mono text-brand-gray-medium hover:text-brand-white flex items-center justify-center gap-1.5 py-2.5 px-4 rounded border border-brand-white/10"
            >
              Agendar otra cita
            </button>
            <a
              href={bookingDetails.calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs font-bold text-brand-white py-2.5 px-5 rounded flex items-center justify-center gap-2"
            >
              Agregar a Google Calendar
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
