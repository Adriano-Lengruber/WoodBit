import React, { useState } from 'react';
import {
  Hammer,
  Cpu,
  Printer,
  Wrench,
  ShieldCheck,
  Truck,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Layers,
  Clock,
  HardDrive,
  FileText,
  Sparkles,
  BarChart2,
  Calendar,
  Scissors,
  Gauge
} from 'lucide-react';
import {
  ProductionOrder,
  ProductionCenter,
  Machine,
  ProductionCenterType,
  ProductionOperation,
  Project
} from '../../types';
import { CutOptimizerView } from './CutOptimizerView';
import { CamSimulatorView } from './CamSimulatorView';

interface ProductionViewProps {
  productionOrders: ProductionOrder[];
  machines: Machine[];
  productionCenters: ProductionCenter[];
  projects?: Project[];
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  onUpdateOrders: (orders: ProductionOrder[]) => void;
  onUpdateMachines: (machines: Machine[]) => void;
}

export const ProductionView: React.FC<ProductionViewProps> = ({
  productionOrders,
  machines,
  productionCenters,
  projects = [],
  selectedCity = 'all',
  onSelectCity,
  onUpdateOrders,
  onUpdateMachines,
}) => {
  const [productionSubView, setProductionSubView] = useState<'pcp' | 'nesting' | 'cam'>('pcp');
  const [selectedCenter, setSelectedCenter] = useState<string>('all');

  // Filter OPs by center AND selectedCity
  const filteredOrders = productionOrders.filter((op) => {
    const matchesCenter = selectedCenter === 'all' || op.currentCenter === selectedCenter;
    if (!matchesCenter) return false;

    if (selectedCity === 'all') return true;
    const matchedProject = projects.find((p) => p.id === op.projectId);
    return (
      matchedProject?.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
      op.customerName.toLowerCase().includes(selectedCity.toLowerCase()) ||
      op.orderNumber.toLowerCase().includes(selectedCity.toLowerCase())
    );
  });

  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(
    filteredOrders[0] || productionOrders[0] || null
  );
  const [showNcrModal, setShowNcrModal] = useState(false);
  const [ncrReason, setNcrReason] = useState('');

  // Keep selectedOrder in sync
  React.useEffect(() => {
    if (filteredOrders.length > 0) {
      if (!selectedOrder || !filteredOrders.some((o) => o.id === selectedOrder.id)) {
        setSelectedOrder(filteredOrders[0]);
      }
    } else {
      setSelectedOrder(null);
    }
  }, [selectedCity, selectedCenter, productionOrders]);

  // Subviews check
  if (productionSubView === 'nesting') {
    return (
      <CutOptimizerView
        productionOrders={productionOrders}
        onBackToProduction={() => setProductionSubView('pcp')}
      />
    );
  }

  if (productionSubView === 'cam') {
    return (
      <CamSimulatorView
        machines={machines}
        onBackToProduction={() => setProductionSubView('pcp')}
      />
    );
  }

  // Filter machines by center
  const filteredMachines = machines.filter((m) => {
    if (selectedCenter === 'all') return true;
    return m.centerType === selectedCenter;
  });

  // Advance step operation
  const handleAdvanceStep = (orderId: string, stepId: string) => {
    const updated = productionOrders.map((op) => {
      if (op.id !== orderId) return op;

      const updatedOps = op.operations.map((st) => {
        if (st.id === stepId) {
          return { ...st, status: 'done' as const, actualMinutes: st.estimatedMinutes };
        }
        return st;
      });

      const allDone = updatedOps.every((st) => st.status === 'done');
      const progress = Math.round(
        (updatedOps.filter((st) => st.status === 'done').length / updatedOps.length) * 100
      );

      return {
        ...op,
        operations: updatedOps,
        progressPercent: progress,
        stage: allDone ? ('completed' as const) : ('in_progress' as const),
      };
    });

    onUpdateOrders(updated);
    if (selectedOrder?.id === orderId) {
      const current = updated.find((o) => o.id === orderId);
      if (current) setSelectedOrder(current);
    }
  };

  // Toggle Machine Status
  const handleToggleMachineStatus = (machineId: string) => {
    const updated = machines.map((m) => {
      if (m.id === machineId) {
        const nextStatus = m.status === 'available' ? 'busy' : 'available';
        return { ...m, status: nextStatus as any };
      }
      return m;
    });
    onUpdateMachines(updated);
  };

  // Submit NCR (Não Conformidade / Refugo)
  const handleSubmitNcr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const updated = productionOrders.map((op) => {
      if (op.id === selectedOrder.id) {
        return {
          ...op,
          nonConformityNotes: ncrReason,
          qualityPassed: false,
        };
      }
      return op;
    });

    onUpdateOrders(updated);
    setShowNcrModal(false);
    setNcrReason('');
  };

  return (
    <div id="production-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Multi-Center Filter */}
      <div className="bg-[#231f1d] border border-[#4f453a]/40 p-4 rounded-xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-base text-[#eae1dd] flex items-center gap-2">
            <Hammer className="w-5 h-5 text-[#fecc93]" />
            PCP — Planejamento & Controle da Produção Multi-Centro
          </h2>
          <p className="text-xs text-[#d3c4b6]">
            Integração física e digital: Marcenaria Tradicional, Usinagem CNC Router e Impressoras 3D FDM.
          </p>
        </div>

        {/* Subview Launchers & Centers Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#110d0c] p-1 rounded-lg border border-[#4f453a]/50 text-xs">
            <button
              onClick={() => setProductionSubView('nesting')}
              className="convex-btn px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 cursor-pointer shadow text-[#3b2203]"
              title="Abrir otimizador de plano de corte e nesting 2D"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Plano de Corte & Nesting</span>
            </button>

            <button
              onClick={() => setProductionSubView('cam')}
              className="px-3 py-1.5 rounded-md font-medium text-[#fecc93] bg-[#2e2927] hover:bg-[#393431] flex items-center gap-1.5 cursor-pointer border border-[#fecc93]/30"
              title="Abrir simulador CAM, G-code e horímetro de fresas"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Simulador CAM & Fresas</span>
            </button>
          </div>

          {/* Centers Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs bg-[#110d0c] p-1 rounded-lg border border-[#4f453a]/50">
            <button
              onClick={() => setSelectedCenter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap ${
                selectedCenter === 'all'
                  ? 'bg-[#2e2927] text-[#fecc93] shadow-inner'
                  : 'text-[#d3c4b6] hover:text-[#eae1dd]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCenter('woodworking')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                selectedCenter === 'woodworking'
                  ? 'bg-[#2e2927] text-[#fecc93]'
                  : 'text-[#d3c4b6] hover:text-[#eae1dd]'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" /> Marcenaria
            </button>
            <button
              onClick={() => setSelectedCenter('cnc')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                selectedCenter === 'cnc'
                  ? 'bg-[#2e2927] text-[#fecc93]'
                  : 'text-[#d3c4b6] hover:text-[#eae1dd]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> CNC
            </button>
            <button
              onClick={() => setSelectedCenter('3d_printing')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                selectedCenter === '3d_printing'
                  ? 'bg-[#2e2927] text-[#fecc93]'
                  : 'text-[#d3c4b6] hover:text-[#eae1dd]'
              }`}
            >
              <Printer className="w-3.5 h-3.5" /> 3D
            </button>
          </div>
        </div>
      </div>

      {/* City Filter Active Notification Banner */}
      {selectedCity !== 'all' && (
        <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 beveled-card shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
            <span className="text-xs font-semibold text-[var(--text-main)]">
              Filtrando OPs vinculadas a: <strong className="text-[var(--color-primary)] font-bold">{selectedCity} - RJ</strong> ({filteredOrders.length} de {productionOrders.length} ordens)
            </span>
          </div>
          {onSelectCity && (
            <button
              onClick={() => onSelectCity('all')}
              className="text-xs text-[var(--color-primary)] hover:underline font-bold self-start sm:self-auto cursor-pointer"
            >
              ✕ Exibir Todas as Cidades
            </button>
          )}
        </div>
      )}

      {/* Machine Capacity & Live Fleet Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#d3c4b6] flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#fecc93]" />
            Frota de Máquinas & Fila Operacional
          </h3>
          <span className="text-[11px] text-[#9c8e82]">
            {filteredMachines.length} máquinas mapeadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredMachines.map((m) => (
            <div
              key={m.id}
              className="bg-[#231f1d] border border-[#4f453a]/50 rounded-xl p-4 space-y-3 beveled-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-[#eae1dd]">{m.name}</h4>
                  <span className="text-[10px] text-[#9c8e82] font-mono">{m.location}</span>
                </div>
                <button
                  onClick={() => handleToggleMachineStatus(m.id)}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition cursor-pointer ${
                    m.status === 'busy'
                      ? 'bg-[#644316] text-[#fecc93] border border-[#fecc93]/30'
                      : 'bg-[#1d5123] text-[#9cd499] border border-[#9cd499]/30'
                  }`}
                >
                  {m.status === 'busy' ? '● Em Operação' : '○ Disponível'}
                </button>
              </div>

              {m.currentJob ? (
                <div className="space-y-1.5 bg-[#1f1b19] p-2.5 rounded-lg border border-[#4f453a]/30">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#fecc93] font-mono font-semibold">
                      {m.currentJob.orderNumber}
                    </span>
                    <span className="text-[#9cd499] font-mono">{m.currentJob.progressPercent}%</span>
                  </div>
                  <p className="text-[11px] text-[#eae1dd] truncate">{m.currentJob.productName}</p>
                  <div className="w-full h-1.5 bg-[#110d0c] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#fecc93] rounded-full"
                      style={{ width: `${m.currentJob.progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#9c8e82]">
                    <span>Mat: {m.currentJob.material}</span>
                    <span>Término: {new Date(m.currentJob.estimatedEndTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1f1b19] p-3 rounded-lg border border-[#4f453a]/30 text-[11px] text-[#9c8e82] text-center">
                  Pronta para carregar arquivo (G-code / STL)
                </div>
              )}

              {/* Maintenance Health Score */}
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#4f453a]/20 text-[#9c8e82]">
                <span>Saúde Mecânica: <strong className="text-[#9cd499]">{m.maintenanceHealthScore}%</strong></span>
                <span>Prox. Revisão: {m.nextMaintenanceDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Orders (OPs) & Operations Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 5 Cols: Orders List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#d3c4b6] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#fecc93]" />
              Ordens de Produção (OPs)
            </h3>
            <span className="text-[11px] text-[#fecc93] font-mono">
              {filteredOrders.length} ordens
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredOrders.map((op) => (
              <div
                key={op.id}
                onClick={() => setSelectedOrder(op)}
                className={`p-3.5 rounded-xl border transition cursor-pointer text-left space-y-2 ${
                  selectedOrder?.id === op.id
                    ? 'bg-[#2e2927] border-[#fecc93] shadow-md beveled-card'
                    : 'bg-[#231f1d] border-[#4f453a]/40 hover:border-[#fecc93]/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#110d0c] text-[#fecc93]">
                        {op.orderNumber}
                      </span>
                      <h4 className="font-semibold text-xs text-[#eae1dd]">{op.projectTitle}</h4>
                    </div>
                    <p className="text-[11px] text-[#9c8e82] mt-0.5">
                      {op.customerName} • Prazo: {op.targetEndDate}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      op.priority === 'urgent'
                        ? 'bg-[#93000a] text-[#ffb4ab]'
                        : op.priority === 'high'
                        ? 'bg-[#644316] text-[#fecc93]'
                        : 'bg-[#1d5123] text-[#9cd499]'
                    }`}
                  >
                    {op.priority}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#d3c4b6]">
                    <span>
                      Etapa atual:{' '}
                      <strong className="text-[#fecc93] uppercase">{op.currentCenter}</strong>
                    </span>
                    <span className="font-mono">{op.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#110d0c] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#fecc93] to-[#9cd499] rounded-full"
                      style={{ width: `${op.progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#9c8e82] pt-1 border-t border-[#4f453a]/20">
                  <span>Resp: {op.assignedOperator || 'Não atribuído'}</span>
                  <span className="text-[#9cd499]">
                    {op.materialsReserved ? '✓ Materiais Reservados' : '⚠ Sem Reserva'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 7 Cols: Detailed Step-by-Step Operations & Production Files */}
        <div className="lg:col-span-7 space-y-4">
          {selectedOrder ? (
            <div className="bg-[#231f1d] border border-[#4f453a]/50 rounded-xl p-5 beveled-card space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#4f453a]/40 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#fecc93]">
                      {selectedOrder.orderNumber}
                    </span>
                    <h3 className="font-display font-bold text-sm text-[#eae1dd]">
                      {selectedOrder.projectTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-[#d3c4b6]">
                    Cliente: {selectedOrder.customerName} • Operador: {selectedOrder.assignedOperator}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNcrModal(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#93000a]/30 hover:bg-[#93000a] text-[#ffb4ab] border border-[#ffb4ab]/30 text-xs font-medium transition cursor-pointer"
                  >
                    Registrar NCR / Refugo
                  </button>
                </div>
              </div>

              {/* Files Attached (DXF, STL, G-code, PDF) */}
              <div>
                <h4 className="font-display font-semibold text-xs text-[#eae1dd] mb-2 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-[#fecc93]" />
                  Arquivos Produtivos (CNC / 3D / Plano de Corte)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedOrder.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1f1b19] border border-[#4f453a]/40 rounded-lg p-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="truncate pr-2">
                        <span className="font-medium text-[#eae1dd] block truncate">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-[#9c8e82] uppercase font-mono">
                          {file.type} • {file.size}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#110d0c] text-[#fecc93] font-mono">
                        OK
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by Step Operations List */}
              <div className="space-y-2.5">
                <h4 className="font-display font-semibold text-xs text-[#eae1dd] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#fecc93]" />
                  Roteiro de Produção & Operações
                </h4>

                <div className="space-y-2">
                  {selectedOrder.operations.map((opStep) => (
                    <div
                      key={opStep.id}
                      className={`p-3 rounded-lg border flex items-center justify-between text-xs transition ${
                        opStep.status === 'done'
                          ? 'bg-[#1d5123]/20 border-[#9cd499]/30 text-[#eae1dd]'
                          : opStep.status === 'running'
                          ? 'bg-[#644316]/30 border-[#fecc93]/50 text-[#eae1dd] beveled-card'
                          : 'bg-[#1f1b19] border-[#4f453a]/30 text-[#d3c4b6]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            opStep.status === 'done'
                              ? 'bg-[#1d5123] text-[#9cd499]'
                              : opStep.status === 'running'
                              ? 'bg-[#fecc93] text-[#3b2203]'
                              : 'bg-[#110d0c] text-[#9c8e82]'
                          }`}
                        >
                          {opStep.status === 'done' ? '✓' : opStep.stepNumber}
                        </div>
                        <div>
                          <span className="font-semibold block">{opStep.name}</span>
                          <span className="text-[10px] text-[#9c8e82]">
                            Centro: <strong className="uppercase text-[#fecc93]">{opStep.center}</strong> • Estimado: {opStep.estimatedMinutes} min
                            {opStep.notes && ` • (${opStep.notes})`}
                          </span>
                        </div>
                      </div>

                      {opStep.status !== 'done' ? (
                        <button
                          onClick={() => handleAdvanceStep(selectedOrder.id, opStep.id)}
                          className="convex-btn px-3 py-1 rounded-md text-[11px] font-semibold cursor-pointer shadow"
                        >
                          Concluir Etapa
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#9cd499] font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#231f1d] border border-[#4f453a]/40 rounded-xl p-10 text-center text-[#9c8e82] text-xs">
              Selecione uma ordem de produção para visualizar os arquivos e roteiro técnico.
            </div>
          )}
        </div>
      </div>

      {/* Modal: NCR (Não Conformidade) */}
      {showNcrModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#231f1d] border border-[#ffb4ab]/40 rounded-xl p-5 max-w-md w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#4f453a]/40">
              <h3 className="font-display font-bold text-sm text-[#ffb4ab] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Registrar Não Conformidade (NCR / Refugo)
              </h3>
              <button onClick={() => setShowNcrModal(false)} className="text-[#9c8e82]">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNcr} className="space-y-3">
              <p className="text-xs text-[#d3c4b6]">
                Ordem: <strong className="text-[#fecc93]">{selectedOrder?.orderNumber}</strong> — {selectedOrder?.projectTitle}
              </p>

              <div>
                <label className="text-[11px] text-[#d3c4b6] block mb-1">
                  Motivo da Falha / Refugo (MDF quebrado, erro CNC, falha 3D)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva o que ocorreu, a peça perdida e o custo estimado de retrabalho..."
                  value={ncrReason}
                  onChange={(e) => setNcrReason(e.target.value)}
                  className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg p-2 text-xs text-[#eae1dd] focus:outline-none focus:border-[#ffb4ab]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#4f453a]/40">
                <button
                  type="button"
                  onClick={() => setShowNcrModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#d3c4b6]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#93000a] text-[#ffdad6] font-semibold text-xs hover:bg-[#ba1a1a]"
                >
                  Salvar NCR no Histórico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
