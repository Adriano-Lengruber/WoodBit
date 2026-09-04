import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Sparkles,
  ShieldAlert,
  Sliders,
  DollarSign,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Send,
  Layers,
  FileSpreadsheet,
  QrCode,
  FileCheck,
  Share2,
  Copy,
  Check,
  MapPin,
  FileDown,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Percent,
  Calculator,
  Hammer
} from 'lucide-react';
import { Quote, QuoteItem, ProductLine, Project } from '../../types';
import { useToast } from '../../context/ToastContext';

interface QuotesViewProps {
  quotes: Quote[];
  projects?: Project[];
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  onUpdateQuotes: (quotes: Quote[]) => void;
  onOpenVoiceAssistant: () => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({
  quotes,
  projects = [],
  selectedCity = 'all',
  onSelectCity,
  onUpdateQuotes,
  onOpenVoiceAssistant,
}) => {
  const { showToast } = useToast();

  // Filter quotes by city if selected
  const filteredQuotes = quotes.filter((q) => {
    if (selectedCity === 'all') return true;
    const proj = projects.find((p) => p.id === q.projectId || p.title === q.projectTitle);
    if (!proj) return true;
    return proj.city.toLowerCase() === selectedCity.toLowerCase();
  });

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(
    filteredQuotes[0] || quotes[0] || null
  );
  const [whatIfPriceAdjustment, setWhatIfPriceAdjustment] = useState<number>(0);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // Helper to get city for quote
  const getQuoteCity = (q: Quote) => {
    const proj = projects.find((p) => p.id === q.projectId || p.title === q.projectTitle);
    return proj?.city || 'Natividade';
  };

  // New item form
  const [newItemRoom, setNewItemRoom] = useState('Cozinha');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<QuoteItem['category']>('mdf');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('chapa');
  const [newItemCost, setNewItemCost] = useState(250);
  const [newItemMarkup, setNewItemMarkup] = useState(1.6);

  // Add Item to active quote
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    const totalCost = newItemQty * newItemCost;
    const unitPrice = newItemCost * newItemMarkup;
    const totalPrice = newItemQty * unitPrice;

    const newItem: QuoteItem = {
      id: `qi-${Date.now()}`,
      roomName: newItemRoom,
      description: newItemDesc,
      category: newItemCategory,
      quantity: newItemQty,
      unit: newItemUnit,
      unitCost: newItemCost,
      totalCost,
      markup: newItemMarkup,
      unitPrice,
      totalPrice,
    };

    const newItems = [...selectedQuote.items, newItem];
    const newTotalCost = newItems.reduce((sum, item) => sum + item.totalCost, 0);
    const newTotalPrice = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const newMargin = Math.round(((newTotalPrice - newTotalCost) / newTotalPrice) * 1000) / 10;

    const updatedQuote: Quote = {
      ...selectedQuote,
      items: newItems,
      totalCost: newTotalCost,
      totalPrice: newTotalPrice,
      marginPercent: newMargin,
      isBelowMinimumMargin: newMargin < selectedQuote.minimumMarginRequired,
    };

    const updatedList = quotes.map((q) => (q.id === selectedQuote.id ? updatedQuote : q));
    onUpdateQuotes(updatedList);
    setSelectedQuote(updatedQuote);
    setShowAddItemModal(false);
    setNewItemDesc('');
    showToast('Item Adicionado ao Orçamento!', `${newItem.description} inserido com sucesso.`, 'success');
  };

  // What-if simulator calculations
  const simPrice = selectedQuote ? selectedQuote.totalPrice * (1 + whatIfPriceAdjustment / 100) : 0;
  const simMargin =
    selectedQuote && simPrice > 0
      ? Math.round(((simPrice - selectedQuote.totalCost) / simPrice) * 1000) / 10
      : 0;
  const simProfit = selectedQuote ? simPrice - selectedQuote.totalCost : 0;

