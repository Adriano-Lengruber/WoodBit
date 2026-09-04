import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  Sliders,
  Cpu,
  Printer,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowRight,
  Lightbulb,
  Type,
  Palette,
  Download,
  Box,
  Eye
} from 'lucide-react';
import { CatalogProduct, ProductionOrder } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Interactive3DViewer } from '../3d/Interactive3DViewer';

interface CatalogViewProps {
  products: CatalogProduct[];
  onGenerateOrderFromConfigurator: (order: Partial<ProductionOrder>) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  onGenerateOrderFromConfigurator,
}) => {
  const { showToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct>(products[0]);

  // Configurator Options
  const [finish, setFinish] = useState<'mdf_preto' | 'freijo' | 'carvalho'>('freijo');
  const [size, setSize] = useState<'140' | '160' | '180' | '200'>('160');
  const [engravingText, setEngravingText] = useState('WOODBIT CYBER');
  const [hasLed, setHasLed] = useState(true);
  const [ledColor, setLedColor] = useState<'amber' | 'cyan' | 'rgb'>('amber');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([
    'Suporte Headset 3D',
    'Organizador Cabos Magnético',
  ]);
  const [orderCreatedSuccess, setOrderCreatedSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');

  // Price calculations
  let basePrice = selectedProduct.basePrice;
  if (size === '160') basePrice += 180;
  if (size === '180') basePrice += 350;
  if (size === '200') basePrice += 550;

  if (finish === 'freijo') basePrice += 120;
  if (hasLed) basePrice += 160;
  if (engravingText.trim().length > 0) basePrice += 80;
  basePrice += selectedAccessories.length * 45;

  const estimatedCost = Math.round(basePrice * 0.58);
  const marginPercent = Math.round(((basePrice - estimatedCost) / basePrice) * 100);

  // Toggle accessory
  const toggleAccessory = (acc: string) => {
    if (selectedAccessories.includes(acc)) {
      setSelectedAccessories(selectedAccessories.filter((a) => a !== acc));
    } else {
      setSelectedAccessories([...selectedAccessories, acc]);
    }
  };

  // 1-Click Order Generation
  const handleCreateOrder = () => {
    const newOrder: Partial<ProductionOrder> = {
      id: `op-${Date.now()}`,
      orderNumber: `OP-2026-${Math.floor(100 + Math.random() * 900)}`,
      projectId: 'prj-custom-gamer',
      projectTitle: `${selectedProduct.name} Custom (${size}cm - ${finish})`,
      customerName: 'Cliente Setup Express',
      priority: 'medium',
      stage: 'in_progress',
      currentCenter: 'cnc',
      progressPercent: 10,
      materialsReserved: true,
      qualityPassed: true,
      targetEndDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      assignedOperator: 'Felipe CNC & 3D',
      operations: [
        {
          id: 'op-c1',
          stepNumber: 1,
          center: 'woodworking',
          name: 'Corte Tampo MDF',
          estimatedMinutes: 25,
          status: 'done',
        },
        {
          id: 'op-c2',
          stepNumber: 2,
          center: 'cnc',
          name: `Gravação CNC Personalizada ("${engravingText}")`,
          estimatedMinutes: 40,
          status: 'running',
        },
        {
          id: 'op-c3',
          stepNumber: 3,
          center: '3d_printing',
          name: `Impressão 3D Acessórios (${selectedAccessories.length} itens)`,
          estimatedMinutes: 180,
          status: 'pending',
        },
        {
          id: 'op-c4',
          stepNumber: 4,
          center: 'assembly',
          name: 'Montagem Fita LED & Embalagem',
          estimatedMinutes: 30,
          status: 'pending',
        },
      ],
      files: [
        { name: 'tampo_custom_cnc.dxf', type: 'dxf', size: '1.4MB', url: '#' },
        { name: 'acessorios_gamer_pack.stl', type: 'stl', size: '8.2MB', url: '#' },
      ],
    };

    onGenerateOrderFromConfigurator(newOrder);
    setOrderCreatedSuccess(true);
    showToast(
      'Ordem de Produção Gerada!',
      `${newOrder.orderNumber} enviada para usinagem CNC e impressão 3D.`,
      'success'
    );
    setTimeout(() => setOrderCreatedSuccess(false), 4000);
  };

  const handleExportSpec = () => {
    let spec = `=====================================================\n`;
    spec += `WOODBIT LAB - FICHA TÉCNICA PARAMÉTRICA DO PRODUTO\n`;
    spec += `Produto: ${selectedProduct.name}\n`;
    spec += `Acabamento: ${finish.toUpperCase()}\n`;
    spec += `Dimensões: ${size}0 x 800 x 25 mm\n`;
    spec += `Gravação CNC: ${engravingText || 'Sem gravação'}\n`;
    spec += `Iluminação LED: ${hasLed ? `Sim (${ledColor.toUpperCase()})` : 'Não'}\n`;
    spec += `Acessórios 3D PETG:\n`;
    selectedAccessories.forEach((acc, i) => {
      spec += `  ${i + 1}. ${acc}\n`;
    });
    spec += `\nVALOR DE VENDA: R$ ${basePrice.toFixed(2)}\n`;
    spec += `CUSTO ESTIMADO: R$ ${estimatedCost.toFixed(2)} (Margem ${marginPercent}%)\n`;
    spec += `=====================================================\n`;

    const blob = new Blob([spec], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha_parametrica_${selectedProduct.id}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Ficha Técnica Exportada!', 'Especificações salvas para produção.', 'success');
  };

  return (
    <div id="catalog-view-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-5 rounded-2xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-low)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-subtle)] shadow-xs">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
              Catálogo & Configurador Paramétrico Gamer / Decor
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Simulação interativa com usinagem CNC ao vivo, acessórios 3D customizados e geração direta de Ordem de Produção (OP).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[var(--color-primary)] bg-[var(--bg-low)] px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] shadow-xs">
            ✓ Integração Direta: CNC Router + 3D Lab
          </span>
        </div>
      </div>

      {/* Main Grid: Visual Live Preview on Left, Parametric Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Interactive Visual Preview Canvas */}
        <div className="lg:col-span-6 space-y-4">
          {/* 2D / 3D Mode Toggle Bar */}
          <div className="flex items-center justify-between bg-[var(--bg-container)] border border-[var(--border-subtle)] p-2 rounded-xl beveled-card">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-[var(--color-primary)] text-[#1b1715] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-transparent'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                Preview 3D Interativo (WebGL)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('2d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === '2d'
                    ? 'bg-[var(--color-primary)] text-[#1b1715] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-transparent'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Esquemático 2D
              </button>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)] hidden sm:inline">
              {viewMode === '3d' ? 'Gire com mouse/toque' : 'Vista ortogonal'}
            </span>
          </div>

          {viewMode === '3d' ? (
            <div className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden beveled-card shadow-sm">
              <Interactive3DViewer
                initialModel={selectedProduct.id === 'prod_suporte_headset' ? 'printed_stand' : 'gamer_desk'}
                initialMaterial={finish === 'freijo' ? 'freijo' : finish === 'mdf_preto' ? 'grafite' : 'carvalho'}
                height="420px"
                showControls={true}
              />
            </div>
          ) : (
            <div className="bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl p-6 relative overflow-hidden beveled-card flex flex-col items-center justify-center min-h-[420px] shadow-sm">
              {/* Ambient LED Glow Effect */}
              {hasLed && (
                <div
                  className={`absolute inset-0 opacity-30 blur-3xl pointer-events-none transition-colors duration-500 ${
                    ledColor === 'amber'
                      ? 'bg-[var(--color-primary)]'
                      : ledColor === 'cyan'
                      ? 'bg-[#38bdf8]'
                      : 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500'
                  }`}
                ></div>
              )}

              {/* Product Rendering Visual Representation */}
              <div className="relative z-10 w-full max-w-md space-y-4 text-center">
                {/* Product Realistic Mock Card */}
                <div
                  className={`w-full h-48 rounded-2xl border-2 shadow-2xl p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                    finish === 'mdf_preto'
                      ? 'bg-[#18181b] border-[#3f3f46] text-white'
                      : finish === 'freijo'
                      ? 'bg-gradient-to-r from-[#452c1e] to-[#6d4630] border-[var(--color-primary)]/60 text-[#fdecd8] wood-grain'
                      : 'bg-[#5c4a3b] border-[#a89078] text-[#fef9f3]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-md bg-black/40 backdrop-blur">
                      WoodBit • {size}cm
                    </span>
                    {hasLed && (
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-black/60 text-[var(--color-primary)] flex items-center gap-1.5 border border-[var(--color-primary)]/30">
                        <Lightbulb className="w-3.5 h-3.5 text-[var(--color-primary)]" /> LED {ledColor.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* CNC Engraved Text on Desk Surface */}
                  <div className="my-auto text-center py-2">
                    <span className="text-xs text-black/60 block font-mono font-bold uppercase tracking-wider mb-1">
                      Gravação CNC Router em Baixo Relevo:
                    </span>
                    <span className="font-display font-black text-xl md:text-2xl tracking-wider text-black/80 drop-shadow-xs select-none">
                      {engravingText || 'SEU TEXTO AQUI'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium text-white/90">
                    <span>Espessura: 25mm Usinado</span>
                    <span className="font-mono font-bold">{selectedAccessories.length} Acessórios 3D</span>
                  </div>
                </div>

                {/* 3D Printed Accessories Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {selectedAccessories.map((acc, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[var(--bg-container)] border border-[var(--color-primary)]/40 text-[var(--color-primary)] flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {acc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Margin Summary Box */}
          <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 beveled-card shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                Valor de Venda Sugerido
              </span>
              <span className="font-display font-bold text-3xl text-[var(--color-secondary)] block">
                R$ {basePrice.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-[var(--color-primary)] block">
                Custo Fab: R$ {estimatedCost.toFixed(2)} • Margem Líquida: <strong className="font-mono font-bold">{marginPercent}%</strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportSpec}
                className="px-4 py-2.5 rounded-xl bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[var(--text-main)] text-xs font-bold flex items-center gap-2 cursor-pointer border border-[var(--border-subtle)] shadow-xs transition"
                title="Exportar Ficha Técnica"
              >
                <Download className="w-4 h-4 text-[var(--color-primary)]" />
                Exportar Ficha
              </button>
              <button
                id="btn-generate-order-from-configurator"
                onClick={handleCreateOrder}
                className="convex-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Cpu className="w-4 h-4" />
                1-Click: Gerar OP Fábrica
              </button>
            </div>
          </div>

          {orderCreatedSuccess && (
            <div className="p-4 rounded-xl bg-[var(--color-secondary-container)] border border-[var(--color-secondary)] text-[var(--color-secondary)] text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-xs">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Ordem de Produção gerada com sucesso e despachada para o PCP (CNC + 3D)!
            </div>
          )}
        </div>

        {/* Right 6 Cols: Parametric Configuration Sliders & Selectors */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-2xl p-6 beveled-card space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[var(--color-primary)]" />
                Personalização Técnica & Acabamento
              </h3>
              <span className="text-xs text-[var(--text-muted)] font-mono font-bold">Configurador 4.0</span>
            </div>

            {/* 1. Escolha do Produto Base */}
            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
                1. Modelo Base
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                      selectedProduct.id === p.id
                        ? 'bg-[var(--bg-high)] border-[var(--color-primary)] text-[var(--color-primary)] font-bold shadow-xs'
                        : 'bg-[var(--bg-low)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--color-primary)]/40'
                    }`}
                  >
                    <span className="font-bold text-sm block text-[var(--text-main)]">{p.name}</span>
                    <span className="text-xs text-[var(--text-muted)] font-mono font-medium block mt-0.5">
                      Base R$ {p.basePrice.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Acabamento do Tampo */}
            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[var(--color-primary)]" /> 2. Padrão MDF / Madeira
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  onClick={() => setFinish('freijo')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                    finish === 'freijo'
                      ? 'bg-[var(--bg-high)] border-[var(--color-primary)] text-[var(--color-primary)] font-bold shadow-xs'
                      : 'bg-[var(--bg-low)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  Louro Freijó (+R$120)
                </button>
                <button
                  onClick={() => setFinish('mdf_preto')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                    finish === 'mdf_preto'
                      ? 'bg-[var(--bg-high)] border-[var(--color-primary)] text-[var(--color-primary)] font-bold shadow-xs'
                      : 'bg-[var(--bg-low)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  Preto Texturizado
                </button>
                <button
                  onClick={() => setFinish('carvalho')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                    finish === 'carvalho'
                      ? 'bg-[var(--bg-high)] border-[var(--color-primary)] text-[var(--color-primary)] font-bold shadow-xs'
                      : 'bg-[var(--bg-low)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  Carvalho Hannover
                </button>
              </div>
            </div>

            {/* 3. Dimensão do Tampo */}
            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
                3. Largura do Tampo (Comprimento)
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {(['140', '160', '180', '200'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold text-center transition cursor-pointer ${
                      size === s
                        ? 'bg-[var(--bg-high)] border-[var(--color-primary)] text-[var(--color-primary)] shadow-xs'
                        : 'bg-[var(--bg-low)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--color-primary)]/40'
                    }`}
                  >
                    {s} cm
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Gravação CNC Personalizada */}
            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-[var(--color-primary)]" /> 4. Gravação CNC em Baixo Relevo (+R$80)
              </label>
              <input
                type="text"
                maxLength={24}
                placeholder="Ex: GAMERTAG, NOME OU LOGO"
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                className="w-full bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-main)] font-mono tracking-wider focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            {/* 5. Iluminação LED */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-[var(--color-primary)]" /> 5. Fita LED Traseira (+R$160)
                </label>
                <input
                  type="checkbox"
                  checked={hasLed}
                  onChange={(e) => setHasLed(e.target.checked)}
                  className="accent-[var(--color-primary)] w-4.5 h-4.5 cursor-pointer"
                />
              </div>

              {hasLed && (
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <button
                    onClick={() => setLedColor('amber')}
                    className={`p-2 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                      ledColor === 'amber'
                        ? 'bg-[var(--bg-high)] border-[var(--color-primary)] text-[var(--color-primary)] shadow-xs'
                        : 'bg-[var(--bg-low)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                    }`}
                  >
                    Âmbar WoodBit
                  </button>
                  <button
                    onClick={() => setLedColor('cyan')}
                    className={`p-2 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                      ledColor === 'cyan'
                        ? 'bg-[#0c4a6e]/40 border-[#38bdf8] text-[#38bdf8] shadow-xs'
                        : 'bg-[var(--bg-low)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                    }`}
                  >
                    Cyber Cyan
                  </button>
                  <button
                    onClick={() => setLedColor('rgb')}
                    className={`p-2 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                      ledColor === 'rgb'
                        ? 'bg-[#581c87]/40 border-[#c084fc] text-[#c084fc] shadow-xs'
                        : 'bg-[var(--bg-low)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                    }`}
                  >
                    RGB Rainbow
                  </button>
                </div>
              )}
            </div>

            {/* 6. Acessórios Impressão 3D */}
            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-[var(--color-primary)]" /> 6. Acessórios em Impressão 3D PETG (+R$45 cada)
              </label>
              <div className="space-y-2">
                {[
                  'Suporte Headset 3D',
                  'Organizador Cabos Magnético',
                  'Suporte Controle Console',
                  'Porta Copos Embutido',
                ].map((acc) => (
                  <label
                    key={acc}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-low)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] font-semibold cursor-pointer hover:border-[var(--color-primary)]/40 transition"
                  >
                    <span>{acc}</span>
                    <input
                      type="checkbox"
                      checked={selectedAccessories.includes(acc)}
                      onChange={() => toggleAccessory(acc)}
                      className="accent-[var(--color-primary)] w-4.5 h-4.5 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
