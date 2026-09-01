import React, { useState } from 'react';
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
  Code
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
    'O cliente quer um painel ripado de 2,40m com fita de LED embutida e nicho em Louro Freijó. Quais são as etapas de corte CNC e materiais necessários?'
  );
  const [testResponse, setTestResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testProvider, setTestProvider] = useState<'ollama' | 'lmstudio' | 'gemini'>('ollama');
  const [healthStatus, setHealthStatus] = useState<Record<string, string>>({
    ollama: 'Online (Latência: 42ms)',
    lmstudio: 'Online (Latência: 58ms)',
    gemini: 'Disponível como Fallback',
  });

  const handleTestAi = async () => {
    setIsLoading(true);
    setTestResponse('');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: testPrompt,
          preferredProvider: testProvider,
          systemInstruction:
            'Você é o motor de IA técnica da WoodBit ERP, especialista em marcenaria sob medida, usinagem CNC e manufatura aditiva 3D.',
        }),
      });
      const data = await res.json();
      setTestResponse(data.text || JSON.stringify(data, null, 2));
    } catch (e: any) {
      setTestResponse(`Erro ao executar chamada: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-operations-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#231f1d] border border-[#4f453a]/40 p-4 rounded-xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-base text-[#eae1dd] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#fecc93]" />
            IA Local-First Gateway & Operações de Modelos
          </h2>
          <p className="text-xs text-[#d3c4b6]">
            Gerenciamento do pipeline de IA híbrida: Ollama e LM Studio para inferência local com fallback em nuvem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#1d5123] text-[#9cd499] border border-[#9cd499]/30 font-medium flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Local-First Ativo
          </span>
        </div>
      </div>

      {/* Provider Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ollama */}
        <div className="bg-[#231f1d] border border-[#4f453a]/50 rounded-xl p-4 space-y-3 beveled-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#fecc93]" />
              <h3 className="font-display font-bold text-xs text-[#eae1dd]">Ollama Local (Padrão)</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1d5123] text-[#9cd499] font-medium">
              Ativo
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <p className="text-[#d3c4b6]">
              Endpoint: <code className="text-[#fecc93] font-mono">{aiConfig.ollamaEndpoint}</code>
            </p>
            <p className="text-[#d3c4b6]">
              Modelo: <strong className="text-[#eae1dd] font-mono">{aiConfig.primaryModel}</strong>
            </p>
            <p className="text-[11px] text-[#9cd499]">{healthStatus.ollama}</p>
          </div>
        </div>

        {/* LM Studio */}
        <div className="bg-[#231f1d] border border-[#4f453a]/50 rounded-xl p-4 space-y-3 beveled-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#38bdf8]" />
              <h3 className="font-display font-bold text-xs text-[#eae1dd]">LM Studio (Secundário)</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0c4a6e] text-[#38bdf8] font-medium">
              Standby
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <p className="text-[#d3c4b6]">
              Endpoint: <code className="text-[#38bdf8] font-mono">{aiConfig.lmStudioEndpoint}</code>
            </p>
            <p className="text-[#d3c4b6]">
              Modelo: <strong className="text-[#eae1dd] font-mono">Qwen 2.5 Coder 7B</strong>
            </p>
            <p className="text-[11px] text-[#9cd499]">{healthStatus.lmstudio}</p>
          </div>
        </div>

        {/* Gemini Fallback */}
        <div className="bg-[#231f1d] border border-[#4f453a]/50 rounded-xl p-4 space-y-3 beveled-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#fecc93]" />
              <h3 className="font-display font-bold text-xs text-[#eae1dd]">Gemini 3.7 (Nuvem Fallback)</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#644316] text-[#fecc93] font-medium">
              Fallback
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <p className="text-[#d3c4b6]">
              Trigger: <span className="text-[#eae1dd]">Se local timeout &gt; 3.5s ou offline</span>
            </p>
            <p className="text-[#d3c4b6]">
              Modelo: <strong className="text-[#fecc93] font-mono">{aiConfig.fallbackModel}</strong>
            </p>
            <p className="text-[11px] text-[#fecc93]">{healthStatus.gemini}</p>
          </div>
        </div>
      </div>

      {/* Interactive AI Evaluation Playground */}
      <div className="bg-[#231f1d] border border-[#4f453a]/50 rounded-xl p-6 beveled-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#4f453a]/40 gap-3">
          <div>
            <h3 className="font-display font-bold text-sm text-[#eae1dd] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#fecc93]" />
              Laboratório de Teste & Execução de Prompts WoodBit
            </h3>
            <p className="text-xs text-[#d3c4b6]">
              Teste respostas em tempo real simulando cenários da marcenaria e fábrica digital.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9c8e82]">Provedor para Teste:</span>
            <select
              value={testProvider}
              onChange={(e) => setTestProvider(e.target.value as any)}
              className="bg-[#110d0c] border border-[#4f453a]/60 text-xs text-[#eae1dd] rounded-lg px-2.5 py-1"
            >
              <option value="ollama">Ollama Local</option>
              <option value="lmstudio">LM Studio Local</option>
              <option value="gemini">Gemini 3.7 Flash</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            placeholder="Digite o prompt de teste operacional..."
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg p-3 text-xs text-[#eae1dd] font-sans focus:outline-none focus:border-[#fecc93]"
          />

          <div className="flex justify-end">
            <button
              onClick={handleTestAi}
              disabled={isLoading}
              className="convex-btn px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow"
            >
              <Play className="w-3.5 h-3.5" />
              {isLoading ? 'Processando inferência...' : 'Executar Prompt'}
            </button>
          </div>
        </div>

        {testResponse && (
          <div className="space-y-2 pt-3 border-t border-[#4f453a]/30">
            <span className="text-xs font-semibold text-[#fecc93] flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" /> Retorno da Inferência:
            </span>
            <div className="bg-[#110d0c] border border-[#4f453a]/60 rounded-lg p-4 font-mono text-xs text-[#eae1dd] leading-relaxed whitespace-pre-wrap debossed">
              {testResponse}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