  const handleCopyWhatsApp = () => {
    if (!selectedQuote) return;
    const msg = `Olá ${selectedQuote.customerName}! Segue a proposta detalhada da WoodBit Marcenaria & Fabricação Digital para o projeto *${selectedQuote.projectTitle}* no valor de R$ ${selectedQuote.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} com prazo estimado de ${selectedQuote.estimatedProductionDays} dias úteis.`;
    try {
      navigator.clipboard.writeText(msg);
      showToast('Texto Copiado para o WhatsApp!', 'Abra a conversa do cliente e cole a proposta.', 'success');
    } catch (e) {
      showToast('Proposta pronta para envio!', msg.slice(0, 60) + '...', 'info');
    }
  };

  const handleConfirmPixPayment = () => {
    if (!selectedQuote) return;
    const updated = quotes.map((q) =>
      q.id === selectedQuote.id ? { ...q, status: 'approved' as const } : q
    );
    onUpdateQuotes(updated);
    setSelectedQuote({ ...selectedQuote, status: 'approved' });
    setShowPixModal(false);
    showToast(
      'Sinal Confirmado via PIX!',
      `Entrada de 50% registrada para o projeto ${selectedQuote.projectTitle}.`,
      'success'
    );
  };

  const handleSendContract = () => {
    setShowContractModal(false);
    showToast(
      'Minuta de Contrato Enviada!',
      'Link com assinatura eletrônica enviado ao WhatsApp do cliente.',
      'success'
    );
  };

