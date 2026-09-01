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
  HelpCircle,
  Scissors
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

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenNewProject,
  onOpenAiAssistant,
  userRole,
  onChangeRole,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Hoje' },
    { id: 'crm', label: 'Funil & Atendimento', icon: Kanban, badge: '4 leads' },
    { id: 'production', label: 'PCP Produção (CNC/3D)', icon: Hammer, badge: '2 OPs' },
    { id: 'cut_optimizer', label: 'Plano de Corte & Nesting', icon: Scissors, badge: '2D/CNC' },
    { id: 'quotes', label: 'Orçamentos & Margem', icon: FileText },
    { id: 'projects', label: 'Projetos & Ambientes', icon: Layers },
    { id: 'catalog', label: 'Catálogo & Configurador', icon: Boxes, badge: 'Gamer' },
    { id: 'inventory', label: 'Estoque & Reservas', icon: Package },
    { id: 'finance', label: 'Financeiro & Fluxo', icon: DollarSign },
    { id: 'field', label: 'Visita Técnica / Campo', icon: ClipboardCheck },
    { id: 'ai_operations', label: 'AI Gateway & Lab', icon: Cpu, isAi: true },
    { id: 'client_portal', label: 'Portal do Cliente', icon: Globe },
    { id: 'audit', label: 'Auditoria & Logs', icon: History },
  ];

  return (
    <aside
      id="woodbit-sidebar"
      className="w-64 bg-[var(--bg-container)] border-r border-[var(--border-subtle)] flex flex-col justify-between h-screen shrink-0 sticky top-0 z-30 select-none overflow-y-auto transition-colors duration-200"
    >
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fecc93] to-[#c49257] flex items-center justify-center shadow-md text-[#2e1802] font-black text-xl tracking-tight shrink-0">
              W
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg tracking-tight text-[var(--text-main)]">
                  Wood<span className="text-[var(--color-primary)]">Bit</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-primary-container)] text-[var(--color-primary)] font-mono font-bold border border-[var(--border-subtle)]">
                  v2.2
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium leading-none mt-1">
                Marcenaria • CNC • 3D Lab
              </p>
            </div>
          </div>

          {/* New Project CTA */}
          <button
            id="btn-new-project"
            onClick={onOpenNewProject}
            className="convex-btn w-full mt-4 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold cursor-pointer shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Projeto / Orçamento</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--bg-high)] text-[var(--color-primary)] border border-[var(--color-primary)]/30 shadow-xs beveled-card'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-low)] hover:text-[var(--text-main)]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[var(--color-primary)]' : item.isAi ? 'text-[var(--color-tertiary)]' : 'text-[var(--text-faint)]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      item.badge === 'Gamer'
                        ? 'bg-purple-900/30 text-purple-400 border border-purple-600/30'
                        : item.isAi
                        ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)]'
                        : 'bg-[var(--bg-lowest)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile & Role Switcher */}
      <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-low)]/80 space-y-3">
        {/* Quick AI Trigger */}
        <button
          id="btn-sidebar-quick-ai"
          onClick={onOpenAiAssistant}
          className="w-full py-2 px-3 rounded-lg bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/70 flex items-center justify-between text-xs text-[var(--color-primary)] font-semibold transition cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>Assistente IA WoodBit</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-lowest)] text-[10px] text-[var(--text-muted)] font-mono border border-[var(--border-subtle)]">
            Ctrl+K
          </kbd>
        </button>

        {/* Role Switcher (RBAC) */}
        <div className="pt-0.5">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-1 font-medium">
            <span>Papel Operacional (RBAC):</span>
            <span className="font-bold uppercase text-[var(--color-primary)] text-[10px]">
              {userRole}
            </span>
          </div>
          <select
            id="select-user-role"
            value={userRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="w-full bg-[var(--bg-lowest)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs rounded-lg p-2 focus:outline-none focus:border-[var(--color-primary)] font-medium cursor-pointer"
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

        {/* Regional Base Footer */}
        <div className="flex items-center justify-between text-[10px] text-[var(--text-faint)] pt-1 font-mono">
          <span>Natividade • RJ</span>
          <span className="flex items-center gap-1 text-[var(--color-secondary)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse"></span>
            Local-First Online
          </span>
        </div>
      </div>
    </aside>
  );
};
