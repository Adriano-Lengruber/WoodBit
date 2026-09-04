import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Sliders,
  ShieldCheck,
  Sparkles,
  Zap,
  Terminal,
  Clock,
  Compass,
  Download,
  FileCode,
  Layers,
  Settings2,
  Check,
  Box,
  Eye
} from 'lucide-react';
import { Machine } from '../../types';
import { Interactive3DViewer } from '../3d/Interactive3DViewer';

interface ToolItem {
  id: string;
  name: string;
  type: 'cnc_router' | 'fdm_3d' | 'saw_blade';
  diameter: string;
  flutes: number;
  currentHours: number;
  maxHours: number;
  status: 'good' | 'warning' | 'replace';
  lastSharpened: string;
}

interface CamSimulatorViewProps {
  machines: Machine[];
  onBackToProduction?: () => void;
}

const MATERIAL_PRESETS = [
  { id: 'mdf_18', name: 'MDF 18mm (Madeira Revestida)', defaultFeed: 2800, defaultRpm: 18000, passDepth: 6.0 },
  { id: 'freijo_solid', name: 'Louro Freijó Maciço 25mm', defaultFeed: 2200, defaultRpm: 16000, passDepth: 4.0 },
  { id: 'acrylic_6', name: 'Acrílico Cristal Cast 6mm', defaultFeed: 1800, defaultRpm: 14000, passDepth: 3.0 },
  { id: 'plywood_15', name: 'Compensado Naval 15mm', defaultFeed: 3200, defaultRpm: 19000, passDepth: 5.0 },
];

