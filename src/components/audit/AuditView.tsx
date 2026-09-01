import React, { useState } from 'react';
import {
  ShieldCheck,
  History,
  Search,
  Filter,
  User,
  Clock,
  FileText,
  Hammer,
  DollarSign
} from 'lucide-react';
import { AuditLog } from '../../types';

interface AuditViewProps {
  auditLogs: AuditLog[];
}

export const AuditView: React.FC<AuditViewProps> = ({ auditLogs }) => {
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter((log) => {
    return (
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.entityType.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div id="audit-view-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#231f1d] border border-[#4f453a]/40 p-4 rounded-xl beveled-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-base text-[#eae1dd] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#fecc93]" />
            Auditoria, Rastreabilidade & Histórico de Modificações
          </h2>
          <p className="text-xs text-[#d3c4b6]">
            Registro imutável de todas as ações operacionais, alterações de margem, validações de medição e ordens de produção.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9c8e82]" />
          <input
            type="text"
            placeholder="Filtrar por usuário ou ação..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#eae1dd] focus:outline-none focus:border-[#fecc93]"
          />
        </div>
      </div>

      {/* Audit Timeline List */}
      <div className="bg-[#231f1d] border border-[#4f453a]/50 rounded-xl p-5 beveled-card space-y-4">
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#d3c4b6] flex items-center gap-2">
          <History className="w-4 h-4 text-[#fecc93]" />
          Trilha de Auditoria Recente ({filtered.length} eventos)
        </h3>

        <div className="divide-y divide-[#4f453a]/20">
          {filtered.map((log) => (
            <div key={log.id} className="py-3.5 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#eae1dd]">{log.action}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-[#110d0c] text-[#fecc93] uppercase">
                    {log.entityType}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#9c8e82]">
                  {new Date(log.timestamp).toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-[#d3c4b6]">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-[#fecc93]" /> {log.actorName} ({log.actorRole})
                </span>
              </div>

              {log.details && (
                <div className="bg-[#110d0c] p-2.5 rounded-lg border border-[#4f453a]/30 text-[11px] font-mono text-[#d3c4b6] debossed">
                  {log.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
