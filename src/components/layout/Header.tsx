import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Bell,
  MapPin,
  Moon,
  Sun,
  Cpu,
  Menu,
  Check,
  Zap
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onOpenAiAssistant: () => void;
  userRole: UserRole;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  onOpenAiAssistant,
  userRole,
  isDarkMode,
  onToggleTheme,
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'OP-2026-042 em Usinagem CNC',
      description: 'Painel da Cozinha Casa Silva atingiu 68% na CNC Router.',
      time: 'Há 12 min',
      type: 'production',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Estoque de MDF Freijó Reservado',
      description: '4 chapas bloqueadas com sucesso para o Projeto Silva.',
      time: 'Há 45 min',
      type: 'inventory',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Orçamento Aprovado via WhatsApp',
      description: 'Lucas Alvim confirmou o Setup Gamer Streamer.',
      time: 'Há 2h',
      type: 'crm',
      unread: false,
    },
  ];

  return (
    <header
      id="woodbit-header"
      className="h-14 bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200"
    >
      {/* Left: Mobile menu toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          id="btn-mobile-menu"
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded-lg bg-[var(--bg-container)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-high)] cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative w-full max-w-md group">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Buscar projetos, clientes, OPs, materiais ou códigos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[var(--bg-lowest)] border border-[var(--border-subtle)] rounded-lg pl-8 pr-8 py-1.5 text-xs text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--color-primary)] transition"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[var(--bg-container)] border border-[var(--border-subtle)] text-[9px] font-mono text-[var(--text-faint)]">
            /
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Regional Hub, AI Status, Theme & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* City / Hub Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40 text-xs text-[var(--text-muted)] transition shadow-xs">
          <MapPin className="w-3 h-3 text-[var(--color-primary)] shrink-0" />
          <select
            id="select-city-hub"
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
            className="bg-transparent text-[11px] text-[var(--text-main)] font-semibold focus:outline-none cursor-pointer max-w-[110px] sm:max-w-none"
          >
            <option value="all" className="bg-[var(--bg-container)] text-[var(--text-main)]">
              Todos os Polos (RJ)
            </option>
            <option value="Natividade" className="bg-[var(--bg-container)] text-[var(--text-main)]">
              Natividade (Sede)
            </option>
            <option value="Itaperuna" className="bg-[var(--bg-container)] text-[var(--text-main)]">
              Itaperuna - RJ
            </option>
            <option value="Porciúncula" className="bg-[var(--bg-container)] text-[var(--text-main)]">
              Porciúncula - RJ
            </option>
            <option value="Varre-Sai" className="bg-[var(--bg-container)] text-[var(--text-main)]">
              Varre-Sai - RJ
            </option>
          </select>
        </div>

        {/* AI Gateway Status Pill */}
        <button
          id="btn-ai-status-pill"
          onClick={onOpenAiAssistant}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-container)] hover:bg-[var(--bg-high)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/50 text-[11px] font-semibold text-[var(--color-primary)] transition cursor-pointer shadow-xs group"
          title="Clique para abrir o assistente de IA WoodBit"
        >
          <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
          <span className="truncate">Copilot IA</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] pulse-glow-emerald shrink-0"></span>
        </button>

        {/* AI Quick Prompt CTA for Mobile */}
        <button
          id="btn-header-ai-quick"
          onClick={onOpenAiAssistant}
          className="flex sm:hidden p-1.5 rounded-lg bg-[var(--bg-container)] border border-[var(--border-subtle)] text-[var(--color-primary)] cursor-pointer"
          title="Assistente IA"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg bg-[var(--bg-container)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-high)] relative cursor-pointer transition"
            title="Notificações"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl shadow-2xl p-3 z-50 beveled-card animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="font-display font-semibold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[var(--color-primary)]" />
                  Notificações Operacionais
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--color-primary-container)] text-[var(--color-primary)] font-mono font-bold">
                  2 novas
                </span>
              </div>
              <div className="divide-y divide-[var(--border-subtle)]/50 max-h-64 overflow-y-auto mt-1">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 text-left group hover:bg-[var(--bg-low)] px-1 rounded transition">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-semibold text-[var(--text-main)]">{n.title}</p>
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0 mt-1"></span>}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">{n.description}</p>
                    <span className="text-[9px] text-[var(--text-faint)] font-mono mt-1 block">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          id="btn-toggle-theme"
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg bg-[var(--bg-container)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-high)] cursor-pointer transition flex items-center justify-center"
          title={isDarkMode ? 'Alternar para Tema Claro (Artesanal)' : 'Alternar para Tema Escuro (Luxury Noir)'}
        >
          {isDarkMode ? (
            <Sun className="w-3.5 h-3.5 text-[#f5c27f] transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-[#94591a] transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>
      </div>
    </header>
  );
};

