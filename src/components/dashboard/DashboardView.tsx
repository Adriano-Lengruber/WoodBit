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
  ShieldAlert,
  BarChart3,
  Calendar,
  Layers
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
  const [daySummaryTime, setDaySummaryTime] = useState('Atualizado hoje às 08:30 (Ollama Local)');

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
        title: 'Polo Natividade — Fábrica Sede & Marcenaria',
        badge: 'Fábrica Central',
        text: `Operação central em Natividade: ${activeProjectsCount} projeto(s) em andamento e ${activeOpsCount} OP ativa (Cozinha Casa Silva). CNC Router Pro operando a plena carga em chapas de MDF Louro Freijó. Linha de montagem e estoque central abastecidos.`,
      };
    } else if (selectedCity.includes('Itaperuna')) {
      return {
        title: 'Polo Itaperuna — Setup Gamer & Digital Fab',
        badge: 'Hub Regional',
        text: `Operação em Itaperuna: ${activeProjectsCount} projeto(s) e ${activeOpsCount} OP ativa (Setup Gamer Streamer). Peças em filamento PETG fosco sendo impressas no 3D Lab e gravação vetorial CNC aprovada.`,
      };
    } else if (selectedCity.includes('Porciúncula')) {
      return {
        title: 'Polo Porciúncula — Comunicação Visual & Clínicas',
        badge: 'Hub Regional',
        text: `Operação em Porciúncula: ${activeProjectsCount} projeto cadastrado (Letreiro & Painel Ripado Clínica Dr. Roberto). Medição técnica validada e arquivos vetoriais DXF prontos para corte em acrílico 5mm.`,
      };
    } else if (selectedCity.includes('Varre-Sai')) {
      return {
        title: 'Polo Varre-Sai — Móveis Coloniais & Closets',
        badge: 'Hub Regional',
        text: `Operação em Varre-Sai: ${activeProjectsCount} projeto cadastrado (Closet Master & Home Office Café Colonial). Visita técnica presencial agendada com checklist de prumo a laser para casarão.`,
      };
    }
    return {
      title: 'Day Summary Operacional — IA WoodBit Consolidado',
      badge: 'Noroeste Fluminense (4 Cidades)',
      text: `Visão geral consolidada: ${projects.length} projetos no pipeline e ${productionOrders.length} OPs ativas distribuídas entre Natividade, Itaperuna, Porciúncula e Varre-Sai. A CNC Router Pro opera em 85% de capacidade e o 3D Lab em 55%. Sem bloqueios críticos de matéria-prima.`,
    };
  };

  const citySummary = getCitySummary();

  return (
    <div id="dashboard-container" className="space-y-6 max-w-7xl mx-auto">
      {/* City Filter Active Notification Banner */}
      {selectedCity !== 'all' && (
        <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 beveled-card shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
            <span className="text-xs font-semibold text-[var(--text-main)]">
              Filtrando polo regional: <strong className="text-[var(--color-primary)] font-bold">{selectedCity} - RJ</strong> ({filteredProjects.length} projeto(s), {filteredLeads.length} lead(s), {filteredOrders.length} OP(s))
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
      <div className="bg-gradient-to-r from-[var(--bg-container)] via-[var(--bg-high)] to-[var(--bg-container)] border border-[var(--color-primary)]/30 rounded-xl p-5 shadow-lg relative overflow-hidden beveled-card">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/35 flex items-center justify-center text-[var(--color-primary)] shrink-0 mt-0.5 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-base text-[var(--text-main)]">
                  {citySummary.title}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-secondary-container)] text-[var(--color-secondary)] font-bold border border-[var(--color-secondary)]/30">
                  {citySummary.badge}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-primary-container)] text-[var(--color-primary)] font-bold border border-[var(--color-primary)]/30">
                  Ollama Local
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed max-w-3xl">
                {citySummary.text}
              </p>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-[var(--text-faint)] font-mono">
                <span>{daySummaryTime}</span>
                <span>•</span>
                <span className="text-[var(--color-secondary)] flex items-center gap-1 font-sans font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 0 Bloqueios Críticos
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="btn-trigger-ai-advisor"
              onClick={onOpenAiAssistant}
              className="convex-btn px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Perguntar ao Assistente</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Projetos Ativos */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-primary)]/50 transition-all group beveled-card shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Projetos em Andamento</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-high)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display font-black text-2xl text-[var(--text-main)]">
              {activeProjectsCount}
            </span>
            <span className="text-[11px] text-[var(--color-secondary)] flex items-center font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" /> {selectedCity === 'all' ? '+4 ativos' : 'Polo ativo'}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-faint)] mt-1 font-mono">
            {selectedCity === 'all' ? 'Natividade, Itaperuna, Porciúncula & Varre-Sai' : `${selectedCity} - RJ`}
          </p>
        </div>

        {/* Card 2: PCP / OPs */}
        <div
          onClick={() => onNavigate('production')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-primary)]/50 transition-all group beveled-card shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">OPs Vinculadas</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-high)] flex items-center justify-center text-[var(--color-tertiary)] border border-[var(--border-subtle)]">
              <Hammer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display font-black text-2xl text-[var(--text-main)]">
              {activeOpsCount}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">Marcenaria & CNC</span>
          </div>
          <p className="text-[11px] text-[var(--color-secondary)] mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3" /> Dentro do cronograma
          </p>
        </div>

        {/* Card 3: A Receber */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-primary)]/50 transition-all group beveled-card shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Contas a Receber</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-high)] flex items-center justify-center text-[var(--color-secondary)] border border-[var(--border-subtle)]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display font-bold text-xl text-[var(--color-secondary)]">
              R$ {totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-faint)] mt-1 font-mono">Fluxo positivo em caixa</p>
        </div>

        {/* Card 4: Capacidade Máquinas */}
        <div
          onClick={() => onNavigate('production')}
          className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-primary)]/50 transition-all group beveled-card shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Ocupação Frota Digital</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-high)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)]">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display font-black text-2xl text-[var(--text-main)]">76%</span>
            <span className="text-[11px] text-[var(--color-primary)] font-mono font-bold">CNC 85% • 3D 55%</span>
          </div>
          <p className="text-[11px] text-[var(--text-faint)] mt-1 font-mono">2 máquinas ativas agora</p>
        </div>
      </div>

      {/* Main Grid: Machine Fleet & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fleet Status & Active Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Machine Fleet Live Monitor */}
          <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-5 beveled-card shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[var(--color-primary)]" />
                <h3 className="font-display font-bold text-sm text-[var(--text-main)]">
                  Monitor da Frota de Máquinas (CNC & 3D)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('production')}
                className="text-xs text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Ver Fila Completa <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {machines.slice(0, 4).map((mach) => (
                <div
                  key={mach.id}
                  className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-3.5 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-[var(--text-main)]">{mach.name}</h4>
                      <span className="text-[11px] text-[var(--text-faint)] font-mono">{mach.location}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        mach.status === 'busy'
                          ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                          : 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/30'
                      }`}
                    >
                      {mach.status === 'busy' ? '● Em Operação' : '○ Disponível'}
                    </span>
                  </div>

                  {mach.currentJob ? (
                    <div className="space-y-1.5 pt-1.5 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-muted)] truncate max-w-[180px] font-medium">
                          {mach.currentJob.productName}
                        </span>
                        <span className="font-mono text-[var(--color-primary)] font-bold">
                          {mach.currentJob.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--bg-lowest)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[#e0b17a] rounded-full transition-all duration-500"
                          style={{ width: `${mach.currentJob.progressPercent}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-faint)] font-mono">
                        <span>Mat: {mach.currentJob.material}</span>
                        <span>Fila: {mach.queueLength} itens</span>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-faint)]">
                      <span>Pronta para novo G-code</span>
                      <span className="text-[var(--color-secondary)] font-medium">Fila limpa</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects Tracker with Margin & Risk Score */}
          <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-5 beveled-card shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--color-primary)]" />
                <h3 className="font-display font-bold text-sm text-[var(--text-main)]">
                  Projetos Ativos {selectedCity !== 'all' ? `em ${selectedCity}` : ''} ({filteredProjects.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Gerenciar Projetos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="py-8 text-center bg-[var(--bg-low)] rounded-xl border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)]">Nenhum projeto encontrado para o polo regional selecionado.</p>
                {onSelectCity && (
                  <button
                    onClick={() => onSelectCity('all')}
                    className="mt-2 text-xs text-[var(--color-primary)] hover:underline font-semibold"
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
                    className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[var(--color-primary)]/50 transition cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-lowest)] text-[var(--color-primary)] border border-[var(--border-subtle)] font-bold">
                          {prj.code}
                        </span>
                        <h4 className="font-semibold text-xs text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition">
                          {prj.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {prj.customerName} • {prj.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-[var(--text-faint)] block">Valor Venda</span>
                        <span className="font-bold text-[var(--text-main)] font-mono">
                          R$ {prj.totalValue.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[var(--text-faint)] block">Margem</span>
                        <span
                          className={`font-bold font-mono ${
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
                        <span className="text-[10px] text-[var(--text-faint)] block">Risco PCP</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
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
          <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-5 beveled-card shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-sm text-[var(--text-main)]">
                Funil de Vendas {selectedCity !== 'all' ? `(${selectedCity})` : ''}
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
              <div className="divide-y divide-[var(--border-subtle)]">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onNavigate('crm')}
                    className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-[var(--bg-high)] px-2 rounded-lg transition"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-[var(--text-main)] block">
                        {lead.customerName}
                      </span>
                      <span className="text-[10px] text-[var(--text-faint)]">
                        {lead.city} • {lead.productLine === 'gamer' ? 'Linha Gamer' : lead.productLine === 'digital_fab' ? 'CNC/3D' : 'Móveis Planejados'}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
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
          <div className="bg-[var(--bg-low)] border border-[var(--color-primary)]/35 rounded-xl p-4 space-y-2 debossed shadow-xs">
            <div className="flex items-center gap-2 text-[var(--color-primary)]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <h4 className="font-display font-bold text-xs">Margin Guard Ativado</h4>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              A política de margem mínima da WoodBit está fixada em <strong className="text-[var(--color-primary)]">25.0%</strong>. Todos os orçamentos emitidos nesta semana encontram-se em conformidade saudável (Média atual: 40.5%).
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onNavigate('catalog')}
              className="p-3 rounded-xl bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/50 text-left transition cursor-pointer shadow-xs group"
            >
              <span className="text-xs font-bold text-[var(--color-primary)] block group-hover:underline">Configurador Gamer</span>
              <span className="text-[10px] text-[var(--text-faint)]">Simular Setup 3D & Preço</span>
            </button>
            <button
              onClick={() => onNavigate('field')}
              className="p-3 rounded-xl bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-secondary)]/50 text-left transition cursor-pointer shadow-xs group"
            >
              <span className="text-xs font-bold text-[var(--color-secondary)] block group-hover:underline">Visita Técnica</span>
              <span className="text-[10px] text-[var(--text-faint)]">Checklist Presencial</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
