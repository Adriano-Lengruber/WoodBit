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
  ExternalLink
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
    if (!proj) return true; // keep if unknown or matches
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
  const simMargin = selectedQuote && simPrice > 0
    ? Math.round(((simPrice - selectedQuote.totalCost) / simPrice) * 1000) / 10
    : 0;
  const simProfit = selectedQuote ? simPrice - selectedQuote.totalCost : 0;

  const handleCopyWhatsApp = () => {
    if (!selectedQuote) return;
    const msg = `Olá ${selectedQuote.customerName}! Segue a proposta detalhada da WoodBit Marcenaria & CNC para o projeto *${selectedQuote.projectTitle}* no valor de R$ ${selectedQuote.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} com prazo de ${selectedQuote.estimatedProductionDays} dias.`;
    try {
      navigator.clipboard.writeText(msg);
      showToast('Texto Copiado para o WhatsApp!', 'Abra a conversa do cliente e cole a proposta.', 'success');
    } catch (e) {
      showToast('Proposta pronta para envio!', msg.slice(0, 60) + '...', 'info');
    }
  };

  const handleConfirmPixPayment = () => {
    if (!selectedQuote) return;
    const updatedQuote: Quote = {
      ...selectedQuote,
      status: 'approved',
    };
    const updatedList = quotes.map((q) => (q.id === selectedQuote.id ? updatedQuote : q));
    onUpdateQuotes(updatedList);
    setSelectedQuote(updatedQuote);
    setShowPixModal(false);
    showToast('Sinal PIX Confirmado!', 'Status alterado para Aprovado e insumos reservados com sucesso.', 'success');
  };

  const handleSendContract = () => {
    setShowContractModal(false);
    showToast('Contrato Enviado!', 'Link de assinatura eletrônica enviado ao cliente.', 'success');
  };

  return (
    <div id="quotes-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-4 rounded-xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--color-primary)]" />
            Orçamentos & Engenharia de Preços
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Composição técnica de custos (MDF, CNC, 3D, Mão de obra) com proteção Margin Guard e simulador What-if.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-voice-to-quote"
            onClick={onOpenVoiceAssistant}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[var(--color-primary)] border border-[var(--color-primary)]/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Orçamento por Voz (IA)
          </button>
        </div>
      </div>

      {/* City Filter Notice */}
      {selectedCity !== 'all' && (
        <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-3 px-4 flex items-center justify-between gap-3 beveled-card shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-[var(--text-main)]">
              Exibindo orçamentos do polo regional: <strong className="text-[var(--color-primary)]">{selectedCity} - RJ</strong>
            </span>
          </div>
          {onSelectCity && (
            <button
              onClick={() => onSelectCity('all')}
              className="text-[var(--color-primary)] hover:underline font-bold cursor-pointer"
            >
              ✕ Ver Todas as Cidades
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Quotes List on Left, Detail & Margin Guard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 4 Cols: Quotes List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Propostas Emitidas ({filteredQuotes.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {filteredQuotes.map((q) => {
              const quoteCity = getQuoteCity(q);
              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setSelectedQuote(q);
                    setWhatIfPriceAdjustment(0);
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left space-y-2 ${
                    selectedQuote?.id === q.id
                      ? 'bg-[var(--bg-high)] border-[var(--color-primary)] shadow-md beveled-card'
                      : 'bg-[var(--bg-container)] border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-[var(--color-primary)]">
                          {q.quoteNumber} (v{q.version})
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--bg-low)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                          {quoteCity}
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs text-[var(--text-main)] mt-0.5">{q.projectTitle}</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">{q.customerName}</p>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        q.status === 'approved'
                          ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]'
                          : q.status === 'sent'
                          ? 'bg-[#644316]/30 text-[var(--color-primary)]'
                          : 'bg-[var(--bg-low)] text-[var(--text-muted)]'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-subtle)]">
                    <span className="text-[var(--color-secondary)] font-bold font-mono">
                      R$ {q.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        q.isBelowMinimumMargin ? 'text-[#ffb4ab]' : 'text-[var(--color-primary)]'
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


        {/* Right 8 Cols: Quotation Items, Cost Breakdown & Margin Guard Simulator */}
        <div className="lg:col-span-8 space-y-5">
          {selectedQuote ? (
            <div className="bg-[#231f1d] border border-[#4f453a]/50 rounded-xl p-5 beveled-card space-y-5">
              {/* Top Details & Margin Guard Alert */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#4f453a]/40 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#fecc93]">
                      {selectedQuote.quoteNumber}
                    </span>
                    <h3 className="font-display font-bold text-sm text-[#eae1dd]">
                      {selectedQuote.projectTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-[#d3c4b6]">
                    Cliente: {selectedQuote.customerName} • Prazo: {selectedQuote.estimatedProductionDays} dias
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowPixModal(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#110d0c] hover:bg-[#2e2927] text-[#9cd499] border border-[#9cd499]/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Gerar chave e QR Code PIX de entrada"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Gerar PIX Entrada
                  </button>

                  <button
                    onClick={() => setShowContractModal(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#110d0c] hover:bg-[#2e2927] text-[#fecc93] border border-[#fecc93]/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Emitir minuta de contrato com assinatura digital"
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Gerar Contrato
                  </button>

                  <button
                    onClick={handleCopyWhatsApp}
                    className="px-2.5 py-1.5 rounded-lg bg-[#2e2927] hover:bg-[#393431] text-[#eae1dd] border border-[#4f453a]/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    title="Copiar mensagem formatada para WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#9cd499]" /> WhatsApp
                  </button>

                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="convex-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Item
                  </button>
                </div>
              </div>

              {/* Margin Guard Status Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                  selectedQuote.isBelowMinimumMargin
                    ? 'bg-[#93000a]/20 border-[#ffb4ab]/50 text-[#ffb4ab]'
                    : 'bg-[#1d5123]/20 border-[#9cd499]/40 text-[#9cd499]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {selectedQuote.isBelowMinimumMargin ? (
                    <AlertTriangle className="w-5 h-5 text-[#ffb4ab] shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-[#9cd499] shrink-0" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {selectedQuote.isBelowMinimumMargin
                        ? 'Alerta Margin Guard: Margem Abaixo do Mínimo!'
                        : 'Margin Guard: Orçamento em Conformidade Operacional'}
                    </span>
                    <span className="text-[11px] text-[#eae1dd]/80">
                      Margem atual: <strong>{selectedQuote.marginPercent}%</strong> | Mínimo exigido: <strong>{selectedQuote.minimumMarginRequired}%</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#1f1b19] border border-[#4f453a]/30 p-3 rounded-lg">
                  <span className="text-[10px] text-[#9c8e82] block">Custo Total Matéria-Prima</span>
                  <span className="font-bold text-[#eae1dd] text-sm">
                    R$ {selectedQuote.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="bg-[#1f1b19] border border-[#4f453a]/30 p-3 rounded-lg">
                  <span className="text-[10px] text-[#9c8e82] block">Preço Final de Venda</span>
                  <span className="font-bold text-[#9cd499] text-sm">
                    R$ {selectedQuote.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="bg-[#1f1b19] border border-[#4f453a]/30 p-3 rounded-lg">
                  <span className="text-[10px] text-[#9c8e82] block">Lucro Bruto Calculado</span>
                  <span className="font-bold text-[#fecc93] text-sm">
                    R$ {(selectedQuote.totalPrice - selectedQuote.totalCost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="bg-[#1f1b19] border border-[#4f453a]/30 p-3 rounded-lg">
                  <span className="text-[10px] text-[#9c8e82] block">Margem de Contribuição</span>
                  <span className="font-bold text-[#fecc93] text-sm">
                    {selectedQuote.marginPercent}%
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="font-display font-semibold text-xs text-[#eae1dd]">
                  Composição de Itens do Orçamento
                </h4>
                <div className="overflow-x-auto border border-[#4f453a]/40 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1f1b19] text-[#9c8e82] uppercase text-[10px] border-b border-[#4f453a]/40">
                      <tr>
                        <th className="p-2.5">Ambiente / Item</th>
                        <th className="p-2.5">Categoria</th>
                        <th className="p-2.5">Qtd</th>
                        <th className="p-2.5">Custo Unit.</th>
                        <th className="p-2.5">Markup</th>
                        <th className="p-2.5 text-right">Total Venda</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#4f453a]/20 bg-[#161311]">
                      {selectedQuote.items.map((item) => (
                        <tr key={item.id} className="hover:bg-[#1f1b19]/60">
                          <td className="p-2.5">
                            <span className="font-medium text-[#eae1dd] block">{item.description}</span>
                            <span className="text-[10px] text-[#9c8e82]">{item.roomName}</span>
                          </td>
                          <td className="p-2.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2e2927] text-[#fecc93] font-mono uppercase">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="p-2.5 font-mono text-[#d3c4b6]">
                            R$ {item.unitCost.toFixed(2)}
                          </td>
                          <td className="p-2.5 font-mono text-[#fecc93]">
                            {item.markup}x
                          </td>
                          <td className="p-2.5 font-mono font-semibold text-right text-[#9cd499]">
                            R$ {item.totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* What-If Pricing Simulator */}
              <div className="bg-[#1f1b19] border border-[#fecc93]/30 p-4 rounded-xl space-y-3 debossed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#fecc93]" />
                    <h4 className="font-display font-bold text-xs text-[#eae1dd]">
                      Simulador "What-if Pricing" (Sem alterar o orçamento base)
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-[#fecc93] font-bold">
                    {whatIfPriceAdjustment > 0 ? `+${whatIfPriceAdjustment}%` : `${whatIfPriceAdjustment}%`}
                  </span>
                </div>

                <p className="text-[11px] text-[#d3c4b6]/80">
                  Simule o impacto de concessão de desconto ou aumento de tabela na margem real e no lucro líquido.
                </p>

                <input
                  type="range"
                  min="-20"
                  max="30"
                  step="1"
                  value={whatIfPriceAdjustment}
                  onChange={(e) => setWhatIfPriceAdjustment(Number(e.target.value))}
                  className="w-full accent-[#fecc93] cursor-pointer"
                />

                <div className="grid grid-cols-3 gap-3 text-xs pt-2 border-t border-[#4f453a]/30">
                  <div>
                    <span className="text-[10px] text-[#9c8e82] block">Preço Simulado</span>
                    <span className="font-bold text-[#eae1dd] font-mono">
                      R$ {simPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9c8e82] block">Nova Margem</span>
                    <span
                      className={`font-bold font-mono ${
                        simMargin >= 25 ? 'text-[#9cd499]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      {simMargin}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9c8e82] block">Novo Lucro Bruto</span>
                    <span className="font-bold text-[#fecc93] font-mono">
                      R$ {simProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#231f1d] border border-[#4f453a]/40 rounded-xl p-10 text-center text-[#9c8e82] text-xs">
              Selecione um orçamento na lista para visualizar o cálculo detalhado de custos e margem.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Quote Item */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#231f1d] border border-[#fecc93]/40 rounded-xl p-5 max-w-md w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#4f453a]/40">
              <h3 className="font-display font-bold text-sm text-[#eae1dd]">
                Adicionar Item ao Orçamento
              </h3>
              <button onClick={() => setShowAddItemModal(false)} className="text-[#9c8e82]">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-[11px] text-[#d3c4b6] block mb-1">Descrição do Item</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Chapa MDF Louro Freijó 18mm"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg px-3 py-1.5 text-xs text-[#eae1dd] focus:outline-none focus:border-[#fecc93]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#d3c4b6] block mb-1">Ambiente</label>
                  <input
                    type="text"
                    value={newItemRoom}
                    onChange={(e) => setNewItemRoom(e.target.value)}
                    className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg px-3 py-1.5 text-xs text-[#eae1dd] focus:outline-none focus:border-[#fecc93]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#d3c4b6] block mb-1">Categoria</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg px-2 py-1.5 text-xs text-[#eae1dd] focus:outline-none focus:border-[#fecc93]"
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

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#d3c4b6] block mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg px-3 py-1.5 text-xs text-[#eae1dd] focus:outline-none focus:border-[#fecc93]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#d3c4b6] block mb-1">Custo Unit. (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg px-3 py-1.5 text-xs text-[#eae1dd] focus:outline-none focus:border-[#fecc93]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#d3c4b6] block mb-1">Markup (Multiplicador)</label>
                  <input
                    type="number"
                    min="1.0"
                    step="0.1"
                    value={newItemMarkup}
                    onChange={(e) => setNewItemMarkup(Number(e.target.value))}
                    className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg px-3 py-1.5 text-xs text-[#eae1dd] focus:outline-none focus:border-[#fecc93]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#4f453a]/40">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#d3c4b6]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="convex-btn px-4 py-1.5 rounded-lg text-xs font-semibold"
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
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#231f1d] border border-[#9cd499]/40 rounded-xl p-5 max-w-md w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#4f453a]/40">
              <h3 className="font-display font-bold text-sm text-[#eae1dd] flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#9cd499]" />
                Cobrança PIX — Sinal de Entrada (50%)
              </h3>
              <button onClick={() => setShowPixModal(false)} className="text-[#9c8e82] hover:text-[#eae1dd]">
                ✕
              </button>
            </div>

            <div className="text-center space-y-3 p-3 bg-[#110d0c] rounded-xl border border-[#4f453a]/40 debossed">
              <div className="bg-white p-3 rounded-lg inline-block shadow">
                <div className="w-36 h-36 border-2 border-black flex flex-col items-center justify-center text-black font-mono text-[9px] p-2 space-y-1">
                  <QrCode className="w-20 h-20 text-black" />
                  <span className="font-bold">PIX BANCO DO BRASIL</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#9c8e82] block">Valor do Sinal (50%)</span>
                <span className="font-mono font-bold text-lg text-[#9cd499]">
                  R$ {(selectedQuote.totalPrice * 0.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-[#d3c4b6] block mt-0.5">
                  Beneficiário: WoodBit Marcenaria & CNC Ltda (Natividade - RJ)
                </span>
              </div>

              {/* Copy Key */}
              <div className="flex items-center gap-2 bg-[#1f1b19] p-2 rounded-lg border border-[#4f453a]/40 text-xs">
                <span className="font-mono text-[10px] text-[#fecc93] truncate flex-1 text-left">
                  00020126360014BR.GOV.BCB.PIX0114000000000000005204000053039865802BR
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('00020126360014BR.GOV.BCB.PIX0114000000000000005204000053039865802BR');
                    setCopiedPix(true);
                    setTimeout(() => setCopiedPix(false), 2000);
                  }}
                  className="px-2 py-1 rounded bg-[#2e2927] hover:bg-[#393431] text-[#fecc93] text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedPix ? <Check className="w-3 h-3 text-[#9cd499]" /> : <Copy className="w-3 h-3" />}
                  {copiedPix ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setShowPixModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#2e2927] text-xs text-[#d3c4b6]"
              >
                Fechar
              </button>
              <button
                onClick={handleConfirmPixPayment}
                className="convex-btn px-4 py-1.5 rounded-lg text-xs font-bold text-[#3b2203] flex items-center gap-1.5 cursor-pointer shadow"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmar Pagamento do Sinal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Digital Contract & Signatures */}
      {showContractModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#231f1d] border border-[#fecc93]/40 rounded-xl p-6 max-w-2xl w-full beveled-card shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#4f453a]/40">
              <h3 className="font-display font-bold text-sm text-[#eae1dd] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#fecc93]" />
                Minuta de Contrato de Prestação de Serviços & Manufatura Digital
              </h3>
              <button onClick={() => setShowContractModal(false)} className="text-[#9c8e82] hover:text-[#eae1dd]">
                ✕
              </button>
            </div>

            {/* Contract Body Document */}
            <div className="p-4 bg-[#110d0c] rounded-xl border border-[#4f453a]/50 text-xs text-[#d3c4b6] space-y-3 font-serif leading-relaxed debossed">
              <p className="font-bold text-[#eae1dd] font-sans text-center uppercase tracking-wider text-[11px]">
                INSTRUMENTO PARTICULAR DE FABRICAÇÃO E INSTALAÇÃO DE MOBILIÁRIO SOB MEDIDA
              </p>

              <p>
                <strong>CONTRATADA:</strong> WOODBIT MARCENARIA & USINAGEM DIGITAL LTDA, sediada em Natividade - RJ.
              </p>
              <p>
                <strong>CONTRATANTE:</strong> {selectedQuote.customerName.toUpperCase()}.
              </p>
              <p>
                <strong>CLÁUSULA 1ª (DO OBJETO):</strong> A CONTRATADA compromete-se a fabricar sob medida e instalar o projeto <em>"{selectedQuote.projectTitle}"</em>, em estrita conformidade com o projeto técnico aprovado e memorial de materiais.
              </p>
              <p>
                <strong>CLÁUSULA 2ª (DO VALOR E PAGAMENTO):</strong> O valor total ajustado é de <strong>R$ {selectedQuote.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>, sendo 50% de sinal de entrada via PIX e o restante na conclusão da montagem.
              </p>
              <p>
                <strong>CLÁUSULA 3ª (DO PRAZO E TOLERÂNCIAS):</strong> Prazo estimado de produção de {selectedQuote.estimatedProductionDays} dias úteis contados a partir da aprovação da visita técnica de medição presencial.
              </p>
              <p>
                <strong>CLÁUSULA 4ª (DA GARANTIA):</strong> Garantia de 5 (cinco) anos para ferragens com amortecimento e 1 (um) ano para alinhamento e estrutura em MDF. Foro da Comarca de Natividade - RJ.
              </p>

              <div className="pt-3 border-t border-[#4f453a]/40 grid grid-cols-2 gap-4 text-center font-sans">
                <div className="p-2 border border-dashed border-[#fecc93]/40 rounded bg-[#161311]">
                  <span className="text-[10px] text-[#9c8e82] block">Assinado Digitalmente por:</span>
                  <strong className="text-xs text-[#fecc93] block mt-1">WoodBit Marcenaria (Carlos)</strong>
                  <span className="text-[9px] font-mono text-[#9cd499]">Hash: 8f4a-99e2-2026</span>
                </div>
                <div className="p-2 border border-dashed border-[#4f453a] rounded bg-[#161311]">
                  <span className="text-[10px] text-[#9c8e82] block">Aguardando Assinatura de:</span>
                  <strong className="text-xs text-[#eae1dd] block mt-1">{selectedQuote.customerName}</strong>
                  <span className="text-[9px] font-mono text-[#9c8e82]">Via Link do WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#9c8e82]">
                Contrato validado juridicamente segundo o Código Civil Brasileiro
              </span>
              <button
                onClick={handleSendContract}
                className="convex-btn px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow"
              >
                <Send className="w-3.5 h-3.5" /> Enviar para Assinatura Eletrônica
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
