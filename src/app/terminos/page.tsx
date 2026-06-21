import Link from 'next/link';

export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 relative z-10 space-y-6 text-xs text-brand-gray-light leading-relaxed">
      <h1 className="text-2xl font-display font-extrabold text-brand-white border-l-2 border-brand-cyan pl-3">
        Términos y Condiciones
      </h1>
      <p className="font-mono text-[10px] text-brand-gray-medium">Última actualización: 21 de Junio de 2026</p>

      <p>
        El acceso y uso de las herramientas de autogestión y estimación de costos en la web oficial de **ReCode Studio** se rigen bajo los siguientes términos y condiciones comerciales.
      </p>

      <h2 className="text-sm font-bold text-brand-white uppercase font-display mt-6">1. Validez de las Estimaciones (Precotizador)</h2>
      <p>
        Todos los cálculos monetarios (en ARS y USD) y plazos de entrega en semanas arrojados por el precotizador interactivo y la herramienta de diagnóstico digital son de carácter **orientativo**. No constituyen una propuesta contractual, cotización firme, ni compromiso de plazos. El presupuesto y alcance final se definirá en conjunto tras la firma de un Contrato de Desarrollo y Especificación Técnica (SRS).
      </p>

      <h2 className="text-sm font-bold text-brand-white uppercase font-display mt-6">2. Propiedad Intelectual de Prototipos (ReCode Labs)</h2>
      <p>
        Todos los proyectos conceptuales presentados en nuestro portfolio (como Bruma Moda o ContaNova Estudio) representan prototipos conceptuales protegidos intelectualmente por ReCode Studio. No se permite la copia de código, layouts visuales ni diagramas del sistema sin el consentimiento expreso y por escrito del estudio.
      </p>

      <h2 className="text-sm font-bold text-brand-white uppercase font-display mt-6">3. Uso de Portales Privados</h2>
      <p>
        El acceso simulado al portal de clientes (`/portal-clientes`) y al panel administrativo (`/admin`) se provee con propósitos netamente ilustrativos de experiencia operativa. Queda terminantemente prohibido el uso de estas interfaces para guardar datos reales sensibles o realizar inyecciones maliciosas de código.
      </p>

      <h2 className="text-sm font-bold text-brand-white uppercase font-display mt-6">4. Jurisdicción</h2>
      <p>
        Estos términos se rigen e interpretan bajo las leyes de la República Argentina, sometiéndose cualquier reclamo o controversia a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.
      </p>

      <p className="pt-6 border-t border-brand-white/5 font-mono text-[10px]">
        Por cualquier consulta legal referente a nuestras estimaciones de presupuestos o licencias de código, podés escribir a: <a href="mailto:legales@recodestudio.com" className="text-brand-cyan hover:underline">legales@recodestudio.com</a>
      </p>
    </div>
  );
}
