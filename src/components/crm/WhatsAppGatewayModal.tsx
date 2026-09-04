import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Zap,
  CheckCircle2,
  Send,
  Sparkles,
  Bot,
  RefreshCw,
  Phone,
  User,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Lead } from '../../types';
import { useToast } from '../../context/ToastContext';

interface WhatsAppGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadReceived: (newLead: Lead) => void;
}

interface WebhookMessageRecord {
  id: string;
  lead_id?: string;
  sender_phone?: string;
  sender_name?: string;
  message_text?: string;
  direction?: string;
  media_type?: string;
  ai_triaged?: number;
  created_at?: string;
}

const PRESET_MESSAGES = [
  {
    title: 'Cozinha Planejada Freijó (Natividade)',
    name: 'Mariana Silveira',
    phone: '22988112233',
    message: 'Olá! Boa tarde. Vi os projetos de vocês e gostaria de um orçamento para uma cozinha completa sob medida em MDF Louro Freijó com bancada para forno embutido aqui em Natividade - RJ.',
  },
  {
    title: 'Setup Gamer Paramétrico WoodBit',
    name: 'Lucas Gamer Pro',
    phone: '22997334455',
    message: 'Fala pessoal da WoodBit! Vi a mesa gamer com iluminação âmbar e suporte 3D no Instagram. Vocês fazem com 1.80m e gravação do meu nickname na CNC? Quanto fica para entregar em Itaperuna?',
  },
  {
    title: 'Corte CNC Router & Peças 3D',
    name: 'Construtora Vale do Carangola',
    phone: '22992445566',
    message: 'Prezados, temos arquivos DXF para corte de 15 divisórias ripadas em MDF Ultra 18mm e 40 suportes técnicos impressos em PETG. Qual o prazo do centro de usinagem de vocês?',
  },
];

