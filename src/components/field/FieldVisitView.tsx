import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  Camera,
  AlertTriangle,
  Upload,
  Ruler,
  MapPin,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Download,
  Zap,
  Check,
  Wifi,
  WifiOff,
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { Project } from '../../types';
import { useToast } from '../../context/ToastContext';
import { getOfflineQueueCount, flushOfflineSyncQueue } from '../../services/storage';

interface FieldPhoto {
  id: string;
  label: string;
  url?: string;
  isAiAnalyzed?: boolean;
  aiAnalysis?: {
    identifiedRoom?: string;
    detectedElements?: string[];
    suggestedObstacles?: string[];
    designSuggestions?: string[];
    legalDisclaimer?: string;
  };
}

interface FieldVisitViewProps {
  projects: Project[];
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  onUpdateProjects: (projects: Project[]) => void;
}

export const FieldVisitView: React.FC<FieldVisitViewProps> = ({
  projects,
  selectedCity = 'all',
  onSelectCity,
  onUpdateProjects,
}) => {
  const { showToast } = useToast();

  // Filter projects by city if applicable
  const availableProjects = projects.filter((p) => {
    if (selectedCity === 'all') return true;
    return p.city.toLowerCase() === selectedCity.toLowerCase();
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    availableProjects[0]?.id || projects[0]?.id || ''
  );
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || availableProjects[0] || projects[0];

  // Checklist states
  const [prumoVerified, setPrumoVerified] = useState(true);
  const [peDireitoVerified, setPeDireitoVerified] = useState(true);
  const [tomadasVerified, setTomadasVerified] = useState(true);
  const [hidraulicaVerified, setHidraulicaVerified] = useState(true);
  const [gasVerified, setGasVerified] = useState(true);
  const [acessoElevadorVerified, setAcessoElevadorVerified] = useState(true);
  const [obsText, setObsText] = useState(
    'Ponto de tomada 220V do forno localizado a 1150mm do piso acabado. Prumo da parede da pia com desvio de 3mm corrigido no recuo compensador do módulo.'
  );
  const [photos, setPhotos] = useState<FieldPhoto[]>([
    { id: 'p1', label: 'Parede da Pia — Prumo Laser Alinhado' },
    { id: 'p2', label: 'Ponto 220V Forno Embutido' },
    { id: 'p3', label: 'Sanca de Gesso & Pé-Direito 2650mm' },
    { id: 'p4', label: 'Acesso Elevador de Carga / Escada' },
  ]);
  const [newPhotoLabel, setNewPhotoLabel] = useState('');
  const [analyzingPhotoId, setAnalyzingPhotoId] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [queueCount, setQueueCount] = useState(getOfflineQueueCount());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      const flushed = await flushOfflineSyncQueue();
      setQueueCount(getOfflineQueueCount());
      if (flushed > 0) {
        showToast('Sincronização Concluída', `${flushed} registro(s) enviados para a oficina.`, 'success');
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setQueueCount(getOfflineQueueCount());
      showToast('Modo Offline Ativo', 'Você está desconectado. Todas as medições estão sendo salvas localmente.', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Refresh queue count periodically
    const interval = setInterval(() => {
      setQueueCount(getOfflineQueueCount());
    }, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [showToast]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    const flushed = await flushOfflineSyncQueue();
    setQueueCount(getOfflineQueueCount());
    setIsSyncing(false);
    if (flushed > 0) {
      showToast('Sincronizado!', `${flushed} dados enviados para o servidor SQLite.`, 'success');
    } else {
      showToast('Tudo Sincronizado', 'Não há medições pendentes para envio.', 'info');
    }
  };

  const handleAddPhoto = () => {
    if (!newPhotoLabel.trim()) return;
    const added: FieldPhoto = {
      id: `p-${Date.now()}`,
      label: newPhotoLabel.trim(),
    };
    setPhotos([...photos, added]);
    setNewPhotoLabel('');
    showToast('Registro Fotográfico Anexado!', `"${added.label}" adicionado ao laudo.`, 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const newPhoto: FieldPhoto = {
        id: `p-${Date.now()}`,
        label: file.name.replace(/\.[^/.]+$/, '') || 'Foto da Obra',
        url: result,
      };
      setPhotos([...photos, newPhoto]);
      showToast('Foto Carregada!', 'Arquivo anexado com sucesso. Você pode analisá-la com a IA de Visão.', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAnalyzeWithVision = async (photo: FieldPhoto) => {
    if (!photo.url) {
      showToast('Sem Imagem', 'Anexe uma foto real para analisar com o modelo de visão.', 'info');
      return;
    }

    setAnalyzingPhotoId(photo.id);
    try {
      const res = await fetch('/api/ai/vision-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photo.url,
          promptText: `Analise a foto técnica de medição "${photo.label}" do projeto ${selectedProject?.title || ''}. Identifique obstáculos, prumo, tomadas e hidráulica.`,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id
              ? {
                  ...p,
                  isAiAnalyzed: true,
                  aiAnalysis: data.analysis,
                }
              : p
          )
        );
        showToast('Análise Concluída!', 'Gemma 4 12B Vision identificou elementos e interferências na foto.', 'success');
      } else {
        showToast('Aviso', 'Não foi possível extrair dados visuais da foto.', 'warning');
      }
    } catch (e: any) {
      showToast('Erro de Conexão', e.message || 'Falha ao conectar com o serviço de visão local.', 'warning');
    } finally {
      setAnalyzingPhotoId(null);
    }
  };

  const handleApplyVisionToObservations = (photo: FieldPhoto) => {
    if (!photo.aiAnalysis) return;
    const obstacles = photo.aiAnalysis.suggestedObstacles?.join(', ') || '';
    const elements = photo.aiAnalysis.detectedElements?.join(', ') || '';
    const addition = `\n[Laudo IA Visão - ${photo.label}]: Elementos detectados: ${elements}. Obstáculos/Restrições: ${obstacles}. (${photo.aiAnalysis.legalDisclaimer || 'Estimativa visual'})`;

    setObsText((prev) => `${prev.trim()}${addition}`);
    showToast('Incorporado ao Laudo!', 'Constatações da IA adicionadas às observações técnicas.', 'success');
  };

  const handleRemovePhoto = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    setPhotos(photos.filter((p) => p.id !== id));
    showToast('Foto Removida', `"${photo?.label || 'Item'}" removido do laudo.`, 'info');
  };

  const handleValidatePackage = () => {
    if (!selectedProject) return;

    const updated = projects.map((p) => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          technicalVisit: {
            id: `tv-${Date.now()}`,
            projectId: p.id,
            visitDate: new Date().toISOString().split('T')[0],
            responsibleName: 'Técnico Especialista WoodBit (Natividade)',
            isValidated: true,
            checklist: {
              plumbAndSquare: prumoVerified,
              ceilingHeight: peDireitoVerified,
              electricalOutlets: tomadasVerified,
              plumbingPoints: hidraulicaVerified,
              gasPoints: gasVerified,
              obstaclesNoted: true,
              accessClearance: acessoElevadorVerified,
            },
            photosCount: photos.length,
            observations: obsText,
          },
          status: 'production' as const,
        };
      }
      return p;
    });

    onUpdateProjects(updated);
    setValidationSuccess(true);
    showToast(
      'Medição Validada com Sucesso!',
      `Projeto "${selectedProject.title}" liberado para corte CNC e marcenaria.`,
      'success'
    );
    setTimeout(() => setValidationSuccess(false), 5000);
  };

  const handleExportLaudo = () => {
    if (!selectedProject) return;
    let laudo = `=====================================================\n`;
    laudo += `WOODBIT MARCENARIA & CNC - LAUDO TÉCNICO DE MEDIÇÃO\n`;
    laudo += `Projeto: ${selectedProject.title} (${selectedProject.code})\n`;
    laudo += `Cliente: ${selectedProject.customerName}\n`;
    laudo += `Endereço: ${selectedProject.address}, ${selectedProject.city} - RJ\n`;
    laudo += `Data da Visita: ${new Date().toLocaleDateString('pt-BR')}\n`;
    laudo += `Responsável: Técnico Especialista WoodBit (Polo ${selectedProject.city})\n`;
    laudo += `=====================================================\n\n`;
    laudo += `PONTOS DE CONTROLE CONFERIDOS:\n`;
    laudo += `[${prumoVerified ? 'X' : ' '}] 1. Desaprumo e Esquadro de Paredes (Laser)\n`;
    laudo += `[${peDireitoVerified ? 'X' : ' '}] 2. Pé-Direito Mínimo e Sancas\n`;
    laudo += `[${tomadasVerified ? 'X' : ' '}] 3. Pontos Elétricos & Tensão (110V/220V)\n`;
    laudo += `[${hidraulicaVerified ? 'X' : ' '}] 4. Hidráulica, Ralos & Ponto de Gás\n`;
    laudo += `[${acessoElevadorVerified ? 'X' : ' '}] 5. Logística de Acesso ao Imóvel (Elevador/Escada)\n`;
    laudo += `[X] 6. Registro Fotográfico (${photos.length} fotos anexadas)\n\n`;
    laudo += `FOTOS REGISTRADAS:\n`;
    photos.forEach((f, i) => {
      laudo += `  - Foto #${i + 1}: ${f.label}${f.isAiAnalyzed ? ' [Analisada por IA Gemma 4 Vision]' : ''}\n`;
    });
    laudo += `\nOBSERVAÇÕES TÉCNICAS:\n${obsText}\n\n`;
    laudo += `TERMO DE LIBERAÇÃO:\nMedidas conferidas no local com instrumentos aferidos. Liberado para corte CNC e montagem.\n`;

    const blob = new Blob([laudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laudo_medicao_${selectedProject.code}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Laudo Técnico Exportado!', 'Arquivo gerado para arquivamento ou envio ao cliente.', 'success');
  };

  const checklistItems = [
    {
      id: 'prumo',
      label: '1. Desaprumo e Esquadro de Paredes',
      desc: 'Conferido com esquadro e nível a laser rotativo nos 4 cantos do cômodo.',
      checked: prumoVerified,
      toggle: () => setPrumoVerified(!prumoVerified),
    },
    {
      id: 'peDireito',
      label: '2. Pé-Direito Mínimo & Sancas de Gesso',
      desc: 'Verificada altura do piso acabado até o rebaixo de gesso / laje.',
      checked: peDireitoVerified,
      toggle: () => setPeDireitoVerified(!peDireitoVerified),
    },
    {
      id: 'tomadas',
      label: '3. Pontos Elétricos & Tensão (110V/220V)',
      desc: 'Marcadas posições exatas de tomadas para fornos, micro-ondas e fitas LED.',
      checked: tomadasVerified,
      toggle: () => setTomadasVerified(!tomadasVerified),
    },
    {
      id: 'hidraulica',
      label: '4. Hidráulica, Ralos & Ponto de Gás',
      desc: 'Conferida altura do esgoto da pia, saída de filtro e botijão ou gás encanado.',
      checked: hidraulicaVerified,
      toggle: () => setHidraulicaVerified(!hidraulicaVerified),
    },
    {
      id: 'acesso',
      label: '5. Logística de Acesso ao Imóvel',
      desc: 'Elevador comporta chapas 2750×1850mm? Vão de escadas permite içamento seguro?',
      checked: acessoElevadorVerified,
      toggle: () => setAcessoElevadorVerified(!acessoElevadorVerified),
    },
    {
      id: 'fotos',
      label: '6. Registro Fotográfico em Nuvem',
      desc: `${photos.length} registros anexados ao pacote técnico de fabricação.`,
      checked: photos.length > 0,
      toggle: () => {},
      isStatic: true,
    },
  ];

  return (
    <div id="field-visit-view-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-5 rounded-2xl beveled-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)] shadow-xs">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
              Visita Técnica Presencial & Pacote de Medição
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Conferência in loco com trena e esquadro a laser — Pré-requisito para liberação do corte CNC.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedProject?.id || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-[var(--bg-low)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] rounded-xl px-3.5 py-2 focus:outline-none focus:border-[var(--color-primary)] cursor-pointer font-medium"
          >
            {availableProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.title} ({p.customerName} - {p.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PWA Mobile Offline Sync Banner */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-4 rounded-2xl beveled-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isOnline ? 'bg-[#7dd396] shadow-[0_0_8px_#7dd396]' : 'bg-[#fecc93] animate-pulse'}`}></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-[#7dd396]" /> Servidor da Oficina Online
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-[#fecc93]" /> Modo Campo Offline (Gravando no Dispositivo)
                  </>
                )}
              </span>
              {queueCount > 0 && (
                <span className="text-[11px] font-mono font-bold bg-[#fecc93]/20 text-[#fecc93] px-2 py-0.5 rounded-full border border-[#fecc93]/40">
                  {queueCount} alteraç{queueCount > 1 ? 'ões' : 'ão'} na fila
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-[var(--text-muted)]" /> PWA Standalone instalado no celular sincroniza fotos e checklists automaticamente ao reconectar ao Wi-Fi.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleManualSync}
          disabled={isSyncing || !isOnline}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto ${
            isOnline
              ? 'bg-[var(--bg-low)] hover:bg-[var(--color-primary)] text-[var(--text-main)] hover:text-[#1b1715] border border-[var(--border-subtle)] shadow-xs'
              : 'opacity-50 cursor-not-allowed bg-[var(--bg-low)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Sincronizar com a Oficina'}
        </button>
      </div>

      {/* Regional Filter Banner */}
      {selectedCity !== 'all' && (
        <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-3.5 px-4 flex items-center justify-between gap-3 beveled-card shadow-xs text-xs">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-[var(--text-main)] font-medium">
              Filtrando visitas no polo: <strong className="text-[var(--color-primary)] font-bold">{selectedCity} - RJ</strong>
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

      {selectedProject && (
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-6 beveled-card shadow-md space-y-6">
          {/* Project Summary Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-[var(--color-primary)] font-bold bg-[var(--bg-lowest)] px-2.5 py-0.5 rounded-md border border-[var(--border-subtle)]">
                  {selectedProject.code} (v{selectedProject.version})
                </span>
                <h3 className="font-display font-bold text-lg text-[var(--text-main)]">
                  {selectedProject.title}
                </h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Cliente: <strong className="text-slate-200">{selectedProject.customerName}</strong> •{' '}
                {selectedProject.address}, {selectedProject.city} - RJ
              </p>
            </div>

            <span
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider ${
                selectedProject.technicalVisit?.isValidated
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
              }`}
            >
              {selectedProject.technicalVisit?.isValidated
                ? '✓ Medição Validada e Liberada'
                : '⚠ Pendente de Conferência'}
            </span>
          </div>

          {/* Checklist Form: Touch-Friendly Toggle Cards */}
          <div className="space-y-3.5">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[var(--color-primary)]" />
              Checklist Estrutural & Instalações (6 Pontos de Controle)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  onClick={item.toggle}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    item.checked
                      ? 'bg-gradient-to-r from-emerald-950/30 to-[var(--bg-low)] border-emerald-500/40 shadow-xs'
                      : 'bg-[var(--bg-low)] border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <span className="font-bold text-sm text-[var(--text-main)] block leading-snug">
                      {item.label}
                    </span>
                    <span className="text-xs text-slate-400 block leading-relaxed font-medium">
                      {item.desc}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs transition-all ${
                      item.checked
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 border border-slate-700 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Gallery & Upload */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[var(--color-primary)]" />
                Galeria de Registros Fotográficos da Obra ({photos.length})
              </h4>
              <span className="text-xs text-slate-400 font-mono">Resolução alta / Nuvem WoodBit</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl p-3.5 text-xs flex flex-col justify-between group hover:border-[var(--color-primary)]/50 transition-all shadow-xs space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <ImageIcon className="w-4 h-4" />
                        <span className="font-mono text-xs font-bold">Foto #{idx + 1}</span>
                      </div>
                      {photo.isAiAnalyzed ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-400" /> Gemma 4 Vision
                        </span>
                      ) : null}
                    </div>

                    {photo.url ? (
                      <div className="relative h-36 rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-black/40">
                        <img
                          src={photo.url}
                          alt={photo.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-16 rounded-xl border border-dashed border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] bg-[var(--bg-container)]/40">
                        <span className="text-[11px] font-mono">Registro conceitual / Sem imagem</span>
                      </div>
                    )}

                    <span className="text-xs text-[var(--text-main)] font-semibold leading-relaxed block">
                      {photo.label}
                    </span>

                    {/* AI Vision Insights Box */}
                    {photo.aiAnalysis && (
                      <div className="p-2.5 rounded-xl bg-[var(--bg-container)] border border-purple-500/30 text-[11px] space-y-1.5 animate-in fade-in">
                        <div className="text-purple-300 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Obstáculos Detectados:
                        </div>
                        <ul className="list-disc list-inside text-[var(--text-muted)] space-y-0.5">
                          {photo.aiAnalysis.suggestedObstacles?.map((obs, oIdx) => (
                            <li key={oIdx} className="leading-tight">{obs}</li>
                          ))}
                        </ul>
                        <div className="text-[10px] text-amber-300/80 italic font-mono pt-1">
                          {photo.aiAnalysis.legalDisclaimer}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyVisionToObservations(photo)}
                          className="w-full mt-1.5 py-1 px-2 rounded-lg bg-purple-900/40 hover:bg-purple-900/70 text-purple-200 border border-purple-500/30 text-[10px] font-bold transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Incorporar ao Laudo
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] gap-2">
                    {photo.url ? (
                      <button
                        type="button"
                        disabled={analyzingPhotoId === photo.id}
                        onClick={() => handleAnalyzeWithVision(photo)}
                        className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer font-bold disabled:opacity-50 transition"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${analyzingPhotoId === photo.id ? 'animate-spin' : ''}`} />
                        {analyzingPhotoId === photo.id ? 'Analisando...' : photo.isAiAnalyzed ? 'Reanalisar IA' : 'Analisar com IA'}
                      </button>
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)]">Suba imagem p/ analisar</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer font-semibold opacity-80 hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Photo & Camera Upload Toolbar */}
            <div className="p-4 rounded-2xl bg-[var(--bg-low)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <input
                  type="text"
                  placeholder="Nome ou detalhe do registro (Ex: Ponto de hidráulica com desvio)..."
                  value={newPhotoLabel}
                  onChange={(e) => setNewPhotoLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPhoto()}
                  className="w-full sm:flex-1 bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] font-medium"
                />

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[var(--bg-container)] hover:bg-[var(--bg-high)] text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs">
                    <Camera className="w-4 h-4 text-purple-400" />
                    Tirar Foto / Carregar
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[var(--bg-high)] hover:bg-[var(--color-primary)] text-slate-200 hover:text-[#1b1715] border border-[var(--border-subtle)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Adicionar
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Fotos enviadas pela câmera do celular são analisadas localmente pelo modelo Google Gemma 4 12B Vision.
              </p>
            </div>
          </div>

          {/* Technical Observations */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
              Observações Técnicas do Medidor & Restrições Construtivas
            </label>
            <textarea
              rows={3}
              value={obsText}
              onChange={(e) => setObsText(e.target.value)}
              className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] leading-relaxed"
            />
          </div>

          {/* Validation Sign-off Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--bg-low)] to-[var(--bg-container)] border border-[var(--color-primary)]/40 space-y-4 debossed shadow-sm">
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">
                <strong>Termo de Responsabilidade Técnica:</strong> Declaro que as medidas foram conferidas com trena e esquadro a laser no local e autorizo formalmente a liberação das OPs de usinagem CNC e marcenaria.
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <button
                onClick={handleExportLaudo}
                className="px-4 py-2.5 rounded-xl bg-[var(--bg-high)] hover:bg-[var(--bg-low)] text-slate-200 border border-[var(--border-subtle)] text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition"
              >
                <Download className="w-4 h-4 text-amber-400" />
                Exportar Laudo Técnico (.txt)
              </button>

              <button
                id="btn-validate-measurement-package"
                onClick={handleValidatePackage}
                className="convex-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <FileCheck className="w-4 h-4" />
                Validar e Liberar para Produção
              </button>
            </div>
          </div>

          {validationSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-in fade-in shadow-md">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              Pacote de medição validado com sucesso! O projeto foi promovido para "Em Produção".
            </div>
          )}
        </div>
      )}
    </div>
  );
};
