import Link from 'next/link';

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 relative z-10 space-y-6 text-xs text-brand-gray-light leading-relaxed">
      <h1 className="text-2xl font-display font-extrabold text-brand-white border-l-2 border-brand-cyan pl-3">
        Política de Privacidad
      </h1>
      <p className="font-mono text-[10px] text-brand-gray-medium">Última actualización: 21 de Junio de 2026</p>
      
      <p>
        En **ReCode Studio** nos tomamos muy en serio la seguridad y el tratamiento de los datos personales recopilados a través de nuestro sitio web. Esta Política de Privacidad describe qué información obtenemos, cómo la almacenamos y los derechos de protección que te asisten como titular de los datos.
      </p>

      <h2 className="text-sm font-bold text-brand-white uppercase font-display mt-6">1. Información que recopilamos</h2>
      <p>
        Obtenemos información a través de formularios explícitos cargados por el usuario:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Datos de contacto (nombre, email corporativo, número de teléfono).</li>
        <li>Respuestas sobre la operatividad del negocio (tamaño del equipo, dolores de gestión, herramientas actuales).</li>
        <li>Selección de módulos del precotizador e importes de inversión previstos.</li>
        <li>Detalles de citas virtuales agendadas.</li>
      </ul>

      <h2 className="text-sm font-bold text-brand-white uppercase font-display mt-6">2. Uso de la información</h2>
      <p>
        Los datos recopilados se utilizan únicamente para:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Evaluar y precalificar comercialmente tu solicitud de desarrollo de software.</li>
        <li>Calcular el Lead Score interno para priorizar respuestas de contacto.</li>
        <li>Coordinar las reuniones virtuales agendadas por el programador.</li>
        <li>Enviar propuestas técnicas y presupuestos personalizados de diseño.</li>
      </ul>

      <h2 className="text-sm font-bold text-brand-white uppercase font-display mt-6">3. Persistencia y Seguridad</h2>
      <p>
        Toda la información declarada se guarda de manera segura en nuestra base de datos remota administrada por Supabase (y replicada localmente para simulaciones de funcionalidad). No compartimos, vendemos ni transferimos tu información comercial a terceros bajo ninguna circunstancia.
      </p>

      <h2 className="text-sm font-bold text-brand-white uppercase font-display mt-6">4. Cookies y Analíticas</h2>
      <p>
        Utilizamos cookies funcionales temporales para mantener tu sesión en el panel y registrar los parámetros UTM con el objetivo de identificar la fuente del lead (ej: campañas publicitarias o búsquedas orgánicas).
      </p>

      <p className="pt-6 border-t border-brand-white/5 font-mono text-[10px]">
        Si querés solicitar la eliminación o rectificación de tus datos registrados bajo los códigos de consulta RC-XXXX-XXXXXX, podés escribirnos directamente a: <a href="mailto:privacidad@recodestudio.com" className="text-brand-cyan hover:underline">privacidad@recodestudio.com</a>
      </p>
    </div>
  );
}
