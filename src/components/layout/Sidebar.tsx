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
  Radio,
  ChevronRight,
  ShieldCheck
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
    badgeVariant?: 'amber' | 'sage' | 'wood' | 'neutral';
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
  // Reorganized into 4 strategic operational command hubs
  const sections: NavSection[] = [
    {
      title: 'Atendimento & Projetos',
      items: [
        { id: 'dashboard', label: 'Painel Central', icon: LayoutDashboard, badge: 'Hoje', badgeVariant: 'amber' },
        { id: 'crm', label: 'Funil & Leads WhatsApp', icon: Kanban, badge: '4 leads', badgeVariant: 'amber' },
        { id: 'quotes', label: 'Orçamentos & Margem', icon: FileText },
        { id: 'projects', label: 'Projetos & Ambientes', icon: Layers },
      ],
    },
    {
      title: 'Engenharia & Chão de Fábrica',
      items: [
        { id: 'production', label: 'Usinagem & 3D Lab', icon: Hammer, badge: '2 OPs', badgeVariant: 'sage' },
        { id: 'cut_optimizer', label: 'Plano de Corte 2D', icon: Scissors, badge: 'Nesting', badgeVariant: 'neutral' },
        { id: 'catalog', label: 'Catálogo & Paramétrico', icon: Boxes, badge: 'Gamer', badgeVariant: 'wood' },
        { id: 'field', label: 'Visita Técnica / Campo', icon: ClipboardCheck },
      ],
    },
    {
      title: 'Suprimentos & Controladoria',
      items: [
        { id: 'inventory', label: 'Estoque & Reservas', icon: Package },
        { id: 'finance', label: 'Financeiro & Custos', icon: DollarSign },
        { id: 'client_portal', label: 'Portal da Transparência', icon: Globe },
      ],
    },
    {
      title: 'Inteligência & Governança',
      items: [
        { id: 'ai_operations', label: 'AI Gateway (Gemma 4)', icon: Cpu, isAi: true, badge: '12B QAT', badgeVariant: 'amber' },
        { id: 'audit', label: 'Auditoria & LGPD', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <aside
      id="woodbit-sidebar"
      className="w-72 bg-[var(--bg-container)] border-r border-[var(--border-subtle)] flex flex-col justify-between h-screen shrink-0 sticky top-0 z-30 select-none overflow-y-auto transition-colors duration-200"
    >
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-lowest)]/60">
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#f5c27f] via-[#e8b26e] to-[#94591a] flex items-center justify-center shadow-lg shadow-[#3d2404]/50 text-[#241400] font-black text-2xl tracking-tighter shrink-0 border border-[#ffd8a0]/60">
                W
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--color-secondary)] border-2 border-[var(--bg-container)]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg tracking-tight text-[var(--text-main)]">
                  Wood<span className="text-[var(--color-primary)]">Bit</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary-container)] text-[var(--color-primary)] font-mono font-bold border border-[var(--color-primary)]/30">
                  STUDIO
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono font-medium tracking-wide mt-0.5 flex items-center gap-1.5">
                <span>CNC ROUTER</span> • <span>3D LAB</span> • <span>CAD</span>
              </p>
            </div>
          </div>

          {/* Prominent Golden Action Button */}
          <button
            id="btn-new-project"
            onClick={onOpenNewProject}
            className="convex-btn w-full mt-4 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Projeto / Orçamento</span>
          </button>
        </div>

        {/* Grouped Operational Navigation */}
        <nav className="p-3.5 space-y-5">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between px-3 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] font-mono">
                  {sec.title}
                </span>
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--color-primary-container)]/50 text-[var(--color-primary)] border border-[var(--color-primary)]/40 shadow-sm beveled-card'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-low)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon
                        className={`w-4.5 h-4.5 shrink-0 transition-colors ${
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
                        className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                          item.badgeVariant === 'sage'
                            ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/40'
                            : item.badgeVariant === 'wood'
                            ? 'bg-[var(--bg-high)] text-[var(--color-tertiary)] border border-[var(--color-tertiary)]/30'
                            : item.badgeVariant === 'amber'
                            ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/40'
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
      <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-lowest)]/80 space-y-3 shrink-0">
        {/* Quick AI Trigger */}
        <button
          id="btn-sidebar-quick-ai"
          onClick={onOpenAiAssistant}
          className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/60 flex items-center justify-between text-xs text-[var(--color-primary)] font-bold transition cursor-pointer shadow-xs group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)] group-hover:rotate-12 transition-transform" />
            <span className="text-xs">Copilot Local (Gemma 4)</span>
          </div>
          <kbd className="px-2 py-0.5 rounded bg-[var(--bg-lowest)] text-xs text-[var(--text-muted)] font-mono border border-[var(--border-subtle)] font-bold">
            ⌘K
          </kbd>
        </button>

        {/* Role Switcher (RBAC) */}
        <div className="bg-[var(--bg-low)] p-2.5 rounded-xl border border-[var(--border-subtle)] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
            <span>Perfil Operacional:</span>
            <span className="font-bold uppercase text-[var(--color-primary)] font-mono text-xs">
              {userRole}
            </span>
          </div>
          <select
            id="select-user-role"
            value={userRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="w-full bg-[var(--bg-lowest)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs rounded-lg py-1.5 px-2.5 focus:outline-none focus:border-[var(--color-primary)] font-semibold cursor-pointer"
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
        <div className="flex items-center justify-between text-xs text-[var(--text-faint)] font-mono px-1">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[var(--color-primary)] animate-pulse" />
            Polo Natividade / RJ
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-secondary)] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></span>
            Sync Ativo
          </span>
        </div>
      </div>
    </aside>
  );
};
