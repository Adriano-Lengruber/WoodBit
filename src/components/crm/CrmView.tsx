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
  ChevronLeft
} from 'lucide-react';
import { Lead, LeadStage, ProductLine, WhatsAppMessage } from '../../types';

interface CrmViewProps {
  leads: Lead[];
  onUpdateLeads: (leads: Lead[]) => void;
  onCreateProjectFromLead: (lead: Lead) => void;
  selectedCityFilter: string;
}

const STAGES: { id: LeadStage; title: string; color: string }[] = [
  { id: 'lead', title: 'Lead Recebido', color: 'border-l-blue-500' },
  { id: 'contact', title: 'Em Contato', color: 'border-l-yellow-500' },
  { id: 'quote_sent', title: 'Orçamento Enviado', color: 'border-l-amber-500' },
  { id: 'technical_visit', title: 'Visita Técnica Agendada', color: 'border-l-purple-500' },
  { id: 'approved', title: 'Aprovado / Contrato', color: 'border-l-emerald-500' },
];

const WHATSAPP_TEMPLATES = [
  {
    id: 'welcome',
    label: '👋 Boas-vindas',
    getText: (l: Lead) =>
      `Olá, ${l.customerName}! Aqui é da WoodBit Marcenaria e Fabricação Digital (Natividade - RJ). Recebemos seu interesse em ${l.productLine === 'gamer' ? 'Móveis Gamer Personalizados' : l.productLine === 'digital_fab' ? 'Usinagem CNC e Impressão 3D' : 'Móveis Planejados Sob Medida'}. Como podemos te ajudar hoje?`,
  },
  {
    id: 'visit',
    label: '📐 Agendar Visita Técnica',
    getText: (l: Lead) =>
      `Olá, ${l.customerName}! Para garantir a precisão milimétrica do seu projeto em ${l.city}, gostaríamos de agendar uma medição técnica no local com nossa equipe. Qual melhor dia e horário para você esta semana?`,
  },
  {
    id: 'quote',
    label: '📑 Envio de Proposta',
    getText: (l: Lead) =>
      `Olá, ${l.customerName}! A proposta técnica do seu projeto WoodBit está pronta com o detalhamento dos materiais (MDF premium, ferragens e usinagem). Podemos te apresentar agora?`,
  },
  {
    id: 'followup',
    label: '⏳ Follow-up',
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
        `Olá ${selectedLead.customerName}, tudo bem? Aqui é da WoodBit Marcenaria!`
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
          prompt: `Gere uma resposta de WhatsApp profissional, acolhedora e direta para o cliente ${selectedLead.customerName} (${selectedLead.city}) que solicitou ${selectedLead.notes}. Pergunte com clareza os pontos pendentes para orçamento.`,
          systemInstruction:
            'Você é a assistente de atendimento comercial da WoodBit Marcenaria e Fabricação Digital em Natividade/RJ.',
          preferredProvider: 'ollama',
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
          content: newNotes || 'Olá! Gostaria de informações sobre produtos e orçamentos WoodBit.',
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

  // Helper to get next stage
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

  return (
    <div id="crm-view-container" className="space-y-5 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-container)] border border-[var(--border-subtle)] p-4 rounded-xl beveled-card">
        <div>
          <h2 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
            <Kanban className="w-5 h-5 text-[var(--color-primary)]" />
            Funil Comercial & Atendimento WhatsApp Oficial
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Gestão integrada de contatos, triagem automática com IA Local e conversão para projetos.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Tag filters */}
          <div className="flex items-center bg-[var(--bg-low)] p-1 rounded-lg border border-[var(--border-subtle)] text-xs">
            <button
              onClick={() => setActiveTagFilter('all')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                activeTagFilter === 'all'
                  ? 'bg-[var(--bg-high)] text-[var(--color-primary)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Todos ({leads.length})
            </button>
            <button
              onClick={() => setActiveTagFilter('furniture')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                activeTagFilter === 'furniture'
                  ? 'bg-[var(--bg-high)] text-[var(--color-primary)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Móveis Sob Medida
            </button>
            <button
              onClick={() => setActiveTagFilter('gamer')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                activeTagFilter === 'gamer'
                  ? 'bg-[var(--bg-high)] text-[var(--color-primary)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Linha Gamer
            </button>
            <button
              onClick={() => setActiveTagFilter('digital_fab')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                activeTagFilter === 'digital_fab'
                  ? 'bg-[var(--bg-high)] text-[var(--color-primary)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              CNC & 3D
            </button>
          </div>

          <button
            id="btn-add-lead"
            onClick={() => setShowNewLeadModal(true)}
            className="convex-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" /> Novo Lead
          </button>
        </div>
      </div>

      {/* Main CRM Grid: Kanban on Left, WhatsApp & AI Triage on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Kanban Board */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STAGES.slice(0, 3).map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
              return (
                <div
                  key={stage.id}
                  className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-3 flex flex-col space-y-3 min-h-[380px]"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                    <span className="font-display font-semibold text-xs text-[var(--text-main)]">
                      {stage.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-low)] text-[var(--color-primary)] font-bold">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto flex-1">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`p-3 rounded-lg border transition cursor-pointer text-left space-y-2 ${
                          selectedLead?.id === lead.id
                            ? 'bg-[var(--bg-high)] border-[var(--color-primary)] shadow-md beveled-card'
                            : 'bg-[var(--bg-low)]/50 border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-xs text-[var(--text-main)]">
                            {lead.customerName}
                          </h4>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                              lead.productLine === 'gamer'
                                ? 'bg-purple-900/30 text-purple-300'
                                : lead.productLine === 'digital_fab'
                                ? 'bg-blue-900/30 text-blue-300'
                                : 'bg-[#644316]/30 text-[var(--color-primary)]'
                            }`}
                          >
                            {lead.productLine}
                          </span>
                        </div>

                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{lead.notes}</p>

                        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[var(--color-primary)]" /> {lead.city}
                          </span>
                          {lead.budgetEstimate && (
                            <span className="font-mono text-[var(--color-secondary)] font-bold">
                              R$ {lead.budgetEstimate.toLocaleString('pt-BR')}
                            </span>
                          )}
                        </div>

                        {/* Quick Move Stage Controls */}
                        <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)] text-[10px]">
                          {getPrevStage(lead.stage) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const prev = getPrevStage(lead.stage);
                                if (prev) handleMoveStage(lead.id, prev);
                              }}
                              className="text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-0.5 cursor-pointer"
                              title="Voltar etapa"
                            >
                              <ChevronLeft className="w-3 h-3" /> Voltar
                            </button>
                          )}
                          <div className="flex-1"></div>
                          {getNextStage(lead.stage) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const next = getNextStage(lead.stage);
                                if (next) handleMoveStage(lead.id, next);
                              }}
                              className="text-[var(--color-primary)] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                              title="Avançar etapa"
                            >
                              Avançar <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="text-center py-10 text-[11px] text-[var(--text-muted)]/50 italic">
                        Nenhum lead nesta etapa
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Row of Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STAGES.slice(3).map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
              return (
                <div
                  key={stage.id}
                  className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-3 flex flex-col space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                    <span className="font-display font-semibold text-xs text-[var(--text-main)]">
                      {stage.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-low)] text-[var(--color-primary)] font-bold">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`p-2.5 rounded-lg border transition cursor-pointer text-left flex items-center justify-between ${
                          selectedLead?.id === lead.id
                            ? 'bg-[var(--bg-high)] border-[var(--color-primary)]'
                            : 'bg-[var(--bg-low)]/50 border-[var(--border-subtle)]'
                        }`}
                      >
                        <div>
                          <h4 className="font-semibold text-xs text-[var(--text-main)]">
                            {lead.customerName}
                          </h4>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {lead.city} • {lead.productLine}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCreateProjectFromLead(lead);
                            }}
                            className="px-2.5 py-1 rounded bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-[#3b2203] text-[11px] font-medium transition cursor-pointer"
                          >
                            Gerar Projeto
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Selected Lead WhatsApp Thread & AI Triage Box */}
        <div className="lg:col-span-5 space-y-4">
          {selectedLead ? (
            <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl flex flex-col h-full beveled-card overflow-hidden">
              {/* Lead Top Bar */}
              <div className="p-3.5 bg-[var(--bg-low)] border-b border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-xs text-[var(--text-main)]">
                      {selectedLead.customerName}
                    </h3>
                    <span className="text-[10px] text-[var(--color-primary)] font-mono font-bold">
                      {selectedLead.phone}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {selectedLead.city} • Origem: WhatsApp Oficial
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenExternalWhatsApp}
                    className="p-1.5 rounded-lg bg-[var(--bg-high)] hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-[#3b2203] border border-[var(--border-subtle)] text-[11px] transition cursor-pointer"
                    title="Abrir no WhatsApp Web / Celular"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onCreateProjectFromLead(selectedLead)}
                    className="convex-btn px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    Gerar Projeto <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* AI Triage Card */}
              <div className="p-3 bg-[var(--bg-low)]/50 border-b border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[var(--color-primary)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Triagem com IA Local (Ollama / WoodBit Core)
                  </span>
                  <button
                    onClick={handleRunAiTriage}
                    disabled={isAiTriaging}
                    className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-high)] hover:bg-[var(--bg-low)] text-[var(--text-muted)] border border-[var(--border-subtle)] transition cursor-pointer"
                  >
                    {isAiTriaging ? 'Classificando...' : 'Reclassificar'}
                  </button>
                </div>

                {selectedLead.aiTriage ? (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-[var(--text-muted)]">
                      <span>
                        Necessita Visita Presencial:{' '}
                        <strong className="text-[var(--color-primary)]">
                          {selectedLead.aiTriage.needsTechnicalVisit ? 'Sim (Obrigatória)' : 'Não'}
                        </strong>
                      </span>
                      <span className="font-mono text-[var(--color-secondary)] font-bold">
                        Confiança: {Math.round(selectedLead.aiTriage.confidence * 100)}%
                      </span>
                    </div>

                    <p className="text-[var(--text-muted)] text-[10px] italic">
                      "{selectedLead.aiTriage.preliminaryNotes}"
                    </p>

                    {selectedLead.aiTriage.suggestedQuestions.length > 0 && (
                      <div className="pt-1 border-t border-[var(--border-subtle)]">
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Perguntas Sugeridas para o Cliente:
                        </span>
                        <ul className="list-disc list-inside text-[10px] text-[var(--color-primary)] space-y-0.5 mt-0.5">
                          {selectedLead.aiTriage.suggestedQuestions.map((q, idx) => (
                            <li key={idx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                    <span>Nenhuma triagem automatizada gerada.</span>
                    <button
                      onClick={handleRunAiTriage}
                      className="text-[var(--color-primary)] hover:underline cursor-pointer"
                    >
                      Executar agora
                    </button>
                  </div>
                )}
              </div>

              {/* Chat Thread */}
              <div className="p-3 flex-1 overflow-y-auto space-y-2.5 min-h-[200px] bg-[var(--bg-container)]">
                {selectedLead.messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'client' ? 'items-start' : 'items-end'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-2.5 rounded-xl text-xs ${
                        msg.sender === 'client'
                          ? 'bg-[var(--bg-low)] border border-[var(--border-subtle)] text-[var(--text-main)]'
                          : 'bg-[#644316]/30 text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                      }`}
                    >
                      {msg.mediaUrl && (
                        <img
                          src={msg.mediaUrl}
                          alt="Mídia do cliente"
                          className="rounded-lg mb-1.5 max-h-32 object-cover w-full border border-black/20"
                        />
                      )}
                      <p>{msg.content}</p>
                      <span className="text-[9px] text-[var(--text-muted)] block text-right mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp Quick Templates */}
              <div className="px-3 py-2 bg-[var(--bg-low)] border-t border-[var(--border-subtle)] overflow-x-auto">
                <span className="text-[10px] text-[var(--text-muted)] block mb-1.5 font-medium">Modelos Rápidos:</span>
                <div className="flex items-center gap-1.5">
                  {WHATSAPP_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setNewMessageText(tmpl.getText(selectedLead))}
                      className="px-2 py-1 rounded bg-[var(--bg-high)] hover:bg-[var(--color-primary)]/20 text-[var(--text-main)] text-[10px] font-medium transition whitespace-nowrap border border-[var(--border-subtle)] cursor-pointer"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Suggested Quick Reply */}
              {aiSuggestedReply && (
                <div className="p-2.5 bg-[var(--bg-high)] border-t border-[var(--color-primary)]/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[var(--color-primary)] text-[11px] font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Sugestão de Resposta IA
                    </span>
                    <button
                      onClick={() => setAiSuggestedReply(null)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                    >
                      Dispensar
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--text-main)] italic bg-[var(--bg-low)] p-2 rounded border border-[var(--border-subtle)]">
                    {aiSuggestedReply}
                  </p>
                  <button
                    onClick={() => {
                      setNewMessageText(aiSuggestedReply);
                      setAiSuggestedReply(null);
                    }}
                    className="text-[10px] px-2 py-1 rounded bg-[var(--color-primary)] text-[#3b2203] font-semibold cursor-pointer"
                  >
                    Usar no Chat
                  </button>
                </div>
              )}

              {/* Chat Input */}
              <div className="p-2.5 bg-[var(--bg-low)] border-t border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleGenerateAiReply}
                    className="text-[10px] text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Sparkles className="w-3 h-3" /> Gerar Resposta com IA
                  </button>

                  <select
                    value={selectedLead.stage}
                    onChange={(e) => handleMoveStage(selectedLead.id, e.target.value as LeadStage)}
                    className="bg-[var(--bg-high)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-main)] rounded px-1.5 py-0.5 cursor-pointer"
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
                    placeholder="Digite a resposta do WhatsApp ou use um modelo acima..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 rounded-lg bg-[var(--color-primary)] hover:bg-[#ebd0a3] text-[#3b2203] cursor-pointer transition"
                    title="Enviar mensagem no chat"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-8 text-center text-[var(--text-muted)] text-xs">
              Selecione um lead para ver o histórico e triagem inteligente.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Lead */}
      {showNewLeadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-5 max-w-md w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-sm text-[var(--text-main)]">
                Cadastrar Novo Lead Comercial
              </h3>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewLead} className="space-y-3">
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Nome do Cliente</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Roberto Salgado"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">WhatsApp / Telefone</label>
                  <input
                    required
                    type="text"
                    placeholder="(22) 99888-7766"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Cidade / Região</label>
                  <select
                    value={newCustomerCity}
                    onChange={(e) => setNewCustomerCity(e.target.value)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)]"
                  >
                    <option value="Natividade - RJ">Natividade - RJ</option>
                    <option value="Itaperuna - RJ">Itaperuna - RJ</option>
                    <option value="Porciúncula - RJ">Porciúncula - RJ</option>
                    <option value="Campos dos Goytacazes - RJ">Campos dos Goytacazes - RJ</option>
                    <option value="Varre-Sai - RJ">Varre-Sai - RJ</option>
                    <option value="Bom Jesus do Itabapoana - RJ">Bom Jesus do Itabapoana - RJ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Linha de Produto</label>
                  <select
                    value={newProductLine}
                    onChange={(e) => setNewProductLine(e.target.value as ProductLine)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)]"
                  >
                    <option value="furniture">Móveis Sob Medida</option>
                    <option value="gamer">Linha Gamer Custom</option>
                    <option value="digital_fab">CNC Router & Impressão 3D</option>
                    <option value="service">Serviços / Usinagem</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Orçamento Estimado (R$)</label>
                  <input
                    type="number"
                    placeholder="Ex: 8500"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Notas / Briefing do Projeto</label>
                <textarea
                  rows={3}
                  placeholder="Ex: Armários de cozinha em MDF Freijó com puxadores cava e iluminação LED embutida..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-low)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="convex-btn px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
