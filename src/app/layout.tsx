import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlowFollow from "@/components/GlowFollow";
import { QuoteProvider } from "@/context/QuoteContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReCode Studio | Código que conecta. Tecnología que transforma.",
  description: "Desarrollo web a medida, tiendas online personalizadas, automatización de procesos y sistemas de gestión interna para empresas que quieren trabajar mejor.",
  keywords: ["desarrollo web a medida", "sistemas de gestion", "ecommerce", "automatización de procesos", "portales de clientes", "crm", "recode studio"],
  openGraph: {
    title: "ReCode Studio | Código que conecta. Tecnología que transforma.",
    description: "Creamos herramientas digitales y sistemas internos a la medida de tu empresa.",
    type: "website",
    locale: "es_AR",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-black text-brand-white">
        <GlowFollow />
        {/* Moving dark shadow/halo overlay */}
        <div className="pointer-events-none fixed -inset-[150%] z-0 bg-gradient-to-r from-transparent via-brand-black/70 to-transparent animate-shadow-sweep" />
        <Header />
        <main className="flex-grow pt-24 relative z-10">
          <QuoteProvider>
            {children}
          </QuoteProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}

