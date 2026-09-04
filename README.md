# 🪵 WoodBit ERP — Organic Tech
### ERP Inteligente para Marcenaria 4.0 & Fabricação Digital (CNC Router + Impressão 3D FDM)
> **Arquitetura Local-First com IA Privada de Alto Desempenho (Google Gemma 4 12B QAT via LM Studio)**

---

[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Local AI](https://img.shields.io/badge/Local--First%20AI-Gemma%204%2012B%20QAT-f59e0b?style=for-the-badge&logo=google&logoColor=white)](https://lmstudio.ai/)
[![LM Studio](https://img.shields.io/badge/LM%20Studio-0.3.x%20Ready-10b981?style=for-the-badge)](https://lmstudio.ai/)
[![Node.js](https://img.shields.io/badge/Node.js-v24+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)](#)

---

## 📖 Visão Geral do Produto

O **WoodBit ERP** é a solução definitiva de gestão operacional, PCP e engenharia de custos desenvolvida sob medida para oficinas que integram **Marcenaria Tradicional de Alto Padrão** e **Manufatura Digital (Router CNC e Impressoras 3D FDM)**.

Projetado estrategicamente para a realidade de marcenarias modernas e focado na região de **Natividade e Noroeste Fluminense / RJ** (atendendo também Itaperuna, Porciúncula e Varre-Sai), o WoodBit elimina o desperdício de matéria-prima, blinda a oficina contra erros de medição na casa do cliente e calcula a margem real de cada projeto centavo por centavo.

---

## ⚡ Diferenciais Competitivos ("Por que o WoodBit?")

- 🔒 **Privacidade Absoluta (Zero Cloud Leak)**: Fotos de quartos, cozinhas residenciais e dados de clientes são processados **100% offline na GPU da oficina**, sem envio para servidores de terceiros.
- 💾 **Persistência em Banco Real SQLite Nativo (`node:sqlite`)**: Banco de dados relacional embarcado com modo WAL em `.data/woodbit.sqlite`. Arquitetura híbrida com sincronização offline e fila de mutações para trabalho em campo.
- 🧊 **Visualizador 3D Interativo WebGL (Three.js)**: Renderização tridimensional em tempo real para o configurador paramétrico (Mesa Gamer, Suporte 3D PETG) e simulação cinemática 3D de percurso de ferramenta CNC (*Toolpaths* multi-passo).
- 📱 **PWA Offline-First para o Marceneiro de Campo**: Aplicativo web progressivo instalável no celular/tablet do marceneiro para conferência in loco com trena e esquadro a laser, armazenando fotos e laudos offline com sincronização automática ao retornar ao Wi-Fi da oficina.
- 💬 **Gateway WhatsApp com Triagem Autônoma (Evolution API / Baileys)**: Webhook em tempo real (`/api/whatsapp/webhook`) conectado ao CRM. A IA **Gemma 4 12B QAT** tria a mensagem recebida, calcula score do lead, detecta necessidade de visita técnica e sugere perguntas ao vendedor.
- 💰 **R$ 0,00 por Token**: Motor de IA local com **Gemma 4 12B QAT** no LM Studio com visão computacional, raciocínio analítico e geração estruturada de JSON sem custos de API.
- 🎙️ **Dite seu Orçamento por Voz (*Voice-to-Quote*)**: O marceneiro dita o projeto na bancada ou no cliente e a IA gera automaticamente a lista de corte de chapas, ferragens, horas de CNC e gramas de filamento 3D.
- 🧩 **PCP Multi-Centro Integrado**: Controle sincronizado de chão de fábrica dividindo as Ordens de Produção (OPs) entre Marcenaria, Router CNC, Fazenda 3D, Montagem, Acabamento e Instalação Externa.
- 📊 **Otimizador de Corte 2D com Orientação de Veio**: Reduz o desperdício de chapas de MDF (Louro Freijó, Branco TX, Grafite) calculando a sangria da serra (*kerf*) e aproveitando retalhos.

---

## 🏗️ Arquitetura de Software & IA Híbrida

O WoodBit opera com uma arquitetura **Local-First Resiliente** e tolerante a falhas:

```mermaid
flowchart TD
    subgraph Cliente["📱 Cliente / PWA / Oficina"]
        UI[Interface React 19 + Three.js 3D]
        SW[Service Worker Offline Cache]
        LS[(Fila Local / LocalStorage)]
    end

    subgraph Backend["💻 Servidor Local WoodBit (Node 24)"]
        API[Express REST API]
        DB[(SQLite Nativo WAL\n.data/woodbit.sqlite)]
        WH[Webhook WhatsApp\nEvolution API / Baileys]
    end

    subgraph IA["🧠 Motores de IA"]
        LM[1. LM Studio Local\nGemma 4 12B QAT]
        OL[2. Ollama Local\nQwen / DeepSeek]
        GEM[3. Google Gemini Cloud\ngemini-3.7-flash]
    end

    UI <--> SW
    UI <--> LS
    UI <-->|Sync Online| API
    WH --> API
    API <--> DB
    API --> LM
    LM -.->|Fallback| OL
    OL -.->|Fallback| GEM
```

---

## 🗂️ Módulos da Plataforma

| Ícone | Módulo | Descrição Funcional |
| :---: | :--- | :--- |
| 📊 | **Dashboard Executivo** | Indicadores de faturamento, OPs ativas, ocupação de máquinas, leads no funil e alternância de temas (Dark Titanium / Light Natural Wood). |
| 💬 | **CRM & WhatsApp Gateway** | Kanban de vendas com webhook Evolution API / Baileys e **Triagem em Tempo Real via Gemma 4 12B QAT**. |
| 🏭 | **PCP Multi-Centro** | Chão de fábrica com telemetria de Router CNC, Impressoras 3D, Coladeiras de Borda e Seccionadoras com histórico de manutenção. |
| 🕹️ | **Visualizador 3D & Catálogo** | Configurador paramétrico 3D WebGL (Three.js) de mesas gamer e acessórios 3D com disparo de OP direto para produção. |
| ⚙️ | **Simulador CAM 2.5D/3D** | Pré-visualização 3D de trajetórias de fresamento (Toolpaths), monitor de desgaste de fresas e exportação de G-code (.TAP). |
| 📐 | **Otimizador de Corte 2D** | Plano de corte interativo com cálculo de perda percentual, espessura de lâmina (*kerf*) e respeito aos veios do MDF amadeirado. |
| 💵 | **Orçamentos & Custos** | Engenharia paramétrica de custos com alerta de margem de sobrevivência (< 25%) e suporte a ditar orçamentos por voz. |
| 🗄️ | **Projetos & Ambientes** | Versionamento de projetos, checklist de cômodos, cálculo de risco e fotos técnicas. |
| 📦 | **Estoque & Materiais** | Controle de chapas MDF (6mm a 25mm), filamentos 3D (PLA/PETG/ABS/TPU) e ferragens com alerta de estoque crítico. |
| 💳 | **Gestão Financeira** | Contas a pagar/receber vinculadas aos centros de custo (Marcenaria, CNC, Impressão 3D e Geral). |
| 📱 | **Medição Técnica PWA** | Checklist offline para celular/tablet com conferência a laser (prumo, esquadro, pontos elétricos/hidráulicos) e sincronização automática. |
| 🌐 | **Portal do Cliente** | Interface de transparência para o cliente acompanhar o progresso fotográfico da fabricação do seu móvel em tempo real. |
| 🧠 | **Laboratório de IA** | Descoberta automática de modelos locais, benchmarks de velocidade e latência e testes de visão computacional. |
| 🛡️ | **Auditoria & LGPD** | Trilha imutável de eventos gravada no SQLite com controle de acesso por papéis (*RBAC*). |

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** v20 ou superior (recomendado Node v24+)
- **NPM** v10+
- **LM Studio** instalado com o modelo `google/gemma-4-12b-qat` carregado na memória GPU.

### 1. Clonar o Repositório e Instalar Dependências
```bash
git clone https://github.com/Adriano-Lengruber/WoodBit.git
cd WoodBit
npm install
```

### 2. Configurar o Ambiente Local
Crie o arquivo `.env` a partir do modelo:
```bash
cp .env.example .env
```
O arquivo `.env` já vem pré-parametrizado para execução local:
```env
PORT=3000
GEMINI_API_KEY= # Opcional: apenas se desejar fallback em nuvem
OLLAMA_BASE_URL=http://localhost:11434
LM_STUDIO_BASE_URL=http://localhost:1234
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Abra no seu navegador: 👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🤖 Guia Rápido da IA Local (LM Studio + Gemma 4 12B QAT)

1. Abra o **LM Studio** e baixe o modelo: `google/gemma-4-12b-qat`.
2. Na aba de servidor local (`<->`), selecione o modelo e ligue o servidor na porta padrão: `http://localhost:1234`.
3. Ajuste o **GPU Offload** para `Max` e o **Context Length** para `8192` (ou `16384`).
4. Abra o WoodBit ERP na aba **IA & Operações**: o status exibirá **Online** automaticamente.

---

## 📚 Documentação Adicional

Acesse a suíte completa de documentação na pasta [`docs/`](docs/):
- 🎯 [**`docs/PRODUCT_OVERVIEW.md`**](docs/PRODUCT_OVERVIEW.md) — Apresentação Comercial, ROI e Proposta de Valor.
- 🏛️ [**`docs/ARCHITECTURE.md`**](docs/ARCHITECTURE.md) — Arquitetura Técnica, Decisões de Engenharia e LGPD.
- 🛠️ [**`docs/LOCAL_AI_SETUP.md`**](docs/LOCAL_AI_SETUP.md) — Manual Técnico de Parametrização do LM Studio.

---

## 📄 Licença
Propriedade de WoodBit Organic Tech — Todos os direitos reservados.
Desenvolvido com foco na indústria de marcenaria e fabricação digital regional e global.
