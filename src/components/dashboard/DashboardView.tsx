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
  Flame
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
  const [daySummaryTime, setDaySummaryTime] = useState('08:30 (Ollama Local-First)');

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
    return matchedProject?.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
           op.customerName.toLowerCase().includes(selectedCity.toLowerCase()) ||
           op.orderNumber.toLowerCase().includes(selectedCity.toLowerCase());
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
        text: `Operação central em Natividade: ${activeProjectsCount} projeto(s) ativos e ${activeOpsCount} OP em usinagem. CNC Router operando com chapas de MDF Louro Freijó. Linha de montagem e estoque central com 100% de disponibilidade.`,
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
      text: `Visão geral consolidada: ${projects.length} projetos no pipeline e ${productionOrders.length} OPs ativas entre Natividade, Itaperuna, Porciúncula e Varre-Sai. CNC Router Pro operando em 85% de capacidade e o 3D Lab em 55%.`,
    };
  };

  const citySummary = getCitySummary();

  return (
    <div id="dashboard-container" className="space-y-5 max-w-7xl mx-auto">
      {/* City Filter Active Notification Banner */}
      {selectedCity !== 'all' && (
        <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 beveled-card shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] pulse-glow-amber"></span>
            <span className="text-xs font-semibold text-[var(--text-main)]">
              Filtrando polo: <strong className="text-[var(--color-primary)] font-bold">{selectedCity} - RJ</strong> ({filteredProjects.length} projetos, {filteredLeads.length} leads, {filteredOrders.length} OPs)
            </span>
          </div>
          {onSelectCity && (
            <button
              onClick={() => onSelectCity('all')}
              className="text-xs text-[var(--color-primary)] hover:underline font-bold self-start sm:self-auto cursor-pointer"
            >
              ✕ Exibir Todas as Cidades
            </button>
          )}
        </div>
      )}

      {/* Top Banner: Day Summary by Local AI */}
      <div className="bg-gradient-to-r from-[var(--bg-container)] via-[var(--bg-high)] to-[var(--bg-container)] border border-[var(--color-primary)]/25 rounded-xl p-4.5 shadow-xl relative overflow-hidden beveled-card">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shrink-0 mt-0.5 shadow-xs">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-sm sm:text-base text-[var(--text-main)]">
                  {citySummary.title}
                </h2>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--color-secondary-container)] text-[var(--color-secondary)] font-mono font-bold border border-[var(--color-secondary)]/30">
                  {citySummary.badge}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--color-primary-container)] text-[var(--color-primary)] font-mono font-bold border border-[var(--color-primary)]/30">
                  AI Local
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed max-w-3xl">
                {citySummary.text}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--text-faint)] font-mono">
                <span>Ref: {daySummaryTime}</span>
                <span>•</span>
                <span className="text-[var(--color-secondary)] flex items-center gap-1 font-medium font-sans">
                  <CheckCircle2 className="w-3 h-3" /> 0 Bloqueios Críticos
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-trigger-ai-advisor"
              onClick={onOpenAiAssistant}
              className="convex-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Copilot Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Projetos Ativos */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-primary)]/40 transition-all beveled-card group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Projetos em Andamento</span>
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)]">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-display font-black text-2xl text-[var(--text-main)]">
              {activeProjectsCount}
            </span>
            <span className="text-[10px] text-[var(--color-secondary)] font-mono font-bold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> {selectedCity === 'all' ? '+4 ativos' : 'Polo ativo'}
            </span>
          </div>
          <p className="text-[10px] text-[var(--text-faint)] mt-1 font-mono truncate">
            {selectedCity === 'all' ? 'Natividade • Itaperuna • Porciúncula • Varre-Sai' : `${selectedCity} - RJ`}
          </p>
        </div>

        {/* Card 2: PCP / OPs */}
        <div
          onClick={() => onNavigate('production')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-primary)]/40 transition-all beveled-card group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">OPs Vinculadas</span>
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-tertiary)] border border-[var(--border-subtle)]">
              <Hammer className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-display font-black text-2xl text-[var(--text-main)]">
              {activeOpsCount}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Usinagem / CNC</span>
          </div>
          <p className="text-[10px] text-[var(--color-secondary)] mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3" /> Cronograma em dia
          </p>
        </div>

        {/* Card 3: A Receber */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-primary)]/40 transition-all beveled-card group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Contas a Receber</span>
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-secondary)] border border-[var(--border-subtle)]">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-display font-bold text-xl text-[var(--color-secondary)]">
              R$ {totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[10px] text-[var(--text-faint)] mt-1 font-mono">Fluxo de caixa positivo</p>
        </div>

        {/* Card 4: Capacidade Máquinas */}
        <div
          onClick={() => onNavigate('production')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-primary)]/40 transition-all beveled-card group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Ocupação Frota</span>
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)]">
              <Gauge className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-display font-black text-2xl text-[var(--text-main)]">76%</span>
            <span className="text-[10px] text-[var(--color-primary)] font-mono font-bold">CNC 85% • 3D 55%</span>
          </div>
          <p className="text-[10px] text-[var(--text-faint)] mt-1 font-mono">2 centros em usinagem</p>
        </div>
      </div>

      {/* Main Grid: Machine Fleet & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Fleet Status & Active Projects */}
        <div className="lg:col-span-2 space-y-5">
          {/* Machine Fleet Live Monitor */}
          <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4.5 beveled-card shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[var(--color-primary)]" />
                <h3 className="font-display font-bold text-sm text-[var(--text-main)]">
                  Monitor de Telemetria — Centros de Fabricação Digital
                </h3>
              </div>
              <button
                onClick={() => onNavigate('production')}
                className="text-xs text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Ver PCP <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {machines.slice(0, 4).map((mach) => (
                <div
                  key={mach.id}
                  className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-3 space-y-2 hover:border-[var(--color-primary)]/30 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-[var(--text-main)]">{mach.name}</h4>
                      <span className="text-[10px] text-[var(--text-faint)] font-mono">{mach.location}</span>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        mach.status === 'busy'
                          ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                          : 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/30'
                      }`}
                    >
                      {mach.status === 'busy' ? '● Em Operação' : '○ Disponível'}
                    </span>
                  </div>

                  {mach.currentJob ? (
                    <div className="space-y-1.5 pt-1 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-muted)] truncate max-w-[170px] font-medium">
                          {mach.currentJob.productName}
                        </span>
                        <span className="font-mono text-[var(--color-primary)] font-bold">
                          {mach.currentJob.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--bg-lowest)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[#cf934b] rounded-full transition-all duration-500"
                          style={{ width: `${mach.currentJob.progressPercent}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-[var(--text-faint)] font-mono">
                        <span>Material: {mach.currentJob.material}</span>
                        <span>Fila: {mach.queueLength} itens</span>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-faint)]">
                      <span>Pronta para novo G-code</span>
                      <span className="text-[var(--color-secondary)] font-medium">Buffer livre</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects Tracker with Margin & Risk Score */}
          <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4.5 beveled-card shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--color-primary)]" />
                <h3 className="font-display font-bold text-sm text-[var(--text-main)]">
                  Projetos no Pipeline {selectedCity !== 'all' ? `(${selectedCity})` : ''} ({filteredProjects.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Painel Kanban <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="py-6 text-center bg-[var(--bg-low)] rounded-xl border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)]">Nenhum projeto encontrado para o polo selecionado.</p>
                {onSelectCity && (
                  <button
                    onClick={() => onSelectCity('all')}
                    className="mt-1.5 text-xs text-[var(--color-primary)] hover:underline font-semibold"
                  >
                    Ver todas as cidades
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredProjects.map((prj) => (
                  <div
                    key={prj.id}
                    onClick={() => onOpenProject(prj.id)}
                    className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 hover:border-[var(--color-primary)]/40 transition cursor-pointer group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-lowest)] text-[var(--color-primary)] border border-[var(--border-subtle)] font-bold">
                          {prj.code}
                        </span>
                        <h4 className="font-semibold text-xs text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition">
                          {prj.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {prj.customerName} • {prj.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-[9px] text-[var(--text-faint)] block">Valor Venda</span>
                        <span className="font-bold text-[var(--text-main)] font-mono text-xs">
                          R$ {prj.totalValue.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] text-[var(--text-faint)] block">Margem</span>
                        <span
                          className={`font-bold font-mono text-xs ${
                            prj.marginPercent >= 35
                              ? 'text-[var(--color-secondary)]'
                              : prj.marginPercent >= 25
                              ? 'text-[var(--color-primary)]'
                              : 'text-[var(--color-error)]'
                          }`}
                        >
                          {prj.marginPercent}%
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] text-[var(--text-faint)] block">Risco PCP</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                            prj.riskScore === 'low'
                              ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]'
                              : prj.riskScore === 'medium'
                              ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)]'
                              : 'bg-[var(--color-error-container)] text-[var(--color-error)]'
                          }`}
                        >
                          {prj.riskScore}
                        </span>
                      </div>

                      <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--color-primary)] transition" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: CRM Quick Funnel & AI Lead Insights */}
        <div className="space-y-5">
          {/* CRM Quick Funnel Status */}
          <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4.5 beveled-card shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-sm text-[var(--text-main)] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Funil de Atendimento {selectedCity !== 'all' ? `(${selectedCity})` : ''}
              </h3>
              <button
                onClick={() => onNavigate('crm')}
                className="text-xs text-[var(--color-primary)] font-semibold hover:underline cursor-pointer"
              >
                Abrir CRM
              </button>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="py-6 text-center text-xs text-[var(--text-faint)]">
                Nenhum lead pendente nesta cidade.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)]/50">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onNavigate('crm')}
                    className="py-2 flex items-center justify-between cursor-pointer hover:bg-[var(--bg-high)] px-1.5 rounded transition"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-[var(--text-main)] block">
                        {lead.customerName}
                      </span>
                      <span className="text-[10px] text-[var(--text-faint)]">
                        {lead.city} • {lead.productLine === 'gamer' ? 'Linha Gamer' : lead.productLine === 'digital_fab' ? 'CNC/3D' : 'Móveis'}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                        lead.stage === 'approved'
                          ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]'
                          : lead.stage === 'quote_sent'
                          ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)]'
                          : 'bg-[var(--bg-high)] text-[var(--text-muted)]'
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
          <div className="bg-[var(--bg-low)] border border-[var(--color-primary)]/35 rounded-xl p-3.5 space-y-1.5 debossed shadow-xs">
            <div className="flex items-center gap-1.5 text-[var(--color-primary)]">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <h4 className="font-display font-bold text-xs">Margin Guard Ativado</h4>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              Margem mínima fixada em <strong className="text-[var(--color-primary)]">25.0%</strong>. Todos os orçamentos emitidos estão em conformidade (Média atual: 40.5%).
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onNavigate('cut_optimizer')}
              className="p-3 rounded-xl bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/50 text-left transition cursor-pointer shadow-xs group"
            >
              <span className="text-xs font-bold text-[var(--color-primary)] block group-hover:underline">Plano de Corte</span>
              <span className="text-[9px] text-[var(--text-faint)]">Nesting 2D & G-Code</span>
            </button>
            <button
              onClick={() => onNavigate('field')}
              className="p-3 rounded-xl bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-secondary)]/50 text-left transition cursor-pointer shadow-xs group"
            >
              <span className="text-xs font-bold text-[var(--color-secondary)] block group-hover:underline">Visita Técnica</span>
              <span className="text-[9px] text-[var(--text-faint)]">Checklist a Laser</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

