import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Smartphone,
  Hammer,
  DollarSign,
  Scissors,
  Boxes,
  Camera,
  Printer,
  ChevronRight,
  ExternalLink,
  Search,
  FileText,
  AlertTriangle,
  Lightbulb,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView?: (viewId: string) => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onNavigateToView
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'screens' | 'mobile' | 'faq'>('flow');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const modulesGuide = [
    {
      id: 'dashboard',
      icon: Layers,
      title: '1. Dashboard Executivo',
      subtitle: 'O painel central de controle da marcenaria',
      description: 'Mostra o faturamento do mês, margem média de lucro, quantas OPs estão na Router CNC e impressoras 3D, e tarefas urgentes do dia.',
      tips: 'Use para começar o seu dia de trabalho e ver se alguma máquina precisa de atenção.',
    },
    {
      id: 'crm',
      icon: Zap,
      title: '2. CRM & WhatsApp com IA',
      subtitle: 'Atendimento a clientes e novos pedidos',
      description: 'Gerencie os clientes desde o primeiro "Oi" no WhatsApp até o fechamento. A IA analisa as mensagens e diz se o cliente precisa de visita técnica urgente.',
      tips: 'Arraste os cartões dos clientes para as colunas certas à medida que a conversa avança.',
    },
    {
      id: 'field',
      icon: Camera,
      title: '3. Medição Técnica (Campo / Obra)',
      subtitle: 'Conferência presencial com celular ou tablet',
      description: 'Tire fotos das paredes e use o checklist para conferir prumo, esquadro, tomadas e canos. Funciona mesmo sem internet no celular!',
      tips: 'Clique em "Analisar com IA" nas fotos: a IA avisa se houver cano ou tomada que possa atrapalhar o armário.',
    },
    {
      id: 'quotes',
      icon: DollarSign,
      title: '4. Orçamentos & Proposta PDF',
      subtitle: 'Cálculo de preço seguro e proposta formal A4',
      description: 'Monte a lista de móveis e ferragens. O sistema alerta se o lucro estiver baixo demais (Margin Guard) e emite proposta comercial formal em folha A4 com 1 clique.',
      tips: 'Clique no botão "Proposta PDF" e depois em "Imprimir / Salvar PDF" para mandar um documento impecável ao cliente.',
    },
    {
      id: 'catalog',
      icon: Cpu,
      title: '5. Catálogo & Visualizador 3D',
      subtitle: 'Modelos tridimensionais interativos e arquivos STL/OBJ',
      description: 'Visualize mesas gamer e nichos em 3D real. Você também pode arrastar e soltar qualquer arquivo .STL ou .OBJ do seu computador para ver na hora o peso em gramas e tempo de impressão!',
      tips: 'Gire com o mouse ou toque para inspecionar os detalhes de usinagem e conexões.',
    },
    {
      id: 'production',
      icon: Hammer,
      title: '6. PCP (Controle de Produção)',
      subtitle: 'Chão de fábrica, corte, fita e montagem',
      description: 'Acompanhe o que está sendo cortado, usinado ou impresso. Ao iniciar a OP, reserve as chapas no estoque. Ao terminar a montagem, a baixa de materiais é automática.',
      tips: 'Cada operador clica em "Concluir Etapa" para atualizar o progresso em tempo real.',
    },
    {
      id: 'cut_optimizer',
      icon: Scissors,
      title: '7. Otimizador de Corte 2D',
      subtitle: 'Economia de chapas de MDF e respeito aos veios',
      description: 'Calcula o melhor jeito de cortar as peças de madeira na serra ou na CNC, evitando o desperdício de material e respeitando o sentido do veio da madeira.',
      tips: 'Economiza até 2 a 3 chapas por projeto médio.',
    },
    {
      id: 'inventory',
      icon: Boxes,
      title: '8. Estoque & Almoxarifado',
      subtitle: 'Controle de chapas de MDF, ferragens e filamentos 3D',
      description: 'Saiba exatamente quantas chapas restam de Louro Freijó, Branco TX ou Grafite, e quantos quilos de filamento PETG estão disponíveis.',
      tips: 'O sistema avisa em vermelho quando um item atinge o nível mínimo de compra.',
    },
  ];

  const filteredModules = modulesGuide.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tips.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-[var(--bg-container)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-4xl w-full beveled-card shadow-2xl space-y-6 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-container)] text-[var(--color-primary)] flex items-center justify-center border border-[var(--color-primary)]/30 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
                Manual do Usuário & Guia Prático
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Passo a passo simples e didático para operar o WoodBit ERP na sua marcenaria.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--bg-low)] hover:bg-[var(--bg-high)] text-slate-300 hover:text-white text-xs font-bold cursor-pointer transition border border-[var(--border-subtle)]"
            >
              Fechar ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[var(--bg-lowest)] rounded-2xl border border-[var(--border-subtle)] text-xs shrink-0">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'flow'
                ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Fluxo da Marcenaria (Passo a Passo)</span>
          </button>

          <button
            onClick={() => setActiveTab('screens')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'screens'
                ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Guia das Telas & Módulos</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'mobile'
                ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Celular & Obra Offline</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Dúvidas Frequentes (FAQ)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: FLUXO COMPLETO */}
          {activeTab === 'flow' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 space-y-1">
                <span className="font-bold text-sm block text-amber-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> O Ciclo de Vida de um Móvel no WoodBit
                </span>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  Para não se perder na correria da oficina, siga esta sequência lógica do primeiro contato à entrega das chaves:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center font-mono text-xs">
                      1
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-100">Atendimento & CRM</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    O cliente manda mensagem pelo WhatsApp. A IA local tria o pedido e você cadastra o Lead no CRM com cidade (Natividade, Itaperuna, etc.).
                  </p>
                </div>

                <div className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center font-mono text-xs">
                      2
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-100">Visita de Medição com Celular</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    O marceneiro vai ao local com trena a laser. Abre o WoodBit no celular, tira fotos das paredes e a IA verifica prumo, canos e tomadas.
                  </p>
                </div>

                <div className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center font-mono text-xs">
                      3
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-100">Orçamento & Proposta Formal</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Lance as chapas e ferragens. O sistema garante sua margem de lucro e gera a <strong>Proposta Comercial em PDF A4</strong> com termos de garantia de 5 anos.
                  </p>
                </div>

                <div className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center font-mono text-xs">
                      4
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-100">Sinal de Entrada (50% PIX)</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Na tela de Orçamento, clique em <strong>"PIX Entrada"</strong> para gerar o QR Code e chave copia-e-cola dos 50% de sinal para iniciar a produção.
                  </p>
                </div>

                <div className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center font-mono text-xs">
                      5
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-100">Nesting & Corte de Chapas</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Passe pelo Otimizador de Corte para distribuir as peças no MDF economizando retalhos e respeitando o sentido dos veios da madeira.
                  </p>
                </div>

                <div className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center font-mono text-xs">
                      6
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-100">Chão de Fábrica & Baixa de Estoque</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    No PCP, clique em "Reservar no Estoque". A equipe executa o corte, borda, usinagem CNC e montagem. Ao concluir a última etapa, a baixa no estoque é automática!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TELAS E MÓDULOS */}
          {activeTab === 'screens' && (
            <div className="space-y-3.5 text-xs">
              {/* Internal Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por tela, funcionalidade ou dúvida..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--bg-lowest)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-main)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-3">
                {filteredModules.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={mod.id}
                      className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-2 hover:border-[var(--color-primary)]/40 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[var(--bg-lowest)] text-[var(--color-primary)] flex items-center justify-center border border-[var(--border-subtle)]">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-display font-bold text-sm text-slate-100 block">
                              {mod.title}
                            </span>
                            <span className="text-xs text-slate-400">{mod.subtitle}</span>
                          </div>
                        </div>

                        {onNavigateToView && (
                          <button
                            onClick={() => {
                              onNavigateToView(mod.id);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[var(--bg-lowest)] hover:bg-[var(--bg-high)] text-amber-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition border border-amber-500/20"
                          >
                            <span>Ir para a Tela</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <p className="text-slate-300 leading-relaxed">{mod.description}</p>

                      <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-amber-300/90 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span><strong>Dica Prática:</strong> {mod.tips}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CELULAR E OBRA */}
          {activeTab === 'mobile' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-3">
                <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Como usar o WoodBit no Celular ou Tablet na Casa do Cliente
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  O WoodBit foi desenvolvido como um <strong>PWA (Progressive Web App)</strong>. Isso significa que ele funciona como um aplicativo normal no seu celular Android ou iPhone, mesmo quando a internet do cliente estiver sem sinal ou instável:
                </p>

                <ol className="list-decimal pl-5 space-y-2 text-slate-200">
                  <li>
                    <strong>Como "Instalar" no Celular:</strong> Abra o navegador no celular digitando o endereço da oficina (ex: <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-amber-300">http://ip-da-oficina:3000</code>). Toque nos 3 pontinhos do Chrome ou no botão Compartilhar do Safari e escolha <strong>"Adicionar à Tela de Início"</strong>.
                  </li>
                  <li>
                    <strong>Tirando Fotos da Obra:</strong> Na tela <em>Medição Técnica</em>, toque no botão <strong>"Câmera / Foto"</strong>. O celular abrirá a câmera diretamente para fotografar paredes, tubulações e pontos elétricos.
                  </li>
                  <li>
                    <strong>Trabalhando Sem Sinal de Internet:</strong> Se a obra estiver sem Wi-Fi, o WoodBit grava as medições e fotos na memória do celular. Quando você voltar para a oficina ou recuperar sinal, basta tocar em <strong>"Sincronizar com a Oficina"</strong>.
                  </li>
                </ol>
              </div>

              <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl text-emerald-200 space-y-1">
                <span className="font-bold text-xs block text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Segurança e Privacidade Total
                </span>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  As fotos da residência do cliente não sobem para redes sociais nem para servidores públicos. Todo o laudo é guardado dentro da rede segura da própria marcenaria.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-2">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span className="text-amber-400">❓</span> Como ligo o sistema pela manhã?
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Basta dar dois cliques no arquivo <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-amber-300">iniciar-woodbit.bat</code> na pasta do sistema ou atalho na Área de Trabalho. Ele liga o servidor e abre o navegador automaticamente na tela do sistema.
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-2">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span className="text-amber-400">❓</span> E se a IA local estiver dizendo "Offline"?
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Abra o programa <strong>LM Studio</strong> no computador da oficina, verifique se o modelo <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-amber-300">google/gemma-4-12b-qat</code> está carregado e clique no botão verde para ligar o servidor local (porta 1234).
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-2">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span className="text-amber-400">❓</span> Como imprimo ou salvo a proposta em PDF para o cliente?
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Vá na tela <strong>Orçamentos</strong>, selecione a proposta desejada e clique em <strong>"Proposta PDF"</strong>. Uma janela com o documento no formato folha A4 se abrirá. Clique em <strong>"Imprimir / Salvar PDF"</strong> e escolha "Salvar como PDF" para mandar por WhatsApp.
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-low)] border border-[var(--border-subtle)] rounded-2xl space-y-2">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span className="text-amber-400">❓</span> Onde encontro o manual escrito em detalhes para impressão?
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  O manual editorial completo está gravado no arquivo <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-amber-300">docs/USER_MANUAL.md</code> dentro da pasta do projeto, com todos os tópicos e termos explicados em profundidade.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>WoodBit ERP • Marcenaria 4.0 • Natividade - RJ</span>
          <span className="text-[11px] font-mono text-amber-400">Versão 2.0 Operacional</span>
        </div>
      </div>
    </div>
  );
};
