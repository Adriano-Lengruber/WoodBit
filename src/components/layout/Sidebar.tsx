import React from 'react';
import {
  LayoutDashboard,
  Kanban,
  Hammer,
  FileText,
  Layers,
  Sparkles,
  Package,
  DollarSign,
  ClipboardCheck,
  Globe,
  History,
  PlusCircle,
  Cpu,
  Boxes,
  Scissors,
  Zap,
  Radio
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  onOpenNewProject: () => void;
  onOpenAiAssistant: () => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeVariant?: 'amber' | 'emerald' | 'purple' | 'neutral';
    isAi?: boolean;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenNewProject,
  onOpenAiAssistant,
  userRole,
  onChangeRole,
}) => {
  const sections: NavSection[] = [
    {
      title: 'VISÃO GERAL',
      items: [
        { id: 'dashboard', label: 'Painel Central', icon: LayoutDashboard, badge: 'Hoje', badgeVariant: 'amber' },
        { id: 'crm', label: 'Funil & Leads', icon: Kanban, badge: '4 leads', badgeVariant: 'amber' },
      ],
    },
    {
      title: 'ENGENHARIA & PCP',
      items: [
        { id: 'production', label: 'Usinagem & 3D Lab', icon: Hammer, badge: '2 OPs', badgeVariant: 'emerald' },
        { id: 'cut_optimizer', label: 'Plano de Corte 2D', icon: Scissors, badge: 'Nesting', badgeVariant: 'neutral' },
        { id: 'catalog', label: 'Catálogo & Paramétrico', icon: Boxes, badge: 'Gamer', badgeVariant: 'purple' },
        { id: 'field', label: 'Visita Técnica / Campo', icon: ClipboardCheck },
      ],
    },
    {
      title: 'COMERCIAL & GESTÃO',
      items: [
        { id: 'quotes', label: 'Orçamentos & Margem', icon: FileText },
        { id: 'projects', label: 'Projetos & Ambientes', icon: Layers },
        { id: 'inventory', label: 'Estoque & Reservas', icon: Package },
        { id: 'finance', label: 'Financeiro & Fluxo', icon: DollarSign },
      ],
    },
    {
      title: 'INTELIGÊNCIA & CLIENTE',
      items: [
        { id: 'ai_operations', label: 'AI Gateway & Lab', icon: Cpu, isAi: true, badge: 'Local', badgeVariant: 'amber' },
        { id: 'client_portal', label: 'Portal do Cliente', icon: Globe },
        { id: 'audit', label: 'Auditoria & Testes', icon: History },
      ],
    },
  ];

  return (
    <aside
      id="woodbit-sidebar"
      className="w-64 bg-[var(--bg-container)] border-r border-[var(--border-subtle)] flex flex-col justify-between h-screen shrink-0 sticky top-0 z-30 select-none overflow-y-auto transition-colors duration-200"
    >
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-lowest)]/40">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5c27f] via-[#cf934b] to-[#7a4812] flex items-center justify-center shadow-lg shadow-[#cf934b]/20 text-[#1a0e02] font-black text-xl tracking-tight shrink-0 border border-[#f5c27f]/40">
                W
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#7dd396] border-2 border-[var(--bg-container)]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base tracking-tight text-[var(--text-main)]">
                  Wood<span className="text-[var(--color-primary)]">Bit</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--color-primary-container)] text-[var(--color-primary)] font-mono font-bold border border-[var(--color-primary)]/20">
                  STUDIO
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider mt-0.5 flex items-center gap-1">
                <span>CNC</span> • <span>3D LAB</span> • <span>CAD</span>
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            id="btn-new-project"
            onClick={onOpenNewProject}
            className="convex-btn w-full mt-3.5 py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Projeto / Orçamento</span>
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav className="p-3 space-y-4">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-faint)] px-2.5 font-bold block mb-1">
                {sec.title}
              </span>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--bg-high)] text-[var(--color-primary)] border border-[var(--color-primary)]/30 shadow-xs beveled-card'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-low)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[var(--color-primary)]'
                            : item.isAi
                            ? 'text-[var(--color-tertiary)]'
                            : 'text-[var(--text-faint)]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                          item.badgeVariant === 'purple'
                            ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                            : item.badgeVariant === 'emerald'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                            : item.badgeVariant === 'amber'
                            ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                            : 'bg-[var(--bg-lowest)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / User Profile & Role Switcher */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-lowest)]/60 space-y-2.5 shrink-0">
        {/* Quick AI Trigger */}
        <button
          id="btn-sidebar-quick-ai"
          onClick={onOpenAiAssistant}
          className="w-full py-2 px-2.5 rounded-lg bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/70 flex items-center justify-between text-xs text-[var(--color-primary)] font-semibold transition cursor-pointer shadow-xs group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)] group-hover:rotate-12 transition-transform" />
            <span className="text-[11px]">Assistente IA Copilot</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-lowest)] text-[9px] text-[var(--text-muted)] font-mono border border-[var(--border-subtle)]">
            ⌘K
          </kbd>
        </button>

        {/* Role Switcher (RBAC) */}
        <div className="bg-[var(--bg-low)] p-2 rounded-lg border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1 font-medium">
            <span>Perfil Operacional:</span>
            <span className="font-bold uppercase text-[var(--color-primary)] text-[9px] font-mono">
              {userRole}
            </span>
          </div>
          <select
            id="select-user-role"
            value={userRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="w-full bg-[var(--bg-lowest)] border border-[var(--border-subtle)] text-[var(--text-main)] text-[11px] rounded-md py-1 px-2 focus:outline-none focus:border-[var(--color-primary)] font-medium cursor-pointer"
          >
            <option value={UserRole.OWNER}>👑 Proprietário / Gestor</option>
            <option value={UserRole.PRODUCTION}>🔨 Gerente de PCP</option>
            <option value={UserRole.OPERATOR}>⚙️ Operador CNC / 3D</option>
            <option value={UserRole.SALES}>💼 Vendas / Atendimento</option>
            <option value={UserRole.INSTALLER}>🚚 Instalador / Campo</option>
            <option value={UserRole.FINANCE}>💰 Financeiro</option>
            <option value={UserRole.CLIENT}>👤 Visão do Cliente</option>
          </select>
        </div>

        {/* Telemetry Status Bar */}
        <div className="flex items-center justify-between text-[10px] text-[var(--text-faint)] pt-0.5 font-mono px-1">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-[var(--color-primary)] animate-pulse" />
            Polo Natividade
          </span>
          <span className="flex items-center gap-1 text-[var(--color-secondary)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)]"></span>
            Sync Ativo
          </span>
        </div>
      </div>
    </aside>
  );
};

