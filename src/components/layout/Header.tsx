import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Bell,
  MapPin,
  Moon,
  Sun,
  ShieldCheck,
  Cpu,
  Menu,
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
    },
    {
      id: 'notif-2',
      title: 'Estoque de MDF Freijó Reservado',
      description: '4 chapas bloqueadas com sucesso para o Projeto Silva.',
      time: 'Há 45 min',
      type: 'inventory',
    },
    {
      id: 'notif-3',
      title: 'Orçamento Aprovado via WhatsApp',
      description: 'Lucas Alvim confirmou o Setup Gamer Streamer.',
      time: 'Há 2h',
      type: 'crm',
    },
  ];

  return (
    <header
      id="woodbit-header"
      className="h-16 bg-[var(--bg-container)]/95 backdrop-blur border-b border-[var(--border-subtle)] px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs transition-colors duration-200"
    >
      {/* Left: Mobile menu toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          id="btn-mobile-menu"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-high)] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Buscar projetos, clientes, OPs, materiais ou códigos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[var(--bg-lowest)] border border-[var(--border-subtle)] rounded-lg pl-9 pr-4 py-2 text-xs text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--color-primary)] debossed transition"
          />
        </div>
      </div>

      {/* Right: Actions, Regional Hub, AI Status, Theme & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* City / Hub Selector */}
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/50 text-xs text-[var(--text-muted)] transition shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
          <select
            id="select-city-hub"
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
            className="bg-transparent text-xs text-[var(--text-main)] font-medium focus:outline-none cursor-pointer max-w-[120px] sm:max-w-none"
          >
            <option value="all" className="bg-[var(--bg-container)] text-[var(--text-main)]">
              Todas as Cidades (RJ)
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
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-low)] hover:bg-[var(--bg-high)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)] text-xs font-semibold text-[var(--color-primary)] transition cursor-pointer shadow-xs"
          title="Clique para abrir o assistente de IA WoodBit"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="truncate">IA: Ollama Local-First</span>
          <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse shrink-0"></span>
        </button>

        {/* AI Quick Prompt CTA for Mobile */}
        <button
          id="btn-header-ai-quick"
          onClick={onOpenAiAssistant}
          className="flex sm:hidden p-2 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] text-[var(--color-primary)] cursor-pointer"
          title="Assistente IA"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-high)] relative cursor-pointer transition"
            title="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl shadow-2xl p-3.5 z-50 beveled-card animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="font-display font-semibold text-xs text-[var(--text-main)]">
                  Notificações Operacionais
                </span>
                <span className="text-[10px] text-[var(--color-primary)] font-bold">3 novas</span>
              </div>
              <div className="divide-y divide-[var(--border-subtle)] max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 text-left">
                    <p className="text-xs font-semibold text-[var(--text-main)]">{n.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">{n.description}</p>
                    <span className="text-[10px] text-[var(--text-faint)] font-mono mt-1 block">
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
          className="p-2 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-high)] cursor-pointer transition flex items-center justify-center"
          title={isDarkMode ? 'Alternar para Tema Claro (Artesanal)' : 'Alternar para Tema Escuro (Luxury Noir)'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-[#fecc93] transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-[#94591a] transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>
      </div>
    </header>
  );
};