export const CamSimulatorView: React.FC<CamSimulatorViewProps> = ({
  machines,
  onBackToProduction,
}) => {
  // Machine Toolpath Simulation States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(34);
  const [feedRate, setFeedRate] = useState<number>(2800); // mm/min
  const [spindleRpm, setSpindleRpm] = useState<number>(18000); // RPM
  const [activeLayer, setActiveLayer] = useState<number>(2); // Layer 2 of 3 (6mm stepdown on 18mm MDF)
  const [selectedToolId, setSelectedToolId] = useState<string>('t1');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mdf_18');
  const [maintenanceFeedback, setMaintenanceFeedback] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');

  // Tool wear inventory
  const [toolInventory, setToolInventory] = useState<ToolItem[]>([
    {
      id: 't1',
      name: 'Fresa Helicoidal 2 Cortes Metal Duro (Downcut)',
      type: 'cnc_router',
      diameter: '6.0 mm',
      flutes: 2,
      currentHours: 42,
      maxHours: 100,
      status: 'good',
      lastSharpened: '18/08/2026',
    },
    {
      id: 't2',
      name: 'Fresa V-Bit 90° para Gravação Artística & Chanfro',
      type: 'cnc_router',
      diameter: '12.7 mm (90°)',
      flutes: 1,
      currentHours: 78,
      maxHours: 90,
      status: 'warning',
      lastSharpened: '05/07/2026',
    },
    {
      id: 't3',
      name: 'Broca Caneco 35mm para Dobradiças (Haste 10mm)',
      type: 'cnc_router',
      diameter: '35.0 mm',
      flutes: 4,
      currentHours: 15,
      maxHours: 80,
      status: 'good',
      lastSharpened: '22/08/2026',
    },
    {
      id: 't4',
      name: 'Bico Nozzle 0.4mm Aço Endurecido (Bambu Lab X1)',
      type: 'fdm_3d',
      diameter: '0.4 mm',
      flutes: 0,
      currentHours: 320,
      maxHours: 500,
      status: 'good',
      lastSharpened: 'N/A (Substituível)',
    },
  ]);

  // Handle Material Preset Change
  const handleSelectMaterial = (matId: string) => {
    setSelectedMaterialId(matId);
    const preset = MATERIAL_PRESETS.find((m) => m.id === matId);
    if (preset) {
      setFeedRate(preset.defaultFeed);
      setSpindleRpm(preset.defaultRpm);
    }
  };

  // Simulation timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Tool wear reset / maintenance action
  const handleResetToolLife = (toolId: string) => {
    setToolInventory((prev) =>
      prev.map((t) => {
        if (t.id === toolId) {
          return {
            ...t,
            currentHours: 0,
            status: 'good',
            lastSharpened: new Date().toLocaleDateString('pt-BR'),
          };
        }
        return t;
      })
    );
    const targetTool = toolInventory.find((t) => t.id === toolId);
    setMaintenanceFeedback(`Horímetro zerado e afiação registrada com sucesso para "${targetTool?.name}".`);
    setTimeout(() => setMaintenanceFeedback(null), 4000);
  };

  // Export Real G-Code
  const handleDownloadGcode = () => {
    const activeTool = toolInventory.find((t) => t.id === selectedToolId) || toolInventory[0];
    const gcodeContent = `( WOODBIT CNC ROUTER POST PROCESSOR )
( ARQUIVO: TAMPO_GAMER_RGB.TAP )
( DATA: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')} )
( FERRAMENTA: ${activeTool.name} - ${activeTool.diameter} )
( MATERIAL: ${MATERIAL_PRESETS.find((m) => m.id === selectedMaterialId)?.name} )
( ------------------------------------------------ )
G21 (Unidades em milímetros)
G90 (Coordenadas Absolutas)
G17 (Plano XY)
G28 G91 Z0. (Retração Z Home)
G90
M06 T01 (Carregar Ferramenta)
M03 S${spindleRpm} (Ligar Spindle Sentido Horário)
G00 Z25.000 (Altura de Segurança)
G00 X0.000 Y0.000
G00 X50.000 Y40.000
G01 Z-6.000 F800 (Mergulho Inicial)
G01 X250.000 Y40.000 F${feedRate} (Usinagem Face A)
G02 X270.000 Y60.000 I0.000 J20.000 (Canto Arredondado R20)
G01 X270.000 Y180.000
G01 X50.000 Y180.000
G01 X50.000 Y40.000
( Passo 2 - Rebaixo Iluminação LED 8mm )
G00 Z5.000
G00 X80.000 Y60.000
G01 Z-8.000 F600
G01 X220.000 Y60.000 F${feedRate}
G01 X220.000 Y140.000
G01 X80.000 Y140.000
G01 X80.000 Y60.000
( Furação Dobradiças e Conectores )
G00 Z15.000
G00 X40.000 Y160.000
G81 X40.000 Y160.000 Z-12.000 R2.000 F400
G00 Z25.000
M05 (Desligar Spindle)
G28 G91 Z0.
G90
G00 X0.000 Y300.000 (Posição de Descarga de Chapa)
M30 (Fim de Programa)
`;

    const blob = new Blob([gcodeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `woodbit_usinagem_${selectedToolId}_feed${feedRate}.tap`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectedTool = toolInventory.find((t) => t.id === selectedToolId) || toolInventory[0];

  return (
    <div id="cam-simulator-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] p-4 rounded-xl beveled-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="font-display font-bold text-base text-[var(--text-main)]">
              Simulador CAM 2.5D/3D & Monitor de Vida Útil de Fresas
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Simulação cinemática de percurso de ferramenta (Toolpath), taxas de avanço (Feedrate), RPM e horímetro de desgaste.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onBackToProduction && (
            <button
              onClick={onBackToProduction}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-medium cursor-pointer transition border border-[var(--border-subtle)]"
            >
              ← Voltar ao PCP
            </button>
          )}

          <button
            onClick={handleDownloadGcode}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-high)] hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-[#3b2203] text-xs font-semibold flex items-center gap-1.5 border border-[var(--border-subtle)] cursor-pointer transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Exportar G-Code (.TAP)
          </button>

          <span className="text-xs px-2.5 py-1 rounded-full bg-[#1d5123]/40 text-[#9cd499] border border-[#9cd499]/30 font-medium flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Spindle HF 3.0 kW Conectado
          </span>
        </div>
      </div>

      {/* Maintenance Notification Banner */}
      {maintenanceFeedback && (
        <div className="p-3 rounded-xl bg-[#1d5123]/30 border border-[#9cd499]/40 text-xs text-[#9cd499] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{maintenanceFeedback}</span>
        </div>
      )}

      {/* Main Grid: Visual Simulation Left + Controls/Tools Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual CAM Toolpath Simulation (2 cols) */}
        <div className="lg:col-span-2 bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-5 beveled-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[var(--color-primary)] font-bold">ARQUIVO: TAMPO_GAMER_RGB.TAP</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--bg-low)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-medium">
                  {MATERIAL_PRESETS.find((m) => m.id === selectedMaterialId)?.name}
                </span>
              </div>
              <h3 className="font-display font-bold text-sm text-[var(--text-main)] mt-0.5">
                Visualização Cinemática do Percurso da Fresa
              </h3>
            </div>

            {/* Playback Controls & 2D/3D Mode */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-[var(--bg-low)] p-1 rounded-lg border border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-[var(--color-primary)] text-[#1b1715] shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  3D Toolpath WebGL
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('2d')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                    viewMode === '2d'
                      ? 'bg-[var(--color-primary)] text-[#1b1715] shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  2D Cinemático
                </button>
              </div>

              {viewMode === '2d' && (
                <>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="convex-btn px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPlaying ? 'Pausar' : 'Simular'}
                  </button>

                  <button
                    onClick={() => {
                      setProgress(0);
                      setIsPlaying(false);
                    }}
                    className="p-1.5 rounded-lg bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer border border-[var(--border-subtle)]"
                    title="Reiniciar percurso"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {viewMode === '3d' ? (
            <div className="bg-[var(--bg-low)] rounded-xl border border-[var(--border-subtle)] overflow-hidden shadow-inner">
              <Interactive3DViewer
                initialModel="toolpath_wireframe"
                height="340px"
                showControls={true}
              />
            </div>
          ) : (
            /* Graphical Toolpath Canvas */
            <div className="relative bg-[var(--bg-low)] rounded-xl border border-[var(--border-subtle)] p-4 h-80 flex items-center justify-center overflow-hidden debossed">
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-subtle)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>

            {/* Simulated Wood Part Layout */}
            <div className="relative w-80 h-56 bg-[#2a221a] border-2 border-[#c4945d] rounded-lg shadow-2xl flex flex-col items-center justify-center select-none">
              {/* Beveled Chamfer Guide */}
              <div className="absolute inset-2 border border-dashed border-[var(--color-primary)]/60 rounded"></div>

              {/* Pocket Cutout */}
              <div className="w-44 h-24 bg-[#161311] border border-[var(--color-primary)] rounded flex items-center justify-center">
                <span className="text-xs font-mono text-[var(--color-primary)] font-bold">Rebaixo LED (Prof: 8mm)</span>
              </div>

              {/* Drill Holes */}
              <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-[#110d0c] border border-[#ffb4ab] flex items-center justify-center text-xs font-mono text-[#ffb4ab] font-bold">
                Ø35
              </div>
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#110d0c] border border-[#ffb4ab] flex items-center justify-center text-xs font-mono text-[#ffb4ab] font-bold">
                Ø35
              </div>
              <div className="absolute bottom-4 left-4 w-3.5 h-3.5 rounded-full bg-[#110d0c] border border-[#9cd499]"></div>
              <div className="absolute bottom-4 right-4 w-3.5 h-3.5 rounded-full bg-[#110d0c] border border-[#9cd499]"></div>

              {/* Simulated Spindle Tool Marker */}
              <div
                className="absolute w-6 h-6 rounded-full bg-[var(--color-primary)]/90 border-2 border-white shadow-lg flex items-center justify-center transition-all duration-150 pointer-events-none"
                style={{
                  left: `${24 + (progress * 2.5) % 270}px`,
                  top: `${24 + Math.sin(progress / 4) * 65 + 60}px`,
                }}
              >
                <span className="w-2 h-2 rounded-full bg-[#93000a] animate-ping"></span>
              </div>
            </div>

            {/* Live G-code Stream Overlay */}
            <div className="absolute bottom-3 left-3 bg-[var(--bg-container)]/95 backdrop-blur-xs p-2.5 rounded-lg border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)] space-y-0.5 shadow-md">
              <div>G01 X{(progress * 12.4).toFixed(1)} Y{(Math.sin(progress) * 45 + 120).toFixed(1)} Z-6.000 F{feedRate}</div>
              <div className="text-[var(--color-primary)] font-bold">S{spindleRpm} M03 (Spindle CW)</div>
            </div>

            {/* Depth Pass Badge */}
            <div className="absolute top-3 right-3 bg-[var(--bg-container)]/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[var(--color-primary)]/40 text-xs font-mono text-[var(--color-primary)] font-bold shadow-md">
              Passo Z: -6.0mm (Passada {activeLayer}/3)
            </div>
          </div>
          )}

          {/* Progress and Live Stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Progresso da Usinagem da Peça</span>
              <span className="font-mono font-bold text-[var(--color-primary)]">{progress}% (Tempo Restante: {Math.max(0, Math.round((100 - progress) * 0.15))}m {Math.floor(Math.random() * 59)}s)</span>
            </div>
            <div className="w-full bg-[var(--bg-low)] rounded-full h-2 overflow-hidden border border-[var(--border-subtle)]">
              <div
                className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] h-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Material Presets Selector */}
          <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-xs font-semibold text-[var(--text-main)] block">Material da Chapa (Configuração de Avanço Recomendada):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MATERIAL_PRESETS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => handleSelectMaterial(mat.id)}
                  className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                    selectedMaterialId === mat.id
                      ? 'bg-[var(--bg-high)] border-[var(--color-primary)] text-[var(--color-primary)] font-bold beveled-card'
                      : 'bg-[var(--bg-low)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <span className="block truncate">{mat.name}</span>
                  <span className="text-xs font-mono opacity-80 block">{mat.defaultFeed} mm/min</span>
                </button>
              ))}
            </div>
          </div>

          {/* Machining Sliders (Feedrate & Spindle RPM Override) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border-subtle)]">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Velocidade de Avanço (Feedrate)</span>
                <span className="font-mono text-[var(--color-primary)] font-bold">{feedRate} mm/min</span>
              </div>
              <input
                type="range"
                min="1000"
                max="5000"
                step="100"
                value={feedRate}
                onChange={(e) => setFeedRate(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Rotação do Spindle (RPM)</span>
                <span className="font-mono text-[var(--color-primary)] font-bold">{spindleRpm} RPM</span>
              </div>
              <input
                type="range"
                min="8000"
                max="24000"
                step="500"
                value={spindleRpm}
                onChange={(e) => setSpindleRpm(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Tool Life & Maintenance */}
        <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-xl p-5 beveled-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
              <Gauge className="w-4 h-4 text-[var(--color-primary)]" />
              Horímetro & Desgaste de Fresas
            </h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {toolInventory.length} Ferramentas
            </span>
          </div>

          <div className="space-y-3">
            {toolInventory.map((tool) => {
              const lifePercent = Math.round(((tool.maxHours - tool.currentHours) / tool.maxHours) * 100);
              const isSelected = tool.id === selectedToolId;

              return (
                <div
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`p-3.5 rounded-lg border text-xs space-y-2 cursor-pointer transition ${
                    isSelected
                      ? 'bg-[var(--bg-high)] border-[var(--color-primary)] beveled-card shadow-sm'
                      : 'bg-[var(--bg-low)]/50 border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-[var(--text-main)] block leading-tight">{tool.name}</span>
                      <span className="text-xs font-mono text-[var(--text-muted)] mt-0.5 block">
                        Ø {tool.diameter} • {tool.flutes > 0 ? `${tool.flutes} cortes` : 'Extrusão 3D'} • Última afiação: {tool.lastSharpened}
                      </span>
                    </div>

                    <span
                      className={`text-xs px-2 py-0.5 rounded font-mono font-bold uppercase ${
                        tool.status === 'good'
                          ? 'bg-[#1d5123]/40 text-[#9cd499] border border-[#9cd499]/30'
                          : 'bg-[#644316]/40 text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                      }`}
                    >
                      {tool.status === 'good' ? 'Boa' : 'Atenção'}
                    </span>
                  </div>

                  {/* Wear Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Vida Útil Restante</span>
                      <span className="font-mono text-[var(--color-primary)] font-bold">{lifePercent}% ({tool.maxHours - tool.currentHours}h)</span>
                    </div>
                    <div className="w-full bg-[var(--bg-low)] rounded-full h-1.5 overflow-hidden border border-[var(--border-subtle)]">
                      <div
                        className={`h-full ${
                          lifePercent > 30 ? 'bg-[#9cd499]' : 'bg-[var(--color-primary)]'
                        }`}
                        style={{ width: `${lifePercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Maintenance Action */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-low)] border border-[var(--color-primary)]/30 space-y-2.5 debossed">
            <span className="text-xs font-semibold text-[var(--text-main)] block flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Registro de Manutenção Preventiva
            </span>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Registrar afiação ou substituição de ferramenta para zerar o ciclo de horímetro.
            </p>
            <button
              onClick={() => handleResetToolLife(selectedTool.id)}
              className="convex-btn w-full py-2 rounded-lg text-xs font-bold cursor-pointer transition shadow-md"
            >
              Registrar Afiação ({selectedTool.name.split(' ')[0]} {selectedTool.diameter})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

