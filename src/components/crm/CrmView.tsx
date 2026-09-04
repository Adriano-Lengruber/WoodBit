import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  Sparkles,
  MessageSquare,
  Phone,
  MapPin,
  Send,
  Mic,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  Filter,
  User,
  Clock,
  ExternalLink,
  Calendar,
  Check,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  HelpCircle,
  Flame,
  CheckSquare
} from 'lucide-react';
import { Lead, LeadStage, ProductLine, WhatsAppMessage } from '../../types';

interface CrmViewProps {
  leads: Lead[];
  onUpdateLeads: (leads: Lead[]) => void;
  onCreateProjectFromLead: (lead: Lead) => void;
  selectedCityFilter: string;
}

const STAGES: { id: LeadStage; title: string; color: string; badgeColor: string }[] = [
  { id: 'lead', title: '1. Lead Recebido', color: 'border-l-sky-500', badgeColor: 'bg-sky-950/70 text-sky-300 border-sky-500/30' },
  { id: 'contact', title: '2. Em Contato', color: 'border-l-amber-500', badgeColor: 'bg-amber-950/70 text-amber-300 border-amber-500/30' },
  { id: 'quote_sent', title: '3. Proposta Enviada', color: 'border-l-indigo-500', badgeColor: 'bg-indigo-950/70 text-indigo-300 border-indigo-500/30' },
  { id: 'technical_visit', title: '4. Visita Técnica', color: 'border-l-purple-500', badgeColor: 'bg-purple-950/70 text-purple-300 border-purple-500/30' },
  { id: 'approved', title: '5. Aprovado / Contrato', color: 'border-l-emerald-500', badgeColor: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30' },
];

const WHATSAPP_TEMPLATES = [
  {
    id: 'welcome',
    label: '👋 Boas-vindas',
    getText: (l: Lead) =>
      `Olá, ${l.customerName}! Aqui é da WoodBit Marcenaria e Fabricação Digital (Natividade - RJ). Recebemos seu interesse em ${
        l.productLine === 'gamer'
          ? 'Móveis Gamer Personalizados'
          : l.productLine === 'digital_fab'
          ? 'Usinagem CNC e Impressão 3D'
          : 'Móveis Planejados Sob Medida'
      }. Como podemos te ajudar hoje?`,
  },
  {
    id: 'visit',
    label: '📐 Agendar Medição Presencial',
    getText: (l: Lead) =>
      `Olá, ${l.customerName}! Para garantir a precisão milimétrica do seu projeto em ${l.city}, gostaríamos de agendar uma medição técnica no local com nossa equipe. Qual melhor dia e horário para você esta semana?`,
  },
  {
    id: 'quote',
    label: '📑 Envio de Proposta Técnica',
    getText: (l: Lead) =>
      `Olá, ${l.customerName}! A proposta técnica do seu projeto WoodBit está pronta com o detalhamento dos materiais (MDF premium, ferragens e usinagem). Podemos te apresentar agora?`,
  },
  {
    id: 'followup',
    label: '⏳ Follow-up Proposta',
    getText: (l: Lead) =>
      `Olá, ${l.customerName}! Passando para saber se você conseguiu analisar a proposta do seu projeto ou se ficou com alguma dúvida sobre o plano de corte e prazos de entrega?`,
  },
];

export const CrmView: React.FC<CrmViewProps> = ({
  leads,
  onUpdateLeads,
  onCreateProjectFromLead,
  selectedCityFilter,
}) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);
  const [activeTagFilter, setActiveTagFilter] = useState<string>('all');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [isAiTriaging, setIsAiTriaging] = useState(false);
  const [aiSuggestedReply, setAiSuggestedReply] = useState<string | null>(null);

  // New Lead Form State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerCity, setNewCustomerCity] = useState('Natividade - RJ');
  const [newProductLine, setNewProductLine] = useState<ProductLine>('furniture');
  const [newNotes, setNewNotes] = useState('');
  const [newBudget, setNewBudget] = useState<number | ''>('');

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesTag = activeTagFilter === 'all' || lead.productLine === activeTagFilter;
    const matchesCity =
      selectedCityFilter === 'all' ||
      lead.city.toLowerCase().includes(selectedCityFilter.toLowerCase());
    return matchesTag && matchesCity;
  });

  // Handle Send WhatsApp Message (in-app simulator)
  const handleSendMessage = () => {
    if (!newMessageText.trim() || !selectedLead) return;

    const newMsg: WhatsAppMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      content: newMessageText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedLead: Lead = {
      ...selectedLead,
      messages: [...(selectedLead.messages || []), newMsg],
      updatedAt: new Date().toISOString(),
    };

    const updatedList = leads.map((l) => (l.id === selectedLead.id ? updatedLead : l));
    onUpdateLeads(updatedList);
    setSelectedLead(updatedLead);
    setNewMessageText('');
    setAiSuggestedReply(null);
  };

  // Open direct WhatsApp web/app
  const handleOpenExternalWhatsApp = () => {
    if (!selectedLead) return;
    const cleanPhone = selectedLead.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const textEncoded = encodeURIComponent(
      newMessageText.trim() ||
        `Olá ${selectedLead.customerName}, tudo bem? Aqui é da WoodBit Marcenaria & Fabricação Digital!`
    );
    window.open(`https://wa.me/${phoneWithCountry}?text=${textEncoded}`, '_blank');
  };

  // Run AI Triage
  const handleRunAiTriage = async () => {
    if (!selectedLead) return;
    setIsAiTriaging(true);

    try {
      const response = await fetch('/api/ai/triage-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: selectedLead.customerName,
          text: selectedLead.notes || selectedLead.messages?.[0]?.content || '',
          origin: selectedLead.source,
        }),
      });
      const data = await response.json();
      if (data.triage) {
        const updatedLead: Lead = {
          ...selectedLead,
          aiTriage: data.triage,
        };
        const updatedList = leads.map((l) => (l.id === selectedLead.id ? updatedLead : l));
        onUpdateLeads(updatedList);
        setSelectedLead(updatedLead);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiTriaging(false);
    }
  };

  // Handle Generate AI Reply
  const handleGenerateAiReply = async () => {
    if (!selectedLead) return;
    setIsAiTriaging(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Gere uma resposta de WhatsApp profissional, acolhedora e direta para o cliente ${selectedLead.customerName} (${selectedLead.city}) que solicitou: "${selectedLead.notes}". Pergunte com clareza os pontos pendentes para orçamento de marcenaria ou usinagem.`,
          systemInstruction:
            'Você é a assistente de atendimento comercial da WoodBit Marcenaria e Fabricação Digital em Natividade/RJ. Responda em português brasileiro de forma polida e técnica.',
          preferredProvider: 'lm_studio',
        }),
      });
      const data = await response.json();
      if (data.text) {
        setAiSuggestedReply(data.text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiTriaging(false);
    }
  };

  // Create new lead
  const handleCreateNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      tenantId: 'tenant-woodbit-rj',
      customerName: newCustomerName,
      phone: newCustomerPhone,
      city: newCustomerCity,
      productLine: newProductLine,
      stage: 'lead',
      source: 'whatsapp',
      notes: newNotes,
      budgetEstimate: typeof newBudget === 'number' ? newBudget : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: 'Carlos Marcenaria',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'client',
          content: newNotes || 'Olá! Gostaria de informações sobre projetos sob medida WoodBit.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    const updated = [newLead, ...leads];
    onUpdateLeads(updated);
    setSelectedLead(newLead);
    setShowNewLeadModal(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewNotes('');
    setNewBudget('');
  };

  // Move lead stage
  const handleMoveStage = (leadId: string, newStage: LeadStage) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l));
    onUpdateLeads(updated);
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, stage: newStage });
    }
  };

  // Helper to get next/prev stage
  const getNextStage = (current: LeadStage): LeadStage | null => {
    const idx = STAGES.findIndex((s) => s.id === current);
    if (idx < STAGES.length - 1) return STAGES[idx + 1].id;
    return null;
  };

  const getPrevStage = (current: LeadStage): LeadStage | null => {
    const idx = STAGES.findIndex((s) => s.id === current);
    if (idx > 0) return STAGES[idx - 1].id;
    return null;
  };

  // Helper for product badge styling
  const getProductLineBadge = (line: ProductLine) => {
    switch (line) {
      case 'gamer':
        return {
          label: 'Linha Gamer Pro',
          classes: 'bg-purple-950/80 text-purple-300 border border-purple-500/30',
        };
      case 'digital_fab':
        return {
          label: 'CNC Router & 3D',
          classes: 'bg-sky-950/80 text-sky-300 border border-sky-500/30',
        };
      default:
        return {
          label: 'Móveis Planejados',
          classes: 'bg-amber-950/80 text-amber-300 border border-amber-500/30',
        };
    }
  };

  return (
    <div id="crm-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[var(--bg-container)] border border-[var(--border-subtle)] p-5 rounded-2xl beveled-card shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)]">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
                Funil Comercial & Atendimento WhatsApp
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Triagem com IA Local (Gemma 4 12B QAT), conversão em projetos e histórico omnichannel.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tag filters */}
          <div className="flex items-center bg-[var(--bg-low)] p-1.5 rounded-xl border border-[var(--border-subtle)] text-xs gap-1">
            <button
              onClick={() => setActiveTagFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                activeTagFilter === 'all'
                  ? 'bg-[var(--bg-high)] text-[var(--color-primary)] shadow-xs border border-[var(--color-primary)]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Todos ({leads.length})
            </button>
            <button
              onClick={() => setActiveTagFilter('furniture')}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                activeTagFilter === 'furniture'
                  ? 'bg-[var(--bg-high)] text-[var(--color-primary)] shadow-xs border border-[var(--color-primary)]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Móveis Sob Medida
            </button>
            <button
              onClick={() => setActiveTagFilter('gamer')}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                activeTagFilter === 'gamer'
                  ? 'bg-[var(--bg-high)] text-purple-400 shadow-xs border border-purple-500/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Linha Gamer
            </button>
            <button
              onClick={() => setActiveTagFilter('digital_fab')}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                activeTagFilter === 'digital_fab'
                  ? 'bg-[var(--bg-high)] text-sky-400 shadow-xs border border-sky-500/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              CNC & 3D
            </button>
          </div>

          <button
            id="btn-add-lead"
            onClick={() => setShowNewLeadModal(true)}
            className="convex-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" /> Novo Lead
          </button>
        </div>
      </div>

      {/* Main CRM Grid: Kanban on Left (7 cols), WhatsApp & AI Triage on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Kanban Board */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top 3 Stages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {STAGES.slice(0, 3).map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
              return (
                <div
                  key={stage.id}
                  className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-3.5 flex flex-col space-y-3 min-h-[460px] beveled-card shadow-sm"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
                    <span className="font-display font-bold text-sm text-[var(--text-main)]">
                      {stage.title}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--bg-low)] text-[var(--color-primary)] font-bold border border-[var(--border-subtle)]">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto flex-1 pr-0.5">
                    {stageLeads.map((lead) => {
                      const badge = getProductLineBadge(lead.productLine);
                      const isSelected = selectedLead?.id === lead.id;
                      return (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-2.5 ${
                            isSelected
                              ? 'bg-[var(--bg-high)] border-[var(--color-primary)] shadow-md beveled-card ring-1 ring-[var(--color-primary)]/40'
                              : 'bg-[var(--bg-low)]/70 border-[var(--border-subtle)] hover:border-[var(--color-primary)]/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-sm text-[var(--text-main)] leading-snug">
                              {lead.customerName}
                            </h4>
                            <span className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${badge.classes}`}>
                              {badge.label}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                            {lead.notes}
                          </p>

                          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1.5 border-t border-[var(--border-subtle)]">
                            <span className="flex items-center gap-1.5 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {lead.city}
                            </span>
                            {lead.budgetEstimate && (
                              <span className="font-mono text-emerald-400 font-bold">
                                R$ {lead.budgetEstimate.toLocaleString('pt-BR')}
                              </span>
                            )}
                          </div>

                          {/* Stage Movement Controls */}
                          <div className="flex items-center justify-between pt-1.5 border-t border-[var(--border-subtle)] text-xs">
                            {getPrevStage(lead.stage) ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const prev = getPrevStage(lead.stage);
                                  if (prev) handleMoveStage(lead.id, prev);
                                }}
                                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer font-medium p-1"
                                title="Voltar etapa"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" /> Voltar
                              </button>
                            ) : (
                              <div />
                            )}
                            {getNextStage(lead.stage) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const next = getNextStage(lead.stage);
                                  if (next) handleMoveStage(lead.id, next);
                                }}
                                className="text-[var(--color-primary)] hover:underline font-bold flex items-center gap-1 cursor-pointer p-1"
                                title="Avançar etapa"
                              >
                                Avançar <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {stageLeads.length === 0 && (
                      <div className="text-center py-16 text-xs text-[var(--text-faint)] italic font-medium">
                        Nenhum lead nesta etapa
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom 2 Stages: Visita Técnica & Aprovado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {STAGES.slice(3).map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
              return (
                <div
                  key={stage.id}
                  className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col space-y-3 beveled-card shadow-sm"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
                    <span className="font-display font-bold text-sm text-[var(--text-main)]">
                      {stage.title}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--bg-low)] text-[var(--color-primary)] font-bold border border-[var(--border-subtle)]">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-0.5">
                    {stageLeads.map((lead) => {
                      const isSelected = selectedLead?.id === lead.id;
                      return (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer text-left flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-[var(--bg-high)] border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/40 shadow-sm'
                              : 'bg-[var(--bg-low)]/70 border-[var(--border-subtle)] hover:border-[var(--color-primary)]/50'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-sm text-[var(--text-main)]">
                              {lead.customerName}
                            </h4>
                            <span className="text-xs text-slate-400 block font-medium">
                              {lead.city} • R$ {lead.budgetEstimate ? lead.budgetEstimate.toLocaleString('pt-BR') : 'A orçar'}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCreateProjectFromLead(lead);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-slate-950 text-xs font-bold transition-all cursor-pointer border border-[var(--color-primary)]/40 whitespace-nowrap shadow-xs"
                          >
                            Gerar Projeto →
                          </button>
                        </div>
                      );
                    })}

                    {stageLeads.length === 0 && (
                      <div className="text-center py-6 text-xs text-[var(--text-faint)] italic font-medium">
                        Nenhum lead nesta etapa
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Selected Lead WhatsApp Thread & Local AI Triage Box */}
        <div className="lg:col-span-5 space-y-4">
          {selectedLead ? (
            <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl flex flex-col h-full beveled-card shadow-md overflow-hidden">
              {/* Lead Top Bar */}
              <div className="p-4 bg-[var(--bg-low)] border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-display font-black text-sm flex items-center justify-center shadow-sm">
                    {selectedLead.customerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[var(--text-main)] leading-tight">
                      {selectedLead.customerName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-medium">
                      <span className="text-emerald-400 font-mono font-bold">{selectedLead.phone}</span>
                      <span>•</span>
                      <span>{selectedLead.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenExternalWhatsApp}
                    className="px-3 py-1.5 rounded-xl bg-[var(--bg-high)] hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    title="Abrir WhatsApp Oficial"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> WhatsApp
                  </button>

                  <button
                    onClick={() => onCreateProjectFromLead(selectedLead)}
                    className="convex-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    Gerar Projeto <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Local AI Triage Card (Gemma 4 12B QAT) */}
              <div className="p-4 bg-gradient-to-b from-[#131722] to-[var(--bg-container)] border-b border-[var(--border-subtle)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    Triagem Inteligente (Gemma 4 12B QAT Local)
                  </span>
                  <button
                    onClick={handleRunAiTriage}
                    disabled={isAiTriaging}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-high)] hover:bg-[var(--bg-low)] text-[var(--text-muted)] border border-[var(--border-subtle)] transition-all cursor-pointer font-semibold"
                  >
                    {isAiTriaging ? 'Classificando...' : 'Reclassificar'}
                  </button>
                </div>

                {selectedLead.aiTriage ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between bg-[var(--bg-low)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                      <span className="text-slate-300 font-medium">
                        Visita Presencial:{' '}
                        <strong className={selectedLead.aiTriage.needsTechnicalVisit ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                          {selectedLead.aiTriage.needsTechnicalVisit ? 'Obrigatória (In loco)' : 'Dispensável'}
                        </strong>
                      </span>
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        Confiança: {Math.round(selectedLead.aiTriage.confidence * 100)}%
                      </span>
                    </div>

                    <p className="text-slate-300 italic bg-[var(--bg-low)]/50 p-2.5 rounded-xl border border-[var(--border-subtle)] leading-relaxed">
                      "{selectedLead.aiTriage.preliminaryNotes}"
                    </p>

                    {selectedLead.aiTriage.suggestedQuestions.length > 0 && (
                      <div className="pt-2 border-t border-[var(--border-subtle)]">
                        <span className="text-xs font-bold text-slate-300 block mb-1">
                          Perguntas Sugeridas pela IA:
                        </span>
                        <ul className="space-y-1">
                          {selectedLead.aiTriage.suggestedQuestions.map((q, idx) => (
                            <li
                              key={idx}
                              onClick={() => setNewMessageText(q)}
                              className="text-xs text-amber-300 hover:text-amber-200 bg-[var(--bg-low)] p-2 rounded-lg border border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition-all flex items-start gap-2"
                              title="Clique para usar como mensagem"
                            >
                              <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-[var(--text-muted)] flex items-center justify-between py-2">
                    <span>Nenhuma triagem automatizada gerada ainda.</span>
                    <button
                      onClick={handleRunAiTriage}
                      className="text-[var(--color-primary)] hover:underline font-bold cursor-pointer"
                    >
                      Executar com Gemma 4 →
                    </button>
                  </div>
                )}
              </div>

              {/* Chat Thread */}
              <div className="p-4 flex-1 overflow-y-auto space-y-3 min-h-[260px] max-h-[380px] bg-[var(--bg-lowest)]">
                {selectedLead.messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'client' ? 'items-start' : 'items-end'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'client'
                          ? 'bg-[#151922] border border-slate-800 text-slate-200'
                          : 'bg-gradient-to-br from-[#271b0e] to-[#1a1208] text-amber-100 border border-amber-500/30'
                      }`}
                    >
                      {msg.mediaUrl && (
                        <img
                          src={msg.mediaUrl}
                          alt="Mídia do cliente"
                          className="rounded-xl mb-2 max-h-40 object-cover w-full border border-slate-700/50"
                        />
                      )}
                      <p>{msg.content}</p>
                      <span className="text-xs text-slate-400 block text-right mt-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp Quick Templates */}
              <div className="px-4 py-2.5 bg-[var(--bg-low)] border-t border-[var(--border-subtle)] overflow-x-auto">
                <span className="text-xs text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">
                  Modelos Prontos de WhatsApp:
                </span>
                <div className="flex items-center gap-2">
                  {WHATSAPP_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setNewMessageText(tmpl.getText(selectedLead))}
                      className="px-3 py-1.5 rounded-lg bg-[var(--bg-high)] hover:bg-[var(--color-primary)]/20 text-slate-200 hover:text-amber-300 text-xs font-semibold transition-all whitespace-nowrap border border-[var(--border-subtle)] cursor-pointer"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Suggested Quick Reply */}
              {aiSuggestedReply && (
                <div className="p-3 bg-[var(--bg-high)] border-t border-[var(--color-primary)]/40 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[var(--color-primary)] font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Sugestão de Resposta IA (Gemma 4)
                    </span>
                    <button
                      onClick={() => setAiSuggestedReply(null)}
                      className="text-slate-400 hover:text-slate-200 cursor-pointer text-xs"
                    >
                      Dispensar
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 italic bg-[var(--bg-low)] p-2.5 rounded-xl border border-[var(--border-subtle)] leading-relaxed">
                    {aiSuggestedReply}
                  </p>
                  <button
                    onClick={() => {
                      setNewMessageText(aiSuggestedReply);
                      setAiSuggestedReply(null);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-slate-950 font-bold cursor-pointer hover:bg-amber-400 transition shadow-xs"
                  >
                    Usar esta Resposta no Chat
                  </button>
                </div>
              )}

              {/* Chat Input */}
              <div className="p-3.5 bg-[var(--bg-low)] border-t border-[var(--border-subtle)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleGenerateAiReply}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer font-bold transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Gerar Resposta Automática
                  </button>

                  <select
                    value={selectedLead.stage}
                    onChange={(e) => handleMoveStage(selectedLead.id, e.target.value as LeadStage)}
                    className="bg-[var(--bg-high)] border border-[var(--border-subtle)] text-xs text-slate-200 rounded-lg px-2.5 py-1 cursor-pointer font-medium focus:outline-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        Mover para: {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Digite uma mensagem para o cliente..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] shadow-inner"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-3 rounded-xl bg-[var(--color-primary)] hover:bg-amber-400 text-slate-950 cursor-pointer transition shadow-md font-bold"
                    title="Enviar mensagem"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-12 text-center text-slate-400 text-sm beveled-card">
              Selecione um lead no Kanban para visualizar a conversa e a triagem por IA.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Lead */}
      {showNewLeadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-2xl p-6 max-w-lg w-full beveled-card shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
                <Kanban className="w-5 h-5 text-[var(--color-primary)]" />
                Cadastrar Novo Lead Comercial
              </h3>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer text-base p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewLead} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Nome Completo do Cliente
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Dr. Roberto Salgado"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-sm text-[var(--text-main)] focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    WhatsApp / Telefone
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="(22) 99888-7766"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-sm text-[var(--text-main)] focus:border-[var(--color-primary)] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Polo Regional / Cidade
                  </label>
                  <select
                    value={newCustomerCity}
                    onChange={(e) => setNewCustomerCity(e.target.value)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-sm text-[var(--text-main)] focus:outline-none cursor-pointer"
                  >
                    <option value="Natividade - RJ">Natividade - RJ (Fábrica Sede)</option>
                    <option value="Itaperuna - RJ">Itaperuna - RJ</option>
                    <option value="Porciúncula - RJ">Porciúncula - RJ</option>
                    <option value="Varre-Sai - RJ">Varre-Sai - RJ</option>
                    <option value="Campos dos Goytacazes - RJ">Campos dos Goytacazes - RJ</option>
                    <option value="Bom Jesus do Itabapoana - RJ">Bom Jesus do Itabapoana - RJ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Linha de Produto
                  </label>
                  <select
                    value={newProductLine}
                    onChange={(e) => setNewProductLine(e.target.value as ProductLine)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-sm text-[var(--text-main)] focus:outline-none cursor-pointer"
                  >
                    <option value="furniture">Móveis Planejados Sob Medida</option>
                    <option value="gamer">Linha Gamer Pro Custom</option>
                    <option value="digital_fab">Usinagem CNC & Impressão 3D</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Orçamento Estimado (R$)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 8500"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-sm text-[var(--text-main)] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Briefing Inicial & Necessidades
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Cozinha sob medida com nicho em MDF Louro Freijó, portas em perfil de alumínio preto e bancada para forno embutido..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-sm text-[var(--text-main)] focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-low)] text-xs text-slate-300 hover:text-white cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="convex-btn px-5 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-md"
                >
                  Cadastrar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
