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
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-5 rounded-2xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)] shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
              Projetos, Ambientes & Pacote de Medição
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Histórico de revisões, validação técnica presencial obrigatória para corte CNC e detalhamento por cômodo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVersionModal(true)}
            className="px-4 py-2 rounded-xl bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[var(--color-primary)] border border-[var(--color-primary)]/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <History className="w-4 h-4" /> Criar Nova Versão (v{selectedProject ? selectedProject.version + 1 : 2}.0)
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
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Projetos Registrados ({filteredProjects.length})
          </h3>

          {filteredProjects.length === 0 ? (
            <div className="p-6 rounded-xl bg-[var(--bg-container)] border border-[var(--border-subtle)] text-center space-y-2 beveled-card">
              <p className="text-xs text-[var(--text-faint)] font-medium">Nenhum projeto encontrado em {selectedCity}.</p>
              {onSelectCity && (
                <button
                  onClick={() => onSelectCity('all')}
                  className="text-xs text-[var(--color-primary)] hover:underline font-bold cursor-pointer"
                >
                  Ver todos os projetos
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((prj) => (
                <div
                  key={prj.id}
                  onClick={() => setSelectedProject(prj)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left space-y-2.5 ${
                    selectedProject?.id === prj.id
                      ? 'bg-[var(--bg-high)] border-[var(--color-primary)] shadow-md beveled-card'
                      : 'bg-[var(--bg-container)] border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[var(--bg-lowest)] text-[var(--color-primary)] border border-[var(--border-subtle)] font-bold">
                          {prj.code}
                        </span>
                        <h4 className="font-bold text-sm text-[var(--text-main)] leading-snug">{prj.title}</h4>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">{prj.customerName}</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[var(--bg-lowest)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      v{prj.version}.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {prj.city}
                    </span>
                    <span className="font-mono text-[var(--color-secondary)] font-bold text-sm">
                      R$ {prj.totalValue.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-faint)] font-medium pt-1">
                    <span>{prj.rooms.length} ambientes</span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                        prj.technicalVisit?.isValidated
                          ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/30'
                          : 'bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30'
                      }`}
                    >
                      {prj.technicalVisit?.isValidated ? '✓ Medição Validada' : '⚠ Visita Pendente'}
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
            <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-6 beveled-card space-y-6 shadow-sm">
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--color-primary)] bg-[var(--bg-lowest)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
                      {selectedProject.code}
                    </span>
                    <h3 className="font-display font-bold text-base text-[var(--text-main)]">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                    Cliente: <strong className="text-[var(--text-main)]">{selectedProject.customerName}</strong> ({selectedProject.customerPhone}) • {selectedProject.address}, {selectedProject.city}
                  </p>
                  <span className="text-xs font-mono text-[var(--color-primary)] block mt-1.5 font-bold">
                    Versão Atual: {selectedProject.currentVersionName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddRoomModal(true)}
                    className="convex-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Cômodo
                  </button>
                </div>
              </div>

              {/* Technical Visit & Measurement Package Status */}
              <div className="bg-[var(--bg-low)] border border-[var(--border-subtle)] p-5 rounded-xl space-y-3.5 debossed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-[var(--color-primary)]" />
                    <h4 className="font-display font-bold text-sm text-[var(--text-main)]">
                      Pacote de Medição Técnica & Checklist Presencial
                    </h4>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-md font-mono font-bold uppercase ${
                      selectedProject.technicalVisit?.isValidated
                        ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/30'
                        : 'bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30'
                    }`}
                  >
                    {selectedProject.technicalVisit?.isValidated
                      ? 'Liberado para Produção'
                      : 'Bloqueado — Aguardando Visita'}
                  </span>
                </div>

                {selectedProject.technicalVisit ? (
                  <div className="space-y-3 text-xs">
                    <p className="text-[var(--text-muted)] font-medium">
                      Responsável Técnico: <strong className="text-[var(--text-main)] font-semibold">{selectedProject.technicalVisit.responsibleName}</strong> • {selectedProject.technicalVisit.photosCount} fotos em alta resolução anexadas.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-semibold">
                      <span className="text-[var(--color-secondary)] flex items-center gap-1.5 bg-[var(--bg-lowest)] p-2 rounded-lg border border-[var(--border-subtle)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-secondary)]" /> Prumo e Esquadro
                      </span>
                      <span className="text-[var(--color-secondary)] flex items-center gap-1.5 bg-[var(--bg-lowest)] p-2 rounded-lg border border-[var(--border-subtle)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-secondary)]" /> Pé-direito Medido
                      </span>
                      <span className="text-[var(--color-secondary)] flex items-center gap-1.5 bg-[var(--bg-lowest)] p-2 rounded-lg border border-[var(--border-subtle)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-secondary)]" /> Tomadas Mapeadas
                      </span>
                      <span className="text-[var(--color-secondary)] flex items-center gap-1.5 bg-[var(--bg-lowest)] p-2 rounded-lg border border-[var(--border-subtle)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-secondary)]" /> Hidráulica & Gás
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] italic bg-[var(--bg-lowest)] p-3 rounded-lg border border-[var(--border-subtle)]">
                      <strong className="text-[var(--text-main)] not-italic font-bold">Observações de Campo:</strong> {selectedProject.technicalVisit.observations}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#ffb4ab] font-medium">
                    Nenhuma visita técnica registrada. A produção CNC e Marcenaria não poderá ser liberada sem o checklist presencial completo para garantir tolerância zero de erro.
                  </p>
                )}
              </div>

              {/* Rooms List */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[var(--color-primary)]" />
                    Ambientes do Projeto ({selectedProject.rooms.length})
                  </h4>
                  <span className="text-xs text-[var(--text-muted)] font-mono font-semibold">
                    Detalhamento dimensional milimétrico
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-4 space-y-3 shadow-xs hover:border-[var(--color-primary)]/40 transition"
                    >
                      <div className="flex items-start justify-between">
                        <h5 className="font-bold text-sm text-[var(--text-main)]">{room.name}</h5>
                        <span className="text-xs text-[var(--color-primary)] font-mono font-bold bg-[var(--bg-lowest)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                          {room.itemsCount} itens
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">{room.description}</p>

                      {room.measurements && (
                        <div className="bg-[var(--bg-lowest)] p-2.5 rounded-lg text-xs font-mono text-[var(--text-muted)] flex items-center justify-between border border-[var(--border-subtle)] font-bold">
                          <span>L: <strong className="text-[var(--text-main)]">{room.measurements.width}mm</strong></span>
                          <span>A: <strong className="text-[var(--text-main)]">{room.measurements.height}mm</strong></span>
                          <span>P: <strong className="text-[var(--text-main)]">{room.measurements.depth}mm</strong></span>
                        </div>
                      )}

                      <div className="space-y-1.5 pt-1 border-t border-[var(--border-subtle)]">
                        <span className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                          Materiais e Acabamentos:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {room.materialsUsed.map((mat, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-md bg-[var(--bg-high)] text-[var(--color-primary)] border border-[var(--border-subtle)] font-semibold"
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
            <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-12 text-center text-[var(--text-faint)] text-sm beveled-card">
              Selecione um projeto na coluna à esquerda para ver a divisão por ambientes e o pacote de medição técnica.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Room */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-2xl p-6 max-w-lg w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="font-display font-bold text-base text-[var(--text-main)]">
                  Adicionar Ambiente / Cômodo
                </h3>
              </div>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="text-[var(--text-faint)] hover:text-[var(--text-main)] cursor-pointer text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                  Nome do Ambiente *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Cozinha Gourmet, Quarto Casal, Setup Gamer"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                  Descrição dos Móveis / Componentes
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Armários aéreos com vidro reflecta, gaveteiros com amortecedor slow-close..."
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5 font-mono">
                    Largura (mm)
                  </label>
                  <input
                    type="number"
                    value={newRoomWidth}
                    onChange={(e) => setNewRoomWidth(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5 font-mono">
                    Altura (mm)
                  </label>
                  <input
                    type="number"
                    value={newRoomHeight}
                    onChange={(e) => setNewRoomHeight(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5 font-mono">
                    Prof. (mm)
                  </label>
                  <input
                    type="number"
                    value={newRoomDepth}
                    onChange={(e) => setNewRoomDepth(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="convex-btn px-5 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-md"
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
          <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-2xl p-6 max-w-lg w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="font-display font-bold text-base text-[var(--text-main)]">
                  Criar Nova Versão do Projeto (v{selectedProject ? selectedProject.version + 1 : 2}.0)
                </h3>
              </div>
              <button
                onClick={() => setShowVersionModal(false)}
                className="text-[var(--text-faint)] hover:text-[var(--text-main)] cursor-pointer text-sm p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] font-medium">
              A versão anterior será preservada no histórico de auditoria para fins de garantia e controle de revisões com o cliente.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => handleBumpVersion('Ajuste de Medidas da Visita Técnica')}
                className="w-full p-3 rounded-xl bg-[var(--bg-low)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)] text-left text-xs text-[var(--text-main)] transition cursor-pointer font-semibold shadow-xs"
              >
                ✓ v{selectedProject ? selectedProject.version + 1 : 2}.0 — Ajuste de Medidas da Visita Técnica
              </button>
              <button
                onClick={() => handleBumpVersion('Revisão de Materiais e Acabamentos')}
                className="w-full p-3 rounded-xl bg-[var(--bg-low)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)] text-left text-xs text-[var(--text-main)] transition cursor-pointer font-semibold shadow-xs"
              >
                ✓ v{selectedProject ? selectedProject.version + 1 : 2}.0 — Revisão de Materiais e Acabamentos
              </button>
              <button
                onClick={() => handleBumpVersion('Aprovação Final para Produção CNC')}
                className="w-full p-3 rounded-xl bg-[var(--bg-low)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)] text-left text-xs text-[var(--text-main)] transition cursor-pointer font-semibold shadow-xs"
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
