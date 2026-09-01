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
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-4 rounded-xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[var(--color-primary)]" />
            Estoque, Filamentos & Reserva Automática de Chapas
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Cálculo em tempo real de Disponível = Físico - Reservado por OPs em andamento na fábrica.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="convex-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" /> Cadastrar Insumo
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card">
          <span className="text-[11px] text-[var(--text-muted)] block">Valor Total Imobilizado</span>
          <span className="font-display font-bold text-lg text-[var(--text-main)]">
            R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block mt-1">Custo médio ponderado</span>
        </div>

        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card">
          <span className="text-[11px] text-[var(--text-muted)] block">Itens em Estoque Físico</span>
          <span className="font-display font-bold text-lg text-[var(--color-primary)]">
            {totalPhysicalItems} un/chapas
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block mt-1">Presentes no galpão</span>
        </div>

        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card">
          <span className="text-[11px] text-[var(--text-muted)] block">Alocado / Reservado para OPs</span>
          <span className="font-display font-bold text-lg text-[var(--color-primary)]">
            {totalReservedItems} un/chapas
          </span>
          <span className="text-[10px] text-[var(--color-primary)] block mt-1 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Bloqueados contra venda dupla
          </span>
        </div>

        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card">
          <span className="text-[11px] text-[var(--text-muted)] block">Alertas de Reposição</span>
          <span
            className={`font-display font-bold text-lg ${
              lowStockCount > 0 ? 'text-[#ffb4ab]' : 'text-[var(--color-secondary)]'
            }`}
          >
            {lowStockCount} itens críticos
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block mt-1">
            Abaixo do ponto de pedido
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 bg-[var(--bg-low)] p-1 rounded-lg border border-[var(--border-subtle)] text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[var(--bg-high)] text-[var(--color-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Todos ({inventory.length})
          </button>
          <button
            onClick={() => setCategoryFilter('mdf_sheet')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
              categoryFilter === 'mdf_sheet'
                ? 'bg-[var(--bg-high)] text-[var(--color-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            MDF & Painéis
          </button>
          <button
            onClick={() => setCategoryFilter('filament_3d')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
              categoryFilter === 'filament_3d'
                ? 'bg-[var(--bg-high)] text-[var(--color-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Filamentos 3D
          </button>
          <button
            onClick={() => setCategoryFilter('hardware')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
              categoryFilter === 'hardware'
                ? 'bg-[var(--bg-high)] text-[var(--color-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Ferragens
          </button>
          <button
            onClick={() => setCategoryFilter('led_electronics')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
              categoryFilter === 'led_electronics'
                ? 'bg-[var(--bg-high)] text-[var(--color-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            LEDs & Fontes
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar material, código ou fornecedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl overflow-hidden beveled-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-low)] text-[var(--text-muted)] uppercase text-[10px] border-b border-[var(--border-subtle)]">
              <tr>
                <th className="p-3">Código / Insumo</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Estoque Físico</th>
                <th className="p-3">Reservado (OPs)</th>
                <th className="p-3">Disponível Real</th>
                <th className="p-3">Custo Médio</th>
                <th className="p-3">Localização</th>
                <th className="p-3 text-right">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-container)]">
              {filtered.map((item) => {
                const isLowStock = item.availableQuantity <= item.minQuantityAlert;
                return (
                  <tr key={item.id} className="hover:bg-[var(--bg-low)]/60 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[var(--color-primary)] bg-[var(--bg-high)] px-1.5 py-0.5 rounded">
                          {item.code}
                        </span>
                        <span className="font-semibold text-[var(--text-main)]">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                        Fornecedor: {item.supplier}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 rounded uppercase font-mono bg-[var(--bg-low)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-medium text-[var(--text-main)]">
                      {item.currentQuantity} {item.unit}
                    </td>

                    <td className="p-3 font-mono text-[var(--color-primary)]">
                      <div className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[var(--color-primary)]" />
                        {item.reservedQuantity} {item.unit}
                      </div>
                    </td>

                    <td className="p-3 font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          isLowStock
                            ? 'bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30'
                            : 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/30'
                        }`}
                      >
                        {item.availableQuantity} {item.unit}
                      </span>
                      {isLowStock && (
                        <span className="text-[9px] text-[#ffb4ab] block mt-0.5">
                          Mínimo: {item.minQuantityAlert}
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-mono text-[var(--text-muted)]">
                      R$ {item.unitCost.toFixed(2)}
                    </td>

                    <td className="p-3 text-[11px] text-[var(--text-muted)]">
                      {item.location}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          className="p-1 rounded bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[#ffb4ab] border border-[var(--border-subtle)] text-[10px] font-medium transition cursor-pointer"
                          title="Dar baixa de 1 unidade (consumo)"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, 5)}
                          className="px-2 py-1 rounded bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[var(--color-primary)] border border-[var(--border-subtle)] text-[10px] font-medium transition cursor-pointer"
                          title="Entrada rápida de +5 unidades"
                        >
                          +5 Entrada
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 rounded text-[#ffb4ab] hover:bg-[#93000a]/20 transition cursor-pointer"
                          title="Excluir Insumo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
          <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-5 max-w-md w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-sm text-[var(--text-main)]">
                Cadastrar Novo Insumo / Matéria-Prima
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Nome do Insumo</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Chapa MDF Carvalho Hanover 18mm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)]"
                  >
                    <option value="mdf_sheet">MDF & Chapas</option>
                    <option value="filament_3d">Filamento 3D</option>
                    <option value="hardware">Ferragens</option>
                    <option value="led_electronics">LED & Eletrônica</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Unidade</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value as any)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)]"
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
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Qtd Inicial</label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Alerta Mín</label>
                  <input
                    type="number"
                    value={newMinQty}
                    onChange={(e) => setNewMinQty(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Custo (R$)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Localização no Galpão</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg p-2 text-xs text-[var(--text-main)]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-low)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="convex-btn px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
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