export const WhatsAppGatewayModal: React.FC<WhatsAppGatewayModalProps> = ({
  isOpen,
  onClose,
  onLeadReceived,
}) => {
  const { showToast } = useToast();
  const [gatewayStatus, setGatewayStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [recentMessages, setRecentMessages] = useState<WebhookMessageRecord[]>([]);

  // Simulation form
  const [senderName, setSenderName] = useState(PRESET_MESSAGES[0].name);
  const [senderPhone, setSenderPhone] = useState(PRESET_MESSAGES[0].phone);
  const [messageText, setMessageText] = useState(PRESET_MESSAGES[0].message);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastTriageResult, setLastTriageResult] = useState<any>(null);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch('/api/whatsapp/status');
      if (res.ok) {
        const data = await res.json();
        setGatewayStatus(data.gateway);
        setRecentMessages(data.recentMessages || []);
      }
    } catch (e) {
      console.warn('Failed to fetch WhatsApp gateway status:', e);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_MESSAGES[0]) => {
    setSenderName(preset.name);
    setSenderPhone(preset.phone);
    setMessageText(preset.message);
  };

  const handleSimulateIncoming = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSimulating(true);
    setLastTriageResult(null);

    // Payload formatted as Evolution API / Baileys incoming webhook
    const evolutionWebhookPayload = {
      event: 'messages.upsert',
      instance: 'woodbit-marcenaria-natividade',
      data: {
        key: {
          remoteJid: `${senderPhone.replace(/\D/g, '')}@s.whatsapp.net`,
          fromMe: false,
          id: `EVO-${Date.now()}`,
        },
        pushName: senderName,
        message: {
          conversation: messageText,
        },
        messageTimestamp: Math.floor(Date.now() / 1000),
      },
    };

    try {
      const res = await fetch('/api/whatsapp/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evolutionWebhookPayload),
      });

      const result = await res.json();

      if (result.success) {
        setLastTriageResult(result.triage);
        showToast('Webhook Processado!', `Lead "${senderName}" triado pela IA Gemma 4 12B e salvo no SQLite.`, 'success');

        // Create Lead object to update client state immediately
        const createdLead: Lead = {
          id: result.leadId || `lead-evo-${Date.now()}`,
          tenantId: 'tenant-woodbit-rj',
          customerName: senderName,
          phone: senderPhone,
          city: result.triage?.suggestedCity || 'Natividade - RJ',
          productLine: result.triage?.productLine || 'furniture',
          stage: 'lead',
          source: 'whatsapp',
          notes: messageText,
          budgetEstimate: result.triage?.budgetEstimate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          assignedTo: 'IA de Triagem Gemma 4',
          aiTriage: result.triage,
          messages: [
            {
              id: `msg-${Date.now()}`,
              sender: 'client',
              content: messageText,
              timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            },
          ],
        };

        onLeadReceived(createdLead);
        fetchStatus();
      } else {
        showToast('Erro no Webhook', result.error || 'Falha ao processar mensagem.', 'warning');
      }
    } catch (err: any) {
      showToast('Erro de Rede', err.message || 'Servidor não respondeu.', 'warning');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto beveled-card shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-low)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-[var(--text-main)]">
                  Gateway WhatsApp • Evolution API & Baileys
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#1d5123]/50 text-[#9cd499] border border-[#9cd499]/30 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#9cd499] animate-pulse"></span> Conectado
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Webhook em tempo real para recebimento de leads com triagem inteligente via Google Gemma 4 12B QAT.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-high)] cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[var(--bg-low)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-mono block">Instância WhatsApp</span>
              <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                {gatewayStatus?.instanceName || 'woodbit-marcenaria-natividade'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-low)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-mono block">Endpoint do Webhook</span>
              <div className="text-xs font-mono font-bold text-[var(--color-primary)] truncate" title="/api/whatsapp/webhook">
                POST /api/whatsapp/webhook
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-low)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-mono block">IA de Triagem Ativa</span>
              <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Google Gemma 4 12B QAT
              </div>
            </div>
          </div>

          {/* Preset Quick Load */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Testar com Cenários Prontos da Marcenaria:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_MESSAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-2.5 rounded-xl bg-[var(--bg-low)] hover:bg-[var(--bg-high)] border border-[var(--border-subtle)] text-left cursor-pointer transition text-xs space-y-1"
                >
                  <span className="font-bold text-[var(--text-main)] block">{preset.title}</span>
                  <span className="text-[11px] text-[var(--text-muted)] line-clamp-1">{preset.name} • {preset.phone}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Simulator Form */}
          <form onSubmit={handleSimulateIncoming} className="p-5 rounded-2xl bg-[var(--bg-low)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <Bot className="w-4 h-4 text-[var(--color-primary)]" />
                Simular Mensagem Recebida via WhatsApp
              </h4>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Emula evento: messages.upsert
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Nome do Cliente:</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="Ex: João da Silva"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Telefone / WhatsApp:</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] font-mono"
                    placeholder="22999887766"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Mensagem do Cliente:</label>
              <textarea
                required
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full p-3 bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Digite a mensagem do cliente..."
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[var(--text-muted)]">
                A mensagem será enviada ao endpoint de webhook real e processada pela IA local.
              </span>

              <button
                type="submit"
                disabled={isSimulating}
                className="convex-btn px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Processando com Gemma 4 12B...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Disparar Webhook
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Result of Last Triage */}
          {lastTriageResult && (
            <div className="p-4 rounded-2xl bg-[var(--bg-low)] border border-[#7dd396]/40 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7dd396] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Triagem Concluída com Sucesso pela Gemma 4 12B!
                </span>
                <span className="text-xs font-mono font-bold bg-[#7dd396]/20 text-[#7dd396] px-2.5 py-0.5 rounded-full border border-[#7dd396]/30">
                  Score: {lastTriageResult.score}/100
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">Linha:</span>
                  <strong className="text-[var(--text-main)] capitalize">{lastTriageResult.productLine}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">Sentimento:</span>
                  <strong className="text-[var(--text-main)] capitalize">{lastTriageResult.sentiment}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">Estimativa:</span>
                  <strong className="text-[var(--color-primary)]">
                    {lastTriageResult.budgetEstimate ? `R$ ${lastTriageResult.budgetEstimate.toFixed(2)}` : 'A calcular'}
                  </strong>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">Próximo Passo:</span>
                  <strong className="text-[var(--text-main)]">{lastTriageResult.recommendedNextStep || 'Agendar visita'}</strong>
                </div>
              </div>
              {lastTriageResult.aiSummary && (
                <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-container)] p-2.5 rounded-xl border border-[var(--border-subtle)] mt-2">
                  <strong>Resumo da IA:</strong> {lastTriageResult.aiSummary}
                </p>
              )}
            </div>
          )}

          {/* Recent Messages in SQLite */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--color-primary)]" />
                Mensagens Recentes Gravadas no Banco SQLite ({recentMessages.length})
              </h4>
              <button
                type="button"
                onClick={fetchStatus}
                disabled={loadingStatus}
                className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RefreshCw className={`w-3 h-3 ${loadingStatus ? 'animate-spin' : ''}`} /> Atualizar
              </button>
            </div>

            {recentMessages.length === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-low)] rounded-xl border border-[var(--border-subtle)]">
                Nenhuma mensagem gravada ainda. Utilize o formulário acima para disparar o webhook de teste.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {recentMessages.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className="p-3 rounded-xl bg-[var(--bg-low)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-[var(--text-main)]">{msg.sender_name || 'Desconhecido'}</strong>
                        <span className="font-mono text-[11px] text-[var(--text-muted)]">{msg.sender_phone}</span>
                        {msg.ai_triaged ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30 font-medium">
                            ✓ Triado por IA
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[var(--text-muted)] line-clamp-1">{msg.message_text}</p>
                    </div>

                    <span className="text-[11px] font-mono text-[var(--text-muted)] whitespace-nowrap">
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-low)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--bg-container)] hover:bg-[var(--bg-high)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-main)] cursor-pointer transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
