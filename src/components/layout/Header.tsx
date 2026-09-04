import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Bell,
  MapPin,
  Moon,
  Sun,
  Menu,
  CheckCircle2,
  Radio,
  BookOpen
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onOpenAiAssistant: () => void;
  onOpenHelp?: () => void;
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
  onOpenHelp,
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
      description: 'Painel da Cozinha Casa Silva atingiu 68% na Router CNC Pro.',
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
      className="h-16 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-5 md:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200"
    >
      {/* Left: Mobile menu toggle & Global Workbench Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          id="btn-mobile-menu"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-[var(--bg-container)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-high)] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Buscar projetos, clientes, OPs, chapas MDF ou códigos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[var(--bg-lowest)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-9 py-2 text-sm text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--color-primary)] transition"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-[var(--bg-container)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-faint)]">
            /
          </kbd>
        </div>
      </div>

      {/* Right: Regional Hub, AI Status, Theme & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* City / Hub Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/50 text-xs text-[var(--text-muted)] transition shadow-xs">
          <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
          <select
            id="select-city-hub"
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
            className="bg-transparent text-xs text-[var(--text-main)] font-bold focus:outline-none cursor-pointer max-w-[120px] sm:max-w-none"
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

        {/* AI Local Engine Status Badge */}
        <button
          onClick={onOpenAiAssistant}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--color-primary-container)]/80 text-[var(--color-primary)] border border-[var(--color-primary)]/40 hover:bg-[var(--color-primary-container)] transition cursor-pointer text-xs font-bold"
          title="Gemma 4 12B QAT ativo localmente no LM Studio"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)] animate-pulse" />
          <span>Gemma 4 Local</span>
        </button>

        {/* User Manual & Help Modal Button */}
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-container)] hover:bg-[var(--bg-high)] text-[var(--color-primary)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/50 transition cursor-pointer text-xs font-bold shadow-xs"
            title="Abrir Manual do Usuário & Guia Prático WoodBit"
          >
            <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="hidden sm:inline">Manual</span>
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/50 text-[var(--text-main)] transition cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] pulse-glow-amber"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl bg-[var(--bg-container)] border border-[var(--border-subtle)] shadow-2xl z-50 p-4 space-y-3 beveled-card animate-in fade-in">
              <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
                <span className="font-display font-bold text-sm text-[var(--text-main)]">
                  Notificações de Chão de Fábrica
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary-container)] text-[var(--color-primary)] font-bold">
                  2 não lidas
                </span>
              </div>
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition ${
                      n.unread
                        ? 'bg-[var(--bg-low)] border-[var(--color-primary)]/30'
                        : 'bg-[var(--bg-lowest)] border-[var(--border-subtle)] opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[var(--text-main)]">{n.title}</span>
                      <span className="text-xs text-[var(--text-faint)] font-mono">{n.time}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          id="btn-theme-toggle"
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-[var(--bg-container)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/50 text-[var(--text-main)] transition cursor-pointer"
          title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
          {isDarkMode ? <Sun className="w-4.5 h-4.5 text-[var(--color-primary)]" /> : <Moon className="w-4.5 h-4.5 text-[#574639]" />}
        </button>
      </div>
    </header>
  );
};
