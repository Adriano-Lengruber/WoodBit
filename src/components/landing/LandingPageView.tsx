import React, { useState } from 'react';
import {
  Scissors,
  Cpu,
  Boxes,
  ClipboardCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight,
  Printer,
  FileSpreadsheet,
  MessageSquare,
  HelpCircle,
  Clock,
  Compass,
  Download,
  Flame,
  Check,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { UserRole } from '../../types';

interface LandingPageViewProps {
  onEnterApp: () => void;
  onLoginSuccess?: (role: UserRole) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterApp,
  onLoginSuccess
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register' | 'demo'>('login');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const openAuth = (mode: 'login' | 'register' | 'demo') => {
    setAuthInitialTab(mode);
    setIsAuthModalOpen(true);
  };

  const handleModalLoginSuccess = (role: UserRole) => {
    if (onLoginSuccess) {
      onLoginSuccess(role);
    }
    onEnterApp();
  };

  const faqs = [
    {
      q: 'O WoodBit funciona com a minha Router CNC existente (Chinesa, Proxxon ou Nacional)?',
      a: 'Sim! O motor CAM e Nesting do WoodBit gera arquivos padrão universal (.nc, .gcode e .tap) compatíveis com controladores Mach3, GRBL, RichAuto DSP, planet-cnc e Syntec. Você pode configurar diâmetro de fresa, avanço de mergulho e velocidade de corte.'
    },
    {
      q: 'Se a internet da marcenaria cair, o software para de funcionar?',
      a: 'Absolutamente não. O WoodBit foi arquitetado no padrão Local-First com banco SQLite de alta performance. Todas as ordens de serviço, planos de corte e medições funcionam offline na oficina ou no tablet em campo, sincronizando automaticamente quando há rede.'
    },
    {
      q: 'Preciso pagar mensalidade cara de API para usar a Inteligência Artificial?',
      a: 'Não! O WoodBit integra nativamente com modelos de IA locais Soberanos (como Gemma 4 12B QAT rodando no LM Studio ou Ollama da sua própria máquina). Ele transcreve áudios do WhatsApp e organiza briefings sem cobrar 1 centavo por token em nuvem.'
    },
    {
      q: 'Como funciona a integração de móveis de madeira com Impressão 3D?',
      a: 'O WoodBit possui o laboratório 3D Lab integrado com visualizador Three.js WebGL. Você pode vincular arquivos STL para suportes de prateleira, passa-cabos e puxadores personalizados em PLA/PETG que se encaixam milimetricamente nas usinagens da CNC.'
    },
    {
      q: 'Posso usar o sistema no celular ou tablet durante a visita técnica ao cliente?',
      a: 'Sim! O WoodBit conta com tecnologia PWA (Progressive Web App). Você pode instalá-lo no iPad ou tablet Android, tirar fotos dos ambientes, anotar medidas a laser e registrar o checklist técnico mesmo no subsolo ou sem sinal 4G.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#141313] text-[#EFEFEF] selection:bg-[#F3A446] selection:text-[#141313] font-sans antialiased">
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="bg-gradient-to-r from-[#1D1D1D] via-[#A06235]/40 to-[#1D1D1D] border-b border-[#A06235]/30 py-2 px-4 text-center text-xs text-[#EFEFEF]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F3A446] text-[#141313] font-black text-[10px] tracking-wider uppercase">
            Novo
          </span>
          <span className="font-medium text-[#EFEFEF]/90">
            WoodBit SaaS v4.2 lançado: Motor de Nesting 2D com IA Gemma 4 e Suporte a Impressão 3D Lab
          </span>
          <button
            onClick={() => openAuth('demo')}
            className="hidden sm:inline-flex items-center gap-1 text-[#F3A446] font-bold hover:underline cursor-pointer ml-2"
          >
            <span>Ver Demo Interativa</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. STICKY TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[#141313]/90 backdrop-blur-xl border-b border-[#1D1D1D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F3A446] via-[#A06235] to-[#141313] p-[1.5px] shadow-lg shadow-[#F3A446]/10">
              <div className="w-full h-full bg-[#141313] rounded-2xl flex items-center justify-center">
                <span className="font-black text-2xl text-[#F3A446] tracking-tighter">W</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#EFEFEF]">WoodBit</span>
                <span className="px-2 py-0.5 rounded-md bg-[#F3A446]/20 text-[#F3A446] text-[10px] font-extrabold uppercase tracking-wider border border-[#F3A446]/40">
                  Cloud SaaS
                </span>
              </div>
              <span className="text-[11px] text-[#EFEFEF]/50 block font-mono">
                Digital Carpentry Operating System
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#EFEFEF]/70">
            <a href="#solucoes" className="hover:text-[#F3A446] transition">Soluções</a>
            <a href="#engenharia" className="hover:text-[#F3A446] transition">Router CNC & 3D</a>
            <a href="#ia-soberana" className="hover:text-[#F3A446] transition">IA Local</a>
            <a href="#planos" className="hover:text-[#F3A446] transition">Planos SaaS</a>
            <a href="#faq" className="hover:text-[#F3A446] transition">Dúvidas</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="px-4 py-2.5 rounded-xl border border-[#EFEFEF]/20 hover:border-[#F3A446] text-xs font-bold text-[#EFEFEF] hover:text-[#F3A446] transition cursor-pointer"
            >
              Entrar
            </button>
            <button
              onClick={() => openAuth('demo')}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F3A446] to-[#A06235] text-[#141313] font-black text-xs tracking-wide shadow-md shadow-[#F3A446]/20 hover:brightness-110 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acessar Plataforma</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Background Ambient Warm Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#F3A446]/15 via-[#A06235]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Top Regional & Tech Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D1D1D] border border-[#A06235]/40 text-xs font-bold text-[#F3A446] mb-8 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#F3A446] animate-ping" />
              <span>Polo Fabril Natividade • Noroeste Fluminense - RJ</span>
              <span className="text-[#EFEFEF]/30">•</span>
              <span className="text-[#EFEFEF]/80">Tecnologia para Marcenarias do Futuro</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#EFEFEF] leading-[1.08]">
              O Sistema Operacional da{' '}
              <span className="bg-gradient-to-r from-[#F3A446] via-[#E8B26E] to-[#A06235] bg-clip-text text-transparent">
                Marcenaria 4.0
              </span>{' '}
              e Móveis Planejados.
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-lg sm:text-xl text-[#EFEFEF]/70 max-w-3xl mx-auto font-normal leading-relaxed">
              Elimine o retrabalho e o desperdício de MDF. Conecte a medição a laser na casa do cliente ao 
              <strong className="text-[#EFEFEF]"> plano de corte 2D</strong>, geração de <strong className="text-[#EFEFEF]">G-Code para Router CNC</strong>, manufatura aditiva 3D e orçamentos com margem de lucro blindada.
            </p>

            {/* Dual CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => openAuth('register')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F3A446] to-[#A06235] text-[#141313] font-black text-base shadow-xl shadow-[#F3A446]/25 hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-3 group"
              >
                <span>Começar 14 Dias Grátis</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              <button
                onClick={() => openAuth('demo')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#1D1D1D] hover:bg-[#252525] border border-[#A06235]/40 text-[#EFEFEF] font-bold text-base transition cursor-pointer flex items-center justify-center gap-2.5"
              >
                <Laptop className="w-5 h-5 text-[#F3A446]" />
                <span>Testar Demonstração (Sem Cadastro)</span>
              </button>
            </div>

            {/* Trust Micro-Badges */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#EFEFEF]/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F3A446]" />
                <span>Sem necessidade de cartão</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F3A446]" />
                <span>Compatível com Mach3 e GRBL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F3A446]" />
                <span>Motor de IA Local Soberano</span>
              </div>
            </div>
          </div>

          {/* HERO IMAGE SHOWCASE (CINEMATIC CNC WORKSHOP) */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="rounded-3xl border-2 border-[#A06235]/40 shadow-2xl shadow-black overflow-hidden bg-[#1D1D1D] relative group">
              <img
                src="/assets/hero_cnc_dashboard.jpg"
                alt="WoodBit ERP em oficina de marcenaria com Router CNC usinando painel de madeira"
                className="w-full h-auto object-cover max-h-[560px] filter brightness-95 contrast-105 group-hover:scale-[1.01] transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141313] via-transparent to-transparent opacity-60" />

              {/* Floating Live Metrics Card 1: Nesting Efficiency */}
              <div className="absolute bottom-6 left-6 hidden sm:block p-4 rounded-2xl bg-[#141313]/90 backdrop-blur-md border border-[#F3A446]/40 shadow-xl max-w-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F3A446]/20 flex items-center justify-center text-[#F3A446]">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#EFEFEF]/60 tracking-wider">
                      Aproveitamento de Chapa
                    </div>
                    <div className="text-xl font-black text-[#F3A446]">94.2% Eficiência</div>
                  </div>
                </div>
                <div className="text-[11px] text-[#EFEFEF]/70 mt-2 font-mono">
                  MDF Freijó 18mm • 14 peças aninhadas com -28% de retalhos
                </div>
              </div>

              {/* Floating Live Metrics Card 2: Local AI Engine */}
              <div className="absolute top-6 right-6 hidden sm:block p-4 rounded-2xl bg-[#141313]/90 backdrop-blur-md border border-[#A06235]/40 shadow-xl">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#F3A446] animate-pulse" />
                  <span className="text-xs font-bold text-[#EFEFEF]">Gemma 4 12B QAT Ativo</span>
                </div>
                <div className="text-[11px] text-[#F3A446] font-bold mt-1">
                  R$ 0,00 Custo de Nuvem (Local LM Studio)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY STATS IMPACT STRIP */}
      <section className="py-12 bg-[#1D1D1D] border-y border-[#A06235]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-[#A06235]/20">
            <div className="p-4">
              <div className="text-3xl sm:text-5xl font-black text-[#F3A446]">-28%</div>
              <div className="text-xs sm:text-sm font-bold text-[#EFEFEF] mt-2">
                Desperdício de Chapa MDF
              </div>
              <div className="text-xs text-[#EFEFEF]/50 mt-1">
                Algoritmo Nesting 2D com fresa compensada
              </div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-5xl font-black text-[#EFEFEF]">4x Mais</div>
              <div className="text-xs sm:text-sm font-bold text-[#EFEFEF] mt-2">
                Velocidade do Orçamento à OP
              </div>
              <div className="text-xs text-[#EFEFEF]/50 mt-1">
                Propostas A4 técnicas com 1 clique
              </div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-5xl font-black text-[#F3A446]">100% Offline</div>
              <div className="text-xs sm:text-sm font-bold text-[#EFEFEF] mt-2">
                Chão de Fábrica Soberano
              </div>
              <div className="text-xs text-[#EFEFEF]/50 mt-1">
                Banco SQLite local sem parar a Router
              </div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-5xl font-black text-[#EFEFEF]">R$ 0,00</div>
              <div className="text-xs sm:text-sm font-bold text-[#EFEFEF] mt-2">
                Gastos com Tokens de IA
              </div>
              <div className="text-xs text-[#EFEFEF]/50 mt-1">
                Gemma 4 12B privado na oficina
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEEP DIVE MODULES WITH PHOTOREALISTIC GALLERY */}
      <section id="solucoes" className="py-24 bg-[#141313]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3A446]/10 text-[#F3A446] text-xs font-bold uppercase tracking-wider mb-4 border border-[#F3A446]/30">
              Arquitetura de Precisão
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#EFEFEF]">
              Tecnologia Industrial Desenvolvida para a Realidade da Marcenaria.
            </h2>
            <p className="mt-4 text-base text-[#EFEFEF]/60">
              Chega de softwares engessados de escritório que não entendem o barulho da serra, o sentido do veio da madeira ou o código da Router CNC.
            </p>
          </div>

          {/* FEATURE 1: CNC & HYBRID 3D MANUFACTURING */}
          <div id="engenharia" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#A06235]/20 text-[#F3A446] text-xs font-bold mb-3 border border-[#A06235]/40">
                <Boxes className="w-3.5 h-3.5" />
                <span>Usinagem CNC & Manufatura Aditiva 3D</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-[#EFEFEF] leading-snug">
                Encaixes Milimétricos e Peças Híbridas MDF + Impressão 3D.
              </h3>
              <p className="mt-4 text-sm sm:text-base text-[#EFEFEF]/70 leading-relaxed">
                Produza móveis modernos de alto padrão onde componentes técnicos (passa-cabos embutidos, suportes magnéticos de prateleira, guias de fita LED e puxadores ergonômicos) são impressos em 3D e se encaixam milimetricamente nas cavas usinadas pela CNC.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-[#F3A446]/20 flex items-center justify-center text-[#F3A446] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#EFEFEF]/80">
                    <strong>Exportador G-Code Universal:</strong> Gere trajetórias de corte desbastadas e de acabamento sem intermediários.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-[#F3A446]/20 flex items-center justify-center text-[#F3A446] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#EFEFEF]/80">
                    <strong>Visualizador 3D WebGL Integrado:</strong> Inspecione a geometria de arquivos STL e rotações orbitais no navegador.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-[#F3A446]/20 flex items-center justify-center text-[#F3A446] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#EFEFEF]/80">
                    <strong>Controle de Sangria da Fresa:</strong> Evite colisões e garanta tolerância precisa para montagem sem lixa.
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => openAuth('demo')}
                  className="px-6 py-3 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-[#A06235]/50 text-[#F3A446] font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2"
                >
                  <span>Explorar 3D Lab no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-[#A06235]/40 shadow-2xl shadow-black">
              <img
                src="/assets/woodwork_precision_closeup.jpg"
                alt="Encaixe milimétrico em madeira Freijó com componente 3D embutido"
                className="w-full h-auto object-cover max-h-[440px]"
              />
              <div className="absolute bottom-4 right-4 bg-[#141313]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#EFEFEF]/10 text-[11px] font-mono text-[#F3A446]">
                Tolerância: ±0.15mm • Encaixe Macho-Fêmea CNC
              </div>
            </div>
          </div>

          {/* FEATURE 2: MOBILE FIELD MEASUREMENT & PWA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden border border-[#A06235]/40 shadow-2xl shadow-black">
              <img
                src="/assets/tablet_field_measurement.jpg"
                alt="Marceneiro usando tablet para medição técnica e escaneamento em obra"
                className="w-full h-auto object-cover max-h-[440px]"
              />
              <div className="absolute top-4 left-4 bg-[#141313]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#EFEFEF]/10 text-[11px] font-mono text-[#EFEFEF]">
                Modo Offline Ativo • Tablet Apple/Android
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#A06235]/20 text-[#F3A446] text-xs font-bold mb-3 border border-[#A06235]/40">
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Medição Técnica & PWA Offline</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-[#EFEFEF] leading-snug">
                Adeus Erros de Trena na Instalação do Cliente.
              </h3>
              <p className="mt-4 text-sm sm:text-base text-[#EFEFEF]/70 leading-relaxed">
                Leve o WoodBit no tablet durante a visita ao cliente. Fotografe os ambientes, anote os pontos elétricos e hidráulicos sobre as paredes, sincronize a trena laser Bluetooth e gere o checklist técnico de fabricação antes de descer do elevador.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-[#F3A446]/20 flex items-center justify-center text-[#F3A446] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#EFEFEF]/80">
                    <strong>Detecção de Obstáculos:</strong> Registre tomadas fora de prumo e rodapés altos para corte com alívio.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-[#F3A446]/20 flex items-center justify-center text-[#F3A446] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#EFEFEF]/80">
                    <strong>Fila de Sincronização Local:</strong> Armazene dezenas de fotos mesmo no subsolo sem sinal móvel.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-[#F3A446]/20 flex items-center justify-center text-[#F3A446] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#EFEFEF]/80">
                    <strong>Geração do PDF de Visita:</strong> Envie o espelho de medidas com aceite assinado na tela pelo cliente.
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => openAuth('demo')}
                  className="px-6 py-3 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-[#A06235]/50 text-[#F3A446] font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2"
                >
                  <span>Testar Módulo de Campo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* FEATURE 3: PARAMETRIC GAMER DESK CATALOG */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#A06235]/20 text-[#F3A446] text-xs font-bold mb-3 border border-[#A06235]/40">
                <Flame className="w-3.5 h-3.5" />
                <span>Móveis Paramétricos & Linha Gamer</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-[#EFEFEF] leading-snug">
                Produtos de Alta Margem Prontos para Vender e Fabricar.
              </h3>
              <p className="mt-4 text-sm sm:text-base text-[#EFEFEF]/70 leading-relaxed">
                Acesse o catálogo com modelos paramétricos testados no mercado (como o Setup Gamer Pro WoodBit). Ajuste dimensões de tampo, cor do acabamento e complementos 3D; o sistema calcula na hora a lista de chapas, fita de borda e custo real de fabricação.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-[#F3A446]/20 flex items-center justify-center text-[#F3A446] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#EFEFEF]/80">
                    <strong>Configurador em Tempo Real:</strong> Alterne entre MDF Carvalho Smoked e Freijó com recálculo instantâneo.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-[#F3A446]/20 flex items-center justify-center text-[#F3A446] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#EFEFEF]/80">
                    <strong>Ordem de Produção Automática:</strong> Envie o projeto configurado direto para a esteira de corte.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-[#F3A446]/20 flex items-center justify-center text-[#F3A446] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#EFEFEF]/80">
                    <strong>Garantia Estrutural:</strong> Dimensionamento testado contra envergamento com vão livre de até 1.80m.
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => openAuth('demo')}
                  className="px-6 py-3 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-[#A06235]/50 text-[#F3A446] font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2"
                >
                  <span>Ver Catálogo Paramétrico</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-[#A06235]/40 shadow-2xl shadow-black">
              <img
                src="/assets/gamer_desk_setup.jpg"
                alt="Setup Gamer minimalista com mesa em madeira nobre usinada e iluminação âmbar"
                className="w-full h-auto object-cover max-h-[440px]"
              />
              <div className="absolute bottom-4 left-4 bg-[#141313]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#EFEFEF]/10 text-[11px] font-mono text-[#F3A446]">
                Linha Gamer WB-01 • Margem Líquida: 48%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOCAL AI ENGINE SPOTLIGHT (GEMMA 4 12B QAT) */}
      <section id="ia-soberana" className="py-20 bg-[#1D1D1D] border-y border-[#A06235]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141313] rounded-3xl p-8 sm:p-12 border border-[#A06235]/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F3A446]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3A446]/20 border border-[#F3A446]/40 text-xs font-extrabold text-[#F3A446] mb-4">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>IA Local Soberana • Gemma 4 12B QAT</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#EFEFEF] leading-tight">
                  Inteligência Artificial Que Roda Dentro da Sua Oficina, Sem Mensalidade de API.
                </h3>
                <p className="mt-4 text-sm sm:text-base text-[#EFEFEF]/70 leading-relaxed">
                  Diferente de sistemas que cobram dólares por tokens consumidos no OpenAI ou Gemini, o WoodBit foi construído para conectar nativamente no <strong>LM Studio ou Ollama</strong> rodando no seu próprio PC.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="p-4 rounded-2xl bg-[#1D1D1D] border border-[#EFEFEF]/10">
                    <div className="text-xs font-bold text-[#F3A446] uppercase">Triagem de WhatsApp</div>
                    <p className="text-xs text-[#EFEFEF]/60 mt-1">
                      Ouve os áudios dos clientes, resume o ambiente pedido e cria o lead no CRM automaticamente.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#1D1D1D] border border-[#EFEFEF]/10">
                    <div className="text-xs font-bold text-[#F3A446] uppercase">Privacidade 100% LGPD</div>
                    <p className="text-xs text-[#EFEFEF]/60 mt-1">
                      Projetos confidenciais de arquitetos e plantas dos clientes nunca saem da sua rede local.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#1D1D1D] rounded-2xl p-6 border border-[#A06235]/30">
                <div className="flex items-center justify-between pb-3 border-b border-[#EFEFEF]/10 text-xs font-mono text-[#EFEFEF]/70">
                  <span>Engine: Localhost:1234</span>
                  <span className="text-[#F3A446] font-bold">Status: Online</span>
                </div>
                <div className="mt-4 font-mono text-xs text-[#EFEFEF]/80 space-y-2.5">
                  <div className="text-[#EFEFEF]/40">// Prompt recebido do WhatsApp:</div>
                  <div className="p-2.5 rounded-lg bg-[#141313] text-[#F3A446] text-[11px]">
                    "Oi Carlos, preciso de um armário em L pro meu quarto em Natividade com porta reflecta e 3 gavetas embutidas..."
                  </div>
                  <div className="text-[#EFEFEF]/40">// Extração Estruturada Gemma 4 (0.42s):</div>
                  <div className="p-2.5 rounded-lg bg-[#141313] text-[#EFEFEF] text-[11px] leading-relaxed">
                    Ambiente: <strong>Quarto Casal</strong><br />
                    Módulos: <strong>Armário em L + 3 gavetas</strong><br />
                    Acabamento: <strong>Vidro Reflecta + Freijó</strong><br />
                    Polo: <strong>Natividade - RJ</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SAAS PRICING TIERS */}
      <section id="planos" className="py-24 bg-[#141313]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3A446]/10 text-[#F3A446] text-xs font-bold uppercase tracking-wider mb-4 border border-[#F3A446]/30">
              Planos Transparentes
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#EFEFEF]">
              Escolha a Escala Certa para o Seu Negócio.
            </h2>
            <p className="mt-4 text-base text-[#EFEFEF]/60">
              Sem taxas escondidas. Comece no período de teste de 14 dias com todas as funcionalidades liberadas.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-[#1D1D1D] border border-[#A06235]/40 text-xs font-bold">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#F3A446] text-[#141313] font-black'
                    : 'text-[#EFEFEF]/70 hover:text-[#EFEFEF]'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#F3A446] text-[#141313] font-black'
                    : 'text-[#EFEFEF]/70 hover:text-[#EFEFEF]'
                }`}
              >
                <span>Anual</span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#141313] text-[#F3A446] text-[10px] font-black">
                  -20% OFF
                </span>
              </button>
            </div>
          </div>

          {/* PRICING CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* PLAN 1: STARTER */}
            <div className="rounded-3xl bg-[#1D1D1D] p-8 border border-[#EFEFEF]/10 hover:border-[#A06235]/40 transition flex flex-col justify-between">
              <div>
                <div className="text-sm font-black text-[#F3A446] uppercase tracking-wider">Marcenaria Starter</div>
                <p className="text-xs text-[#EFEFEF]/60 mt-1">Para oficinas artesanais e marceneiros autônomos.</p>

                <div className="mt-6 mb-6">
                  <span className="text-4xl font-black text-[#EFEFEF]">
                    {billingCycle === 'yearly' ? 'R$ 189' : 'R$ 239'}
                  </span>
                  <span className="text-xs text-[#EFEFEF]/50 ml-1.5">/ mês</span>
                </div>

                <ul className="space-y-3 text-xs text-[#EFEFEF]/80 pb-6 border-b border-[#EFEFEF]/10">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>Até 30 Projetos e OPs simultâneas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>Otimizador de Corte 2D Manual & Nesting</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>Propostas Comerciais A4 e DRE</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>App PWA para Medição em Campo</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openAuth('register')}
                className="w-full mt-6 py-3 rounded-xl bg-[#141313] hover:bg-[#252525] border border-[#EFEFEF]/20 text-xs font-bold text-[#EFEFEF] hover:text-[#F3A446] transition cursor-pointer"
              >
                Testar Starter Grátis
              </button>
            </div>

            {/* PLAN 2: PRO CNC & 3D (FEATURED) */}
            <div className="rounded-3xl bg-gradient-to-b from-[#1D1D1D] to-[#241A14] p-8 border-2 border-[#F3A446] shadow-2xl shadow-[#F3A446]/10 relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#F3A446] text-[#141313] font-black text-xs uppercase tracking-wider shadow-md">
                Mais Escolhido • CNC Ready
              </div>

              <div>
                <div className="text-sm font-black text-[#F3A446] uppercase tracking-wider">Pro CNC & 3D Lab</div>
                <p className="text-xs text-[#EFEFEF]/60 mt-1">Para fábricas e marcenarias digitais de alta produção.</p>

                <div className="mt-6 mb-6">
                  <span className="text-4xl font-black text-[#F3A446]">
                    {billingCycle === 'yearly' ? 'R$ 349' : 'R$ 429'}
                  </span>
                  <span className="text-xs text-[#EFEFEF]/50 ml-1.5">/ mês</span>
                </div>

                <ul className="space-y-3 text-xs text-[#EFEFEF]/90 pb-6 border-b border-[#F3A446]/20">
                  <li className="flex items-center gap-2.5 font-bold text-[#EFEFEF]">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>Projetos Ilimitados & Multiusuário</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>Exportação de G-Code para Router CNC (Mach3/GRBL)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>Visualizador 3D WebGL + Peças de Impressão 3D</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>Gateway de IA Local Soberana (Gemma 4 12B)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>Portal da Transparência do Cliente Final</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openAuth('register')}
                className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F3A446] to-[#A06235] text-[#141313] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#F3A446]/20 hover:brightness-110 transition cursor-pointer"
              >
                Começar 14 Dias no Pro
              </button>
            </div>

            {/* PLAN 3: ENTERPRISE FRANCHISING */}
            <div className="rounded-3xl bg-[#1D1D1D] p-8 border border-[#EFEFEF]/10 hover:border-[#A06235]/40 transition flex flex-col justify-between">
              <div>
                <div className="text-sm font-black text-[#F3A446] uppercase tracking-wider">Rede & Franquias</div>
                <p className="text-xs text-[#EFEFEF]/60 mt-1">Para polos industriais com múltiplos centros de usinagem.</p>

                <div className="mt-6 mb-6">
                  <span className="text-4xl font-black text-[#EFEFEF]">
                    {billingCycle === 'yearly' ? 'R$ 790' : 'R$ 950'}
                  </span>
                  <span className="text-xs text-[#EFEFEF]/50 ml-1.5">/ mês</span>
                </div>

                <ul className="space-y-3 text-xs text-[#EFEFEF]/80 pb-6 border-b border-[#EFEFEF]/10">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>Múltiplos Polos (Ex: Natividade, Itaperuna, etc.)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>Auditoria Completa LGPD com Trilha Forense</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>SLA de Atendimento Dedicado 24/7</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#F3A446] shrink-0" />
                    <span>Banco de Dados SQLite Dedicado e Backup Diário</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openAuth('register')}
                className="w-full mt-6 py-3 rounded-xl bg-[#141313] hover:bg-[#252525] border border-[#EFEFEF]/20 text-xs font-bold text-[#EFEFEF] hover:text-[#F3A446] transition cursor-pointer"
              >
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-[#1D1D1D] border-t border-[#A06235]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#EFEFEF]">
              Perguntas Frequentes de Marceneiros e Empreendedores
            </h2>
            <p className="text-sm text-[#EFEFEF]/60 mt-2">
              Respostas diretas sem termos complicados de TI.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-[#141313] border border-[#EFEFEF]/10 overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-sm text-[#EFEFEF]">{faq.q}</span>
                    <span className="text-[#F3A446] text-xl font-bold shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#EFEFEF]/70 leading-relaxed border-t border-[#EFEFEF]/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION BANNER */}
      <section className="py-20 bg-gradient-to-b from-[#141313] to-[#1D1D1D] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#F3A446]/20 border border-[#F3A446]/40 flex items-center justify-center mx-auto text-[#F3A446] mb-6">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#EFEFEF] tracking-tight">
            Pronto para Transformar Sua Marcenaria em uma Indústria 4.0?
          </h2>
          <p className="mt-4 text-base text-[#EFEFEF]/70 max-w-2xl mx-auto">
            Comece hoje mesmo. Teste o WoodBit com dados reais na sua Router CNC e comprove a economia logo na primeira chapa de MDF usinada.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuth('register')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F3A446] to-[#A06235] text-[#141313] font-black text-sm tracking-wide shadow-xl shadow-[#F3A446]/25 hover:brightness-110 transition cursor-pointer"
            >
              Criar Conta Grátis da Marcenaria (14 Dias)
            </button>
            <button
              onClick={() => openAuth('demo')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#141313] border border-[#F3A446]/50 text-[#F3A446] font-bold text-sm hover:bg-[#141313]/90 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Acesso Imediato sem Cadastro (Demo)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. SAAS FOOTER */}
      <footer className="py-12 bg-[#141313] border-t border-[#1D1D1D] text-xs text-[#EFEFEF]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F3A446] flex items-center justify-center text-[#141313] font-black text-lg">
              W
            </div>
            <div>
              <div className="font-bold text-[#EFEFEF] text-sm">WoodBit ERP & SaaS</div>
              <div>© 2026 WoodBit Soluções Moveleiras Ltda. Polo Noroeste Fluminense.</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium">
            <button onClick={() => openAuth('login')} className="hover:text-[#F3A446] cursor-pointer">
              Login do Marceneiro
            </button>
            <button onClick={() => openAuth('demo')} className="hover:text-[#F3A446] cursor-pointer">
              Demonstração Rápida
            </button>
            <a href="https://github.com/Adriano-Lengruber/WoodBit" target="_blank" rel="noreferrer" className="hover:text-[#F3A446] flex items-center gap-1">
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION & ONBOARDING MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleModalLoginSuccess}
        initialMode={authInitialTab}
      />
    </div>
  );
};
