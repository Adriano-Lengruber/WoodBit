import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Plus,
  DollarSign,
  MapPin,
  User,
  Phone,
  Gamepad2,
  Hammer,
  Home,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Project, Quote, ProductLine } from '../../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProjectAndQuote: (project: Project, quote: Quote) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProjectAndQuote,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('(22) 99876-5432');
  const [city, setCity] = useState('Natividade - RJ');
  const [address, setAddress] = useState('Centro, Rua das Palmeiras, 140');
  const [productLine, setProductLine] = useState<ProductLine>('sob_medida');
  const [presetType, setPresetType] = useState('cozinha_gourmet');
  const [budgetEstimate, setBudgetEstimate] = useState<number>(14500);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const projectId = `prj-${Date.now()}`;
    const quoteId = `q-${Date.now()}`;
    const code = `WB-2026-${Math.floor(100 + Math.random() * 900)}`;

    const roomName =
      presetType === 'cozinha_gourmet'
        ? 'Cozinha Gourmet Integrada'
        : presetType === 'setup_gamer'
        ? 'Setup Gamer Titan RGB'
        : presetType === 'painel_ripado'
        ? 'Painel Ripado Sala de Estar'
        : 'Armário Planejado / Closet';

    const costVal = budgetEstimate * 0.58;
    const margin = Math.round(((budgetEstimate - costVal) / budgetEstimate) * 100);

    const projectTitle = `Projeto ${customerName} (${roomName})`;

    const newProject: Project = {
      id: projectId,
      tenantId: 'tenant-woodbit-rj',
      code,
      title: projectTitle,
      customerId: `cust-${Date.now()}`,
      customerName,
      customerPhone,
      address,
      city,
      status: 'technical_visit',
      productLine,
      totalValue: budgetEstimate,
      costValue: costVal,
      marginPercent: margin,
      riskScore: 'low',
      riskReasons: ['Projeto inicial com margem saudável acima de 40%'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rooms: [
        {
          id: `room-${Date.now()}`,
          name: roomName,
          description: `Projeto sob medida com acabamento de alta qualidade em MDF e usinagem CNC WoodBit.`,
          itemsCount: 3,
          materialsUsed: ['MDF Louro Freijó 18mm', 'Ferragens Slow-Close', 'Perfil LED'],
          photos: [],
        },
      ],
      version: 1,
      currentVersionName: 'v1.0 - Proposta Inicial',
    };

    const newQuote: Quote = {
      id: quoteId,
      tenantId: 'tenant-woodbit-rj',
      projectId,
      projectTitle,
      customerName,
      productLine,
      status: 'draft',
      version: 1,
      quoteNumber: `ORC-2026-${Math.floor(100 + Math.random() * 900)}`,
      materialCost: costVal * 0.5,
      machineCostCNC: costVal * 0.2,
      machineCost3D: costVal * 0.05,
      laborCost: costVal * 0.15,
      overheadCost: costVal * 0.05,
      taxCost: costVal * 0.05,
      totalCost: costVal,
      discount: 0,
      totalPrice: budgetEstimate,
      marginPercent: margin,
      minimumMarginRequired: 25,
      isBelowMinimumMargin: margin < 25,
      paymentTerms: '50% entrada PIX + 50% na montagem',
      validityDays: 15,
      estimatedProductionDays: 18,
      createdAt: new Date().toISOString(),
      items: [
        {
          id: `item-${Date.now()}-1`,
          roomName,
          description: `Mobiliário principal em MDF 18mm com usinagem CNC e fita de borda 1mm`,
          category: 'mdf',
          quantity: 1,
          unit: 'cj',
          unitCost: costVal * 0.75,
          totalCost: costVal * 0.75,
          markup: 1.5,
          unitPrice: budgetEstimate * 0.75,
          totalPrice: budgetEstimate * 0.75,
        },
        {
          id: `item-${Date.now()}-2`,
          roomName,
          description: `Kit de ferragens reforçadas com amortecedores e iluminação`,
          category: 'hardware',
          quantity: 1,
          unit: 'kit',
          unitCost: costVal * 0.25,
          totalCost: costVal * 0.25,
          markup: 1.5,
          unitPrice: budgetEstimate * 0.25,
          totalPrice: budgetEstimate * 0.25,
        },
      ],
    };

    onCreateProjectAndQuote(newProject, newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-[#231f1d] border border-[#fecc93]/40 rounded-2xl max-w-xl w-full beveled-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#1f1b19] border-b border-[#4f453a]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#fecc93]/20 flex items-center justify-center text-[#fecc93]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#eae1dd]">
                Novo Projeto & Proposta Comercial
              </h3>
              <span className="text-[10px] text-[#fecc93] font-mono">
                Cadastro Integrado: CRM → Medição Técnica → Orçamento
              </span>
            </div>
          </div>

          <button onClick={onClose} className="text-[#9c8e82] hover:text-[#eae1dd] p-1 text-sm">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Customer & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-[#d3c4b6] block mb-1 font-semibold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#fecc93]" /> Nome do Cliente *
              </label>
              <input
                required
                type="text"
                placeholder="Ex: Dra. Mariana Costa"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg p-2.5 text-xs text-[#eae1dd] focus:border-[#fecc93]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#d3c4b6] block mb-1 font-semibold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#fecc93]" /> WhatsApp do Cliente
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg p-2.5 text-xs text-[#eae1dd] focus:border-[#fecc93]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-[#d3c4b6] block mb-1 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#fecc93]" /> Cidade / Região
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg p-2.5 text-xs text-[#eae1dd]"
              >
                <option value="Natividade - RJ">Natividade - RJ (Sede)</option>
                <option value="Itaperuna - RJ">Itaperuna - RJ</option>
                <option value="Porciúncula - RJ">Porciúncula - RJ</option>
                <option value="Varre-Sai - RJ">Varre-Sai - RJ</option>
                <option value="Laje do Muriaé - RJ">Laje do Muriaé - RJ</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#d3c4b6] block mb-1 font-semibold">
                Endereço da Instalação
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#110d0c] border border-[#4f453a]/60 rounded-lg p-2.5 text-xs text-[#eae1dd]"
              />
            </div>
          </div>

          {/* Product Line Selection */}
          <div className="space-y-2 pt-2 border-t border-[#4f453a]/30">
            <label className="text-[11px] text-[#d3c4b6] block font-semibold">
              Linha de Produto WoodBit:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setProductLine('sob_medida')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                  productLine === 'sob_medida'
                    ? 'bg-[#2e2927] border-[#fecc93] beveled-card shadow-sm'
                    : 'bg-[#161311] border-[#4f453a]/40 text-[#9c8e82]'
                }`}
              >
                <Home className="w-4 h-4 text-[#fecc93]" />
                <div>
                  <strong className="block text-xs text-[#eae1dd]">Marcenaria Sob Medida</strong>
                  <span className="text-[10px] text-[#9c8e82]">Cozinhas, closets, painéis</span>
                </div>
              </label>

              <label
                onClick={() => setProductLine('gamer')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                  productLine === 'gamer'
                    ? 'bg-[#2e2927] border-[#fecc93] beveled-card shadow-sm'
                    : 'bg-[#161311] border-[#4f453a]/40 text-[#9c8e82]'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-[#a855f7]" />
                <div>
                  <strong className="block text-xs text-[#eae1dd]">Linha Gamer / Geek</strong>
                  <span className="text-[10px] text-[#9c8e82]">Mesas CNC, suportes 3D, LED</span>
                </div>
              </label>
            </div>
          </div>

          {/* Preset Environment Template */}
          <div className="space-y-2">
            <label className="text-[11px] text-[#d3c4b6] block font-semibold">
              Template do Ambiente Inicial:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cozinha_gourmet', label: 'Cozinha Gourmet Completa', price: 18500 },
                { id: 'setup_gamer', label: 'Setup Gamer Titan Pro', price: 6800 },
                { id: 'painel_ripado', label: 'Painel Ripado + Rack TV', price: 5400 },
                { id: 'closet_casal', label: 'Closet Casal Modulado', price: 14200 },
              ].map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.id}
                  onClick={() => {
                    setPresetType(tmpl.id);
                    setBudgetEstimate(tmpl.price);
                  }}
                  className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                    presetType === tmpl.id
                      ? 'bg-[#644316]/40 border-[#fecc93] text-[#fecc93]'
                      : 'bg-[#161311] border-[#4f453a]/40 text-[#d3c4b6] hover:border-[#fecc93]/40'
                  }`}
                >
                  <span className="font-semibold block">{tmpl.label}</span>
                  <span className="text-[10px] text-[#9c8e82]">
                    Ref: R$ {tmpl.price.toLocaleString('pt-BR')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Margin Preview */}
          <div className="p-3 rounded-xl bg-[#161311] border border-[#fecc93]/30 flex items-center justify-between debossed">
            <div>
              <span className="text-[10px] text-[#9c8e82] block">Valor Estimado do Projeto</span>
              <div className="flex items-center gap-1 text-sm font-bold font-mono text-[#9cd499]">
                R$
                <input
                  type="number"
                  value={budgetEstimate}
                  onChange={(e) => setBudgetEstimate(Number(e.target.value))}
                  className="w-24 bg-transparent border-b border-[#9cd499] text-[#9cd499] font-mono text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#9c8e82] block">Margem Bruta Estimada</span>
              <span className="text-xs font-mono font-bold text-[#fecc93]">42% (Segura ✓)</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#2e2927] hover:bg-[#393431] text-xs text-[#d3c4b6] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="convex-btn px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" /> Criar Projeto e Abrir Orçamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
