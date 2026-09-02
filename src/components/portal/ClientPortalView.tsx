import React, { useState } from 'react';
import {
  UserCheck,
  FileText,
  Clock,
  CheckCircle2,
  Send,
  MessageSquare,
  ShieldCheck,
  Printer,
  Hammer,
  Truck,
  Layers,
  Sparkles,
  MapPin,
  FileDown,
  ExternalLink,
  Award,
  Copy,
  Share2
} from 'lucide-react';
import { Project, Quote } from '../../types';
import { useToast } from '../../context/ToastContext';

interface ClientPortalViewProps {
  projects: Project[];
  quotes: Quote[];
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  projects,
  quotes,
}) => {
  const { showToast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const currentQuote = quotes.find((q) => q.projectId === currentProject?.id) || quotes[0];

  const [contractAccepted, setContractAccepted] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureDate, setSignatureDate] = useState<string | null>(null);
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  // Dynamic steps calculation based on project status
  const getProjectSteps = () => {
    const isTechValid = !!currentProject?.technicalVisit?.isValidated;
    const isProduction = currentProject?.status === 'production' || isTechValid;
    return [
      { label: 'Contato & Briefing', status: 'done', date: 'Concluído' },
      {
        label: 'Visita Técnica e Medição',
        status: isTechValid ? 'done' : 'active',
        date: isTechValid ? 'Medição Validada a Laser' : 'Agendamento / Em curso',
      },
      {
        label: 'Orçamento & Contrato',
        status: isSigned || currentQuote?.status === 'approved' ? 'done' : 'active',
        date: isSigned ? 'Assinado Digitalmente' : 'Aguardando Aceite',
      },
      {
        label: 'Usinagem CNC & Marcenaria',
        status: isProduction ? 'active' : 'pending',
        date: isProduction ? 'Corte & Fita de Borda' : 'Previsto',
      },
      {
        label: 'Montagem e Acabamento',
        status: 'pending',
        date: 'Inspeção de Qualidade',
      },
      {
        label: 'Instalação no Local',
        status: 'pending',
        date: `Polo ${currentProject?.city || 'RJ'}`,
      },
    ];
  };

  const steps = getProjectSteps();

  const handleSignContract = () => {
    if (!contractAccepted) return;
    setIsSigned(true);
    const dateStr = new Date().toLocaleString('pt-BR');
    setSignatureDate(dateStr);
    showToast(
      'Contrato Assinado Digitalmente!',
      `Aceite registrado para ${currentProject?.customerName} (${currentProject?.code}).`,
      'success'
    );
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;
    setTicketSent(true);
    const sentMsg = ticketMessage;
    setTicketMessage('');
    showToast(
      'Mensagem Enviada ao Atendimento!',
      'Nossa equipe de marceneiros em Natividade responderá em breve.',
      'success'
    );
    setTimeout(() => setTicketSent(false), 5000);
  };

  const handleCopyPortalLink = () => {
    const url = window.location.href;
    try {
      navigator.clipboard.writeText(url);
      showToast('Link do Portal Copiado!', 'Envie este link para o cliente acompanhar a obra.', 'success');
    } catch {
      showToast('Link do Portal', url, 'info');
    }
  };

  return (
    <div id="client-portal-view-container" className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar with Project Switcher */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-4 rounded-xl beveled-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-[var(--color-primary)] uppercase tracking-wider font-bold">
            Portal da Transparência • WoodBit
          </span>
          <h2 className="font-display font-bold text-base text-[var(--text-main)]">
            Acompanhamento do Cliente em Tempo Real
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleCopyPortalLink}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-low)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Copiar link público do portal"
          >
            <Share2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="hidden sm:inline">Compartilhar Link</span>
          </button>
          <span className="text-xs text-[var(--text-muted)]">Selecionar Obra:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setIsSigned(false);
              setContractAccepted(false);
            }}
            className="bg-[var(--bg-low)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.customerName} — {p.title} ({p.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Client Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--bg-container)] via-[var(--bg-high)] to-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-6 shadow-xl beveled-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-[var(--color-primary)] uppercase tracking-wider font-bold">
              Área Exclusiva do Cliente
            </span>
            <h2 className="font-display font-bold text-xl text-[var(--text-main)] mt-1">
              Olá, {currentProject?.customerName || 'Cliente'}!
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              {currentProject?.address}, {currentProject?.city} - RJ
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-[var(--text-faint)] block">Código do Projeto</span>
            <span className="font-mono font-bold text-sm text-[var(--color-primary)]">
              {currentProject?.code} (v{currentProject?.version})
            </span>
            <span className="text-xs text-[var(--color-secondary)] block font-semibold mt-0.5">
              R$ {currentProject?.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Production Timeline Progress */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-6 beveled-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-primary)]" />
            Status em Tempo Real da Produção & Entrega
          </h3>
          <span className="text-[11px] font-mono text-[var(--color-secondary)] font-bold">
            Fábrica: Natividade - RJ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-left text-xs space-y-1.5 transition ${
                st.status === 'done'
                  ? 'bg-[var(--color-secondary-container)]/30 border-[var(--color-secondary)]/40'
                  : st.status === 'active'
                  ? 'bg-[var(--color-primary-container)]/40 border-[var(--color-primary)] beveled-card'
                  : 'bg-[var(--bg-low)] border-[var(--border-subtle)] text-[var(--text-faint)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-muted)]">Etapa {idx + 1}</span>
                {st.status === 'done' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                ) : st.status === 'active' ? (
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-ping"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[var(--border-subtle)]"></span>
                )}
              </div>
              <h4 className="font-semibold text-xs text-[var(--text-main)]">{st.label}</h4>
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">{st.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Proposal & Items */}
      {currentQuote && (
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-6 beveled-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border-subtle)] gap-2">
            <div>
              <span className="text-xs font-mono text-[var(--color-primary)] font-bold">
                {currentQuote.quoteNumber}
              </span>
              <h3 className="font-display font-bold text-sm text-[var(--text-main)]">
                Proposta Comercial & Detalhamento Técnico
              </h3>
            </div>
            <span className="font-display font-bold text-lg text-[var(--color-secondary)]">
              R$ {currentQuote.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[var(--text-main)]">Ambientes & Itens Inclusos na Proposta:</h4>
            <div className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-low)] rounded-lg border border-[var(--border-subtle)] overflow-hidden text-xs">
              {currentQuote.items.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-[var(--text-main)] block">{item.description}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      Ambiente: {item.roomName} • Qtd: {item.quantity} {item.unit} • Categoria: {item.category}
                    </span>
                  </div>
                  <span className="font-mono text-[var(--color-primary)] font-bold">
                    R$ {item.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Sign-off Section */}
          <div className="p-4 rounded-xl bg-[var(--bg-low)] border border-[var(--color-primary)]/30 space-y-3 debossed">
            <div className="flex items-center gap-2 text-xs text-[var(--text-main)]">
              <ShieldCheck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span>
                Termo de Fabricação e Montagem: Garantia estrutural de 5 anos em MDF Freijó/Branco e ferragens amortecidas.
              </span>
            </div>

            {isSigned ? (
              <div className="p-3.5 rounded-lg bg-[var(--color-secondary-container)] border border-[var(--color-secondary)] text-[var(--color-secondary)] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 shrink-0" />
                  <div>
                    <strong className="block font-bold">Contrato Assinado Digitalmente com Sucesso!</strong>
                    <span className="text-[11px] text-[var(--text-main)]">
                      Assinado por: {currentProject?.customerName} em {signatureDate} • Hash: WB-OK-{currentProject?.code}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center gap-1.5 hover:bg-[var(--bg-high)] cursor-pointer self-start sm:self-auto shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir Comprovante
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-3">
                <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contractAccepted}
                    onChange={(e) => setContractAccepted(e.target.checked)}
                    className="accent-[var(--color-primary)] w-4 h-4"
                  />
                  <span>Li e concordo com os termos, cronograma e especificações técnicas de materiais.</span>
                </label>

                <button
                  disabled={!contractAccepted}
                  onClick={handleSignContract}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow ${
                    contractAccepted
                      ? 'convex-btn cursor-pointer'
                      : 'bg-[var(--bg-high)] text-[var(--text-faint)] cursor-not-allowed border border-[var(--border-subtle)]'
                  }`}
                >
                  Assinar Digitalmente
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Support / Direct Message to WoodBit */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-6 beveled-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[var(--color-primary)]" />
            Falar com a Equipe WoodBit (Suporte & Atendimento)
          </h3>
          <a
            href={`https://wa.me/5522999998888?text=Olá,%20sou%20${encodeURIComponent(
              currentProject?.customerName || 'Cliente'
            )}%20e%20gostaria%20de%20tirar%20uma%20dúvida%20sobre%20meu%20projeto%20${encodeURIComponent(
              currentProject?.code || ''
            )}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[var(--color-secondary)] hover:underline font-bold flex items-center gap-1"
          >
            Abrir no WhatsApp Oficial <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <form onSubmit={handleSendTicket} className="space-y-3">
          <textarea
            required
            rows={3}
            placeholder="Digite sua mensagem ou solicitação de ajuste para o marceneiro responsável..."
            value={ticketMessage}
            onChange={(e) => setTicketMessage(e.target.value)}
            className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[11px] text-[var(--text-faint)]">
              Atendimento de Seg a Sex, 08h às 18h • Fábrica Natividade - RJ
            </span>

            <button
              type="submit"
              className="convex-btn px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow self-end sm:self-auto"
            >
              <Send className="w-3.5 h-3.5" /> Enviar Mensagem
            </button>
          </div>
        </form>

        {ticketSent && (
          <div className="p-3 rounded-lg bg-[var(--color-secondary-container)] border border-[var(--color-secondary)] text-[var(--color-secondary)] text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Mensagem registrada com sucesso! A equipe de marcenaria entrará em contato em instantes.
          </div>
        )}
      </div>
    </div>
  );
};

