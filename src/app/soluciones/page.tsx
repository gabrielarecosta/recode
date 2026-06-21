import SolutionsSelector from '@/components/SolutionsSelector';
import { Cpu, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const LINKS = [
  { slug: 'paginas-web', name: 'Páginas Web' },
  { slug: 'ecommerce', name: 'E-commerce' },
  { slug: 'ecommerce-gestion-interna', name: 'Ecommerce con Gestión' },
  { slug: 'sistemas-gestion', name: 'Sistemas de Gestión' },
  { slug: 'sistemas-contables', name: 'Sistemas Contables' },
  { slug: 'automatizacion', name: 'Automatizaciones' },
  { slug: 'portales-clientes', name: 'Portales de Clientes' },
  { slug: 'crm', name: 'CRM de Ventas' },
  { slug: 'dashboards', name: 'Dashboards' },
  { slug: 'integraciones', name: 'Integración APIs' }
];

export default function SolucionesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      
      {/* Background Decorative */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-cyan text-xs font-mono mb-4 animate-pulse">
          <Cpu size={12} />
          <span>RECODE LABS — SELECTOR DE SOLUCIONES</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-brand-white">
          ¿Qué área de tu empresa querés mejorar?
        </h1>
        <p className="text-sm text-brand-gray-light mt-3 max-w-xl mx-auto">
          Selecciona tu sector operativo para conocer los sistemas recomendados, niveles de complejidad y módulos que podemos desarrollar a medida.
        </p>
      </div>

      {/* Interactive Solutions selector */}
      <SolutionsSelector />

      {/* Grid of Links */}
      <div className="mt-20 border-t border-brand-white/5 pt-12">
        <h3 className="font-display font-bold text-lg text-brand-white text-center mb-8">
          Fichas detalladas de soluciones específicas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {LINKS.map((link) => (
            <Link
              key={link.slug}
              href={`/soluciones/${link.slug}`}
              className="p-4 rounded-xl border border-brand-white/5 bg-brand-gray-dark/30 hover:border-brand-cyan hover:bg-brand-gray-dark/50 transition-all text-center flex flex-col justify-between items-center gap-2"
            >
              <span className="text-xs font-bold text-brand-white">{link.name}</span>
              <span className="text-[10px] font-mono text-brand-cyan flex items-center gap-1 mt-1">
                Ficha técnica
                <ArrowRight size={10} />
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
