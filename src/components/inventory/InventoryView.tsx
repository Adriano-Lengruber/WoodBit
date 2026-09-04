import React, { useState } from 'react';
import {
  Boxes,
  Package,
  Layers,
  Search,
  Plus,
  AlertTriangle,
  Lock,
  Sparkles,
  ArrowDownToLine,
  TrendingDown,
  CheckCircle2,
  Filter,
  Trash2,
  Minus
} from 'lucide-react';
import { StockItem } from '../../types';

interface InventoryViewProps {
  inventory: StockItem[];
  onUpdateInventory: (items: StockItem[]) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  onUpdateInventory,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New item form
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'mdf_sheet' | 'filament_3d' | 'hardware' | 'led_electronics'>('mdf_sheet');
  const [newQty, setNewQty] = useState(10);
  const [newMinQty, setNewMinQty] = useState(5);
  const [newUnit, setNewUnit] = useState<'sheet' | 'spool' | 'un' | 'meter'>('sheet');
  const [newCost, setNewCost] = useState(250);
  const [newLocation, setNewLocation] = useState('Galpão 1 - Rack A');

  // Filtered Items
  const filtered = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate totals
  const totalPhysicalItems = inventory.reduce((acc, i) => acc + i.currentQuantity, 0);
  const totalReservedItems = inventory.reduce((acc, i) => acc + i.reservedQuantity, 0);
  const lowStockCount = inventory.filter((i) => i.availableQuantity <= i.minQuantityAlert).length;
  const totalStockValue = inventory.reduce((acc, i) => acc + i.currentQuantity * i.unitCost, 0);

  // Category breakdown for visual chart
  const catBreakdown = {
    mdf_sheet: inventory.filter((i) => i.category === 'mdf_sheet').reduce((acc, i) => acc + i.currentQuantity, 0),
    filament_3d: inventory.filter((i) => i.category === 'filament_3d').reduce((acc, i) => acc + i.currentQuantity, 0),
    hardware: inventory.filter((i) => i.category === 'hardware').reduce((acc, i) => acc + i.currentQuantity, 0),
    led_electronics: inventory.filter((i) => i.category === 'led_electronics').reduce((acc, i) => acc + i.currentQuantity, 0),
  };
  const sumCat = (catBreakdown.mdf_sheet + catBreakdown.filament_3d + catBreakdown.hardware + catBreakdown.led_electronics) || 1;
  const mdfPct = Math.round((catBreakdown.mdf_sheet / sumCat) * 100);
  const filamentPct = Math.round((catBreakdown.filament_3d / sumCat) * 100);
  const hardwarePct = Math.round((catBreakdown.hardware / sumCat) * 100);
  const ledPct = Math.max(0, 100 - mdfPct - filamentPct - hardwarePct);

  // Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: StockItem = {
      id: `inv-${Date.now()}`,
      tenantId: 'tenant-woodbit-rj',
      code: `MAT-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      category: newCategory,
      currentQuantity: newQty,
      reservedQuantity: 0,
      availableQuantity: newQty,
      minQuantityAlert: newMinQty,
      unit: newUnit,
      unitCost: newCost,
      location: newLocation,
      supplier: 'Madeireira Noroeste / 3D Labs',
      lastRestockedAt: new Date().toISOString().split('T')[0],
    };

    onUpdateInventory([newItem, ...inventory]);
    setShowAddModal(false);
    setNewName('');
  };

  // Quick Adjust (+ or -)
  const handleAdjustStock = (itemId: string, delta: number) => {
    const updated = inventory.map((item) => {
      if (item.id === itemId) {
        const newPhys = Math.max(item.reservedQuantity, item.currentQuantity + delta);
        return {
          ...item,
          currentQuantity: newPhys,
          availableQuantity: newPhys - item.reservedQuantity,
          lastRestockedAt: delta > 0 ? new Date().toISOString().split('T')[0] : item.lastRestockedAt,
        };
      }
      return item;
    });
    onUpdateInventory(updated);
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    onUpdateInventory(inventory.filter((i) => i.id !== itemId));
  };

  return (
    <div id="inventory-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-5 rounded-2xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)] shadow-xs">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
              Estoque, Filamentos & Reserva de Chapas
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Cálculo em tempo real: <span className="text-[var(--text-main)] font-semibold">Disponível = Físico - Reservado por OPs</span> em produção na fábrica.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="convex-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" /> Cadastrar Insumo
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card space-y-1">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            Valor Total Imobilizado
          </span>
          <span className="font-display font-bold text-2xl text-[var(--text-main)] block">
            R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-[var(--text-faint)] block">
            Custo médio ponderado do galpão
          </span>
        </div>

        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card space-y-1">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            Estoque Físico Total
          </span>
          <span className="font-display font-bold text-2xl text-[var(--color-primary)] block font-mono">
            {totalPhysicalItems} <span className="text-sm font-sans font-medium text-[var(--text-muted)]">un/chapas</span>
          </span>
          <span className="text-xs text-[var(--text-faint)] block">
            Materiais armazenados nos racks
          </span>
        </div>

        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card space-y-1">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            Alocado / Reservado (OPs)
          </span>
          <span className="font-display font-bold text-2xl text-[var(--color-primary)] block font-mono">
            {totalReservedItems} <span className="text-sm font-sans font-medium text-[var(--text-muted)]">un/chapas</span>
          </span>
          <span className="text-xs text-[var(--color-primary)] font-semibold flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Bloqueados contra venda dupla
          </span>
        </div>

        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card space-y-1">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            Alertas de Reposição
          </span>
          <span
            className={`font-display font-bold text-2xl block ${
              lowStockCount > 0 ? 'text-[#ffb4ab]' : 'text-[var(--color-secondary)]'
            }`}
          >
            {lowStockCount} <span className="text-sm font-sans font-medium text-[var(--text-muted)]">itens críticos</span>
          </span>
          <span className="text-xs text-[var(--text-faint)] block">
            {lowStockCount > 0 ? 'Abaixo do ponto de pedido mínimo' : 'Nenhum insumo em nível de risco'}
          </span>
        </div>
      </div>

      {/* Visual Stock Composition Bar Chart */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--color-primary)]" />
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
              Distribuição do Inventário por Categoria de Insumo
            </h4>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono font-bold">
            {inventory.length} materiais cadastrados
          </span>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="w-full h-3 bg-[var(--bg-lowest)] rounded-full overflow-hidden flex border border-[var(--border-subtle)]">
          <div
            style={{ width: `${mdfPct}%` }}
            className="bg-amber-600 transition-all duration-500"
            title={`MDF & Painéis: ${mdfPct}% (${catBreakdown.mdf_sheet} un)`}
          />
          <div
            style={{ width: `${filamentPct}%` }}
            className="bg-cyan-500 transition-all duration-500"
            title={`Filamentos 3D: ${filamentPct}% (${catBreakdown.filament_3d} carretéis)`}
          />
          <div
            style={{ width: `${hardwarePct}%` }}
            className="bg-zinc-400 transition-all duration-500"
            title={`Ferragens: ${hardwarePct}% (${catBreakdown.hardware} un)`}
          />
          <div
            style={{ width: `${ledPct}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`LEDs & Fontes: ${ledPct}% (${catBreakdown.led_electronics} un)`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-600 flex-shrink-0" />
            <span className="text-[var(--text-muted)] font-medium">
              MDF & Painéis: <strong className="text-[var(--text-main)] font-bold">{mdfPct}%</strong> ({catBreakdown.mdf_sheet} un)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0" />
            <span className="text-[var(--text-muted)] font-medium">
              Filamentos 3D: <strong className="text-[var(--text-main)] font-bold">{filamentPct}%</strong> ({catBreakdown.filament_3d} un)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-zinc-400 flex-shrink-0" />
            <span className="text-[var(--text-muted)] font-medium">
              Ferragens: <strong className="text-[var(--text-main)] font-bold">{hardwarePct}%</strong> ({catBreakdown.hardware} un)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-[var(--text-muted)] font-medium">
              LEDs & Fontes: <strong className="text-[var(--text-main)] font-bold">{ledPct}%</strong> ({catBreakdown.led_electronics} un)
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 bg-[var(--bg-low)] p-1.5 rounded-xl border border-[var(--border-subtle)] text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[var(--bg-high)] text-[var(--color-primary)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Todos ({inventory.length})
          </button>
          <button
            onClick={() => setCategoryFilter('mdf_sheet')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
              categoryFilter === 'mdf_sheet'
                ? 'bg-[var(--bg-high)] text-[var(--color-primary)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            MDF & Painéis
          </button>
          <button
            onClick={() => setCategoryFilter('filament_3d')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
              categoryFilter === 'filament_3d'
                ? 'bg-[var(--bg-high)] text-[var(--color-primary)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Filamentos 3D
          </button>
          <button
            onClick={() => setCategoryFilter('hardware')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
              categoryFilter === 'hardware'
                ? 'bg-[var(--bg-high)] text-[var(--color-primary)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Ferragens
          </button>
          <button
            onClick={() => setCategoryFilter('led_electronics')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
              categoryFilter === 'led_electronics'
                ? 'bg-[var(--bg-high)] text-[var(--color-primary)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            LEDs & Fontes
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar material, código ou fornecedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--color-primary)] shadow-xs"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl overflow-hidden beveled-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-low)] text-[var(--text-muted)] uppercase text-xs font-bold tracking-wider border-b border-[var(--border-subtle)]">
              <tr>
                <th className="p-3.5">Código / Insumo</th>
                <th className="p-3.5">Categoria</th>
                <th className="p-3.5">Estoque Físico</th>
                <th className="p-3.5">Reservado (OPs)</th>
                <th className="p-3.5">Disponível Real</th>
                <th className="p-3.5">Custo Médio</th>
                <th className="p-3.5">Localização</th>
                <th className="p-3.5 text-right">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-container)]">
              {filtered.map((item) => {
                const isLowStock = item.availableQuantity <= item.minQuantityAlert;
                return (
                  <tr key={item.id} className="hover:bg-[var(--bg-low)]/60 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[var(--color-primary)] bg-[var(--bg-high)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                          {item.code}
                        </span>
                        <span className="font-bold text-sm text-[var(--text-main)]">{item.name}</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] block mt-0.5 font-medium">
                        Fornecedor: {item.supplier}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="text-xs px-2.5 py-1 rounded-md uppercase font-mono font-semibold bg-[var(--bg-low)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono font-semibold text-sm text-[var(--text-main)]">
                      {item.currentQuantity} <span className="text-xs font-sans text-[var(--text-muted)]">{item.unit}</span>
                    </td>

                    <td className="p-3.5 font-mono font-semibold text-sm text-[var(--color-primary)]">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        {item.reservedQuantity} <span className="text-xs font-sans text-[var(--text-muted)]">{item.unit}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                          isLowStock
                            ? 'bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30'
                            : 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/30'
                        }`}
                      >
                        {item.availableQuantity} {item.unit}
                      </span>
                      {isLowStock && (
                        <span className="text-xs text-[#ffb4ab] font-medium block mt-1">
                          Mínimo: {item.minQuantityAlert}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 font-mono text-sm text-[var(--text-muted)] font-semibold">
                      R$ {item.unitCost.toFixed(2)}
                    </td>

                    <td className="p-3.5 text-xs text-[var(--text-muted)] font-medium">
                      {item.location}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          className="p-1.5 rounded-lg bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[#ffb4ab] border border-[var(--border-subtle)] text-xs font-semibold transition cursor-pointer"
                          title="Dar baixa de 1 unidade (consumo)"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, 5)}
                          className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[var(--color-primary)] border border-[var(--border-subtle)] text-xs font-bold transition cursor-pointer"
                          title="Entrada rápida de +5 unidades"
                        >
                          +5 Entrada
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-lg text-[#ffb4ab] hover:bg-[#93000a]/20 transition cursor-pointer"
                          title="Excluir Insumo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Inventory Item */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-2xl p-6 max-w-lg w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="font-display font-bold text-base text-[var(--text-main)]">
                  Cadastrar Novo Insumo / Matéria-Prima
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                  Nome do Insumo *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Chapa MDF Carvalho Hanover 18mm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="mdf_sheet">MDF & Chapas</option>
                    <option value="filament_3d">Filamento 3D</option>
                    <option value="hardware">Ferragens</option>
                    <option value="led_electronics">LED & Eletrônica</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Unidade
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value as any)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="sheet">Chapas</option>
                    <option value="spool">Carretel (kg)</option>
                    <option value="un">Unidade (un)</option>
                    <option value="meter">Metros (m)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Qtd Inicial
                  </label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Alerta Mínimo
                  </label>
                  <input
                    type="number"
                    value={newMinQty}
                    onChange={(e) => setNewMinQty(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Custo Unit (R$)
                  </label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                  Localização no Galpão
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-low)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="convex-btn px-5 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-md"
                >
                  Salvar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

