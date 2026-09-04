import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Clock,
  Hammer,
  Cpu,
  Printer,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  BarChart3,
  Calendar,
  Layers,
  Activity,
  Gauge,
  Zap,
  MapPin,
  Flame,
  Scissors,
  ClipboardCheck,
  Eye
} from 'lucide-react';
import { Lead, Project, Machine, ProductionOrder, FinanceTransaction } from '../../types';

interface DashboardViewProps {
  leads: Lead[];
  projects: Project[];
  machines: Machine[];
  productionOrders: ProductionOrder[];
  finance: FinanceTransaction[];
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  onNavigate: (view: string) => void;
  onOpenProject: (projectId: string) => void;
  onOpenAiAssistant: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  projects,
  machines,
  productionOrders,
  finance,
  selectedCity = 'all',
  onSelectCity,
  onNavigate,
  onOpenProject,
  onOpenAiAssistant,
}) => {
  const [daySummaryTime, setDaySummaryTime] = useState('08:30 (Gemma 4 12B QAT Local)');

  // Filter datasets based on selectedCity
  const filteredProjects = projects.filter((p) => {
    if (selectedCity === 'all') return true;
    return p.city.toLowerCase().includes(selectedCity.toLowerCase());
  });

  const filteredLeads = leads.filter((l) => {
    if (selectedCity === 'all') return true;
    return l.city.toLowerCase().includes(selectedCity.toLowerCase());
  });

  const filteredOrders = productionOrders.filter((op) => {
    if (selectedCity === 'all') return true;
    const matchedProject = projects.find((p) => p.id === op.projectId);
    return (
      matchedProject?.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
      op.customerName.toLowerCase().includes(selectedCity.toLowerCase()) ||
      op.orderNumber.toLowerCase().includes(selectedCity.toLowerCase())
    );
  });

  // Financial calculations
  const totalReceivables = finance
    .filter((f) => f.type === 'receivable' && f.status === 'pending')
    .reduce((sum, f) => sum + f.amount, 0);

  const activeProjectsCount = filteredProjects.filter(
    (p) => p.status === 'production' || p.status === 'technical_visit' || p.status === 'quoting'
  ).length;

  const activeOpsCount = filteredOrders.filter((op) => op.stage !== 'completed').length;

  // City-specific tailored summary
  const getCitySummary = () => {
    if (selectedCity.includes('Natividade')) {
      return {
        title: 'Polo Natividade — Fábrica Sede & Marcenaria Central',
        badge: 'HQ Fábrica',
        text: `Operação central em Natividade: ${activeProjectsCount} projeto(s) ativos e ${activeOpsCount} OP em usinagem. Router CNC operando com chapas de MDF Louro Freijó. Linha de montagem e estoque central com 100% de disponibilidade.`,
      };
    } else if (selectedCity.includes('Itaperuna')) {
      return {
        title: 'Polo Itaperuna — Digital Fab & Linha Gamer Pro',
        badge: 'Hub Itaperuna',
        text: `Operação em Itaperuna: ${activeProjectsCount} projeto(s) e ${activeOpsCount} OP ativa (Setup Gamer Streamer). Peças em filamento PETG fosco sendo impressas no 3D Lab e gravação vetorial CNC aprovada.`,
      };
    } else if (selectedCity.includes('Porciúncula')) {
      return {
        title: 'Polo Porciúncula — Comunicação Visual & Painéis Ripados',
        badge: 'Hub Porciúncula',
        text: `Operação em Porciúncula: ${activeProjectsCount} projeto cadastrado (Letreiro & Painel Ripado Clínica Dr. Roberto). Medição técnica validada e arquivos vetoriais DXF prontos para usinagem.`,
      };
    } else if (selectedCity.includes('Varre-Sai')) {
      return {
        title: 'Polo Varre-Sai — Marcenaria Colonial & Closets',
        badge: 'Hub Varre-Sai',
        text: `Operação em Varre-Sai: ${activeProjectsCount} projeto cadastrado (Closet Master & Home Office). Visita técnica presencial com checklist de prumo a laser aprovado.`,
      };
    }
    return {
      title: 'Resumo Operacional Unificado — Noroeste Fluminense',
      badge: '4 Polos Ativos',
      text: `Visão geral consolidada: ${projects.length} projetos no pipeline e ${productionOrders.length} OPs ativas entre Natividade, Itaperuna, Porciúncula e Varre-Sai. Router CNC Pro operando em 85% de capacidade e o 3D Lab em 55%.`,
    };
  };

  const citySummary = getCitySummary();

  return (
    <div id="dashboard-container" className="space-y-6 max-w-7xl mx-auto">
      {/* City Filter Active Notification Banner */}
      {selectedCity !== 'all' && (
        <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 beveled-card shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] pulse-glow-amber"></span>
            <span className="text-sm font-semibold text-[var(--text-main)]">
              Filtrando polo regional:{' '}
              <strong className="text-[var(--color-primary)] font-bold text-base">{selectedCity} - RJ</strong>{' '}
              ({filteredProjects.length} projetos, {filteredLeads.length} leads, {filteredOrders.length} OPs ativas)
            </span>
          </div>
          {onSelectCity && (
            <button
              onClick={() => onSelectCity('all')}
              className="text-xs text-[var(--color-primary)] hover:underline font-bold self-start sm:self-auto cursor-pointer flex items-center gap-1 bg-[var(--bg-low)] px-3 py-1.5 rounded-lg border border-[var(--color-primary)]/30"
            >
              ✕ Exibir Todos os Polos
            </button>
          )}
        </div>
      )}

      {/* Top Banner: Day Summary by Local AI */}
      <div className="bg-gradient-to-r from-[var(--bg-container)] via-[var(--bg-high)] to-[var(--bg-container)] border border-[var(--color-primary)]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden beveled-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/25 to-[var(--color-primary-container)] border border-[var(--color-primary)]/40 flex items-center justify-center text-[var(--color-primary)] shrink-0 shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-display font-bold text-lg sm:text-xl text-[var(--text-main)]">
                  {citySummary.title}
                </h2>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-secondary-container)] text-[var(--color-secondary)] font-mono font-bold border border-[var(--color-secondary)]/40">
                  {citySummary.badge}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-primary-container)] text-[var(--color-primary)] font-mono font-bold border border-[var(--color-primary)]/40">
                  Gemma 4 12B Local
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-4xl">
                {citySummary.text}
              </p>
              <div className="flex items-center gap-4 text-xs text-[var(--text-faint)] font-mono pt-1">
                <span>Última análise: {daySummaryTime}</span>
                <span>•</span>
                <span className="text-[var(--color-secondary)] flex items-center gap-1.5 font-bold font-sans">
                  <CheckCircle2 className="w-4 h-4" /> 0 Bloqueios Críticos no Chão de Fábrica
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="btn-trigger-ai-advisor"
              onClick={onOpenAiAssistant}
              className="convex-btn px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Copilot Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Projetos Ativos */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-5 cursor-pointer hover:border-[var(--color-primary)]/50 transition-all beveled-card group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--text-muted)]">Projetos em Andamento</span>
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)] group-hover:border-[var(--color-primary)] transition">
              <Layers className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-3xl sm:text-4xl text-[var(--text-main)]">
              {activeProjectsCount}
            </span>
            <span className="text-xs text-[var(--color-secondary)] font-mono font-bold flex items-center bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> {selectedCity === 'all' ? '+4 ativos' : 'Polo ativo'}
            </span>
          </div>
          <p className="text-xs text-[var(--text-faint)] font-mono truncate">
            {selectedCity === 'all' ? 'Natividade • Itaperuna • Porciúncula • Varre-Sai' : `${selectedCity} - RJ`}
          </p>
        </div>

        {/* Card 2: PCP / OPs */}
        <div
          onClick={() => onNavigate('production')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-5 cursor-pointer hover:border-[var(--color-primary)]/50 transition-all beveled-card group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--text-muted)]">Ordens de Produção (PCP)</span>
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-tertiary)] border border-[var(--border-subtle)] group-hover:border-[var(--color-tertiary)] transition">
              <Hammer className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-3xl sm:text-4xl text-[var(--text-main)]">
              {activeOpsCount}
            </span>
            <span className="text-xs text-sky-400 font-mono font-bold bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-500/30">
              Router CNC + 3D
            </span>
          </div>
          <p className="text-xs text-[var(--color-secondary)] flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Cronograma de corte em dia
          </p>
        </div>

        {/* Card 3: A Receber */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-5 cursor-pointer hover:border-[var(--color-primary)]/50 transition-all beveled-card group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--text-muted)]">Contas a Receber</span>
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-emerald-400 border border-[var(--border-subtle)] group-hover:border-emerald-500 transition">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-2xl sm:text-3xl text-emerald-400 font-mono">
              R$ {totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-[var(--text-faint)] font-mono">Fluxo operacional positivo</p>
        </div>

        {/* Card 4: Capacidade Máquinas */}
        <div
          onClick={() => onNavigate('production')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-5 cursor-pointer hover:border-[var(--color-primary)]/50 transition-all beveled-card group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--text-muted)]">Ocupação da Fábrica</span>
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)] group-hover:border-[var(--color-primary)] transition">
              <Gauge className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-3xl sm:text-4xl text-[var(--text-main)]">76%</span>
            <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
              CNC 85% • 3D 55%
            </span>
          </div>
          <p className="text-xs text-[var(--text-faint)] font-mono">Capacidade equilibrada</p>
        </div>
      </div>

      {/* Main Grid: Machine Fleet & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fleet Status & Active Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Machine Fleet Live Monitor */}
          <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-6 beveled-card shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="font-display font-bold text-base text-[var(--text-main)]">
                  Monitor de Telemetria — Centros de Fabricação Digital
                </h3>
              </div>
              <button
                onClick={() => onNavigate('production')}
                className="text-xs text-[var(--color-primary)] font-bold hover:underline flex items-center gap-1 cursor-pointer bg-[var(--bg-low)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]"
              >
                Ver PCP Completo <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machines.slice(0, 4).map((mach) => (
                <div
                  key={mach.id}
                  className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-4 space-y-3 hover:border-[var(--color-primary)]/40 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-main)]">{mach.name}</h4>
                      <span className="text-xs text-[var(--text-faint)] font-mono">{mach.location}</span>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold ${
                        mach.status === 'busy'
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-600/40'
                          : 'bg-emerald-950/70 text-emerald-300 border border-emerald-600/40'
                      }`}
                    >
                      {mach.status === 'busy' ? '● Em Operação' : '○ Disponível'}
                    </span>
                  </div>

                  {mach.currentJob ? (
                    <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)] truncate max-w-[200px] font-semibold">
                          {mach.currentJob.productName}
                        </span>
                        <span className="font-mono text-[var(--color-primary)] font-bold text-sm">
                          {mach.currentJob.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[var(--bg-lowest)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[#fbbf24] rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${mach.currentJob.progressPercent}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[var(--text-faint)] font-mono pt-0.5">
                        <span>Material: {mach.currentJob.material}</span>
                        <span>Fila: {mach.queueLength} OPs</span>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-faint)]">
                      <span>Pronta para novo G-code</span>
                      <span className="text-emerald-400 font-bold">Buffer 100% livre</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects Tracker with Margin & Risk Score */}
          <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-6 beveled-card shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="font-display font-bold text-base text-[var(--text-main)]">
                  Projetos no Pipeline {selectedCity !== 'all' ? `(${selectedCity})` : ''} ({filteredProjects.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-[var(--color-primary)] font-bold hover:underline flex items-center gap-1 cursor-pointer bg-[var(--bg-low)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]"
              >
                Painel de Projetos <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="py-8 text-center bg-[var(--bg-low)] rounded-xl border border-[var(--border-subtle)]">
                <p className="text-sm text-[var(--text-muted)]">Nenhum projeto encontrado para o polo selecionado.</p>
                {onSelectCity && (
                  <button
                    onClick={() => onSelectCity('all')}
                    className="mt-2 text-xs text-[var(--color-primary)] hover:underline font-bold"
                  >
                    Ver todas as cidades
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((prj) => (
                  <div
                    key={prj.id}
                    onClick={() => onOpenProject(prj.id)}
                    className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[var(--color-primary)]/50 transition cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[var(--bg-lowest)] text-[var(--color-primary)] border border-[var(--border-subtle)] font-bold">
                          {prj.code}
                        </span>
                        <h4 className="font-bold text-sm text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition">
                          {prj.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] font-medium">
                        Cliente: <strong className="text-[var(--text-main)]">{prj.customerName}</strong> • {prj.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-5 text-sm">
                      <div>
                        <span className="text-xs text-[var(--text-faint)] block font-medium">Valor Total</span>
                        <span className="font-black text-[var(--text-main)] font-mono text-sm">
                          R$ {prj.totalValue.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-[var(--text-faint)] block font-medium">Margem</span>
                        <span
                          className={`font-black font-mono text-sm ${
                            prj.marginPercent >= 35
                              ? 'text-emerald-400'
                              : prj.marginPercent >= 25
                              ? 'text-[var(--color-primary)]'
                              : 'text-rose-400'
                          }`}
                        >
                          {prj.marginPercent}%
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-[var(--text-faint)] block font-medium">Risco</span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                            prj.riskScore === 'low'
                              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                              : prj.riskScore === 'medium'
                              ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {prj.riskScore}
                        </span>
                      </div>

                      <ArrowUpRight className="w-4 h-4 text-[var(--text-faint)] group-hover:text-[var(--color-primary)] transition" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: CRM Quick Funnel & AI Lead Insights */}
        <div className="space-y-6">
          {/* CRM Quick Funnel Status */}
          <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-6 beveled-card shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[var(--color-primary)]" />
                Funil WhatsApp {selectedCity !== 'all' ? `(${selectedCity})` : ''}
              </h3>
              <button
                onClick={() => onNavigate('crm')}
                className="text-xs text-[var(--color-primary)] font-bold hover:underline cursor-pointer bg-[var(--bg-low)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]"
              >
                Abrir CRM
              </button>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="py-6 text-center text-xs text-[var(--text-faint)]">
                Nenhum lead pendente nesta cidade.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)]">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onNavigate('crm')}
                    className="py-3 flex items-center justify-between cursor-pointer hover:bg-[var(--bg-high)] px-2 rounded-xl transition"
                  >
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-[var(--text-main)] block">
                        {lead.customerName}
                      </span>
                      <span className="text-xs text-[var(--text-faint)] font-medium">
                        {lead.city} •{' '}
                        {lead.productLine === 'gamer'
                          ? 'Setup Gamer'
                          : lead.productLine === 'digital_fab'
                          ? 'Usinagem CNC/3D'
                          : 'Móveis Planejados'}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold ${
                        lead.stage === 'approved'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                          : lead.stage === 'quote_sent'
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                          : 'bg-[var(--bg-high)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {lead.stage}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Margin Guard Notice */}
          <div className="bg-[var(--bg-low)] border border-[var(--color-primary)]/40 rounded-2xl p-5 space-y-2 debossed shadow-sm">
            <div className="flex items-center gap-2 text-[var(--color-primary)]">
              <ShieldCheck className="w-4.5 h-4.5 shrink-0" />
              <h4 className="font-display font-bold text-sm">Política Margin Guard Ativa</h4>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Margem mínima fixada em <strong className="text-[var(--color-primary)] font-bold">25.0%</strong>. Todos os orçamentos emitidos estão em conformidade e validados (Média da fábrica: 40.5%).
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('cut_optimizer')}
              className="p-4 rounded-2xl bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)] text-left transition cursor-pointer shadow-sm group space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-primary)] block group-hover:underline">
                  Plano de Corte 2D
                </span>
                <Scissors className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <span className="text-xs text-[var(--text-faint)] block">Nesting & Aproveitamento</span>
            </button>
            <button
              onClick={() => onNavigate('field')}
              className="p-4 rounded-2xl bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-emerald-500 text-left transition cursor-pointer shadow-sm group space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-400 block group-hover:underline">
                  Visita Técnica
                </span>
                <ClipboardCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-[var(--text-faint)] block">Medição & Visão IA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
