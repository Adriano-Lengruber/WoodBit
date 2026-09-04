import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  Clock,
  ShieldCheck,
  Zap,
  Code,
  Eye,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { AIConfig } from '../../types';

interface AIOperationsViewProps {
  aiConfig: AIConfig;
  onUpdateAIConfig: (config: AIConfig) => void;
}

export const AIOperationsView: React.FC<AIOperationsViewProps> = ({
  aiConfig,
  onUpdateAIConfig,
}) => {
  const [testPrompt, setTestPrompt] = useState(
    'O cliente quer um painel ripado de 2,40m com fita de LED embutida e nicho em Louro Freijó. Quais são as etapas de corte CNC, ferramentas e materiais necessários?'
  );
  const [testResponse, setTestResponse] = useState('');
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [testModelUsed, setTestModelUsed] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [testProvider, setTestProvider] = useState<'lm_studio' | 'ollama' | 'gemini'>('lm_studio');
  const [activeTab, setActiveTab] = useState<'chat' | 'vision'>('chat');
  
  // Real-time discovered models from server
  const [discoveredModels, setDiscoveredModels] = useState<{
    lmStudio: { online: boolean; models: string[]; activeModel: string | null };
    ollama: { online: boolean; models: string[]; activeModel: string | null };
    geminiConfigured: boolean;
  }>({
    lmStudio: { online: false, models: [], activeModel: null },
    ollama: { online: false, models: [], activeModel: null },
    geminiConfigured: false,
  });
  const [isCheckingModels, setIsCheckingModels] = useState(false);

  // Sample image for vision testing (kitchen preview representation)
  const SAMPLE_IMAGE_BASE64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVGDUAAINIAQcxjx6qAAAAAElFTkSuQmCC';

  const checkAvailableModels = async () => {
    setIsCheckingModels(true);
    try {
      const res = await fetch('/api/ai/models');
      if (res.ok) {
        const data = await res.json();
        setDiscoveredModels(data);
      }
    } catch (err) {
      console.warn('Erro ao verificar modelos:', err);
    } finally {
      setIsCheckingModels(false);
    }
  };

  useEffect(() => {
    checkAvailableModels();
  }, []);

  const handleTestAi = async () => {
    setIsLoading(true);
    setTestResponse('');
    setTestLatency(null);
    setTestModelUsed('');

    try {
      if (activeTab === 'chat') {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: testPrompt,
            preferredProvider: testProvider,
            systemInstruction:
              'Você é o motor de IA técnica do WoodBit ERP, especialista em marcenaria sob medida, usinagem CNC e manufatura aditiva 3D em Natividade/RJ.',
          }),
        });
        const data = await res.json();
        setTestResponse(data.text || JSON.stringify(data, null, 2));
        setTestLatency(data.latencyMs || null);
        setTestModelUsed(data.model || '');
      } else {
        // Vision Test
        const res = await fetch('/api/ai/vision-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: SAMPLE_IMAGE_BASE64,
            mimeType: 'image/png',
            promptText: testPrompt,
          }),
        });
        const data = await res.json();
        setTestResponse(JSON.stringify(data.analysis || data, null, 2));
        setTestLatency(data.latencyMs || null);
        setTestModelUsed(data.analysis?.processedByModel || '');
      }
    } catch (e: any) {
      setTestResponse(`Erro ao executar inferência: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const lmStudioActive = discoveredModels.lmStudio.activeModel || 'google/gemma-4-12b-qat';

  return (
    <div id="ai-operations-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-5 rounded-xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[var(--color-primary)]" />
              Gateway de IA Local-First & Model Operations
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/20">
              Gemma 4 12B QAT
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Orquestração híbrida inteligente: inferência 100% privada e local via LM Studio com fallback seguro para nuvem e motor de regras embutido.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={checkAvailableModels}
            disabled={isCheckingModels}
            className="text-xs px-3 py-1.5 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)] text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Recarregar status dos modelos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingModels ? 'animate-spin' : ''}`} />
            Sincronizar
          </button>
          <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--color-secondary-container)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/30 font-medium flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Local-First Ativo
          </span>
        </div>
      </div>

      {/* Provider Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LM Studio (Primary - Gemma 4) */}
        <div className="bg-[var(--bg-container)] border-2 border-[var(--color-primary)]/60 rounded-xl p-4 space-y-3 beveled-card shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-primary)]/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="font-display font-bold text-xs text-[var(--text-main)]">
                LM Studio Local (Principal)
              </h3>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                discoveredModels.lmStudio.online
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
              }`}
            >
              {discoveredModels.lmStudio.online ? 'Online' : 'Aguardando Conexão'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="text-[var(--text-muted)]">
              Endpoint: <code className="text-[var(--color-primary)] font-mono text-[11px]">http://localhost:1234/v1</code>
            </p>
            <p className="text-[var(--text-muted)]">
              Modelo Ativo:{' '}
              <strong className="text-[var(--text-main)] font-mono text-[11px] block truncate" title={lmStudioActive}>
                {lmStudioActive}
              </strong>
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[10px] bg-[var(--bg-low)] px-1.5 py-0.5 rounded text-[var(--color-secondary)] border border-[var(--border-subtle)]">
                Visão Multimodal
              </span>
              <span className="text-[10px] bg-[var(--bg-low)] px-1.5 py-0.5 rounded text-[var(--color-secondary)] border border-[var(--border-subtle)]">
                JSON Estruturado
              </span>
              <span className="text-[10px] bg-[var(--bg-low)] px-1.5 py-0.5 rounded text-[var(--color-secondary)] border border-[var(--border-subtle)]">
                R$ 0,00 / Token
              </span>
            </div>
          </div>
        </div>

        {/* Ollama Local */}
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 space-y-3 beveled-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[var(--text-muted)]" />
              <h3 className="font-display font-bold text-xs text-[var(--text-main)]">Ollama Local</h3>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                discoveredModels.ollama.online
                  ? 'bg-emerald-950/60 text-emerald-400'
                  : 'bg-[var(--bg-low)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
              }`}
            >
              {discoveredModels.ollama.online ? 'Online' : 'Standby'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="text-[var(--text-muted)]">
              Endpoint: <code className="text-[var(--text-muted)] font-mono text-[11px]">http://localhost:11434</code>
            </p>
            <p className="text-[var(--text-muted)]">
              Modelos:{' '}
              <span className="font-mono text-[11px] text-[var(--text-main)]">
                {discoveredModels.ollama.models.length > 0
                  ? discoveredModels.ollama.models.join(', ')
                  : 'Nenhum carregado'}
              </span>
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Suporte para Qwen 2.5 Coder e DeepSeek R1.</p>
          </div>
        </div>

        {/* Gemini Nuvem Fallback */}
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 space-y-3 beveled-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-display font-bold text-xs text-[var(--text-main)]">Google Gemini</h3>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                discoveredModels.geminiConfigured
                  ? 'bg-emerald-950/60 text-emerald-400'
                  : 'bg-[var(--bg-low)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
              }`}
            >
              {discoveredModels.geminiConfigured ? 'Chave Configurada' : 'Fallback Offline'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="text-[var(--text-muted)]">
              Trigger: <span className="text-[var(--text-main)]">Se servidor local offline ou timeout</span>
            </p>
            <p className="text-[var(--text-muted)]">
              Modelo Nuvem: <strong className="text-amber-400 font-mono text-[11px]">gemini-3.7-flash</strong>
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              {discoveredModels.geminiConfigured
                ? 'Pronto para assumir se a oficina estiver sem GPU.'
                : 'Defina GEMINI_API_KEY no .env para ativar.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive AI Evaluation Playground */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-6 beveled-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border-subtle)] gap-3">
          <div>
            <h3 className="font-display font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[var(--color-primary)]" />
              Laboratório de Teste & Execução Local (Gemma 4 12B QAT)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Simulação de inferência em tempo real para marcenaria sob medida, fresamento CNC e manufatura 3D.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch between Chat and Vision */}
            <div className="flex items-center bg-[var(--bg-low)] rounded-lg p-0.5 border border-[var(--border-subtle)]">
              <button
                onClick={() => setActiveTab('chat')}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-[var(--color-primary)] text-[var(--text-on-primary)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Chat Técnico
              </button>
              <button
                onClick={() => setActiveTab('vision')}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'vision'
                    ? 'bg-[var(--color-primary)] text-[var(--text-on-primary)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Eye className="w-3 h-3" /> Análise de Visão
              </button>
            </div>

            {activeTab === 'chat' && (
              <select
                value={testProvider}
                onChange={(e) => setTestProvider(e.target.value as any)}
                className="bg-[var(--bg-low)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
              >
                <option value="lm_studio">LM Studio (Gemma 4)</option>
                <option value="ollama">Ollama Local</option>
                <option value="gemini">Gemini Nuvem</option>
              </select>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {activeTab === 'vision' && (
            <div className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-3 text-xs flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[var(--text-main)]">Modo Visão Computacional (Gemma 4 Vision)</p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Simula o envio de foto de ambiente com medição visual preliminar, obstáculos (tomadas/canos) e aviso legal obrigatório.
                </p>
              </div>
            </div>
          )}

          <textarea
            rows={3}
            placeholder={
              activeTab === 'chat'
                ? 'Digite a pergunta técnica sobre marcenaria, CNC ou 3D...'
                : 'Instruções para análise da imagem do ambiente...'
            }
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-3 text-xs text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--color-primary)]"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Processamento 100% privado na sua máquina (sem vazamento de dados de clientes).
            </span>
            <button
              onClick={handleTestAi}
              disabled={isLoading}
              className="convex-btn px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow"
            >
              <Play className="w-3.5 h-3.5" />
              {isLoading ? 'Processando inferência local...' : activeTab === 'chat' ? 'Executar Prompt' : 'Analisar Foto'}
            </button>
          </div>
        </div>

        {testResponse && (
          <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" /> Retorno da Inferência:
              </span>
              <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] font-mono">
                {testModelUsed && (
                  <span className="bg-[var(--bg-low)] px-2 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--text-main)]">
                    Modelo: {testModelUsed}
                  </span>
                )}
                {testLatency !== null && (
                  <span className="bg-[var(--bg-low)] px-2 py-0.5 rounded border border-[var(--border-subtle)] text-emerald-400">
                    Latência: {(testLatency / 1000).toFixed(2)}s
                  </span>
                )}
              </div>
            </div>
            <div className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-4 font-mono text-xs text-[var(--text-main)] leading-relaxed whitespace-pre-wrap debossed">
              {testResponse}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
