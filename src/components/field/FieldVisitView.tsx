import React, { useState } from 'react';
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
  Download
} from 'lucide-react';
import { Project } from '../../types';
import { useToast } from '../../context/ToastContext';

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
    'Ponto de tomada 220V do forno localizado a 1150mm do piso. Prumo da parede da pia com desvio de 3mm corrigido no recuo do módulo.'
  );
  const [photos, setPhotos] = useState<string[]>([
    'Parede Pia - Prumo Laser',
    'Ponto 220V Forno Embutido',
    'Sanca de Gesso & Pé-Direito 2650mm',
    'Acesso Elevador / Escada',
  ]);
  const [newPhotoLabel, setNewPhotoLabel] = useState('');
  const [validationSuccess, setValidationSuccess] = useState(false);

  const handleAddPhoto = () => {
    if (!newPhotoLabel.trim()) return;
    const added = newPhotoLabel.trim();
    setPhotos([...photos, added]);
    setNewPhotoLabel('');
    showToast('Registro Fotográfico Anexado!', `"${added}" adicionado ao laudo.`, 'success');
  };

  const handleRemovePhoto = (idx: number) => {
    const removed = photos[idx];
    setPhotos(photos.filter((_, i) => i !== idx));
    showToast('Foto Removida', `"${removed}" removido do laudo.`, 'info');
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
    laudo += `CHECKLIST ESTRUTURAL & INSTALAÇÕES:\n`;
    laudo += `1. Desaprumo e Esquadro: ${prumoVerified ? 'CONFERIDO / OK' : 'PENDENTE'}\n`;
    laudo += `2. Pé-Direito Mínimo: ${peDireitoVerified ? 'CONFERIDO / OK' : 'PENDENTE'}\n`;
    laudo += `3. Pontos Elétricos (110V/220V): ${tomadasVerified ? 'CONFERIDO / OK' : 'PENDENTE'}\n`;
    laudo += `4. Hidráulica & Gás: ${hidraulicaVerified ? 'CONFERIDO / OK' : 'PENDENTE'}\n`;
    laudo += `5. Logística de Acesso: ${acessoElevadorVerified ? 'CONFERIDO / OK' : 'PENDENTE'}\n\n`;
    laudo += `REGISTROS FOTOGRÁFICOS (${photos.length} fotos):\n`;
    photos.forEach((ph, i) => {
      laudo += `  - Foto #${i + 1}: ${ph}\n`;
    });
    laudo += `\nOBSERVAÇÕES DO MEDIDOR:\n${obsText}\n\n`;
    laudo += `STATUS: LIBERADO PARA CORTE CNC E MARCENARIA\n`;

    const blob = new Blob([laudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laudo_medicao_${selectedProject.code}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Laudo Técnico Exportado!', 'Arquivo gerado para arquivo físico ou envio ao cliente.', 'success');
  };

  return (
    <div id="field-visit-view-container" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-4 rounded-xl beveled-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="font-display font-bold text-base text-[var(--text-main)]">
              Visita Técnica Presencial & Pacote de Medição
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Checklist de conferência in loco e esquadro a laser obrigatório para liberação de corte CNC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedProject?.id || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-[var(--bg-low)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
          >
            {availableProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.title} ({p.customerName} - {p.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* City Filter Notice */}
      {selectedCity !== 'all' && (
        <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-3 px-4 flex items-center justify-between gap-3 beveled-card shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-[var(--text-main)]">
              Filtrando visitas no polo: <strong className="text-[var(--color-primary)]">{selectedCity} - RJ</strong>
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
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-6 beveled-card space-y-6">
          {/* Project Summary Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-3">
            <div>
              <span className="text-xs font-mono text-[var(--color-primary)] font-bold">
                {selectedProject.code} (v{selectedProject.version})
              </span>
              <h3 className="font-display font-bold text-base text-[var(--text-main)]">
                {selectedProject.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Cliente: {selectedProject.customerName} • {selectedProject.address}, {selectedProject.city} - RJ
              </p>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                selectedProject.technicalVisit?.isValidated
                  ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/40'
                  : 'bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/40'
              }`}
            >
              {selectedProject.technicalVisit?.isValidated
                ? '✓ Medição Validada e Liberada'
                : '⚠ Pendente de Conferência'}
            </span>
          </div>

          {/* Checklist Form */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[var(--color-primary)]" />
              Checklist Estrutural & Instalações (6 Pontos de Controle)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--color-primary)]/40 transition">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[var(--text-main)] block">
                    1. Desaprumo e Esquadro de Paredes
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Conferido com esquadro a laser nos 4 cantos
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={prumoVerified}
                  onChange={(e) => setPrumoVerified(e.target.checked)}
                  className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--color-primary)]/40 transition">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[var(--text-main)] block">
                    2. Pé-Direito Mínimo e Sancas
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Verificado altura do piso ao teto / gesso
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={peDireitoVerified}
                  onChange={(e) => setPeDireitoVerified(e.target.checked)}
                  className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--color-primary)]/40 transition">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[var(--text-main)] block">
                    3. Pontos Elétricos & Tensão (110V/220V)
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Marcadas posições de tomadas de fornos e cooktop
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={tomadasVerified}
                  onChange={(e) => setTomadasVerified(e.target.checked)}
                  className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--color-primary)]/40 transition">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[var(--text-main)] block">
                    4. Hidráulica, Ralos & Ponto de Gás
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Conferida altura do esgoto da pia e botijão/gás canalizado
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hidraulicaVerified}
                  onChange={(e) => setHidraulicaVerified(e.target.checked)}
                  className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--color-primary)]/40 transition">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[var(--text-main)] block">
                    5. Logística de Acesso ao Imóvel
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Elevador comporta chapas 2750x1830mm? Escadas estreitas?
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={acessoElevadorVerified}
                  onChange={(e) => setAcessoElevadorVerified(e.target.checked)}
                  className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-low)] border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--color-primary)]/40 transition">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[var(--text-main)] block">
                    6. Registro Fotográfico em Nuvem
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {photos.length} fotos anexadas ao pacote
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[var(--color-primary)] font-mono font-bold">
                  <Camera className="w-4 h-4" /> {photos.length} fotos
                </div>
              </label>
            </div>
          </div>

          {/* Photo Gallery & Upload */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[var(--color-primary)]" />
              Galeria de Registros Fotográficos da Obra
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-xs flex flex-col justify-between group relative hover:border-[var(--color-primary)]/50 transition"
                >
                  <div className="flex items-center gap-1.5 text-[var(--color-primary)] mb-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span className="font-mono text-[10px]">Foto #{idx + 1}</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-main)] font-medium leading-tight">
                    {photo}
                  </span>
                  <button
                    onClick={() => handleRemovePhoto(idx)}
                    className="mt-2 text-[10px] text-[#ffb4ab] hover:underline flex items-center gap-1 opacity-80 hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Remover
                  </button>
                </div>
              ))}
            </div>

            {/* Add Photo input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Nome/legenda da nova foto (Ex: Prumo do nicho da geladeira)..."
                value={newPhotoLabel}
                onChange={(e) => setNewPhotoLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPhoto()}
                className="flex-1 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button
                onClick={handleAddPhoto}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-high)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Anexar Registro
              </button>
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="text-[11px] text-[var(--text-muted)] block mb-1 font-semibold">
              Observações Técnicas do Medidor & Restrições Construtivas
            </label>
            <textarea
              rows={3}
              value={obsText}
              onChange={(e) => setObsText(e.target.value)}
              className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Validation Sign-off button */}
          <div className="p-4 rounded-xl bg-[var(--bg-low)] border border-[var(--color-primary)]/30 space-y-3 debossed">
            <div className="flex items-center gap-2 text-xs text-[var(--text-main)]">
              <ShieldCheck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span>
                Termo de Responsabilidade Técnica: Declaro que as medidas foram conferidas com trena e esquadro a laser no local e autorizo a liberação das OPs de corte CNC e marcenaria.
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={handleExportLaudo}
                className="px-4 py-2.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-high)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-[var(--color-primary)]" />
                Exportar Laudo (.txt)
              </button>
              <button
                id="btn-validate-measurement-package"
                onClick={handleValidatePackage}
                className="convex-btn px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <FileCheck className="w-4 h-4" />
                Validar e Liberar para Produção
              </button>
            </div>
          </div>

          {validationSuccess && (
            <div className="p-3 rounded-lg bg-[var(--color-secondary-container)] border border-[var(--color-secondary)] text-[var(--color-secondary)] text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Pacote de medição validado com sucesso! O projeto foi promovido para "Em Produção".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

