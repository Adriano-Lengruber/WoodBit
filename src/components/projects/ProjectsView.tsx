import React, { useState } from 'react';
import {
  Layers,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Phone,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  History,
  FileText
} from 'lucide-react';
import { Project, Room, TechnicalVisit } from '../../types';

interface ProjectsViewProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
  onNavigateToQuotes: () => void;
  onNavigateToProduction: () => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onUpdateProjects,
  onNavigateToQuotes,
  onNavigateToProduction,
  selectedCity = 'all',
  onSelectCity,
}) => {
  const filteredProjects = projects.filter((p) => {
    if (selectedCity === 'all') return true;
    return p.city.toLowerCase().includes(selectedCity.toLowerCase());
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(
    filteredProjects[0] || projects[0] || null
  );
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);

  // Sync selectedProject when city filter changes
  React.useEffect(() => {
    if (filteredProjects.length > 0) {
      if (!selectedProject || !filteredProjects.some((p) => p.id === selectedProject.id)) {
        setSelectedProject(filteredProjects[0]);
      }
    } else {
      setSelectedProject(null);
    }
  }, [selectedCity, projects]);

  // New room state
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomWidth, setNewRoomWidth] = useState(3000);
  const [newRoomHeight, setNewRoomHeight] = useState(2600);
  const [newRoomDepth, setNewRoomDepth] = useState(600);

  // Add room
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: newRoomName,
      description: newRoomDesc,
      measurements: {
        width: newRoomWidth,
        height: newRoomHeight,
        depth: newRoomDepth,
      },
      photos: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60'],
      itemsCount: 0,
      materialsUsed: ['MDF Louro Freijó', 'MDF Branco TX'],
    };

    const updatedProject: Project = {
      ...selectedProject,
      rooms: [...selectedProject.rooms, newRoom],
      updatedAt: new Date().toISOString(),
    };

    const updatedList = projects.map((p) => (p.id === selectedProject.id ? updatedProject : p));
    onUpdateProjects(updatedList);
    setSelectedProject(updatedProject);
    setShowAddRoomModal(false);
    setNewRoomName('');
    setNewRoomDesc('');
  };

  // Bump version
  const handleBumpVersion = (versionName: string) => {
    if (!selectedProject) return;

    const updatedProject: Project = {
      ...selectedProject,
      version: selectedProject.version + 1,
      currentVersionName: `v${selectedProject.version + 1}.0 - ${versionName}`,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = projects.map((p) => (p.id === selectedProject.id ? updatedProject : p));
    onUpdateProjects(updatedList);
    setSelectedProject(updatedProject);
    setShowVersionModal(false);
  };

  return (
    <div id="projects-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#231f1d] border border-[#4f453a]/40 p-4 rounded-xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-base text-[#eae1dd] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#fecc93]" />
            Projetos, Ambientes & Pacote de Medição
          </h2>
          <p className="text-xs text-[#d3c4b6]">
            Histórico de versões, validação técnica obrigatória para liberação de produção e detalhamento por cômodo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVersionModal(true)}
            className="px-3 py-1.5 rounded-lg bg-[#2e2927] hover:bg-[#393431] text-[#fecc93] border border-[#fecc93]/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <History className="w-4 h-4" /> Criar Nova Versão (v{selectedProject ? selectedProject.version + 1 : 2})
          </button>
        </div>
      </div>

      {/* City Filter Active Notification Banner */}
      {selectedCity !== 'all' && (
        <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 beveled-card shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
            <span className="text-xs font-semibold text-[var(--text-main)]">
              Exibindo projetos de: <strong className="text-[var(--color-primary)] font-bold">{selectedCity} - RJ</strong> ({filteredProjects.length} de {projects.length})
            </span>
          </div>
          {onSelectCity && (
            <button
              onClick={() => onSelectCity('all')}
              className="text-xs text-[var(--color-primary)] hover:underline font-bold self-start sm:self-auto cursor-pointer"
            >
              ✕ Mostrar Todos os Polos
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Projects List on Left, Detail & Rooms on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 4 Cols: Project Cards */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#d3c4b6]">
            Projetos Registrados ({filteredProjects.length})
          </h3>

          {filteredProjects.length === 0 ? (
            <div className="p-6 rounded-xl bg-[#231f1d] border border-[#4f453a]/40 text-center space-y-2">
              <p className="text-xs text-[#9c8e82]">Nenhum projeto encontrado em {selectedCity}.</p>
              {onSelectCity && (
                <button
                  onClick={() => onSelectCity('all')}
                  className="text-xs text-[#fecc93] hover:underline font-bold"
                >
                  Ver todos os projetos
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredProjects.map((prj) => (
                <div
                  key={prj.id}
                  onClick={() => setSelectedProject(prj)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left space-y-2 ${
                    selectedProject?.id === prj.id
                      ? 'bg-[#2e2927] border-[#fecc93] shadow-md beveled-card'
                      : 'bg-[#231f1d] border-[#4f453a]/40 hover:border-[#fecc93]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#110d0c] text-[#fecc93]">
                          {prj.code}
                        </span>
                        <h4 className="font-semibold text-xs text-[#eae1dd]">{prj.title}</h4>
                      </div>
                      <p className="text-[11px] text-[#9c8e82] mt-0.5">{prj.customerName}</p>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#110d0c] text-[#d3c4b6] border border-[#4f453a]/40">
                      v{prj.version}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#4f453a]/20">
                    <span className="text-[#d3c4b6] text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#fecc93]" /> {prj.city}
                    </span>
                    <span className="font-mono text-[#9cd499] font-bold">
                      R$ {prj.totalValue.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#9c8e82]">
                    <span>{prj.rooms.length} ambientes cadastrados</span>
                    <span
                      className={`font-semibold ${
                        prj.technicalVisit?.isValidated ? 'text-[#9cd499]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      {prj.technicalVisit?.isValidated ? '✓ Medição Validada' : '⚠ Medição Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 8 Cols: Selected Project Details & Rooms */}
        <div className="lg:col-span-8 space-y-5">
          {selectedProject ? (
            <div className="bg-[#231f1d] border border-[#4f453a]/50 rounded-xl p-5 beveled-card space-y-5">
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#4f453a]/40 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#fecc93]">
                      {selectedProject.code}
                    </span>
                    <h3 className="font-display font-bold text-sm text-[#eae1dd]">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#d3c4b6] mt-0.5">
                    Cliente: {selectedProject.customerName} ({selectedProject.customerPhone}) • {selectedProject.address}, {selectedProject.city}
                  </p>
                  <span className="text-[10px] font-mono text-[#fecc93] block mt-1">
                    Versão Atual: {selectedProject.currentVersionName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddRoomModal(true)}
                    className="convex-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Cômodo / Ambiente
                  </button>
                </div>
              </div>

              {/* Technical Visit & Measurement Package Status */}
              <div className="bg-[#1f1b19] border border-[#4f453a]/50 p-4 rounded-xl space-y-3 debossed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-[#fecc93]" />
                    <h4 className="font-display font-bold text-xs text-[#eae1dd]">
                      Pacote de Medição Técnica & Checklist Presencial
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      selectedProject.technicalVisit?.isValidated
                        ? 'bg-[#1d5123] text-[#9cd499]'
                        : 'bg-[#93000a] text-[#ffb4ab]'
                    }`}
                  >
                    {selectedProject.technicalVisit?.isValidated
                      ? 'Liberado para Produção'
                      : 'Bloqueado — Aguardando Visita'}
                  </span>
                </div>

                {selectedProject.technicalVisit ? (
                  <div className="space-y-2 text-xs">
                    <p className="text-[#d3c4b6]">
                      Responsável: <strong>{selectedProject.technicalVisit.responsibleName}</strong> • {selectedProject.technicalVisit.photosCount} fotos anexadas.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <span className="text-[#9cd499] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Prumo e Esquadro
                      </span>
                      <span className="text-[#9cd499] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Pé-direito Medido
                      </span>
                      <span className="text-[#9cd499] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Tomadas Mapeadas
                      </span>
                      <span className="text-[#9cd499] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Hidráulica & Gás
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9c8e82] italic bg-[#110d0c] p-2 rounded">
                      Obs: {selectedProject.technicalVisit.observations}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#ffb4ab]">
                    Nenhuma visita técnica registrada. A produção CNC e Marcenaria não poderá ser liberada sem o checklist presencial completo.
                  </p>
                )}
              </div>

              {/* Rooms List */}
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-xs text-[#eae1dd] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#fecc93]" />
                  Ambientes do Projeto ({selectedProject.rooms.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {selectedProject.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-[#1f1b19] border border-[#4f453a]/40 rounded-xl p-3.5 space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <h5 className="font-semibold text-xs text-[#eae1dd]">{room.name}</h5>
                        <span className="text-[10px] text-[#fecc93] font-mono">
                          {room.itemsCount} itens
                        </span>
                      </div>

                      <p className="text-[11px] text-[#d3c4b6]">{room.description}</p>

                      {room.measurements && (
                        <div className="bg-[#110d0c] p-2 rounded text-[10px] font-mono text-[#d3c4b6] flex items-center justify-between">
                          <span>Largura: {room.measurements.width}mm</span>
                          <span>Altura: {room.measurements.height}mm</span>
                          <span>Prof: {room.measurements.depth}mm</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="text-[10px] text-[#9c8e82] block">Materiais e Acabamentos:</span>
                        <div className="flex flex-wrap gap-1">
                          {room.materialsUsed.map((mat, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-[#2e2927] text-[#fecc93]"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#231f1d] border border-[#4f453a]/40 rounded-xl p-10 text-center text-[#9c8e82] text-xs">
              Selecione um projeto para ver a divisão por ambientes e o pacote de medição.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Room */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#231f1d] border border-[#fecc93]/40 rounded-xl p-5 max-w-md w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#4f453a]/40">
              <h3 className="font-display font-bold text-sm text-[#eae1dd]">
                Adicionar Ambiente / Cômodo
              </h3>
              <button onClick={() => setShowAddRoomModal(false)} className="text-[#9c8e82]">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-3">
              <div>
                <label className="text-[11px] text-[#d3c4b6] block mb-1">Nome do Ambiente</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Cozinha Gourmet, Quarto Casal, Setup Gamer"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg px-3 py-1.5 text-xs text-[#eae1dd] focus:outline-none focus:border-[#fecc93]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#d3c4b6] block mb-1">Descrição dos Móveis / Componentes</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Armários aéreos com vidro reflecta, gaveteiros com amortecedor slow..."
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg p-2 text-xs text-[#eae1dd] focus:outline-none focus:border-[#fecc93]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#d3c4b6] block mb-1">Largura (mm)</label>
                  <input
                    type="number"
                    value={newRoomWidth}
                    onChange={(e) => setNewRoomWidth(Number(e.target.value))}
                    className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg px-3 py-1.5 text-xs text-[#eae1dd]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#d3c4b6] block mb-1">Altura (mm)</label>
                  <input
                    type="number"
                    value={newRoomHeight}
                    onChange={(e) => setNewRoomHeight(Number(e.target.value))}
                    className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg px-3 py-1.5 text-xs text-[#eae1dd]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#d3c4b6] block mb-1">Prof. (mm)</label>
                  <input
                    type="number"
                    value={newRoomDepth}
                    onChange={(e) => setNewRoomDepth(Number(e.target.value))}
                    className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg px-3 py-1.5 text-xs text-[#eae1dd]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#4f453a]/40">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#d3c4b6]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="convex-btn px-4 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Salvar Ambiente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Version Bump */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#231f1d] border border-[#fecc93]/40 rounded-xl p-5 max-w-md w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#4f453a]/40">
              <h3 className="font-display font-bold text-sm text-[#eae1dd]">
                Criar Nova Versão do Projeto (v{selectedProject ? selectedProject.version + 1 : 2}.0)
              </h3>
              <button onClick={() => setShowVersionModal(false)} className="text-[#9c8e82]">
                ✕
              </button>
            </div>

            <p className="text-xs text-[#d3c4b6]">
              A versão anterior será preservada no histórico de auditoria para fins de garantia e controle de revisões com o cliente.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleBumpVersion('Ajuste de Medidas da Visita Técnica')}
                className="w-full p-2.5 rounded-lg bg-[#1f1b19] border border-[#4f453a]/50 hover:border-[#fecc93] text-left text-xs text-[#eae1dd] transition"
              >
                ✓ v{selectedProject ? selectedProject.version + 1 : 2}.0 — Ajuste de Medidas da Visita Técnica
              </button>
              <button
                onClick={() => handleBumpVersion('Revisão de Materiais e Acabamentos')}
                className="w-full p-2.5 rounded-lg bg-[#1f1b19] border border-[#4f453a]/50 hover:border-[#fecc93] text-left text-xs text-[#eae1dd] transition"
              >
                ✓ v{selectedProject ? selectedProject.version + 1 : 2}.0 — Revisão de Materiais e Acabamentos
              </button>
              <button
                onClick={() => handleBumpVersion('Aprovação Final para Produção CNC')}
                className="w-full p-2.5 rounded-lg bg-[#1f1b19] border border-[#4f453a]/50 hover:border-[#fecc93] text-left text-xs text-[#eae1dd] transition"
              >
                ✓ v{selectedProject ? selectedProject.version + 1 : 2}.0 — Aprovação Final para Produção CNC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
