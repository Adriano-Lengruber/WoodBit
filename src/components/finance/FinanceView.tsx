import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Trash2,
  Download,
  Filter
} from 'lucide-react';
import { FinanceTransaction } from '../../types';

interface FinanceViewProps {
  finance: FinanceTransaction[];
  onUpdateFinance: (transactions: FinanceTransaction[]) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  finance,
  onUpdateFinance,
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | 'payable' | 'receivable'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New form
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'payable' | 'receivable'>('payable');
  const [newAmount, setNewAmount] = useState(500);
  const [newCategory, setNewCategory] = useState('Matéria-Prima MDF');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newProjectRef, setNewProjectRef] = useState('');

  // Categories list
  const categories = Array.from(new Set(finance.map((f) => f.category)));

  // Summaries
  const totalReceivables = finance
    .filter((f) => f.type === 'receivable')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPayables = finance
    .filter((f) => f.type === 'payable')
    .reduce((sum, f) => sum + f.amount, 0);

  const netBalance = totalReceivables - totalPayables;
  const marginPercentage =
    totalReceivables > 0 ? Math.round((netBalance / totalReceivables) * 100) : 0;

  // Filtered
  const filtered = finance.filter((f) => {
    if (typeFilter !== 'all' && f.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
    if (
      searchTerm &&
      !f.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(f.projectName || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Add transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: FinanceTransaction = {
      id: `fin-${Date.now()}`,
      tenantId: 'tenant-woodbit-rj',
      description: newDesc,
      type: newType,
      category: newCategory,
      amount: newAmount,
      dueDate: newDueDate,
      status: 'pending',
      costCenter: 'Geral',
      projectTitle: newProjectRef || undefined,
      recipientOrPayer: newType === 'payable' ? 'Fornecedor Insumos' : 'Cliente WoodBit',
    };

    onUpdateFinance([newTx, ...finance]);
    setShowAddModal(false);
    setNewDesc('');
    setNewProjectRef('');
  };

  // Toggle paid
  const handleTogglePaid = (txId: string) => {
    const updated = finance.map((f) => {
      if (f.id === txId) {
        const nextStatus = f.status === 'paid' ? 'pending' : 'paid';
        return {
          ...f,
          status: nextStatus as any,
          paidDate: nextStatus === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return f;
    });
    onUpdateFinance(updated);
  };

  // Delete transaction
  const handleDelete = (txId: string) => {
    onUpdateFinance(finance.filter((f) => f.id !== txId));
  };

  return (
    <div id="finance-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-4 rounded-xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[var(--color-primary)]" />
            Financeiro & Margem Real por Centro de Custo
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Fluxo de caixa, controle de entradas/saídas por projeto e DRE gerencial de marcenaria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="convex-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" /> Novo Lançamento
          </button>
        </div>
      </div>

      {/* 3 Summary Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Receivables */}
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-muted)]">Total a Receber (Vendas)</span>
            <div className="w-7 h-7 rounded bg-[var(--color-secondary-container)] flex items-center justify-center text-[var(--color-secondary)]">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display font-bold text-2xl text-[var(--color-secondary)]">
              R$ {totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Entradas de contratos e projetos</p>
        </div>

        {/* Payables */}
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-muted)]">Total a Pagar (Custos/Insumos)</span>
            <div className="w-7 h-7 rounded bg-[#93000a]/20 flex items-center justify-center text-[#ffb4ab]">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display font-bold text-2xl text-[#ffb4ab]">
              R$ {totalPayables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">MDF, fretes, energia e filamentos</p>
        </div>

        {/* Net Balance */}
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-4 beveled-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-muted)]">Resultado Operacional Líquido</span>
            <div className="w-7 h-7 rounded bg-[var(--bg-high)] flex items-center justify-center text-[var(--color-primary)]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display font-bold text-2xl text-[var(--color-primary)]">
              R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-secondary)] mt-1">
            Margem operacional média de {marginPercentage}%
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-container)] p-3 rounded-xl border border-[var(--border-subtle)] beveled-card">
          <div className="flex items-center gap-1.5 bg-[var(--bg-low)] p-1 rounded-lg border border-[var(--border-subtle)] w-fit text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                typeFilter === 'all' ? 'bg-[var(--bg-high)] text-[var(--color-primary)] font-bold' : 'text-[var(--text-muted)]'
              }`}
            >
              Todos ({finance.length})
            </button>
            <button
              onClick={() => setTypeFilter('receivable')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                typeFilter === 'receivable' ? 'bg-[var(--bg-high)] text-[var(--color-secondary)] font-bold' : 'text-[var(--text-muted)]'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setTypeFilter('payable')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                typeFilter === 'payable' ? 'bg-[var(--bg-high)] text-[#ffb4ab] font-bold' : 'text-[var(--text-muted)]'
              }`}
            >
              Despesas
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Buscar lançamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] w-48 sm:w-60"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
            >
              <option value="all">Todas Categorias</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl overflow-hidden beveled-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-low)] text-[var(--text-muted)] uppercase text-[10px] border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="p-3">Descrição / Lançamento</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Vencimento</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-container)]">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[var(--bg-low)]/60 transition">
                    <td className="p-3">
                      <span className="font-semibold text-[var(--text-main)] block">{tx.description}</span>
                      {tx.projectTitle && (
                        <span className="text-[10px] text-[var(--text-muted)]">
                          Ref: {tx.projectTitle}
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                          tx.type === 'receivable'
                            ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]'
                            : 'bg-[#93000a]/20 text-[#ffb4ab]'
                        }`}
                      >
                        {tx.type === 'receivable' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>

                    <td className="p-3 text-[var(--text-muted)]">{tx.category}</td>

                    <td className="p-3 font-mono text-[var(--text-muted)]">{tx.dueDate}</td>

                    <td className="p-3 font-mono font-bold">
                      <span
                        className={tx.type === 'receivable' ? 'text-[var(--color-secondary)]' : 'text-[#ffb4ab]'}
                      >
                        {tx.type === 'receivable' ? '+' : '-'} R${' '}
                        {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          tx.status === 'paid'
                            ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]'
                            : 'bg-[#644316]/30 text-[var(--color-primary)]'
                        }`}
                      >
                        {tx.status === 'paid' ? '● Liquidado' : '○ Pendente'}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTogglePaid(tx.id)}
                          className="px-2 py-1 rounded bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[var(--color-primary)] border border-[var(--border-subtle)] text-[10px] font-medium transition cursor-pointer"
                        >
                          {tx.status === 'paid' ? 'Desmarcar' : 'Dar Baixa'}
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          title="Excluir Lançamento"
                          className="p-1 rounded text-[#ffb4ab] hover:bg-[#93000a]/20 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Add Transaction */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-xl p-5 max-w-md w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-sm text-[var(--text-main)]">
                Novo Lançamento Financeiro
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-3">
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Descrição do Lançamento</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Compra Chapas MDF Freijó 18mm"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Tipo</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-main)]"
                  >
                    <option value="payable">Contas a Pagar (Despesa)</option>
                    <option value="receivable">Contas a Receber (Receita)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Centro de Custo</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-main)]"
                  >
                    <option value="Matéria-Prima MDF">Matéria-Prima MDF</option>
                    <option value="Filamentos 3D">Filamentos 3D</option>
                    <option value="Ferragens">Ferragens</option>
                    <option value="Energia / Manutenção CNC">Energia / Manutenção CNC</option>
                    <option value="Frete / Logística">Frete / Logística</option>
                    <option value="Faturamento Vendas">Faturamento Vendas</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">Vencimento</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Projeto Relacionado (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Cozinha Gourmet Dr. Marcelo"
                  value={newProjectRef}
                  onChange={(e) => setNewProjectRef(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-main)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="convex-btn px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