  // Category labels helper
  const getCategoryBadge = (cat: QuoteItem['category']) => {
    switch (cat) {
      case 'mdf':
        return { label: 'MDF / Chapas', color: 'bg-amber-950/70 text-amber-300 border-amber-500/30' };
      case 'hardware':
        return { label: 'Ferragens', color: 'bg-slate-800/80 text-slate-300 border-slate-600/30' };
      case 'cnc_service':
        return { label: 'Usinagem CNC', color: 'bg-sky-950/70 text-sky-300 border-sky-500/30' };
      case 'print_3d':
        return { label: 'Impressão 3D', color: 'bg-purple-950/70 text-purple-300 border-purple-500/30' };
      case 'labor':
        return { label: 'Mão de Obra', color: 'bg-indigo-950/70 text-indigo-300 border-indigo-500/30' };
      case 'led_electronics':
        return { label: 'LED / Elétrica', color: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30' };
      default:
        return { label: 'Outros', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  // Calculate Cost Breakdown by Category for selected quote
  const costBreakdown = selectedQuote
    ? selectedQuote.items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.totalCost;
        return acc;
      }, {} as Record<string, number>)
    : {};

  return (
    <div id="quotes-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-5 rounded-2xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)] shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
              Orçamentos & Engenharia de Preços
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Composição de custos (MDF, CNC, 3D, Mão de Obra), proteção Margin Guard e simulador What-If.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-voice-to-quote"
            onClick={onOpenVoiceAssistant}
            className="px-4 py-2 rounded-xl bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[var(--color-primary)] border border-[var(--color-primary)]/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            Orçamento por Voz (IA Local)
          </button>
        </div>
      </div>

      {/* Regional Filter Indicator */}
      {selectedCity !== 'all' && (
        <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-3.5 px-4 flex items-center justify-between gap-3 beveled-card shadow-xs text-xs">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-[var(--text-main)] font-medium">
              Exibindo propostas do polo: <strong className="text-[var(--color-primary)] font-bold">{selectedCity} - RJ</strong>
            </span>
          </div>
          {onSelectCity && (
            <button
              onClick={() => onSelectCity('all')}
              className="text-[var(--color-primary)] hover:underline font-bold cursor-pointer"
            >
              ✕ Exibir Todas as Cidades
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Quotes List (4 cols) & Detail / Margin Guard (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Quotes List */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Propostas Emitidas ({filteredQuotes.length})
            </h3>
          </div>

          <div className="space-y-3">
            {filteredQuotes.map((q) => {
              const quoteCity = getQuoteCity(q);
              const isSelected = selectedQuote?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setSelectedQuote(q);
                    setWhatIfPriceAdjustment(0);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2.5 ${
                    isSelected
                      ? 'bg-[var(--bg-high)] border-[var(--color-primary)] shadow-md beveled-card ring-1 ring-[var(--color-primary)]/40'
                      : 'bg-[var(--bg-container)] border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--color-primary)] bg-[var(--bg-lowest)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
                          {q.quoteNumber} (v{q.version})
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--bg-low)] text-slate-300 border border-[var(--border-subtle)] font-medium">
                          {quoteCity}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[var(--text-main)] mt-1.5 leading-snug">
                        {q.projectTitle}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] font-medium">{q.customerName}</p>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        q.status === 'approved'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : q.status === 'sent'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-emerald-400 font-bold font-mono text-sm">
                      R$ {q.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                        q.isBelowMinimumMargin
                          ? 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      Margem: {q.marginPercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Quotation Detail, Breakdown & Margin Guard Simulator */}
        <div className="lg:col-span-8 space-y-6">
          {selectedQuote ? (
            <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-6 beveled-card shadow-md space-y-6">
              {/* Top Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-base font-bold text-[var(--color-primary)]">
                      {selectedQuote.quoteNumber}
                    </span>
                    <h3 className="font-display font-bold text-base text-[var(--text-main)]">
                      {selectedQuote.projectTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
                    Cliente: <strong className="text-slate-200">{selectedQuote.customerName}</strong> • Prazo Estimado:{' '}
                    <strong className="text-slate-200">{selectedQuote.estimatedProductionDays} dias úteis</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowPixModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                    title="Gerar chave e QR Code PIX de entrada (50%)"
                  >
                    <QrCode className="w-4 h-4" /> PIX Entrada
                  </button>

                  <button
                    onClick={() => setShowContractModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[var(--color-primary)] border border-[var(--color-primary)]/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                    title="Emitir contrato formal com assinatura digital"
                  >
                    <FileCheck className="w-4 h-4" /> Contrato
                  </button>

                  <button
                    onClick={handleCopyWhatsApp}
                    className="px-3 py-1.5 rounded-xl bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-slate-200 border border-[var(--border-subtle)] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                    title="Copiar texto para WhatsApp"
                  >
                    <Share2 className="w-4 h-4 text-emerald-400" /> WhatsApp
                  </button>

                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="convex-btn px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Item
                  </button>
                </div>
              </div>

              {/* Margin Guard Status Alert */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                  selectedQuote.isBelowMinimumMargin
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {selectedQuote.isBelowMinimumMargin ? (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-sm block">
                      {selectedQuote.isBelowMinimumMargin
                        ? 'Alerta Margin Guard: Margem Abaixo do Piso Operacional!'
                        : 'Margin Guard: Orçamento em Plena Conformidade'}
                    </span>
                    <span className="text-xs opacity-90 block mt-0.5">
                      Margem atual: <strong>{selectedQuote.marginPercent}%</strong> | Mínimo exigido pela oficina:{' '}
                      <strong>{selectedQuote.minimumMarginRequired}%</strong>
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-black/40 border border-white/10">
                  {selectedQuote.isBelowMinimumMargin ? 'RISCO DETECTADO' : 'APROVADO'}
                </span>
              </div>

              {/* Cost Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-[var(--bg-low)] border border-[var(--border-subtle)] p-4 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-[var(--text-muted)] block uppercase tracking-wider">
                    Custo Matéria-Prima
                  </span>
                  <span className="font-bold font-mono text-[var(--text-main)] text-lg block">
                    R$ {selectedQuote.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-[var(--text-faint)]">MDF, ferragens, fresas</span>
                </div>

                <div className="bg-[var(--bg-low)] border border-[var(--border-subtle)] p-4 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-[var(--text-muted)] block uppercase tracking-wider">
                    Preço de Venda
                  </span>
                  <span className="font-bold font-mono text-emerald-400 text-lg block">
                    R$ {selectedQuote.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-emerald-500/80">Valor final ao cliente</span>
                </div>

                <div className="bg-[var(--bg-low)] border border-[var(--border-subtle)] p-4 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-[var(--text-muted)] block uppercase tracking-wider">
                    Lucro Bruto
                  </span>
                  <span className="font-bold font-mono text-[var(--color-primary)] text-lg block">
                    R$ {(selectedQuote.totalPrice - selectedQuote.totalCost).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-xs text-[var(--text-faint)]">Margem líquida bruta</span>
                </div>

                <div className="bg-[var(--bg-low)] border border-[var(--border-subtle)] p-4 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-[var(--text-muted)] block uppercase tracking-wider">
                    Margem Efetiva
                  </span>
                  <span className="font-bold font-mono text-amber-400 text-lg block">
                    {selectedQuote.marginPercent}%
                  </span>
                  <span className="text-xs text-[var(--text-faint)]">
                    Piso: {selectedQuote.minimumMarginRequired}%
                  </span>
                </div>
              </div>

              {/* Visual Cost Composition Bar Chart */}
              <div className="space-y-2 bg-[var(--bg-low)] p-4 rounded-xl border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-amber-400" />
                    Composição Visual de Custos do Orçamento
                  </span>
                  <span className="font-mono text-slate-400">
                    Custo R$ {selectedQuote.totalCost.toLocaleString('pt-BR')} (
                    {Math.round((selectedQuote.totalCost / selectedQuote.totalPrice) * 100)}%) + Lucro (
                    {selectedQuote.marginPercent}%)
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
                  {(Object.entries(costBreakdown) as [string, number][]).map(([cat, val], i) => {
                    const pct = Math.max(2, Math.round((Number(val) / selectedQuote.totalPrice) * 100));
                    const colors = [
                      'bg-amber-500',
                      'bg-sky-500',
                      'bg-purple-500',
                      'bg-indigo-500',
                      'bg-slate-400',
                    ];
                    return (
                      <div
                        key={cat}
                        className={`${colors[i % colors.length]} transition-all duration-300`}
                        style={{ width: `${pct}%` }}
                        title={`${cat}: R$ ${Number(val).toFixed(2)} (${pct}%)`}
                      />
                    );
                  })}
                  <div
                    className="bg-emerald-500 transition-all duration-300"
                    style={{ width: `${selectedQuote.marginPercent}%` }}
                    title={`Lucro Bruto: ${selectedQuote.marginPercent}%`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-slate-400 font-medium">
                  {(Object.entries(costBreakdown) as [string, number][]).map(([cat, val], i) => {
                    const badge = getCategoryBadge(cat as any);
                    return (
                      <div key={cat} className="flex items-center gap-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            ['bg-amber-500', 'bg-sky-500', 'bg-purple-500', 'bg-indigo-500', 'bg-slate-400'][
                              i % 5
                            ]
                          }`}
                        ></span>
                        <span>
                          {badge.label}:{' '}
                          <strong className="text-slate-200">R$ {Number(val).toFixed(0)}</strong>
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-1.5 ml-auto text-emerald-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Lucro: {selectedQuote.marginPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--color-primary)]" />
                  Composição de Itens & Insumos Detalhados ({selectedQuote.items.length})
                </h4>

                <div className="overflow-x-auto border border-[var(--border-subtle)] rounded-xl shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--bg-low)] text-slate-400 uppercase font-bold text-xs border-b border-[var(--border-subtle)]">
                      <tr>
                        <th className="p-3">Item / Ambiente</th>
                        <th className="p-3">Categoria</th>
                        <th className="p-3 text-center">Quantidade</th>
                        <th className="p-3 text-right">Custo Unit.</th>
                        <th className="p-3 text-center">Markup</th>
                        <th className="p-3 text-right">Total de Venda</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-container)]">
                      {selectedQuote.items.map((item) => {
                        const catBadge = getCategoryBadge(item.category);
                        return (
                          <tr key={item.id} className="hover:bg-[var(--bg-low)]/70 transition-colors">
                            <td className="p-3">
                              <span className="font-bold text-sm text-[var(--text-main)] block leading-snug">
                                {item.description}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">{item.roomName}</span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`text-xs px-2.5 py-0.5 rounded-md font-bold uppercase ${catBadge.color}`}
                              >
                                {catBadge.label}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-center font-semibold text-slate-200">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="p-3 font-mono text-right text-slate-400 font-medium">
                              R$ {item.unitCost.toFixed(2)}
                            </td>
                            <td className="p-3 font-mono text-center text-amber-400 font-bold">
                              {item.markup}x
                            </td>
                            <td className="p-3 font-mono font-bold text-right text-emerald-400 text-sm">
                              R$ {item.totalPrice.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* What-If Pricing Simulator */}
              <div className="bg-gradient-to-br from-[var(--bg-low)] to-[var(--bg-container)] border border-[var(--color-primary)]/40 p-5 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-high)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[var(--text-main)]">
                        Simulador "What-If Pricing"
                      </h4>
                      <p className="text-xs text-[var(--text-muted)]">
                        Simulação em tempo real de desconto ou ágio sem alterar a proposta original.
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-mono text-amber-400 font-bold bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-500/30">
                    Ajuste: {whatIfPriceAdjustment > 0 ? `+${whatIfPriceAdjustment}%` : `${whatIfPriceAdjustment}%`}
                  </span>
                </div>

                <input
                  type="range"
                  min="-20"
                  max="30"
                  step="1"
                  value={whatIfPriceAdjustment}
                  onChange={(e) => setWhatIfPriceAdjustment(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)] cursor-pointer h-2 bg-slate-800 rounded-lg"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-[var(--border-subtle)] text-xs">
                  <div className="bg-[var(--bg-lowest)] p-3 rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-[var(--text-muted)] block uppercase tracking-wider">
                      Preço Simulado
                    </span>
                    <span className="font-bold text-[var(--text-main)] font-mono text-base block mt-0.5">
                      R$ {simPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="bg-[var(--bg-lowest)] p-3 rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-[var(--text-muted)] block uppercase tracking-wider">
                      Nova Margem Efetiva
                    </span>
                    <span
                      className={`font-bold font-mono text-base block mt-0.5 ${
                        simMargin >= 25 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {simMargin}%
                    </span>
                  </div>

                  <div className="bg-[var(--bg-lowest)] p-3 rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-[var(--text-muted)] block uppercase tracking-wider">
                      Novo Lucro Bruto
                    </span>
                    <span className="font-bold text-amber-400 font-mono text-base block mt-0.5">
                      R$ {simProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-16 text-center text-slate-400 text-sm beveled-card">
              Selecione um orçamento na lista para visualizar a composição de custos e margem de contribuição.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Quote Item */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-2xl p-6 max-w-lg w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[var(--color-primary)]" />
                Adicionar Item ao Orçamento
              </h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Descrição do Item / Peça
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Chapa MDF Louro Freijó 18mm (Arauco)"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Ambiente do Projeto
                  </label>
                  <input
                    type="text"
                    value={newItemRoom}
                    onChange={(e) => setNewItemRoom(e.target.value)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Categoria
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    <option value="mdf">MDF / Chapas</option>
                    <option value="hardware">Ferragens & Corrediças</option>
                    <option value="cnc_service">Usinagem CNC Router</option>
                    <option value="print_3d">Impressão 3D PETG/PLA</option>
                    <option value="labor">Mão de Obra Marcenaria</option>
                    <option value="led_electronics">LED & Eletrônica</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Custo Unit. (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Markup Multiplicador
                  </label>
                  <input
                    type="number"
                    min="1.0"
                    step="0.1"
                    value={newItemMarkup}
                    onChange={(e) => setNewItemMarkup(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="convex-btn px-5 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-md"
                >
                  Adicionar ao Orçamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: PIX Down Payment (50%) */}
      {showPixModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[var(--bg-container)] border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full beveled-card shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                Cobrança PIX — Sinal de Entrada (50%)
              </h3>
              <button
                onClick={() => setShowPixModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-4 p-4 bg-[var(--bg-low)] rounded-2xl border border-[var(--border-subtle)]">
              <div className="bg-white p-4 rounded-xl inline-block shadow-md">
                <div className="w-40 h-40 border-2 border-slate-900 flex flex-col items-center justify-center text-slate-950 font-mono text-xs p-2 space-y-1">
                  <QrCode className="w-24 h-24 text-slate-950" />
                  <span className="font-bold text-xs">PIX BANCO DO BRASIL</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-[var(--text-muted)] block font-medium">Valor do Sinal de Entrada (50%)</span>
                <span className="font-mono font-bold text-2xl text-emerald-400 block mt-0.5">
                  R$ {(selectedQuote.totalPrice * 0.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-[var(--text-faint)] block mt-1">
                  Favorecido: WoodBit Marcenaria & Fabricação Digital Ltda (Natividade - RJ)
                </span>
              </div>

              {/* Copy PIX String */}
              <div className="flex items-center gap-2 bg-[var(--bg-high)] p-2.5 rounded-xl border border-[var(--border-subtle)] text-xs">
                <span className="font-mono text-xs text-amber-300 truncate flex-1 text-left">
                  00020126360014BR.GOV.BCB.PIX0114000000000000005204000053039865802BR
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      '00020126360014BR.GOV.BCB.PIX0114000000000000005204000053039865802BR'
                    );
                    setCopiedPix(true);
                    setTimeout(() => setCopiedPix(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-amber-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-amber-500/30 transition"
                >
                  {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedPix ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowPixModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--bg-low)] text-xs text-slate-300 hover:text-white cursor-pointer font-semibold"
              >
                Fechar
              </button>
              <button
                onClick={handleConfirmPixPayment}
                className="convex-btn px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirmar Pagamento do Sinal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Digital Contract & Legal Terms */}
      {showContractModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-2xl p-6 max-w-2xl w-full beveled-card shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[var(--color-primary)]" />
                Minuta de Contrato de Prestação de Serviços & Fabricação Sob Medida
              </h3>
              <button
                onClick={() => setShowContractModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <div className="p-5 bg-[var(--bg-low)] rounded-xl border border-[var(--border-subtle)] text-xs text-slate-200 space-y-3 font-serif leading-relaxed">
              <p className="font-bold text-slate-100 font-sans text-center uppercase tracking-wider text-xs">
                INSTRUMENTO PARTICULAR DE FABRICAÇÃO E INSTALAÇÃO DE MOBILIÁRIO SOB MEDIDA
              </p>

              <p>
                <strong>CONTRATADA:</strong> WOODBIT MARCENARIA & USINAGEM DIGITAL LTDA, sediada em Natividade - RJ.
              </p>
              <p>
                <strong>CONTRATANTE:</strong> {selectedQuote.customerName.toUpperCase()}.
              </p>
              <p>
                <strong>CLÁUSULA 1ª (DO OBJETO):</strong> A CONTRATADA compromete-se a fabricar sob medida e instalar o projeto{' '}
                <em>"{selectedQuote.projectTitle}"</em>, em estrita conformidade com o projeto técnico aprovado e memorial de materiais.
              </p>
              <p>
                <strong>CLÁUSULA 2ª (DO VALOR E PAGAMENTO):</strong> O valor total ajustado é de{' '}
                <strong>R$ {selectedQuote.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>, sendo 50% de sinal de entrada via PIX e o restante na conclusão da montagem.
              </p>
              <p>
                <strong>CLÁUSULA 3ª (DO PRAZO E TOLERÂNCIAS):</strong> Prazo estimado de produção de{' '}
                {selectedQuote.estimatedProductionDays} dias úteis contados a partir da aprovação da visita técnica de medição presencial.
              </p>
              <p>
                <strong>CLÁUSULA 4ª (DA GARANTIA):</strong> Garantia de 5 (cinco) anos para ferragens com amortecimento e 1 (um) ano para alinhamento e estrutura em MDF. Foro da Comarca de Natividade - RJ.
              </p>

              <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-4 text-center font-sans">
                <div className="p-3 border border-dashed border-[var(--color-primary)]/40 rounded-xl bg-[var(--bg-container)]">
                  <span className="text-xs text-slate-400 block font-medium">Assinado Digitalmente por:</span>
                  <strong className="text-xs text-amber-400 block mt-1 font-bold">WoodBit Marcenaria (Carlos)</strong>
                  <span className="text-xs font-mono text-emerald-400">Hash: 8f4a-99e2-2026</span>
                </div>
                <div className="p-3 border border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-container)]">
                  <span className="text-xs text-slate-400 block font-medium">Aguardando Assinatura de:</span>
                  <strong className="text-xs text-slate-200 block mt-1 font-bold">{selectedQuote.customerName}</strong>
                  <span className="text-xs font-mono text-slate-400">Via Link WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-medium">
                Contrato em conformidade com o Código Civil Brasileiro e LGPD.
              </span>
              <button
                onClick={handleSendContract}
                className="convex-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" /> Enviar para Assinatura Eletrônica
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
