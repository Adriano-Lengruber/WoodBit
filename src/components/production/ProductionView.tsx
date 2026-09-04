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
  Gauge,
  Zap,
  Activity,
  Download,
  AlertOctagon,
  Boxes,
  PackageCheck,
  Archive,
  Check
} from 'lucide-react';
import {
  ProductionOrder,
  ProductionCenter,
  Machine,
  ProductionCenterType,
  ProductionOperation,
  Project,
  StockItem
} from '../../types';
import { CutOptimizerView } from './CutOptimizerView';
import { CamSimulatorView } from './CamSimulatorView';
import { useToast } from '../../context/ToastContext';

interface ProductionViewProps {
  productionOrders: ProductionOrder[];
  machines: Machine[];
  productionCenters: ProductionCenter[];
  projects?: Project[];
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  onUpdateOrders: (orders: ProductionOrder[]) => void;
  onUpdateMachines: (machines: Machine[]) => void;
  inventory?: StockItem[];
  onUpdateInventory?: (inventory: StockItem[]) => void;
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
  inventory,
  onUpdateInventory,
}) => {
  const { showToast } = useToast();
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
        onBackToPcp={() => setProductionSubView('pcp')}
      />
    );
  }

  // Filter machines by center
  const filteredMachines = machines.filter((m) => {
    if (selectedCenter === 'all') return true;
    return m.type === selectedCenter;
  });

  // Get materials list required for an order based on productLine and project
  const getOrderRequiredMaterials = (order: ProductionOrder) => {
    if (order.productLine === 'gamer') {
      return [
        { code: 'MDF-GRAFITE-18', name: 'MDF Grafite Matt 18mm', quantity: 2, unit: 'chapas', category: 'mdf_sheet' },
        { code: 'FIL-PETG-BLK', name: 'Filamento 3D PETG Preto Fosco', quantity: 1, unit: 'kg (carretel)', category: 'filament_3d' },
        { code: 'COR-BLUM-TANDEM-500', name: 'Corrediça Oculta c/ Amortecimento', quantity: 2, unit: 'pares', category: 'hardware' }
      ];
    } else if (order.productLine === 'furniture') {
      return [
        { code: 'MDF-FREIJO-18', name: 'MDF Duratex Louro Freijó 18mm', quantity: 3, unit: 'chapas', category: 'mdf_sheet' },
        { code: 'MDF-BRANCO-15', name: 'MDF Branco TX 15mm Estrutural', quantity: 4, unit: 'chapas', category: 'mdf_sheet' },
        { code: 'DOB-BLUM-110-SLOW', name: 'Dobradiça Blumotion 110º Amortecedor', quantity: 8, unit: 'unidades', category: 'hardware' }
      ];
    } else {
      return [
        { code: 'MDF-FREIJO-18', name: 'MDF Duratex Louro Freijó 18mm', quantity: 1, unit: 'chapa', category: 'mdf_sheet' },
        { code: 'FIL-PETG-BLK', name: 'Filamento 3D PETG Preto Fosco', quantity: 1, unit: 'kg (carretel)', category: 'filament_3d' },
        { code: 'LED-COB-WARM', name: 'Fita LED COB 3000K Branco Quente', quantity: 3, unit: 'metros', category: 'led_electronics' }
      ];
    }
  };

  // Reserve materials in inventory for the OP
  const handleReserveMaterials = (order: ProductionOrder) => {
    if (!inventory || !onUpdateInventory) {
      showToast('Aviso de Almoxarifado', 'Módulo de estoque indisponível para atualização automática.', 'warning');
      return;
    }

    const reqMaterials = getOrderRequiredMaterials(order);
    let updatedInventory = [...inventory];

    reqMaterials.forEach((req) => {
      let matched = false;
      updatedInventory = updatedInventory.map((item) => {
        if (!matched && (item.code === req.code || item.category === req.category)) {
          matched = true;
          const newReserved = (item.reservedQuantity || 0) + req.quantity;
          const newAvail = Math.max(0, item.currentQuantity - newReserved);
          return {
            ...item,
            reservedQuantity: newReserved,
            availableQuantity: newAvail,
          };
        }
        return item;
      });
    });

    onUpdateInventory(updatedInventory);

    const updatedOrders = productionOrders.map((o) =>
      o.id === order.id ? { ...o, materialsReserved: true } : o
    );
    onUpdateOrders(updatedOrders);
    if (selectedOrder?.id === order.id) {
      setSelectedOrder({ ...selectedOrder, materialsReserved: true });
    }

    showToast(
      'Insumos Reservados no Almoxarifado!',
      `Reserva confirmada para a ${order.orderNumber}: ${reqMaterials.map((r) => `${r.quantity} ${r.unit} de ${r.name}`).join(', ')}.`,
      'success'
    );
  };

  // Deduct / consume materials when OP completes
  const handleDeductMaterials = (order: ProductionOrder) => {
    if (!inventory || !onUpdateInventory) {
      showToast('Aviso de Almoxarifado', 'Módulo de estoque indisponível para baixa automática.', 'warning');
      return;
    }

    const reqMaterials = getOrderRequiredMaterials(order);
    let updatedInventory = [...inventory];

    reqMaterials.forEach((req) => {
      let matched = false;
      updatedInventory = updatedInventory.map((item) => {
        if (!matched && (item.code === req.code || item.category === req.category)) {
          matched = true;
          const newCurrent = Math.max(0, item.currentQuantity - req.quantity);
          const newReserved = Math.max(0, (item.reservedQuantity || 0) - req.quantity);
          const newAvail = Math.max(0, newCurrent - newReserved);
          return {
            ...item,
            currentQuantity: newCurrent,
            reservedQuantity: newReserved,
            availableQuantity: newAvail,
          };
        }
        return item;
      });
    });

    onUpdateInventory(updatedInventory);

    const updatedOrders = productionOrders.map((o) =>
      o.id === order.id
        ? {
            ...o,
            materialsReserved: false,
            materialsDeducted: true,
            stage: 'completed' as const,
            progressPercent: 100,
            operations: o.operations.map((st) => ({ ...st, status: 'done' as const })),
          }
        : o
    );
    onUpdateOrders(updatedOrders);
    if (selectedOrder?.id === order.id) {
      const updated = updatedOrders.find((o) => o.id === order.id);
      if (updated) setSelectedOrder(updated);
    }

    showToast(
      'Baixa Automática Realizada no Estoque!',
      `Insumos consumidos e debitados fisicamente do Almoxarifado para a ordem ${order.orderNumber}.`,
      'success'
    );
  };

  // Advance operation step
  const handleAdvanceStep = (orderId: string, stepId: string) => {
    let orderToDeduct: ProductionOrder | null = null;

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

      if (allDone && op.materialsReserved && !op.materialsDeducted) {
        orderToDeduct = op;
      }

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

    if (orderToDeduct) {
      setTimeout(() => {
        handleDeductMaterials(orderToDeduct!);
      }, 250);
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
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-5 rounded-2xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)] shadow-xs">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
              PCP — Planejamento & Controle da Produção Multi-Centro
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Sincronização de Marcenaria Artesanal, Usinagem CNC Router e Fazenda de Impressão 3D.
            </p>
          </div>
        </div>

        {/* Subview Launchers & Centers Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[var(--bg-lowest)] p-1.5 rounded-xl border border-[var(--border-subtle)] text-xs">
            <button
              onClick={() => setProductionSubView('nesting')}
              className="convex-btn px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              title="Abrir otimizador de plano de corte e nesting 2D"
            >
              <Scissors className="w-4 h-4" />
              <span>Plano de Corte & Nesting</span>
            </button>

            <button
              onClick={() => setProductionSubView('cam')}
              className="px-3.5 py-1.5 rounded-lg font-bold text-amber-400 bg-[var(--bg-low)] hover:bg-[var(--bg-high)] flex items-center gap-2 cursor-pointer border border-amber-500/30 transition shadow-xs"
              title="Abrir simulador CAM, G-code e horímetro de fresas"
            >
              <Gauge className="w-4 h-4" />
              <span>Simulador CAM & Fresas</span>
            </button>
          </div>

          {/* Centers Filter Tabs */}
          <div className="flex items-center gap-1 text-xs bg-[var(--bg-lowest)] p-1.5 rounded-xl border border-[var(--border-subtle)]">
            <button
              onClick={() => setSelectedCenter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
                selectedCenter === 'all'
                  ? 'bg-[var(--bg-high)] text-[var(--color-primary)] shadow-xs font-bold border border-[var(--color-primary)]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Todos ({productionOrders.length})
            </button>
            <button
              onClick={() => setSelectedCenter('woodworking')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedCenter === 'woodworking'
                  ? 'bg-[var(--bg-high)] text-amber-400 font-bold border border-amber-500/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" /> Marcenaria
            </button>
            <button
              onClick={() => setSelectedCenter('cnc')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedCenter === 'cnc'
                  ? 'bg-[var(--bg-high)] text-sky-400 font-bold border border-sky-500/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> Router CNC
            </button>
            <button
              onClick={() => setSelectedCenter('3d_printing')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedCenter === '3d_printing'
                  ? 'bg-[var(--bg-high)] text-purple-400 font-bold border border-purple-500/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Printer className="w-3.5 h-3.5" /> 3D Lab
            </button>
          </div>
        </div>
      </div>

      {/* Regional Filter Banner */}
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

      {/* Live Machine Fleet & Telemetry Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[var(--color-primary)]" />
            Frota de Máquinas & Telemetria em Tempo Real
          </h3>
          <span className="text-xs text-slate-400 font-mono font-medium">
            {filteredMachines.length} centros de usinagem ativos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredMachines.map((m) => (
            <div
              key={m.id}
              className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 beveled-card shadow-sm hover:border-[var(--color-primary)]/40 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-base text-[var(--text-main)]">{m.name}</h4>
                  <span className="text-xs text-slate-400 font-mono font-medium">{m.location}</span>
                </div>
                <button
                  onClick={() => handleToggleMachineStatus(m.id)}
                  className={`text-xs px-3 py-1 rounded-full font-mono font-bold transition-all cursor-pointer shadow-xs ${
                    m.status === 'busy'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 ring-1 ring-amber-500/30'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {m.status === 'busy' ? '● Em Operação' : '○ Disponível'}
                </button>
              </div>

              {m.currentJob ? (
                <div className="space-y-2 bg-[var(--bg-low)] p-3 rounded-xl border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-mono font-bold">{m.currentJob.orderNumber}</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">
                      {m.currentJob.progressPercent}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 truncate font-semibold">{m.currentJob.productName}</p>
                  <div className="w-full h-2 bg-[var(--bg-lowest)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${m.currentJob.progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-0.5">
                    <span>Mat: {m.currentJob.material}</span>
                    <span>
                      Término:{' '}
                      {new Date(m.currentJob.estimatedEndTime).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-[var(--bg-low)] p-4 rounded-xl border border-[var(--border-subtle)] text-xs text-slate-400 text-center font-medium">
                  Pronta para carregar arquivo (G-code .TAP / STL)
                </div>
              )}

              {/* Maintenance Health Score */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border-subtle)] text-slate-400 font-mono font-medium">
                <span>
                  Saúde Preventiva:{' '}
                  <strong
                    className={
                      m.maintenanceHealthScore >= 80
                        ? 'text-emerald-400 font-bold'
                        : 'text-amber-400 font-bold'
                    }
                  >
                    {m.maintenanceHealthScore}%
                  </strong>
                </span>
                <span>Próx. Revisão: {m.nextMaintenanceDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Orders (OPs) & Operations Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Orders List */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--color-primary)]" />
              Ordens de Produção Ativas ({filteredOrders.length})
            </h3>
            <span className="text-xs text-amber-400 font-mono font-bold">
              {filteredOrders.filter((o) => o.stage !== 'completed').length} em usinagem
            </span>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((op) => {
              const isSelected = selectedOrder?.id === op.id;
              return (
                <div
                  key={op.id}
                  onClick={() => setSelectedOrder(op)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2.5 ${
                    isSelected
                      ? 'bg-[var(--bg-high)] border-[var(--color-primary)] shadow-md beveled-card ring-1 ring-[var(--color-primary)]/40'
                      : 'bg-[var(--bg-container)] border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[var(--bg-lowest)] text-[var(--color-primary)] border border-[var(--border-subtle)] font-bold">
                          {op.orderNumber}
                        </span>
                        <h4 className="font-bold text-sm text-[var(--text-main)] leading-snug">
                          {op.projectTitle}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-medium">
                        Cliente: <strong className="text-slate-200">{op.customerName}</strong> • Prazo:{' '}
                        {op.targetEndDate}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider ${
                        op.priority === 'urgent'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          : op.priority === 'high'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {op.priority}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                      <span>
                        Etapa Atual: <strong className="text-amber-400 uppercase font-bold">{op.currentCenter}</strong>
                      </span>
                      <span className="font-mono font-bold text-emerald-400">{op.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--bg-lowest)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${op.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[var(--border-subtle)] font-mono">
                    <span>Operador: {op.assignedOperator || 'A definir'}</span>
                    <span className={op.materialsReserved ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {op.materialsReserved ? '✓ Materiais Reservados' : '⚠ Sem Reserva'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Detailed Step-by-Step Operations & Production Files */}
        <div className="lg:col-span-7 space-y-4">
          {selectedOrder ? (
            <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-6 beveled-card shadow-md space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-base font-bold text-[var(--color-primary)]">
                      {selectedOrder.orderNumber}
                    </span>
                    <h3 className="font-display font-bold text-base text-[var(--text-main)]">
                      {selectedOrder.projectTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
                    Cliente: <strong className="text-slate-200">{selectedOrder.customerName}</strong> • Operador:{' '}
                    <strong className="text-slate-200">{selectedOrder.assignedOperator}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedOrder.materialsDeducted ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Estoque Baixado
                    </span>
                  ) : selectedOrder.materialsReserved ? (
                    <button
                      onClick={() => handleDeductMaterials(selectedOrder)}
                      className="convex-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Efetivar consumo real de insumos no almoxarifado"
                    >
                      <PackageCheck className="w-3.5 h-3.5" /> Baixar Estoque
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReserveMaterials(selectedOrder)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                      title="Reservar chapas de MDF, filamentos e ferragens no almoxarifado"
                    >
                      <Boxes className="w-3.5 h-3.5" /> Reservar no Estoque
                    </button>
                  )}

                  <button
                    onClick={() => setShowNcrModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" /> Registrar NCR
                  </button>
                </div>
              </div>

              {/* Files Attached (DXF, STL, G-code, PDF) */}
              <div className="space-y-2.5">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[var(--color-primary)]" />
                  Arquivos Produtivos (CNC Router / 3D / Plano de Corte)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedOrder.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-3 flex items-center justify-between text-xs hover:border-[var(--color-primary)]/40 transition"
                    >
                      <div className="truncate pr-2">
                        <span className="font-bold text-sm text-[var(--text-main)] block truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-slate-400 uppercase font-mono font-medium">
                          {file.type} • {file.size}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                        PRONTO
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials Traceability & Real-time Stock Consumption */}
              <div className="space-y-3 bg-[var(--bg-low)] p-4 rounded-xl border border-[var(--border-subtle)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Matéria-Prima & Alocação de Estoque Integrada</span>
                  </h4>

                  <div>
                    {selectedOrder.materialsDeducted ? (
                      <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Baixa Efetivada no Almoxarifado
                      </span>
                    ) : selectedOrder.materialsReserved ? (
                      <span className="text-xs px-2.5 py-1 rounded-md bg-amber-950/70 text-amber-300 border border-amber-500/40 font-mono font-bold flex items-center gap-1.5">
                        <PackageCheck className="w-3.5 h-3.5" /> Insumos Reservados para Corte
                      </span>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-md bg-rose-950/60 text-rose-300 border border-rose-500/30 font-mono font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Aguardando Reserva Física
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {getOrderRequiredMaterials(selectedOrder).map((mat, idx) => {
                    const stockMatch = inventory?.find(
                      (i) => i.code === mat.code || i.category === mat.category
                    );
                    return (
                      <div
                        key={idx}
                        className="bg-[var(--bg-container)] p-3 rounded-xl border border-[var(--border-subtle)] space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)]">
                          <span>{mat.code}</span>
                          <span className="font-bold text-amber-400">{mat.quantity} {mat.unit}</span>
                        </div>
                        <span className="font-bold text-[var(--text-main)] block truncate">
                          {mat.name}
                        </span>
                        <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)] text-[11px]">
                          <span className="text-slate-400">Saldo Almoxarifado:</span>
                          <span className="font-mono font-bold text-slate-200">
                            {stockMatch ? `${stockMatch.currentQuantity} disp.` : 'Disponível'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)] gap-2">
                  <span>
                    {selectedOrder.materialsDeducted
                      ? '✓ Todas as chapas e ferragens foram consumidas e debitadas do almoxarifado via PCP.'
                      : selectedOrder.materialsReserved
                      ? 'Insumos alocados na oficina. Ao concluir as etapas de montagem, a baixa física é automática.'
                      : 'Chapas e insumos ainda não alocados. Reserve antes de iniciar a usinagem CNC.'}
                  </span>

                  {!selectedOrder.materialsDeducted && (
                    <button
                      onClick={() =>
                        selectedOrder.materialsReserved
                          ? handleDeductMaterials(selectedOrder)
                          : handleReserveMaterials(selectedOrder)
                      }
                      className={
                        selectedOrder.materialsReserved
                          ? 'convex-btn px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs self-end sm:self-auto shrink-0'
                          : 'px-3.5 py-1.5 rounded-lg font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 cursor-pointer shadow-xs transition self-end sm:self-auto shrink-0'
                      }
                    >
                      {selectedOrder.materialsReserved ? (
                        <>
                          <PackageCheck className="w-3.5 h-3.5" /> Efetivar Baixa no Estoque
                        </>
                      ) : (
                        <>
                          <Boxes className="w-3.5 h-3.5" /> Reservar Insumos no Estoque
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Step by Step Operations List */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                  Roteiro de Produção & Checklist Operacional
                </h4>

                <div className="space-y-2.5">
                  {selectedOrder.operations.map((opStep) => (
                    <div
                      key={opStep.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        opStep.status === 'done'
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-[var(--text-main)]'
                          : opStep.status === 'running'
                          ? 'bg-amber-950/30 border-amber-500/50 text-[var(--text-main)] ring-1 ring-amber-500/30'
                          : 'bg-[var(--bg-low)] border-[var(--border-subtle)] text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-mono ${
                            opStep.status === 'done'
                              ? 'bg-emerald-500 text-slate-950 font-black'
                              : opStep.status === 'running'
                              ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                              : 'bg-[var(--bg-lowest)] text-slate-400 border border-[var(--border-subtle)]'
                          }`}
                        >
                          {opStep.status === 'done' ? '✓' : opStep.stepNumber}
                        </div>
                        <div>
                          <span className="font-bold text-sm block text-slate-100">{opStep.name}</span>
                          <span className="text-xs text-slate-400 font-medium">
                            Centro: <strong className="uppercase text-amber-400 font-bold">{opStep.center}</strong> • Tempo Estimado: {opStep.estimatedMinutes} min
                            {opStep.notes && ` • (${opStep.notes})`}
                          </span>
                        </div>
                      </div>

                      {opStep.status !== 'done' ? (
                        <button
                          onClick={() => handleAdvanceStep(selectedOrder.id, opStep.id)}
                          className="convex-btn px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer shadow-xs"
                        >
                          Concluir Etapa
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30 font-mono">
                          <CheckCircle2 className="w-4 h-4" /> Concluído
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-16 text-center text-slate-400 text-sm beveled-card">
              Selecione uma ordem de produção para visualizar o roteiro técnico e arquivos.
            </div>
          )}
        </div>
      </div>

      {/* Modal: NCR (Não Conformidade / Refugo) */}
      {showNcrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[var(--bg-container)] border border-rose-500/40 rounded-2xl p-6 max-w-md w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-base text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Registrar Não Conformidade (NCR / Refugo)
              </h3>
              <button onClick={() => setShowNcrModal(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer text-base">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNcr} className="space-y-4">
              <p className="text-xs text-slate-300 font-medium">
                Ordem:{' '}
                <strong className="text-amber-400 font-mono font-bold">
                  {selectedOrder?.orderNumber}
                </strong>{' '}
                — {selectedOrder?.projectTitle}
              </p>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Motivo da Falha / Refugo (MDF quebrado, erro de corte CNC, perda 3D)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva a peça danificada, a causa raiz e a chapa/filamento para reposição..."
                  value={ncrReason}
                  onChange={(e) => setNcrReason(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowNcrModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-md"
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
