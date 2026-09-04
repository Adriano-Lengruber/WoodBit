import React, { useState } from 'react';
import {
  Hammer,
  Cpu,
  Printer,
  Boxes,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  Smartphone,
  Scissors,
  Layers,
  FileText,
  DollarSign,
  TrendingUp,
  MapPin,
  Camera,
  Play,
  QrCode,
  Lock,
  ChevronRight
} from 'lucide-react';

interface LandingPageViewProps {
  onEnterApp: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterApp }) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'nesting' | 'vision' | '3d' | 'proposal' | 'pcp'>('nesting');

  return (
    <div className="min-h-screen bg-[#141313] text-[#EFEFEF] font-sans selection:bg-[#F3A446] selection:text-[#141313] relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#F3A446]/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-[#A06235]/15 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* 1. Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#141313]/90 backdrop-blur-md border-b border-[#2b2725] px-6 md:px-12 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F3A446] to-[#A06235] text-[#141313] flex items-center justify-center font-black font-mono shadow-md shadow-[#F3A446]/20">
            WB
          </div>
          <div>
            <span className="font-display font-black text-lg tracking-tight text-[#EFEFEF] block leading-none">
              WOODBIT
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F3A446] block mt-1">
              Marcenaria 4.0 • Fabricação Digital
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-[#c8bebe]">
          <a href="#diferenciais" className="hover:text-[#F3A446] transition">Diferenciais</a>
          <a href="#demonstracao" className="hover:text-[#F3A446] transition">Demonstração</a>
          <a href="#tecnologia" className="hover:text-[#F3A446] transition">Tecnologia & IA</a>
          <a href="#chao-de-fabrica" className="hover:text-[#F3A446] transition">Chão de Fábrica</a>
          <a href="#polos" className="hover:text-[#F3A446] transition">Pólos Regionais</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnterApp}
            className="convex-btn px-4 sm:px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[#F3A446]/30 transition"
          >
            <span>Acessar Plataforma</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="px-6 md:px-12 pt-16 md:pt-24 pb-16 max-w-6xl mx-auto text-center space-y-8">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D1D1D] border border-[#A06235]/40 text-xs font-bold text-[#F3A446] shadow-sm animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#F3A446]" />
          <span>Polo de Fabricação Digital • Natividade / Noroeste Fluminense - RJ</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-[#EFEFEF] max-w-4xl mx-auto leading-[1.15]">
          A Inteligência da Indústria 4.0 no Coração da sua{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3A446] via-[#ffba66] to-[#A06235]">
            Marcenaria
          </span>.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-[#c8bebe] max-w-2xl mx-auto leading-relaxed font-medium">
          O primeiro ERP brasileiro que integra <strong>marcenaria fina sob medida</strong>, <strong>Router CNC Nesting</strong> e <strong>impressão 3D</strong>. Elimine o desperdício de chapas de MDF, proteja seu lucro e realize medições na obra com IA 100% local.
        </p>

        {/* Dual Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onEnterApp}
            className="convex-btn px-7 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-2.5 cursor-pointer shadow-xl shadow-[#F3A446]/25 w-full sm:w-auto justify-center"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Entrar no Sistema WoodBit</span>
          </button>

          <a
            href="#demonstracao"
            className="px-6 py-3.5 rounded-2xl text-sm font-bold bg-[#1D1D1D] hover:bg-[#272626] text-[#EFEFEF] border border-[#2b2725] hover:border-[#A06235]/60 transition flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
          >
            <span>Conhecer Funcionalidades</span>
            <ChevronRight className="w-4 h-4 text-[#F3A446]" />
          </a>
        </div>

        {/* Confidence Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8e8383] font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#F3A446]" /> Banco SQLite Nativo Offline
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#F3A446]" /> IA Gemma 4 12B QAT sem custos
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#F3A446]" /> Zero vazamento de fotos na nuvem
          </span>
        </div>
      </section>

      {/* 3. Stat Bar (Impacto Econômico) */}
      <section className="px-6 md:px-12 py-10 border-y border-[#2b2725] bg-[#181717]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="font-display font-black text-3xl md:text-4xl text-[#F3A446] block">
              -28%
            </span>
            <span className="text-xs font-bold text-[#EFEFEF] block uppercase tracking-wider">
              Desperdício de MDF
            </span>
            <span className="text-[11px] text-[#8e8383]">Nesting inteligente com veio de corte</span>
          </div>

          <div className="space-y-1">
            <span className="font-display font-black text-3xl md:text-4xl text-[#EFEFEF] block">
              R$ 0,00
            </span>
            <span className="text-xs font-bold text-[#EFEFEF] block uppercase tracking-wider">
              Custo de Tokens de IA
            </span>
            <span className="text-[11px] text-[#8e8383]">Motor local no LM Studio sem nuvem</span>
          </div>

          <div className="space-y-1">
            <span className="font-display font-black text-3xl md:text-4xl text-[#A06235] block">
              100%
            </span>
            <span className="text-xs font-bold text-[#EFEFEF] block uppercase tracking-wider">
              Offline na Obra
            </span>
            <span className="text-[11px] text-[#8e8383]">PWA no celular com sincronização</span>
          </div>

          <div className="space-y-1">
            <span className="font-display font-black text-3xl md:text-4xl text-[#F3A446] block">
              5 Anos
            </span>
            <span className="text-xs font-bold text-[#EFEFEF] block uppercase tracking-wider">
              Garantia Formal
            </span>
            <span className="text-[11px] text-[#8e8383]">Propostas impressas em folha A4 com PIX</span>
          </div>
        </div>
      </section>

      {/* 4. Interactive Showcase Mockup Section */}
      <section id="demonstracao" className="px-6 md:px-12 py-20 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#EFEFEF]">
            Uma Central Única para o Chão de Fábrica e Vendas
          </h2>
          <p className="text-xs sm:text-sm text-[#c8bebe] max-w-xl mx-auto">
            Explore as principais frentes de trabalho projetadas especificamente para marceneiros e operadores de máquina.
          </p>
        </div>

        {/* Feature Preview Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#1D1D1D] rounded-2xl border border-[#2b2725] max-w-3xl mx-auto text-xs">
          <button
            onClick={() => setActivePreviewTab('nesting')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer ${
              activePreviewTab === 'nesting'
                ? 'bg-[#F3A446] text-[#141313] shadow-md font-extrabold'
                : 'text-[#c8bebe] hover:text-[#EFEFEF]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Nesting 2D</span>
          </button>

          <button
            onClick={() => setActivePreviewTab('vision')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer ${
              activePreviewTab === 'vision'
                ? 'bg-[#F3A446] text-[#141313] shadow-md font-extrabold'
                : 'text-[#c8bebe] hover:text-[#EFEFEF]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>IA na Medição</span>
          </button>

          <button
            onClick={() => setActivePreviewTab('3d')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer ${
              activePreviewTab === '3d'
                ? 'bg-[#F3A446] text-[#141313] shadow-md font-extrabold'
                : 'text-[#c8bebe] hover:text-[#EFEFEF]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Visualizador 3D (STL)</span>
          </button>

          <button
            onClick={() => setActivePreviewTab('proposal')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer ${
              activePreviewTab === 'proposal'
                ? 'bg-[#F3A446] text-[#141313] shadow-md font-extrabold'
                : 'text-[#c8bebe] hover:text-[#EFEFEF]'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Proposta A4</span>
          </button>

          <button
            onClick={() => setActivePreviewTab('pcp')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer ${
              activePreviewTab === 'pcp'
                ? 'bg-[#F3A446] text-[#141313] shadow-md font-extrabold'
                : 'text-[#c8bebe] hover:text-[#EFEFEF]'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Estoque & PCP</span>
          </button>
        </div>

        {/* Mockup Display Box */}
        <div className="bg-[#1D1D1D] border border-[#A06235]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-w-4xl mx-auto">
          {activePreviewTab === 'nesting' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b2725]">
                <div>
                  <span className="font-display font-bold text-base text-[#EFEFEF] block">
                    Otimizador de Plano de Corte 2D & Guilhotina
                  </span>
                  <span className="text-xs text-[#c8bebe]">
                    Chapa MDF Duratex Louro Freijó 18mm (2750 x 1840mm) • Sangria da serra: 3.5mm
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-[#F3A446]/20 text-[#F3A446] border border-[#F3A446]/40 text-xs font-mono font-bold">
                  92.4% Aproveitamento
                </span>
              </div>

              {/* Simulated Sheet Nesting Visual */}
              <div className="bg-[#141313] p-4 rounded-2xl border border-[#2b2725] aspect-video flex flex-col justify-between relative overflow-hidden">
                <div className="grid grid-cols-6 gap-2 h-full">
                  <div className="col-span-3 bg-[#A06235]/40 border border-[#F3A446]/60 rounded-lg p-3 flex flex-col justify-between text-xs">
                    <span className="font-bold text-[#EFEFEF]">Porta Ilha Gourmet (1800 x 600mm)</span>
                    <span className="font-mono text-[10px] text-[#F3A446]">Veio Vertical • MDF 18mm</span>
                  </div>
                  <div className="col-span-2 bg-[#A06235]/30 border border-[#F3A446]/40 rounded-lg p-3 flex flex-col justify-between text-xs">
                    <span className="font-bold text-[#EFEFEF]">Lateral Armário (850 x 580mm)</span>
                    <span className="font-mono text-[10px] text-[#c8bebe]">Fita de borda PUR nos 4 lados</span>
                  </div>
                  <div className="col-span-1 bg-[#1D1D1D] border border-dashed border-[#8e8383] rounded-lg p-2 flex items-center justify-center text-center text-[10px] text-[#8e8383]">
                    Retalho Reaproveitável
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-[#c8bebe] border-t border-[#2b2725] mt-2">
                  <span>Peças programadas: <strong>14 cortes</strong></span>
                  <span className="text-[#F3A446] font-bold">Sobras calculadas para nichos decorativos</span>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'vision' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b2725]">
                <div>
                  <span className="font-display font-bold text-base text-[#EFEFEF] block">
                    Visão Computacional na Obra (IA Gemma 4 12B)
                  </span>
                  <span className="text-xs text-[#c8bebe]">
                    Inspeção de fotos da parede do cliente com detecção automática de interferências
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  IA Local Ativa
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#141313] rounded-xl border border-rose-500/40 space-y-1.5">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    ⚠️ Tomada Fora de Centro
                  </span>
                  <p className="text-[11px] text-[#c8bebe]">
                    Ponto elétrico a 115cm do piso interfere com a bancada. Necessário rebaixo de 5cm.
                  </p>
                </div>
                <div className="p-3 bg-[#141313] rounded-xl border border-amber-500/40 space-y-1.5">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    💧 Tubulação Hidráulica
                  </span>
                  <p className="text-[11px] text-[#c8bebe]">
                    Cano de água fria detectado na parede sul. Exige testeira especial de alinhamento.
                  </p>
                </div>
                <div className="p-3 bg-[#141313] rounded-xl border border-emerald-500/40 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    ✓ Prumo & Esquadro 90º
                  </span>
                  <p className="text-[11px] text-[#c8bebe]">
                    Alinhamento laser aprovado com desvio de apenas 1.2mm no canto esquerdo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === '3d' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b2725]">
                <div>
                  <span className="font-display font-bold text-base text-[#EFEFEF] block">
                    Visualizador 3D Paramétrico & Upload STL/OBJ
                  </span>
                  <span className="text-xs text-[#c8bebe]">
                    Arraste arquivos 3D do seu computador para ver na hora o peso em gramas e custo
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-[#A06235]/40 text-[#F3A446] border border-[#A06235] text-xs font-mono font-bold">
                  Three.js WebGL
                </span>
              </div>

              <div className="bg-[#141313] p-5 rounded-2xl border border-[#2b2725] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-sm">
                  <h4 className="font-bold text-sm text-[#EFEFEF]">Mesa Gamer Modular Streamer WB-01</h4>
                  <p className="text-xs text-[#c8bebe]">
                    Tampo usinado em Router CNC com rebaixo para fita LED COB e passa-fios impressos em 3D em PETG.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded bg-[#1D1D1D] text-[10px] text-[#F3A446] font-mono">1600x800x750mm</span>
                    <span className="px-2 py-0.5 rounded bg-[#1D1D1D] text-[10px] text-emerald-400 font-mono">380g PETG</span>
                  </div>
                </div>

                <div className="bg-[#1D1D1D] p-4 rounded-xl border border-[#A06235]/40 text-center space-y-1 min-w-[200px]">
                  <span className="text-[10px] uppercase font-bold text-[#8e8383] block">Custo Estimado de Impressão</span>
                  <span className="font-mono font-black text-xl text-[#F3A446] block">R$ 38,50</span>
                  <span className="text-[11px] text-[#c8bebe] block">4h 20min na Bambu Lab / Ender</span>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'proposal' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b2725]">
                <div>
                  <span className="font-display font-bold text-base text-[#EFEFEF] block">
                    Emissão de Proposta Comercial Formal em Folha A4
                  </span>
                  <span className="text-xs text-[#c8bebe]">
                    Impressão direta com garantia de 5 anos Blum/Häfele e QR Code PIX de 50% de entrada
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                  PDF Imprimível
                </span>
              </div>

              <div className="p-4 bg-white text-slate-900 rounded-2xl space-y-2.5 text-xs shadow-inner">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-bold text-slate-900 uppercase">WoodBit Marcenaria & Fabricação Digital</span>
                  <span className="font-mono text-amber-800 font-bold">PROP-2026-042 • Natividade - RJ</span>
                </div>
                <div className="flex justify-between">
                  <span>Cozinha & Espaço Gourmet (MDF Louro Freijó + Ferragens Blum)</span>
                  <strong className="font-mono text-slate-900">R$ 18.500,00</strong>
                </div>
                <div className="pt-2 border-t flex justify-between text-[11px] text-slate-600">
                  <span>• 50% Sinal via PIX: R$ 9.250,00</span>
                  <span>• 50% na Montagem: R$ 9.250,00</span>
                  <span className="font-bold text-emerald-800">✓ 5 Anos de Garantia</span>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'pcp' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b2725]">
                <div>
                  <span className="font-display font-bold text-base text-[#EFEFEF] block">
                    Baixa Automática & Reserva Física de Estoque
                  </span>
                  <span className="text-xs text-[#c8bebe]">
                    Sincronização entre chão de fábrica, Router CNC e o almoxarifado de chapas
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  Estoque Sincronizado
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#141313] rounded-xl border border-[#2b2725] space-y-1">
                  <span className="text-[#8e8383] text-[11px] block">MDF Freijó 18mm</span>
                  <span className="font-mono font-bold text-sm text-[#F3A446] block">3 chapas reservadas</span>
                  <span className="text-[10px] text-emerald-400">Saldo atual: 14 chapas</span>
                </div>
                <div className="p-3 bg-[#141313] rounded-xl border border-[#2b2725] space-y-1">
                  <span className="text-[#8e8383] text-[11px] block">Filamento 3D PETG</span>
                  <span className="font-mono font-bold text-sm text-[#F3A446] block">1 carretel reservado</span>
                  <span className="text-[10px] text-emerald-400">Saldo atual: 8 carretéis</span>
                </div>
                <div className="p-3 bg-[#141313] rounded-xl border border-[#2b2725] space-y-1">
                  <span className="text-[#8e8383] text-[11px] block">Dobradiças Blum Slow</span>
                  <span className="font-mono font-bold text-sm text-[#F3A446] block">8 un. reservadas</span>
                  <span className="text-[10px] text-emerald-400">Saldo atual: 48 unidades</span>
                </div>
              </div>
            </div>
          )}

          {/* Action to Enter App */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-[#8e8383]">
              Quer ver esses módulos funcionando com dados reais da sua oficina?
            </span>
            <button
              onClick={onEnterApp}
              className="text-xs font-bold text-[#F3A446] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir no WoodBit ERP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. The 4 Big Pillars of Transformation */}
      <section id="diferenciais" className="px-6 md:px-12 py-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F3A446]">
            Por que Marcenarias Modernas Escolhem o WoodBit
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#EFEFEF]">
            Quatro Pilares que Transformam sua Operação
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-[#1D1D1D] rounded-3xl border border-[#2b2725] hover:border-[#F3A446]/40 transition space-y-3 beveled-card">
            <div className="w-12 h-12 rounded-2xl bg-[#F3A446]/10 text-[#F3A446] flex items-center justify-center border border-[#F3A446]/30">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#EFEFEF]">
              Visão Computacional na Obra do Cliente
            </h3>
            <p className="text-xs sm:text-sm text-[#c8bebe] leading-relaxed">
              O marceneiro fotografa a parede com o celular. O modelo local **Gemma 4 12B Vision** detecta canos, tomadas fora de prumo e desníveis antes de você cortar a primeira peça de MDF. Acabaram os retrabalhos caros na instalação.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-[#1D1D1D] rounded-3xl border border-[#2b2725] hover:border-[#F3A446]/40 transition space-y-3 beveled-card">
            <div className="w-12 h-12 rounded-2xl bg-[#A06235]/20 text-[#F3A446] flex items-center justify-center border border-[#A06235]/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#EFEFEF]">
              Margin Guard: Margem de Lucro Blindada
            </h3>
            <p className="text-xs sm:text-sm text-[#c8bebe] leading-relaxed">
              Diga adeus ao desconto "no chute". O WoodBit calcula centavo por centavo a matéria-prima, fita de borda, horas de CNC e energia. Se o lucro cair abaixo do piso seguro, o sistema trava e avisa o risco.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-[#1D1D1D] rounded-3xl border border-[#2b2725] hover:border-[#F3A446]/40 transition space-y-3 beveled-card">
            <div className="w-12 h-12 rounded-2xl bg-[#F3A446]/10 text-[#F3A446] flex items-center justify-center border border-[#F3A446]/30">
              <Boxes className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#EFEFEF]">
              Chão de Fábrica & Estoque Integrados
            </h3>
            <p className="text-xs sm:text-sm text-[#c8bebe] leading-relaxed">
              Ao criar a Ordem de Produção, as chapas de MDF e ferragens ficam reservadas no almoxarifado. Quando o montador conclui o móvel, a baixa física é automática. O dono sabe o estoque real sem precisar contar chapas.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-[#1D1D1D] rounded-3xl border border-[#2b2725] hover:border-[#F3A446]/40 transition space-y-3 beveled-card">
            <div className="w-12 h-12 rounded-2xl bg-[#A06235]/20 text-[#F3A446] flex items-center justify-center border border-[#A06235]/40">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#EFEFEF]">
              Privacidade Absoluta (Zero Cloud Leak)
            </h3>
            <p className="text-xs sm:text-sm text-[#c8bebe] leading-relaxed">
              Fotos dos quartos e cozinhas dos seus clientes rodam 100% na placa de vídeo da sua oficina via LM Studio. Nenhum dado ou orçamento vaza para servidores de terceiros na internet.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Regional Presence (Noroeste Fluminense) */}
      <section id="polos" className="px-6 md:px-12 py-16 border-t border-[#2b2725] bg-[#181717]">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F3A446]">
              Atendimento Regional de Excelência
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#EFEFEF]">
              Projetado para o Polo do Noroeste Fluminense
            </h2>
            <p className="text-xs sm:text-sm text-[#c8bebe] max-w-xl mx-auto">
              Nascido em Natividade e expandido para as marcenarias e escritórios de arquitetura de toda a região.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-[#1D1D1D] rounded-2xl border border-[#A06235]/50 text-center space-y-1">
              <MapPin className="w-5 h-5 text-[#F3A446] mx-auto" />
              <span className="font-bold text-sm text-[#EFEFEF] block">Natividade</span>
              <span className="text-[11px] text-[#F3A446] font-mono">Sede & Polo Central</span>
            </div>

            <div className="p-4 bg-[#1D1D1D] rounded-2xl border border-[#2b2725] text-center space-y-1">
              <MapPin className="w-5 h-5 text-[#c8bebe] mx-auto" />
              <span className="font-bold text-sm text-[#EFEFEF] block">Itaperuna</span>
              <span className="text-[11px] text-[#8e8383]">Polo Comercial</span>
            </div>

            <div className="p-4 bg-[#1D1D1D] rounded-2xl border border-[#2b2725] text-center space-y-1">
              <MapPin className="w-5 h-5 text-[#c8bebe] mx-auto" />
              <span className="font-bold text-sm text-[#EFEFEF] block">Porciúncula</span>
              <span className="text-[11px] text-[#8e8383]">Instalações Residenciais</span>
            </div>

            <div className="p-4 bg-[#1D1D1D] rounded-2xl border border-[#2b2725] text-center space-y-1">
              <MapPin className="w-5 h-5 text-[#c8bebe] mx-auto" />
              <span className="font-bold text-sm text-[#EFEFEF] block">Varre-Sai</span>
              <span className="text-[11px] text-[#8e8383]">Projetos & Cafés Coloniais</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="px-6 md:px-12 py-20 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#1D1D1D] via-[#241d19] to-[#1D1D1D] border-2 border-[#A06235] p-10 sm:p-14 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F3A446]/10 blur-[80px] pointer-events-none" />

          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#EFEFEF] max-w-2xl mx-auto">
            Pronto para colocar sua marcenaria no próximo nível tecnológico?
          </h2>

          <p className="text-xs sm:text-sm text-[#c8bebe] max-w-lg mx-auto">
            Acesse agora mesmo o WoodBit ERP e experimente a revolução da manufatura digital no seu negócio.
          </p>

          <div className="pt-2">
            <button
              onClick={onEnterApp}
              className="convex-btn px-8 py-4 rounded-2xl text-sm font-black flex items-center gap-3 mx-auto cursor-pointer shadow-xl shadow-[#F3A446]/30"
            >
              <span>Acessar a Plataforma WoodBit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-[#2b2725] bg-[#0c0b0b] px-6 md:px-12 py-8 text-xs text-[#8e8383]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#F3A446] text-[#141313] font-mono font-bold flex items-center justify-center text-[10px]">
              WB
            </div>
            <span className="font-bold text-[#EFEFEF]">WoodBit ERP — Organic Tech</span>
          </div>

          <p className="text-center sm:text-right">
            © 2026 WoodBit Marcenaria & Fabricação Digital Ltda. Polo Natividade - RJ.
          </p>
        </div>
      </footer>
    </div>
  );
};
