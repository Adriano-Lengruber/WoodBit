import React, { useState } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Image as ImageIcon,
  MessageSquare,
  Send,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  ShieldAlert,
  Layers,
  FileText
} from 'lucide-react';
import { QuoteItem } from '../../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedQuoteItems?: (items: Partial<QuoteItem>[]) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyParsedQuoteItems,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'vision'>('chat');

  // Chat State
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; time: string }[]
  >([
    {
      role: 'assistant',
      text: 'Olá! Sou a IA WoodBit (Local-First). Como posso ajudar na operação de marcenaria, PCP, orçamentos ou corte CNC hoje?',
      time: '08:30',
    },
  ]);
  const [inputChat, setInputChat] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Voice to Quote State
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedAudioText, setTranscribedAudioText] = useState(
    'Cliente pediu um painel para TV de até 65 polegadas em MDF Freijó ripado, medindo 2,40m de largura por 2,60m de altura, com fita de LED 3000K embutida e uma bancada suspensa com duas gavetas com corrediça invisível slow.'
  );
  const [parsedQuoteResult, setParsedQuoteResult] = useState<any | null>(null);
  const [isParsingQuote, setIsParsingQuote] = useState(false);

  // Vision Analysis State
  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60'
  );
  const [visionAnalysisResult, setVisionAnalysisResult] = useState<any | null>(null);
  const [isAnalyzingVision, setIsAnalyzingVision] = useState(false);

  if (!isOpen) return null;

  // Handle Send Chat
  const handleSendChat = async () => {
    if (!inputChat.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: inputChat,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputChat('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputChat,
          preferredProvider: 'ollama',
          systemInstruction:
            'Você é a assistente de operações e marcenaria digital da WoodBit em Natividade/RJ. Seja precisa, prática e técnica.',
        }),
      });
      const data = await res.json();
      const assistantMsg = {
        role: 'assistant' as const,
        text: data.text || 'Processado com sucesso.',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Erro de comunicação com o motor de IA local.',
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle Voice Parse
  const handleParseAudio = async () => {
    setIsParsingQuote(true);
    try {
      const res = await fetch('/api/ai/voice-to-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioTranscription: transcribedAudioText }),
      });
      const data = await res.json();
      setParsedQuoteResult(data.quoteDraft);
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsingQuote(false);
    }
  };

  // Handle Vision Analysis
  const handleAnalyzeVision = async () => {
    setIsAnalyzingVision(true);
    try {
      const res = await fetch('/api/ai/vision-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          prompt:
            'Analise as paredes, pontos de tomada, sancas e alinhamentos deste cômodo para projeto de marcenaria planejada.',
        }),
      });
      const data = await res.json();
      setVisionAnalysisResult(data.analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingVision(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-2xl max-w-2xl w-full beveled-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-4 bg-[var(--bg-low)] border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-primary)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[var(--text-main)]">
                Assistente de Inteligência Artificial WoodBit
              </h3>
              <span className="text-[10px] text-[var(--color-primary)] font-mono">
                Ollama / LM Studio (Local-First) • Gemini Cloud Fallback
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-high)] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-low)] px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Chat Operacional
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'voice'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" /> Orçamento por Voz (IA)
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'vision'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Análise Visual de Cômodos
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-[var(--bg-low)] rounded-xl border border-[var(--border-subtle)] debossed">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-xl text-xs ${
                        msg.role === 'user'
                          ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                          : 'bg-[var(--bg-container)] text-[var(--text-main)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <span className="text-[9px] text-[var(--text-muted)] block text-right mt-1">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="text-xs text-[var(--color-primary)] italic flex items-center gap-2 p-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> Pensando via Ollama Local...
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Pergunte sobre medidas, CNC, 3D, MDF ou clientes..."
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  className="flex-1 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  onClick={handleSendChat}
                  className="convex-btn p-2 rounded-lg cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: VOICE TO QUOTE */}
          {activeTab === 'voice' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[var(--bg-low)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[var(--text-main)] flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[var(--color-primary)]" />
                    Transcrição do Áudio do WhatsApp / Gravador de Voz
                  </span>
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition flex items-center gap-1 cursor-pointer ${
                      isRecording
                        ? 'bg-[#93000a] text-white animate-pulse'
                        : 'bg-[var(--bg-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                    }`}
                  >
                    {isRecording ? 'Gravando...' : 'Gravar Áudio'}
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={transcribedAudioText}
                  onChange={(e) => setTranscribedAudioText(e.target.value)}
                  className="w-full bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleParseAudio}
                    disabled={isParsingQuote}
                    className="convex-btn px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isParsingQuote ? 'Extraindo componentes...' : 'Estruturar Orçamento com IA'}
                  </button>
                </div>
              </div>

              {/* Parsed Quote Structured Result */}
              {parsedQuoteResult && (
                <div className="p-4 rounded-xl bg-[var(--bg-low)] border border-[var(--border-subtle)] space-y-3 debossed animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-xs text-[var(--color-primary)]">
                      Itens & Insumos Identificados Automaticamente
                    </h4>
                    <span className="font-mono text-xs font-bold text-[var(--color-secondary)]">
                      Estimativa: R$ {parsedQuoteResult.suggestedTotalPrice?.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {parsedQuoteResult.items?.map((it: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2 bg-[var(--bg-container)] rounded-lg border border-[var(--border-subtle)] flex items-center justify-between"
                      >
                        <div>
                          <span className="font-medium text-[var(--text-main)] block">{it.description}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {it.roomName} • {it.category}
                          </span>
                        </div>
                        <span className="font-mono text-[var(--color-primary)]">
                          R$ {it.totalPrice?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] italic">
                    Notas: {parsedQuoteResult.aiReasoning}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VISION ANALYSIS */}
          {activeTab === 'vision' && (
            <div className="space-y-4">
              {/* Mandatory Legal Disclaimer */}
              <div className="p-3 bg-[#93000a]/20 border border-[#ffb4ab]/40 rounded-xl text-xs text-[#ffb4ab] flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">
                    Aviso Jurídico & Técnico Obrigatório:
                  </strong>
                  A análise visual com inteligência artificial é preliminar e serve como apoio ao projeto. Ela <strong>NÃO substitui a medição técnica presencial obrigatória</strong> com trena laser no local.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <img
                    src={selectedImage}
                    alt="Foto do cômodo"
                    className="rounded-xl border border-[var(--border-subtle)] w-full h-44 object-cover"
                  />
                  <div className="mt-2 flex justify-between">
                    <span className="text-[10px] text-[var(--text-muted)]">Foto: Cozinha Casa Silva</span>
                    <button
                      onClick={handleAnalyzeVision}
                      disabled={isAnalyzingVision}
                      className="convex-btn px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isAnalyzingVision ? 'Examinando foto...' : 'Analisar com IA'}
                    </button>
                  </div>
                </div>

                <div className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-3.5 space-y-2 text-xs debossed">
                  <h4 className="font-semibold text-xs text-[var(--color-primary)] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Interferências & Recomendações
                  </h4>

                  {visionAnalysisResult ? (
                    <div className="space-y-2">
                      <p className="text-[var(--text-muted)]">{visionAnalysisResult.generalImpression}</p>
                      <div className="space-y-1">
                        <span className="text-[10px] text-[var(--text-muted)] block">Possíveis Pontos de Atenção:</span>
                        <ul className="list-disc list-inside text-[11px] text-[#ffb4ab] space-y-0.5">
                          {visionAnalysisResult.detectedOutlets?.map((d: string, i: number) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[var(--text-muted)] py-8 text-center text-xs">
                      Clique em "Analisar com IA" para processar desníveis, tomadas e vigas visíveis.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
