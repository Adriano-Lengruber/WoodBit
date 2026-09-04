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
  Filter,
  BarChart3,
  PieChart,
  Tag,
  Check
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
      !(f.projectTitle || '').toLowerCase().includes(searchTerm.toLowerCase())
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

  // Category breakdown for mini-chart
  const expensesByCategory = finance
    .filter((f) => f.type === 'payable')
    .reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + f.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div id="finance-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-5 rounded-2xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)] shadow-xs">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
              Financeiro & Margem Real por Centro de Custo
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Fluxo de caixa de marcenaria, entradas/saídas por projeto e controle de compras de insumos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="convex-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" /> Novo Lançamento
          </button>
        </div>
      </div>

      {/* 3 Summary Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Receivables */}
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-5 beveled-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Total a Receber (Vendas)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display font-black text-2xl sm:text-3xl text-emerald-400 font-mono block">
              R$ {totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Entradas de contratos e sinais PIX</p>
        </div>

        {/* Payables */}
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-5 beveled-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Total a Pagar (Custos/Insumos)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-950/70 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display font-black text-2xl sm:text-3xl text-rose-400 font-mono block">
              R$ {totalPayables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Chapas de MDF, ferragens, fretes e energia</p>
        </div>

        {/* Net Balance */}
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-5 beveled-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Resultado Operacional Líquido
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display font-black text-2xl sm:text-3xl text-amber-400 font-mono block">
              R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-emerald-400 font-bold">
            Margem operacional média consolidada de {marginPercentage}%
          </p>
        </div>
      </div>

      {/* Visual Category Breakdown Bar */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-5 beveled-card shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Distribuição de Custos Operacionais por Categoria
          </span>
          <span className="font-mono text-slate-400 text-xs font-medium">
            Total Despesas: R$ {totalPayables.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="w-full h-3.5 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
          {(Object.entries(expensesByCategory) as [string, number][]).map(([cat, val], i) => {
            const pct = Math.max(2, Math.round((Number(val) / (totalPayables || 1)) * 100));
            const colors = [
              'bg-amber-500',
              'bg-sky-500',
              'bg-purple-500',
              'bg-rose-500',
              'bg-indigo-500',
            ];
            return (
              <div
                key={cat}
                className={`${colors[i % colors.length]} transition-all duration-300`}
                style={{ width: `${pct}%` }}
                title={`${cat}: R$ ${Number(val).toFixed(2)} (${pct}%)`}
              />
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-slate-400 font-medium">
          {(Object.entries(expensesByCategory) as [string, number][]).map(([cat, val], i) => {
            const colors = [
              'bg-amber-500',
              'bg-sky-500',
              'bg-purple-500',
              'bg-rose-500',
              'bg-indigo-500',
            ];
            return (
              <div key={cat} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${colors[i % colors.length]}`}></span>
                <span>
                  {cat}: <strong className="text-slate-200">R$ {Number(val).toLocaleString('pt-BR')}</strong>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-container)] p-4 rounded-2xl border border-[var(--border-subtle)] beveled-card shadow-sm">
          <div className="flex items-center gap-1.5 bg-[var(--bg-low)] p-1.5 rounded-xl border border-[var(--border-subtle)] w-fit text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg transition font-bold cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-[var(--bg-high)] text-[var(--color-primary)] shadow-xs border border-[var(--color-primary)]/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({finance.length})
            </button>
            <button
              onClick={() => setTypeFilter('receivable')}
              className={`px-3.5 py-1.5 rounded-lg transition font-bold cursor-pointer ${
                typeFilter === 'receivable'
                  ? 'bg-[var(--bg-high)] text-emerald-400 shadow-xs border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setTypeFilter('payable')}
              className={`px-3.5 py-1.5 rounded-lg transition font-bold cursor-pointer ${
                typeFilter === 'payable'
                  ? 'bg-[var(--bg-high)] text-rose-400 shadow-xs border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Despesas
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar lançamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] w-48 sm:w-64"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] cursor-pointer font-medium"
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

        {/* Transactions Table */}
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden beveled-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-low)] text-slate-400 uppercase font-bold text-xs border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="p-3.5">Descrição / Lançamento</th>
                  <th className="p-3.5">Tipo</th>
                  <th className="p-3.5">Categoria</th>
                  <th className="p-3.5">Vencimento</th>
                  <th className="p-3.5">Valor</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-container)]">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[var(--bg-low)]/70 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-sm text-[var(--text-main)] block leading-snug">
                        {tx.description}
                      </span>
                      {tx.projectTitle && (
                        <span className="text-xs text-slate-400 font-medium">Ref: {tx.projectTitle}</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-mono uppercase font-bold ${
                          tx.type === 'receivable'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {tx.type === 'receivable' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-300 font-medium">{tx.category}</td>

                    <td className="p-3.5 font-mono text-slate-400 font-medium">{tx.dueDate}</td>

                    <td className="p-3.5 font-mono font-bold text-sm">
                      <span className={tx.type === 'receivable' ? 'text-emerald-400' : 'text-rose-400'}>
                        {tx.type === 'receivable' ? '+' : '-'} R${' '}
                        {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => handleTogglePaid(tx.id)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                          tx.status === 'paid'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {tx.status === 'paid' ? '✓ Quitado' : '○ Pendente'}
                      </button>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-slate-400 hover:text-rose-400 p-1.5 cursor-pointer transition"
                        title="Excluir lançamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: New Transaction */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[var(--bg-container)] border border-[var(--color-primary)]/40 rounded-2xl p-6 max-w-md w-full beveled-card shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[var(--color-primary)]" />
                Novo Lançamento Financeiro
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Descrição do Lançamento
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Compra de 5 chapas MDF Freijó 18mm"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Tipo de Fluxo
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none cursor-pointer"
                  >
                    <option value="payable">Despesa (A Pagar)</option>
                    <option value="receivable">Receita (A Receber)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Valor (R$)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none cursor-pointer"
                  >
                    <option value="Matéria-Prima MDF">Matéria-Prima MDF</option>
                    <option value="Ferragens & Acessórios">Ferragens & Acessórios</option>
                    <option value="Filamento 3D & Peças">Filamento 3D & Peças</option>
                    <option value="Serviços CNC Terceirizados">Serviços CNC Terceirizados</option>
                    <option value="Entrada de Projeto (PIX)">Entrada de Projeto (PIX)</option>
                    <option value="Saldo de Entrega">Saldo de Entrega</option>
                    <option value="Frete & Logística">Frete & Logística</option>
                    <option value="Energia Elétrica / Oficina">Energia Elétrica / Oficina</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Projeto de Referência (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cozinha Gourmet Silva"
                  value={newProjectRef}
                  onChange={(e) => setNewProjectRef(e.target.value)}
                  className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-main)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="convex-btn px-5 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-md"
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
