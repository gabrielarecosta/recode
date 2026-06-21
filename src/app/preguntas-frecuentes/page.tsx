'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  { q: '¿Cuánto cuesta una página web?', a: 'Los valores varían según el alcance del proyecto. Una Landing Page comercial arranca en $800.000 ARS y una tienda online personalizada en $2.500.000 ARS. Podés usar nuestro Precotizador Inteligente para calcular un rango estimado según tus requerimientos.' },
  { q: '¿Cuánto demora un proyecto?', a: 'Sitios institucionales básicos demoran de 4 a 6 semanas. Proyectos más complejos con paneles administrativos y cuentas corrientes (como ecommerce a medida) toman entre 8 y 12 semanas, dependiendo de la agilidad en la entrega de contenidos.' },
  { q: '¿Trabajan con empresas pequeñas?', a: 'Sí, por supuesto. Diseñamos soluciones que se adaptan a la escala y madurez tecnológica de cada negocio, buscando siempre que la inversión se pague sola mediante el ahorro de tiempo y la automatización de procesos.' },
  { q: '¿Puedo empezar con una primera etapa?', a: 'Totalmente. Fomentamos el desarrollo por etapas (MVP - Producto Mínimo Viable). Empezamos construyendo lo que es crítico para operar hoy y luego podemos ir sumando módulos o paneles adicionales.' },
  { q: '¿La web será autoadministrable?', a: 'Sí. Todos nuestros desarrollos incluyen un panel administrativo a medida para que puedas editar textos, fotos, productos, stock y descargar reportes de manera autónoma, sin depender de nosotros.' },
  { q: '¿Puedo cargar productos?', a: 'Sí, los productos se administran desde tu panel interno. Podrás agregar variantes de talles, colores, precios diferenciales minoristas/mayoristas y fotos en pocos clics.' },
  { q: '¿Integran Mercado Pago?', a: 'Sí. Integramos pasarelas de pago electrónico como Mercado Pago, Stripe o dLocal para que tus clientes paguen online de forma segura con tarjeta, Rapipago o Pago Fácil.' },
  { q: '¿Integran Correo Argentino?', a: 'Sí. Conectamos cotizadores de envíos nacionales (Correo Argentino, Andreani, OCA) para que el costo de despacho se calcule automáticamente según el peso de la compra y el código postal del cliente.' },
  { q: '¿Pueden reemplazar mis planillas?', a: 'Es una de nuestras especialidades. Centralizamos la información de tus planillas de Excel o Google Sheets (inventarios, clientes, tareas) en una base de datos segura y la mostramos en paneles claros de gestión.' },
  { q: '¿Pueden crear un sistema interno?', a: 'Sí. Desarrollamos herramientas internas a medida (ERPs, CRM, control de inventario) diseñadas exclusivamente alrededor de la lógica de trabajo de tu equipo.' },
  { q: '¿Pueden hacer un portal de clientes?', a: 'Sí. Creamos portales privados con acceso seguro para que tus clientes puedan consultar saldos en cuenta corriente, ver el avance de su proyecto o descargar facturas.' },
  { q: '¿Pueden automatizar emails?', a: 'Sí. Programamos flujos de correos automáticos (notificación de compra, aviso de pago, recordatorios de vencimiento de pólizas o facturas) con plantillas adaptadas.' },
  { q: '¿Pueden conectar WhatsApp?', a: 'Sí. Integramos APIs de envío automatizado de WhatsApp para despachar alertas de entregas, confirmaciones de turnos y notificaciones del sistema de forma automática.' },
  { q: '¿Pueden crear formularios inteligentes?', a: 'Sí. Desarrollamos formularios interactivos con validación de datos en tiempo real, guardado en base de datos e integraciones con planillas externas o herramientas de email marketing.' },
  { q: '¿Pueden crear calculadoras o simuladores?', a: 'Sí. Programamos cualquier calculadora matemática de costos, simuladores de indexación impositiva o comparadores de precios a medida.' },
  { q: '¿Puedo pedir funcionalidades especiales?', a: '¡Claro que sí! No dependemos de plantillas rígidas ni plataformas enlatadas. Podemos programar cualquier funcionalidad interactiva o integración que tu negocio imagine.' },
  { q: '¿Qué pasa después de publicar?', a: 'Una vez publicado el sistema, te brindamos acompañamiento estratégico y soporte técnico durante el período de garantía y entrega. Quedas totalmente en posesión del código y los datos.' },
  { q: '¿Ofrecen mantenimiento?', a: 'Sí, ofrecemos planes mensuales opcionales de mantenimiento preventivo, copias de seguridad de base de datos, optimización de velocidad y actualización de integraciones de APIs.' },
  { q: '¿El diseño es personalizado?', a: 'Sí, el diseño UX/UI es 100% propio. Trabajamos en conjunto diseñando maquetas y prototipos para validar la experiencia visual antes de escribir la primera línea de código.' },
  { q: '¿Puedo escalar el sistema después?', a: 'Es la mayor ventaja del software a medida. Tu sistema puede crecer al ritmo de tu empresa. Podés agregar paneles para choferes, portales de proveedores o módulos contables meses después.' },
  { q: '¿Trabajan de forma remota?', a: 'Sí, trabajamos de forma 100% remota con reuniones virtuales de seguimiento por Google Meet, coordinando con clientes de todo el país y el exterior.' },
  { q: '¿Quién es dueño del dominio?', a: 'Tú. El dominio de la web (ej: .com o .com.ar) y las cuentas de hosting se registran a nombre del cliente, garantizando tu propiedad absoluta.' },
  { q: '¿Cómo se protegen los datos?', a: 'Implementamos estándares de encriptación seguros, políticas RLS (Row Level Security) en Supabase y copias de seguridad automáticas para proteger tu información y la de tus clientes.' }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
      
      {/* Background Decorative */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-violet/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-4 animate-pulse">
          <HelpCircle size={12} />
          <span>SOPORTE — PREGUNTAS FRECUENTES</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-brand-white">
          Preguntas Frecuentes
        </h1>
        <p className="text-sm text-brand-gray-light mt-3 max-w-xl mx-auto">
          Descubrí respuestas claras a las dudas más comunes sobre plazos de desarrollo, integraciones impositivas, costos y escalabilidad técnica.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-card border border-brand-white/5 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left text-xs font-bold text-brand-white hover:text-brand-cyan transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp size={16} className="text-brand-cyan shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-brand-gray-medium shrink-0" />
                )}
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[200px] border-t border-brand-white/5 p-4 md:p-5' : 'max-h-0 overflow-hidden'
                }`}
              >
                <p className="text-xs text-brand-gray-light leading-relaxed whitespace-pre-line">
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="glass-card p-6 border border-brand-cyan/20 bg-brand-blue/5 text-center mt-12 space-y-4">
        <h3 className="font-display font-bold text-base text-brand-white">
          ¿Tenés otra duda específica?
        </h3>
        <p className="text-xs text-brand-gray-light leading-relaxed max-w-md mx-auto">
          Escribinos tu inquietud operativa y te responderemos por mail o WhatsApp de inmediato y sin ningún tipo de compromiso.
        </p>
        <Link
          href="/contacto"
          className="btn-primary text-xs font-bold text-brand-white py-2.5 px-6 rounded-lg inline-flex items-center gap-2"
        >
          Enviar consulta
          <MessageSquare size={14} />
        </Link>
      </div>

    </div>
  );
}
